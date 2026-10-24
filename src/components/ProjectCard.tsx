import { ArrowUpRight } from 'lucide-react'
import { useRef } from 'react'
import type { Project } from '../data/types'
import { useLanguage } from '../i18n/LanguageProvider'
import { usePointerGlow } from '../lib/usePointerGlow'
import { MiniDiagram } from './ArchitectureDiagram'
import { TechToolbar } from './TechToolbar'
import './project.css'

interface Props {
  project: Project
  onOpen: (origin: DOMRect) => void
}

/**
 * Vue compacte d'un projet. Toute la carte ouvre la fiche (bouton étiré) ; la rangée de
 * logos reste au-dessus pour garder ses infobulles au survol, au focus et au toucher.
 */
export function ProjectCard({ project, onOpen }: Props) {
  const { pick, t } = useLanguage()
  const cardRef = useRef<HTMLElement>(null)
  const glowRef = usePointerGlow<HTMLElement>()
  const title = pick(project.title)
  const titleId = `${project.id}-card-title`

  return (
    <article
      ref={(element) => {
        cardRef.current = element
        glowRef(element)
      }}
      className={`card project project--${project.layout}`}
      aria-labelledby={titleId}
    >
      <div className="project__meta">
        <span className="project__context">{pick(project.context)}</span>
        <span className={`badge badge--${project.maturity.kind}`}>{pick(project.maturity.label)}</span>
      </div>

      <h3 id={titleId} className="project__title">
        {title}
      </h3>
      <p className="project__summary">{pick(project.summary)}</p>
      <p className="project__contribution">
        <span className="project__label">{t.projects.contribution}</span>
        <span>{pick(project.contribution)}</span>
      </p>

      <MiniDiagram spec={project.detail.diagram} orientation={project.layout === 'tall' ? 'column' : 'row'} />

      <div className="project__foot">
        <TechToolbar ids={project.cardTech} label={t.projects.techLabel(title)} size="sm" />
        <button
          type="button"
          className="project__open"
          aria-haspopup="dialog"
          onClick={() => {
            const rect = cardRef.current?.getBoundingClientRect()
            if (rect) onOpen(rect)
          }}
        >
          <span>{t.projects.open}</span>
          <span className="sr-only">: {title}</span>
          <ArrowUpRight aria-hidden="true" size={16} strokeWidth={2} />
        </button>
      </div>
    </article>
  )
}
