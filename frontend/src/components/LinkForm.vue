<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({ modelValue: Object })
const emit = defineEmits(['save', 'cancel'])

const form = reactive({
  type: 'custom',
  title: '',
  url: '',
  icon: '',
  position: 0,
  is_active: true,
})

watch(
  () => props.modelValue,
  (value) => Object.assign(form, value || { type: 'custom', title: '', url: '', icon: '', position: 0, is_active: true }),
  { immediate: true },
)
</script>

<template>
  <form class="grid gap-4 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4" @submit.prevent="$emit('save', { ...form })">
    <div class="grid gap-3 sm:grid-cols-2">
      <label class="text-sm font-bold text-slate-700">
        Type
        <select v-model="form.type" class="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none focus:border-indigo-400">
          <option v-for="type in ['whatsapp','instagram','facebook','tiktok','linkedin','github','website','maps','review','phone','email','menu','catalogue','booking','payment','pdf','custom']" :key="type" :value="type">
            {{ type }}
          </option>
        </select>
      </label>
      <label class="text-sm font-bold text-slate-700">
        Title
        <input v-model="form.title" class="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none focus:border-indigo-400" required />
      </label>
    </div>
    <label class="text-sm font-bold text-slate-700">
      URL / phone / email / maps link
      <input v-model="form.url" class="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none focus:border-indigo-400" required />
    </label>
    <div class="flex items-center justify-between">
      <label class="flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-bold text-slate-700">
        <input v-model="form.is_active" type="checkbox" />
        Active
      </label>
      <div class="flex gap-2">
        <button type="button" class="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold" @click="$emit('cancel')">Cancel</button>
        <button class="rounded-xl bg-slate-950 px-3 py-2 text-sm font-bold text-white">Save link</button>
      </div>
    </div>
  </form>
</template>
