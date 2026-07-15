/* Suite client : les vrais moteurs (app + gamification + production +
   content-loader) exécutés dans un faux navigateur. On pilote les
   parcours élève et on vérifie XP, cœurs, SRS, déblocages, barrière
   d'essai et injection du contenu premium. */
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { suite, test, assert, eq } from './harness.mjs';
import { createFakeBrowser } from './helpers/fake-dom.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ASSETS = path.join(ROOT, 'assets', 'js');

/* Contenu premium généré par le build (banque complète + écrans). */
const CONTENT = JSON.parse(fs.readFileSync(path.join(ROOT, 'private', 'content.json'), 'utf8'));

const SCREEN_IDS = ['home', 'parcours', 'espace', 'production', 'auteurs', 'resumes', 'fiches',
  'methode', 'modeles', 'quiz', 'vocabulaire', 'bareme', 'regionaux', 'cadre', 'chat'];

function bootstrap({ premium = false } = {}) {
  const fb = createFakeBrowser();
  const { document: doc, body } = fb;

  function el(tag, id, cls) { const e = doc.createElement(tag); if (id) e.setAttribute('id', id); if (cls) e.setAttribute('class', cls); body.appendChild(e); return e; }

  // structure réelle : nav.sidebar-nav > .sidebar-menu > button
  const nav = el('nav', 'mainNav', 'nav sidebar-nav');
  const menu = doc.createElement('div'); menu.setAttribute('id', 'sidebarMenu'); menu.setAttribute('class', 'sidebar-menu'); nav.appendChild(menu);
  for (const s of SCREEN_IDS) {
    const b = doc.createElement('button');
    b.setAttribute('onclick', `showScreen('${s}',this)`);
    menu.appendChild(b);
  }
  for (const s of SCREEN_IDS) el('div', s, 'screen' + (s === 'parcours' ? ' active' : ''));
  ['gameHud', 'gReviewCard', 'gContinueCard', 'gPath', 'gBilan', 'gLeague', 'gBadges',
    'gInstallCard', 'gProd', 'trialProgressBanner', 'trialStartBtn'].forEach((id) => el('div', id));
  ['boite', 'antigone', 'condamne'].forEach((bk) => {
    const t = doc.createElement('button');
    t.setAttribute('class', 'g-book-tab'); t.setAttribute('data-book', bk);
    const sp = doc.createElement('span'); sp.setAttribute('class', 'g-tab-prog'); t.appendChild(sp);
    doc.getElementById('parcours').appendChild(t);
  });
  const quiz = doc.getElementById('quiz');
  ['quiz-select-screen', 'quiz-game-screen', 'quiz-results-screen'].forEach((id) => { const d = doc.createElement('div'); d.setAttribute('id', id); quiz.appendChild(d); });
  ['qpfill', 'qnum', 'qtext', 'qcat', 'qopts', 'qfeedback', 'qaiblock', 'qaicontent', 'qbtns'].forEach((id) => { const d = doc.createElement('div'); d.setAttribute('id', id); doc.getElementById('quiz-game-screen').appendChild(d); });
  const lock = el('div', 'premiumLockScreen'); lock.style.display = 'flex';
  el('input', 'premiumAccessCode');

  if (premium) doc.documentElement.classList.add('premium-unlocked');

  fb.window.PF_DATA = {
    questions: { boite: CONTENT.data.questions.boite.filter((q) => q.cat === 'Contextualisation'), antigone: [], condamne: [] },
    etudes: { boite: [], antigone: [], condamne: [] },
    sujets: [],
  };

  fb.loadEngines(ASSETS, ['app.js', 'gamification.js', 'production.js', 'content-loader.js']);
  fb.fireDOMContentLoaded();
  fb.runTimers();
  return fb;
}

function answerLesson(fb, plan) {
  const { document: doc } = fb;
  for (let i = 0; i < plan.length; i++) {
    const opts = doc.querySelectorAll('#qopts .opt');
    const ans = fb.evalIn('qs[cur].ans');
    const idx = plan[i] ? ans : (ans + 1) % opts.length;
    opts[idx].click();
    fb.runTimers();
    const next = doc.querySelector('#qbtns button');
    if (next) { next.click(); fb.runTimers(); }
  }
  fb.runTimers();
}

function readG(fb) { return JSON.parse(fb.window.localStorage.getItem('pf1bac_game_v1')); }
function setVal(doc, id, v) { const e = doc.getElementById(id); if (e) e.value = v; }
function injectFull(fb) {
  const D = fb.window.PF_DATA, data = CONTENT.data;
  ['boite', 'antigone', 'condamne'].forEach((b) => {
    D.questions[b].length = 0; Array.prototype.push.apply(D.questions[b], data.questions[b]);
    D.etudes[b].length = 0; Array.prototype.push.apply(D.etudes[b], data.etudes[b]);
  });
  D.sujets.length = 0; Array.prototype.push.apply(D.sujets, data.sujets);
  if (typeof fb.window.gContentRefresh === 'function') { fb.window.gContentRefresh(); fb.runTimers(); }
  if (typeof fb.window.gProdRefresh === 'function') { fb.window.gProdRefresh(); fb.runTimers(); }
}

export async function run() {
  suite('client · chargement des moteurs');
  await test('les moteurs se chargent sans erreur', () => {
    const fb = bootstrap();
    assert(typeof fb.window.showScreen === 'function', 'showScreen doit exister');
    assert(typeof fb.window.gStartLesson === 'function', 'gStartLesson doit exister');
  });
  await test('données d’essai : banque limitée à la Boîte (Contexte)', () => {
    const fb = bootstrap();
    const Q = fb.window.PF_DATA.questions;
    assert(Q.boite.length >= 5 && Q.antigone.length === 0 && Q.condamne.length === 0, 'essai limité attendu');
    assert(Q.boite.every((q) => q.cat === 'Contextualisation'), 'essai = Contexte uniquement');
  });

  suite('client · anti-répétition (mélange des réponses)');
  await test('la bonne réponse reste correcte après mélange', () => {
    const fb = bootstrap({ premium: true }); injectFull(fb);
    fb.window.gStartLesson('boite', 0); fb.runTimers();
    const qs = fb.evalIn('qs');
    assert(qs.length === 5, '5 questions attendues, obtenu : ' + qs.length);
    for (const q of qs) assert(q.opts[q.ans] === q.__src.opts[q.__src.ans], 'bonne réponse cohérente après mélange');
  });

  suite('client · XP, cœurs et déblocage');
  await test('leçon parfaite : XP gagnés, nœud 3★, cœurs intacts', () => {
    const fb = bootstrap({ premium: true }); injectFull(fb);
    const g0 = readG(fb);
    fb.window.gStartLesson('boite', 0); fb.runTimers();
    answerLesson(fb, [true, true, true, true, true]);
    const g = readG(fb);
    // 5×10 (réponses) + combo(3+4+5=12) + 20 (nœud) + 15 (sans-faute) = 97 minimum
    // (les critiques aléatoires ne peuvent qu'ajouter). On pinne un plancher
    // qui casse si XP_CORRECT ou les bonus de base sont amputés.
    assert(g.xp - g0.xp >= 95, 'XP d’une leçon parfaite trop bas : ' + (g.xp - g0.xp));
    assert(g.hearts === 5, 'cœurs intacts, obtenu : ' + g.hearts);
    assert(g.nodes['boite-0'] && g.nodes['boite-0'].stars === 3, '3 étoiles attendues');
  });
  await test('erreur en leçon : un cœur perdu + SRS programmé', () => {
    const fb = bootstrap({ premium: true }); injectFull(fb);
    fb.window.gStartLesson('boite', 0); fb.runTimers();
    answerLesson(fb, [false, true, true, true, true]);
    const g = readG(fb);
    assert(g.hearts === 4, 'un cœur devait être perdu, obtenu : ' + g.hearts);
    assert(Object.keys(g.srs).length >= 1, 'révision espacée attendue');
  });

  suite('client · barrière d’essai (paywall)');
  await test('sans premium : leçon 2 renvoie au paywall', () => {
    const fb = bootstrap({ premium: false });
    fb.window.gStartLesson('boite', 1); fb.runTimers();
    eq(fb.document.getElementById('premiumLockScreen').style.display, 'flex');
  });
  await test('sans premium : leçon d’essai (boite 0) jouable', () => {
    const fb = bootstrap({ premium: false });
    fb.window.gStartTrial(); fb.runTimers();
    assert(fb.evalIn('qs') && fb.evalIn('qs').length === 5, 'leçon d’essai de 5 questions attendue');
  });

  suite('client · injection du contenu premium');
  await test('banque complète injectée EN PLACE (référence préservée)', () => {
    const fb = bootstrap({ premium: true });
    const ref = fb.window.PF_DATA.questions.boite;
    injectFull(fb);
    assert(fb.window.PF_DATA.questions.boite === ref, 'la référence de tableau doit être préservée');
    eq([fb.window.PF_DATA.questions.boite.length, fb.window.PF_DATA.questions.antigone.length, fb.window.PF_DATA.questions.condamne.length], [90, 90, 90]);
    assert(fb.window.PF_DATA.sujets.length === 9, '9 sujets attendus');
  });
  await test('purge des SRS d’essai au passage en banque complète', () => {
    const fb = bootstrap({ premium: true });
    fb.window.gStartLesson('boite', 0); fb.runTimers();
    answerLesson(fb, [false, true, true, true, true]);
    assert(Object.keys(readG(fb).srs).length >= 1, 'SRS d’essai créé');
    injectFull(fb);
    eq(Object.keys(readG(fb).srs).length, 0, 'SRS d’essai purgés attendus');
  });

  suite('client · atelier de production écrite');
  await test('parcours 4 étapes → note 8/8 et XP', () => {
    const fb = bootstrap({ premium: true }); injectFull(fb);
    const win = fb.window, doc = fb.document;
    let granted = null;
    win.gGrantProductionXP = (xp, note, idx) => { granted = { xp, note, idx }; };
    win.gProdStart(0); fb.runTimers();
    win.gProdNext(); fb.runTimers();
    setVal(doc, 'pThese', 'Je pense que oui.');
    setVal(doc, 'pArg1', 'Argument un, exemple.');
    setVal(doc, 'pArg2', 'Argument deux, exemple.');
    setVal(doc, 'pConcl', 'En somme, oui.');
    win.gProdNext(); fb.runTimers();
    setVal(doc, 'pTexte', Array(80).fill('mot').join(' '));
    win.gProdNext(); fb.runTimers();
    doc.querySelectorAll('#gProd input[data-g]').forEach((c) => { c.checked = true; });
    win.gProdFinish(); fb.runTimers();
    assert(granted && granted.note === 8, 'note 8/8 attendue, obtenu : ' + (granted && granted.note));
    assert(granted.xp > 0, 'XP de production attendus');
  });
}
