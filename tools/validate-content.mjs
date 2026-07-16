/* Validateur de contenu — le filet de sécurité.
   Vérifie l'intégrité de TOUT le contenu (questions, études, sujets) avant
   chaque mise en ligne. Une faute ne peut plus passer en production.

   Usage :  npm run validate
   Sortie :  code 0 si tout est bon, code 1 s'il y a la moindre erreur.
*/
import { loadContent } from './load-content.mjs';

const CATS = ['Contextualisation', 'Analyse', 'Fait de langue', 'Réaction / opinion'];
const BOOKS = ['boite', 'antigone', 'condamne'];

const errors = [];
const warnings = [];
const err = (m) => errors.push(m);
const warn = (m) => warnings.push(m);

function checkQuestion(q, where) {
  if (!q || typeof q !== 'object') return err(`${where} : question absente ou invalide`);
  if (!CATS.includes(q.cat)) err(`${where} : catégorie inconnue « ${q.cat} »`);
  if (typeof q.q !== 'string' || q.q.trim().length < 5) err(`${where} : énoncé vide ou trop court`);
  if (!Array.isArray(q.opts) || q.opts.length !== 4) return err(`${where} : il faut exactement 4 options (trouvé ${q.opts ? q.opts.length : 0})`);
  q.opts.forEach((o, i) => { if (typeof o !== 'string' || !o.trim()) err(`${where} : option ${i + 1} vide`); });
  const uniq = new Set(q.opts.map((o) => String(o).trim().toLowerCase()));
  if (uniq.size !== q.opts.length) err(`${where} : deux options identiques`);
  if (!Number.isInteger(q.ans) || q.ans < 0 || q.ans > 3) err(`${where} : « ans » doit être 0, 1, 2 ou 3 (trouvé ${q.ans})`);
  if (typeof q.exp !== 'string' || q.exp.trim().length < 10) warn(`${where} : explication absente ou très courte`);
}

function main() {
  let data;
  try {
    data = loadContent();
  } catch (e) {
    console.error('❌ Impossible de charger le contenu : ' + e.message);
    process.exit(1);
  }
  const { questions, etudes, sujets, annales } = data;

  /* ---- QCM ---- */
  let totalQ = 0;
  for (const b of BOOKS) {
    const list = questions[b];
    if (!Array.isArray(list) || !list.length) { err(`Œuvre « ${b} » : aucune question`); continue; }
    const seen = new Map();
    const byCat = {};
    list.forEach((q, i) => {
      checkQuestion(q, `${b} · QCM #${i + 1}`);
      byCat[q.cat] = (byCat[q.cat] || 0) + 1;
      const key = String(q.q).trim().toLowerCase();
      if (seen.has(key)) err(`${b} · QCM #${i + 1} : doublon d'énoncé (déjà en #${seen.get(key) + 1})`);
      else seen.set(key, i);
    });
    totalQ += list.length;
    CATS.forEach((c) => { if (!byCat[c]) warn(`Œuvre « ${b} » : aucune question de catégorie « ${c} »`); });
  }

  /* ---- Études de texte ---- */
  let totalE = 0;
  for (const b of BOOKS) {
    const list = etudes[b];
    if (!Array.isArray(list) || !list.length) { err(`Études « ${b} » : aucune étude`); continue; }
    list.forEach((et, ei) => {
      const where = `${b} · étude « ${et && et.titre || '?'} »`;
      if (typeof et.titre !== 'string' || !et.titre.trim()) err(`${where} : titre manquant`);
      if (typeof et.support !== 'string' || et.support.trim().length < 40) err(`${where} : support absent ou trop court`);
      if (!Array.isArray(et.questions) || et.questions.length !== 5) err(`${where} : il faut 5 questions (trouvé ${et.questions ? et.questions.length : 0})`);
      (et.questions || []).forEach((q, qi) => {
        checkQuestion(q, `${where} · q#${qi + 1}`);
        if (typeof q.q === 'string' && q.q.indexOf('[Étude de texte]') === -1) warn(`${where} · q#${qi + 1} : préfixe « [Étude de texte] » manquant`);
        totalE += 1;
      });
    });
  }

  /* ---- Sujets de production ---- */
  const PARTS = ['intro', 'arg1', 'arg2', 'concl'];
  sujets.forEach((s, i) => {
    const where = `Sujet #${i + 1} « ${s && s.titre || '?'} »`;
    if (!BOOKS.includes(s.book)) err(`${where} : œuvre inconnue « ${s.book} »`);
    if (typeof s.titre !== 'string' || !s.titre.trim()) err(`${where} : titre manquant`);
    if (typeof s.sujet !== 'string' || s.sujet.trim().length < 30) err(`${where} : énoncé du sujet absent ou trop court`);
    if (!Array.isArray(s.pistes) || !s.pistes.length) err(`${where} : aucune piste de réflexion`);
    if (!s.modele || typeof s.modele !== 'object') err(`${where} : réponse modèle manquante`);
    else PARTS.forEach((p) => { if (typeof s.modele[p] !== 'string' || s.modele[p].trim().length < 20) err(`${where} : partie « ${p} » du modèle absente ou trop courte`); });
  });


  /* ---- Annales (sujets d'examen complets) ---- */
  const TYPES_ANNALE = ['entrainement', 'reel'];
  const idsAnnales = new Set();
  annales.forEach((a, i) => {
    const where = 'annales[' + i + '] (' + (a.id || 'sans id') + ')';
    if (!a.id || idsAnnales.has(a.id)) err(where + ' : id manquant ou dupliqué');
    idsAnnales.add(a.id);
    if (!TYPES_ANNALE.includes(a.type)) err(where + ' : type invalide (attendu entrainement|reel)');
    if (!BOOKS.includes(a.book)) err(where + ' : œuvre inconnue « ' + a.book + ' »');
    if (!a.academieStyle || !a.titre || !a.oeuvre) err(where + ' : académie, titre ou œuvre manquants');
    if (!a.situation || a.situation.length < 80) err(where + ' : situation absente ou trop courte (support de l’élève)');
    if (!Array.isArray(a.etude) || a.etude.length < 5) err(where + ' : étude de texte incomplète (min. 5 questions)');
    let pts = 0;
    (a.etude || []).forEach((q, j) => {
      pts += q.pts || 0;
      if (!q.q || q.q.length < 10) err(where + ' Q' + (j + 1) + ' : énoncé manquant');
      if (!q.correction || q.correction.length < 60) err(where + ' Q' + (j + 1) + ' : correction absente ou indigente (< 60 car.) — la correction détaillée est notre valeur ajoutée');
    });
    if (pts !== 10) err(where + ' : étude de texte = ' + pts + ' pts (10 attendus, format officiel)');
    if (!a.production || a.production.pts !== 10) err(where + ' : production écrite absente ou ≠ 10 pts');
    else if (!a.production.correction || a.production.correction.length < 200) err(where + ' : corrigé de production trop court (plan détaillé attendu)');
    if (a.type === 'reel' && !a.annee) err(where + ' : une annale réelle exige son année');
  });

  /* ---- Rapport ---- */
  console.log('');
  console.log('  Contenu chargé :');
  console.log('  • QCM              : ' + totalQ + '  (' + BOOKS.map((b) => questions[b].length).join(' / ') + ')');
  console.log('  • Questions études : ' + totalE + '  (' + BOOKS.map((b) => (etudes[b] ? etudes[b].length : 0) + ' études').join(' / ') + ')');
  console.log('  • Sujets écrits    : ' + sujets.length);
  console.log('  • Annales corrigées: ' + annales.length + ' (' + annales.reduce((s,a)=>s+a.etude.length,0) + ' questions corrigées)');
  console.log('  • TOTAL banque     : ' + (totalQ + totalE) + ' questions');
  console.log('');

  if (warnings.length) {
    console.log('  ⚠️  ' + warnings.length + ' avertissement(s) :');
    warnings.forEach((w) => console.log('     - ' + w));
    console.log('');
  }
  if (errors.length) {
    console.log('  ❌ ' + errors.length + ' ERREUR(S) — À CORRIGER AVANT LA MISE EN LIGNE :');
    errors.forEach((e) => console.log('     - ' + e));
    console.log('');
    process.exit(1);
  }
  console.log('  ✅ Contenu valide — aucune erreur. Prêt pour la mise en ligne.');
  console.log('');
}

main();
