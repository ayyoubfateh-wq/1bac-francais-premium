/* ============================================================================
   CHARGEUR DE CONTENU PREMIUM
   Le site public ne contient que la vitrine + la leçon d'essai. Le contenu
   pédagogique complet (banque, études, sujets, écrans) n'est livré par
   /api/content QU'APRÈS vérification serveur de l'empreinte du code.

   Points d'attention techniques :
   - Les moteurs (app.js, gamification.js, production.js) capturent les
     RÉFÉRENCES de window.PF_DATA.questions/etudes/sujets au chargement :
     l'injection MUTE ces objets en place (jamais de réassignation).
   - Cache localStorage : rechargements instantanés et usage hors-ligne
     pendant une session premium ; rafraîchi en arrière-plan.
============================================================================ */
(function () {
  'use strict';

  var CACHE_KEY = 'pf1bac_content_v1';
  var injected = false;

  function isPremium() {
    return document.documentElement.classList.contains('premium-unlocked');
  }
  function syncKey() {
    try {
      var k = localStorage.getItem('pf1bac_sync_key') || '';
      return /^[a-f0-9]{64}$/.test(k) ? k : '';
    } catch (e) { return ''; }
  }
  function deviceId() {
    return typeof window.pf1bacDeviceId === 'function' ? window.pf1bacDeviceId() : '';
  }

  /* ---------------- injection (mutation en place) ---------------- */
  function inject(data) {
    if (!data || injected) return injected;
    var D = window.PF_DATA;
    if (!D) return false;

    ['boite', 'antigone', 'condamne'].forEach(function (b) {
      if (data.questions && data.questions[b]) {
        if (!D.questions[b]) D.questions[b] = [];
        D.questions[b].length = 0;
        Array.prototype.push.apply(D.questions[b], data.questions[b]);
      }
      if (data.etudes && data.etudes[b]) {
        if (!D.etudes[b]) D.etudes[b] = [];
        D.etudes[b].length = 0;
        Array.prototype.push.apply(D.etudes[b], data.etudes[b]);
      }
    });
    if (data.sujets) {
      D.sujets.length = 0;
      Array.prototype.push.apply(D.sujets, data.sujets);
    }

    /* écrans pédagogiques : remplissage des coquilles */
    if (data.screens) {
      Object.keys(data.screens).forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.innerHTML = data.screens[id];
      });
    }

    injected = true;
    refreshUI();
    return true;
  }

  /* Les compteurs/rendus qui dépendent du contenu se rafraîchissent. */
  function refreshUI() {
    document.querySelectorAll('.quiz-btn').forEach(function (btn) {
      var oc = btn.getAttribute('onclick') || '';
      var m = oc.match(/startQuiz\('(\w+)'\)/);
      var count = btn.querySelector('.qcount');
      if (!m || !count) return;
      if (m[1] === 'mix') { count.textContent = '30 questions · 10 par œuvre'; return; }
      var list = window.PF_DATA.questions[m[1]];
      if (list && list.length) count.textContent = list.length + ' questions · contexte/analyse/langue/réaction';
    });
    if (typeof window.gContentRefresh === 'function') window.gContentRefresh();
    if (typeof window.gProdRefresh === 'function') window.gProdRefresh();
  }

  /* ---------------- cache local ---------------- */
  function readCache() {
    try {
      var raw = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
      return raw && raw.data ? raw : null;
    } catch (e) { return null; }
  }
  function writeCache(version, data) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ version: version, savedAt: Date.now(), data: data }));
    } catch (e) { /* quota : tant pis, on rechargera du réseau */ }
  }
  function dropCache() {
    try { localStorage.removeItem(CACHE_KEY); } catch (e) {}
  }

  /* ---------------- chargement ---------------- */
  var fetching = false;
  window.gLoadPremiumContent = function () {
    if (!isPremium()) return;
    var k = syncKey();
    if (!k) return;

    // 1) cache d'abord : instantané + hors-ligne
    var cached = readCache();
    if (cached) inject(cached.data);

    // 2) réseau : version fraîche (ou premier chargement)
    if (fetching) return;
    fetching = true;
    fetch('/api/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: k, deviceId: deviceId() }),
    }).then(function (r) {
      if (r.status === 403) { dropCache(); return null; }
      return r.json();
    }).then(function (d) {
      if (d && d.ok && d.data) {
        if (!cached || cached.version !== d.version) {
          writeCache(d.version, d.data);
          injected = false; // nouvelle version : réinjecte
        }
        inject(d.data);
      }
    }).catch(function () { /* hors-ligne : le cache a déjà fait le travail */ })
      .finally(function () { fetching = false; });
  };

  document.addEventListener('DOMContentLoaded', function () {
    window.gLoadPremiumContent();
  });
})();
