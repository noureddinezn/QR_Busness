import axios from 'axios'
import { apiBaseUrl, resolveAssetUrl } from '../config/network'

export const api = axios.create({
  baseURL: apiBaseUrl(),
  timeout: 15000,
  headers: {
    Accept: 'application/json',
  },
})

// Public visitors do not need credentials, preflight authorization, or login redirects.
export const publicApi = axios.create({
  baseURL: apiBaseUrl(),
  timeout: 10000,
  headers: { Accept: 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')

      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  },
)

export function assetUrl(path) {
  return resolveAssetUrl(path)
}
