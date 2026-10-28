import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type Ref } from 'react'
import type { TechId } from '../../data/technologies'
import { brandStyle, TechGlyph, useTechName } from './TechGlyph'

/** Garde l'infobulle dans la fenêtre visible (marge de 8 px). */
function clampToViewport(element: HTMLElement) {
  element.style.setProperty('--tip-shift', '0px')
  const rect = element.getBoundingClientRect()
  const margin = 8
  let shift = 0
  if (rect.left < margin) shift = margin - rect.left
  else if (rect.right > window.innerWidth - margin) shift = window.innerWidth - margin - rect.right
  element.style.setProperty('--tip-shift', `${Math.round(shift)}px`)
}

function isFocusVisible(element: HTMLElement): boolean {
  try {
    return element.matches(':focus-visible')
  } catch {
    return true
  }
}

interface TileProps {
  id: TechId
  tabIndex: number
  onActivate: () => void
  ref: Ref<HTMLButtonElement>
}

/**
 * Logo identifiable au survol, au focus clavier et au toucher : l'infobulle porte le nom exact.
 * Au toucher, un appui affiche le nom quelques secondes ; un second appui le masque.
 */
function TechTile({ id, tabIndex, onActivate, ref }: TileProps) {
  const name = useTechName()(id)
  const [visible, setVisible] = useState(false)
  const tipRef = useRef<HTMLSpanElement>(null)
  const pointer = useRef<string>('mouse')
  const timer = useRef<number | undefined>(undefined)

  useLayoutEffect(() => {
    if (visible && tipRef.current) clampToViewport(tipRef.current)
  }, [visible])

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const showBriefly = () => {
    window.clearTimeout(timer.current)
    setVisible((current) => !current)
    timer.current = window.setTimeout(() => setVisible(false), 2600)
  }

  return (
    <button
      ref={ref}
      type="button"
      className="tech"
      style={brandStyle(id)}
      tabIndex={tabIndex}
      aria-label={name}
      data-visible={visible}
      onPointerDown={(event) => {
        pointer.current = event.pointerType
      }}
      onPointerEnter={(event) => {
        pointer.current = event.pointerType
        if (event.pointerType === 'mouse') setVisible(true)
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === 'mouse' && document.activeElement !== event.currentTarget) setVisible(false)
      }}
      onFocus={(event) => {
        onActivate()
        if (isFocusVisible(event.currentTarget)) setVisible(true)
      }}
      onBlur={() => setVisible(false)}
      onClick={() => {
        if (pointer.current === 'mouse') setVisible(true)
        else showBriefly()
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && visible) {
          event.stopPropagation()
          setVisible(false)
        }
      }}
    >
      <TechGlyph id={id} />
      <span ref={tipRef} className="tip" aria-hidden="true">
        {name}
      </span>
    </button>
  )
}

interface ToolbarProps {
  ids: readonly TechId[]
  label: string
  size?: 'sm' | 'md'
}

/**
 * Groupe de logos en barre d'outils : une seule tabulation pour entrer dans le groupe,
 * flèches, Début et Fin pour le parcourir (focus itinérant).
 */
export function TechToolbar({ ids, label, size = 'md' }: ToolbarProps) {
  const [active, setActive] = useState(0)
  const tiles = useRef<(HTMLButtonElement | null)[]>([])

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const last = ids.length - 1
    let next: number | null = null
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = active >= last ? 0 : active + 1
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = active <= 0 ? last : active - 1
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = last
    if (next === null) return
    event.preventDefault()
    setActive(next)
    tiles.current[next]?.focus()
  }

  return (
    <div
      role="toolbar"
      tabIndex={-1}
      aria-label={label}
      aria-orientation="horizontal"
      className={`techbar techbar--${size}`}
      onKeyDown={onKeyDown}
    >
      {ids.map((id, index) => (
        <TechTile
          key={id}
          id={id}
          tabIndex={index === active ? 0 : -1}
          onActivate={() => setActive(index)}
          ref={(element) => {
            tiles.current[index] = element
          }}
        />
      ))}
    </div>
  )
}
