import { expect, test } from '@playwright/test'

/**
 * Le contenu reste lisible quand JavaScript échoue : la version statique pré-rendue s'affiche
 * tout de suite sans JavaScript, et revient au bout de 4 s si l'application ne se monte pas.
 */

const prerender = '.prerender'

test.describe('sans JavaScript', () => {
  test.use({ javaScriptEnabled: false })

  test('la version statique s’affiche immédiatement', async ({ page }) => {
    await page.goto('./')
    await expect(page.locator(prerender)).toBeVisible()
    await expect(page.locator(prerender).getByRole('heading', { level: 1 })).toHaveText('Felipe Portugal')
    await expect(page.locator(prerender)).toContainText('Gestion des stationnements')
  })
})

for (const [cas, pattern] of [
  ['paquet principal bloqué', /\/assets\/index-[^/]*\.js$/],
  ['dépendance du paquet bloquée', /\/assets\/jsx-runtime-[^/]*\.js$/],
] as const) {
  test(`${cas} : la version statique revient`, async ({ page }) => {
    await page.route(pattern, (route) => route.abort())
    await page.goto('./')
    await expect(page.locator(prerender)).toBeVisible({ timeout: 8000 })
    await expect(page.locator('#root .app')).toHaveCount(0)
  })
}

test('paquet des fenêtres bloqué : la page reste utilisable', async ({ page }) => {
  await page.route(/\/assets\/ProjectWindow-[^/]*\.js$/, (route) => route.abort())
  await page.goto('./')
  await expect(page.locator('#root .app')).toBeVisible()
  await expect(page.locator(prerender)).toHaveCount(0)
  await expect(page.getByRole('heading', { level: 1, name: /Felipe Portugal/ })).toBeVisible()
})
