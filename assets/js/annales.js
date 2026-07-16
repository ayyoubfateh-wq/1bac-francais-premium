/* ============================================================================
   ANNALES CORRIGÉES — moteur d'affichage
   Lit window.PF_DATA.annales (injecté avec le contenu membre) et rend la
   section dans #gAnnales (écran Sujets régionaux) : filtres par œuvre,
   liste des sujets, vue détaillée avec correction dépliable par question.
   Étiquetage honnête : « Sujet d'entraînement — format officiel » vs
   « Examen réel » (réservé aux sujets certifiés).
============================================================================ */
(function () {
  'use strict';

  var LIVRES = {
    boite: { nom: 'La Boîte à Merveilles', icone: '📦', couleur: '#1a6b5a' },
    antigone: { nom: 'Antigone', icone: '🏛️', couleur: '#4a3070' },
    condamne: { nom: 'Le Dernier Jour d’un Condamné', icone: '⛓️', couleur: '#b5432a' }
  };

  var filtreLivre = 'tous';
  var ouvertId = null;

  function annales() {
    return (window.PF_DATA && window.PF_DATA.annales) || [];
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/</g, '&lt;');
  }
  function nl2p(s) {
    return esc(s).split('\n').map(function (l) { return '<p>' + l + '</p>'; }).join('');
  }
  function badgeType(a) {
    return a.type === 'reel'
      ? '<span class="an-badge an-reel">Examen réel · ' + esc(a.academieStyle) + ' ' + esc(a.annee) + '</span>'
      : '<span class="an-badge an-ent">Entraînement · format officiel · niveau ' + esc(a.academieStyle) + '</span>';
  }

  function rendreListe(wrap) {
    var liste = annales().filter(function (a) { return filtreLivre === 'tous' || a.book === filtreLivre; });
    var chips = '<div class="an-filtres">' +
      ['tous', 'boite', 'antigone', 'condamne'].map(function (k) {
        var lbl = k === 'tous' ? 'Toutes les œuvres' : LIVRES[k].icone + ' ' + LIVRES[k].nom;
        return '<button class="an-chip' + (filtreLivre === k ? ' actif' : '') + '" onclick="gAnnalesFiltre(\'' + k + '\')">' + lbl + '</button>';
      }).join('') + '</div>';

    var cartes = liste.map(function (a) {
      var L = LIVRES[a.book];
      return '<button class="an-carte" style="--an-c:' + L.couleur + ';" onclick="gAnnalesOuvre(\'' + a.id + '\')">' +
        badgeType(a) +
        '<b>' + L.icone + ' ' + esc(a.titre) + '</b>' +
        '<span class="an-oeuvre">' + esc(a.oeuvre) + '</span>' +
        '<span class="an-meta">⏱ ' + esc(a.duree) + ' · Étude de texte /10 + Production /10 · ' + a.etude.length + ' questions corrigées</span>' +
        '<span class="an-cta">OUVRIR LE SUJET →</span>' +
        '</button>';
    }).join('');

    wrap.innerHTML =
      '<div class="eyebrow" style="margin-top:.5rem;">Annales corrigées — la correction détaillée de chaque question</div>' +
      '<div class="heading" style="font-size:22px;">📚 Sujets complets corrigés</div>' +
      '<div class="citation-box"><p><strong>Chaque question porte sa correction de correcteur</strong> : méthode, réponse attendue, citation utile et piège à éviter. Travaille le sujet SANS regarder, puis compare — c’est l’entraînement le plus proche du jour J.</p><cite>— Format officiel : Étude de texte (10 pts) · Production écrite (10 pts)</cite></div>' +
      chips +
      '<div class="an-grille">' + (cartes || '<p class="an-vide">Aucun sujet pour ce filtre.</p>') + '</div>';
  }

  function rendreSujet(wrap, a) {
    var L = LIVRES[a.book];
    var questions = a.etude.map(function (q, i) {
      return '<div class="an-q">' +
        '<div class="an-q-tete"><span class="an-q-num">Question ' + (i + 1) + '</span><span class="an-q-pts">' + q.pts + ' pt' + (q.pts > 1 ? 's' : '') + '</span></div>' +
        '<p class="an-q-enonce">' + esc(q.q) + '</p>' +
        '<button class="an-volet" onclick="gAnnalesVolet(this)">✦ Voir la correction détaillée</button>' +
        '<div class="an-correction" style="display:none;">' + nl2p(q.correction) + '</div>' +
        '</div>';
    }).join('');

    wrap.innerHTML =
      '<button class="an-retour" onclick="gAnnalesOuvre(null)">← Tous les sujets</button>' +
      '<div class="an-sujet-tete" style="--an-c:' + L.couleur + ';">' +
        badgeType(a) +
        '<h3>' + L.icone + ' ' + esc(a.titre) + '</h3>' +
        '<p>' + esc(a.oeuvre) + ' · ⏱ ' + esc(a.duree) + ' · /20</p>' +
      '</div>' +
      '<div class="an-support">' +
        '<div class="an-support-titre">📜 Support</div>' +
        '<p class="an-ref">' + esc(a.extraitRef) + '</p>' +
        '<p>' + esc(a.situation) + '</p>' +
        (a.citation ? '<blockquote class="an-citation">' + esc(a.citation) + '</blockquote>' : '') +
      '</div>' +
      '<div class="an-section">I. ÉTUDE DE TEXTE — (10 points)</div>' +
      questions +
      '<div class="an-section">II. PRODUCTION ÉCRITE — (10 points)</div>' +
      '<div class="an-q">' +
        '<p class="an-q-enonce">' + esc(a.production.sujet) + '</p>' +
        '<button class="an-volet" onclick="gAnnalesVolet(this)">✦ Voir le corrigé détaillé (plan + conseils du correcteur)</button>' +
        '<div class="an-correction" style="display:none;">' + nl2p(a.production.correction) + '</div>' +
      '</div>' +
      (a.conseils ? '<div class="an-conseils">💡 <strong>Conseil de préparation :</strong> ' + esc(a.conseils) + '</div>' : '');
  }

  function rendre() {
    var wrap = document.getElementById('gAnnales');
    if (!wrap) return;
    var liste = annales();
    if (!liste.length) {
      wrap.innerHTML =
        '<div class="eyebrow" style="margin-top:.5rem;">Annales corrigées</div>' +
        '<div class="heading" style="font-size:22px;">📚 Sujets complets corrigés</div>' +
        '<p class="an-vide">Les sujets d’examen corrigés question par question se chargent avec ton accès membre.</p>';
      return;
    }
    var courant = ouvertId ? liste.find(function (a) { return a.id === ouvertId; }) : null;
    if (courant) rendreSujet(wrap, courant);
    else rendreListe(wrap);
  }

  /* ---- API globale ---- */
  window.gAnnalesRefresh = rendre;
  window.gAnnalesFiltre = function (k) { filtreLivre = k; ouvertId = null; rendre(); };
  window.gAnnalesOuvre = function (id) {
    ouvertId = id;
    rendre();
    var wrap = document.getElementById('gAnnales');
    if (wrap && wrap.scrollIntoView && id) wrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  window.gAnnalesVolet = function (btn) {
    var box = btn.nextElementSibling;
    if (!box) return;
    var ouvert = box.style.display !== 'none';
    box.style.display = ouvert ? 'none' : 'block';
    btn.textContent = ouvert ? '✦ Voir la correction détaillée' : '✦ Masquer la correction';
  };

  document.addEventListener('DOMContentLoaded', rendre);
})();
