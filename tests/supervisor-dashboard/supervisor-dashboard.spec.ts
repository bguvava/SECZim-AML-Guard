/**
 * Supervisor Dashboard Module - Test Suite
 * 
 * Comprehensive tests covering all requirements SUP-DASH-001 to SUP-DASH-015
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useSupervisorDashboard } from '@/composables/useSupervisorDashboard'
import {
  mockSupervisedEntities,
  mockPendingTasks,
  mockSuspiciousActivityAlerts,
  mockInspectionSchedule,
  mockDeficiencyRecords,
  mockTrainingModules,
  mockNotifications
} from '@/data/supervisorDashboardMockData'
import {
  supervisedEntitySchema,
  pendingTaskSchema,
  suspiciousActivityAlertSchema,
  inspectionScheduleSchema,
  deficiencyRecordSchema,
  notificationSchema,
  entitySearchFiltersSchema,
  createTaskSchema,
  reportRequestSchema,
  scheduleInspectionSchema
} from '@/schemas/supervisorDashboardValidation'
import { RiskLevel, ComplianceStatus, TaskStatus, AlertReviewStatus } from '@/types/supervisorDashboard'

// ============================================================================
// MOCK DATA INTEGRITY TESTS
// ============================================================================

describe('Supervisor Dashboard - Mock Data Integrity', () => {
  it('should have valid supervised entities data', () => {
    expect(mockSupervisedEntities).toBeDefined()
    expect(mockSupervisedEntities.length).toBeGreaterThanOrEqual(50)

    // Validate first few entities
    mockSupervisedEntities.slice(0, 5).forEach(entity => {
      const result = supervisedEntitySchema.safeParse(entity)
      expect(result.success).toBe(true)
    })
  })

  it('should have valid pending tasks data', () => {
    expect(mockPendingTasks).toBeDefined()
    expect(mockPendingTasks.length).toBeGreaterThan(0)

    mockPendingTasks.forEach(task => {
      const result = pendingTaskSchema.safeParse(task)
      expect(result.success).toBe(true)
    })
  })

  it('should have valid suspicious activity alerts', () => {
    expect(mockSuspiciousActivityAlerts).toBeDefined()
    expect(mockSuspiciousActivityAlerts.length).toBeGreaterThan(0)

    mockSuspiciousActivityAlerts.forEach(alert => {
      const result = suspiciousActivityAlertSchema.safeParse(alert)
      expect(result.success).toBe(true)
    })
  })

  it('should have valid inspection schedule data', () => {
    expect(mockInspectionSchedule).toBeDefined()
    expect(mockInspectionSchedule.length).toBeGreaterThan(0)

    mockInspectionSchedule.forEach(inspection => {
      const result = inspectionScheduleSchema.safeParse(inspection)
      expect(result.success).toBe(true)
    })
  })

  it('should have valid deficiency records', () => {
    expect(mockDeficiencyRecords).toBeDefined()
    expect(mockDeficiencyRecords.length).toBeGreaterThan(0)

    mockDeficiencyRecords.forEach(deficiency => {
      const result = deficiencyRecordSchema.safeParse(deficiency)
      expect(result.success).toBe(true)
    })
  })

  it('should have valid training modules', () => {
    expect(mockTrainingModules).toBeDefined()
    expect(mockTrainingModules.length).toBeGreaterThan(0)
  })

  it('should have valid notifications', () => {
    expect(mockNotifications).toBeDefined()
    expect(mockNotifications.length).toBeGreaterThan(0)

    mockNotifications.forEach(notification => {
      const result = notificationSchema.safeParse(notification)
      expect(result.success).toBe(true)
    })
  })
})

// ============================================================================
// VALIDATION SCHEMA TESTS
// ============================================================================

describe('Supervisor Dashboard - Validation Schemas', () => {
  it('should validate entity search filters', () => {
    const validFilters = {
      searchTerm: 'First Capital',
      entityType: 'Bank',
      riskLevel: 'High',
      complianceStatus: 'Compliant'
    }

    const result = entitySearchFiltersSchema.safeParse(validFilters)
    expect(result.success).toBe(true)
  })

  it('should reject invalid entity search filters', () => {
    const invalidFilters = {
      searchTerm: '',
      entityType: 'InvalidType',
      riskLevel: 'InvalidRisk'
    }

    const result = entitySearchFiltersSchema.safeParse(invalidFilters)
    expect(result.success).toBe(false)
  })

  it('should validate task creation input', () => {
    const validTask = {
      title: 'Review Application',
      description: 'Review new license application',
      taskType: 'Application Review',
      priority: 'High',
      entityId: 'ENT-001',
      dueDate: new Date(Date.now() + 86400000),
      estimatedHours: 4
    }

    const result = createTaskSchema.safeParse(validTask)
    expect(result.success).toBe(true)
  })

  it('should reject task with past due date', () => {
    const invalidTask = {
      title: 'Review Application',
      description: 'Review new license application',
      taskType: 'Application Review',
      priority: 'High',
      entityId: 'ENT-001',
      dueDate: new Date(Date.now() - 86400000) // Yesterday
    }

    const result = createTaskSchema.safeParse(invalidTask)
    expect(result.success).toBe(false)
  })

  it('should validate inspection scheduling', () => {
    const validInspection = {
      entityId: 'ENT-001',
      inspectionType: 'On-Site Inspection',
      scheduledDate: new Date(Date.now() + 86400000),
      inspectionTeam: ['SUP-001', 'INS-002'],
      scope: 'Full AML/CFT compliance review',
      location: 'Entity premises'
    }

    const result = scheduleInspectionSchema.safeParse(validInspection)
    expect(result.success).toBe(true)
  })

  it('should validate report request', () => {
    const validReport = {
      reportType: 'entity',
      entityIds: ['ENT-001', 'ENT-002'],
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-10-30'),
      includeCharts: true,
      includeRawData: false,
      format: 'pdf'
    }

    const result = reportRequestSchema.safeParse(validReport)
    expect(result.success).toBe(true)
  })

  it('should reject report with invalid date range', () => {
    const invalidReport = {
      reportType: 'entity',
      startDate: new Date('2025-10-30'),
      endDate: new Date('2025-01-01'), // End before start
      includeCharts: true,
      includeRawData: false,
      format: 'pdf'
    }

    const result = reportRequestSchema.safeParse(invalidReport)
    expect(result.success).toBe(false)
  })
})

// ============================================================================
// COMPOSABLE FUNCTIONALITY TESTS
// ============================================================================

describe('Supervisor Dashboard - Composable', () => {
  let dashboard: ReturnType<typeof useSupervisorDashboard>

  beforeEach(() => {
    dashboard = useSupervisorDashboard()
  })

  it('should initialize with correct default state', () => {
    expect(dashboard.entities.value).toEqual([])
    expect(dashboard.tasks.value).toEqual([])
    expect(dashboard.isLoading.value).toBe(false)
    expect(dashboard.autoRefreshConfig.value.enabled).toBe(true)
    expect(dashboard.autoRefreshConfig.value.interval).toBe(60000)
  })

  it('should load dashboard data (SUP-DASH-015)', async () => {
    await dashboard.loadDashboardData()

    expect(dashboard.entities.value.length).toBeGreaterThanOrEqual(50)
    expect(dashboard.tasks.value.length).toBeGreaterThan(0)
    expect(dashboard.alerts.value.length).toBeGreaterThan(0)
    expect(dashboard.lastRefresh.value).toBeInstanceOf(Date)
  })

  it('should calculate portfolio metrics (SUP-DASH-001)', async () => {
    await dashboard.loadDashboardData()

    const metrics = dashboard.portfolioMetrics.value

    expect(metrics.totalEntities).toBe(dashboard.entities.value.length)
    expect(metrics.highRiskCount).toBeGreaterThanOrEqual(0)
    expect(metrics.inspectionsDue).toBeGreaterThanOrEqual(0)
    expect(metrics.pendingApplications).toBeGreaterThanOrEqual(0)
  })

  it('should filter entities by search term (SUP-DASH-010)', async () => {
    await dashboard.loadDashboardData()

    const searchResults = dashboard.searchEntities('First Capital')

    expect(searchResults.length).toBeGreaterThan(0)
    expect(searchResults[0].name).toContain('First Capital')
  })

  it('should update search filters', async () => {
    dashboard.updateSearchFilters({
      riskLevel: RiskLevel.HIGH,
      complianceStatus: ComplianceStatus.NON_COMPLIANT
    })

    expect(dashboard.searchFilters.value.riskLevel).toBe(RiskLevel.HIGH)
    expect(dashboard.searchFilters.value.complianceStatus).toBe(ComplianceStatus.NON_COMPLIANT)
  })

  it('should return filtered entities based on filters', async () => {
    await dashboard.loadDashboardData()

    dashboard.updateSearchFilters({
      riskLevel: RiskLevel.HIGH
    })

    const filtered = dashboard.filteredEntities.value

    expect(filtered.every(e => e.riskLevel === RiskLevel.HIGH)).toBe(true)
  })

  it('should get priority tasks (SUP-DASH-002, SUP-DASH-003)', async () => {
    await dashboard.loadDashboardData()

    const priorityTasks = dashboard.priorityTasks.value

    expect(priorityTasks.length).toBeGreaterThan(0)
    expect(priorityTasks.every(t => t.isPriority)).toBe(true)

    // Verify sorting by priority
    if (priorityTasks.length > 1) {
      const priorities = priorityTasks.map(t => t.priority)
      // Critical should come before High, High before Medium, etc.
      const priorityOrder = ['Critical', 'High', 'Medium', 'Low']
      const firstPriorityIndex = priorityOrder.indexOf(priorities[0])
      const secondPriorityIndex = priorityOrder.indexOf(priorities[1])
      expect(firstPriorityIndex).toBeLessThanOrEqual(secondPriorityIndex)
    }
  })

  it('should get recent alerts (SUP-DASH-004)', async () => {
    await dashboard.loadDashboardData()

    const alerts = dashboard.recentAlerts.value

    expect(alerts.length).toBeGreaterThan(0)
    expect(alerts.every(a => a.reviewStatus !== AlertReviewStatus.CLOSED)).toBe(true)

    // Verify sorted by date (most recent first)
    if (alerts.length > 1) {
      expect(alerts[0].reportDate.getTime()).toBeGreaterThanOrEqual(
        alerts[1].reportDate.getTime()
      )
    }
  })

  it('should get upcoming inspections (SUP-DASH-005)', async () => {
    await dashboard.loadDashboardData()

    const inspections = dashboard.upcomingInspections.value

    expect(inspections).toBeDefined()
    if (inspections.length > 0) {
      const now = new Date()
      expect(inspections.every(i => i.scheduledDate >= now)).toBe(true)
    }
  })

  it('should generate calendar events (SUP-DASH-005)', async () => {
    await dashboard.loadDashboardData()

    const events = dashboard.calendarEvents.value

    expect(events).toBeDefined()
    expect(events.length).toBe(dashboard.inspections.value.length)

    events.forEach(event => {
      expect(event.id).toBeDefined()
      expect(event.title).toBeDefined()
      expect(event.start).toBeInstanceOf(Date)
      expect(event.color).toBeDefined()
    })
  })

  it('should calculate compliance summary (SUP-DASH-006)', async () => {
    await dashboard.loadDashboardData()

    const summary = dashboard.complianceSummary.value

    expect(summary.compliant).toBeGreaterThanOrEqual(0)
    expect(summary.needsAttention).toBeGreaterThanOrEqual(0)
    expect(summary.nonCompliant).toBeGreaterThanOrEqual(0)
    expect(summary.complianceRate).toBeGreaterThanOrEqual(0)
    expect(summary.complianceRate).toBeLessThanOrEqual(100)
    expect(['improving', 'stable', 'declining']).toContain(summary.trend)
  })

  it('should calculate risk distribution (SUP-DASH-007)', async () => {
    await dashboard.loadDashboardData()

    const distribution = dashboard.riskDistribution.value

    expect(distribution.high).toBeGreaterThanOrEqual(0)
    expect(distribution.medium).toBeGreaterThanOrEqual(0)
    expect(distribution.low).toBeGreaterThanOrEqual(0)
    expect(distribution.critical).toBeGreaterThanOrEqual(0)
    expect(distribution.totalRiskScore).toBeGreaterThanOrEqual(0)
    expect(distribution.averageRiskScore).toBeGreaterThanOrEqual(0)
  })

  it('should calculate performance metrics (SUP-DASH-009)', async () => {
    await dashboard.loadDashboardData()

    const metrics = dashboard.performanceMetrics.value

    expect(metrics.casesHandledThisMonth).toBeGreaterThanOrEqual(0)
    expect(metrics.averageResponseTime).toBeGreaterThanOrEqual(0)
    expect(metrics.pendingReviews).toBeGreaterThanOrEqual(0)
    expect(metrics.tasksCompleted).toBeGreaterThanOrEqual(0)
    expect(metrics.inspectionsCompleted).toBeGreaterThanOrEqual(0)
  })

  it('should calculate deficiency metrics (SUP-DASH-012)', async () => {
    await dashboard.loadDashboardData()

    const metrics = dashboard.deficiencyMetrics.value

    expect(metrics.openDeficiencies).toBeGreaterThanOrEqual(0)
    expect(metrics.pendingVerifications).toBeGreaterThanOrEqual(0)
    expect(metrics.resolvedThisMonth).toBeGreaterThanOrEqual(0)
    expect(metrics.averageResolutionTime).toBeGreaterThanOrEqual(0)
  })

  it('should get pending training modules (SUP-DASH-013)', async () => {
    await dashboard.loadDashboardData()

    const trainings = dashboard.pendingTrainings.value

    expect(trainings).toBeDefined()
    // All should be pending status (not completed)
    const completedTrainings = trainings.filter(t => t.status === 'Completed')
    expect(completedTrainings.length).toBe(0)
  })

  it('should get unread notifications (SUP-DASH-014)', async () => {
    await dashboard.loadDashboardData()

    const notifications = dashboard.unreadNotifications.value

    expect(notifications).toBeDefined()
    expect(notifications.every(n => !n.isRead)).toBe(true)

    // Verify sorted by date (most recent first)
    if (notifications.length > 1) {
      expect(notifications[0].timestamp.getTime()).toBeGreaterThanOrEqual(
        notifications[1].timestamp.getTime()
      )
    }
  })

  it('should toggle auto-refresh (SUP-DASH-015)', () => {
    dashboard.toggleAutoRefresh(false)
    expect(dashboard.autoRefreshConfig.value.enabled).toBe(false)

    dashboard.toggleAutoRefresh(true)
    expect(dashboard.autoRefreshConfig.value.enabled).toBe(true)
  })

  it('should update task status', async () => {
    await dashboard.loadDashboardData()

    const taskId = dashboard.tasks.value[0].id
    await dashboard.updateTaskStatus(taskId, TaskStatus.COMPLETED)

    const updatedTask = dashboard.tasks.value.find(t => t.id === taskId)
    expect(updatedTask?.status).toBe(TaskStatus.COMPLETED)
    expect(updatedTask?.completedDate).toBeInstanceOf(Date)
  })

  it('should create a new task', async () => {
    await dashboard.loadDashboardData()

    const taskCount = dashboard.tasks.value.length

    await dashboard.createTask({
      title: 'Test Task',
      description: 'Test task description',
      taskType: 'License Review',
      priority: 'High',
      entityId: dashboard.entities.value[0].id,
      dueDate: new Date(Date.now() + 86400000)
    })

    expect(dashboard.tasks.value.length).toBe(taskCount + 1)
  })

  it('should review an alert', async () => {
    await dashboard.loadDashboardData()

    const alertId = dashboard.alerts.value[0].id
    await dashboard.reviewAlert(alertId, AlertReviewStatus.UNDER_REVIEW, 'Review notes')

    const updatedAlert = dashboard.alerts.value.find(a => a.id === alertId)
    expect(updatedAlert?.reviewStatus).toBe(AlertReviewStatus.UNDER_REVIEW)
    expect(updatedAlert?.reviewNotes).toBe('Review notes')
    expect(updatedAlert?.reviewedBy).toBeDefined()
  })

  it('should mark notification as read', async () => {
    await dashboard.loadDashboardData()

    const notification = dashboard.notifications.value.find(n => !n.isRead)
    if (notification) {
      await dashboard.markNotificationAsRead(notification.id)

      const updatedNotification = dashboard.notifications.value.find(n => n.id === notification.id)
      expect(updatedNotification?.isRead).toBe(true)
    }
  })
})

// ============================================================================
// END-TO-END WORKFLOW TESTS
// ============================================================================

describe('Supervisor Dashboard - End-to-End Workflows', () => {
  let dashboard: ReturnType<typeof useSupervisorDashboard>

  beforeEach(async () => {
    dashboard = useSupervisorDashboard()
    await dashboard.loadDashboardData()
  })

  it('should support complete entity oversight workflow', async () => {
    // 1. Search for entities
    const searchResults = dashboard.searchEntities('First')
    expect(searchResults.length).toBeGreaterThan(0)

    // 2. Filter by high risk
    dashboard.updateSearchFilters({ riskLevel: RiskLevel.HIGH })
    const highRiskEntities = dashboard.filteredEntities.value
    expect(highRiskEntities.every(e => e.riskLevel === RiskLevel.HIGH)).toBe(true)

    // 3. Get tasks for entity
    const entity = highRiskEntities[0]
    const tasks = dashboard.getTasksByEntity(entity.id)
    expect(tasks).toBeDefined()

    // 4. Get alerts for entity
    const alerts = dashboard.getAlertsByEntity(entity.id)
    expect(alerts).toBeDefined()
  })

  it('should provide complete dashboard statistics', () => {
    const stats = dashboard.dashboardStatistics.value

    expect(stats.portfolioMetrics).toBeDefined()
    expect(stats.complianceSummary).toBeDefined()
    expect(stats.riskDistribution).toBeDefined()
    expect(stats.performanceMetrics).toBeDefined()
    expect(stats.deficiencyMetrics).toBeDefined()
    expect(stats.taskSummary).toBeDefined()
    expect(stats.alertSummary).toBeDefined()
  })

  it('should refresh dashboard and update data', async () => {
    const firstRefresh = dashboard.lastRefresh.value

    await new Promise(resolve => setTimeout(resolve, 100))

    await dashboard.refreshDashboard()

    const secondRefresh = dashboard.lastRefresh.value

    expect(secondRefresh).not.toBe(firstRefresh)
    expect(secondRefresh!.getTime()).toBeGreaterThan(firstRefresh!.getTime())
  })
})
