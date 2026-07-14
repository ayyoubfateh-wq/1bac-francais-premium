/* ============================================================================
   ATELIER DE PRODUCTION ÉCRITE — les 8 points décisifs du régional
   Méthode guidée en 4 étapes : comprendre le sujet → bâtir le plan →
   rédiger → s'auto-évaluer avec la grille officielle du barème.
   Pédagogie : l'élève ne subit pas une page blanche ; chaque étape
   décompose la compétence (étayage progressif / scaffolding).
============================================================================ */
(function(){
'use strict';

var XP_PRODUCTION = 30;
var STORAGE = 'pf1bac_prod_v1';

var SUJETS = (typeof window !== 'undefined' && window.PF_DATA && window.PF_DATA.sujets) ? window.PF_DATA.sujets : [];

/* Grille officielle du barème de la production écrite (8 pts) */
var GRILLE = [
  { label: 'Contenu et idées (3 pts)', max: 3, items: [
    'Mes arguments répondent vraiment au sujet posé',
    'J’ai donné au moins un exemple précis tiré de l’œuvre',
    'J’ai ajouté un exemple personnel ou d’actualité'] },
  { label: 'Organisation (2 pts)', max: 2, items: [
    'Mon texte a une introduction, un développement et une conclusion',
    'Mes idées s’enchaînent avec des connecteurs (d’abord, ensuite, cependant…)'] },
  { label: 'Langue et style (2 pts)', max: 2, items: [
    'Mes phrases sont complètes et variées',
    'J’ai utilisé un vocabulaire précis (pas de répétitions de « chose », « il y a »…)'] },
  { label: 'Orthographe et ponctuation (1 pt)', max: 1, items: [
    'Je me suis relu(e) pour corriger accords, conjugaison et ponctuation'] }
];

var BOOK_LABEL = { boite: '📦 La Boîte à Merveilles', antigone: '🏛️ Antigone', condamne: '⛓️ Le Dernier Jour d’un Condamné' };

function loadP(){
  try { return JSON.parse(localStorage.getItem(STORAGE) || '{}') || {}; } catch(e){ return {}; }
}
function saveP(p){ try { localStorage.setItem(STORAGE, JSON.stringify(p)); } catch(e){} }

var P = loadP();          // { draft: {...}, history: [...] }
P.history = P.history || [];

/* ------------------------------------------------------------- rendu */
function el(id){ return document.getElementById(id); }

function render(){
  var wrap = el('gProd');
  if (!wrap) return;
  var d = P.draft;
  if (!d) renderChoix(wrap);
  else if (d.step === 1) renderComprendre(wrap, d);
  else if (d.step === 2) renderPlan(wrap, d);
  else if (d.step === 3) renderRedaction(wrap, d);
  else renderGrille(wrap, d);
}

function renderChoix(wrap){
  var html = '<div class="g-prod-intro"><p><b>Les 8 points les plus décisifs de l’examen se gagnent ici.</b> Choisis un sujet type régional : l’atelier te guide pas à pas, du plan à l’auto-correction avec la vraie grille du barème.</p></div>';
  ['boite','antigone','condamne'].forEach(function(book){
    html += '<div class="g-prod-book">' + BOOK_LABEL[book] + '</div><div class="g-prod-sujets">';
    SUJETS.forEach(function(s, i){
      if (s.book !== book) return;
      html += '<button class="g-prod-sujet" onclick="gProdStart(' + i + ')"><b>' + s.titre + '</b><span>' + s.sujet.slice(0, 90) + '…</span></button>';
    });
    html += '</div>';
  });
  if (P.history.length) {
    html += '<div class="g-prod-book">🗂️ Mes productions terminées (' + P.history.length + ')</div><div class="g-prod-hist">';
    P.history.slice(0, 8).forEach(function(h){
      html += '<div class="g-prod-hist-row"><span>' + h.date.slice(0, 10).split('-').reverse().join('/') + ' — ' + h.titre + '</span><b>' + h.note + '/8</b></div>';
    });
    html += '</div>';
  }
  wrap.innerHTML = html;
}

function stepHeader(d, n, titre, conseil){
  return '<div class="g-prod-steps">' +
    [1,2,3,4].map(function(s){ return '<span class="g-prod-step' + (s === n ? ' on' : s < n ? ' done' : '') + '">' + s + '</span>'; }).join('<span class="g-prod-lien"></span>') +
    '</div>' +
    '<h3 class="g-prod-titre">' + titre + '</h3>' +
    '<div class="g-prod-sujet-box"><b>Sujet :</b> ' + SUJETS[d.sujet].sujet + '</div>' +
    (conseil ? '<div class="g-prod-conseil">💡 ' + conseil + '</div>' : '');
}

function renderComprendre(wrap, d){
  var s = SUJETS[d.sujet];
  wrap.innerHTML = stepHeader(d, 1, 'Étape 1 — Comprendre le sujet',
    'Souligne mentalement les mots-clés du sujet, identifie la consigne (discuter ? illustrer ? développer ?) et vérifie chaque piste avant de continuer.') +
    '<div class="g-prod-check">' + s.pistes.map(function(p, i){
      return '<label class="g-prod-checkline"><input type="checkbox" data-pi="' + i + '"' + (d.pistes && d.pistes[i] ? ' checked' : '') + '> J’ai réfléchi à : <b>' + p + '</b></label>';
    }).join('') + '</div>' +
    '<button class="g-btn-primary" onclick="gProdNext()">J’AI COMPRIS LE SUJET → BÂTIR MON PLAN</button>' +
    '<button class="g-btn-ghost" onclick="gProdQuit()">Changer de sujet</button>';
}

function renderPlan(wrap, d){
  function zone(id, label, ph, val){
    return '<label class="g-prod-label">' + label + '</label>' +
      '<textarea class="g-prod-ta" id="' + id + '" rows="2" placeholder="' + ph + '">' + (val || '') + '</textarea>';
  }
  wrap.innerHTML = stepHeader(d, 2, 'Étape 2 — Bâtir le plan',
    'Une idée = un argument + UN exemple précis. C’est le plan qui rapporte les 3 points de contenu, pas la longueur.') +
    zone('pThese', 'Ma position (thèse)', 'Ex : Je pense que… parce que…', d.these) +
    zone('pArg1', 'Argument 1 + exemple tiré de l’œuvre', 'Argument… Par exemple, dans l’œuvre…', d.arg1) +
    zone('pArg2', 'Argument 2 + exemple (œuvre, vie, actualité)', 'De plus… Ainsi…', d.arg2) +
    zone('pConcl', 'Ma conclusion (bilan + ouverture)', 'En somme…', d.concl) +
    '<button class="g-btn-primary" onclick="gProdNext()">MON PLAN EST PRÊT → RÉDIGER</button>' +
    '<button class="g-btn-ghost" onclick="gProdBack()">← Revenir au sujet</button>';
}

function renderRedaction(wrap, d){
  wrap.innerHTML = stepHeader(d, 3, 'Étape 3 — Rédiger',
    'Vise 15 à 25 lignes (150-250 mots). Suis ton plan, il est affiché sous la zone. Connecteurs : d’abord, ensuite, cependant, en somme.') +
    '<textarea class="g-prod-ta g-prod-texte" id="pTexte" rows="12" placeholder="Rédige ici ta production…">' + (d.texte || '') + '</textarea>' +
    '<div class="g-prod-compteur" id="pCompteur">0 mot</div>' +
    '<div class="g-prod-rappel"><b>Ton plan :</b> ' +
      [d.these, d.arg1, d.arg2, d.concl].filter(Boolean).map(function(x){ return '• ' + x; }).join('<br>') + '</div>' +
    '<button class="g-btn-primary" onclick="gProdNext()">J’AI TERMINÉ → M’AUTO-CORRIGER</button>' +
    '<button class="g-btn-ghost" onclick="gProdBack()">← Revoir mon plan</button>';
  var ta = el('pTexte');
  var maj = function(){
    var mots = (ta.value.trim().match(/\S+/g) || []).length;
    var c = el('pCompteur');
    c.textContent = mots + ' mot' + (mots > 1 ? 's' : '') + (mots < 120 ? ' — continue, vise au moins 150' : mots > 280 ? ' — pense à resserrer' : ' ✓ bonne longueur');
    c.className = 'g-prod-compteur' + (mots >= 120 && mots <= 280 ? ' ok' : '');
  };
  ta.addEventListener('input', maj); maj();
}

function renderGrille(wrap, d){
  var html = stepHeader(d, 4, 'Étape 4 — Auto-correction avec la grille du barème',
    'Sois honnête : cette grille est celle du correcteur. Chaque case cochée doit être VRAIE dans ton texte.');
  GRILLE.forEach(function(g, gi){
    html += '<div class="g-prod-crit"><b>' + g.label + '</b>' +
      g.items.map(function(it, ii){
        return '<label class="g-prod-checkline"><input type="checkbox" data-g="' + gi + '" data-i="' + ii + '"> ' + it + '</label>';
      }).join('') + '</div>';
  });
  html += '<button class="g-btn-primary" onclick="gProdFinish()">VALIDER MON AUTO-ÉVALUATION</button>' +
    '<button class="g-btn-ghost" onclick="gProdBack()">← Retoucher mon texte</button>';
  wrap.innerHTML = html;
}

/* ------------------------------------------------------------ actions */
window.gProdStart = function(i){
  P.draft = { sujet: i, step: 1, pistes: [] };
  saveP(P); render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
window.gProdQuit = function(){ P.draft = null; saveP(P); render(); };
window.gProdBack = function(){ if (P.draft && P.draft.step > 1) { collect(); P.draft.step--; saveP(P); render(); } };
window.gProdNext = function(){
  var d = P.draft; if (!d) return;
  collect();
  if (d.step === 3 && ((d.texte || '').trim().match(/\S+/g) || []).length < 60) {
    if (typeof window.gToast === 'function') window.gToast('✍️ Encore un effort : au moins 60 mots pour passer à la correction.');
    else alert('Écris au moins 60 mots avant de passer à la correction.');
    return;
  }
  d.step++; saveP(P); render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
function collect(){
  var d = P.draft; if (!d) return;
  if (d.step === 1) {
    d.pistes = Array.from(document.querySelectorAll('#gProd input[data-pi]')).map(function(c){ return c.checked; });
  } else if (d.step === 2) {
    d.these = (el('pThese') || {}).value || d.these;
    d.arg1 = (el('pArg1') || {}).value || d.arg1;
    d.arg2 = (el('pArg2') || {}).value || d.arg2;
    d.concl = (el('pConcl') || {}).value || d.concl;
  } else if (d.step === 3) {
    d.texte = (el('pTexte') || {}).value || d.texte;
  }
}
window.gProdFinish = function(){
  var d = P.draft; if (!d) return;
  var note = 0;
  GRILLE.forEach(function(g, gi){
    var boxes = Array.from(document.querySelectorAll('#gProd input[data-g="' + gi + '"]'));
    var cochees = boxes.filter(function(b){ return b.checked; }).length;
    note += g.max * (boxes.length ? cochees / boxes.length : 0);
  });
  note = Math.round(note * 2) / 2;
  var s = SUJETS[d.sujet];
  P.history.unshift({ date: new Date().toISOString(), titre: s.titre, book: s.book, note: note,
    mots: ((d.texte || '').match(/\S+/g) || []).length,
    sujet: d.sujet, texte: (d.texte || '').slice(0, 3000) });
  P.history = P.history.slice(0, 20);
  P.draft = null;
  saveP(P);
  if (typeof window.gGrantProductionXP === 'function') window.gGrantProductionXP(XP_PRODUCTION, note, d.sujet);
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

/* ------------------------------------- comparaison avec la réponse modèle
   Apprentissage par contraste : l'élève relit SON texte face à un texte
   exemplaire annoté — il voit la structure au lieu de la deviner. */
var MODELE_PARTIES = [
  { key: 'intro', tag: 'Introduction — j’amène le sujet et j’annonce ma position' },
  { key: 'arg1',  tag: 'Argument 1 + exemple précis tiré de l’œuvre' },
  { key: 'arg2',  tag: 'Argument 2 + exemple (œuvre, vie, actualité) — et une nuance' },
  { key: 'concl', tag: 'Conclusion — bilan + ouverture' }
];
window.gProdShowModel = function(i, texteEleve){
  var wrap = el('gProd');
  var s = SUJETS[i];
  if (!wrap || !s || !s.modele) return;
  if (texteEleve === undefined) {
    var h = P.history.filter(function(x){ return x.sujet === i; })[0];
    texteEleve = h ? h.texte : '';
  }
  var html = '<h3 class="g-prod-titre">📖 Réponse modèle — ' + s.titre + '</h3>' +
    '<div class="g-prod-sujet-box"><b>Sujet :</b> ' + s.sujet + '</div>' +
    '<div class="g-prod-conseil">💡 Ne recopie pas ce modèle : observe sa STRUCTURE (étiquettes vertes), puis demande-toi ce qui manque à ton texte.</div>' +
    '<div class="g-prod-modele">' +
      MODELE_PARTIES.map(function(p){
        return '<div class="g-prod-part"><span class="g-prod-tag">' + p.tag + '</span><p>' + s.modele[p.key] + '</p></div>';
      }).join('') +
    '</div>' +
    (texteEleve
      ? '<div class="g-prod-book">✍️ Ton texte, pour comparer</div><div class="g-prod-mien">' + texteEleve.replace(/</g, '&lt;').replace(/\n/g, '<br>') + '</div>'
      : '') +
    '<button class="g-btn-primary" style="background:var(--teal);" onclick="gProdQuit()">RETOUR AUX SUJETS</button>' +
    '<button class="g-btn-ghost" onclick="gProdStart(' + i + ')">Retenter ce sujet</button>';
  wrap.innerHTML = html;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

/* re-rendu après l'injection du contenu premium (content-loader.js) */
window.gProdRefresh = function(){ if (!P.draft) render(); };

document.addEventListener('DOMContentLoaded', render);
})();
