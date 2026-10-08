<template>
  <div class="flex min-h-screen bg-[linear-gradient(135deg,#f8fafc,#eef2ff)]">
    <AppSidebar />
    <div class="min-w-0 flex-1">
      <AppNavbar />
      <main class="p-4 sm:p-6 lg:p-8">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import AppNavbar from './AppNavbar.vue'
import AppSidebar from './AppSidebar.vue'
</script>
