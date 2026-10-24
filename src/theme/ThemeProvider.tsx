import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useState, type ReactNode } from 'react'
import { flushSync } from 'react-dom'
import { prefersReducedMotion, readStorage, writeStorage } from '../lib/storage'
import { isThemePreference, resolveTheme, THEME_COLORS, THEME_KEY, type ResolvedTheme, type ThemePreference } from './theme'

interface ThemeContextValue {
  preference: ThemePreference
  resolved: ResolvedTheme
  setPreference: (preference: ThemePreference) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)
const DARK_QUERY = '(prefers-color-scheme: dark)'

function systemPrefersDark(): boolean {
  return typeof window !== 'undefined' && window.matchMedia?.(DARK_QUERY).matches === true
}

function applyTheme(theme: ResolvedTheme) {
  const root = document.documentElement
  root.dataset.theme = theme
  root.style.colorScheme = theme
  document.head.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[theme])
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>(() => {
    const stored = readStorage(THEME_KEY)
    return isThemePreference(stored) ? stored : 'auto'
  })
  const [systemDark, setSystemDark] = useState(systemPrefersDark)
  const resolved = resolveTheme(preference, systemDark)

  useEffect(() => {
    const query = window.matchMedia?.(DARK_QUERY)
    if (!query) return
    const onChange = (event: MediaQueryListEvent) => setSystemDark(event.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  useLayoutEffect(() => applyTheme(resolved), [resolved])

  const setPreference = useCallback(
    (next: ThemePreference) => {
      // « auto » n'est pas mémorisé : le site suit alors le système, y compris aux visites suivantes.
      writeStorage(THEME_KEY, next === 'auto' ? null : next)
      const commit = () => {
        flushSync(() => setPreferenceState(next))
        applyTheme(resolveTheme(next, systemDark))
      }
      if (typeof document.startViewTransition === 'function' && !prefersReducedMotion()) {
        document.startViewTransition(commit)
      } else {
        commit()
      }
    },
    [systemDark],
  )

  const value = useMemo(() => ({ preference, resolved, setPreference }), [preference, resolved, setPreference])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme doit être utilisé dans <ThemeProvider>')
  return context
}
