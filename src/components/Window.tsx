import { X } from 'lucide-react'
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { useLanguage } from '../i18n/LanguageProvider'
import { prefersReducedMotion } from '../lib/storage'
import './window.css'

interface WindowProps {
  /** id du titre (h2) de la fenêtre, qui nomme le dialogue. */
  labelledBy: string
  /** Titre court repris dans la barre de fenêtre lorsque le titre principal a défilé. */
  title: string
  onClose: () => void
  /** Rectangle de l'élément d'origine : la fenêtre s'ouvre depuis lui. */
  origin?: DOMRect | null
  size?: 'md' | 'lg'
  children: ReactNode
}

/**
 * Fenêtre modale sur <dialog> natif : fond inerte, Échap, focus déplacé à l'ouverture et
 * restitué à la fermeture, défilement de la page bloqué. Montée = ouverte ; le parent la
 * démonte dans onClose, appelé après l'animation de sortie.
 */
export function Window({ labelledBy, title, onClose, origin, size = 'lg', children }: WindowProps) {
  const { t } = useLanguage()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const onCloseRef = useRef(onClose)
  const closing = useRef(false)
  const [barTitleVisible, setBarTitleVisible] = useState(false)

  useEffect(() => {
    onCloseRef.current = onClose
  })

  // Ouverture : showModal, origine de l'animation, focus sur le titre ; nettoyage à la fermeture.
  useLayoutEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null
    closing.current = false
    if (!dialog.open) dialog.showModal()
    document.documentElement.classList.add('is-locked')

    const rect = dialog.getBoundingClientRect()
    if (origin && window.matchMedia?.('(min-width: 641px)').matches) {
      const x = origin.left + origin.width / 2 - rect.left
      const y = origin.top + origin.height / 2 - rect.top
      dialog.style.transformOrigin = `${Math.round(x)}px ${Math.round(y)}px`
    }
    dialog.dataset.state = 'open'
    dialog.querySelector<HTMLElement>(`#${CSS.escape(labelledBy)}`)?.focus({ preventScroll: true })

    return () => {
      if (dialog.open) dialog.close()
      document.documentElement.classList.remove('is-locked')
      if (previous?.isConnected) previous.focus({ preventScroll: true })
    }
    // L'ouverture ne doit se produire qu'au montage.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const requestClose = useCallback(() => {
    const dialog = dialogRef.current
    if (!dialog || closing.current) return
    closing.current = true
    if (prefersReducedMotion()) {
      onCloseRef.current()
      return
    }
    let finished = false
    const finish = () => {
      if (finished) return
      finished = true
      onCloseRef.current()
    }
    dialog.dataset.state = 'closing'
    dialog.addEventListener('animationend', (event) => event.target === dialog && finish())
    window.setTimeout(finish, 260)
  }, [])

  // Échap, clic sur l'arrière-plan et fermeture imposée par le navigateur.
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    let downOnBackdrop = false
    const onCancel = (event: Event) => {
      event.preventDefault()
      requestClose()
    }
    const onPointerDown = (event: PointerEvent) => {
      downOnBackdrop = event.target === dialog
    }
    const onClick = (event: MouseEvent) => {
      if (downOnBackdrop && event.target === dialog) requestClose()
    }
    // L'événement close est différé : s'il arrive alors que la fenêtre a été rouverte
    // (double montage de StrictMode), il ne concerne plus l'état actuel.
    const onNativeClose = () => {
      if (closing.current || dialog.open) return
      closing.current = true
      onCloseRef.current()
    }
    dialog.addEventListener('cancel', onCancel)
    dialog.addEventListener('pointerdown', onPointerDown)
    dialog.addEventListener('click', onClick)
    dialog.addEventListener('close', onNativeClose)
    return () => {
      dialog.removeEventListener('cancel', onCancel)
      dialog.removeEventListener('pointerdown', onPointerDown)
      dialog.removeEventListener('click', onClick)
      dialog.removeEventListener('close', onNativeClose)
    }
  }, [requestClose])

  // Le titre apparaît dans la barre quand le titre principal sort de la vue.
  useEffect(() => {
    const frame = frameRef.current
    const heading = frame?.querySelector(`#${CSS.escape(labelledBy)}`)
    if (!frame || !heading || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(
      ([entry]) => setBarTitleVisible(entry ? !entry.isIntersecting : false),
      { root: frame, rootMargin: '-56px 0px 0px 0px' },
    )
    observer.observe(heading)
    return () => observer.disconnect()
  }, [labelledBy])

  return (
    <dialog ref={dialogRef} className={`window window--${size}`} aria-labelledby={labelledBy}>
      <div className="window__frame" ref={frameRef}>
        <div className="window__bar">
          <span className="window__bar-title" data-visible={barTitleVisible} aria-hidden="true">
            {title}
          </span>
          <button type="button" className="window__close" onClick={requestClose} aria-label={t.window.closeNamed(title)}>
            <X aria-hidden="true" size={16} strokeWidth={2} />
            <span className="window__close-label" aria-hidden="true">
              {t.window.close}
            </span>
            <kbd className="window__esc" aria-hidden="true">
              {t.window.escKey}
            </kbd>
          </button>
        </div>
        <div className="window__body">{children}</div>
      </div>
    </dialog>
  )
}
