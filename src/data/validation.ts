/**
 * Points À VALIDER par Felipe avant publication.
 *
 * Tant qu'un drapeau vaut `false`, le contenu correspondant n'est pas affiché : le site
 * reste fidèle à facts_felipe.md, qui prime sur les autres documents. Passer un drapeau
 * à `true` seulement après confirmation écrite, puis mettre facts_felipe.md à jour.
 */
export const validated = {
  /**
   * Le brief indique que PyTorch détectait les manomètres sur le serveur Linux, mais
   * facts_felipe.md précise : « La technologie exacte derrière "torch/service torch" est
   * À VALIDER. Ne pas écrire PyTorch ou TorchServe sans confirmation. »
   * Activer affiche PyTorch dans le schéma, l'approche et les technologies du projet Spot.
   */
  pytorchDetection: false,
} as const
