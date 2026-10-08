<script setup>
import { computed, reactive, ref, onMounted, onUnmounted } from 'vue'
import { aiService } from '../services/aiService'
import PhonePreview from './profile/PhonePreview.vue'

const props = defineProps({
  profile: { type: Object, required: true },
})

const emit = defineEmits(['close', 'apply'])

const loading = ref(false)
const error = ref('')
const result = ref(null)
const dialog = ref(null)
const previousFocus = document.activeElement
const proposedProfile = computed(() => ({
  ...props.profile,
  ...(result.value || {}),
  logo_url: props.profile.logo_url,
  cover_image_url: props.profile.cover_image_url,
  links: props.profile.links || [],
}))
function onKey(event) {
  if (event.key === 'Escape') emit('close')
  if (event.key !== 'Tab') return
  const items = [...dialog.value.querySelectorAll('button:not(:disabled), input, textarea, select, [tabindex="0"]')]
  if (!items.length) return
  const first = items[0], last = items[items.length - 1]
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
}
onMounted(() => { dialog.value.focus(); document.addEventListener('keydown', onKey) })
onUnmounted(() => { document.removeEventListener('keydown', onKey); previousFocus?.focus() })
const form = reactive({
  business_type: '',
  business_name: props.profile.title || '',
  description: props.profile.bio || '',
  style: 'Black Gold',
  mood: 'Premium',
  language: 'French',
})

const styles = ['Black Gold', 'Minimal White', 'Modern Dark', 'Moroccan', 'Business', 'Luxury', 'Tech', 'Creative']
const moods = ['Premium', 'Minimal', 'Friendly', 'Elegant', 'Bold', 'Traditional', 'Modern']
const languages = ['French', 'English', 'Arabic']

const colorSwatches = computed(() => [
  result.value?.primary_color,
  result.value?.secondary_color,
  result.value?.background_color,
].filter(Boolean))

async function generate() {
  loading.value = true
  error.value = ''

  try {
    result.value = await aiService.generateDesign(form)
  } catch (e) {
    error.value = e.response?.data?.message || 'AI generation is temporarily unavailable. Please try again.'
  } finally {
    loading.value = false
  }
}

function apply(scope) {
  if (!result.value) return
  emit('apply', { scope, suggestion: result.value })
}
</script>

<template>
  <div class="ai-design-overlay fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 p-3 backdrop-blur-sm sm:p-6" @click.self="$emit('close')">
    <section ref="dialog" role="dialog" aria-modal="true" aria-label="AI Design Assistant" tabindex="-1" class="mx-auto grid max-w-6xl overflow-hidden rounded-3xl bg-white shadow-2xl lg:grid-cols-[0.95fr_1.05fr]">
      <div class="bg-slate-950 p-6 text-white sm:p-8">
        <div class="mb-8 flex items-start justify-between gap-4">
          <div>
            <p class="text-xs font-black uppercase tracking-[0.18em] text-yellow-300">AI Design Assistant</p>
            <h2 class="mt-2 text-3xl font-black leading-tight">Create a polished profile faster.</h2>
            <p class="mt-3 text-sm leading-6 text-slate-300">Describe the business, choose a mood, then preview the AI suggestions before applying anything.</p>
          </div>
          <button class="rounded-full bg-white/10 px-3 py-2 text-sm font-black hover:bg-white/20" @click="$emit('close')">Esc</button>
        </div>

        <form class="space-y-4" @submit.prevent="generate">
          <label class="block text-sm font-bold text-slate-200">Business type
            <input v-model="form.business_type" class="mt-1 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-yellow-300" placeholder="Phone store, barber, restaurant..." required />
          </label>
          <label class="block text-sm font-bold text-slate-200">Business name
            <input v-model="form.business_name" class="mt-1 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none focus:border-yellow-300" required />
          </label>
          <label class="block text-sm font-bold text-slate-200">Short description
            <textarea v-model="form.description" class="mt-1 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none focus:border-yellow-300" rows="4" placeholder="What do you sell or offer?" required></textarea>
          </label>
          <div class="grid gap-3 sm:grid-cols-3">
            <label class="text-sm font-bold text-slate-200">Style
              <select v-model="form.style" class="mt-1 w-full rounded-2xl border border-white/10 bg-slate-900 px-3 py-3 text-white outline-none focus:border-yellow-300">
                <option v-for="item in styles" :key="item">{{ item }}</option>
              </select>
            </label>
            <label class="text-sm font-bold text-slate-200">Mood
              <select v-model="form.mood" class="mt-1 w-full rounded-2xl border border-white/10 bg-slate-900 px-3 py-3 text-white outline-none focus:border-yellow-300">
                <option v-for="item in moods" :key="item">{{ item }}</option>
              </select>
            </label>
            <label class="text-sm font-bold text-slate-200">Language
              <select v-model="form.language" class="mt-1 w-full rounded-2xl border border-white/10 bg-slate-900 px-3 py-3 text-white outline-none focus:border-yellow-300">
                <option v-for="item in languages" :key="item">{{ item }}</option>
              </select>
            </label>
          </div>
          <button class="w-full rounded-2xl bg-gradient-to-r from-yellow-300 to-amber-500 px-5 py-3 text-sm font-black text-slate-950 shadow-lg shadow-yellow-500/20 disabled:opacity-60" :disabled="loading">
            {{ loading ? 'AI is creating your profile design...' : 'Generate My Design' }}
          </button>
          <p v-if="error" class="rounded-2xl bg-red-500/10 p-3 text-sm font-semibold text-red-100">{{ error }}</p>
        </form>
      </div>

      <div class="bg-slate-50 p-6 sm:p-8">
        <div v-if="!result" class="grid min-h-full place-items-center rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center">
          <div>
            <p class="text-5xl font-black text-indigo-600">AI</p>
            <h3 class="mt-4 text-2xl font-black text-slate-950">Your AI suggestions will appear here.</h3>
            <p class="mt-2 text-sm leading-6 text-slate-500">Nothing is applied automatically. You choose exactly what to use.</p>
          </div>
        </div>

        <div v-else class="space-y-5">
          <details class="ai-result-preview">
            <summary>Preview suggested design</summary>
            <PhonePreview :page="proposedProfile" />
          </details>
          <div class="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p class="text-xs font-black uppercase tracking-wide text-indigo-600">Suggested Profile</p>
            <h3 class="mt-2 text-2xl font-black text-slate-950">{{ result.title }}</h3>
            <p class="mt-2 text-sm leading-6 text-slate-600">{{ result.bio }}</p>
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            <div class="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <p class="text-sm font-black text-slate-950">Theme & Colors</p>
              <p class="mt-1 text-sm text-slate-500">{{ result.theme }} · {{ result.button_style }}</p>
              <div class="mt-4 flex gap-2">
                <span v-for="color in colorSwatches" :key="color" class="h-12 flex-1 rounded-2xl ring-1 ring-slate-200" :style="{ backgroundColor: color }"></span>
              </div>
            </div>
            <div class="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <p class="text-sm font-black text-slate-950">Suggested Links</p>
              <div class="mt-3 flex flex-wrap gap-2">
                <span v-for="link in result.recommended_links" :key="`${link.type}-${link.title}`" class="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">{{ link.title }}</span>
              </div>
            </div>
          </div>

          <div class="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p class="text-sm font-black text-slate-950">Cover Image Prompt</p>
            <p class="mt-2 text-sm leading-6 text-slate-600">{{ result.cover_prompt }}</p>
          </div>

          <div class="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p class="text-sm font-black text-slate-950">Catalogue / Menu Ideas</p>
            <div class="mt-3 flex flex-wrap gap-2">
              <span v-for="idea in result.menu_or_catalogue_ideas" :key="idea" class="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800">{{ idea }}</span>
            </div>
          </div>

          <div class="grid gap-2 sm:grid-cols-3">
            <button class="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white" @click="apply('all')">Apply All</button>
            <button class="rounded-2xl bg-white px-4 py-3 text-sm font-black text-slate-800 ring-1 ring-slate-200" @click="apply('colors')">Apply Colors Only</button>
            <button class="rounded-2xl bg-white px-4 py-3 text-sm font-black text-slate-800 ring-1 ring-slate-200" @click="apply('text')">Apply Text Only</button>
            <button class="rounded-2xl bg-white px-4 py-3 text-sm font-black text-slate-800 ring-1 ring-slate-200" @click="apply('links')">Apply Links</button>
            <button class="rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-black text-white" :disabled="loading" @click="generate">Regenerate</button>
            <button class="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-black text-slate-700" @click="$emit('close')">Cancel</button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
