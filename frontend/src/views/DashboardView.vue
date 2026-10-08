<script setup>
import { computed, onMounted } from 'vue'
import DashboardLayout from '../components/layout/DashboardLayout.vue'
import StatCard from '../components/ui/StatCard.vue'
import EmptyState from '../components/ui/EmptyState.vue'
import { usePagesStore } from '../stores/pages'
import { useAuthStore } from '../stores/auth'

const pagesStore = usePagesStore()
const auth = useAuthStore()
const totalScans = computed(() => pagesStore.pages.reduce((sum, page) => sum + (page.scans_count || 0), 0))

onMounted(pagesStore.fetchPages)
</script>

<template>
  <DashboardLayout>
    <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-950">Welcome, {{ auth.user?.name }}</h1>
        <p class="mt-1 text-sm text-slate-500">Manage your QR profiles, links, QR codes, and analytics.</p>
      </div>
      <RouterLink class="rounded-md bg-emerald-600 px-4 py-2 font-semibold text-white" to="/pages/create">Create page</RouterLink>
    </div>
    <div class="grid gap-4 md:grid-cols-3">
      <StatCard label="Pages" :value="pagesStore.pages.length" />
      <StatCard label="Total scans" :value="totalScans" />
      <StatCard label="Active profiles" :value="pagesStore.pages.filter((p) => p.is_active).length" />
    </div>
    <section class="mt-8">
      <h2 class="mb-4 text-lg font-semibold">Recent pages</h2>
      <EmptyState v-if="!pagesStore.pages.length" title="No pages yet" message="Create your first digital profile to generate a stable QR code.">
        <RouterLink class="rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white" to="/pages/create">Create page</RouterLink>
      </EmptyState>
      <div v-else class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <RouterLink v-for="page in pagesStore.pages.slice(0, 6)" :key="page.id" :to="`/pages/${page.id}/edit`" class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md">
          <p class="text-xs font-semibold uppercase text-emerald-700">{{ page.theme }}</p>
          <h3 class="mt-2 text-lg font-semibold text-slate-950">{{ page.title }}</h3>
          <p class="mt-1 text-sm text-slate-500">/{{ page.slug }} · {{ page.links_count || page.links?.length || 0 }} links</p>
        </RouterLink>
      </div>
    </section>
  </DashboardLayout>
</template>
