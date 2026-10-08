<script setup>
import { onMounted } from 'vue'
import DashboardLayout from '../components/layout/DashboardLayout.vue'
import EmptyState from '../components/ui/EmptyState.vue'
import { usePagesStore } from '../stores/pages'
import { pageService } from '../services/pageService'

const store = usePagesStore()

async function remove(page) {
  if (!confirm(`Delete ${page.title}?`)) return
  await pageService.remove(page.id)
  await store.fetchPages()
}

onMounted(store.fetchPages)
</script>

<template>
  <DashboardLayout>
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-bold text-slate-950">My Pages</h1>
      <RouterLink class="rounded-md bg-emerald-600 px-4 py-2 font-semibold text-white" to="/pages/create">Create page</RouterLink>
    </div>
    <EmptyState v-if="!store.pages.length" title="No pages" message="Start with one public profile page." />
    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <article v-for="page in store.pages" :key="page.id" class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div class="flex items-start justify-between">
          <div>
            <h2 class="text-lg font-semibold text-slate-950">{{ page.title }}</h2>
            <p class="text-sm text-slate-500">/p/{{ page.slug }}</p>
          </div>
          <span :class="['rounded-full px-2 py-1 text-xs font-semibold', page.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500']">{{ page.is_active ? 'Active' : 'Inactive' }}</span>
        </div>
        <p class="mt-3 line-clamp-2 text-sm text-slate-500">{{ page.bio }}</p>
        <div class="mt-5 flex flex-wrap gap-2">
          <RouterLink class="rounded-md border px-3 py-2 text-sm font-semibold" :to="`/pages/${page.id}/edit`">Edit</RouterLink>
          <RouterLink class="rounded-md border px-3 py-2 text-sm font-semibold" :to="`/qr-codes?page=${page.id}`">QR</RouterLink>
          <a class="rounded-md border px-3 py-2 text-sm font-semibold" :href="`/p/${page.slug}`" target="_blank">Public</a>
          <button class="rounded-md border border-red-200 px-3 py-2 text-sm font-semibold text-red-700" @click="remove(page)">Delete</button>
        </div>
      </article>
    </div>
  </DashboardLayout>
</template>
