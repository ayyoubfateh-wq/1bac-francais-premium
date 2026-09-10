/* ============================================================================
   AVIS D'ÉLÈVES affichés sur la page de vente.

   POUR AJOUTER UN AVIS : ajoute un bloc dans la liste ci-dessous, puis lance
   `npm run build`. Rien d'autre à toucher.

     { texte: 'ce que l’élève a écrit', nom: 'Prénom N.', role: '1BAC — Ville' }

   RÈGLE : uniquement des avis RÉELS, reçus de vraies personnes, publiés avec
   leur accord. Un faux témoignage se repère vite dans un lycée et détruit la
   confiance bien plus qu’il ne fait vendre. Tant que la liste est vide, la
   section entière reste masquée sur le site — c’est voulu.
============================================================================ */
window.PF_DATA = window.PF_DATA || {};
window.PF_DATA.avis = [
  // Exemple de format (à supprimer en ajoutant un vrai avis) :
  // { texte: 'Je révisais en relisant et j’oubliais tout. Là je réponds, et ça reste.',
  //   nom: 'Salma B.', role: '1BAC — Casablanca' },
];
