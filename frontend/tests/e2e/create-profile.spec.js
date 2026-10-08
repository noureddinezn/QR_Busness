import { expect, test } from '@playwright/test'
import { login, mockApi } from './helpers'

test('user edits profile information, adds links, selects a theme, and sees live preview update', async ({ page }) => {
  await mockApi(page)
  await login(page)

  await page.goto('/pages/1/edit')
  await expect(page.getByText('Create & Customize Your Profile')).toBeVisible()
  await expect(page.getByText('TechZone').first()).toBeVisible()

  await page.getByLabel('Name').fill('Barber Pro')
  await page.getByLabel('Bio').fill('Bookings, location, and WhatsApp support.')
  await page.getByRole('button', { name: 'Moroccan' }).click()

  await expect(page.getByText('Barber Pro').last()).toBeVisible()
  await expect(page.getByText('Bookings, location, and WhatsApp support.')).toBeVisible()

  await page.getByRole('button', { name: '+ Add Link' }).click()
  await page.getByLabel('Type').selectOption('website')
  await page.getByLabel('Title').fill('Website')
  await page.getByLabel('URL / phone / email / maps link').fill('https://example.com')
  await page.getByRole('button', { name: 'Save link' }).click()

  await expect(page.getByText('Website').first()).toBeVisible()
})

test('user generates AI suggestions, approves them, and sees the live preview update', async ({ page }) => {
  await mockApi(page)
  await login(page)

  await page.goto('/pages/1/edit')
  await page.getByRole('button', { name: 'Generate with AI' }).click()

  await page.getByLabel('Business type').fill('Phone Store')
  await page.getByLabel('Business name').fill('TechZone')
  await page.getByLabel('Short description').fill('Smartphones, accessories and repair')
  await page.getByRole('button', { name: 'Generate My Design' }).click()

  await expect(page.getByRole('heading', { name: 'TechZone Premium', level: 3 })).toBeVisible()
  await expect(page.getByText('Premium black and gold phone store interior')).toBeVisible()

  await page.getByRole('button', { name: 'Apply All' }).click()

  await expect(page.getByText('AI suggestions applied to the editor.')).toBeVisible()
  await expect(page.getByText('TechZone Premium').last()).toBeVisible()
  await expect(page.getByText('Commander sur WhatsApp').first()).toBeVisible()
})
