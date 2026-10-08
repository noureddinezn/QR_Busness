export const LOCALHOST_QR_WARNING =
  "localhost URLs cannot be opened from another device. Use your computer's LAN IP."

export function getPublicAppUrl() {
  const configuredUrl = import.meta.env.VITE_PUBLIC_APP_URL || window.location.origin

  return String(configuredUrl).replace(/\/+$/, '')
}

export function publicProfileUrl(slug) {
  return `${getPublicAppUrl()}/p/${encodeURIComponent(slug || '')}`
}

export function isLocalhostPublicUrl(url = getPublicAppUrl()) {
  try {
    const hostname = new URL(url).hostname

    return ['localhost', '127.0.0.1', '::1'].includes(hostname)
  } catch {
    return String(url).includes('localhost')
  }
}
