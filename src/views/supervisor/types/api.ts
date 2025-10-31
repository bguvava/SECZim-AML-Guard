// API response and request types for Supervision & Monitoring module
import type { UUID, Institution, RiskProfile, RiskScore, TrendPoint } from './models'

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface InstitutionsQuery {
  search?: string;
  status?: string;
  riskLevel?: string;
  page?: number;
  pageSize?: number;
}

export interface CreateInstitutionRequest extends Omit<Institution, 'id' | 'createdAt' | 'updatedAt'> {}
export interface UpdateInstitutionRequest extends Partial<CreateInstitutionRequest> {}

export interface CreateRiskProfileRequest extends Omit<RiskProfile, 'id' | 'createdAt' | 'updatedAt' | 'assessedAt'> {}
export interface UpdateRiskProfileRequest extends Partial<CreateRiskProfileRequest> {}

export interface AnalyticsResponse {
  riskHeatmap: { level: string; count: number }[];
  riskRanking: { name: string; score: number }[];
  supervisoryFrequency: { date: string; count: number }[];
  supervisoryIntensity: { type: string; intensity: number }[];
  complianceStatus: { status: string; count: number }[];
  trendAnalysis: TrendPoint[];
}

export interface TrendsResponse {
  trends: TrendPoint[];
}

export interface DashboardRequestFilters {
  from?: string;
  to?: string;
  categories?: string[];
}

export interface RiskAssessmentRequest {
  institutionId: UUID;
}

export interface RiskAssessmentResponse extends RiskScore {}
