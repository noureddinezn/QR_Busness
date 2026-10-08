<script setup>
import { onMounted, ref } from 'vue'
import DashboardLayout from '../components/layout/DashboardLayout.vue'
import StatCard from '../components/ui/StatCard.vue'
import { usePagesStore } from '../stores/pages'
import { analyticsService } from '../services/analyticsService'

const store = usePagesStore()
const selectedId = ref('')
const analytics = ref(null)

async function load() {
  if (!selectedId.value) return
  analytics.value = await analyticsService.show(selectedId.value)
}

onMounted(async () => {
  await store.fetchPages()
  selectedId.value = store.pages[0]?.id || ''
  await load()
})
</script>

<template>
  <DashboardLayout>
    <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
      <h1 class="text-2xl font-bold text-slate-950">Analytics</h1>
      <select v-model="selectedId" class="rounded-md border px-3 py-2" @change="load">
        <option v-for="page in store.pages" :key="page.id" :value="page.id">{{ page.title }}</option>
      </select>
    </div>
    <div v-if="analytics" class="grid gap-4 md:grid-cols-4">
      <StatCard label="Page views" :value="analytics.total_page_views" />
      <StatCard label="QR scans" :value="analytics.total_qr_scans" />
      <StatCard label="Link clicks" :value="analytics.total_link_clicks" />
      <StatCard label="Links" :value="analytics.total_links" />
    </div>
    <div v-if="analytics" class="mt-6 grid gap-6 lg:grid-cols-2">
      <section class="rounded-lg border bg-white p-5 shadow-sm">
        <h2 class="font-semibold">Most clicked links</h2>
        <div class="mt-4 space-y-3">
          <div v-for="link in analytics.most_clicked_links" :key="link.id" class="flex justify-between rounded-md bg-slate-50 p-3 text-sm">
            <span>{{ link.title }}</span><strong>{{ link.clicks_count }}</strong>
          </div>
        </div>
      </section>
      <section class="rounded-lg border bg-white p-5 shadow-sm">
        <h2 class="font-semibold">Recent scans</h2>
        <div class="mt-4 space-y-3">
          <div v-for="scan in analytics.recent_scans" :key="scan.id" class="rounded-md bg-slate-50 p-3 text-sm">
            {{ scan.device }} · {{ scan.browser }} · {{ scan.scanned_at }}
          </div>
        </div>
      </section>
    </div>
  </DashboardLayout>
</template>
