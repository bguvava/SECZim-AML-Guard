/**
 * Supervisor Dashboard Composable
 * 
 * Central business logic and state management for Supervisor Dashboard
 * Covers all requirements SUP-DASH-001 to SUP-DASH-015
 */

import { ref, computed, readonly } from 'vue'
import type {
  SupervisedEntity,
  PendingTask,
  SuspiciousActivityAlert,
  InspectionSchedule,
  RecentActivity,
  DeficiencyRecord,
  TrainingModule,
  Notification,
  EntitySearchFilters,
  DashboardStatistics,
  EntityPortfolioMetrics,
  ComplianceSummary,
  RiskDistribution,
  SupervisorPerformance,
  DeficiencyMetrics,
  CalendarEvent,
  AutoRefreshConfig
} from '@/types/supervisorDashboard'
import {
  RiskLevel,
  ComplianceStatus,
  TaskStatus,
  AlertReviewStatus,
  InspectionStatus,
  DeficiencyStatus,
  TrainingStatus
} from '@/types/supervisorDashboard'
import {
  mockSupervisedEntities,
  mockPendingTasks,
  mockSuspiciousActivityAlerts,
  mockInspectionSchedule,
  mockRecentActivities,
  mockDeficiencyRecords,
  mockTrainingModules,
  mockNotifications,
  getOverdueTasks,
  getPriorityTasks,
  getUnreadNotifications,
  getEntitiesWithInspectionsDue,
  getOpenDeficiencies
} from '@/data/supervisorDashboardMockData'

// ============================================================================
// STATE
// ============================================================================

const entities = ref<SupervisedEntity[]>([])
const tasks = ref<PendingTask[]>([])
const alerts = ref<SuspiciousActivityAlert[]>([])
const inspections = ref<InspectionSchedule[]>([])
const activities = ref<RecentActivity[]>([])
const deficiencies = ref<DeficiencyRecord[]>([])
const trainings = ref<TrainingModule[]>([])
const notifications = ref<Notification[]>([])

const searchFilters = ref<EntitySearchFilters>({})
const selectedEntityId = ref<string | null>(null)
const isLoading = ref(false)
const lastRefresh = ref<Date | null>(null)

// Auto-refresh configuration (SUP-DASH-015)
const autoRefreshConfig = ref<AutoRefreshConfig>({
  enabled: true,
  interval: 60000, // 60 seconds
  lastRefresh: null
})

// ============================================================================
// COMPUTED PROPERTIES
// ============================================================================

/**
 * Entity Portfolio Metrics (SUP-DASH-001)
 */
const portfolioMetrics = computed<EntityPortfolioMetrics>(() => {
  const allEntities = entities.value

  return {
    totalEntities: allEntities.length,
    highRiskCount: allEntities.filter(e => e.riskLevel === RiskLevel.HIGH || e.riskLevel === RiskLevel.CRITICAL).length,
    inspectionsDue: getEntitiesWithInspectionsDue().length,
    pendingApplications: allEntities.reduce((sum, e) => sum + e.pendingApplications, 0),
    entitiesByType: allEntities.reduce((acc, e) => {
      acc[e.entityType] = (acc[e.entityType] || 0) + 1
      return acc
    }, {} as Record<string, number>),
    entitiesByRisk: {
      [RiskLevel.LOW]: allEntities.filter(e => e.riskLevel === RiskLevel.LOW).length,
      [RiskLevel.MEDIUM]: allEntities.filter(e => e.riskLevel === RiskLevel.MEDIUM).length,
      [RiskLevel.HIGH]: allEntities.filter(e => e.riskLevel === RiskLevel.HIGH).length,
      [RiskLevel.CRITICAL]: allEntities.filter(e => e.riskLevel === RiskLevel.CRITICAL).length
    },
    entitiesByCompliance: {
      [ComplianceStatus.COMPLIANT]: allEntities.filter(e => e.complianceStatus === ComplianceStatus.COMPLIANT).length,
      [ComplianceStatus.NEEDS_ATTENTION]: allEntities.filter(e => e.complianceStatus === ComplianceStatus.NEEDS_ATTENTION).length,
      [ComplianceStatus.NON_COMPLIANT]: allEntities.filter(e => e.complianceStatus === ComplianceStatus.NON_COMPLIANT).length,
      [ComplianceStatus.UNDER_REVIEW]: allEntities.filter(e => e.complianceStatus === ComplianceStatus.UNDER_REVIEW).length
    }
  }
})

/**
 * Compliance Summary (SUP-DASH-006)
 */
const complianceSummary = computed<ComplianceSummary>(() => {
  const metrics = portfolioMetrics.value
  const total = metrics.totalEntities

  const compliant = metrics.entitiesByCompliance[ComplianceStatus.COMPLIANT] || 0
  const needsAttention = metrics.entitiesByCompliance[ComplianceStatus.NEEDS_ATTENTION] || 0
  const nonCompliant = metrics.entitiesByCompliance[ComplianceStatus.NON_COMPLIANT] || 0
  const underReview = metrics.entitiesByCompliance[ComplianceStatus.UNDER_REVIEW] || 0

  const complianceRate = total > 0 ? (compliant / total) * 100 : 0

  // Simple trend calculation (would be based on historical data in production)
  let trend: 'improving' | 'stable' | 'declining' = 'stable'
  if (complianceRate >= 80) trend = 'improving'
  else if (complianceRate < 60) trend = 'declining'

  return {
    compliant,
    needsAttention,
    nonCompliant,
    underReview,
    complianceRate: Math.round(complianceRate * 10) / 10,
    trend
  }
})

/**
 * Risk Distribution (SUP-DASH-007)
 */
const riskDistribution = computed<RiskDistribution>(() => {
  const metrics = portfolioMetrics.value
  const allEntities = entities.value

  const high = metrics.entitiesByRisk[RiskLevel.HIGH] || 0
  const medium = metrics.entitiesByRisk[RiskLevel.MEDIUM] || 0
  const low = metrics.entitiesByRisk[RiskLevel.LOW] || 0
  const critical = metrics.entitiesByRisk[RiskLevel.CRITICAL] || 0

  // Calculate risk scores (Critical=4, High=3, Medium=2, Low=1)
  const totalRiskScore = (critical * 4) + (high * 3) + (medium * 2) + (low * 1)
  const averageRiskScore = allEntities.length > 0 
    ? totalRiskScore / allEntities.length 
    : 0

  return {
    high,
    medium,
    low,
    critical,
    totalRiskScore,
    averageRiskScore: Math.round(averageRiskScore * 100) / 100
  }
})

/**
 * Performance Metrics (SUP-DASH-009)
 */
const performanceMetrics = computed<SupervisorPerformance>(() => {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  // Filter tasks and activities for current month
  const monthlyTasks = tasks.value.filter(t => 
    t.createdDate >= startOfMonth || 
    (t.completedDate && t.completedDate >= startOfMonth)
  )

  const completedTasks = monthlyTasks.filter(t => t.status === TaskStatus.COMPLETED)

  // Calculate average response time (in hours)
  const responseTimes = completedTasks
    .filter(t => t.actualHours)
    .map(t => t.actualHours!)

  const averageResponseTime = responseTimes.length > 0
    ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length
    : 0

  const monthlyInspections = inspections.value.filter(i =>
    i.status === InspectionStatus.COMPLETED &&
    i.scheduledDate >= startOfMonth
  )

  const monthlyResolvedDeficiencies = deficiencies.value.filter(d =>
    d.status === DeficiencyStatus.RESOLVED &&
    d.resolvedDate &&
    d.resolvedDate >= startOfMonth
  )

  const pendingReviews = tasks.value.filter(t => 
    t.status === TaskStatus.PENDING || 
    t.status === TaskStatus.IN_PROGRESS
  ).length

  const casesHandled = completedTasks.length + monthlyInspections.length

  return {
    casesHandledThisMonth: casesHandled,
    averageResponseTime: Math.round(averageResponseTime * 10) / 10,
    pendingReviews,
    tasksCompleted: completedTasks.length,
    tasksOverdue: getOverdueTasks().length,
    inspectionsCompleted: monthlyInspections.length,
    reportsGenerated: activities.value.filter(a => 
      a.activityType === 'Report Generated' && 
      a.timestamp >= startOfMonth
    ).length,
    deficienciesResolved: monthlyResolvedDeficiencies.length,
    complianceRate: complianceSummary.value.complianceRate
  }
})

/**
 * Deficiency Metrics (SUP-DASH-012)
 */
const deficiencyMetrics = computed<DeficiencyMetrics>(() => {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const allDeficiencies = deficiencies.value

  const open = allDeficiencies.filter(d => d.status === DeficiencyStatus.OPEN).length
  const pendingVerification = allDeficiencies.filter(d => 
    d.status === DeficiencyStatus.PENDING_VERIFICATION
  ).length
  const resolvedThisMonth = allDeficiencies.filter(d =>
    d.status === DeficiencyStatus.RESOLVED &&
    d.resolvedDate &&
    d.resolvedDate >= startOfMonth
  ).length
  const overdue = allDeficiencies.filter(d => d.isOverdue).length

  // Calculate average resolution time
  const resolvedWithDates = allDeficiencies.filter(d =>
    d.status === DeficiencyStatus.RESOLVED && d.resolvedDate
  )

  const resolutionTimes = resolvedWithDates.map(d => {
    const identified = d.identifiedDate.getTime()
    const resolved = d.resolvedDate!.getTime()
    return (resolved - identified) / (1000 * 60 * 60 * 24) // days
  })

  const averageResolutionTime = resolutionTimes.length > 0
    ? resolutionTimes.reduce((sum, time) => sum + time, 0) / resolutionTimes.length
    : 0

  return {
    openDeficiencies: open,
    pendingVerifications: pendingVerification,
    resolvedThisMonth,
    overdueDeficiencies: overdue,
    averageResolutionTime: Math.round(averageResolutionTime * 10) / 10
  }
})

/**
 * Dashboard Statistics Summary
 */
const dashboardStatistics = computed<DashboardStatistics>(() => {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)

  return {
    portfolioMetrics: portfolioMetrics.value,
    complianceSummary: complianceSummary.value,
    riskDistribution: riskDistribution.value,
    performanceMetrics: performanceMetrics.value,
    deficiencyMetrics: deficiencyMetrics.value,
    taskSummary: {
      total: tasks.value.length,
      overdue: getOverdueTasks().length,
      dueToday: tasks.value.filter(t => {
        const dueDate = new Date(t.dueDate)
        return dueDate.toDateString() === today.toDateString()
      }).length,
      dueThisWeek: tasks.value.filter(t => 
        t.dueDate >= today && t.dueDate <= weekFromNow
      ).length
    },
    alertSummary: {
      newAlerts: alerts.value.filter(a => 
        a.reviewStatus === AlertReviewStatus.NEW
      ).length,
      underReview: alerts.value.filter(a =>
        a.reviewStatus === AlertReviewStatus.UNDER_REVIEW
      ).length,
      escalated: alerts.value.filter(a =>
        a.reviewStatus === AlertReviewStatus.ESCALATED
      ).length
    }
  }
})

/**
 * Filtered entities based on search criteria (SUP-DASH-010)
 */
const filteredEntities = computed<SupervisedEntity[]>(() => {
  let result = entities.value

  const filters = searchFilters.value

  // Search term filter
  if (filters.searchTerm) {
    const term = filters.searchTerm.toLowerCase()
    result = result.filter(e =>
      e.name.toLowerCase().includes(term) ||
      e.licenseNumber.toLowerCase().includes(term) ||
      e.contactPerson.toLowerCase().includes(term)
    )
  }

  // Entity type filter
  if (filters.entityType) {
    result = result.filter(e => e.entityType === filters.entityType)
  }

  // Risk level filter
  if (filters.riskLevel) {
    result = result.filter(e => e.riskLevel === filters.riskLevel)
  }

  // Compliance status filter
  if (filters.complianceStatus) {
    result = result.filter(e => e.complianceStatus === filters.complianceStatus)
  }

  // Open deficiencies filter
  if (filters.hasOpenDeficiencies) {
    result = result.filter(e => e.openDeficiencies > 0)
  }

  // Inspections due filter
  if (filters.inspectionsDue) {
    const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    result = result.filter(e =>
      e.nextInspectionDue && e.nextInspectionDue <= thirtyDaysFromNow
    )
  }

  return result
})

/**
 * Priority tasks (SUP-DASH-002, SUP-DASH-003)
 */
const priorityTasks = computed<PendingTask[]>(() => {
  return getPriorityTasks().sort((a, b) => {
    // Sort by priority, then by due date
    const priorityOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 }
    const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] ?? 4
    const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] ?? 4

    if (aPriority !== bPriority) {
      return aPriority - bPriority
    }

    return a.dueDate.getTime() - b.dueDate.getTime()
  })
})

/**
 * Recent alerts requiring attention (SUP-DASH-004)
 */
const recentAlerts = computed<SuspiciousActivityAlert[]>(() => {
  return alerts.value
    .filter(a => a.reviewStatus !== AlertReviewStatus.CLOSED)
    .sort((a, b) => b.reportDate.getTime() - a.reportDate.getTime())
    .slice(0, 10)
})

/**
 * Upcoming inspections (SUP-DASH-005)
 */
const upcomingInspections = computed<InspectionSchedule[]>(() => {
  const now = new Date()
  return inspections.value
    .filter(i => 
      i.status === InspectionStatus.SCHEDULED &&
      i.scheduledDate >= now
    )
    .sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime())
})

/**
 * Calendar events for inspection calendar (SUP-DASH-005)
 */
const calendarEvents = computed<CalendarEvent[]>(() => {
  return inspections.value.map(inspection => {
    let color = '#3b82f6' // blue

    switch (inspection.status) {
      case InspectionStatus.SCHEDULED:
        color = '#3b82f6' // blue
        break
      case InspectionStatus.IN_PROGRESS:
        color = '#f59e0b' // amber
        break
      case InspectionStatus.COMPLETED:
        color = '#10b981' // green
        break
      case InspectionStatus.CANCELLED:
        color = '#6b7280' // gray
        break
    }

    return {
      id: inspection.id,
      title: `${inspection.entityName} - ${inspection.inspectionType}`,
      start: inspection.scheduledDate,
      end: inspection.endDate || inspection.scheduledDate,
      inspectionType: inspection.inspectionType,
      entityName: inspection.entityName,
      status: inspection.status,
      color
    }
  })
})

/**
 * Unread notifications (SUP-DASH-014)
 */
const unreadNotifications = computed<Notification[]>(() => {
  return getUnreadNotifications().sort((a, b) => 
    b.timestamp.getTime() - a.timestamp.getTime()
  )
})

/**
 * Pending training modules (SUP-DASH-013)
 */
const pendingTrainings = computed<TrainingModule[]>(() => {
  return trainings.value.filter(t =>
    t.status === TrainingStatus.NOT_STARTED ||
    t.status === TrainingStatus.IN_PROGRESS ||
    t.status === TrainingStatus.OVERDUE ||
    t.status === TrainingStatus.EXPIRING_SOON
  ).sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
})

/**
 * Recent activities feed (SUP-DASH-011)
 */
const recentActivitiesFeed = computed<RecentActivity[]>(() => {
  return activities.value
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 20)
})

// ============================================================================
// METHODS
// ============================================================================

/**
 * Load all dashboard data
 */
async function loadDashboardData(): Promise<void> {
  isLoading.value = true
  
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // Load data from mock sources (replace with API calls in production)
    entities.value = [...mockSupervisedEntities]
    tasks.value = [...mockPendingTasks]
    alerts.value = [...mockSuspiciousActivityAlerts]
    inspections.value = [...mockInspectionSchedule]
    activities.value = [...mockRecentActivities]
    deficiencies.value = [...mockDeficiencyRecords]
    trainings.value = [...mockTrainingModules]
    notifications.value = [...mockNotifications]

    lastRefresh.value = new Date()
    autoRefreshConfig.value.lastRefresh = new Date()
  } catch (error) {
    console.error('Error loading dashboard data:', error)
    throw error
  } finally {
    isLoading.value = false
  }
}

/**
 * Refresh dashboard data manually (SUP-DASH-015)
 */
async function refreshDashboard(): Promise<void> {
  await loadDashboardData()
}

/**
 * Toggle auto-refresh (SUP-DASH-015)
 */
function toggleAutoRefresh(enabled: boolean): void {
  autoRefreshConfig.value.enabled = enabled
  
  if (enabled) {
    autoRefreshConfig.value.lastRefresh = new Date()
  }
}

/**
 * Set auto-refresh interval (SUP-DASH-015)
 */
function setAutoRefreshInterval(intervalMs: number): void {
  if (intervalMs < 10000 || intervalMs > 300000) {
    throw new Error('Auto-refresh interval must be between 10 and 300 seconds')
  }
  
  autoRefreshConfig.value.interval = intervalMs
}

/**
 * Update entity search filters (SUP-DASH-010)
 */
function updateSearchFilters(filters: Partial<EntitySearchFilters>): void {
  searchFilters.value = { ...searchFilters.value, ...filters }
}

/**
 * Clear all search filters
 */
function clearSearchFilters(): void {
  searchFilters.value = {}
}

/**
 * Search entities by term (SUP-DASH-010)
 */
function searchEntities(searchTerm: string): SupervisedEntity[] {
  if (!searchTerm || searchTerm.trim() === '') {
    return entities.value
  }

  const term = searchTerm.toLowerCase().trim()

  return entities.value.filter(entity =>
    entity.name.toLowerCase().includes(term) ||
    entity.licenseNumber.toLowerCase().includes(term) ||
    entity.contactPerson.toLowerCase().includes(term) ||
    entity.contactEmail.toLowerCase().includes(term) ||
    entity.entityType.toLowerCase().includes(term)
  )
}

/**
 * Get entity by ID
 */
function getEntityById(entityId: string): SupervisedEntity | undefined {
  return entities.value.find(e => e.id === entityId)
}

/**
 * Select an entity
 */
function selectEntity(entityId: string | null): void {
  selectedEntityId.value = entityId
}

/**
 * Get tasks for a specific entity
 */
function getTasksByEntity(entityId: string): PendingTask[] {
  return tasks.value.filter(t => t.entityId === entityId)
}

/**
 * Get alerts for a specific entity
 */
function getAlertsByEntity(entityId: string): SuspiciousActivityAlert[] {
  return alerts.value.filter(a => a.entityId === entityId)
}

/**
 * Get inspections for a specific entity
 */
function getInspectionsByEntity(entityId: string): InspectionSchedule[] {
  return inspections.value.filter(i => i.entityId === entityId)
}

/**
 * Get deficiencies for a specific entity
 */
function getDeficienciesByEntity(entityId: string): DeficiencyRecord[] {
  return deficiencies.value.filter(d => d.entityId === entityId)
}

/**
 * Update task status
 */
async function updateTaskStatus(
  taskId: string,
  status: TaskStatus,
  actualHours?: number,
  comments?: string
): Promise<void> {
  const task = tasks.value.find(t => t.id === taskId)
  
  if (!task) {
    throw new Error(`Task ${taskId} not found`)
  }

  task.status = status

  if (status === TaskStatus.COMPLETED) {
    task.completedDate = new Date()
  }

  if (actualHours !== undefined) {
    task.actualHours = actualHours
  }

  if (comments) {
    if (!task.comments) {
      task.comments = []
    }
    task.comments.push({
      id: `CMT-${Date.now()}`,
      taskId,
      userId: 'SUP-001',
      userName: 'Current User',
      comment: comments,
      timestamp: new Date()
    })
  }

  // In production, make API call here
  await new Promise(resolve => setTimeout(resolve, 300))
}

/**
 * Create a new task
 */
async function createTask(taskData: {
  title: string
  description: string
  taskType: string
  priority: string
  entityId: string
  dueDate: Date
  estimatedHours?: number
}): Promise<PendingTask> {
  const entity = getEntityById(taskData.entityId)
  
  if (!entity) {
    throw new Error(`Entity ${taskData.entityId} not found`)
  }

  const newTask: PendingTask = {
    id: `TASK-${Date.now()}`,
    title: taskData.title,
    description: taskData.description,
    taskType: taskData.taskType as any,
    priority: taskData.priority as any,
    status: TaskStatus.PENDING,
    entityId: taskData.entityId,
    entityName: entity.name,
    assignedTo: 'SUP-001',
    dueDate: taskData.dueDate,
    createdDate: new Date(),
    estimatedHours: taskData.estimatedHours,
    isOverdue: false,
    isPriority: taskData.priority === 'Critical' || taskData.priority === 'High'
  }

  tasks.value.push(newTask)

  // In production, make API call here
  await new Promise(resolve => setTimeout(resolve, 300))

  return newTask
}

/**
 * Review an alert (SUP-DASH-004)
 */
async function reviewAlert(
  alertId: string,
  reviewStatus: AlertReviewStatus,
  reviewNotes: string,
  escalationReason?: string,
  closureReason?: string
): Promise<void> {
  const alert = alerts.value.find(a => a.id === alertId)
  
  if (!alert) {
    throw new Error(`Alert ${alertId} not found`)
  }

  alert.reviewStatus = reviewStatus
  alert.reviewNotes = reviewNotes
  alert.reviewedBy = 'SUP-001'
  alert.reviewedDate = new Date()

  if (escalationReason) {
    alert.escalationReason = escalationReason
  }

  if (closureReason) {
    alert.closureReason = closureReason
  }

  // In production, make API call here
  await new Promise(resolve => setTimeout(resolve, 300))
}

/**
 * Schedule an inspection (SUP-DASH-008)
 */
async function scheduleInspection(inspectionData: {
  entityId: string
  inspectionType: InspectionType
  scheduledDate: Date
  endDate?: Date
  inspectionTeam: string[]
  scope: string
  location: string
  preparationNotes?: string
}): Promise<InspectionSchedule> {
  const entity = getEntityById(inspectionData.entityId)
  
  if (!entity) {
    throw new Error(`Entity ${inspectionData.entityId} not found`)
  }

  const newInspection: InspectionSchedule = {
    id: `INS-${Date.now()}`,
    entityId: inspectionData.entityId,
    entityName: entity.name,
    entityType: entity.entityType,
    inspectionType: inspectionData.inspectionType,
    scheduledDate: inspectionData.scheduledDate,
    endDate: inspectionData.endDate,
    status: InspectionStatus.SCHEDULED,
    leadInspector: 'SUP-001',
    inspectionTeam: inspectionData.inspectionTeam,
    scope: inspectionData.scope,
    location: inspectionData.location,
    preparationNotes: inspectionData.preparationNotes
  }

  inspections.value.push(newInspection)

  // Update entity's next inspection due date
  entity.nextInspectionDue = inspectionData.scheduledDate

  // In production, make API call here
  await new Promise(resolve => setTimeout(resolve, 300))

  return newInspection
}

/**
 * Generate a report (SUP-DASH-008)
 */
async function generateReport(reportConfig: {
  reportType: 'entity' | 'inspection' | 'compliance' | 'performance'
  entityIds?: string[]
  startDate: Date
  endDate: Date
  includeCharts: boolean
  includeRawData: boolean
  format: 'pdf' | 'excel' | 'csv'
}): Promise<{ url: string; filename: string }> {
  // Simulate report generation
  await new Promise(resolve => setTimeout(resolve, 2000))

  const filename = `${reportConfig.reportType}-report-${Date.now()}.${reportConfig.format}`

  // In production, make API call to generate report
  return {
    url: `/reports/${filename}`,
    filename
  }
}

/**
 * Send a notice (SUP-DASH-008)
 */
async function sendNotice(noticeConfig: {
  entityId: string
  noticeType: 'inspection' | 'deficiency' | 'compliance' | 'general'
  subject: string
  message: string
  dueDate?: Date
  requiresResponse: boolean
}): Promise<void> {
  const entity = getEntityById(noticeConfig.entityId)
  
  if (!entity) {
    throw new Error(`Entity ${noticeConfig.entityId} not found`)
  }

  // Create notification record
  const notification: Notification = {
    id: `NOT-${Date.now()}`,
    type: 'System Alert' as any,
    priority: 'Normal' as any,
    title: `Notice Sent: ${noticeConfig.subject}`,
    message: `Notice sent to ${entity.name}`,
    timestamp: new Date(),
    isRead: true,
    relatedEntityId: noticeConfig.entityId,
    relatedEntityName: entity.name,
    senderId: 'SUP-001',
    senderName: 'Current User'
  }

  notifications.value.unshift(notification)

  // In production, make API call here
  await new Promise(resolve => setTimeout(resolve, 500))
}

/**
 * Mark notification as read (SUP-DASH-014)
 */
async function markNotificationAsRead(notificationId: string): Promise<void> {
  const notification = notifications.value.find(n => n.id === notificationId)
  
  if (notification) {
    notification.isRead = true
    
    // In production, make API call here
    await new Promise(resolve => setTimeout(resolve, 100))
  }
}

/**
 * Mark all notifications as read
 */
async function markAllNotificationsAsRead(): Promise<void> {
  notifications.value.forEach(n => {
    n.isRead = true
  })
  
  // In production, make API call here
  await new Promise(resolve => setTimeout(resolve, 200))
}

/**
 * Update deficiency status (SUP-DASH-012)
 */
async function updateDeficiencyStatus(
  deficiencyId: string,
  status: DeficiencyStatus,
  verificationNotes?: string
): Promise<void> {
  const deficiency = deficiencies.value.find(d => d.id === deficiencyId)
  
  if (!deficiency) {
    throw new Error(`Deficiency ${deficiencyId} not found`)
  }

  deficiency.status = status

  if (status === DeficiencyStatus.RESOLVED) {
    deficiency.resolvedDate = new Date()
  }

  if (status === DeficiencyStatus.PENDING_VERIFICATION || status === DeficiencyStatus.RESOLVED) {
    deficiency.verifiedBy = 'SUP-001'
    deficiency.verificationDate = new Date()
  }

  // In production, make API call here
  await new Promise(resolve => setTimeout(resolve, 300))
}

/**
 * Get high-risk entities requiring attention
 */
function getHighRiskEntities(): SupervisedEntity[] {
  return entities.value
    .filter(e => e.riskLevel === RiskLevel.HIGH || e.riskLevel === RiskLevel.CRITICAL)
    .sort((a, b) => {
      // Sort by risk level (Critical first) then by open deficiencies
      if (a.riskLevel === RiskLevel.CRITICAL && b.riskLevel !== RiskLevel.CRITICAL) return -1
      if (a.riskLevel !== RiskLevel.CRITICAL && b.riskLevel === RiskLevel.CRITICAL) return 1
      return b.openDeficiencies - a.openDeficiencies
    })
}

/**
 * Get non-compliant entities
 */
function getNonCompliantEntities(): SupervisedEntity[] {
  return entities.value.filter(e => 
    e.complianceStatus === ComplianceStatus.NON_COMPLIANT
  )
}

/**
 * Export dashboard data
 */
async function exportDashboardData(format: 'csv' | 'excel' | 'pdf'): Promise<{ url: string; filename: string }> {
  await new Promise(resolve => setTimeout(resolve, 1500))

  const filename = `supervisor-dashboard-${Date.now()}.${format}`

  // In production, generate actual export file
  return {
    url: `/exports/${filename}`,
    filename
  }
}

// ============================================================================
// COMPOSABLE RETURN
// ============================================================================

export function useSupervisorDashboard() {
  return {
    // State
    entities: readonly(entities),
    tasks: readonly(tasks),
    alerts: readonly(alerts),
    inspections: readonly(inspections),
    activities: readonly(activities),
    deficiencies: readonly(deficiencies),
    trainings: readonly(trainings),
    notifications: readonly(notifications),
    searchFilters: readonly(searchFilters),
    selectedEntityId: readonly(selectedEntityId),
    isLoading: readonly(isLoading),
    lastRefresh: readonly(lastRefresh),
    autoRefreshConfig: readonly(autoRefreshConfig),

    // Computed
    portfolioMetrics,
    complianceSummary,
    riskDistribution,
    performanceMetrics,
    deficiencyMetrics,
    dashboardStatistics,
    filteredEntities,
    priorityTasks,
    recentAlerts,
    upcomingInspections,
    calendarEvents,
    unreadNotifications,
    pendingTrainings,
    recentActivitiesFeed,

    // Methods
    loadDashboardData,
    refreshDashboard,
    toggleAutoRefresh,
    setAutoRefreshInterval,
    updateSearchFilters,
    clearSearchFilters,
    searchEntities,
    getEntityById,
    selectEntity,
    getTasksByEntity,
    getAlertsByEntity,
    getInspectionsByEntity,
    getDeficienciesByEntity,
    updateTaskStatus,
    createTask,
    reviewAlert,
    scheduleInspection,
    generateReport,
    sendNotice,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    updateDeficiencyStatus,
    getHighRiskEntities,
    getNonCompliantEntities,
    exportDashboardData
  }
}
