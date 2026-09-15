/* ============================================================================
   RATTACHEMENT DES QUESTIONS AU PROGRAMME — passe one-shot, relançable

   Ajoute un champ `notion` à chaque question de assets/data/*.js, en le
   déduisant du texte de la question, de ses options et de son explication.

   Principe : on ne devine JAMAIS. Une question n'est rattachée que si un
   marqueur sans ambiguïté apparaît (« métaphore », « discours indirect »,
   « subordonnée de but »…). Le reste est laissé non rattaché et signalé —
   mieux vaut un trou visible qu'une statistique fausse.

   Usage :  node tools/rattache-notions.mjs           (rapport seul)
            node tools/rattache-notions.mjs --ecrire  (écrit les fichiers)
============================================================================ */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA = (f) => path.join(ROOT, 'assets', 'data', f);
const ECRIRE = process.argv.includes('--ecrire');

/* marqueurs → notion. Ordre important : le plus spécifique d'abord, sinon
   « comparaison » attraperait « subordonnée de comparaison ». */
const MARQUEURS = [
  ['gra-comparaison', ['subordonnée de comparaison', 'circonstancielle de comparaison']],
  ['gra-cause', ['subordonnée de cause', 'circonstancielle de cause', 'expression de la cause', 'rapport de cause']],
  ['gra-consequence', ['subordonnée de conséquence', 'circonstancielle de conséquence', 'expression de la conséquence']],
  ['gra-but', ['subordonnée de but', 'circonstancielle de but', 'expression du but']],
  ['gra-temps', ['subordonnée de temps', 'circonstancielle de temps']],
  ['gra-condition', ['hypothèse', 'condition', 'système en si']],
  ['gra-opposition', ['concession', 'opposition']],
  ['gra-relative', ['subordonnée relative', 'proposition relative', 'pronom relatif']],
  ['gra-completive', ['complétive']],
  ['gra-interro-indirecte', ['interrogative indirecte']],
  ['gra-expansion', ['expansion du nom', 'épithète', 'complément du nom', 'apposition']],
  ['gra-passive', ['voix passive', 'voix active', 'tournure passive']],
  ['gra-relief', ['mise en relief']],
  ['gra-negation', ['négation', 'restriction']],
  ['gra-types', ['type de phrase', 'phrase interrogative', 'phrase exclamative', 'phrase injonctive', 'phrase déclarative']],
  ['gra-formes', ['forme de phrase', 'forme emphatique', 'impersonnelle']],
  ['gra-simple-complexe', ['phrase complexe', 'juxtaposition', 'coordination']],

  ['dis-indirect-libre', ['indirect libre']],
  ['dis-narrativise', ['narrativisé']],
  ['dis-direct', ['discours direct']],
  ['dis-indirect', ['discours indirect']],
  ['dis-verbes', ['verbe introducteur', 'verbe de parole']],

  ['fig-comparaison', ['comparaison']],
  ['fig-metaphore', ['métaphore', 'métaphorique']],
  ['fig-personnification', ['personnification', 'personnifi']],
  ['fig-allegorie', ['allégorie']],
  ['fig-hyperbole', ['hyperbole']],
  ['fig-gradation', ['gradation']],
  ['fig-anaphore', ['anaphore']],
  ['fig-accumulation', ['accumulation', 'énumération']],
  ['fig-pleonasme', ['pléonasme']],
  ['fig-euphemisme', ['euphémisme']],
  ['fig-litote', ['litote']],
  ['fig-antithese', ['antithèse']],
  ['fig-oxymore', ['oxymore']],
  ['fig-chiasme', ['chiasme']],
  ['fig-antiphrase', ['antiphrase']],
  ['fig-paradoxe', ['paradoxe']],
  ['fig-metonymie', ['métonymie']],
  ['fig-synecdoque', ['synecdoque']],
  ['fig-periphrase', ['périphrase']],
  ['fig-allitération', ['allitération']],
  ['fig-assonance', ['assonance']],
  ['fig-onomatopee', ['onomatopée']],
  ['fig-parallelisme', ['parallélisme']],

  ['tps-passe-simple', ['passé simple']],
  ['tps-imparfait', ['imparfait']],
  ['tps-plus-que-parfait', ['plus-que-parfait']],
  ['tps-passe-compose', ['passé composé']],
  ['tps-conditionnel', ['conditionnel']],
  ['tps-subjonctif', ['subjonctif']],
  ['tps-imperatif', ['impératif']],
  ['tps-concordance', ['concordance des temps']],
  ['tps-present', ['présent de vérité', 'présent d’énonciation', 'présent de narration', 'valeur du présent']],
  ['tps-futur', ['futur simple', 'futur proche']],

  ['eno-double', ['double énonciation']],
  ['eno-modalisation', ['modalisation', 'modalisateur']],
  ['eno-implicite', ['présupposé', 'sous-entendu', 'implicite']],
  ['eno-embrayeurs', ['embrayeur', 'indice personnel', 'déictique']],
  ['eno-ancre-coupe', ['énoncé ancré', 'énoncé coupé']],
  ['eno-situation', ['situation d’énonciation', "situation d'énonciation"]],
  ['eno-visee', ['visée du texte', 'intention de communication']],

  ['nar-schema-narratif', ['schéma narratif', 'élément perturbateur', 'situation initiale']],
  ['nar-schema-actantiel', ['actantiel', 'adjuvant', 'opposant']],
  ['nar-focalisation', ['focalisation', 'omniscient', 'point de vue narratif']],
  ['nar-ordre', ['analepse', 'prolepse', 'retour en arrière']],
  ['nar-rythme', ['ellipse narrative', 'pause descriptive', 'sommaire narratif']],
  ['nar-enchasse', ['enchâssé', 'récit dans le récit']],
  ['nar-ouverture-cloture', ['incipit', 'excipit']],
  ['nar-statut-narrateur', ['statut du narrateur', 'narrateur-personnage']],

  ['reg-pathetique', ['pathétique']],
  ['reg-tragique', ['registre tragique', 'tonalité tragique', 'le tragique']],
  ['reg-lyrique', ['lyrique']],
  ['reg-ironique', ['ironie', 'ironique']],
  ['reg-satirique', ['satirique']],
  ['reg-polemique', ['polémique']],
  ['reg-epique', ['épique']],
  ['reg-realiste', ['réaliste', 'effet de réel']],
  ['reg-didactique', ['didactique']],
  ['reg-comique', ['comique']],

  ['lex-champ-semantique', ['champ sémantique']],
  ['lex-champ-lexical', ['champ lexical']],
  ['lex-denotation', ['dénotation', 'connotation']],
  ['lex-melioratif', ['mélioratif', 'péjoratif']],
  ['lex-niveaux', ['niveau de langue', 'registre familier', 'registre soutenu', 'argot']],
  ['lex-substituts', ['substitut', 'reprise anaphorique']],
  ['lex-formation', ['préfixe', 'suffixe', 'famille de mots']],

  ['arg-connecteurs', ['connecteur logique', 'connecteurs']],
  ['arg-types', ['argument d’autorité', 'argument logique', 'argument d’expérience']],
  ['arg-refutation', ['réfutation', 'réfuter']],
  ['arg-strategies', ['convaincre', 'persuader', 'délibérer']],
  ['arg-these', ['thèse défendue', 'antithèse', 'la thèse']],
  ['arg-ironie-procedes', ['question rhétorique', 'fausse concession']],
  ['arg-exemples', ['argument']],

  ['des-portrait', ['portrait']],
  ['des-fonctions', ['fonction de la description']],
  ['des-procedes', ['description']],
];

/* ------------------------------------------------------------ chargement */
const ctx = { window: {} };
ctx.globalThis = ctx;
vm.createContext(ctx);
for (const f of ['questions.js', 'etudes.js', 'sujets.js', 'annales.js', 'referentiel.js']) {
  vm.runInContext(fs.readFileSync(DATA(f), 'utf8'), ctx, { filename: f });
}
const notionsConnues = ctx.window.PF_REFERENTIEL.notions;
for (const [id] of MARQUEURS) {
  if (!notionsConnues[id]) { console.error('❌ marqueur pointant sur une notion inexistante : ' + id); process.exit(1); }
}

/* Une simple recherche de sous-chaîne produit des faux rattachements :
   « comique » se trouve dans « économique », « thèse » dans « hypothèse »,
   « condition » dans « conditionnel ». On exige donc des frontières de mot,
   lettres accentuées comprises. Un faux rattachement est pire qu'un trou :
   il fait croire qu'une notion est travaillée alors qu'elle ne l'est pas. */
const LETTRE = 'a-zàâäçéèêëîïôöùûüÿœæ';
const cacheRe = new Map();
function motEntier(cle) {
  if (!cacheRe.has(cle)) {
    const echappe = cle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    cacheRe.set(cle, new RegExp('(?<![' + LETTRE + '])' + echappe + '(?![' + LETTRE + '])', 'iu'));
  }
  return cacheRe.get(cle);
}
/* On n'examine QUE l'énoncé et l'explication — jamais les options. Les
   mauvaises réponses nomment délibérément d'autres notions (« le registre
   comique », « une métaphore ») pour piéger l'élève : s'en servir pour
   classer la question rattache la question à la notion qu'elle écarte. */
function deduire(q) {
  const t = [q.q || '', q.exp || ''].join(' ').toLowerCase();
  for (const [id, cles] of MARQUEURS) for (const c of cles) if (motEntier(c).test(t)) return id;
  return null;
}

/* ------------------------------------------------------------- traitement
   On réécrit les fichiers source en insérant `notion:` juste après `cat:`
   de chaque question déduite — édition textuelle ciblée, pour préserver la
   mise en forme d'origine et rester relisible en diff. */
const D = ctx.window.PF_DATA;
const BOOKS = ['boite', 'antigone', 'condamne'];
let vues = 0, deduites = 0;
const parNotion = {};
const dejaTag = new Set();

for (const b of BOOKS) for (const q of D.questions[b] || []) {
  vues++;
  if (q.notion) { dejaTag.add(q.q); continue; }
  const id = deduire(q);
  if (id) { deduites++; parNotion[id] = (parNotion[id] || 0) + 1; q.__notion = id; }
}

if (ECRIRE) {
  /* questions.js est du JSON pur enveloppé dans deux lignes de JS : on le
     régénère depuis l'objet chargé plutôt que de le retoucher au texte.
     Aucune perte possible, et l'ordre des clés reste lisible en diff. */
  const propre = {};
  let ecrites = 0;
  for (const b of BOOKS) {
    propre[b] = (D.questions[b] || []).map((q) => {
      const o = { cat: q.cat };
      const notion = q.notion || q.__notion;
      if (notion) { o.notion = notion; if (!q.notion) ecrites++; }
      o.q = q.q; o.opts = q.opts; o.ans = q.ans;
      if (q.exp !== undefined) o.exp = q.exp;
      for (const k of Object.keys(q)) if (!(k in o) && k !== '__notion') o[k] = q[k];
      return o;
    });
  }
  const entete =
    '/* Contenu — QCM par œuvre. « ans » = index de la bonne réponse (0 = 1re option).\n' +
    '   « notion » rattache la question au programme officiel (assets/data/referentiel.js) :\n' +
    '   c\'est ce qui permet au bilan de dire « tu maîtrises les subordonnées de but à 40 % »\n' +
    '   au lieu de « analyse : 60 % ». Source unique de vérité — après toute modification :\n' +
    '   `npm run validate`. Rattachement automatique : node tools/rattache-notions.mjs */\n';
  fs.writeFileSync(DATA('questions.js'),
    entete +
    'window.PF_DATA = window.PF_DATA || {};\n' +
    'window.PF_DATA.questions = ' + JSON.stringify(propre, null, 2) + ';\n');
  console.log('  notions écrites dans questions.js : ' + ecrites);
}

console.log('');
console.log('  Questions examinées : ' + vues);
console.log('  Déjà rattachées     : ' + dejaTag.size);
console.log('  Rattachées par cette passe : ' + deduites);
console.log('  Restant sans notion : ' + (vues - dejaTag.size - deduites));
console.log('');
console.log('  Notions touchées : ' + Object.keys(parNotion).length + ' / ' + Object.keys(notionsConnues).length);
const tri = Object.entries(parNotion).sort((a, b) => b[1] - a[1]);
tri.slice(0, 18).forEach(([id, n]) => console.log('    ' + String(n).padStart(4) + '  ' + notionsConnues[id].nom));
if (!ECRIRE) console.log('\n  (rapport seul — relancer avec --ecrire pour appliquer)');
