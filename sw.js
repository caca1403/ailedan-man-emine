const CACHE_NAME = 'empaz-cache-v2';
const urlsToCache = [
  './',
  './index.html',
  './css/indexcss.css',
  './js/indexscript.js',
  './images/favicon/favicon-96x96.png',
  './images/favicon/web-app-manifest-192x192.png',
  './images/favicon/web-app-manifest-512x512.png'
];

// Service Worker Install
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache açıldı');
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.log('Cache hatası:', err);
      })
  );
  self.skipWaiting();
});

// Service Worker Activate
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Eski cache siliniyor:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event - Network first, then cache
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Başarılı yanıtı cache'e kaydet
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseClone);
            });
        }
        return response;
      })
      .catch(() => {
        // Network yoksa cache'den getir
        return caches.match(event.request);
      })
  );
});
