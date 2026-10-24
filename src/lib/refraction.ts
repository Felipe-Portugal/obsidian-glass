import { useCallback, useEffect, useId, useRef } from 'react'

/**
 * Réfraction sur le bord d'un verre : une carte de déplacement SVG, dessinée à la taille et au
 * rayon de l'élément, placée dans son backdrop-filter. Seul Chromium applique un filtre SVG dans
 * un backdrop-filter ; ailleurs le verre reste dépoli (flou, teinte, liseré), la même matière
 * sans la courbure.
 */

interface Options {
  /** Largeur du bord courbé, en pixels CSS. */
  bezel: number
  /** Déplacement maximal de ce qui est vu à travers le bord, en pixels CSS. */
  scale: number
  /** Attente avant le premier tracé, pour ne pas le faire pendant une animation d'entrée. */
  delay?: number
}

type ChromiumNavigator = Navigator & { userAgentData?: { brands: { brand: string }[] } }

function canRefract(): boolean {
  if (typeof window === 'undefined' || typeof requestIdleCallback === 'undefined') return false
  const brands = (navigator as ChromiumNavigator).userAgentData?.brands
  if (!brands?.some((b) => b.brand === 'Chromium')) return false
  return !window.matchMedia?.('(prefers-reduced-transparency: reduce)').matches
}

/**
 * La carte : rouge et vert portent le décalage horizontal et vertical (128 = aucun). Dans le
 * bord, chaque point regarde un peu plus vers l'intérieur, davantage près de l'arête, comme
 * une lentille épaisse aux bords arrondis ; le centre ne bouge pas, ce qui s'y lit reste net.
 */
function drawMap(width: number, height: number, radius: number, bezel: number): string {
  // Quart de résolution : la carte est lisse et le filtre la remet à l'échelle.
  const w = Math.max(2, Math.round(width / 4))
  const h = Math.max(2, Math.round(height / 4))
  const k = w / width
  const r = Math.min(radius, width / 2, height / 2) * k
  const b = Math.max(1, bezel * k)
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''
  const image = ctx.createImageData(w, h)
  const hx = w / 2
  const hy = h / 2
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      // Distance signée au rectangle arrondi (négative dedans) et normale vers l'extérieur.
      const px = x + 0.5 - hx
      const py = y + 0.5 - hy
      const qx = Math.abs(px) - (hx - r)
      const qy = Math.abs(py) - (hy - r)
      const ox = Math.max(qx, 0)
      const oy = Math.max(qy, 0)
      const outside = Math.hypot(ox, oy)
      const d = outside + Math.min(Math.max(qx, qy), 0) - r
      let nx = 0
      let ny = 0
      if (outside > 0) {
        nx = (ox / outside) * Math.sign(px)
        ny = (oy / outside) * Math.sign(py)
      } else if (qx > qy) nx = Math.sign(px)
      else ny = Math.sign(py)
      const depth = -d
      const s = depth < b ? (1 - depth / b) ** 2 : 0
      const i = (y * w + x) * 4
      image.data[i] = 128 - nx * s * 127
      image.data[i + 1] = 128 - ny * s * 127
      image.data[i + 2] = 128
      image.data[i + 3] = 255
    }
  }
  ctx.putImageData(image, 0, 0)
  return canvas.toDataURL('image/png')
}

/**
 * Donne la réfraction à un élément : renvoie une ref de rappel. Son CSS lit le filtre dans
 * --refraction, laissée vide là où le navigateur ne peut pas la dessiner.
 */
export function useRefraction<T extends HTMLElement>({ bezel, scale, delay = 400 }: Options) {
  const id = `refraction-${useId().replace(/[^a-zA-Z0-9-]/g, '')}`
  const node = useRef<T | null>(null)
  const svg = useRef<SVGSVGElement | null>(null)
  const observer = useRef<ResizeObserver | null>(null)
  const timers = useRef({ timeout: 0, idle: 0 })

  const draw = useCallback(() => {
    const el = node.current
    if (!el) return
    // Taille de mise en page : une échelle animée sur l'élément ne doit pas réduire la carte.
    const width = el.offsetWidth
    const height = el.offsetHeight
    if (width < 4 || height < 4) return
    const radius = parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0
    const map = drawMap(width, height, radius, bezel)
    if (!map) return
    if (!svg.current) {
      svg.current = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      svg.current.setAttribute('aria-hidden', 'true')
      svg.current.setAttribute('width', '0')
      svg.current.setAttribute('height', '0')
      svg.current.style.position = 'absolute'
      document.body.appendChild(svg.current)
    }
    svg.current.innerHTML =
      `<filter id="${id}" x="0" y="0" width="${width}" height="${height}" filterUnits="userSpaceOnUse" primitiveUnits="userSpaceOnUse" color-interpolation-filters="sRGB">` +
      `<feImage href="${map}" x="0" y="0" width="${width}" height="${height}" preserveAspectRatio="none" result="map"/>` +
      `<feDisplacementMap in="SourceGraphic" in2="map" scale="${scale}" xChannelSelector="R" yChannelSelector="G"/>` +
      `</filter>`
    el.style.setProperty('--refraction', `url(#${id})`)
  }, [bezel, scale, id])

  const ref = useCallback(
    (el: T | null) => {
      observer.current?.disconnect()
      clearTimeout(timers.current.timeout)
      node.current = el
      if (!el || !canRefract()) return
      // Tracé quand le navigateur est libre, et jamais pendant une entrée animée : d'ici là le
      // verre est dépoli, ce qui se lit de la même façon.
      let first = true
      observer.current = new ResizeObserver(() => {
        cancelIdleCallback(timers.current.idle)
        const later = () => (timers.current.idle = requestIdleCallback(draw, { timeout: 1000 }))
        if (first) timers.current.timeout = window.setTimeout(later, delay)
        else later()
        first = false
      })
      observer.current.observe(el)
    },
    [draw, delay],
  )

  useEffect(
    () => () => {
      observer.current?.disconnect()
      clearTimeout(timers.current.timeout)
      if (timers.current.idle) cancelIdleCallback(timers.current.idle)
      svg.current?.remove()
      svg.current = null
    },
    [],
  )

  return ref
}
