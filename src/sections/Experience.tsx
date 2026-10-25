import { ChevronRight } from 'lucide-react'
import { experience } from '../data/experience'
import { useLanguage } from '../i18n/LanguageProvider'

interface Props {
  /** Période dont la fenêtre est ouverte : elle est née de sa rangée. */
  open: string | null
  onOpen: (id: string, row: HTMLElement) => void
}

/** Tuile d'expérience : une rangée par période ; ses réalisations et technologies dans une fenêtre. */
export function Experience({ open, onOpen }: Props) {
  const { pick, t } = useLanguage()
  return (
    <section className="plate tile tile--xp" data-tone="xp" id="experience" aria-labelledby="experience-title">
      <div className="tile__head">
        <h2 id="experience-title" className="tile__label">
          {t.experience.title}
        </h2>
        <p className="tile__aside">{t.experience.org}</p>
      </div>
      <ol className="rows">
        {experience.map((entry) => (
          <li key={entry.id}>
            <button
              type="button"
              className="row"
              aria-haspopup="dialog"
              aria-expanded={open === entry.id}
              onClick={(event) => onOpen(entry.id, event.currentTarget)}
            >
              <span className="row__main">
                {entry.roles.map((role) => (
                  <span key={pick(role.title)} className="row__line">
                    <span className="row__title">{pick(role.title)}</span>
                    <span className="row__period">{pick(role.period)}</span>
                  </span>
                ))}
              </span>
              <ChevronRight className="row__chevron" aria-hidden="true" size={18} strokeWidth={1.75} />
            </button>
          </li>
        ))}
      </ol>
      <p className="tile__foot">{t.experience.hint}</p>
    </section>
  )
}
