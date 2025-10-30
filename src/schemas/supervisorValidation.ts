/**
 * Supervisor Activity Monitor Validation Schemas
 * 
 * @module schemas/supervisorValidation
 * @description Zod validation schemas for supervisor monitoring data
 * 
 * Requirements Coverage:
 * - ADM-SUP-017: Workload rebalancing validation
 * - ADM-SUP-018: Report generation validation
 * - ADM-SUP-019: Performance targets validation
 * - ADM-SUP-020: Alert configuration validation
 * 
 * @author bguvava
 * @since 2025-01-30
 */

import { z } from 'zod'
import {
  SupervisorRole,
  CaseStatus,
  CaseType,
  DecisionType,
  CasePriority,
  ActivityType,
  AnomalyType,
  AlertSeverity,
  ReportType,
  TimePeriod,
} from '@/types/supervisor'

// ============================================================
// BASIC SCHEMAS
// ============================================================

/**
 * Supervisor creation/update schema
 */
export const supervisorSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters').max(50),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').max(50),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\+263\s?\d{2,3}\s?\d{3}\s?\d{4}$/, 'Invalid Zimbabwe phone number format'),
  role: z.nativeEnum(SupervisorRole),
  department: z.string().min(3, 'Department must be at least 3 characters'),
  startDate: z.date().max(new Date(), 'Start date cannot be in the future'),
  photoUrl: z.string().url().optional(),
  isActive: z.boolean().default(true),
  specializations: z.array(z.nativeEnum(CaseType)).min(1, 'At least one specialization required'),
  maxCaseLoad: z.number().int().min(5, 'Max case load must be at least 5').max(50, 'Max case load cannot exceed 50'),
})

export type SupervisorInput = z.infer<typeof supervisorSchema>

/**
 * Case assignment schema
 */
export const caseAssignmentSchema = z.object({
  caseId: z.string().min(1, 'Case ID is required'),
  supervisorId: z.string().min(1, 'Supervisor ID is required'),
  priority: z.nativeEnum(CasePriority),
  dueDate: z.date().refine((date) => date > new Date(), {
    message: 'Due date must be in the future',
  }),
  notes: z.string().max(1000, 'Notes cannot exceed 1000 characters').optional(),
})

export type CaseAssignmentInput = z.infer<typeof caseAssignmentSchema>

/**
 * Decision making schema
 */
export const decisionSchema = z.object({
  caseId: z.string().min(1, 'Case ID is required'),
  decisionType: z.nativeEnum(DecisionType),
  notes: z.string().min(10, 'Decision notes must be at least 10 characters').max(2000),
  attachments: z.array(z.string()).optional(),
})
  .refine((data) => {
    // Escalation requires detailed notes
    if (data.decisionType === DecisionType.ESCALATE) {
      return data.notes.length >= 50
    }
    // Rejection requires detailed justification
    if (data.decisionType === DecisionType.REJECT) {
      return data.notes.length >= 50
    }
    return true
  }, {
    message: 'Escalations and rejections require detailed notes (minimum 50 characters)',
  })

export type DecisionInput = z.infer<typeof decisionSchema>

// ============================================================
// PERFORMANCE TARGET SCHEMAS
// ============================================================

/**
 * Performance target creation/update schema
 * Requirement: ADM-SUP-019
 */
export const performanceTargetSchema = z.object({
  targetName: z.string().min(3, 'Target name must be at least 3 characters').max(100),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500),
  metric: z.string().min(1, 'Metric name is required'),
  targetValue: z.number().positive('Target value must be positive'),
  warningThreshold: z.number().positive('Warning threshold must be positive'),
  criticalThreshold: z.number().positive('Critical threshold must be positive'),
  unit: z.string().min(1, 'Unit is required'),
  isActive: z.boolean().default(true),
  appliesTo: z.array(z.nativeEnum(SupervisorRole)).min(1, 'Must apply to at least one role'),
})
  .refine((data) => {
    // For metrics where higher is better (quality score, approval rate)
    const higherIsBetterMetrics = ['qualityScore', 'approvalRate', 'inspectionCompletionRate', 'completedCases']
    if (higherIsBetterMetrics.some(m => data.metric.includes(m))) {
      return data.criticalThreshold < data.warningThreshold && data.warningThreshold < data.targetValue
    }
    // For metrics where lower is better (response time, overdue cases)
    const lowerIsBetterMetrics = ['avgResponseTime', 'overdueCases', 'avgCaseCompletionTime']
    if (lowerIsBetterMetrics.some(m => data.metric.includes(m))) {
      return data.targetValue < data.warningThreshold && data.warningThreshold < data.criticalThreshold
    }
    return true
  }, {
    message: 'Thresholds must be logically ordered based on metric type',
  })

export type PerformanceTargetInput = z.infer<typeof performanceTargetSchema>

// ============================================================
// ALERT CONFIGURATION SCHEMAS
// ============================================================

/**
 * Alert configuration schema
 * Requirement: ADM-SUP-020
 */
export const alertConfigurationSchema = z.object({
  alertName: z.string().min(3, 'Alert name must be at least 3 characters').max(100),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500),
  anomalyType: z.nativeEnum(AnomalyType),
  isEnabled: z.boolean().default(true),
  checkFrequency: z.number().int().min(15, 'Check frequency must be at least 15 minutes').max(10080, 'Check frequency cannot exceed 1 week'),
  
  // Conditional thresholds
  overdueCasesThreshold: z.number().int().min(0).optional(),
  qualityScoreDropThreshold: z.number().min(1).max(50).optional(),
  inactivityPeriodHours: z.number().int().min(12).max(168).optional(),
  responseTimeThreshold: z.number().int().min(24).optional(),
  approvalRateChangeThreshold: z.number().min(5).max(50).optional(),
  
  // Notification settings
  notifyEmail: z.boolean().default(true),
  notifySMS: z.boolean().default(false),
  notifyInApp: z.boolean().default(true),
  recipients: z.array(z.string().email()).min(1, 'At least one recipient required'),
})
  .refine((data) => {
    // Ensure at least one notification method is enabled
    return data.notifyEmail || data.notifySMS || data.notifyInApp
  }, {
    message: 'At least one notification method must be enabled',
  })
  .refine((data) => {
    // Ensure relevant threshold is set for the anomaly type
    const thresholdRequired = {
      [AnomalyType.OVERDUE_CASES_THRESHOLD]: 'overdueCasesThreshold',
      [AnomalyType.QUALITY_SCORE_DROP]: 'qualityScoreDropThreshold',
      [AnomalyType.INACTIVITY_PERIOD]: 'inactivityPeriodHours',
      [AnomalyType.RESPONSE_TIME_SPIKE]: 'responseTimeThreshold',
      [AnomalyType.SUDDEN_APPROVAL_RATE_CHANGE]: 'approvalRateChangeThreshold',
    }
    
    const requiredField = thresholdRequired[data.anomalyType as keyof typeof thresholdRequired]
    if (requiredField) {
      return data[requiredField as keyof typeof data] !== undefined
    }
    return true
  }, {
    message: 'Required threshold field must be set for this anomaly type',
  })

export type AlertConfigurationInput = z.infer<typeof alertConfigurationSchema>

// ============================================================
// WORKLOAD REBALANCING SCHEMAS
// ============================================================

/**
 * Workload rebalancing request schema
 * Requirement: ADM-SUP-017
 */
export const workloadRebalancingSchema = z.object({
  fromSupervisorId: z.string().min(1, 'Source supervisor ID is required'),
  toSupervisorId: z.string().min(1, 'Target supervisor ID is required'),
  caseIds: z.array(z.string()).min(1, 'At least one case must be selected').max(20, 'Cannot move more than 20 cases at once'),
  reason: z.string().min(20, 'Reason must be at least 20 characters').max(500),
  notifySupervisors: z.boolean().default(true),
  effectiveDate: z.date().refine((date) => date >= new Date(), {
    message: 'Effective date cannot be in the past',
  }),
})
  .refine((data) => data.fromSupervisorId !== data.toSupervisorId, {
    message: 'Source and target supervisors must be different',
  })

export type WorkloadRebalancingInput = z.infer<typeof workloadRebalancingSchema>

/**
 * Auto-rebalancing parameters schema
 */
export const autoRebalancingParamsSchema = z.object({
  enabled: z.boolean().default(false),
  maxUtilizationThreshold: z.number().min(70).max(100).default(85),
  minUtilizationThreshold: z.number().min(20).max(60).default(40),
  checkFrequencyHours: z.number().int().min(1).max(24).default(6),
  maxCasesToMove: z.number().int().min(1).max(10).default(5),
  respectSpecializations: z.boolean().default(true),
  notifyOnRebalance: z.boolean().default(true),
})
  .refine((data) => data.minUtilizationThreshold < data.maxUtilizationThreshold, {
    message: 'Minimum utilization must be less than maximum utilization',
  })

export type AutoRebalancingParams = z.infer<typeof autoRebalancingParamsSchema>

// ============================================================
// REPORT GENERATION SCHEMAS
// ============================================================

/**
 * Report parameters schema
 * Requirement: ADM-SUP-018
 */
export const reportParametersSchema = z.object({
  reportType: z.nativeEnum(ReportType),
  supervisorIds: z.array(z.string()).min(1, 'At least one supervisor must be selected'),
  periodStart: z.date(),
  periodEnd: z.date(),
  includeCharts: z.boolean().default(true),
  includeRecommendations: z.boolean().default(true),
  includeActionItems: z.boolean().default(true),
  format: z.enum(['PDF', 'EXCEL', 'JSON']).default('PDF'),
  title: z.string().max(200).optional(),
  description: z.string().max(1000).optional(),
})
  .refine((data) => data.periodEnd > data.periodStart, {
    message: 'Period end date must be after start date',
  })
  .refine((data) => {
    const daysDiff = (data.periodEnd.getTime() - data.periodStart.getTime()) / (1000 * 60 * 60 * 24)
    return daysDiff >= 1 && daysDiff <= 365
  }, {
    message: 'Report period must be between 1 day and 1 year',
  })
  .refine((data) => data.supervisorIds.length <= 20, {
    message: 'Cannot generate report for more than 20 supervisors at once',
  })

export type ReportParametersInput = z.infer<typeof reportParametersSchema>

/**
 * Action item schema for reports
 */
export const actionItemSchema = z.object({
  priority: z.enum(['HIGH', 'MEDIUM', 'LOW']),
  action: z.string().min(10, 'Action description must be at least 10 characters').max(500),
  assignedTo: z.string().min(1, 'Assigned person is required'),
  dueDate: z.date().refine((date) => date > new Date(), {
    message: 'Due date must be in the future',
  }),
  category: z.string().optional(),
  estimatedEffort: z.string().optional(),
})

export type ActionItemInput = z.infer<typeof actionItemSchema>

// ============================================================
// FILTER SCHEMAS
// ============================================================

/**
 * Supervisor filters schema
 */
export const supervisorFiltersSchema = z.object({
  roles: z.array(z.nativeEnum(SupervisorRole)).optional(),
  departments: z.array(z.string()).optional(),
  caseTypes: z.array(z.nativeEnum(CaseType)).optional(),
  minQualityScore: z.number().min(0).max(100).optional(),
  maxResponseTime: z.number().positive().optional(),
  hasAnomalies: z.boolean().optional(),
  isOverloaded: z.boolean().optional(),
  dateRange: z.object({
    start: z.date(),
    end: z.date(),
  }).refine((data) => data.end >= data.start, {
    message: 'End date must be after or equal to start date',
  }).optional(),
})

export type SupervisorFiltersInput = z.infer<typeof supervisorFiltersSchema>

/**
 * Pagination parameters schema
 */
export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(5).max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
})

export type PaginationInput = z.infer<typeof paginationSchema>

// ============================================================
// QUALITY SCORING SCHEMAS
// ============================================================

/**
 * Quality score calculation parameters
 */
export const qualityScoreParamsSchema = z.object({
  decisionConsistencyWeight: z.number().min(0).max(1).default(0.25),
  turnaroundTimeWeight: z.number().min(0).max(1).default(0.20),
  accuracyWeight: z.number().min(0).max(1).default(0.30),
  entitySatisfactionWeight: z.number().min(0).max(1).default(0.15),
  complianceWeight: z.number().min(0).max(1).default(0.10),
  
  targetResponseTime: z.number().positive().default(120),
  targetAccuracyRate: z.number().min(0).max(100).default(90),
  targetInspectionRate: z.number().min(0).max(100).default(90),
})
  .refine((data) => {
    const totalWeight = data.decisionConsistencyWeight + 
                       data.turnaroundTimeWeight + 
                       data.accuracyWeight + 
                       data.entitySatisfactionWeight + 
                       data.complianceWeight
    return Math.abs(totalWeight - 1.0) < 0.01
  }, {
    message: 'Quality score component weights must sum to 1.0',
  })

export type QualityScoreParams = z.infer<typeof qualityScoreParamsSchema>

// ============================================================
// ACTIVITY LOG SCHEMAS
// ============================================================

/**
 * Activity log creation schema
 */
export const activityLogSchema = z.object({
  supervisorId: z.string().min(1, 'Supervisor ID is required'),
  activityType: z.nativeEnum(ActivityType),
  caseId: z.string().optional(),
  entityId: z.string().optional(),
  description: z.string().min(5, 'Description must be at least 5 characters').max(500),
  metadata: z.record(z.any()).optional(),
  outcome: z.string().max(200).optional(),
})

export type ActivityLogInput = z.infer<typeof activityLogSchema>

// ============================================================
// ANOMALY DETECTION SCHEMAS
// ============================================================

/**
 * Anomaly detection configuration schema
 */
export const anomalyDetectionConfigSchema = z.object({
  enabled: z.boolean().default(true),
  checkFrequencyMinutes: z.number().int().min(15).max(1440).default(60),
  
  // Thresholds for each anomaly type
  overdueCasesThreshold: z.number().int().min(0).default(1),
  qualityScoreDropPercentage: z.number().min(5).max(50).default(10),
  responseTimeSpikePercentage: z.number().min(20).max(100).default(40),
  inactivityHours: z.number().int().min(12).max(168).default(48),
  approvalRateChangePercentage: z.number().min(10).max(50).default(25),
  lowProductivityThreshold: z.number().int().min(5).default(10),
  
  // Severity thresholds
  criticalThresholdMultiplier: z.number().min(1.5).max(3).default(2),
  highThresholdMultiplier: z.number().min(1.2).max(2).default(1.5),
  
  autoNotify: z.boolean().default(true),
  notificationRecipients: z.array(z.string().email()).optional(),
})

export type AnomalyDetectionConfig = z.infer<typeof anomalyDetectionConfigSchema>

/**
 * Anomaly resolution schema
 */
export const anomalyResolutionSchema = z.object({
  anomalyId: z.string().min(1, 'Anomaly ID is required'),
  resolvedBy: z.string().min(1, 'Resolver ID is required'),
  resolutionNotes: z.string().min(20, 'Resolution notes must be at least 20 characters').max(1000),
  actionsTaken: z.array(z.string()).min(1, 'At least one action must be documented'),
  preventiveMeasures: z.string().max(500).optional(),
})

export type AnomalyResolutionInput = z.infer<typeof anomalyResolutionSchema>

// ============================================================
// COMPARATIVE ANALYSIS SCHEMAS
// ============================================================

/**
 * Comparative analysis parameters schema
 */
export const comparativeAnalysisSchema = z.object({
  supervisorIds: z.array(z.string()).min(2, 'At least 2 supervisors required for comparison').max(10, 'Cannot compare more than 10 supervisors'),
  metrics: z.array(z.string()).min(1, 'At least one metric required'),
  periodStart: z.date(),
  periodEnd: z.date(),
  includePercentiles: z.boolean().default(true),
  includeRankings: z.boolean().default(true),
  normalizationMethod: z.enum(['NONE', 'MIN_MAX', 'Z_SCORE']).default('MIN_MAX'),
})
  .refine((data) => data.periodEnd > data.periodStart, {
    message: 'Period end must be after start',
  })

export type ComparativeAnalysisInput = z.infer<typeof comparativeAnalysisSchema>

// ============================================================
// TREND ANALYSIS SCHEMAS
// ============================================================

/**
 * Trend analysis parameters schema
 */
export const trendAnalysisSchema = z.object({
  supervisorId: z.string().min(1, 'Supervisor ID is required'),
  metrics: z.array(z.string()).min(1, 'At least one metric required'),
  startDate: z.date(),
  endDate: z.date(),
  granularity: z.enum(['DAILY', 'WEEKLY', 'MONTHLY']).default('WEEKLY'),
  includeForecast: z.boolean().default(false),
  forecastPeriods: z.number().int().min(1).max(12).optional(),
})
  .refine((data) => data.endDate > data.startDate, {
    message: 'End date must be after start date',
  })
  .refine((data) => {
    if (data.includeForecast) {
      return data.forecastPeriods !== undefined && data.forecastPeriods > 0
    }
    return true
  }, {
    message: 'Forecast periods must be specified when forecast is included',
  })

export type TrendAnalysisInput = z.infer<typeof trendAnalysisSchema>

// ============================================================
// BULK OPERATIONS SCHEMAS
// ============================================================

/**
 * Bulk case reassignment schema
 */
export const bulkReassignmentSchema = z.object({
  caseIds: z.array(z.string()).min(1, 'At least one case required').max(50, 'Cannot reassign more than 50 cases at once'),
  fromSupervisorId: z.string().optional(),
  toSupervisorId: z.string().min(1, 'Target supervisor required'),
  reason: z.string().min(10, 'Reason required').max(500),
  notifyAffectedSupervisors: z.boolean().default(true),
  notifyEntities: z.boolean().default(false),
})

export type BulkReassignmentInput = z.infer<typeof bulkReassignmentSchema>

/**
 * Bulk target update schema
 */
export const bulkTargetUpdateSchema = z.object({
  targetIds: z.array(z.string()).min(1, 'At least one target required'),
  updates: z.object({
    targetValue: z.number().positive().optional(),
    warningThreshold: z.number().positive().optional(),
    criticalThreshold: z.number().positive().optional(),
    isActive: z.boolean().optional(),
  }),
  reason: z.string().min(10, 'Reason required').max(500),
})

export type BulkTargetUpdateInput = z.infer<typeof bulkTargetUpdateSchema>

// ============================================================
// EXPORT FUNCTIONS
// ============================================================

/**
 * Validate supervisor data
 */
export const validateSupervisor = (data: unknown) => supervisorSchema.parse(data)

/**
 * Validate performance target data
 */
export const validatePerformanceTarget = (data: unknown) => performanceTargetSchema.parse(data)

/**
 * Validate alert configuration data
 */
export const validateAlertConfiguration = (data: unknown) => alertConfigurationSchema.parse(data)

/**
 * Validate report parameters
 */
export const validateReportParameters = (data: unknown) => reportParametersSchema.parse(data)

/**
 * Validate workload rebalancing request
 */
export const validateWorkloadRebalancing = (data: unknown) => workloadRebalancingSchema.parse(data)

/**
 * Validate decision data
 */
export const validateDecision = (data: unknown) => decisionSchema.parse(data)

/**
 * Validate pagination parameters
 */
export const validatePagination = (data: unknown) => paginationSchema.parse(data)
