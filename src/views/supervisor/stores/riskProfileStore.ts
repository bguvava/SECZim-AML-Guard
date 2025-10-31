import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useSupervisionApi } from '../composables/useSupervisionApi'
import type { RiskProfile } from '../types/models'

export const useRiskProfileStore = defineStore('riskProfile', () => {
  const api = useSupervisionApi()
  const profiles = ref<RiskProfile[]>([])
  const loading = ref(false)

  async function fetch(institutionId: string) {
    loading.value = true
    try {
      profiles.value = await api.getRiskProfiles(institutionId)
    } finally {
      loading.value = false
    }
  }

  return { profiles, loading, fetch }
})
