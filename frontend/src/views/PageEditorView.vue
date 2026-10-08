<script setup>
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DashboardLayout from '../components/layout/DashboardLayout.vue'
import PhonePreview from '../components/profile/PhonePreview.vue'
import LinkForm from '../components/LinkForm.vue'
import AiDesignAssistant from '../components/AiDesignAssistant.vue'
import { pageService } from '../services/pageService'
import { linkService } from '../services/linkService'
import { slugify as normalizeSlug } from '../utils/validators'

import AppIcon from '../components/AppIcon.vue'
import ImageUpload from '../components/editor/ImageUpload.vue'
import PublicProfile from '../components/profile/PublicProfile.vue'
import { publicProfileUrl } from '../config/publicUrl'
import QRCode from 'qrcode'

const previewMode = ref('mobile')
const shareQr = ref('')
const copied = ref(false)
const publicUrl = computed(() => publicProfileUrl(form.slug))
async function copyUrl() {
  try { await navigator.clipboard.writeText(publicUrl.value); copied.value = true }
  catch { error.value = 'Copy unavailable. Select the profile URL to copy it.' }
}
async function toggleLink(link) {
  const next = !link.is_active
  try {
    if (!isDraftLink(link)) await linkService.update(link.id, { ...linkPayload(link), is_active: next })
    link.is_active = next
  } catch (e) { error.value = formatApiError(e) }
}
function selectTheme(theme) {
  form.theme = theme.id
  form.primary_color = theme.colors[1]
  form.secondary_color = theme.colors[0]
  form.background_color = theme.id === 'minimal-white' ? '#FAFBFE' : theme.colors[0]
}
onUnmounted(() => {
  if (logoPreview.value) URL.revokeObjectURL(logoPreview.value)
  if (coverPreview.value) URL.revokeObjectURL(coverPreview.value)
})

const props = defineProps({ mode: { type: String, default: 'create' } })
const route = useRoute()
const router = useRouter()
const saving = ref(false)
const error = ref('')
const editingLink = ref(null)
const showLinkForm = ref(false)
const logoFile = ref(null)
const coverFile = ref(null)
const logoPreview = ref('')
const coverPreview = ref('')
const success = ref('')
const tempLinkCounter = ref(1)
const showAiAssistant = ref(false)

const themes = [
  { id: 'black-gold', name: 'Black Gold', colors: ['#050608', '#d4af37'] },
  { id: 'minimal-white', name: 'Minimal White', colors: ['#ffffff', '#111827'] },
  { id: 'modern-dark', name: 'Modern Dark', colors: ['#18181b', '#e5e7eb'] },
  { id: 'moroccan', name: 'Moroccan', colors: ['#064e3b', '#f59e0b'] },
  { id: 'business', name: 'Business', colors: ['#172554', '#3b82f6'] },
]

const form = reactive({
  id: null,
  title: '',
  slug: '',
  bio: '',
  theme: 'minimal-white',
  primary_color: '#10b981',
  secondary_color: '#111827',
  background_color: '#FAFBFE',
  button_style: 'pill',
  is_active: true,
  links: [],
})

const preview = computed(() => ({
  ...form,
  logo_url: logoPreview.value || form.logo_url,
  cover_image_url: coverPreview.value || form.cover_image_url,
  links: form.links,
}))

watch(publicUrl, async (url) => {
  try { shareQr.value = await QRCode.toDataURL(url, { margin: 2, width: 180 }) }
  catch { shareQr.value = '' }
}, { immediate: true })

function slugify() {
  form.slug = normalizeSlug(form.title)
}

function normalizeSlugInput() {
  form.slug = normalizeSlug(form.slug)
}

function formatApiError(e) {
  const message = e.response?.data?.message || 'Could not save.'
  const errors = e.response?.data?.errors

  if (!errors) return message

  return [message, ...Object.values(errors).flat()].join(' ')
}

function isDraftLink(link) {
  return String(link.id || '').startsWith('draft-')
}

function linkPayload(link) {
  return {
    type: link.type,
    title: link.title,
    url: link.url,
    icon: link.icon || '',
    position: link.position || 0,
    is_active: Boolean(link.is_active),
  }
}

function sortAndRepositionLinks() {
  form.links = [...form.links]
    .sort((a, b) => (a.position || 0) - (b.position || 0))
    .map((link, position) => ({ ...link, position }))
}

async function load() {
  if (props.mode !== 'edit') return
  const page = await pageService.get(route.params.id)
  Object.assign(form, page)
  form.background_color = page.background_color || (page.theme === 'minimal-white' ? '#FAFBFE' : (page.secondary_color || '#111827'))
}

function selectFile(event, target) {
  const file = event.target.files[0]
  if (!file) return

  if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > (target === 'logo' ? 5 : 8) * 1024 * 1024) {
    error.value = 'Choose a PNG, JPG or WebP within the displayed size limit.'
    event.target.value = ''
    return
  }
  const previous = target === 'logo' ? logoPreview.value : coverPreview.value
  if (previous) URL.revokeObjectURL(previous)
  const url = URL.createObjectURL(file)
  if (target === 'logo') {
    logoFile.value = file
    logoPreview.value = url
  } else {
    coverFile.value = file
    coverPreview.value = url
  }
}

async function savePage() {
  if (!document.getElementById('profile-form')?.reportValidity()) return
  if (saving.value) return
  saving.value = true
  error.value = ''
  success.value = ''
  try {
    form.slug = normalizeSlug(form.slug || form.title)
    const payload = { ...form, logo: logoFile.value, cover_image: coverFile.value }
    const saved = form.id ? await pageService.update(form.id, payload) : await pageService.create(payload)
    form.id = saved.id

    const localLinks = [...form.links]
    const persistedLinks = []
    for (const link of localLinks) {
      if (isDraftLink(link)) {
        const persisted = await linkService.create(saved.id, linkPayload(link))
        persistedLinks.push(persisted)
        const index = form.links.findIndex(item => item.id === link.id)
        if (index >= 0) form.links[index] = persisted
      } else {
        persistedLinks.push(link)
      }
    }

    Object.assign(form, { ...saved, links: persistedLinks.length ? persistedLinks : saved.links || [] })
    sortAndRepositionLinks()
    success.value = 'Page saved successfully. Your public profile is now available.'
    if (props.mode === 'create') router.replace(`/pages/${saved.id}/edit`)
  } catch (e) {
    error.value = formatApiError(e)
  } finally {
    saving.value = false
  }
}

async function saveLink(payload) {
  error.value = ''
  success.value = ''

  try {
    const existingIndex = form.links.findIndex((link) => link.id === payload.id)

    if (!form.id || isDraftLink(payload)) {
      const draft = {
        ...payload,
        id: payload.id || `draft-${tempLinkCounter.value++}`,
        position: existingIndex >= 0 ? form.links[existingIndex].position : form.links.length,
        is_active: payload.is_active ?? true,
      }

      if (existingIndex >= 0) form.links[existingIndex] = draft
      else form.links.push(draft)
      sortAndRepositionLinks()
    } else {
      const saved = payload.id ? await linkService.update(payload.id, linkPayload(payload)) : await linkService.create(form.id, linkPayload(payload))
      if (existingIndex >= 0) form.links[existingIndex] = saved
      else form.links.push(saved)
      sortAndRepositionLinks()
    }

    success.value = form.id ? 'Link saved.' : 'Link added locally. Click Save page to publish all links.'
  } catch (e) {
    error.value = formatApiError(e)
    return
  }

  showLinkForm.value = false
  editingLink.value = null
}

async function removeLink(link) {
  if (!confirm(`Delete ${link.title}?`)) return
  if (!isDraftLink(link)) {
    await linkService.remove(link.id)
  }
  form.links = form.links.filter((item) => item.id !== link.id)
  sortAndRepositionLinks()
}

async function move(link, direction) {
  sortAndRepositionLinks()
  const currentIndex = form.links.findIndex((item) => item.id === link.id)
  const nextIndex = currentIndex + direction
  if (currentIndex < 0 || nextIndex < 0 || nextIndex >= form.links.length) return

  const reordered = [...form.links]
  const [item] = reordered.splice(currentIndex, 1)
  reordered.splice(nextIndex, 0, item)
  form.links = reordered.map((item, position) => ({ ...item, position }))

  if (!isDraftLink(link)) {
    await linkService.position(link.id, form.links.find((item) => item.id === link.id).position)
  }
}

function suggestedLinkUrl(type) {
  const values = {
    whatsapp: '+212600000000',
    instagram: 'https://instagram.com/yourprofile',
    facebook: 'https://facebook.com/yourpage',
    tiktok: 'https://tiktok.com/@yourprofile',
    linkedin: 'https://linkedin.com/in/yourprofile',
    github: 'https://github.com/yourprofile',
    maps: form.title || 'Your business address',
    review: 'https://g.page/r/your-review-link',
    website: 'https://example.com',
    custom: 'https://example.com',
  }

  return values[type] || 'https://example.com'
}

function addSuggestedLinks(links = []) {
  const existing = new Set(form.links.map((link) => `${link.type}:${link.title}`.toLowerCase()))

  links.forEach((link) => {
    const key = `${link.type}:${link.title}`.toLowerCase()
    if (existing.has(key)) return

    form.links.push({
      id: `draft-ai-${tempLinkCounter.value++}`,
      type: link.type,
      title: link.title,
      url: suggestedLinkUrl(link.type),
      icon: link.type,
      position: form.links.length,
      is_active: false,
    })
    existing.add(key)
  })

  sortAndRepositionLinks()
}

function applyAiSuggestion({ scope, suggestion }) {
  success.value = ''
  error.value = ''

  if (scope === 'all' || scope === 'text') {
    form.title = suggestion.title || form.title
    form.bio = suggestion.bio || form.bio
    if (!form.slug) slugify()
  }

  if (scope === 'all' || scope === 'colors') {
    form.theme = suggestion.theme || form.theme
    form.primary_color = suggestion.primary_color || form.primary_color
    form.secondary_color = suggestion.secondary_color || form.secondary_color
    form.background_color = suggestion.background_color || form.background_color
    form.button_style = ['rounded', 'pill', 'square'].includes(suggestion.button_style) ? suggestion.button_style : form.button_style
  }

  if (scope === 'all' || scope === 'links') {
    addSuggestedLinks(suggestion.recommended_links || [])
  }

  success.value = 'AI suggestions applied to the editor. Review them, edit anything you want, then save.'
  showAiAssistant.value = false
}

onMounted(load)
</script>

<template>
  <DashboardLayout>
    <div class="editor-workspace">
      <header class="editor-heading">
        <div><p class="eyebrow">UNIVERSAL QR PLATFORM</p><h1>{{ mode === 'edit' ? 'Create & Customize Your Profile' : 'Create Your Digital Profile' }}</h1></div>
        <div class="editor-actions">
          <button class="editor-button ai-button" @click="showAiAssistant = true"><AppIcon name="ai" /> Generate with AI</button>
          <a v-if="form.id && form.slug" class="editor-button" :href="publicUrl" target="_blank" rel="noopener"><AppIcon name="eye" /> Preview Page</a>
          <button class="editor-button primary-button" :disabled="saving" @click="savePage"><AppIcon name="upload" />{{ saving ? 'Saving...' : 'Save page & links' }}</button>
        </div>
      </header>
      <p v-if="error" role="alert" class="editor-message error-message">{{ error }}</p>
      <p v-if="success" role="status" class="editor-message success-message">{{ success }}</p>
      <div class="editor-grid">
        <div class="editor-fields">
          <form id="profile-form" class="editor-section" @submit.prevent="savePage">
            <header class="section-heading"><span class="step-number">1</span><AppIcon name="user" /><h2>Profile Information</h2><label class="active-label"><input v-model="form.is_active" type="checkbox" /> Active</label></header>
            <div class="field-grid">
              <label>Name<input v-model="form.title" required maxlength="120" @blur="!form.slug && slugify()" /></label>
              <label>Slug<input v-model="form.slug" required maxlength="80" @blur="normalizeSlugInput" /><small class="slug-hint">{{ publicUrl }}</small></label>
              <label class="full-field">Bio<textarea v-model="form.bio" rows="3" maxlength="500"></textarea><small class="character-count">{{ form.bio?.length || 0 }}/500</small></label>
              <ImageUpload label="Logo / Profile Image" :src="preview.logo_url" avatar @change="selectFile($event, 'logo')" />
              <ImageUpload label="Cover Image" :src="preview.cover_image_url" @change="selectFile($event, 'cover')" />
            </div>
          </form>
          <section class="editor-section">
            <header class="section-heading"><span class="step-number">2</span><AppIcon name="palette" /><h2>Theme & Colors</h2><button class="editor-button small-button" @click="selectTheme(themes[0])"><AppIcon name="reset" /> Reset</button></header>
            <div class="theme-options">
              <button v-for="theme in themes" :key="theme.id" :aria-pressed="form.theme === theme.id" :class="['theme-option', { selected: form.theme === theme.id }]" @click="selectTheme(theme)">
                <span :class="['theme-art', theme.id]" :style="{ '--theme-one': theme.colors[0], '--theme-two': theme.colors[1] }"><span class="mini-profile"></span><AppIcon v-if="form.theme === theme.id" name="check" /></span>
                <span>{{ theme.name }}</span>
              </button>
            </div>
            <div class="color-fields">
              <label>Primary Color<span class="color-control"><input v-model="form.primary_color" type="color" aria-label="Primary color" /><span>{{ form.primary_color.toUpperCase() }}</span></span></label>
              <label>Secondary Color<span class="color-control"><input v-model="form.secondary_color" type="color" aria-label="Secondary color" /><span>{{ form.secondary_color.toUpperCase() }}</span></span></label>
              <label>Background Color<span class="color-control"><input v-model="form.background_color" type="color" aria-label="Background color" /><span>{{ (form.background_color || '#FAFBFE').toUpperCase() }}</span></span></label>
            </div>
            <label class="button-style-field">Button style <select v-model="form.button_style"><option value="pill">Pill</option><option value="rounded">Rounded</option><option value="square">Square</option></select></label>
          </section>
          <section class="editor-section">
            <header class="section-heading"><span class="step-number">3</span><AppIcon name="link" /><h2>Links Management</h2><button class="editor-button primary-button small-button" aria-label="+ Add Link" @click="showLinkForm = true; editingLink = null"><AppIcon name="plus" /> Add Link</button></header>
            <LinkForm v-if="showLinkForm" :model-value="editingLink" class="mb-4" @save="saveLink" @cancel="showLinkForm = false" />
            <p v-if="!form.links.length" class="empty-links">No links yet</p>
            <div class="editor-links">
              <article v-for="(link, index) in form.links" :key="link.id" class="editor-link">
                <span :class="['brand-icon', link.type]"><AppIcon :name="link.type" /></span>
                <div class="link-details"><strong>{{ link.title }}</strong><span>{{ link.url }}</span></div>
                <button role="switch" :aria-checked="Boolean(link.is_active)" :aria-label="'Enable ' + link.title" :class="['link-switch', { enabled: link.is_active }]" @click="toggleLink(link)"><span></span></button>
                <div class="link-actions">
                  <button :disabled="index === 0" :title="'Move ' + link.title + ' up'" :aria-label="'Move ' + link.title + ' up'" @click="move(link, -1)"><AppIcon name="up" /></button>
                  <button :disabled="index === form.links.length - 1" :title="'Move ' + link.title + ' down'" :aria-label="'Move ' + link.title + ' down'" @click="move(link, 1)"><AppIcon name="down" /></button>
                  <button :title="'Edit ' + link.title" :aria-label="'Edit ' + link.title" @click="editingLink = link; showLinkForm = true"><AppIcon name="edit" /></button>
                  <button :title="'Delete ' + link.title" :aria-label="'Delete ' + link.title" class="delete-action" @click="removeLink(link)"><AppIcon name="delete" /></button>
                </div>
              </article>
            </div>
          </section>
        </div>
        <aside class="editor-preview">
          <header class="preview-heading"><h2>Live Preview (Mobile)</h2><div class="preview-modes"><button title="Phone preview" aria-label="Phone preview" :aria-pressed="previewMode === 'mobile'" @click="previewMode = 'mobile'"><AppIcon name="mobile" /></button><button title="Page preview" aria-label="Page preview" :aria-pressed="previewMode === 'page'" @click="previewMode = 'page'"><AppIcon name="desktop" /></button></div></header>
          <PhonePreview v-if="previewMode === 'mobile'" :page="preview" />
          <div v-else class="unframed-preview"><PublicProfile :page="preview" /></div>
          <section class="share-profile">
            <div><h3><AppIcon name="qr" /> Share Your Profile</h3><p>{{ form.id ? 'Your public profile' : 'Save your page to publish' }}</p></div>
            <a v-if="form.id && shareQr" :href="shareQr" :download="form.slug + '-qr.png'" title="Download profile QR"><img :src="shareQr" alt="Profile QR code" /></a>
            <div class="share-url"><span>{{ publicUrl }}</span><button title="Copy profile URL" aria-label="Copy profile URL" @click="copyUrl"><AppIcon :name="copied ? 'check' : 'copy'" /></button></div>
          </section>
        </aside>
      </div>
    </div>
    <AiDesignAssistant v-if="showAiAssistant" :profile="preview" @close="showAiAssistant = false" @apply="applyAiSuggestion" />
  </DashboardLayout>
</template>
