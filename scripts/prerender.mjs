// Écrit la version statique du contenu (src/prerender.ts) dans dist/index.html, à la place du
// repère <!--prerender-->. Lancé après le build client et le build SSR de src/prerender.ts.
//
// Usage : npm run build (étape finale)
import { readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const bundle = join(root, 'node_modules', '.prerender', 'prerender.js')
const page = join(root, 'dist', 'index.html')
const MARK = '<!--prerender-->'

const { renderStaticPage } = await import(pathToFileURL(bundle).href)
const html = readFileSync(page, 'utf8')
if (!html.includes(MARK)) throw new Error(`Repère ${MARK} introuvable dans dist/index.html`)
writeFileSync(page, html.replace(MARK, renderStaticPage('fr')))
rmSync(dirname(bundle), { recursive: true, force: true })
console.log('dist/index.html : contenu pré-rendu')
