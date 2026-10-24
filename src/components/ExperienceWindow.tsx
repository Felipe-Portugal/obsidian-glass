import * as Tabs from '@radix-ui/react-tabs'
import { useState } from 'react'
import type { ExperienceEntry } from '../data/types'
import { useLanguage } from '../i18n/LanguageProvider'
import { Sheet } from './Sheet'
import { TechChip } from './TechGlyph'

interface Props {
  entry: ExperienceEntry
  /** Rangée de la période : la fenêtre en naît et s'y repose. */
  source: HTMLElement | null
  onClose: () => void
}

type Tab = 'work' | 'tech'

/**
 * Période d'expérience, dans la structure des études de cas : le rôle en titre, les périodes en
 * frise, puis deux onglets (réalisations, technologies). Les panneaux sont superposés et gardent
 * la hauteur du plus long : la fenêtre ne saute pas d'un onglet à l'autre.
 */
export function ExperienceWindow({ entry, source, onClose }: Props) {
  const { pick, t } = useLanguage()
  const [tab, setTab] = useState<Tab>('work')
  const title = pick(entry.roles[0]?.title ?? { fr: '', en: '' })
  const techId = `${entry.id}-tech-intro`

  return (
    <Sheet
      title={title}
      source={source}
      size="md"
      onClose={onClose}
      header={
        <>
          {entry.note && <p className="pw__summary">{pick(entry.note)}</p>}
          <ul className="xw__timeline">
            {entry.roles.map((role, index) => (
              <li key={pick(role.title)} className="xw__stage" data-current={index === 0 || undefined}>
                <span className="xw__period">{pick(role.period)}</span>
                <span className="pw__context">{index === 0 ? t.experience.org : pick(role.title)}</span>
              </li>
            ))}
          </ul>
        </>
      }
    >
      <Tabs.Root className="tabs" value={tab} onValueChange={(value) => setTab(value as Tab)}>
        <Tabs.List className="tabs__list" aria-label={t.experience.tabs.label}>
          <Tabs.Trigger className="tabs__tab" value="work">
            {t.experience.tabs.work}
          </Tabs.Trigger>
          <Tabs.Trigger className="tabs__tab" value="tech">
            {t.experience.tabs.tech}
          </Tabs.Trigger>
        </Tabs.List>

        <div className="tabs__stack">
          <Tabs.Content className="tabs__panel" value="work" forceMount inert={tab !== 'work'}>
            <ul className="pw__list xw__points">
              {pick(entry.points).map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </Tabs.Content>

          <Tabs.Content className="tabs__panel" value="tech" forceMount inert={tab !== 'tech'}>
            <div className="pw__tech-group">
              <p className="pw__tech-title" id={techId}>
                {t.experience.techIntro}
              </p>
              <ul className="chips" aria-labelledby={techId}>
                {entry.tech.map((id) => (
                  <TechChip key={id} id={id} />
                ))}
              </ul>
            </div>
          </Tabs.Content>
        </div>
      </Tabs.Root>
    </Sheet>
  )
}
