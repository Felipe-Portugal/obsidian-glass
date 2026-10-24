import { useSyncExternalStore } from 'react'

/** Petit écran : les fenêtres et les bulles deviennent des feuilles qui montent du bas. */
export const COMPACT_QUERY = '(max-width: 640px)'

/** Suit une requête média (largeur, préférences) et se met à jour quand elle change. */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (notify) => {
      const list = window.matchMedia?.(query)
      list?.addEventListener('change', notify)
      return () => list?.removeEventListener('change', notify)
    },
    () => window.matchMedia?.(query).matches ?? false,
    () => false,
  )
}
