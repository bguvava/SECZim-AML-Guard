/**
 * Supervisor Activity Monitor Mock Data
 * 
 * @module data/supervisorMockData
 * @description Realistic mock data for supervisor monitoring with Zimbabwe financial sector context
 * 
 * Requirements Coverage:
 * - ADM-SUP-001 to ADM-SUP-020: Complete mock dataset for all supervisor monitoring features
 * 
 * @author bguvava
 * @since 2025-01-30
 */

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
} from '@/types/supervisor'

import {
  SupervisorRole,
  CaseStatus,
  CaseType,
  DecisionType,
  CasePriority,
  ActivityType,
  AnomalyType,
  AlertSeverity,
} from '@/types/supervisor'

// ============================================================
// SUPERVISORS
// ============================================================

export const mockSupervisors: Supervisor[] = [
  {
    id: 'SUP-001',
    firstName: 'Tendai',
    lastName: 'Moyo',
    email: 'tendai.moyo@seczim.gov.zw',
    phone: '+263 772 123 4567',
    role: SupervisorRole.SENIOR_SUPERVISOR,
    department: 'AML Compliance & Enforcement',
    startDate: new Date('2020-03-15'),
    photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tendai',
    isActive: true,
    specializations: [CaseType.STR_REVIEW, CaseType.COMPLIANCE_ASSESSMENT, CaseType.ENFORCEMENT_ACTION],
    maxCaseLoad: 25,
    createdAt: new Date('2020-03-15'),
    updatedAt: new Date('2025-01-28'),
  },
  {
    id: 'SUP-002',
    firstName: 'Rumbidzai',
    lastName: 'Ncube',
    email: 'rumbidzai.ncube@seczim.gov.zw',
    phone: '+263 772 234 5678',
    role: SupervisorRole.SENIOR_SUPERVISOR,
    department: 'Licensing & Authorization',
    startDate: new Date('2019-07-01'),
    photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rumbidzai',
    isActive: true,
    specializations: [CaseType.LICENSE_APPLICATION, CaseType.LICENSE_RENEWAL, CaseType.RISK_ASSESSMENT],
    maxCaseLoad: 30,
    createdAt: new Date('2019-07-01'),
    updatedAt: new Date('2025-01-29'),
  },
  {
    id: 'SUP-003',
    firstName: 'Kudakwashe',
    lastName: 'Mlambo',
    email: 'kudakwashe.mlambo@seczim.gov.zw',
    phone: '+263 772 345 6789',
    role: SupervisorRole.SUPERVISOR,
    department: 'Onsite Inspections',
    startDate: new Date('2021-01-10'),
    photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kudakwashe',
    isActive: true,
    specializations: [CaseType.ONSITE_INSPECTION, CaseType.DESK_REVIEW],
    maxCaseLoad: 20,
    createdAt: new Date('2021-01-10'),
    updatedAt: new Date('2025-01-27'),
  },
  {
    id: 'SUP-004',
    firstName: 'Tariro',
    lastName: 'Sibanda',
    email: 'tariro.sibanda@seczim.gov.zw',
    phone: '+263 772 456 7890',
    role: SupervisorRole.SUPERVISOR,
    department: 'Complaints & Investigations',
    startDate: new Date('2021-06-20'),
    photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tariro',
    isActive: true,
    specializations: [CaseType.COMPLAINT_INVESTIGATION, CaseType.DESK_REVIEW],
    maxCaseLoad: 18,
    createdAt: new Date('2021-06-20'),
    updatedAt: new Date('2025-01-30'),
  },
  {
    id: 'SUP-005',
    firstName: 'Chipo',
    lastName: 'Dube',
    email: 'chipo.dube@seczim.gov.zw',
    phone: '+263 772 567 8901',
    role: SupervisorRole.JUNIOR_SUPERVISOR,
    department: 'AML Compliance & Enforcement',
    startDate: new Date('2022-09-05'),
    photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chipo',
    isActive: true,
    specializations: [CaseType.DESK_REVIEW, CaseType.COMPLIANCE_ASSESSMENT],
    maxCaseLoad: 15,
    createdAt: new Date('2022-09-05'),
    updatedAt: new Date('2025-01-29'),
  },
  {
    id: 'SUP-006',
    firstName: 'Farai',
    lastName: 'Chidzonga',
    email: 'farai.chidzonga@seczim.gov.zw',
    phone: '+263 772 678 9012',
    role: SupervisorRole.TEAM_LEAD,
    department: 'Risk Assessment Unit',
    startDate: new Date('2020-11-12'),
    photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Farai',
    isActive: true,
    specializations: [CaseType.RISK_ASSESSMENT, CaseType.COMPLIANCE_ASSESSMENT, CaseType.STR_REVIEW],
    maxCaseLoad: 22,
    createdAt: new Date('2020-11-12'),
    updatedAt: new Date('2025-01-28'),
  },
  {
    id: 'SUP-007',
    firstName: 'Rutendo',
    lastName: 'Gumbo',
    email: 'rutendo.gumbo@seczim.gov.zw',
    phone: '+263 772 789 0123',
    role: SupervisorRole.SUPERVISOR,
    department: 'Licensing & Authorization',
    startDate: new Date('2021-04-18'),
    photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rutendo',
    isActive: true,
    specializations: [CaseType.LICENSE_APPLICATION, CaseType.LICENSE_RENEWAL],
    maxCaseLoad: 20,
    createdAt: new Date('2021-04-18'),
    updatedAt: new Date('2025-01-30'),
  },
  {
    id: 'SUP-008',
    firstName: 'Tinashe',
    lastName: 'Khumalo',
    email: 'tinashe.khumalo@seczim.gov.zw',
    phone: '+263 772 890 1234',
    role: SupervisorRole.JUNIOR_SUPERVISOR,
    department: 'Onsite Inspections',
    startDate: new Date('2023-02-01'),
    photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tinashe',
    isActive: true,
    specializations: [CaseType.ONSITE_INSPECTION],
    maxCaseLoad: 12,
    createdAt: new Date('2023-02-01'),
    updatedAt: new Date('2025-01-27'),
  },
]

// ============================================================
// SUPERVISOR CASES
// ============================================================

const generateCaseNumber = (index: number, caseType: CaseType): string => {
  const year = 2025
  const typeCode = caseType.substring(0, 3).toUpperCase()
  return `SEC-${year}-${typeCode}-${String(index).padStart(4, '0')}`
}

export const mockSupervisorCases: SupervisorCase[] = [
  // SUP-001: Tendai Moyo cases
  {
    id: 'CASE-001',
    caseNumber: generateCaseNumber(1, CaseType.STR_REVIEW),
    supervisorId: 'SUP-001',
    entityId: 'ENT-BNK-001',
    entityName: 'CBZ Bank Limited',
    caseType: CaseType.STR_REVIEW,
    status: CaseStatus.IN_REVIEW,
    priority: CasePriority.CRITICAL,
    assignedDate: new Date('2025-01-25'),
    dueDate: new Date('2025-02-01'),
    responseTime: 72,
    riskRating: 9,
    isOverdue: false,
    createdAt: new Date('2025-01-25'),
    updatedAt: new Date('2025-01-29'),
  },
  {
    id: 'CASE-002',
    caseNumber: generateCaseNumber(2, CaseType.COMPLIANCE_ASSESSMENT),
    supervisorId: 'SUP-001',
    entityId: 'ENT-MFI-012',
    entityName: 'Steward Microfinance',
    caseType: CaseType.COMPLIANCE_ASSESSMENT,
    status: CaseStatus.APPROVED,
    priority: CasePriority.HIGH,
    assignedDate: new Date('2025-01-15'),
    dueDate: new Date('2025-01-25'),
    completedDate: new Date('2025-01-23'),
    responseTime: 192,
    decisionType: DecisionType.APPROVE,
    decisionDate: new Date('2025-01-23'),
    decisionNotes: 'Entity demonstrates strong AML controls and compliance culture.',
    riskRating: 4,
    isOverdue: false,
    createdAt: new Date('2025-01-15'),
    updatedAt: new Date('2025-01-23'),
  },
  {
    id: 'CASE-003',
    caseNumber: generateCaseNumber(3, CaseType.ENFORCEMENT_ACTION),
    supervisorId: 'SUP-001',
    entityId: 'ENT-BRK-008',
    entityName: 'Zimbabwe Investment Brokers',
    caseType: CaseType.ENFORCEMENT_ACTION,
    status: CaseStatus.ESCALATED,
    priority: CasePriority.CRITICAL,
    assignedDate: new Date('2025-01-10'),
    dueDate: new Date('2025-01-20'),
    decisionType: DecisionType.ESCALATE,
    decisionDate: new Date('2025-01-19'),
    decisionNotes: 'Multiple compliance breaches identified. Escalating to Director for penalty determination.',
    riskRating: 10,
    isOverdue: true,
    createdAt: new Date('2025-01-10'),
    updatedAt: new Date('2025-01-19'),
  },
  
  // SUP-002: Rumbidzai Ncube cases
  {
    id: 'CASE-004',
    caseNumber: generateCaseNumber(4, CaseType.LICENSE_APPLICATION),
    supervisorId: 'SUP-002',
    entityId: 'ENT-NEW-001',
    entityName: 'Zimbabwe Fintech Solutions (Pvt) Ltd',
    caseType: CaseType.LICENSE_APPLICATION,
    status: CaseStatus.PENDING_DECISION,
    priority: CasePriority.HIGH,
    assignedDate: new Date('2025-01-20'),
    dueDate: new Date('2025-02-05'),
    responseTime: 120,
    riskRating: 5,
    isOverdue: false,
    createdAt: new Date('2025-01-20'),
    updatedAt: new Date('2025-01-28'),
  },
  {
    id: 'CASE-005',
    caseNumber: generateCaseNumber(5, CaseType.LICENSE_RENEWAL),
    supervisorId: 'SUP-002',
    entityId: 'ENT-INS-004',
    entityName: 'Zimnat Life Assurance',
    caseType: CaseType.LICENSE_RENEWAL,
    status: CaseStatus.APPROVED,
    priority: CasePriority.MEDIUM,
    assignedDate: new Date('2025-01-08'),
    dueDate: new Date('2025-01-22'),
    completedDate: new Date('2025-01-20'),
    responseTime: 288,
    decisionType: DecisionType.APPROVE,
    decisionDate: new Date('2025-01-20'),
    decisionNotes: 'All renewal requirements met. License renewed for 12 months.',
    riskRating: 3,
    isOverdue: false,
    createdAt: new Date('2025-01-08'),
    updatedAt: new Date('2025-01-20'),
  },
  {
    id: 'CASE-006',
    caseNumber: generateCaseNumber(6, CaseType.RISK_ASSESSMENT),
    supervisorId: 'SUP-002',
    entityId: 'ENT-BNK-005',
    entityName: 'Stanbic Bank Zimbabwe',
    caseType: CaseType.RISK_ASSESSMENT,
    status: CaseStatus.IN_REVIEW,
    priority: CasePriority.MEDIUM,
    assignedDate: new Date('2025-01-23'),
    dueDate: new Date('2025-02-06'),
    responseTime: 96,
    riskRating: 4,
    isOverdue: false,
    createdAt: new Date('2025-01-23'),
    updatedAt: new Date('2025-01-29'),
  },
  
  // SUP-003: Kudakwashe Mlambo cases
  {
    id: 'CASE-007',
    caseNumber: generateCaseNumber(7, CaseType.ONSITE_INSPECTION),
    supervisorId: 'SUP-003',
    entityId: 'ENT-BNK-002',
    entityName: 'FBC Bank Limited',
    caseType: CaseType.ONSITE_INSPECTION,
    status: CaseStatus.ASSIGNED,
    priority: CasePriority.HIGH,
    assignedDate: new Date('2025-01-27'),
    dueDate: new Date('2025-02-10'),
    riskRating: 6,
    isOverdue: false,
    createdAt: new Date('2025-01-27'),
    updatedAt: new Date('2025-01-27'),
  },
  {
    id: 'CASE-008',
    caseNumber: generateCaseNumber(8, CaseType.DESK_REVIEW),
    supervisorId: 'SUP-003',
    entityId: 'ENT-MFI-008',
    entityName: 'GetBucks Microfinance',
    caseType: CaseType.DESK_REVIEW,
    status: CaseStatus.APPROVED,
    priority: CasePriority.LOW,
    assignedDate: new Date('2025-01-12'),
    dueDate: new Date('2025-01-26'),
    completedDate: new Date('2025-01-24'),
    responseTime: 288,
    decisionType: DecisionType.APPROVE,
    decisionDate: new Date('2025-01-24'),
    decisionNotes: 'Desk review satisfactory. No further action required at this time.',
    riskRating: 3,
    isOverdue: false,
    createdAt: new Date('2025-01-12'),
    updatedAt: new Date('2025-01-24'),
  },
  
  // SUP-004: Tariro Sibanda cases
  {
    id: 'CASE-009',
    caseNumber: generateCaseNumber(9, CaseType.COMPLAINT_INVESTIGATION),
    supervisorId: 'SUP-004',
    entityId: 'ENT-BRK-003',
    entityName: 'Morgan & Co Stockbrokers',
    caseType: CaseType.COMPLAINT_INVESTIGATION,
    status: CaseStatus.IN_REVIEW,
    priority: CasePriority.HIGH,
    assignedDate: new Date('2025-01-18'),
    dueDate: new Date('2025-02-01'),
    responseTime: 240,
    riskRating: 7,
    isOverdue: false,
    createdAt: new Date('2025-01-18'),
    updatedAt: new Date('2025-01-28'),
  },
  {
    id: 'CASE-010',
    caseNumber: generateCaseNumber(10, CaseType.COMPLAINT_INVESTIGATION),
    supervisorId: 'SUP-004',
    entityId: 'ENT-INS-007',
    entityName: 'First Mutual Life',
    caseType: CaseType.COMPLAINT_INVESTIGATION,
    status: CaseStatus.DEFERRED,
    priority: CasePriority.MEDIUM,
    assignedDate: new Date('2025-01-05'),
    dueDate: new Date('2025-01-19'),
    decisionType: DecisionType.DEFER,
    decisionDate: new Date('2025-01-18'),
    decisionNotes: 'Awaiting additional documentation from complainant. Case deferred for 14 days.',
    riskRating: 5,
    isOverdue: false,
    createdAt: new Date('2025-01-05'),
    updatedAt: new Date('2025-01-18'),
  },
  
  // Additional cases to reach 50+ total
  ...Array.from({ length: 40 }, (_, i) => {
    const caseIndex = 11 + i
    const supervisorIndex = i % 8
    const supervisorId = `SUP-${String(supervisorIndex + 1).padStart(3, '0')}`
    const caseTypes = Object.values(CaseType)
    const statuses = Object.values(CaseStatus)
    const priorities = Object.values(CasePriority)
    
    const caseType = caseTypes[i % caseTypes.length]
    const status = statuses[i % statuses.length]
    const priority = priorities[i % priorities.length]
    
    const assignedDate = new Date()
    assignedDate.setDate(assignedDate.getDate() - (i + 1) * 2)
    
    const dueDate = new Date(assignedDate)
    dueDate.setDate(dueDate.getDate() + 14)
    
    const isCompleted = [CaseStatus.APPROVED, CaseStatus.REJECTED, CaseStatus.CLOSED].includes(status)
    
    return {
      id: `CASE-${String(caseIndex).padStart(3, '0')}`,
      caseNumber: generateCaseNumber(caseIndex, caseType),
      supervisorId,
      entityId: `ENT-${String(i + 1).padStart(3, '0')}`,
      entityName: `Entity ${i + 1}`,
      caseType,
      status,
      priority,
      assignedDate,
      dueDate,
      completedDate: isCompleted ? new Date(assignedDate.getTime() + (10 + i % 5) * 24 * 60 * 60 * 1000) : undefined,
      responseTime: isCompleted ? (10 + i % 10) * 24 : (i % 5) * 24,
      decisionType: isCompleted ? [DecisionType.APPROVE, DecisionType.REJECT, DecisionType.DEFER][i % 3] : undefined,
      decisionDate: isCompleted ? new Date(assignedDate.getTime() + (10 + i % 5) * 24 * 60 * 60 * 1000) : undefined,
      decisionNotes: isCompleted ? `Decision made for case ${caseIndex}` : undefined,
      riskRating: (i % 10) + 1,
      isOverdue: !isCompleted && new Date() > dueDate,
      createdAt: assignedDate,
      updatedAt: new Date(),
    } as SupervisorCase
  }),
]

// ============================================================
// PERFORMANCE METRICS
// ============================================================

export const mockPerformanceMetrics: PerformanceMetrics[] = [
  {
    supervisorId: 'SUP-001',
    periodStart: new Date('2025-01-01'),
    periodEnd: new Date('2025-01-31'),
    totalCases: 23,
    pendingCases: 3,
    completedCases: 18,
    overdueCases: 1,
    approvedCount: 14,
    rejectedCount: 3,
    deferredCount: 1,
    escalatedCount: 2,
    approvalRate: 77.78,
    avgResponseTime: 156,
    avgCaseCompletionTime: 264,
    fastestResponseTime: 48,
    slowestResponseTime: 336,
    qualityScore: 88,
    decisionConsistencyScore: 92,
    accuracyScore: 85,
    scheduledInspections: 5,
    completedInspections: 4,
    inspectionCompletionRate: 80,
    avgEntityFeedbackScore: 4.2,
    totalFeedbackResponses: 12,
    calculatedAt: new Date('2025-01-30'),
  },
  {
    supervisorId: 'SUP-002',
    periodStart: new Date('2025-01-01'),
    periodEnd: new Date('2025-01-31'),
    totalCases: 28,
    pendingCases: 2,
    completedCases: 24,
    overdueCases: 0,
    approvedCount: 20,
    rejectedCount: 2,
    deferredCount: 2,
    escalatedCount: 1,
    approvalRate: 83.33,
    avgResponseTime: 132,
    avgCaseCompletionTime: 240,
    fastestResponseTime: 72,
    slowestResponseTime: 288,
    qualityScore: 92,
    decisionConsistencyScore: 90,
    accuracyScore: 94,
    scheduledInspections: 3,
    completedInspections: 3,
    inspectionCompletionRate: 100,
    avgEntityFeedbackScore: 4.5,
    totalFeedbackResponses: 18,
    calculatedAt: new Date('2025-01-30'),
  },
  {
    supervisorId: 'SUP-003',
    periodStart: new Date('2025-01-01'),
    periodEnd: new Date('2025-01-31'),
    totalCases: 18,
    pendingCases: 4,
    completedCases: 13,
    overdueCases: 2,
    approvedCount: 10,
    rejectedCount: 2,
    deferredCount: 1,
    escalatedCount: 1,
    approvalRate: 76.92,
    avgResponseTime: 198,
    avgCaseCompletionTime: 312,
    fastestResponseTime: 96,
    slowestResponseTime: 432,
    qualityScore: 79,
    decisionConsistencyScore: 82,
    accuracyScore: 76,
    scheduledInspections: 8,
    completedInspections: 6,
    inspectionCompletionRate: 75,
    avgEntityFeedbackScore: 3.9,
    totalFeedbackResponses: 10,
    calculatedAt: new Date('2025-01-30'),
  },
  {
    supervisorId: 'SUP-004',
    periodStart: new Date('2025-01-01'),
    periodEnd: new Date('2025-01-31'),
    totalCases: 16,
    pendingCases: 3,
    completedCases: 12,
    overdueCases: 1,
    approvedCount: 8,
    rejectedCount: 3,
    deferredCount: 1,
    escalatedCount: 1,
    approvalRate: 66.67,
    avgResponseTime: 180,
    avgCaseCompletionTime: 288,
    fastestResponseTime: 120,
    slowestResponseTime: 360,
    qualityScore: 83,
    decisionConsistencyScore: 85,
    accuracyScore: 81,
    scheduledInspections: 2,
    completedInspections: 2,
    inspectionCompletionRate: 100,
    avgEntityFeedbackScore: 4.1,
    totalFeedbackResponses: 8,
    calculatedAt: new Date('2025-01-30'),
  },
  {
    supervisorId: 'SUP-005',
    periodStart: new Date('2025-01-01'),
    periodEnd: new Date('2025-01-31'),
    totalCases: 12,
    pendingCases: 2,
    completedCases: 9,
    overdueCases: 0,
    approvedCount: 7,
    rejectedCount: 1,
    deferredCount: 1,
    escalatedCount: 1,
    approvalRate: 77.78,
    avgResponseTime: 144,
    avgCaseCompletionTime: 216,
    fastestResponseTime: 72,
    slowestResponseTime: 240,
    qualityScore: 86,
    decisionConsistencyScore: 88,
    accuracyScore: 84,
    scheduledInspections: 4,
    completedInspections: 4,
    inspectionCompletionRate: 100,
    avgEntityFeedbackScore: 4.3,
    totalFeedbackResponses: 6,
    calculatedAt: new Date('2025-01-30'),
  },
  {
    supervisorId: 'SUP-006',
    periodStart: new Date('2025-01-01'),
    periodEnd: new Date('2025-01-31'),
    totalCases: 20,
    pendingCases: 2,
    completedCases: 17,
    overdueCases: 0,
    approvedCount: 14,
    rejectedCount: 2,
    deferredCount: 1,
    escalatedCount: 1,
    approvalRate: 82.35,
    avgResponseTime: 120,
    avgCaseCompletionTime: 192,
    fastestResponseTime: 48,
    slowestResponseTime: 216,
    qualityScore: 90,
    decisionConsistencyScore: 93,
    accuracyScore: 87,
    scheduledInspections: 6,
    completedInspections: 6,
    inspectionCompletionRate: 100,
    avgEntityFeedbackScore: 4.6,
    totalFeedbackResponses: 14,
    calculatedAt: new Date('2025-01-30'),
  },
  {
    supervisorId: 'SUP-007',
    periodStart: new Date('2025-01-01'),
    periodEnd: new Date('2025-01-31'),
    totalCases: 19,
    pendingCases: 3,
    completedCases: 15,
    overdueCases: 1,
    approvedCount: 12,
    rejectedCount: 2,
    deferredCount: 1,
    escalatedCount: 1,
    approvalRate: 80.00,
    avgResponseTime: 168,
    avgCaseCompletionTime: 252,
    fastestResponseTime: 96,
    slowestResponseTime: 312,
    qualityScore: 85,
    decisionConsistencyScore: 87,
    accuracyScore: 83,
    scheduledInspections: 3,
    completedInspections: 2,
    inspectionCompletionRate: 66.67,
    avgEntityFeedbackScore: 4.0,
    totalFeedbackResponses: 11,
    calculatedAt: new Date('2025-01-30'),
  },
  {
    supervisorId: 'SUP-008',
    periodStart: new Date('2025-01-01'),
    periodEnd: new Date('2025-01-31'),
    totalCases: 10,
    pendingCases: 2,
    completedCases: 7,
    overdueCases: 0,
    approvedCount: 5,
    rejectedCount: 1,
    deferredCount: 1,
    escalatedCount: 1,
    approvalRate: 71.43,
    avgResponseTime: 192,
    avgCaseCompletionTime: 264,
    fastestResponseTime: 120,
    slowestResponseTime: 288,
    qualityScore: 81,
    decisionConsistencyScore: 84,
    accuracyScore: 78,
    scheduledInspections: 5,
    completedInspections: 4,
    inspectionCompletionRate: 80,
    avgEntityFeedbackScore: 3.8,
    totalFeedbackResponses: 5,
    calculatedAt: new Date('2025-01-30'),
  },
]

// ============================================================
// SUPERVISOR DECISIONS
// ============================================================

export const mockSupervisorDecisions: SupervisorDecision[] = [
  {
    id: 'DEC-001',
    supervisorId: 'SUP-001',
    caseId: 'CASE-002',
    caseNumber: generateCaseNumber(2, CaseType.COMPLIANCE_ASSESSMENT),
    entityName: 'Steward Microfinance',
    decisionType: DecisionType.APPROVE,
    decisionDate: new Date('2025-01-23'),
    responseTime: 192,
    notes: 'Entity demonstrates strong AML controls and compliance culture. All assessment criteria met.',
    attachments: ['assessment-report-2025-001.pdf'],
    createdAt: new Date('2025-01-23'),
  },
  {
    id: 'DEC-002',
    supervisorId: 'SUP-001',
    caseId: 'CASE-003',
    caseNumber: generateCaseNumber(3, CaseType.ENFORCEMENT_ACTION),
    entityName: 'Zimbabwe Investment Brokers',
    decisionType: DecisionType.ESCALATE,
    decisionDate: new Date('2025-01-19'),
    responseTime: 216,
    notes: 'Multiple compliance breaches identified including failure to file STRs and inadequate CDD. Escalating to Director for penalty determination.',
    attachments: ['investigation-report-2025-003.pdf', 'breach-summary.xlsx'],
    createdAt: new Date('2025-01-19'),
  },
  {
    id: 'DEC-003',
    supervisorId: 'SUP-002',
    caseId: 'CASE-005',
    caseNumber: generateCaseNumber(5, CaseType.LICENSE_RENEWAL),
    entityName: 'Zimnat Life Assurance',
    decisionType: DecisionType.APPROVE,
    decisionDate: new Date('2025-01-20'),
    responseTime: 288,
    notes: 'All renewal requirements met. License renewed for 12 months effective 2025-02-01.',
    attachments: ['renewal-certificate-2025.pdf'],
    createdAt: new Date('2025-01-20'),
  },
  {
    id: 'DEC-004',
    supervisorId: 'SUP-003',
    caseId: 'CASE-008',
    caseNumber: generateCaseNumber(8, CaseType.DESK_REVIEW),
    entityName: 'GetBucks Microfinance',
    decisionType: DecisionType.APPROVE,
    decisionDate: new Date('2025-01-24'),
    responseTime: 288,
    notes: 'Desk review satisfactory. No further action required at this time. Recommend follow-up in 6 months.',
    createdAt: new Date('2025-01-24'),
  },
  {
    id: 'DEC-005',
    supervisorId: 'SUP-004',
    caseId: 'CASE-010',
    caseNumber: generateCaseNumber(10, CaseType.COMPLAINT_INVESTIGATION),
    entityName: 'First Mutual Life',
    decisionType: DecisionType.DEFER,
    decisionDate: new Date('2025-01-18'),
    responseTime: 312,
    notes: 'Awaiting additional documentation from complainant. Case deferred for 14 days pending receipt of bank statements.',
    createdAt: new Date('2025-01-18'),
  },
]

// ============================================================
// ACTIVITY LOGS
// ============================================================

export const mockActivityLogs: ActivityLog[] = [
  {
    id: 'ACT-001',
    supervisorId: 'SUP-001',
    activityType: ActivityType.CASE_ASSIGNED,
    timestamp: new Date('2025-01-25T09:15:00'),
    caseId: 'CASE-001',
    caseNumber: generateCaseNumber(1, CaseType.STR_REVIEW),
    entityId: 'ENT-BNK-001',
    entityName: 'CBZ Bank Limited',
    description: 'Case assigned: High-priority STR review',
    outcome: 'Case accepted and under review',
    createdAt: new Date('2025-01-25T09:15:00'),
  },
  {
    id: 'ACT-002',
    supervisorId: 'SUP-001',
    activityType: ActivityType.DECISION_MADE,
    timestamp: new Date('2025-01-23T14:30:00'),
    caseId: 'CASE-002',
    caseNumber: generateCaseNumber(2, CaseType.COMPLIANCE_ASSESSMENT),
    entityId: 'ENT-MFI-012',
    entityName: 'Steward Microfinance',
    description: 'Compliance assessment approved',
    outcome: 'APPROVED - Strong compliance framework',
    createdAt: new Date('2025-01-23T14:30:00'),
  },
  {
    id: 'ACT-003',
    supervisorId: 'SUP-001',
    activityType: ActivityType.CASE_ESCALATED,
    timestamp: new Date('2025-01-19T16:45:00'),
    caseId: 'CASE-003',
    caseNumber: generateCaseNumber(3, CaseType.ENFORCEMENT_ACTION),
    entityId: 'ENT-BRK-008',
    entityName: 'Zimbabwe Investment Brokers',
    description: 'Case escalated to Director - Multiple compliance breaches',
    outcome: 'Escalated for penalty determination',
    createdAt: new Date('2025-01-19T16:45:00'),
  },
  {
    id: 'ACT-004',
    supervisorId: 'SUP-002',
    activityType: ActivityType.CASE_REVIEWED,
    timestamp: new Date('2025-01-28T11:20:00'),
    caseId: 'CASE-004',
    caseNumber: generateCaseNumber(4, CaseType.LICENSE_APPLICATION),
    entityId: 'ENT-NEW-001',
    entityName: 'Zimbabwe Fintech Solutions (Pvt) Ltd',
    description: 'License application reviewed - Awaiting board decision',
    outcome: 'Review completed, pending final decision',
    createdAt: new Date('2025-01-28T11:20:00'),
  },
  {
    id: 'ACT-005',
    supervisorId: 'SUP-002',
    activityType: ActivityType.DECISION_MADE,
    timestamp: new Date('2025-01-20T10:00:00'),
    caseId: 'CASE-005',
    caseNumber: generateCaseNumber(5, CaseType.LICENSE_RENEWAL),
    entityId: 'ENT-INS-004',
    entityName: 'Zimnat Life Assurance',
    description: 'License renewal approved',
    outcome: 'APPROVED - License renewed for 12 months',
    createdAt: new Date('2025-01-20T10:00:00'),
  },
  {
    id: 'ACT-006',
    supervisorId: 'SUP-003',
    activityType: ActivityType.INSPECTION_SCHEDULED,
    timestamp: new Date('2025-01-27T08:30:00'),
    caseId: 'CASE-007',
    caseNumber: generateCaseNumber(7, CaseType.ONSITE_INSPECTION),
    entityId: 'ENT-BNK-002',
    entityName: 'FBC Bank Limited',
    description: 'Onsite inspection scheduled for 2025-02-05',
    outcome: 'Inspection team assigned',
    createdAt: new Date('2025-01-27T08:30:00'),
  },
  {
    id: 'ACT-007',
    supervisorId: 'SUP-003',
    activityType: ActivityType.INSPECTION_COMPLETED,
    timestamp: new Date('2025-01-24T16:00:00'),
    caseId: 'CASE-008',
    caseNumber: generateCaseNumber(8, CaseType.DESK_REVIEW),
    entityId: 'ENT-MFI-008',
    entityName: 'GetBucks Microfinance',
    description: 'Desk review completed',
    outcome: 'APPROVED - No issues identified',
    createdAt: new Date('2025-01-24T16:00:00'),
  },
  {
    id: 'ACT-008',
    supervisorId: 'SUP-004',
    activityType: ActivityType.ENTITY_CONTACTED,
    timestamp: new Date('2025-01-28T13:15:00'),
    caseId: 'CASE-009',
    caseNumber: generateCaseNumber(9, CaseType.COMPLAINT_INVESTIGATION),
    entityId: 'ENT-BRK-003',
    entityName: 'Morgan & Co Stockbrokers',
    description: 'Entity contacted for clarification on complaint',
    outcome: 'Awaiting entity response within 5 business days',
    createdAt: new Date('2025-01-28T13:15:00'),
  },
]

// ============================================================
// PERFORMANCE ANOMALIES
// ============================================================

export const mockPerformanceAnomalies: PerformanceAnomaly[] = [
  {
    id: 'ANOM-001',
    supervisorId: 'SUP-003',
    supervisorName: 'Kudakwashe Mlambo',
    anomalyType: AnomalyType.OVERDUE_CASES_THRESHOLD,
    severity: AlertSeverity.HIGH,
    detectedAt: new Date('2025-01-29T08:00:00'),
    description: 'Supervisor has 2 overdue cases exceeding the threshold of 1',
    currentValue: 2,
    expectedValue: 0,
    threshold: 1,
    deviation: 100,
    affectedCases: ['CASE-007'],
    recommendations: [
      'Review case assignments and priorities',
      'Consider workload rebalancing',
      'Schedule meeting to identify bottlenecks',
    ],
    isResolved: false,
    createdAt: new Date('2025-01-29T08:00:00'),
  },
  {
    id: 'ANOM-002',
    supervisorId: 'SUP-003',
    supervisorName: 'Kudakwashe Mlambo',
    anomalyType: AnomalyType.RESPONSE_TIME_SPIKE,
    severity: AlertSeverity.MEDIUM,
    detectedAt: new Date('2025-01-28T14:30:00'),
    description: 'Average response time increased by 40% compared to previous period',
    currentValue: 198,
    expectedValue: 140,
    threshold: 160,
    deviation: 41.43,
    recommendations: [
      'Investigate causes of delays',
      'Review case complexity distribution',
      'Provide additional support if needed',
    ],
    isResolved: false,
    createdAt: new Date('2025-01-28T14:30:00'),
  },
  {
    id: 'ANOM-003',
    supervisorId: 'SUP-007',
    supervisorName: 'Rutendo Gumbo',
    anomalyType: AnomalyType.QUALITY_SCORE_DROP,
    severity: AlertSeverity.MEDIUM,
    detectedAt: new Date('2025-01-27T10:15:00'),
    description: 'Quality score dropped from 92 to 85 (7.6% decrease)',
    currentValue: 85,
    expectedValue: 92,
    threshold: 88,
    deviation: -7.61,
    recommendations: [
      'Review recent decisions for quality issues',
      'Schedule quality assurance review',
      'Provide refresher training if necessary',
    ],
    isResolved: false,
    createdAt: new Date('2025-01-27T10:15:00'),
  },
]

// ============================================================
// PERFORMANCE TARGETS
// ============================================================

export const mockPerformanceTargets: PerformanceTarget[] = [
  {
    id: 'TGT-001',
    targetName: 'Maximum Response Time',
    description: 'Average response time from case assignment to initial review',
    metric: 'avgResponseTime',
    targetValue: 120,
    warningThreshold: 150,
    criticalThreshold: 180,
    unit: 'hours',
    isActive: true,
    appliesTo: [SupervisorRole.SUPERVISOR, SupervisorRole.JUNIOR_SUPERVISOR],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2025-01-15'),
  },
  {
    id: 'TGT-002',
    targetName: 'Minimum Quality Score',
    description: 'Overall quality score based on decision consistency, accuracy, and timeliness',
    metric: 'qualityScore',
    targetValue: 85,
    warningThreshold: 80,
    criticalThreshold: 75,
    unit: 'score',
    isActive: true,
    appliesTo: [SupervisorRole.SENIOR_SUPERVISOR, SupervisorRole.SUPERVISOR, SupervisorRole.JUNIOR_SUPERVISOR, SupervisorRole.TEAM_LEAD],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2025-01-15'),
  },
  {
    id: 'TGT-003',
    targetName: 'Minimum Cases per Month',
    description: 'Minimum number of cases to be completed per supervisor per month',
    metric: 'completedCases',
    targetValue: 15,
    warningThreshold: 12,
    criticalThreshold: 10,
    unit: 'cases',
    isActive: true,
    appliesTo: [SupervisorRole.SUPERVISOR],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2025-01-15'),
  },
  {
    id: 'TGT-004',
    targetName: 'Maximum Overdue Cases',
    description: 'Maximum number of overdue cases allowed at any time',
    metric: 'overdueCases',
    targetValue: 0,
    warningThreshold: 1,
    criticalThreshold: 2,
    unit: 'cases',
    isActive: true,
    appliesTo: [SupervisorRole.SENIOR_SUPERVISOR, SupervisorRole.SUPERVISOR, SupervisorRole.JUNIOR_SUPERVISOR, SupervisorRole.TEAM_LEAD],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2025-01-15'),
  },
  {
    id: 'TGT-005',
    targetName: 'Inspection Completion Rate',
    description: 'Percentage of scheduled inspections completed on time',
    metric: 'inspectionCompletionRate',
    targetValue: 90,
    warningThreshold: 80,
    criticalThreshold: 70,
    unit: 'percentage',
    isActive: true,
    appliesTo: [SupervisorRole.SUPERVISOR, SupervisorRole.SENIOR_SUPERVISOR],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2025-01-15'),
  },
]

// ============================================================
// ALERT CONFIGURATIONS
// ============================================================

export const mockAlertConfigurations: AlertConfiguration[] = [
  {
    id: 'ALRT-001',
    alertName: 'Overdue Cases Alert',
    description: 'Notify when supervisor has overdue cases exceeding threshold',
    anomalyType: AnomalyType.OVERDUE_CASES_THRESHOLD,
    isEnabled: true,
    checkFrequency: 60,
    overdueCasesThreshold: 1,
    notifyEmail: true,
    notifySMS: false,
    notifyInApp: true,
    recipients: ['supervisor-manager@seczim.gov.zw'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2025-01-15'),
  },
  {
    id: 'ALRT-002',
    alertName: 'Quality Score Drop Alert',
    description: 'Notify when supervisor quality score drops significantly',
    anomalyType: AnomalyType.QUALITY_SCORE_DROP,
    isEnabled: true,
    checkFrequency: 1440,
    qualityScoreDropThreshold: 5,
    notifyEmail: true,
    notifySMS: false,
    notifyInApp: true,
    recipients: ['quality-assurance@seczim.gov.zw'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2025-01-15'),
  },
  {
    id: 'ALRT-003',
    alertName: 'Inactivity Period Alert',
    description: 'Notify when supervisor has no activity for extended period',
    anomalyType: AnomalyType.INACTIVITY_PERIOD,
    isEnabled: true,
    checkFrequency: 360,
    inactivityPeriodHours: 48,
    notifyEmail: true,
    notifySMS: true,
    notifyInApp: true,
    recipients: ['supervisor-manager@seczim.gov.zw'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2025-01-15'),
  },
  {
    id: 'ALRT-004',
    alertName: 'Response Time Spike Alert',
    description: 'Notify when average response time exceeds threshold',
    anomalyType: AnomalyType.RESPONSE_TIME_SPIKE,
    isEnabled: true,
    checkFrequency: 720,
    responseTimeThreshold: 180,
    notifyEmail: true,
    notifySMS: false,
    notifyInApp: true,
    recipients: ['operations-manager@seczim.gov.zw'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2025-01-15'),
  },
]

// ============================================================
// CASE LOAD DISTRIBUTION
// ============================================================

export const mockCaseLoadDistribution: CaseLoadDistribution[] = mockSupervisors.map(supervisor => {
  const metrics = mockPerformanceMetrics.find(m => m.supervisorId === supervisor.id)!
  const totalCases = metrics.totalCases
  const utilizationRate = (totalCases / supervisor.maxCaseLoad) * 100
  
  return {
    supervisorId: supervisor.id,
    supervisorName: `${supervisor.firstName} ${supervisor.lastName}`,
    totalCases,
    pendingCases: metrics.pendingCases,
    activeCases: metrics.pendingCases + metrics.completedCases,
    completedCases: metrics.completedCases,
    percentage: (totalCases / mockSupervisorCases.length) * 100,
    isOverloaded: utilizationRate > 85,
    isUnderloaded: utilizationRate < 50,
    maxCapacity: supervisor.maxCaseLoad,
    utilizationRate,
  }
})

// ============================================================
// PERFORMANCE TRENDS
// ============================================================

export const mockPerformanceTrends: PerformanceTrendData[] = mockSupervisors.flatMap(supervisor => {
  return Array.from({ length: 6 }, (_, monthOffset) => {
    const date = new Date()
    date.setMonth(date.getMonth() - (5 - monthOffset))
    date.setDate(1)
    
    const baseMetrics = mockPerformanceMetrics.find(m => m.supervisorId === supervisor.id)!
    const variation = (Math.random() - 0.5) * 0.2
    
    return {
      supervisorId: supervisor.id,
      date,
      casesHandled: Math.round(baseMetrics.completedCases * (1 + variation)),
      avgResponseTime: Math.round(baseMetrics.avgResponseTime * (1 + variation * 0.5)),
      qualityScore: Math.round(baseMetrics.qualityScore * (1 + variation * 0.1)),
      approvalRate: Math.round(baseMetrics.approvalRate * (1 + variation * 0.05)),
      completionRate: Math.round((baseMetrics.completedCases / baseMetrics.totalCases) * 100),
    }
  })
})

// ============================================================
// QUALITY SCORE BREAKDOWN
// ============================================================

export const mockQualityScoreBreakdowns: QualityScoreBreakdown[] = mockPerformanceMetrics.map(metrics => ({
  supervisorId: metrics.supervisorId,
  overallScore: metrics.qualityScore,
  components: {
    decisionConsistency: {
      score: metrics.decisionConsistencyScore,
      weight: 0.25,
      description: 'Consistency in applying decision criteria across similar cases',
    },
    turnaroundTime: {
      score: Math.min(100, (240 / metrics.avgResponseTime) * 100),
      weight: 0.20,
      description: 'Speed of case processing compared to targets',
    },
    accuracyRate: {
      score: metrics.accuracyScore,
      weight: 0.30,
      description: 'Accuracy of risk assessments and decisions',
    },
    entitySatisfaction: {
      score: metrics.avgEntityFeedbackScore ? metrics.avgEntityFeedbackScore * 20 : 80,
      weight: 0.15,
      description: 'Entity feedback on supervisor interactions',
    },
    complianceAdherence: {
      score: metrics.inspectionCompletionRate,
      weight: 0.10,
      description: 'Adherence to procedures and deadlines',
    },
  },
  calculatedAt: new Date('2025-01-30'),
}))

// ============================================================
// RISK ASSESSMENT ACCURACY
// ============================================================

export const mockRiskAssessmentAccuracy: RiskAssessmentAccuracy[] = mockSupervisors.map(supervisor => {
  const totalAssessments = Math.floor(Math.random() * 20) + 10
  const accuracyRate = 70 + Math.random() * 25
  const accurateAssessments = Math.round((accuracyRate / 100) * totalAssessments)
  
  return {
    supervisorId: supervisor.id,
    supervisorName: `${supervisor.firstName} ${supervisor.lastName}`,
    totalAssessments,
    accurateAssessments,
    accuracyRate,
    avgDeviation: Math.random() * 2,
    overestimations: Math.floor((totalAssessments - accurateAssessments) * 0.6),
    underestimations: Math.floor((totalAssessments - accurateAssessments) * 0.4),
    assessmentPeriod: {
      start: new Date('2025-01-01'),
      end: new Date('2025-01-31'),
    },
  }
})

// ============================================================
// CASE TYPE BREAKDOWN
// ============================================================

export const mockCaseTypeBreakdowns: CaseTypeBreakdown[] = mockSupervisors.map(supervisor => {
  const supervisorCases = mockSupervisorCases.filter(c => c.supervisorId === supervisor.id)
  const caseTypes = Array.from(new Set(supervisorCases.map(c => c.caseType)))
  
  return {
    supervisorId: supervisor.id,
    breakdown: caseTypes.map(caseType => {
      const typeCases = supervisorCases.filter(c => c.caseType === caseType)
      const completedCases = typeCases.filter(c => c.completedDate)
      
      return {
        caseType,
        count: typeCases.length,
        percentage: (typeCases.length / supervisorCases.length) * 100,
        avgResponseTime: completedCases.reduce((sum, c) => sum + (c.responseTime || 0), 0) / completedCases.length || 0,
        approvalRate: (completedCases.filter(c => c.decisionType === DecisionType.APPROVE).length / completedCases.length) * 100 || 0,
      }
    }),
  }
})
