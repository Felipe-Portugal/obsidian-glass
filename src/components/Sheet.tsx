import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { animate } from 'motion/mini'
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { Drawer } from 'vaul'
import { useLanguage } from '../i18n/LanguageProvider'
import { prefersReducedMotion } from '../lib/storage'
import { COMPACT_QUERY, useMediaQuery } from '../lib/useMediaQuery'
import './window.css'

interface SheetProps {
  /** Titre de la fenêtre : il la nomme et revient dans la barre une fois défilé. */
  title: string
  /** Sous le titre : résumé, maturité, contexte. */
  header?: ReactNode
  onClose: () => void
  /** Élément qui reprend le focus à la fermeture. */
  source?: HTMLElement | null
  /** Projet dont la fenêtre prend la lumière. */
  tone?: string
  /** Largeur de la fenêtre ; le contenu défile à hauteur constante. */
  size?: 'md' | 'lg' | 'contact'
  children: ReactNode
}

// La fenêtre apparaît à sa taille finale ; le mouvement reste lié à l'élément qui l'a ouverte.
const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]
const OPEN = { duration: 0.28, ease: EASE }
const CLOSE = { duration: 0.2, ease: EASE }
const IDENTITY = 'translate(0px, 0px)'

function sourceOffset(source: HTMLElement | null | undefined, sheet: HTMLElement) {
  const origin = source?.isConnected ? source.getBoundingClientRect() : null
  const target = sheet.getBoundingClientRect()
  if (!origin || origin.right < 0 || origin.left > window.innerWidth || origin.bottom < 0 || origin.top > window.innerHeight) {
    return 'translate(0px, 16px)'
  }
  const x = Math.max(-20, Math.min(20, (origin.left + origin.width / 2 - target.left - target.width / 2) * 0.08))
  const y = Math.max(-20, Math.min(20, (origin.top + origin.height / 2 - target.top - target.height / 2) * 0.08))
  return `translate(${x}px, ${y}px)`
}

/**
 * Fenêtre de détail. Grand écran : un dialogue Radix (focus piégé puis rendu, Échap, clic à
 * l'extérieur, défilement bloqué) qui apparaît à taille constante. Mobile : une
 * feuille Vaul qui monte du bas et se referme d'un glissement.
 */
export function Sheet(props: SheetProps) {
  const compact = useMediaQuery(COMPACT_QUERY)
  return compact ? <MobileSheet {...props} /> : <DesktopSheet {...props} />
}

/**
 * Le déclencheur, mémorisé à l'ouverture, reprend le focus à la fermeture. Radix le retrouve
 * seul, mais le double montage de StrictMode lui fait retenir le titre de la fenêtre à la place.
 * Si rien n'avait le focus (un clic ne le donne pas partout), il revient au bouton de la source.
 */
function useReturnFocus(source: HTMLElement | null | undefined) {
  const [opener] = useState(() => {
    const focused = document.activeElement
    if (focused instanceof HTMLElement && focused !== document.body) return focused
    return source?.matches('button, a') ? source : (source?.querySelector<HTMLElement>('[aria-haspopup="dialog"]') ?? null)
  })
  return (event: Event) => {
    event.preventDefault()
    if (opener?.isConnected) opener.focus({ preventScroll: true })
  }
}

function CloseButton({ title, Close }: { title: string; Close: typeof Dialog.Close }) {
  const { t } = useLanguage()
  return (
    <Close className="window__close glass" aria-label={t.window.closeNamed(title)}>
      <X aria-hidden="true" size={18} strokeWidth={2} />
    </Close>
  )
}

function MobileSheet({ title, header, onClose, source, tone, children }: SheetProps) {
  const [open, setOpen] = useState(true)
  const returnFocus = useReturnFocus(source)
  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  })

  // Démontée par le parent une fois l'animation de sortie finie ; un délai de secours au cas où.
  useEffect(() => {
    if (open) return
    const timer = window.setTimeout(() => onCloseRef.current(), prefersReducedMotion() ? 0 : 450)
    return () => window.clearTimeout(timer)
  }, [open])

  return (
    <Drawer.Root open={open} onOpenChange={setOpen} onAnimationEnd={(isOpen) => !isOpen && onCloseRef.current()}>
      <Drawer.Portal>
        <Drawer.Overlay className="drawer-overlay" />
        <Drawer.Content
          className="drawer drawer--sheet"
          data-project={tone}
          aria-describedby={undefined}
          onCloseAutoFocus={returnFocus}
        >
          <Drawer.Handle className="drawer__handle" />
          <div className="drawer__bar">
            <CloseButton title={title} Close={Drawer.Close} />
          </div>
          <div className="drawer__body">
            <header className="sheet__head">
              <Drawer.Title className="sheet__title">{title}</Drawer.Title>
              {header}
            </header>
            {children}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}

function DesktopSheet({ title, header, onClose, source, tone, size = 'lg', children }: SheetProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const windowRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const onCloseRef = useRef(onClose)
  const sourceRef = useRef(source)
  const closing = useRef(false)
  const [barTitle, setBarTitle] = useState(false)
  const returnFocus = useReturnFocus(source)

  useEffect(() => {
    onCloseRef.current = onClose
    sourceRef.current = source
  })

  // Plus d'animation ni de style en ligne : la mise en page reprend la main.
  const settle = useCallback(() => {
    const el = windowRef.current
    if (!el) return
    el.getAnimations?.().forEach((animation) => animation.cancel())
    el.style.removeProperty('transform')
    el.style.removeProperty('opacity')
  }, [])

  // Ouverture : toute la fenêtre suit une seule trajectoire. Le contenu Radix
  // est rendu dans un portail au second passage : on attend qu'il soit là.
  const opened = useRef(false)
  const onContentMount = useCallback(() => {
    if (opened.current) return
    opened.current = true
    const sheet = windowRef.current
    const still = prefersReducedMotion()
    const land = () => {
      if (closing.current) return
      settle()
    }
    if (sheet && !still) {
      sheet.style.opacity = '0'
      animate(sheet, { opacity: [0, 1], transform: [sourceOffset(sourceRef.current, sheet), IDENTITY] }, OPEN).then(land)
    } else {
      land()
    }
  }, [settle])

  const requestClose = useCallback(() => {
    if (closing.current) return
    closing.current = true
    const sheet = windowRef.current
    if (prefersReducedMotion() || !sheet) {
      onCloseRef.current()
      return
    }
    let finished = false
    const finish = () => {
      if (finished) return
      finished = true
      onCloseRef.current()
    }
    window.setTimeout(finish, 400)
    const now = getComputedStyle(sheet)
    const from = now.transform === 'none' ? IDENTITY : now.transform
    const shown = Number(now.opacity)
    settle()
    if (overlayRef.current) animate(overlayRef.current, { opacity: [1, 0] }, { duration: 0.18, ease: EASE })
    animate(sheet, { opacity: [shown, 0], transform: [from, sourceOffset(sourceRef.current, sheet)] }, CLOSE).then(finish)
  }, [settle])

  // Le titre revient dans la barre quand le titre principal sort de la vue.
  useLayoutEffect(() => {
    const frame = frameRef.current
    const heading = titleRef.current
    if (!frame || !heading || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(([entry]) => setBarTitle(entry ? !entry.isIntersecting : false), {
      root: frame,
      rootMargin: '-64px 0px 0px 0px',
    })
    observer.observe(heading)
    return () => observer.disconnect()
  })

  return (
    <Dialog.Root open onOpenChange={(open) => !open && requestClose()}>
      <Dialog.Portal>
        <Dialog.Overlay ref={overlayRef} className="window-overlay" />
        <Dialog.Content
          className={`window window--${size}`}
          data-project={tone}
          aria-describedby={undefined}
          onOpenAutoFocus={(event) => {
            event.preventDefault()
            titleRef.current?.focus({ preventScroll: true })
          }}
          onCloseAutoFocus={returnFocus}
          ref={(element) => {
            windowRef.current = element
            if (element) onContentMount()
          }}
        >
          <div className="window__paper" aria-hidden="true" />
          <div className="window__frame" ref={frameRef}>
            <div className="window__bar" data-scrolled={barTitle}>
              <span className="window__bar-title" aria-hidden="true">
                {title}
              </span>
              <CloseButton title={title} Close={Dialog.Close} />
            </div>
            <div className="window__body">
              <header className="sheet__head">
                <Dialog.Title ref={titleRef} className="sheet__title" tabIndex={-1}>
                  {title}
                </Dialog.Title>
                {header}
              </header>
              {children}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
