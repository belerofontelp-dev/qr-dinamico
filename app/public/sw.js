// Incrementar CACHE_VERSION en cada deploy para invalidar caches antiguos
const CACHE_VERSION = 'v2';
const CACHE_NAME = `qr-dinamico-${CACHE_VERSION}`;

const ASSETS = [
  '/qr-dinamico/',
  '/qr-dinamico/index.html',
  '/qr-dinamico/dashboard',
  '/qr-dinamico/login'
];

self.addEventListener('install', (event) => {
  // Activar inmediatamente el nuevo service worker
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cached) => {
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.ok) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(() => cached);

        // Si hay cache, lo devuelve mientras actualiza en segundo plano;
        // si no hay cache, espera la red.
        return cached || fetchPromise;
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});
