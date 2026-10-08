<script setup>
import { useAuthStore } from '../../stores/auth'
import AppIcon from '../AppIcon.vue'

const auth = useAuthStore()

const links = [
  ['Home', '/dashboard', 'home'],
  ['Editor', '/pages', 'edit'],
  ['QR Manager', '/qr-codes', 'qr'],
  ['Analytics', '/analytics', 'analytics'],
  ['Settings', '/settings', 'settings'],
]
</script>

<template>
  <aside class="hidden min-h-screen w-64 shrink-0 bg-[#090d18] p-5 text-white shadow-2xl lg:flex lg:flex-col">
    <RouterLink to="/" class="flex items-center gap-3 text-xl font-black">
      <span class="grid h-9 w-9 place-items-center rounded-lg bg-indigo-600 text-lg"><AppIcon name="qr" /></span>
      QRProfile
    </RouterLink>
    <nav class="mt-8 flex-1 space-y-2">
      <RouterLink
        v-for="[label, path, icon] in links"
        :key="path"
        :to="path"
        class="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
        active-class="bg-indigo-600/80 text-white shadow-lg shadow-indigo-950/30"
      >
        <span class="grid h-7 w-7 place-items-center rounded-lg bg-white/10 text-sm"><AppIcon :name="icon" /></span>
        {{ label }}
      </RouterLink>
      <RouterLink
        v-if="auth.isAdmin"
        to="/admin"
        class="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
        active-class="bg-indigo-600/80 text-white"
      >
        <span class="grid h-7 w-7 place-items-center rounded-lg bg-white/10 text-xs">A</span>
        Admin
      </RouterLink>
    </nav>
    <div class="rounded-2xl bg-white/10 p-4">
      <p class="text-sm font-semibold">{{ auth.user?.name }}</p>
      <div class="mt-2 text-xs text-slate-400">
        {{ auth.user?.email }}
      </div>
    </div>
  </aside>
</template>
