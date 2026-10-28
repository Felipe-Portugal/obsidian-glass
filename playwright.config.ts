import { defineConfig } from '@playwright/test'

/**
 * Tests de bout en bout sur le build de production (dist/), dans un vrai Chrome : navigation
 * par adresse et repli sur la version statique quand JavaScript échoue. Lancés par la CI
 * après `npm run check`, avant le déploiement. Même chemin de base que le build (BASE_PATH).
 */
const raw = process.env.BASE_PATH
const base = !raw || raw === '/' ? '/' : `/${raw.replace(/^\/+|\/+$/g, '')}/`
const port = 4180

export default defineConfig({
  testDir: 'e2e',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['github']] : 'list',
  use: {
    baseURL: `http://localhost:${port}${base}`,
    // Chrome installé (poste local, runner GitHub) : aucun navigateur à télécharger.
    channel: 'chrome',
    locale: 'fr-CA',
    colorScheme: 'dark',
  },
  webServer: {
    command: `npx vite preview --port ${port} --strictPort`,
    url: `http://localhost:${port}${base}`,
    reuseExistingServer: !process.env.CI,
  },
})
