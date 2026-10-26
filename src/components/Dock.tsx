import { ArrowUp, FileText, Mail } from 'lucide-react'
import { spring } from 'motion'
import { animate } from 'motion/mini'
import { useEffect, useRef, useState, type FocusEvent, type PointerEvent } from 'react'
import { profile } from '../data/profile'
import { useLanguage } from '../i18n/LanguageProvider'
import { useRefraction } from '../lib/refraction'
import { prefersReducedMotion } from '../lib/storage'
import { usePointerGlow } from '../lib/usePointerGlow'
import { BrandSvg } from './TechGlyph'
import { Tip } from './Tip'
import './dock.css'

interface Props {
  /** Ouvre la fenêtre de contact depuis ce bouton du dock. */
  onContact: (source: HTMLElement, subject?: string) => void
}

/** Vive et posée : la lentille suit le pointeur sans dépasser l'élément suivant. */
const LENS = { type: spring, stiffness: 560, damping: 42, mass: 0.7 }

/**
 * Dock flottant en verre : CV, LinkedIn, contact et retour en haut. Aucun lien fictif. Une
 * lentille de verre plus clair glisse sous l'élément pointé ou atteint au clavier. Au bas de la
 * page, la tuile de contact offre déjà les mêmes liens : le dock se replie sur le retour en haut.
 */
export function Dock({ onContact }: Props) {
  const { pick, t } = useLanguage()
  const glowRef = usePointerGlow<HTMLElement>()
  const refract = useRefraction<HTMLElement>({ bezel: 14, scale: 18, delay: 1200 })
  const lensRef = useRef<HTMLSpanElement>(null)
  const lensShown = useRef(false)
  const resume = profile.resume ? `${import.meta.env.BASE_URL}${pick(profile.resume)}` : null
  const [atEnd, setAtEnd] = useState(false)

  useEffect(() => {
    const contact = document.getElementById('contact')
    if (!contact || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(([entry]) => setAtEnd(entry?.isIntersecting ?? false), { threshold: 0.4 })
    observer.observe(contact)
    return () => observer.disconnect()
  }, [])

  const toTop = () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
    document.getElementById('top')?.focus({ preventScroll: true })
  }

  // La lentille apparaît sur place, puis glisse d'un élément à l'autre.
  const moveLens = (item: HTMLElement | null) => {
    const lens = lensRef.current
    if (!lens) return
    if (!item) {
      lensShown.current = false
      animate(lens, { opacity: 0 }, { duration: 0.18 })
      return
    }
    // Mesurée par rapport au dock : le retour en haut est dans un élément positionné.
    const dock = item.closest('.dock')
    const left = dock ? item.getBoundingClientRect().left - dock.getBoundingClientRect().left - dock.clientLeft : item.offsetLeft
    const target = { transform: `translateX(${left}px)`, width: `${item.offsetWidth}px` }
    if (lensShown.current && !prefersReducedMotion()) {
      animate(lens, target, LENS)
    } else {
      animate(lens, target, { duration: 0 })
      animate(lens, { opacity: 1 }, { duration: 0.16 })
    }
    lensShown.current = true
  }

  // Les liens repliés emportent la lentille qui s'y trouvait.
  useEffect(() => {
    if (atEnd) moveLens(null)
  }, [atEnd])

  const lensProps = {
    onPointerEnter: (event: PointerEvent<HTMLElement>) => {
      if (event.pointerType !== 'touch') moveLens(event.currentTarget)
    },
    onFocus: (event: FocusEvent<HTMLElement>) => moveLens(event.currentTarget),
    onBlur: () => moveLens(null),
  }

  return (
    <nav
      className="dock glass"
      data-at-end={atEnd || undefined}
      aria-label={t.dock.label}
      ref={(element) => {
        glowRef(element)
        refract(element)
      }}
      onPointerLeave={() => moveLens(null)}
    >
      <span className="dock__lens" ref={lensRef} aria-hidden="true" />
      <ul className="dock__list">
        <li className="dock__link" inert={atEnd}>
          {resume ? (
            <Tip label={t.dock.cvPdf}>
              <a
                className="dock__item"
                href={resume}
                target="_blank"
                rel="noopener"
                type="application/pdf"
                hrefLang="fr"
                aria-label={`${t.dock.cv} ${t.a11y.cvPdf} ${t.a11y.newTab}`}
                {...lensProps}
              >
                <FileText aria-hidden="true" size={18} strokeWidth={1.75} />
                <span className="dock__label">{t.dock.cv}</span>
              </a>
            </Tip>
          ) : (
            <Tip label={t.dock.cvOnRequestShort}>
              <button
                type="button"
                className="dock__item"
                aria-label={t.dock.cvOnRequest}
                aria-haspopup="dialog"
                onClick={(event) => onContact(event.currentTarget, t.contact.cvSubject)}
                {...lensProps}
              >
                <FileText aria-hidden="true" size={18} strokeWidth={1.75} />
                <span className="dock__label" aria-hidden="true">
                  {t.dock.cv}
                </span>
              </button>
            </Tip>
          )}
        </li>
        <li className="dock__link" inert={atEnd}>
          <Tip label={`${t.contact.linkedin} ${t.a11y.newTab}`}>
            <a className="dock__item" href={profile.linkedin} target="_blank" rel="noopener noreferrer" {...lensProps}>
              <BrandSvg icon="linkedin" className="dock__brand" />
              <span className="dock__label">{t.dock.linkedin}</span>
              <span className="sr-only"> {t.a11y.newTab}</span>
            </a>
          </Tip>
        </li>
        <li className="dock__link" inert={atEnd}>
          <Tip label={t.dock.contactHint}>
            <button
              type="button"
              className="dock__item"
              aria-haspopup="dialog"
              onClick={(event) => onContact(event.currentTarget)}
              {...lensProps}
            >
              <Mail aria-hidden="true" size={18} strokeWidth={1.75} />
              <span className="dock__label">{t.dock.contact}</span>
            </button>
          </Tip>
        </li>
        <li className="dock__end">
          <Tip label={t.dock.top}>
            <button type="button" className="dock__item dock__item--icon" aria-label={t.dock.top} onClick={toTop} {...lensProps}>
              <ArrowUp aria-hidden="true" size={18} strokeWidth={1.75} />
            </button>
          </Tip>
        </li>
      </ul>
    </nav>
  )
}
