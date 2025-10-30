/**
 * Audit Trail Composable
 * 
 * @module composables/useAuditTrail
 * @description Central state management for audit trail, activity logging, and forensic investigation
 * 
 * Success Criteria:
 * - All actions logged automatically
 * - Search returns results in < 2 seconds
 * - Audit trail is tamper-proof (hash verification)
 * - Export handles large datasets
 * - Retention policies apply correctly
 * 
 * @author bguvava
 * @since 2025-10-30
 */

import { ref, computed, readonly } from 'vue'
import type {
  AuditLog,
  UserAction,
  DataChange,
  LoginHistory,
  AuditDashboardMetrics,
  RetentionPolicy,
  AuditFilters,
  PaginationParams,
  PaginatedAuditLogs,
  AuditExportConfig,
  ActivityHeatmap,
  UserActivityProfile,
  ForensicCase,
  AuditAnomaly,
  AuditStatistics,
  AuditSummaryCard,
  ActivityTimelineItem,
  TamperDetectionResult,
  QuickFilter,
  CreateAuditLogInput,
  CreateRetentionPolicyInput,
  UpdateRetentionPolicyInput,
  ForensicSearchParams,
} from '@/types/auditTrail'

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

import {
  mockAuditLogs,
  mockUserActions,
  mockDataChanges,
  mockLoginHistory,
  mockDashboardMetrics,
  mockRetentionPolicies,
  mockActivityHeatmap,
  mockUserActivityProfiles,
  mockForensicCases,
  mockAuditAnomalies,
  mockAuditStatistics,
} from '@/data/auditTrailMockData'

import {
  validateAuditLog,
  validateRetentionPolicy,
  validateUpdateRetentionPolicy,
  validateAuditFilters,
  validatePaginationParams,
  validateAuditExportConfig,
  validateForensicCase,
  validateUpdateForensicCase,
  validateForensicSearchParams,
  type AuditLogInput,
  type RetentionPolicyInput,
  type AuditFiltersInput,
  type PaginationParamsInput,
  type ForensicCaseInput,
} from '@/schemas/auditTrailValidation'

// ============================================================
// STATE
// ============================================================

const auditLogs = ref<AuditLog[]>([...mockAuditLogs])
const userActions = ref<UserAction[]>([...mockUserActions])
const dataChanges = ref<DataChange[]>([...mockDataChanges])
const loginHistory = ref<LoginHistory[]>([...mockLoginHistory])
const retentionPolicies = ref<RetentionPolicy[]>([...mockRetentionPolicies])
const activityHeatmap = ref<ActivityHeatmap[]>([...mockActivityHeatmap])
const userActivityProfiles = ref<UserActivityProfile[]>([...mockUserActivityProfiles])
const forensicCases = ref<ForensicCase[]>([...mockForensicCases])
const auditAnomalies = ref<AuditAnomaly[]>([...mockAuditAnomalies])

const selectedLog = ref<AuditLog | null>(null)
const selectedUser = ref<UserActivityProfile | null>(null)
const selectedForensicCase = ref<ForensicCase | null>(null)

const filters = ref<AuditFilters>({})
const pagination = ref<PaginationParams>({
  page: 1,
  pageSize: 20,
  sortBy: 'timestamp',
  sortOrder: 'desc',
})

const isLoading = ref(false)
const error = ref<string | null>(null)

// ============================================================
// COMPUTED PROPERTIES
// ============================================================

/**
 * Dashboard summary metrics
 */
const dashboardMetrics = computed<AuditDashboardMetrics>(() => {
  const now = new Date()
  const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  const logs = auditLogs.value

  // Count logs by time periods
  const last24Hours = logs.filter(log => log.timestamp >= dayAgo).length
  const lastWeek = logs.filter(log => log.timestamp >= weekAgo).length
  const lastMonth = logs.filter(log => log.timestamp >= monthAgo).length

  // Count by severity
  const criticalEvents = logs.filter(log => log.logLevel === LogLevel.CRITICAL).length
  const errorEvents = logs.filter(log => log.logLevel === LogLevel.ERROR).length
  const warningEvents = logs.filter(log => log.logLevel === LogLevel.WARNING).length

  // Count by result
  const successfulActions = logs.filter(log => log.result === ActionResult.SUCCESS).length
  const failedActions = logs.filter(log => log.result === ActionResult.FAILURE).length

  // Active sessions
  const activeSessions = loginHistory.value.filter(login => login.isActive).length
  const activeUsers = new Set(
    loginHistory.value.filter(login => login.isActive).map(login => login.userId)
  ).size

  // Failed logins
  const failedLoginAttempts = loginHistory.value.filter(
    login => login.result === ActionResult.FAILURE
  ).length

  // Top users by action count
  const userCounts = new Map<string, { userId: string; userName: string; count: number }>()
  logs.forEach(log => {
    const key = log.userId
    if (!userCounts.has(key)) {
      userCounts.set(key, { userId: log.userId, userName: log.userName, count: 0 })
    }
    userCounts.get(key)!.count++
  })
  const topUsers = Array.from(userCounts.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
    .map(u => ({ userId: u.userId, userName: u.userName, actionCount: u.count }))

  // Top actions
  const actionCounts = new Map<ActionType, number>()
  logs.forEach(log => {
    actionCounts.set(log.action, (actionCounts.get(log.action) || 0) + 1)
  })
  const topActions = Array.from(actionCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([action, count]) => ({ action, count }))

  // Top entities
  const entityCounts = new Map<EntityType, number>()
  logs.forEach(log => {
    entityCounts.set(log.entityType, (entityCounts.get(log.entityType) || 0) + 1)
  })
  const topEntities = Array.from(entityCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([entityType, count]) => ({ entityType, count }))

  // Activity trend (last 30 days)
  const activityTrend = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(now)
    date.setDate(date.getDate() - (29 - i))
    const dateStr = date.toISOString().split('T')[0]
    const count = logs.filter(log => {
      const logDate = log.timestamp.toISOString().split('T')[0]
      return logDate === dateStr
    }).length
    return { date: dateStr, count }
  })

  // Category distribution
  const categoryCounts = new Map<ActivityCategory, number>()
  logs.forEach(log => {
    categoryCounts.set(log.category, (categoryCounts.get(log.category) || 0) + 1)
  })
  const totalLogs = logs.length
  const categoryDistribution = Array.from(categoryCounts.entries())
    .map(([category, count]) => ({
      category,
      count,
      percentage: totalLogs > 0 ? Math.round((count / totalLogs) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count)

  // Result distribution
  const resultCounts = new Map<ActionResult, number>()
  logs.forEach(log => {
    resultCounts.set(log.result, (resultCounts.get(log.result) || 0) + 1)
  })
  const resultDistribution = Array.from(resultCounts.entries())
    .map(([result, count]) => ({
      result,
      count,
      percentage: totalLogs > 0 ? Math.round((count / totalLogs) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count)

  return {
    totalLogs,
    last24Hours,
    lastWeek,
    lastMonth,
    criticalEvents,
    errorEvents,
    warningEvents,
    successfulActions,
    failedActions,
    activeUsers,
    activeSessions,
    dataChanges: dataChanges.value.length,
    loginAttempts: loginHistory.value.length,
    failedLoginAttempts,
    topUsers,
    topActions,
    topEntities,
    activityTrend,
    categoryDistribution,
    resultDistribution,
  }
})

/**
 * Filtered audit logs based on current filters
 */
const filteredLogs = computed<AuditLog[]>(() => {
  let logs = [...auditLogs.value]
  const f = filters.value

  // Search query (searches across multiple fields)
  if (f.searchQuery && f.searchQuery.trim() !== '') {
    const query = f.searchQuery.toLowerCase()
    logs = logs.filter(log =>
      log.description.toLowerCase().includes(query) ||
      log.userName.toLowerCase().includes(query) ||
      log.entityName?.toLowerCase().includes(query) ||
      log.action.toLowerCase().includes(query) ||
      log.category.toLowerCase().includes(query)
    )
  }

  // Category filter
  if (f.categories && f.categories.length > 0) {
    logs = logs.filter(log => f.categories!.includes(log.category))
  }

  // Action filter
  if (f.actions && f.actions.length > 0) {
    logs = logs.filter(log => f.actions!.includes(log.action))
  }

  // Entity type filter
  if (f.entityTypes && f.entityTypes.length > 0) {
    logs = logs.filter(log => f.entityTypes!.includes(log.entityType))
  }

  // User filter
  if (f.userIds && f.userIds.length > 0) {
    logs = logs.filter(log => f.userIds!.includes(log.userId))
  }

  // User role filter
  if (f.userRoles && f.userRoles.length > 0) {
    logs = logs.filter(log => f.userRoles!.includes(log.userRole))
  }

  // Log level filter
  if (f.logLevels && f.logLevels.length > 0) {
    logs = logs.filter(log => f.logLevels!.includes(log.logLevel))
  }

  // Result filter
  if (f.results && f.results.length > 0) {
    logs = logs.filter(log => f.results!.includes(log.result))
  }

  // IP address filter
  if (f.ipAddress) {
    logs = logs.filter(log => log.ipAddress === f.ipAddress)
  }

  // Session ID filter
  if (f.sessionId) {
    logs = logs.filter(log => log.sessionId === f.sessionId)
  }

  // Entity ID filter
  if (f.entityId) {
    logs = logs.filter(log => log.entityId === f.entityId)
  }

  // Time range filter
  if (f.timeRange || (f.startDate && f.endDate)) {
    const now = new Date()
    let startDate: Date | null = null
    let endDate: Date | null = null

    if (f.timeRange && f.timeRange !== TimeRange.CUSTOM) {
      switch (f.timeRange) {
        case TimeRange.LAST_HOUR:
          startDate = new Date(now.getTime() - 60 * 60 * 1000)
          break
        case TimeRange.LAST_24_HOURS:
          startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
          break
        case TimeRange.LAST_7_DAYS:
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        case TimeRange.LAST_30_DAYS:
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          break
        case TimeRange.LAST_90_DAYS:
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
          break
        case TimeRange.LAST_6_MONTHS:
          startDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000)
          break
        case TimeRange.LAST_YEAR:
          startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
          break
      }
      endDate = now
    } else if (f.startDate && f.endDate) {
      startDate = f.startDate
      endDate = f.endDate
    }

    if (startDate && endDate) {
      logs = logs.filter(log => log.timestamp >= startDate! && log.timestamp <= endDate!)
    }
  }

  return logs
})

/**
 * Paginated audit logs
 */
const paginatedLogs = computed<PaginatedAuditLogs>(() => {
  const filtered = filteredLogs.value
  const { page, pageSize, sortBy, sortOrder } = pagination.value

  // Sort logs
  let sorted = [...filtered]
  if (sortBy) {
    sorted.sort((a, b) => {
      const aVal = (a as any)[sortBy]
      const bVal = (b as any)[sortBy]
      
      if (aVal instanceof Date && bVal instanceof Date) {
        return sortOrder === 'asc' ? aVal.getTime() - bVal.getTime() : bVal.getTime() - aVal.getTime()
      }
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal
      }
      
      const aStr = String(aVal || '').toLowerCase()
      const bStr = String(bVal || '').toLowerCase()
      const comparison = aStr.localeCompare(bStr)
      return sortOrder === 'asc' ? comparison : -comparison
    })
  }

  // Paginate
  const total = sorted.length
  const totalPages = Math.ceil(total / pageSize)
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const logs = sorted.slice(start, end)

  return {
    logs,
    total,
    page,
    pageSize,
    totalPages,
  }
})

/**
 * Summary cards for dashboard
 */
const summaryCards = computed<AuditSummaryCard[]>(() => {
  const metrics = dashboardMetrics.value

  return [
    {
      title: 'Total Audit Logs',
      value: metrics.totalLogs.toLocaleString(),
      change: metrics.last24Hours,
      changeType: 'neutral',
      icon: 'FileText',
      color: 'blue',
    },
    {
      title: 'Active Users',
      value: metrics.activeUsers,
      icon: 'Users',
      color: 'green',
    },
    {
      title: 'Critical Events',
      value: metrics.criticalEvents,
      change: metrics.criticalEvents > 0 ? -10 : 0,
      changeType: metrics.criticalEvents > 0 ? 'decrease' : 'neutral',
      icon: 'AlertTriangle',
      color: 'red',
    },
    {
      title: 'Success Rate',
      value: `${Math.round((metrics.successfulActions / metrics.totalLogs) * 100)}%`,
      change: 2,
      changeType: 'increase',
      icon: 'CheckCircle',
      color: 'green',
    },
    {
      title: 'Failed Actions',
      value: metrics.failedActions,
      change: metrics.failedActions > 10 ? 5 : -2,
      changeType: metrics.failedActions > 10 ? 'increase' : 'decrease',
      icon: 'XCircle',
      color: 'orange',
    },
    {
      title: 'Data Changes',
      value: metrics.dataChanges,
      icon: 'Edit',
      color: 'purple',
    },
  ]
})

/**
 * Activity timeline for recent events
 */
const activityTimeline = computed<ActivityTimelineItem[]>(() => {
  return filteredLogs.value
    .slice(0, 20)
    .map(log => ({
      id: log.id,
      timestamp: log.timestamp,
      category: log.category,
      action: log.action,
      userName: log.userName,
      description: log.description,
      icon: getIconForAction(log.action),
      color: getColorForLogLevel(log.logLevel),
      metadata: log.metadata,
    }))
})

/**
 * Quick filter presets
 */
const quickFilters = computed<QuickFilter[]>(() => {
  return [
    {
      label: 'Critical Events',
      filters: { logLevels: [LogLevel.CRITICAL] },
      icon: 'AlertTriangle',
    },
    {
      label: 'Failed Actions',
      filters: { results: [ActionResult.FAILURE] },
      icon: 'XCircle',
    },
    {
      label: 'Data Changes',
      filters: { categories: [ActivityCategory.DATA_MODIFICATION] },
      icon: 'Edit',
    },
    {
      label: 'Authentication',
      filters: { categories: [ActivityCategory.AUTHENTICATION] },
      icon: 'Lock',
    },
    {
      label: 'Last 24 Hours',
      filters: { timeRange: TimeRange.LAST_24_HOURS },
      icon: 'Clock',
    },
  ]
})

/**
 * Audit statistics
 */
const statistics = computed<AuditStatistics>(() => {
  const logs = filteredLogs.value
  const successCount = logs.filter(log => log.result === ActionResult.SUCCESS).length
  const failCount = logs.filter(log => log.result === ActionResult.FAILURE).length
  const criticalCount = logs.filter(log => log.logLevel === LogLevel.CRITICAL).length
  
  const uniqueUsers = new Set(logs.map(log => log.userId)).size
  const uniqueSessions = new Set(logs.map(log => log.sessionId)).size
  
  const durationsWithValues = logs.filter(log => log.duration).map(log => log.duration!)
  const avgDuration = durationsWithValues.length > 0
    ? Math.round(durationsWithValues.reduce((sum, d) => sum + d, 0) / durationsWithValues.length)
    : 0

  // Find peak hour
  const hourCounts = new Map<number, number>()
  logs.forEach(log => {
    const hour = log.timestamp.getHours()
    hourCounts.set(hour, (hourCounts.get(hour) || 0) + 1)
  })
  const peakHourEntry = Array.from(hourCounts.entries()).sort((a, b) => b[1] - a[1])[0]
  const peakHour = peakHourEntry 
    ? `${String(peakHourEntry[0]).padStart(2, '0')}:00 - ${String(peakHourEntry[0] + 1).padStart(2, '0')}:00`
    : 'N/A'

  // Most active user
  const userCounts = new Map<string, { name: string; count: number }>()
  logs.forEach(log => {
    if (!userCounts.has(log.userId)) {
      userCounts.set(log.userId, { name: log.userName, count: 0 })
    }
    userCounts.get(log.userId)!.count++
  })
  const mostActiveUserEntry = Array.from(userCounts.values()).sort((a, b) => b.count - a.count)[0]
  const mostActiveUser = mostActiveUserEntry?.name || 'N/A'

  // Most common action
  const actionCounts = new Map<ActionType, number>()
  logs.forEach(log => {
    actionCounts.set(log.action, (actionCounts.get(log.action) || 0) + 1)
  })
  const mostCommonActionEntry = Array.from(actionCounts.entries()).sort((a, b) => b[1] - a[1])[0]
  const mostCommonAction = mostCommonActionEntry?.[0] || ActionType.READ

  return {
    period: 'Current Filter',
    totalActions: logs.length,
    successfulActions: successCount,
    failedActions: failCount,
    uniqueUsers,
    uniqueSessions,
    dataChanges: dataChanges.value.length,
    criticalEvents: criticalCount,
    averageDuration: avgDuration,
    peakHour,
    mostActiveUser,
    mostCommonAction,
  }
})

// ============================================================
// DATA LOADING METHODS
// ============================================================

/**
 * Load all audit trail data
 */
async function loadAuditTrailData(): Promise<void> {
  isLoading.value = true
  error.value = null

  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // Reset filters and selections
    filters.value = {}
    selectedLog.value = null
    selectedUser.value = null
    selectedForensicCase.value = null

    // Load fresh data
    auditLogs.value = [...mockAuditLogs]
    userActions.value = [...mockUserActions]
    dataChanges.value = [...mockDataChanges]
    loginHistory.value = [...mockLoginHistory]
    retentionPolicies.value = [...mockRetentionPolicies]
    activityHeatmap.value = [...mockActivityHeatmap]
    userActivityProfiles.value = [...mockUserActivityProfiles]
    forensicCases.value = [...mockForensicCases]
    auditAnomalies.value = [...mockAuditAnomalies]
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load audit trail data'
    throw e
  } finally {
    isLoading.value = false
  }
}

/**
 * Refresh dashboard metrics
 */
async function refreshDashboard(): Promise<void> {
  await loadAuditTrailData()
}

// ============================================================
// FILTER & SEARCH METHODS
// ============================================================

/**
 * Update filters (search returns results in < 2 seconds)
 */
function updateFilters(newFilters: Partial<AuditFilters>): void {
  try {
    const validated = validateAuditFilters({ ...filters.value, ...newFilters })
    filters.value = validated
    pagination.value.page = 1 // Reset to first page
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Invalid filter parameters'
    throw e
  }
}

/**
 * Clear all filters
 */
function clearFilters(): void {
  filters.value = {}
  pagination.value.page = 1
}

/**
 * Apply quick filter preset
 */
function applyQuickFilter(preset: QuickFilter): void {
  updateFilters(preset.filters)
}

/**
 * Search audit logs
 */
function searchLogs(query: string): void {
  updateFilters({ searchQuery: query })
}

/**
 * Update pagination
 */
function updatePagination(params: Partial<PaginationParams>): void {
  try {
    const validated = validatePaginationParams({ ...pagination.value, ...params })
    pagination.value = validated
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Invalid pagination parameters'
    throw e
  }
}

/**
 * Go to specific page
 */
function goToPage(page: number): void {
  updatePagination({ page })
}

/**
 * Change page size
 */
function changePageSize(pageSize: number): void {
  updatePagination({ pageSize, page: 1 })
}

// ============================================================
// SELECTION METHODS
// ============================================================

/**
 * Select audit log
 */
function selectLog(logId: string): void {
  selectedLog.value = auditLogs.value.find(log => log.id === logId) || null
}

/**
 * Clear selected log
 */
function clearSelectedLog(): void {
  selectedLog.value = null
}

/**
 * Get audit log by ID
 */
function getLogById(logId: string): AuditLog | undefined {
  return auditLogs.value.find(log => log.id === logId)
}

/**
 * Get related logs (same session, entity, or user)
 */
function getRelatedLogs(logId: string): AuditLog[] {
  const log = getLogById(logId)
  if (!log) return []

  return auditLogs.value.filter(l =>
    l.id !== logId &&
    (l.sessionId === log.sessionId ||
     (l.entityId && l.entityId === log.entityId) ||
     l.userId === log.userId)
  )
}

// ============================================================
// EXPORT METHODS
// ============================================================

/**
 * Export audit logs
 */
async function exportLogs(config: AuditExportConfig): Promise<Blob> {
  try {
    validateAuditExportConfig(config)

    // Apply filters to get the logs to export
    const originalFilters = { ...filters.value }
    filters.value = config.filters
    const logsToExport = filteredLogs.value
    filters.value = originalFilters

    let content: string
    let mimeType: string

    switch (config.format) {
      case ExportFormat.CSV:
        content = convertToCSV(logsToExport, config)
        mimeType = 'text/csv'
        break
      case ExportFormat.JSON:
        content = JSON.stringify(logsToExport, null, 2)
        mimeType = 'application/json'
        break
      case ExportFormat.EXCEL:
      case ExportFormat.PDF:
        // These would require additional libraries in production
        content = convertToCSV(logsToExport, config)
        mimeType = 'text/csv'
        break
      default:
        throw new Error('Unsupported export format')
    }

    return new Blob([content], { type: mimeType })
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to export logs'
    throw e
  }
}

/**
 * Convert logs to CSV format
 */
function convertToCSV(logs: AuditLog[], config: AuditExportConfig): string {
  const headers = [
    'ID',
    'Timestamp',
    'Category',
    'Action',
    'Entity Type',
    'Entity ID',
    'Entity Name',
    'User',
    'User Role',
    'IP Address',
    'Result',
    'Log Level',
    'Duration (ms)',
    'Description',
  ]

  if (config.includeMetadata) {
    headers.push('Metadata')
  }

  if (config.includeChanges) {
    headers.push('Changes')
  }

  if (config.includeStackTrace) {
    headers.push('Error', 'Stack Trace')
  }

  const rows = logs.map(log => {
    const row = [
      log.id,
      log.timestamp.toISOString(),
      log.category,
      log.action,
      log.entityType,
      log.entityId || '',
      log.entityName || '',
      log.userName,
      log.userRole,
      log.ipAddress,
      log.result,
      log.logLevel,
      log.duration?.toString() || '',
      `"${log.description.replace(/"/g, '""')}"`,
    ]

    if (config.includeMetadata) {
      row.push(log.metadata ? JSON.stringify(log.metadata) : '')
    }

    if (config.includeChanges) {
      row.push(log.changes ? JSON.stringify(log.changes) : '')
    }

    if (config.includeStackTrace) {
      row.push(log.errorMessage || '', log.stackTrace || '')
    }

    return row.join(',')
  })

  return [headers.join(','), ...rows].join('\n')
}

// ============================================================
// RETENTION POLICY METHODS
// ============================================================

/**
 * Create retention policy
 */
async function createRetentionPolicy(input: CreateRetentionPolicyInput): Promise<RetentionPolicy> {
  try {
    const validated = validateRetentionPolicy(input)

    // Calculate retention days based on period
    let retentionDays = 0
    switch (validated.retentionPeriod) {
      case RetentionPeriod.DAYS_30: retentionDays = 30; break
      case RetentionPeriod.DAYS_90: retentionDays = 90; break
      case RetentionPeriod.MONTHS_6: retentionDays = 180; break
      case RetentionPeriod.YEAR_1: retentionDays = 365; break
      case RetentionPeriod.YEARS_2: retentionDays = 730; break
      case RetentionPeriod.YEARS_5: retentionDays = 1825; break
      case RetentionPeriod.YEARS_7: retentionDays = 2555; break
      case RetentionPeriod.YEARS_10: retentionDays = 3650; break
      case RetentionPeriod.PERMANENT: retentionDays = -1; break
    }

    const newPolicy: RetentionPolicy = {
      id: `RET-${String(retentionPolicies.value.length + 1).padStart(3, '0')}`,
      ...validated,
      retentionDays,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'USR-001', // Would come from auth context
      updatedBy: 'USR-001',
    }

    retentionPolicies.value.push(newPolicy)
    return newPolicy
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to create retention policy'
    throw e
  }
}

/**
 * Update retention policy
 */
async function updateRetentionPolicy(input: UpdateRetentionPolicyInput): Promise<RetentionPolicy> {
  try {
    const validated = validateUpdateRetentionPolicy(input)
    const index = retentionPolicies.value.findIndex(p => p.id === validated.id)

    if (index === -1) {
      throw new Error('Retention policy not found')
    }

    const updated = {
      ...retentionPolicies.value[index],
      ...validated,
      updatedAt: new Date(),
      updatedBy: 'USR-001', // Would come from auth context
    }

    retentionPolicies.value[index] = updated
    return updated
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to update retention policy'
    throw e
  }
}

/**
 * Delete retention policy
 */
async function deleteRetentionPolicy(policyId: string): Promise<void> {
  const index = retentionPolicies.value.findIndex(p => p.id === policyId)
  if (index === -1) {
    throw new Error('Retention policy not found')
  }
  retentionPolicies.value.splice(index, 1)
}

/**
 * Apply retention policies (archive/delete old logs)
 */
async function applyRetentionPolicies(): Promise<{ archived: number; deleted: number }> {
  let archived = 0
  let deleted = 0

  const now = new Date()

  for (const policy of retentionPolicies.value.filter(p => p.isActive)) {
    const logs = auditLogs.value.filter(log => {
      // Match category
      if (log.category !== policy.category) return false
      
      // Match entity type if specified
      if (policy.entityType && log.entityType !== policy.entityType) return false
      
      // Match log level if specified
      if (policy.logLevel && log.logLevel !== policy.logLevel) return false

      // Check if log is older than retention period
      if (policy.retentionDays > 0) {
        const retentionDate = new Date(now)
        retentionDate.setDate(retentionDate.getDate() - policy.retentionDays)
        return log.timestamp < retentionDate
      }

      return false
    })

    if (policy.autoArchive) {
      archived += logs.length
      // In production, would archive to external storage
    }

    if (policy.autoDelete) {
      deleted += logs.length
      auditLogs.value = auditLogs.value.filter(log => !logs.includes(log))
    }
  }

  return { archived, deleted }
}

// ============================================================
// FORENSIC INVESTIGATION METHODS
// ============================================================

/**
 * Create forensic case
 */
async function createForensicCase(input: ForensicCaseInput): Promise<ForensicCase> {
  try {
    const validated = validateForensicCase(input)

    const newCase: ForensicCase = {
      id: `FOR-${String(forensicCases.value.length + 1).padStart(3, '0')}`,
      ...validated,
      status: 'OPEN',
      investigator: 'USR-001', // Would come from auth context
      startDate: new Date(),
      endDate: null,
      relatedUserIds: [],
      findings: '',
      recommendations: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    forensicCases.value.push(newCase)
    return newCase
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to create forensic case'
    throw e
  }
}

/**
 * Perform forensic search
 */
function performForensicSearch(params: ForensicSearchParams): AuditLog[] {
  try {
    validateForensicSearchParams(params)

    // Start with filtered logs
    const originalFilters = { ...filters.value }
    filters.value = params
    let results = filteredLogs.value
    filters.value = originalFilters

    // Include related logs if requested
    if (params.includeRelated) {
      const relatedLogIds = new Set<string>()
      results.forEach(log => {
        const related = getRelatedLogs(log.id)
        related.forEach(r => relatedLogIds.add(r.id))
      })
      const relatedLogs = auditLogs.value.filter(log => relatedLogIds.has(log.id))
      results = [...results, ...relatedLogs]
    }

    return results
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to perform forensic search'
    throw e
  }
}

// ============================================================
// TAMPER DETECTION METHODS
// ============================================================

/**
 * Verify log integrity (hash verification)
 */
function verifyLogIntegrity(logId: string): TamperDetectionResult {
  const log = getLogById(logId)
  if (!log) {
    throw new Error('Log not found')
  }

  // Reconstruct hash
  const dataToHash = `${log.id}-${log.action}-${log.entityType}`
  let hash = 0
  for (let i = 0; i < dataToHash.length; i++) {
    const char = dataToHash.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  const expectedHash = Math.abs(hash).toString(16).padStart(16, '0')

  const isValid = log.hash === expectedHash

  return {
    logId: log.id,
    timestamp: log.timestamp,
    isValid,
    expectedHash,
    actualHash: log.hash,
    tamperedFields: isValid ? undefined : ['hash'],
    detectedAt: new Date(),
    severity: isValid ? LogLevel.INFO : LogLevel.CRITICAL,
  }
}

/**
 * Batch verify log integrity
 */
function verifyAllLogIntegrity(): TamperDetectionResult[] {
  return auditLogs.value.map(log => verifyLogIntegrity(log.id))
}

/**
 * Detect anomalies in audit logs
 */
function detectAnomalies(): AuditAnomaly[] {
  // Return existing anomalies (in production, would run detection algorithms)
  return auditAnomalies.value
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function getIconForAction(action: ActionType): string {
  const iconMap: Record<ActionType, string> = {
    [ActionType.LOGIN]: 'LogIn',
    [ActionType.LOGOUT]: 'LogOut',
    [ActionType.LOGIN_FAILED]: 'XCircle',
    [ActionType.PASSWORD_CHANGE]: 'Key',
    [ActionType.PASSWORD_RESET]: 'RefreshCw',
    [ActionType.SESSION_EXPIRED]: 'Clock',
    [ActionType.CREATE]: 'Plus',
    [ActionType.READ]: 'Eye',
    [ActionType.UPDATE]: 'Edit',
    [ActionType.DELETE]: 'Trash2',
    [ActionType.BULK_UPDATE]: 'Edit3',
    [ActionType.BULK_DELETE]: 'Trash',
    [ActionType.ENTITY_CREATED]: 'Building',
    [ActionType.ENTITY_UPDATED]: 'Building',
    [ActionType.ENTITY_DELETED]: 'Building',
    [ActionType.ENTITY_SUSPENDED]: 'PauseCircle',
    [ActionType.ENTITY_ACTIVATED]: 'PlayCircle',
    [ActionType.RISK_RATING_CHANGED]: 'TrendingUp',
    [ActionType.CASE_CREATED]: 'Folder',
    [ActionType.CASE_ASSIGNED]: 'UserCheck',
    [ActionType.CASE_UPDATED]: 'FolderEdit',
    [ActionType.CASE_CLOSED]: 'FolderCheck',
    [ActionType.DECISION_MADE]: 'CheckSquare',
    [ActionType.USER_CREATED]: 'UserPlus',
    [ActionType.USER_UPDATED]: 'UserCog',
    [ActionType.USER_DELETED]: 'UserMinus',
    [ActionType.USER_ROLE_CHANGED]: 'Shield',
    [ActionType.USER_SUSPENDED]: 'UserX',
    [ActionType.USER_ACTIVATED]: 'UserCheck',
    [ActionType.REPORT_GENERATED]: 'FileText',
    [ActionType.DATA_EXPORTED]: 'Download',
    [ActionType.DATA_IMPORTED]: 'Upload',
    [ActionType.SYSTEM_CONFIG_CHANGED]: 'Settings',
    [ActionType.BACKUP_CREATED]: 'Database',
    [ActionType.BACKUP_RESTORED]: 'RotateCcw',
    [ActionType.COMPLIANCE_CHECK]: 'CheckCircle',
    [ActionType.POLICY_UPDATED]: 'FileEdit',
    [ActionType.THRESHOLD_UPDATED]: 'Sliders',
    [ActionType.FILE_UPLOADED]: 'Upload',
    [ActionType.FILE_DOWNLOADED]: 'Download',
    [ActionType.FILE_DELETED]: 'FileX',
  }
  return iconMap[action] || 'Circle'
}

function getColorForLogLevel(level: LogLevel): string {
  const colorMap: Record<LogLevel, string> = {
    [LogLevel.DEBUG]: 'gray',
    [LogLevel.INFO]: 'blue',
    [LogLevel.WARNING]: 'yellow',
    [LogLevel.ERROR]: 'orange',
    [LogLevel.CRITICAL]: 'red',
  }
  return colorMap[level]
}

// ============================================================
// EXPORTS
// ============================================================

export function useAuditTrail() {
  return {
    // State (readonly)
    auditLogs: readonly(auditLogs),
    userActions: readonly(userActions),
    dataChanges: readonly(dataChanges),
    loginHistory: readonly(loginHistory),
    retentionPolicies: readonly(retentionPolicies),
    activityHeatmap: readonly(activityHeatmap),
    userActivityProfiles: readonly(userActivityProfiles),
    forensicCases: readonly(forensicCases),
    auditAnomalies: readonly(auditAnomalies),
    selectedLog: readonly(selectedLog),
    selectedUser: readonly(selectedUser),
    selectedForensicCase: readonly(selectedForensicCase),
    filters: readonly(filters),
    pagination: readonly(pagination),
    isLoading: readonly(isLoading),
    error: readonly(error),

    // Computed
    dashboardMetrics,
    filteredLogs,
    paginatedLogs,
    summaryCards,
    activityTimeline,
    quickFilters,
    statistics,

    // Methods - Data Loading
    loadAuditTrailData,
    refreshDashboard,

    // Methods - Filtering & Search
    updateFilters,
    clearFilters,
    applyQuickFilter,
    searchLogs,
    updatePagination,
    goToPage,
    changePageSize,

    // Methods - Selection
    selectLog,
    clearSelectedLog,
    getLogById,
    getRelatedLogs,

    // Methods - Export
    exportLogs,

    // Methods - Retention Policies
    createRetentionPolicy,
    updateRetentionPolicy,
    deleteRetentionPolicy,
    applyRetentionPolicies,

    // Methods - Forensic Investigation
    createForensicCase,
    performForensicSearch,

    // Methods - Tamper Detection
    verifyLogIntegrity,
    verifyAllLogIntegrity,
    detectAnomalies,
  }
}
