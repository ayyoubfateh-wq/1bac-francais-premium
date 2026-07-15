/* Faux navigateur minimal pour exécuter les moteurs client dans Node.
   Ce n'est PAS un vrai navigateur : juste assez de surface (DOM,
   localStorage, sélecteurs simples, timers contrôlés) pour que les
   moteurs tournent et que les tests observent leurs effets.

   Choix clé : les moteurs partagent des `let` de portée globale
   (qs/cur/score de app.js). Pour le reproduire, le loader concatène
   tous les fichiers en UN SEUL script vm (mêmes bindings lexicaux). */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { webcrypto } from 'node:crypto';

export function createFakeBrowser() {
  const byId = new Map();
  const all = new Set(); // tous les éléments connus (pour querySelectorAll)

  function makeClassList() {
    const set = new Set();
    const api = {
      add: (...cs) => cs.forEach((c) => c && set.add(c)),
      remove: (...cs) => cs.forEach((c) => set.delete(c)),
      toggle: (c, force) => {
        const on = force !== undefined ? force : !set.has(c);
        if (on) set.add(c); else set.delete(c);
        return on;
      },
      contains: (c) => set.has(c),
      _set,
      _all: () => [...set],
    };
    function _set(className) {
      set.clear();
      String(className || '').split(/\s+/).filter(Boolean).forEach((c) => set.add(c));
    }
    return api;
  }

  function makeElement(tag, id) {
    const el = {
      tagName: String(tag || 'div').toUpperCase(),
      id: id || '',
      children: [],
      parent: null,
      style: {},
      dataset: {},
      value: '',
      disabled: false,
      onclick: null,
      textContent: '',
      _innerHTML: '',
      attrs: {},
      _className: '',
    };
    el.classList = makeClassList();
    Object.defineProperty(el, 'className', {
      get() { return el._className; },
      set(v) { el._className = String(v); el.classList._set(v); },
    });
    Object.defineProperty(el, 'innerHTML', {
      get() { return el._innerHTML; },
      set(v) {
        el._innerHTML = String(v);
        for (const c of el.children) { c.parent = null; all.delete(c); }
        el.children = [];
        // parse minimal : enregistre les éléments porteurs d'un id ou de
        // data-* pour que getElementById / querySelectorAll fonctionnent
        // sur les UI construites via innerHTML (atelier de production).
        parseInto(el, el._innerHTML);
      },
    });
    el.setAttribute = (k, v) => {
      el.attrs[k] = String(v);
      if (k === 'class') el.className = v;
      if (k === 'id') { el.id = String(v); byId.set(el.id, el); }
      if (k.startsWith('data-')) el.dataset[k.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = String(v);
    };
    el.getAttribute = (k) => (k in el.attrs ? el.attrs[k] : (k === 'class' ? el.className : null));
    el.hasAttribute = (k) => k in el.attrs || (k === 'class' && !!el._className);
    el.removeAttribute = (k) => { delete el.attrs[k]; if (k === 'class') el.className = ''; };
    el.appendChild = (c) => { c.parent = el; el.children.push(c); all.add(c); if (c.id) byId.set(c.id, c); return c; };
    el.insertBefore = (c, ref) => {
      c.parent = el; all.add(c); if (c.id) byId.set(c.id, c);
      const i = ref ? el.children.indexOf(ref) : -1;
      if (i === -1) el.children.push(c); else el.children.splice(i, 0, c);
      return c;
    };
    el.removeChild = (c) => { const i = el.children.indexOf(c); if (i > -1) el.children.splice(i, 1); c.parent = null; all.delete(c); return c; };
    el.remove = () => { if (el.parent) el.parent.removeChild(el); };
    el.click = () => { if (typeof el.onclick === 'function') el.onclick({ target: el }); };
    el.focus = () => {};
    el.addEventListener = (ev, fn) => { if (ev === 'click') el.onclick = fn; el['on' + ev] = fn; };
    el.getBoundingClientRect = () => ({ left: 0, top: 0, width: 0, height: 0, right: 0, bottom: 0 });
    el.querySelector = (sel) => querySelectorAll(sel, el)[0] || null;
    el.querySelectorAll = (sel) => querySelectorAll(sel, el);
    el.closest = () => null;
    all.add(el);
    return el;
  }

  /* Enregistre les balises d'un fragment innerHTML porteuses d'un id, d'une
     classe ou d'un data-* (suffisant pour piloter les UI construites en
     innerHTML). Ne reconstruit pas l'arbre complet : les éléments créés
     sont rattachés au conteneur comme enfants directs. */
  function parseInto(container, html) {
    const tagRe = /<([a-zA-Z][a-zA-Z0-9]*)\b([^>]*)>/g;
    let m;
    while ((m = tagRe.exec(html)) !== null) {
      const tag = m[1];
      const attrs = m[2];
      if (tag === 'br' || tag === 'hr' || tag === 'meta') continue;
      const idM = attrs.match(/\bid="([^"]+)"/);
      const clsM = attrs.match(/\bclass="([^"]+)"/);
      const dataMs = [...attrs.matchAll(/\b(data-[a-z-]+)="([^"]*)"/g)];
      if (!idM && !dataMs.length && !(clsM && /\b(opt|g-[a-z-]+)\b/.test(clsM[1]))) continue;
      const child = makeElement(tag, idM ? idM[1] : '');
      if (clsM) child.className = clsM[1];
      for (const d of dataMs) child.setAttribute(d[1], d[2]);
      const typeM = attrs.match(/\btype="([^"]+)"/);
      if (typeM) child.attrs.type = typeM[1];
      container.appendChild(child);
    }
  }

  /* ---- sélecteurs simples : #id, .classe, tag, listes « a,b » et
       descendance « #scope .classe ». Suffisant pour les moteurs. ---- */
  function matchesSimple(el, tok) {
    tok = tok.trim();
    if (!tok) return false;
    if (tok.startsWith('.')) return el.classList.contains(tok.slice(1));
    if (tok.startsWith('#')) return el.id === tok.slice(1);
    // attribut data : [data-x] (existence) ou [data-x="valeur"]
    function attrMatch(el2, attrTok) {
      const a = attrTok.match(/^\[data-([a-z-]+)(?:="([^"]*)")?\]$/);
      if (!a) return false;
      const key = a[1].replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      if (!(key in el2.dataset)) return false;
      return a[2] === undefined || el2.dataset[key] === a[2];
    }
    if (tok.startsWith('[')) return attrMatch(el, tok);
    const m = tok.match(/^([a-zA-Z]+)(\[data-[^\]]+\])?$/);
    if (m) {
      if (el.tagName !== m[1].toUpperCase()) return false;
      return m[2] ? attrMatch(el, m[2]) : true;
    }
    return false;
  }
  function hasAncestorMatching(el, tok) {
    let p = el.parent;
    while (p) { if (matchesSimple(p, tok)) return true; p = p.parent; }
    return false;
  }
  function querySelectorAll(selector, root) {
    const pool = [...all];
    const out = [];
    const seen = new Set();
    for (const part of String(selector).split(',')) {
      const toks = part.trim().split(/\s+/).filter(Boolean);
      if (!toks.length) continue;
      const last = toks[toks.length - 1];
      const ancestors = toks.slice(0, -1);
      for (const el of pool) {
        if (seen.has(el)) continue;
        if (root && !isDescendant(el, root)) continue;
        if (!matchesSimple(el, last)) continue;
        if (ancestors.every((a) => hasAncestorMatching(el, a))) { out.push(el); seen.add(el); }
      }
    }
    return out;
  }
  function isDescendant(el, root) {
    let p = el.parent;
    while (p) { if (p === root) return true; p = p.parent; }
    return false;
  }

  /* ---- timers contrôlés (déterministes) ---- */
  const timers = [];
  const setTimeoutFake = (fn, delay) => { timers.push({ fn, delay: delay || 0 }); return timers.length; };
  const setIntervalFake = () => 0; // pas d'intervalle en test
  function runTimers(maxRounds = 50) {
    let rounds = 0;
    while (timers.length && rounds++ < maxRounds) {
      const batch = timers.splice(0).sort((a, b) => a.delay - b.delay);
      for (const t of batch) { try { t.fn(); } catch (e) { /* remonte via test */ throw e; } }
    }
  }

  /* ---- documentElement / body ---- */
  const documentElement = makeElement('html', '');
  const body = makeElement('body', '');
  documentElement.appendChild(body);

  const listeners = {};
  const doc = {
    documentElement, body,
    title: '',
    readyState: 'complete',
    getElementById: (id) => byId.get(id) || null,
    createElement: (t) => makeElement(t),
    querySelector: (s) => querySelectorAll(s)[0] || null,
    querySelectorAll: (s) => querySelectorAll(s),
    addEventListener: (ev, fn) => { (listeners[ev] = listeners[ev] || []).push(fn); },
  };

  function store() {
    const m = new Map();
    return {
      getItem: (k) => (m.has(k) ? m.get(k) : null),
      setItem: (k, v) => m.set(k, String(v)),
      removeItem: (k) => m.delete(k),
      clear: () => m.clear(),
      _map: m,
    };
  }

  let fetchImpl = async () => { throw new Error('fetch non configuré'); };

  const win = {
    document: doc,
    localStorage: store(),
    sessionStorage: store(),
    location: { href: 'http://localhost/', reload: () => {} },
    navigator: { userAgent: 'node-test', serviceWorker: undefined },
    // headless = mouvement réduit → les moteurs sautent confetti/animations
    matchMedia: (q) => ({ matches: /reduce/.test(String(q)), addEventListener() {}, addListener() {} }),
    requestAnimationFrame: () => 0,
    cancelAnimationFrame: () => {},
    setTimeout: setTimeoutFake,
    clearTimeout: () => {},
    setInterval: setIntervalFake,
    clearInterval: () => {},
    scrollTo: () => {},
    scrollBy: () => {},
    alert: () => {},
    confirm: () => true,
    AudioContext: function () { return audioStub(); },
    webkitAudioContext: function () { return audioStub(); },
    crypto: webcrypto,
    addEventListener: (ev, fn) => { (listeners[ev] = listeners[ev] || []).push(fn); },
    console,
    fetch: (...a) => fetchImpl(...a),
    PF_DATA: undefined,
  };
  win.window = win;
  win.self = win;
  win.globalThis = win;
  win.top = win;

  function audioStub() {
    const node = { connect() {}, start() {}, stop() {}, frequency: { value: 0, setValueAtTime() {} }, gain: { value: 0, setValueAtTime() {}, linearRampToValueAtTime() {}, exponentialRampToValueAtTime() {} }, type: '' };
    return { currentTime: 0, destination: {}, createOscillator: () => node, createGain: () => node };
  }

  function fireDOMContentLoaded() {
    for (const fn of listeners.DOMContentLoaded || []) fn();
  }
  function setFetch(fn) { fetchImpl = fn; }

  /* ---- charge les moteurs (un seul script → bindings lexicaux partagés) ---- */
  let ctx = null;
  function loadEngines(rootDir, files) {
    const code = files.map((f) => fs.readFileSync(path.join(rootDir, f), 'utf8')).join('\n;\n');
    ctx = vm.createContext(win);
    vm.runInContext(code, ctx, { filename: 'engines-concat.js' });
    return ctx;
  }
  /* lit un binding lexical (let/const de portée script, ex. qs/cur/score),
     invisible sur window mais accessible dans le contexte vm */
  function evalIn(expr) { return vm.runInContext(expr, ctx); }

  return { window: win, document: doc, body, documentElement, runTimers, fireDOMContentLoaded, setFetch, loadEngines, evalIn, querySelectorAll };
}
