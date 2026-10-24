/** Même clé que le script inline d'index.html, qui applique le thème avant le premier rendu. */
export const THEME_KEY = 'og-theme'

export type ThemePreference = 'auto' | 'light' | 'dark'
export type ResolvedTheme = 'light' | 'dark'

export const THEME_COLORS: Record<ResolvedTheme, string> = {
  dark: '#0b0d10',
  light: '#f2f3f5',
}

export function isThemePreference(value: unknown): value is ThemePreference {
  return value === 'auto' || value === 'light' || value === 'dark'
}

export function resolveTheme(preference: ThemePreference, systemPrefersDark: boolean): ResolvedTheme {
  if (preference === 'auto') return systemPrefersDark ? 'dark' : 'light'
  return preference
}
