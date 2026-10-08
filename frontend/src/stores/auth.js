import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { api } from '../services/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('auth_user') || 'null'))
  const token = ref(localStorage.getItem('auth_token'))
  const loading = ref(false)

  const isAuthenticated = computed(() => Boolean(token.value && user.value))
  const isAdmin = computed(() => user.value?.role === 'admin')

  function persist(nextUser, nextToken) {
    user.value = nextUser
    token.value = nextToken
    localStorage.setItem('auth_user', JSON.stringify(nextUser))
    localStorage.setItem('auth_token', nextToken)
  }

  async function register(payload) {
    loading.value = true
    try {
      const { data } = await api.post('/register', payload)
      persist(data.user, data.token)
    } finally {
      loading.value = false
    }
  }

  async function login(payload) {
    loading.value = true
    try {
      const { data } = await api.post('/login', payload)
      persist(data.user, data.token)
    } finally {
      loading.value = false
    }
  }

  async function fetchUser() {
    if (!token.value) return
    const { data } = await api.get('/user')
    user.value = data.user
    localStorage.setItem('auth_user', JSON.stringify(data.user))
  }

  async function logout() {
    if (token.value) {
      await api.post('/logout').catch(() => null)
    }
    user.value = null
    token.value = null
    localStorage.removeItem('auth_user')
    localStorage.removeItem('auth_token')
  }

  return { user, token, loading, isAuthenticated, isAdmin, register, login, fetchUser, logout }
})
