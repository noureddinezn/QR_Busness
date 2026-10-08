import { expect, test } from '@playwright/test'
import { mockApi } from './helpers'

const viewports = [
  { width: 320, height: 568 },
  { width: 360, height: 640 },
  { width: 375, height: 667 },
  { width: 390, height: 844 },
  { width: 393, height: 873 },
  { width: 412, height: 915 },
  { width: 430, height: 932 },
  { width: 768, height: 900 },
  { width: 1024, height: 900 },
  { width: 1440, height: 900 },
]

for (const viewport of viewports) {
  test(`public profile has no horizontal overflow at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport)
    await mockApi(page)

    await page.goto('/p/techzone')

    await expect(page.getByRole('heading', { name: 'TechZone' })).toBeVisible()
    await expect(page.getByRole('button', { name: /WhatsApp/i }).first()).toBeVisible()
    await expect(page.getByTestId('location-section')).toBeVisible()

    const dimensions = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      bodyScrollWidth: document.body.scrollWidth,
      bodyClientWidth: document.body.clientWidth,
    }))

    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth)
    expect(dimensions.bodyScrollWidth).toBeLessThanOrEqual(dimensions.bodyClientWidth)
  })
}
