export function saveJson(key, value, storage = localStorage) {
  storage.setItem(key, JSON.stringify(value))
}

export function loadJson(key, fallback = null, storage = localStorage) {
  const raw = storage.getItem(key)
  if (!raw) return fallback

  try {
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function removeItem(key, storage = localStorage) {
  storage.removeItem(key)
}
