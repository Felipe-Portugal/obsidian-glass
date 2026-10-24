import type { Localized } from './types'

export interface Profile {
  name: string
  email: string
  linkedin: string
  location: string
  /**
   * CV au format PDF, chemin relatif au dossier public/ (p. ex. « cv/Felipe_Portugal_CV_FR.pdf »).
   * `null` tant qu'aucun PDF vérifié n'est fourni : le dock propose alors « CV sur demande »,
   * qui ouvre le formulaire de contact. Les CV existants affichent le numéro de téléphone,
   * qui ne doit pas être publié : préparer une version sans téléphone avant de l'ajouter.
   */
  resume: Localized<string> | null
}

export const profile: Profile = {
  name: 'Felipe Portugal',
  email: 'felipe-alberto.padilla-portugal.1@ens.etsmtl.ca',
  linkedin: 'https://www.linkedin.com/in/felipe-portugal-151a75225/',
  location: 'Montréal, Québec',
  resume: null,
}
