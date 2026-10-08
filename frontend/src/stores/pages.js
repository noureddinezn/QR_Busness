import { defineStore } from 'pinia'
import { ref } from 'vue'
import { pageService } from '../services/pageService'

export const usePagesStore = defineStore('pages', () => {
  const pages = ref([])
  const loading = ref(false)

  async function fetchPages() {
    loading.value = true
    try {
      pages.value = await pageService.list()
    } finally {
      loading.value = false
    }
  }

  return { pages, loading, fetchPages }
})
