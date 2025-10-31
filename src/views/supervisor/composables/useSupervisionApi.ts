import { ref } from 'vue'
import { useAuthStore } from '@/stores/useAuthStore'
import type {
  ApiResponse,
  Paginated,
  InstitutionsQuery,
  CreateInstitutionRequest,
  UpdateInstitutionRequest,
  CreateRiskProfileRequest,
  UpdateRiskProfileRequest,
  AnalyticsResponse,
  TrendsResponse,
  DashboardRequestFilters,
  RiskAssessmentRequest,
  RiskAssessmentResponse,
} from '../types/api'
import type { Institution, RiskProfile, SurveillanceLog, InspectionFinding } from '../types/models'

const BASE_URL = import.meta.env.VITE_SUPERVISION_API_BASE_URL || '/api'

export function useSupervisionApi() {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const auth = useAuthStore()

  function authHeaders() {
    const headers: HeadersInit = { 'Content-Type': 'application/json' }
    if (auth.token) headers['Authorization'] = `Bearer ${auth.token}`
    return headers
  }

  async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
    loading.value = true
    error.value = null
    try {
      const res = await fetch(`${BASE_URL}${url}`, {
        ...options,
        headers: { ...authHeaders(), ...(options.headers || {}) },
      })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || res.statusText)
      }
      const json = (await res.json()) as ApiResponse<T>
      if (!json.success) {
        throw new Error(json.error || 'Unknown API error')
      }
      return json.data as T
    } catch (e: any) {
      error.value = e.message || 'Request failed'
      throw e
    } finally {
      loading.value = false
    }
  }

  // Mapping helpers between API (snake_case) and UI (camelCase)
  function mapInstitutionFromApi(row: any): Institution {
    return {
      id: row.id,
      name: row.name,
      licenseNumber: row.license_number,
      category: row.category,
      status: row.status,
      riskLevel: row.risk_level,
      riskScore: row.risk_score ?? undefined,
      lastAssessmentAt: row.last_assessed_at ?? undefined,
      contact: row.contact ?? undefined,
      createdAt: typeof row.created_at === 'string' ? row.created_at : new Date(row.created_at).toISOString(),
      updatedAt: typeof row.updated_at === 'string' ? row.updated_at : new Date(row.updated_at).toISOString(),
    }
  }

  function mapPaginatedInstitutions(payload: any): Paginated<Institution> {
    return {
      items: Array.isArray(payload.items) ? payload.items.map(mapInstitutionFromApi) : [],
      total: payload.total ?? 0,
      page: payload.page ?? 1,
      pageSize: payload.pageSize ?? payload.page_size ?? 10,
    }
  }

  // Institutions
  const getInstitutions = async (q: InstitutionsQuery = {}) => {
    const data = await request<any>(`/institutions?${new URLSearchParams(q as any).toString()}`)
    return mapPaginatedInstitutions(data)
  }
  const getInstitution = async (id: string) => {
    const data = await request<any>(`/institutions/${id}`)
    return mapInstitutionFromApi(data)
  }
  const createInstitution = async (payload: CreateInstitutionRequest) => {
    const data = await request<any>('/institutions', { method: 'POST', body: JSON.stringify(payload) })
    return mapInstitutionFromApi(data)
  }
  const updateInstitution = async (id: string, payload: UpdateInstitutionRequest) => {
    const data = await request<any>(`/institutions/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
    return mapInstitutionFromApi(data)
  }
  const deleteInstitution = (id: string) => request<void>(`/institutions/${id}`, { method: 'DELETE' })

  // Risk Profiles
  const getRiskProfiles = (institutionId: string) =>
    request<RiskProfile[]>(`/risk-profiles?institutionId=${institutionId}`)
  const createRiskProfile = (payload: CreateRiskProfileRequest) =>
    request<RiskProfile>('/risk-profiles', { method: 'POST', body: JSON.stringify(payload) })
  const updateRiskProfile = (id: string, payload: UpdateRiskProfileRequest) =>
    request<RiskProfile>(`/risk-profiles/${id}`, { method: 'PUT', body: JSON.stringify(payload) })

  // Surveillance & Inspections
  const getSurveillanceLogs = (institutionId: string) =>
    request<SurveillanceLog[]>(`/surveillance?institutionId=${institutionId}`)
  const getInspections = (institutionId: string) =>
    request<InspectionFinding[]>(`/inspections?institutionId=${institutionId}`)

  // Risk Assessment
  const runRiskAssessment = (payload: RiskAssessmentRequest) =>
    request<RiskAssessmentResponse>('/risk-assessment', { method: 'POST', body: JSON.stringify(payload) })

  // Analytics
  const getAnalytics = (filters: DashboardRequestFilters = {}) =>
    request<AnalyticsResponse>('/dashboard/analytics', { method: 'POST', body: JSON.stringify(filters) })
  const getTrends = (filters: DashboardRequestFilters = {}) =>
    request<TrendsResponse>('/dashboard/trends', { method: 'POST', body: JSON.stringify(filters) })

  return {
    loading,
    error,
    getInstitutions,
    getInstitution,
    createInstitution,
    updateInstitution,
    deleteInstitution,
    getRiskProfiles,
    createRiskProfile,
    updateRiskProfile,
    getSurveillanceLogs,
    getInspections,
    runRiskAssessment,
    getAnalytics,
    getTrends,
  }
}
