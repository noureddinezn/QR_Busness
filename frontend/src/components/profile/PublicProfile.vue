<script setup>
import { computed } from 'vue'
import AppIcon from '../AppIcon.vue'
import PublicLinkButton from './PublicLinkButton.vue'
const props = defineProps({ page: Object })
defineEmits(['open'])
const links = computed(() => (props.page?.links || []).filter(link => link.is_active !== false))
const socials = computed(() => links.value.filter(link => ['whatsapp','instagram','facebook','tiktok','github','linkedin','maps'].includes(link.type)).slice(0, 6))
const location = computed(() => links.value.find(link => link.type === 'maps'))
const light = computed(() => props.page?.theme === 'minimal-white')
const background = computed(() => props.page?.background_color || (light.value ? '#fafbfe' : (props.page?.secondary_color || '#0b0f19')))
function readableText(hex) {
  const channels = (hex.match(/[a-f0-9]{2}/gi) || ['00','00','00']).map(value => {
    const channel = parseInt(value, 16) / 255
    return channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4
  })
  const luminance = .2126 * channels[0] + .7152 * channels[1] + .0722 * channels[2]
  return luminance > .179 ? '#121827' : '#f8fafc'
}
const style = computed(() => ({
  '--profile-primary': props.page?.primary_color || '#d4af37',
  '--profile-secondary': props.page?.secondary_color || '#111827',
  '--button-radius': ({ pill: '24px', rounded: '8px', square: '0px' })[props.page?.button_style] || '24px',
  '--button-text': readableText(props.page?.primary_color || '#d4af37'),
  backgroundColor: background.value,
  color: readableText(background.value),
}))
</script>
<template>
  <article class="digital-profile" :style="style">
    <header class="profile-cover" :class="{ 'cover-empty': !page?.cover_image_url }">
      <img v-if="page?.cover_image_url" :src="page.cover_image_url" alt="Profile cover" decoding="async" fetchpriority="high" width="480" height="160" />
    </header>
    <section class="profile-content">
      <div class="profile-avatar">
        <img v-if="page?.logo_url" :src="page.logo_url" alt="Profile image" decoding="async" width="98" height="98" />
        <span v-else>{{ page?.title?.charAt(0)?.toUpperCase() || 'Q' }}</span>
      </div>
      <h1>{{ page?.title || 'Your page title' }}</h1>
      <p class="profile-handle">@{{ page?.slug || 'profile' }}</p>
      <p v-if="page?.bio" class="profile-bio">{{ page.bio }}</p>
      <div class="profile-socials">
        <button v-for="link in socials" :key="link.id || link.type" :class="['brand-icon', link.type]" :aria-label="link.title" @click="$emit('open', link)"><AppIcon :name="link.type" /></button>
      </div>
      <div class="profile-links">
        <PublicLinkButton v-for="link in links" :key="link.id || link.title" :link="link" @open="$emit('open', link)" />
      </div>
      <section v-if="location" data-testid="location-section" class="profile-location">
        <h2><AppIcon name="maps" /> Our Location</h2>
        <p>{{ location.url }}</p>
        <button @click="$emit('open', location)">Open Google Maps <AppIcon name="next" /></button>
      </section>
      <footer class="profile-footer"><AppIcon name="qr" /> QRProfile</footer>
    </section>
  </article>
</template>
