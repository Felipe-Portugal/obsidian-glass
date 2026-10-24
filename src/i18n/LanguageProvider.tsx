import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Lang, Localized } from '../data/types'
import { writeStorage } from '../lib/storage'
import { initialLanguage, LANG_KEY } from './detect'
import { ui, type UiStrings } from './ui'

interface LanguageContextValue {
  lang: Lang
  setLang: (lang: Lang) => void
  t: UiStrings
  /** Choisit la variante de la langue active d'une valeur traduite. */
  pick: <T>(value: Localized<T> | T) => T
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

function isLocalized<T>(value: Localized<T> | T): value is Localized<T> {
  return typeof value === 'object' && value !== null && 'fr' in value && 'en' in value
}

function setMeta(selector: string, content: string) {
  document.head.querySelector<HTMLMetaElement>(selector)?.setAttribute('content', content)
}

export function LanguageProvider({ children, initial }: { children: ReactNode; initial?: Lang }) {
  const [lang, setLangState] = useState<Lang>(() => initial ?? initialLanguage())
  const t = ui[lang]

  useEffect(() => {
    const root = document.documentElement
    root.lang = lang
    document.title = t.meta.title
    setMeta('meta[name="description"]', t.meta.description)
    setMeta('meta[property="og:title"]', t.meta.title)
    setMeta('meta[property="og:description"]', t.meta.description)
    setMeta('meta[property="og:locale"]', t.meta.locale)
    setMeta('meta[property="og:locale:alternate"]', t.meta.alternateLocale)
  }, [lang, t])

  const setLang = useCallback((next: Lang) => {
    writeStorage(LANG_KEY, next)
    setLangState(next)
  }, [])

  const pick = useCallback(
    <T,>(value: Localized<T> | T): T => (isLocalized(value) ? value[lang] : value),
    [lang],
  )

  const value = useMemo(() => ({ lang, setLang, t, pick }), [lang, setLang, t, pick])
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage doit être utilisé dans <LanguageProvider>')
  return context
}
