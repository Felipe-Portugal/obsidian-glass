import { devices, expect, test } from '@playwright/test'

/**
 * Le site dans une autre combinaison que celle des autres tests : téléphone (écran tactile),
 * anglais choisi par le navigateur et thème clair choisi par le système.
 */
test.use({ ...devices['Pixel 7'], channel: 'chrome', locale: 'en-CA', colorScheme: 'light' })

test.beforeEach(async ({ page }) => {
  await page.goto('./')
  await expect(page.locator('#root .app')).toBeVisible()
})

test('anglais et thème clair suivent les préférences du navigateur, sans débordement', async ({ page }) => {
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  await expect(page.getByRole('heading', { level: 2, name: 'Projects' })).toBeVisible()

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  expect(overflow).toBeLessThanOrEqual(0)
  const dock = await page.locator('.dock').boundingBox()
  const width = page.viewportSize()?.width ?? 0
  expect(dock && dock.x >= 0 && dock.x + dock.width <= width).toBe(true)
})

test('une étude de cas s’ouvre en feuille et se referme', async ({ page }) => {
  await page.getByRole('button', { name: /Open the case study\s*: Parking management/ }).click()
  const sheet = page.getByRole('dialog', { name: 'Parking management' })
  await expect(sheet).toBeVisible()
  await expect.poll(() => page.evaluate(() => window.location.hash)).toBe('#projet-parking')
  await page.keyboard.press('Escape')
  await expect(sheet).toHaveCount(0)
})

test('le portrait s’ouvre en anglais', async ({ page }) => {
  await page.getByRole('button', { name: 'Read my profile' }).click()
  const about = page.getByRole('dialog', { name: 'About me' })
  await expect(about.getByRole('heading', { name: 'Why university' })).toBeVisible()
  await expect(about.getByRole('heading', { name: 'What I am passionate about' })).toBeVisible()
})
