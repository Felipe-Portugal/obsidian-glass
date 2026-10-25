import { useEffect, useState } from 'react'
import { Toaster } from 'sonner'
import type { ContactWindow } from './components/ContactWindow'
import { Dock } from './components/Dock'
import type { ExperienceWindow } from './components/ExperienceWindow'
import type { ProjectWindow } from './components/ProjectWindow'
import { TipProvider } from './components/Tip'
import { TopBar } from './components/TopBar'
import { usePointerGlowWithin } from './lib/usePointerGlow'
import { experience } from './data/experience'
import { projects } from './data/projects'
import type { Project } from './data/types'
import { useLanguage } from './i18n/LanguageProvider'
import { Contact } from './sections/Contact'
import { Experience } from './sections/Experience'
import { Hero } from './sections/Hero'
import { Projects } from './sections/Projects'
import { Education, Skills } from './sections/SkillsAndEducation'
import { useTheme } from './theme/ThemeProvider'
import './styles/layout.css'

const YEAR = new Date().getFullYear()

interface Windows {
  ProjectWindow: typeof ProjectWindow
  ExperienceWindow: typeof ExperienceWindow
  ContactWindow: typeof ContactWindow
}

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
  ]).then(
    ([project, period, contact]) => ({
      ProjectWindow: project.ProjectWindow,
      ExperienceWindow: period.ExperienceWindow,
      ContactWindow: contact.ContactWindow,
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
  | { kind: 'experience'; id: string; source: HTMLElement | null }
  | { kind: 'contact'; source: HTMLElement | null; subject?: string }
  | null

/**
 * Une page compacte : un en-tête court, puis une grille de tuiles (projets, expérience,
 * formation, compétences, contact). Le détail s'ouvre à la demande, toujours dans la même
 * structure de fenêtre (études de cas, périodes d'expérience, contact), en feuille du bas sur mobile.
 */
export function App() {
  const { t } = useLanguage()
  const { resolved } = useTheme()
  const [active, setActive] = useState<ActiveWindow>(null)
  const [windows, setWindows] = useState<Windows | null>(null)
  const glowRef = usePointerGlowWithin<HTMLDivElement>('.plate')
  const close = () => setActive(null)
  const project = active?.kind === 'project' ? projects.find((item) => item.id === active.id) : undefined
  const period = active?.kind === 'experience' ? experience.find((item) => item.id === active.id) : undefined

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
            <Hero onContact={(source) => openWindow({ kind: 'contact', source })} />
            <div className="bento" ref={glowRef}>
              <Projects
                open={active?.kind === 'project' ? active.id : null}
                onOpen={(id, card) => openWindow({ kind: 'project', id, card })}
              />
              <Experience
                open={active?.kind === 'experience' ? active.id : null}
                onOpen={(id, row) => openWindow({ kind: 'experience', id, source: row })}
              />
              <Education />
              <Skills />
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
        {windows && active?.kind === 'contact' && (
          <windows.ContactWindow
            source={active.source}
            onClose={close}
            {...(active.subject ? { subject: active.subject } : {})}
          />
        )}

        <Toaster
          theme={resolved}
          position="bottom-center"
          offset={96}
          mobileOffset={{ bottom: 104 }}
          duration={2400}
          toastOptions={{ unstyled: true, classNames: { toast: 'toast glass' } }}
        />
      </div>
    </TipProvider>
  )
}
