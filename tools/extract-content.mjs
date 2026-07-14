/* Extraction du contenu vers la couche de données (assets/data/).
   Copie-machine depuis la source actuelle (aucune recopie manuelle) :
   les fichiers générés sont, par construction, identiques au contenu en
   production. Format JSON lisible → éditable à la main ensuite.

   Usage : node tools/extract-content.mjs
*/
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadContent } from './load-content.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA = path.join(ROOT, 'assets', 'data');
fs.mkdirSync(DATA, { recursive: true });

const { questions, etudes, sujets } = loadContent();

function write(file, header, assign, value) {
  const body = JSON.stringify(value, null, 2);
  const out = `/* ${header}\n   Source unique de vérité. Après toute modification : \`npm run validate\`. */\n` +
    `window.PF_DATA = window.PF_DATA || {};\n` +
    `${assign} = ${body};\n`;
  fs.writeFileSync(path.join(DATA, file), out, 'utf8');
  return out.length;
}

const n1 = write('questions.js',
  'Contenu — QCM par œuvre. « ans » = index de la bonne réponse (0 = 1re option).',
  'window.PF_DATA.questions', questions);

const n2 = write('etudes.js',
  'Contenu — Études de texte (support + 5 questions). Une tirée au hasard par tentative.',
  'window.PF_DATA.etudes', etudes);

const n3 = write('sujets.js',
  'Contenu — Sujets de production écrite + réponses modèles.',
  'window.PF_DATA.sujets', sujets);

console.log('Fichiers générés dans assets/data/ :');
console.log('  questions.js', n1, 'octets');
console.log('  etudes.js   ', n2, 'octets');
console.log('  sujets.js   ', n3, 'octets');
