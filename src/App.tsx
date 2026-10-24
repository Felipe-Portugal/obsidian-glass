import { useState } from 'react'
import { ContactWindow } from './components/ContactWindow'
import { Dock } from './components/Dock'
import { ProjectWindow } from './components/ProjectWindow'
import { TopBar } from './components/TopBar'
import { projects } from './data/projects'
import type { Project } from './data/types'
import { useLanguage } from './i18n/LanguageProvider'
import { Experience } from './sections/Experience'
import { Hero } from './sections/Hero'
import { Projects } from './sections/Projects'
import { SkillsAndEducation } from './sections/SkillsAndEducation'
import './styles/layout.css'

const YEAR = new Date().getFullYear()

type ActiveWindow =
  | { kind: 'project'; id: Project['id']; origin: DOMRect | null }
  | { kind: 'contact'; origin: DOMRect | null; subject?: string }
  | null

export function App() {
  const { t } = useLanguage()
  const [active, setActive] = useState<ActiveWindow>(null)
  const close = () => setActive(null)
  const project = active?.kind === 'project' ? projects.find((item) => item.id === active.id) : undefined

  return (
    <div className="app">
      <a className="skip-link" href="#contenu">
        {t.a11y.skip}
      </a>
      <div id="top" tabIndex={-1} className="anchor" />
      <div className="page">
        <TopBar />
        <main id="contenu" tabIndex={-1}>
          <Hero />
          <Projects onOpen={(id, origin) => setActive({ kind: 'project', id, origin })} />
          <Experience />
          <SkillsAndEducation />
        </main>
        <footer className="footer">
          <p>© {YEAR} Felipe Portugal</p>
          <p>{t.footer.built}</p>
        </footer>
      </div>

      <Dock
        onContact={(origin, subject) =>
          setActive({ kind: 'contact', origin, ...(subject ? { subject } : {}) })
        }
      />

      {project && active?.kind === 'project' && (
        <ProjectWindow key={project.id} project={project} origin={active.origin} onClose={close} />
      )}
      {active?.kind === 'contact' && (
        <ContactWindow origin={active.origin} onClose={close} {...(active.subject ? { subject: active.subject } : {})} />
      )}
    </div>
  )
}
