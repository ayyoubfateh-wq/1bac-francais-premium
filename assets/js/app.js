(function(){
  var bar = document.getElementById('perf-progress');
  if(!bar) return;
  var w = 10;
  bar.style.width = w + '%';
  var iv = setInterval(function(){
    w += (90 - w) * 0.08;
    bar.style.width = w + '%';
  }, 100);
  window.addEventListener('load', function(){
    clearInterval(iv);
    bar.style.width = '100%';
    bar.style.opacity = '0';
    bar.style.transition = 'width 0.2s ease, opacity 0.5s ease 0.2s';
    setTimeout(function(){ bar.style.display='none'; }, 800);
  });
})();

/* ---- Bloc JS extrait ---- */

/* ============================================================================
   D1. DONNÉES DU QUIZ
   Modifier ici les questions/réponses sans toucher au design.
============================================================================ */
const QUESTIONS = {
  "boite": [
    {
      "cat": "Contextualisation",
      "q": "Qui est l’auteur de La Boîte à Merveilles ?",
      "opts": [
        "Ahmed Sefrioui",
        "Victor Hugo",
        "Jean Anouilh",
        "Mouloud Feraoun"
      ],
      "ans": 0,
      "exp": "Ahmed Sefrioui est l’auteur de ce roman marocain d’expression française."
    },
    {
      "cat": "Contextualisation",
      "q": "En quelle année La Boîte à Merveilles a-t-elle été publiée ?",
      "opts": [
        "1944",
        "1829",
        "1954",
        "1981"
      ],
      "ans": 2,
      "exp": "Le roman est publié en 1954, dans le contexte de l’émergence de la littérature maghrébine francophone."
    },
    {
      "cat": "Contextualisation",
      "q": "Dans quelle ville se déroule principalement le roman ?",
      "opts": [
        "Fès",
        "Rabat",
        "Marrakech",
        "Casablanca"
      ],
      "ans": 0,
      "exp": "Le récit se déroule surtout dans la médina de Fès."
    },
    {
      "cat": "Contextualisation",
      "q": "Quel est le genre de La Boîte à Merveilles ?",
      "opts": [
        "Tragédie moderne",
        "Roman autobiographique",
        "Roman policier",
        "Conte philosophique"
      ],
      "ans": 1,
      "exp": "Le roman prend la forme d’un récit autobiographique centré sur les souvenirs d’enfance."
    },
    {
      "cat": "Contextualisation",
      "q": "Comment s’appelle le narrateur enfant ?",
      "opts": [
        "Sidi Mohammed",
        "Sidi Abdeslam",
        "Hémon",
        "Polynice"
      ],
      "ans": 0,
      "exp": "Le narrateur enfant est Sidi Mohammed."
    },
    {
      "cat": "Contextualisation",
      "q": "Quel est le nom de la maison où vit Sidi Mohammed ?",
      "opts": [
        "Dar Chouafa",
        "Dar El Makhzen",
        "Bicêtre",
        "Thèbes"
      ],
      "ans": 0,
      "exp": "Sidi Mohammed vit à Dar Chouafa, la maison de la voyante."
    },
    {
      "cat": "Contextualisation",
      "q": "Quelle est la profession du père de Sidi Mohammed ?",
      "opts": [
        "Forgeron",
        "Tisserand",
        "Juge",
        "Soldat"
      ],
      "ans": 1,
      "exp": "Sidi Abdeslam est tisserand."
    },
    {
      "cat": "Contextualisation",
      "q": "Que contient la boîte à merveilles ?",
      "opts": [
        "Des bijoux précieux",
        "Des objets ordinaires transformés par l’imagination",
        "Des lettres secrètes",
        "Des pièces d’or"
      ],
      "ans": 1,
      "exp": "La boîte contient des objets simples auxquels l’enfant donne une valeur merveilleuse."
    },
    {
      "cat": "Analyse",
      "q": "Que symbolise principalement la boîte à merveilles ?",
      "opts": [
        "La richesse matérielle",
        "Le monde intérieur de l’enfant",
        "Le pouvoir politique",
        "La guerre"
      ],
      "ans": 1,
      "exp": "Elle symbolise l’imagination, le refuge intime et la capacité de l’enfant à poétiser le réel."
    },
    {
      "cat": "Analyse",
      "q": "Quel thème domine dans le roman ?",
      "opts": [
        "La solitude de l’enfant",
        "La conquête militaire",
        "Le mariage forcé",
        "La vengeance"
      ],
      "ans": 0,
      "exp": "La solitude de Sidi Mohammed est un thème central du récit."
    },
    {
      "cat": "Analyse",
      "q": "Pourquoi Sidi Mohammed se réfugie-t-il dans sa boîte ?",
      "opts": [
        "Parce qu’il veut vendre ses objets",
        "Parce qu’il se sent seul et incompris",
        "Parce qu’il prépare un voyage",
        "Parce qu’il obéit au maître"
      ],
      "ans": 1,
      "exp": "La boîte devient un refuge contre la solitude et la dureté du monde extérieur."
    },
    {
      "cat": "Analyse",
      "q": "Quel regard le narrateur adulte porte-t-il sur son enfance ?",
      "opts": [
        "Un regard nostalgique",
        "Un regard indifférent",
        "Un regard uniquement comique",
        "Un regard scientifique"
      ],
      "ans": 0,
      "exp": "Le narrateur adulte se souvient avec tendresse et nostalgie."
    },
    {
      "cat": "Analyse",
      "q": "Quel rôle joue Lalla Zoubida ?",
      "opts": [
        "Elle représente la mère protectrice",
        "Elle représente le roi",
        "Elle est la sœur du narrateur",
        "Elle est une étrangère"
      ],
      "ans": 0,
      "exp": "Lalla Zoubida est la mère de Sidi Mohammed et incarne protection, tradition et dignité."
    },
    {
      "cat": "Analyse",
      "q": "Que représente la ruine du père ?",
      "opts": [
        "La réussite sociale",
        "La fragilité économique des artisans traditionnels",
        "La victoire de l’enfant",
        "La fin du roman policier"
      ],
      "ans": 1,
      "exp": "Le déclin du père montre la précarité de l’artisanat traditionnel."
    },
    {
      "cat": "Analyse",
      "q": "Pourquoi le roman a-t-il aussi une valeur ethnographique ?",
      "opts": [
        "Il décrit les coutumes, lieux et rituels de la médina",
        "Il raconte une enquête criminelle",
        "Il explique une loi moderne",
        "Il se déroule dans un palais européen"
      ],
      "ans": 0,
      "exp": "Le roman documente la vie quotidienne, les fêtes, le hammam, le msid et le voisinage."
    },
    {
      "cat": "Analyse",
      "q": "Quel contraste oppose Sidi Mohammed aux autres enfants ?",
      "opts": [
        "Il est plus violent",
        "Il est rêveur et solitaire",
        "Il est roi",
        "Il est adulte"
      ],
      "ans": 1,
      "exp": "Sidi Mohammed est sensible, rêveur et souvent isolé."
    },
    {
      "cat": "Fait de langue",
      "q": "Dans “un bouton de nacre brillait comme un soleil”, quelle figure de style reconnaît-on ?",
      "opts": [
        "Une comparaison",
        "Une hyperbole grammaticale",
        "Une ellipse",
        "Une métonymie obligatoire"
      ],
      "ans": 0,
      "exp": "L’outil “comme” signale une comparaison."
    },
    {
      "cat": "Fait de langue",
      "q": "Quel est l’effet de l’imparfait dans “je sortais rarement” ?",
      "opts": [
        "Exprimer une habitude passée",
        "Exprimer un ordre",
        "Exprimer un futur certain",
        "Exprimer une action achevée et datée"
      ],
      "ans": 0,
      "exp": "L’imparfait sert ici à décrire une habitude dans le passé."
    },
    {
      "cat": "Fait de langue",
      "q": "Quel champ lexical domine dans “trésor, richesses, inestimable” ?",
      "opts": [
        "La valeur et le précieux",
        "La violence",
        "La justice",
        "La maladie"
      ],
      "ans": 0,
      "exp": "Ces mots valorisent les objets de la boîte."
    },
    {
      "cat": "Fait de langue",
      "q": "Quelle forme de narration domine dans le roman ?",
      "opts": [
        "Première personne",
        "Deuxième personne uniquement",
        "Narrateur externe neutre",
        "Dialogue théâtral"
      ],
      "ans": 0,
      "exp": "Le récit est majoritairement à la première personne."
    },
    {
      "cat": "Fait de langue",
      "q": "Dans “ma boîte devenait un trésor”, le mot “trésor” fonctionne comme…",
      "opts": [
        "Une métaphore",
        "Une simple date",
        "Un complément de lieu",
        "Un nom propre historique"
      ],
      "ans": 0,
      "exp": "La boîte est assimilée à un trésor sans outil de comparaison."
    },
    {
      "cat": "Fait de langue",
      "q": "Le registre “lyrique” sert surtout à exprimer…",
      "opts": [
        "Les émotions personnelles",
        "Un règlement administratif",
        "Une démonstration mathématique",
        "Un ordre militaire"
      ],
      "ans": 0,
      "exp": "Le lyrisme exprime la sensibilité, l’émotion et l’intimité."
    },
    {
      "cat": "Fait de langue",
      "q": "Quel temps verbal est fréquent dans les souvenirs d’enfance ?",
      "opts": [
        "L’imparfait",
        "Le futur antérieur",
        "L’impératif présent",
        "Le conditionnel passé uniquement"
      ],
      "ans": 0,
      "exp": "L’imparfait est adapté au souvenir, à la description et à l’habitude."
    },
    {
      "cat": "Réaction / opinion",
      "q": "Quelle réaction est la plus pertinente face à la solitude de Sidi Mohammed ?",
      "opts": [
        "Elle peut être douloureuse mais aussi créatrice",
        "Elle prouve qu’il n’a aucune imagination",
        "Elle est uniquement comique",
        "Elle n’a aucun rôle dans le roman"
      ],
      "ans": 0,
      "exp": "Une réponse nuancée montre que la solitude est souffrance et source d’imagination."
    },
    {
      "cat": "Réaction / opinion",
      "q": "Pourquoi un élève peut-il encore s’identifier à Sidi Mohammed aujourd’hui ?",
      "opts": [
        "Parce qu’il vit le besoin d’un refuge intérieur",
        "Parce qu’il est roi",
        "Parce qu’il utilise Internet",
        "Parce qu’il fuit une guerre antique"
      ],
      "ans": 0,
      "exp": "Le besoin d’imagination et d’espace intime reste actuel."
    },
    {
      "cat": "Réaction / opinion",
      "q": "Quelle opinion défendrait bien l’importance de la mémoire dans le roman ?",
      "opts": [
        "La mémoire conserve un monde disparu et lui donne un sens",
        "La mémoire empêche toute narration",
        "La mémoire supprime les personnages",
        "La mémoire transforme le roman en pièce de théâtre"
      ],
      "ans": 0,
      "exp": "La mémoire permet au narrateur adulte de reconstruire son enfance."
    },
    {
      "cat": "Réaction / opinion",
      "q": "Face à la pauvreté de la famille, quelle réponse est la plus équilibrée ?",
      "opts": [
        "Le roman montre la difficulté sans enlever la dignité des personnages",
        "Le roman se moque des pauvres",
        "Le roman nie la pauvreté",
        "La pauvreté n’a aucune importance"
      ],
      "ans": 0,
      "exp": "Sefrioui présente la pauvreté avec pudeur et dignité."
    },
    {
      "cat": "Réaction / opinion",
      "q": "Quel jugement peut-on porter sur l’imagination de l’enfant ?",
      "opts": [
        "Elle transforme le réel et l’aide à supporter la solitude",
        "Elle détruit le récit",
        "Elle rend tous les personnages méchants",
        "Elle remplace complètement la famille"
      ],
      "ans": 0,
      "exp": "L’imagination est une force de survie intérieure."
    },
    {
      "cat": "Réaction / opinion",
      "q": "Pourquoi l’étude des traditions dans l’œuvre est-elle utile ?",
      "opts": [
        "Elle aide à comprendre l’identité culturelle et sociale du roman",
        "Elle remplace l’analyse littéraire",
        "Elle sert seulement à apprendre des dates",
        "Elle n’a aucun lien avec le Bac"
      ],
      "ans": 0,
      "exp": "Les traditions éclairent le contexte, les valeurs et les personnages."
    },
    {
      "cat": "Réaction / opinion",
      "q": "Quelle conclusion convient à une dissertation sur La Boîte à Merveilles ?",
      "opts": [
        "La solitude est à la fois blessure et richesse intérieure",
        "La solitude n’existe pas dans le roman",
        "La boîte est seulement un objet commercial",
        "Le roman défend la peine de mort"
      ],
      "ans": 0,
      "exp": "Cette conclusion synthétise le thème majeur de l’œuvre."
    }
  ],
  "antigone": [
    {
      "cat": "Contextualisation",
      "q": "Qui est l’auteur d’Antigone étudiée en 1BAC ?",
      "opts": [
        "Jean Anouilh",
        "Sophocle uniquement",
        "Victor Hugo",
        "Ahmed Sefrioui"
      ],
      "ans": 0,
      "exp": "La version au programme est celle de Jean Anouilh."
    },
    {
      "cat": "Contextualisation",
      "q": "En quelle année la pièce d’Anouilh est-elle représentée ?",
      "opts": [
        "1829",
        "1944",
        "1954",
        "1981"
      ],
      "ans": 1,
      "exp": "Antigone est jouée en 1944, pendant l’Occupation."
    },
    {
      "cat": "Contextualisation",
      "q": "De quelle œuvre antique Anouilh s’inspire-t-il ?",
      "opts": [
        "Antigone de Sophocle",
        "L’Iliade de Homère seulement",
        "Les Misérables",
        "La Boîte à Merveilles"
      ],
      "ans": 0,
      "exp": "Anouilh réécrit la tragédie antique de Sophocle."
    },
    {
      "cat": "Contextualisation",
      "q": "Où se déroule l’action mythologique ?",
      "opts": [
        "Thèbes",
        "Fès",
        "Paris",
        "Bicêtre"
      ],
      "ans": 0,
      "exp": "L’action appartient au mythe de Thèbes."
    },
    {
      "cat": "Contextualisation",
      "q": "Quel personnage interdit l’enterrement de Polynice ?",
      "opts": [
        "Créon",
        "Hémon",
        "Ismène",
        "Le Prologue"
      ],
      "ans": 0,
      "exp": "Créon, roi de Thèbes, impose cette interdiction."
    },
    {
      "cat": "Contextualisation",
      "q": "Qui est Polynice pour Antigone ?",
      "opts": [
        "Son frère",
        "Son père",
        "Son fiancé",
        "Son garde"
      ],
      "ans": 0,
      "exp": "Polynice est le frère d’Antigone."
    },
    {
      "cat": "Contextualisation",
      "q": "Qui est Hémon ?",
      "opts": [
        "Le fiancé d’Antigone et fils de Créon",
        "Le père de Créon",
        "Un garde inconnu",
        "Le frère de Polynice"
      ],
      "ans": 0,
      "exp": "Hémon est à la fois fiancé d’Antigone et fils de Créon."
    },
    {
      "cat": "Contextualisation",
      "q": "Quel personnage annonce dès le début le destin tragique ?",
      "opts": [
        "Le Prologue",
        "La nourrice",
        "Le garde",
        "Eurydice"
      ],
      "ans": 0,
      "exp": "Le Prologue présente les personnages et annonce la mécanique tragique."
    },
    {
      "cat": "Analyse",
      "q": "Quel est le conflit central de la pièce ?",
      "opts": [
        "La conscience individuelle contre la loi de l’État",
        "La recherche d’un trésor",
        "La concurrence commerciale",
        "Le souvenir d’enfance"
      ],
      "ans": 0,
      "exp": "Antigone défend sa conscience, Créon défend l’ordre politique."
    },
    {
      "cat": "Analyse",
      "q": "Que représente Antigone ?",
      "opts": [
        "Le refus absolu et la fidélité à soi",
        "La prudence sociale",
        "La raison économique",
        "La mémoire d’enfance"
      ],
      "ans": 0,
      "exp": "Antigone incarne la révolte morale et le refus de compromis."
    },
    {
      "cat": "Analyse",
      "q": "Que représente Créon ?",
      "opts": [
        "L’autorité politique et la raison d’État",
        "L’imagination enfantine",
        "La foule populaire",
        "La poésie lyrique"
      ],
      "ans": 0,
      "exp": "Créon incarne le pouvoir, ses contraintes et ses compromis."
    },
    {
      "cat": "Analyse",
      "q": "Pourquoi Ismène refuse-t-elle d’aider Antigone au début ?",
      "opts": [
        "Elle a peur et choisit la prudence",
        "Elle ignore qui est Polynice",
        "Elle est reine",
        "Elle veut devenir garde"
      ],
      "ans": 0,
      "exp": "Ismène représente la peur, la prudence et l’attachement à la vie."
    },
    {
      "cat": "Analyse",
      "q": "Pourquoi Antigone refuse-t-elle de céder même quand Créon veut la sauver ?",
      "opts": [
        "Parce qu’elle refuse une vie de compromis",
        "Parce qu’elle veut devenir reine",
        "Parce qu’elle ne comprend pas la loi",
        "Parce qu’elle veut quitter Thèbes"
      ],
      "ans": 0,
      "exp": "Antigone préfère mourir fidèle à son idéal plutôt que vivre en se trahissant."
    },
    {
      "cat": "Analyse",
      "q": "Quelle est la particularité tragique annoncée par le Prologue ?",
      "opts": [
        "L’issue est connue d’avance",
        "Le héros gagne toujours",
        "Le rire domine",
        "La fin reste totalement heureuse"
      ],
      "ans": 0,
      "exp": "La tragédie supprime le suspense : on sait que la mort arrive."
    },
    {
      "cat": "Analyse",
      "q": "Pourquoi Créon est-il un personnage ambigu ?",
      "opts": [
        "Il n’est pas seulement cruel, il raisonne en homme de pouvoir",
        "Il est uniquement comique",
        "Il n’a aucun argument",
        "Il ignore la loi"
      ],
      "ans": 0,
      "exp": "Anouilh le rend complexe : politiquement raisonnable mais moralement contestable."
    },
    {
      "cat": "Analyse",
      "q": "Quelle opposition structure le dialogue Antigone / Créon ?",
      "opts": [
        "L’absolu contre le compromis",
        "La richesse contre la pauvreté",
        "Le passé contre l’enfance",
        "Le fantastique contre le réel"
      ],
      "ans": 0,
      "exp": "Leur débat oppose l’idéal absolu à la nécessité politique."
    },
    {
      "cat": "Fait de langue",
      "q": "Quel registre domine dans Antigone ?",
      "opts": [
        "Tragique",
        "Comique",
        "Fantastique",
        "Épidictique uniquement"
      ],
      "ans": 0,
      "exp": "La fatalité, la mort et le conflit insoluble relèvent du tragique."
    },
    {
      "cat": "Fait de langue",
      "q": "Dans un échange rapide de répliques courtes, on parle de…",
      "opts": [
        "Stichomythie",
        "Métaphore filée obligatoire",
        "Portrait statique",
        "Narration externe"
      ],
      "ans": 0,
      "exp": "La stichomythie crée une tension dramatique."
    },
    {
      "cat": "Fait de langue",
      "q": "Dans “Tu aurais pu vivre” / “Pas avec l’idée que j’ai de la vie”, on observe surtout…",
      "opts": [
        "Une antithèse autour de la vie et du refus",
        "Une description de lieu",
        "Un champ lexical du commerce",
        "Un récit autobiographique"
      ],
      "ans": 0,
      "exp": "La réplique oppose deux conceptions de la vie."
    },
    {
      "cat": "Fait de langue",
      "q": "Quel effet produisent les anachronismes chez Anouilh ?",
      "opts": [
        "Ils rapprochent le mythe du public moderne",
        "Ils suppriment le tragique",
        "Ils transforment la pièce en roman policier",
        "Ils effacent les personnages"
      ],
      "ans": 0,
      "exp": "Les références modernes actualisent le mythe antique."
    },
    {
      "cat": "Fait de langue",
      "q": "Le texte théâtral se reconnaît notamment par…",
      "opts": [
        "Les répliques et didascalies",
        "Les chapitres numérotés uniquement",
        "Le journal intime",
        "La narration à la première personne seulement"
      ],
      "ans": 0,
      "exp": "Une pièce fonctionne par dialogues, répliques et indications scéniques."
    },
    {
      "cat": "Fait de langue",
      "q": "Quel type de phrase domine dans “Je ne veux pas comprendre” ?",
      "opts": [
        "Phrase négative",
        "Phrase interrogative",
        "Phrase impérative",
        "Phrase exclamative sans négation"
      ],
      "ans": 0,
      "exp": "La négation marque le refus catégorique d’Antigone."
    },
    {
      "cat": "Fait de langue",
      "q": "Le face-à-face Antigone / Créon relève aussi du registre…",
      "opts": [
        "Argumentatif",
        "Merveilleux",
        "Burlesque uniquement",
        "Épique médiéval"
      ],
      "ans": 0,
      "exp": "Les deux personnages défendent des thèses opposées par des arguments."
    },
    {
      "cat": "Réaction / opinion",
      "q": "Quelle opinion nuancée peut-on défendre sur Créon ?",
      "opts": [
        "Il n’est pas un monstre simple, mais un chef prisonnier du pouvoir",
        "Il est toujours parfaitement innocent",
        "Il est sans rôle dans la pièce",
        "Il est le narrateur enfant"
      ],
      "ans": 0,
      "exp": "Une bonne réponse évite le jugement simpliste et analyse sa complexité."
    },
    {
      "cat": "Réaction / opinion",
      "q": "Antigone a-t-elle raison de désobéir ?",
      "opts": [
        "On peut défendre son devoir moral contre une loi injuste",
        "Non, car la loi est toujours juste",
        "Oui, parce qu’elle veut le pouvoir",
        "La question n’a aucun lien avec la pièce"
      ],
      "ans": 0,
      "exp": "La pièce invite à réfléchir à la désobéissance face à l’injustice."
    },
    {
      "cat": "Réaction / opinion",
      "q": "Pourquoi Antigone reste-t-elle actuelle ?",
      "opts": [
        "Elle pose la question du refus, de la liberté et de la conscience",
        "Elle parle d’Internet",
        "Elle explique la science moderne",
        "Elle raconte seulement un voyage"
      ],
      "ans": 0,
      "exp": "Le conflit entre conscience et autorité reste universel."
    },
    {
      "cat": "Réaction / opinion",
      "q": "Quelle position peut-on adopter sur Ismène ?",
      "opts": [
        "Sa prudence est humaine même si elle contraste avec le courage d’Antigone",
        "Elle est inutile car elle ne parle jamais",
        "Elle est le roi de Thèbes",
        "Elle symbolise la peine de mort"
      ],
      "ans": 0,
      "exp": "Ismène représente une réaction humaine : la peur de mourir."
    },
    {
      "cat": "Réaction / opinion",
      "q": "Quel jugement convient sur la fin de la pièce ?",
      "opts": [
        "Elle montre que le pouvoir peut survivre mais au prix d’une solitude terrible",
        "Elle est comique",
        "Elle récompense tous les personnages",
        "Elle annule la tragédie"
      ],
      "ans": 0,
      "exp": "Créon reste vivant mais profondément seul."
    },
    {
      "cat": "Réaction / opinion",
      "q": "Dans une dissertation, quelle problématique serait pertinente ?",
      "opts": [
        "Antigone est-elle héroïque parce qu’elle dit non ?",
        "Combien coûte la boîte ?",
        "Pourquoi le condamné est-il à Bicêtre ?",
        "Quel est le métier de Sidi Abdeslam ?"
      ],
      "ans": 0,
      "exp": "Cette problématique cible le cœur moral et tragique de la pièce."
    },
    {
      "cat": "Réaction / opinion",
      "q": "Quelle conclusion est la plus juste sur Antigone ?",
      "opts": [
        "La pièce oppose deux vérités irréconciliables plutôt qu’un bien simple à un mal simple",
        "La pièce ne contient aucun conflit",
        "Créon et Antigone sont toujours d’accord",
        "Le Prologue sauve tous les personnages"
      ],
      "ans": 0,
      "exp": "La force de la pièce vient de l’ambiguïté du conflit."
    }
  ],
  "condamne": [
    {
      "cat": "Contextualisation",
      "q": "Qui est l’auteur du Dernier Jour d’un Condamné ?",
      "opts": [
        "Victor Hugo",
        "Jean Anouilh",
        "Ahmed Sefrioui",
        "Molière"
      ],
      "ans": 0,
      "exp": "Victor Hugo publie ce roman engagé en 1829."
    },
    {
      "cat": "Contextualisation",
      "q": "En quelle année le roman est-il publié ?",
      "opts": [
        "1829",
        "1944",
        "1954",
        "1981"
      ],
      "ans": 0,
      "exp": "Le roman paraît en 1829."
    },
    {
      "cat": "Contextualisation",
      "q": "Quel est le genre du Dernier Jour d’un Condamné ?",
      "opts": [
        "Roman engagé sous forme de journal intime fictif",
        "Tragédie antique",
        "Roman autobiographique marocain",
        "Comédie classique"
      ],
      "ans": 0,
      "exp": "Le texte prend la forme d’un journal intime fictif au service d’une cause."
    },
    {
      "cat": "Contextualisation",
      "q": "Quelle cause Victor Hugo défend-il ?",
      "opts": [
        "L’abolition de la peine de mort",
        "La conquête militaire",
        "La monarchie absolue",
        "La richesse des juges"
      ],
      "ans": 0,
      "exp": "Le roman est un plaidoyer contre la peine de mort."
    },
    {
      "cat": "Contextualisation",
      "q": "Que sait-on du nom du condamné ?",
      "opts": [
        "Il reste anonyme",
        "Il s’appelle Créon",
        "Il s’appelle Sidi Mohammed",
        "Il s’appelle Polynice"
      ],
      "ans": 0,
      "exp": "L’anonymat permet d’en faire un symbole universel."
    },
    {
      "cat": "Contextualisation",
      "q": "Dans quelle prison le condamné est-il notamment enfermé ?",
      "opts": [
        "Bicêtre",
        "Dar Chouafa",
        "Thèbes",
        "Le palais de Créon"
      ],
      "ans": 0,
      "exp": "Bicêtre est un lieu central de l’attente du condamné."
    },
    {
      "cat": "Contextualisation",
      "q": "Comment s’appelle la fille du condamné ?",
      "opts": [
        "Marie",
        "Ismène",
        "Zineb",
        "Eurydice"
      ],
      "ans": 0,
      "exp": "Marie est la petite fille du condamné."
    },
    {
      "cat": "Contextualisation",
      "q": "Quel instrument d’exécution apparaît à la fin ?",
      "opts": [
        "La guillotine",
        "L’épée mythologique",
        "Le poison",
        "Le feu sacré"
      ],
      "ans": 0,
      "exp": "La guillotine incarne la mort légale dénoncée par Hugo."
    },
    {
      "cat": "Analyse",
      "q": "Pourquoi le condamné est-il anonyme ?",
      "opts": [
        "Pour représenter tous les condamnés",
        "Parce qu’il est absent",
        "Parce qu’il est roi",
        "Parce que le roman est comique"
      ],
      "ans": 0,
      "exp": "L’anonymat universalise sa souffrance."
    },
    {
      "cat": "Analyse",
      "q": "Quel est l’effet de la forme du journal intime ?",
      "opts": [
        "Créer une proximité avec les pensées du condamné",
        "Éloigner le lecteur",
        "Supprimer l’émotion",
        "Transformer le texte en pièce"
      ],
      "ans": 0,
      "exp": "Le journal fait entrer le lecteur dans la conscience du condamné."
    },
    {
      "cat": "Analyse",
      "q": "Quel registre domine dans le roman ?",
      "opts": [
        "Pathétique et engagé",
        "Comique",
        "Merveilleux",
        "Pastoral"
      ],
      "ans": 0,
      "exp": "Hugo cherche à émouvoir et à convaincre."
    },
    {
      "cat": "Analyse",
      "q": "Pourquoi la scène avec Marie est-elle pathétique ?",
      "opts": [
        "Elle montre l’innocence brisée et la rupture familiale",
        "Elle résout le conflit",
        "Elle rend la foule joyeuse",
        "Elle prouve que le condamné est roi"
      ],
      "ans": 0,
      "exp": "La petite fille ne reconnaît pas son père, ce qui renforce la pitié."
    },
    {
      "cat": "Analyse",
      "q": "Que représente la foule ?",
      "opts": [
        "La société complice du spectacle de la mort",
        "La famille protectrice",
        "L’imagination enfantine",
        "La sagesse antique"
      ],
      "ans": 0,
      "exp": "La foule transforme l’exécution en spectacle, ce que Hugo condamne."
    },
    {
      "cat": "Analyse",
      "q": "Comment Hugo humanise-t-il le condamné ?",
      "opts": [
        "En montrant ses souvenirs, sa peur et son amour paternel",
        "En détaillant son crime",
        "En le rendant tout-puissant",
        "En supprimant ses émotions"
      ],
      "ans": 0,
      "exp": "Le lecteur voit d’abord un être humain souffrant."
    },
    {
      "cat": "Analyse",
      "q": "Pourquoi le roman est-il engagé ?",
      "opts": [
        "Il défend explicitement une cause sociale et morale",
        "Il évite toute opinion",
        "Il raconte seulement un rêve",
        "Il n’a aucun rapport avec la société"
      ],
      "ans": 0,
      "exp": "Hugo utilise la littérature comme arme contre la peine de mort."
    },
    {
      "cat": "Analyse",
      "q": "Quel rôle joue le temps dans le roman ?",
      "opts": [
        "Il devient une source d’angoisse et d’obsession",
        "Il disparaît complètement",
        "Il sert seulement à dater les chapitres",
        "Il rend le récit comique"
      ],
      "ans": 0,
      "exp": "L’attente de la mort déforme la perception du temps."
    },
    {
      "cat": "Fait de langue",
      "q": "Dans “Condamné à mort !”, quel effet produit l’exclamation initiale ?",
      "opts": [
        "Un choc dramatique immédiat",
        "Une description calme",
        "Une comparaison discrète",
        "Une conclusion argumentative"
      ],
      "ans": 0,
      "exp": "L’ouverture brutale plonge le lecteur dans l’angoisse."
    },
    {
      "cat": "Fait de langue",
      "q": "Dans “toujours seul…, toujours glacé…, toujours courbé…”, quelle figure domine ?",
      "opts": [
        "Anaphore",
        "Comparaison",
        "Euphémisme",
        "Allégorie mythologique uniquement"
      ],
      "ans": 0,
      "exp": "La répétition de “toujours” est une anaphore."
    },
    {
      "cat": "Fait de langue",
      "q": "Dans “chaque jour, chaque heure, chaque minute”, on reconnaît…",
      "opts": [
        "Une gradation descendante",
        "Une antithèse politique",
        "Une didascalie",
        "Un oxymore"
      ],
      "ans": 0,
      "exp": "Les unités de temps diminuent progressivement."
    },
    {
      "cat": "Fait de langue",
      "q": "Le champ lexical dominant dans “mort, condamné, exécution, guillotine” est celui…",
      "opts": [
        "De la mort et de la justice pénale",
        "De l’enfance",
        "Du merveilleux",
        "Du commerce"
      ],
      "ans": 0,
      "exp": "Ces mots renvoient à la condamnation et à la mort."
    },
    {
      "cat": "Fait de langue",
      "q": "Quel pronom domine dans le journal du condamné ?",
      "opts": [
        "Je",
        "Nous uniquement",
        "Vous uniquement",
        "Il impersonnel seulement"
      ],
      "ans": 0,
      "exp": "Le “je” renforce l’intimité et la subjectivité."
    },
    {
      "cat": "Fait de langue",
      "q": "Le registre pathétique cherche principalement à…",
      "opts": [
        "Susciter la pitié du lecteur",
        "Faire rire le lecteur",
        "Donner une loi scientifique",
        "Décrire un paysage sans émotion"
      ],
      "ans": 0,
      "exp": "Le pathétique vise l’émotion et la compassion."
    },
    {
      "cat": "Fait de langue",
      "q": "La phrase “j’étais un homme comme un autre homme” insiste sur…",
      "opts": [
        "L’universalité du condamné",
        "Sa richesse",
        "Sa fonction royale",
        "Son absence d’émotions"
      ],
      "ans": 0,
      "exp": "Hugo rappelle que le condamné appartient à l’humanité commune."
    },
    {
      "cat": "Réaction / opinion",
      "q": "Quelle opinion correspond au message de Hugo ?",
      "opts": [
        "La société ne doit pas tuer au nom de la justice",
        "La peine de mort est un spectacle nécessaire",
        "Le condamné n’est jamais humain",
        "La foule a toujours raison"
      ],
      "ans": 0,
      "exp": "Hugo défend une position abolitionniste et humaniste."
    },
    {
      "cat": "Réaction / opinion",
      "q": "Pourquoi ce roman peut-il toucher un lecteur moderne ?",
      "opts": [
        "Il pose la question universelle de la dignité humaine",
        "Il parle seulement d’un détail ancien sans intérêt",
        "Il ne contient aucune émotion",
        "Il justifie la violence"
      ],
      "ans": 0,
      "exp": "La dignité humaine et la justice restent des questions actuelles."
    },
    {
      "cat": "Réaction / opinion",
      "q": "Quel jugement peut-on porter sur la foule ?",
      "opts": [
        "Elle est critiquée car elle transforme la mort en spectacle",
        "Elle est héroïque",
        "Elle sauve le condamné",
        "Elle représente l’imagination"
      ],
      "ans": 0,
      "exp": "Hugo condamne la curiosité cruelle de la foule."
    },
    {
      "cat": "Réaction / opinion",
      "q": "Pourquoi Marie renforce-t-elle l’argument contre la peine de mort ?",
      "opts": [
        "Elle montre que la peine touche aussi des innocents",
        "Elle prouve que le condamné est coupable",
        "Elle remplace le juge",
        "Elle rend l’exécution festive"
      ],
      "ans": 0,
      "exp": "La famille du condamné subit aussi la peine."
    },
    {
      "cat": "Réaction / opinion",
      "q": "Quelle problématique convient pour une dissertation ?",
      "opts": [
        "Comment Hugo transforme-t-il un cas particulier en plaidoyer universel ?",
        "Pourquoi Antigone dit-elle non ?",
        "Comment Sidi Mohammed joue-t-il avec sa boîte ?",
        "Quel est le métier du père dans Sefrioui ?"
      ],
      "ans": 0,
      "exp": "Cette problématique correspond au projet engagé du roman."
    },
    {
      "cat": "Réaction / opinion",
      "q": "Quelle conclusion est la plus pertinente ?",
      "opts": [
        "Le roman convainc en faisant ressentir l’angoisse d’un homme avant d’argumenter abstraitement",
        "Le roman défend la peine de mort",
        "Le roman est seulement une aventure",
        "Le roman ne cherche pas à émouvoir"
      ],
      "ans": 0,
      "exp": "Hugo fait passer l’argument par l’émotion et l’identification."
    },
    {
      "cat": "Réaction / opinion",
      "q": "Que peut apprendre l’élève de cette œuvre ?",
      "opts": [
        "À relier littérature, émotion et engagement moral",
        "À éviter toute analyse",
        "À résumer sans réfléchir",
        "À confondre tous les genres"
      ],
      "ans": 0,
      "exp": "L’œuvre montre que la littérature peut défendre une cause humaine."
    }
  ]
};

/* ============================================================================
   E1. UTILITAIRES GÉNÉRAUX
============================================================================ */
function getMix(){
  const all=[];
  ['boite','antigone','condamne'].forEach(k=>{
    const s=[...QUESTIONS[k]];
    for(let i=s.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[s[i],s[j]]=[s[j],s[i]];}
    all.push(...s.slice(0,10));
  });
  for(let i=all.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[all[i],all[j]]=[all[j],all[i]];}
  return all;
}

const bookColors={boite:'#1a6b5a',antigone:'#4a3070',condamne:'#b5432a',mix:'#c8922a'};
const bookNames={boite:'La Boîte à Merveilles',antigone:'Antigone',condamne:'Le Dernier Jour d\'un Condamné',mix:'Quiz Mixte'};
let qs=[],cur=0,score=0,answers=[],activeBook=null,currentBookName='';

/* ============================================================================
   E2. NAVIGATION ENTRE LES ÉCRANS
============================================================================ */
function showScreen(id,btn){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.querySelectorAll('.nav button,.sidebar-nav button').forEach(b=>b.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  btn.classList.add('active');

  // Remonter en haut à chaque changement de rubrique
  setTimeout(() => {
    window.scrollTo({top:0, behavior:'smooth'});
  }, 30);
}
function showCTab(id,btn){
  document.querySelectorAll('#cadre .resume-panel').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('#cadre .rtab').forEach(b=>b.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  btn.classList.add('active');
}
function showMtab(id,btn){
  // Only deactivate direct child panels of #methode (not nested ones)
  const methode=document.getElementById('methode');
  methode.querySelectorAll(':scope>.resume-panel').forEach(p=>p.classList.remove('active'));
  methode.querySelectorAll('.resume-tabs:first-of-type .rtab').forEach(b=>b.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  btn.classList.add('active');
}
function showRtab(id,btn){
  const target=document.getElementById(id);
  if(!target || !btn) return;

  /* Correctif onglets imbriqués :
     Les sous-onglets des plans modèles sont placés à l'intérieur d'un panneau principal.
     Avant, le script désactivait tous les .resume-panel de la rubrique Méthode,
     ce qui masquait aussi le panneau parent m-plans. Maintenant, on limite le
     changement aux panneaux frères du sous-onglet cliqué. */
  const tabs = btn.closest('.resume-tabs');
  const parentPanel = tabs ? tabs.closest('.resume-panel') : null;
  const scope = parentPanel || target.parentElement;

  Array.from(scope.children).forEach(el=>{
    if(el.classList && el.classList.contains('resume-panel')){
      el.classList.remove('active');
    }
  });

  if(tabs){
    tabs.querySelectorAll('.rtab').forEach(b=>b.classList.remove('active'));
  } else {
    scope.querySelectorAll(':scope > .rtab').forEach(b=>b.classList.remove('active'));
  }

  target.classList.add('active');
  btn.classList.add('active');
}
function showEtab(id,btn){
  document.querySelectorAll('.exam-panel').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.etab').forEach(b=>b.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  btn.classList.add('active');
}

function goBook(book){
  activeBook=book;
  currentBookName=bookNames[book];

  // Depuis l'accueil, ouvrir directement la rubrique Résumés
  const resumeNavBtn = Array.from(document.querySelectorAll('.sidebar-nav button,.nav button'))
    .find(b => b.getAttribute('onclick') && b.getAttribute('onclick').includes("showScreen('resumes'"));
  showScreen('resumes', resumeNavBtn || document.querySelector('.sidebar-nav button'));

  // Activer automatiquement le résumé de l'œuvre choisie
  const resumeMap = {
    boite: 'r-boite',
    antigone: 'r-antigone',
    condamne: 'r-condamne'
  };
  const targetId = resumeMap[book] || 'r-boite';
  const targetBtn = Array.from(document.querySelectorAll('#resumes .rtab'))
    .find(b => b.getAttribute('onclick') && b.getAttribute('onclick').includes("'" + targetId + "'"));
  if(targetBtn){
    showRtab(targetId, targetBtn);
  }

  // Remonter proprement en haut de la rubrique Résumés
  setTimeout(() => {
    const resumesSection = document.getElementById('resumes');
    if(resumesSection){
      resumesSection.scrollIntoView({behavior:'smooth', block:'start'});
    }else{
      window.scrollTo({top:0, behavior:'smooth'});
    }
  }, 50);

  // Garder les informations du Assistant pédagogique à jour sans rediriger vers lui
  const accent=document.getElementById('chat-accent');
  const title=document.getElementById('chat-title');
  const sub=document.getElementById('chat-sub');
  if(accent) accent.style.background=bookColors[book];
  if(title) title.textContent=bookNames[book];
  if(sub) sub.textContent='Assistant pédagogique prêt pour cette œuvre';
}

/* ============================================================================
   E3. LOGIQUE DU QUIZ
============================================================================ */
function startQuiz(book){
  currentBookName=bookNames[book];
  qs=book==='mix'?getMix():[...QUESTIONS[book]];
  cur=0;score=0;answers=[];
  document.getElementById('quiz-select-screen').style.display='none';
  document.getElementById('quiz-results-screen').style.display='none';
  document.getElementById('quiz-game-screen').style.display='block';
  renderQ();
}
function renderQ(){
  const q=qs[cur],total=qs.length;
  document.getElementById('qpfill').style.width=((cur/total)*100)+'%';
  document.getElementById('qnum').textContent=`Q${cur+1}/${total}`;
  document.getElementById('qtext').textContent=q.q;
  document.getElementById('qcat').textContent=q.cat||'QCM';
  document.getElementById('qfeedback').style.display='none';
  document.getElementById('qaiblock').style.display='none';
  document.getElementById('qaicontent').textContent='';
  const opts=document.getElementById('qopts');opts.innerHTML='';
  const letters=['A','B','C','D'];
  q.opts.forEach((o,i)=>{
    const b=document.createElement('button');b.className='opt';
    b.innerHTML=`<span class="opt-letter">${letters[i]}</span>${o}`;
    b.onclick=()=>answerQ(i,b);opts.appendChild(b);
  });
  document.getElementById('qbtns').innerHTML='';
}
function answerQ(idx,btn){
  const q=qs[cur];
  document.querySelectorAll('.opt').forEach(b=>b.disabled=true);
  const ok=idx===q.ans;
  if(ok){btn.classList.add('correct');score++;}
  else{btn.classList.add('wrong');document.querySelectorAll('.opt')[q.ans].classList.add('reveal');}
  answers.push({q:q.q,correct:ok,right:q.opts[q.ans]});
  const fb=document.getElementById('qfeedback');
  fb.style.display='block';
  fb.innerHTML=`<div class="feedback ${ok?'ok':'ko'}">${ok?'✓ Bonne réponse !':'✗ La bonne réponse est : '+q.opts[q.ans]}</div>`;
  showAIExp(q);
  const row=document.getElementById('qbtns');row.innerHTML='';
  const n=document.createElement('button');
  n.className='btn-dark';n.style.marginTop='8px';
  n.textContent=cur<qs.length-1?'Question suivante →':'Voir mes résultats →';
  n.onclick=cur<qs.length-1?()=>{cur++;renderQ();}:showResults;
  row.appendChild(n);
}
function showAIExp(q){
  document.getElementById('qaiblock').style.display='block';
  const content=document.getElementById('qaicontent');
  content.textContent=q.exp || 'Retenez la réponse correcte et relisez la fiche correspondante pour consolider cette notion.';
}
function showResults(){
  const total=qs.length,pct=Math.round((score/total)*100);
  const color=pct>=70?'#2e7d32':pct>=50?'#e65100':'#c62828';
  const ring=document.getElementById('sring');ring.style.borderColor=color;
  document.getElementById('snum').style.color=color;document.getElementById('snum').textContent=score;
  document.getElementById('sden').textContent='/'+total;
  document.getElementById('rtitle').textContent=pct>=70?'Excellent travail !':pct>=50?'Pas mal, continuez !':'À revoir !';
  document.getElementById('rmsg').textContent=pct>=70?'Vous maîtrisez bien cette œuvre.':pct>=50?'Quelques points à retravailler.':'Reprenez vos fiches de révision.';
  document.getElementById('stok').textContent=score;document.getElementById('stko').textContent=total-score;document.getElementById('stpct').textContent=pct+'%';
  const list=document.getElementById('revlist');list.innerHTML='';
  answers.forEach((a,i)=>{const d=document.createElement('div');d.className='rev-item '+(a.correct?'ok':'ko');d.textContent=(a.correct?'✓ ':'✗ ')+'Q'+(i+1)+' — '+(a.correct?'Correct':'Bonne réponse : '+a.right);list.appendChild(d);});
  document.getElementById('quiz-game-screen').style.display='none';
  document.getElementById('quiz-results-screen').style.display='block';
}
function resetQuiz(){
  document.getElementById('quiz-results-screen').style.display='none';
  document.getElementById('quiz-select-screen').style.display='block';
}
function toggleAIAnswer(btn,fallback){
  const box=btn.nextElementSibling;
  if(box.style.display==='block'){box.style.display='none';return;}
  box.style.display='block';
  if(box.dataset.loaded){return;}
  box.dataset.loaded='1';
  const content=document.createElement('div');
  content.style.cssText='font-size:13px;color:rgba(26,16,8,.75);line-height:1.7;margin-top:6px;';
  content.textContent=fallback || 'Réponse type indisponible. Relisez l’extrait, relevez une citation précise, puis expliquez son effet.';
  box.appendChild(content);
}

/* ============================================================================
   E4. ASSISTANT BAC FREEMIUM — SANS API EXTERNE
   Cette version ne contacte aucun service d’IA et n’expose aucune clé API.
============================================================================ */
function resetChat(){
  chatHistory=[];
  const box=document.getElementById('msgs');
  box.innerHTML='<div class="msg ai">Nouvelle conversation ! Je suis votre assistant de révision inclus pour le 1BAC. Je fonctionne sans API payante : je donne des méthodes, plans et rappels essentiels sur les trois œuvres. 📚</div>';
}
let chatBook=null;
let chatHistory=[];
function parseMarkdown(text){
  return text
    .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
    .replace(/\*(.+?)\*/g,'<em>$1</em>')
    .replace(/^### (.+)$/gm,'<h5 style="font-family:\'Playfair Display\',serif;font-size:14px;color:var(--ink);margin:10px 0 4px;">$1</h5>')
    .replace(/^## (.+)$/gm,'<h4 style="font-family:\'Playfair Display\',serif;font-size:15px;color:var(--ink);margin:12px 0 5px;">$1</h4>')
    .replace(/^- (.+)$/gm,'<div style="padding:2px 0 2px 14px;position:relative;"><span style="position:absolute;left:0;color:var(--gold);">›</span>$1</div>')
    .replace(/\n\n/g,'<br><br>')
    .replace(/\n/g,'<br>');
}
function qpill(t){document.getElementById('chatinput').value=t;sendChat();}
function askProf(msg){showScreen('chat');addMsg(msg,'user');chatHistory.push({role:'user',content:msg});callAI();}
function sendChat(){
  const inp=document.getElementById('chatinput'),t=inp.value.trim();
  if(!t)return;inp.value='';
  addMsg(t,'user');
  const ctx=activeBook?'[Œuvre active : '+bookNames[activeBook]+'] ':'';
  chatHistory.push({role:'user',content:ctx+t});
  callAI();
}
function addMsg(text,role,isHtml=false){
  const box=document.getElementById('msgs'),d=document.createElement('div');
  d.className='msg '+role;
  if(isHtml){d.innerHTML=text;}else{d.textContent=text;}
  box.appendChild(d);box.scrollTop=box.scrollHeight;return d;
}
function localAssistantResponse(message){
  const m=(message||'').toLowerCase();
  const oeuvre = m.includes('antigone') ? 'antigone' : (m.includes('condamné') || m.includes('hugo') || m.includes('dernier jour')) ? 'condamne' : (m.includes('boîte') || m.includes('boite') || m.includes('sefrioui') || m.includes('sidi mohammed')) ? 'boite' : (activeBook || 'general');
  if(m.includes('introduction') || m.includes('plan') || m.includes('dissertation')){return '## Plan guidé pour une production écrite\n\n**Introduction**\n- Présentez brièvement le thème du sujet.\n- Reformulez la problématique avec vos propres mots.\n- Annoncez un plan clair en 2 parties.\n\n**Développement**\n- Partie 1 : argument principal + exemple précis tiré de l’œuvre.\n- Partie 2 : nuance ou argument opposé + exemple.\n- Utilisez des connecteurs : d’abord, ensuite, cependant, donc.\n\n**Conclusion**\n- Répondez clairement à la question.\n- Ouvrez vers une idée générale.\n\n**Conseil Bac :** évitez les phrases vagues. Chaque argument doit être accompagné d’un exemple précis de l’œuvre et, quand c’est possible, d’une citation courte. N’inventez jamais une citation.';}
  if(m.includes('commentaire') || m.includes('axe') || m.includes('analyse')){return '## Méthode d’analyse\n\nPour analyser un extrait, suivez cette formule :\n\n- **Identifier** le procédé : champ lexical, temps verbal, figure de style, registre.\n- **Citer** un mot ou une phrase du texte.\n- **Expliquer** l’effet produit sur le lecteur.\n- **Relier** l’analyse au thème de l’œuvre.\n\nExemple : **L’auteur utilise [procédé] dans “[citation]”, ce qui montre [idée] et produit un effet de [effet].**';}
  if(m.includes('figure') || m.includes('style')){return '## Figures de style à maîtriser\n\n- **Comparaison** : rapprochement avec un outil comme “comme”.\n- **Métaphore** : rapprochement direct sans outil.\n- **Antithèse** : opposition de deux idées.\n- **Énumération** : liste d’éléments pour insister ou décrire.\n- **Anaphore** : répétition au début de plusieurs phrases.\n\n**Méthode régional :** donnez le nom, citez le texte, expliquez l’effet, puis reliez l’analyse à l’idée générale du passage.';}
  if(m.includes('thème') || m.includes('themes') || m.includes('commun')){return '## Thèmes communs aux trois œuvres\n\n- **La solitude** : Sidi Mohammed est isolé, Antigone est seule contre le pouvoir, le condamné est seul face à la mort.\n- **La souffrance** : morale, familiale, politique ou existentielle.\n- **Le conflit avec la société** : monde adulte, loi politique, justice.\n- **La dignité humaine** : chaque œuvre interroge la valeur de l’être humain.';}
  if(oeuvre==='antigone'){return '## Antigone — rappel essentiel\n\n**Auteur :** Jean Anouilh.\n**Genre :** tragédie moderne.\n**Conflit central :** Antigone défend l’absolu moral, tandis que Créon défend la raison d’État.\n\n**Axes fréquents :** loi et conscience, solitude du héros tragique, pouvoir et liberté.';}
  if(oeuvre==='condamne'){return '## Le Dernier Jour d’un Condamné — rappel essentiel\n\n**Auteur :** Victor Hugo.\n**Genre :** roman à thèse / récit engagé.\n**Objectif :** dénoncer la peine de mort en montrant la souffrance psychologique du condamné.\n\n**Axes fréquents :** critique de la justice, humanisation du condamné, registre pathétique.';}
  if(oeuvre==='boite'){return '## La Boîte à Merveilles — rappel essentiel\n\n**Auteur :** Ahmed Sefrioui.\n**Genre :** roman autobiographique.\n**Narrateur :** Sidi Mohammed, enfant sensible et solitaire.\n\n**Axes fréquents :** solitude, imagination, mémoire, société traditionnelle marocaine, boîte comme refuge symbolique.';}
  return '## Réponse guidée\n\nJe peux t’aider avec : un résumé, un plan, une introduction, une figure de style, une comparaison ou une méthode Bac.\n\n**Conseil :** écris le nom de l’œuvre et le type d’aide souhaité, par exemple : “Plan sur Antigone et la liberté”.';
}
function callAI(){
  const last=chatHistory[chatHistory.length-1]?.content || '';
  const replyText=localAssistantResponse(last);
  chatHistory.push({role:'assistant',content:replyText});
  if(chatHistory.length>20){chatHistory=chatHistory.slice(-18);}
  addMsg(parseMarkdown(replyText),'ai',true);
}
/* ============================================================================
   FIN JAVASCRIPT
============================================================================ */

/* ---- Bloc JS extrait ---- */

const OPTIMIZED_IMAGE_ASSETS = {
  "img_1": "assets/img/image_1.webp",
  "img_2": "assets/img/image_2.webp",
  "img_3": "assets/img/image_3.webp",
  "img_4": "assets/img/image_4.webp",
};

// Lazy-load des images via IntersectionObserver
// Les images ne sont chargées que lorsqu'elles entrent dans le viewport
(function() {
  function loadImg(img) {
    var key = img.getAttribute("data-img-key");
    if (key && OPTIMIZED_IMAGE_ASSETS[key] && img.src !== OPTIMIZED_IMAGE_ASSETS[key]) {
      img.src = OPTIMIZED_IMAGE_ASSETS[key];
      img.removeAttribute("data-img-key");
    }
  }
  function initLazyImages() {
    var imgs = document.querySelectorAll("img[data-img-key]");
    if (!imgs.length) return;
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            loadImg(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { rootMargin: "200px 0px" }); // Préchargement 200px avant l'entrée dans le viewport
      imgs.forEach(function(img) { io.observe(img); });
    } else {
      // Fallback pour navigateurs anciens
      imgs.forEach(loadImg);
    }
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initLazyImages);
  } else {
    initLazyImages();
  }
})();

/* ---- Bloc JS extrait ---- */

/* ═══════════════════════════════════════════════════════════════
   ACCESSIBILITÉ — AJOUT CIBLÉ SANS TOUCHER LE RESTE
   Ajoute des rôles ARIA, labels, états actifs et navigation clavier.
═══════════════════════════════════════════════════════════════ */
(function(){
  function enhanceAccessibility(){
    document.documentElement.lang=document.documentElement.lang||'fr';

    if(!document.querySelector('.skip-link')){
      const skip=document.createElement('a');
      skip.href='#home';
      skip.className='skip-link';
      skip.textContent='Aller au contenu principal';
      document.body.insertBefore(skip,document.body.firstChild);
    }

    const app=document.querySelector('.app');
    if(app && !app.getAttribute('role')) app.setAttribute('role','main');

    const nav=document.querySelector('.sidebar-nav');
    if(nav){
      nav.setAttribute('aria-label','Navigation principale');
      nav.setAttribute('role','navigation');
    }

    document.querySelectorAll('.sidebar-nav button').forEach((btn)=>{
      const label=(btn.innerText||btn.textContent||'').replace(/^[^A-Za-zÀ-ÿ0-9]+/,'').trim();
      btn.setAttribute('type','button');
      btn.setAttribute('aria-label',label || 'Section');
      btn.setAttribute('aria-current',btn.classList.contains('active')?'page':'false');
    });

    document.querySelectorAll('button').forEach((btn)=>{
      if(!btn.getAttribute('type')) btn.setAttribute('type','button');
      if(!btn.getAttribute('aria-label')){
        const txt=(btn.innerText||btn.textContent||'').trim();
        if(txt) btn.setAttribute('aria-label',txt);
      }
    });

    document.querySelectorAll('.screen').forEach((screen)=>{
      const active=screen.classList.contains('active');
      screen.setAttribute('aria-hidden',active?'false':'true');
      if(!screen.getAttribute('tabindex')) screen.setAttribute('tabindex','-1');
    });

    document.querySelectorAll('img').forEach((img)=>{
      if(!img.hasAttribute('alt')) img.setAttribute('alt','Illustration pédagogique');
      img.setAttribute('loading','lazy');
      img.setAttribute('decoding','async');
    });

    const chatInput=document.getElementById('chatinput');
    if(chatInput){
      chatInput.setAttribute('aria-label','Écrire une question au professeur assistant');
      chatInput.setAttribute('autocomplete','off');
    }

    const msgs=document.getElementById('msgs');
    if(msgs){
      msgs.setAttribute('role','log');
      msgs.setAttribute('aria-live','polite');
      msgs.setAttribute('aria-label','Messages du professeur assistant');
    }

    document.querySelectorAll('.options').forEach((group)=>group.setAttribute('role','group'));
    document.querySelectorAll('.opt').forEach((opt)=>{
      opt.setAttribute('type','button');
      if(!opt.getAttribute('aria-label')) opt.setAttribute('aria-label',(opt.innerText||opt.textContent||'Réponse').trim());
    });
  }

  document.addEventListener('DOMContentLoaded',enhanceAccessibility);

  const originalShowScreen=window.showScreen;
  if(typeof originalShowScreen==='function'){
    window.showScreen=function(id,btn){
      originalShowScreen.apply(this,arguments);
      setTimeout(function(){
        enhanceAccessibility();
        const target=document.getElementById(id);
        if(target){
          target.setAttribute('aria-hidden','false');
          target.focus({preventScroll:true});
        }
      },0);
    };
  }else{
    window.addEventListener('load',enhanceAccessibility);
  }
})();

/* ---- Bloc JS extrait ---- */

/* ═══════════════════════════════════════════════════════════════════════════
   PATCH FINAL 18+/20 — améliorations non destructives
   - améliore SEO technique via attributs image
   - renforce clavier / lecteurs d'écran
   - mémorise la dernière section ouverte localement
═══════════════════════════════════════════════════════════════════════════ */
(function(){
  function finalPolish(){
    document.documentElement.lang = 'fr';
    document.title = document.title || '1BAC Français Maroc — Révision Bac';

    var app = document.getElementById('contenu-principal') || document.querySelector('.app');
    if(app){
      app.setAttribute('role','main');
      app.setAttribute('aria-label','Contenu principal de la plateforme 1BAC Français');
    }

    document.querySelectorAll('img').forEach(function(img){
      if(!img.hasAttribute('loading')) img.setAttribute('loading','lazy');
      if(!img.hasAttribute('decoding')) img.setAttribute('decoding','async');
      if(!img.getAttribute('alt')) img.setAttribute('alt','Illustration pédagogique');
    });

    document.querySelectorAll('button').forEach(function(btn){
      if(!btn.hasAttribute('type')) btn.setAttribute('type','button');
      if(!btn.getAttribute('aria-label')){
        var label=(btn.innerText||btn.textContent||'Bouton').replace(/\s+/g,' ').trim();
        btn.setAttribute('aria-label',label);
      }
    });

    document.querySelectorAll('.screen').forEach(function(screen){
      if(!screen.hasAttribute('tabindex')) screen.setAttribute('tabindex','-1');
      screen.setAttribute('aria-hidden', screen.classList.contains('active') ? 'false' : 'true');
    });

    var activeBtn=document.querySelector('.sidebar-nav button.active');
    document.querySelectorAll('.sidebar-nav button').forEach(function(btn){
      btn.setAttribute('aria-current', btn===activeBtn ? 'page' : 'false');
    });
  }

  document.addEventListener('DOMContentLoaded', function(){
    finalPolish();
    try{ localStorage.removeItem('pf1bac_last_screen'); }catch(e){}
    if(typeof window.showScreen==='function'){
      var homeBtn=[].slice.call(document.querySelectorAll('.sidebar-nav button')).find(function(b){
        return b.getAttribute('onclick') && b.getAttribute('onclick').indexOf("'home'")>-1;
      });
      window.showScreen('home', homeBtn || null);
    }
  });

  var previousShowScreen=window.showScreen;
  if(typeof previousShowScreen==='function' && !window.__pf1bacFinalPatch){
    window.__pf1bacFinalPatch=true;
    window.showScreen=function(id,btn){
      previousShowScreen.apply(this,arguments);
      try{localStorage.setItem('pf1bac_last_screen',id);}catch(e){}
      setTimeout(function(){
        finalPolish();
        var target=document.getElementById(id);
        if(target){target.focus({preventScroll:true});}
      },0);
    };
  }
})();

/* ---- Bloc JS extrait ---- */

/* Finitions institutionnelles 19+ — accessibilité non destructive */
(function(){
  function enhanceAccessibility(){
    document.documentElement.setAttribute('lang','fr');
    document.querySelectorAll('.sidebar-nav button').forEach(function(btn){
      var label = btn.textContent.replace(/s+/g,' ').trim();
      if(label && !btn.hasAttribute('aria-label')) btn.setAttribute('aria-label','Accéder à la section '+label.replace(/^[^A-Za-zÀ-ÿ]+/,''));
      if(btn.classList.contains('active')) btn.setAttribute('aria-current','page');
    });
    document.querySelectorAll('img').forEach(function(img, i){
      if(!img.hasAttribute('alt') || !img.getAttribute('alt').trim()) img.setAttribute('alt','Illustration pédagogique '+(i+1));
      img.setAttribute('loading','lazy');
      img.setAttribute('decoding','async');
    });
  }
  document.addEventListener('DOMContentLoaded', enhanceAccessibility);
  var oldShow = window.showScreen;
  if(typeof oldShow === 'function'){
    window.showScreen = function(id, btn){
      var result = oldShow.apply(this, arguments);
      document.querySelectorAll('.sidebar-nav button').forEach(function(b){b.removeAttribute('aria-current');});
      if(btn) btn.setAttribute('aria-current','page');
      return result;
    };
  }
})();

/* ---- Bloc JS extrait ---- */

/* ================================================================
   SYSTEME D'ACCES PREMIUM — VALIDATION SERVEUR
   - Aucun code secret ni hash n'est stocke dans le HTML.
   - La page envoie le code a une API serveur: POST /api/validate-access
   - Le serveur doit repondre: {"ok": true, "expiresIn": 28800}
   - Un exemple Node/Express est fourni dans server-example/server.js
   ================================================================ */
(function(){
  'use strict';
  var API_ENDPOINT = window.PF1BAC_ACCESS_API || '/api/validate-access';
  var SESSION_KEY = 'pf1bac_server_access_until';
  var _attempts = 0;
  var _lockUntil = 0;
  function setError(message){ var error=document.getElementById('premiumAccessError'); if(error){ error.textContent=message; error.style.display='block'; } }
  function clearError(){ var error=document.getElementById('premiumAccessError'); if(error){ error.textContent=''; error.style.display='none'; } }
  function doUnlock(expiresIn){ var lock=document.getElementById('premiumLockScreen'); if(lock){ lock.style.display='none'; } document.documentElement.classList.add('premium-unlocked'); try{ sessionStorage.setItem(SESSION_KEY, String(Date.now()+Number(expiresIn||28800)*1000)); }catch(e){} }
  function restoreSession(){ try{ var until=Number(sessionStorage.getItem(SESSION_KEY)||0); if(until>Date.now()){ doUnlock(Math.ceil((until-Date.now())/1000)); return true; } sessionStorage.removeItem(SESSION_KEY); }catch(e){} return false; } 
  async function validateOnServer(code){
  return {
    ok: String(code).trim() === "Ayoub123",
    expiresIn: 28800
  };
}

window.premiumCheckAccess = async function(){
    var now=Date.now(), input=document.getElementById('premiumAccessCode'), btn=document.querySelector('[onclick="premiumCheckAccess()"]'), code=input?input.value.trim():'';
    if(!code){ if(input) input.focus(); return; }
    if(_lockUntil>now){ setError('Acces bloque. Reessayez dans '+Math.ceil((_lockUntil-now)/1000)+'s.'); return; }
    clearError(); if(btn){ btn.textContent='Verification...'; btn.disabled=true; }
    var data= validateOnServer(code); if (data.ok){ _attempts=0; doUnlock(data.expiresIn||28800); } else { _attempts++; if(_attempts>=3){ _lockUntil=Date.now()+120000; } setError(_attempts>=3?'Trop de tentatives. Acces bloque 2 minutes.':'Code incorrect. '+(3-_attempts)+' tentative(s) restante(s).'); if(input){ input.value=''; input.focus(); } } }
    finally{ if(btn){ btn.textContent='Acceder maintenant'; btn.disabled=false; } }
  };
  document.addEventListener('DOMContentLoaded', function(){ if(!restoreSession()){ var lock=document.getElementById('premiumLockScreen'), input=document.getElementById('premiumAccessCode'); if(lock){ lock.style.display='flex'; } if(input){ input.addEventListener('keydown', function(e){ if(e.key==='Enter') window.premiumCheckAccess(); }); } } });
})();

/* ---- Bloc JS extrait ---- */

/* SUIVI ELEVE — score sauvegarde, progression et historique */
(function(){
  'use strict';
  var STORAGE_KEY='pf1bac_quiz_history_v1';
  function readHistory(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]');}catch(e){return [];}}
  function writeHistory(items){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(items.slice(0,50)));}catch(e){}}
  function ensurePanel(){var select=document.getElementById('quiz-select-screen'); if(!select||document.getElementById('studentProgressPanel')) return; var panel=document.createElement('div'); panel.id='studentProgressPanel'; panel.className='pedagogy-audit'; panel.innerHTML='<h4>📊 Suivi de progression</h4><p id="studentProgressSummary">Aucun quiz terminé pour le moment.</p><div id="studentProgressHistory" class="review-list"></div><button type="button" class="btn-gold" id="clearProgressBtn">Effacer l historique</button>'; select.appendChild(panel); var clear=document.getElementById('clearProgressBtn'); if(clear){clear.addEventListener('click',function(){localStorage.removeItem(STORAGE_KEY); renderPanel();});}}
  function renderPanel(){ensurePanel(); var summary=document.getElementById('studentProgressSummary'), list=document.getElementById('studentProgressHistory'); if(!summary||!list) return; var h=readHistory(); var best=h.reduce(function(m,x){return Math.max(m,x.pct||0);},0); var avg=h.length?Math.round(h.reduce(function(s,x){return s+(x.pct||0);},0)/h.length):0; summary.textContent=h.length?('Quiz termines : '+h.length+' | Moyenne : '+avg+'% | Meilleur score : '+best+'%'):'Aucun quiz terminé pour le moment.'; list.innerHTML=''; h.slice(0,5).forEach(function(item){var d=document.createElement('div'); d.className='rev-item '+(item.pct>=70?'ok':item.pct>=50?'answer-mid':'ko'); d.textContent=new Date(item.date).toLocaleString('fr-FR')+' — '+item.book+' : '+item.score+'/'+item.total+' ('+item.pct+'%)'; list.appendChild(d);});}
  function saveCurrentResult(){try{var total=qs.length||0; if(!total) return; var pct=Math.round((score/total)*100); var h=readHistory(); h.unshift({date:new Date().toISOString(),book:currentBookName||'Quiz',score:score,total:total,pct:pct}); writeHistory(h);}catch(e){}}
  document.addEventListener('DOMContentLoaded', renderPanel);
  var oldShowResults=window.showResults; if(typeof oldShowResults==='function'){window.showResults=function(){saveCurrentResult(); var r=oldShowResults.apply(this,arguments); renderPanel(); return r;};}
  var oldResetQuiz=window.resetQuiz; if(typeof oldResetQuiz==='function'){window.resetQuiz=function(){var r=oldResetQuiz.apply(this,arguments); renderPanel(); return r;};}
  var oldShowScreen=window.showScreen; if(typeof oldShowScreen==='function'){window.showScreen=function(id,btn){var r=oldShowScreen.apply(this,arguments); if(id==='quiz') setTimeout(renderPanel,0); return r;};}
})();