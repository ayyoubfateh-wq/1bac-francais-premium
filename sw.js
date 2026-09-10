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
  './assets/data/avis.js?v=__PF_BUILD__',
  './assets/js/app.js?v=__PF_BUILD__',
  './assets/js/gamification.js?v=__PF_BUILD__',
  './assets/js/production.js?v=__PF_BUILD__',
  './assets/js/annales.js?v=__PF_BUILD__',
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

  /* Navigation : réseau d'abord, cache seulement hors-ligne.
     ATTENTION : le site contient AUSSI des pages publiques (/antigone,
     /la-boite-a-merveilles…). Chacune doit être mise en cache SOUS SA
     PROPRE URL — sinon la dernière page visitée écrase la coque de
     l'application, et l'élève hors connexion ouvre une fiche de révision
     au lieu de son parcours. */
  if (e.request.mode === 'navigate') {
    var estApp = url.pathname === '/' || url.pathname === '/index.html';
    var cle = estApp ? './index.html' : url.pathname;
    e.respondWith(
      fetch(e.request).then(function(res){
        if (res && res.status === 200) {
          var copie = res.clone();
          caches.open(CACHE).then(function(c){ c.put(cle, copie); });
        }
        return res;
      }).catch(function(){
        return caches.match(cle, { ignoreSearch: true }).then(function(r){
          /* une page publique jamais visitée hors connexion : on renvoie
             l'application, qui elle fonctionne sans réseau */
          return r || caches.match('./index.html', { ignoreSearch: true });
        });
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
