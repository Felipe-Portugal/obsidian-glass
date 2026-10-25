import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { spring } from 'motion'
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
  /** Élément d'où la fenêtre naît (une tuile, un bouton du dock) et où elle se repose. */
  source?: HTMLElement | null
  /** Projet dont la fenêtre prend la lumière. */
  tone?: string
  /** lg : hauteur fixe, le contenu défile à l'intérieur (les onglets ne font pas sauter la fenêtre). */
  size?: 'md' | 'lg'
  children: ReactNode
}

/** Un ressort à peine rebondi pour l'ouverture ; amorti et plus court pour le retour. */
const OPEN = { type: spring, stiffness: 320, damping: 32 }
const CLOSE = { type: spring, stiffness: 560, damping: 48 }
const FADE = { duration: 0.24, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }
const IDENTITY = 'translate(0px, 0px) scale(1, 1)'
const LOWERED = 'translate(0px, 10px) scale(1, 1)'

/** La transformation qui ramène le papier au rectangle de l'élément d'origine, coins compris. */
function onSource(source: HTMLElement, paper: HTMLElement) {
  const from = source.getBoundingClientRect()
  const to = paper.getBoundingClientRect()
  if (from.width < 1 || from.height < 1 || to.width < 1 || to.height < 1) return null
  const sx = from.width / to.width
  const sy = from.height / to.height
  const r = Math.min(parseFloat(getComputedStyle(source).borderTopLeftRadius) || 0, from.width / 2, from.height / 2)
  return {
    transform: `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${sx}, ${sy})`,
    borderRadius: `${r / sx}px / ${r / sy}px`,
  }
}

/**
 * Fenêtre de détail. Grand écran : un dialogue Radix (focus piégé puis rendu, Échap, clic à
 * l'extérieur, défilement bloqué) dont le papier naît de l'élément d'origine. Mobile : une
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
    const timer = window.setTimeout(() => onCloseRef.current(), prefersReducedMotion() ? 0 : 600)
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
  const paperRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const onCloseRef = useRef(onClose)
  const sourceRef = useRef(source)
  const closing = useRef(false)
  const [settled, setSettled] = useState(false)
  const [barTitle, setBarTitle] = useState(false)
  const returnFocus = useReturnFocus(source)

  useEffect(() => {
    onCloseRef.current = onClose
    sourceRef.current = source
  })

  // Plus d'animation ni de style en ligne : la mise en page reprend la main.
  const settle = useCallback(() => {
    for (const el of [paperRef.current, frameRef.current]) {
      if (!el) continue
      el.getAnimations?.().forEach((animation) => animation.cancel())
      el.style.removeProperty('transform')
      el.style.removeProperty('border-radius')
      el.style.removeProperty('opacity')
    }
  }, [])

  // Ouverture : le papier naît de son origine et le contenu paraît sur la fin. Le contenu Radix
  // est rendu dans un portail au second passage : on attend qu'il soit là.
  const opened = useRef(false)
  const onContentMount = useCallback(() => {
    if (opened.current) return
    opened.current = true
    const paper = paperRef.current
    const frame = frameRef.current
    const from = sourceRef.current
    const still = prefersReducedMotion()
    const land = () => {
      settle()
      setSettled(true)
    }
    const start = paper && frame && from?.isConnected && !still ? onSource(from, paper) : null
    if (paper && frame && start) {
      const sheet = getComputedStyle(paper).borderRadius
      frame.style.opacity = '0'
      animate(paper, { transform: [start.transform, IDENTITY], borderRadius: [start.borderRadius, sheet] }, OPEN).then(land)
      animate(frame, { opacity: [0, 1] }, { duration: 0.22, delay: 0.18, ease: 'easeOut' })
    } else if (paper && frame && !still) {
      for (const el of [paper, frame]) animate(el, { opacity: [0, 1], transform: [LOWERED, IDENTITY] }, FADE)
      window.setTimeout(land, FADE.duration * 1000)
    } else {
      land()
    }
  }, [settle])

  const requestClose = useCallback(() => {
    if (closing.current) return
    closing.current = true
    const paper = paperRef.current
    const frame = frameRef.current
    if (prefersReducedMotion() || !paper || !frame) {
      onCloseRef.current()
      return
    }
    let finished = false
    const finish = () => {
      if (finished) return
      finished = true
      onCloseRef.current()
    }
    window.setTimeout(finish, 900)
    setSettled(false)
    const now = getComputedStyle(paper)
    const from = { transform: now.transform === 'none' ? IDENTITY : now.transform, borderRadius: now.borderRadius }
    const shown = Number(getComputedStyle(frame).opacity)
    settle()
    const origin = sourceRef.current
    const end = origin?.isConnected ? onSource(origin, paper) : null
    if (overlayRef.current) animate(overlayRef.current, { opacity: [1, 0] }, { duration: 0.24, ease: 'easeIn' })
    animate(frame, { opacity: [shown, 0] }, { duration: 0.12, ease: 'easeOut' })
    if (end) {
      animate(paper, { transform: [from.transform, end.transform], borderRadius: [from.borderRadius, end.borderRadius] }, CLOSE).then(finish)
    } else {
      animate(paper, { opacity: [1, 0], transform: [from.transform, LOWERED] }, { duration: 0.18, ease: 'easeIn' }).then(finish)
    }
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
          data-settled={settled || undefined}
          aria-describedby={undefined}
          onOpenAutoFocus={(event) => {
            event.preventDefault()
            titleRef.current?.focus({ preventScroll: true })
          }}
          onCloseAutoFocus={returnFocus}
          ref={(element) => {
            if (element) onContentMount()
          }}
        >
          <div className="window__paper" ref={paperRef} aria-hidden="true" />
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
