/* Sauvegarde des données serveur (Netlify Blobs) → JSON horodaté local.
   Exporte les 4 stores de production : progressions des élèves, liaisons
   code↔appareils, classement, statistiques. À lancer régulièrement :
   npm run backup   (les sauvegardes vont dans backups/, hors git).

   Nécessite : être connecté au projet (`netlify link` déjà fait) et
   disposer d'un jeton (NETLIFY_AUTH_TOKEN ou session `netlify login`). */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getStore } from '@netlify/blobs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const STORES = ['progress', 'premium-devices', 'leaderboard', 'stats-events'];

/* Identifiants du site : depuis l'environnement, sinon depuis .netlify/state.json */
function siteConfig() {
  let siteID = process.env.NETLIFY_SITE_ID || process.env.SITE_ID || '';
  let token = process.env.NETLIFY_AUTH_TOKEN || process.env.NETLIFY_API_TOKEN || '';
  if (!siteID) {
    try {
      const state = JSON.parse(fs.readFileSync(path.join(ROOT, '.netlify', 'state.json'), 'utf8'));
      siteID = state.siteId || '';
    } catch (_) { /* ignore */ }
  }
  if (!token) {
    // jeton de la session Netlify CLI (emplacements selon l'OS)
    const home = process.env.USERPROFILE || process.env.HOME || '';
    const appdata = process.env.APPDATA || path.join(home, 'AppData', 'Roaming');
    const xdg = process.env.XDG_CONFIG_HOME || path.join(home, '.config');
    const candidates = [
      path.join(appdata, 'netlify', 'Config', 'config.json'), // Windows
      path.join(xdg, 'netlify', 'config.json'),               // Linux
      path.join(home, 'Library', 'Preferences', 'netlify', 'config.json'), // macOS
      path.join(home, '.netlify', 'config.json'),
    ];
    for (const p of candidates) {
      try {
        const cfg = JSON.parse(fs.readFileSync(p, 'utf8'));
        const users = cfg.users || {};
        for (const id of Object.keys(users)) {
          const t = users[id] && users[id].auth && users[id].auth.token;
          if (t) { token = t; break; }
        }
        if (token) break;
      } catch (_) { /* ignore */ }
    }
  }
  return { siteID, token };
}

async function dumpStore(name, cfg) {
  const store = getStore({ name, siteID: cfg.siteID, token: cfg.token });
  const entries = {};
  let cursor;
  let n = 0;
  do {
    const page = await store.list({ cursor });
    for (const b of page.blobs) {
      const raw = await store.get(b.key);
      try { entries[b.key] = JSON.parse(raw); }
      catch (_) { entries[b.key] = raw; }
      n++;
    }
    cursor = page.cursor;
  } while (cursor);
  return { count: n, entries };
}

async function main() {
  const cfg = siteConfig();
  if (!cfg.siteID || !cfg.token) {
    console.error('❌ Site ou jeton introuvable. Lancez `npx netlify-cli login` puis `npx netlify-cli link`,');
    console.error('   ou définissez NETLIFY_SITE_ID et NETLIFY_AUTH_TOKEN.');
    process.exit(1);
  }

  const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const dir = path.join(ROOT, 'backups', stamp);
  fs.mkdirSync(dir, { recursive: true });

  const resume = { date: new Date().toISOString(), site: cfg.siteID, stores: {} };
  let total = 0;
  for (const name of STORES) {
    try {
      const dump = await dumpStore(name, cfg);
      fs.writeFileSync(path.join(dir, name + '.json'), JSON.stringify(dump.entries, null, 0), 'utf8');
      resume.stores[name] = dump.count;
      total += dump.count;
      console.log(`  ✓ ${name.padEnd(16)} ${dump.count} entrée(s)`);
    } catch (e) {
      resume.stores[name] = 'ERREUR: ' + e.message;
      console.error(`  ✗ ${name.padEnd(16)} ${e.message}`);
    }
  }
  fs.writeFileSync(path.join(dir, '_resume.json'), JSON.stringify(resume, null, 2), 'utf8');

  console.log(`\n✅ Sauvegarde écrite dans backups/${stamp}/ (${total} entrées au total).`);
}

main().catch((e) => { console.error('❌ Échec de la sauvegarde :', e.message); process.exit(1); });
