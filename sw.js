/* D4Driving Service Worker — v1.0 */

/* Bumped to v5 to purge the accumulated `availability.json?t=<timestamp>`
   entries: each page view had been writing a new, never-reused cache entry,
   so long-standing visitors carry hundreds of them. The activate handler
   deletes every cache whose name is not this one, so the bump is what clears it.
   (v4 purged cached Supabase API responses for a similar cache-first fault.) */
const CACHE = 'd4driving-v14';

/* Assets to cache on install */
const PRECACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-touch-icon.png',
  '/robert.webp',
  '/aygo-x.webp',
  '/yaris-cross.webp',
  '/Sonia.webp',
  '/Buddhika.webp',
  '/Sienna.webp',
  'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap'
];

/* Install — cache all core assets */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(PRECACHE))
  );
  self.skipWaiting();
});

/* Activate — remove old caches */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

/* Fetch — network first, fall back to cache */
self.addEventListener('fetch', event => {
  /* Skip non-GET and browser-extension requests */
  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith('http')) return;

  /* Supabase API — never touched by this cache.
     These URLs do not end in .json, so they used to fall through to the
     cache-first rule at the bottom and were served from the very first cached
     response for ever. That is why publishing a route in the admin page did
     not show up on the site.
     Not caching them is also the safer choice: the response depends on the
     Authorization header, so a cached copy could keep serving paid route data
     to someone who has since signed out.
     Returning without respondWith lets the browser fetch normally, which
     honours the `cache: 'no-store'` routes.html already sends. */
  if (event.request.url.includes('.supabase.co/')) return;

  /* For navigation (HTML pages) — network first */
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(event.request, clone));
          return res;
        })
        .catch(() => caches.match('/index.html'))
    );
    return;
  }

  /* JSON data (availability.json, articles.json) — ALWAYS network first so live data never goes stale.
     Test the PATHNAME, not the whole URL: the page requests
     `availability.json?t=<timestamp>`, which does not end in ".json", so a
     full-URL check never matched here. Those requests fell through to the
     cache-first rule below and — because every `?t=` value is a distinct cache
     key — wrote a new, permanently-retained entry on every single page view. */
  if (new URL(event.request.url).pathname.endsWith('.json')) {
    event.respondWith(
      fetch(event.request)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(event.request, clone));
          return res;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  /* For everything else — cache first, then network */
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(res => {
        if (!res || res.status !== 200 || res.type === 'opaque') return res;
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(event.request, clone));
        return res;
      });
    })
  );
});
