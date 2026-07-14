/* Découpage du monolithe index.html en fragments éditables (src/html/).
   PARTITION SANS PERTE : chaque fragment est une tranche contiguë du fichier
   original ; la concaténation des fragments (dans l'ordre du manifest) est
   identique au bit près, par construction. Aucun contenu réécrit.

   Usage : node tools/split-html.mjs   (one-shot de migration)
*/
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'src', 'html');
const ECRANS = path.join(SRC, 'ecrans');
fs.mkdirSync(ECRANS, { recursive: true });

const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

/* ---- points de coupe ---- */
function idxOf(needle, from = 0) {
  const i = html.indexOf(needle, from);
  if (i === -1) throw new Error(`Frontière introuvable : « ${needle} »`);
  return i;
}

const cutLock = idxOf('<div id="premiumLockScreen"');
const cutShellTop = idxOf('<a class="skip-link"');
const cutAppEnd = idxOf('</div><!-- /app -->');

// tous les marqueurs de section (dans l'ordre)
const sectionCuts = [];
const re = /<!-- SECTION : /g;
let m;
while ((m = re.exec(html)) !== null) sectionCuts.push(m.index);
if (!sectionCuts.length) throw new Error('Aucun marqueur SECTION trouvé');
if (sectionCuts[0] <= cutShellTop || sectionCuts[sectionCuts.length - 1] >= cutAppEnd) {
  throw new Error('Marqueurs SECTION hors de la zone attendue');
}

/* ---- nom de chaque écran = id du <div class="screen"> qui suit ---- */
function screenName(fromIdx, toIdx) {
  const slice = html.slice(fromIdx, toIdx);
  const mm = slice.match(/<div id="([a-z-]+)" class="screen/);
  if (!mm) throw new Error(`Écran sans <div id class="screen"> après l'index ${fromIdx}`);
  return mm[1];
}

/* ---- construit la partition ---- */
const fragments = [];
fragments.push({ file: '00-tete.html', from: 0, to: cutLock });
fragments.push({ file: '10-verrou-premium.html', from: cutLock, to: cutShellTop });
fragments.push({ file: '20-coque-haut.html', from: cutShellTop, to: sectionCuts[0] });
for (let i = 0; i < sectionCuts.length; i++) {
  const from = sectionCuts[i];
  const to = i + 1 < sectionCuts.length ? sectionCuts[i + 1] : cutAppEnd;
  const name = screenName(from, to);
  const num = String(i + 1).padStart(2, '0');
  fragments.push({ file: `ecrans/${num}-${name}.html`, from, to });
}
fragments.push({ file: '90-coque-bas.html', from: cutAppEnd, to: html.length });

/* ---- vérifie la partition (contiguë, sans trou ni chevauchement) ---- */
let cursor = 0;
for (const f of fragments) {
  if (f.from !== cursor) throw new Error(`Trou/chevauchement avant ${f.file} (attendu ${cursor}, trouvé ${f.from})`);
  cursor = f.to;
}
if (cursor !== html.length) throw new Error('La partition ne couvre pas tout le fichier');

/* ---- écrit fragments + manifest ---- */
for (const f of fragments) {
  fs.writeFileSync(path.join(SRC, f.file), html.slice(f.from, f.to), 'utf8');
}
fs.writeFileSync(path.join(SRC, 'manifest.json'),
  JSON.stringify({
    note: 'Ordre d\'assemblage de index.html — géré par tools/build-html.mjs. Ne pas réordonner sans raison.',
    fragments: fragments.map((f) => f.file),
  }, null, 2) + '\n', 'utf8');

console.log('Partition écrite dans src/html/ :');
for (const f of fragments) console.log('  ' + f.file.padEnd(34) + (f.to - f.from) + ' octets');
console.log('Total : ' + html.length + ' octets (couverture complète vérifiée)');
