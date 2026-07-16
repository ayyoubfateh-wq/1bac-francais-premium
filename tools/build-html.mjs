/* Build du site — v2 (vrai paywall).
   Produit :
   - dist/               : LE SITE PUBLIC (seul dossier publié par Netlify).
                           Coque, vitrine, moteurs, données d'ESSAI uniquement.
   - private/content.json: contenu premium (banque complète + écrans
                           pédagogiques) — incorporé à la fonction
                           /api/content, JAMAIS publié.

   Vérifications (échec = pas de mise en ligne) :
   - doctype unique, </html> final, 15 écrans présents
   - AUCUNE donnée premium dans dist/ (grep de garde)
   - données d'essai limitées à la leçon offerte

   Usage : node tools/build-html.mjs   (ou : npm run build)
*/
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import esbuild from 'esbuild';
import { loadContent } from './load-content.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'src', 'html');
const DIST = path.join(ROOT, 'dist');
const PRIVATE = path.join(ROOT, 'private');

/* Écrans pédagogiques réservés aux membres (extraits du HTML public). */
const ECRANS_PROTEGES = ['auteurs', 'resumes', 'fiches', 'methode', 'modeles', 'vocabulaire', 'bareme', 'regionaux', 'cadre'];
const ECRANS_ATTENDUS = ['parcours', 'production', 'espace', 'home', 'auteurs', 'resumes', 'fiches', 'methode', 'modeles', 'quiz', 'vocabulaire', 'bareme', 'regionaux', 'cadre', 'chat'];

const errors = [];
const err = (m) => errors.push(m);

/* ---------------------------------------------------------- assemblage */
const manifest = JSON.parse(fs.readFileSync(path.join(SRC, 'manifest.json'), 'utf8'));
const screensPrives = {};

function processFragment(file) {
  let html = fs.readFileSync(path.join(SRC, file), 'utf8');
  const m = html.match(/<div id="([a-z-]+)" class="screen/);
  const id = m ? m[1] : null;
  if (id && ECRANS_PROTEGES.includes(id)) {
    const openEnd = html.indexOf('>', html.indexOf('<div id="' + id + '"'));
    const closeStart = html.lastIndexOf('</div>');
    if (openEnd === -1 || closeStart === -1 || closeStart <= openEnd) {
      err(`extraction impossible pour l'écran protégé #${id} (${file})`);
      return html;
    }
    screensPrives[id] = html.slice(openEnd + 1, closeStart);
    const placeholder =
      '\n  <div class="eyebrow">Espace membre</div>\n' +
      '  <div class="heading">Chargement du contenu…</div>\n' +
      '  <p style="font-size:13px;color:rgba(26,16,8,.6);">Le contenu pédagogique s\'affiche après vérification de ton accès. Si ce message persiste, vérifie ta connexion puis recharge la page.</p>\n';
    html = html.slice(0, openEnd + 1) + placeholder + html.slice(closeStart);
  }
  return html;
}

let out = '';
for (const f of manifest.fragments) {
  const p = path.join(SRC, f);
  if (!fs.existsSync(p)) { console.error(`❌ Fragment manquant : src/html/${f}`); process.exit(1); }
  out += processFragment(f);
}

/* --------------------------------------------------- vérifs assemblage */
const doctypes = (out.match(/<!DOCTYPE/gi) || []).length;
if (doctypes !== 1) err(`doctype attendu 1 fois, trouvé ${doctypes}`);
if (!/<\/html>\s*$/.test(out)) err('</html> final manquant');
for (const id of ECRANS_ATTENDUS) {
  if (!out.includes(`<div id="${id}" class="screen`)) err(`écran manquant : #${id}`);
}
for (const id of ECRANS_PROTEGES) {
  if (!screensPrives[id]) err(`écran protégé non extrait : #${id}`);
}
const iData = out.indexOf('assets/data/trial.js');
const iEngine = out.indexOf('assets/js/app.js');
if (iData === -1) err('données d\'essai absentes (assets/data/trial.js)');
if (iEngine === -1) err('moteur absent (assets/js/app.js)');
if (iData !== -1 && iEngine !== -1 && iData > iEngine) err('les données d\'essai doivent être chargées AVANT les moteurs');
if (out.includes('assets/data/questions.js')) err('le HTML public référence la banque complète (interdit)');

/* --------------------------------------------------- contenu premium */
const { questions, etudes, sujets, annales } = loadContent();
const contenu = {
  data: { questions, etudes, sujets, annales, screens: screensPrives },
};
const contenuJson = JSON.stringify(contenu.data);
contenu.version = crypto.createHash('sha256').update(contenuJson).digest('hex').slice(0, 12);

/* --------------------------------------------------- données d'essai
   La leçon offerte = nœud « Contexte & auteur » de La Boîte à Merveilles.
   On ne publie QUE ce pool ; le reste des structures existe, vide. */
const trial = {
  questions: {
    boite: questions.boite.filter((q) => q.cat === 'Contextualisation'),
    antigone: [],
    condamne: [],
  },
  etudes: { boite: [], antigone: [], condamne: [] },
  sujets: [],
};
if (!trial.questions.boite.length) err('essai gratuit vide (aucune question Contextualisation pour boite)');
const trialJs =
  '/* Données d\'ESSAI (leçon offerte) — seules données présentes sur le site\n' +
  '   public. Le contenu complet est servi par /api/content après\n' +
  '   vérification du code. Généré par npm run build. */\n' +
  'window.PF_DATA = window.PF_DATA || {};\n' +
  'window.PF_DATA.questions = ' + JSON.stringify(trial.questions) + ';\n' +
  'window.PF_DATA.etudes = ' + JSON.stringify(trial.etudes) + ';\n' +
  'window.PF_DATA.sujets = ' + JSON.stringify(trial.sujets) + ';\n' +
  'window.PF_DATA.annales = [];\n';

if (errors.length) {
  console.error('❌ Build refusé :');
  for (const e of errors) console.error('   - ' + e);
  process.exit(1);
}

/* --------------------------------------------------------- écriture dist */
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(path.join(DIST, 'assets', 'data'), { recursive: true });
fs.mkdirSync(PRIVATE, { recursive: true });

function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const e of fs.readdirSync(from, { withFileTypes: true })) {
    const s = path.join(from, e.name);
    const d = path.join(to, e.name);
    if (e.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

/* ------------------------------------------------ empreinte du build
   Identifie CE build : sert à versionner les URLs d'assets (?v=…) et le
   cache du service worker. Deux builds différents ⇒ deux empreintes ⇒
   plus jamais de mélange ancien/nouveau dans les navigateurs. */
const FICHIERS_VERSIONNES = [
  'assets/css/style.css',
  'assets/css/gamification.css',
  'assets/data/trial.js',
  'assets/js/app.js',
  'assets/js/gamification.js',
  'assets/js/production.js',
  'assets/js/annales.js',
  'assets/js/content-loader.js',
];
const hBuild = crypto.createHash('sha256').update(out).update(trialJs);
for (const f of FICHIERS_VERSIONNES) {
  const src = path.join(ROOT, f);
  if (fs.existsSync(src)) hBuild.update(fs.readFileSync(src));
}
hBuild.update(fs.readFileSync(path.join(ROOT, 'sw.js')));
const BUILD = hBuild.digest('hex').slice(0, 10);

/* tamponne ?v=BUILD sur chaque référence d'asset du HTML public */
let outStamped = out;
for (const f of FICHIERS_VERSIONNES) {
  outStamped = outStamped.split(`"${f}"`).join(`"${f}?v=${BUILD}"`);
}
for (const f of FICHIERS_VERSIONNES) {
  if (!outStamped.includes(`"${f}?v=${BUILD}"`)) err(`tamponnage de version raté pour ${f}`);
}
if (errors.length) {
  console.error('❌ Build refusé (versionnage) :');
  for (const e of errors) console.error('   - ' + e);
  process.exit(1);
}

fs.writeFileSync(path.join(DIST, 'index.html'), outStamped, 'utf8');
fs.writeFileSync(path.join(DIST, 'assets', 'data', 'trial.js'), trialJs, 'utf8');
copyDir(path.join(ROOT, 'assets', 'css'), path.join(DIST, 'assets', 'css'));
copyDir(path.join(ROOT, 'assets', 'img'), path.join(DIST, 'assets', 'img'));
fs.mkdirSync(path.join(DIST, 'assets', 'js'), { recursive: true });
for (const f of ['app.js', 'gamification.js', 'production.js', 'annales.js', 'content-loader.js']) {
  fs.copyFileSync(path.join(ROOT, 'assets', 'js', f), path.join(DIST, 'assets', 'js', f));
}
/* le service worker reçoit l'empreinte du build (cache dédié + shell versionné) */
const swSrc = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
if (!swSrc.includes('__PF_BUILD__')) { console.error('❌ sw.js sans marqueur __PF_BUILD__'); process.exit(1); }
fs.writeFileSync(path.join(DIST, 'sw.js'), swSrc.split('__PF_BUILD__').join(BUILD), 'utf8');
for (const f of ['manifest.webmanifest', 'gestion-codes.html']) {
  fs.copyFileSync(path.join(ROOT, f), path.join(DIST, f));
}
fs.writeFileSync(path.join(PRIVATE, 'content.json'), JSON.stringify(contenu), 'utf8');

/* ---------------------------------------------------------- minification
   JS et CSS publics uniquement. IMPORTANT : minifyIdentifiers = false —
   on ne renomme AUCUN identifiant. L'architecture repose sur des globaux
   partagés entre fichiers (window.fn, const de portée script comme qs/cur,
   PF_DATA) : les renommer casserait tout. On ne gagne « que » les espaces
   et la syntaxe, ce qui suffit largement sur ces fichiers verbeux.
   Le HTML (déjà léger) et la page admin (avec JS/CSS inline) ne sont pas
   touchés — sécurité avant grammes. */
let avant = 0, apres = 0;
function minify(rel, loader) {
  const p = path.join(DIST, rel);
  const src = fs.readFileSync(p, 'utf8');
  avant += Buffer.byteLength(src);
  let outCode = src;
  try {
    const r = esbuild.transformSync(src, {
      loader,
      minifyWhitespace: true,
      minifySyntax: true,
      minifyIdentifiers: false,
      legalComments: 'none',
      charset: 'utf8',
    });
    outCode = r.code;
  } catch (e) {
    err(`minification échouée (${rel}) : ${e.message}`);
  }
  fs.writeFileSync(p, outCode, 'utf8');
  apres += Buffer.byteLength(outCode);
}
for (const f of ['assets/js/app.js', 'assets/js/gamification.js', 'assets/js/production.js', 'assets/js/annales.js', 'assets/js/content-loader.js', 'assets/data/trial.js', 'sw.js']) {
  minify(f, 'js');
}
for (const f of ['assets/css/style.css', 'assets/css/gamification.css']) {
  minify(f, 'css');
}
if (errors.length) {
  console.error('❌ Build refusé (minification) :');
  for (const e of errors) console.error('   - ' + e);
  process.exit(1);
}

/* ------------------------------------------------- garde anti-fuite
   Scanne le dist/ FINAL (après minification) : aucune chaîne du contenu
   protégé ne doit y apparaître. */
const sonde = [
  '"ans":',                                  // réponses de la banque complète
  screensPrives.resumes.slice(200, 260),     // extrait d'un écran protégé
];
function scanDir(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { scanDir(p); continue; }
    if (!/\.(html|js|json|css|webmanifest)$/.test(e.name)) continue;
    const content = fs.readFileSync(p, 'utf8');
    for (const s of sonde) {
      if (s === '"ans":' && p.endsWith(path.join('data', 'trial.js'))) continue; // l'essai a ses réponses, c'est voulu
      if (content.includes(s)) {
        console.error(`❌ FUITE DÉTECTÉE : « ${s.slice(0, 40)}… » trouvé dans ${path.relative(ROOT, p)}`);
        process.exit(1);
      }
    }
  }
}
scanDir(DIST);

console.log(`✅ Site public assemblé : dist/ (${out.length} caractères, ${manifest.fragments.length} fragments, ${ECRANS_ATTENDUS.length} écrans)`);
console.log(`✅ Contenu premium : private/content.json (version ${contenu.version}) — ${ECRANS_PROTEGES.length} écrans protégés + banque complète`);
console.log(`✅ Essai public limité à ${trial.questions.boite.length} questions (Contexte & auteur, La Boîte à Merveilles)`);
console.log('✅ Garde anti-fuite : aucun contenu premium dans dist/');
console.log(`✅ Minifié JS+CSS : ${(avant / 1024).toFixed(0)} Ko → ${(apres / 1024).toFixed(0)} Ko (−${Math.round(100 * (1 - apres / avant))} %)`);
console.log(`✅ Version du build : ${BUILD} (assets tamponnés + cache SW dédié — fini les versions mélangées)`);
