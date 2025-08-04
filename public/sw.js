// Service Worker for FractionaX - Performance Optimization
const CACHE_NAME = 'fractionax-v1.0.0';
const STATIC_CACHE = 'fractionax-static-v1.0.0';

// Critical resources to cache immediately
const CRITICAL_RESOURCES = [
  '/',
  '/src/main.jsx',
  '/assets/images/MainLogo1.webp',
  '/favicon1.svg'
];

// Install event - cache critical resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Caching critical resources');
        return cache.addAll(CRITICAL_RESOURCES);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - implement caching strategy
self.addEventListener('fetch', event => {
  const { request } = event;
  const { url, method } = request;

  // Only handle GET requests
  if (method !== 'GET') return;

  // Skip external URLs and API calls
  if (!url.startsWith(self.location.origin) || url.includes('/api/')) {
    return;
  }

  // Network first for HTML documents
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => cache.put(request, responseClone));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Cache first for static assets
  if (request.url.includes('/assets/') || 
      request.url.includes('.js') || 
      request.url.includes('.css') ||
      request.url.includes('.webp') ||
      request.url.includes('.svg')) {
    event.respondWith(
      caches.match(request)
        .then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return fetch(request)
            .then(response => {
              const responseClone = response.clone();
              caches.open(STATIC_CACHE)
                .then(cache => cache.put(request, responseClone));
              return response;
            });
        })
    );
    return;
  }

  // Default: network first, fallback to cache
  event.respondWith(
    fetch(request)
      .catch(() => caches.match(request))
  );
});

// Handle messages from main thread
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
