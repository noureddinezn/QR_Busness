<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()
const error = ref('')
const form = reactive({ email: 'demo@example.com', password: 'password123' })

async function submit() {
  error.value = ''
  try {
    await auth.login(form)
    router.push('/dashboard')
  } catch (e) {
    error.value = e.response?.data?.message || 'Login failed.'
  }
}
</script>

<template>
  <main class="flex min-h-screen items-center justify-center bg-slate-100 px-4">
    <form class="w-full max-w-md rounded-lg bg-white p-6 shadow-sm" @submit.prevent="submit">
      <h1 class="text-2xl font-bold text-slate-950">Welcome back</h1>
      <p class="mt-2 text-sm text-slate-500">Use demo@example.com / password123</p>
      <p v-if="error" class="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{{ error }}</p>
      <label class="mt-5 block text-sm font-medium">Email<input v-model="form.email" class="mt-1 w-full rounded-md border px-3 py-2" type="email" /></label>
      <label class="mt-4 block text-sm font-medium">Password<input v-model="form.password" class="mt-1 w-full rounded-md border px-3 py-2" type="password" /></label>
      <button class="mt-6 w-full rounded-md bg-slate-950 px-4 py-3 font-semibold text-white">Login</button>
      <RouterLink class="mt-4 block text-center text-sm font-semibold text-emerald-700" to="/register">Create account</RouterLink>
    </form>
  </main>
</template>
