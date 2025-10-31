import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Inspection, InspectionFindingView } from '../types/inspection'
// import { useSupervisionApi } from '../composables/useSupervisionApi'

export const useInspectionStore = defineStore('inspection', () => {
  // const api = useSupervisionApi()
  const inspections = ref<Inspection[]>([])
  const findings = ref<InspectionFindingView[]>([])
  const loading = ref(false)

  async function fetchInspections(institutionId?: string) {
    loading.value = true
    try {
      // TODO: integrate with api.getInspections when backend provides inspections listing
      // Placeholder: keep local state
      inspections.value = inspections.value
    } finally {
      loading.value = false
    }
  }

  async function fetchFindings(institutionId?: string) {
    loading.value = true
    try {
      // TODO: map from api.getInspections to findings view model if needed
      findings.value = findings.value
    } finally {
      loading.value = false
    }
  }

  return { inspections, findings, loading, fetchInspections, fetchFindings }
})
