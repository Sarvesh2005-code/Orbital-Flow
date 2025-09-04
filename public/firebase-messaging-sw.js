// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBwFwma-ltOCnJY-a_iHcE8-N0-3gt4BTw",
  authDomain: "orbital-flow-cp8pz.firebaseapp.com",
  projectId: "orbital-flow-cp8pz",
  storageBucket: "orbital-flow-cp8pz.firebasestorage.app",
  messagingSenderId: "526248072903",
  appId: "1:526248072903:web:4330dcd3430df30ca850e2"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);

  const notificationTitle = payload.notification?.title || 'Orbital Flow';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new notification',
    icon: '/icons/orbital-flow-logo.png',
    badge: '/icons/orbital-flow-logo.png',
    image: payload.notification?.image,
    data: payload.data,
    actions: [
      {
        action: 'view',
        title: 'View'
      },
      {
        action: 'close',
        title: 'Close'
      }
    ],
    requireInteraction: true,
    renotify: true,
    tag: payload.data?.type || 'general'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Notification click received:', event);

  event.notification.close();

  if (event.action === 'view') {
    // Open the app or navigate to specific page
    const urlToOpen = event.notification.data?.url || '/';
    
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        // Check if app is already open
        for (const client of clientList) {
          if (client.url.includes(urlToOpen) && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Open new window/tab
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
    );
  }
});

// Handle notification close
self.addEventListener('notificationclose', (event) => {
  console.log('Notification closed:', event.notification);
});
