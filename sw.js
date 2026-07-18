const CACHE_NAME = 'calculadora-boi-v6';
const urlsToCache = [
    '/',
    '/index.html'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
            .catch(() => {})
    );
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Rede primeiro (com limite de 5s): app sempre atualizado quando tem internet;
// sem internet (ou rede lenta), cai pro cache e funciona offline normal.
self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') {
        return;
    }

    const daRede = fetch(event.request).then(response => {
        if (response && response.status === 200 && response.type === 'basic') {
            const copia = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, copia));
        }
        return response;
    });

    const limite = new Promise((_, rejeita) => setTimeout(() => rejeita(new Error('timeout')), 5000));

    event.respondWith(
        Promise.race([daRede, limite]).catch(() =>
            caches.match(event.request).then(r => r || daRede.catch(() => caches.match('/index.html')))
        )
    );
});
