import { ArrowUp, FileText, Mail } from 'lucide-react'
import type { MouseEvent } from 'react'
import { profile } from '../data/profile'
import { useLanguage } from '../i18n/LanguageProvider'
import { prefersReducedMotion } from '../lib/storage'
import { usePointerGlow } from '../lib/usePointerGlow'
import { BrandSvg } from './TechGlyph'
import './dock.css'

interface Props {
  onContact: (origin: DOMRect, subject?: string) => void
}

const rectOf = (event: MouseEvent<HTMLElement>) => event.currentTarget.getBoundingClientRect()

/** Dock flottant : CV, LinkedIn, contact et retour en haut. Aucun lien fictif. */
export function Dock({ onContact }: Props) {
  const { lang, pick, t } = useLanguage()
  const glowRef = usePointerGlow<HTMLElement>()
  const resume = profile.resume ? `${import.meta.env.BASE_URL}${pick(profile.resume)}` : null

  const toTop = () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
    document.getElementById('top')?.focus({ preventScroll: true })
  }

  return (
    <nav className="dock" aria-label={t.dock.label} ref={glowRef}>
      <ul className="dock__list">
        <li>
          {resume ? (
            <a className="dock__item has-tip" href={resume} target="_blank" rel="noopener" type="application/pdf" hrefLang={lang}>
              <FileText aria-hidden="true" size={18} strokeWidth={1.75} />
              <span className="dock__label">{t.dock.cv}</span>
              <span className="sr-only"> {t.dock.cvPdf} {t.a11y.newTab}</span>
              <span className="tip" aria-hidden="true">
                {t.dock.cvPdf}
              </span>
            </a>
          ) : (
            <button
              type="button"
              className="dock__item has-tip"
              aria-label={t.dock.cvOnRequest}
              aria-haspopup="dialog"
              onClick={(event) => onContact(rectOf(event), t.contact.cvSubject)}
            >
              <FileText aria-hidden="true" size={18} strokeWidth={1.75} />
              <span className="dock__label" aria-hidden="true">
                {t.dock.cv}
              </span>
              <span className="tip" aria-hidden="true">
                {t.dock.cvOnRequestShort}
              </span>
            </button>
          )}
        </li>
        <li>
          <a className="dock__item has-tip" href={profile.linkedin} target="_blank" rel="noopener noreferrer">
            <BrandSvg icon="linkedin" className="dock__brand" />
            <span className="dock__label">{t.dock.linkedin}</span>
            <span className="sr-only"> {t.a11y.newTab}</span>
            <span className="tip" aria-hidden="true">
              {t.contact.linkedin} {t.a11y.newTab}
            </span>
          </a>
        </li>
        <li>
          <button
            type="button"
            className="dock__item has-tip"
            aria-haspopup="dialog"
            onClick={(event) => onContact(rectOf(event))}
          >
            <Mail aria-hidden="true" size={18} strokeWidth={1.75} />
            <span className="dock__label">{t.dock.contact}</span>
            <span className="tip" aria-hidden="true">
              {t.dock.contactHint}
            </span>
          </button>
        </li>
        <li className="dock__end">
          <button type="button" className="dock__item dock__item--icon has-tip" aria-label={t.dock.top} onClick={toTop}>
            <ArrowUp aria-hidden="true" size={18} strokeWidth={1.75} />
            <span className="tip" aria-hidden="true">
              {t.dock.top}
            </span>
          </button>
        </li>
      </ul>
    </nav>
  )
}
