import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { experience } from '../data/experience'
import { brandIcons } from '../data/icons.generated'
import { profile } from '../data/profile'
import { projects } from '../data/projects'
import { education, skillGroups } from '../data/skills'
import { technologies, type Technology } from '../data/technologies'
import { validated } from '../data/validation'
import { ui } from '../i18n/ui'

const root = resolve(__dirname, '../..')

/** Toutes les chaînes publiées (contenu + interface), dans les deux langues. */
function collectStrings(value: unknown, out: string[] = []): string[] {
  if (typeof value === 'string') out.push(value)
  else if (typeof value === 'function') {
    const result = (value as (...args: unknown[]) => unknown)('x', 1)
    if (typeof result === 'string') out.push(result)
  } else if (Array.isArray(value)) value.forEach((item) => collectStrings(item, out))
  else if (value && typeof value === 'object') Object.values(value).forEach((item) => collectStrings(item, out))
  return out
}

const published = collectStrings([projects, experience, skillGroups, education, profile, ui]).join('\n')

/**
 * Termes privés à ne jamais publier (projets non publiables, coordonnées, outils internes).
 * Ils restent hors du dépôt, dans .content-guard.local (ignoré par git) : les écrire ici
 * suffirait à les publier. Format : { "forbidden": ["terme", ...] }.
 */
const guardFile = join(root, '.content-guard.local')
const privateTerms: string[] = existsSync(guardFile)
  ? (JSON.parse(readFileSync(guardFile, 'utf8')) as { forbidden: string[] }).forbidden
  : []

describe('fidélité à facts_felipe.md', () => {
  it.each([
    ['numéro de téléphone', /\(?\d{3}\)?[\s.-]\d{3}-\d{4}/],
    ['citoyenneté', /citoyen|citizen/i],
    ['niveaux de maîtrise', /\bexpert|\bsenior\b|maîtrise avancée|advanced proficiency/i],
    ['développeur unique', /seul développeur|sole developer|independently|on my own/i],
    ['titre non confirmé', /System Architect/i],
    ['certification non obtenue', /\bCCNA\b/],
    ['Nomad de HashiCorp', /HashiCorp/i],
    ['détails Stripe inventés', /webhook|PCI\b|idempoten/i],
    ['modèle de branches non précisé', /GitFlow|trunk-based/i],
    ['outils de test non confirmés', /JUnit|Mockito|Selenium|Cypress|JMeter|Locust|TestNG/i],
    ['TorchServe', /TorchServe/i],
    ['pourcentages et métriques', /\d+\s?%|\b\d+\s+(images|utilisateurs|users|requêtes|requests)\b/i],
  ])('aucune mention : %s', (_label, pattern) => {
    // Seule métrique publiable : la couverture de 99 % du projet LOG240.
    expect(published.replace(/couverture de 99\s?%|99% coverage/g, '')).not.toMatch(pattern)
  })

  it('ne cite la couverture de 99 % qu’au projet LOG240', () => {
    for (const line of published.split('\n').filter((text) => /99\s?%/.test(text))) expect(line).toMatch(/LOG240/)
  })

  it.runIf(privateTerms.length > 0)('aucun terme privé de .content-guard.local', () => {
    const text = published.toLowerCase()
    for (const term of privateTerms) expect(text.includes(term.toLowerCase()), term).toBe(false)
  })

  it('n’affiche PyTorch que si la validation est confirmée', () => {
    const projectText = JSON.stringify(projects)
    if (!validated.pytorchDetection) {
      expect(projectText).not.toMatch(/pytorch/i)
      expect(skillGroups.flatMap((group) => group.items)).not.toContain('pytorch')
    }
  })

  it('décrit l’application mobile comme une contribution', () => {
    const parking = projects.find((project) => project.id === 'parking')
    expect(parking?.detail.role.fr[0]).toMatch(/^Contribuer au développement/)
    expect(parking?.detail.role.en[0]).toMatch(/^Contributed to the development/)
  })

  it('présente l’OCR des plaques comme non finalisé', () => {
    const parking = JSON.stringify(projects.find((project) => project.id === 'parking'))
    expect(parking).toMatch(/OCR était en développement/)
    expect(parking).toMatch(/still in development/)
  })

  it('reprend les dates ITMI sans attribuer les réalisations au stage ou à l’emploi', () => {
    const [software] = experience
    expect(software?.roles.map((role) => role.period.fr)).toEqual(['Mai – sept. 2025', 'Janv. – mai 2025'])
    expect(software?.note?.fr).toMatch(/ensemble de la période/)
    expect(JSON.stringify(experience)).not.toMatch(/CISSS|CAPRA/)
  })

  it('ne montre pour une période que des technologies nommées dans ses réalisations', () => {
    for (const entry of experience) {
      const text = entry.points.fr.join(' ')
      for (const id of entry.tech) {
        const { name } = technologies[id]
        const label = (typeof name === 'string' ? name : name.fr).replace(/\s*\(.*\)$/, '')
        expect(text, `${entry.id} : ${label}`).toContain(label)
      }
    }
  })

  it('n’emploie que des technologies du catalogue, avec des logos existants', () => {
    const ids = [
      ...skillGroups.flatMap((group) => group.items),
      ...experience.flatMap((entry) => entry.tech),
      ...education.flatMap((entry) => entry.tech),
      ...projects.flatMap((project) => [
        ...project.cardTech,
        ...project.detail.tech.flatMap((group) => group.items),
        ...project.detail.diagram.flows.flatMap((flow) => flow.nodes.flatMap((node) => node.tech ?? [])),
      ]),
    ]
    for (const id of ids) {
      const tech: Technology | undefined = technologies[id]
      expect(tech, id).toBeDefined()
      if (tech?.icon) expect(brandIcons[tech.icon], id).toBeDefined()
      else expect(tech?.short, `${id} : monogramme de repli manquant`).toBeTruthy()
    }
  })

  it('limite chaque carte à 3–5 logos', () => {
    for (const project of projects) {
      expect(project.cardTech.length).toBeGreaterThanOrEqual(3)
      expect(project.cardTech.length).toBeLessThanOrEqual(5)
    }
  })
})

describe('liens et ressources', () => {
  it('pointe vers le vrai profil LinkedIn et le courriel public', () => {
    expect(profile.linkedin).toBe('https://www.linkedin.com/in/felipe-portugal-151a75225/')
    expect(profile.email).toBe('felipe-alberto.padilla-portugal.1@ens.etsmtl.ca')
  })

  it('ne référence un CV que s’il existe réellement dans public/', () => {
    if (!profile.resume) return
    for (const path of Object.values(profile.resume)) {
      expect(existsSync(join(root, 'public', path)), path).toBe(true)
    }
  })
})

describe('règles du dépôt public', () => {
  const files: string[] = []
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry)
      if (statSync(full).isDirectory()) walk(full)
      else if (/\.(tsx?|css|html|md|json|ya?ml|mjs)$/.test(entry)) files.push(full)
    }
  }
  walk(join(root, 'src'))
  walk(join(root, 'public'))
  if (existsSync(join(root, '.github'))) walk(join(root, '.github'))
  for (const file of ['index.html', 'README.md', 'package.json', 'vite.config.ts']) {
    if (existsSync(join(root, file))) files.push(join(root, file))
  }

  it.runIf(privateTerms.length > 0)('aucun terme privé dans les fichiers destinés au dépôt', () => {
    for (const file of files) {
      const text = readFileSync(file, 'utf8').toLowerCase()
      for (const term of privateTerms) expect(text.includes(term.toLowerCase()), `${term} dans ${file}`).toBe(false)
    }
  })

  it('n’utilise aucun lien fictif', () => {
    for (const file of files.filter((f) => /\.(tsx|html)$/.test(f))) {
      expect(readFileSync(file, 'utf8'), file).not.toMatch(/href=["']#["']/)
    }
  })
})
