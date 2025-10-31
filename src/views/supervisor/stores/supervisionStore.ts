import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useSupervisionApi } from '../composables/useSupervisionApi'
import type { Institution, RiskProfile } from '../types/models'
import type { AnalyticsResponse, Paginated } from '../types/api'

export const useSupervisionStore = defineStore('supervision', () => {
  const institutions = ref<Paginated<Institution>>({ items: [], total: 0, page: 1, pageSize: 10 })
  const riskProfiles = ref<RiskProfile[]>([])
  const analytics = ref<AnalyticsResponse | null>(null)

  const api = useSupervisionApi()

  async function fetchInstitutions(params?: any) {
    institutions.value = await api.getInstitutions(params)
  }

  async function fetchRiskProfiles(institutionId: string) {
    riskProfiles.value = await api.getRiskProfiles(institutionId)
  }

  async function fetchAnalytics(filters?: any) {
    try {
      analytics.value = await api.getAnalytics(filters)
    } catch (_e) {
      // Fallback demo data to keep charts visible when backend is not running
      analytics.value = {
        riskHeatmap: [
          { level: 'High', count: 38 },
          { level: 'Medium', count: 95 },
          { level: 'Low', count: 114 },
        ],
        riskRanking: [
          { name: 'Bank A', score: 85 },
          { name: 'Bank B', score: 72 },
          { name: 'Securities C', score: 68 },
          { name: 'MFI D', score: 61 },
          { name: 'Insurance E', score: 45 },
        ],
        supervisoryFrequency: [
          { date: 'Jan', count: 12 },
          { date: 'Feb', count: 14 },
          { date: 'Mar', count: 16 },
          { date: 'Apr', count: 13 },
          { date: 'May', count: 18 },
          { date: 'Jun', count: 17 },
        ],
        supervisoryIntensity: [
          { type: 'On-site', intensity: 4 },
          { type: 'Off-site', intensity: 3 },
          { type: 'Meetings', intensity: 2 },
          { type: 'Data Requests', intensity: 5 },
          { type: 'Follow-ups', intensity: 4 },
        ],
        complianceStatus: [
          { status: 'Compliant', count: 114 },
          { status: 'Needs Attention', count: 62 },
          { status: 'Non-compliant', count: 19 },
        ],
        trendAnalysis: [
          { period: 'Jan', current: 78, previous: 72 },
          { period: 'Feb', current: 80, previous: 74 },
          { period: 'Mar', current: 82, previous: 76 },
          { period: 'Apr', current: 84, previous: 77 },
          { period: 'May', current: 86, previous: 79 },
          { period: 'Jun', current: 88, previous: 81 },
        ],
      }
    }
  }

  return { institutions, riskProfiles, analytics, fetchInstitutions, fetchRiskProfiles, fetchAnalytics }
})
