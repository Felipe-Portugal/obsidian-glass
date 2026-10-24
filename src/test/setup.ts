import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// jsdom n'implémente pas toutes les API utilisées par l'interface : substituts minimaux.
if (typeof HTMLDialogElement !== 'undefined' && !HTMLDialogElement.prototype.showModal) {
  HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
    this.setAttribute('open', '')
  }
  HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
    this.removeAttribute('open')
    // Comme dans les navigateurs, l'événement close part dans une tâche ultérieure.
    setTimeout(() => this.dispatchEvent(new Event('close')), 0)
  }
}

if (typeof globalThis.CSS === 'undefined' || typeof globalThis.CSS.escape !== 'function') {
  Object.assign(globalThis, {
    CSS: { ...(globalThis.CSS ?? {}), escape: (value: string) => value.replace(/[^\w-]/g, (char) => `\\${char}`) },
  })
}

// Mouvement réduit en test : les fenêtres se ferment sans attendre d'animation.
if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: query.includes('prefers-reduced-motion'),
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList
}

afterEach(() => {
  cleanup()
  window.localStorage.clear()
})
