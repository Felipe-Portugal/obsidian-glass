import type { Lang } from '../data/types'
import { readStorage } from '../lib/storage'

/** Même clé et même logique que le script inline d'index.html, qui évite tout flash de langue. */
export const LANG_KEY = 'og-lang'

export function isLang(value: unknown): value is Lang {
  return value === 'fr' || value === 'en'
}

/** FR pour fr*, EN pour en*, dans l'ordre des préférences du navigateur ; FR par défaut. */
export function detectLanguage(preferences: readonly string[]): Lang {
  for (const raw of preferences) {
    const code = raw.toLowerCase()
    if (code.startsWith('fr')) return 'fr'
    if (code.startsWith('en')) return 'en'
  }
  return 'fr'
}

export function initialLanguage(): Lang {
  const stored = readStorage(LANG_KEY)
  if (isLang(stored)) return stored
  if (typeof navigator === 'undefined') return 'fr'
  const preferences = navigator.languages?.length ? navigator.languages : [navigator.language]
  return detectLanguage(preferences)
}
