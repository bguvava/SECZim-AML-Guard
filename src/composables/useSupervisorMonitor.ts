/**
 * Supervisor Activity Monitor Composable
 * 
 * @module composables/useSupervisorMonitor
 * @description Central state management for supervisor monitoring, tracking, and analytics
 * 
 * Requirements Coverage:
 * - ADM-SUP-001 to ADM-SUP-020: Complete supervisor monitoring functionality
 * 
 * @author bguvava
 * @since 2025-01-30
 */

import { ref, computed, readonly } from 'vue'
import type {
  Supervisor,
  SupervisorCase,
  PerformanceMetrics,
  SupervisorDecision,
  ActivityLog,
  PerformanceAnomaly,
  PerformanceTarget,
  AlertConfiguration,
  CaseLoadDistribution,
  PerformanceTrendData,
  QualityScoreBreakdown,
  RiskAssessmentAccuracy,
  CaseTypeBreakdown,
  SupervisorReport,
  SupervisorDashboardSummary,
  SupervisorCardData,
  SupervisorFilters,
  PaginationParams,
  RebalancingSuggestion,
  ComparativeMetrics,
} from '@/types/supervisor'

import {
  SupervisorRole,
  CaseStatus,
  CaseType,
  DecisionType,
  AnomalyType,
  AlertSeverity,
  ReportType,
} from '@/types/supervisor'

import {
  mockSupervisors,
  mockSupervisorCases,
  mockPerformanceMetrics,
  mockSupervisorDecisions,
  mockActivityLogs,
  mockPerformanceAnomalies,
  mockPerformanceTargets,
  mockAlertConfigurations,
  mockCaseLoadDistribution,
  mockPerformanceTrends,
  mockQualityScoreBreakdowns,
  mockRiskAssessmentAccuracy,
  mockCaseTypeBreakdowns,
} from '@/data/supervisorMockData'

import {
  validateSupervisor,
  validatePerformanceTarget,
  validateAlertConfiguration,
  validateReportParameters,
  validateWorkloadRebalancing,
  validateDecision,
  type SupervisorInput,
  type PerformanceTargetInput,
  type AlertConfigurationInput,
  type DecisionInput,
  type WorkloadRebalancingInput,
  type ReportParametersInput,
} from '@/schemas/supervisorValidation'

// ============================================================
// STATE
// ============================================================

const supervisors = ref<Supervisor[]>([...mockSupervisors])
const cases = ref<SupervisorCase[]>([...mockSupervisorCases])
const performanceMetrics = ref<PerformanceMetrics[]>([...mockPerformanceMetrics])
const decisions = ref<SupervisorDecision[]>([...mockSupervisorDecisions])
const activityLogs = ref<ActivityLog[]>([...mockActivityLogs])
const anomalies = ref<PerformanceAnomaly[]>([...mockPerformanceAnomalies])
const targets = ref<PerformanceTarget[]>([...mockPerformanceTargets])
const alertConfigurations = ref<AlertConfiguration[]>([...mockAlertConfigurations])
const caseLoadDistributions = ref<CaseLoadDistribution[]>([...mockCaseLoadDistribution])
const performanceTrends = ref<PerformanceTrendData[]>([...mockPerformanceTrends])
const qualityScoreBreakdowns = ref<QualityScoreBreakdown[]>([...mockQualityScoreBreakdowns])
const riskAccuracy = ref<RiskAssessmentAccuracy[]>([...mockRiskAssessmentAccuracy])
const caseTypeBreakdowns = ref<CaseTypeBreakdown[]>([...mockCaseTypeBreakdowns])

const selectedSupervisor = ref<Supervisor | null>(null)
const selectedCase = ref<SupervisorCase | null>(null)
const selectedAnomaly = ref<PerformanceAnomaly | null>(null)

const filters = ref<SupervisorFilters>({})
const pagination = ref<PaginationParams>({
  page: 1,
  pageSize: 10,
  sortBy: 'lastName',
  sortOrder: 'asc',
})

const loading = ref(false)
const error = ref<string | null>(null)

const dateRange = ref({
  start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  end: new Date(),
})

// ============================================================
// COMPUTED PROPERTIES
// ============================================================

/**
 * Dashboard summary statistics
 * Requirement: ADM-SUP-001
 */
const dashboardSummary = computed<SupervisorDashboardSummary>(() => {
  const totalSupervisors = supervisors.value.length
  const activeSupervisors = supervisors.value.filter(s => s.isActive).length
  const totalCases = cases.value.length
  const pendingCases = cases.value.filter(c => c.status === CaseStatus.PENDING_DECISION || c.status === CaseStatus.ASSIGNED).length
  const overdueCases = cases.value.filter(c => c.isOverdue).length
  
  const avgResponseTime = performanceMetrics.value.reduce((sum, m) => sum + m.avgResponseTime, 0) / performanceMetrics.value.length || 0
  const avgQualityScore = performanceMetrics.value.reduce((sum, m) => sum + m.qualityScore, 0) / performanceMetrics.value.length || 0
  const activeAnomalies = anomalies.value.filter(a => !a.isResolved).length
  
  return {
    totalSupervisors,
    activeSupervisors,
    totalCases,
    pendingCases,
    overdueCases,
    avgResponseTime: Math.round(avgResponseTime),
    avgQualityScore: Math.round(avgQualityScore),
    activeAnomalies,
    lastUpdated: new Date(),
  }
})

/**
 * Filtered supervisors based on current filters
 */
const filteredSupervisors = computed(() => {
  let result = supervisors.value

  if (filters.value.roles && filters.value.roles.length > 0) {
    result = result.filter(s => filters.value.roles!.includes(s.role))
  }

  if (filters.value.departments && filters.value.departments.length > 0) {
    result = result.filter(s => filters.value.departments!.includes(s.department))
  }

  if (filters.value.minQualityScore !== undefined) {
    const metrics = performanceMetrics.value
    result = result.filter(s => {
      const metric = metrics.find(m => m.supervisorId === s.id)
      return metric && metric.qualityScore >= filters.value.minQualityScore!
    })
  }

  if (filters.value.hasAnomalies !== undefined) {
    const hasAnomaliesIds = anomalies.value.filter(a => !a.isResolved).map(a => a.supervisorId)
    result = result.filter(s => filters.value.hasAnomalies ? hasAnomaliesIds.includes(s.id) : !hasAnomaliesIds.includes(s.id))
  }

  if (filters.value.isOverloaded !== undefined) {
    const overloadedIds = caseLoadDistributions.value.filter(d => d.isOverloaded).map(d => d.supervisorId)
    result = result.filter(s => filters.value.isOverloaded ? overloadedIds.includes(s.id) : !overloadedIds.includes(s.id))
  }

  return result
})

/**
 * Paginated supervisors
 */
const paginatedSupervisors = computed(() => {
  const start = (pagination.value.page - 1) * pagination.value.pageSize
  const end = start + pagination.value.pageSize
  
  let sorted = [...filteredSupervisors.value]
  
  if (pagination.value.sortBy) {
    sorted.sort((a, b) => {
      const aVal = a[pagination.value.sortBy as keyof Supervisor]
      const bVal = b[pagination.value.sortBy as keyof Supervisor]
      
      if (aVal < bVal) return pagination.value.sortOrder === 'asc' ? -1 : 1
      if (aVal > bVal) return pagination.value.sortOrder === 'asc' ? 1 : -1
      return 0
    })
  }
  
  return sorted.slice(start, end)
})

/**
 * Total pages for pagination
 */
const totalPages = computed(() => {
  return Math.ceil(filteredSupervisors.value.length / pagination.value.pageSize)
})

/**
 * Active anomalies count
 * Requirement: ADM-SUP-010
 */
const activeAnomaliesCount = computed(() => {
  return anomalies.value.filter(a => !a.isResolved).length
})

/**
 * Critical anomalies
 */
const criticalAnomalies = computed(() => {
  return anomalies.value.filter(a => !a.isResolved && a.severity === AlertSeverity.CRITICAL)
})

/**
 * Overloaded supervisors
 * Requirement: ADM-SUP-003
 */
const overloadedSupervisors = computed(() => {
  return caseLoadDistributions.value.filter(d => d.isOverloaded)
})

/**
 * Underloaded supervisors
 * Requirement: ADM-SUP-003
 */
const underloadedSupervisors = computed(() => {
  return caseLoadDistributions.value.filter(d => d.isUnderloaded)
})

/**
 * Supervisor cards data for overview dashboard
 * Requirement: ADM-SUP-001
 */
const supervisorCards = computed<SupervisorCardData[]>(() => {
  return supervisors.value.map(supervisor => {
    const metrics = performanceMetrics.value.find(m => m.supervisorId === supervisor.id)!
    const recentActivity = activityLogs.value
      .filter(a => a.supervisorId === supervisor.id)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 5)
    const activeAnomalies = anomalies.value.filter(a => a.supervisorId === supervisor.id && !a.isResolved)
    
    // Calculate trends
    const trends = performanceTrends.value.filter(t => t.supervisorId === supervisor.id).sort((a, b) => b.date.getTime() - a.date.getTime())
    const latestTrend = trends[0]
    const previousTrend = trends[1]
    
    const getTrendIndicator = (current: number, previous: number, lowerIsBetter = false): 'up' | 'down' | 'stable' => {
      const change = ((current - previous) / previous) * 100
      if (Math.abs(change) < 5) return 'stable'
      if (lowerIsBetter) {
        return change < 0 ? 'up' : 'down'
      }
      return change > 0 ? 'up' : 'down'
    }
    
    return {
      supervisor,
      metrics,
      recentActivity,
      activeAnomalies,
      trendIndicators: latestTrend && previousTrend ? {
        casesHandled: getTrendIndicator(latestTrend.casesHandled, previousTrend.casesHandled),
        responseTime: getTrendIndicator(latestTrend.avgResponseTime, previousTrend.avgResponseTime, true),
        qualityScore: getTrendIndicator(latestTrend.qualityScore, previousTrend.qualityScore),
      } : {
        casesHandled: 'stable',
        responseTime: 'stable',
        qualityScore: 'stable',
      },
    }
  })
})

// ============================================================
// CORE DATA LOADING METHODS
// ============================================================

/**
 * Load all supervisor monitoring data
 * Requirement: ADM-SUP-001
 */
export function useSupervisorMonitor() {
  const loadSupervisorData = async () => {
    loading.value = true
    error.value = null
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Data already loaded from mock data
      // In production, this would fetch from API
      
      // Recalculate derived data
      await Promise.all([
        calculateAllQualityScores(),
        detectAllAnomalies(),
        calculateCaseLoadDistributions(),
      ])
      
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load supervisor data'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Load performance metrics for specific period
   * Requirements: ADM-SUP-006, ADM-SUP-007, ADM-SUP-008
   */
  const loadPerformanceMetrics = async (supervisorId?: string, startDate?: Date, endDate?: Date) => {
    loading.value = true
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      let metrics = performanceMetrics.value
      
      if (supervisorId) {
        metrics = metrics.filter(m => m.supervisorId === supervisorId)
      }
      
      if (startDate && endDate) {
        metrics = metrics.filter(m => m.periodStart >= startDate && m.periodEnd <= endDate)
      }
      
      return metrics
    } catch (err) {
      error.value = 'Failed to load performance metrics'
      throw err
    } finally {
      loading.value = false
    }
  }

  // ============================================================
  // QUALITY SCORING
  // ============================================================

  /**
   * Calculate quality score for a supervisor
   * Requirement: ADM-SUP-008
   * 
   * Quality Score = weighted sum of:
   * - Decision Consistency (25%)
   * - Turnaround Time (20%)
   * - Accuracy Rate (30%)
   * - Entity Satisfaction (15%)
   * - Compliance Adherence (10%)
   */
  const calculateQualityScore = (supervisorId: string): QualityScoreBreakdown => {
    const metrics = performanceMetrics.value.find(m => m.supervisorId === supervisorId)
    
    if (!metrics) {
      // Return default zero score if metrics not found
      return {
        supervisorId,
        overallScore: 0,
        components: [],
        lastCalculated: new Date(),
      }
    }
    
    // Component calculations
    const decisionConsistency = {
      score: metrics.decisionConsistencyScore,
      weight: 0.25,
      description: 'Consistency in applying decision criteria across similar cases',
    }
    
    const turnaroundTime = {
      score: Math.min(100, (120 / metrics.avgResponseTime) * 100), // 120 hours is target
      weight: 0.20,
      description: 'Speed of case processing compared to targets',
    }
    
    const accuracyRate = {
      score: metrics.accuracyScore,
      weight: 0.30,
      description: 'Accuracy of risk assessments and decisions',
    }
    
    const entitySatisfaction = {
      score: metrics.avgEntityFeedbackScore ? metrics.avgEntityFeedbackScore * 20 : 80,
      weight: 0.15,
      description: 'Entity feedback on supervisor interactions',
    }
    
    const complianceAdherence = {
      score: metrics.inspectionCompletionRate,
      weight: 0.10,
      description: 'Adherence to procedures and deadlines',
    }
    
    const overallScore = Math.round(
      decisionConsistency.score * decisionConsistency.weight +
      turnaroundTime.score * turnaroundTime.weight +
      accuracyRate.score * accuracyRate.weight +
      entitySatisfaction.score * entitySatisfaction.weight +
      complianceAdherence.score * complianceAdherence.weight
    )
    
    return {
      supervisorId,
      overallScore,
      components: {
        decisionConsistency,
        turnaroundTime,
        accuracyRate,
        entitySatisfaction,
        complianceAdherence,
      },
      calculatedAt: new Date(),
    }
  }

  /**
   * Calculate quality scores for all supervisors
   */
  const calculateAllQualityScores = async () => {
    try {
      const breakdowns = supervisors.value.map(s => calculateQualityScore(s.id))
      qualityScoreBreakdowns.value = breakdowns
      return breakdowns
    } catch (err) {
      console.error('Error calculating quality scores:', err)
      throw err
    }
  }

  // ============================================================
  // ANOMALY DETECTION
  // ============================================================

  /**
   * Detect performance anomalies for a supervisor
   * Requirement: ADM-SUP-010
   */
  const detectAnomalies = (supervisorId: string): PerformanceAnomaly[] => {
    const supervisor = supervisors.value.find(s => s.id === supervisorId)
    const metrics = performanceMetrics.value.find(m => m.supervisorId === supervisorId)
    const previousMetrics = performanceMetrics.value.filter(m => m.supervisorId === supervisorId && m.periodEnd < metrics!.periodEnd).sort((a, b) => b.periodEnd.getTime() - a.periodEnd.getTime())[0]
    
    if (!supervisor || !metrics) return []
    
    const detectedAnomalies: PerformanceAnomaly[] = []
    
    // 1. Overdue cases threshold
    const overdueThreshold = targets.value.find(t => t.metric === 'overdueCases')
    if (overdueThreshold && metrics.overdueCases > overdueThreshold.warningThreshold) {
      detectedAnomalies.push({
        id: `ANOM-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        supervisorId,
        supervisorName: `${supervisor.firstName} ${supervisor.lastName}`,
        anomalyType: AnomalyType.OVERDUE_CASES_THRESHOLD,
        severity: metrics.overdueCases > overdueThreshold.criticalThreshold ? AlertSeverity.CRITICAL : AlertSeverity.HIGH,
        detectedAt: new Date(),
        description: `Supervisor has ${metrics.overdueCases} overdue cases exceeding threshold of ${overdueThreshold.warningThreshold}`,
        currentValue: metrics.overdueCases,
        expectedValue: overdueThreshold.targetValue,
        threshold: overdueThreshold.warningThreshold,
        deviation: ((metrics.overdueCases - overdueThreshold.targetValue) / overdueThreshold.targetValue) * 100,
        recommendations: [
          'Review case assignments and priorities',
          'Consider workload rebalancing',
          'Schedule meeting to identify bottlenecks',
        ],
        isResolved: false,
        createdAt: new Date(),
      })
    }
    
    // 2. Response time spike
    if (previousMetrics) {
      const responseTimeIncrease = ((metrics.avgResponseTime - previousMetrics.avgResponseTime) / previousMetrics.avgResponseTime) * 100
      if (responseTimeIncrease > 40) {
        detectedAnomalies.push({
          id: `ANOM-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          supervisorId,
          supervisorName: `${supervisor.firstName} ${supervisor.lastName}`,
          anomalyType: AnomalyType.RESPONSE_TIME_SPIKE,
          severity: responseTimeIncrease > 60 ? AlertSeverity.HIGH : AlertSeverity.MEDIUM,
          detectedAt: new Date(),
          description: `Average response time increased by ${responseTimeIncrease.toFixed(1)}% compared to previous period`,
          currentValue: metrics.avgResponseTime,
          expectedValue: previousMetrics.avgResponseTime,
          threshold: previousMetrics.avgResponseTime * 1.4,
          deviation: responseTimeIncrease,
          recommendations: [
            'Investigate causes of delays',
            'Review case complexity distribution',
            'Provide additional support if needed',
          ],
          isResolved: false,
          createdAt: new Date(),
        })
      }
    }
    
    // 3. Quality score drop
    if (previousMetrics && metrics.qualityScore < previousMetrics.qualityScore) {
      const scoreDecrease = ((previousMetrics.qualityScore - metrics.qualityScore) / previousMetrics.qualityScore) * 100
      if (scoreDecrease > 10) {
        detectedAnomalies.push({
          id: `ANOM-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          supervisorId,
          supervisorName: `${supervisor.firstName} ${supervisor.lastName}`,
          anomalyType: AnomalyType.QUALITY_SCORE_DROP,
          severity: scoreDecrease > 20 ? AlertSeverity.HIGH : AlertSeverity.MEDIUM,
          detectedAt: new Date(),
          description: `Quality score dropped from ${previousMetrics.qualityScore} to ${metrics.qualityScore} (${scoreDecrease.toFixed(1)}% decrease)`,
          currentValue: metrics.qualityScore,
          expectedValue: previousMetrics.qualityScore,
          threshold: previousMetrics.qualityScore * 0.9,
          deviation: -scoreDecrease,
          recommendations: [
            'Review recent decisions for quality issues',
            'Schedule quality assurance review',
            'Provide refresher training if necessary',
          ],
          isResolved: false,
          createdAt: new Date(),
        })
      }
    }
    
    // 4. Inactivity period
    const recentActivity = activityLogs.value.filter(a => a.supervisorId === supervisorId).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0]
    if (recentActivity) {
      const hoursSinceActivity = (Date.now() - recentActivity.timestamp.getTime()) / (1000 * 60 * 60)
      if (hoursSinceActivity > 48) {
        detectedAnomalies.push({
          id: `ANOM-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          supervisorId,
          supervisorName: `${supervisor.firstName} ${supervisor.lastName}`,
          anomalyType: AnomalyType.INACTIVITY_PERIOD,
          severity: hoursSinceActivity > 72 ? AlertSeverity.HIGH : AlertSeverity.MEDIUM,
          detectedAt: new Date(),
          description: `No activity recorded for ${Math.floor(hoursSinceActivity)} hours`,
          currentValue: hoursSinceActivity,
          expectedValue: 24,
          threshold: 48,
          deviation: ((hoursSinceActivity - 24) / 24) * 100,
          recommendations: [
            'Contact supervisor to check availability',
            'Review workload and capacity',
            'Reassign urgent cases if necessary',
          ],
          isResolved: false,
          createdAt: new Date(),
        })
      }
    }
    
    // 5. Low productivity
    const productivityThreshold = targets.value.find(t => t.metric === 'completedCases')
    if (productivityThreshold && metrics.completedCases < productivityThreshold.warningThreshold) {
      detectedAnomalies.push({
        id: `ANOM-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        supervisorId,
        supervisorName: `${supervisor.firstName} ${supervisor.lastName}`,
        anomalyType: AnomalyType.LOW_PRODUCTIVITY,
        severity: metrics.completedCases < productivityThreshold.criticalThreshold ? AlertSeverity.HIGH : AlertSeverity.MEDIUM,
        detectedAt: new Date(),
        description: `Completed only ${metrics.completedCases} cases, below target of ${productivityThreshold.targetValue}`,
        currentValue: metrics.completedCases,
        expectedValue: productivityThreshold.targetValue,
        threshold: productivityThreshold.warningThreshold,
        deviation: ((productivityThreshold.targetValue - metrics.completedCases) / productivityThreshold.targetValue) * 100,
        recommendations: [
          'Investigate reasons for low productivity',
          'Review case complexity and assignments',
          'Provide training or support as needed',
        ],
        isResolved: false,
        createdAt: new Date(),
      })
    }
    
    return detectedAnomalies
  }

  /**
   * Detect anomalies for all supervisors
   */
  const detectAllAnomalies = async () => {
    try {
      const newAnomalies: PerformanceAnomaly[] = []
      
      for (const supervisor of supervisors.value) {
        const detected = detectAnomalies(supervisor.id)
        newAnomalies.push(...detected)
      }
      
      // Merge with existing anomalies
      const existingIds = new Set(anomalies.value.map(a => `${a.supervisorId}-${a.anomalyType}`))
      const uniqueNew = newAnomalies.filter(a => !existingIds.has(`${a.supervisorId}-${a.anomalyType}`))
      
      anomalies.value = [...anomalies.value, ...uniqueNew]
      
      return uniqueNew
    } catch (err) {
      console.error('Error detecting anomalies:', err)
      throw err
    }
  }

  // ============================================================
  // WORKLOAD MANAGEMENT
  // ============================================================

  /**
   * Calculate case load distribution
   * Requirement: ADM-SUP-003
   */
  const calculateCaseLoadDistributions = async () => {
    try {
      const distributions: CaseLoadDistribution[] = supervisors.value.map(supervisor => {
        const metrics = performanceMetrics.value.find(m => m.supervisorId === supervisor.id)!
        const totalCases = metrics.totalCases
        const utilizationRate = (totalCases / supervisor.maxCaseLoad) * 100
        
        return {
          supervisorId: supervisor.id,
          supervisorName: `${supervisor.firstName} ${supervisor.lastName}`,
          totalCases,
          pendingCases: metrics.pendingCases,
          activeCases: metrics.pendingCases,
          completedCases: metrics.completedCases,
          percentage: (totalCases / cases.value.length) * 100,
          isOverloaded: utilizationRate > 85,
          isUnderloaded: utilizationRate < 50,
          maxCapacity: supervisor.maxCaseLoad,
          utilizationRate,
        }
      })
      
      caseLoadDistributions.value = distributions
      return distributions
    } catch (err) {
      console.error('Error calculating case load distributions:', err)
      throw err
    }
  }

  /**
   * Generate workload rebalancing suggestions
   * Requirement: ADM-SUP-017
   */
  const generateRebalancingSuggestions = (): RebalancingSuggestion[] => {
    const suggestions: RebalancingSuggestion[] = []
    
    const overloaded = caseLoadDistributions.value.filter(d => d.isOverloaded)
    const underloaded = caseLoadDistributions.value.filter(d => d.isUnderloaded)
    
    for (const from of overloaded) {
      for (const to of underloaded) {
        const fromSupervisor = supervisors.value.find(s => s.id === from.supervisorId)!
        const toSupervisor = supervisors.value.find(s => s.id === to.supervisorId)!
        
        // Check if they have overlapping specializations
        const commonSpecializations = fromSupervisor.specializations.filter(s => 
          toSupervisor.specializations.includes(s)
        )
        
        if (commonSpecializations.length === 0) continue
        
        // Get cases that can be moved
        const movableCases = cases.value.filter(c => 
          c.supervisorId === from.supervisorId &&
          c.status === CaseStatus.ASSIGNED &&
          commonSpecializations.includes(c.caseType)
        )
        
        if (movableCases.length === 0) continue
        
        // Calculate how many cases to move
        const targetUtilization = 70
        const excessCases = Math.ceil((from.utilizationRate - targetUtilization) / 100 * from.maxCapacity)
        const capacityAvailable = Math.floor((targetUtilization - to.utilizationRate) / 100 * to.maxCapacity)
        const casesToMove = Math.min(excessCases, capacityAvailable, movableCases.length, 5)
        
        if (casesToMove > 0) {
          suggestions.push({
            fromSupervisorId: from.supervisorId,
            fromSupervisorName: from.supervisorName,
            toSupervisorId: to.supervisorId,
            toSupervisorName: to.supervisorName,
            casesToMove,
            caseIds: movableCases.slice(0, casesToMove).map(c => c.id),
            reason: `Rebalance workload from ${from.utilizationRate.toFixed(0)}% to ${to.utilizationRate.toFixed(0)}% utilization`,
            expectedImpact: {
              fromUtilization: from.utilizationRate - (casesToMove / from.maxCapacity) * 100,
              toUtilization: to.utilizationRate + (casesToMove / to.maxCapacity) * 100,
            },
          })
        }
      }
    }
    
    return suggestions
  }

  /**
   * Execute workload rebalancing
   * Requirement: ADM-SUP-017
   */
  const executeRebalancing = async (input: WorkloadRebalancingInput) => {
    loading.value = true
    
    try {
      const validated = validateWorkloadRebalancing(input)
      
      // Update cases
      for (const caseId of validated.caseIds) {
        const caseIndex = cases.value.findIndex(c => c.id === caseId)
        if (caseIndex !== -1) {
          cases.value[caseIndex] = {
            ...cases.value[caseIndex],
            supervisorId: validated.toSupervisorId,
            updatedAt: new Date(),
          }
        }
      }
      
      // Recalculate distributions
      await calculateCaseLoadDistributions()
      
      // Log activity
      activityLogs.value.push({
        id: `ACT-${Date.now()}`,
        supervisorId: validated.toSupervisorId,
        activityType: ActivityType.CASE_ASSIGNED,
        timestamp: new Date(),
        description: `${validated.caseIds.length} cases rebalanced from another supervisor`,
        outcome: validated.reason,
        createdAt: new Date(),
      })
      
      return true
    } catch (err) {
      error.value = 'Failed to execute rebalancing'
      throw err
    } finally {
      loading.value = false
    }
  }

  // ============================================================
  // REPORT GENERATION
  // ============================================================

  /**
   * Generate supervisor performance report
   * Requirement: ADM-SUP-018
   */
  const generateReport = async (params: ReportParametersInput): Promise<SupervisorReport> => {
    loading.value = true
    
    try {
      const validated = validateReportParameters(params)
      
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const report: SupervisorReport = {
        id: `REP-${Date.now()}`,
        reportType: validated.reportType,
        title: validated.title || `${validated.reportType} Report`,
        generatedAt: new Date(),
        generatedBy: 'System',
        periodStart: validated.periodStart,
        periodEnd: validated.periodEnd,
        summary: {
          totalSupervisors: validated.supervisorIds.length,
          totalCases: cases.value.filter(c => validated.supervisorIds.includes(c.supervisorId)).length,
          avgResponseTime: dashboardSummary.value.avgResponseTime,
          avgQualityScore: dashboardSummary.value.avgQualityScore,
          avgApprovalRate: performanceMetrics.value
            .filter(m => validated.supervisorIds.includes(m.supervisorId))
            .reduce((sum, m) => sum + m.approvalRate, 0) / validated.supervisorIds.length,
        },
        supervisorDetails: validated.supervisorIds.map(id => {
          const supervisor = supervisors.value.find(s => s.id === id)!
          const metrics = performanceMetrics.value.find(m => m.supervisorId === id)!
          const trends = performanceTrends.value.filter(t => t.supervisorId === id)
          const supervisorAnomalies = anomalies.value.filter(a => a.supervisorId === id)
          
          return {
            supervisorId: id,
            supervisorName: `${supervisor.firstName} ${supervisor.lastName}`,
            metrics,
            trends,
            anomalies: supervisorAnomalies,
            strengths: [
              metrics.qualityScore > 85 ? 'High quality performance' : '',
              metrics.avgResponseTime < 150 ? 'Fast response times' : '',
              metrics.approvalRate > 80 ? 'Strong approval rate' : '',
            ].filter(Boolean),
            areasForImprovement: [
              metrics.overdueCases > 0 ? 'Reduce overdue cases' : '',
              metrics.qualityScore < 80 ? 'Improve quality score' : '',
              metrics.avgResponseTime > 180 ? 'Reduce response time' : '',
            ].filter(Boolean),
          }
        }),
        recommendations: [
          'Continue monitoring quality metrics',
          'Address overdue cases promptly',
          'Consider workload rebalancing for overloaded supervisors',
          'Provide targeted training based on quality score components',
        ],
        actionItems: [
          {
            priority: 'HIGH',
            action: 'Review all overdue cases and prioritize completion',
            assignedTo: 'Supervisor Manager',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        ],
        fileUrl: `/api/reports/${Date.now()}.pdf`,
      }
      
      return report
    } catch (err) {
      error.value = 'Failed to generate report'
      throw err
    } finally {
      loading.value = false
    }
  }

  // ============================================================
  // CRUD OPERATIONS
  // ============================================================

  /**
   * Create new supervisor
   */
  const createSupervisor = async (input: SupervisorInput) => {
    loading.value = true
    
    try {
      const validated = validateSupervisor(input)
      
      const newSupervisor: Supervisor = {
        id: `SUP-${String(supervisors.value.length + 1).padStart(3, '0')}`,
        ...validated,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      
      supervisors.value.push(newSupervisor)
      
      return newSupervisor
    } catch (err) {
      error.value = 'Failed to create supervisor'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Update supervisor
   */
  const updateSupervisor = async (id: string, input: Partial<SupervisorInput>) => {
    loading.value = true
    
    try {
      const index = supervisors.value.findIndex(s => s.id === id)
      if (index === -1) throw new Error('Supervisor not found')
      
      supervisors.value[index] = {
        ...supervisors.value[index],
        ...input,
        updatedAt: new Date(),
      }
      
      return supervisors.value[index]
    } catch (err) {
      error.value = 'Failed to update supervisor'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Create performance target
   * Requirement: ADM-SUP-019
   */
  const createPerformanceTarget = async (input: PerformanceTargetInput) => {
    loading.value = true
    
    try {
      const validated = validatePerformanceTarget(input)
      
      const newTarget: PerformanceTarget = {
        id: `TGT-${String(targets.value.length + 1).padStart(3, '0')}`,
        ...validated,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      
      targets.value.push(newTarget)
      
      return newTarget
    } catch (err) {
      error.value = 'Failed to create performance target'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Create alert configuration
   * Requirement: ADM-SUP-020
   */
  const createAlertConfiguration = async (input: AlertConfigurationInput) => {
    loading.value = true
    
    try {
      const validated = validateAlertConfiguration(input)
      
      const newAlert: AlertConfiguration = {
        id: `ALRT-${String(alertConfigurations.value.length + 1).padStart(3, '0')}`,
        ...validated,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      
      alertConfigurations.value.push(newAlert)
      
      return newAlert
    } catch (err) {
      error.value = 'Failed to create alert configuration'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Make decision on case
   */
  const makeDecision = async (input: DecisionInput) => {
    loading.value = true
    
    try {
      const validated = validateDecision(input)
      
      const caseItem = cases.value.find(c => c.id === validated.caseId)
      if (!caseItem) throw new Error('Case not found')
      
      const decision: SupervisorDecision = {
        id: `DEC-${String(decisions.value.length + 1).padStart(3, '0')}`,
        supervisorId: caseItem.supervisorId,
        caseId: validated.caseId,
        caseNumber: caseItem.caseNumber,
        entityName: caseItem.entityName,
        decisionType: validated.decisionType,
        decisionDate: new Date(),
        responseTime: (Date.now() - caseItem.assignedDate.getTime()) / (1000 * 60 * 60),
        notes: validated.notes,
        attachments: validated.attachments,
        createdAt: new Date(),
      }
      
      decisions.value.push(decision)
      
      // Update case
      const caseIndex = cases.value.findIndex(c => c.id === validated.caseId)
      cases.value[caseIndex] = {
        ...cases.value[caseIndex],
        status: validated.decisionType === DecisionType.APPROVE ? CaseStatus.APPROVED : 
                validated.decisionType === DecisionType.REJECT ? CaseStatus.REJECTED :
                validated.decisionType === DecisionType.DEFER ? CaseStatus.DEFERRED :
                validated.decisionType === DecisionType.ESCALATE ? CaseStatus.ESCALATED :
                CaseStatus.CLOSED,
        decisionType: validated.decisionType,
        decisionDate: new Date(),
        decisionNotes: validated.notes,
        completedDate: new Date(),
        updatedAt: new Date(),
      }
      
      return decision
    } catch (err) {
      error.value = 'Failed to make decision'
      throw err
    } finally {
      loading.value = false
    }
  }

  // ============================================================
  // UTILITY METHODS
  // ============================================================

  /**
   * Select supervisor
   */
  const selectSupervisor = (id: string) => {
    selectedSupervisor.value = supervisors.value.find(s => s.id === id) || null
  }

  /**
   * Clear selected supervisor
   */
  const clearSelectedSupervisor = () => {
    selectedSupervisor.value = null
  }

  /**
   * Update filters
   */
  const updateFilters = (newFilters: Partial<SupervisorFilters>) => {
    filters.value = { ...filters.value, ...newFilters }
    pagination.value.page = 1 // Reset to first page
  }

  /**
   * Clear filters
   */
  const clearFilters = () => {
    filters.value = {}
    pagination.value.page = 1
  }

  /**
   * Update pagination
   */
  const updatePagination = (newPagination: Partial<PaginationParams>) => {
    pagination.value = { ...pagination.value, ...newPagination }
  }

  /**
   * Get supervisor by ID
   */
  const getSupervisorById = (id: string) => {
    return supervisors.value.find(s => s.id === id)
  }

  /**
   * Get cases for supervisor
   */
  const getCasesBySupervisor = (supervisorId: string) => {
    return cases.value.filter(c => c.supervisorId === supervisorId)
  }

  /**
   * Get decisions for supervisor
   */
  const getDecisionsBySupervisor = (supervisorId: string) => {
    return decisions.value.filter(d => d.supervisorId === supervisorId)
  }

  /**
   * Get activity logs for supervisor
   */
  const getActivityLogsBySupervisor = (supervisorId: string) => {
    return activityLogs.value.filter(a => a.supervisorId === supervisorId)
  }

  /**
   * Get anomalies for supervisor
   */
  const getAnomaliesBySupervisor = (supervisorId: string) => {
    return anomalies.value.filter(a => a.supervisorId === supervisorId)
  }

  /**
   * Get performance trends for supervisor
   */
  const getTrendsBySupervisor = (supervisorId: string) => {
    return performanceTrends.value.filter(t => t.supervisorId === supervisorId)
  }

  /**
   * Resolve anomaly
   */
  const resolveAnomaly = async (anomalyId: string, resolvedBy: string, notes: string) => {
    loading.value = true
    
    try {
      const index = anomalies.value.findIndex(a => a.id === anomalyId)
      if (index === -1) throw new Error('Anomaly not found')
      
      anomalies.value[index] = {
        ...anomalies.value[index],
        isResolved: true,
        resolvedAt: new Date(),
        resolvedBy,
      }
      
      return anomalies.value[index]
    } catch (err) {
      error.value = 'Failed to resolve anomaly'
      throw err
    } finally {
      loading.value = false
    }
  }

  // ============================================================
  // RETURN PUBLIC API
  // ============================================================

  return {
    // State (readonly)
    supervisors: readonly(supervisors),
    cases: readonly(cases),
    performanceMetrics: readonly(performanceMetrics),
    decisions: readonly(decisions),
    activityLogs: readonly(activityLogs),
    anomalies: readonly(anomalies),
    targets: readonly(targets),
    alertConfigurations: readonly(alertConfigurations),
    caseLoadDistributions: readonly(caseLoadDistributions),
    performanceTrends: readonly(performanceTrends),
    qualityScoreBreakdowns: readonly(qualityScoreBreakdowns),
    riskAccuracy: readonly(riskAccuracy),
    caseTypeBreakdowns: readonly(caseTypeBreakdowns),
    
    selectedSupervisor: readonly(selectedSupervisor),
    selectedCase: readonly(selectedCase),
    selectedAnomaly: readonly(selectedAnomaly),
    
    filters: readonly(filters),
    pagination: readonly(pagination),
    loading: readonly(loading),
    error: readonly(error),
    dateRange: readonly(dateRange),
    
    // Computed
    dashboardSummary,
    filteredSupervisors,
    paginatedSupervisors,
    totalPages,
    activeAnomaliesCount,
    criticalAnomalies,
    overloadedSupervisors,
    underloadedSupervisors,
    supervisorCards,
    
    // Methods
    loadSupervisorData,
    loadPerformanceMetrics,
    calculateQualityScore,
    calculateAllQualityScores,
    detectAnomalies,
    detectAllAnomalies,
    calculateCaseLoadDistributions,
    generateRebalancingSuggestions,
    executeRebalancing,
    generateReport,
    createSupervisor,
    updateSupervisor,
    createPerformanceTarget,
    createAlertConfiguration,
    makeDecision,
    selectSupervisor,
    clearSelectedSupervisor,
    updateFilters,
    clearFilters,
    updatePagination,
    getSupervisorById,
    getCasesBySupervisor,
    getDecisionsBySupervisor,
    getActivityLogsBySupervisor,
    getAnomaliesBySupervisor,
    getTrendsBySupervisor,
    resolveAnomaly,
  }
}
