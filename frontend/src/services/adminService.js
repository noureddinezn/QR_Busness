import { api } from './api'

export const adminService = {
  async stats() {
    const { data } = await api.get('/admin/stats')
    return data.data
  },
  async users() {
    const { data } = await api.get('/admin/users')
    return data.data
  },
  async pages() {
    const { data } = await api.get('/admin/pages')
    return data.data
  },
  async setUserStatus(id, is_active) {
    const { data } = await api.patch(`/admin/users/${id}/status`, { is_active })
    return data.data
  },
  async setPageStatus(id, is_active) {
    const { data } = await api.patch(`/admin/pages/${id}/status`, { is_active })
    return data.data
  },
}
