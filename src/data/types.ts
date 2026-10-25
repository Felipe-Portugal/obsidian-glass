import type { TechId } from './technologies'

export type Lang = 'fr' | 'en'

/** Valeur traduite : chaque langue est obligatoire. */
export type Localized<T = string> = Readonly<Record<Lang, T>>

export type NodeKind = 'component' | 'store' | 'service' | 'device' | 'step' | 'result'

export interface DiagramNode {
  id: string
  label: Localized
  detail?: Localized
  tech?: readonly TechId[]
  kind?: NodeKind
  /** Composante à laquelle Felipe a contribué (marquée dans le schéma et sa légende). */
  contributed?: boolean
}

export interface DiagramFlow {
  id: string
  title?: Localized
  /** exchange : échanges dans les deux sens ; sequence : étapes successives ; none : aucune liaison dessinée. */
  link: 'exchange' | 'sequence' | 'none'
  nodes: readonly DiagramNode[]
  /** Phrase lue par les lecteurs d'écran, qui décrit les liaisons du flux. */
  summary: Localized
}

export interface DiagramGroup {
  id: string
  title: Localized
  nodes: readonly DiagramNode[]
  variant: 'service' | 'band'
}

export type LegendKey = 'contributed' | 'service' | 'exchange' | 'sequence' | 'band'

export interface DiagramSpec {
  title: Localized
  description: Localized
  flows: readonly DiagramFlow[]
  groups?: readonly DiagramGroup[]
  legend: readonly LegendKey[]
  note: Localized
}

export type Maturity = 'deployed' | 'prototype' | 'individual'

export interface TechGroup {
  title: Localized
  items: readonly TechId[]
}

export interface Project {
  id: 'parking' | 'spot' | 'embedded'
  layout: 'wide' | 'tall' | 'compact'
  title: Localized
  context: Localized
  maturity: { kind: Maturity; label: Localized }
  /** Ce à quoi répond le projet, en une ligne. */
  summary: Localized
  /** Contribution personnelle, en une ligne. */
  contribution: Localized
  cardTech: readonly TechId[]
  detail: {
    context: Localized<readonly string[]>
    role: Localized<readonly string[]>
    /** Défi technique confirmé par Felipe ; absent si aucun n'a été fourni. */
    challenge?: Localized
    approach?: Localized<readonly string[]>
    practices?: Localized<readonly string[]>
    diagram: DiagramSpec
    tech: readonly TechGroup[]
    limits?: Localized<readonly string[]>
  }
}

export interface Role {
  title: Localized
  period: Localized
}

export interface ExperienceEntry {
  id: string
  roles: readonly Role[]
  /** Précision affichée sous les rôles (p. ex. réalisations communes à deux périodes). */
  note?: Localized
  points: Localized<readonly string[]>
  /** Technologies et outils nommés dans les réalisations, et rien d'autre. */
  tech: readonly TechId[]
}

export interface SkillGroup {
  id: string
  label: Localized
  items: readonly TechId[]
}

export interface EducationEntry {
  id: string
  degree: Localized
  school: Localized
  period: Localized
  /** Projets et travaux de cours, repris du CV publié (public/cv). */
  projects: Localized<readonly string[]>
  /** Technologies nommées dans ces projets, et rien d'autre. */
  tech: readonly TechId[]
}
