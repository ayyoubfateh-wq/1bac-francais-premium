/* Runner de tests maison — aucune dépendance.
   Exécute les suites serveur puis client. Sortie non nulle si un test
   échoue ⇒ `npm test` casse le déploiement (voir netlify.toml). */
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { results } from './harness.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SUITES = ['server.test.mjs', 'client.test.mjs'];

for (const s of SUITES) {
  const mod = await import(pathToFileURL(path.join(ROOT, 'tests', s)).href);
  if (typeof mod.run === 'function') await mod.run();
}

const { passed, failed } = results();
console.log(`\n${'─'.repeat(48)}`);
if (failed === 0) {
  console.log(`✅ ${passed} tests passés — moteur validé.`);
  process.exit(0);
} else {
  console.log(`❌ ${failed} échec(s) sur ${passed + failed} tests.`);
  process.exit(1);
}
