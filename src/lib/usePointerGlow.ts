import { useCallback, useRef } from 'react'
import { prefersReducedMotion } from './storage'

/**
 * Reflet de surface qui suit le pointeur (souris ou stylet seulement) via --mx / --my.
 * Mise à jour regroupée par frame ; inactif au toucher et si le mouvement est réduit.
 * Renvoie une ref de rappel à poser sur l'élément.
 */
export function usePointerGlow<T extends HTMLElement>() {
  const cleanup = useRef<(() => void) | null>(null)

  return useCallback((element: T | null) => {
    cleanup.current?.()
    cleanup.current = null
    if (!element || prefersReducedMotion()) return

    let frame = 0
    const onMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      const { clientX, clientY } = event
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const rect = element.getBoundingClientRect()
        element.style.setProperty('--mx', `${Math.round(clientX - rect.left)}px`)
        element.style.setProperty('--my', `${Math.round(clientY - rect.top)}px`)
      })
    }
    element.addEventListener('pointermove', onMove, { passive: true })
    cleanup.current = () => {
      cancelAnimationFrame(frame)
      element.removeEventListener('pointermove', onMove)
    }
  }, [])
}
