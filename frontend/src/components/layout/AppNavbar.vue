<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const auth = useAuthStore()
const router = useRouter()

async function logout() {
  await auth.logout()
  router.push('/login')
}
</script>

<template>
  <header class="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200/80 bg-white/85 px-4 py-3 backdrop-blur sm:px-6">
    <div>
      <p class="text-xs font-black uppercase tracking-wide text-indigo-600">Universal QR Platform</p>
      <h1 class="text-lg font-black text-slate-950">Workspace</h1>
    </div>
    <div class="flex items-center gap-3">
      <span class="hidden rounded-full bg-slate-100 px-3 py-2 text-sm font-bold text-slate-600 sm:inline">{{ auth.user?.name }}</span>
      <button class="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold hover:bg-slate-50" @click="logout">
        Logout
      </button>
    </div>
  </header>
</template>
