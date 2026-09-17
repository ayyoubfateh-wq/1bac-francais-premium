/* ============================================================================
   ANNALES CORRIGÉES — moteur d'affichage
   Lit window.PF_DATA.annales (injecté avec le contenu membre) et rend la
   section dans #gAnnales (écran Sujets régionaux) : filtres par œuvre,
   liste des sujets, vue détaillée avec correction dépliable par question.
   Étiquetage honnête : « Sujet d'entraînement — format officiel » vs
   « Examen réel » (réservé aux sujets certifiés).
============================================================================ */
(function () {
  'use strict';

  var LIVRES = {
    boite: { nom: 'La Boîte à Merveilles', icone: '📦', couleur: '#1a6b5a' },
    antigone: { nom: 'Antigone', icone: '🏛️', couleur: '#4a3070' },
    condamne: { nom: 'Le Dernier Jour d’un Condamné', icone: '⛓️', couleur: '#b5432a' }
  };

  var filtreLivre = 'tous';
  var ouvertId = null;

  function annales() {
    return (window.PF_DATA && window.PF_DATA.annales) || [];
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/</g, '&lt;');
  }
  function nl2p(s) {
    return esc(s).split('\n').map(function (l) { return '<p>' + l + '</p>'; }).join('');
  }
  function badgeType(a) {
    return a.type === 'reel'
      ? '<span class="an-badge an-reel">Examen réel · ' + esc(a.academieStyle) + ' ' + esc(a.annee) + '</span>'
      : '<span class="an-badge an-ent">Entraînement · format officiel · niveau ' + esc(a.academieStyle) + '</span>';
  }

  function rendreListe(wrap) {
    var liste = annales().filter(function (a) { return filtreLivre === 'tous' || a.book === filtreLivre; });
    var chips = '<div class="an-filtres">' +
      ['tous', 'boite', 'antigone', 'condamne'].map(function (k) {
        var lbl = k === 'tous' ? 'Toutes les œuvres' : LIVRES[k].icone + ' ' + LIVRES[k].nom;
        return '<button class="an-chip' + (filtreLivre === k ? ' actif' : '') + '" onclick="gAnnalesFiltre(\'' + k + '\')">' + lbl + '</button>';
      }).join('') + '</div>';

    var cartes = liste.map(function (a) {
      var L = LIVRES[a.book];
      return '<button class="an-carte" style="--an-c:' + L.couleur + ';" onclick="gAnnalesOuvre(\'' + a.id + '\')">' +
        badgeType(a) +
        '<b>' + L.icone + ' ' + esc(a.titre) + '</b>' +
        '<span class="an-oeuvre">' + esc(a.oeuvre) + '</span>' +
        '<span class="an-meta">⏱ ' + esc(a.duree) + ' · Étude de texte /10 + Production /10 · ' + a.etude.length + ' questions corrigées</span>' +
        '<span class="an-cta">OUVRIR LE SUJET →</span>' +
        '</button>';
    }).join('');

    wrap.innerHTML =
      '<div class="eyebrow" style="margin-top:.5rem;">Annales corrigées — la correction détaillée de chaque question</div>' +
      '<div class="heading" style="font-size:22px;">📚 Sujets complets corrigés</div>' +
      '<div class="citation-box"><p><strong>Chaque question porte sa correction de correcteur</strong> : méthode, réponse attendue, citation utile et piège à éviter. Travaille le sujet SANS regarder, puis compare — c’est l’entraînement le plus proche du jour J.</p><cite>— Format officiel : Étude de texte (10 pts) · Production écrite (10 pts)</cite></div>' +
      chips +
      '<div class="an-grille">' + (cartes || '<p class="an-vide">Aucun sujet pour ce filtre.</p>') + '</div>';
  }

  function rendreSujet(wrap, a) {
    var L = LIVRES[a.book];
    /* Les trois capacités du cadre officiel sont annoncées dans le sujet :
       l'élève doit reconnaître la structure de l'épreuve, pas seulement
       enchaîner dix questions. C'est ce découpage 2/6/2 que le correcteur
       applique, et savoir où l'on se trouve change la façon de répondre. */
    var CAPACITES = {
      contextualiser: { nom: 'Contextualiser', pts: 2, aide: 'Situer le texte : œuvre, auteur, genre, place du passage. Deux minutes, deux points.' },
      analyser: { nom: 'Analyser', pts: 6, aide: 'Le plus gros bloc : relever, nommer, expliquer l’effet. C’est ici que tout se joue.' },
      reagir: { nom: 'Réagir', pts: 2, aide: 'Donner un avis et le justifier, en deux ou trois lignes. Une opinion seule ne vaut rien.' },
    };
    var capaciteCourante = null;
    var questions = a.etude.map(function (q, i) {
      var entete = '';
      if (q.capacite && q.capacite !== capaciteCourante && CAPACITES[q.capacite]) {
        capaciteCourante = q.capacite;
        var c = CAPACITES[q.capacite];
        entete = '<div class="an-capacite">' +
          '<b>' + c.nom + '</b><span class="an-capacite-pts">' + c.pts + ' points</span>' +
          '<small>' + c.aide + '</small>' +
        '</div>';
      }
      return entete + '<div class="an-q">' +
        '<div class="an-q-tete"><span class="an-q-num">Question ' + (i + 1) + '</span><span class="an-q-pts">' + q.pts + ' pt' + (q.pts > 1 ? 's' : '') + '</span></div>' +
        '<p class="an-q-enonce">' + esc(q.q) + '</p>' +
        '<button class="an-volet" onclick="gAnnalesVolet(this)">✦ Voir la correction détaillée</button>' +
        '<div class="an-correction" style="display:none;">' + nl2p(q.correction) + '</div>' +
        '</div>';
    }).join('');

    wrap.innerHTML =
      '<button class="an-retour" onclick="gAnnalesOuvre(null)">← Tous les sujets</button>' +
      '<div class="an-sujet-tete" style="--an-c:' + L.couleur + ';">' +
        badgeType(a) +
        '<h3>' + L.icone + ' ' + esc(a.titre) + '</h3>' +
        '<p>' + esc(a.oeuvre) + ' · ⏱ ' + esc(a.duree) + ' · /20</p>' +
      '</div>' +
      '<div class="an-support">' +
        '<div class="an-support-titre">📜 Support</div>' +
        '<p class="an-ref">' + esc(a.extraitRef) + '</p>' +
        '<p>' + esc(a.situation) + '</p>' +
        (a.citation ? '<blockquote class="an-citation">' + esc(a.citation) + '</blockquote>' : '') +
      '</div>' +
      '<div class="an-section">I. ÉTUDE DE TEXTE — (10 points)</div>' +
      questions +
      '<div class="an-section">II. PRODUCTION ÉCRITE — (10 points)</div>' +
      '<div class="an-q">' +
        '<p class="an-q-enonce">' + esc(a.production.sujet) + '</p>' +
        '<button class="an-volet" onclick="gAnnalesVolet(this)">✦ Voir le corrigé détaillé (plan + conseils du correcteur)</button>' +
        '<div class="an-correction" style="display:none;">' + nl2p(a.production.correction) + '</div>' +
      '</div>' +
      (a.conseils ? '<div class="an-conseils">💡 <strong>Conseil de préparation :</strong> ' + esc(a.conseils) + '</div>' : '');
  }

  function rendre() {
    var wrap = document.getElementById('gAnnales');
    if (!wrap) return;
    var liste = annales();
    if (!liste.length) {
      wrap.innerHTML =
        '<div class="eyebrow" style="margin-top:.5rem;">Annales corrigées</div>' +
        '<div class="heading" style="font-size:22px;">📚 Sujets complets corrigés</div>' +
        '<p class="an-vide">Les sujets d’examen corrigés question par question se chargent avec ton accès membre.</p>';
      return;
    }
    var courant = ouvertId ? liste.find(function (a) { return a.id === ouvertId; }) : null;
    if (courant) rendreSujet(wrap, courant);
    else rendreListe(wrap);
  }

  /* ---- API globale ---- */
  window.gAnnalesRefresh = rendre;
  window.gAnnalesFiltre = function (k) { filtreLivre = k; ouvertId = null; rendre(); };
  window.gAnnalesOuvre = function (id) {
    ouvertId = id;
    rendre();
    var wrap = document.getElementById('gAnnales');
    if (wrap && wrap.scrollIntoView && id) wrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  window.gAnnalesVolet = function (btn) {
    var box = btn.nextElementSibling;
    if (!box) return;
    var ouvert = box.style.display !== 'none';
    box.style.display = ouvert ? 'none' : 'block';
    btn.textContent = ouvert ? '✦ Voir la correction détaillée' : '✦ Masquer la correction';
  };

  document.addEventListener('DOMContentLoaded', rendre);
})();

/* ===========================================================================
   CE QUI TOMBE VRAIMENT — rendu du dépouillement des sujets officiels.

   Tout ce qui s'affiche ici est calculé par statistiques-regional.js à partir
   des relevés. Aucun pourcentage n'est écrit en dur dans le HTML : ajouter un
   sujet au relevé suffit à mettre la page à jour. C'est la garantie qu'un
   chiffre montré à l'élève ne peut pas mentir.

   Ce bloc est PUBLIC : c'est l'argument qui donne envie de payer, pas ce
   qu'on vend. L'entraînement, lui, reste derrière le code membre.
=========================================================================== */
(function () {
  var LIVRES = {
    boite: { nom: 'La Boîte à Merveilles', icone: '📦' },
    antigone: { nom: 'Antigone', icone: '🏛️' },
    condamne: { nom: 'Le Dernier Jour d’un Condamné', icone: '⛓️' },
  };

  /* Libellés lisibles. Une forme absente de cette table s'affiche telle
     quelle : mieux vaut un intitulé brut qu'une donnée masquée. */
  var FORMES = {
    'tableau': 'Tableau d’identification (auteur, titre, genre…)',
    'avis-justifie': 'Donner son avis et le justifier',
    'figure-de-style': 'Reconnaître une figure de style',
    'vrai-faux': 'Vrai ou faux',
    'champ-lexical': 'Relever un champ lexical',
    'question-simple': 'Question de compréhension directe',
    'question-justifier': 'Répondre puis justifier par le texte',
    'situer': 'Situer le passage dans l’œuvre',
    'sentiment': 'Identifier un sentiment',
    'releve-indice': 'Relever un indice dans le texte',
    'qcm': 'Question à choix multiple',
    'discours-rapporte': 'Passer au discours indirect',
    'tonalite': 'Identifier le registre / la tonalité',
    'releve-phrase': 'Relever une phrase',
    'releve-expression': 'Relever une expression',
    'releve-sentiment': 'Relever ce qui exprime un sentiment',
    'qcm-justifier': 'QCM à justifier',
    'connecteur': 'Rapport logique d’un connecteur',
    'valeur-temps': 'Valeur d’un temps verbal',
    'situation-enonciation': 'Qui parle, à qui, où',
    'cadre-spatio-temporel': 'Quand et où se passe la scène',
    'melioratif-pejoratif': 'Mélioratif ou péjoratif',
    'registre-de-langue': 'Niveau de langue d’un mot',
    'analyse-grammaticale': 'Analyse grammaticale',
    'transformation': 'Transformer une phrase',
    'tableau-analyse': 'Tableau d’analyse à compléter',
    'lexique-destinataire': 'Lexique et destinataire',
    'releve-arguments': 'Relever des arguments',
    'proposer-titre': 'Proposer un titre',
  };

  function S() {
    return (window.PF_DATA && window.PF_DATA.statsRegional) || null;
  }
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /* Barre de fréquence : la largeur EST la proportion, pas une décoration. */
  function barre(n, total, libelle) {
    var pct = Math.round((n / total) * 100);
    return '<div class="tb-ligne">' +
      '<div class="tb-nom">' + esc(libelle) + '</div>' +
      '<div class="tb-piste"><div class="tb-jauge" style="width:' + pct + '%;"></div></div>' +
      '<div class="tb-val">' + n + '<span>/' + total + '</span></div>' +
    '</div>';
  }

  function rendre() {
    var wrap = document.getElementById('gTombe');
    var d = S();
    if (!wrap || !d || !d.calcule) return;
    var c = d.calcule;
    var n = c.nbSujets;

    /* --- l'invariant : la structure --- */
    var struct = c.structureRespectee
      ? '<div class="tb-verdict tb-ok">' +
          '<b>' + n + ' sujets sur ' + n + '</b> suivent exactement la même structure : ' +
          '<b>2 questions</b> pour contextualiser, <b>6</b> pour analyser, <b>2</b> pour réagir. ' +
          'Aucune exception.' +
        '</div>'
      : '<div class="tb-verdict">La structure varie d’un sujet à l’autre.</div>';

    /* --- les œuvres --- */
    var oeuvres = c.oeuvres.map(function (o) {
      var L = LIVRES[o.cle] || { nom: o.cle, icone: '📖' };
      return barre(o.n, n, L.icone + ' ' + L.nom);
    }).join('');
    var absentes = Object.keys(LIVRES).filter(function (k) {
      return !c.oeuvres.some(function (o) { return o.cle === k; });
    });
    if (absentes.length) {
      oeuvres += absentes.map(function (k) {
        return barre(0, n, LIVRES[k].icone + ' ' + LIVRES[k].nom);
      }).join('');
    }

    /* --- les exercices, du plus fréquent au plus rare --- */
    var top = c.presence.slice(0, 8).map(function (p) {
      return barre(p.sujets, n, FORMES[p.forme] || p.forme);
    }).join('');

    /* --- les sujets de production --- */
    var themes = c.themes.map(function (t) {
      return '<li><span class="tb-aca">' + esc(t.academie) + '</span> ' + esc(t.sujet) + '</li>';
    }).join('');

    wrap.innerHTML =
      '<section class="tombe">' +
        '<div class="tb-tete">' +
          '<div class="tb-titre">Ce qui tombe vraiment</div>' +
          '<p class="tb-sous">Nous avons lu, question par question, les <b>' + n + ' sujets officiels</b> ' +
            'de la session normale ' + esc(d.sujets[0].annee) + ' — soit <b>' + c.nbItems + ' questions</b>. ' +
            'Voici ce qu’ils disent. Pas une impression : un comptage.</p>' +
        '</div>' +

        struct +

        '<div class="tb-bloc">' +
          '<h4>Quelle œuvre est tombée ?</h4>' +
          '<div class="tb-liste">' + oeuvres + '</div>' +
          '<p class="tb-note">Un seul millésime : ces proportions disent ce qui <em>est</em> tombé en ' +
            esc(d.sujets[0].annee) + ', pas ce qui tombera. On révise les trois œuvres.</p>' +
        '</div>' +

        '<div class="tb-bloc">' +
          '<h4>Les exercices les plus fréquents</h4>' +
          '<div class="tb-liste">' + top + '</div>' +
          '<p class="tb-note">Lecture : « apparaît dans X sujets sur ' + n + ' ».</p>' +
        '</div>' +

        '<div class="tb-bloc">' +
          '<h4>Les sujets de production écrite</h4>' +
          '<p class="tb-note" style="margin-top:0;">Aucun n’était une dissertation littéraire. ' +
            'Tous demandaient un avis argumenté sur une question de société.</p>' +
          '<ul class="tb-themes">' + themes + '</ul>' +
        '</div>' +

        '<div class="tb-source">' + esc(d.couverture) + ' — ' + esc(d.source) + '</div>' +
      '</section>';
  }

  window.gTombeRefresh = rendre;
  document.addEventListener('DOMContentLoaded', rendre);
})();
