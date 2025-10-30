/**
 * Supervisor Dashboard Module - Validation Schemas
 * 
 * Zod validation schemas for data integrity and type safety
 * Covers all requirements SUP-DASH-001 to SUP-DASH-015
 */

import { z } from 'zod'
import {
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
  QuickActionType,
  DeficiencySeverity,
  DeficiencyStatus,
  NotificationType,
  NotificationPriority
} from '@/types/supervisorDashboard'

// ============================================================================
// ENUM SCHEMAS
// ============================================================================

export const entityTypeSchema = z.nativeEnum(EntityType)
export const riskLevelSchema = z.nativeEnum(RiskLevel)
export const complianceStatusSchema = z.nativeEnum(ComplianceStatus)
export const taskTypeSchema = z.nativeEnum(TaskType)
export const taskPrioritySchema = z.nativeEnum(TaskPriority)
export const taskStatusSchema = z.nativeEnum(TaskStatus)
export const alertTypeSchema = z.nativeEnum(AlertType)
export const alertReviewStatusSchema = z.nativeEnum(AlertReviewStatus)
export const inspectionTypeSchema = z.nativeEnum(InspectionType)
export const inspectionStatusSchema = z.nativeEnum(InspectionStatus)
export const quickActionTypeSchema = z.nativeEnum(QuickActionType)
export const deficiencySeveritySchema = z.nativeEnum(DeficiencySeverity)
export const deficiencyStatusSchema = z.nativeEnum(DeficiencyStatus)
export const notificationTypeSchema = z.nativeEnum(NotificationType)
export const notificationPrioritySchema = z.nativeEnum(NotificationPriority)

// ============================================================================
// ENTITY SCHEMAS (SUP-DASH-001, SUP-DASH-010)
// ============================================================================

export const supervisedEntitySchema = z.object({
  id: z.string().min(1, 'Entity ID is required'),
  name: z.string().min(2, 'Entity name must be at least 2 characters'),
  entityType: entityTypeSchema,
  licenseNumber: z.string().min(1, 'License number is required'),
  riskLevel: riskLevelSchema,
  complianceStatus: complianceStatusSchema,
  supervisorId: z.string().min(1, 'Supervisor ID is required'),
  supervisorName: z.string().min(1, 'Supervisor name is required'),
  registrationDate: z.date(),
  lastInspectionDate: z.date().nullable(),
  nextInspectionDue: z.date().nullable(),
  pendingApplications: z.number().int().min(0),
  openDeficiencies: z.number().int().min(0),
  contactPerson: z.string().min(1, 'Contact person is required'),
  contactEmail: z.string().email('Invalid email address'),
  contactPhone: z.string().min(5, 'Invalid phone number'),
  address: z.string().min(5, 'Address is required'),
  totalAssets: z.number().positive().optional(),
  employeeCount: z.number().int().positive().optional(),
  branchCount: z.number().int().positive().optional(),
  isActive: z.boolean(),
  notes: z.string().optional()
})

export const entitySearchFiltersSchema = z.object({
  searchTerm: z.string().optional(),
  entityType: entityTypeSchema.optional(),
  riskLevel: riskLevelSchema.optional(),
  complianceStatus: complianceStatusSchema.optional(),
  hasOpenDeficiencies: z.boolean().optional(),
  inspectionsDue: z.boolean().optional()
})

// ============================================================================
// TASK SCHEMAS (SUP-DASH-002, SUP-DASH-003)
// ============================================================================

export const taskCommentSchema = z.object({
  id: z.string().min(1),
  taskId: z.string().min(1),
  userId: z.string().min(1),
  userName: z.string().min(1),
  comment: z.string().min(1, 'Comment cannot be empty'),
  timestamp: z.date()
})

export const pendingTaskSchema = z.object({
  id: z.string().min(1, 'Task ID is required'),
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  taskType: taskTypeSchema,
  priority: taskPrioritySchema,
  status: taskStatusSchema,
  entityId: z.string().min(1, 'Entity ID is required'),
  entityName: z.string().min(1, 'Entity name is required'),
  assignedTo: z.string().min(1, 'Assigned user is required'),
  dueDate: z.date(),
  createdDate: z.date(),
  completedDate: z.date().optional(),
  estimatedHours: z.number().positive().optional(),
  actualHours: z.number().positive().optional(),
  isOverdue: z.boolean(),
  isPriority: z.boolean(),
  relatedRecordId: z.string().optional(),
  attachments: z.array(z.string()).optional(),
  comments: z.array(taskCommentSchema).optional()
})

export const createTaskSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  taskType: taskTypeSchema,
  priority: taskPrioritySchema,
  entityId: z.string().min(1, 'Entity ID is required'),
  dueDate: z.date(),
  estimatedHours: z.number().positive().optional()
}).refine(
  (data) => data.dueDate > new Date(),
  {
    message: 'Due date must be in the future',
    path: ['dueDate']
  }
)

export const updateTaskStatusSchema = z.object({
  taskId: z.string().min(1, 'Task ID is required'),
  status: taskStatusSchema,
  actualHours: z.number().positive().optional(),
  comments: z.string().optional()
})

// ============================================================================
// ALERT SCHEMAS (SUP-DASH-004)
// ============================================================================

export const alertPartySchema = z.object({
  name: z.string().min(1, 'Party name is required'),
  role: z.enum(['Originator', 'Beneficiary', 'Intermediary']),
  accountNumber: z.string().optional(),
  identificationNumber: z.string().optional()
})

export const suspiciousActivityAlertSchema = z.object({
  id: z.string().min(1, 'Alert ID is required'),
  alertType: alertTypeSchema,
  entityId: z.string().min(1, 'Entity ID is required'),
  entityName: z.string().min(1, 'Entity name is required'),
  reportDate: z.date(),
  transactionDate: z.date(),
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().length(3, 'Currency must be 3 characters (e.g., USD)'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  reviewStatus: alertReviewStatusSchema,
  assignedTo: z.string().min(1, 'Assigned user is required'),
  priority: taskPrioritySchema,
  suspicionIndicators: z.array(z.string()).min(1, 'At least one suspicion indicator required'),
  involvedParties: z.array(alertPartySchema).min(1, 'At least one party must be involved'),
  reviewNotes: z.string().optional(),
  escalationReason: z.string().optional(),
  closureReason: z.string().optional(),
  reviewedBy: z.string().optional(),
  reviewedDate: z.date().optional()
})

export const reviewAlertSchema = z.object({
  alertId: z.string().min(1, 'Alert ID is required'),
  reviewStatus: alertReviewStatusSchema,
  reviewNotes: z.string().min(10, 'Review notes must be at least 10 characters'),
  escalationReason: z.string().optional(),
  closureReason: z.string().optional()
})

// ============================================================================
// INSPECTION SCHEMAS (SUP-DASH-005)
// ============================================================================

export const inspectionFindingSchema = z.object({
  id: z.string().min(1),
  category: z.string().min(1, 'Category is required'),
  severity: deficiencySeveritySchema,
  description: z.string().min(10, 'Description must be at least 10 characters'),
  recommendation: z.string().min(10, 'Recommendation must be at least 10 characters'),
  dueDate: z.date().optional()
})

export const inspectionScheduleSchema = z.object({
  id: z.string().min(1, 'Inspection ID is required'),
  entityId: z.string().min(1, 'Entity ID is required'),
  entityName: z.string().min(1, 'Entity name is required'),
  entityType: entityTypeSchema,
  inspectionType: inspectionTypeSchema,
  scheduledDate: z.date(),
  endDate: z.date().optional(),
  status: inspectionStatusSchema,
  leadInspector: z.string().min(1, 'Lead inspector is required'),
  inspectionTeam: z.array(z.string()).min(1, 'At least one team member required'),
  scope: z.string().min(10, 'Scope must be at least 10 characters'),
  location: z.string().min(5, 'Location is required'),
  preparationNotes: z.string().optional(),
  reportId: z.string().optional(),
  findings: z.array(inspectionFindingSchema).optional()
})

export const scheduleInspectionSchema = z.object({
  entityId: z.string().min(1, 'Entity ID is required'),
  inspectionType: inspectionTypeSchema,
  scheduledDate: z.date(),
  endDate: z.date().optional(),
  inspectionTeam: z.array(z.string()).min(1, 'At least one team member required'),
  scope: z.string().min(10, 'Scope must be at least 10 characters'),
  location: z.string().min(5, 'Location is required'),
  preparationNotes: z.string().optional()
}).refine(
  (data) => data.scheduledDate > new Date(),
  {
    message: 'Inspection date must be in the future',
    path: ['scheduledDate']
  }
).refine(
  (data) => !data.endDate || data.endDate > data.scheduledDate,
  {
    message: 'End date must be after start date',
    path: ['endDate']
  }
)

// ============================================================================
// DEFICIENCY SCHEMAS (SUP-DASH-012)
// ============================================================================

export const deficiencyRecordSchema = z.object({
  id: z.string().min(1, 'Deficiency ID is required'),
  entityId: z.string().min(1, 'Entity ID is required'),
  entityName: z.string().min(1, 'Entity name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  severity: deficiencySeveritySchema,
  status: deficiencyStatusSchema,
  identifiedDate: z.date(),
  dueDate: z.date(),
  resolvedDate: z.date().optional(),
  verifiedBy: z.string().optional(),
  verificationDate: z.date().optional(),
  category: z.string().min(1, 'Category is required'),
  correctiveAction: z.string().min(10, 'Corrective action must be at least 10 characters'),
  isOverdue: z.boolean()
})

export const createDeficiencySchema = z.object({
  entityId: z.string().min(1, 'Entity ID is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  severity: deficiencySeveritySchema,
  category: z.string().min(1, 'Category is required'),
  correctiveAction: z.string().min(10, 'Corrective action must be at least 10 characters'),
  dueDate: z.date()
}).refine(
  (data) => data.dueDate > new Date(),
  {
    message: 'Due date must be in the future',
    path: ['dueDate']
  }
)

export const updateDeficiencyStatusSchema = z.object({
  deficiencyId: z.string().min(1, 'Deficiency ID is required'),
  status: deficiencyStatusSchema,
  verificationNotes: z.string().optional()
})

// ============================================================================
// NOTIFICATION SCHEMAS (SUP-DASH-014)
// ============================================================================

export const notificationSchema = z.object({
  id: z.string().min(1, 'Notification ID is required'),
  type: notificationTypeSchema,
  priority: notificationPrioritySchema,
  title: z.string().min(3, 'Title must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  timestamp: z.date(),
  isRead: z.boolean(),
  actionUrl: z.string().optional(),
  actionLabel: z.string().optional(),
  relatedEntityId: z.string().optional(),
  relatedEntityName: z.string().optional(),
  senderId: z.string().optional(),
  senderName: z.string().optional()
})

export const createNotificationSchema = z.object({
  type: notificationTypeSchema,
  priority: notificationPrioritySchema,
  title: z.string().min(3, 'Title must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  recipientId: z.string().min(1, 'Recipient ID is required'),
  actionUrl: z.string().optional(),
  actionLabel: z.string().optional(),
  relatedEntityId: z.string().optional()
})

// ============================================================================
// QUICK ACTION SCHEMAS (SUP-DASH-008)
// ============================================================================

export const reportRequestSchema = z.object({
  reportType: z.enum(['entity', 'inspection', 'compliance', 'performance']),
  entityIds: z.array(z.string()).optional(),
  startDate: z.date(),
  endDate: z.date(),
  includeCharts: z.boolean().default(true),
  includeRawData: z.boolean().default(false),
  format: z.enum(['pdf', 'excel', 'csv'])
}).refine(
  (data) => data.endDate >= data.startDate,
  {
    message: 'End date must be after or equal to start date',
    path: ['endDate']
  }
).refine(
  (data) => {
    const daysDiff = (data.endDate.getTime() - data.startDate.getTime()) / (1000 * 60 * 60 * 24)
    return daysDiff <= 365
  },
  {
    message: 'Date range cannot exceed 365 days',
    path: ['endDate']
  }
)

export const noticeConfigSchema = z.object({
  entityId: z.string().min(1, 'Entity ID is required'),
  noticeType: z.enum(['inspection', 'deficiency', 'compliance', 'general']),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
  dueDate: z.date().optional(),
  requiresResponse: z.boolean().default(false)
}).refine(
  (data) => !data.dueDate || data.dueDate > new Date(),
  {
    message: 'Due date must be in the future',
    path: ['dueDate']
  }
)

export const applicationReviewSchema = z.object({
  id: z.string().min(1, 'Application ID is required'),
  entityId: z.string().min(1, 'Entity ID is required'),
  applicationType: z.enum(['new_license', 'renewal', 'amendment', 'transfer']),
  status: z.enum(['pending', 'under_review', 'approved', 'rejected']),
  reviewNotes: z.string().optional(),
  decision: z.string().optional()
})

export const approveApplicationSchema = z.object({
  applicationId: z.string().min(1, 'Application ID is required'),
  decision: z.enum(['approved', 'rejected']),
  reviewNotes: z.string().min(20, 'Review notes must be at least 20 characters'),
  conditions: z.array(z.string()).optional()
}).refine(
  (data) => {
    if (data.decision === 'rejected') {
      return data.reviewNotes.length >= 50
    }
    return true
  },
  {
    message: 'Rejection reason must be at least 50 characters',
    path: ['reviewNotes']
  }
)

// ============================================================================
// DASHBOARD STATE SCHEMAS
// ============================================================================

export const autoRefreshConfigSchema = z.object({
  enabled: z.boolean().default(true),
  interval: z.number().int().min(10000).max(300000).default(60000), // 10s to 5min
  lastRefresh: z.date().nullable()
})

export const timeRangeSchema = z.object({
  label: z.string().min(1),
  value: z.enum(['today', 'week', 'month', 'quarter', 'year', 'custom']),
  startDate: z.date(),
  endDate: z.date()
}).refine(
  (data) => data.endDate >= data.startDate,
  {
    message: 'End date must be after or equal to start date',
    path: ['endDate']
  }
)

export const dashboardStateSchema = z.object({
  selectedEntityId: z.string().nullable(),
  dateRange: z.object({
    start: z.date(),
    end: z.date()
  }),
  filters: entitySearchFiltersSchema,
  sortBy: z.string().default('name'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
  autoRefresh: autoRefreshConfigSchema
})

export const paginationConfigSchema = z.object({
  page: z.number().int().positive(),
  pageSize: z.number().int().min(10).max(100),
  totalItems: z.number().int().min(0),
  totalPages: z.number().int().min(0)
})

// ============================================================================
// EXPORT SCHEMAS
// ============================================================================

export const exportConfigSchema = z.object({
  filename: z.string().min(1, 'Filename is required'),
  format: z.enum(['csv', 'excel', 'pdf', 'json']),
  includeFilters: z.boolean().default(true),
  includeMetadata: z.boolean().default(true),
  dateRange: timeRangeSchema.optional()
})

// ============================================================================
// FORM VALIDATION HELPERS
// ============================================================================

/**
 * Validate entity search filters
 */
export function validateEntitySearch(data: unknown) {
  return entitySearchFiltersSchema.safeParse(data)
}

/**
 * Validate task creation
 */
export function validateTaskCreation(data: unknown) {
  return createTaskSchema.safeParse(data)
}

/**
 * Validate inspection scheduling
 */
export function validateInspectionSchedule(data: unknown) {
  return scheduleInspectionSchema.safeParse(data)
}

/**
 * Validate report request
 */
export function validateReportRequest(data: unknown) {
  return reportRequestSchema.safeParse(data)
}

/**
 * Validate notice configuration
 */
export function validateNoticeConfig(data: unknown) {
  return noticeConfigSchema.safeParse(data)
}

/**
 * Validate application approval
 */
export function validateApplicationApproval(data: unknown) {
  return approveApplicationSchema.safeParse(data)
}

/**
 * Validate alert review
 */
export function validateAlertReview(data: unknown) {
  return reviewAlertSchema.safeParse(data)
}

/**
 * Validate deficiency creation
 */
export function validateDeficiencyCreation(data: unknown) {
  return createDeficiencySchema.safeParse(data)
}

/**
 * Validate pagination parameters
 */
export function validatePagination(data: unknown) {
  return paginationConfigSchema.safeParse(data)
}

/**
 * Validate export configuration
 */
export function validateExportConfig(data: unknown) {
  return exportConfigSchema.safeParse(data)
}
