import { describe, expect, it } from 'vitest'
import { canAddLink, reorderLinks, toggleLink } from '../../src/utils/linkRules'

describe('link business rules', () => {
  const links = [
    { id: 1, type: 'whatsapp', title: 'WhatsApp', url: '+212600000000', position: 0, is_active: true },
    { id: 2, type: 'instagram', title: 'Instagram', url: 'https://instagram.com/techzone', position: 1, is_active: true },
  ]

  it('allows a valid non-duplicate link', () => {
    expect(canAddLink(links, { type: 'website', title: 'Website', url: 'https://example.com' })).toEqual({ ok: true })
  })

  it('rejects invalid links and duplicate links', () => {
    expect(canAddLink(links, { type: 'website', title: '', url: 'https://example.com' })).toEqual({
      ok: false,
      reason: 'invalid',
    })
    expect(canAddLink(links, { type: 'whatsapp', title: 'Other WA', url: '+212600000000' })).toEqual({
      ok: false,
      reason: 'duplicate',
    })
  })

  it('toggles link active state immutably', () => {
    const toggled = toggleLink(links[0])

    expect(toggled.is_active).toBe(false)
    expect(links[0].is_active).toBe(true)
  })

  it('reorders links and recalculates positions', () => {
    const reordered = reorderLinks(links, 2, -1)

    expect(reordered.map((link) => link.id)).toEqual([2, 1])
    expect(reordered.map((link) => link.position)).toEqual([0, 1])
  })
})
