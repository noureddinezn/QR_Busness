<script setup>
defineProps({
  title: String,
  message: String,
})
</script>

<template>
  <div class="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
    <h3 class="font-semibold text-slate-950">{{ title }}</h3>
    <p class="mt-2 text-sm text-slate-500">{{ message }}</p>
    <div class="mt-5">
      <slot />
    </div>
  </div>
</template>
