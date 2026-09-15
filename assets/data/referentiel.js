/* ============================================================================
   RÉFÉRENTIEL DU PROGRAMME — 1re année du baccalauréat, français, Maroc

   C'est la colonne vertébrale de la plateforme. Tout le reste s'y rattache :
   chaque question porte l'identifiant d'une notion de ce fichier, le parcours
   en est déduit, le bilan de l'élève se lit notion par notion, et le build
   refuse de passer si une question cite une notion qui n'existe pas ici.

   SOURCE : « L'examen normalisé régional pour l'obtention du baccalauréat —
   Cadre de référence de langue française », Centre national de l'évaluation,
   des examens et de l'orientation (CNEE), Ministère de l'Éducation nationale.
   Complété, pour la rubrique « langue » que le cadre ne détaille pas, par les
   progressions académiques et les sujets régionaux réellement tombés.

   STATUTS — ce que vaut chaque ligne :
     'officiel'  écrit dans le cadre de référence du ministère
     'programme' dans la progression enseignée de 1re bac
     'pratique'  attesté dans les sujets régionaux, sans être nommé au cadre

   DEUX RÈGLES DU CADRE QUI ENGAGENT TOUTE L'APPLICATION :
   1. La terminologie de la critique littéraire (focalisation, incipit, point
      de vue) NE DOIT JAMAIS apparaître dans une consigne. L'élève doit
      connaître la notion ; il ne la verra jamais nommée dans l'énoncé.
      → champ `interditEnConsigne: true` sur les notions concernées.
   2. La langue n'est pas une rubrique séparée : elle est évaluée DE MANIÈRE
      INTÉGRÉE, toujours reliée à la construction du sens. Une question de
      langue qui ne relie rien au sens est hors cadre.

   POUR MODIFIER : éditer ce fichier, puis `npm run build`. Le validateur
   signale toute incohérence avant la mise en ligne.
============================================================================ */
window.PF_REFERENTIEL = {
  version: '2026-09-15',
  source: 'Cadre de référence CNEE — examen régional normalisé de français, 1re bac',

  /* ------------------------------------------------------------ l'épreuve
     Ces chiffres pilotent le jeu en coulisses : ils décident du poids des
     mondes, de la composition de l'examen blanc et du calcul de la jauge
     « prêt à X % ». L'élève ne les lit jamais. */
  epreuve: {
    duree: '2 heures',
    note: 20,
    support: 'un ou deux textes littéraires tirés des œuvres au programme',
    composantes: [
      {
        id: 'etude',
        nom: 'Étude de texte',
        points: 10,
        capacites: [
          { id: 'contextualiser', nom: 'Contextualiser', items: 2, points: 2,
            quoiFaire: 'Situer le texte : œuvre, auteur, genre, époque, place du passage dans l’histoire.' },
          { id: 'analyser', nom: 'Analyser', items: 6, points: 6,
            quoiFaire: 'Construire le sens : relever, nommer, expliquer l’effet. C’est ici que vivent toutes les notions de langue.' },
          { id: 'reagir', nom: 'Réagir', items: 2, points: 2,
            quoiFaire: 'Donner un avis et le justifier. Une opinion sans argument ne vaut rien.' },
        ],
      },
      {
        id: 'production',
        nom: 'Production écrite',
        points: 10,
        criteres: [
          { id: 'discours', nom: 'Discours', points: 5,
            details: ['Conformité à la consigne', 'Cohérence de l’argumentation', 'Structure et progression du texte'] },
          { id: 'langue', nom: 'Langue', points: 5,
            details: ['Vocabulaire précis et varié', 'Syntaxe correcte', 'Ponctuation adéquate', 'Orthographe', 'Conjugaison'] },
        ],
      },
    ],
  },

  /* -------------------------------------------------------------- œuvres */
  oeuvres: [
    { id: 'boite', module: 1, titre: 'La Boîte à Merveilles', auteur: 'Ahmed Sefrioui',
      genre: 'Roman autobiographique', parution: 1954, chapitres: 12, couleur: '#0e8a6f' },
    { id: 'antigone', module: 2, titre: 'Antigone', auteur: 'Jean Anouilh',
      genre: 'Tragédie moderne', ecriture: 1942, creation: '4 février 1944', couleur: '#6a3fb5' },
    { id: 'condamne', module: 3, titre: 'Le Dernier Jour d’un Condamné', auteur: 'Victor Hugo',
      genre: 'Roman à thèse', parution: 1829, prefacePar: 1832, chapitres: 49, couleur: '#d1462f' },
  ],

  /* ------------------------------------------------------------- ateliers
     Les dix familles de la rubrique « langue », transformées en dix lieux.
     L'élève visite un atelier ; il ne « révise pas la grammaire ». Le nom
     officiel reste sur la notion elle-même : « métaphore » doit être su. */
  ateliers: [
    {
      id: 'lexique', famille: 'Lexique', jeu: 'La Forge des Mots', icone: '🔤',
      promesse: 'Les mots ne disent pas tous la même chose de la même façon.',
      notions: [
        { id: 'lex-champ-lexical', nom: 'Champ lexical', statut: 'programme',
          def: 'Un ensemble de mots d’un texte qui renvoient à une même idée : la mort, la peur, l’enfance, l’enfermement.',
          ex: 'Chez Hugo, le champ lexical de l’enfermement sature la description du cachot.' },
        { id: 'lex-champ-semantique', nom: 'Champ sémantique', statut: 'programme',
          def: 'Tous les sens possibles d’UN SEUL mot. À ne pas confondre avec le champ lexical, qui porte sur plusieurs mots.' },
        { id: 'lex-denotation', nom: 'Dénotation et connotation', statut: 'programme',
          def: 'La dénotation est le sens du dictionnaire ; la connotation, tout ce que le mot traîne avec lui d’affectif ou de culturel.' },
        { id: 'lex-melioratif', nom: 'Mélioratif et péjoratif', statut: 'programme',
          def: 'Un vocabulaire qui valorise ou qui dévalorise. C’est la trace du jugement de celui qui parle.' },
        { id: 'lex-niveaux', nom: 'Niveaux de langue', statut: 'programme',
          def: 'Familier, courant, soutenu. L’argot des forçats chez Hugo et la langue des Gardes chez Anouilh sont du familier.' },
        { id: 'lex-substituts', nom: 'Substituts et reprises', statut: 'programme',
          def: 'Comment un texte reparle de la même chose sans se répéter : pronoms, synonymes, périphrases. C’est ce qui tient le texte ensemble.',
          ex: '« À qui renvoie ce “il” ? » revient presque chaque année.' },
        { id: 'lex-formation', nom: 'Formation des mots', statut: 'programme',
          def: 'Préfixes, suffixes, familles de mots, mots composés, emprunts — comme les mots arabes conservés par Sefrioui.' },
      ],
    },
    {
      id: 'voix', famille: 'Énonciation', jeu: 'La Chambre des Voix', icone: '🗣️',
      promesse: 'Derrière chaque phrase, quelqu’un parle à quelqu’un.',
      notions: [
        { id: 'eno-situation', nom: 'Situation d’énonciation', statut: 'programme',
          def: 'Qui parle, à qui, où, quand, et pourquoi.' },
        { id: 'eno-embrayeurs', nom: 'Indices d’énonciation', statut: 'programme',
          def: 'Les mots qui n’ont de sens que dans la situation : je, tu, ici, maintenant, hier.' },
        { id: 'eno-ancre-coupe', nom: 'Énoncé ancré et énoncé coupé', statut: 'programme',
          def: 'Ancré : rattaché à celui qui parle (présent, je, ici) — c’est le discours. Coupé : détaché (passé simple, il, ce jour-là) — c’est le récit.' },
        { id: 'eno-double', nom: 'Double énonciation', statut: 'programme',
          def: 'Au théâtre, le personnage parle à un autre personnage ET l’auteur parle au spectateur, en même temps.',
          ex: 'Tout Antigone repose là-dessus.' },
        { id: 'eno-modalisation', nom: 'Modalisation', statut: 'programme',
          def: 'Les marques du doute, de la certitude ou du jugement : peut-être, sans doute, sembler, devoir, le conditionnel.' },
        { id: 'eno-implicite', nom: 'Implicite : présupposé et sous-entendu', statut: 'programme',
          def: 'Ce qu’une phrase dit sans le dire. Le présupposé est inscrit dans la phrase ; le sous-entendu se déduit de la situation.' },
        { id: 'eno-visee', nom: 'Visée du texte', statut: 'programme',
          def: 'Ce que le texte cherche à faire : informer, raconter, décrire, expliquer, argumenter, émouvoir, dénoncer.' },
      ],
    },
    {
      id: 'machines', famille: 'Narration', jeu: 'La Salle des Machines', icone: '⚙️',
      promesse: 'Comment une histoire est montée, vue de l’intérieur.',
      notions: [
        { id: 'nar-schema-narratif', nom: 'Schéma narratif', statut: 'programme',
          def: 'Situation initiale, élément perturbateur, péripéties, résolution, situation finale.' },
        { id: 'nar-schema-actantiel', nom: 'Schéma actantiel', statut: 'programme',
          def: 'Qui veut quoi, grâce à qui, contre qui : sujet, objet, destinateur, destinataire, adjuvant, opposant.' },
        { id: 'nar-statut-narrateur', nom: 'Statut du narrateur', statut: 'programme',
          def: 'Celui qui raconte est-il dans l’histoire ou en dehors ? Et surtout : ce n’est jamais l’auteur.' },
        { id: 'nar-focalisation', nom: 'Points de vue narratifs', statut: 'programme', interditEnConsigne: true,
          def: 'Ce que le narrateur sait : tout (omniscient), seulement ce que sait un personnage (interne), ou seulement ce qui se voit (externe).',
          ex: 'Le condamné de Hugo ne sait rien de plus que nous : c’est ce qui rend l’attente insupportable.' },
        { id: 'nar-ordre', nom: 'Ordre du récit', statut: 'programme',
          def: 'Retour en arrière (analepse) ou anticipation (prolepse) : l’histoire n’est pas racontée dans l’ordre où elle s’est passée.' },
        { id: 'nar-rythme', nom: 'Rythme du récit', statut: 'programme',
          def: 'Ellipse (on saute), sommaire (on résume), scène (temps réel), pause (on s’arrête pour décrire).',
          ex: 'Six semaines en deux pages, puis les dernières heures minute par minute.' },
        { id: 'nar-enchasse', nom: 'Récit enchâssé', statut: 'programme',
          def: 'Un récit à l’intérieur du récit : les contes d’Abdallah l’épicier, l’histoire du friauche.' },
        { id: 'nar-ouverture-cloture', nom: 'Ouverture et clôture de l’œuvre', statut: 'programme', interditEnConsigne: true,
          def: 'La première page installe tout ; la dernière referme. On dit incipit et excipit — mais jamais dans un énoncé d’examen.' },
      ],
    },
    {
      id: 'echos', famille: 'Discours rapporté', jeu: 'Le Mur des Échos', icone: '💬',
      promesse: 'Rapporter les paroles d’un autre, et ce que ça change.',
      notions: [
        { id: 'dis-direct', nom: 'Discours direct', statut: 'programme',
          def: 'Les paroles telles quelles, avec deux-points, guillemets ou tirets, et un verbe qui introduit.' },
        { id: 'dis-indirect', nom: 'Discours indirect', statut: 'programme',
          def: 'Les paroles passées en subordonnée : les temps, les pronoms et les repères de temps changent tous.' },
        { id: 'dis-indirect-libre', nom: 'Discours indirect libre', statut: 'programme',
          def: 'Ni guillemets ni subordination : la voix du personnage se mêle à celle du narrateur.' },
        { id: 'dis-narrativise', nom: 'Discours narrativisé', statut: 'programme',
          def: 'Les paroles résumées en un seul verbe : « il avoua sa faute ».' },
        { id: 'dis-verbes', nom: 'Verbes introducteurs', statut: 'programme',
          def: 'Murmurer, hurler, objecter, avouer : le verbe choisi oriente déjà l’interprétation.' },
      ],
    },
    {
      id: 'chantier', famille: 'Grammaire de la phrase', jeu: 'Le Chantier des Phrases', icone: '🧱',
      promesse: 'Monter une phrase, et comprendre pourquoi elle est montée ainsi.',
      notions: [
        { id: 'gra-types', nom: 'Types de phrases', statut: 'programme',
          def: 'Déclarative, interrogative, exclamative, injonctive.' },
        { id: 'gra-formes', nom: 'Formes de phrases', statut: 'programme',
          def: 'Affirmative ou négative, active ou passive, neutre ou emphatique, personnelle ou impersonnelle.' },
        { id: 'gra-simple-complexe', nom: 'Phrase simple et phrase complexe', statut: 'programme',
          def: 'Juxtaposition, coordination, subordination : trois façons de relier des propositions.' },
        { id: 'gra-cause', nom: 'Subordonnée de cause', statut: 'programme',
          def: 'Parce que, puisque, comme, étant donné que : elle dit pourquoi.' },
        { id: 'gra-consequence', nom: 'Subordonnée de conséquence', statut: 'programme',
          def: 'Si bien que, de sorte que, tellement… que : elle dit ce qui s’ensuit.' },
        { id: 'gra-but', nom: 'Subordonnée de but', statut: 'programme',
          def: 'Afin que, pour que, de peur que : elle dit dans quelle intention. Toujours au subjonctif.' },
        { id: 'gra-temps', nom: 'Subordonnée de temps', statut: 'programme',
          def: 'Quand, lorsque, dès que, avant que, après que : elle situe dans le temps.' },
        { id: 'gra-condition', nom: 'Condition et hypothèse', statut: 'programme',
          def: 'Les trois systèmes en « si » : le réel, le potentiel, l’irréel. Chacun a ses temps obligés.' },
        { id: 'gra-comparaison', nom: 'Subordonnée de comparaison', statut: 'programme',
          def: 'Comme, de même que, plus… que : elle met deux choses en regard.' },
        { id: 'gra-opposition', nom: 'Opposition et concession', statut: 'programme',
          def: 'Alors que, tandis que (opposition) ; bien que, quoique, même si, malgré (concession).' },
        { id: 'gra-relative', nom: 'Subordonnée relative', statut: 'programme',
          def: 'Qui, que, dont, où : elle complète un nom. Déterminative si elle est indispensable, explicative si elle ajoute.' },
        { id: 'gra-completive', nom: 'Subordonnée complétive', statut: 'programme',
          def: '« que » après un verbe : indicatif ou subjonctif selon le verbe principal.' },
        { id: 'gra-interro-indirecte', nom: 'Interrogative indirecte', statut: 'programme',
          def: '« Il demanda s’il viendrait » : la question devient subordonnée, et le point d’interrogation disparaît.' },
        { id: 'gra-expansion', nom: 'Expansion du nom', statut: 'programme',
          def: 'Adjectif, complément du nom, relative, apposition : tout ce qui vient enrichir un nom. L’outillage du portrait.' },
        { id: 'gra-passive', nom: 'Voix active et voix passive', statut: 'programme',
          def: 'Le passif permet d’effacer celui qui agit — procédé constant du langage de la justice chez Hugo.' },
        { id: 'gra-relief', nom: 'Mise en relief', statut: 'programme',
          def: '« C’est… qui », « c’est… que », ou déplacer un mot en tête : faire ressortir un élément.' },
        { id: 'gra-negation', nom: 'Négation et restriction', statut: 'programme',
          def: 'Ne… pas, ne… plus, ne… jamais, ne… rien ; et « ne… que » qui restreint au lieu de nier.' },
      ],
    },
    {
      id: 'horlogerie', famille: 'Le verbe et les temps', jeu: 'L’Horlogerie', icone: '⏳',
      promesse: 'Chaque temps verbal fabrique un effet différent.',
      notions: [
        { id: 'tps-imparfait', nom: 'Imparfait', statut: 'programme',
          def: 'Décor, habitude, durée, arrière-plan. Le temps de ce qui dure.' },
        { id: 'tps-passe-simple', nom: 'Passé simple', statut: 'programme',
          def: 'Action brève, achevée, au premier plan. Le moteur du récit.' },
        { id: 'tps-present', nom: 'Valeurs du présent', statut: 'programme',
          def: 'D’énonciation, de narration, de vérité générale, d’habitude. Chez Hugo, c’est le présent qui rend l’attente insoutenable.' },
        { id: 'tps-passe-compose', nom: 'Passé composé', statut: 'programme',
          def: 'Action achevée, mais reliée au moment où l’on parle.' },
        { id: 'tps-plus-que-parfait', nom: 'Plus-que-parfait', statut: 'programme',
          def: 'Ce qui s’est passé avant le passé. Le temps des retours en arrière.' },
        { id: 'tps-futur', nom: 'Futur', statut: 'programme',
          def: 'Projection, promesse ou menace.' },
        { id: 'tps-conditionnel', nom: 'Conditionnel', statut: 'programme',
          def: 'Hypothèse, souhait, regret, politesse, ou information non confirmée.' },
        { id: 'tps-subjonctif', nom: 'Subjonctif', statut: 'programme',
          def: 'Volonté, doute, sentiment ; obligatoire après bien que, pour que, avant que.' },
        { id: 'tps-imperatif', nom: 'Impératif', statut: 'programme',
          def: 'Ordre, conseil, prière. Le mode de celui qui veut faire agir.' },
        { id: 'tps-concordance', nom: 'Concordance des temps', statut: 'programme',
          def: 'Accorder le temps de la subordonnée à celui de la principale — surtout au discours indirect.' },
      ],
    },
    {
      id: 'figures', famille: 'Figures de style', jeu: 'Le Palais des Figures', icone: '💎',
      promesse: 'Nommer l’effet, pas seulement le repérer.',
      notions: [
        { id: 'fig-comparaison', nom: 'Comparaison', statut: 'programme',
          def: 'Deux éléments rapprochés PAR UN OUTIL : comme, tel, semblable à, ressembler à.',
          ex: 'S’il y a l’outil, c’est une comparaison. Sans outil, c’est une métaphore. Cette confusion coûte un point chaque année.' },
        { id: 'fig-metaphore', nom: 'Métaphore', statut: 'programme',
          def: 'Le même rapprochement, mais sans outil de comparaison. Filée quand elle se prolonge.' },
        { id: 'fig-personnification', nom: 'Personnification', statut: 'programme',
          def: 'Donner des traits humains à une chose, un animal ou une idée.' },
        { id: 'fig-allegorie', nom: 'Allégorie', statut: 'programme',
          def: 'Représenter une idée abstraite sous une forme concrète, souvent un personnage.' },
        { id: 'fig-hyperbole', nom: 'Hyperbole', statut: 'programme', def: 'L’exagération.' },
        { id: 'fig-gradation', nom: 'Gradation', statut: 'programme',
          def: 'Une suite qui monte ou qui descend en intensité.' },
        { id: 'fig-anaphore', nom: 'Anaphore', statut: 'programme',
          def: 'Le même mot répété en début de propositions successives : le martèlement.' },
        { id: 'fig-accumulation', nom: 'Accumulation et énumération', statut: 'programme',
          def: 'Empiler les termes jusqu’à saturer l’impression.' },
        { id: 'fig-pleonasme', nom: 'Pléonasme', statut: 'programme',
          def: 'Une redondance — maladroite le plus souvent, expressive parfois.' },
        { id: 'fig-euphemisme', nom: 'Euphémisme', statut: 'programme',
          def: 'Adoucir une réalité brutale : « il nous a quittés ».' },
        { id: 'fig-litote', nom: 'Litote', statut: 'programme',
          def: 'Dire moins pour faire entendre plus : « ce n’est pas mauvais ».' },
        { id: 'fig-antithese', nom: 'Antithèse', statut: 'programme',
          def: 'Deux idées opposées mises côte à côte.' },
        { id: 'fig-oxymore', nom: 'Oxymore', statut: 'programme',
          def: 'Deux mots contradictoires collés ensemble : « une obscure clarté ».' },
        { id: 'fig-chiasme', nom: 'Chiasme', statut: 'programme',
          def: 'Une construction en miroir : A B / B A.' },
        { id: 'fig-antiphrase', nom: 'Antiphrase', statut: 'programme',
          def: 'Dire le contraire de ce qu’on pense. C’est le moteur de l’ironie.' },
        { id: 'fig-paradoxe', nom: 'Paradoxe', statut: 'programme',
          def: 'Une affirmation qui heurte le bon sens commun.' },
        { id: 'fig-metonymie', nom: 'Métonymie', statut: 'programme',
          def: 'Nommer une chose par une autre qui lui est liée : boire un verre, lire un Hugo.' },
        { id: 'fig-synecdoque', nom: 'Synecdoque', statut: 'programme',
          def: 'Nommer le tout par la partie : « une voile » pour un navire.' },
        { id: 'fig-periphrase', nom: 'Périphrase', statut: 'programme',
          def: 'Plusieurs mots à la place d’un seul : « la place de Grève » pour l’échafaud.' },
        { id: 'fig-allitération', nom: 'Allitération', statut: 'programme',
          def: 'La répétition d’un son de consonne.' },
        { id: 'fig-assonance', nom: 'Assonance', statut: 'programme',
          def: 'La répétition d’un son de voyelle.' },
        { id: 'fig-onomatopee', nom: 'Onomatopée', statut: 'programme',
          def: 'Un mot qui imite un bruit.' },
        { id: 'fig-parallelisme', nom: 'Parallélisme', statut: 'programme',
          def: 'La même construction syntaxique reprise deux fois de suite.' },
      ],
    },
    {
      id: 'tons', famille: 'Tonalités et registres', jeu: 'La Salle des Tons', icone: '🎭',
      promesse: 'Reconnaître l’émotion qu’un texte cherche à produire.',
      notions: [
        { id: 'reg-tragique', nom: 'Registre tragique', statut: 'programme',
          def: 'La fatalité, l’impuissance, la mort qu’on ne peut plus éviter.' },
        { id: 'reg-pathetique', nom: 'Registre pathétique', statut: 'programme',
          def: 'La souffrance montrée pour provoquer la pitié.' },
        { id: 'reg-lyrique', nom: 'Registre lyrique', statut: 'programme',
          def: 'L’expression des sentiments personnels : je, exclamations, images.' },
        { id: 'reg-comique', nom: 'Registre comique', statut: 'programme',
          def: 'Le rire : de mots, de situation, de caractère, de gestes.' },
        { id: 'reg-ironique', nom: 'Registre ironique', statut: 'programme',
          def: 'Dire le contraire, feindre la naïveté, creuser un décalage.' },
        { id: 'reg-satirique', nom: 'Registre satirique', statut: 'programme',
          def: 'Critiquer un travers de la société en s’en moquant.' },
        { id: 'reg-polemique', nom: 'Registre polémique', statut: 'programme',
          def: 'Attaquer de front une thèse ou un adversaire. La préface de Hugo en est le modèle.' },
        { id: 'reg-epique', nom: 'Registre épique', statut: 'programme',
          def: 'L’amplification, l’héroïsation, les mouvements de foule.' },
        { id: 'reg-realiste', nom: 'Registre réaliste', statut: 'programme',
          def: 'Le détail vrai, la description documentaire, l’effet de réel.' },
        { id: 'reg-didactique', nom: 'Registre didactique', statut: 'programme',
          def: 'Le ton de celui qui explique pour instruire.' },
      ],
    },
    {
      id: 'arene', famille: 'Argumentation', jeu: 'L’Arène', icone: '⚖️',
      promesse: 'Défendre une idée et tenir debout face à l’objection.',
      notions: [
        { id: 'arg-these', nom: 'Thèse, antithèse, arguments', statut: 'programme',
          def: 'L’idée défendue, l’idée adverse, et ce qui les soutient.' },
        { id: 'arg-exemples', nom: 'Arguments et exemples', statut: 'programme',
          def: 'Un argument sans exemple ne convainc personne ; un exemple sans argument ne prouve rien.' },
        { id: 'arg-types', nom: 'Types d’arguments', statut: 'programme',
          def: 'Logique, d’autorité, d’expérience, par analogie, par les valeurs.' },
        { id: 'arg-refutation', nom: 'Réfutation et concession', statut: 'programme',
          def: 'Reconnaître ce qu’a de juste l’idée adverse, puis montrer pourquoi elle ne suffit pas.' },
        { id: 'arg-strategies', nom: 'Convaincre, persuader, délibérer', statut: 'programme',
          def: 'Par la raison, par les sentiments, ou en pesant le pour et le contre.' },
        { id: 'arg-connecteurs', nom: 'Connecteurs logiques', statut: 'programme',
          def: 'Les mots qui montrent le chemin : car, donc, or, cependant, en revanche, par conséquent, enfin.' },
        { id: 'arg-ironie-procedes', nom: 'Procédés de l’ironie', statut: 'programme',
          def: 'Antiphrase, exagération, fausse concession, question rhétorique.' },
      ],
    },
    {
      id: 'portraits', famille: 'Description et portrait', jeu: 'Le Cabinet des Portraits', icone: '🖼️',
      promesse: 'Faire voir un lieu ou un visage avec des mots.',
      notions: [
        { id: 'des-procedes', nom: 'Procédés de la description', statut: 'programme',
          def: 'Un ordre dans l’espace, des indicateurs de lieu, des expansions du nom, un champ lexical dominant.' },
        { id: 'des-portrait', nom: 'Le portrait', statut: 'programme',
          def: 'Physique, moral, en action ; direct s’il est dit, indirect s’il se devine aux actes et aux paroles.' },
        { id: 'des-fonctions', nom: 'Fonctions de la description', statut: 'programme',
          def: 'Informer, symboliser, préparer un événement, ou faire aimer et condamner.' },
      ],
    },
  ],
};

/* Index plat : id → notion enrichie de son atelier. Utilisé par le moteur,
   le validateur et le bilan. Construit une seule fois au chargement. */
(function () {
  var R = window.PF_REFERENTIEL;
  var index = {};
  R.ateliers.forEach(function (a) {
    a.notions.forEach(function (n) {
      n.atelier = a.id;
      n.atelierJeu = a.jeu;
      n.famille = a.famille;
      index[n.id] = n;
    });
  });
  R.notions = index;
  R.totalNotions = Object.keys(index).length;
})();
