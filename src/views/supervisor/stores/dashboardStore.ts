import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useSupervisionStore } from './supervisionStore'

export const useDashboardStore = defineStore('dashboard', () => {
  const sup = useSupervisionStore()

  const totalInstitutions = computed(() => sup.institutions.total)
  const highRisk = computed(() => sup.institutions.items.filter(i => i.riskLevel === 'High').length)
  const pendingInspections = computed(() => 23) // TODO: derive from inspections store when available
  const openDeficiencies = computed(() => 142) // TODO: derive from findings when available

  return { totalInstitutions, highRisk, pendingInspections, openDeficiencies }
})
