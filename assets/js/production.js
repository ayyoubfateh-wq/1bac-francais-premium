/* ============================================================================
   ATELIER DE PRODUCTION ÉCRITE — les 8 points décisifs du régional
   Méthode guidée en 4 étapes : comprendre le sujet → bâtir le plan →
   rédiger → s'auto-évaluer avec la grille officielle du barème.
   Pédagogie : l'élève ne subit pas une page blanche ; chaque étape
   décompose la compétence (étayage progressif / scaffolding).
============================================================================ */
(function(){
'use strict';

var XP_PRODUCTION = 30;
var STORAGE = 'pf1bac_prod_v1';

var SUJETS = [
  { book: 'boite', titre: 'La solitude, une richesse ?',
    sujet: '« La solitude de l’enfance peut devenir une source de richesse intérieure. » Développez ce point de vue dans un texte argumenté d’une quinzaine de lignes, en vous appuyant sur La Boîte à Merveilles et sur votre expérience personnelle.',
    pistes: ['La boîte et les rêveries de Sidi Mohammed', 'Le rôle des récits d’Abdellah', 'Un exemple tiré de votre vécu'],
    modele: {
      intro: 'On croit souvent que la solitude est un malheur pour un enfant. Pourtant, La Boîte à Merveilles d’Ahmed Sefrioui montre qu’elle peut devenir une véritable richesse intérieure. Je partage ce point de vue.',
      arg1: 'D’abord, la solitude développe l’imagination. Sidi Mohammed, enfant sans camarade proche, transforme des objets banals — boutons, boules de verre, clous de girofle — en trésors merveilleux : sa boîte devient un monde à lui, plus beau que le réel.',
      arg2: 'Ensuite, la solitude apprend à observer et à ressentir. C’est parce qu’il est souvent seul que le narrateur regarde si finement le msid, le bain maure ou les rites des femmes ; devenu adulte, ce regard nourrit son écriture. De même, dans ma propre expérience, les moments de solitude m’ont souvent permis de lire, de réfléchir et de mieux me connaître.',
      concl: 'En somme, loin d’être seulement une souffrance, la solitude peut féconder l’imaginaire et la sensibilité. Encore faut-il, comme Sidi Mohammed, savoir la transformer en boîte à merveilles plutôt qu’en prison.'
    } },
  { book: 'boite', titre: 'Le poids des traditions',
    sujet: '« Les traditions occupent une place essentielle dans la société marocaine peinte par Sefrioui. » Discutez cette affirmation en montrant ce que ces traditions apportent et ce qu’elles peuvent imposer.',
    pistes: ['Achoura, le msid, le bain maure', 'La solidarité du voisinage (repas de Rahma)', 'Les croyances : chouafa, saints, amulettes'],
    modele: {
      intro: 'Dans La Boîte à Merveilles, Ahmed Sefrioui peint une société traditionnelle où chaque moment de la vie obéit à des rites. Ces traditions sont-elles une richesse ou une contrainte ? Les deux, me semble-t-il.',
      arg1: 'D’une part, les traditions unissent et protègent. La fête de l’Achoura transforme le quartier en fête collective ; quand Zineb disparaît, tout le voisinage se mobilise, et Rahma remercie le ciel en offrant un repas aux mendiants : la tradition organise ici une vraie solidarité.',
      arg2: 'D’autre part, certaines pratiques enferment. Les séances bruyantes de la chouafa, les amulettes et les pèlerinages imposés à l’enfant montrent un monde où la superstition tient parfois lieu de réponse, et où l’individu — surtout la femme — a peu de liberté face au groupe.',
      concl: 'Ainsi, les traditions de l’œuvre sont à la fois un ciment social précieux et un cadre parfois pesant. La sagesse consiste sans doute à garder ce qui unit sans renoncer à ce qui libère.'
    } },
  { book: 'boite', titre: 'L’imagination contre la réalité',
    sujet: '« L’imagination aide à supporter la réalité. » Qu’en pensez-vous ? Répondez dans un texte argumenté illustré par l’œuvre de Sefrioui et par des exemples personnels.',
    pistes: ['Les objets banals devenus trésors', 'La fuite du réel après la mort du coiffeur', 'Les limites : l’imaginaire isole-t-il ?'],
    modele: {
      intro: 'Face à un quotidien difficile, chacun cherche un refuge. Pour Sidi Mohammed, ce refuge est une simple boîte remplie d’objets sans valeur. L’imagination aide-t-elle vraiment à supporter la réalité ? Je le crois, avec une réserve.',
      arg1: 'D’abord, l’imaginaire console. Quand la maison s’assombrit — départ du père, disputes, deuil du quartier —, l’enfant ouvre sa boîte : boutons et boules de verre deviennent des compagnons magiques qui adoucissent sa solitude.',
      arg2: 'Ensuite, l’imaginaire embellit le monde : grâce aux récits merveilleux d’Abdellah l’épicier, la médina ordinaire se peuple d’aventures. Aujourd’hui encore, la lecture ou le cinéma jouent ce rôle pour nous. Toutefois, l’imagination a ses limites : après la mort du coiffeur, la boîte elle-même semble impuissante — le réel finit toujours par exiger d’être affronté.',
      concl: 'En définitive, l’imagination est une force qui aide à vivre, à condition de rester une passerelle vers le réel et non une fuite définitive.'
    } },
  { book: 'antigone', titre: 'Dire non',
    sujet: '« Dire non aux injustices donne un sens à la vie. » Discutez ce point de vue dans un texte argumenté d’une quinzaine de lignes, en vous appuyant sur Antigone de Jean Anouilh.',
    pistes: ['Le refus d’Antigone face à l’édit', 'Le prix du refus : la mort, le doute final', 'Un exemple de refus juste dans l’histoire ou la vie'],
    modele: {
      intro: 'Peut-on donner un sens à sa vie en refusant l’injustice, même au prix fort ? C’est toute la question que pose l’Antigone d’Anouilh. Je pense que le refus fonde en effet la dignité, mais qu’il ne doit pas devenir un culte de la mort.',
      arg1: 'D’abord, dire non affirme des valeurs. Antigone brave l’édit de Créon pour rendre à son frère l’hommage dû à tout être humain : par ce geste, une jeune fille fragile devient plus forte qu’un roi, car elle incarne la conscience face à la force.',
      arg2: 'Ensuite, l’histoire donne raison aux grands refus : sans ceux qui ont dit non à l’esclavage, à l’occupation ou à l’injustice sociale, aucun progrès n’aurait eu lieu — le public de 1944 lisait d’ailleurs la pièce comme un appel à la résistance. Cependant, le doute final d’Antigone, qui « ne sait plus pourquoi elle meurt », rappelle qu’un refus sans horizon peut se vider de son sens.',
      concl: 'En somme, le non aux injustices donne bien un sens à la vie, à condition de rester un non au service de la vie — et non un simple refus de vivre.'
    } },
  { book: 'antigone', titre: 'Le compromis : sagesse ou lâcheté ?',
    sujet: '« Accepter des compromis est-il une preuve de sagesse ou une forme de lâcheté ? » Développez votre réponse en confrontant les positions de Créon et d’Antigone.',
    pistes: ['Le « métier de roi » : dire oui pour gouverner', 'Ismène, la voix de la prudence', 'Où placer la limite entre s’adapter et se trahir ?'],
    modele: {
      intro: 'Faut-il savoir plier pour vivre, ou tout refus de compromis est-il grandeur ? La pièce d’Anouilh met face à face deux réponses : le « oui » de Créon et le « non » d’Antigone. À mes yeux, le compromis est une sagesse — jusqu’au point où il touche l’essentiel.',
      arg1: 'D’une part, le compromis rend la vie commune possible. Créon n’est pas un monstre : il compare l’État à un navire qu’il faut bien gouverner, et accepte les tâches ingrates pour éviter le chaos à Thèbes. Ismène, de son côté, incarne une prudence raisonnable qui n’a rien de honteux.',
      arg2: 'D’autre part, il existe des lignes qu’on ne peut franchir sans se perdre. Quand le compromis exige de renoncer à sa conscience — laisser un frère sans sépulture, accepter un « bonheur » au rabais —, Antigone montre que céder serait se trahir. Le compromis devient lâcheté quand il sacrifie les valeurs qui nous définissent.',
      concl: 'Ainsi, la sagesse consiste à négocier sur l’accessoire et à rester intraitable sur l’essentiel. Créon et Antigone meurent chacun de l’avoir oublié — l’un en cédant trop peu à la conscience, l’autre trop peu à la vie.'
    } },
  { book: 'antigone', titre: 'Obéir aux adultes ?',
    sujet: '« Les jeunes doivent-ils toujours obéir aux adultes ? » Répondez dans un texte argumenté illustré par la pièce d’Anouilh et par votre expérience.',
    pistes: ['Antigone face à son oncle Créon', 'Quand l’obéissance protège / quand elle étouffe', 'Le dialogue comme troisième voie'],
    modele: {
      intro: 'Entre le respect dû aux aînés et le droit de penser par soi-même, où placer la limite ? Antigone, qui tient tête à son oncle et roi, pose la question avec force. Je pense que l’obéissance est légitime, sauf quand elle exige de renoncer à sa conscience.',
      arg1: 'D’abord, l’expérience des adultes protège réellement : Créon, en homme d’État, connaît les conséquences du désordre, comme nos parents mesurent des dangers que nous ne voyons pas encore. Ismène obéit ainsi par lucidité autant que par peur.',
      arg2: 'Mais l’obéissance a une limite : la conscience. Antigone refuse un ordre qu’elle juge indigne, et son refus révèle que l’autorité n’a pas toujours raison. Dans nos vies aussi, un jeune peut devoir dire non — face à la triche, à l’humiliation d’un camarade ou à une injustice. Le vrai chemin est souvent le dialogue : Créon et Antigone échouent précisément parce que chacun refuse d’entendre l’autre.',
      concl: 'En définitive, obéir n’est pas se soumettre aveuglément : les jeunes doivent écouter les adultes, mais aussi apprendre à leur parler — et, dans les cas extrêmes, à leur résister dignement.'
    } },
  { book: 'condamne', titre: 'La vie, valeur absolue',
    sujet: '« Aucune cause ne justifie qu’on ôte la vie à un être humain. » Discutez cette affirmation dans un texte argumenté d’une quinzaine de lignes, en vous appuyant sur Le Dernier Jour d’un Condamné.',
    pistes: ['L’agonie vécue de l’intérieur (le journal)', 'Marie : la peine frappe aussi les innocents', 'L’argument de la justice qui peut se tromper'],
    modele: {
      intro: 'La société a-t-elle le droit de tuer, même au nom de la justice ? En 1829, Victor Hugo répond par la négative dans Le Dernier Jour d’un Condamné. Je partage cette position : aucune cause ne justifie qu’on ôte la vie.',
      arg1: 'D’abord, la peine de mort inflige une torture que nul verdict ne mesure : cinq semaines durant, le narrateur « habite » avec la pensée de sa mort. Hugo nous enferme dans cette agonie mentale pour montrer que l’exécution punit mille fois avant de tuer.',
      arg2: 'Ensuite, la peine frappe des innocents : la petite Marie, qui croit son père mort et l’appelle « monsieur », est châtiée sans avoir commis aucun crime. Enfin, la justice humaine peut se tromper — or la mort est la seule peine qu’on ne peut réparer.',
      concl: 'Ainsi, punir est nécessaire, mais tuer ne l’est jamais : une société se grandit en restant plus humaine que ceux qu’elle condamne. C’est la leçon, toujours actuelle, du roman de Hugo.'
    } },
  { book: 'condamne', titre: 'Punir sans humilier',
    sujet: '« La justice doit punir sans humilier. » Qu’en pensez-vous ? Développez votre réponse en vous appuyant sur des scènes précises du roman de Victor Hugo.',
    pistes: ['Le ferrage des forçats transformé en spectacle', 'La foule de la place de Grève', 'La dignité du condamné face à la machine'],
    modele: {
      intro: 'Une peine juste peut-elle s’accompagner d’humiliation ? Le roman de Hugo montre une justice qui ne se contente pas de punir : elle donne la souffrance en spectacle. Je pense au contraire que punir n’autorise jamais à dégrader.',
      arg1: 'D’abord, l’humiliation transforme la justice en vengeance : lors du ferrage, les forçats enchaînés sont exhibés devant une foule qui rit — la scène ressemble à une foire, non à une œuvre de justice.',
      arg2: 'Ensuite, l’humiliation dégrade aussi ceux qui regardent : place de Grève, on loue des fenêtres pour voir mourir un homme. Hugo retourne le miroir : la vraie sauvagerie est du côté des spectateurs. Une peine digne — réparer, éloigner, réinsérer — protégerait la société sans la corrompre.',
      concl: 'En somme, la justice perd son nom quand elle humilie : punir la faute, oui ; détruire l’humanité du coupable — et la nôtre —, non.'
    } },
  { book: 'condamne', titre: 'La littérature, une arme',
    sujet: '« La littérature est une arme pour défendre les grandes causes. » Illustrez cette affirmation dans un texte argumenté en montrant comment Victor Hugo met son roman au service d’un combat.',
    pistes: ['L’émotion comme argument (Marie, l’attente)', 'L’anonymat du condamné : un cas universel', 'La préface de 1832 : l’argumentation directe'],
    modele: {
      intro: 'Un roman peut-il faire reculer une injustice ? Le Dernier Jour d’un Condamné prouve que oui : Hugo y transforme la fiction en plaidoyer contre la peine de mort. La littérature est bien une arme au service des grandes causes.',
      arg1: 'D’abord, elle fait éprouver ce que les discours ne font que dire : en nous enfermant dans le journal d’un condamné anonyme — qui pourrait être chacun de nous —, Hugo nous fait vivre l’attente de la mort de l’intérieur. L’émotion devient argument.',
      arg2: 'Ensuite, elle inscrit le combat dans la durée : la préface de 1832 transforme l’émotion du récit en thèse explicite, et ce livre a nourri, pendant un siècle et demi, le débat qui aboutira à l’abolition en France en 1981. Une loi s’abroge, un livre continue de convaincre.',
      concl: 'Ainsi, la plume peut être plus forte que l’échafaud : en donnant un visage aux victimes de l’injustice, la littérature arme les consciences — la plus durable des victoires.'
    } }
];

/* Grille officielle du barème de la production écrite (8 pts) */
var GRILLE = [
  { label: 'Contenu et idées (3 pts)', max: 3, items: [
    'Mes arguments répondent vraiment au sujet posé',
    'J’ai donné au moins un exemple précis tiré de l’œuvre',
    'J’ai ajouté un exemple personnel ou d’actualité'] },
  { label: 'Organisation (2 pts)', max: 2, items: [
    'Mon texte a une introduction, un développement et une conclusion',
    'Mes idées s’enchaînent avec des connecteurs (d’abord, ensuite, cependant…)'] },
  { label: 'Langue et style (2 pts)', max: 2, items: [
    'Mes phrases sont complètes et variées',
    'J’ai utilisé un vocabulaire précis (pas de répétitions de « chose », « il y a »…)'] },
  { label: 'Orthographe et ponctuation (1 pt)', max: 1, items: [
    'Je me suis relu(e) pour corriger accords, conjugaison et ponctuation'] }
];

var BOOK_LABEL = { boite: '📦 La Boîte à Merveilles', antigone: '🏛️ Antigone', condamne: '⛓️ Le Dernier Jour d’un Condamné' };

function loadP(){
  try { return JSON.parse(localStorage.getItem(STORAGE) || '{}') || {}; } catch(e){ return {}; }
}
function saveP(p){ try { localStorage.setItem(STORAGE, JSON.stringify(p)); } catch(e){} }

var P = loadP();          // { draft: {...}, history: [...] }
P.history = P.history || [];

/* ------------------------------------------------------------- rendu */
function el(id){ return document.getElementById(id); }

function render(){
  var wrap = el('gProd');
  if (!wrap) return;
  var d = P.draft;
  if (!d) renderChoix(wrap);
  else if (d.step === 1) renderComprendre(wrap, d);
  else if (d.step === 2) renderPlan(wrap, d);
  else if (d.step === 3) renderRedaction(wrap, d);
  else renderGrille(wrap, d);
}

function renderChoix(wrap){
  var html = '<div class="g-prod-intro"><p><b>Les 8 points les plus décisifs de l’examen se gagnent ici.</b> Choisis un sujet type régional : l’atelier te guide pas à pas, du plan à l’auto-correction avec la vraie grille du barème.</p></div>';
  ['boite','antigone','condamne'].forEach(function(book){
    html += '<div class="g-prod-book">' + BOOK_LABEL[book] + '</div><div class="g-prod-sujets">';
    SUJETS.forEach(function(s, i){
      if (s.book !== book) return;
      html += '<button class="g-prod-sujet" onclick="gProdStart(' + i + ')"><b>' + s.titre + '</b><span>' + s.sujet.slice(0, 90) + '…</span></button>';
    });
    html += '</div>';
  });
  if (P.history.length) {
    html += '<div class="g-prod-book">🗂️ Mes productions terminées (' + P.history.length + ')</div><div class="g-prod-hist">';
    P.history.slice(0, 8).forEach(function(h){
      html += '<div class="g-prod-hist-row"><span>' + h.date.slice(0, 10).split('-').reverse().join('/') + ' — ' + h.titre + '</span><b>' + h.note + '/8</b></div>';
    });
    html += '</div>';
  }
  wrap.innerHTML = html;
}

function stepHeader(d, n, titre, conseil){
  return '<div class="g-prod-steps">' +
    [1,2,3,4].map(function(s){ return '<span class="g-prod-step' + (s === n ? ' on' : s < n ? ' done' : '') + '">' + s + '</span>'; }).join('<span class="g-prod-lien"></span>') +
    '</div>' +
    '<h3 class="g-prod-titre">' + titre + '</h3>' +
    '<div class="g-prod-sujet-box"><b>Sujet :</b> ' + SUJETS[d.sujet].sujet + '</div>' +
    (conseil ? '<div class="g-prod-conseil">💡 ' + conseil + '</div>' : '');
}

function renderComprendre(wrap, d){
  var s = SUJETS[d.sujet];
  wrap.innerHTML = stepHeader(d, 1, 'Étape 1 — Comprendre le sujet',
    'Souligne mentalement les mots-clés du sujet, identifie la consigne (discuter ? illustrer ? développer ?) et vérifie chaque piste avant de continuer.') +
    '<div class="g-prod-check">' + s.pistes.map(function(p, i){
      return '<label class="g-prod-checkline"><input type="checkbox" data-pi="' + i + '"' + (d.pistes && d.pistes[i] ? ' checked' : '') + '> J’ai réfléchi à : <b>' + p + '</b></label>';
    }).join('') + '</div>' +
    '<button class="g-btn-primary" onclick="gProdNext()">J’AI COMPRIS LE SUJET → BÂTIR MON PLAN</button>' +
    '<button class="g-btn-ghost" onclick="gProdQuit()">Changer de sujet</button>';
}

function renderPlan(wrap, d){
  function zone(id, label, ph, val){
    return '<label class="g-prod-label">' + label + '</label>' +
      '<textarea class="g-prod-ta" id="' + id + '" rows="2" placeholder="' + ph + '">' + (val || '') + '</textarea>';
  }
  wrap.innerHTML = stepHeader(d, 2, 'Étape 2 — Bâtir le plan',
    'Une idée = un argument + UN exemple précis. C’est le plan qui rapporte les 3 points de contenu, pas la longueur.') +
    zone('pThese', 'Ma position (thèse)', 'Ex : Je pense que… parce que…', d.these) +
    zone('pArg1', 'Argument 1 + exemple tiré de l’œuvre', 'Argument… Par exemple, dans l’œuvre…', d.arg1) +
    zone('pArg2', 'Argument 2 + exemple (œuvre, vie, actualité)', 'De plus… Ainsi…', d.arg2) +
    zone('pConcl', 'Ma conclusion (bilan + ouverture)', 'En somme…', d.concl) +
    '<button class="g-btn-primary" onclick="gProdNext()">MON PLAN EST PRÊT → RÉDIGER</button>' +
    '<button class="g-btn-ghost" onclick="gProdBack()">← Revenir au sujet</button>';
}

function renderRedaction(wrap, d){
  wrap.innerHTML = stepHeader(d, 3, 'Étape 3 — Rédiger',
    'Vise 15 à 25 lignes (150-250 mots). Suis ton plan, il est affiché sous la zone. Connecteurs : d’abord, ensuite, cependant, en somme.') +
    '<textarea class="g-prod-ta g-prod-texte" id="pTexte" rows="12" placeholder="Rédige ici ta production…">' + (d.texte || '') + '</textarea>' +
    '<div class="g-prod-compteur" id="pCompteur">0 mot</div>' +
    '<div class="g-prod-rappel"><b>Ton plan :</b> ' +
      [d.these, d.arg1, d.arg2, d.concl].filter(Boolean).map(function(x){ return '• ' + x; }).join('<br>') + '</div>' +
    '<button class="g-btn-primary" onclick="gProdNext()">J’AI TERMINÉ → M’AUTO-CORRIGER</button>' +
    '<button class="g-btn-ghost" onclick="gProdBack()">← Revoir mon plan</button>';
  var ta = el('pTexte');
  var maj = function(){
    var mots = (ta.value.trim().match(/\S+/g) || []).length;
    var c = el('pCompteur');
    c.textContent = mots + ' mot' + (mots > 1 ? 's' : '') + (mots < 120 ? ' — continue, vise au moins 150' : mots > 280 ? ' — pense à resserrer' : ' ✓ bonne longueur');
    c.className = 'g-prod-compteur' + (mots >= 120 && mots <= 280 ? ' ok' : '');
  };
  ta.addEventListener('input', maj); maj();
}

function renderGrille(wrap, d){
  var html = stepHeader(d, 4, 'Étape 4 — Auto-correction avec la grille du barème',
    'Sois honnête : cette grille est celle du correcteur. Chaque case cochée doit être VRAIE dans ton texte.');
  GRILLE.forEach(function(g, gi){
    html += '<div class="g-prod-crit"><b>' + g.label + '</b>' +
      g.items.map(function(it, ii){
        return '<label class="g-prod-checkline"><input type="checkbox" data-g="' + gi + '" data-i="' + ii + '"> ' + it + '</label>';
      }).join('') + '</div>';
  });
  html += '<button class="g-btn-primary" onclick="gProdFinish()">VALIDER MON AUTO-ÉVALUATION</button>' +
    '<button class="g-btn-ghost" onclick="gProdBack()">← Retoucher mon texte</button>';
  wrap.innerHTML = html;
}

/* ------------------------------------------------------------ actions */
window.gProdStart = function(i){
  P.draft = { sujet: i, step: 1, pistes: [] };
  saveP(P); render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
window.gProdQuit = function(){ P.draft = null; saveP(P); render(); };
window.gProdBack = function(){ if (P.draft && P.draft.step > 1) { collect(); P.draft.step--; saveP(P); render(); } };
window.gProdNext = function(){
  var d = P.draft; if (!d) return;
  collect();
  if (d.step === 3 && ((d.texte || '').trim().match(/\S+/g) || []).length < 60) {
    if (typeof window.gToast === 'function') window.gToast('✍️ Encore un effort : au moins 60 mots pour passer à la correction.');
    else alert('Écris au moins 60 mots avant de passer à la correction.');
    return;
  }
  d.step++; saveP(P); render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
function collect(){
  var d = P.draft; if (!d) return;
  if (d.step === 1) {
    d.pistes = Array.from(document.querySelectorAll('#gProd input[data-pi]')).map(function(c){ return c.checked; });
  } else if (d.step === 2) {
    d.these = (el('pThese') || {}).value || d.these;
    d.arg1 = (el('pArg1') || {}).value || d.arg1;
    d.arg2 = (el('pArg2') || {}).value || d.arg2;
    d.concl = (el('pConcl') || {}).value || d.concl;
  } else if (d.step === 3) {
    d.texte = (el('pTexte') || {}).value || d.texte;
  }
}
window.gProdFinish = function(){
  var d = P.draft; if (!d) return;
  var note = 0;
  GRILLE.forEach(function(g, gi){
    var boxes = Array.from(document.querySelectorAll('#gProd input[data-g="' + gi + '"]'));
    var cochees = boxes.filter(function(b){ return b.checked; }).length;
    note += g.max * (boxes.length ? cochees / boxes.length : 0);
  });
  note = Math.round(note * 2) / 2;
  var s = SUJETS[d.sujet];
  P.history.unshift({ date: new Date().toISOString(), titre: s.titre, book: s.book, note: note,
    mots: ((d.texte || '').match(/\S+/g) || []).length,
    sujet: d.sujet, texte: (d.texte || '').slice(0, 3000) });
  P.history = P.history.slice(0, 20);
  P.draft = null;
  saveP(P);
  if (typeof window.gGrantProductionXP === 'function') window.gGrantProductionXP(XP_PRODUCTION, note, d.sujet);
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

/* ------------------------------------- comparaison avec la réponse modèle
   Apprentissage par contraste : l'élève relit SON texte face à un texte
   exemplaire annoté — il voit la structure au lieu de la deviner. */
var MODELE_PARTIES = [
  { key: 'intro', tag: 'Introduction — j’amène le sujet et j’annonce ma position' },
  { key: 'arg1',  tag: 'Argument 1 + exemple précis tiré de l’œuvre' },
  { key: 'arg2',  tag: 'Argument 2 + exemple (œuvre, vie, actualité) — et une nuance' },
  { key: 'concl', tag: 'Conclusion — bilan + ouverture' }
];
window.gProdShowModel = function(i, texteEleve){
  var wrap = el('gProd');
  var s = SUJETS[i];
  if (!wrap || !s || !s.modele) return;
  if (texteEleve === undefined) {
    var h = P.history.filter(function(x){ return x.sujet === i; })[0];
    texteEleve = h ? h.texte : '';
  }
  var html = '<h3 class="g-prod-titre">📖 Réponse modèle — ' + s.titre + '</h3>' +
    '<div class="g-prod-sujet-box"><b>Sujet :</b> ' + s.sujet + '</div>' +
    '<div class="g-prod-conseil">💡 Ne recopie pas ce modèle : observe sa STRUCTURE (étiquettes vertes), puis demande-toi ce qui manque à ton texte.</div>' +
    '<div class="g-prod-modele">' +
      MODELE_PARTIES.map(function(p){
        return '<div class="g-prod-part"><span class="g-prod-tag">' + p.tag + '</span><p>' + s.modele[p.key] + '</p></div>';
      }).join('') +
    '</div>' +
    (texteEleve
      ? '<div class="g-prod-book">✍️ Ton texte, pour comparer</div><div class="g-prod-mien">' + texteEleve.replace(/</g, '&lt;').replace(/\n/g, '<br>') + '</div>'
      : '') +
    '<button class="g-btn-primary" style="background:var(--teal);" onclick="gProdQuit()">RETOUR AUX SUJETS</button>' +
    '<button class="g-btn-ghost" onclick="gProdStart(' + i + ')">Retenter ce sujet</button>';
  wrap.innerHTML = html;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

document.addEventListener('DOMContentLoaded', render);
})();
