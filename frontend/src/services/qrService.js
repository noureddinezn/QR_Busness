import { api } from './api'

export const qrService = {
  async list(pageId) {
    const { data } = await api.get(`/pages/${pageId}/qr`)
    return data.data
  },
  async generate(pageId) {
    const { data } = await api.post(`/pages/${pageId}/qr/generate`)
    return data.data
  },
}
