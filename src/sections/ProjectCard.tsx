import { ArrowUpRight } from 'lucide-react'
import { useRef } from 'react'
import type { Project } from '../data/types'
import { useLanguage } from '../i18n/LanguageProvider'
import { TechToolbar } from '../components/ui/TechToolbar'
import './project.css'

interface Props {
  project: Project
  /** L'étude de cas de cette tuile est ouverte. */
  lifted: boolean
  onOpen: (tile: HTMLElement) => void
}

/**
 * Tuile de projet : le titre, le besoin, la contribution, les logos des technologies et la
 * maturité. Toute la tuile ouvre l'étude de cas (bouton étiré, premier arrêt du clavier) ; la
 * rangée de logos reste au-dessus pour garder ses infobulles au survol, au focus et au toucher.
 */
export function ProjectCard({ project, lifted, onOpen }: Props) {
  const { pick, t } = useLanguage()
  const tileRef = useRef<HTMLElement>(null)
  const title = pick(project.title)
  const titleId = `${project.id}-card-title`

  return (
    <article
      ref={tileRef}
      className="plate tile project"
      data-project={project.id}
      aria-labelledby={titleId}
    >
      <div className="project__top">
        <h3 id={titleId} className="project__title">
          {title}
        </h3>
        <span className="project__arrow" aria-hidden="true">
          <ArrowUpRight size={18} strokeWidth={1.75} />
        </span>
      </div>
      <button
        type="button"
        className="project__open"
        aria-haspopup="dialog"
        aria-expanded={lifted}
        onClick={() => {
          if (tileRef.current) onOpen(tileRef.current)
        }}
      >
        <span className="sr-only">
          {t.projects.open}&nbsp;: {title}
        </span>
      </button>
      <p className="project__summary">{pick(project.summary)}</p>
      <p className="project__contribution">
        <span className="project__label">{t.projects.contribution}</span>
        {pick(project.contribution)}
      </p>
      <p className="project__result">
        <span className="project__label">{t.projects.result}</span>
        {pick(project.result)}
      </p>
      <TechToolbar ids={project.cardTech} label={`${t.projects.techLabel}, ${title}`} size="sm" />
      <p className="project__meta">
        <span className={`maturity maturity--${project.maturity.kind}`}>{pick(project.maturity.label)}</span>
        <span className="project__context">{pick(project.context)}</span>
      </p>
    </article>
  )
}
