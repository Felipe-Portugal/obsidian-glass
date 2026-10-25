/**
 * Ligne du temps du parcours : expérience et formation mêlées, de la plus récente à la plus
 * ancienne. Seule l'année sert de repère ; les dates exactes restent celles de chaque entrée.
 */
export type TimelineStep = { kind: 'experience' | 'education'; id: string; year: string }

export const timeline: readonly TimelineStep[] = [
  { kind: 'experience', id: 'software', year: '2025' },
  { kind: 'education', id: 'ets', year: '2024' },
  { kind: 'experience', id: 'embedded', year: '2024' },
  { kind: 'education', id: 'dec', year: '2024' },
  { kind: 'experience', id: 'research', year: '2024' },
]
