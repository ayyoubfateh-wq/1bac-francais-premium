/* Service worker — app shell en cache, stale-while-revalidate.
   Les appels /api/ (validation premium) ne sont jamais interceptés. */
var CACHE = 'pf1bac-v5';
var SHELL = [
  './',
  './index.html',
  './assets/css/style.css',
  './assets/css/gamification.css',
  './assets/js/app.js',
  './assets/js/questions-extra.js',
  './assets/js/gamification.js',
  './assets/js/production.js',
  './manifest.webmanifest'
];

self.addEventListener('install', function(e){
  e.waitUntil(
    caches.open(CACHE).then(function(c){ return c.addAll(SHELL); }).then(function(){ return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.filter(function(k){ return k !== CACHE; }).map(function(k){ return caches.delete(k); }));
    }).then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(e){
  var url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  if (url.origin !== self.location.origin) return;
  if (url.pathname.indexOf('/api/') !== -1 || url.pathname.indexOf('/.netlify/') !== -1) return;

  e.respondWith(
    caches.open(CACHE).then(function(cache){
      return cache.match(e.request).then(function(cached){
        var fetched = fetch(e.request).then(function(res){
          if (res && res.status === 200) cache.put(e.request, res.clone());
          return res;
        }).catch(function(){ return cached; });
        return cached || fetched;
      });
    })
  );
});
