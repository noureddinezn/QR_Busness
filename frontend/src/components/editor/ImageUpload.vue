<script setup>
import AppIcon from '../AppIcon.vue'
defineProps({ label: String, src: String, avatar: Boolean })
defineEmits(['change'])
</script>
<template>
  <label class="image-upload">
    <span class="upload-label"><AppIcon :name="avatar ? 'user' : 'image'" /> {{ label }}</span>
    <span class="upload-content">
      <img v-if="src" :src="src" alt="Selected image" :class="{ avatar }" />
      <span v-else class="upload-placeholder" :class="{ avatar }"><AppIcon :name="avatar ? 'user' : 'image'" /></span>
      <span class="upload-drop"><AppIcon name="upload" /><span>Choose image</span><small>{{ avatar ? 'PNG, JPG, WebP / 5 MB' : 'PNG, JPG, WebP / 8 MB' }}</small></span>
    </span>
    <input type="file" accept="image/png,image/jpeg,image/webp" @change="$emit('change', $event)" />
  </label>
</template>
