/**
 * Supervisor Dashboard Module - Mock Data
 * 
 * Comprehensive test data for development and testing
 * Covers all requirements SUP-DASH-001 to SUP-DASH-015
 */

import {
  type SupervisedEntity,
  type PendingTask,
  type SuspiciousActivityAlert,
  type InspectionSchedule,
  type RecentActivity,
  type DeficiencyRecord,
  type TrainingModule,
  type Notification,
  EntityType,
  RiskLevel,
  ComplianceStatus,
  TaskType,
  TaskPriority,
  TaskStatus,
  AlertType,
  AlertReviewStatus,
  InspectionType,
  InspectionStatus,
  ActivityType,
  DeficiencyStatus,
  DeficiencySeverity,
  TrainingStatus,
  NotificationType,
  NotificationPriority
} from '@/types/supervisorDashboard'

// ============================================================================
// SUPERVISED ENTITIES (SUP-DASH-001)
// ============================================================================

export const mockSupervisedEntities: SupervisedEntity[] = [
  {
    id: 'ENT-001',
    name: 'First Capital Bank',
    entityType: EntityType.BANK,
    licenseNumber: 'BNK-2020-001',
    riskLevel: RiskLevel.HIGH,
    complianceStatus: ComplianceStatus.NEEDS_ATTENTION,
    supervisorId: 'SUP-001',
    supervisorName: 'John Supervisor',
    registrationDate: new Date('2020-01-15'),
    lastInspectionDate: new Date('2025-08-15'),
    nextInspectionDue: new Date('2025-11-15'),
    pendingApplications: 2,
    openDeficiencies: 3,
    contactPerson: 'Jane Manager',
    contactEmail: 'jane.manager@firstcapital.co.zw',
    contactPhone: '+263 4 123 4567',
    address: '123 Bank Street, Harare',
    totalAssets: 5000000000,
    employeeCount: 250,
    branchCount: 15,
    isActive: true,
    notes: 'Recent cash transaction anomalies detected'
  },
  {
    id: 'ENT-002',
    name: 'Zimbabwe Insurance Corporation',
    entityType: EntityType.INSURANCE,
    licenseNumber: 'INS-2018-045',
    riskLevel: RiskLevel.MEDIUM,
    complianceStatus: ComplianceStatus.COMPLIANT,
    supervisorId: 'SUP-001',
    supervisorName: 'John Supervisor',
    registrationDate: new Date('2018-03-20'),
    lastInspectionDate: new Date('2025-09-01'),
    nextInspectionDue: new Date('2026-03-01'),
    pendingApplications: 0,
    openDeficiencies: 0,
    contactPerson: 'Peter Insurance',
    contactEmail: 'peter@zic.co.zw',
    contactPhone: '+263 4 234 5678',
    address: '45 Insurance Plaza, Harare',
    totalAssets: 2500000000,
    employeeCount: 180,
    branchCount: 8,
    isActive: true
  },
  {
    id: 'ENT-003',
    name: 'Premium Securities Ltd',
    entityType: EntityType.SECURITIES_DEALER,
    licenseNumber: 'SEC-2021-012',
    riskLevel: RiskLevel.HIGH,
    complianceStatus: ComplianceStatus.NON_COMPLIANT,
    supervisorId: 'SUP-001',
    supervisorName: 'John Supervisor',
    registrationDate: new Date('2021-06-10'),
    lastInspectionDate: new Date('2025-07-20'),
    nextInspectionDue: new Date('2025-11-01'),
    pendingApplications: 1,
    openDeficiencies: 5,
    contactPerson: 'Sarah Broker',
    contactEmail: 'sarah@premiumsec.co.zw',
    contactPhone: '+263 4 345 6789',
    address: '78 Trading Floor, Harare',
    totalAssets: 800000000,
    employeeCount: 45,
    branchCount: 3,
    isActive: true,
    notes: 'Failed last AML inspection - enforcement action pending'
  },
  {
    id: 'ENT-004',
    name: 'National Pension Scheme',
    entityType: EntityType.PENSION_FUND,
    licenseNumber: 'PEN-2015-003',
    riskLevel: RiskLevel.LOW,
    complianceStatus: ComplianceStatus.COMPLIANT,
    supervisorId: 'SUP-001',
    supervisorName: 'John Supervisor',
    registrationDate: new Date('2015-02-01'),
    lastInspectionDate: new Date('2025-05-10'),
    nextInspectionDue: new Date('2026-05-10'),
    pendingApplications: 0,
    openDeficiencies: 0,
    contactPerson: 'Michael Pension',
    contactEmail: 'michael@nps.co.zw',
    contactPhone: '+263 4 456 7890',
    address: '12 Pension House, Harare',
    totalAssets: 10000000000,
    employeeCount: 120,
    branchCount: 5,
    isActive: true
  },
  {
    id: 'ENT-005',
    name: 'QuickCash Microfinance',
    entityType: EntityType.MICROFINANCE,
    licenseNumber: 'MFI-2022-089',
    riskLevel: RiskLevel.MEDIUM,
    complianceStatus: ComplianceStatus.NEEDS_ATTENTION,
    supervisorId: 'SUP-001',
    supervisorName: 'John Supervisor',
    registrationDate: new Date('2022-04-15'),
    lastInspectionDate: new Date('2025-09-15'),
    nextInspectionDue: new Date('2025-12-15'),
    pendingApplications: 3,
    openDeficiencies: 2,
    contactPerson: 'Grace Micro',
    contactEmail: 'grace@quickcash.co.zw',
    contactPhone: '+263 4 567 8901',
    address: '56 Small Business Ave, Bulawayo',
    totalAssets: 150000000,
    employeeCount: 30,
    branchCount: 10,
    isActive: true,
    notes: 'Customer due diligence procedures need improvement'
  }
]

// Generate additional 45 entities to reach 50+ total
const additionalEntityNames = [
  'Standard Chartered Zimbabwe', 'ZB Financial Holdings', 'CBZ Bank', 'Stanbic Bank Zimbabwe',
  'NMB Bank', 'Nedbank Zimbabwe', 'FBC Bank', 'Steward Bank', 'Ecobank Zimbabwe',
  'Old Mutual Zimbabwe', 'NICOZ Diamond', 'Econet Life', 'FBC Insurance',
  'Morgan Securities', 'IH Securities', 'AfriSec', 'Equity Axis', 'Securities Ltd',
  'CABS Pension Fund', 'Old Mutual Pension', 'Metropolitan Pension', 'ZB Pension',
  'GetBucks Zimbabwe', 'Zimnat Life', 'First Mutual Life', 'EcoLife',
  'Western Union Zimbabwe', 'MoneyGram', 'Mukuru', 'World Remit Zimbabwe',
  'TN Bank', 'FBC Building Society', 'ZB Building Society', 'CBZ Building Society',
  'Datvest Asset Management', 'Morgan Asset Management', 'Old Mutual Asset Managers',
  'ZB Asset Management', 'MetBank', 'Agribank', 'Infrastructure Development Bank',
  'Banc ABC', 'BancABC Zimbabwe', 'POSB', 'ZABG', 'ZimSwitch'
]

additionalEntityNames.forEach((name, index) => {
  const entityTypes = [EntityType.BANK, EntityType.INSURANCE, EntityType.SECURITIES_DEALER, 
    EntityType.PENSION_FUND, EntityType.MICROFINANCE, EntityType.MONEY_TRANSFER, 
    EntityType.BUREAU_DE_CHANGE, EntityType.ASSET_MANAGER]
  const riskLevels = [RiskLevel.LOW, RiskLevel.MEDIUM, RiskLevel.HIGH]
  const complianceStatuses = [ComplianceStatus.COMPLIANT, ComplianceStatus.NEEDS_ATTENTION, 
    ComplianceStatus.NON_COMPLIANT, ComplianceStatus.UNDER_REVIEW]

  mockSupervisedEntities.push({
    id: `ENT-${String(index + 6).padStart(3, '0')}`,
    name,
    entityType: entityTypes[index % entityTypes.length],
    licenseNumber: `LIC-${2015 + (index % 10)}-${String(index + 100).padStart(3, '0')}`,
    riskLevel: riskLevels[index % riskLevels.length],
    complianceStatus: complianceStatuses[index % complianceStatuses.length],
    supervisorId: 'SUP-001',
    supervisorName: 'John Supervisor',
    registrationDate: new Date(2015 + (index % 10), index % 12, 1),
    lastInspectionDate: index % 3 === 0 ? new Date(2025, 8, 1) : new Date(2025, 6, 15),
    nextInspectionDue: index % 4 === 0 ? new Date(2025, 11, 15) : new Date(2026, 2, 1),
    pendingApplications: index % 5,
    openDeficiencies: index % 4,
    contactPerson: `Contact Person ${index + 6}`,
    contactEmail: `contact${index + 6}@entity.co.zw`,
    contactPhone: `+263 4 ${String(100 + index).padStart(3, '0')} ${String(1000 + index).padStart(4, '0')}`,
    address: `${index + 100} Business Street, ${index % 2 === 0 ? 'Harare' : 'Bulawayo'}`,
    totalAssets: 100000000 * (index + 1),
    employeeCount: 20 + (index * 5),
    branchCount: 1 + (index % 10),
    isActive: true
  })
})

// ============================================================================
// PENDING TASKS (SUP-DASH-002, SUP-DASH-003)
// ============================================================================

export const mockPendingTasks: PendingTask[] = [
  {
    id: 'TASK-001',
    title: 'Review Premium Securities AML Compliance',
    description: 'Urgent review required following inspection findings',
    taskType: TaskType.LICENSE_REVIEW,
    priority: TaskPriority.CRITICAL,
    status: TaskStatus.OVERDUE,
    entityId: 'ENT-003',
    entityName: 'Premium Securities Ltd',
    assignedTo: 'SUP-001',
    dueDate: new Date('2025-10-25'),
    createdDate: new Date('2025-10-15'),
    estimatedHours: 8,
    isOverdue: true,
    isPriority: true,
    relatedRecordId: 'INS-2025-045'
  },
  {
    id: 'TASK-002',
    title: 'Complete First Capital Bank Inspection Report',
    description: 'Finalize inspection report with findings and recommendations',
    taskType: TaskType.INSPECTION_REPORT,
    priority: TaskPriority.HIGH,
    status: TaskStatus.IN_PROGRESS,
    entityId: 'ENT-001',
    entityName: 'First Capital Bank',
    assignedTo: 'SUP-001',
    dueDate: new Date('2025-11-02'),
    createdDate: new Date('2025-08-20'),
    estimatedHours: 16,
    actualHours: 10,
    isOverdue: false,
    isPriority: true,
    relatedRecordId: 'INS-2025-089'
  },
  {
    id: 'TASK-003',
    title: 'Follow-up on STR-2025-156',
    description: 'Investigate suspicious wire transfers totaling $2.5M',
    taskType: TaskType.STR_FOLLOWUP,
    priority: TaskPriority.CRITICAL,
    status: TaskStatus.PENDING,
    entityId: 'ENT-001',
    entityName: 'First Capital Bank',
    assignedTo: 'SUP-001',
    dueDate: new Date('2025-10-31'),
    createdDate: new Date('2025-10-20'),
    estimatedHours: 12,
    isOverdue: false,
    isPriority: true,
    relatedRecordId: 'STR-2025-156'
  },
  {
    id: 'TASK-004',
    title: 'Review QuickCash Branch Expansion Application',
    description: 'Assess application for 5 new branches in Masvingo province',
    taskType: TaskType.APPLICATION_REVIEW,
    priority: TaskPriority.MEDIUM,
    status: TaskStatus.PENDING,
    entityId: 'ENT-005',
    entityName: 'QuickCash Microfinance',
    assignedTo: 'SUP-001',
    dueDate: new Date('2025-11-15'),
    createdDate: new Date('2025-10-05'),
    estimatedHours: 6,
    isOverdue: false,
    isPriority: false,
    relatedRecordId: 'APP-2025-234'
  },
  {
    id: 'TASK-005',
    title: 'Verify Premium Securities Deficiency Remediation',
    description: 'Confirm all 5 deficiencies from last inspection have been addressed',
    taskType: TaskType.DEFICIENCY_VERIFICATION,
    priority: TaskPriority.HIGH,
    status: TaskStatus.PENDING,
    entityId: 'ENT-003',
    entityName: 'Premium Securities Ltd',
    assignedTo: 'SUP-001',
    dueDate: new Date('2025-11-05'),
    createdDate: new Date('2025-10-01'),
    estimatedHours: 4,
    isOverdue: false,
    isPriority: true,
    relatedRecordId: 'DEF-2025-012'
  },
  {
    id: 'TASK-006',
    title: 'Quarterly Risk Assessment - First Capital Bank',
    description: 'Conduct quarterly risk assessment and update risk profile',
    taskType: TaskType.RISK_ASSESSMENT,
    priority: TaskPriority.MEDIUM,
    status: TaskStatus.PENDING,
    entityId: 'ENT-001',
    entityName: 'First Capital Bank',
    assignedTo: 'SUP-001',
    dueDate: new Date('2025-11-30'),
    createdDate: new Date('2025-10-01'),
    estimatedHours: 8,
    isOverdue: false,
    isPriority: false
  },
  {
    id: 'TASK-007',
    title: 'Review CTR Filing Patterns',
    description: 'Analyze recent CTR filings for potential structuring',
    taskType: TaskType.CTR_REVIEW,
    priority: TaskPriority.MEDIUM,
    status: TaskStatus.PENDING,
    entityId: 'ENT-005',
    entityName: 'QuickCash Microfinance',
    assignedTo: 'SUP-001',
    dueDate: new Date('2025-11-10'),
    createdDate: new Date('2025-10-15'),
    estimatedHours: 3,
    isOverdue: false,
    isPriority: false
  },
  {
    id: 'TASK-008',
    title: 'Review AML Policy Updates',
    description: 'Review and approve updated AML/CFT policies submitted by entity',
    taskType: TaskType.DOCUMENT_REVIEW,
    priority: TaskPriority.LOW,
    status: TaskStatus.PENDING,
    entityId: 'ENT-002',
    entityName: 'Zimbabwe Insurance Corporation',
    assignedTo: 'SUP-001',
    dueDate: new Date('2025-11-20'),
    createdDate: new Date('2025-10-10'),
    estimatedHours: 2,
    isOverdue: false,
    isPriority: false
  }
]

// ============================================================================
// SUSPICIOUS ACTIVITY ALERTS (SUP-DASH-004)
// ============================================================================

export const mockSuspiciousActivityAlerts: SuspiciousActivityAlert[] = [
  {
    id: 'STR-2025-156',
    alertType: AlertType.STR,
    entityId: 'ENT-001',
    entityName: 'First Capital Bank',
    reportDate: new Date('2025-10-20'),
    transactionDate: new Date('2025-10-15'),
    amount: 2500000,
    currency: 'USD',
    description: 'Multiple large wire transfers to high-risk jurisdictions within 48 hours',
    reviewStatus: AlertReviewStatus.UNDER_REVIEW,
    assignedTo: 'SUP-001',
    priority: TaskPriority.CRITICAL,
    suspicionIndicators: [
      'Rapid movement of funds',
      'High-risk jurisdiction',
      'Inconsistent with customer profile',
      'Lack of economic rationale'
    ],
    involvedParties: [
      {
        name: 'ABC Trading Ltd',
        role: 'Originator',
        accountNumber: '1234567890',
        identificationNumber: 'REG-2020-456'
      },
      {
        name: 'Offshore Holdings Inc',
        role: 'Beneficiary',
        accountNumber: 'OFF-987654',
        identificationNumber: 'N/A'
      }
    ],
    reviewNotes: 'Customer unable to provide satisfactory documentation for business purpose'
  },
  {
    id: 'CTR-2025-892',
    alertType: AlertType.CTR,
    entityId: 'ENT-005',
    entityName: 'QuickCash Microfinance',
    reportDate: new Date('2025-10-25'),
    transactionDate: new Date('2025-10-24'),
    amount: 15000,
    currency: 'USD',
    description: 'Cash deposit just below reporting threshold - potential structuring',
    reviewStatus: AlertReviewStatus.NEW,
    assignedTo: 'SUP-001',
    priority: TaskPriority.HIGH,
    suspicionIndicators: [
      'Amount just below threshold',
      'Pattern of similar transactions',
      'No apparent business justification'
    ],
    involvedParties: [
      {
        name: 'John Doe',
        role: 'Originator',
        accountNumber: '9876543210',
        identificationNumber: '63-123456-A-47'
      }
    ]
  },
  {
    id: 'STR-2025-145',
    alertType: AlertType.PEP_EXPOSURE,
    entityId: 'ENT-003',
    entityName: 'Premium Securities Ltd',
    reportDate: new Date('2025-10-18'),
    transactionDate: new Date('2025-10-10'),
    amount: 850000,
    currency: 'USD',
    description: 'Large securities purchase by politically exposed person without enhanced due diligence',
    reviewStatus: AlertReviewStatus.ESCALATED,
    assignedTo: 'SUP-001',
    priority: TaskPriority.CRITICAL,
    suspicionIndicators: [
      'PEP not properly identified',
      'Inadequate source of funds verification',
      'Enhanced due diligence not performed'
    ],
    involvedParties: [
      {
        name: 'Minister XYZ',
        role: 'Beneficiary',
        accountNumber: 'SEC-456789',
        identificationNumber: '63-987654-B-21'
      }
    ],
    escalationReason: 'Regulatory breach - insufficient PEP controls'
  },
  {
    id: 'STR-2025-134',
    alertType: AlertType.UNUSUAL_PATTERN,
    entityId: 'ENT-001',
    entityName: 'First Capital Bank',
    reportDate: new Date('2025-10-15'),
    transactionDate: new Date('2025-10-12'),
    amount: 450000,
    currency: 'USD',
    description: 'Dormant account suddenly active with large transactions',
    reviewStatus: AlertReviewStatus.CLOSED,
    assignedTo: 'SUP-001',
    priority: TaskPriority.MEDIUM,
    suspicionIndicators: [
      'Dormant account (2 years)',
      'Sudden high-value activity',
      'Change in transaction pattern'
    ],
    involvedParties: [
      {
        name: 'Legacy Corp',
        role: 'Originator',
        accountNumber: '5555666677',
        identificationNumber: 'REG-2018-123'
      }
    ],
    reviewNotes: 'Verified legitimate business transaction - company acquired by new owners',
    closureReason: 'False positive - legitimate business activity confirmed',
    reviewedBy: 'SUP-001',
    reviewedDate: new Date('2025-10-20')
  },
  {
    id: 'STR-2025-167',
    alertType: AlertType.SANCTIONS_MATCH,
    entityId: 'ENT-001',
    entityName: 'First Capital Bank',
    reportDate: new Date('2025-10-28'),
    transactionDate: new Date('2025-10-27'),
    amount: 125000,
    currency: 'USD',
    description: 'Potential sanctions match on beneficiary name',
    reviewStatus: AlertReviewStatus.NEW,
    assignedTo: 'SUP-001',
    priority: TaskPriority.CRITICAL,
    suspicionIndicators: [
      '85% name match with OFAC list',
      'Similar date of birth',
      'Transaction blocked pending review'
    ],
    involvedParties: [
      {
        name: 'Mohammed Al-Rashid',
        role: 'Beneficiary',
        accountNumber: 'INT-789456',
        identificationNumber: 'N/A'
      }
    ]
  }
]

// ============================================================================
// INSPECTION SCHEDULE (SUP-DASH-005)
// ============================================================================

export const mockInspectionSchedule: InspectionSchedule[] = [
  {
    id: 'INS-2025-101',
    entityId: 'ENT-003',
    entityName: 'Premium Securities Ltd',
    entityType: EntityType.SECURITIES_DEALER,
    inspectionType: InspectionType.FOLLOW_UP,
    scheduledDate: new Date('2025-11-01'),
    endDate: new Date('2025-11-02'),
    status: InspectionStatus.SCHEDULED,
    leadInspector: 'SUP-001',
    inspectionTeam: ['SUP-001', 'INS-003', 'INS-005'],
    scope: 'Verify remediation of deficiencies from previous inspection',
    location: 'On-site at entity premises',
    preparationNotes: 'Review previous inspection report and entity responses'
  },
  {
    id: 'INS-2025-102',
    entityId: 'ENT-001',
    entityName: 'First Capital Bank',
    entityType: EntityType.BANK,
    inspectionType: InspectionType.THEMATIC,
    scheduledDate: new Date('2025-11-15'),
    endDate: new Date('2025-11-19'),
    status: InspectionStatus.SCHEDULED,
    leadInspector: 'SUP-001',
    inspectionTeam: ['SUP-001', 'INS-002', 'INS-004', 'INS-006'],
    scope: 'Transaction monitoring systems and STR filing procedures',
    location: 'On-site at Head Office',
    preparationNotes: 'Focus on recent STR-2025-156 and transaction monitoring effectiveness'
  },
  {
    id: 'INS-2025-103',
    entityId: 'ENT-005',
    entityName: 'QuickCash Microfinance',
    entityType: EntityType.MICROFINANCE,
    inspectionType: InspectionType.ON_SITE,
    scheduledDate: new Date('2025-11-20'),
    endDate: new Date('2025-11-22'),
    status: InspectionStatus.SCHEDULED,
    leadInspector: 'SUP-001',
    inspectionTeam: ['SUP-001', 'INS-007'],
    scope: 'Comprehensive AML/CFT compliance review',
    location: 'On-site at Bulawayo branch',
    preparationNotes: 'Customer due diligence and record-keeping focus'
  },
  {
    id: 'INS-2025-089',
    entityId: 'ENT-001',
    entityName: 'First Capital Bank',
    entityType: EntityType.BANK,
    inspectionType: InspectionType.COMPREHENSIVE,
    scheduledDate: new Date('2025-08-15'),
    endDate: new Date('2025-08-25'),
    status: InspectionStatus.REPORT_PENDING,
    leadInspector: 'SUP-001',
    inspectionTeam: ['SUP-001', 'INS-002', 'INS-004'],
    scope: 'Full AML/CFT compliance inspection',
    location: 'On-site at Head Office',
    reportId: 'REP-2025-089',
    findings: [
      {
        id: 'FIND-089-01',
        category: 'Transaction Monitoring',
        severity: DeficiencySeverity.MAJOR,
        description: 'Automated transaction monitoring system alerts not reviewed timely',
        recommendation: 'Implement daily alert review process with documented outcomes',
        dueDate: new Date('2025-11-30')
      },
      {
        id: 'FIND-089-02',
        category: 'Record Keeping',
        severity: DeficiencySeverity.MINOR,
        description: 'Some customer files missing updated beneficial ownership information',
        recommendation: 'Complete beneficial ownership verification for all corporate customers',
        dueDate: new Date('2025-12-15')
      }
    ]
  },
  {
    id: 'INS-2025-067',
    entityId: 'ENT-002',
    entityName: 'Zimbabwe Insurance Corporation',
    entityType: EntityType.INSURANCE,
    inspectionType: InspectionType.OFF_SITE,
    scheduledDate: new Date('2025-09-01'),
    endDate: new Date('2025-09-05'),
    status: InspectionStatus.COMPLETED,
    leadInspector: 'SUP-001',
    inspectionTeam: ['SUP-001', 'INS-008'],
    scope: 'Desktop review of AML policies and procedures',
    location: 'Off-site review',
    reportId: 'REP-2025-067',
    findings: []
  }
]

// ============================================================================
// RECENT ACTIVITIES (SUP-DASH-011)
// ============================================================================

export const mockRecentActivities: RecentActivity[] = [
  {
    id: 'ACT-001',
    activityType: ActivityType.RISK_ASSESSMENT,
    description: 'Updated risk rating for First Capital Bank to HIGH',
    entityId: 'ENT-001',
    entityName: 'First Capital Bank',
    performedBy: 'SUP-001',
    timestamp: new Date('2025-10-28T14:30:00'),
    details: {
      previousRisk: 'MEDIUM',
      newRisk: 'HIGH',
      reason: 'Multiple suspicious transaction reports'
    },
    icon: 'alert-triangle',
    color: 'orange'
  },
  {
    id: 'ACT-002',
    activityType: ActivityType.NOTICE_SENT,
    description: 'Sent deficiency notice to Premium Securities Ltd',
    entityId: 'ENT-003',
    entityName: 'Premium Securities Ltd',
    performedBy: 'SUP-001',
    timestamp: new Date('2025-10-27T16:45:00'),
    details: {
      noticeType: 'Deficiency Remediation',
      deficiencyCount: 5,
      dueDate: '2025-11-05'
    },
    icon: 'mail',
    color: 'blue'
  },
  {
    id: 'ACT-003',
    activityType: ActivityType.INSPECTION_COMPLETED,
    description: 'Completed on-site inspection at First Capital Bank',
    entityId: 'ENT-001',
    entityName: 'First Capital Bank',
    performedBy: 'SUP-001',
    timestamp: new Date('2025-10-25T17:00:00'),
    details: {
      inspectionType: 'Comprehensive',
      duration: '10 days',
      findingsCount: 3
    },
    icon: 'check-circle',
    color: 'green'
  },
  {
    id: 'ACT-004',
    activityType: ActivityType.LICENSE_APPROVED,
    description: 'Approved branch expansion application for QuickCash Microfinance',
    entityId: 'ENT-005',
    entityName: 'QuickCash Microfinance',
    performedBy: 'SUP-001',
    timestamp: new Date('2025-10-22T11:20:00'),
    details: {
      applicationType: 'Branch Expansion',
      branchCount: 3,
      locations: ['Mutare', 'Gweru', 'Kwekwe']
    },
    icon: 'thumbs-up',
    color: 'green'
  },
  {
    id: 'ACT-005',
    activityType: ActivityType.REPORT_GENERATED,
    description: 'Generated quarterly supervision report',
    entityId: 'ENT-001',
    entityName: 'First Capital Bank',
    performedBy: 'SUP-001',
    timestamp: new Date('2025-10-20T09:15:00'),
    details: {
      reportType: 'Quarterly Supervision',
      period: 'Q3 2025',
      pages: 45
    },
    icon: 'file-text',
    color: 'blue'
  },
  {
    id: 'ACT-006',
    activityType: ActivityType.DEFICIENCY_RESOLVED,
    description: 'Verified resolution of 2 deficiencies at Zimbabwe Insurance Corporation',
    entityId: 'ENT-002',
    entityName: 'Zimbabwe Insurance Corporation',
    performedBy: 'SUP-001',
    timestamp: new Date('2025-10-18T15:30:00'),
    details: {
      deficienciesResolved: 2,
      verificationMethod: 'Document review'
    },
    icon: 'check-square',
    color: 'green'
  },
  {
    id: 'ACT-007',
    activityType: ActivityType.ENTITY_UPDATED,
    description: 'Updated contact information for Premium Securities Ltd',
    entityId: 'ENT-003',
    entityName: 'Premium Securities Ltd',
    performedBy: 'SUP-001',
    timestamp: new Date('2025-10-15T10:00:00'),
    details: {
      changedFields: ['contactPerson', 'contactEmail']
    },
    icon: 'edit',
    color: 'gray'
  }
]

// ============================================================================
// DEFICIENCY RECORDS (SUP-DASH-012)
// ============================================================================

export const mockDeficiencyRecords: DeficiencyRecord[] = [
  {
    id: 'DEF-001',
    entityId: 'ENT-003',
    entityName: 'Premium Securities Ltd',
    description: 'Inadequate customer due diligence for high-risk clients',
    severity: DeficiencySeverity.CRITICAL,
    status: DeficiencyStatus.OPEN,
    identifiedDate: new Date('2025-07-20'),
    dueDate: new Date('2025-11-05'),
    category: 'Customer Due Diligence',
    correctiveAction: 'Implement enhanced due diligence procedures for all high-risk customers',
    isOverdue: false
  },
  {
    id: 'DEF-002',
    entityId: 'ENT-003',
    entityName: 'Premium Securities Ltd',
    description: 'No documented AML risk assessment',
    severity: DeficiencySeverity.MAJOR,
    status: DeficiencyStatus.PENDING_VERIFICATION,
    identifiedDate: new Date('2025-07-20'),
    dueDate: new Date('2025-10-20'),
    category: 'Risk Assessment',
    correctiveAction: 'Complete institutional AML risk assessment and document findings',
    isOverdue: true,
    verifiedBy: 'SUP-001',
    verificationDate: new Date('2025-10-25')
  },
  {
    id: 'DEF-003',
    entityId: 'ENT-001',
    entityName: 'First Capital Bank',
    description: 'Transaction monitoring alerts not reviewed within policy timeframes',
    severity: DeficiencySeverity.MAJOR,
    status: DeficiencyStatus.OPEN,
    identifiedDate: new Date('2025-08-25'),
    dueDate: new Date('2025-11-30'),
    category: 'Transaction Monitoring',
    correctiveAction: 'Implement daily alert review process with supervisory oversight',
    isOverdue: false
  },
  {
    id: 'DEF-004',
    entityId: 'ENT-001',
    entityName: 'First Capital Bank',
    description: 'Beneficial ownership information outdated for some corporate customers',
    severity: DeficiencySeverity.MODERATE,
    status: DeficiencyStatus.OPEN,
    identifiedDate: new Date('2025-08-25'),
    dueDate: new Date('2025-12-15'),
    category: 'Record Keeping',
    correctiveAction: 'Update beneficial ownership records for all corporate accounts',
    isOverdue: false
  },
  {
    id: 'DEF-005',
    entityId: 'ENT-005',
    entityName: 'QuickCash Microfinance',
    description: 'Inadequate staff AML training records',
    severity: DeficiencySeverity.MODERATE,
    status: DeficiencyStatus.RESOLVED,
    identifiedDate: new Date('2025-06-15'),
    dueDate: new Date('2025-09-15'),
    resolvedDate: new Date('2025-09-10'),
    category: 'Training',
    correctiveAction: 'Provide comprehensive AML training to all staff and maintain records',
    isOverdue: false,
    verifiedBy: 'SUP-001',
    verificationDate: new Date('2025-09-12')
  },
  {
    id: 'DEF-006',
    entityId: 'ENT-005',
    entityName: 'QuickCash Microfinance',
    description: 'Customer risk rating methodology not documented',
    severity: DeficiencySeverity.MINOR,
    status: DeficiencyStatus.PENDING_VERIFICATION,
    identifiedDate: new Date('2025-09-15'),
    dueDate: new Date('2025-10-30'),
    category: 'Risk Assessment',
    correctiveAction: 'Document and approve customer risk rating methodology',
    isOverdue: false
  },
  {
    id: 'DEF-007',
    entityId: 'ENT-002',
    entityName: 'Zimbabwe Insurance Corporation',
    description: 'AML policy not updated for recent regulatory changes',
    severity: DeficiencySeverity.MINOR,
    status: DeficiencyStatus.RESOLVED,
    identifiedDate: new Date('2025-05-10'),
    dueDate: new Date('2025-08-10'),
    resolvedDate: new Date('2025-08-05'),
    category: 'Policies and Procedures',
    correctiveAction: 'Update AML policy to reflect 2025 regulatory amendments',
    isOverdue: false,
    verifiedBy: 'SUP-001',
    verificationDate: new Date('2025-08-08')
  }
]

// ============================================================================
// TRAINING MODULES (SUP-DASH-013)
// ============================================================================

export const mockTrainingModules: TrainingModule[] = [
  {
    id: 'TRN-001',
    title: 'Advanced Financial Crime Detection',
    description: 'Advanced techniques for identifying money laundering and terrorist financing',
    status: TrainingStatus.EXPIRING_SOON,
    dueDate: new Date('2025-11-15'),
    expiryDate: new Date('2025-11-15'),
    duration: 180,
    category: 'AML/CFT',
    isRequired: true,
    progress: 100
  },
  {
    id: 'TRN-002',
    title: 'Risk-Based Supervision Methodology',
    description: 'Updated approach to risk-based supervision of financial institutions',
    status: TrainingStatus.IN_PROGRESS,
    dueDate: new Date('2025-12-01'),
    duration: 120,
    category: 'Supervision',
    isRequired: true,
    progress: 65
  },
  {
    id: 'TRN-003',
    title: 'Sanctions Compliance and Screening',
    description: 'Understanding and implementing sanctions screening procedures',
    status: TrainingStatus.NOT_STARTED,
    dueDate: new Date('2025-12-15'),
    duration: 90,
    category: 'Compliance',
    isRequired: true,
    progress: 0
  },
  {
    id: 'TRN-004',
    title: 'Cyber Security for Supervisors',
    description: 'Cybersecurity awareness for financial sector supervisors',
    status: TrainingStatus.COMPLETED,
    dueDate: new Date('2025-09-30'),
    completionDate: new Date('2025-09-15'),
    duration: 60,
    category: 'Security',
    isRequired: false,
    progress: 100
  },
  {
    id: 'TRN-005',
    title: 'Annual Regulatory Updates 2025',
    description: 'Overview of 2025 regulatory changes and implementation guidance',
    status: TrainingStatus.OVERDUE,
    dueDate: new Date('2025-10-15'),
    duration: 150,
    category: 'Regulatory',
    isRequired: true,
    progress: 30
  }
]

// ============================================================================
// NOTIFICATIONS (SUP-DASH-014)
// ============================================================================

export const mockNotifications: Notification[] = [
  {
    id: 'NOT-001',
    type: NotificationType.DEADLINE_REMINDER,
    priority: NotificationPriority.URGENT,
    title: 'Inspection Report Overdue',
    message: 'Premium Securities Ltd inspection report was due on October 25, 2025',
    timestamp: new Date('2025-10-28T08:00:00'),
    isRead: false,
    actionUrl: '/supervisor/tasks/TASK-001',
    actionLabel: 'View Task',
    relatedEntityId: 'ENT-003',
    relatedEntityName: 'Premium Securities Ltd'
  },
  {
    id: 'NOT-002',
    type: NotificationType.ASSIGNMENT,
    priority: NotificationPriority.HIGH,
    title: 'New STR Assigned',
    message: 'STR-2025-156 from First Capital Bank has been assigned to you for review',
    timestamp: new Date('2025-10-27T14:30:00'),
    isRead: false,
    actionUrl: '/supervisor/alerts/STR-2025-156',
    actionLabel: 'Review Alert',
    relatedEntityId: 'ENT-001',
    relatedEntityName: 'First Capital Bank',
    senderId: 'SYS-001',
    senderName: 'System'
  },
  {
    id: 'NOT-003',
    type: NotificationType.APPROVAL_NEEDED,
    priority: NotificationPriority.HIGH,
    title: 'Application Pending Review',
    message: 'QuickCash Microfinance branch expansion application requires your approval',
    timestamp: new Date('2025-10-26T11:00:00'),
    isRead: false,
    actionUrl: '/supervisor/applications/APP-2025-234',
    actionLabel: 'Review Application',
    relatedEntityId: 'ENT-005',
    relatedEntityName: 'QuickCash Microfinance'
  },
  {
    id: 'NOT-004',
    type: NotificationType.SYSTEM_ALERT,
    priority: NotificationPriority.URGENT,
    title: 'Multiple STRs from Same Entity',
    message: 'First Capital Bank has filed 3 STRs in the past 7 days',
    timestamp: new Date('2025-10-25T16:45:00'),
    isRead: true,
    actionUrl: '/supervisor/alerts?entity=ENT-001',
    actionLabel: 'View Alerts',
    relatedEntityId: 'ENT-001',
    relatedEntityName: 'First Capital Bank',
    senderId: 'SYS-001',
    senderName: 'AML Alert System'
  },
  {
    id: 'NOT-005',
    type: NotificationType.DEADLINE_REMINDER,
    priority: NotificationPriority.NORMAL,
    title: 'Inspection Scheduled',
    message: 'Premium Securities Ltd follow-up inspection is scheduled for November 1, 2025',
    timestamp: new Date('2025-10-24T09:00:00'),
    isRead: true,
    actionUrl: '/supervisor/inspections/INS-2025-101',
    actionLabel: 'View Details',
    relatedEntityId: 'ENT-003',
    relatedEntityName: 'Premium Securities Ltd'
  },
  {
    id: 'NOT-006',
    type: NotificationType.TASK_UPDATE,
    priority: NotificationPriority.NORMAL,
    title: 'Task Completed',
    message: 'Zimbabwe Insurance Corporation policy review has been completed',
    timestamp: new Date('2025-10-22T15:20:00'),
    isRead: true,
    relatedEntityId: 'ENT-002',
    relatedEntityName: 'Zimbabwe Insurance Corporation',
    senderId: 'INS-008',
    senderName: 'Sarah Inspector'
  },
  {
    id: 'NOT-007',
    type: NotificationType.MESSAGE,
    priority: NotificationPriority.NORMAL,
    title: 'Training Reminder',
    message: 'Your "Advanced Financial Crime Detection" certification expires in 15 days',
    timestamp: new Date('2025-10-20T08:00:00'),
    isRead: true,
    actionUrl: '/training/TRN-001',
    actionLabel: 'Renew',
    senderId: 'SYS-001',
    senderName: 'Training System'
  }
]

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get entities by risk level
 */
export function getEntitiesByRisk(riskLevel: RiskLevel): SupervisedEntity[] {
  return mockSupervisedEntities.filter(e => e.riskLevel === riskLevel)
}

/**
 * Get entities by compliance status
 */
export function getEntitiesByCompliance(status: ComplianceStatus): SupervisedEntity[] {
  return mockSupervisedEntities.filter(e => e.complianceStatus === status)
}

/**
 * Get overdue tasks
 */
export function getOverdueTasks(): PendingTask[] {
  return mockPendingTasks.filter(t => t.isOverdue)
}

/**
 * Get priority tasks
 */
export function getPriorityTasks(): PendingTask[] {
  return mockPendingTasks.filter(t => t.isPriority)
}

/**
 * Get unread notifications
 */
export function getUnreadNotifications(): Notification[] {
  return mockNotifications.filter(n => !n.isRead)
}

/**
 * Get entities with inspections due
 */
export function getEntitiesWithInspectionsDue(): SupervisedEntity[] {
  const now = new Date()
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
  
  return mockSupervisedEntities.filter(e => 
    e.nextInspectionDue && 
    e.nextInspectionDue <= thirtyDaysFromNow
  )
}

/**
 * Get open deficiencies
 */
export function getOpenDeficiencies(): DeficiencyRecord[] {
  return mockDeficiencyRecords.filter(d => 
    d.status === DeficiencyStatus.OPEN || 
    d.status === DeficiencyStatus.PENDING_VERIFICATION
  )
}

/**
 * Calculate total pending applications
 */
export function getTotalPendingApplications(): number {
  return mockSupervisedEntities.reduce((sum, entity) => sum + entity.pendingApplications, 0)
}
