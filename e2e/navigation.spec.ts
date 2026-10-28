import { expect, test, type Page } from '@playwright/test'

/** Chaque étude de cas a son adresse : la fenêtre ouverte et le fragment restent cohérents. */

const SPOT = 'Robotique Boston Dynamics Spot'
const PARKING = 'Gestion des stationnements'
const EMBEDDED = 'Surveillance d’un logement temporaire'

const dialog = (page: Page, name?: string) => page.getByRole('dialog', name ? { name } : {})
const setHash = (page: Page, hash: string) => page.evaluate((value) => (window.location.hash = value), hash)

test.beforeEach(async ({ page }) => {
  await page.goto('./')
  await expect(page.locator('#root .app')).toBeVisible()
})

test('un fragment modifié sur la page ouverte ouvre puis bascule l’étude de cas', async ({ page }) => {
  await setHash(page, '#projet-spot')
  await expect(dialog(page, SPOT)).toBeVisible()

  await setHash(page, '#projet-parking')
  await expect(dialog(page, PARKING)).toBeVisible()
  await expect(dialog(page, SPOT)).toHaveCount(0)

  await page.goBack()
  await expect(dialog(page, SPOT)).toBeVisible()
})

test('un fragment vidé, inconnu ou d’évitement ferme ou n’ouvre rien', async ({ page }) => {
  await setHash(page, '#projet-spot')
  await expect(dialog(page, SPOT)).toBeVisible()
  await setHash(page, '')
  await expect(dialog(page)).toHaveCount(0)

  await setHash(page, '#projet-inexistant')
  await expect(dialog(page)).toHaveCount(0)

  await setHash(page, '#projet-embedded')
  await expect(dialog(page, EMBEDDED)).toBeVisible()
  await setHash(page, '#contenu')
  await expect(dialog(page)).toHaveCount(0)
})

test('ouvrir puis fermer aussitôt laisse une adresse propre', async ({ page }) => {
  await page.getByRole('button', { name: /Ouvrir l’étude de cas\s*: Robotique Boston Dynamics Spot/ }).click()
  await page.waitForTimeout(50)
  await page.keyboard.press('Escape')
  await expect(dialog(page)).toHaveCount(0)
  await expect.poll(() => page.evaluate(() => window.location.hash)).toBe('')
})

test('deux ouvertures rapides donnent une seule fenêtre, accordée à l’adresse', async ({ page }) => {
  await page.evaluate(() => {
    document.querySelector<HTMLElement>('.project[data-project="spot"] .project__open')?.click()
    document.querySelector<HTMLElement>('.project[data-project="parking"] .project__open')?.click()
  })
  await expect(dialog(page)).toHaveCount(1)
  const hash = await page.evaluate(() => window.location.hash)
  await expect(dialog(page, hash === '#projet-parking' ? PARKING : SPOT)).toBeVisible()
})

test('une arrivée directe sur l’adresse d’une étude de cas l’ouvre', async ({ page }) => {
  await page.goto('./#projet-embedded')
  await expect(dialog(page, EMBEDDED)).toBeVisible()
})
