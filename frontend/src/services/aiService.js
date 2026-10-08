import { api } from './api'

export const aiService = {
  async generateDesign(payload) {
    const { data } = await api.post('/ai/design', payload)
    return data.data
  },
  async generateImage(prompt) {
    const { data } = await api.post('/ai/image', { prompt })
    return data.image_url
  },
  async generateContent(payload) {
    const { data } = await api.post('/ai/content', payload)
    return data.data
  },
}
