/* Service worker — cohérence de version garantie.
   __PF_BUILD__ est remplacé par l'empreinte du build (tools/build-html.mjs) :
   chaque mise en ligne a SON cache, l'ancien est purgé à l'activation.
   - Navigation (index.html) : RÉSEAU D'ABORD → on ne peut plus rester
     coincé sur une vieille page ; le cache ne sert qu'en mode hors-ligne.
   - Assets (?v=empreinte) : cache d'abord — leur URL change à chaque build,
     donc jamais de mélange ancien/nouveau.
   - /api/ : jamais intercepté. */
var CACHE = 'pf1bac-__PF_BUILD__';
var SHELL = [
  './',
  './index.html',
  './assets/css/style.css?v=__PF_BUILD__',
  './assets/css/gamification.css?v=__PF_BUILD__',
  './assets/data/trial.js?v=__PF_BUILD__',
  './assets/js/app.js?v=__PF_BUILD__',
  './assets/js/gamification.js?v=__PF_BUILD__',
  './assets/js/production.js?v=__PF_BUILD__',
  './assets/js/content-loader.js?v=__PF_BUILD__',
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

  /* la page elle-même : réseau d'abord, cache seulement hors-ligne */
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).then(function(res){
        if (res && res.status === 200) {
          var copie = res.clone();
          caches.open(CACHE).then(function(c){ c.put('./index.html', copie); });
        }
        return res;
      }).catch(function(){
        return caches.match('./index.html', { ignoreSearch: true });
      })
    );
    return;
  }

  /* assets versionnés : cache d'abord (l'URL change à chaque build) */
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
