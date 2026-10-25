// Extrait les logos de technologies utilisés par le site depuis Simple Icons (CC0-1.0)
// et Devicon (MIT), puis écrit src/data/icons.generated.ts.
// Les marques restent la propriété de leurs détenteurs respectifs.
//
// Usage : npm run icons
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import * as simpleIcons from 'simple-icons'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const deviconDir = join(root, 'node_modules', 'devicon', 'icons')

// Fonds des pastilles d'icônes (doivent rester alignés avec src/styles/tokens.css).
const TILE_DARK = '#1e2228'
const TILE_LIGHT = '#eef0f3'
const REST_DARK = '#c7cdd5'
const REST_LIGHT = '#3a4049'
const MIN_CONTRAST = 3 // WCAG 1.4.11 : composantes graphiques

/** @type {Record<string, { si?: string, devicon?: string, hex?: string }>} */
const SOURCES = {
  python: { si: 'python' },
  typescript: { si: 'typescript' },
  javascript: { si: 'javascript' },
  java: { devicon: 'java/java-plain.svg', hex: '#ea2d2e' },
  csharp: { devicon: 'csharp/csharp-plain.svg', hex: '#68217a' },
  php: { si: 'php' },
  cplusplus: { si: 'cplusplus' },
  rust: { si: 'rust' },
  bash: { si: 'gnubash' },
  react: { si: 'react' },
  expo: { si: 'expo' },
  android: { si: 'android' },
  androidstudio: { si: 'androidstudio' },
  html5: { si: 'html5' },
  css: { si: 'css' },
  dotnet: { si: 'dotnet' },
  blazor: { si: 'blazor' },
  postgresql: { si: 'postgresql' },
  sqlserver: { devicon: 'microsoftsqlserver/microsoftsqlserver-plain.svg', hex: '#cc2927' },
  mysql: { si: 'mysql' },
  efcore: { devicon: 'entityframeworkcore/entityframeworkcore-plain.svg', hex: '#512bd4' },
  grafana: { si: 'grafana' },
  influxdb: { si: 'influxdb' },
  docker: { si: 'docker' },
  git: { si: 'git' },
  gitea: { si: 'gitea' },
  azuredevops: { devicon: 'azuredevops/azuredevops-plain.svg', hex: '#0078d4' },
  linux: { si: 'linux' },
  pytest: { si: 'pytest' },
  maven: { si: 'apachemaven' },
  raspberrypi: { si: 'raspberrypi' },
  arduino: { si: 'arduino' },
  opencv: { si: 'opencv' },
  numpy: { si: 'numpy' },
  pytorch: { si: 'pytorch' },
  mqtt: { si: 'mqtt' },
  stripe: { si: 'stripe' },
  c: { si: 'c' },
  powershell: { devicon: 'powershell/powershell-plain.svg', hex: '#5391fe' },
  bootstrap: { si: 'bootstrap' },
  jquery: { si: 'jquery' },
  mariadb: { si: 'mariadb' },
  sqlite: { si: 'sqlite' },
  gitlab: { si: 'gitlab' },
  vmware: { si: 'vmware' },
  bluetooth: { si: 'bluetooth' },
  linkedin: { devicon: 'linkedin/linkedin-plain.svg', hex: '#0a66c2' },
}

const bySlug = new Map(
  Object.values(simpleIcons)
    .filter((icon) => icon && typeof icon === 'object' && 'slug' in icon)
    .map((icon) => [icon.slug, icon]),
)

const hexToRgb = (hex) => {
  const value = hex.replace('#', '')
  return [0, 2, 4].map((i) => parseInt(value.slice(i, i + 2), 16))
}
const rgbToHex = (rgb) => '#' + rgb.map((c) => Math.round(c).toString(16).padStart(2, '0')).join('')
const luminance = (hex) => {
  const [r, g, b] = hexToRgb(hex).map((c) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}
const mix = (a, b, weightOfB) => {
  const ca = hexToRgb(a)
  const cb = hexToRgb(b)
  return rgbToHex(ca.map((c, i) => c + (cb[i] - c) * weightOfB))
}
/** Éclaircit (thème sombre) ou assombrit (thème clair) la couleur de marque jusqu'au contraste minimal. */
const ensureContrast = (hex, tile, towards) => {
  let color = hex
  for (let step = 0; step <= 20 && contrast(color, tile) < MIN_CONTRAST; step++) {
    color = mix(hex, towards, step * 0.05)
  }
  return color
}

const readDevicon = (file) => {
  const svg = readFileSync(join(deviconDir, file), 'utf8')
  const viewBox = svg.match(/viewBox="([^"]+)"/)?.[1]
  const paths = [...svg.matchAll(/<path[^>]*\sd="([^"]+)"/g)].map((m) => m[1])
  if (!viewBox || paths.length !== 1) throw new Error(`Devicon inattendu : ${file}`)
  return { viewBox, d: paths[0] }
}

/**
 * Réduit la précision des tracés en tronquant les décimales dans la chaîne elle-même :
 * aucune réécriture numérique, donc les drapeaux d'arc compacts (« 011 ») restent intacts.
 */
const trimPrecision = (d, decimals) =>
  d.replace(new RegExp(`\\.(\\d{${decimals}})\\d+`, 'g'), '.$1')

const out = {}
for (const [id, source] of Object.entries(SOURCES)) {
  let icon
  if (source.si) {
    const si = bySlug.get(source.si)
    if (!si) throw new Error(`Simple Icons ne contient pas « ${source.si} »`)
    icon = {
      viewBox: '0 0 24 24',
      d: trimPrecision(si.path, 2),
      hex: `#${si.hex.toLowerCase()}`,
      source: 'simple-icons',
    }
  } else {
    const { viewBox, d } = readDevicon(source.devicon)
    icon = { viewBox, d: trimPrecision(d, 1), hex: source.hex, source: 'devicon' }
  }
  const onDark = ensureContrast(icon.hex, TILE_DARK, '#ffffff')
  const onLight = ensureContrast(icon.hex, TILE_LIGHT, '#000000')
  out[id] = {
    ...icon,
    onDark,
    onLight,
    restDark: mix(onDark, REST_DARK, 0.72),
    restLight: mix(onLight, REST_LIGHT, 0.72),
  }
}

const body = Object.entries(out)
  .map(([id, icon]) => `  ${id}: ${JSON.stringify(icon)},`)
  .join('\n')

const file = `// Fichier généré par scripts/extract-icons.mjs : ne pas modifier à la main.
// Sources : Simple Icons (CC0-1.0) et Devicon (MIT). Les marques appartiennent à leurs détenteurs.

export interface BrandIcon {
  viewBox: string
  d: string
  hex: string
  onDark: string
  onLight: string
  restDark: string
  restLight: string
  source: 'simple-icons' | 'devicon'
}

export const brandIcons = {
${body}
} satisfies Record<string, BrandIcon>

export type BrandIconId = keyof typeof brandIcons
`

writeFileSync(join(root, 'src', 'data', 'icons.generated.ts'), file)
console.log(`icons.generated.ts : ${Object.keys(out).length} logos`)
