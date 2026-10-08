import { publicProfileUrl } from '../config/publicUrl'

export function normalizeMoroccanPhone(value) {
  const digits = String(value || '').replace(/\D+/g, '')

  if (digits.startsWith('212')) return digits
  if (digits.startsWith('0')) return `212${digits.slice(1)}`
  if (digits.length === 9) return `212${digits}`

  return digits
}

export function buildWhatsAppUrl(value) {
  if (String(value || '').startsWith('http')) return value

  return `https://wa.me/${normalizeMoroccanPhone(value)}`
}

export function buildMapsUrl(value) {
  if (String(value || '').startsWith('http')) return value

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(value)}`
}

export function buildQrTarget({ type, url }, page) {
  if (type === 'main') return publicProfileUrl(page.slug)
  if (type === 'whatsapp') return buildWhatsAppUrl(url)
  if (type === 'maps') return buildMapsUrl(url)
  if (type === 'phone') return String(url).startsWith('tel:') ? url : `tel:${url}`
  if (type === 'email') return String(url).startsWith('mailto:') ? url : `mailto:${url}`

  return url
}
