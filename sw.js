const CACHE_NAME = 'calculadora-boi-v16';
const urlsToCache = [
    '/',
    '/index.html',
    '/xlsx.bundle.js',
    '/qr.bundle.js',
    '/manifest.json',
    '/favicon-32.png',
    '/apple-touch-icon.png'
];

// Guarda um arquivo por vez: se um falhar, os outros continuam guardados.
// (Com addAll, um erro sozinho deixava o app inteiro SEM cache nenhum — e era
// por isso que a planilha às vezes não saía: a biblioteca não estava lá.)
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache =>
            Promise.all(urlsToCache.map(u =>
                fetch(u, { cache: 'reload' })
                    .then(r => (r && r.ok) ? cache.put(u, r) : null)
                    .catch(() => null)
            ))
        ).catch(() => {})
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

// Cache primeiro: no curral o app abre NA HORA, mesmo com uma barra de sinal.
// A versão nova é baixada por trás e entra na próxima vez que abrir.
self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;

    const buscarRede = () =>
        fetch(event.request).then(resposta => {
            // Só guarda resposta BOA. Sem isso, um erro 500 ou a tela de login
            // do wi-fi da fazenda substituía o app inteiro dentro do cache.
            if (resposta && resposta.ok && resposta.type === 'basic') {
                const copia = resposta.clone();
                caches.open(CACHE_NAME).then(cache => cache.put(event.request, copia));
            }
            return resposta;
        });

    event.respondWith(
        caches.match(event.request).then(guardado => {
            if (guardado) {
                buscarRede().catch(() => {});   // atualiza por trás, sem segurar a tela
                return guardado;
            }
            return buscarRede().catch(() =>
                // Só a navegação cai pro app. Um arquivo que faltou NÃO pode
                // receber a página HTML no lugar — era isso que quebrava o
                // xlsx.bundle.js e derrubava a exportação da planilha.
                event.request.mode === 'navigate'
                    ? caches.match('/index.html')
                    : Response.error()
            );
        })
    );
});
