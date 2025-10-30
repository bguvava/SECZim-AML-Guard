/**
 * Audit Trail Mock Data
 * 
 * @module data/auditTrailMockData
 * @description Mock data for audit trail, activity logging, and forensic investigation
 * 
 * @author bguvava
 * @since 2025-10-30
 */

import {
  ActivityCategory,
  ActionType,
  EntityType,
  LogLevel,
  ActionResult,
  RetentionPeriod,
  TimeRange,
  type AuditLog,
  type UserAction,
  type DataChange,
  type LoginHistory,
  type AuditDashboardMetrics,
  type RetentionPolicy,
  type ActivityHeatmap,
  type UserActivityProfile,
  type ForensicCase,
  type AuditAnomaly,
  type AuditStatistics,
} from '@/types/auditTrail'

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function generateHash(data: string): string {
  // Simple hash function for demonstration
  let hash = 0
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16).padStart(16, '0')
}

function randomIp(): string {
  return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
}

// ============================================================
// MOCK AUDIT LOGS
// ============================================================

export const mockAuditLogs: AuditLog[] = [
  // Authentication Activities
  {
    id: 'AUDIT-001',
    timestamp: new Date('2025-10-30T08:30:00Z'),
    category: ActivityCategory.AUTHENTICATION,
    action: ActionType.LOGIN,
    entityType: EntityType.USER,
    entityId: 'USR-001',
    entityName: 'John Doe',
    userId: 'USR-001',
    userName: 'John Doe',
    userRole: 'Administrator',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/118.0.0.0',
    result: ActionResult.SUCCESS,
    logLevel: LogLevel.INFO,
    duration: 1250,
    description: 'User logged in successfully',
    metadata: { loginMethod: 'password', rememberMe: true },
    sessionId: 'SESSION-001',
    requestId: 'REQ-001',
    hash: generateHash('AUDIT-001-LOGIN-USR-001'),
  },
  {
    id: 'AUDIT-002',
    timestamp: new Date('2025-10-30T08:15:00Z'),
    category: ActivityCategory.AUTHENTICATION,
    action: ActionType.LOGIN_FAILED,
    entityType: EntityType.USER,
    entityId: 'USR-002',
    entityName: 'Jane Smith',
    userId: 'USR-002',
    userName: 'Jane Smith',
    userRole: 'Compliance Officer',
    ipAddress: '192.168.1.105',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15',
    result: ActionResult.FAILURE,
    logLevel: LogLevel.WARNING,
    description: 'Failed login attempt - invalid password',
    errorMessage: 'Invalid credentials provided',
    sessionId: 'SESSION-002',
    requestId: 'REQ-002',
    hash: generateHash('AUDIT-002-LOGIN_FAILED-USR-002'),
  },
  {
    id: 'AUDIT-003',
    timestamp: new Date('2025-10-30T09:00:00Z'),
    category: ActivityCategory.AUTHENTICATION,
    action: ActionType.PASSWORD_CHANGE,
    entityType: EntityType.USER,
    entityId: 'USR-003',
    entityName: 'Mike Johnson',
    userId: 'USR-003',
    userName: 'Mike Johnson',
    userRole: 'Analyst',
    ipAddress: '192.168.1.110',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Firefox/119.0',
    result: ActionResult.SUCCESS,
    logLevel: LogLevel.INFO,
    duration: 2100,
    description: 'User changed their password',
    sessionId: 'SESSION-003',
    requestId: 'REQ-003',
    hash: generateHash('AUDIT-003-PASSWORD_CHANGE-USR-003'),
  },

  // Entity Management Activities
  {
    id: 'AUDIT-004',
    timestamp: new Date('2025-10-30T09:30:00Z'),
    category: ActivityCategory.ENTITY_MANAGEMENT,
    action: ActionType.ENTITY_CREATED,
    entityType: EntityType.ENTITY,
    entityId: 'ENT-101',
    entityName: 'ABC Investment Bank',
    userId: 'USR-001',
    userName: 'John Doe',
    userRole: 'Administrator',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/118.0.0.0',
    result: ActionResult.SUCCESS,
    logLevel: LogLevel.INFO,
    duration: 3500,
    description: 'New entity created: ABC Investment Bank',
    metadata: { entityType: 'Bank', riskRating: 'Medium' },
    changes: [],
    sessionId: 'SESSION-001',
    requestId: 'REQ-004',
    hash: generateHash('AUDIT-004-ENTITY_CREATED-ENT-101'),
  },
  {
    id: 'AUDIT-005',
    timestamp: new Date('2025-10-30T10:00:00Z'),
    category: ActivityCategory.ENTITY_MANAGEMENT,
    action: ActionType.RISK_RATING_CHANGED,
    entityType: EntityType.ENTITY,
    entityId: 'ENT-101',
    entityName: 'ABC Investment Bank',
    userId: 'USR-002',
    userName: 'Jane Smith',
    userRole: 'Compliance Officer',
    ipAddress: '192.168.1.105',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15',
    result: ActionResult.SUCCESS,
    logLevel: LogLevel.INFO,
    duration: 1800,
    description: 'Risk rating changed from Medium to High',
    metadata: { reason: 'Suspicious transaction patterns detected' },
    changes: [
      {
        id: 'CHG-001',
        auditLogId: 'AUDIT-005',
        timestamp: new Date('2025-10-30T10:00:00Z'),
        entityType: EntityType.ENTITY,
        entityId: 'ENT-101',
        entityName: 'ABC Investment Bank',
        fieldName: 'riskRating',
        fieldLabel: 'Risk Rating',
        oldValue: 'Medium',
        newValue: 'High',
        changeType: 'UPDATE',
        userId: 'USR-002',
        userName: 'Jane Smith',
      },
    ],
    sessionId: 'SESSION-002',
    requestId: 'REQ-005',
    hash: generateHash('AUDIT-005-RISK_RATING_CHANGED-ENT-101'),
  },
  {
    id: 'AUDIT-006',
    timestamp: new Date('2025-10-30T10:30:00Z'),
    category: ActivityCategory.ENTITY_MANAGEMENT,
    action: ActionType.ENTITY_SUSPENDED,
    entityType: EntityType.ENTITY,
    entityId: 'ENT-102',
    entityName: 'XYZ Securities',
    userId: 'USR-001',
    userName: 'John Doe',
    userRole: 'Administrator',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/118.0.0.0',
    result: ActionResult.SUCCESS,
    logLevel: LogLevel.WARNING,
    duration: 2200,
    description: 'Entity suspended due to compliance violations',
    metadata: { suspensionReason: 'Failed AML compliance audit', duration: '30 days' },
    sessionId: 'SESSION-001',
    requestId: 'REQ-006',
    hash: generateHash('AUDIT-006-ENTITY_SUSPENDED-ENT-102'),
  },

  // Case Management Activities
  {
    id: 'AUDIT-007',
    timestamp: new Date('2025-10-30T11:00:00Z'),
    category: ActivityCategory.CASE_MANAGEMENT,
    action: ActionType.CASE_CREATED,
    entityType: EntityType.CASE,
    entityId: 'CASE-501',
    entityName: 'STR Investigation - ABC Bank',
    userId: 'USR-003',
    userName: 'Mike Johnson',
    userRole: 'Analyst',
    ipAddress: '192.168.1.110',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Firefox/119.0',
    result: ActionResult.SUCCESS,
    logLevel: LogLevel.INFO,
    duration: 4200,
    description: 'New investigation case created',
    metadata: { caseType: 'STR Review', priority: 'High', assignedTo: 'USR-002' },
    sessionId: 'SESSION-003',
    requestId: 'REQ-007',
    hash: generateHash('AUDIT-007-CASE_CREATED-CASE-501'),
  },
  {
    id: 'AUDIT-008',
    timestamp: new Date('2025-10-30T11:30:00Z'),
    category: ActivityCategory.CASE_MANAGEMENT,
    action: ActionType.DECISION_MADE,
    entityType: EntityType.CASE,
    entityId: 'CASE-501',
    entityName: 'STR Investigation - ABC Bank',
    userId: 'USR-002',
    userName: 'Jane Smith',
    userRole: 'Compliance Officer',
    ipAddress: '192.168.1.105',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15',
    result: ActionResult.SUCCESS,
    logLevel: LogLevel.INFO,
    duration: 2800,
    description: 'Decision made: Escalate to law enforcement',
    metadata: { decision: 'ESCALATE', rationale: 'Evidence of money laundering' },
    sessionId: 'SESSION-002',
    requestId: 'REQ-008',
    hash: generateHash('AUDIT-008-DECISION_MADE-CASE-501'),
  },

  // Data Access & Modification
  {
    id: 'AUDIT-009',
    timestamp: new Date('2025-10-30T12:00:00Z'),
    category: ActivityCategory.DATA_ACCESS,
    action: ActionType.READ,
    entityType: EntityType.REPORT,
    entityId: 'RPT-201',
    entityName: 'Q3 2025 Compliance Report',
    userId: 'USR-004',
    userName: 'Sarah Williams',
    userRole: 'Auditor',
    ipAddress: '192.168.1.120',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/118.0.0.0',
    result: ActionResult.SUCCESS,
    logLevel: LogLevel.INFO,
    duration: 850,
    description: 'User accessed compliance report',
    metadata: { reportType: 'Compliance', quarter: 'Q3', year: 2025 },
    sessionId: 'SESSION-004',
    requestId: 'REQ-009',
    hash: generateHash('AUDIT-009-READ-RPT-201'),
  },
  {
    id: 'AUDIT-010',
    timestamp: new Date('2025-10-30T12:30:00Z'),
    category: ActivityCategory.DATA_MODIFICATION,
    action: ActionType.UPDATE,
    entityType: EntityType.THRESHOLD,
    entityId: 'THR-301',
    entityName: 'Transaction Monitoring Threshold',
    userId: 'USR-001',
    userName: 'John Doe',
    userRole: 'Administrator',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/118.0.0.0',
    result: ActionResult.SUCCESS,
    logLevel: LogLevel.WARNING,
    duration: 1950,
    description: 'Threshold value updated',
    metadata: { thresholdType: 'Transaction Amount', currency: 'USD' },
    changes: [
      {
        id: 'CHG-002',
        auditLogId: 'AUDIT-010',
        timestamp: new Date('2025-10-30T12:30:00Z'),
        entityType: EntityType.THRESHOLD,
        entityId: 'THR-301',
        entityName: 'Transaction Monitoring Threshold',
        fieldName: 'amount',
        fieldLabel: 'Threshold Amount',
        oldValue: 10000,
        newValue: 15000,
        changeType: 'UPDATE',
        userId: 'USR-001',
        userName: 'John Doe',
      },
    ],
    sessionId: 'SESSION-001',
    requestId: 'REQ-010',
    hash: generateHash('AUDIT-010-UPDATE-THR-301'),
  },

  // Report & Export Activities
  {
    id: 'AUDIT-011',
    timestamp: new Date('2025-10-30T13:00:00Z'),
    category: ActivityCategory.REPORT_GENERATION,
    action: ActionType.REPORT_GENERATED,
    entityType: EntityType.REPORT,
    entityId: 'RPT-202',
    entityName: 'Monthly Risk Assessment Report',
    userId: 'USR-002',
    userName: 'Jane Smith',
    userRole: 'Compliance Officer',
    ipAddress: '192.168.1.105',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15',
    result: ActionResult.SUCCESS,
    logLevel: LogLevel.INFO,
    duration: 8500,
    description: 'Generated monthly risk assessment report',
    metadata: { reportFormat: 'PDF', pages: 45, entities: 120 },
    sessionId: 'SESSION-002',
    requestId: 'REQ-011',
    hash: generateHash('AUDIT-011-REPORT_GENERATED-RPT-202'),
  },
  {
    id: 'AUDIT-012',
    timestamp: new Date('2025-10-30T13:30:00Z'),
    category: ActivityCategory.EXPORT,
    action: ActionType.DATA_EXPORTED,
    entityType: EntityType.ENTITY,
    entityId: null,
    entityName: 'Entity List Export',
    userId: 'USR-004',
    userName: 'Sarah Williams',
    userRole: 'Auditor',
    ipAddress: '192.168.1.120',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/118.0.0.0',
    result: ActionResult.SUCCESS,
    logLevel: LogLevel.INFO,
    duration: 3200,
    description: 'Exported entity list to Excel',
    metadata: { format: 'Excel', records: 250, filters: 'High Risk Only' },
    sessionId: 'SESSION-004',
    requestId: 'REQ-012',
    hash: generateHash('AUDIT-012-DATA_EXPORTED'),
  },

  // User Management
  {
    id: 'AUDIT-013',
    timestamp: new Date('2025-10-30T14:00:00Z'),
    category: ActivityCategory.USER_MANAGEMENT,
    action: ActionType.USER_CREATED,
    entityType: EntityType.USER,
    entityId: 'USR-005',
    entityName: 'David Brown',
    userId: 'USR-001',
    userName: 'John Doe',
    userRole: 'Administrator',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/118.0.0.0',
    result: ActionResult.SUCCESS,
    logLevel: LogLevel.INFO,
    duration: 2700,
    description: 'New user account created',
    metadata: { role: 'Analyst', department: 'AML Unit' },
    sessionId: 'SESSION-001',
    requestId: 'REQ-013',
    hash: generateHash('AUDIT-013-USER_CREATED-USR-005'),
  },
  {
    id: 'AUDIT-014',
    timestamp: new Date('2025-10-30T14:30:00Z'),
    category: ActivityCategory.USER_MANAGEMENT,
    action: ActionType.USER_ROLE_CHANGED,
    entityType: EntityType.USER,
    entityId: 'USR-003',
    entityName: 'Mike Johnson',
    userId: 'USR-001',
    userName: 'John Doe',
    userRole: 'Administrator',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/118.0.0.0',
    result: ActionResult.SUCCESS,
    logLevel: LogLevel.WARNING,
    duration: 1600,
    description: 'User role changed',
    metadata: { reason: 'Promotion' },
    changes: [
      {
        id: 'CHG-003',
        auditLogId: 'AUDIT-014',
        timestamp: new Date('2025-10-30T14:30:00Z'),
        entityType: EntityType.USER,
        entityId: 'USR-003',
        entityName: 'Mike Johnson',
        fieldName: 'role',
        fieldLabel: 'User Role',
        oldValue: 'Analyst',
        newValue: 'Senior Analyst',
        changeType: 'UPDATE',
        userId: 'USR-001',
        userName: 'John Doe',
      },
    ],
    sessionId: 'SESSION-001',
    requestId: 'REQ-014',
    hash: generateHash('AUDIT-014-USER_ROLE_CHANGED-USR-003'),
  },

  // System Configuration
  {
    id: 'AUDIT-015',
    timestamp: new Date('2025-10-30T15:00:00Z'),
    category: ActivityCategory.SYSTEM_CONFIGURATION,
    action: ActionType.SYSTEM_CONFIG_CHANGED,
    entityType: EntityType.CONFIGURATION,
    entityId: 'CFG-001',
    entityName: 'Email Notification Settings',
    userId: 'USR-001',
    userName: 'John Doe',
    userRole: 'Administrator',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/118.0.0.0',
    result: ActionResult.SUCCESS,
    logLevel: LogLevel.WARNING,
    duration: 2100,
    description: 'System configuration updated',
    metadata: { configType: 'Notifications' },
    changes: [
      {
        id: 'CHG-004',
        auditLogId: 'AUDIT-015',
        timestamp: new Date('2025-10-30T15:00:00Z'),
        entityType: EntityType.CONFIGURATION,
        entityId: 'CFG-001',
        entityName: 'Email Notification Settings',
        fieldName: 'emailEnabled',
        fieldLabel: 'Email Notifications',
        oldValue: false,
        newValue: true,
        changeType: 'UPDATE',
        userId: 'USR-001',
        userName: 'John Doe',
      },
    ],
    sessionId: 'SESSION-001',
    requestId: 'REQ-015',
    hash: generateHash('AUDIT-015-SYSTEM_CONFIG_CHANGED-CFG-001'),
  },

  // Error/Critical Events
  {
    id: 'AUDIT-016',
    timestamp: new Date('2025-10-30T15:30:00Z'),
    category: ActivityCategory.DATA_MODIFICATION,
    action: ActionType.BULK_DELETE,
    entityType: EntityType.DOCUMENT,
    entityId: null,
    entityName: 'Bulk Document Deletion',
    userId: 'USR-002',
    userName: 'Jane Smith',
    userRole: 'Compliance Officer',
    ipAddress: '192.168.1.105',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15',
    result: ActionResult.FAILURE,
    logLevel: LogLevel.ERROR,
    duration: 1200,
    description: 'Failed to delete documents in bulk',
    errorMessage: 'Permission denied: Cannot delete documents older than 30 days',
    metadata: { attemptedCount: 15, deletedCount: 0 },
    sessionId: 'SESSION-002',
    requestId: 'REQ-016',
    hash: generateHash('AUDIT-016-BULK_DELETE'),
  },
  {
    id: 'AUDIT-017',
    timestamp: new Date('2025-10-30T16:00:00Z'),
    category: ActivityCategory.AUTHORIZATION,
    action: ActionType.READ,
    entityType: EntityType.CASE,
    entityId: 'CASE-502',
    entityName: 'Confidential Investigation',
    userId: 'USR-003',
    userName: 'Mike Johnson',
    userRole: 'Senior Analyst',
    ipAddress: '192.168.1.110',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Firefox/119.0',
    result: ActionResult.FAILURE,
    logLevel: LogLevel.CRITICAL,
    duration: 450,
    description: 'Unauthorized access attempt to confidential case',
    errorMessage: 'Access denied: User does not have required clearance level',
    metadata: { requiredClearance: 'TOP_SECRET', userClearance: 'CONFIDENTIAL' },
    sessionId: 'SESSION-003',
    requestId: 'REQ-017',
    hash: generateHash('AUDIT-017-READ-CASE-502'),
  },

  // File Operations
  {
    id: 'AUDIT-018',
    timestamp: new Date('2025-10-30T16:30:00Z'),
    category: ActivityCategory.DATA_ACCESS,
    action: ActionType.FILE_UPLOADED,
    entityType: EntityType.DOCUMENT,
    entityId: 'DOC-401',
    entityName: 'Entity License Application.pdf',
    userId: 'USR-005',
    userName: 'David Brown',
    userRole: 'Analyst',
    ipAddress: '192.168.1.130',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/118.0.0.0',
    result: ActionResult.SUCCESS,
    logLevel: LogLevel.INFO,
    duration: 5800,
    description: 'Document uploaded successfully',
    metadata: { fileSize: '2.4 MB', fileType: 'PDF', entityId: 'ENT-103' },
    sessionId: 'SESSION-005',
    requestId: 'REQ-018',
    hash: generateHash('AUDIT-018-FILE_UPLOADED-DOC-401'),
  },
  {
    id: 'AUDIT-019',
    timestamp: new Date('2025-10-30T17:00:00Z'),
    category: ActivityCategory.DATA_ACCESS,
    action: ActionType.FILE_DOWNLOADED,
    entityType: EntityType.DOCUMENT,
    entityId: 'DOC-402',
    entityName: 'STR Report Template.xlsx',
    userId: 'USR-004',
    userName: 'Sarah Williams',
    userRole: 'Auditor',
    ipAddress: '192.168.1.120',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/118.0.0.0',
    result: ActionResult.SUCCESS,
    logLevel: LogLevel.INFO,
    duration: 1200,
    description: 'Document downloaded',
    metadata: { fileSize: '156 KB', fileType: 'Excel' },
    sessionId: 'SESSION-004',
    requestId: 'REQ-019',
    hash: generateHash('AUDIT-019-FILE_DOWNLOADED-DOC-402'),
  },

  // Compliance Activities
  {
    id: 'AUDIT-020',
    timestamp: new Date('2025-10-30T17:30:00Z'),
    category: ActivityCategory.COMPLIANCE,
    action: ActionType.COMPLIANCE_CHECK,
    entityType: EntityType.ENTITY,
    entityId: 'ENT-104',
    entityName: 'Global Finance Corp',
    userId: 'USR-002',
    userName: 'Jane Smith',
    userRole: 'Compliance Officer',
    ipAddress: '192.168.1.105',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15',
    result: ActionResult.SUCCESS,
    logLevel: LogLevel.INFO,
    duration: 4500,
    description: 'Compliance check completed',
    metadata: { checkType: 'Quarterly Review', score: 85, passed: true },
    sessionId: 'SESSION-002',
    requestId: 'REQ-020',
    hash: generateHash('AUDIT-020-COMPLIANCE_CHECK-ENT-104'),
  },
]

// Generate more logs for realistic pagination
for (let i = 21; i <= 150; i++) {
  const categories = Object.values(ActivityCategory)
  const actions = Object.values(ActionType)
  const entityTypes = Object.values(EntityType)
  const logLevels = Object.values(LogLevel)
  const results = Object.values(ActionResult)
  
  const category = categories[Math.floor(Math.random() * categories.length)]
  const action = actions[Math.floor(Math.random() * actions.length)]
  const entityType = entityTypes[Math.floor(Math.random() * entityTypes.length)]
  const logLevel = logLevels[Math.floor(Math.random() * logLevels.length)]
  const result = results[Math.floor(Math.random() * results.length)]
  
  const users = [
    { id: 'USR-001', name: 'John Doe', role: 'Administrator' },
    { id: 'USR-002', name: 'Jane Smith', role: 'Compliance Officer' },
    { id: 'USR-003', name: 'Mike Johnson', role: 'Senior Analyst' },
    { id: 'USR-004', name: 'Sarah Williams', role: 'Auditor' },
    { id: 'USR-005', name: 'David Brown', role: 'Analyst' },
  ]
  const user = users[Math.floor(Math.random() * users.length)]
  
  const daysAgo = Math.floor(Math.random() * 30)
  const hoursAgo = Math.floor(Math.random() * 24)
  const timestamp = new Date()
  timestamp.setDate(timestamp.getDate() - daysAgo)
  timestamp.setHours(timestamp.getHours() - hoursAgo)
  
  mockAuditLogs.push({
    id: `AUDIT-${String(i).padStart(3, '0')}`,
    timestamp,
    category,
    action,
    entityType,
    entityId: `${entityType.substring(0, 3)}-${Math.floor(Math.random() * 999)}`,
    entityName: `${entityType} ${Math.floor(Math.random() * 999)}`,
    userId: user.id,
    userName: user.name,
    userRole: user.role,
    ipAddress: randomIp(),
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/118.0.0.0',
    result,
    logLevel,
    duration: Math.floor(Math.random() * 5000) + 500,
    description: `${action} operation on ${entityType}`,
    metadata: { generated: true },
    sessionId: `SESSION-${Math.floor(Math.random() * 10) + 1}`,
    requestId: `REQ-${String(i).padStart(3, '0')}`,
    hash: generateHash(`AUDIT-${String(i).padStart(3, '0')}-${action}-${entityType}`),
  })
}

// ============================================================
// LOGIN HISTORY
// ============================================================

export const mockLoginHistory: LoginHistory[] = [
  {
    id: 'LOGIN-001',
    userId: 'USR-001',
    userName: 'John Doe',
    userRole: 'Administrator',
    loginTime: new Date('2025-10-30T08:30:00Z'),
    logoutTime: new Date('2025-10-30T17:45:00Z'),
    duration: 555,
    ipAddress: '192.168.1.100',
    location: 'Harare, Zimbabwe',
    device: 'Windows Desktop',
    browser: 'Chrome 118',
    osName: 'Windows 11',
    result: ActionResult.SUCCESS,
    sessionId: 'SESSION-001',
    isActive: false,
  },
  {
    id: 'LOGIN-002',
    userId: 'USR-002',
    userName: 'Jane Smith',
    userRole: 'Compliance Officer',
    loginTime: new Date('2025-10-30T08:15:00Z'),
    logoutTime: null,
    duration: null,
    ipAddress: '192.168.1.105',
    location: 'Harare, Zimbabwe',
    device: 'MacBook Pro',
    browser: 'Safari 17',
    osName: 'macOS 14',
    result: ActionResult.FAILURE,
    failureReason: 'Invalid password',
    sessionId: 'SESSION-002-FAILED',
    isActive: false,
  },
  {
    id: 'LOGIN-003',
    userId: 'USR-002',
    userName: 'Jane Smith',
    userRole: 'Compliance Officer',
    loginTime: new Date('2025-10-30T08:20:00Z'),
    logoutTime: null,
    duration: null,
    ipAddress: '192.168.1.105',
    location: 'Harare, Zimbabwe',
    device: 'MacBook Pro',
    browser: 'Safari 17',
    osName: 'macOS 14',
    result: ActionResult.SUCCESS,
    sessionId: 'SESSION-002',
    isActive: true,
  },
  {
    id: 'LOGIN-004',
    userId: 'USR-003',
    userName: 'Mike Johnson',
    userRole: 'Senior Analyst',
    loginTime: new Date('2025-10-30T09:00:00Z'),
    logoutTime: null,
    duration: null,
    ipAddress: '192.168.1.110',
    location: 'Bulawayo, Zimbabwe',
    device: 'Windows Laptop',
    browser: 'Firefox 119',
    osName: 'Windows 10',
    result: ActionResult.SUCCESS,
    sessionId: 'SESSION-003',
    isActive: true,
  },
  {
    id: 'LOGIN-005',
    userId: 'USR-004',
    userName: 'Sarah Williams',
    userRole: 'Auditor',
    loginTime: new Date('2025-10-30T09:30:00Z'),
    logoutTime: new Date('2025-10-30T16:00:00Z'),
    duration: 390,
    ipAddress: '192.168.1.120',
    location: 'Harare, Zimbabwe',
    device: 'Windows Desktop',
    browser: 'Edge 118',
    osName: 'Windows 11',
    result: ActionResult.SUCCESS,
    sessionId: 'SESSION-004',
    isActive: false,
  },
  {
    id: 'LOGIN-006',
    userId: 'USR-005',
    userName: 'David Brown',
    userRole: 'Analyst',
    loginTime: new Date('2025-10-30T10:00:00Z'),
    logoutTime: null,
    duration: null,
    ipAddress: '192.168.1.130',
    location: 'Harare, Zimbabwe',
    device: 'Windows Laptop',
    browser: 'Chrome 118',
    osName: 'Windows 11',
    result: ActionResult.SUCCESS,
    sessionId: 'SESSION-005',
    isActive: true,
  },
]

// ============================================================
// DATA CHANGES
// ============================================================

export const mockDataChanges: DataChange[] = mockAuditLogs
  .filter(log => log.changes && log.changes.length > 0)
  .flatMap(log => log.changes!)

// ============================================================
// USER ACTIONS
// ============================================================

export const mockUserActions: UserAction[] = mockAuditLogs.map(log => ({
  id: `UA-${log.id.split('-')[1]}`,
  auditLogId: log.id,
  timestamp: log.timestamp,
  userId: log.userId,
  userName: log.userName,
  action: log.action,
  module: log.category,
  feature: log.entityType,
  details: log.description,
  ipAddress: log.ipAddress,
  location: 'Harare, Zimbabwe',
  device: 'Desktop',
  browser: 'Chrome',
  duration: log.duration,
}))

// ============================================================
// DASHBOARD METRICS
// ============================================================

export const mockDashboardMetrics: AuditDashboardMetrics = {
  totalLogs: mockAuditLogs.length,
  last24Hours: mockAuditLogs.filter(log => {
    const dayAgo = new Date()
    dayAgo.setHours(dayAgo.getHours() - 24)
    return log.timestamp >= dayAgo
  }).length,
  lastWeek: mockAuditLogs.filter(log => {
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return log.timestamp >= weekAgo
  }).length,
  lastMonth: mockAuditLogs.length,
  criticalEvents: mockAuditLogs.filter(log => log.logLevel === LogLevel.CRITICAL).length,
  errorEvents: mockAuditLogs.filter(log => log.logLevel === LogLevel.ERROR).length,
  warningEvents: mockAuditLogs.filter(log => log.logLevel === LogLevel.WARNING).length,
  successfulActions: mockAuditLogs.filter(log => log.result === ActionResult.SUCCESS).length,
  failedActions: mockAuditLogs.filter(log => log.result === ActionResult.FAILURE).length,
  activeUsers: 3,
  activeSessions: 3,
  dataChanges: mockDataChanges.length,
  loginAttempts: mockLoginHistory.length,
  failedLoginAttempts: mockLoginHistory.filter(login => login.result === ActionResult.FAILURE).length,
  topUsers: [
    { userId: 'USR-001', userName: 'John Doe', actionCount: 45 },
    { userId: 'USR-002', userName: 'Jane Smith', actionCount: 38 },
    { userId: 'USR-003', userName: 'Mike Johnson', actionCount: 32 },
    { userId: 'USR-004', userName: 'Sarah Williams', actionCount: 28 },
    { userId: 'USR-005', userName: 'David Brown', actionCount: 15 },
  ],
  topActions: [
    { action: ActionType.READ, count: 42 },
    { action: ActionType.UPDATE, count: 28 },
    { action: ActionType.CREATE, count: 25 },
    { action: ActionType.LOGIN, count: 18 },
    { action: ActionType.DELETE, count: 12 },
  ],
  topEntities: [
    { entityType: EntityType.ENTITY, count: 38 },
    { entityType: EntityType.CASE, count: 32 },
    { entityType: EntityType.USER, count: 25 },
    { entityType: EntityType.REPORT, count: 22 },
    { entityType: EntityType.DOCUMENT, count: 18 },
  ],
  activityTrend: Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (29 - i))
    return {
      date: date.toISOString().split('T')[0],
      count: Math.floor(Math.random() * 50) + 10,
    }
  }),
  categoryDistribution: [
    { category: ActivityCategory.DATA_ACCESS, count: 45, percentage: 30 },
    { category: ActivityCategory.ENTITY_MANAGEMENT, count: 38, percentage: 25 },
    { category: ActivityCategory.CASE_MANAGEMENT, count: 30, percentage: 20 },
    { category: ActivityCategory.AUTHENTICATION, count: 22, percentage: 15 },
    { category: ActivityCategory.USER_MANAGEMENT, count: 15, percentage: 10 },
  ],
  resultDistribution: [
    { result: ActionResult.SUCCESS, count: 135, percentage: 90 },
    { result: ActionResult.FAILURE, count: 12, percentage: 8 },
    { result: ActionResult.PARTIAL, count: 2, percentage: 1.3 },
    { result: ActionResult.PENDING, count: 1, percentage: 0.7 },
  ],
}

// ============================================================
// RETENTION POLICIES
// ============================================================

export const mockRetentionPolicies: RetentionPolicy[] = [
  {
    id: 'RET-001',
    category: ActivityCategory.AUTHENTICATION,
    entityType: null,
    logLevel: null,
    retentionPeriod: RetentionPeriod.YEAR_1,
    retentionDays: 365,
    autoArchive: true,
    archiveLocation: 's3://audit-archive/authentication',
    autoDelete: false,
    isActive: true,
    createdAt: new Date('2025-01-01T00:00:00Z'),
    updatedAt: new Date('2025-01-01T00:00:00Z'),
    createdBy: 'USR-001',
    updatedBy: 'USR-001',
  },
  {
    id: 'RET-002',
    category: ActivityCategory.DATA_MODIFICATION,
    entityType: null,
    logLevel: null,
    retentionPeriod: RetentionPeriod.YEARS_7,
    retentionDays: 2555,
    autoArchive: true,
    archiveLocation: 's3://audit-archive/data-changes',
    autoDelete: false,
    isActive: true,
    createdAt: new Date('2025-01-01T00:00:00Z'),
    updatedAt: new Date('2025-01-01T00:00:00Z'),
    createdBy: 'USR-001',
    updatedBy: 'USR-001',
  },
  {
    id: 'RET-003',
    category: ActivityCategory.COMPLIANCE,
    entityType: null,
    logLevel: null,
    retentionPeriod: RetentionPeriod.YEARS_10,
    retentionDays: 3650,
    autoArchive: true,
    archiveLocation: 's3://audit-archive/compliance',
    autoDelete: false,
    isActive: true,
    createdAt: new Date('2025-01-01T00:00:00Z'),
    updatedAt: new Date('2025-01-01T00:00:00Z'),
    createdBy: 'USR-001',
    updatedBy: 'USR-001',
  },
  {
    id: 'RET-004',
    category: ActivityCategory.SYSTEM_CONFIGURATION,
    entityType: null,
    logLevel: null,
    retentionPeriod: RetentionPeriod.PERMANENT,
    retentionDays: -1,
    autoArchive: true,
    archiveLocation: 's3://audit-archive/system-config',
    autoDelete: false,
    isActive: true,
    createdAt: new Date('2025-01-01T00:00:00Z'),
    updatedAt: new Date('2025-01-01T00:00:00Z'),
    createdBy: 'USR-001',
    updatedBy: 'USR-001',
  },
  {
    id: 'RET-005',
    category: ActivityCategory.DATA_ACCESS,
    entityType: null,
    logLevel: LogLevel.DEBUG,
    retentionPeriod: RetentionPeriod.DAYS_30,
    retentionDays: 30,
    autoArchive: false,
    autoDelete: true,
    isActive: true,
    createdAt: new Date('2025-01-01T00:00:00Z'),
    updatedAt: new Date('2025-01-01T00:00:00Z'),
    createdBy: 'USR-001',
    updatedBy: 'USR-001',
  },
]

// ============================================================
// ACTIVITY HEATMAP
// ============================================================

export const mockActivityHeatmap: ActivityHeatmap[] = []
for (let day = 0; day < 7; day++) {
  const date = new Date()
  date.setDate(date.getDate() - (6 - day))
  const dateStr = date.toISOString().split('T')[0]
  
  for (let hour = 0; hour < 24; hour++) {
    const activityCount = hour >= 8 && hour <= 17 
      ? Math.floor(Math.random() * 50) + 20 
      : Math.floor(Math.random() * 10)
    
    let intensity: 'low' | 'medium' | 'high' | 'very-high'
    if (activityCount < 10) intensity = 'low'
    else if (activityCount < 30) intensity = 'medium'
    else if (activityCount < 50) intensity = 'high'
    else intensity = 'very-high'
    
    mockActivityHeatmap.push({
      date: dateStr,
      hour,
      activityCount,
      intensity,
    })
  }
}

// ============================================================
// USER ACTIVITY PROFILES
// ============================================================

export const mockUserActivityProfiles: UserActivityProfile[] = [
  {
    userId: 'USR-001',
    userName: 'John Doe',
    userRole: 'Administrator',
    totalActions: 45,
    lastActive: new Date('2025-10-30T17:45:00Z'),
    mostCommonAction: ActionType.UPDATE,
    mostCommonCategory: ActivityCategory.SYSTEM_CONFIGURATION,
    averageSessionDuration: 480,
    failedLoginAttempts: 0,
    riskScore: 15,
    activityPattern: Array.from({ length: 24 }, (_, hour) => ({
      hour,
      count: hour >= 8 && hour <= 17 ? Math.floor(Math.random() * 5) + 1 : 0,
    })),
  },
  {
    userId: 'USR-002',
    userName: 'Jane Smith',
    userRole: 'Compliance Officer',
    totalActions: 38,
    lastActive: new Date('2025-10-30T18:00:00Z'),
    mostCommonAction: ActionType.READ,
    mostCommonCategory: ActivityCategory.COMPLIANCE,
    averageSessionDuration: 420,
    failedLoginAttempts: 1,
    riskScore: 25,
    activityPattern: Array.from({ length: 24 }, (_, hour) => ({
      hour,
      count: hour >= 8 && hour <= 17 ? Math.floor(Math.random() * 4) + 1 : 0,
    })),
  },
  {
    userId: 'USR-003',
    userName: 'Mike Johnson',
    userRole: 'Senior Analyst',
    totalActions: 32,
    lastActive: new Date('2025-10-30T17:30:00Z'),
    mostCommonAction: ActionType.CREATE,
    mostCommonCategory: ActivityCategory.CASE_MANAGEMENT,
    averageSessionDuration: 450,
    failedLoginAttempts: 0,
    riskScore: 10,
    activityPattern: Array.from({ length: 24 }, (_, hour) => ({
      hour,
      count: hour >= 9 && hour <= 18 ? Math.floor(Math.random() * 3) + 1 : 0,
    })),
  },
  {
    userId: 'USR-004',
    userName: 'Sarah Williams',
    userRole: 'Auditor',
    totalActions: 28,
    lastActive: new Date('2025-10-30T16:00:00Z'),
    mostCommonAction: ActionType.READ,
    mostCommonCategory: ActivityCategory.DATA_ACCESS,
    averageSessionDuration: 360,
    failedLoginAttempts: 0,
    riskScore: 5,
    activityPattern: Array.from({ length: 24 }, (_, hour) => ({
      hour,
      count: hour >= 9 && hour <= 16 ? Math.floor(Math.random() * 3) + 1 : 0,
    })),
  },
  {
    userId: 'USR-005',
    userName: 'David Brown',
    userRole: 'Analyst',
    totalActions: 15,
    lastActive: new Date('2025-10-30T17:00:00Z'),
    mostCommonAction: ActionType.FILE_UPLOADED,
    mostCommonCategory: ActivityCategory.DATA_ACCESS,
    averageSessionDuration: 300,
    failedLoginAttempts: 0,
    riskScore: 8,
    activityPattern: Array.from({ length: 24 }, (_, hour) => ({
      hour,
      count: hour >= 10 && hour <= 17 ? Math.floor(Math.random() * 2) : 0,
    })),
  },
]

// ============================================================
// FORENSIC CASES
// ============================================================

export const mockForensicCases: ForensicCase[] = [
  {
    id: 'FOR-001',
    title: 'Unauthorized Access Investigation',
    description: 'Investigation of multiple failed login attempts followed by successful access to restricted resources',
    category: 'Security Breach',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    investigator: 'USR-004',
    startDate: new Date('2025-10-25T00:00:00Z'),
    endDate: null,
    relatedLogIds: ['AUDIT-017', 'AUDIT-002'],
    relatedUserIds: ['USR-003'],
    findings: 'User attempted to access confidential case without proper clearance',
    recommendations: 'Review user permissions and implement additional access controls',
    createdAt: new Date('2025-10-25T00:00:00Z'),
    updatedAt: new Date('2025-10-30T10:00:00Z'),
  },
  {
    id: 'FOR-002',
    title: 'Bulk Data Export Anomaly',
    description: 'Unusual pattern of large data exports detected',
    category: 'Data Exfiltration',
    priority: 'CRITICAL',
    status: 'OPEN',
    investigator: 'USR-001',
    startDate: new Date('2025-10-28T00:00:00Z'),
    endDate: null,
    relatedLogIds: ['AUDIT-012'],
    relatedUserIds: ['USR-004'],
    findings: 'Under investigation',
    recommendations: 'Pending',
    createdAt: new Date('2025-10-28T00:00:00Z'),
    updatedAt: new Date('2025-10-28T00:00:00Z'),
  },
]

// ============================================================
// AUDIT ANOMALIES
// ============================================================

export const mockAuditAnomalies: AuditAnomaly[] = [
  {
    id: 'ANO-001',
    type: 'UNUSUAL_ACTIVITY',
    severity: LogLevel.WARNING,
    description: 'User accessed system from unusual location',
    detectedAt: new Date('2025-10-30T12:00:00Z'),
    affectedLogs: ['AUDIT-009'],
    affectedUsers: ['USR-004'],
    riskScore: 65,
    recommendations: ['Verify user identity', 'Enable two-factor authentication'],
  },
  {
    id: 'ANO-002',
    type: 'SUSPICIOUS_PATTERN',
    severity: LogLevel.CRITICAL,
    description: 'Multiple failed login attempts followed by password reset',
    detectedAt: new Date('2025-10-30T08:30:00Z'),
    affectedLogs: ['AUDIT-002', 'AUDIT-003'],
    affectedUsers: ['USR-002', 'USR-003'],
    riskScore: 85,
    recommendations: ['Review user account security', 'Investigate potential compromise'],
  },
  {
    id: 'ANO-003',
    type: 'THRESHOLD_BREACH',
    severity: LogLevel.ERROR,
    description: 'Threshold modification exceeds acceptable range',
    detectedAt: new Date('2025-10-30T12:30:00Z'),
    affectedLogs: ['AUDIT-010'],
    affectedUsers: ['USR-001'],
    riskScore: 75,
    recommendations: ['Verify business justification', 'Obtain supervisor approval'],
  },
]

// ============================================================
// AUDIT STATISTICS
// ============================================================

export const mockAuditStatistics: AuditStatistics = {
  period: 'Last 30 Days',
  totalActions: mockAuditLogs.length,
  successfulActions: mockAuditLogs.filter(log => log.result === ActionResult.SUCCESS).length,
  failedActions: mockAuditLogs.filter(log => log.result === ActionResult.FAILURE).length,
  uniqueUsers: 5,
  uniqueSessions: 10,
  dataChanges: mockDataChanges.length,
  criticalEvents: mockAuditLogs.filter(log => log.logLevel === LogLevel.CRITICAL).length,
  averageDuration: 2500,
  peakHour: '10:00 - 11:00',
  mostActiveUser: 'John Doe',
  mostCommonAction: ActionType.READ,
}
