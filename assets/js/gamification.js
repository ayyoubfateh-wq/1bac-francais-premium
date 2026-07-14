/* ============================================================================
   MOTEUR DE GAMIFICATION — Parcours 1BAC Français
   Conception neuroergonomique :
   - Feedback < 100 ms (dopamine) : XP flottant, son, couleur immédiats.
   - Aversion à la perte : streak quotidien + cœurs limités.
   - Ratio variable : bonus "critique" aléatoire (renforcement le plus durable).
   - Gradient d'objectif : anneau quotidien + barre de niveau toujours visibles.
   - Effet Zeigarnik : carte "Continuer" pointant le prochain nœud inachevé.
   - Chunking : leçons de 5 questions, une décision par écran.
   - Boucle d'erreur pédagogique : cœur perdu → révision éclair pour le regagner.
   Module autonome : ne modifie pas app.js, s'accroche aux globales existantes.
============================================================================ */
(function(){
'use strict';

/* ---------------------------------------------------------------- config */
var STORAGE_KEY = 'pf1bac_game_v1';
var XP_CORRECT = 10;          // leçon du parcours
var XP_PRACTICE = 5;          // quiz libre (entraînement)
var XP_COMBO_BONUS = 5;       // par bonne réponse à partir de 3 d'affilée
var XP_NODE_DONE = 20;
var XP_PERFECT = 15;
var XP_EXAM_DONE = 40;
var XP_REVIEW_DONE = 15;      // bonus "mémoire consolidée"
var XP_TIMED = 10;            // bonus examen réussi sous chrono
var EXAM_SECONDS = 12 * 60;   // 10 questions × ~72 s, comme au régional
var XP_GRADUATED = 5;         // par question définitivement maîtrisée
var SRS_INTERVALS = [1, 3, 7]; // jours avant re-présentation (boîtes de Leitner)
var REVIEW_MAX = 10;          // questions max par session de révision
var CRIT_CHANCE = 0.12;       // ratio variable — ne pas augmenter (saturation)
var MAX_HEARTS = 5;
var HEART_REGEN_MS = 30 * 60 * 1000; // 1 cœur / 30 min
var DAILY_GOAL = 50;

var LEVELS = [
  { xp: 0,    name: 'Apprenti lecteur' },
  { xp: 80,   name: 'Lecteur curieux' },
  { xp: 200,  name: 'Explorateur des œuvres' },
  { xp: 380,  name: 'Analyste des textes' },
  { xp: 620,  name: 'Stratège du régional' },
  { xp: 920,  name: 'Maître des mots' },
  { xp: 1300, name: 'Dissertateur d’élite' },
  { xp: 1800, name: 'Lauréat régional' }
];

var BOOKS = ['boite', 'antigone', 'condamne'];
var BOOK_META = {
  boite:    { name: 'La Boîte à Merveilles', color: '#1a6b5a', icon: '📦' },
  antigone: { name: 'Antigone',              color: '#4a3070', icon: '🏛️' },
  condamne: { name: 'Le Dernier Jour d’un Condamné', color: '#b5432a', icon: '⛓️' }
};

/* 6 leçons thématiques + examen blanc. Chaque leçon PIOCHE 5 questions dans
   son pool (catégorie ou mélange) : deux passages ne montrent jamais
   exactement la même série — la connaissance est testée, pas la mémoire
   de la position des réponses. */
var NODE_DEFS = [
  { cat: 'Contextualisation',  name: 'Contexte & auteur',    icon: '✍️' },
  { cat: 'Analyse',            name: 'Analyse de l’œuvre', icon: '🔍' },
  { cat: 'Fait de langue',     name: 'Langue & style',       icon: '🖋️' },
  { cat: 'Réaction / opinion', name: 'Réaction & opinion',   icon: '💬' },
  { mix: true,                 name: 'Révision générale',    icon: '📚' },
  { mix: true,                 name: 'Consolidation',        icon: '🧩' },
  { etude: true,               name: 'Étude de texte',       icon: '📜' },
  { exam: true,                name: 'Examen blanc',         icon: '🏆' }
];

/* Étude de texte guidée : le format réel de l'épreuve — un support de scène
   lu attentivement, puis des questions de compréhension, d'analyse et de
   langue qui s'y rapportent. Le support reste affiché pendant la leçon. */
var ETUDES = (typeof window !== 'undefined' && window.PF_DATA && window.PF_DATA.etudes) ? window.PF_DATA.etudes : {};

/* Copie d'une question avec réponses mélangées. __src pointe vers l'objet
   d'origine pour que la répétition espacée (qid par identité) continue de
   fonctionner. */
function shuffleQuestion(q){
  var order = q.opts.map(function(_, i){ return i; }).sort(function(){ return Math.random() - .5; });
  return {
    __src: q.__src || q,
    cat: q.cat, q: q.q, exp: q.exp,
    opts: order.map(function(i){ return q.opts[i]; }),
    ans: order.indexOf(q.ans)
  };
}
function samplePool(pool, n){
  return pool.slice().sort(function(){ return Math.random() - .5; }).slice(0, n).map(shuffleQuestion);
}

/* Révision éclair : 3 rappels par œuvre — regagner un cœur = réviser vraiment */
var FLASHCARDS = {
  boite: [
    { t: 'Le narrateur', d: 'Sidi Mohammed, 6 ans, enfant sensible et solitaire de la médina de Fès. Le récit est fait par l’adulte qui se souvient.' },
    { t: 'La boîte', d: 'Un simple bidon rempli d’objets banals (bouton, bille, clou de girofle) transformés en trésor : refuge imaginaire contre la solitude.' },
    { t: 'Genre & date', d: 'Roman autobiographique d’Ahmed Sefrioui, publié en 1954. Réalisme social + style poétique et nostalgique.' }
  ],
  antigone: [
    { t: 'Contexte', d: 'Jean Anouilh réécrit la tragédie de Sophocle en 1944, pendant l’Occupation allemande — la pièce résonne avec la résistance.' },
    { t: 'Le conflit', d: 'Antigone dit NON au compromis (absolu moral) ; Créon dit OUI à l’ordre (raison d’État). Aucun des deux n’est simplement "le méchant".' },
    { t: 'Tragédie moderne', d: 'Le prologue annonce la fin dès le début : le destin est inéluctable, "le ressort est bandé". Pas de suspense, mais une tension fatale.' }
  ],
  condamne: [
    { t: 'L’objectif', d: 'Victor Hugo, 1829 : un plaidoyer contre la peine de mort. Roman à thèse — l’émotion sert l’argumentation.' },
    { t: 'Le dispositif', d: 'Journal intime d’un condamné anonyme (ni nom, ni crime détaillé) : n’importe qui pourrait être à sa place — humanisation universelle.' },
    { t: 'Le registre', d: 'Pathétique dominant : phrases brèves, répétitions obsessionnelles ("Ma tête…"), points de suspension — la souffrance psychique comme preuve.' }
  ]
};

/* ------------------------------------------------------------------ état */
function todayStr(){
  var d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}
function yesterdayStr(){
  var d = new Date(); d.setDate(d.getDate()-1);
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}

var G = load();
function load(){
  var base = {
    xp: 0,
    hearts: MAX_HEARTS,
    heartLostAt: 0,
    streak: { count: 0, last: '', best: 0 },
    daily: { day: todayStr(), xp: 0 },
    nodes: {},   // 'boite-0' -> { stars: 1..3, best: score }
    srs: {},     // 'boite:12' -> { box: 0..2, due: 'YYYY-MM-DD' }
    badges: {},  // 'serie-3' -> 'YYYY-MM-DD' (date d'obtention)
    catStats: {}, // 'Analyse' -> { ok: 12, total: 15 }
    graduatedTotal: 0,
    reviewsDone: 0,
    perfectLessons: 0,
    sound: true,
    trialUsed: false,
    pseudo: '',
    week: { id: '', xp: 0 }
  };
  try {
    var raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (raw && typeof raw === 'object') {
      for (var k in base) if (!(k in raw)) raw[k] = base[k];
      /* migration : l'examen blanc passe de l'index 6 à 7
         (insertion du nœud Étude de texte) — on préserve les étoiles */
      if (!raw.migrEtude) {
        ['boite', 'antigone', 'condamne'].forEach(function(b){
          if (raw.nodes[b + '-6'] && !raw.nodes[b + '-7']) {
            raw.nodes[b + '-7'] = raw.nodes[b + '-6'];
            delete raw.nodes[b + '-6'];
          }
        });
        raw.migrEtude = true;
      }
      return raw;
    }
  } catch(e){}
  return base;
}
var syncDirty = false;
function save(){
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(G)); } catch(e){}
  syncDirty = true;
}

/* Régénération des cœurs au chargement + toutes les minutes */
function regenHearts(){
  if (G.hearts >= MAX_HEARTS || !G.heartLostAt) return;
  var elapsed = Date.now() - G.heartLostAt;
  var gained = Math.floor(elapsed / HEART_REGEN_MS);
  if (gained > 0) {
    G.hearts = Math.min(MAX_HEARTS, G.hearts + gained);
    G.heartLostAt = G.hearts >= MAX_HEARTS ? 0 : G.heartLostAt + gained * HEART_REGEN_MS;
    save(); renderHUD();
  }
}

function rolloverDaily(){
  if (G.daily.day !== todayStr()) { G.daily = { day: todayStr(), xp: 0 }; save(); }
}

/* --------------------------------------------------------------- niveaux */
function levelIndex(xp){
  var i = 0;
  for (var l = 0; l < LEVELS.length; l++) if (xp >= LEVELS[l].xp) i = l;
  return i;
}
function levelProgress(xp){
  var i = levelIndex(xp);
  if (i >= LEVELS.length - 1) return 1;
  var lo = LEVELS[i].xp, hi = LEVELS[i+1].xp;
  return (xp - lo) / (hi - lo);
}

/* ------------------------------------------------------------------- son */
var audioCtx = null;
function beep(freqs, dur, type, gain){
  if (!G.sound) return;
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    var t = audioCtx.currentTime;
    freqs.forEach(function(f, i){
      var o = audioCtx.createOscillator(), g = audioCtx.createGain();
      o.type = type || 'sine'; o.frequency.value = f;
      g.gain.setValueAtTime(0, t + i*dur);
      g.gain.linearRampToValueAtTime(gain || 0.08, t + i*dur + 0.01);
      g.gain.exponentialRampToValueAtTime(0.001, t + (i+1)*dur);
      o.connect(g); g.connect(audioCtx.destination);
      o.start(t + i*dur); o.stop(t + (i+1)*dur + 0.02);
    });
  } catch(e){}
}
var SFX = {
  correct: function(){ beep([880, 1318], 0.09); },
  wrong:   function(){ beep([196], 0.18, 'triangle', 0.06); },
  crit:    function(){ beep([880, 1108, 1480], 0.07); },
  levelup: function(){ beep([523, 659, 784, 1046], 0.11); },
  done:    function(){ beep([659, 784, 1046], 0.12); },
  heart:   function(){ beep([1046, 880], 0.1, 'triangle', 0.05); }
};

/* -------------------------------------------------------------------- XP */
function isoWeekId(){
  var d = new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()));
  var day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  var y0 = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return d.getUTCFullYear() + '-W' + String(Math.ceil((((d - y0) / 86400000) + 1) / 7)).padStart(2, '0');
}

function grantXP(amount, opts){
  opts = opts || {};
  rolloverDaily();
  var before = levelIndex(G.xp);
  G.xp += amount;
  G.daily.xp += amount;
  if (G.week.id !== isoWeekId()) G.week = { id: isoWeekId(), xp: 0 };
  G.week.xp += amount;
  touchStreak();
  var after = levelIndex(G.xp);
  save();
  renderHUD();
  if (after > before && !opts.silentLevel) celebrateLevelUp(after);
  checkBadges(); // paliers XP et série peuvent tomber à tout moment
  return after > before;
}

function touchStreak(){
  var today = todayStr();
  if (G.streak.last === today) return;
  G.streak.count = (G.streak.last === yesterdayStr()) ? G.streak.count + 1 : 1;
  G.streak.last = today;
  if (G.streak.count > G.streak.best) G.streak.best = G.streak.count;
}

/* ------------------------------------------------- répétition espacée
   Courbe de l'oubli (Ebbinghaus) : toute question ratée revient à J+1,
   puis J+3, puis J+7. Trois rappels réussis = question maîtrisée.
   La révision est sans cœurs : enjeu bas, pur entraînement de rappel. */
function dateInDays(n){
  var d = new Date(); d.setDate(d.getDate() + n);
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}
function qid(q){
  var src = q.__src || q; // les copies mélangées gardent la référence d'origine
  for (var b = 0; b < BOOKS.length; b++) {
    var i = QUESTIONS[BOOKS[b]].indexOf(src);
    if (i > -1) return BOOKS[b] + ':' + i;
  }
  return null;
}
function qFromId(id){
  var parts = id.split(':');
  var pool = QUESTIONS[parts[0]];
  return pool ? pool[parseInt(parts[1], 10)] : null;
}
function srsRecordWrong(q){
  var id = qid(q);
  if (!id) return;
  G.srs[id] = { box: 0, due: dateInDays(SRS_INTERVALS[0]) };
  save();
}
/* retourne 0 = non suivi, 1 = boîte suivante, 2 = maîtrisée (sortie du SRS) */
function srsRecordRight(q){
  var id = qid(q);
  if (!id || !G.srs[id]) return 0;
  var rec = G.srs[id];
  rec.box++;
  if (rec.box >= SRS_INTERVALS.length) { delete G.srs[id]; G.graduatedTotal++; save(); return 2; }
  rec.due = dateInDays(SRS_INTERVALS[rec.box]);
  save();
  return 1;
}
function srsDueIds(maxDate){
  var lim = maxDate || todayStr();
  return Object.keys(G.srs).filter(function(id){ return G.srs[id].due <= lim; });
}

/* ------------------------------------------------------------------- HUD */
function heartsMarkup(n){
  var s = '';
  for (var i = 0; i < MAX_HEARTS; i++) s += '<span class="g-heart' + (i < n ? '' : ' empty') + '">' + (i < n ? '❤️' : '🤍') + '</span>';
  return s;
}

function renderHUD(){
  var el = document.getElementById('gameHud');
  if (!el) return;
  rolloverDaily();
  var li = levelIndex(G.xp), prog = levelProgress(G.xp);
  var dailyPct = Math.min(1, G.daily.xp / DAILY_GOAL);
  var streakActive = G.streak.last === todayStr();
  var ring = 2 * Math.PI * 15;
  el.innerHTML =
    '<button class="g-hud-item g-streak' + (streakActive ? ' lit' : (G.streak.count > 0 ? ' risk' : '')) + '" onclick="showScreen(\'parcours\', gGetParcoursBtn())" aria-label="Série : ' + G.streak.count + ' jour(s)">' +
      '<span class="g-flame">🔥</span><b>' + G.streak.count + '</b>' +
    '</button>' +
    '<div class="g-hud-item g-level" title="' + LEVELS[li].name + '">' +
      '<span class="g-level-name">' + LEVELS[li].name + '</span>' +
      '<div class="g-xpbar"><div class="g-xpfill" style="width:' + Math.round(prog*100) + '%"></div></div>' +
      '<span class="g-xp-count">' + G.xp + ' XP</span>' +
    '</div>' +
    '<div class="g-hud-item g-daily" title="Objectif du jour : ' + G.daily.xp + '/' + DAILY_GOAL + ' XP" aria-label="Objectif du jour : ' + G.daily.xp + ' sur ' + DAILY_GOAL + ' XP">' +
      '<svg viewBox="0 0 36 36" class="g-ring"><circle cx="18" cy="18" r="15" class="g-ring-bg"/><circle cx="18" cy="18" r="15" class="g-ring-fg" stroke-dasharray="' + (dailyPct*ring).toFixed(1) + ' ' + ring.toFixed(1) + '"/></svg>' +
      '<span class="g-daily-icon">' + (dailyPct >= 1 ? '✓' : '🎯') + '</span>' +
    '</div>' +
    '<div class="g-hud-item g-hearts" aria-label="' + G.hearts + ' cœur(s) sur ' + MAX_HEARTS + '">' + heartsMarkup(G.hearts) + '</div>' +
    '<button class="g-hud-item g-sound" onclick="gToggleSound(this)" aria-label="' + (G.sound ? 'Couper le son' : 'Activer le son') + '">' + (G.sound ? '🔊' : '🔇') + '</button>';
}

window.gToggleSound = function(){
  G.sound = !G.sound; save(); renderHUD();
  if (G.sound) SFX.correct();
};
window.gGetParcoursBtn = function(){
  return Array.from(document.querySelectorAll('.sidebar-menu button')).find(function(b){
    var oc = b.getAttribute('onclick'); return oc && oc.indexOf("'parcours'") !== -1;
  }) || document.querySelector('.sidebar-menu button');
};

/* ------------------------------------------------------------- parcours */
function nodeId(book, i){ return book + '-' + i; }
function nodeState(book, i){
  var rec = G.nodes[nodeId(book, i)];
  if (rec && rec.stars > 0) return 'done';
  if (i === 0) return 'open';
  var prev = G.nodes[nodeId(book, i-1)];
  if (NODE_DEFS[i].exam) {
    for (var k = 0; k < NODE_DEFS.length - 1; k++) {
      var r = G.nodes[nodeId(book, k)];
      if (!r || !r.stars) return 'locked';
    }
    return 'open';
  }
  return (prev && prev.stars > 0) ? 'open' : 'locked';
}
function bookProgress(book){
  var done = 0;
  for (var i = 0; i < NODE_DEFS.length; i++) if ((G.nodes[nodeId(book,i)] || {}).stars > 0) done++;
  return done;
}
function nextTarget(){
  for (var b = 0; b < BOOKS.length; b++) {
    for (var i = 0; i < NODE_DEFS.length; i++) {
      var st = nodeState(BOOKS[b], i);
      if (st === 'open') return { book: BOOKS[b], index: i };
    }
  }
  return null;
}

function starStr(n){
  var s = '';
  for (var i = 0; i < 3; i++) s += '<span class="g-star' + (i < n ? ' on' : '') + '">★</span>';
  return s;
}

var activeParcoursBook = 'boite';
window.gShowParcoursBook = function(book, btn){
  activeParcoursBook = book;
  document.querySelectorAll('#parcours .g-book-tab').forEach(function(b){ b.classList.remove('active'); });
  if (btn) btn.classList.add('active');
  renderPath();
};

function offsetFor(i){ return Math.round(Math.sin(i * 0.9) * 92); }

function renderPath(){
  var wrap = document.getElementById('gPath');
  if (!wrap) return;
  var book = activeParcoursBook;
  var meta = BOOK_META[book];
  var SP = 118, W = 340, cx = W / 2;
  var html = '';
  var pts = [];
  var target = nextTarget();

  for (var i = 0; i < NODE_DEFS.length; i++) {
    var def = NODE_DEFS[i];
    var st = nodeState(book, i);
    var rec = G.nodes[nodeId(book, i)] || {};
    var x = cx + offsetFor(i), y = i * SP + 60;
    pts.push([x, y]);
    var isCurrent = target && target.book === book && target.index === i;
    var size = def.exam ? 84 : 68;
    html += '<button class="g-node ' + st + (def.exam ? ' exam' : '') + (isCurrent ? ' current' : '') + '"' +
      ' style="left:' + (x - size/2) + 'px;top:' + (y - size/2) + 'px;width:' + size + 'px;height:' + size + 'px;' +
      (st !== 'locked' ? '--node-color:' + meta.color + ';' : '') + '"' +
      ' onclick="gStartLesson(\'' + book + '\',' + i + ')"' +
      (st === 'locked' ? ' disabled aria-label="' + def.name + ' — verrouillé"' : ' aria-label="' + def.name + (rec.stars ? ' — ' + rec.stars + ' étoile(s)' : '') + '"') + '>' +
      '<span class="g-node-icon">' + (st === 'locked' ? '🔒' : def.icon) + '</span>' +
      (isCurrent ? '<span class="g-node-pulse"></span><span class="g-node-cta">COMMENCER</span>' : '') +
      '</button>' +
      '<div class="g-node-label" style="left:' + (x - 70) + 'px;top:' + (y + size/2 + 2) + 'px;">' +
        '<span>' + def.name + '</span>' +
        (st === 'done' ? '<span class="g-node-stars">' + starStr(rec.stars) + '</span>' : '') +
      '</div>';
  }

  var d = 'M' + pts[0][0] + ',' + pts[0][1];
  for (var p = 1; p < pts.length; p++) {
    var midY = (pts[p-1][1] + pts[p][1]) / 2;
    d += ' C' + pts[p-1][0] + ',' + midY + ' ' + pts[p][0] + ',' + midY + ' ' + pts[p][0] + ',' + pts[p][1];
  }
  var height = (NODE_DEFS.length - 1) * SP + 150;
  wrap.style.height = height + 'px';
  wrap.innerHTML = '<svg class="g-path-line" width="' + W + '" height="' + height + '" viewBox="0 0 ' + W + ' ' + height + '">' +
    '<path d="' + d + '" fill="none" stroke="rgba(200,146,42,.28)" stroke-width="5" stroke-dasharray="1 10" stroke-linecap="round"/></svg>' + html;

  renderReviewCard();

  var cont = document.getElementById('gContinueCard');
  if (cont) {
    if (target) {
      var tm = BOOK_META[target.book], td = NODE_DEFS[target.index];
      cont.style.display = 'flex';
      cont.innerHTML = '<div class="g-cont-txt"><span class="g-cont-eyebrow">Reprendre où tu t’es arrêté</span>' +
        '<b>' + td.icon + ' ' + td.name + '</b><span class="g-cont-book">' + tm.icon + ' ' + tm.name + '</span></div>' +
        '<button class="g-cont-btn" style="background:' + tm.color + '" onclick="gJumpToTarget()">CONTINUER →</button>';
    } else {
      cont.style.display = 'flex';
      cont.innerHTML = '<div class="g-cont-txt"><b>🏅 Parcours complet !</b><span class="g-cont-book">Rejoue les leçons pour viser 3★ partout.</span></div>';
    }
  }

  document.querySelectorAll('#parcours .g-book-tab').forEach(function(b){
    var bk = b.getAttribute('data-book');
    var badge = b.querySelector('.g-tab-prog');
    if (badge) badge.textContent = bookProgress(bk) + '/' + NODE_DEFS.length;
    b.classList.toggle('active', bk === activeParcoursBook);
  });
}

function renderReviewCard(){
  var card = document.getElementById('gReviewCard');
  if (!card) return;
  var due = srsDueIds().length;
  var tracked = Object.keys(G.srs).length;
  if (due > 0) {
    card.style.display = 'flex';
    card.classList.add('urgent');
    card.innerHTML =
      '<div class="g-cont-txt">' +
        '<span class="g-cont-eyebrow" style="color:var(--terracotta);">Répétition espacée</span>' +
        '<b>📅 ' + due + ' question' + (due > 1 ? 's' : '') + ' à consolider aujourd’hui</b>' +
        '<span class="g-cont-book">Révise-les maintenant, avant que ta mémoire les efface.</span>' +
      '</div>' +
      '<button class="g-cont-btn" style="background:var(--terracotta);" onclick="gStartReview()">RÉVISER (' + Math.min(due, REVIEW_MAX) + ') →</button>';
  } else if (tracked > 0) {
    var next = Object.keys(G.srs).map(function(id){ return G.srs[id].due; }).sort()[0];
    var label = next === dateInDays(1) ? 'demain' : 'le ' + next.split('-').reverse().join('/');
    card.style.display = 'flex';
    card.classList.remove('urgent');
    card.innerHTML =
      '<div class="g-cont-txt">' +
        '<span class="g-cont-eyebrow" style="color:var(--teal);">Répétition espacée</span>' +
        '<b>🧠 Mémoire à jour</b>' +
        '<span class="g-cont-book">Prochaine révision ' + label + ' — reviens garder ta série 🔥</span>' +
      '</div>';
  } else {
    card.style.display = 'none';
  }
}

window.gJumpToTarget = function(){
  var t = nextTarget();
  if (!t) return;
  if (t.book !== activeParcoursBook) {
    var tab = document.querySelector('#parcours .g-book-tab[data-book="' + t.book + '"]');
    window.gShowParcoursBook(t.book, tab);
  }
  window.gStartLesson(t.book, t.index);
};

/* ----------------------------------------------------------- mode leçon */
var session = null; // { book, index, exam, combo, comboMax, xpBase, xpCombo, xpCrit }

window.gStartLesson = function(book, index){
  // essai gratuit : seule la première leçon est ouverte sans code premium
  if (!isPremium() && !(book === 'boite' && index === 0)) {
    window.gShowPaywall();
    return;
  }
  if (nodeState(book, index) === 'locked') return;

  // examen blanc : proposer les conditions réelles (chrono)
  if (NODE_DEFS[index].exam) {
    var m = BOOK_META[book];
    var overlay = document.createElement('div');
    overlay.className = 'g-overlay';
    overlay.id = 'gExamChoice';
    overlay.innerHTML =
      '<div class="g-card">' +
        '<div class="g-levelup-badge">🏆</div>' +
        '<h3>Examen blanc</h3>' +
        '<p class="g-card-sub">' + m.icon + ' ' + m.name + ' — 10 questions</p>' +
        '<button class="g-btn-primary" style="background:' + m.color + ';" onclick="gLaunchLesson(\'' + book + '\',' + index + ',true)">⏱️ AVEC CHRONO (12 min) — comme au régional</button>' +
        '<button class="g-btn-primary" style="background:var(--gold);margin-top:8px;" onclick="gLaunchLesson(\'' + book + '\',' + index + ',false)">SANS CHRONO — à mon rythme</button>' +
        '<button class="g-btn-ghost" onclick="document.getElementById(\'gExamChoice\').remove()">Annuler</button>' +
      '</div>';
    document.body.appendChild(overlay);
    return;
  }
  window.gLaunchLesson(book, index, false);
};

var examTimer = null;
function stopExamTimer(){ if (examTimer) { clearInterval(examTimer); examTimer = null; } }

window.gLaunchLesson = function(book, index, timed){
  var choice = document.getElementById('gExamChoice');
  if (choice) choice.remove();
  regenHearts();
  if (G.hearts <= 0) { showRefillModal(book); return; }

  var def = NODE_DEFS[index];
  /* QUESTIONS/qs/cur/score/answers/currentBookName sont des bindings lexicaux
     globaux de app.js (const/let) : accès par identifiant nu, pas window.x */
  var pool = (typeof QUESTIONS !== 'undefined') && QUESTIONS[book];
  if (!pool) return;

  var qsel, support = null;
  if (def.exam) {
    qsel = samplePool(pool, 10);
  } else if (def.etude) {
    var etList = ETUDES[book];
    if (!etList || !etList.length) return;
    /* une étude tirée au hasard parmi les 3 : chaque tentative peut porter
       sur une scène différente ; questions fixes dans l'ordre pédagogique,
       seules les positions des réponses sont mélangées */
    var et = etList[Math.floor(Math.random() * etList.length)];
    qsel = et.questions.map(shuffleQuestion);
    support = et;
  } else if (def.cat) {
    var themed = pool.filter(function(q){ return q.cat === def.cat; });
    qsel = samplePool(themed.length >= 5 ? themed : pool, 5);
  } else {
    qsel = samplePool(pool, 5);
  }

  session = { book: book, index: index, exam: !!def.exam, support: support, timed: !!timed, timerText: '', combo: 0, comboMax: 0, xpBase: 0, xpCombo: 0, xpCrit: 0 };

  // réutilise le moteur de quiz existant
  currentBookName = BOOK_META[book].name;
  qs = qsel; cur = 0; score = 0; answers = [];
  var quizBtn = Array.from(document.querySelectorAll('.sidebar-menu button')).find(function(b){
    var oc = b.getAttribute('onclick'); return oc && oc.indexOf("'quiz'") !== -1;
  });
  window.showScreen('quiz', quizBtn || document.querySelector('.sidebar-menu button'));
  document.getElementById('quiz-select-screen').style.display = 'none';
  document.getElementById('quiz-results-screen').style.display = 'none';
  document.getElementById('quiz-game-screen').style.display = 'block';
  ensureLessonBar();
  renderQ();

  if (timed) {
    var deadline = Date.now() + EXAM_SECONDS * 1000;
    stopExamTimer();
    examTimer = setInterval(function(){
      if (!session) { stopExamTimer(); return; }
      var left = Math.max(0, Math.round((deadline - Date.now()) / 1000));
      var mm = Math.floor(left / 60), ss = left % 60;
      session.timerText = mm + ':' + String(ss).padStart(2, '0');
      var el = document.getElementById('gTimer');
      if (el) {
        el.textContent = '⏱️ ' + session.timerText;
        el.classList.toggle('urgent', left <= 60);
      }
      if (left <= 0) {
        stopExamTimer();
        toast('⏱️ Temps écoulé — comme au vrai examen !');
        window.showResults(); // questions restantes = non répondues
      }
    }, 1000);
  }
  updateLessonBar();
};

window.gStartReview = function(){
  if (!isPremium()) { window.gShowPaywall(); return; }
  var due = srsDueIds();
  if (!due.length) return;
  var qsel = samplePool(due.map(qFromId).filter(Boolean), REVIEW_MAX);
  if (!qsel.length) return;

  session = { review: true, graduated: 0, combo: 0, comboMax: 0, xpBase: 0, xpCombo: 0, xpCrit: 0 };

  currentBookName = 'Révisions du jour';
  qs = qsel; cur = 0; score = 0; answers = [];
  var quizBtn = Array.from(document.querySelectorAll('.sidebar-menu button')).find(function(b){
    var oc = b.getAttribute('onclick'); return oc && oc.indexOf("'quiz'") !== -1;
  });
  window.showScreen('quiz', quizBtn || document.querySelector('.sidebar-menu button'));
  document.getElementById('quiz-select-screen').style.display = 'none';
  document.getElementById('quiz-results-screen').style.display = 'none';
  document.getElementById('quiz-game-screen').style.display = 'block';
  ensureLessonBar();
  renderQ();
  updateLessonBar();
};

function ensureLessonBar(){
  var game = document.getElementById('quiz-game-screen');
  var bar = document.getElementById('gLessonBar');
  if (!bar) {
    bar = document.createElement('div');
    bar.id = 'gLessonBar';
    game.insertBefore(bar, game.firstChild);
  }
  bar.style.display = session ? 'flex' : 'none';

  /* support de l'étude de texte : affiché en permanence pendant la leçon */
  var sup = document.getElementById('gSupport');
  if (session && session.support) {
    if (!sup) {
      sup = document.createElement('div');
      sup.id = 'gSupport';
      game.insertBefore(sup, bar.nextSibling);
    }
    sup.style.display = 'block';
    sup.innerHTML = '<div class="g-support-titre">📜 Support — ' + session.support.titre + '</div>' +
      '<p>' + session.support.support + '</p>' +
      '<div class="g-support-consigne">Lis attentivement, puis réponds aux questions ci-dessous en t’appuyant sur ce passage.</div>';
  } else if (sup) {
    sup.style.display = 'none';
  }
}
function updateLessonBar(){
  var bar = document.getElementById('gLessonBar');
  if (!bar || !session) return;
  var title = session.review
    ? '📅 Révisions du jour · consolide ta mémoire'
    : NODE_DEFS[session.index].icon + ' ' + NODE_DEFS[session.index].name;
  bar.innerHTML =
    '<button class="g-lesson-quit" onclick="gQuitLesson()" aria-label="Quitter la leçon">✕</button>' +
    '<span class="g-lesson-title">' + title + '</span>' +
    (session.timed ? '<span class="g-timer" id="gTimer">⏱️ ' + (session.timerText || '12:00') + '</span>' : '') +
    (session.combo >= 3 ? '<span class="g-combo">🔥 x' + session.combo + '</span>' : '') +
    (session.review ? '' : '<span class="g-lesson-hearts">' + heartsMarkup(G.hearts) + '</span>');
}
window.gQuitLesson = function(){
  session = null;
  stopExamTimer();
  ensureLessonBar();
  window.showScreen('parcours', window.gGetParcoursBtn());
  if (typeof window.resetQuiz === 'function') window.resetQuiz();
};

/* XP flottant au point de clic — feedback immédiat */
function floatXP(anchor, text, cls){
  try {
    var r = anchor.getBoundingClientRect();
    var el = document.createElement('div');
    el.className = 'g-float ' + (cls || '');
    el.textContent = text;
    el.style.left = (r.left + r.width/2) + 'px';
    el.style.top = (r.top) + 'px';
    document.body.appendChild(el);
    setTimeout(function(){ el.remove(); }, 1100);
  } catch(e){}
}

/* ----------------------------------------------------- hook : answerQ */
var origAnswerQ = window.answerQ;
window.answerQ = function(idx, btn){
  var q = qs[cur];
  var ok = idx === q.ans;
  origAnswerQ.apply(this, arguments);

  // bilan : statistiques par catégorie de question (tous modes confondus)
  var cat = q.cat || 'Autre';
  var cs = G.catStats[cat] = G.catStats[cat] || { ok: 0, total: 0 };
  cs.total++;
  if (ok) cs.ok++;
  save();

  // répétition espacée : toute erreur est planifiée à J+1, toute réussite
  // d'une question suivie avance sa boîte (leçon, révision ou quiz libre)
  if (ok) {
    var srsResult = srsRecordRight(q);
    if (srsResult === 2 && session && session.review) {
      session.graduated++;
      grantXP(XP_GRADUATED, { silentLevel: true });
    }
  } else {
    srsRecordWrong(q);
  }

  if (session) {
    if (ok) {
      session.combo++;
      if (session.combo > session.comboMax) session.comboMax = session.combo;
      var xp = XP_CORRECT, isCrit = Math.random() < CRIT_CHANCE;
      session.xpBase += XP_CORRECT;
      if (session.combo >= 3) { xp += XP_COMBO_BONUS; session.xpCombo += XP_COMBO_BONUS; }
      if (isCrit) { session.xpCrit += xp; xp *= 2; }
      grantXP(xp, { silentLevel: false });
      floatXP(btn, (isCrit ? '⚡ CRITIQUE ×2  ' : '') + '+' + xp + ' XP', isCrit ? 'crit' : 'ok');
      if (isCrit) SFX.crit(); else SFX.correct();
    } else {
      session.combo = 0;
      if (session.review) {
        // révision : enjeu bas, pas de cœurs — l'erreur reste planifiée à J+1
        floatXP(btn, 'Reprogrammée à demain 📅', 'ko');
        SFX.wrong();
      } else {
        loseHeart();
        floatXP(btn, '-1 ❤️', 'ko');
        SFX.wrong();
        if (G.hearts <= 0) {
          var failBook = session.book;
          setTimeout(function(){ abortLesson(failBook); }, 1200);
          return;
        }
      }
    }
    updateLessonBar();
  } else {
    // quiz libre : feedback sonore léger, pas de cœurs
    if (ok) SFX.correct(); else SFX.wrong();
  }
};

function loseHeart(){
  if (G.hearts > 0) {
    G.hearts--;
    if (!G.heartLostAt) G.heartLostAt = Date.now();
    save(); renderHUD();
  }
}

function abortLesson(book){
  session = null;
  stopExamTimer();
  ensureLessonBar();
  showRefillModal(book, true);
}

/* -------------------------------------------------- hook : showResults */
var origShowResults = window.showResults;
window.showResults = function(){
  if (session) { finishLesson(); return; }
  var r = origShowResults.apply(this, arguments);
  // quiz libre : XP d'entraînement
  var earned = score * XP_PRACTICE;
  if (earned > 0) {
    grantXP(earned);
    toast('+' + earned + ' XP d’entraînement 💪');
  }
  return r;
};

function starsForScore(score, total, exam){
  if (exam) return score >= 10 ? 3 : score >= 8 ? 2 : score >= 7 ? 1 : 0;
  return score >= 5 ? 3 : score >= 4 ? 2 : score >= 3 ? 1 : 0;
}

function finishLesson(){
  var s = session; session = null;
  stopExamTimer();
  ensureLessonBar();
  var total = qs.length;
  var sc = score;
  if (s.review) { finishReview(s, sc, total); return; }
  var def = NODE_DEFS[s.index];
  var stars = starsForScore(sc, total, s.exam);
  var passed = stars > 0;

  var bonus = 0;
  if (passed) {
    track(s.exam ? 'exam_done' : (isPremium() ? 'lesson_done' : 'trial_done'));
    bonus += s.exam ? XP_EXAM_DONE : XP_NODE_DONE;
    if (s.timed) bonus += XP_TIMED;
    if (sc === total) { bonus += XP_PERFECT; G.perfectLessons++; }
    var id = nodeId(s.book, s.index);
    var prev = G.nodes[id] || { stars: 0, best: 0 };
    G.nodes[id] = { stars: Math.max(prev.stars, stars), best: Math.max(prev.best, sc) };
    grantXP(bonus, { silentLevel: true });
  }
  save();
  checkBadges();

  document.getElementById('quiz-game-screen').style.display = 'none';
  var totalXP = s.xpBase + s.xpCombo + s.xpCrit + bonus;

  var m = BOOK_META[s.book];
  var overlay = document.createElement('div');
  overlay.className = 'g-overlay';
  overlay.id = 'gLessonResult';
  overlay.innerHTML =
    '<div class="g-card' + (passed ? '' : ' fail') + '">' +
      (passed ? '<canvas class="g-confetti" width="360" height="240"></canvas>' : '') +
      '<div class="g-card-stars">' + starStr(stars) + '</div>' +
      '<h3>' + (passed ? (sc === total ? 'PARFAIT !' : 'Leçon réussie !') : 'Presque…') + '</h3>' +
      '<p class="g-card-sub">' + def.icon + ' ' + def.name + ' — ' + m.name + '</p>' +
      '<div class="g-card-score">' + sc + '/' + total + ' bonnes réponses</div>' +
      '<div class="g-xp-detail">' +
        row('Réponses', '+' + s.xpBase) +
        (s.xpCombo ? row('Combo 🔥 (max x' + s.comboMax + ')', '+' + s.xpCombo) : '') +
        (s.xpCrit ? row('Critiques ⚡', '+' + s.xpCrit) : '') +
        (passed ? row(s.exam ? 'Examen réussi 🏆' : 'Leçon terminée', '+' + (s.exam ? XP_EXAM_DONE : XP_NODE_DONE)) : '') +
        (passed && s.timed ? row('Sous pression ⏱️', '+' + XP_TIMED) : '') +
        (passed && sc === total ? row('Sans faute ✨', '+' + XP_PERFECT) : '') +
        '<div class="g-xp-total"><span>Total</span><b>+' + totalXP + ' XP</b></div>' +
      '</div>' +
      (passed
        ? (isPremium()
            ? '<button class="g-btn-primary" style="background:' + m.color + '" onclick="gCloseResult(true)">CONTINUER LE PARCOURS →</button>'
            : '<p class="g-fail-hint" style="color:var(--teal);">🎁 Leçon gratuite réussie ✓ — la suite du parcours se débloque avec le pack complet.</p>' +
              '<button class="g-btn-primary" style="background:' + m.color + '" onclick="gCloseResult(true)">VOIR MON PARCOURS →</button>')
        : '<p class="g-fail-hint">Il faut au moins ' + (s.exam ? '7/10' : '3/5') + ' pour débloquer la suite.</p>' +
          '<button class="g-btn-primary" onclick="gRetryLesson(\'' + s.book + '\',' + s.index + ')">RÉESSAYER</button>' +
          '<button class="g-btn-ghost" onclick="gCloseResult(true)">Retour au parcours</button>') +
    '</div>';
  document.body.appendChild(overlay);
  if (passed) { SFX.done(); confettiOn(overlay.querySelector('.g-confetti')); }
  else SFX.wrong();

  function row(l, v){ return '<div class="g-xp-row"><span>' + l + '</span><b>' + v + ' XP</b></div>'; }
}

function finishReview(s, sc, total){
  track('review_done');
  G.reviewsDone++;
  grantXP(XP_REVIEW_DONE, { silentLevel: true });
  save();
  checkBadges();
  document.getElementById('quiz-game-screen').style.display = 'none';

  var totalXP = s.xpBase + s.xpCombo + s.xpCrit + XP_REVIEW_DONE + s.graduated * XP_GRADUATED;
  var remaining = srsDueIds().length;
  var dueTomorrow = srsDueIds(dateInDays(1)).length;

  function row(l, v){ return '<div class="g-xp-row"><span>' + l + '</span><b>' + v + ' XP</b></div>'; }
  var overlay = document.createElement('div');
  overlay.className = 'g-overlay';
  overlay.id = 'gLessonResult';
  overlay.innerHTML =
    '<div class="g-card">' +
      '<canvas class="g-confetti" width="360" height="240"></canvas>' +
      '<div class="g-levelup-badge">🧠</div>' +
      '<h3>Mémoire consolidée !</h3>' +
      '<p class="g-card-sub">Révision espacée — les notions reviennent juste avant que tu les oublies.</p>' +
      '<div class="g-card-score">' + sc + '/' + total + ' bonnes réponses</div>' +
      '<div class="g-xp-detail">' +
        row('Réponses', '+' + s.xpBase) +
        (s.xpCombo ? row('Combo 🔥 (max x' + s.comboMax + ')', '+' + s.xpCombo) : '') +
        (s.xpCrit ? row('Critiques ⚡', '+' + s.xpCrit) : '') +
        (s.graduated ? row('🎓 ' + s.graduated + ' question(s) maîtrisée(s)', '+' + (s.graduated * XP_GRADUATED)) : '') +
        row('Consolidation 🧠', '+' + XP_REVIEW_DONE) +
        '<div class="g-xp-total"><span>Total</span><b>+' + totalXP + ' XP</b></div>' +
      '</div>' +
      (remaining > 0
        ? '<p class="g-fail-hint">📅 Encore ' + remaining + ' question(s) à réviser aujourd’hui.</p>' +
          '<button class="g-btn-primary" onclick="gRetryReview()">CONTINUER LES RÉVISIONS →</button>' +
          '<button class="g-btn-ghost" onclick="gCloseResult(true)">Retour au parcours</button>'
        : '<p class="g-card-sub">' + (dueTomorrow > 0 ? '📅 ' + dueTomorrow + ' question(s) reviendront demain — ta série t’attend !' : 'Plus rien à réviser — tout est frais dans ta mémoire ✨') + '</p>' +
          '<button class="g-btn-primary" style="background:var(--teal)" onclick="gCloseResult(true)">RETOUR AU PARCOURS →</button>') +
    '</div>';
  document.body.appendChild(overlay);
  SFX.done();
  confettiOn(overlay.querySelector('.g-confetti'));
}
window.gRetryReview = function(){
  var o = document.getElementById('gLessonResult');
  if (o) o.remove();
  if (typeof window.resetQuiz === 'function') window.resetQuiz();
  window.gStartReview();
};

window.gCloseResult = function(toParcours){
  var o = document.getElementById('gLessonResult');
  if (o) o.remove();
  if (typeof window.resetQuiz === 'function') window.resetQuiz();
  if (toParcours) window.showScreen('parcours', window.gGetParcoursBtn());
  renderPath();
  renderBilan();
  syncLeaderboard();
};
window.gRetryLesson = function(book, index){
  var o = document.getElementById('gLessonResult');
  if (o) o.remove();
  if (typeof window.resetQuiz === 'function') window.resetQuiz();
  window.gStartLesson(book, index);
};

/* ------------------------------------------- cœurs : recharge pédagogique */
function showRefillModal(book, afterFail){
  var cards = FLASHCARDS[book] || FLASHCARDS.boite;
  var overlay = document.createElement('div');
  overlay.className = 'g-overlay';
  overlay.id = 'gRefill';
  var mins = G.heartLostAt ? Math.max(1, Math.ceil((HEART_REGEN_MS - (Date.now() - G.heartLostAt)) / 60000)) : 30;
  overlay.innerHTML =
    '<div class="g-card">' +
      '<h3>' + (afterFail ? '💔 Plus de cœurs !' : '💔 Cœurs épuisés') + '</h3>' +
      '<p class="g-card-sub">Révise une fiche éclair pour regagner un cœur immédiatement — ou attends ' + mins + ' min.</p>' +
      '<div class="g-flash" id="gFlashZone" data-step="0" data-book="' + book + '">' +
        '<div class="g-flash-num">1/' + cards.length + '</div>' +
        '<b>' + cards[0].t + '</b><p>' + cards[0].d + '</p>' +
      '</div>' +
      '<button class="g-btn-primary" onclick="gFlashNext()">J’AI LU → SUIVANT</button>' +
      '<button class="g-btn-ghost" onclick="gCloseRefill()">Plus tard</button>' +
    '</div>';
  document.body.appendChild(overlay);
}
window.gFlashNext = function(){
  var z = document.getElementById('gFlashZone');
  if (!z) return;
  var book = z.getAttribute('data-book');
  var step = parseInt(z.getAttribute('data-step'), 10) + 1;
  var cards = FLASHCARDS[book] || FLASHCARDS.boite;
  if (step < cards.length) {
    z.setAttribute('data-step', step);
    z.innerHTML = '<div class="g-flash-num">' + (step+1) + '/' + cards.length + '</div><b>' + cards[step].t + '</b><p>' + cards[step].d + '</p>';
    var btn = z.parentElement.querySelector('.g-btn-primary');
    if (step === cards.length - 1) btn.textContent = 'RÉCUPÉRER MON CŒUR ❤️';
  } else {
    G.hearts = Math.min(MAX_HEARTS, G.hearts + 1);
    if (G.hearts >= MAX_HEARTS) G.heartLostAt = 0;
    save(); renderHUD(); SFX.heart();
    window.gCloseRefill();
    toast('❤️ +1 cœur — bien joué, la révision paie !');
  }
};
window.gCloseRefill = function(){
  var o = document.getElementById('gRefill');
  if (o) o.remove();
};

/* ---------------------------------------------------------------- bilan
   Visibilité de la progression = motivation ; diagnostic par catégorie
   = l'élève sait exactement QUOI réviser (métacognition guidée). */
var CAT_META = {
  'Contextualisation':  { label: 'Contexte & auteur',   screen: 'auteurs',  advice: 'Relis les fiches Auteurs : vies, courants, dates clés.' },
  'Analyse':            { label: 'Analyse de l’œuvre', screen: 'resumes',  advice: 'Reprends les résumés et les personnages, chapitre par chapitre.' },
  'Fait de langue':     { label: 'Langue & style',      screen: 'methode',  advice: 'Revois les figures de style et les procédés dans Méthode.' },
  'Réaction / opinion': { label: 'Réaction & opinion',  screen: 'modeles',  advice: 'Inspire-toi des réponses modèles pour structurer ton avis.' }
};

function readiness(){
  var maxStars = BOOKS.length * NODE_DEFS.length * 3, stars = 0;
  for (var k in G.nodes) stars += (G.nodes[k].stars || 0);
  var starsPct = stars / maxStars;

  var ok = 0, total = 0;
  for (var c in G.catStats) { ok += G.catStats[c].ok; total += G.catStats[c].total; }
  var catPct = total > 0 ? ok / total : 0;

  var tracked = Object.keys(G.srs).length;
  var srsPct = tracked === 0 ? (total > 0 ? 1 : 0) : Math.max(0, 1 - srsDueIds().length / tracked);

  return Math.round(100 * (0.5 * starsPct + 0.3 * catPct + 0.2 * srsPct));
}

function renderBilan(){
  var wrap = document.getElementById('gBilan');
  if (!wrap) return;
  var pct = readiness();
  var label = pct >= 95 ? 'Prêt pour le régional !' : pct >= 80 ? 'Presque prêt' : pct >= 60 ? 'Bien parti' : pct >= 30 ? 'En progression' : 'Début du chemin';
  var color = pct >= 80 ? 'var(--teal)' : pct >= 45 ? 'var(--gold)' : 'var(--terracotta)';

  var bars = '', weakest = null;
  Object.keys(CAT_META).forEach(function(cat){
    var s = G.catStats[cat];
    var meta = CAT_META[cat];
    var rate = s && s.total > 0 ? Math.round(100 * s.ok / s.total) : null;
    if (s && s.total >= 3 && (weakest === null || rate < weakest.rate)) weakest = { cat: cat, rate: rate };
    bars += '<div class="g-cat-row">' +
      '<span class="g-cat-label">' + meta.label + '</span>' +
      '<div class="g-cat-bar"><div class="g-cat-fill" style="width:' + (rate === null ? 0 : rate) + '%;background:' + (rate === null ? 'var(--sand)' : rate >= 70 ? 'var(--teal)' : rate >= 45 ? 'var(--gold)' : 'var(--terracotta)') + ';"></div></div>' +
      '<span class="g-cat-rate">' + (rate === null ? '—' : rate + '%') + '</span>' +
      '</div>';
  });

  var advice = '';
  if (weakest && weakest.rate < 70) {
    var m = CAT_META[weakest.cat];
    advice = '<div class="g-bilan-advice">' +
      '<b>🎯 Ta priorité : ' + m.label + ' (' + weakest.rate + '% de réussite)</b>' +
      '<span>' + m.advice + '</span>' +
      '<button class="g-cont-btn" style="background:var(--ink);" onclick="showScreen(\'' + m.screen + '\', gGetParcoursBtn())">RÉVISER ÇA →</button>' +
      '</div>';
  }

  var ring = 2 * Math.PI * 52;
  wrap.innerHTML =
    '<div class="g-badges-head"><span class="eyebrow">Ton diagnostic</span>' +
    '<h3>📊 Bilan de préparation</h3></div>' +
    '<div class="g-bilan-grid">' +
      '<div class="g-bilan-gauge">' +
        '<svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" class="g-gauge-bg"/>' +
        '<circle cx="60" cy="60" r="52" class="g-gauge-fg" style="stroke:' + color + ';" stroke-dasharray="' + (pct/100*ring).toFixed(1) + ' ' + ring.toFixed(1) + '"/></svg>' +
        '<div class="g-gauge-txt"><b style="color:' + color + ';">' + pct + '%</b><span>' + label + '</span></div>' +
      '</div>' +
      '<div class="g-bilan-cats">' + bars + '</div>' +
    '</div>' + advice;
}

/* ------------------------------------------------------------ classement
   Comparaison sociale entre pairs = levier d'engagement majeur chez les
   ados. Pseudo librement choisi, XP de la semaine, zéro donnée perso. */
function syncLeaderboard(){
  if (!isPremium() || !G.pseudo || !G.week.xp) return;
  try {
    fetch('/api/leaderboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deviceId: window.pf1bacDeviceId ? window.pf1bacDeviceId() : '', pseudo: G.pseudo, xp: G.week.xp })
    }).then(function(){ renderLeaderboard(); }).catch(function(){});
  } catch(e){}
}

function renderLeaderboard(){
  var wrap = document.getElementById('gLeague');
  if (!wrap) return;
  var head = '<div class="g-badges-head"><span class="eyebrow">Cette semaine</span>' +
    '<h3>🏆 Ligue des élèves</h3></div>';

  if (!isPremium()) {
    wrap.innerHTML = head + '<p class="g-league-empty">🔒 La ligue est réservée aux membres — débloque le pack pour te mesurer aux autres élèves du Maroc.</p>';
    return;
  }

  if (!G.pseudo) {
    wrap.innerHTML = head +
      '<div class="g-league-join">' +
        '<p>Choisis un pseudo pour entrer dans la ligue et te mesurer aux autres élèves du Maroc :</p>' +
        '<div class="g-league-form">' +
          '<input id="gPseudoInput" type="text" maxlength="15" placeholder="Ton pseudo (ex: Fatima_Fès)" aria-label="Choisis un pseudo">' +
          '<button class="g-cont-btn" style="background:var(--teal);" onclick="gJoinLeague()">REJOINDRE →</button>' +
        '</div>' +
      '</div>';
    return;
  }

  wrap.innerHTML = head + '<div class="g-league-list" id="gLeagueList"><p class="g-league-empty">Chargement du classement…</p></div>';
  try {
    fetch('/api/leaderboard').then(function(r){ return r.json(); }).then(function(data){
      var list = document.getElementById('gLeagueList');
      if (!list) return;
      /* Moins de 3 inscrits : ne jamais montrer un classement vide (signal
         « personne n'utilise ») — on cadre en « ligue en formation ». */
      if (!data.ok || !data.top || data.top.length < 3) {
        var n = (data.ok && data.top) ? data.top.length : 0;
        list.innerHTML = '<p class="g-league-empty">🏗️ <b>Ligue en formation : ' + n + '/3 élèves</b> cette semaine.<br>' +
          'Le classement s’ouvre dès 3 inscrits — gagne des XP dès maintenant pour partir en tête ! 🚀</p>';
        return;
      }
      var myId = window.pf1bacDeviceId ? window.pf1bacDeviceId() : '';
      var medals = ['🥇', '🥈', '🥉'];
      var html = '';
      data.top.forEach(function(row, i){
        var me = row.id === myId;
        html += '<div class="g-league-row' + (me ? ' me' : '') + '">' +
          '<span class="g-league-rank">' + (medals[i] || (i + 1)) + '</span>' +
          '<span class="g-league-name">' + row.pseudo + (me ? ' (toi)' : '') + '</span>' +
          '<b class="g-league-xp">' + row.xp + ' XP</b>' +
          '</div>';
      });
      var inTop = data.top.some(function(r){ return r.id === myId; });
      if (!inTop && G.week.xp > 0) {
        html += '<div class="g-league-row me"><span class="g-league-rank">…</span>' +
          '<span class="g-league-name">' + G.pseudo + ' (toi)</span><b class="g-league-xp">' + G.week.xp + ' XP</b></div>';
      }
      list.innerHTML = html;
    }).catch(function(){
      var list = document.getElementById('gLeagueList');
      if (list) list.innerHTML = '<p class="g-league-empty">Classement indisponible pour le moment.</p>';
    });
  } catch(e){}
}

/* modération des pseudos : filtre partagé avec le serveur (qui reste
   l'autorité) — ici uniquement pour un retour immédiat à l'élève */
var PSEUDO_INTERDITS = ['merde','putain','pute','connard','connasse','salope','encul','nique','ntm','fdp','batard','zamel','zamle','7mar','hmar','9a7ba','kahba','qa7ba','zebi','zbi','zeb','couille','bite','penis','nazi','hitler','haine','tue-toi'];
function pseudoInterdit(p){
  var n = String(p).toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/0/g, 'o').replace(/1/g, 'i').replace(/3/g, 'e').replace(/4/g, 'a').replace(/5/g, 's')
    .replace(/[\s_.-]/g, '');
  var brut = String(p).toLowerCase().replace(/[\s_.-]/g, '');
  return PSEUDO_INTERDITS.some(function(m){
    var mm = m.replace(/[\s_.-]/g, '');
    return n.indexOf(mm) !== -1 || brut.indexOf(mm) !== -1;
  });
}

window.gJoinLeague = function(){
  var inp = document.getElementById('gPseudoInput');
  var pseudo = (inp && inp.value || '').replace(/[<>"'&\\/]/g, '').trim().slice(0, 15);
  if (!pseudo) { if (inp) inp.focus(); return; }
  if (pseudoInterdit(pseudo)) {
    toast('🚫 Ce pseudo n’est pas autorisé — choisis-en un autre.');
    if (inp) { inp.value = ''; inp.focus(); }
    return;
  }
  G.pseudo = pseudo;
  save();
  toast('🏆 Bienvenue dans la ligue, ' + pseudo + ' !');
  syncLeaderboard();
  renderLeaderboard();
};

/* ---------------------------------------------------------------- badges
   Collection = moteur de complétion : chaque trophée est un objectif
   concret et atteignable ; les cases grises créent le manque à combler. */
var BADGES = [
  { id: 'premiere-lecon', icon: '🎯', name: 'Premier pas',        desc: 'Réussir ta première leçon',
    test: function(){ for (var k in G.nodes) if (G.nodes[k].stars > 0) return true; return false; } },
  { id: 'sans-faute',     icon: '✨', name: 'Perfectionniste',    desc: 'Une leçon sans aucune faute',
    test: function(){ return G.perfectLessons >= 1; } },
  { id: 'serie-3',        icon: '🔥', name: 'Régulier',           desc: '3 jours d’affilée',
    test: function(){ return G.streak.best >= 3; } },
  { id: 'serie-7',        icon: '🌋', name: 'Inarrêtable',        desc: '7 jours d’affilée',
    test: function(){ return G.streak.best >= 7; } },
  { id: 'serie-30',       icon: '👑', name: 'Légende',            desc: '30 jours d’affilée',
    test: function(){ return G.streak.best >= 30; } },
  { id: 'xp-100',         icon: '⭐', name: 'Centurion',          desc: 'Atteindre 100 XP',
    test: function(){ return G.xp >= 100; } },
  { id: 'xp-500',         icon: '🌟', name: 'Étoile montante',    desc: 'Atteindre 500 XP',
    test: function(){ return G.xp >= 500; } },
  { id: 'premiere-revision', icon: '🧠', name: 'Mémoire vive',    desc: 'Terminer ta première révision',
    test: function(){ return G.reviewsDone >= 1; } },
  { id: 'maitrise-10',    icon: '🎓', name: 'Savoir ancré',       desc: '10 questions maîtrisées (3 rappels réussis)',
    test: function(){ return G.graduatedTotal >= 10; } },
  { id: 'examen-blanc',   icon: '🏆', name: 'Prêt pour le jour J', desc: 'Réussir un examen blanc',
    test: function(){ for (var b = 0; b < BOOKS.length; b++){ var r = G.nodes[BOOKS[b] + '-6']; if (r && r.stars > 0) return true; } return false; } },
  { id: 'oeuvre-complete', icon: '📚', name: 'Œuvre conquise',    desc: 'Terminer les 7 leçons d’une œuvre',
    test: function(){ for (var b = 0; b < BOOKS.length; b++) if (bookProgress(BOOKS[b]) >= NODE_DEFS.length) return true; return false; } },
  { id: 'parcours-complet', icon: '🎖️', name: 'Lauréat',          desc: 'Terminer les 3 parcours',
    test: function(){ for (var b = 0; b < BOOKS.length; b++) if (bookProgress(BOOKS[b]) < NODE_DEFS.length) return false; return true; } }
];

function checkBadges(){
  var newly = [];
  BADGES.forEach(function(bd){
    if (!G.badges[bd.id] && bd.test()) {
      G.badges[bd.id] = todayStr();
      newly.push(bd);
    }
  });
  if (newly.length) {
    save();
    newly.forEach(function(bd, i){
      setTimeout(function(){
        toast('🏅 Trophée débloqué : ' + bd.icon + ' ' + bd.name + ' !');
        SFX.levelup();
      }, 400 + i * 2600);
    });
    renderBadges();
  }
}

function renderBadges(){
  var wrap = document.getElementById('gBadges');
  if (!wrap) return;
  var earned = Object.keys(G.badges).length;
  var html = '<div class="g-badges-head"><span class="eyebrow">Ta collection</span>' +
    '<h3>🏅 Trophées <span class="g-badges-count">' + earned + '/' + BADGES.length + '</span></h3></div>' +
    '<div class="g-badges-grid">';
  BADGES.forEach(function(bd){
    var got = G.badges[bd.id];
    html += '<div class="g-badge' + (got ? ' earned' : '') + '" ' +
      'aria-label="' + bd.name + ' — ' + bd.desc + (got ? ' (obtenu)' : ' (à débloquer)') + '">' +
      '<span class="g-badge-icon">' + bd.icon + '</span>' +
      '<b>' + bd.name + '</b>' +
      '<span class="g-badge-desc">' + bd.desc + '</span>' +
      (got ? '<span class="g-badge-date">✓ ' + got.split('-').reverse().join('/') + '</span>' : '') +
      '</div>';
  });
  html += '</div>';
  wrap.innerHTML = html;
}

/* ------------------------------------------------ onboarding / essai gratuit
   Pied dans la porte : le visiteur joue la leçon 1 sans inscription et gagne
   ses premiers XP. Toute tentative d'aller plus loin ré-affiche le paywall,
   enrichi de la progression déjà gagnée (effet de dotation : on ne veut pas
   perdre ce qu'on possède déjà). */
function isPremium(){
  return document.documentElement.classList.contains('premium-unlocked');
}
window.gStartTrial = function(){
  var lock = document.getElementById('premiumLockScreen');
  if (lock) lock.style.display = 'none';
  track('trial_start');
  G.trialUsed = true; save();
  window.showScreen('parcours', window.gGetParcoursBtn());
  setTimeout(function(){ window.gStartLesson('boite', 0); }, 350);
};
window.gShowPaywall = function(){
  track('paywall_view');
  updateTrialBanner();
  var lock = document.getElementById('premiumLockScreen');
  if (lock) { lock.style.display = 'flex'; lock.scrollTop = 0; }
};
function updateTrialBanner(){
  var b = document.getElementById('trialProgressBanner');
  if (!b) return;
  if (G.xp > 0 && !isPremium()) {
    var li = levelIndex(G.xp);
    var done = 0;
    for (var k in G.nodes) if (G.nodes[k].stars > 0) done++;
    b.style.display = 'block';
    b.innerHTML = '⭐ <b>Ta progression : ' + G.xp + ' XP' +
      (done > 0 ? ' · ' + done + ' leçon' + (done > 1 ? 's' : '') + ' réussie' + (done > 1 ? 's' : '') + ' ✓' : '') + '</b>' +
      '<span>Niveau « ' + LEVELS[li].name + ' » — ta progression est sauvegardée et t’attend après le déblocage.</span>';
  } else {
    b.style.display = 'none';
  }
  var tbtn = document.getElementById('trialStartBtn');
  if (tbtn && G.trialUsed) {
    tbtn.innerHTML = '🎮 Rejouer ma leçon gratuite<span>Ta progression est conservée</span>';
  }
}

/* barrières : au-delà de la leçon offerte, tout mène au paywall */
var origShowScreenG = window.showScreen;
var TRIAL_SCREENS = { parcours: 1, quiz: 1, espace: 1 }; // l'essai voit sa progression (dotation)
window.showScreen = function(id, btn){
  if (!isPremium() && !TRIAL_SCREENS[id]) {
    window.gShowPaywall();
    return;
  }
  return origShowScreenG.apply(this, arguments);
};
var origStartQuiz = window.startQuiz;
window.startQuiz = function(){
  if (!isPremium()) { window.gShowPaywall(); return; }
  var r = origStartQuiz.apply(this, arguments);
  // quiz libre : réponses mélangées aussi (jamais de mémorisation par position)
  qs = qs.map(shuffleQuestion);
  cur = 0;
  renderQ();
  return r;
};

/* -------------------------------------------------------- célébrations */
function celebrateLevelUp(levelIdx){
  var overlay = document.createElement('div');
  overlay.className = 'g-overlay';
  overlay.innerHTML =
    '<div class="g-card g-levelup">' +
      '<canvas class="g-confetti" width="360" height="240"></canvas>' +
      '<div class="g-levelup-badge">🎖️</div>' +
      '<h3>NIVEAU ' + (levelIdx + 1) + '</h3>' +
      '<p class="g-levelup-name">' + LEVELS[levelIdx].name + '</p>' +
      '<button class="g-btn-primary" onclick="this.closest(\'.g-overlay\').remove()">CONTINUER</button>' +
    '</div>';
  document.body.appendChild(overlay);
  SFX.levelup();
  confettiOn(overlay.querySelector('.g-confetti'));
}

function confettiOn(canvas){
  if (!canvas) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var ctx = canvas.getContext('2d');
  var colors = ['#c8922a', '#1a6b5a', '#4a3070', '#b5432a', '#e8c97a'];
  var parts = [];
  for (var i = 0; i < 60; i++) parts.push({
    x: Math.random() * canvas.width, y: -10 - Math.random() * 80,
    vx: (Math.random() - .5) * 1.6, vy: 1 + Math.random() * 2.2,
    s: 4 + Math.random() * 5, r: Math.random() * Math.PI,
    c: colors[i % colors.length]
  });
  var frames = 0;
  (function tick(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    parts.forEach(function(p){
      p.x += p.vx; p.y += p.vy; p.r += 0.08;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r);
      ctx.fillStyle = p.c; ctx.fillRect(-p.s/2, -p.s/2, p.s, p.s * .6);
      ctx.restore();
    });
    if (++frames < 130) requestAnimationFrame(tick);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  })();
}

function toast(msg){
  var t = document.createElement('div');
  t.className = 'g-toast';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(function(){ t.classList.add('out'); }, 2400);
  setTimeout(function(){ t.remove(); }, 2900);
}

/* --------------------------------------------------------- PWA / install
   L'icône sur l'écran d'accueil supprime la friction du retour quotidien :
   le streak ne survit que si revenir coûte zéro effort. */
var deferredInstall = null;
window.addEventListener('beforeinstallprompt', function(e){
  e.preventDefault();
  deferredInstall = e;
  renderInstallCard();
});
function renderInstallCard(){
  var card = document.getElementById('gInstallCard');
  if (!card || !deferredInstall) return;
  if (localStorage.getItem('pf1bac_install_dismissed')) return;
  card.style.display = 'flex';
  card.innerHTML =
    '<div class="g-cont-txt">' +
      '<span class="g-cont-eyebrow">Application</span>' +
      '<b>📲 Ajoute l’app sur ton téléphone</b>' +
      '<span class="g-cont-book">Un seul geste chaque jour pour garder ta série 🔥</span>' +
    '</div>' +
    '<div style="display:flex;gap:8px;align-items:center;">' +
      '<button class="g-cont-btn" style="background:var(--ink);" onclick="gInstallApp()">INSTALLER</button>' +
      '<button class="g-btn-ghost" style="width:auto;margin:0;" onclick="gDismissInstall()">Plus tard</button>' +
    '</div>';
}
window.gInstallApp = function(){
  if (!deferredInstall) return;
  deferredInstall.prompt();
  deferredInstall.userChoice.then(function(choice){
    if (choice && choice.outcome === 'accepted') {
      toast('📲 App installée — à demain pour ta série 🔥');
    }
    deferredInstall = null;
    var card = document.getElementById('gInstallCard');
    if (card) card.style.display = 'none';
  });
};
window.gDismissInstall = function(){
  try { localStorage.setItem('pf1bac_install_dismissed', '1'); } catch(e){}
  var card = document.getElementById('gInstallCard');
  if (card) card.style.display = 'none';
};
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function(){
    navigator.serviceWorker.register('sw.js').catch(function(){});
  });
}

/* ------------------------------------------------- statistiques d'usage
   Compteurs anonymes (des nombres par jour, rien d'autre) pour que le
   vendeur voie enfin : visites, essais, conversions, activité. */
function track(ev){
  try {
    fetch('/api/stats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: ev })
    }).catch(function(){});
  } catch(e){}
}
window.gTrack = track;

/* --------------------------------------------------- sauvegarde nuage
   La progression suit le CODE (clé = son SHA-256), pas l'appareil :
   changer de téléphone ou vider le navigateur ne fait plus rien perdre. */
function getSyncKey(){
  try { var k = localStorage.getItem('pf1bac_sync_key') || ''; return /^[a-f0-9]{64}$/.test(k) ? k : ''; } catch(e){ return ''; }
}
function pushProgress(){
  var k = getSyncKey();
  if (!k || !isPremium()) return;
  var prod = null;
  try { prod = JSON.parse(localStorage.getItem('pf1bac_prod_v1') || 'null'); } catch(e){}
  try {
    fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: k, state: { game: G, prod: prod } })
    }).then(function(){ syncDirty = false; }).catch(function(){});
  } catch(e){}
}
window.gCloudSync = function(pullFirst){
  var k = getSyncKey();
  if (!k || !isPremium()) return;
  if (pullFirst === false) { pushProgress(); return; }
  try {
    fetch('/api/progress?key=' + k).then(function(r){ return r.json(); }).then(function(d){
      if (d.ok && d.state && d.state.game && Number(d.state.game.xp) > G.xp) {
        // le nuage est en avance (autre appareil) : on restaure
        localStorage.setItem(STORAGE_KEY, JSON.stringify(d.state.game));
        if (d.state.prod) localStorage.setItem('pf1bac_prod_v1', JSON.stringify(d.state.prod));
        toast('☁️ Progression restaurée : ' + d.state.game.xp + ' XP — bon retour !');
        setTimeout(function(){ location.reload(); }, 1800);
      } else {
        pushProgress();
      }
    }).catch(function(){});
  } catch(e){}
};

/* ---------------------------------------------- pont atelier production
   L'atelier d'écriture (production.js) récompense le travail de fond :
   c'est l'effort le plus proche de l'examen réel, il paie en XP. */
window.gToast = toast;
window.gGrantProductionXP = function(xp, note, sujetIndex){
  track('prod_done');
  grantXP(xp, { silentLevel: false });
  var overlay = document.createElement('div');
  overlay.className = 'g-overlay';
  overlay.innerHTML =
    '<div class="g-card">' +
      '<canvas class="g-confetti" width="360" height="240"></canvas>' +
      '<div class="g-levelup-badge">🖊️</div>' +
      '<h3>Production terminée !</h3>' +
      '<p class="g-card-sub">Auto-évaluation : <b>' + note + '/8</b> — c’est exactement le travail qui paie le jour du régional.</p>' +
      '<div class="g-xp-detail"><div class="g-xp-total"><span>Travail de fond</span><b>+' + xp + ' XP</b></div></div>' +
      (note < 5 ? '<p class="g-fail-hint">Compare avec la réponse modèle puis retente le même sujet : la progression viendra de la réécriture.</p>' : '') +
      '<button class="g-btn-primary" onclick="this.closest(\'.g-overlay\').remove(); gProdShowModel(' + sujetIndex + ');">📖 COMPARER AVEC LA RÉPONSE MODÈLE</button>' +
      '<button class="g-btn-ghost" onclick="this.closest(\'.g-overlay\').remove()">Plus tard</button>' +
    '</div>';
  document.body.appendChild(overlay);
  SFX.done();
  confettiOn(overlay.querySelector('.g-confetti'));
};

/* ----------------------------------------------------------------- init */
document.addEventListener('DOMContentLoaded', function(){
  regenHearts();
  rolloverDaily();
  renderHUD();
  renderPath();
  renderBilan();
  renderBadges();
  renderLeaderboard();
  syncLeaderboard();
  updateTrialBanner(); // visiteur de retour non premium : montre ses acquis
  setInterval(regenHearts, 60000);
  // visite : 1 max par jour et par appareil
  try {
    if (localStorage.getItem('pf1bac_ping') !== todayStr()) {
      localStorage.setItem('pf1bac_ping', todayStr());
      track('visit');
    }
  } catch(e){}
  window.gCloudSync(); // restaure du nuage si un autre appareil est en avance
  setInterval(function(){ if (syncDirty) window.gCloudSync(false); }, 120000);
  window.addEventListener('beforeunload', function(){ if (syncDirty) pushProgress(); });

  // rappels au chargement — un seul toast à la fois, priorité aux révisions
  var due = srsDueIds().length;
  if (due > 0) {
    setTimeout(function(){ toast('📅 ' + due + ' question' + (due > 1 ? 's' : '') + ' à réviser aujourd’hui — consolide ta mémoire !'); }, 1500);
  } else if (G.streak.count > 0 && G.streak.last === yesterdayStr()) {
    setTimeout(function(){ toast('🔥 Ta série de ' + G.streak.count + ' jour(s) t’attend — une leçon suffit !'); }, 1500);
  }
});

})();
