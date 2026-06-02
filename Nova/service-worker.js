const CACHE_NAME = 'nova-v1';
const urls = ['/', '/index.html', '/offline.html', '/manifest.json', '/css/main.css', '/css/animations.css', '/css/responsive.css'];

self.addEventListener('install', e => {
    e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(urls)));
    self.skipWaiting();
});

self.addEventListener('fetch', e => {
    e.respondWith(
        fetch(e.request).catch(() => caches.match(e.request).then(r => r || caches.match('/offline.html')))
    );
});
