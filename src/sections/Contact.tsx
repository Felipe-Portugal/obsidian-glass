import { ArrowUpRight, FileText, Mail, MapPin } from 'lucide-react'
import { CopyButton } from '../components/ContactLinks'
import { profile } from '../data/profile'
import { useLanguage } from '../i18n/LanguageProvider'
import { mailto } from '../lib/mailto'

interface Props {
  onOpen: (source: HTMLElement, subject?: string) => void
}

/** Bande de contact : l'invitation, puis l'adresse (copiable), le formulaire, LinkedIn, GitHub et le CV. */
export function Contact({ onOpen }: Props) {
  const { pick, t } = useLanguage()
  const resume = profile.resume ? `${import.meta.env.BASE_URL}${pick(profile.resume)}` : null
  return (
    <section className="plate tile tile--contact" data-tone="contact" id="contact" aria-labelledby="contact-tile-title">
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
          <button type="button" className="button button--primary" aria-haspopup="dialog" onClick={(event) => onOpen(event.currentTarget)}>
            <Mail aria-hidden="true" size={16} strokeWidth={1.75} />
            <span>{t.contactTile.write}</span>
          </button>
          <a className="button button--quiet" href={profile.linkedin} target="_blank" rel="noopener noreferrer">
            <span>LinkedIn</span>
            <span className="sr-only"> {t.a11y.newTab}</span>
            <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.75} />
          </a>
          <a className="button button--quiet" href={profile.github} target="_blank" rel="noopener noreferrer">
            <span>GitHub</span>
            <span className="sr-only"> {t.a11y.newTab}</span>
            <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.75} />
          </a>
          {resume ? (
            <a className="button button--quiet" href={resume} target="_blank" rel="noopener" type="application/pdf" hrefLang="fr" aria-label={`${t.contactTile.cvOpen} ${t.a11y.cvPdf} ${t.a11y.newTab}`}>
              <FileText aria-hidden="true" size={16} strokeWidth={1.75} />
              <span>{t.contactTile.cvOpen}</span>
            </a>
          ) : (
            <button type="button" className="button button--quiet" aria-haspopup="dialog" onClick={(event) => onOpen(event.currentTarget, t.contact.cvSubject)}>
              <FileText aria-hidden="true" size={16} strokeWidth={1.75} />
              <span>{t.contactTile.cv}</span>
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
