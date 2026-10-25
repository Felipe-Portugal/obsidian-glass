/**
 * Confirmations brèves (« Adresse copiée »). La bibliothèque qui les affiche n'est chargée qu'à
 * la première demande : les messages attendent dans une file jusqu'à ce qu'elle soit prête.
 */
type Show = (message: string) => void

const pending: string[] = []
let show: Show | null = null
let request: (() => void) | null = null

export function notify(message: string) {
  if (show) {
    show(message)
    return
  }
  pending.push(message)
  request?.()
}

/** L'application monte l'afficheur quand une première confirmation est demandée. */
export function onFirstNotify(mount: () => void) {
  request = mount
  if (pending.length) mount()
  return () => {
    if (request === mount) request = null
  }
}

/** L'afficheur, une fois monté, vide la file puis reçoit les messages suivants directement. */
export function attachNotifier(next: Show) {
  show = next
  pending.splice(0).forEach(next)
  return () => {
    if (show === next) show = null
  }
}
