import { lazy, Suspense, useEffect, useEffectEvent, useRef, useState } from 'react'
import type { AboutWindow } from './components/windows/AboutWindow'
import { ContactWindow } from './components/windows/ContactWindow'
import { Dock } from './components/shell/Dock'
import type { EducationWindow, ExperienceWindow } from './components/windows/ExperienceWindow'
import type { ProjectWindow } from './components/windows/ProjectWindow'
import { TipProvider } from './components/ui/Tip'
import { TopBar } from './components/shell/TopBar'
import { notify, onFirstNotify } from './lib/notify'
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
import { Skills } from './sections/Skills'
import { Timeline } from './sections/Timeline'
import { useTheme } from './theme/ThemeProvider'
import './styles/layout.css'

const YEAR = new Date().getFullYear()

interface Windows {
  ProjectWindow: typeof ProjectWindow
  ExperienceWindow: typeof ExperienceWindow
  EducationWindow: typeof EducationWindow
  AboutWindow: typeof AboutWindow
}

// Les confirmations (« Adresse copiée ») et leur bibliothèque ne se chargent qu'à la première.
const Notifications = lazy(() => import('./components/shell/Notifications'))

let windowsLoad: Promise<Windows> | undefined

/**
 * Les études de cas et le portrait sont chargés à part, dès que la page est au repos.
 * Le contact reste dans le code initial pour s'ouvrir sans attente au premier clic.
 */
function loadWindows() {
  windowsLoad ??= Promise.all([
    import('./components/windows/ProjectWindow'),
    import('./components/windows/ExperienceWindow'),
    import('./components/windows/AboutWindow'),
  ]).then(
    ([project, period, about]) => ({
      ProjectWindow: project.ProjectWindow,
      ExperienceWindow: period.ExperienceWindow,
      EducationWindow: period.EducationWindow,
      AboutWindow: about.AboutWindow,
    }),
    (error: unknown) => {
      windowsLoad = undefined
      throw error
    },
  )
  return windowsLoad
}

const projectHash = (id: Project['id']) => `#projet-${id}`
const projectFromHash = () => projects.find((item) => window.location.hash === projectHash(item.id))?.id

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
  const openRequest = useRef(0)
  const glowRef = usePointerGlowWithin<HTMLDivElement>('.plate')
  const close = () => {
    openRequest.current += 1
    setActive(null)
    // L'adresse de l'étude de cas s'efface : retour arrière si l'ouverture l'avait ajoutée.
    if (!projectFromHash()) return
    if ((window.history.state as { caseStudy?: boolean } | null)?.caseStudy) window.history.back()
    else window.history.replaceState(null, '', window.location.pathname + window.location.search)
  }
  const project = active?.kind === 'project' ? projects.find((item) => item.id === active.id) : undefined
  const period = active?.kind === 'experience' ? experience.find((item) => item.id === active.id) : undefined
  const program = active?.kind === 'education' ? education.find((item) => item.id === active.id) : undefined

  const openWindow = (next: NonNullable<ActiveWindow>) => {
    const request = ++openRequest.current
    if (next.kind === 'project' && window.location.hash !== projectHash(next.id)) {
      window.history.pushState({ caseStudy: true }, '', projectHash(next.id))
    }
    if (next.kind === 'contact') {
      setActive(next)
      return
    }
    if (windows) {
      setActive(next)
      return
    }
    loadWindows().then(
      (loaded) => {
        setWindows(loaded)
        if (request === openRequest.current) setActive(next)
      },
      // Paquet des fenêtres introuvable (réseau coupé, déploiement en cours) : on le dit.
      () => notify(t.window.loadFailed),
    )
  }

  useEffect(() => onFirstNotify(() => setNotifications(true)), [])

  // Chaque étude de cas a son adresse (#projet-spot…) : lien direct, Retour et Avance du navigateur.
  // Événements d'effet : ils lisent toujours la dernière version d'openWindow sans réabonner l'écouteur.
  const openFromHash = useEffectEvent((id: Project['id']) => {
    openWindow({ kind: 'project', id, card: document.querySelector<HTMLElement>(`.project[data-project="${id}"]`) })
  })
  const syncWithHash = useEffectEvent(() => {
    const id = projectFromHash()
    if (id) openFromHash(id)
    else setActive((current) => (current?.kind === 'project' ? null : current))
  })
  useEffect(() => {
    // Arrivée directe sur l'adresse d'une étude de cas : la fenêtre suit l'adresse, un système externe.
    const id = projectFromHash()
    // oxlint-disable-next-line react/set-state-in-effect
    if (id) openFromHash(id)
    const onPopState = () => syncWithHash()
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

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
        {active?.kind === 'contact' && (
          <ContactWindow
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
