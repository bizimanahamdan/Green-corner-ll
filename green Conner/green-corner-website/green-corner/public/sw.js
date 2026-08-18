/* Green Corner admin push worker.
   Handles background Web Push only — it does not cache the site. */

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { title: "The Green Corner", body: event.data ? event.data.text() : "New activity" };
  }

  const title = data.title || "The Green Corner";
  const options = {
    body: data.body || "A customer just sent a request.",
    icon: "/images/mark-bowl.png",
    badge: "/images/mark.svg",
    tag: data.tag || "green-corner",
    renotify: true,
    data: { url: data.url || "/admin" },
    vibrate: [120, 80, 120]
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = (event.notification.data && event.notification.data.url) || "/admin";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if (client.url.includes("/admin") && "focus" in client) {
          client.navigate(target);
          return client.focus();
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(target);
      return undefined;
    })
  );
});
