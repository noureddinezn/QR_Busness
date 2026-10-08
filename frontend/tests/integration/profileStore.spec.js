import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuthStore } from '../../src/stores/auth'
import { api } from '../../src/services/api'

describe('auth store + localStorage integration', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('persists user and token after login', async () => {
    vi.spyOn(api, 'post').mockResolvedValue({
      data: {
        user: { id: 1, name: 'Demo Owner', email: 'demo@example.com', role: 'user' },
        token: 'token-123',
      },
    })

    const auth = useAuthStore()
    await auth.login({ email: 'demo@example.com', password: 'password123' })

    expect(auth.isAuthenticated).toBe(true)
    expect(localStorage.getItem('auth_token')).toBe('token-123')
    expect(JSON.parse(localStorage.getItem('auth_user')).email).toBe('demo@example.com')
  })

  it('clears user and token on logout', async () => {
    vi.spyOn(api, 'post').mockResolvedValue({ data: {} })
    localStorage.setItem('auth_token', 'token-123')
    localStorage.setItem('auth_user', JSON.stringify({ id: 1, role: 'user' }))

    const auth = useAuthStore()
    await auth.logout()

    expect(auth.isAuthenticated).toBe(false)
    expect(localStorage.getItem('auth_token')).toBe(null)
  })
})
