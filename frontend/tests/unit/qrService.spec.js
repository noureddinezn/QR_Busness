import { describe, expect, it } from 'vitest'
import { publicProfileUrl } from '../../src/config/publicUrl'
import { buildMapsUrl, buildQrTarget, buildWhatsAppUrl, normalizeMoroccanPhone } from '../../src/utils/qrTargets'

describe('QR target helpers', () => {
  it('normalizes Moroccan phone numbers to international format', () => {
    expect(normalizeMoroccanPhone('06 12 34 56 78')).toBe('212612345678')
    expect(normalizeMoroccanPhone('+212 6 12 34 56 78')).toBe('212612345678')
    expect(normalizeMoroccanPhone('612345678')).toBe('212612345678')
  })

  it('generates a WhatsApp URL from a Moroccan phone number', () => {
    expect(buildWhatsAppUrl('0612345678')).toBe('https://wa.me/212612345678')
  })

  it('keeps an existing WhatsApp HTTP URL unchanged', () => {
    expect(buildWhatsAppUrl('https://wa.me/212612345678')).toBe('https://wa.me/212612345678')
  })

  it('generates a Google Maps search URL from an address', () => {
    expect(buildMapsUrl('Avenue Hassan II Safi')).toBe(
      'https://www.google.com/maps/search/?api=1&query=Avenue%20Hassan%20II%20Safi',
    )
  })

  it('builds QR targets by QR/link type', () => {
    const page = { slug: 'techzone', public_url: 'http://localhost:5173/p/techzone' }

    expect(buildQrTarget({ type: 'main' }, page)).toBe(publicProfileUrl('techzone'))
    expect(buildQrTarget({ type: 'phone', url: '+212600000000' }, page)).toBe('tel:+212600000000')
    expect(buildQrTarget({ type: 'email', url: 'hello@example.com' }, page)).toBe('mailto:hello@example.com')
  })
})
