import { Check, Copy, Mail, MapPin } from 'lucide-react'
import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { profile } from '../data/profile'
import { useLanguage } from '../i18n/LanguageProvider'
import { formspreeId } from '../lib/contact'
import { BrandSvg } from './TechGlyph'
import { Window } from './Window'
import './contact.css'

// Le formulaire et @formspree/core ne sont chargés qu'à l'ouverture de la fenêtre.
const ContactForm = lazy(() => import('./ContactForm'))

function mailto(subject?: string) {
  return `mailto:${profile.email}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`
}

function CopyButton({ value }: { value: string }) {
  const { t } = useLanguage()
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle')
  const timer = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(timer.current), [])

  const copy = async () => {
    window.clearTimeout(timer.current)
    try {
      await navigator.clipboard.writeText(value)
      setState('copied')
    } catch {
      setState('failed')
    }
    timer.current = window.setTimeout(() => setState('idle'), 2400)
  }

  const message = state === 'copied' ? t.contact.copied : state === 'failed' ? t.contact.copyFailed : ''
  return (
    <span className="copy">
      <button type="button" className="icon-button" onClick={copy} aria-label={t.contact.copy} data-state={state}>
        {state === 'copied' ? (
          <Check aria-hidden="true" size={16} strokeWidth={2} />
        ) : (
          <Copy aria-hidden="true" size={16} strokeWidth={1.75} />
        )}
      </button>
      <output className="copy__status" data-visible={state !== 'idle'}>
        {message}
      </output>
    </span>
  )
}

function ContactUnavailable({ subject }: { subject?: string }) {
  const { t } = useLanguage()
  return (
    <div className="cw__unavailable">
      <p className="cw__unavailable-title">{t.contact.unavailable.title}</p>
      <p>{t.contact.unavailable.body}</p>
      <a className="button button--primary" href={mailto(subject)}>
        <Mail aria-hidden="true" size={16} strokeWidth={1.75} />
        <span>{t.contact.writeEmail}</span>
      </a>
      {import.meta.env.DEV && <p className="devnote">{t.contact.unavailable.dev}</p>}
    </div>
  )
}

interface Props {
  onClose: () => void
  origin: DOMRect | null
  /** Sujet prérempli, p. ex. « Demande de CV » depuis le dock. */
  subject?: string
}

export function ContactWindow({ onClose, origin, subject }: Props) {
  const { t } = useLanguage()
  const formId = formspreeId()

  return (
    <Window labelledBy="contact-title" title={t.contact.title} size="md" origin={origin} onClose={onClose}>
      <header className="cw__head">
        <h2 id="contact-title" className="pw__title" tabIndex={-1}>
          {t.contact.title}
        </h2>
        <p className="cw__intro">{t.contact.intro}</p>
      </header>

      <div className="cw__grid">
        <section className="cw__form" aria-labelledby="contact-form-title">
          <h3 id="contact-form-title" className="sr-only">
            {t.contact.form.title}
          </h3>
          {formId ? (
            <Suspense fallback={<p className="cw__loading">{t.contact.loading}</p>}>
              <ContactForm formId={formId} {...(subject ? { initialSubject: subject } : {})} />
            </Suspense>
          ) : (
            <ContactUnavailable {...(subject ? { subject } : {})} />
          )}
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
    </Window>
  )
}
