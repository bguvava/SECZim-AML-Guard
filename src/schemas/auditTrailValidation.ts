/**
 * Audit Trail Validation Schemas
 * 
 * @module schemas/auditTrailValidation
 * @description Zod validation schemas for audit trail data with runtime type safety
 * 
 * @author bguvava
 * @since 2025-10-30
 */

import { z } from 'zod'
import {
  ActivityCategory,
  ActionType,
  EntityType,
  LogLevel,
  ActionResult,
  RetentionPeriod,
  TimeRange,
  ExportFormat,
} from '@/types/auditTrail'

// ============================================================
// ENUM SCHEMAS
// ============================================================

export const activityCategorySchema = z.nativeEnum(ActivityCategory)
export const actionTypeSchema = z.nativeEnum(ActionType)
export const entityTypeSchema = z.nativeEnum(EntityType)
export const logLevelSchema = z.nativeEnum(LogLevel)
export const actionResultSchema = z.nativeEnum(ActionResult)
export const retentionPeriodSchema = z.nativeEnum(RetentionPeriod)
export const timeRangeSchema = z.nativeEnum(TimeRange)
export const exportFormatSchema = z.nativeEnum(ExportFormat)

// ============================================================
// DATA CHANGE SCHEMA
// ============================================================

export const dataChangeSchema = z.object({
  id: z.string().min(1, 'Change ID is required'),
  auditLogId: z.string().min(1, 'Audit log ID is required'),
  timestamp: z.date(),
  entityType: entityTypeSchema,
  entityId: z.string().min(1, 'Entity ID is required'),
  entityName: z.string().min(1, 'Entity name is required'),
  fieldName: z.string().min(1, 'Field name is required'),
  fieldLabel: z.string().min(1, 'Field label is required'),
  oldValue: z.any(),
  newValue: z.any(),
  changeType: z.enum(['CREATE', 'UPDATE', 'DELETE']),
  userId: z.string().min(1, 'User ID is required'),
  userName: z.string().min(1, 'User name is required'),
})

export const dataChangeInputSchema = dataChangeSchema.omit({
  id: true,
  auditLogId: true,
  timestamp: true,
})

// ============================================================
// AUDIT LOG SCHEMA
// ============================================================

export const auditLogSchema = z.object({
  id: z.string().min(1, 'Audit log ID is required'),
  timestamp: z.date(),
  category: activityCategorySchema,
  action: actionTypeSchema,
  entityType: entityTypeSchema,
  entityId: z.string().nullable(),
  entityName: z.string().nullable(),
  userId: z.string().min(1, 'User ID is required'),
  userName: z.string().min(1, 'User name is required'),
  userRole: z.string().min(1, 'User role is required'),
  ipAddress: z.string().ip({ version: 'v4' }),
  userAgent: z.string().min(1, 'User agent is required'),
  result: actionResultSchema,
  logLevel: logLevelSchema,
  duration: z.number().int().positive().optional(),
  description: z.string().min(1, 'Description is required').max(1000, 'Description too long'),
  metadata: z.record(z.any()).optional(),
  changes: z.array(dataChangeSchema).optional(),
  errorMessage: z.string().optional(),
  stackTrace: z.string().optional(),
  sessionId: z.string().min(1, 'Session ID is required'),
  requestId: z.string().min(1, 'Request ID is required'),
  hash: z.string().min(1, 'Hash is required'),
})

export const createAuditLogInputSchema = z.object({
  category: activityCategorySchema,
  action: actionTypeSchema,
  entityType: entityTypeSchema,
  entityId: z.string().nullable(),
  entityName: z.string().nullable(),
  description: z.string().min(1, 'Description is required').max(1000, 'Description too long'),
  result: actionResultSchema,
  logLevel: logLevelSchema,
  duration: z.number().int().positive().optional(),
  metadata: z.record(z.any()).optional(),
  changes: z.array(dataChangeInputSchema).optional(),
  errorMessage: z.string().optional(),
  stackTrace: z.string().optional(),
})

// ============================================================
// LOGIN HISTORY SCHEMA
// ============================================================

export const loginHistorySchema = z.object({
  id: z.string().min(1, 'Login history ID is required'),
  userId: z.string().min(1, 'User ID is required'),
  userName: z.string().min(1, 'User name is required'),
  userRole: z.string().min(1, 'User role is required'),
  loginTime: z.date(),
  logoutTime: z.date().nullable(),
  duration: z.number().int().positive().nullable(),
  ipAddress: z.string().ip({ version: 'v4' }),
  location: z.string().optional(),
  device: z.string().min(1, 'Device is required'),
  browser: z.string().min(1, 'Browser is required'),
  osName: z.string().min(1, 'OS name is required'),
  result: actionResultSchema,
  failureReason: z.string().optional(),
  sessionId: z.string().min(1, 'Session ID is required'),
  isActive: z.boolean(),
})

// ============================================================
// RETENTION POLICY SCHEMA
// ============================================================

export const retentionPolicySchema = z.object({
  id: z.string().min(1, 'Policy ID is required'),
  category: activityCategorySchema,
  entityType: entityTypeSchema.nullable(),
  logLevel: logLevelSchema.nullable(),
  retentionPeriod: retentionPeriodSchema,
  retentionDays: z.number().int(),
  autoArchive: z.boolean(),
  archiveLocation: z.string().optional(),
  autoDelete: z.boolean(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  createdBy: z.string().min(1, 'Created by is required'),
  updatedBy: z.string().min(1, 'Updated by is required'),
}).refine(
  (data) => {
    // If auto archive is enabled, archive location must be provided
    if (data.autoArchive && !data.archiveLocation) {
      return false
    }
    return true
  },
  {
    message: 'Archive location is required when auto archive is enabled',
    path: ['archiveLocation'],
  }
).refine(
  (data) => {
    // Retention days must be positive unless it's permanent retention
    if (data.retentionPeriod !== RetentionPeriod.PERMANENT && data.retentionDays <= 0) {
      return false
    }
    return true
  },
  {
    message: 'Retention days must be positive for non-permanent retention',
    path: ['retentionDays'],
  }
)

export const createRetentionPolicyInputSchema = z.object({
  category: activityCategorySchema,
  entityType: entityTypeSchema.nullable(),
  logLevel: logLevelSchema.nullable(),
  retentionPeriod: retentionPeriodSchema,
  autoArchive: z.boolean(),
  archiveLocation: z.string().optional(),
  autoDelete: z.boolean(),
}).refine(
  (data) => {
    if (data.autoArchive && !data.archiveLocation) {
      return false
    }
    return true
  },
  {
    message: 'Archive location is required when auto archive is enabled',
    path: ['archiveLocation'],
  }
)

export const updateRetentionPolicyInputSchema = z.object({
  id: z.string().min(1, 'Policy ID is required'),
  category: activityCategorySchema.optional(),
  entityType: entityTypeSchema.optional().nullable(),
  logLevel: logLevelSchema.optional().nullable(),
  retentionPeriod: retentionPeriodSchema.optional(),
  autoArchive: z.boolean().optional(),
  archiveLocation: z.string().optional().nullable(),
  autoDelete: z.boolean().optional(),
})

// ============================================================
// AUDIT FILTERS SCHEMA
// ============================================================

export const auditFiltersSchema = z.object({
  searchQuery: z.string().optional(),
  categories: z.array(activityCategorySchema).optional(),
  actions: z.array(actionTypeSchema).optional(),
  entityTypes: z.array(entityTypeSchema).optional(),
  userIds: z.array(z.string()).optional(),
  userRoles: z.array(z.string()).optional(),
  logLevels: z.array(logLevelSchema).optional(),
  results: z.array(actionResultSchema).optional(),
  timeRange: timeRangeSchema.optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  ipAddress: z.string().ip({ version: 'v4' }).optional(),
  sessionId: z.string().optional(),
  entityId: z.string().optional(),
}).refine(
  (data) => {
    // If custom time range, both start and end dates must be provided
    if (data.timeRange === TimeRange.CUSTOM) {
      return data.startDate && data.endDate
    }
    return true
  },
  {
    message: 'Start and end dates are required for custom time range',
    path: ['timeRange'],
  }
).refine(
  (data) => {
    // End date must be after start date
    if (data.startDate && data.endDate) {
      return data.endDate >= data.startDate
    }
    return true
  },
  {
    message: 'End date must be after or equal to start date',
    path: ['endDate'],
  }
)

// ============================================================
// PAGINATION SCHEMA
// ============================================================

export const paginationParamsSchema = z.object({
  page: z.number().int().positive(),
  pageSize: z.number().int().positive().max(100, 'Page size cannot exceed 100'),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
})

// ============================================================
// EXPORT CONFIGURATION SCHEMA
// ============================================================

export const auditExportConfigSchema = z.object({
  format: exportFormatSchema,
  filters: auditFiltersSchema,
  includeMetadata: z.boolean(),
  includeChanges: z.boolean(),
  includeStackTrace: z.boolean(),
  fileName: z.string().min(1, 'File name is required').regex(
    /^[a-zA-Z0-9_-]+$/,
    'File name can only contain letters, numbers, hyphens, and underscores'
  ),
})

// ============================================================
// FORENSIC CASE SCHEMA
// ============================================================

export const forensicCaseSchema = z.object({
  id: z.string().min(1, 'Case ID is required'),
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().min(1, 'Description is required').max(2000, 'Description too long'),
  category: z.string().min(1, 'Category is required'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  status: z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']),
  investigator: z.string().min(1, 'Investigator is required'),
  startDate: z.date(),
  endDate: z.date().nullable(),
  relatedLogIds: z.array(z.string()),
  relatedUserIds: z.array(z.string()),
  findings: z.string(),
  recommendations: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
}).refine(
  (data) => {
    // End date must be after start date
    if (data.endDate) {
      return data.endDate >= data.startDate
    }
    return true
  },
  {
    message: 'End date must be after or equal to start date',
    path: ['endDate'],
  }
)

export const createForensicCaseInputSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().min(1, 'Description is required').max(2000, 'Description too long'),
  category: z.string().min(1, 'Category is required'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  relatedLogIds: z.array(z.string()).min(1, 'At least one related log is required'),
  relatedUserIds: z.array(z.string()),
})

export const updateForensicCaseInputSchema = z.object({
  id: z.string().min(1, 'Case ID is required'),
  title: z.string().min(1, 'Title is required').max(200, 'Title too long').optional(),
  description: z.string().min(1, 'Description is required').max(2000, 'Description too long').optional(),
  category: z.string().min(1, 'Category is required').optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  status: z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']).optional(),
  investigator: z.string().min(1, 'Investigator is required').optional(),
  endDate: z.date().nullable().optional(),
  findings: z.string().optional(),
  recommendations: z.string().optional(),
})

// ============================================================
// FORENSIC SEARCH PARAMETERS SCHEMA
// ============================================================

export const forensicSearchParamsSchema = z.object({
  searchQuery: z.string().optional(),
  categories: z.array(activityCategorySchema).optional(),
  actions: z.array(actionTypeSchema).optional(),
  entityTypes: z.array(entityTypeSchema).optional(),
  userIds: z.array(z.string()).optional(),
  userRoles: z.array(z.string()).optional(),
  logLevels: z.array(logLevelSchema).optional(),
  results: z.array(actionResultSchema).optional(),
  timeRange: timeRangeSchema.optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  ipAddress: z.string().ip({ version: 'v4' }).optional(),
  sessionId: z.string().optional(),
  entityId: z.string().optional(),
  includeRelated: z.boolean(),
  groupByUser: z.boolean(),
  groupByEntity: z.boolean(),
  detectAnomalies: z.boolean(),
})

// ============================================================
// USER ACTIVITY PROFILE SCHEMA
// ============================================================

export const userActivityProfileSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  userName: z.string().min(1, 'User name is required'),
  userRole: z.string().min(1, 'User role is required'),
  totalActions: z.number().int().nonnegative(),
  lastActive: z.date(),
  mostCommonAction: actionTypeSchema,
  mostCommonCategory: activityCategorySchema,
  averageSessionDuration: z.number().int().positive(),
  failedLoginAttempts: z.number().int().nonnegative(),
  riskScore: z.number().min(0).max(100),
  activityPattern: z.array(z.object({
    hour: z.number().int().min(0).max(23),
    count: z.number().int().nonnegative(),
  })),
})

// ============================================================
// AUDIT ANOMALY SCHEMA
// ============================================================

export const auditAnomalySchema = z.object({
  id: z.string().min(1, 'Anomaly ID is required'),
  type: z.enum(['UNUSUAL_ACTIVITY', 'SUSPICIOUS_PATTERN', 'POLICY_VIOLATION', 'THRESHOLD_BREACH']),
  severity: logLevelSchema,
  description: z.string().min(1, 'Description is required'),
  detectedAt: z.date(),
  affectedLogs: z.array(z.string()).min(1, 'At least one affected log is required'),
  affectedUsers: z.array(z.string()).min(1, 'At least one affected user is required'),
  riskScore: z.number().min(0).max(100),
  recommendations: z.array(z.string()),
})

// ============================================================
// VALIDATION FUNCTIONS WITH ERROR HANDLING
// ============================================================

export type AuditLogInput = z.infer<typeof createAuditLogInputSchema>
export type RetentionPolicyInput = z.infer<typeof createRetentionPolicyInputSchema>
export type UpdateRetentionPolicyInput = z.infer<typeof updateRetentionPolicyInputSchema>
export type AuditFiltersInput = z.infer<typeof auditFiltersSchema>
export type PaginationParamsInput = z.infer<typeof paginationParamsSchema>
export type AuditExportConfigInput = z.infer<typeof auditExportConfigSchema>
export type ForensicCaseInput = z.infer<typeof createForensicCaseInputSchema>
export type UpdateForensicCaseInput = z.infer<typeof updateForensicCaseInputSchema>
export type ForensicSearchParamsInput = z.infer<typeof forensicSearchParamsSchema>

/**
 * Validate audit log input
 */
export function validateAuditLog(data: unknown): AuditLogInput {
  return createAuditLogInputSchema.parse(data)
}

/**
 * Validate retention policy input
 */
export function validateRetentionPolicy(data: unknown): RetentionPolicyInput {
  return createRetentionPolicyInputSchema.parse(data)
}

/**
 * Validate update retention policy input
 */
export function validateUpdateRetentionPolicy(data: unknown): UpdateRetentionPolicyInput {
  return updateRetentionPolicyInputSchema.parse(data)
}

/**
 * Validate audit filters
 */
export function validateAuditFilters(data: unknown): AuditFiltersInput {
  return auditFiltersSchema.parse(data)
}

/**
 * Validate pagination parameters
 */
export function validatePaginationParams(data: unknown): PaginationParamsInput {
  return paginationParamsSchema.parse(data)
}

/**
 * Validate audit export configuration
 */
export function validateAuditExportConfig(data: unknown): AuditExportConfigInput {
  return auditExportConfigSchema.parse(data)
}

/**
 * Validate forensic case input
 */
export function validateForensicCase(data: unknown): ForensicCaseInput {
  return createForensicCaseInputSchema.parse(data)
}

/**
 * Validate update forensic case input
 */
export function validateUpdateForensicCase(data: unknown): UpdateForensicCaseInput {
  return updateForensicCaseInputSchema.parse(data)
}

/**
 * Validate forensic search parameters
 */
export function validateForensicSearchParams(data: unknown): ForensicSearchParamsInput {
  return forensicSearchParamsSchema.parse(data)
}

/**
 * Safe validation with error handling
 */
export function safeValidate<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: z.ZodError } {
  const result = schema.safeParse(data)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return { success: false, errors: result.error }
}
