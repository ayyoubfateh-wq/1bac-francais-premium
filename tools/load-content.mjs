/* Chargeur de contenu — exécute les fichiers du site dans un bac à sable Node
   et capture les données EXACTES (questions, études, sujets) telles qu'elles
   sont en production. Aucune recopie manuelle : la machine lit la source de
   vérité. Sert au validateur (tools/validate-content.mjs) et à l'extraction.

   Technique : on expose les données locales aux closures via un remplacement
   EN MÉMOIRE (les fichiers sur disque ne sont jamais modifiés) :
     const QUESTIONS = {   →  const QUESTIONS = globalThis.__Q = {
     var ETUDES = {        →  var ETUDES = globalThis.__E = {
     var SUJETS = [        →  var SUJETS = globalThis.__S = [
*/
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const JS = (f) => path.join(ROOT, 'assets', 'js', f);

/* Stubs minimalistes du navigateur : suffisants pour que le haut des modules
   s'exécute jusqu'aux définitions de données sans lever d'exception. */
function browserContext() {
  const noop = () => {};
  const el = () => ({
    style: {}, classList: { add: noop, remove: noop, toggle: noop, contains: () => false },
    setAttribute: noop, getAttribute: () => null, appendChild: noop, insertBefore: noop,
    addEventListener: noop, removeEventListener: noop, querySelector: () => null,
    querySelectorAll: () => [], remove: noop, focus: noop, dispatchEvent: noop,
    getContext: () => ({}), getBoundingClientRect: () => ({}), textContent: '', innerHTML: '',
    value: '', dataset: {}, firstChild: null, nextSibling: null, children: [], parentElement: null,
  });
  const documentStub = {
    addEventListener: noop, removeEventListener: noop,
    getElementById: () => null, querySelector: () => null, querySelectorAll: () => [],
    createElement: () => el(), createTextNode: () => el(),
    documentElement: el(), body: el(), head: el(), readyState: 'complete',
  };
  const storage = () => {
    const m = new Map();
    return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k), clear: () => m.clear() };
  };
  const ctx = {
    document: documentStub,
    navigator: {},                          // 'serviceWorker' in navigator → false
    location: { href: '', reload: noop, origin: '' },
    localStorage: storage(),
    sessionStorage: storage(),
    crypto: { subtle: { digest: () => Promise.resolve(new ArrayBuffer(32)) }, getRandomValues: (a) => a },
    fetch: () => new Promise(() => {}),      // ne résout jamais → aucun effet
    matchMedia: () => ({ matches: false, addEventListener: noop, addListener: noop }),
    setInterval: () => 0, clearInterval: noop, setTimeout: () => 0, clearTimeout: noop,
    requestAnimationFrame: () => 0, cancelAnimationFrame: noop,
    AudioContext: function () { return { createOscillator: () => ({ connect: noop, start: noop, stop: noop, frequency: {} }), createGain: () => ({ connect: noop, gain: { setValueAtTime: noop, linearRampToValueAtTime: noop, exponentialRampToValueAtTime: noop } }), destination: {}, currentTime: 0 }; },
    Image: function () { return el(); }, Audio: function () { return el(); },
    TextEncoder, JSON, Math, Date, Object, Array, String, Number, Boolean, RegExp, isNaN, parseInt, parseFloat, console,
  };
  ctx.window = ctx;
  ctx.globalThis = ctx;
  ctx.window.webkitAudioContext = ctx.AudioContext;
  ctx.window.addEventListener = noop;
  return ctx;
}

function run(context, file, replaces) {
  let src = fs.readFileSync(JS(file), 'utf8');
  for (const [from, to] of replaces) {
    const i = src.indexOf(from);
    if (i === -1) throw new Error(`Motif introuvable dans ${file} : « ${from} »`);
    src = src.slice(0, i) + to + src.slice(i + from.length);
  }
  try {
    vm.runInContext(src, context, { filename: file, timeout: 5000 });
  } catch (e) {
    // Les données sont définies tôt : une erreur d'effet de bord plus loin
    // n'empêche pas la capture. On la garde pour diagnostic éventuel.
    context.__lastError = context.__lastError || {};
    context.__lastError[file] = String(e && e.message || e);
  }
}

export function loadContent() {
  const context = vm.createContext(browserContext());

  run(context, 'app.js', [['const QUESTIONS = {', 'const QUESTIONS = globalThis.__Q = {']]);
  const questions = context.__Q;
  if (!questions) throw new Error('Capture de QUESTIONS échouée (app.js).');

  // questions-extra.js pousse dans QUESTIONS (variable libre) → on l'expose
  context.QUESTIONS = questions;
  run(context, 'questions-extra.js', []);

  run(context, 'production.js', [['var SUJETS = [', 'var SUJETS = globalThis.__S = [']]);
  const sujets = context.__S;
  if (!sujets) throw new Error('Capture de SUJETS échouée (production.js).');

  run(context, 'gamification.js', [['var ETUDES = {', 'var ETUDES = globalThis.__E = {']]);
  const etudes = context.__E;
  if (!etudes) throw new Error('Capture de ETUDES échouée (gamification.js).');

  return { questions, etudes, sujets, errors: context.__lastError || {} };
}
