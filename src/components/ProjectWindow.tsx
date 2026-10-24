import type { Project } from '../data/types'
import { useLanguage } from '../i18n/LanguageProvider'
import { ArchitectureDiagram } from './ArchitectureDiagram'
import { TechChip } from './TechGlyph'
import { Window } from './Window'

interface Props {
  project: Project
  origin: DOMRect | null
  onClose: () => void
}

/** Fiche détaillée d'un projet : contexte, rôle, défi, approche, architecture, technologies, limites. */
export function ProjectWindow({ project, origin, onClose }: Props) {
  const { pick, t } = useLanguage()
  const { detail } = project
  const title = pick(project.title)
  const titleId = `${project.id}-window-title`
  const section = (key: string) => `${project.id}-${key}`

  return (
    <Window labelledBy={titleId} title={title} origin={origin} onClose={onClose}>
      <header className="pw__head">
        <p className="pw__context">{pick(project.context)}</p>
        <h2 id={titleId} className="pw__title" tabIndex={-1}>
          {title}
        </h2>
        <p className="pw__summary">{pick(project.summary)}</p>
        <span className={`badge badge--${project.maturity.kind}`}>{pick(project.maturity.label)}</span>
      </header>

      <div className="pw__grid">
        <section className="pw__section" aria-labelledby={section('context')}>
          <h3 id={section('context')}>{t.window.context}</h3>
          {pick(detail.context).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>

        <section className="pw__section" aria-labelledby={section('role')}>
          <h3 id={section('role')}>{t.window.role}</h3>
          <ul className="pw__list">
            {pick(detail.role).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        {detail.challenge && (
          <section className="pw__section pw__challenge" aria-labelledby={section('challenge')}>
            <h3 id={section('challenge')}>{t.window.challenge}</h3>
            <p>{pick(detail.challenge)}</p>
          </section>
        )}

        {detail.approach && (
          <section className="pw__section" aria-labelledby={section('approach')}>
            <h3 id={section('approach')}>{t.window.approach}</h3>
            {pick(detail.approach).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
        )}

        {detail.practices && (
          <section className="pw__section" aria-labelledby={section('practices')}>
            <h3 id={section('practices')}>{t.window.practices}</h3>
            <ul className="pw__list">
              {pick(detail.practices).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <ArchitectureDiagram spec={detail.diagram} id={project.id} />

      <section className="pw__section pw__tech" aria-labelledby={section('tech')}>
        <h3 id={section('tech')}>{t.window.technologies}</h3>
        <div className="pw__tech-groups">
          {detail.tech.map((group, index) => (
            <div key={pick(group.title)} className="pw__tech-group">
              <p className="pw__tech-title" id={section(`tech-${index}`)}>
                {pick(group.title)}
              </p>
              <ul className="chips" aria-labelledby={section(`tech-${index}`)}>
                {group.items.map((id) => (
                  <TechChip key={id} id={id} />
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {detail.limits && (
        <aside className="pw__limits" aria-labelledby={section('limits')}>
          <h3 id={section('limits')}>{t.window.limits}</h3>
          <ul className="pw__list">
            {pick(detail.limits).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </aside>
      )}
    </Window>
  )
}
