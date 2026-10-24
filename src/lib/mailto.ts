import { profile } from '../data/profile'

/** Lien courriel direct, avec un sujet prérempli au besoin (p. ex. « Demande de CV »). */
export function mailto(subject?: string) {
  return `mailto:${profile.email}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`
}
