<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import QRCode from 'qrcode'

const props = defineProps({ qr: Object })
const svg = ref('')
const meta = computed(() => {
  const labels = {
    main: ['Main Profile QR', 'Opens your full digital profile'],
    whatsapp: ['WhatsApp QR', 'Open WhatsApp directly'],
    maps: ['Google Maps QR', 'Open your location in Maps'],
    review: ['Reviews QR', 'Open Google Reviews'],
    website: ['Website QR', 'Open your website'],
    phone: ['Phone QR', 'Call your phone number'],
    custom: ['Custom QR', 'Open custom link'],
  }

  return labels[props.qr?.type] || [`${props.qr?.type || 'QR'} QR`, 'Open target link']
})

async function render() {
  svg.value = await QRCode.toString(props.qr.target_url, { type: 'svg', margin: 1, width: 220 })
}

async function downloadPng() {
  const url = await QRCode.toDataURL(props.qr.target_url, { margin: 1, width: 900 })
  const a = document.createElement('a')
  a.href = url
  a.download = `${props.qr.type || 'qr'}.png`
  a.click()
}

function downloadSvg() {
  const blob = new Blob([svg.value], { type: 'image/svg+xml' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `${props.qr.type || 'qr'}.svg`
  a.click()
}

onMounted(render)
watch(() => props.qr?.target_url, render)
</script>

<template>
  <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
    <div class="flex items-start gap-3">
      <div class="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-xl font-black text-blue-600">
        {{ qr.type?.slice(0, 1)?.toUpperCase() || 'Q' }}
      </div>
      <div>
        <h3 class="font-black text-slate-950">{{ meta[0] }}</h3>
        <p class="text-sm text-slate-500">{{ meta[1] }}</p>
      </div>
    </div>
    <div class="mx-auto mt-5 grid h-48 w-48 place-items-center rounded-2xl border-2 border-yellow-400 bg-white p-3" v-html="svg"></div>
    <p class="mt-4 break-all text-center text-xs text-slate-500">{{ qr.target_url }}</p>
    <div class="mt-4 grid grid-cols-2 gap-2">
      <button class="rounded-xl bg-indigo-50 px-3 py-2 text-sm font-black text-indigo-700" @click="downloadPng">Download PNG</button>
      <button class="rounded-xl bg-indigo-50 px-3 py-2 text-sm font-black text-indigo-700" @click="downloadSvg">Download SVG</button>
    </div>
  </article>
</template>
