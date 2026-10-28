import * as Tabs from '@radix-ui/react-tabs'
import type { ReactNode } from 'react'
import type { Project } from '../../data/types'
import { useLanguage } from '../../i18n/LanguageProvider'
import { ArchitectureDiagram } from './ArchitectureDiagram'
import { Sheet } from './Sheet'
import { TechChip } from '../ui/TechGlyph'

interface Props {
  project: Project
  /** Tuile du projet : l'étude de cas en naît et s'y repose. */
  card: HTMLElement | null
  onClose: () => void
}

function Part({ id, title, className, children }: { id: string; title: string; className?: string; children: ReactNode }) {
  return (
    <section className={`pw__section${className ? ` ${className}` : ''}`} aria-labelledby={id}>
      <h3 id={id}>{title}</h3>
      {children}
    </section>
  )
}

function List({ items }: { items: readonly string[] }) {
  return (
    <ul className="pw__list">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}

/**
 * Étude de cas en trois onglets : la contribution et le défi d'abord, puis l'architecture, puis
 * le contexte, la méthode, les technologies et les limites. La fenêtre garde sa hauteur d'un
 * onglet à l'autre.
 */
export function ProjectWindow({ project, card, onClose }: Props) {
  const { pick, t } = useLanguage()
  const { detail } = project
  const title = pick(project.title)
  const section = (key: string) => `${project.id}-${key}`

  return (
    <Sheet
      title={title}
      source={card}
      tone={project.id}
      onClose={onClose}
      header={
        <>
          <p className="pw__summary">{pick(project.summary)}</p>
          <p className="pw__meta">
            <span className={`maturity maturity--${project.maturity.kind}`}>{pick(project.maturity.label)}</span>
            <span className="pw__context">{pick(project.context)}</span>
          </p>
        </>
      }
    >
      <Tabs.Root className="tabs" defaultValue="contribution">
        <Tabs.List className="tabs__list" aria-label={t.window.tabs.label}>
          <Tabs.Trigger className="tabs__tab" value="contribution">
            {t.window.tabs.contribution}
          </Tabs.Trigger>
          <Tabs.Trigger className="tabs__tab" value="architecture">
            {t.window.tabs.architecture}
          </Tabs.Trigger>
          <Tabs.Trigger className="tabs__tab" value="details">
            {t.window.tabs.details}
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content className="tabs__panel" value="contribution">
          <Part id={section('result')} title={t.projects.result} className="pw__result">
            <p>{pick(project.result)}</p>
          </Part>
          <Part id={section('role')} title={t.window.role}>
            <List items={pick(detail.role)} />
          </Part>
          {detail.challenge && (
            <Part id={section('challenge')} title={t.window.challenge} className="pw__challenge">
              <p>{pick(detail.challenge)}</p>
            </Part>
          )}
          {detail.approach && (
            <Part id={section('approach')} title={t.window.approach}>
              {pick(detail.approach).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </Part>
          )}
        </Tabs.Content>

        <Tabs.Content className="tabs__panel" value="architecture">
          <ArchitectureDiagram spec={detail.diagram} id={project.id} />
        </Tabs.Content>

        <Tabs.Content className="tabs__panel" value="details">
          <Part id={section('context')} title={t.window.context}>
            {pick(detail.context).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </Part>
          {detail.practices && (
            <Part id={section('practices')} title={t.window.practices}>
              <List items={pick(detail.practices)} />
            </Part>
          )}
          <Part id={section('tech')} title={t.window.technologies}>
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
          </Part>
          {detail.limits && (
            <Part id={section('limits')} title={t.window.limits} className="pw__limits">
              <List items={pick(detail.limits)} />
            </Part>
          )}
        </Tabs.Content>
      </Tabs.Root>
    </Sheet>
  )
}
