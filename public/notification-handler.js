// Handle push notifications
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event);

  if (!event.data) {
    console.log('Push event received but no data');
    return;
  }

  let notificationData = {};

  try {
    notificationData = event.data.json();
  } catch (error) {
    notificationData = {
      title: 'Ramazon Taqvimi',
      body: event.data.text(),
    };
  }

  const {
    title = 'Ramazon Taqvimi',
    body = 'Bildirishnoma',
    icon = '/icon-192x192.png',
    badge = '/icon-192x192.png',
    tag = 'taqvim-notification',
    requireInteraction = true,
  } = notificationData;

  const options = {
    body,
    icon,
    badge,
    tag,
    requireInteraction,
    vibrate: [200, 100, 200],
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event.notification);
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(
      (clientList) => {
        // Check if app window is already open
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        // If not open, open the app
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      }
    )
  );
});

// Handle notification close
self.addEventListener('notificationclose', (event) => {
  console.log('Notification closed:', event.notification);
});

// Handle foreground push notifications
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
