import { useEffect, useState } from "react";
import {
  getNotificationPermission,
  isSoundEnabled,
  notificationSupport,
  playNotificationChime,
  requestNotificationPermission,
  setSoundEnabled,
  showSystemNotification
} from "../lib/notifications";

export default function AdminSettings() {
  const [permission, setPermission] = useState(getNotificationPermission());
  const [sound, setSound] = useState(isSoundEnabled());
  const [note, setNote] = useState("");

  useEffect(() => {
    setPermission(getNotificationPermission());
  }, []);

  const enable = async () => {
    const result = await requestNotificationPermission();
    setPermission(result);
    if (result === "granted") {
      showSystemNotification("Notifications on", "You'll see an alert here when a new order or message arrives.");
      setNote("Browser notifications are on for this device.");
    } else if (result === "denied") {
      setNote("Permission was blocked. Use the browser site settings to allow notifications.");
    } else if (result === "unsupported") {
      setNote("This browser doesn't support notifications.");
    }
  };

  const toggleSound = () => {
    const next = !sound;
    setSound(next);
    setSoundEnabled(next);
    if (next) playNotificationChime();
  };

  const test = () => {
    const shown = showSystemNotification(
      "Test notification",
      "If you can read this, desktop alerts are working while this tab is open."
    );
    if (sound) playNotificationChime();
    setNote(
      shown
        ? "Test sent. These alerts only fire while the admin is open — they are not background push."
        : "Couldn't show a notification. Enable permission first."
    );
  };

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-2xl font-semibold mb-2">Notifications</h1>
      <p className="text-sm text-cream/55 mb-6">
        Alerts fire in this browser when a new order or inquiry is saved. They are not full background
        push — if this tab is closed, you will not get a phone-style push notification.
      </p>

      <div className="admin-card p-6 space-y-5">
        <div>
          <p className="text-sm text-cream/60">Browser permission</p>
          <p className="font-medium mt-1 capitalize">{permission}</p>
          {permission !== "granted" && (
            <button onClick={enable} className="btn-primary mt-3">
              Enable notifications
            </button>
          )}
        </div>

        <label className="flex items-center justify-between gap-4">
          <span>
            <span className="block font-medium">Notification sound</span>
            <span className="block text-sm text-cream/50">A short chime with each new request. Optional.</span>
          </span>
          <input type="checkbox" checked={sound} onChange={toggleSound} />
        </label>

        <button onClick={test} className="admin-btn-outline">
          Send a test
        </button>

        {note && <p className="text-sm text-cream/60">{note}</p>}
        {!notificationSupport() && (
          <p className="text-sm text-ember-400">This browser does not support the Notification API.</p>
        )}
      </div>
    </div>
  );
}
