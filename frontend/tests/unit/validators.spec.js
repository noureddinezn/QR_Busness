import { describe, expect, it } from 'vitest'
import { isValidEmail, isValidLink, isValidUrl, slugify } from '../../src/utils/validators'

describe('validators', () => {
  it('validates email addresses', () => {
    expect(isValidEmail('owner@example.com')).toBe(true)
    expect(isValidEmail('owner@')).toBe(false)
  })

  it('validates supported URL protocols', () => {
    expect(isValidUrl('https://example.com')).toBe(true)
    expect(isValidUrl('ftp://example.com')).toBe(false)
    expect(isValidUrl('not-a-url')).toBe(false)
  })

  it('validates links depending on their type', () => {
    expect(isValidLink({ type: 'website', title: 'Site', url: 'https://example.com' })).toBe(true)
    expect(isValidLink({ type: 'whatsapp', title: 'WA', url: '+212600000000' })).toBe(true)
    expect(isValidLink({ type: 'email', title: 'Email', url: 'bad-email' })).toBe(false)
    expect(isValidLink({ type: 'website', title: '', url: 'https://example.com' })).toBe(false)
  })

  it('normalizes text into a valid slug', () => {
    expect(slugify('Developement Web')).toBe('developement-web')
    expect(slugify(' noureddine_ZOUANA 2026!! ')).toBe('noureddine_zouana-2026')
  })
})
