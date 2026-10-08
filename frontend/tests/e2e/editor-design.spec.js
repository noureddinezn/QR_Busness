import { test, expect } from '@playwright/test'
import { login, mockApi } from './helpers'

test('editor applies colors, hides disabled links, and rejects AI changes until approval', async ({ page }) => {
  await mockApi(page)
  await login(page)
  await page.goto('/pages/1/edit')
  await page.getByRole('switch', { name: 'Enable WhatsApp' }).click()
  await expect(page.locator('.phone-screen .public-link.whatsapp')).toHaveCount(0)
  await page.getByRole('switch', { name: 'Enable WhatsApp' }).click()
  await expect(page.locator('.phone-screen .public-link.whatsapp')).toHaveCount(1)
  await page.getByLabel('Background color', { exact: true }).fill('#123456')
  await expect(page.locator('.phone-screen .digital-profile')).toHaveCSS('background-color', 'rgb(18, 52, 86)')
  await page.getByRole('button', { name: 'Generate with AI' }).click()
  await page.getByLabel('Business type').fill('Developer')
  await page.getByRole('button', { name: 'Generate My Design' }).click()
  await expect(page.getByRole('heading', { name: 'TechZone Premium', level: 3 })).toBeVisible()
  await expect(page.locator('.phone-screen h1').first()).toHaveText('TechZone')
  await page.getByRole('button', { name: 'Cancel', exact: true }).click()
  await expect(page.getByLabel('Name', { exact: true })).toHaveValue('TechZone')
})

for (const width of [320, 390, 768, 1440]) {
  test('editor fits viewport ' + width, async ({ page }) => {
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    await page.setViewportSize({ width, height: 1000 })
    await mockApi(page)
    await login(page)
    await page.goto('/pages/1/edit')
    await expect(page.locator('.phone-screen h1')).toHaveText('TechZone')
    await expect(page.getByRole('button', { name: 'Save page & links' })).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
    expect(errors).toEqual([])
    await page.screenshot({ path: 'test-results/editor-' + width + '.png', fullPage: true })
  })
}
