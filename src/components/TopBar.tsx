import { Monitor, Moon, Sun } from 'lucide-react'
import type { Lang } from '../data/types'
import { useLanguage } from '../i18n/LanguageProvider'
import { useTheme } from '../theme/ThemeProvider'
import type { ThemePreference } from '../theme/theme'
import { Tip } from './Tip'
import './topbar.css'

const LANGS: readonly Lang[] = ['fr', 'en']
const THEMES: readonly { value: ThemePreference; Icon: typeof Sun }[] = [
  { value: 'auto', Icon: Monitor },
  { value: 'light', Icon: Sun },
  { value: 'dark', Icon: Moon },
]

function LanguageSwitch() {
  const { lang, setLang, t } = useLanguage()
  return (
    <fieldset className="segmented glass">
      <legend className="sr-only">{t.topbar.language}</legend>
      {LANGS.map((code) => (
        <button
          key={code}
          type="button"
          className="segmented__item segmented__item--text"
          lang={code}
          aria-pressed={lang === code}
          aria-label={t.topbar.languageNames[code]}
          onClick={() => setLang(code)}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </fieldset>
  )
}

function ThemeSwitch() {
  const { preference, setPreference } = useTheme()
  const { t } = useLanguage()
  return (
    <fieldset className="segmented glass">
      <legend className="sr-only">{t.topbar.theme}</legend>
      {THEMES.map(({ value, Icon }) => (
        <Tip key={value} label={t.topbar.themes[value]} side="bottom">
          <button
            type="button"
            className="segmented__item"
            aria-pressed={preference === value}
            aria-label={t.topbar.themes[value]}
            onClick={() => setPreference(value)}
          >
            <Icon aria-hidden="true" size={16} strokeWidth={1.75} />
          </button>
        </Tip>
      ))}
    </fieldset>
  )
}

export function TopBar() {
  const { t } = useLanguage()
  return (
    <header className="topbar">
      <a className="monogram" href="#top" aria-label={t.topbar.home}>
        FP<span aria-hidden="true">.</span>
      </a>
      <div className="topbar__controls">
        <LanguageSwitch />
        <ThemeSwitch />
      </div>
    </header>
  )
}
