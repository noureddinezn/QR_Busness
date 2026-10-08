export function apiBaseUrl(configured = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL, origin = window.location.origin) {
  const current = new URL(origin)
  const url = new URL(configured || '/api', current)
  if (['localhost', '127.0.0.1', '[::1]'].includes(url.hostname) &&
      !['localhost', '127.0.0.1', '[::1]'].includes(current.hostname)) {
    url.hostname = current.hostname
  }
  return url.href.replace(/\/+$/, '')
}

export function resolveAssetUrl(path, base = apiBaseUrl()) {
  if (!path) return null
  const root = new URL(base, window.location.origin)
  const url = new URL(path, root.origin)
  if (['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)) {
    url.host = root.host
    url.protocol = root.protocol
  }
  return url.href
}
