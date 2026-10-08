<script setup>
import DashboardLayout from '../components/layout/DashboardLayout.vue'
import { useAuthStore } from '../stores/auth'
const auth = useAuthStore()
</script>

<template>
  <DashboardLayout>
    <section class="max-w-2xl rounded-lg border bg-white p-6 shadow-sm">
      <h1 class="text-2xl font-bold text-slate-950">Account Settings</h1>
      <dl class="mt-5 space-y-3 text-sm">
        <div><dt class="font-semibold">Name</dt><dd>{{ auth.user?.name }}</dd></div>
        <div><dt class="font-semibold">Email</dt><dd>{{ auth.user?.email }}</dd></div>
        <div><dt class="font-semibold">Role</dt><dd>{{ auth.user?.role }}</dd></div>
      </dl>
    </section>
  </DashboardLayout>
</template>
