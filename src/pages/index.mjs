/* ============================================================================
   PAGES PUBLIQUES (référencement)

   Pourquoi elles existent : la plateforme est une application derrière un
   code. Google n'avait donc qu'UNE seule URL à indexer, et aucun élève ne
   pouvait nous trouver en cherchant « résumé Antigone » ou « figures de
   style Boîte à Merveilles ». Ces pages sont la porte d'entrée : du contenu
   réellement utile, librement accessible, qui amène vers l'essai gratuit.

   Ce qu'on publie / ce qu'on ne publie pas :
   - PUBLIÉ : présentation des œuvres, personnages, thèmes, contexte,
     format de l'épreuve. C'est ce qu'un élève trouve déjà partout — ce
     n'est pas ce qui fait notre valeur.
   - JAMAIS PUBLIÉ : les 330 questions et leurs réponses, les 42 corrections
     d'annales, les résumés chapitre par chapitre, la méthode détaillée, les
     modèles rédigés. Ça reste derrière le code.

   Droits d'auteur : aucune citation de Sefrioui ni d'Anouilh (œuvres
   protégées). Hugo est dans le domaine public. On décrit et on analyse,
   on ne recopie pas.

   POUR MODIFIER UNE PAGE : édite le texte ici puis lance `npm run build`.
============================================================================ */

export const PAGES = [
  /* ---------------------------------------------------------------------- */
  {
    slug: 'la-boite-a-merveilles',
    titre: 'La Boîte à Merveilles : résumé, personnages et thèmes — 1BAC',
    description:
      'La Boîte à Merveilles d’Ahmed Sefrioui expliquée aux élèves de 1BAC : l’auteur, le récit, les personnages, les thèmes et ce qui tombe à l’examen régional.',
    h1: 'La Boîte à Merveilles — tout ce qu’il faut comprendre avant le régional',
    chapo:
      'Roman autobiographique d’Ahmed Sefrioui publié en 1954, La Boîte à Merveilles est au programme de la première année du baccalauréat au Maroc. Voici l’essentiel, organisé comme l’examen l’attend.',
    sections: [
      {
        h2: 'L’auteur et le contexte de production',
        blocs: [
          { p: 'Ahmed Sefrioui (1915-2004) est né à Fès, dans une famille modeste d’origine amazighe. Il est considéré comme l’un des fondateurs de la littérature marocaine d’expression française. La Boîte à Merveilles paraît en 1954, deux ans avant l’indépendance du Maroc : le pays est encore sous protectorat français.' },
          { p: 'Ce contexte explique une partie des débats autour du roman. Sefrioui y peint une Fès traditionnelle, intime, presque hors du temps, sans aborder frontalement la question coloniale. Certains critiques y ont vu une littérature « ethnographique » ; d’autres soulignent qu’il donne pour la première fois une voix littéraire à l’enfance marocaine ordinaire. Savoir formuler ces deux lectures est utile le jour de l’examen.' },
          { p: 'Le roman est autobiographique : Sefrioui y transpose ses propres souvenirs d’enfance. Attention cependant à la nuance que les correcteurs attendent — le narrateur n’est pas exactement l’auteur, c’est un adulte qui reconstruit ses souvenirs, avec tout ce que la mémoire déforme.' },
        ],
      },
      {
        h2: 'Le récit en quelques lignes',
        blocs: [
          { p: 'Un narrateur adulte, solitaire, se souvient de l’enfant qu’il était à six ans, dans la médina de Fès des années 1920. Il vivait avec ses parents à Dar Chouafa, une maison partagée où logeait une voyante au rez-de-chaussée.' },
          { p: 'Le roman suit une année de cette vie d’enfant : l’école coranique et son maître sévère, les disputes des voisines dans la cour, les visites au sanctuaire, les fêtes, les maladies, les rumeurs du quartier. Le père, tisserand, perd son capital et doit partir travailler loin de Fès ; l’enfant reste seul avec sa mère, dans l’angoisse de l’attente, avant le retour du père et le retour à l’ordre.' },
          { p: 'La « boîte à merveilles » du titre est une simple boîte où l’enfant range des objets sans valeur — boutons, billes, perles. C’est son refuge : quand le monde des adultes devient hostile ou incompréhensible, il ouvre sa boîte et s’invente un ailleurs.' },
        ],
      },
      {
        h2: 'Les personnages à connaître',
        blocs: [
          {
            liste: [
              '<b>Sidi Mohammed</b> — le narrateur enfant, six ans, rêveur, solitaire, souvent malade. Tout le roman passe par son regard.',
              '<b>Lalla Zoubida</b> — la mère. Volubile, superstitieuse, prompte aux querelles comme aux réconciliations. Elle incarne la société féminine de la médina.',
              '<b>Sidi Abdeslem</b> — le père, tisserand. Digne, silencieux, respecté. Son départ forcé fait basculer le récit.',
              '<b>Lalla Aïcha</b> — l’amie de la mère, dont le mari Moulay Larbi prend une seconde épouse. Son histoire est le contrepoint malheureux du couple des parents.',
              '<b>Le fqih du Msid</b> — le maître de l’école coranique, sévère, redouté, dont l’autorité structure les journées de l’enfant.',
              '<b>Rahma, Fatma Bziouya, Driss El Aouad</b> — les voisins de Dar Chouafa. Leurs épisodes (la disparition de Zineb, la lampe à pétrole) donnent au roman sa chronique de la vie collective.',
              '<b>Abdellah l’épicier</b> — le conteur du quartier, dont les histoires nourrissent l’imaginaire de l’enfant.',
            ],
          },
        ],
      },
      {
        h2: 'Les thèmes que l’examen privilégie',
        blocs: [
          { p: '<b>L’enfance et la solitude.</b> Sidi Mohammed n’a pas d’ami de son âge. Sa solitude n’est pas un accident du récit : c’est ce qui rend possible son monde imaginaire.' },
          { p: '<b>La mémoire et le regard rétrospectif.</b> Deux voix se superposent en permanence : l’enfant qui vit la scène et l’adulte qui la raconte. Repérer laquelle parle dans un passage donné est une question de régional très fréquente.' },
          { p: '<b>La société traditionnelle fassie.</b> La médina, les métiers, les rites, les fêtes, la hiérarchie entre les familles, la place des femmes dans un espace clos.' },
          { p: '<b>La superstition et la religion populaire.</b> La voyante, les amulettes, les visites aux sanctuaires cohabitent avec la pratique religieuse et l’école coranique.' },
          { p: '<b>La pauvreté et la précarité.</b> La ruine du père rappelle à quel point cet équilibre familial tient à peu de choses.' },
          { p: '<b>Le merveilleux et l’imaginaire.</b> La boîte, les contes d’Abdellah, les rêves : l’enfant transforme le réel plutôt que de le subir.' },
        ],
      },
      {
        h2: 'Ce qui tombe le plus souvent au régional',
        blocs: [
          { p: 'Sur cette œuvre, les sujets régionaux reviennent régulièrement sur les mêmes terrains :' },
          {
            liste: [
              'situer le passage dans l’œuvre (contextualisation) — une question courte mais qui coûte cher quand on l’improvise ;',
              'identifier le narrateur et le point de vue, et distinguer la voix de l’enfant de celle de l’adulte ;',
              'relever et analyser une figure de style dans une description de Fès — comparaison et métaphore surtout ;',
              'travailler un champ lexical (celui de la lumière, de l’enfermement, de la nourriture, de la peur) ;',
              'les faits de langue : valeurs des temps du récit, discours rapporté, expression de la cause et de la conséquence ;',
              'une production écrite sur l’enfance, les souvenirs, la solitude ou la tradition.',
            ],
          },
        ],
      },
    ],
    faq: [
      {
        q: 'La Boîte à Merveilles est-elle une autobiographie ou un roman ?',
        r: 'Les deux à la fois : on parle de roman autobiographique. Sefrioui s’inspire de sa propre enfance à Fès, mais il compose un récit littéraire, avec des choix de narration et de mise en scène. Dans une copie, la formule attendue est « récit autobiographique » ou « roman autobiographique » — pas « autobiographie » tout court.',
      },
      {
        q: 'Combien de chapitres compte le roman ?',
        r: 'Douze. Ils suivent à peu près une année de la vie de l’enfant, rythmée par les saisons, les fêtes et les événements du quartier.',
      },
      {
        q: 'Que symbolise la boîte à merveilles ?',
        r: 'Le refuge imaginaire de l’enfant. Les objets qu’elle contient n’ont aucune valeur marchande ; leur valeur vient de ce que l’enfant projette dessus. C’est le symbole central du roman : face à un monde d’adultes qu’il ne maîtrise pas, il s’invente un espace à lui.',
      },
    ],
  },

  /* ---------------------------------------------------------------------- */
  {
    slug: 'antigone',
    titre: 'Antigone d’Anouilh : résumé, personnages et thèmes — 1BAC',
    description:
      'Antigone de Jean Anouilh expliquée aux élèves de 1BAC Maroc : le contexte de 1944, l’intrigue, les personnages, le tragique et ce qui tombe à l’examen régional.',
    h1: 'Antigone de Jean Anouilh — comprendre la pièce avant de la réviser',
    chapo:
      'Créée à Paris en 1944, l’Antigone de Jean Anouilh réécrit la tragédie de Sophocle dans une langue moderne. Au programme de la première année du baccalauréat, c’est l’œuvre où les élèves perdent le plus de points faute d’avoir compris ce qui s’y joue vraiment.',
    sections: [
      {
        h2: 'L’auteur et le contexte de création',
        blocs: [
          { p: 'Jean Anouilh (1910-1987) est un dramaturge français. Son Antigone est représentée pour la première fois en février 1944, à Paris, alors que la France est occupée par l’Allemagne nazie.' },
          { p: 'Ce contexte est décisif. La pièce a pu être lue de deux façons opposées : Antigone qui dit non à l’ordre établi, c’est la Résistance ; Créon qui assume de gouverner et de salir ses mains pour maintenir l’État, c’est la position du pouvoir en place. Anouilh laisse volontairement les deux lectures ouvertes — et c’est précisément cette ambiguïté qu’une bonne copie sait nommer, au lieu de choisir un camp.' },
          { p: 'La pièce reprend le mythe grec traité par Sophocle au V<sup>e</sup> siècle avant J.-C., mais Anouilh en modernise entièrement le traitement : personnages en costumes contemporains, langage familier, anachronismes assumés (le tricot, les cigarettes des gardes, la voiture d’Hémon).' },
        ],
      },
      {
        h2: 'L’intrigue',
        blocs: [
          { p: 'Œdipe est mort. Ses deux fils, Étéocle et Polynice, se sont entretués pour le trône de Thèbes. Créon, leur oncle, devenu roi, a fait à Étéocle des funérailles solennelles et a interdit qu’on enterre Polynice, déclaré traître : quiconque tentera de le faire sera mis à mort.' },
          { p: 'Antigone, sœur des deux morts, brave l’interdit et recouvre le corps de son frère. Arrêtée par les gardes, elle est amenée devant Créon. Celui-ci, qui veut la sauver, cherche d’abord à étouffer l’affaire, puis tente de la convaincre : il lui révèle que ses deux frères ne valaient pas mieux l’un que l’autre, et qu’il n’a même pas su lequel des corps il a fait enterrer.' },
          { p: 'Antigone vacille un instant, puis refuse — non plus au nom de son frère, mais au nom d’un refus plus large : elle ne veut pas du bonheur médiocre qu’on lui propose. Créon la fait emmurer. Hémon, son fiancé et fils de Créon, se donne la mort auprès d’elle ; Eurydice, la mère d’Hémon, se tue à son tour. Créon reste seul, vivant, et retourne à ses dossiers.' },
        ],
      },
      {
        h2: 'Les personnages',
        blocs: [
          {
            liste: [
              '<b>Antigone</b> — jeune, maigre, obstinée. Elle ne défend pas seulement un rite funéraire : elle refuse de vieillir, de transiger, d’accepter la vie telle qu’elle est.',
              '<b>Créon</b> — le roi. Ce n’est pas un tyran de convention : c’est un homme fatigué qui a accepté un métier ingrat et qui argumente, longuement, avec bonne foi. C’est ce qui rend l’affrontement si fort.',
              '<b>Ismène</b> — la sœur d’Antigone. Belle, raisonnable, attachée à la vie. Elle incarne le choix que le spectateur comprend et qu’Antigone méprise.',
              '<b>Hémon</b> — fils de Créon, fiancé d’Antigone. Il aime les deux et les perd tous les deux.',
              '<b>Eurydice</b> — la femme de Créon, qui tricote en silence pendant toute la pièce, et se tue à la fin.',
              '<b>La Nourrice</b> — la tendresse concrète, quotidienne, le monde du soin et des petites choses.',
              '<b>Le Prologue et le Chœur</b> — ils s’adressent au public, présentent les personnages et commentent l’action. Le Prologue annonce dès le début comment tout va finir.',
              '<b>Les trois gardes</b> — ils jouent aux cartes pendant qu’Antigone meurt. Leur indifférence est l’un des effets les plus durs de la pièce.',
            ],
          },
        ],
      },
      {
        h2: 'Les thèmes et les procédés à maîtriser',
        blocs: [
          { p: '<b>Le tragique moderne.</b> Le Prologue dit d’emblée la fin : il n’y a pas de suspense, seulement une mécanique qui se déroule. C’est la définition même du tragique chez Anouilh, et une question de cours très fréquente.' },
          { p: '<b>La révolte et l’absolu.</b> Antigone dit non. Mais son refus dépasse vite son motif initial : elle refuse le compromis, la routine, le bonheur ordinaire.' },
          { p: '<b>Le pouvoir et la responsabilité.</b> Créon défend une conception du gouvernement : il faut bien que quelqu’un dise oui, tienne la barre, accepte de se salir les mains.' },
          { p: '<b>L’enfance et le refus de grandir.</b> Antigone est constamment ramenée à l’enfance — par la Nourrice, par Créon, par ses propres souvenirs.' },
          { p: '<b>Les procédés théâtraux.</b> Didascalies, tirades, stichomythies (répliques brèves qui s’enchaînent), double énonciation, anachronismes. Les questions de langue portent souvent là-dessus.' },
        ],
      },
      {
        h2: 'Ce qui tombe le plus souvent au régional',
        blocs: [
          {
            liste: [
              'situer un extrait dans la pièce, en particulier dans la grande confrontation entre Antigone et Créon ;',
              'analyser le registre tragique et ses marques dans un passage ;',
              'expliquer un procédé théâtral repéré dans les didascalies ou le rythme des répliques ;',
              'comparer les arguments d’Antigone et de Créon, ou ceux d’Antigone et d’Ismène ;',
              'les faits de langue : types de phrases, modalités, connecteurs logiques, discours rapporté ;',
              'une production écrite sur la révolte, l’obéissance aux lois, le sacrifice ou le bonheur.',
            ],
          },
        ],
      },
    ],
    faq: [
      {
        q: 'Pourquoi Antigone refuse-t-elle encore après les révélations de Créon ?',
        r: 'Parce que son refus a changé de nature. Au début, elle veut enterrer son frère. Quand Créon détruit ce motif, elle continue au nom d’autre chose : le refus du bonheur tiède, des compromis, de la vie qu’on rabote pour la rendre supportable. C’est le tournant de la pièce, et une question d’analyse classique.',
      },
      {
        q: 'Quelle différence avec l’Antigone de Sophocle ?',
        r: 'Chez Sophocle, le conflit est d’abord religieux : les lois divines contre les lois humaines. Chez Anouilh, il devient existentiel et politique. Le langage est moderne et familier, les anachronismes sont assumés, et Créon est un personnage bien plus nuancé, presque sympathique.',
      },
      {
        q: 'Antigone est-elle une héroïne ?',
        r: 'La pièce ne tranche pas, et une copie qui tranche trop vite se ferme des points. On peut la voir comme une figure de la résistance absolue, ou comme une jeune fille qui court à la mort par orgueil et par refus de grandir. La bonne réponse expose les deux lectures et les appuie sur le texte.',
      },
    ],
  },

  /* ---------------------------------------------------------------------- */
  {
    slug: 'le-dernier-jour-d-un-condamne',
    titre: 'Le Dernier Jour d’un Condamné : résumé et thèmes — 1BAC',
    description:
      'Le Dernier Jour d’un Condamné de Victor Hugo pour les 1BAC Maroc : le projet de l’auteur, la structure, le narrateur anonyme, les thèmes et ce qui tombe au régional.',
    h1: 'Le Dernier Jour d’un Condamné — le réquisitoire de Victor Hugo',
    chapo:
      'Publié anonymement en 1829, ce court roman de Victor Hugo n’a qu’un but : rendre la peine de mort insupportable à qui le lit. Comprendre ce projet, c’est comprendre tous les choix d’écriture de l’œuvre — et répondre juste le jour du régional.',
    sections: [
      {
        h2: 'L’auteur et le projet',
        blocs: [
          { p: 'Victor Hugo (1802-1885) a vingt-sept ans quand paraît Le Dernier Jour d’un Condamné, sans nom d’auteur. Il y ajoutera en 1832 une longue préface où il assume ouvertement son intention : obtenir l’abolition de la peine de mort.' },
          { p: 'Le livre n’est donc pas seulement un roman : c’est un roman à thèse, un plaidoyer. Chaque choix d’écriture sert la démonstration. C’est le fil qui doit guider toutes vos réponses d’analyse.' },
          { p: 'Le texte se présente comme le journal intime d’un homme condamné à mort, écrit pendant les six dernières semaines puis les dernières heures de sa vie. Il s’interrompt net, au moment de l’exécution.' },
        ],
      },
      {
        h2: 'La structure et le récit',
        blocs: [
          { p: 'L’œuvre compte quarante-neuf chapitres, très inégaux : certains font plusieurs pages, d’autres quelques lignes. Cette irrégularité imite le rythme d’un journal réellement tenu, et l’accélération de l’angoisse à mesure que l’échéance approche.' },
          { p: 'Le condamné raconte son procès et le moment où le verdict tombe, puis la prison de Bicêtre, le ferrage des forçats qu’il observe depuis sa fenêtre, le transfert à la Conciergerie, le rejet de son pourvoi, la visite de sa fille Marie — qui ne le reconnaît pas —, l’aumônier, et enfin le trajet vers la place de Grève.' },
          { p: 'Deux détails sont capitaux et tombent souvent : le narrateur n’a <b>pas de nom</b>, et son <b>crime n’est jamais précisé</b>. Hugo écarte tout ce qui permettrait au lecteur de se dire « moi, c’est différent ». Le condamné n’est personne en particulier, donc il pourrait être n’importe qui.' },
        ],
      },
      {
        h2: 'Les personnages',
        blocs: [
          {
            liste: [
              '<b>Le condamné</b> — narrateur anonyme. On ne connaît de lui que sa souffrance, sa lucidité et son amour pour sa fille.',
              '<b>Marie</b> — sa fille, trois ans. La scène où elle ne le reconnaît pas et le croit mort est le sommet pathétique du livre.',
              '<b>L’aumônier</b> — le prêtre de la prison. Sa bienveillance est machinale : il répète les mêmes phrases à tous les condamnés, ce qui la rend inutile.',
              '<b>Le friauche</b> — un vieux forçat rencontré à Bicêtre, qui raconte sa vie dans l’argot des bagnes. Il montre que la société fabrique elle-même ceux qu’elle exécute.',
              '<b>Le geôlier, l’huissier, les gendarmes</b> — des rouages. Ils font leur travail, sans haine, ce qui rend la machine plus glaçante encore.',
            ],
          },
        ],
      },
      {
        h2: 'Les thèmes et les procédés',
        blocs: [
          { p: '<b>La peine de mort.</b> Hugo ne discute pas de la culpabilité : il attaque le principe même du châtiment.' },
          { p: '<b>La souffrance morale plutôt que physique.</b> L’exécution dure un instant ; l’attente dure six semaines. C’est cette attente que le livre met sous les yeux du lecteur.' },
          { p: '<b>L’enfermement et le temps.</b> Les murs se resserrent, les heures se comptent, le présent d’énonciation donne l’impression que tout se passe maintenant.' },
          { p: '<b>La focalisation interne.</b> Tout passe par la conscience du condamné. Le lecteur ne peut pas prendre de distance : c’est un choix d’argumentation, pas seulement de narration.' },
          { p: '<b>Le registre pathétique.</b> Il ne s’agit pas d’attendrir pour attendrir : l’émotion est l’argument. C’est ce que Hugo appelle plaider par le cœur plutôt que par le raisonnement.' },
        ],
      },
      {
        h2: 'Ce qui tombe le plus souvent au régional',
        blocs: [
          {
            liste: [
              'expliquer pourquoi le narrateur est anonyme et son crime tu ;',
              'identifier la focalisation et justifier son effet sur le lecteur ;',
              'analyser le registre pathétique ou tragique dans un passage donné ;',
              'relever un champ lexical (l’enfermement, la mort, le temps, le corps) et en tirer une interprétation ;',
              'les faits de langue : valeurs du présent, phrases exclamatives et interrogatives, modalisateurs, discours rapporté ;',
              'une production écrite argumentative sur la peine de mort, la justice ou la dignité humaine.',
            ],
          },
        ],
      },
    ],
    faq: [
      {
        q: 'Pourquoi Hugo n’a-t-il pas signé le livre en 1829 ?',
        r: 'Pour que le texte soit reçu comme le document authentique d’un condamné plutôt que comme la thèse d’un écrivain connu. L’anonymat renforçait l’effet de vérité. Hugo assumera pleinement l’œuvre en 1832, dans une préface où il défend ouvertement l’abolition.',
      },
      {
        q: 'Quel crime a commis le condamné ?',
        r: 'On ne le sait pas, et c’est volontaire. Si le lecteur connaissait le crime, il pourrait juger l’homme et approuver la sentence. En le taisant, Hugo oblige à juger la peine elle-même.',
      },
      {
        q: 'Est-ce un roman ou un essai ?',
        r: 'C’est un roman à thèse, sous la forme d’un journal intime fictif. La forme est romanesque, l’intention est argumentative. Dans une copie, dire simplement « c’est un roman » est insuffisant : il faut nommer le projet de plaidoyer.',
      },
    ],
  },

  /* ---------------------------------------------------------------------- */
  {
    slug: 'examen-regional-francais-1bac',
    titre: 'Examen régional de français 1BAC Maroc — format, barème et méthode',
    description:
      'Comment se passe l’examen régional de français en 1re année du baccalauréat au Maroc : structure de l’épreuve, barème sur 20, types de questions et méthode pour chacun.',
    h1: 'L’examen régional de français en 1BAC : format, barème et méthode',
    chapo:
      'Beaucoup d’élèves connaissent les œuvres et perdent quand même la moitié des points. La raison est presque toujours la même : ils répondent à côté de ce que la question demande. Voici comment l’épreuve est construite et ce que le correcteur attend, question par question.',
    sections: [
      {
        h2: 'Comment l’épreuve est construite',
        blocs: [
          { p: 'L’épreuve part d’un <b>texte</b> : un extrait de l’une des trois œuvres au programme. Tout ce qui suit s’appuie sur ce texte, jamais sur vos souvenirs de lecture seuls.' },
          { p: 'Le sujet se partage ensuite en deux blocs de poids égal :' },
          {
            liste: [
              '<b>L’étude de texte — 10 points.</b> Une série de questions courtes qui vérifient la compréhension, la capacité d’analyse et la maîtrise de la langue.',
              '<b>La production écrite — 10 points.</b> Un sujet de rédaction, le plus souvent argumentatif, en lien avec un thème du texte.',
            ],
          },
          { p: 'Vérifiez toujours la consigne exacte de votre académie sur le sujet du jour : la répartition des points par question et le nombre de questions peuvent varier légèrement d’une région à l’autre.' },
        ],
      },
      {
        h2: 'Les cinq types de questions, et ce qu’on attend pour chacun',
        blocs: [
          { p: '<b>1. Contextualiser le passage.</b> On vous demande de situer l’extrait dans l’œuvre. Réponse attendue en trois temps : l’œuvre et son auteur, ce qui se passe juste avant, ce que contient ce passage précis. Deux ou trois phrases suffisent — mais elles doivent être précises.' },
          { p: '<b>2. Comprendre.</b> Questions sur le contenu explicite : qui parle, à qui, où, pourquoi. La réponse est dans le texte. L’erreur classique est de raconter tout ce qu’on sait au lieu de répondre à ce qui est demandé.' },
          { p: '<b>3. Analyser.</b> Figures de style, champs lexicaux, focalisation, tonalité. Ici, la structure de la réponse compte autant que le contenu : <b>relevé exact entre guillemets</b>, puis <b>nom du procédé</b>, puis <b>effet produit</b>. Une réponse qui donne le nom sans le relevé, ou le relevé sans l’effet, perd des points même quand elle est juste.' },
          { p: '<b>4. Les faits de langue.</b> Types de phrases, valeurs des temps, discours rapporté, expression de la cause, de la conséquence, de l’opposition, modalisateurs. C’est la partie la plus rentable de l’épreuve : les règles sont finies et se révisent en quelques heures.' },
          { p: '<b>5. Réagir.</b> On vous demande votre avis. Il n’y a pas de bonne opinion, mais il y a une bonne forme : une position claire, un argument, un exemple. Répondre « oui, parce que c’est bien » ne rapporte rien.' },
        ],
      },
      {
        h2: 'La production écrite',
        blocs: [
          { p: 'C’est la moitié de la note, et souvent la partie la plus mal préparée. Le correcteur évalue quatre choses : le respect de la consigne, l’organisation du propos, la qualité des arguments et des exemples, la correction de la langue.' },
          { p: 'Le réflexe qui change tout : passer cinq minutes à écrire un plan au brouillon avant de rédiger. Une introduction qui pose le sujet, deux ou trois paragraphes qui portent chacun un argument accompagné d’un exemple, une conclusion qui répond clairement à la question posée.' },
          { p: 'Gardez cinq minutes à la fin pour relire uniquement la langue : accords, conjugaisons, ponctuation. C’est le meilleur rendement possible de cinq minutes.' },
        ],
      },
      {
        h2: 'Les erreurs qui coûtent le plus cher',
        blocs: [
          {
            liste: [
              'Raconter l’œuvre au lieu de répondre à la question posée.',
              'Confondre comparaison et métaphore : s’il y a un outil de comparaison, c’est une comparaison.',
              'Nommer une figure de style sans citer le passage exact ni expliquer son effet.',
              'Rédiger la production écrite sans plan, et s’arrêter au milieu d’une idée faute de temps.',
              'Négliger les faits de langue, alors que ce sont les points les plus faciles à sécuriser.',
              'Ne pas relire : les fautes d’accord coûtent des points sur une copie par ailleurs correcte.',
            ],
          },
        ],
      },
      {
        h2: 'Comment s’entraîner efficacement',
        blocs: [
          { p: 'Relire ses résumés donne l’impression d’avancer, mais c’est l’une des méthodes les moins efficaces qui soient. Ce qui fait progresser, c’est de <b>se tester</b> : essayer de retrouver l’information de mémoire, se tromper, corriger, puis revoir la même notion quelques jours plus tard.' },
          { p: 'C’est exactement ce que fait notre plateforme : des séries de questions courtes sur les trois œuvres, corrigées immédiatement, et les notions ratées qui reviennent d’elles-mêmes à un jour, trois jours puis une semaine d’intervalle. Trois leçons sont ouvertes gratuitement, sans inscription.' },
        ],
      },
    ],
    faq: [
      {
        q: 'Quelles sont les œuvres au programme en 1BAC ?',
        r: 'La Boîte à Merveilles d’Ahmed Sefrioui, Antigone de Jean Anouilh et Le Dernier Jour d’un Condamné de Victor Hugo. L’extrait du sujet est tiré de l’une d’elles — d’où l’intérêt de ne pas en négliger une seule.',
      },
      {
        q: 'Comment sont répartis les 20 points ?',
        r: 'Dix points pour l’étude de texte et dix points pour la production écrite. Beaucoup d’élèves passent l’essentiel de leur temps de révision sur les œuvres et presque rien sur la rédaction, alors qu’elle vaut la moitié de la note.',
      },
      {
        q: 'Faut-il apprendre des citations par cœur ?',
        r: 'Quelques-unes suffisent, et elles servent surtout en production écrite. Pour l’étude de texte, le passage est sous vos yeux : ce qui compte est de savoir le relever et l’analyser correctement, pas de le connaître par cœur.',
      },
    ],
  },
];
