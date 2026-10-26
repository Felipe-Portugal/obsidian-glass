import { lazy, Suspense, useEffect, useState } from 'react'
import type { AboutWindow } from './components/AboutWindow'
import type { ContactWindow } from './components/ContactWindow'
import { Dock } from './components/Dock'
import type { EducationWindow, ExperienceWindow } from './components/ExperienceWindow'
import type { ProjectWindow } from './components/ProjectWindow'
import { TipProvider } from './components/Tip'
import { TopBar } from './components/TopBar'
import { onFirstNotify } from './lib/notify'
import { usePointerGlowWithin } from './lib/usePointerGlow'
import { experience } from './data/experience'
import { projects } from './data/projects'
import { education } from './data/skills'
import type { Project } from './data/types'
import { useLanguage } from './i18n/LanguageProvider'
import { About } from './sections/About'
import { Contact } from './sections/Contact'
import { Hero } from './sections/Hero'
import { Projects } from './sections/Projects'
import { Skills } from './sections/SkillsAndEducation'
import { Timeline } from './sections/Timeline'
import { useTheme } from './theme/ThemeProvider'
import './styles/layout.css'

const YEAR = new Date().getFullYear()

interface Windows {
  ProjectWindow: typeof ProjectWindow
  ExperienceWindow: typeof ExperienceWindow
  EducationWindow: typeof EducationWindow
  ContactWindow: typeof ContactWindow
  AboutWindow: typeof AboutWindow
}

// Les confirmations (« Adresse copiée ») et leur bibliothèque ne se chargent qu'à la première.
const Notifications = lazy(() => import('./components/Notifications'))

let windowsLoad: Promise<Windows> | undefined

/**
 * Les fenêtres (onglets, schémas, formulaire) ne servent qu'à l'ouverture : chargées à part, dès
 * que la page est au repos. Une fenêtre demandée plus tôt s'ouvre une fois son code arrivé, sans
 * état intermédiaire où la tuile aurait déjà laissé sa place.
 */
function loadWindows() {
  windowsLoad ??= Promise.all([
    import('./components/ProjectWindow'),
    import('./components/ExperienceWindow'),
    import('./components/ContactWindow'),
    import('./components/AboutWindow'),
  ]).then(
    ([project, period, contact, about]) => ({
      ProjectWindow: project.ProjectWindow,
      ExperienceWindow: period.ExperienceWindow,
      EducationWindow: period.EducationWindow,
      ContactWindow: contact.ContactWindow,
      AboutWindow: about.AboutWindow,
    }),
    (error: unknown) => {
      windowsLoad = undefined
      throw error
    },
  )
  return windowsLoad
}

type ActiveWindow =
  | { kind: 'project'; id: Project['id']; card: HTMLElement | null }
  | { kind: 'experience' | 'education'; id: string; source: HTMLElement | null }
  | { kind: 'contact'; source: HTMLElement | null; subject?: string }
  | { kind: 'about'; source: HTMLElement | null }
  | null

/**
 * Une page compacte : un en-tête court, puis une grille de tuiles (projets, parcours,
 * compétences, à propos, contact). Le détail s'ouvre à la demande, toujours dans la même structure
 * de fenêtre (études de cas, étapes du parcours, portrait, contact), en feuille du bas sur mobile.
 */
export function App() {
  const { t } = useLanguage()
  const { resolved } = useTheme()
  const [active, setActive] = useState<ActiveWindow>(null)
  const [windows, setWindows] = useState<Windows | null>(null)
  const [notifications, setNotifications] = useState(false)
  const glowRef = usePointerGlowWithin<HTMLDivElement>('.plate')
  const close = () => setActive(null)
  const project = active?.kind === 'project' ? projects.find((item) => item.id === active.id) : undefined
  const period = active?.kind === 'experience' ? experience.find((item) => item.id === active.id) : undefined
  const program = active?.kind === 'education' ? education.find((item) => item.id === active.id) : undefined

  const openWindow = (next: NonNullable<ActiveWindow>) => {
    if (windows) {
      setActive(next)
      return
    }
    loadWindows().then(
      (loaded) => {
        setWindows(loaded)
        setActive(next)
      },
      () => undefined,
    )
  }

  useEffect(() => onFirstNotify(() => setNotifications(true)), [])

  useEffect(() => {
    const preload = () => void loadWindows().then(setWindows, () => undefined)
    if (typeof window.requestIdleCallback === 'function') {
      const handle = window.requestIdleCallback(preload, { timeout: 2500 })
      return () => window.cancelIdleCallback(handle)
    }
    const timer = window.setTimeout(preload, 1200)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <TipProvider delayDuration={350} skipDelayDuration={200}>
      <div className="app">
        <a className="skip-link" href="#contenu">
          {t.a11y.skip}
        </a>
        <div id="top" tabIndex={-1} className="anchor" />
        <div className="page">
          <TopBar />
          <main id="contenu" tabIndex={-1}>
            <Hero />
            <div className="bento" ref={glowRef}>
              <Projects
                open={active?.kind === 'project' ? active.id : null}
                onOpen={(id, card) => openWindow({ kind: 'project', id, card })}
              />
              <Timeline
                open={active?.kind === 'experience' || active?.kind === 'education' ? active : null}
                onOpen={(kind, id, item) => openWindow({ kind, id, source: item })}
              />
              <Skills />
              <About open={active?.kind === 'about'} onOpen={(source) => openWindow({ kind: 'about', source })} />
              <Contact onOpen={(source, subject) => openWindow({ kind: 'contact', source, ...(subject ? { subject } : {}) })} />
            </div>
          </main>
          <footer className="footer">
            <p>© {YEAR} Felipe Portugal</p>
            <p>{t.footer.built}</p>
          </footer>
        </div>

        <Dock
          onContact={(source, subject) => openWindow({ kind: 'contact', source, ...(subject ? { subject } : {}) })}
        />

        {windows && project && active?.kind === 'project' && (
          <windows.ProjectWindow key={project.id} project={project} card={active.card} onClose={close} />
        )}
        {windows && period && active?.kind === 'experience' && (
          <windows.ExperienceWindow key={period.id} entry={period} source={active.source} onClose={close} />
        )}
        {windows && program && active?.kind === 'education' && (
          <windows.EducationWindow key={program.id} entry={program} source={active.source} onClose={close} />
        )}
        {windows && active?.kind === 'contact' && (
          <windows.ContactWindow
            source={active.source}
            onClose={close}
            {...(active.subject ? { subject: active.subject } : {})}
          />
        )}
        {windows && active?.kind === 'about' && (
          <windows.AboutWindow source={active.source} onClose={close} />
        )}

        {notifications && (
          <Suspense fallback={null}>
            <Notifications theme={resolved} />
          </Suspense>
        )}
      </div>
    </TipProvider>
  )
}
