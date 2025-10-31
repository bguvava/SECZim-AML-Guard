import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useSupervisionApi } from '../composables/useSupervisionApi'
import type { AnalyticsResponse } from '../types/api'

export const useAnalyticsStore = defineStore('analytics', () => {
  const api = useSupervisionApi()
  const data = ref<AnalyticsResponse | null>(null)
  const loading = ref(false)
  const filters = ref<{ from?: string; to?: string; categories?: string[] }>({})

  async function fetch(force = false) {
    if (data.value && !force) return
    loading.value = true
    try {
      data.value = await api.getAnalytics(filters.value)
    } finally {
      loading.value = false
    }
  }

  function setFilters(f: typeof filters.value) {
    filters.value = f
  }

  return { data, loading, filters, fetch, setFilters }
})
