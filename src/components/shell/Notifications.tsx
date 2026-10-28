import { useEffect } from 'react'
import { toast, Toaster } from 'sonner'
import { attachNotifier } from '../../lib/notify'

/** Afficheur des confirmations, chargé à part à la première demande (lib/notify.ts). */
export default function Notifications({ theme }: { theme: 'light' | 'dark' }) {
  // L'effet du Toaster, enfant, s'abonne avant celui-ci : les messages en file ne se perdent pas.
  useEffect(() => attachNotifier((message) => void toast(message)), [])
  return (
    <Toaster
      theme={theme}
      position="bottom-center"
      offset={96}
      mobileOffset={{ bottom: 104 }}
      duration={2400}
      toastOptions={{ unstyled: true, classNames: { toast: 'toast glass' } }}
    />
  )
}
