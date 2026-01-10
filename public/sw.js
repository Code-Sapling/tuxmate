// TuxMate Service Worker
// caches the app for offline use - network-first so you always get fresh styles

const CACHE_NAME = 'tuxmate-v2';

// install: skip waiting so updates apply immediately
self.addEventListener('install', () => {
    self.skipWaiting();
});

// activate: clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        }).then(() => {
            return self.clients.claim();
        })
    );
});

// fetch: network-first with cache fallback (for offline support)
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    const url = new URL(event.request.url);
    if (!url.protocol.startsWith('http')) return;
    if (url.origin !== self.location.origin) return;

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // got fresh response, cache it for offline
                if (response && response.status === 200 && response.type === 'basic') {
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return response;
            })
            .catch(() => {
                // network failed, try cache (offline mode)
                return caches.match(event.request);
            })
    );
});
