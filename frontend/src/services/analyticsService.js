import { api } from './api'

export const analyticsService = {
  async show(pageId) {
    const { data } = await api.get(`/pages/${pageId}/analytics`)
    return data.data
  },
}
