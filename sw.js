const CACHE_NAME = 'gmv-catalogo-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/assets/css/style.css',
  '/assets/css/gmv-theme.css',
  '/assets/js/script.js',
  '/assets/icons/favicon.ico',
  '/assets/icons/android-chrome-192x192.png',
  '/assets/icons/android-chrome-512x512.png',
  '/assets/icons/apple-touch-icon.png',
  '/assets/img/placeholder.jpg',
  '/site.webmanifest'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache.filter(u => !u.endsWith('.jpg'))))
  );
  self.skipWaiting();
});

self.addEventListener('fetch', event => {
  // No cachear peticiones al Google Sheet (siempre fresco)
  if (event.request.url.includes('docs.google.com')) {
    return;
  }
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});
