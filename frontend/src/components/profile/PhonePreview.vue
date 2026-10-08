<script setup>
import PublicProfile from './PublicProfile.vue'
defineProps({ page: Object })
defineEmits(['open'])
</script>
<template>
  <div class="phone-frame">
    <div class="phone-notch"></div>
    <div class="phone-screen"><PublicProfile :page="page" @open="$emit('open', $event)" /></div>
  </div>
</template>
