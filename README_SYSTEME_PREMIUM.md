# Systeme Premium Play-Bac - Netlify Functions

Ce pack contient une validation premium cote serveur avec Netlify Functions. Les codes ne sont plus stockes dans le HTML ni dans le JavaScript public.

## Deploiement
Sur Netlify, redeployez le dossier complet contenant index.html, assets/, netlify.toml, netlify/functions/validate-access.js, package.json et tools/.

## Generer des codes premium
Dans ce dossier, ouvrez un terminal et lancez : npm run generate-codes

Cela cree generated-codes/ avec :
- codes-a-envoyer-aux-clients.csv : codes a envoyer aux eleves apres paiement.
- netlify-env-PREMIUM_CODE_HASHES.txt : valeur a coller dans Netlify.

## Configurer Netlify
Netlify -> Project configuration -> Environment variables -> Add variable

Ajoutez :
- Key : PREMIUM_CODE_HASHES
- Value : contenu complet de generated-codes/netlify-env-PREMIUM_CODE_HASHES.txt

Optionnel :
- Key : ACCESS_DURATION_HOURS
- Value : 24 pour 24h, 720 pour environ 30 jours.

Apres ajout des variables, redeployez le site.

## Tester
Ouvrez le site et entrez un code du CSV. Si le code est correct, l'ecran premium disparait.

## Important
Gardez le CSV prive. Ne le glissez jamais dans Netlify. Cette version valide les codes cote serveur, mais ne marque pas encore un code comme utilise. Pour des codes strictement a usage unique, il faudra ajouter une base de donnees comme Supabase, Firebase ou Netlify Blobs.
