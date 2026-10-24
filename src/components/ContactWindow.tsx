import { Mail, MapPin } from 'lucide-react'
import { lazy, Suspense } from 'react'
import { profile } from '../data/profile'
import { useLanguage } from '../i18n/LanguageProvider'
import { formspreeId } from '../lib/contact'
import { mailto } from '../lib/mailto'
import { CopyButton } from './ContactLinks'
import { Sheet } from './Sheet'
import { BrandSvg } from './TechGlyph'
import './contact.css'

// Le formulaire et @formspree/core ne sont chargés qu'à l'ouverture de la fenêtre.
const ContactForm = lazy(() => import('./ContactForm'))

interface Props {
  onClose: () => void
  /** Bouton qui a ouvert la fenêtre : elle en naît et s'y repose. */
  source: HTMLElement | null
  /** Sujet prérempli, p. ex. « Demande de CV » depuis le dock. */
  subject?: string
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

export function ContactWindow({ onClose, source, subject }: Props) {
  const { t } = useLanguage()
  const formId = formspreeId()

  return (
    <Sheet title={t.contact.title} size="md" source={source} onClose={onClose} header={<p className="cw__intro">{t.contact.intro}</p>}>
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
    </Sheet>
  )
}
