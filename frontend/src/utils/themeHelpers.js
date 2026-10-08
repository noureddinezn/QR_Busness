export const themes = ['black-gold', 'minimal-white', 'modern-dark', 'moroccan', 'business']

export function normalizeTheme(theme) {
  return themes.includes(theme) ? theme : 'minimal-white'
}

export function themeButtonClass(theme) {
  return {
    'black-gold': 'gold',
    'minimal-white': 'dark',
    'modern-dark': 'light',
    moroccan: 'emerald-gold',
    business: 'blue',
  }[normalizeTheme(theme)]
}
