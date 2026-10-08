export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim())
}

export function isValidUrl(value) {
  try {
    const url = new URL(value)
    return ['http:', 'https:', 'mailto:', 'tel:'].includes(url.protocol)
  } catch {
    return false
  }
}

export function isValidLink(link) {
  if (!link?.title?.trim() || !link?.url?.trim()) return false

  if (link.type === 'email') return isValidEmail(link.url.replace(/^mailto:/, ''))
  if (link.type === 'phone' || link.type === 'whatsapp') return /\d{8,}/.test(link.url)

  return isValidUrl(link.url)
}

export function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}
