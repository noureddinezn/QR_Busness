export function exportProfileConfig(profile) {
  return JSON.stringify(
    {
      title: profile.title,
      slug: profile.slug,
      bio: profile.bio,
      theme: profile.theme,
      primary_color: profile.primary_color,
      secondary_color: profile.secondary_color,
      links: profile.links || [],
    },
    null,
    2,
  )
}

export function importProfileConfig(json) {
  const parsed = JSON.parse(json)

  if (!parsed.title || !parsed.slug || !Array.isArray(parsed.links)) {
    throw new Error('Invalid profile configuration')
  }

  return parsed
}
