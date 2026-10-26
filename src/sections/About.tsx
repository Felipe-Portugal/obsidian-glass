import { ArrowUpRight } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageProvider'

interface Props {
  open: boolean
  onOpen: (source: HTMLElement) => void
}

/** Une invitation courte à découvrir la personne derrière les projets. */
export function About({ open, onOpen }: Props) {
  const { t } = useLanguage()

  return (
    <section className="plate tile tile--about" data-tone="about" id="a-propos" aria-labelledby="about-title">
      <div className="about__copy">
        <h2 id="about-title" className="tile__label">{t.about.title}</h2>
        <p className="about__lead">{t.about.preview}</p>
      </div>
      <button
        type="button"
        className="button button--quiet about__open"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={(event) => onOpen(event.currentTarget)}
      >
        {t.about.open}
        <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.75} />
      </button>
    </section>
  )
}
