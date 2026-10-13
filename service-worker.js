/* izypays PWA app-shell cache. Never cache authentication, Supabase, or payment responses. */
const IZY_CACHE = 'izypays-app-shell-v1';
const IZY_SHELL = [
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(IZY_CACHE)
      .then(cache => cache.addAll(IZY_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(key => key.startsWith('izypays-') && key !== IZY_CACHE)
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  // Never intercept cross-origin traffic such as Supabase, Paystack, or CDN assets.
  if (url.origin !== self.location.origin) return;

  const isShellFile = IZY_SHELL.some(path => new URL(path, self.location.href).pathname === url.pathname);
  if (!isShellFile && request.mode !== 'navigate') return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).then(response => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(IZY_CACHE).then(cache => cache.put('./index.html', copy));
        }
        return response;
      }).catch(() => caches.match('./index.html'))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => cached || fetch(request).then(response => {
      if (response && response.ok) {
        const copy = response.clone();
        caches.open(IZY_CACHE).then(cache => cache.put(request, copy));
      }
      return response;
    }))
  );
});
