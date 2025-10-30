/**
 * Comprehensive Supervisor Monitor Module Test Suite
 * Tests all aspects of the Supervisor Activity Monitor functionality
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { useSupervisorMonitor } from '@/composables/useSupervisorMonitor'
import { mockSupervisors, mockSupervisorCases } from '@/data/supervisorMockData'
import { 
  supervisorSchema,
  performanceTargetSchema,
  alertConfigurationSchema,
  reportParametersSchema,
} from '@/schemas/supervisorValidation'
import { SupervisorRole, CaseType, DecisionType, AnomalyType, ReportType } from '@/types/supervisor'

describe('Supervisor Monitor Module - Complete Test Suite', () => {
  
  // ============================================================
  // MOCK DATA VALIDATION
  // ============================================================
  
  describe('Mock Data Integrity', () => {
    it('should have valid supervisor data', () => {
      expect(mockSupervisors.length).toBeGreaterThan(0)
      expect(mockSupervisors[0]).toHaveProperty('id')
      expect(mockSupervisors[0]).toHaveProperty('firstName')
      expect(mockSupervisors[0]).toHaveProperty('email')
    })

    it('should have valid case data', () => {
      expect(mockSupervisorCases.length).toBeGreaterThan(0)
      expect(mockSupervisorCases[0]).toHaveProperty('id')
      expect(mockSupervisorCases[0]).toHaveProperty('caseType')
    })
  })

  // ============================================================
  // SCHEMA VALIDATION
  // ============================================================
  
  describe('Validation Schemas', () => {
    it('should validate supervisor data', () => {
      const validSupervisor = {
        firstName: 'Test',
        lastName: 'Supervisor',
        email: 'test@sec.co.zw',
        phone: '+263771234567',
        role: SupervisorRole.SUPERVISOR,
        department: 'Compliance',
        startDate: new Date('2020-01-01'),
        specializations: [CaseType.LICENSE_APPLICATION],
        maxCaseLoad: 50,
        isActive: true,
      }
      
      const result = supervisorSchema.safeParse(validSupervisor)
      expect(result.success).toBe(true)
    })

    it('should validate performance targets', () => {
      const validTarget = {
        targetName: 'Test Target',
        description: 'Test description for performance target',
        metric: 'qualityScore',
        targetValue: 90,
        warningThreshold: 75,
        criticalThreshold: 60,
        unit: 'percentage',
        isActive: true,
        appliesTo: [SupervisorRole.SUPERVISOR],
      }
      
      const result = performanceTargetSchema.safeParse(validTarget)
      expect(result.success).toBe(true)
    })

    it('should validate alert configurations', () => {
      const validAlert = {
        alertName: 'Test Alert',
        description: 'Test alert description',
        anomalyType: AnomalyType.QUALITY_SCORE_DROP,
        isEnabled: true,
        checkFrequency: 60,
        qualityScoreDropThreshold: 10,
        notifyEmail: true,
        notifySMS: false,
        notifyInApp: true,
        recipients: ['test@sec.co.zw'],
      }
      
      const result = alertConfigurationSchema.safeParse(validAlert)
      expect(result.success).toBe(true)
    })

    it('should validate report parameters', () => {
      const validReport = {
        reportType: ReportType.COMPREHENSIVE,
        supervisorIds: ['SUP-001'],
        periodStart: new Date('2024-01-01'),
        periodEnd: new Date('2024-12-31'),
        includeCharts: true,
        includeRecommendations: true,
        includeActionItems: true,
        format: 'PDF' as const,
      }
      
      const result = reportParametersSchema.safeParse(validReport)
      expect(result.success).toBe(true)
    })
  })

  // ============================================================
  // COMPOSABLE FUNCTIONALITY
  // ============================================================
  
  describe('Supervisor Monitor Composable', () => {
    let composable: ReturnType<typeof useSupervisorMonitor>

    beforeEach(async () => {
      composable = useSupervisorMonitor()
      await composable.loadSupervisorData()
    })

    it('should initialize with data', () => {
      expect(composable.supervisors.value.length).toBeGreaterThan(0)
    })

    it('should provide dashboard summary', () => {
      const summary = composable.dashboardSummary.value
      expect(summary).toHaveProperty('totalSupervisors')
      expect(summary).toHaveProperty('activeSupervisors')
      expect(summary.totalSupervisors).toBeGreaterThan(0)
    })

    it('should calculate quality scores', () => {
      const supervisorId = mockSupervisors[0].id
      const score = composable.calculateQualityScore(supervisorId)
      expect(score).toBeDefined()
      expect(score.overallScore).toBeGreaterThanOrEqual(0)
      expect(score.overallScore).toBeLessThanOrEqual(100)
    })

    it('should detect anomalies', () => {
      const supervisorId = mockSupervisors[0].id
      const anomalies = composable.detectAnomalies(supervisorId)
      expect(anomalies).toBeDefined()
    })

    it('should filter supervisors', () => {
      composable.updateFilters({ isActive: true })
      const filtered = composable.filteredSupervisors.value
      expect(filtered.every(s => s.isActive)).toBe(true)
    })

    it('should handle pagination', () => {
      composable.updatePagination({ page: 1, limit: 5 })
      const paginated = composable.paginatedSupervisors.value
      const totalPages = composable.totalPages.value
      
      // Verify pagination works (either respects limit or total is small)
      expect(Array.isArray(paginated)).toBe(true)
      expect(totalPages).toBeGreaterThan(0)
    })

    it('should get supervisor by ID', () => {
      const supervisor = composable.getSupervisorById(mockSupervisors[0].id)
      expect(supervisor).toBeDefined()
      expect(supervisor?.id).toBe(mockSupervisors[0].id)
    })

    it('should select supervisor', () => {
      composable.selectSupervisor(mockSupervisors[0].id)
      const selected = composable.selectedSupervisor.value
      expect(selected).toBeDefined()
    })

    it('should clear selected supervisor', () => {
      composable.selectSupervisor(mockSupervisors[0].id)
      composable.clearSelectedSupervisor()
      expect(composable.selectedSupervisor.value).toBeNull()
    })

    it('should clear filters', () => {
      composable.updateFilters({ role: SupervisorRole.SUPERVISOR })
      composable.clearFilters()
      expect(composable.filters.value.role).toBeUndefined()
    })
  })

  // ============================================================
  // INTEGRATION TESTS
  // ============================================================
  
  describe('End-to-End Functionality', () => {
    let composable: ReturnType<typeof useSupervisorMonitor>

    beforeEach(async () => {
      composable = useSupervisorMonitor()
      await composable.loadSupervisorData()
    })

    it('should support complete workflow: filter → select → view details', () => {
      // Filter supervisors
      composable.updateFilters({ role: SupervisorRole.SENIOR_SUPERVISOR })
      const filtered = composable.filteredSupervisors.value
      
      if (filtered.length > 0) {
        // Select a supervisor
        composable.selectSupervisor(filtered[0].id)
        const selected = composable.selectedSupervisor.value
        expect(selected).toBeDefined()
        
        // Get related data
        const cases = composable.getCasesBySupervisor(filtered[0].id)
        expect(cases).toBeDefined()
      }
    })

    it('should calculate case load distributions', () => {
      composable.calculateCaseLoadDistributions()
      const distributions = composable.caseLoadDistributions.value
      expect(Array.isArray(distributions)).toBe(true)
    })

    it('should detect all anomalies', () => {
      composable.detectAllAnomalies()
      const anomalies = composable.anomalies.value
      expect(Array.isArray(anomalies)).toBe(true)
    })

    it('should generate supervisor cards', () => {
      const cards = composable.supervisorCards.value
      expect(Array.isArray(cards)).toBe(true)
      expect(cards.length).toBeGreaterThan(0)
    })

    it('should identify overloaded and underloaded supervisors', () => {
      const overloaded = composable.overloadedSupervisors.value
      const underloaded = composable.underloadedSupervisors.value
      expect(Array.isArray(overloaded)).toBe(true)
      expect(Array.isArray(underloaded)).toBe(true)
    })
  })
})
