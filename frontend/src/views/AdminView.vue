<script setup>
import { onMounted, ref } from 'vue'
import DashboardLayout from '../components/layout/DashboardLayout.vue'
import StatCard from '../components/ui/StatCard.vue'
import { adminService } from '../services/adminService'

const stats = ref(null)
const users = ref([])
const pages = ref([])

async function load() {
  stats.value = await adminService.stats()
  users.value = await adminService.users()
  pages.value = await adminService.pages()
}

async function toggleUser(user) {
  await adminService.setUserStatus(user.id, !user.is_active)
  await load()
}

async function togglePage(page) {
  await adminService.setPageStatus(page.id, !page.is_active)
  await load()
}

onMounted(load)
</script>

<template>
  <DashboardLayout>
    <h1 class="mb-6 text-2xl font-bold text-slate-950">Admin Panel</h1>
    <div v-if="stats" class="grid gap-4 md:grid-cols-4">
      <StatCard label="Users" :value="stats.total_users" />
      <StatCard label="Pages" :value="stats.total_pages" />
      <StatCard label="Scans" :value="stats.total_scans" />
      <StatCard label="Clicks" :value="stats.total_link_clicks" />
    </div>
    <div class="mt-6 grid gap-6 xl:grid-cols-2">
      <section class="rounded-lg border bg-white p-5 shadow-sm">
        <h2 class="font-semibold">Users</h2>
        <div class="mt-4 space-y-3">
          <div v-for="user in users" :key="user.id" class="flex items-center justify-between rounded-md bg-slate-50 p-3 text-sm">
            <span>{{ user.name }} · {{ user.email }} · {{ user.role }}</span>
            <button class="rounded border px-3 py-1" @click="toggleUser(user)">{{ user.is_active ? 'Disable' : 'Enable' }}</button>
          </div>
        </div>
      </section>
      <section class="rounded-lg border bg-white p-5 shadow-sm">
        <h2 class="font-semibold">Pages</h2>
        <div class="mt-4 space-y-3">
          <div v-for="page in pages" :key="page.id" class="flex items-center justify-between rounded-md bg-slate-50 p-3 text-sm">
            <span>{{ page.title }} · {{ page.user?.email }}</span>
            <button class="rounded border px-3 py-1" @click="togglePage(page)">{{ page.is_active ? 'Disable' : 'Enable' }}</button>
          </div>
        </div>
      </section>
    </div>
  </DashboardLayout>
</template>
