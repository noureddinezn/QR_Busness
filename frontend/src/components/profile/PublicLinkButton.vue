<script setup>
import AppIcon from '../AppIcon.vue'
defineProps({ link: Object })
defineEmits(['open'])
</script>
<template>
  <button :class="['public-link', link.type]" @click="$emit('open', link)">
    <AppIcon :name="link.type" /><span>{{ link.title }}</span><AppIcon name="next" />
  </button>
</template>
