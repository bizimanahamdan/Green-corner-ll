import { supabase, isSupabaseConfigured } from "./supabaseClient";

const PUSH_FLAG = "green-corner-push-on";

export function getVapidPublicKey() {
  return import.meta.env.VITE_VAPID_PUBLIC_KEY || "";
}

export function pushSupport() {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

export function isBackgroundPushEnabled() {
  return localStorage.getItem(PUSH_FLAG) === "1";
}

export function setBackgroundPushEnabled(on) {
  localStorage.setItem(PUSH_FLAG, on ? "1" : "0");
  window.dispatchEvent(new CustomEvent("green-corner:push", { detail: { on } }));
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i += 1) output[i] = raw.charCodeAt(i);
  return output;
}

export async function registerPushWorker() {
  if (!pushSupport()) return null;
  return navigator.serviceWorker.register("/sw.js", { scope: "/" });
}

export async function getExistingSubscription() {
  if (!pushSupport()) return null;
  const reg = await navigator.serviceWorker.ready;
  return reg.pushManager.getSubscription();
}

export async function enableBackgroundPush(userId) {
  if (!pushSupport()) {
    return { ok: false, reason: "unsupported" };
  }
  if (!getVapidPublicKey()) {
    return { ok: false, reason: "missing-vapid" };
  }
  if (!isSupabaseConfigured) {
    return { ok: false, reason: "no-supabase" };
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    return { ok: false, reason: permission === "denied" ? "denied" : "permission" };
  }

  await registerPushWorker();
  const registration = await navigator.serviceWorker.ready;
  let subscription = await registration.pushManager.getSubscription();
  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(getVapidPublicKey())
    });
  }

  const json = subscription.toJSON();
  const endpoint = json.endpoint;
  const p256dh = json.keys?.p256dh;
  const auth = json.keys?.auth;
  if (!endpoint || !p256dh || !auth) {
    return { ok: false, reason: "subscribe-failed" };
  }

  const row = {
    endpoint,
    p256dh,
    auth,
    user_id: userId || null,
    user_agent: navigator.userAgent.slice(0, 180)
  };

  const { error } = await supabase.from("push_subscriptions").upsert(row, { onConflict: "endpoint" });
  if (error) {
    return { ok: false, reason: "save-failed", message: error.message };
  }

  setBackgroundPushEnabled(true);
  return { ok: true, subscription };
}

export async function disableBackgroundPush() {
  try {
    const subscription = await getExistingSubscription();
    if (subscription) {
      if (isSupabaseConfigured) {
        await supabase.from("push_subscriptions").delete().eq("endpoint", subscription.endpoint);
      }
      await subscription.unsubscribe();
    }
  } catch {
    // Still clear the local flag so the UI is honest.
  }
  setBackgroundPushEnabled(false);
  return { ok: true };
}

export async function refreshBackgroundPush(userId) {
  if (!isBackgroundPushEnabled() || Notification.permission !== "granted") return;
  try {
    await enableBackgroundPush(userId);
  } catch {
    // Keep going — in-tab alerts still work.
  }
}
