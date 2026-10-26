import { lazy, Suspense } from 'react'
import { useLanguage } from '../i18n/LanguageProvider'
import { formspreeId } from '../lib/contact'
import { Sheet } from './Sheet'
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

export function ContactWindow({ onClose, source, subject }: Props) {
  const { t } = useLanguage()
  const formId = formspreeId()

  return (
    <Sheet title={t.contact.title} size="contact" source={source} onClose={onClose} header={<p className="cw__intro">{formId ? t.contact.intro : t.contact.form.mailtoNotice}</p>}>
      <section className="cw__form" aria-labelledby="contact-form-title">
        <h3 id="contact-form-title" className="sr-only">
          {t.contact.form.title}
        </h3>
        <Suspense fallback={<p className="cw__loading">{t.contact.loading}</p>}>
          <ContactForm {...(formId ? { formId } : {})} {...(subject ? { initialSubject: subject } : {})} />
        </Suspense>
      </section>
    </Sheet>
  )
}
