/* ============================================================================
   CORPUS DES EXAMENS RÉGIONAUX RÉELS — inventaire et téléchargement

   Les sujets régionaux sont archivés publiquement sur AlloSchool, sous forme
   de PDF SCANNÉS (aucun texte extractible : ce sont des images). Les lire
   demande de les ouvrir page par page — c'est le coût réel de l'opération,
   et c'est pourquoi on travaille par lots.

   Ce que fait cet outil :
     --inventaire   recense tous les sujets et corrigés disponibles,
                    écrit tools/corpus-annales.json (année, région, session,
                    URL du PDF). Aucun téléchargement.
     --telecharge   récupère les PDF manquants dans corpus/ (hors dépôt).
     --etat         dit où en est le dépouillement.

   Options :  --annee=2024   --limite=8   --type=sujet|corrige

   AVERTISSEMENT SUR LES CHIFFRES. On lit parfois qu'il existerait
   « 23 ans × 12 régions × 2 sessions = 552 » sujets. Le calcul ne tient pas :
   le découpage en 12 régions date de 2015 — avant, le Maroc en comptait 16 —
   et toutes les régions n'ont pas produit ni publié une session de rattrapage
   chaque année. Ce qui existe réellement en ligne est recensé ici, et c'est
   ce nombre-là, vérifiable, que la plateforme doit afficher.
============================================================================ */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const JSON_PATH = path.join(ROOT, 'tools', 'corpus-annales.json');
const PDF_DIR = path.join(ROOT, 'corpus');

/* Les deux pages d'archives d'AlloSchool pour le français de 1re bac. */
const SECTIONS = [
  { id: '694', periode: '2008-2016', note: 'ancien découpage régional, programme antérieur' },
  { id: '5861', periode: '2017-2024', note: 'cadre de référence actuel' },
];

const UA = 'Mozilla/5.0 (compatible; PlayBacCorpus/1.0; +https://play-bac.com)';
const arg = (nom, def) => {
  const a = process.argv.find((x) => x.startsWith('--' + nom + '='));
  return a ? a.split('=')[1] : def;
};

async function texte(url) {
  const r = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!r.ok) throw new Error(url + ' → HTTP ' + r.status);
  return r.text();
}

/* ------------------------------------------------------------- inventaire */
function analyseTitre(titre) {
  const annee = (titre.match(/\b(20\d\d)\b/) || [])[1] || null;
  const session = /rattrapage/i.test(titre) ? 'rattrapage'
    : /normale/i.test(titre) ? 'normale' : null;
  const type = /corrig/i.test(titre) ? 'corrige'
    : /sujet|énonc|enonc/i.test(titre) ? 'sujet' : null;
  const region = titre
    .replace(/Examen\s+r[ée]gional\s+Fran[çc]ais/i, '')
    .replace(/\(Session[^)]*\)/ig, '')
    .replace(/[-–]\s*(Sujet|Corrig[ée]|Énonc[ée]|Enonc[ée])\s*$/i, '')
    .replace(/\b20\d\d\b/, '')
    .replace(/[-–()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim() || null;
  return { annee, session, type, region };
}

async function inventaire() {
  const vus = new Map();
  for (const s of SECTIONS) {
    const html = await texte('https://www.alloschool.com/section/' + s.id);
    const re = /href="(?:https:\/\/www\.alloschool\.com)?\/element\/(\d+)"[^>]*>([\s\S]{0,400}?)<\/a>/g;
    let m;
    while ((m = re.exec(html))) {
      const titre = m[2].replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ').trim();
      if (!titre || vus.has(m[1])) continue;
      if (!/examen|r[ée]gional/i.test(titre)) continue;
      vus.set(m[1], { id: m[1], titre, periode: s.periode, ...analyseTitre(titre) });
    }
    console.log('  section ' + s.id + ' (' + s.periode + ') : ' + vus.size + ' entrées cumulées');
  }

  /* l'URL du PDF n'est pas sur la page d'archive : elle est sur la fiche */
  const items = [...vus.values()];
  console.log('\n  résolution des URL de PDF (' + items.length + ' fiches)…');
  let ok = 0;
  for (const it of items) {
    try {
      const page = await texte('https://www.alloschool.com/element/' + it.id);
      const pdf = (page.match(/https?:\/\/[^"'\s]*\.pdf/) || [])[0];
      if (pdf) { it.pdf = pdf; ok++; }
    } catch (e) { it.erreur = e.message; }
    if (ok % 20 === 0 && ok) process.stdout.write('    ' + ok + ' résolues\n');
  }

  fs.writeFileSync(JSON_PATH, JSON.stringify({ releveLe: new Date().toISOString().slice(0, 10), items }, null, 1));
  rapport(items);
  console.log('\n  écrit : tools/corpus-annales.json');
}

/* -------------------------------------------------------------- rapport */
function rapport(items) {
  const sujets = items.filter((i) => i.type === 'sujet');
  const corriges = items.filter((i) => i.type === 'corrige');
  console.log('\n  CORPUS RÉELLEMENT DISPONIBLE');
  console.log('  ' + '-'.repeat(46));
  console.log('  sujets   : ' + sujets.length);
  console.log('  corrigés : ' + corriges.length);
  console.log('  avec PDF résolu : ' + items.filter((i) => i.pdf).length);

  const parAn = {};
  sujets.forEach((s) => { parAn[s.annee || '?'] = (parAn[s.annee || '?'] || 0) + 1; });
  console.log('\n  sujets par année :');
  Object.keys(parAn).sort().forEach((a) => console.log('    ' + a + ' : ' + String(parAn[a]).padStart(2) + '  ' + '█'.repeat(parAn[a])));
}

/* --------------------------------------------------------- téléchargement */
async function telecharge() {
  if (!fs.existsSync(JSON_PATH)) { console.error('❌ Lance d’abord --inventaire'); process.exit(1); }
  const { items } = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
  fs.mkdirSync(PDF_DIR, { recursive: true });

  const annee = arg('annee', null);
  const type = arg('type', null);
  const limite = parseInt(arg('limite', '10'), 10);

  const cible = items
    .filter((i) => i.pdf)
    .filter((i) => !annee || i.annee === annee)
    .filter((i) => !type || i.type === type)
    .sort((a, b) => String(b.annee).localeCompare(String(a.annee))) // les plus récents d'abord
    .filter((i) => !fs.existsSync(path.join(PDF_DIR, nomFichier(i))))
    .slice(0, limite);

  console.log('  à télécharger : ' + cible.length);
  for (const it of cible) {
    const dest = path.join(PDF_DIR, nomFichier(it));
    try {
      const r = await fetch(it.pdf, { headers: { 'User-Agent': UA } });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      fs.writeFileSync(dest, Buffer.from(await r.arrayBuffer()));
      console.log('    ✓ ' + path.basename(dest) + '  (' + Math.round(fs.statSync(dest).size / 1024) + ' Ko)');
    } catch (e) {
      console.log('    ✗ ' + path.basename(dest) + ' : ' + e.message);
    }
  }
}

function nomFichier(i) {
  const propre = (s) => String(s || 'inconnu').normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return [i.annee || 'xxxx', propre(i.region), i.session || 'session', i.type || 'doc'].join('_') + '.pdf';
}

/* --------------------------------------------------------------- état */
function etat() {
  if (!fs.existsSync(JSON_PATH)) { console.error('❌ Lance d’abord --inventaire'); process.exit(1); }
  const { items, releveLe } = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
  console.log('  relevé le ' + releveLe);
  rapport(items);
  const telecharges = fs.existsSync(PDF_DIR) ? fs.readdirSync(PDF_DIR).filter((f) => f.endsWith('.pdf')).length : 0;
  console.log('\n  PDF téléchargés localement : ' + telecharges);
  console.log('  (le dépouillement se fait ensuite à la lecture : ces PDF sont des scans)');
}

const mode = process.argv.find((a) => ['--inventaire', '--telecharge', '--etat'].includes(a));
if (mode === '--inventaire') await inventaire();
else if (mode === '--telecharge') await telecharge();
else if (mode === '--etat') etat();
else {
  console.log('Usage : node tools/corpus-annales.mjs --inventaire | --telecharge | --etat');
  console.log('Options : --annee=2024 --type=sujet|corrige --limite=8');
}
