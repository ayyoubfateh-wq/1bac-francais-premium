/* Chargeur de contenu — lit la couche de données (assets/data/*.js),
   source unique de vérité du contenu pédagogique. Pur données : on évalue
   les fichiers dans un contexte minimal et on capture window.PF_DATA.
   Sert au validateur (tools/validate-content.mjs).
*/
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA = (f) => path.join(ROOT, 'assets', 'data', f);

export function loadContent() {
  const ctx = { window: {} };
  ctx.globalThis = ctx;
  vm.createContext(ctx);
  for (const f of ['questions.js', 'etudes.js', 'sujets.js', 'annales.js']) {
    let src;
    try {
      src = fs.readFileSync(DATA(f), 'utf8');
    } catch (e) {
      throw new Error(`Fichier de données introuvable : assets/data/${f}`);
    }
    try {
      vm.runInContext(src, ctx, { filename: f, timeout: 5000 });
    } catch (e) {
      throw new Error(`Erreur de syntaxe dans assets/data/${f} : ${e.message}`);
    }
  }
  const D = ctx.window.PF_DATA || {};
  if (!D.questions) throw new Error('assets/data/questions.js n\'a pas défini window.PF_DATA.questions');
  if (!D.etudes) throw new Error('assets/data/etudes.js n\'a pas défini window.PF_DATA.etudes');
  if (!D.sujets) throw new Error('assets/data/sujets.js n\'a pas défini window.PF_DATA.sujets');
  return { questions: D.questions, etudes: D.etudes, sujets: D.sujets, annales: D.annales, errors: {} };
}
