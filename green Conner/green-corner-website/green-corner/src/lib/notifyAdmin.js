import { supabase, isSupabaseConfigured } from "./supabaseClient";

/**
 * Ask the server to send a Web Push to subscribed admin devices.
 * Safe to call from the public site after a successful insert.
 * Failures are ignored so a notify outage never blocks the customer.
 */
export async function requestBackgroundPush(payload) {
  const body = JSON.stringify(payload || {});

  try {
    await fetch("/.netlify/functions/push-notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body
    });
  } catch {
    // Local Vite without the function, or the tab went offline.
  }

  if (!isSupabaseConfigured) return;

  try {
    await supabase.functions.invoke("push-notify", { body: payload });
  } catch {
    // Edge Function is optional. Netlify is the primary sender.
  }
}
