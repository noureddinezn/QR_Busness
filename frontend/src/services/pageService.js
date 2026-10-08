import { api, publicApi, assetUrl } from './api'

function toFormData(data) {
  const form = new FormData()

  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) return
    if (key === 'links') return
    if (key.endsWith('_url')) return
    if (key === 'logo' && typeof value === 'string') return
    if (key === 'cover_image' && typeof value === 'string') return
    if (typeof value === 'boolean') {
      form.append(key, value ? '1' : '0')
      return
    }
    form.append(key, value)
  })

  return form
}

export const pageService = {
  async list() {
    const { data } = await api.get('/pages')
    return data.data
  },
  async get(id) {
    const { data } = await api.get(`/pages/${id}`)
    return data.data
  },
  async create(payload) {
    const { data } = await api.post('/pages', toFormData(payload))
    return data.data
  },
  async update(id, payload) {
    const form = toFormData(payload)
    form.append('_method', 'PUT')
    const { data } = await api.post(`/pages/${id}`, form)
    return data.data
  },
  async remove(id) {
    return api.delete(`/pages/${id}`)
  },
  async publicBySlug(slug, options = {}) {
    const { data } = await publicApi.get(`/public/pages/${encodeURIComponent(slug)}`, options)
    return { ...data.data, logo_url: assetUrl(data.data.logo_url), cover_image_url: assetUrl(data.data.cover_image_url) }
  },
}
