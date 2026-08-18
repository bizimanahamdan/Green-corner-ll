import { useEffect, useState } from "react";
import { useAuth } from "../lib/AuthContext";
import {
  getNotificationPermission,
  isSoundEnabled,
  notificationSupport,
  playNotificationChime,
  requestNotificationPermission,
  setSoundEnabled,
  showSystemNotification
} from "../lib/notifications";
import {
  disableBackgroundPush,
  enableBackgroundPush,
  getExistingSubscription,
  getVapidPublicKey,
  isBackgroundPushEnabled,
  pushSupport
} from "../lib/push";

export default function AdminSettings() {
  const { session } = useAuth();
  const [permission, setPermission] = useState(getNotificationPermission());
  const [sound, setSound] = useState(isSoundEnabled());
  const [pushOn, setPushOn] = useState(isBackgroundPushEnabled());
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");

  useEffect(() => {
    setPermission(getNotificationPermission());
    getExistingSubscription().then((sub) => {
      if (sub) setPushOn(true);
    });
  }, []);

  const enableInTab = async () => {
    const result = await requestNotificationPermission();
    setPermission(result);
    if (result === "granted") {
      showSystemNotification("Notifications on", "You will see an alert when this tab is open.");
      setNote("In-tab alerts are on for this browser.");
    } else if (result === "denied") {
      setNote("Permission was blocked. Allow notifications in the browser site settings, then try again.");
    } else {
      setNote("This browser does not support notifications.");
    }
  };

  const enablePush = async () => {
    setBusy(true);
    setNote("");
    const result = await enableBackgroundPush(session?.user?.id);
    setBusy(false);
    setPermission(getNotificationPermission());
    if (result.ok) {
      setPushOn(true);
      setNote("Background push is on for this device. Keep this site's notification permission allowed. On iPhone, add the site to your Home Screen first.");
    } else if (result.reason === "missing-vapid") {
      setNote("Add VITE_VAPID_PUBLIC_KEY to the site env, and VAPID_PRIVATE_KEY plus SUPABASE_SERVICE_ROLE_KEY to the server env, then redeploy.");
    } else if (result.reason === "denied") {
      setNote("The browser blocked notifications. Open the site settings and allow them.");
    } else if (result.reason === "unsupported") {
      setNote("This browser cannot receive Web Push. Use Chrome, Firefox, Edge, or an installed Safari/iOS Home Screen app.");
    } else if (result.reason === "save-failed") {
      setNote(result.message || "Could not save this device. Run supabase/007_push_notifications.sql in Supabase, then try again.");
    } else if (result.reason === "no-supabase") {
      setNote("Connect Supabase before enabling background push.");
    } else {
      setNote("Could not enable background push on this device.");
    }
  };

  const disablePush = async () => {
    setBusy(true);
    await disableBackgroundPush();
    setBusy(false);
    setPushOn(false);
    setNote("Background push is off on this device. In-tab alerts still work while the dashboard is open.");
  };

  const toggleSound = () => {
    const next = !sound;
    setSound(next);
    setSoundEnabled(next);
    if (next) playNotificationChime();
  };

  const testInTab = () => {
    const shown = showSystemNotification(
      "Test notification",
      "This one only appears while the admin tab is open."
    );
    if (sound) playNotificationChime();
    setNote(shown ? "In-tab test sent." : "Enable notification permission first.");
  };

  const testPush = async () => {
    setBusy(true);
    setNote("");
    try {
      const res = await fetch("/.netlify/functions/push-notify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: session?.access_token ? `Bearer ${session.access_token}` : ""
        },
        body: JSON.stringify({ type: "test" })
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.ok) {
        setNote(
          json.sent
            ? `Background test sent to ${json.sent} device${json.sent === 1 ? "" : "s"}. Close this tab and you should still see it.`
            : "No devices are subscribed yet. Enable background alerts first."
        );
      } else {
        setNote(json.error || "The push server is not configured. Add VAPID_PRIVATE_KEY and SUPABASE_SERVICE_ROLE_KEY, then redeploy.");
      }
    } catch {
      setNote("Could not reach the push function. Deploy to Netlify, or keep the local dev server running.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-2xl font-semibold mb-2">Notifications</h1>
      <p className="text-sm text-cream/55 mb-6">
        In-tab alerts fire while this dashboard is open. Background push uses a service worker and
        reaches this phone even after you close the tab. That is real Web Push — not a fake banner.
      </p>

      <div className="admin-card p-6 space-y-6">
        <div>
          <p className="text-sm text-cream/60">Browser permission</p>
          <p className="font-medium mt-1 capitalize">{permission}</p>
          {permission !== "granted" && (
            <button onClick={enableInTab} className="btn-primary mt-3">
              Allow alerts
            </button>
          )}
        </div>

        <div>
          <p className="font-medium">Background push</p>
          <p className="text-sm text-cream/50 mt-1">
            Instant alert when a customer places an order or sends a message, even if this tab is closed.
          </p>
          {!pushSupport() && (
            <p className="text-sm text-ember-400 mt-2">This browser does not support Web Push.</p>
          )}
          {!getVapidPublicKey() && (
            <p className="text-sm text-ember-400 mt-2">
              VITE_VAPID_PUBLIC_KEY is not set, so this device cannot subscribe yet.
            </p>
          )}
          <div className="flex flex-wrap gap-2 mt-3">
            {!pushOn ? (
              <button onClick={enablePush} disabled={busy} className="btn-primary">
                {busy ? "Enabling…" : "Enable on this device"}
              </button>
            ) : (
              <button onClick={disablePush} disabled={busy} className="admin-btn-outline">
                {busy ? "Saving…" : "Disable on this device"}
              </button>
            )}
          </div>
          {pushOn && <p className="text-sm text-corner-200 mt-2">This device is subscribed.</p>}
        </div>

        <label className="flex items-center justify-between gap-4">
          <span>
            <span className="block font-medium">Sound while the tab is open</span>
            <span className="block text-sm text-cream/50">A short chime with each live request. Optional.</span>
          </span>
          <input type="checkbox" checked={sound} onChange={toggleSound} />
        </label>

        <div className="flex flex-col sm:flex-row gap-2">
          <button onClick={testInTab} className="admin-btn-outline">Test in-tab alert</button>
          <button onClick={testPush} disabled={busy || !pushOn} className="admin-btn-outline">
            Test background push
          </button>
        </div>

        {note && <p className="text-sm text-cream/70">{note}</p>}
        {!notificationSupport() && (
          <p className="text-sm text-ember-400">This browser does not support the Notification API.</p>
        )}
      </div>
    </div>
  );
}
