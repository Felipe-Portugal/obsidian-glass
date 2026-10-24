import '@fontsource-variable/geist/wght.css'
import './styles/tokens.css'
import './styles/base.css'
import './styles/tooltip.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { LanguageProvider } from './i18n/LanguageProvider'
import { ThemeProvider } from './theme/ThemeProvider'

const root = document.getElementById('root')
if (!root) throw new Error('Élément #root introuvable')

// Animation d'entrée seulement pour un onglet visible, et bornée dans le temps.
const html = document.documentElement
if (document.visibilityState === 'visible' && !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
  html.classList.add('intro')
  window.setTimeout(() => html.classList.remove('intro'), 1400)
}

createRoot(root).render(
  <StrictMode>
    <ThemeProvider>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </ThemeProvider>
  </StrictMode>,
)
