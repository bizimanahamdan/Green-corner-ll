const PERMISSION_KEY = "green-corner-notify-asked";
const SOUND_KEY = "green-corner-notify-sound";
const SEEN_KEY = "green-corner-notify-seen";

export function notificationSupport() {
  return typeof window !== "undefined" && "Notification" in window;
}

export function getNotificationPermission() {
  if (!notificationSupport()) return "unsupported";
  return Notification.permission;
}

export async function requestNotificationPermission() {
  if (!notificationSupport()) return "unsupported";
  if (Notification.permission !== "default") return Notification.permission;
  try {
    const result = await Notification.requestPermission();
    localStorage.setItem(PERMISSION_KEY, "1");
    return result;
  } catch {
    return "denied";
  }
}

export function hasAskedForNotifications() {
  return localStorage.getItem(PERMISSION_KEY) === "1";
}

export function isSoundEnabled() {
  const stored = localStorage.getItem(SOUND_KEY);
  return stored === null ? true : stored === "1";
}

export function setSoundEnabled(enabled) {
  localStorage.setItem(SOUND_KEY, enabled ? "1" : "0");
}

function seenIds() {
  try {
    return new Set(JSON.parse(localStorage.getItem(SEEN_KEY) || "[]"));
  } catch {
    return new Set();
  }
}

function rememberSeen(id) {
  const next = seenIds();
  next.add(id);
  const trimmed = [...next].slice(-80);
  localStorage.setItem(SEEN_KEY, JSON.stringify(trimmed));
}

export function hasSeenNotification(id) {
  return seenIds().has(id);
}

export function playNotificationChime() {
  if (!isSoundEnabled()) return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.setValueAtTime(1175, now + 0.11);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.07, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.4);
    osc.onended = () => ctx.close().catch(() => {});
  } catch {
    // Autoplay can be blocked. Notifications must still work without audio.
  }
}

/**
 * In-tab browser notification. This is not background push.
 * Closed-tab alerts go through the service worker in public/sw.js.
 */
export function showSystemNotification(title, body, { url, tag, id } = {}) {
  if (id && hasSeenNotification(id)) return false;
  if (id) rememberSeen(id);

  if (!notificationSupport() || Notification.permission !== "granted") {
    return false;
  }

  try {
    const notification = new Notification(title, {
      body,
      icon: "/images/mark.svg",
      badge: "/images/mark.svg",
      tag: tag || id || title,
      lang: "en"
    });
    notification.onclick = () => {
      window.focus();
      if (url) {
        window.location.assign(url);
      }
      notification.close();
    };
    return true;
  } catch {
    return false;
  }
}

export function notifyAdminEvent({ id, title, body, url, tag, playSound = true }) {
  if (id && hasSeenNotification(id)) return;
  showSystemNotification(title, body, { url, tag, id });
  if (playSound) playNotificationChime();
}
