import { useLanguage } from '../i18n/LanguageProvider'
import { Sheet } from './Sheet'
import './about.css'

interface Props {
  onClose: () => void
  source: HTMLElement | null
}

export function AboutWindow({ onClose, source }: Props) {
  const { t } = useLanguage()
  const sections = [
    { id: 'path', title: t.about.path, text: t.about.pathText },
    { id: 'university', title: t.about.university, text: t.about.universityText },
    { id: 'team', title: t.about.team, text: t.about.teamText },
    { id: 'passions', title: t.about.passions, text: t.about.passionsText },
    { id: 'interests', title: t.about.interests, text: t.about.interestsText },
  ]

  return (
    <Sheet
      title={t.about.title}
      size="md"
      tone="about"
      source={source}
      onClose={onClose}
      header={<p className="about-window__intro">{t.about.intro}</p>}
    >
      <div className="about-window">
        {sections.map(({ id, title, text }) => (
          <section className="about-window__section" key={id}>
            <h3>{title}</h3>
            <p>{text}</p>
          </section>
        ))}
      </div>
    </Sheet>
  )
}
