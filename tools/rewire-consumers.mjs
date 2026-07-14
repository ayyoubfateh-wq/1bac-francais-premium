/* Rewire — retire les données inline des consommateurs et les fait lire
   depuis window.PF_DATA (couche de données). Appariement de crochets
   sensible aux chaînes : on retire EXACTEMENT le littéral, rien d'autre.
   Idempotent : ne fait rien si déjà rewiré.

   Usage : node tools/rewire-consumers.mjs
*/
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const JS = (f) => path.join(ROOT, 'assets', 'js', f);

const OPENERS = { '{': '}', '[': ']' };
const CLOSERS = { '}': '{', ']': '[' };

/* Trouve l'index de la fermeture appariée du crochet ouvrant à openIdx,
   en ignorant les crochets à l'intérieur des chaînes ' " ` (avec échappements). */
function matchBracket(src, openIdx) {
  const stack = [src[openIdx]];
  let i = openIdx + 1;
  let str = null; // guillemet courant
  while (i < src.length && stack.length) {
    const c = src[i];
    if (str) {
      if (c === '\\') { i += 2; continue; }
      if (c === str) str = null;
    } else if (c === '"' || c === "'" || c === '`') {
      str = c;
    } else if (OPENERS[c]) {
      stack.push(c);
    } else if (CLOSERS[c]) {
      if (stack[stack.length - 1] !== CLOSERS[c]) throw new Error(`Crochet mal apparié à l'index ${i}`);
      stack.pop();
    }
    i++;
  }
  if (stack.length) throw new Error('Fermeture introuvable');
  return i - 1; // index du crochet fermant
}

function rewire(file, marker, replacement) {
  const p = JS(file);
  let src = fs.readFileSync(p, 'utf8');
  if (src.includes(replacement)) { console.log(`  ${file} : déjà rewiré, ignoré`); return; }
  const start = src.indexOf(marker);
  if (start === -1) throw new Error(`Marqueur introuvable dans ${file} : « ${marker} »`);
  const openIdx = start + marker.length;
  const openChar = src[openIdx];
  if (!OPENERS[openChar]) throw new Error(`${file} : « ${openChar} » n'est pas un crochet ouvrant après le marqueur`);
  const closeIdx = matchBracket(src, openIdx);
  // après la fermeture : espaces puis ';'
  let j = closeIdx + 1;
  while (j < src.length && /\s/.test(src[j])) j++;
  if (src[j] !== ';') throw new Error(`${file} : « ; » attendu après le littéral`);
  const before = src.slice(0, start);
  const after = src.slice(j + 1);
  const removed = j + 1 - start;
  src = before + replacement + after;
  fs.writeFileSync(p, src, 'utf8');
  const lineStart = before.split('\n').length;
  console.log(`  ${file} : littéral retiré (${removed} octets, à partir de la ligne ${lineStart}) → lecture depuis window.PF_DATA`);
}

rewire('app.js', 'const QUESTIONS = ',
  "const QUESTIONS = (typeof window !== 'undefined' && window.PF_DATA && window.PF_DATA.questions) ? window.PF_DATA.questions : {};");
rewire('gamification.js', 'var ETUDES = ',
  "var ETUDES = (typeof window !== 'undefined' && window.PF_DATA && window.PF_DATA.etudes) ? window.PF_DATA.etudes : {};");
rewire('production.js', 'var SUJETS = ',
  "var SUJETS = (typeof window !== 'undefined' && window.PF_DATA && window.PF_DATA.sujets) ? window.PF_DATA.sujets : [];");

console.log('Rewire terminé.');
