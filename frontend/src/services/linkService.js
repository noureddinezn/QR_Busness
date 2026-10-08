import { api, publicApi } from './api'

export const linkService = {
  async create(pageId, payload) {
    const { data } = await api.post(`/pages/${pageId}/links`, payload)
    return data.data
  },
  async update(id, payload) {
    const { data } = await api.put(`/links/${id}`, payload)
    return data.data
  },
  async remove(id) {
    return api.delete(`/links/${id}`)
  },
  async position(id, position) {
    const { data } = await api.patch(`/links/${id}/position`, { position })
    return data.data
  },
  async click(id) {
    const { data } = await publicApi.post(`/links/${id}/click`)
    return data.target_url
  },
}
