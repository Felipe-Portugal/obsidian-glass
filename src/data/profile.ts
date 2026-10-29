import type { Localized } from './types'

export interface Profile {
  name: string
  email: string
  linkedin: string
  /** Compte GitHub public (code de ce portfolio). */
  github: string
  location: string
  /**
   * CV au format PDF, chemin relatif au dossier public/ (p. ex. « cv/Felipe_Portugal_CV_FR.pdf »).
   * `null` si aucun PDF n'est fourni : le dock propose alors « CV sur demande », qui ouvre le
   * formulaire de contact. Chaque langue ouvre son propre PDF (CV en français, résumé en anglais).
   */
  resume: Localized<string> | null
}

export const profile: Profile = {
  name: 'Felipe Portugal',
  email: 'felipe-alberto.padilla-portugal.1@ens.etsmtl.ca',
  linkedin: 'https://www.linkedin.com/in/felipe-portugal-151a75225/',
  github: 'https://github.com/Felipe-Portugal',
  location: 'Montréal, Québec',
  resume: { fr: 'cv/Felipe_Portugal_CV_FR.pdf', en: 'cv/Felipe_Portugal_Resume_EN.pdf' },
}
