import { isValidLink } from './validators'

export function canAddLink(links, candidate) {
  if (!isValidLink(candidate)) {
    return { ok: false, reason: 'invalid' }
  }

  const duplicate = links.some(
    (link) =>
      link.type === candidate.type &&
      String(link.url).trim().toLowerCase() === String(candidate.url).trim().toLowerCase(),
  )

  if (duplicate) {
    return { ok: false, reason: 'duplicate' }
  }

  return { ok: true }
}

export function toggleLink(link) {
  return { ...link, is_active: !link.is_active }
}

export function reorderLinks(links, linkId, direction) {
  const ordered = [...links].sort((a, b) => a.position - b.position)
  const index = ordered.findIndex((link) => link.id === linkId)
  const target = index + direction

  if (index < 0 || target < 0 || target >= ordered.length) return ordered

  const [item] = ordered.splice(index, 1)
  ordered.splice(target, 0, item)

  return ordered.map((link, position) => ({ ...link, position }))
}
