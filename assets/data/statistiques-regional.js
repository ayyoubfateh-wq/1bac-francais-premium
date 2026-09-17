/* ============================================================================
   CE QUI TOMBE VRAIMENT — dépouillement des sujets régionaux réels

   Chaque entrée est un examen officiel lu page par page depuis le PDF publié
   par l'académie (archives publiques). Rien n'est déduit ni supposé : le champ
   « detail » reprend la question telle qu'elle est posée sur la copie.

   C'est l'avantage que personne ne peut copier en une nuit : un contenu se
   recopie, un dépouillement d'archives ne se recopie pas.

   MÉTHODE. Pour chaque sujet on relève l'œuvre du texte support, le découpage
   par capacité, la forme de chaque item, la notion de langue interrogée
   (identifiant du référentiel) et le thème de production. Les statistiques
   affichées dans l'application sont CALCULÉES à partir de ces relevés —
   jamais saisies à la main, jamais arrondies. Un chiffre affiché ne peut donc
   pas contredire les données.

   POUR AJOUTER UN SUJET : télécharger le PDF (node tools/corpus-annales.mjs
   --telecharge --annee 2023), le lire, ajouter une entrée ici. Les chiffres
   suivent tout seuls.
============================================================================ */
window.PF_DATA = window.PF_DATA || {};
window.PF_DATA.statsRegional = {
  misAJour: '2026-09-17',
  source: 'Sujets officiels des académies régionales, session normale. Archives publiques.',
  corpusRecense: 132, // documents repérés dans tools/corpus-annales.json
  couverture: 'Les 12 académies de la session normale 2024 : 11 sujets retrouvés et dépouillés.',

  sujets: [

    {
      annee: 2024, academie: 'Casablanca-Settat', session: 'normale',
      oeuvre: 'antigone', passage: 'Antigone dicte sa lettre au Garde',
      themeProduction: 'Faut-il s’accrocher à ses idées ou savoir faire des concessions ?',
      items: [
        { n: 1, capacite: 'contextualiser', forme: 'tableau', detail: 'titre / auteur / genre / siècle' },
        { n: 2, capacite: 'contextualiser', forme: 'situer', detail: 'cause de l’arrestation ; destinataire de la lettre' },
        { n: 3, capacite: 'analyser', forme: 'vrai-faux' },
        { n: 4, capacite: 'analyser', forme: 'question-justifier' },
        { n: 5, capacite: 'analyser', forme: 'question-justifier' },
        { n: 6, capacite: 'analyser', forme: 'sentiment' },
        { n: 7, capacite: 'analyser', forme: 'tonalite', notion: 'reg-tragique' },
        { n: 8, capacite: 'analyser', forme: 'figure-de-style', notion: 'fig-anaphore' },
        { n: 9, capacite: 'reagir', forme: 'avis-justifie' },
        { n: 10, capacite: 'reagir', forme: 'avis-justifie' },
      ],
    },

    {
      annee: 2024, academie: 'Marrakech-Safi', session: 'normale',
      oeuvre: 'boite', passage: 'Le chapelet — Rahma offre un éclat de verre à l’enfant',
      themeProduction: 'Vaut-il mieux pardonner que punir ?',
      items: [
        { n: 1, capacite: 'contextualiser', forme: 'tableau', detail: 'auteur / genre / autre œuvre de l’auteur / prénom de la mère' },
        { n: 2, capacite: 'contextualiser', forme: 'qcm', detail: 'quel événement précède le passage' },
        { n: 3, capacite: 'analyser', forme: 'question-simple' },
        { n: 4, capacite: 'analyser', forme: 'question-simple' },
        { n: 5, capacite: 'analyser', forme: 'vrai-faux' },
        { n: 6, capacite: 'analyser', forme: 'champ-lexical', notion: 'lex-champ-lexical', detail: 'le corps' },
        { n: 7, capacite: 'analyser', forme: 'qcm', detail: 'sens d’un énoncé' },
        { n: 8, capacite: 'analyser', forme: 'figure-de-style', notion: 'fig-anaphore' },
        { n: 9, capacite: 'reagir', forme: 'avis-justifie' },
        { n: 10, capacite: 'reagir', forme: 'avis-justifie' },
      ],
    },

    {
      annee: 2024, academie: 'Béni Mellal-Khénifra', session: 'normale',
      oeuvre: 'boite', passage: 'Le marchand de grenades ; la défiance envers la chouafa',
      themeProduction: 'Les exigences des jeunes dépassent le pouvoir d’achat des parents',
      capacitesImprimees: true, // le sujet imprime CONTEXTUALISER / ANALYSER / RÉAGIR
      items: [
        { n: 1, capacite: 'contextualiser', forme: 'tableau', detail: 'titre / genre / auteur / date de publication' },
        { n: 2, capacite: 'contextualiser', forme: 'qcm', detail: 'où se trouve le père à ce moment' },
        { n: 3, capacite: 'analyser', forme: 'question-simple' },
        { n: 4, capacite: 'analyser', forme: 'figure-de-style', notion: 'fig-metaphore', detail: '« prendre racine » + trait de caractère' },
        { n: 5, capacite: 'analyser', forme: 'releve-sentiment' },
        { n: 6, capacite: 'analyser', forme: 'vrai-faux' },
        { n: 7, capacite: 'analyser', forme: 'question-justifier' },
        { n: 8, capacite: 'analyser', forme: 'qcm-justifier', detail: 'la mère est-elle indifférente ou prudente' },
        { n: 9, capacite: 'reagir', forme: 'avis-justifie' },
        { n: 10, capacite: 'reagir', forme: 'avis-justifie' },
      ],
    },

    {
      annee: 2024, academie: 'Drâa-Tafilalet', session: 'normale',
      oeuvre: 'antigone', passage: 'Le récit du Messager — mort d’Antigone et d’Hémon',
      themeProduction: 'L’indulgence envers les personnes âgées',
      items: [
        { n: 1, capacite: 'contextualiser', forme: 'tableau', detail: 'auteur / titre / genre / personnage principal' },
        { n: 2, capacite: 'contextualiser', forme: 'situer', detail: 'destinataire de la lettre ; objet offert au garde' },
        { n: 3, capacite: 'analyser', forme: 'question-simple' },
        { n: 4, capacite: 'analyser', forme: 'question-simple' },
        { n: 5, capacite: 'analyser', forme: 'question-simple' },
        { n: 6, capacite: 'analyser', forme: 'releve-phrase' },
        { n: 7, capacite: 'analyser', forme: 'figure-de-style', notion: 'fig-comparaison', detail: '« ce regard comme la lame » + effet produit' },
        { n: 8, capacite: 'analyser', forme: 'champ-lexical', notion: 'lex-champ-lexical', detail: 'la souffrance' },
        { n: 9, capacite: 'reagir', forme: 'avis-justifie' },
        { n: 10, capacite: 'reagir', forme: 'avis-justifie' },
      ],
    },

    {
      annee: 2024, academie: 'Souss-Massa', session: 'normale',
      oeuvre: 'boite', passage: 'Après l’Achoura — la guerre de la mère contre les punaises',
      themeProduction: 'Les vacances d’été : se reposer ou préparer l’année suivante ?',
      items: [
        { n: 1, capacite: 'contextualiser', forme: 'tableau', detail: 'titre / auteur / genre / ville de l’histoire' },
        { n: 2, capacite: 'contextualiser', forme: 'vrai-faux', detail: 'connaissance générale de l’œuvre' },
        { n: 3, capacite: 'analyser', forme: 'question-justifier' },
        { n: 4, capacite: 'analyser', forme: 'question-justifier' },
        { n: 5, capacite: 'analyser', forme: 'connecteur', notion: 'arg-connecteurs', detail: '« cependant » : rapport logique + équivalent' },
        { n: 6, capacite: 'analyser', forme: 'champ-lexical', notion: 'lex-champ-lexical', detail: 'la guerre — repérer les intrus' },
        { n: 7, capacite: 'analyser', forme: 'figure-de-style', notion: 'fig-accumulation' },
        { n: 8, capacite: 'analyser', forme: 'valeur-temps', notion: 'tps-passe-simple', detail: 'durée / succession / répétition' },
        { n: 9, capacite: 'reagir', forme: 'proposer-titre' },
        { n: 10, capacite: 'reagir', forme: 'avis-justifie' },
      ],
    },

    {
      annee: 2024, academie: 'Laâyoune-Sakia El Hamra', session: 'normale',
      oeuvre: 'boite', passage: 'Le départ du père — Rahma à la fenêtre, l’enfant alité',
      themeProduction: 'S’isoler de sa famille pour réviser : qu’en pensez-vous ?',
      capacitesImprimees: true, // CONTEXTUALISATION 2pts / ANALYSE 6pts / RÉACTION 2pts
      items: [
        { n: 1, capacite: 'contextualiser', forme: 'tableau', detail: 'auteur / titre / genre / siècle' },
        { n: 2, capacite: 'contextualiser', forme: 'vrai-faux', detail: 'situer le passage' },
        { n: 3, capacite: 'analyser', forme: 'situation-enonciation', notion: 'eno-situation', detail: 'qui parle, à qui, où' },
        { n: 4, capacite: 'analyser', forme: 'question-justifier' },
        { n: 5, capacite: 'analyser', forme: 'question-justifier' },
        { n: 6, capacite: 'analyser', forme: 'releve-expression' },
        { n: 7, capacite: 'analyser', forme: 'sentiment' },
        { n: 8, capacite: 'analyser', forme: 'figure-de-style', notion: 'fig-hyperbole', detail: '« j’éclatai d’un rire joyeux »' },
        { n: 9, capacite: 'reagir', forme: 'avis-justifie' },
        { n: 10, capacite: 'reagir', forme: 'avis-justifie' },
      ],
    },

    {
      annee: 2024, academie: 'Rabat-Salé-Kénitra', session: 'normale',
      oeuvre: 'boite', passage: 'Salama raconte : Moulay Larbi veut prendre une seconde épouse',
      themeProduction: 'Autoriser un animal de compagnie à un membre de la famille',
      capacitesImprimees: true, // A. Contextualiser 2pts / B. Analyser 6pts / C. Réagir 2pts
      items: [
        { n: 1, capacite: 'contextualiser', forme: 'tableau', detail: 'titre / auteur / genre / date de parution' },
        { n: 2, capacite: 'contextualiser', forme: 'vrai-faux', detail: 'quatre énoncés pour situer le passage' },
        { n: 3, capacite: 'analyser', forme: 'question-simple' },
        { n: 4, capacite: 'analyser', forme: 'question-simple' },
        { n: 5, capacite: 'analyser', forme: 'releve-indice', detail: 'un indice du texte par affirmation' },
        { n: 6, capacite: 'analyser', forme: 'releve-arguments', notion: 'arg-these', detail: 'relever deux arguments de persuasion' },
        { n: 7, capacite: 'analyser', forme: 'champ-lexical', notion: 'lex-champ-lexical', detail: 'les sentiments' },
        { n: 8, capacite: 'analyser', forme: 'discours-rapporte', notion: 'dis-indirect', detail: 'passer une réplique au discours indirect' },
        { n: 9, capacite: 'reagir', forme: 'avis-justifie' },
        { n: 10, capacite: 'reagir', forme: 'avis-justifie' },
      ],
    },

    {
      annee: 2024, academie: 'Fès-Meknès', session: 'normale',
      oeuvre: 'boite', passage: 'Veille de l’Achoura — les habits de fête, la kissaria',
      themeProduction: 'Des lycéens s’ennuient à l’École : partagez-vous leur avis ?',
      items: [
        { n: 1, capacite: 'contextualiser', forme: 'tableau', detail: 'auteur / titre / date de publication / nom du narrateur' },
        { n: 2, capacite: 'contextualiser', forme: 'situer', detail: 'activité confiée par le fqih ; rôle du narrateur' },
        { n: 3, capacite: 'analyser', forme: 'figure-de-style', notion: 'fig-hyperbole', detail: 'état physique + figure qui en marque l’intensité' },
        { n: 4, capacite: 'analyser', forme: 'transformation', notion: 'gra-opposition', detail: 'relier deux propositions avec « bien que »' },
        { n: 5, capacite: 'analyser', forme: 'tableau-analyse', detail: 'sentiment / raison / geste qui l’exprime' },
        { n: 6, capacite: 'analyser', forme: 'discours-rapporte', notion: 'dis-indirect', detail: 'refaire la phrase au discours indirect' },
        { n: 7, capacite: 'analyser', forme: 'lexique-destinataire', notion: 'eno-situation', detail: 'équivalent français de « kissaria » + à quel lecteur' },
        { n: 8, capacite: 'analyser', forme: 'tonalite', detail: 'registre littéraire dominant' },
        { n: 9, capacite: 'reagir', forme: 'avis-justifie' },
        { n: 10, capacite: 'reagir', forme: 'avis-justifie' },
      ],
    },

    {
      annee: 2024, academie: 'Tanger-Tétouan-Al Hoceïma', session: 'normale',
      oeuvre: 'boite', passage: 'Le blanchiment du Msid — Sidi Mohammed chef des frotteurs',
      themeProduction: 'Travail en groupe ou travail individuel : que choisissez-vous ?',
      items: [
        { n: 1, capacite: 'contextualiser', forme: 'tableau', detail: 'auteur / titre / genre / date d’écriture' },
        { n: 2, capacite: 'contextualiser', forme: 'situer', detail: 'fête préparée ; qui a fait don de la chaux' },
        { n: 3, capacite: 'analyser', forme: 'question-simple' },
        { n: 4, capacite: 'analyser', forme: 'question-simple' },
        { n: 5, capacite: 'analyser', forme: 'releve-indice', detail: 'deux énoncés montrant la dureté du travail' },
        { n: 6, capacite: 'analyser', forme: 'analyse-grammaticale', notion: 'gra-completive', detail: 'type de proposition subordonnée' },
        { n: 7, capacite: 'analyser', forme: 'champ-lexical', notion: 'lex-champ-lexical', detail: 'le travail' },
        { n: 8, capacite: 'analyser', forme: 'figure-de-style', notion: 'fig-hyperbole', detail: '« mort de fatigue »' },
        { n: 9, capacite: 'reagir', forme: 'avis-justifie' },
        { n: 10, capacite: 'reagir', forme: 'avis-justifie' },
      ],
    },

    {
      annee: 2024, academie: 'Guelmim-Oued Noun', session: 'normale',
      oeuvre: 'boite', passage: 'La dispute de Lalla Zoubida avec la voisine ; le père silencieux',
      themeProduction: 'Faut-il éviter toute relation avec les voisins ?',
      items: [
        { n: 1, capacite: 'contextualiser', forme: 'tableau', detail: 'auteur / œuvre / genre / siècle' },
        { n: 2, capacite: 'contextualiser', forme: 'situer', detail: 'avec qui la dispute ; sa cause' },
        { n: 3, capacite: 'analyser', forme: 'cadre-spatio-temporel', detail: 'quand et où se passent les événements' },
        { n: 4, capacite: 'analyser', forme: 'vrai-faux' },
        { n: 5, capacite: 'analyser', forme: 'question-justifier' },
        { n: 6, capacite: 'analyser', forme: 'releve-indice', detail: 'deux indices de la fierté des origines' },
        { n: 7, capacite: 'analyser', forme: 'champ-lexical', notion: 'lex-champ-lexical', detail: 'la tristesse' },
        { n: 8, capacite: 'analyser', forme: 'figure-de-style', notion: 'fig-hyperbole', detail: 'QCM antithèse / hyperbole / personnification' },
        { n: 9, capacite: 'reagir', forme: 'avis-justifie' },
        { n: 10, capacite: 'reagir', forme: 'avis-justifie' },
      ],
    },

    {
      annee: 2024, academie: 'Dakhla-Oued Ed-Dahab', session: 'normale',
      oeuvre: 'boite', passage: 'Le tambour sur la terrasse — le soir de la fête',
      themeProduction: 'Les rôles de la femme changent : quels défis pour le pays ?',
      items: [
        { n: 1, capacite: 'contextualiser', forme: 'tableau', detail: 'auteur / titre / genre / siècle' },
        { n: 2, capacite: 'contextualiser', forme: 'vrai-faux', detail: 'quatre énoncés de connaissance de l’œuvre' },
        { n: 3, capacite: 'analyser', forme: 'question-simple' },
        { n: 4, capacite: 'analyser', forme: 'melioratif-pejoratif', notion: 'lex-melioratif', detail: 'la description des femmes est-elle péjorative ou méliorative' },
        { n: 5, capacite: 'analyser', forme: 'sentiment' },
        { n: 6, capacite: 'analyser', forme: 'question-simple' },
        { n: 7, capacite: 'analyser', forme: 'registre-de-langue', notion: 'lex-niveaux', detail: '« papoter » : registre + synonyme courant' },
        { n: 8, capacite: 'analyser', forme: 'figure-de-style', notion: 'fig-personnification', detail: '« le soleil en robe d’or s’attardait » + effet' },
        { n: 9, capacite: 'reagir', forme: 'avis-justifie' },
        { n: 10, capacite: 'reagir', forme: 'avis-justifie' },
      ],
    },

  ],

  /* Barème de la production écrite. Les totaux (5 discours / 5 langue) ne
     bougent jamais ; la ventilation interne, elle, varie d'une académie à
     l'autre. On donne donc la version la plus détaillée rencontrée, et les
     variantes réellement relevées — pour qu'un élève sache ce qui est
     invariant (les cinq critères de langue) et ce qui ne l'est pas. */
  baremeProduction: {
    langue: { total: 5, criteres: [
      { nom: 'Vocabulaire — termes précis et variés', pts: 1 },
      { nom: 'Syntaxe — construction de phrases correctes', pts: 1 },
      { nom: 'Ponctuation adéquate', pts: 1 },
      { nom: 'Orthographe d’usage et grammaticale', pts: 1 },
      { nom: 'Conjugaison — emploi des temps', pts: 1 },
    ] },
    discours: { total: 5, criteres: [
      { nom: 'Conformité à la consigne d’écriture', pts: 2 },
      { nom: 'Cohérence de l’argumentation', pts: 1.5 },
      { nom: 'Structure et progression du texte', pts: 1.5 },
    ] },
    variantes: [
      { academie: 'Laâyoune-Sakia El Hamra', ventilation: 'conformité 2 / cohérence 1,5 / structure 1,5' },
      { academie: 'Fès-Meknès', ventilation: 'conformité 1 / cohérence 1 / structure et progression 3' },
      { academie: 'Tanger-Tétouan-Al Hoceïma', ventilation: 'conformité 1 / cohérence 2 / structure 2' },
      { academie: 'Dakhla-Oued Ed-Dahab', ventilation: 'consigne 1 / texte argumentatif cohérent 4' },
    ],
  },
};

/* ------------------------------------------------- statistiques calculées
   Tout se déduit des relevés ci-dessus. Aucun chiffre n'est écrit à la main :
   ajouter un sujet suffit à mettre à jour ce que voit l'élève. */
(function () {
  var S = window.PF_DATA.statsRegional;
  var sujets = S.sujets;
  var tousItems = [];
  sujets.forEach(function (s) { s.items.forEach(function (i) { tousItems.push(i); }); });

  function compter(liste, cle) {
    var m = {};
    liste.forEach(function (x) { var v = x[cle]; if (v) m[v] = (m[v] || 0) + 1; });
    return Object.keys(m).map(function (k) { return { cle: k, n: m[k] }; })
      .sort(function (a, b) { return b.n - a.n; });
  }

  /* Dans combien de SUJETS cette forme d'item apparaît-elle au moins une fois ?
     C'est le chiffre qui parle à l'élève : « ça tombe dans 10 sujets sur 11 »
     est plus utile que « 10 questions sur 110 ». */
  function presence(forme) {
    return sujets.filter(function (s) {
      return s.items.some(function (i) { return i.forme === forme; });
    }).length;
  }

  var formesPresence = {};
  tousItems.forEach(function (i) {
    if (!(i.forme in formesPresence)) formesPresence[i.forme] = presence(i.forme);
  });

  S.calcule = {
    nbSujets: sujets.length,
    nbItems: tousItems.length,
    oeuvres: compter(sujets, 'oeuvre'),
    formes: compter(tousItems, 'forme'),
    notions: compter(tousItems, 'notion'),
    themes: sujets.map(function (s) {
      return { academie: s.academie, sujet: s.themeProduction };
    }),

    /* formes triées par nombre de SUJETS où elles apparaissent */
    presence: Object.keys(formesPresence).map(function (f) {
      return { forme: f, sujets: formesPresence[f] };
    }).sort(function (a, b) { return b.sujets - a.sujets; }),

    /* le 2/6/2 est-il respecté partout ? */
    structureRespectee: sujets.every(function (s) {
      var c = { contextualiser: 0, analyser: 0, reagir: 0 };
      s.items.forEach(function (i) { c[i.capacite]++; });
      return c.contextualiser === 2 && c.analyser === 6 && c.reagir === 2;
    }),

    /* combien de sujets impriment noir sur blanc les trois capacités */
    capacitesImprimees: sujets.filter(function (s) { return s.capacitesImprimees; }).length,
  };
})();
