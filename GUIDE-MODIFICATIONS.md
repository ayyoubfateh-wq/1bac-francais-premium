# Guide des modifications — Play-Bac 1BAC Français

Ce projet est organisé pour qu'on puisse **modifier sans risque de casser** :
le contenu est séparé du code, et chaque mise en ligne est vérifiée
automatiquement. Si quelque chose est cassé, le déploiement échoue et
**le site en ligne reste intact**.

## Les 3 zones du projet

| Zone | Rôle | Quand y toucher |
|---|---|---|
| `assets/data/` | **Le contenu** : questions, études de texte, sujets d'écriture | Tout le temps — c'est fait pour ça |
| `src/html/` | **Les écrans** : un fichier par rubrique (résumés, fiches, méthode…) | Pour modifier un texte, une fiche, une page |
| `assets/js/` + `assets/css/` | **Les moteurs** : jeu, quiz, premium, styles | Rarement — logique de l'application |

⚠️ **`index.html` est GÉNÉRÉ automatiquement** à partir de `src/html/`.
Ne jamais l'éditer directement : les modifications seraient écrasées.

## Ajouter ou corriger une question

1. Ouvrir `assets/data/questions.js`
2. Trouver l'œuvre (`boite`, `antigone`, `condamne`) et ajouter un bloc :

```js
{
  "cat": "Analyse",              // Contextualisation | Analyse | Fait de langue | Réaction / opinion
  "q": "Votre question ?",
  "opts": ["Bonne réponse", "Leurre 1", "Leurre 2", "Leurre 3"],
  "ans": 0,                       // index de la bonne réponse (0 = première)
  "exp": "Explication pédagogique montrée après la réponse."
},
```

3. Vérifier : `npm run validate`
4. Publier : `git add assets/data/questions.js && git commit -m "contenu: +1 question" && git push`

Même principe pour `etudes.js` (support + 5 questions) et `sujets.js`
(sujet + pistes + réponse modèle en 4 parties).

## Modifier un écran (fiches, résumés, méthode…)

1. Éditer le fichier concerné dans `src/html/ecrans/` (ex. `07-fiches.html`)
2. Reconstruire : `npm run build`
3. Tester en local (ouvrir `index.html` dans le navigateur)
4. `git add src/html/... && git commit && git push`

Netlify relance le même build à la mise en ligne : ce que vous avez testé
est ce qui part.

## Les commandes

| Commande | Ce qu'elle fait |
|---|---|
| `npm run validate` | Vérifie tout le contenu (compte, réponses, doublons, structure) |
| `npm run build` | Valide + assemble `index.html` depuis les fragments |
| `npm run generate-codes` | Génère 20 nouveaux codes clients (CSV privé dans `generated-codes/`) |

## Les garde-fous automatiques

- **À chaque déploiement**, Netlify exécute `npm run build` : contenu
  invalide ou assemblage cassé ⇒ déploiement refusé, site en ligne intact.
- Les positions des réponses sont **mélangées à l'affichage** : on écrit
  toujours la bonne réponse en premier (`ans: 0`), c'est plus lisible.
- La progression des élèves est liée à leur **code** (sauvegarde nuage) :
  modifier le contenu ne fait rien perdre à personne.

## Espace vendeur

- `play-bac.com/gestion-codes.html` : vérifier/libérer un code client,
  consulter les statistiques d'usage (clé d'administration requise).
- Codes clients : `generated-codes/codes-a-envoyer-aux-clients.csv`
  (privé, jamais dans git). Un code par client, à barrer après envoi.

## En cas de doute

`npm run validate` ne coûte rien et dit précisément ce qui ne va pas
(fichier, œuvre, numéro de question). Le déploiement n'acceptera de toute
façon rien de cassé.
