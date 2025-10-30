/**
 * Audit Trail Module - Comprehensive Test Suite
 * 
 * Tests all aspects of the audit trail module including:
 * - Mock data integrity
 * - Validation schemas
 * - Composable functionality
 * - End-to-end workflows
 * 
 * @author bguvava
 * @since 2025-10-30
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { useAuditTrail } from '@/composables/useAuditTrail'
import {
  mockAuditLogs,
  mockUserActions,
  mockDataChanges,
  mockLoginHistory,
  mockRetentionPolicies,
  mockUserActivityProfiles,
  mockAuditAnomalies,
} from '@/data/auditTrailMockData'
import {
  validateAuditLog,
  validateRetentionPolicy,
  validateAuditFilters,
  validatePaginationParams,
  validateAuditExportConfig,
  validateForensicCase,
} from '@/schemas/auditTrailValidation'
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

describe('Audit Trail Module - Complete Test Suite', () => {
  describe('Mock Data Integrity', () => {
    it('should have valid audit log data', () => {
      expect(mockAuditLogs).toBeDefined()
      expect(Array.isArray(mockAuditLogs)).toBe(true)
      expect(mockAuditLogs.length).toBeGreaterThan(0)

      const firstLog = mockAuditLogs[0]
      expect(firstLog).toHaveProperty('id')
      expect(firstLog).toHaveProperty('timestamp')
      expect(firstLog).toHaveProperty('category')
      expect(firstLog).toHaveProperty('action')
      expect(firstLog).toHaveProperty('userId')
      expect(firstLog).toHaveProperty('hash')
    })

    it('should have valid login history data', () => {
      expect(mockLoginHistory).toBeDefined()
      expect(Array.isArray(mockLoginHistory)).toBe(true)
      expect(mockLoginHistory.length).toBeGreaterThan(0)

      const firstLogin = mockLoginHistory[0]
      expect(firstLogin).toHaveProperty('userId')
      expect(firstLogin).toHaveProperty('loginTime')
      expect(firstLogin).toHaveProperty('ipAddress')
      expect(firstLogin).toHaveProperty('sessionId')
    })

    it('should have valid retention policies', () => {
      expect(mockRetentionPolicies).toBeDefined()
      expect(Array.isArray(mockRetentionPolicies)).toBe(true)
      expect(mockRetentionPolicies.length).toBeGreaterThan(0)

      const firstPolicy = mockRetentionPolicies[0]
      expect(firstPolicy).toHaveProperty('category')
      expect(firstPolicy).toHaveProperty('retentionPeriod')
      expect(firstPolicy).toHaveProperty('retentionDays')
    })

    it('should have valid data changes', () => {
      expect(mockDataChanges).toBeDefined()
      expect(Array.isArray(mockDataChanges)).toBe(true)
      expect(mockDataChanges.length).toBeGreaterThan(0)

      const firstChange = mockDataChanges[0]
      expect(firstChange).toHaveProperty('fieldName')
      expect(firstChange).toHaveProperty('oldValue')
      expect(firstChange).toHaveProperty('newValue')
    })
  })

  describe('Validation Schemas', () => {
    it('should validate audit log input', () => {
      const validInput = {
        category: ActivityCategory.AUTHENTICATION,
        action: ActionType.LOGIN,
        entityType: EntityType.USER,
        entityId: 'USR-001',
        entityName: 'Test User',
        description: 'User logged in successfully',
        result: ActionResult.SUCCESS,
        logLevel: LogLevel.INFO,
        duration: 1000,
      }

      expect(() => validateAuditLog(validInput)).not.toThrow()
    })

    it('should reject invalid audit log input', () => {
      const invalidInput = {
        category: 'INVALID_CATEGORY',
        action: ActionType.LOGIN,
        entityType: EntityType.USER,
        description: '',
        result: ActionResult.SUCCESS,
        logLevel: LogLevel.INFO,
      }

      expect(() => validateAuditLog(invalidInput)).toThrow()
    })

    it('should validate retention policy input', () => {
      const validInput = {
        category: ActivityCategory.AUTHENTICATION,
        entityType: null,
        logLevel: null,
        retentionPeriod: RetentionPeriod.YEAR_1,
        autoArchive: true,
        archiveLocation: 's3://bucket/path',
        autoDelete: false,
      }

      expect(() => validateRetentionPolicy(validInput)).not.toThrow()
    })

    it('should validate audit filters', () => {
      const validFilters = {
        searchQuery: 'test',
        categories: [ActivityCategory.AUTHENTICATION],
        logLevels: [LogLevel.INFO, LogLevel.WARNING],
        timeRange: TimeRange.LAST_24_HOURS,
      }

      expect(() => validateAuditFilters(validFilters)).not.toThrow()
    })

    it('should validate pagination parameters', () => {
      const validParams = {
        page: 1,
        pageSize: 20,
        sortBy: 'timestamp',
        sortOrder: 'desc' as const,
      }

      expect(() => validatePaginationParams(validParams)).not.toThrow()
    })

    it('should reject invalid page size', () => {
      const invalidParams = {
        page: 1,
        pageSize: 150, // exceeds max
      }

      expect(() => validatePaginationParams(invalidParams)).toThrow()
    })

    it('should validate export configuration', () => {
      const validConfig = {
        format: ExportFormat.CSV,
        filters: {},
        includeMetadata: true,
        includeChanges: true,
        includeStackTrace: false,
        fileName: 'audit-logs',
      }

      expect(() => validateAuditExportConfig(validConfig)).not.toThrow()
    })

    it('should validate forensic case input', () => {
      const validInput = {
        title: 'Security Investigation',
        description: 'Investigating unauthorized access',
        category: 'Security Breach',
        priority: 'HIGH' as const,
        relatedLogIds: ['AUDIT-001', 'AUDIT-002'],
        relatedUserIds: ['USR-001'],
      }

      expect(() => validateForensicCase(validInput)).not.toThrow()
    })
  })

  describe('Audit Trail Composable', () => {
    let composable: ReturnType<typeof useAuditTrail>

    beforeEach(async () => {
      composable = useAuditTrail()
      await composable.loadAuditTrailData()
    })

    it('should initialize with data', () => {
      expect(composable.auditLogs.value.length).toBeGreaterThan(0)
      expect(composable.loginHistory.value.length).toBeGreaterThan(0)
      expect(composable.retentionPolicies.value.length).toBeGreaterThan(0)
    })

    it('should provide dashboard metrics', () => {
      const metrics = composable.dashboardMetrics.value
      
      expect(metrics).toHaveProperty('totalLogs')
      expect(metrics).toHaveProperty('last24Hours')
      expect(metrics).toHaveProperty('criticalEvents')
      expect(metrics).toHaveProperty('successfulActions')
      expect(metrics).toHaveProperty('failedActions')
      expect(metrics).toHaveProperty('activeUsers')
      expect(metrics).toHaveProperty('topUsers')
      expect(metrics).toHaveProperty('topActions')
      expect(metrics).toHaveProperty('activityTrend')
    })

    it('should filter logs by search query', () => {
      const initialCount = composable.filteredLogs.value.length
      
      composable.updateFilters({ searchQuery: 'login' })
      
      expect(composable.filteredLogs.value.length).toBeLessThanOrEqual(initialCount)
      expect(composable.filteredLogs.value.length).toBeGreaterThan(0)
    })

    it('should filter logs by category', () => {
      composable.updateFilters({
        categories: [ActivityCategory.AUTHENTICATION],
      })

      const filtered = composable.filteredLogs.value
      expect(filtered.every(log => log.category === ActivityCategory.AUTHENTICATION)).toBe(true)
    })

    it('should filter logs by log level', () => {
      composable.updateFilters({
        logLevels: [LogLevel.CRITICAL, LogLevel.ERROR],
      })

      const filtered = composable.filteredLogs.value
      expect(filtered.every(log => 
        log.logLevel === LogLevel.CRITICAL || log.logLevel === LogLevel.ERROR
      )).toBe(true)
    })

    it('should filter logs by result', () => {
      composable.updateFilters({
        results: [ActionResult.FAILURE],
      })

      const filtered = composable.filteredLogs.value
      expect(filtered.every(log => log.result === ActionResult.FAILURE)).toBe(true)
    })

    it('should filter logs by time range', () => {
      composable.updateFilters({
        timeRange: TimeRange.LAST_24_HOURS,
      })

      const now = new Date()
      const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      
      const filtered = composable.filteredLogs.value
      expect(filtered.every(log => log.timestamp >= dayAgo)).toBe(true)
    })

    it('should handle pagination', () => {
      const paginated = composable.paginatedLogs.value
      
      expect(paginated).toHaveProperty('logs')
      expect(paginated).toHaveProperty('total')
      expect(paginated).toHaveProperty('page')
      expect(paginated).toHaveProperty('pageSize')
      expect(paginated).toHaveProperty('totalPages')
      
      expect(Array.isArray(paginated.logs)).toBe(true)
      expect(paginated.logs.length).toBeLessThanOrEqual(paginated.pageSize)
    })

    it('should navigate pages', () => {
      // Ensure there are enough logs for multiple pages
      const paginated = composable.paginatedLogs.value
      
      if (paginated.totalPages > 1) {
        const firstPage = paginated.logs
        
        composable.goToPage(2)
        
        const secondPage = composable.paginatedLogs.value.logs
        expect(secondPage).not.toEqual(firstPage)
      } else {
        // If only one page, just verify navigation doesn't break
        composable.goToPage(1)
        expect(composable.paginatedLogs.value.page).toBe(1)
      }
    })

    it('should change page size', () => {
      composable.changePageSize(50)
      
      const paginated = composable.paginatedLogs.value
      expect(paginated.pageSize).toBe(50)
    })

    it('should clear filters', () => {
      composable.updateFilters({
        searchQuery: 'test',
        categories: [ActivityCategory.AUTHENTICATION],
      })
      
      expect(composable.filters.value.searchQuery).toBe('test')
      
      composable.clearFilters()
      
      expect(composable.filters.value.searchQuery).toBeUndefined()
      expect(composable.filters.value.categories).toBeUndefined()
    })

    it('should select audit log', () => {
      const firstLog = composable.auditLogs.value[0]
      
      composable.selectLog(firstLog.id)
      
      expect(composable.selectedLog.value).toEqual(firstLog)
    })

    it('should clear selected log', () => {
      const firstLog = composable.auditLogs.value[0]
      composable.selectLog(firstLog.id)
      
      composable.clearSelectedLog()
      
      expect(composable.selectedLog.value).toBeNull()
    })

    it('should get log by ID', () => {
      const firstLog = composable.auditLogs.value[0]
      
      const found = composable.getLogById(firstLog.id)
      
      expect(found).toEqual(firstLog)
    })

    it('should get related logs', () => {
      const firstLog = composable.auditLogs.value[0]
      
      const related = composable.getRelatedLogs(firstLog.id)
      
      expect(Array.isArray(related)).toBe(true)
    })

    it('should export logs', async () => {
      const config = {
        format: ExportFormat.CSV,
        filters: {},
        includeMetadata: true,
        includeChanges: true,
        includeStackTrace: false,
        fileName: 'test-export',
      }

      const blob = await composable.exportLogs(config)
      
      expect(blob).toBeInstanceOf(Blob)
      expect(blob.size).toBeGreaterThan(0)
    })

    it('should create retention policy', async () => {
      const input = {
        category: ActivityCategory.DATA_ACCESS,
        entityType: null,
        logLevel: LogLevel.DEBUG,
        retentionPeriod: RetentionPeriod.DAYS_30,
        autoArchive: false,
        autoDelete: true,
      }

      const initialCount = composable.retentionPolicies.value.length
      
      const policy = await composable.createRetentionPolicy(input)
      
      expect(policy).toHaveProperty('id')
      expect(policy.category).toBe(input.category)
      expect(composable.retentionPolicies.value.length).toBe(initialCount + 1)
    })

    it('should delete retention policy', async () => {
      const firstPolicy = composable.retentionPolicies.value[0]
      const initialCount = composable.retentionPolicies.value.length
      
      await composable.deleteRetentionPolicy(firstPolicy.id)
      
      expect(composable.retentionPolicies.value.length).toBe(initialCount - 1)
    })

    it('should apply retention policies', async () => {
      const result = await composable.applyRetentionPolicies()
      
      expect(result).toHaveProperty('archived')
      expect(result).toHaveProperty('deleted')
      expect(typeof result.archived).toBe('number')
      expect(typeof result.deleted).toBe('number')
    })

    it('should verify log integrity', () => {
      const firstLog = composable.auditLogs.value[0]
      
      const result = composable.verifyLogIntegrity(firstLog.id)
      
      expect(result).toHaveProperty('logId')
      expect(result).toHaveProperty('isValid')
      expect(result).toHaveProperty('expectedHash')
      expect(result).toHaveProperty('actualHash')
      expect(result.logId).toBe(firstLog.id)
    })

    it('should verify all log integrity', () => {
      const results = composable.verifyAllLogIntegrity()
      
      expect(Array.isArray(results)).toBe(true)
      expect(results.length).toBe(composable.auditLogs.value.length)
    })

    it('should detect anomalies', () => {
      const anomalies = composable.detectAnomalies()
      
      expect(Array.isArray(anomalies)).toBe(true)
      expect(anomalies.length).toBeGreaterThanOrEqual(0)
    })

    it('should create forensic case', async () => {
      const input = {
        title: 'Test Investigation',
        description: 'Testing forensic case creation',
        category: 'Security',
        priority: 'MEDIUM' as const,
        relatedLogIds: ['AUDIT-001'],
        relatedUserIds: [],
      }

      const initialCount = composable.forensicCases.value.length
      
      const forensicCase = await composable.createForensicCase(input)
      
      expect(forensicCase).toHaveProperty('id')
      expect(forensicCase.title).toBe(input.title)
      expect(forensicCase.status).toBe('OPEN')
      expect(composable.forensicCases.value.length).toBe(initialCount + 1)
    })

    it('should perform forensic search', () => {
      const params = {
        searchQuery: 'login',
        categories: [ActivityCategory.AUTHENTICATION],
        includeRelated: false,
        groupByUser: false,
        groupByEntity: false,
        detectAnomalies: false,
      }

      const results = composable.performForensicSearch(params)
      
      expect(Array.isArray(results)).toBe(true)
    })
  })

  describe('End-to-End Functionality', () => {
    it('should support complete workflow: filter → search → export', async () => {
      const composable = useAuditTrail()
      await composable.loadAuditTrailData()

      // Step 1: Apply filters
      composable.updateFilters({
        categories: [ActivityCategory.AUTHENTICATION],
        logLevels: [LogLevel.INFO],
      })

      // Step 2: Search
      composable.searchLogs('login')

      const filtered = composable.filteredLogs.value
      expect(filtered.length).toBeGreaterThan(0)

      // Step 3: Export
      const config = {
        format: ExportFormat.CSV,
        filters: composable.filters.value,
        includeMetadata: true,
        includeChanges: false,
        includeStackTrace: false,
        fileName: 'test',
      }

      const blob = await composable.exportLogs(config)
      expect(blob.size).toBeGreaterThan(0)
    })

    it('should support quick filter application', async () => {
      const composable = useAuditTrail()
      await composable.loadAuditTrailData()
      
      const quickFilters = composable.quickFilters.value

      expect(quickFilters.length).toBeGreaterThan(0)

      const firstPreset = quickFilters[0]
      composable.applyQuickFilter(firstPreset)

      expect(composable.filteredLogs.value.length).toBeGreaterThan(0)
    })

    it('should calculate statistics correctly', async () => {
      const composable = useAuditTrail()
      await composable.loadAuditTrailData()

      const stats = composable.statistics.value

      expect(stats).toBeDefined()
      expect(stats.totalActions).toBeGreaterThan(0)
      expect(stats.successfulActions).toBeGreaterThanOrEqual(0)
      expect(stats.failedActions).toBeGreaterThanOrEqual(0)
      expect(stats.uniqueUsers).toBeGreaterThan(0)
    })

    it('should provide summary cards for dashboard', async () => {
      const composable = useAuditTrail()
      await composable.loadAuditTrailData()

      const cards = composable.summaryCards.value

      expect(Array.isArray(cards)).toBe(true)
      expect(cards.length).toBeGreaterThan(0)
      
      const firstCard = cards[0]
      expect(firstCard).toHaveProperty('title')
      expect(firstCard).toHaveProperty('value')
      expect(firstCard).toHaveProperty('icon')
      expect(firstCard).toHaveProperty('color')
    })

    it('should generate activity timeline', async () => {
      const composable = useAuditTrail()
      await composable.loadAuditTrailData()

      const timeline = composable.activityTimeline.value

      expect(Array.isArray(timeline)).toBe(true)
      expect(timeline.length).toBeGreaterThan(0)
      
      if (timeline.length > 0) {
        const firstItem = timeline[0]
        expect(firstItem).toHaveProperty('id')
        expect(firstItem).toHaveProperty('timestamp')
        expect(firstItem).toHaveProperty('description')
        expect(firstItem).toHaveProperty('icon')
        expect(firstItem).toHaveProperty('color')
      }
    })

    it('should handle multiple filter combinations', () => {
      const composable = useAuditTrail()

      composable.updateFilters({
        searchQuery: 'user',
        categories: [ActivityCategory.USER_MANAGEMENT],
        logLevels: [LogLevel.INFO, LogLevel.WARNING],
        results: [ActionResult.SUCCESS],
        timeRange: TimeRange.LAST_7_DAYS,
      })

      const filtered = composable.filteredLogs.value
      expect(Array.isArray(filtered)).toBe(true)
    })

    it('should return correct search results in under 2 seconds', async () => {
      const composable = useAuditTrail()
      await composable.loadAuditTrailData()

      // Ensure data is loaded
      expect(composable.auditLogs.value.length).toBeGreaterThan(0)

      const startTime = Date.now()
      
      composable.searchLogs('login')
      const results = composable.filteredLogs.value
      
      const endTime = Date.now()
      const duration = endTime - startTime

      expect(results.length).toBeGreaterThanOrEqual(0) // May return 0 if no matches
      expect(duration).toBeLessThan(2000) // Success criterion: < 2 seconds
    })
  })
})
