import { ArrowUpRight, FileText, Mail, MapPin } from 'lucide-react'
import { CopyButton } from '../components/ContactLinks'
import { profile } from '../data/profile'
import { useLanguage } from '../i18n/LanguageProvider'
import { mailto } from '../lib/mailto'

/** Bande de contact : l'invitation, puis l'adresse (copiable), un courriel direct, LinkedIn et la demande de CV. */
export function Contact() {
  const { t } = useLanguage()
  return (
    <section className="plate tile tile--contact" id="contact" aria-labelledby="contact-tile-title">
      <div className="contact__intro">
        <h2 id="contact-tile-title" className="tile__label">
          {t.contactTile.title}
        </h2>
        <p className="contact__lead">{t.contactTile.lead}</p>
        <p className="contact__where">
          <MapPin aria-hidden="true" size={15} strokeWidth={1.75} />
          {profile.location}
        </p>
      </div>
      <div className="contact__reach">
        <p className="contact__email">
          <a href={mailto()}>{profile.email}</a>
          <CopyButton value={profile.email} />
        </p>
        <div className="contact__actions">
          <a className="button button--primary" href={mailto()}>
            <Mail aria-hidden="true" size={16} strokeWidth={1.75} />
            <span>{t.contactTile.write}</span>
          </a>
          <a className="button button--quiet" href={profile.linkedin} target="_blank" rel="noopener noreferrer">
            <span>LinkedIn</span>
            <span className="sr-only"> {t.a11y.newTab}</span>
            <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.75} />
          </a>
          <a className="button button--quiet" href={mailto(t.contact.cvSubject)}>
            <FileText aria-hidden="true" size={16} strokeWidth={1.75} />
            <span>{t.contactTile.cv}</span>
          </a>
        </div>
      </div>
    </section>
  )
}
