<script setup>
import { onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import PublicProfile from '../components/profile/PublicProfile.vue'
import { pageService } from '../services/pageService'
import { linkService } from '../services/linkService'

const route = useRoute()
const page = ref(null)
const error = ref('')
const loading = ref(true)
const linkError = ref('')
let request

async function openLink(link) {
  linkError.value = ''
  try {
    const target = await linkService.click(link.id)
    window.location.href = target
  } catch {
    linkError.value = 'Unable to open this link. Please try again.'
  }
}

async function load() {
  request?.abort()
  const current = new AbortController()
  request = current
  loading.value = true
  error.value = ''
  page.value = null
  try {
    page.value = await pageService.publicBySlug(route.params.slug, { signal: current.signal })
  } catch (e) {
    if (current.signal.aborted) return
    error.value = e.response?.status === 404
      ? 'This public profile is not available.'
      : 'Unable to load this profile. Check your connection and try again.'
  } finally {
    if (!current.signal.aborted) loading.value = false
  }
}
watch(() => route.params.slug, load, { immediate: true })
onUnmounted(() => request?.abort())
</script>

<template>
  <main class="min-h-dvh overflow-x-hidden bg-slate-100 px-0 py-0 sm:px-4 sm:py-8">
    <div v-if="loading" role="status" class="mx-auto max-w-md bg-white p-8 text-center text-slate-700">Loading profile...</div>
    <div v-else-if="error" role="alert" class="mx-auto max-w-md bg-white p-5 text-center text-slate-700">
      <p>{{ error }}</p>
      <button class="mt-4 rounded-md border px-5 py-3" @click="load">Try again</button>
    </div>
    <div v-else-if="page" class="mx-auto w-full max-w-[480px]">
      <p v-if="linkError" role="alert" class="bg-red-50 p-4 text-red-800">{{ linkError }}</p>
      <PublicProfile :page="page" @open="openLink" />
      <p class="mt-5 text-center text-xs font-semibold text-slate-500">Powered by QR Profile</p>
    </div>
  </main>
</template>
