/**
 * Audit Trail Type Definitions
 * 
 * @module types/auditTrail
 * @description Type definitions for audit trail, activity logging, and forensic investigation
 * 
 * Requirements Coverage:
 * - Comprehensive activity logging
 * - Forensic investigation capabilities
 * - Compliance reporting
 * - Data change tracking
 * - Tamper-proof audit trail
 * 
 * @author bguvava
 * @since 2025-10-30
 */

// ============================================================
// ENUMS
// ============================================================

/**
 * Category of activity being logged
 */
export enum ActivityCategory {
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  DATA_ACCESS = 'DATA_ACCESS',
  DATA_MODIFICATION = 'DATA_MODIFICATION',
  ENTITY_MANAGEMENT = 'ENTITY_MANAGEMENT',
  USER_MANAGEMENT = 'USER_MANAGEMENT',
  RISK_ASSESSMENT = 'RISK_ASSESSMENT',
  CASE_MANAGEMENT = 'CASE_MANAGEMENT',
  REPORT_GENERATION = 'REPORT_GENERATION',
  SYSTEM_CONFIGURATION = 'SYSTEM_CONFIGURATION',
  EXPORT = 'EXPORT',
  IMPORT = 'IMPORT',
  COMPLIANCE = 'COMPLIANCE',
  SUPERVISION = 'SUPERVISION',
}

/**
 * Specific action type
 */
export enum ActionType {
  // Authentication
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  LOGIN_FAILED = 'LOGIN_FAILED',
  PASSWORD_CHANGE = 'PASSWORD_CHANGE',
  PASSWORD_RESET = 'PASSWORD_RESET',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  
  // Data Operations
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  BULK_UPDATE = 'BULK_UPDATE',
  BULK_DELETE = 'BULK_DELETE',
  
  // Entity Management
  ENTITY_CREATED = 'ENTITY_CREATED',
  ENTITY_UPDATED = 'ENTITY_UPDATED',
  ENTITY_DELETED = 'ENTITY_DELETED',
  ENTITY_SUSPENDED = 'ENTITY_SUSPENDED',
  ENTITY_ACTIVATED = 'ENTITY_ACTIVATED',
  RISK_RATING_CHANGED = 'RISK_RATING_CHANGED',
  
  // Case Management
  CASE_CREATED = 'CASE_CREATED',
  CASE_ASSIGNED = 'CASE_ASSIGNED',
  CASE_UPDATED = 'CASE_UPDATED',
  CASE_CLOSED = 'CASE_CLOSED',
  DECISION_MADE = 'DECISION_MADE',
  
  // User Management
  USER_CREATED = 'USER_CREATED',
  USER_UPDATED = 'USER_UPDATED',
  USER_DELETED = 'USER_DELETED',
  USER_ROLE_CHANGED = 'USER_ROLE_CHANGED',
  USER_SUSPENDED = 'USER_SUSPENDED',
  USER_ACTIVATED = 'USER_ACTIVATED',
  
  // Reports & Exports
  REPORT_GENERATED = 'REPORT_GENERATED',
  DATA_EXPORTED = 'DATA_EXPORTED',
  DATA_IMPORTED = 'DATA_IMPORTED',
  
  // System
  SYSTEM_CONFIG_CHANGED = 'SYSTEM_CONFIG_CHANGED',
  BACKUP_CREATED = 'BACKUP_CREATED',
  BACKUP_RESTORED = 'BACKUP_RESTORED',
  
  // Compliance
  COMPLIANCE_CHECK = 'COMPLIANCE_CHECK',
  POLICY_UPDATED = 'POLICY_UPDATED',
  THRESHOLD_UPDATED = 'THRESHOLD_UPDATED',
  
  // Other
  FILE_UPLOADED = 'FILE_UPLOADED',
  FILE_DOWNLOADED = 'FILE_DOWNLOADED',
  FILE_DELETED = 'FILE_DELETED',
}

/**
 * Entity/resource type being acted upon
 */
export enum EntityType {
  USER = 'USER',
  ENTITY = 'ENTITY',
  CASE = 'CASE',
  DECISION = 'DECISION',
  REPORT = 'REPORT',
  RISK_ASSESSMENT = 'RISK_ASSESSMENT',
  STR = 'STR',
  DOCUMENT = 'DOCUMENT',
  CONFIGURATION = 'CONFIGURATION',
  POLICY = 'POLICY',
  THRESHOLD = 'THRESHOLD',
  SUPERVISOR = 'SUPERVISOR',
  COMPLIANCE_CHECK = 'COMPLIANCE_CHECK',
  AUDIT_LOG = 'AUDIT_LOG',
}

/**
 * Log severity level
 */
export enum LogLevel {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL',
  DEBUG = 'DEBUG',
}

/**
 * Result/outcome of the action
 */
export enum ActionResult {
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
  PARTIAL = 'PARTIAL',
  PENDING = 'PENDING',
}

/**
 * Retention period for audit logs
 */
export enum RetentionPeriod {
  DAYS_30 = 'DAYS_30',
  DAYS_90 = 'DAYS_90',
  MONTHS_6 = 'MONTHS_6',
  YEAR_1 = 'YEAR_1',
  YEARS_2 = 'YEARS_2',
  YEARS_5 = 'YEARS_5',
  YEARS_7 = 'YEARS_7',
  YEARS_10 = 'YEARS_10',
  PERMANENT = 'PERMANENT',
}

/**
 * Export format for audit reports
 */
export enum ExportFormat {
  CSV = 'CSV',
  EXCEL = 'EXCEL',
  PDF = 'PDF',
  JSON = 'JSON',
}

/**
 * Time range filter options
 */
export enum TimeRange {
  LAST_HOUR = 'LAST_HOUR',
  LAST_24_HOURS = 'LAST_24_HOURS',
  LAST_7_DAYS = 'LAST_7_DAYS',
  LAST_30_DAYS = 'LAST_30_DAYS',
  LAST_90_DAYS = 'LAST_90_DAYS',
  LAST_6_MONTHS = 'LAST_6_MONTHS',
  LAST_YEAR = 'LAST_YEAR',
  CUSTOM = 'CUSTOM',
}

// ============================================================
// BASE INTERFACES
// ============================================================

/**
 * Core audit log entry
 */
export interface AuditLog {
  id: string
  timestamp: Date
  category: ActivityCategory
  action: ActionType
  entityType: EntityType
  entityId: string | null
  entityName: string | null
  userId: string
  userName: string
  userRole: string
  ipAddress: string
  userAgent: string
  result: ActionResult
  logLevel: LogLevel
  duration?: number // milliseconds
  description: string
  metadata?: Record<string, any>
  changes?: DataChange[]
  errorMessage?: string
  stackTrace?: string
  sessionId: string
  requestId: string
  hash: string // Tamper-proof hash
}

/**
 * User action tracking
 */
export interface UserAction {
  id: string
  auditLogId: string
  timestamp: Date
  userId: string
  userName: string
  action: ActionType
  module: string
  feature: string
  details: string
  ipAddress: string
  location?: string
  device?: string
  browser?: string
  duration?: number
}

/**
 * Data change tracking (before/after)
 */
export interface DataChange {
  id: string
  auditLogId: string
  timestamp: Date
  entityType: EntityType
  entityId: string
  entityName: string
  fieldName: string
  fieldLabel: string
  oldValue: any
  newValue: any
  changeType: 'CREATE' | 'UPDATE' | 'DELETE'
  userId: string
  userName: string
}

/**
 * Login/session history
 */
export interface LoginHistory {
  id: string
  userId: string
  userName: string
  userRole: string
  loginTime: Date
  logoutTime: Date | null
  duration: number | null // minutes
  ipAddress: string
  location?: string
  device: string
  browser: string
  osName: string
  result: ActionResult
  failureReason?: string
  sessionId: string
  isActive: boolean
}

/**
 * Audit dashboard metrics
 */
export interface AuditDashboardMetrics {
  totalLogs: number
  last24Hours: number
  lastWeek: number
  lastMonth: number
  criticalEvents: number
  errorEvents: number
  warningEvents: number
  successfulActions: number
  failedActions: number
  activeUsers: number
  activeSessions: number
  dataChanges: number
  loginAttempts: number
  failedLoginAttempts: number
  topUsers: Array<{ userId: string; userName: string; actionCount: number }>
  topActions: Array<{ action: ActionType; count: number }>
  topEntities: Array<{ entityType: EntityType; count: number }>
  activityTrend: Array<{ date: string; count: number }>
  categoryDistribution: Array<{ category: ActivityCategory; count: number; percentage: number }>
  resultDistribution: Array<{ result: ActionResult; count: number; percentage: number }>
}

/**
 * Retention policy configuration
 */
export interface RetentionPolicy {
  id: string
  category: ActivityCategory
  entityType: EntityType | null
  logLevel: LogLevel | null
  retentionPeriod: RetentionPeriod
  retentionDays: number
  autoArchive: boolean
  archiveLocation?: string
  autoDelete: boolean
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  createdBy: string
  updatedBy: string
}

/**
 * Audit filters for searching/filtering
 */
export interface AuditFilters {
  searchQuery?: string
  categories?: ActivityCategory[]
  actions?: ActionType[]
  entityTypes?: EntityType[]
  userIds?: string[]
  userRoles?: string[]
  logLevels?: LogLevel[]
  results?: ActionResult[]
  timeRange?: TimeRange
  startDate?: Date
  endDate?: Date
  ipAddress?: string
  sessionId?: string
  entityId?: string
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
 * Paginated audit logs response
 */
export interface PaginatedAuditLogs {
  logs: AuditLog[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

/**
 * Audit export configuration
 */
export interface AuditExportConfig {
  format: ExportFormat
  filters: AuditFilters
  includeMetadata: boolean
  includeChanges: boolean
  includeStackTrace: boolean
  fileName: string
}

/**
 * Audit statistics for a time period
 */
export interface AuditStatistics {
  period: string
  totalActions: number
  successfulActions: number
  failedActions: number
  uniqueUsers: number
  uniqueSessions: number
  dataChanges: number
  criticalEvents: number
  averageDuration: number
  peakHour: string
  mostActiveUser: string
  mostCommonAction: ActionType
}

/**
 * Activity heatmap data
 */
export interface ActivityHeatmap {
  date: string
  hour: number
  activityCount: number
  intensity: 'low' | 'medium' | 'high' | 'very-high'
}

/**
 * User activity profile
 */
export interface UserActivityProfile {
  userId: string
  userName: string
  userRole: string
  totalActions: number
  lastActive: Date
  mostCommonAction: ActionType
  mostCommonCategory: ActivityCategory
  averageSessionDuration: number
  failedLoginAttempts: number
  riskScore: number
  activityPattern: Array<{ hour: number; count: number }>
}

/**
 * Forensic investigation case
 */
export interface ForensicCase {
  id: string
  title: string
  description: string
  category: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
  investigator: string
  startDate: Date
  endDate: Date | null
  relatedLogIds: string[]
  relatedUserIds: string[]
  findings: string
  recommendations: string
  createdAt: Date
  updatedAt: Date
}

/**
 * Compliance report data
 */
export interface ComplianceReport {
  id: string
  reportType: string
  generatedAt: Date
  period: { start: Date; end: Date }
  totalAuditLogs: number
  complianceScore: number
  violations: number
  criticalIssues: number
  recommendations: string[]
  summary: string
  generatedBy: string
}

/**
 * Tamper detection result
 */
export interface TamperDetectionResult {
  logId: string
  timestamp: Date
  isValid: boolean
  expectedHash: string
  actualHash: string
  tamperedFields?: string[]
  detectedAt: Date
  severity: LogLevel
}

// ============================================================
// INPUT/FORM INTERFACES (for validation)
// ============================================================

/**
 * Create audit log input
 */
export interface CreateAuditLogInput {
  category: ActivityCategory
  action: ActionType
  entityType: EntityType
  entityId: string | null
  entityName: string | null
  description: string
  result: ActionResult
  logLevel: LogLevel
  duration?: number
  metadata?: Record<string, any>
  changes?: Omit<DataChange, 'id' | 'auditLogId' | 'timestamp'>[]
  errorMessage?: string
  stackTrace?: string
}

/**
 * Create retention policy input
 */
export interface CreateRetentionPolicyInput {
  category: ActivityCategory
  entityType: EntityType | null
  logLevel: LogLevel | null
  retentionPeriod: RetentionPeriod
  autoArchive: boolean
  archiveLocation?: string
  autoDelete: boolean
}

/**
 * Update retention policy input
 */
export interface UpdateRetentionPolicyInput extends Partial<CreateRetentionPolicyInput> {
  id: string
}

/**
 * Forensic search parameters
 */
export interface ForensicSearchParams extends AuditFilters {
  includeRelated: boolean
  groupByUser: boolean
  groupByEntity: boolean
  detectAnomalies: boolean
}

/**
 * Anomaly detection result
 */
export interface AuditAnomaly {
  id: string
  type: 'UNUSUAL_ACTIVITY' | 'SUSPICIOUS_PATTERN' | 'POLICY_VIOLATION' | 'THRESHOLD_BREACH'
  severity: LogLevel
  description: string
  detectedAt: Date
  affectedLogs: string[]
  affectedUsers: string[]
  riskScore: number
  recommendations: string[]
}

// ============================================================
// UTILITY TYPES
// ============================================================

/**
 * Audit log summary card data
 */
export interface AuditSummaryCard {
  title: string
  value: number | string
  change?: number
  changeType?: 'increase' | 'decrease' | 'neutral'
  icon: string
  color: string
}

/**
 * Activity timeline item
 */
export interface ActivityTimelineItem {
  id: string
  timestamp: Date
  category: ActivityCategory
  action: ActionType
  userName: string
  description: string
  icon: string
  color: string
  metadata?: Record<string, any>
}

/**
 * Quick filter preset
 */
export interface QuickFilter {
  label: string
  filters: AuditFilters
  icon: string
}
