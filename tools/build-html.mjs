/* Assemblage de index.html depuis les fragments src/html/ (le mini-build).
   index.html est un ARTEFACT GÉNÉRÉ : on édite les fragments, jamais lui.

   Vérifications post-assemblage (échec = pas de mise en ligne) :
   - un seul doctype, présence de </html>
   - les 15+ écrans attendus présents (id + class="screen")
   - la couche de données (PF_DATA) chargée AVANT les moteurs

   Usage : node tools/build-html.mjs   (ou : npm run build)
*/
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'src', 'html');

const manifest = JSON.parse(fs.readFileSync(path.join(SRC, 'manifest.json'), 'utf8'));
if (!Array.isArray(manifest.fragments) || !manifest.fragments.length) {
  console.error('❌ manifest.json invalide (aucun fragment)');
  process.exit(1);
}

let out = '';
for (const f of manifest.fragments) {
  const p = path.join(SRC, f);
  if (!fs.existsSync(p)) { console.error(`❌ Fragment manquant : src/html/${f}`); process.exit(1); }
  out += fs.readFileSync(p, 'utf8');
}

/* ---- vérifications d'assemblage ---- */
const errors = [];
const doctypes = (out.match(/<!DOCTYPE/gi) || []).length;
if (doctypes !== 1) errors.push(`doctype attendu 1 fois, trouvé ${doctypes}`);
if (!/<\/html>\s*$/.test(out)) errors.push('</html> final manquant');

const ECRANS_ATTENDUS = ['parcours', 'production', 'espace', 'home', 'auteurs', 'resumes', 'fiches', 'methode', 'modeles', 'quiz', 'vocabulaire', 'bareme', 'regionaux', 'cadre', 'chat'];
for (const id of ECRANS_ATTENDUS) {
  if (!out.includes(`<div id="${id}" class="screen`)) errors.push(`écran manquant : #${id}`);
}

const iData = out.indexOf('assets/data/questions.js');
const iEngine = out.indexOf('assets/js/app.js');
if (iData === -1) errors.push('couche de données absente (assets/data/questions.js)');
if (iEngine === -1) errors.push('moteur absent (assets/js/app.js)');
if (iData !== -1 && iEngine !== -1 && iData > iEngine) errors.push('la couche de données doit être chargée AVANT les moteurs');

if (errors.length) {
  console.error('❌ Assemblage refusé :');
  for (const e of errors) console.error('   - ' + e);
  process.exit(1);
}

fs.writeFileSync(path.join(ROOT, 'index.html'), out, 'utf8');
console.log(`✅ index.html assemblé : ${out.length} octets, ${manifest.fragments.length} fragments, ${ECRANS_ATTENDUS.length} écrans vérifiés.`);
