/**
 * Supervisor Activity Monitor Type Definitions
 * 
 * @module types/supervisor
 * @description Type definitions for supervisor performance monitoring, tracking, and analytics
 * 
 * Requirements Coverage:
 * - ADM-SUP-001 to ADM-SUP-020: Complete type system for supervisor monitoring
 * 
 * @author bguvava
 * @since 2025-01-30
 */

// ============================================================
// ENUMS
// ============================================================

/**
 * Supervisor role/rank in the organization
 */
export enum SupervisorRole {
  SENIOR_SUPERVISOR = 'SENIOR_SUPERVISOR',
  SUPERVISOR = 'SUPERVISOR',
  JUNIOR_SUPERVISOR = 'JUNIOR_SUPERVISOR',
  TEAM_LEAD = 'TEAM_LEAD',
}

/**
 * Case status in the workflow
 */
export enum CaseStatus {
  PENDING_ASSIGNMENT = 'PENDING_ASSIGNMENT',
  ASSIGNED = 'ASSIGNED',
  IN_REVIEW = 'IN_REVIEW',
  PENDING_DECISION = 'PENDING_DECISION',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  DEFERRED = 'DEFERRED',
  ESCALATED = 'ESCALATED',
  CLOSED = 'CLOSED',
}

/**
 * Type of case being handled
 */
export enum CaseType {
  LICENSE_APPLICATION = 'LICENSE_APPLICATION',
  LICENSE_RENEWAL = 'LICENSE_RENEWAL',
  ONSITE_INSPECTION = 'ONSITE_INSPECTION',
  DESK_REVIEW = 'DESK_REVIEW',
  COMPLAINT_INVESTIGATION = 'COMPLAINT_INVESTIGATION',
  STR_REVIEW = 'STR_REVIEW',
  COMPLIANCE_ASSESSMENT = 'COMPLIANCE_ASSESSMENT',
  RISK_ASSESSMENT = 'RISK_ASSESSMENT',
  ENFORCEMENT_ACTION = 'ENFORCEMENT_ACTION',
}

/**
 * Decision type made by supervisor
 */
export enum DecisionType {
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
  DEFER = 'DEFER',
  REQUEST_MORE_INFO = 'REQUEST_MORE_INFO',
  ESCALATE = 'ESCALATE',
  CLOSE = 'CLOSE',
}

/**
 * Priority level of cases
 */
export enum CasePriority {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

/**
 * Type of activity logged
 */
export enum ActivityType {
  CASE_ASSIGNED = 'CASE_ASSIGNED',
  CASE_REVIEWED = 'CASE_REVIEWED',
  DECISION_MADE = 'DECISION_MADE',
  COMMENT_ADDED = 'COMMENT_ADDED',
  DOCUMENT_UPLOADED = 'DOCUMENT_UPLOADED',
  INSPECTION_SCHEDULED = 'INSPECTION_SCHEDULED',
  INSPECTION_COMPLETED = 'INSPECTION_COMPLETED',
  ENTITY_CONTACTED = 'ENTITY_CONTACTED',
  RISK_RATING_UPDATED = 'RISK_RATING_UPDATED',
  CASE_ESCALATED = 'CASE_ESCALATED',
  CASE_CLOSED = 'CASE_CLOSED',
}

/**
 * Type of anomaly detected
 */
export enum AnomalyType {
  SUDDEN_APPROVAL_RATE_CHANGE = 'SUDDEN_APPROVAL_RATE_CHANGE',
  RESPONSE_TIME_SPIKE = 'RESPONSE_TIME_SPIKE',
  INACTIVITY_PERIOD = 'INACTIVITY_PERIOD',
  QUALITY_SCORE_DROP = 'QUALITY_SCORE_DROP',
  OVERDUE_CASES_THRESHOLD = 'OVERDUE_CASES_THRESHOLD',
  UNUSUAL_DECISION_PATTERN = 'UNUSUAL_DECISION_PATTERN',
  LOW_PRODUCTIVITY = 'LOW_PRODUCTIVITY',
}

/**
 * Severity of anomaly or alert
 */
export enum AlertSeverity {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
  INFO = 'INFO',
}

/**
 * Report type for generation
 */
export enum ReportType {
  INDIVIDUAL_PERFORMANCE = 'INDIVIDUAL_PERFORMANCE',
  COMPARATIVE_ANALYSIS = 'COMPARATIVE_ANALYSIS',
  WORKLOAD_DISTRIBUTION = 'WORKLOAD_DISTRIBUTION',
  QUALITY_ASSESSMENT = 'QUALITY_ASSESSMENT',
  TREND_ANALYSIS = 'TREND_ANALYSIS',
  COMPREHENSIVE = 'COMPREHENSIVE',
}

/**
 * Time period for metrics
 */
export enum TimePeriod {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY',
  CUSTOM = 'CUSTOM',
}

// ============================================================
// INTERFACES
// ============================================================

/**
 * Core supervisor information
 * Requirement: ADM-SUP-001, ADM-SUP-004
 */
export interface Supervisor {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  role: SupervisorRole
  department: string
  startDate: Date
  photoUrl?: string
  isActive: boolean
  specializations: CaseType[]
  maxCaseLoad: number
  createdAt: Date
  updatedAt: Date
}

/**
 * Case assigned to supervisor
 * Requirements: ADM-SUP-003, ADM-SUP-011
 */
export interface SupervisorCase {
  id: string
  caseNumber: string
  supervisorId: string
  entityId: string
  entityName: string
  caseType: CaseType
  status: CaseStatus
  priority: CasePriority
  assignedDate: Date
  dueDate: Date
  completedDate?: Date
  responseTime?: number // in hours
  decisionType?: DecisionType
  decisionDate?: Date
  decisionNotes?: string
  riskRating?: number // 1-10
  isOverdue: boolean
  createdAt: Date
  updatedAt: Date
}

/**
 * Performance metrics for a supervisor
 * Requirements: ADM-SUP-001, ADM-SUP-006, ADM-SUP-007, ADM-SUP-008
 */
export interface PerformanceMetrics {
  supervisorId: string
  periodStart: Date
  periodEnd: Date
  
  // Case metrics
  totalCases: number
  pendingCases: number
  completedCases: number
  overdueCases: number
  
  // Decision metrics
  approvedCount: number
  rejectedCount: number
  deferredCount: number
  escalatedCount: number
  approvalRate: number // percentage
  
  // Time metrics
  avgResponseTime: number // hours
  avgCaseCompletionTime: number // hours
  fastestResponseTime: number // hours
  slowestResponseTime: number // hours
  
  // Quality metrics
  qualityScore: number // 0-100
  decisionConsistencyScore: number // 0-100
  accuracyScore: number // 0-100
  
  // Inspection metrics
  scheduledInspections: number
  completedInspections: number
  inspectionCompletionRate: number // percentage
  
  // Entity feedback
  avgEntityFeedbackScore?: number // 1-5
  totalFeedbackResponses?: number
  
  calculatedAt: Date
}

/**
 * Decision made by supervisor
 * Requirement: ADM-SUP-005
 */
export interface SupervisorDecision {
  id: string
  supervisorId: string
  caseId: string
  caseNumber: string
  entityName: string
  decisionType: DecisionType
  decisionDate: Date
  responseTime: number // hours from assignment
  notes: string
  attachments?: string[]
  createdAt: Date
}

/**
 * Activity log entry
 * Requirement: ADM-SUP-015
 */
export interface ActivityLog {
  id: string
  supervisorId: string
  activityType: ActivityType
  timestamp: Date
  caseId?: string
  caseNumber?: string
  entityId?: string
  entityName?: string
  description: string
  metadata?: Record<string, any>
  outcome?: string
  createdAt: Date
}

/**
 * Anomaly detection result
 * Requirement: ADM-SUP-010
 */
export interface PerformanceAnomaly {
  id: string
  supervisorId: string
  supervisorName: string
  anomalyType: AnomalyType
  severity: AlertSeverity
  detectedAt: Date
  description: string
  currentValue: number
  expectedValue: number
  threshold: number
  deviation: number // percentage
  affectedCases?: string[]
  recommendations: string[]
  isResolved: boolean
  resolvedAt?: Date
  resolvedBy?: string
  createdAt: Date
}

/**
 * Performance target/benchmark
 * Requirement: ADM-SUP-019
 */
export interface PerformanceTarget {
  id: string
  targetName: string
  description: string
  metric: string // e.g., 'avgResponseTime', 'qualityScore'
  targetValue: number
  warningThreshold: number
  criticalThreshold: number
  unit: string // e.g., 'hours', 'percentage', 'score'
  isActive: boolean
  appliesTo: SupervisorRole[]
  createdAt: Date
  updatedAt: Date
}

/**
 * Alert configuration
 * Requirement: ADM-SUP-020
 */
export interface AlertConfiguration {
  id: string
  alertName: string
  description: string
  anomalyType: AnomalyType
  isEnabled: boolean
  checkFrequency: number // minutes
  
  // Thresholds
  overdueCasesThreshold?: number
  qualityScoreDropThreshold?: number
  inactivityPeriodHours?: number
  responseTimeThreshold?: number
  approvalRateChangeThreshold?: number
  
  // Notification settings
  notifyEmail: boolean
  notifySMS: boolean
  notifyInApp: boolean
  recipients: string[]
  
  createdAt: Date
  updatedAt: Date
}

/**
 * Case load distribution data
 * Requirement: ADM-SUP-003
 */
export interface CaseLoadDistribution {
  supervisorId: string
  supervisorName: string
  totalCases: number
  pendingCases: number
  activeCases: number
  completedCases: number
  percentage: number
  isOverloaded: boolean
  isUnderloaded: boolean
  maxCapacity: number
  utilizationRate: number
}

/**
 * Workload rebalancing suggestion
 * Requirement: ADM-SUP-017
 */
export interface RebalancingSuggestion {
  fromSupervisorId: string
  fromSupervisorName: string
  toSupervisorId: string
  toSupervisorName: string
  casesToMove: number
  caseIds: string[]
  reason: string
  expectedImpact: {
    fromUtilization: number // percentage after rebalancing
    toUtilization: number // percentage after rebalancing
  }
}

/**
 * Historical performance trend data point
 * Requirement: ADM-SUP-016
 */
export interface PerformanceTrendData {
  supervisorId: string
  date: Date
  casesHandled: number
  avgResponseTime: number
  qualityScore: number
  approvalRate: number
  completionRate: number
}

/**
 * Comparative performance data
 * Requirement: ADM-SUP-002
 */
export interface ComparativeMetrics {
  metric: string
  label: string
  unit: string
  supervisors: {
    supervisorId: string
    supervisorName: string
    value: number
    rank: number
    percentile: number
  }[]
}

/**
 * Quality score breakdown
 * Requirement: ADM-SUP-008
 */
export interface QualityScoreBreakdown {
  supervisorId: string
  overallScore: number // 0-100
  
  components: {
    decisionConsistency: {
      score: number
      weight: number
      description: string
    }
    turnaroundTime: {
      score: number
      weight: number
      description: string
    }
    accuracyRate: {
      score: number
      weight: number
      description: string
    }
    entitySatisfaction: {
      score: number
      weight: number
      description: string
    }
    complianceAdherence: {
      score: number
      weight: number
      description: string
    }
  }
  
  calculatedAt: Date
}

/**
 * Risk assessment accuracy data
 * Requirement: ADM-SUP-012
 */
export interface RiskAssessmentAccuracy {
  supervisorId: string
  supervisorName: string
  totalAssessments: number
  accurateAssessments: number
  accuracyRate: number // percentage
  avgDeviation: number // difference from actual risk
  overestimations: number
  underestimations: number
  assessmentPeriod: {
    start: Date
    end: Date
  }
}

/**
 * Case type breakdown
 * Requirement: ADM-SUP-011
 */
export interface CaseTypeBreakdown {
  supervisorId: string
  breakdown: {
    caseType: CaseType
    count: number
    percentage: number
    avgResponseTime: number
    approvalRate: number
  }[]
}

/**
 * Report generation parameters
 * Requirement: ADM-SUP-018
 */
export interface ReportParameters {
  reportType: ReportType
  supervisorIds: string[]
  periodStart: Date
  periodEnd: Date
  includeCharts: boolean
  includeRecommendations: boolean
  includeActionItems: boolean
  format: 'PDF' | 'EXCEL' | 'JSON'
  generatedBy: string
}

/**
 * Generated report data
 * Requirement: ADM-SUP-018
 */
export interface SupervisorReport {
  id: string
  reportType: ReportType
  title: string
  generatedAt: Date
  generatedBy: string
  periodStart: Date
  periodEnd: Date
  
  summary: {
    totalSupervisors: number
    totalCases: number
    avgResponseTime: number
    avgQualityScore: number
    avgApprovalRate: number
  }
  
  supervisorDetails: {
    supervisorId: string
    supervisorName: string
    metrics: PerformanceMetrics
    trends: PerformanceTrendData[]
    anomalies: PerformanceAnomaly[]
    strengths: string[]
    areasForImprovement: string[]
  }[]
  
  recommendations: string[]
  actionItems: {
    priority: 'HIGH' | 'MEDIUM' | 'LOW'
    action: string
    assignedTo: string
    dueDate: Date
  }[]
  
  fileUrl?: string
}

/**
 * Dashboard summary data
 * Requirement: ADM-SUP-001
 */
export interface SupervisorDashboardSummary {
  totalSupervisors: number
  activeSupervisors: number
  totalCases: number
  pendingCases: number
  overdueCases: number
  avgResponseTime: number
  avgQualityScore: number
  activeAnomalies: number
  lastUpdated: Date
}

/**
 * Supervisor card data for overview
 * Requirement: ADM-SUP-001
 */
export interface SupervisorCardData {
  supervisor: Supervisor
  metrics: PerformanceMetrics
  recentActivity: ActivityLog[]
  activeAnomalies: PerformanceAnomaly[]
  trendIndicators: {
    casesHandled: 'up' | 'down' | 'stable'
    responseTime: 'up' | 'down' | 'stable'
    qualityScore: 'up' | 'down' | 'stable'
  }
}

/**
 * Filter options for supervisor monitoring
 */
export interface SupervisorFilters {
  roles?: SupervisorRole[]
  departments?: string[]
  caseTypes?: CaseType[]
  minQualityScore?: number
  maxResponseTime?: number
  hasAnomalies?: boolean
  isOverloaded?: boolean
  dateRange?: {
    start: Date
    end: Date
  }
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page: number
  pageSize: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    currentPage: number
    pageSize: number
    totalItems: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

// ============================================================
// UTILITY TYPES
// ============================================================

/**
 * Supervisor with computed fields
 */
export type SupervisorWithMetrics = Supervisor & {
  currentMetrics: PerformanceMetrics
  caseLoad: CaseLoadDistribution
  recentDecisions: SupervisorDecision[]
  activeAnomalies: PerformanceAnomaly[]
}

/**
 * Case with supervisor info
 */
export type CaseWithSupervisor = SupervisorCase & {
  supervisorName: string
  supervisorRole: SupervisorRole
}

/**
 * Anomaly with supervisor info
 */
export type AnomalyWithDetails = PerformanceAnomaly & {
  supervisor: Supervisor
  relatedCases: SupervisorCase[]
}
