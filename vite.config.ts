import { createHash } from 'node:crypto'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

/**
 * Chemin de base du site. GitHub Pages sert un site de projet sous « /<dépôt>/ » et un site
 * utilisateur sous « / ». Le workflow le calcule à partir du nom du dépôt ; en local, « / ».
 */
function resolveBase(raw: string | undefined): string {
  if (!raw || raw === '/') return '/'
  return `/${raw.replace(/^\/+|\/+$/g, '')}/`
}

/**
 * Finitions du HTML de production :
 * - préchargement de la police Geist (sous-ensemble latin, seul fichier utile au rendu initial) ;
 * - Content-Security-Policy en <meta>, avec l'empreinte du script inline qui fixe thème et langue.
 * GitHub Pages ne permet pas d'en-têtes HTTP personnalisés, d'où la balise <meta>.
 */
function productionHtml(base: string): Plugin {
  return {
    name: 'obsidian-glass:production-html',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        const font = Object.values(ctx.bundle ?? {}).find((file) =>
          file.fileName.includes('geist-latin-wght-normal'),
        )
        const preload = font
          ? `<link rel="preload" href="${base}${font.fileName}" as="font" type="font/woff2" crossorigin>`
          : ''

        const hashes = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(
          ([, code]) => `'sha256-${createHash('sha256').update(code ?? '').digest('base64')}'`,
        )
        const csp = [
          "default-src 'self'",
          `script-src 'self' ${hashes.join(' ')}`.trim(),
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data:",
          "font-src 'self'",
          "connect-src 'self' https://formspree.io",
          "form-action 'self' https://formspree.io",
          "base-uri 'self'",
          "object-src 'none'",
        ].join('; ')

        return html.replace(
          /<meta charset="UTF-8" \/>/,
          `<meta charset="UTF-8" />\n    <meta http-equiv="Content-Security-Policy" content="${csp}">\n    ${preload}`,
        )
      },
    },
  }
}

const base = resolveBase(process.env.BASE_PATH)

export default defineConfig({
  base,
  plugins: [react(), productionHtml(base)],
  build: {
    target: 'es2022',
    cssMinify: true,
    assetsInlineLimit: 0,
  },
})
