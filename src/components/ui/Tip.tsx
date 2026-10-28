import * as Tooltip from '@radix-ui/react-tooltip'
import type { ReactElement } from 'react'
import './floating.css'

interface Props {
  label: string
  side?: 'top' | 'bottom'
  /** Le contrôle décrit : il garde son propre nom accessible (aria-label ou texte). */
  children: ReactElement
}

/**
 * Infobulle de verre (Radix Tooltip) : au survol et au focus clavier, jamais au toucher, où le
 * libellé visible ou le nom accessible suffisent.
 */
export function Tip({ label, side = 'top', children }: Props) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content className="tooltip" side={side} sideOffset={10} collisionPadding={12}>
          {label}
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  )
}

export const TipProvider = Tooltip.Provider
