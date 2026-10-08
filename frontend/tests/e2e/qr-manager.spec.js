import { expect, test } from '@playwright/test'
import { login, mockApi } from './helpers'

test('user opens QR manager, generates QR cards, and downloads a PNG', async ({ page }) => {
  await mockApi(page)
  await login(page)

  await page.goto('/qr-codes?page=1')
  await expect(page.getByText('Generate and Download QR Codes')).toBeVisible()
  await expect(page.getByText('Main profile QR target URL')).toBeVisible()
  await expect(page.getByTestId('main-qr-target')).toContainText('http://192.168.1.184:5173/p/techzone')
  await expect(page.getByRole('heading', { name: 'Main Profile QR' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'WhatsApp QR' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Google Maps QR' })).toBeVisible()

  const download = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Download PNG' }).first().click()
  expect((await download).suggestedFilename()).toBe('main.png')
})
