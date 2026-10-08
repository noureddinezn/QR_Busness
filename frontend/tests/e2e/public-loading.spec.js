import { test, expect } from '@playwright/test'
import { mockApi } from './helpers'

test('shows loading while API waits, error on failure, and supports retry', async ({ page }) => {
  await mockApi(page)
  let fail = true
  await page.route('**/api/public/pages/techzone', async route => {
    if (fail) {
      await new Promise(resolve => setTimeout(resolve, 1200))
      return route.fulfill({ status: 503, json: { message: 'Unavailable' } })
    }
    return route.fallback()
  })
  await page.goto('/p/techzone')
  await expect(page.getByRole('status')).toContainText('Loading profile')
  await expect(page.getByRole('alert')).toContainText('Unable to load this profile')
  fail = false
  await page.getByRole('button', { name: 'Try again' }).click()
  await expect(page.locator('.digital-profile h1')).toHaveText('TechZone')
})

test('public request times out instead of leaving a blank page', async ({ page }) => {
  await page.route('**/api/public/pages/techzone', () => {})
  await page.goto('/p/techzone')
  await expect(page.getByRole('status')).toContainText('Loading profile')
  await expect(page.getByRole('alert')).toContainText('Unable to load this profile', { timeout: 13000 })
})

test('HTML loading feedback is present even when the JavaScript bundle cannot load', async ({ page }) => {
  await page.route('**/*', route => route.request().resourceType() === 'script' ? route.abort() : route.continue())
  await page.goto('/p/techzone')
  await expect(page.locator('#boot-message')).toContainText('Loading profile')
})

test('public requests do not send a stored dashboard token or redirect to login', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('auth_token', 'expired'))
  let authorization
  await page.route('**/api/public/pages/techzone', route => {
    authorization = route.request().headers().authorization
    return route.fulfill({ status: 401, json: { message: 'Unauthenticated' } })
  })
  await page.goto('/p/techzone')
  await expect(page.getByRole('alert')).toContainText('Unable to load')
  expect(authorization).toBeUndefined()
  expect(page.url()).toContain('/p/techzone')
})
