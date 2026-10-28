import type { CSSProperties } from 'react'
import { brandIcons, type BrandIconId } from '../data/icons.generated'
import { technologies, type TechId, type Technology } from '../data/technologies'
import { useLanguage } from '../i18n/LanguageProvider'
import './tech.css'

export function useTechName() {
  const { pick } = useLanguage()
  return (id: TechId) => pick((technologies[id] as Technology).name)
}

/** Variables de couleur par marque : teinte au repos, couleur de marque au survol (contrastes vérifiés). */
export function brandStyle(id: TechId): CSSProperties | undefined {
  const tech: Technology = technologies[id]
  if (!tech.icon) return undefined
  const icon = brandIcons[tech.icon]
  return {
    '--brand-rest-d': icon.restDark,
    '--brand-rest-l': icon.restLight,
    '--brand-d': icon.onDark,
    '--brand-l': icon.onLight,
  } as CSSProperties
}

/** Logo de marque décoratif (p. ex. LinkedIn dans le dock). */
export function BrandSvg({ icon, className }: { icon: BrandIconId; className?: string }) {
  const { viewBox, d } = brandIcons[icon]
  return (
    <svg className={`glyph ${className ?? ''}`} viewBox={viewBox} aria-hidden="true" focusable="false">
      <path d={d} fill="currentColor" />
    </svg>
  )
}

/** Logo seul, décoratif : le nom est porté par l'élément parent. */
export function TechGlyph({ id, className }: { id: TechId; className?: string }) {
  const tech: Technology = technologies[id]
  if (tech.icon) return <BrandSvg icon={tech.icon} {...(className ? { className } : {})} />
  // Monogramme dessiné en CSS (::before) : il reste hors du nom accessible, que porte le parent
  // (WCAG 2.5.3, le texte visible « FX » ne contredit pas le nom « JavaFX »).
  return (
    <span
      className={`glyph glyph--mono ${className ?? ''}`}
      data-short={tech.short}
      data-len={tech.short?.length ?? 0}
      aria-hidden="true"
    />
  )
}

/** Pastille logo + nom, non interactive (fiches projets). */
export function TechChip({ id }: { id: TechId }) {
  const name = useTechName()
  return (
    <li className="chip" style={brandStyle(id)}>
      <TechGlyph id={id} />
      <span>{name(id)}</span>
    </li>
  )
}
