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

var SUJETS = [
  { book: 'boite', titre: 'La solitude, une richesse ?',
    sujet: '« La solitude de l’enfance peut devenir une source de richesse intérieure. » Développez ce point de vue dans un texte argumenté d’une quinzaine de lignes, en vous appuyant sur La Boîte à Merveilles et sur votre expérience personnelle.',
    pistes: ['La boîte et les rêveries de Sidi Mohammed', 'Le rôle des récits d’Abdellah', 'Un exemple tiré de votre vécu'] },
  { book: 'boite', titre: 'Le poids des traditions',
    sujet: '« Les traditions occupent une place essentielle dans la société marocaine peinte par Sefrioui. » Discutez cette affirmation en montrant ce que ces traditions apportent et ce qu’elles peuvent imposer.',
    pistes: ['Achoura, le msid, le bain maure', 'La solidarité du voisinage (repas de Rahma)', 'Les croyances : chouafa, saints, amulettes'] },
  { book: 'boite', titre: 'L’imagination contre la réalité',
    sujet: '« L’imagination aide à supporter la réalité. » Qu’en pensez-vous ? Répondez dans un texte argumenté illustré par l’œuvre de Sefrioui et par des exemples personnels.',
    pistes: ['Les objets banals devenus trésors', 'La fuite du réel après la mort du coiffeur', 'Les limites : l’imaginaire isole-t-il ?'] },
  { book: 'antigone', titre: 'Dire non',
    sujet: '« Dire non aux injustices donne un sens à la vie. » Discutez ce point de vue dans un texte argumenté d’une quinzaine de lignes, en vous appuyant sur Antigone de Jean Anouilh.',
    pistes: ['Le refus d’Antigone face à l’édit', 'Le prix du refus : la mort, le doute final', 'Un exemple de refus juste dans l’histoire ou la vie'] },
  { book: 'antigone', titre: 'Le compromis : sagesse ou lâcheté ?',
    sujet: '« Accepter des compromis est-il une preuve de sagesse ou une forme de lâcheté ? » Développez votre réponse en confrontant les positions de Créon et d’Antigone.',
    pistes: ['Le « métier de roi » : dire oui pour gouverner', 'Ismène, la voix de la prudence', 'Où placer la limite entre s’adapter et se trahir ?'] },
  { book: 'antigone', titre: 'Obéir aux adultes ?',
    sujet: '« Les jeunes doivent-ils toujours obéir aux adultes ? » Répondez dans un texte argumenté illustré par la pièce d’Anouilh et par votre expérience.',
    pistes: ['Antigone face à son oncle Créon', 'Quand l’obéissance protège / quand elle étouffe', 'Le dialogue comme troisième voie'] },
  { book: 'condamne', titre: 'La vie, valeur absolue',
    sujet: '« Aucune cause ne justifie qu’on ôte la vie à un être humain. » Discutez cette affirmation dans un texte argumenté d’une quinzaine de lignes, en vous appuyant sur Le Dernier Jour d’un Condamné.',
    pistes: ['L’agonie vécue de l’intérieur (le journal)', 'Marie : la peine frappe aussi les innocents', 'L’argument de la justice qui peut se tromper'] },
  { book: 'condamne', titre: 'Punir sans humilier',
    sujet: '« La justice doit punir sans humilier. » Qu’en pensez-vous ? Développez votre réponse en vous appuyant sur des scènes précises du roman de Victor Hugo.',
    pistes: ['Le ferrage des forçats transformé en spectacle', 'La foule de la place de Grève', 'La dignité du condamné face à la machine'] },
  { book: 'condamne', titre: 'La littérature, une arme',
    sujet: '« La littérature est une arme pour défendre les grandes causes. » Illustrez cette affirmation dans un texte argumenté en montrant comment Victor Hugo met son roman au service d’un combat.',
    pistes: ['L’émotion comme argument (Marie, l’attente)', 'L’anonymat du condamné : un cas universel', 'La préface de 1832 : l’argumentation directe'] }
];

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
  P.history.unshift({ date: new Date().toISOString(), titre: s.titre, book: s.book, note: note, mots: ((d.texte || '').match(/\S+/g) || []).length });
  P.history = P.history.slice(0, 20);
  P.draft = null;
  saveP(P);
  if (typeof window.gGrantProductionXP === 'function') window.gGrantProductionXP(XP_PRODUCTION, note);
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

document.addEventListener('DOMContentLoaded', render);
})();
