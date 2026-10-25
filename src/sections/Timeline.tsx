import { ChevronRight } from 'lucide-react'
import type { CSSProperties } from 'react'
import { experience } from '../data/experience'
import { education } from '../data/skills'
import { timeline, type TimelineStep } from '../data/timeline'
import { useLanguage } from '../i18n/LanguageProvider'
import { useMediaQuery } from '../lib/useMediaQuery'

/** Assez de largeur pour la frise horizontale ; en deçà, le rail vertical. */
const WIDE_QUERY = '(min-width: 861px)'

interface Props {
  /** Étape dont la fenêtre est ouverte : elle est née de son élément. */
  open: { kind: TimelineStep['kind']; id: string } | null
  onOpen: (kind: TimelineStep['kind'], id: string, item: HTMLElement) => void
}

/**
 * Parcours : expérience et formation sur une même ligne du temps. Grand écran : une frise
 * horizontale, de la plus ancienne étape à gauche à la plus récente à droite, l'expérience
 * au-dessus du rail et la formation en dessous. Mobile : un rail vertical à gauche, la plus
 * récente en haut. L'ordre du document suit l'ordre affiché, au clavier comme à la lecture.
 * Chaque étape ouvre sa fenêtre de détail.
 */
export function Timeline({ open, onOpen }: Props) {
  const { pick, t } = useLanguage()
  const wide = useMediaQuery(WIDE_QUERY)
  const steps = wide ? [...timeline].reverse() : timeline

  return (
    <section className="plate tile tile--path" data-tone="xp" id="parcours" aria-labelledby="path-title">
      <div className="tile__head">
        <h2 id="path-title" className="tile__label">
          {t.timeline.title}
        </h2>
        <p className="path__legend" aria-hidden="true">
          <span className="path__key path__key--experience">{t.timeline.lanes.experience}</span>
          <span className="path__key path__key--education">{t.timeline.lanes.education}</span>
        </p>
      </div>

      <ol className="path" style={{ '--tracks': steps.length + 1 } as CSSProperties}>
        {steps.map((step, index) => {
          const newYear = steps[index - 1]?.year !== step.year
          const lane = t.timeline.lanes[step.kind]
          let title = ''
          let sub = ''
          const periods: string[] = []
          if (step.kind === 'experience') {
            const entry = experience.find((item) => item.id === step.id)
            if (!entry) return null
            title = pick(entry.roles[0]?.title ?? { fr: '', en: '' })
            sub = t.experience.org
            periods.push(...entry.roles.map((role) => pick(role.period)))
          } else {
            const entry = education.find((item) => item.id === step.id)
            if (!entry) return null
            title = pick(entry.degree)
            sub = pick(entry.school)
            periods.push(pick(entry.period))
          }
          const isOpen = open?.kind === step.kind && open.id === step.id

          return (
            <li
              key={`${step.kind}-${step.id}`}
              className={`path__step path__step--${step.kind}`}
              style={{ '--at': index + 1 } as CSSProperties}
            >
              {newYear ? (
                <span className="path__year" aria-hidden="true">
                  {step.year}
                </span>
              ) : (
                <span className="path__dot" aria-hidden="true" />
              )}
              <button
                type="button"
                className="path__item"
                aria-haspopup="dialog"
                aria-expanded={isOpen}
                onClick={(event) => onOpen(step.kind, step.id, event.currentTarget)}
              >
                <span className="path__lane">{lane}</span>
                <span className="path__title">{title}</span>
                <span className="path__sub">{sub}</span>
                <span className="path__period">{periods.join(' · ')}</span>
                <ChevronRight className="path__chevron" aria-hidden="true" size={18} strokeWidth={1.75} />
              </button>
            </li>
          )
        })}
      </ol>
      <p className="tile__foot">{t.timeline.hint}</p>
    </section>
  )
}
