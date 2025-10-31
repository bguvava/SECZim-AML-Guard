import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useSupervisionApi } from '../composables/useSupervisionApi'
import type { Paginated, InstitutionsQuery } from '../types/api'
import type { Institution } from '../types/models'

export const useInstitutionStore = defineStore('institution', () => {
  const api = useSupervisionApi()
  const list = ref<Paginated<Institution>>({ items: [], total: 0, page: 1, pageSize: 10 })
  const loading = ref(false)
  const query = ref<InstitutionsQuery>({ page: 1, pageSize: 10 })

  async function fetch(q?: InstitutionsQuery) {
    loading.value = true
    try {
      if (q) query.value = { ...query.value, ...q }
      list.value = await api.getInstitutions(query.value)
    } finally {
      loading.value = false
    }
  }

  return { list, loading, query, fetch }
})
