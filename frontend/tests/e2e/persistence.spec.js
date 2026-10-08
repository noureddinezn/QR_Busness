import { expect, test } from '@playwright/test'
import { login, mockApi } from './helpers'

test('auth state survives refresh and public profile links can be opened', async ({ page, context }) => {
  await mockApi(page)
  await page.route('https://wa.me/**', (route) =>
    route.fulfill({ body: '<html><title>WhatsApp</title><body>WhatsApp opened</body></html>' }),
  )
  await login(page)

  await page.reload()
  await expect(page.getByText('Welcome, Demo Owner')).toBeVisible()

  await page.goto('/p/techzone')
  await expect(page.getByRole('heading', { name: 'TechZone' })).toBeVisible()

  await page.getByRole('button', { name: /WhatsApp/i }).first().click()
  await expect(page).toHaveURL(/wa\.me/)
})
