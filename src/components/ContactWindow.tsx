import { Mail, MapPin } from 'lucide-react'
import { lazy, Suspense, useEffect, useState } from 'react'
import { profile } from '../data/profile'
import { useLanguage } from '../i18n/LanguageProvider'
import { formspreeId } from '../lib/contact'
import { mailto } from '../lib/mailto'
import { prefersReducedMotion } from '../lib/storage'
import { COMPACT_QUERY, useMediaQuery } from '../lib/useMediaQuery'
import { CopyButton } from './ContactLinks'
import { Sheet } from './Sheet'
import { BrandSvg } from './TechGlyph'
import './contact.css'

// Le formulaire et @formspree/core ne sont chargés qu'à l'ouverture de la fenêtre.
let formWasLoaded = false
const ContactForm = lazy(async () => {
  const module = await import('./ContactForm')
  formWasLoaded = true
  return module
})

interface Props {
  onClose: () => void
  /** Bouton qui a ouvert la fenêtre : elle en naît et s'y repose. */
  source: HTMLElement | null
  /** Sujet prérempli, p. ex. « Demande de CV » depuis le dock. */
  subject?: string
}

export function ContactWindow({ onClose, source, subject }: Props) {
  const { t } = useLanguage()
  const formId = formspreeId()
  const compact = useMediaQuery(COMPACT_QUERY)
  const [formReady, setFormReady] = useState(() => prefersReducedMotion() || formWasLoaded)

  // L'import du formulaire peut bloquer une image sur un appareil lent : le charger une fois la feuille posée.
  useEffect(() => {
    if (formReady) return
    const timer = window.setTimeout(() => setFormReady(true), compact ? 420 : 320)
    return () => window.clearTimeout(timer)
  }, [compact, formReady])

  return (
    <Sheet title={t.contact.title} size="md" source={source} onClose={onClose} header={<p className="cw__intro">{t.contact.intro}</p>}>
      <div className="cw__grid">
        <section className="cw__form" aria-labelledby="contact-form-title">
          <h3 id="contact-form-title" className="sr-only">
            {t.contact.form.title}
          </h3>
          {formReady ? (
            <Suspense fallback={<p className="cw__loading">{t.contact.loading}</p>}>
              <ContactForm {...(formId ? { formId } : {})} {...(subject ? { initialSubject: subject } : {})} />
            </Suspense>
          ) : <p className="cw__loading">{t.contact.loading}</p>}
        </section>

        <aside className="cw__direct" aria-labelledby="contact-direct-title">
          <h3 id="contact-direct-title" className="cw__direct-title">
            {t.contact.direct}
          </h3>
          <ul className="cw__channels">
            <li className="cw__channel">
              <Mail className="cw__icon" aria-hidden="true" size={18} strokeWidth={1.75} />
              <div className="cw__channel-body">
                <span className="cw__label">{t.contact.emailLabel}</span>
                <a className="cw__email" href={mailto(subject)}>
                  {profile.email}
                </a>
              </div>
              <CopyButton value={profile.email} />
            </li>
            <li className="cw__channel">
              <BrandSvg icon="linkedin" className="cw__icon" />
              <div className="cw__channel-body">
                <span className="cw__label">LinkedIn</span>
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                  {t.contact.linkedin}
                  <span className="sr-only"> {t.a11y.newTab}</span>
                </a>
              </div>
            </li>
            <li className="cw__channel">
              <MapPin className="cw__icon" aria-hidden="true" size={18} strokeWidth={1.75} />
              <div className="cw__channel-body">
                <span className="cw__label">{t.contact.locationLabel}</span>
                <span>{profile.location}</span>
              </div>
            </li>
          </ul>
        </aside>
      </div>
    </Sheet>
  )
}
