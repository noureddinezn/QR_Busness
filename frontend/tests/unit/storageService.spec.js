import { describe, expect, it } from 'vitest'
import { loadJson, removeItem, saveJson } from '../../src/utils/storage'

describe('storage helpers', () => {
  it('saves and restores JSON values', () => {
    saveJson('profile', { slug: 'techzone', links: 2 })

    expect(loadJson('profile')).toEqual({ slug: 'techzone', links: 2 })
  })

  it('returns fallback for missing or corrupted values', () => {
    localStorage.setItem('broken', '{')

    expect(loadJson('missing', { empty: true })).toEqual({ empty: true })
    expect(loadJson('broken', { empty: true })).toEqual({ empty: true })
  })

  it('removes stored values', () => {
    saveJson('profile', { slug: 'techzone' })
    removeItem('profile')

    expect(loadJson('profile')).toBe(null)
  })
})
