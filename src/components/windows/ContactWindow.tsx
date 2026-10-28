import { useLanguage } from '../../i18n/LanguageProvider'
import { formspreeId } from '../../lib/contact'
import ContactForm from './ContactForm'
import { Sheet } from './Sheet'
import './contact.css'

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
        <ContactForm {...(formId ? { formId } : {})} {...(subject ? { initialSubject: subject } : {})} />
      </section>
    </Sheet>
  )
}
