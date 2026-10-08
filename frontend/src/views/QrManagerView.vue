<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import DashboardLayout from '../components/layout/DashboardLayout.vue'
import QrCard from '../components/QrCard.vue'
import EmptyState from '../components/ui/EmptyState.vue'
import { usePagesStore } from '../stores/pages'
import { qrService } from '../services/qrService'
import { isLocalhostPublicUrl, LOCALHOST_QR_WARNING, publicProfileUrl } from '../config/publicUrl'

const route = useRoute()
const pagesStore = usePagesStore()
const selectedId = ref(route.query.page || '')
const qrs = ref([])
const selectedPage = computed(() => pagesStore.pages.find((page) => String(page.id) === String(selectedId.value)))
const selectedPublicUrl = computed(() => (selectedPage.value?.slug ? publicProfileUrl(selectedPage.value.slug) : ''))
const hasLocalhostQrUrl = computed(() => isLocalhostPublicUrl())

async function generate() {
  if (!selectedId.value) return
  const records = await qrService.generate(selectedId.value)
  qrs.value = records.map((qr) =>
    qr.type === 'main' && selectedPage.value?.slug ? { ...qr, target_url: selectedPublicUrl.value } : qr,
  )
}

onMounted(async () => {
  await pagesStore.fetchPages()
  selectedId.value ||= pagesStore.pages[0]?.id || ''
  await generate()
})
</script>

<template>
  <DashboardLayout>
    <div class="mb-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div>
        <p class="text-sm font-bold uppercase tracking-wide text-indigo-600">QR Manager</p>
        <h1 class="text-3xl font-black tracking-tight text-slate-950">Generate and Download QR Codes</h1>
        <p class="mt-1 text-sm text-slate-500">Download the main profile QR and dedicated QR codes for each supported link.</p>
      </div>
      <div class="mt-5 flex flex-wrap gap-3">
        <select v-model="selectedId" class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold" @change="generate">
          <option v-for="page in pagesStore.pages" :key="page.id" :value="page.id">{{ page.title }}</option>
        </select>
        <button class="rounded-xl bg-slate-950 px-4 py-2 text-sm font-black text-white" @click="generate">Refresh QR codes</button>
      </div>
      <div v-if="selectedPublicUrl" data-testid="main-qr-target" class="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p class="text-xs font-black uppercase tracking-wide text-slate-500">Main profile QR target URL</p>
        <p class="mt-2 break-all text-sm font-bold text-slate-950">{{ selectedPublicUrl }}</p>
        <p v-if="hasLocalhostQrUrl" class="mt-3 rounded-xl bg-amber-50 p-3 text-sm font-semibold text-amber-800">
          {{ LOCALHOST_QR_WARNING }}
        </p>
      </div>
    </div>
    <EmptyState v-if="!selectedPage" title="No page selected" message="Create a page before generating QR codes." />
    <div v-else class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      <QrCard v-for="qr in qrs" :key="qr.id || qr.type" :qr="qr" />
    </div>
  </DashboardLayout>
</template>
