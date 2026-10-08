import { describe, expect, it } from 'vitest'
import { exportProfileConfig, importProfileConfig } from '../../src/utils/profileConfig'

describe('profile import/export', () => {
  it('exports and restores a profile configuration', () => {
    const profile = {
      title: 'TechZone',
      slug: 'techzone',
      bio: 'Phone store',
      theme: 'black-gold',
      primary_color: '#d4af37',
      secondary_color: '#111827',
      links: [{ title: 'WhatsApp', type: 'whatsapp', url: '+212600000000' }],
    }

    const exported = exportProfileConfig(profile)
    const restored = importProfileConfig(exported)

    expect(restored).toEqual(profile)
  })

  it('rejects invalid profile configuration', () => {
    expect(() => importProfileConfig('{"title":"Broken"}')).toThrow('Invalid profile configuration')
  })
})
