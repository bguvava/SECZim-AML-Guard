/**
 * Supervisor Dashboard Module - Type Definitions
 * 
 * Comprehensive TypeScript types for the Supervisor Dashboard module
 * Covers all requirements SUP-DASH-001 to SUP-DASH-015
 */

// ============================================================================
// ENUMS
// ============================================================================

/**
 * Entity risk levels for risk-based supervision
 */
export enum RiskLevel {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

/**
 * Compliance status categories
 */
export enum ComplianceStatus {
  COMPLIANT = 'Compliant',
  NEEDS_ATTENTION = 'Needs Attention',
  NON_COMPLIANT = 'Non-Compliant',
  UNDER_REVIEW = 'Under Review'
}

/**
 * Entity types supervised
 */
export enum EntityType {
  BANK = 'Bank',
  INSURANCE = 'Insurance Company',
  SECURITIES_DEALER = 'Securities Dealer',
  PENSION_FUND = 'Pension Fund',
  MICROFINANCE = 'Microfinance Institution',
  MONEY_TRANSFER = 'Money Transfer Service',
  BUREAU_DE_CHANGE = 'Bureau de Change',
  ASSET_MANAGER = 'Asset Manager',
  COLLECTIVE_INVESTMENT = 'Collective Investment Scheme',
  OTHER = 'Other'
}

/**
 * Task types for pending items (SUP-DASH-002)
 */
export enum TaskType {
  LICENSE_REVIEW = 'License Review',
  INSPECTION_REPORT = 'Inspection Report',
  STR_FOLLOWUP = 'STR Follow-up',
  CTR_REVIEW = 'CTR Review',
  RISK_ASSESSMENT = 'Risk Assessment',
  APPLICATION_REVIEW = 'Application Review',
  DEFICIENCY_VERIFICATION = 'Deficiency Verification',
  COMPLIANCE_CHECK = 'Compliance Check',
  DOCUMENT_REVIEW = 'Document Review',
  ENFORCEMENT_ACTION = 'Enforcement Action'
}

/**
 * Task priority levels (SUP-DASH-003)
 */
export enum TaskPriority {
  CRITICAL = 'Critical',
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low'
}

/**
 * Task status
 */
export enum TaskStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  OVERDUE = 'Overdue',
  ON_HOLD = 'On Hold'
}

/**
 * STR/CTR alert types (SUP-DASH-004)
 */
export enum AlertType {
  STR = 'STR',
  CTR = 'CTR',
  SUSPICIOUS_TRANSACTION = 'Suspicious Transaction',
  LARGE_CASH_TRANSACTION = 'Large Cash Transaction',
  UNUSUAL_PATTERN = 'Unusual Pattern',
  SANCTIONS_MATCH = 'Sanctions Match',
  PEP_EXPOSURE = 'PEP Exposure'
}

/**
 * Alert review status
 */
export enum AlertReviewStatus {
  NEW = 'New',
  UNDER_REVIEW = 'Under Review',
  ESCALATED = 'Escalated',
  CLOSED = 'Closed',
  FALSE_POSITIVE = 'False Positive'
}

/**
 * Inspection types (SUP-DASH-005)
 */
export enum InspectionType {
  ON_SITE = 'On-Site Inspection',
  OFF_SITE = 'Off-Site Review',
  THEMATIC = 'Thematic Review',
  FOLLOW_UP = 'Follow-Up Inspection',
  DESK_REVIEW = 'Desk Review',
  TARGETED = 'Targeted Inspection',
  COMPREHENSIVE = 'Comprehensive Inspection'
}

/**
 * Inspection status
 */
export enum InspectionStatus {
  SCHEDULED = 'Scheduled',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  REPORT_PENDING = 'Report Pending',
  CANCELLED = 'Cancelled'
}

/**
 * Quick action types (SUP-DASH-008)
 */
export enum QuickActionType {
  SCHEDULE_INSPECTION = 'Schedule Inspection',
  REVIEW_APPLICATION = 'Review Application',
  GENERATE_REPORT = 'Generate Report',
  SEND_NOTICE = 'Send Notice'
}

/**
 * Activity types for recent activities feed (SUP-DASH-011)
 */
export enum ActivityType {
  RISK_ASSESSMENT = 'Risk Assessment',
  INSPECTION_COMPLETED = 'Inspection Completed',
  LICENSE_APPROVED = 'License Approved',
  LICENSE_REJECTED = 'License Rejected',
  NOTICE_SENT = 'Notice Sent',
  DEFICIENCY_IDENTIFIED = 'Deficiency Identified',
  DEFICIENCY_RESOLVED = 'Deficiency Resolved',
  REPORT_GENERATED = 'Report Generated',
  ENTITY_CREATED = 'Entity Created',
  ENTITY_UPDATED = 'Entity Updated'
}

/**
 * Deficiency status (SUP-DASH-012)
 */
export enum DeficiencyStatus {
  OPEN = 'Open',
  PENDING_VERIFICATION = 'Pending Verification',
  RESOLVED = 'Resolved',
  OVERDUE = 'Overdue'
}

/**
 * Deficiency severity
 */
export enum DeficiencySeverity {
  MINOR = 'Minor',
  MODERATE = 'Moderate',
  MAJOR = 'Major',
  CRITICAL = 'Critical'
}

/**
 * Training module status (SUP-DASH-013)
 */
export enum TrainingStatus {
  NOT_STARTED = 'Not Started',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  OVERDUE = 'Overdue',
  EXPIRING_SOON = 'Expiring Soon'
}

/**
 * Notification types (SUP-DASH-014)
 */
export enum NotificationType {
  ASSIGNMENT = 'Assignment',
  APPROVAL_NEEDED = 'Approval Needed',
  DEADLINE_REMINDER = 'Deadline Reminder',
  SYSTEM_ALERT = 'System Alert',
  MESSAGE = 'Message',
  TASK_UPDATE = 'Task Update'
}

/**
 * Notification priority
 */
export enum NotificationPriority {
  LOW = 'Low',
  NORMAL = 'Normal',
  HIGH = 'High',
  URGENT = 'Urgent'
}

// ============================================================================
// INTERFACES
// ============================================================================

/**
 * Supervised entity (SUP-DASH-001)
 */
export interface SupervisedEntity {
  id: string
  name: string
  entityType: EntityType
  licenseNumber: string
  riskLevel: RiskLevel
  complianceStatus: ComplianceStatus
  supervisorId: string
  supervisorName: string
  registrationDate: Date
  lastInspectionDate: Date | null
  nextInspectionDue: Date | null
  pendingApplications: number
  openDeficiencies: number
  contactPerson: string
  contactEmail: string
  contactPhone: string
  address: string
  totalAssets?: number
  employeeCount?: number
  branchCount?: number
  isActive: boolean
  notes?: string
}

/**
 * Pending task (SUP-DASH-002, SUP-DASH-003)
 */
export interface PendingTask {
  id: string
  title: string
  description: string
  taskType: TaskType
  priority: TaskPriority
  status: TaskStatus
  entityId: string
  entityName: string
  assignedTo: string
  dueDate: Date
  createdDate: Date
  completedDate?: Date
  estimatedHours?: number
  actualHours?: number
  isOverdue: boolean
  isPriority: boolean
  relatedRecordId?: string
  attachments?: string[]
  comments?: TaskComment[]
}

/**
 * Task comment
 */
export interface TaskComment {
  id: string
  taskId: string
  userId: string
  userName: string
  comment: string
  timestamp: Date
}

/**
 * STR/CTR alert (SUP-DASH-004)
 */
export interface SuspiciousActivityAlert {
  id: string
  alertType: AlertType
  entityId: string
  entityName: string
  reportDate: Date
  transactionDate: Date
  amount: number
  currency: string
  description: string
  reviewStatus: AlertReviewStatus
  assignedTo: string
  priority: TaskPriority
  suspicionIndicators: string[]
  involvedParties: AlertParty[]
  reviewNotes?: string
  escalationReason?: string
  closureReason?: string
  reviewedBy?: string
  reviewedDate?: Date
}

/**
 * Party involved in suspicious activity
 */
export interface AlertParty {
  name: string
  role: 'Originator' | 'Beneficiary' | 'Intermediary'
  accountNumber?: string
  identificationNumber?: string
}

/**
 * Inspection schedule item (SUP-DASH-005)
 */
export interface InspectionSchedule {
  id: string
  entityId: string
  entityName: string
  entityType: EntityType
  inspectionType: InspectionType
  scheduledDate: Date
  endDate?: Date
  status: InspectionStatus
  leadInspector: string
  inspectionTeam: string[]
  scope: string
  location: string
  preparationNotes?: string
  reportId?: string
  findings?: InspectionFinding[]
}

/**
 * Inspection finding
 */
export interface InspectionFinding {
  id: string
  category: string
  severity: DeficiencySeverity
  description: string
  recommendation: string
  dueDate?: Date
}

/**
 * Entity portfolio metrics (SUP-DASH-001)
 */
export interface EntityPortfolioMetrics {
  totalEntities: number
  highRiskCount: number
  inspectionsDue: number
  pendingApplications: number
  entitiesByType: Record<EntityType, number>
  entitiesByRisk: Record<RiskLevel, number>
  entitiesByCompliance: Record<ComplianceStatus, number>
}

/**
 * Compliance status summary (SUP-DASH-006)
 */
export interface ComplianceSummary {
  compliant: number
  needsAttention: number
  nonCompliant: number
  underReview: number
  complianceRate: number
  trend: 'improving' | 'stable' | 'declining'
}

/**
 * Risk distribution data (SUP-DASH-007)
 */
export interface RiskDistribution {
  high: number
  medium: number
  low: number
  critical: number
  totalRiskScore: number
  averageRiskScore: number
}

/**
 * Performance metrics (SUP-DASH-009)
 */
export interface SupervisorPerformance {
  casesHandledThisMonth: number
  averageResponseTime: number // in hours
  pendingReviews: number
  tasksCompleted: number
  tasksOverdue: number
  inspectionsCompleted: number
  reportsGenerated: number
  deficienciesResolved: number
  complianceRate: number
  entitySatisfactionScore?: number
}

/**
 * Recent activity (SUP-DASH-011)
 */
export interface RecentActivity {
  id: string
  activityType: ActivityType
  description: string
  entityId: string
  entityName: string
  performedBy: string
  timestamp: Date
  details?: Record<string, any>
  icon?: string
  color?: string
}

/**
 * Deficiency tracking (SUP-DASH-012)
 */
export interface DeficiencyRecord {
  id: string
  entityId: string
  entityName: string
  description: string
  severity: DeficiencySeverity
  status: DeficiencyStatus
  identifiedDate: Date
  dueDate: Date
  resolvedDate?: Date
  verifiedBy?: string
  verificationDate?: Date
  category: string
  correctiveAction: string
  isOverdue: boolean
}

/**
 * Deficiency metrics
 */
export interface DeficiencyMetrics {
  openDeficiencies: number
  pendingVerifications: number
  resolvedThisMonth: number
  overdueDeficiencies: number
  averageResolutionTime: number // in days
}

/**
 * Training module (SUP-DASH-013)
 */
export interface TrainingModule {
  id: string
  title: string
  description: string
  status: TrainingStatus
  dueDate: Date
  completionDate?: Date
  expiryDate?: Date
  duration: number // in minutes
  category: string
  isRequired: boolean
  progress: number // 0-100
}

/**
 * Notification (SUP-DASH-014)
 */
export interface Notification {
  id: string
  type: NotificationType
  priority: NotificationPriority
  title: string
  message: string
  timestamp: Date
  isRead: boolean
  actionUrl?: string
  actionLabel?: string
  relatedEntityId?: string
  relatedEntityName?: string
  senderId?: string
  senderName?: string
}

/**
 * Entity search filters (SUP-DASH-010)
 */
export interface EntitySearchFilters {
  searchTerm?: string
  entityType?: EntityType
  riskLevel?: RiskLevel
  complianceStatus?: ComplianceStatus
  hasOpenDeficiencies?: boolean
  inspectionsDue?: boolean
}

/**
 * Quick action configuration (SUP-DASH-008)
 */
export interface QuickActionConfig {
  type: QuickActionType
  label: string
  icon: string
  color: string
  requiresEntity: boolean
  modal?: string
}

/**
 * Dashboard statistics
 */
export interface DashboardStatistics {
  portfolioMetrics: EntityPortfolioMetrics
  complianceSummary: ComplianceSummary
  riskDistribution: RiskDistribution
  performanceMetrics: SupervisorPerformance
  deficiencyMetrics: DeficiencyMetrics
  taskSummary: {
    total: number
    overdue: number
    dueToday: number
    dueThisWeek: number
  }
  alertSummary: {
    newAlerts: number
    underReview: number
    escalated: number
  }
}

/**
 * Calendar event for inspections
 */
export interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  inspectionType: InspectionType
  entityName: string
  status: InspectionStatus
  color: string
}

/**
 * Auto-refresh configuration (SUP-DASH-015)
 */
export interface AutoRefreshConfig {
  enabled: boolean
  interval: number // in milliseconds (default 60000)
  lastRefresh: Date | null
}

/**
 * Dashboard filters and state
 */
export interface DashboardState {
  selectedEntityId: string | null
  dateRange: {
    start: Date
    end: Date
  }
  filters: EntitySearchFilters
  sortBy: string
  sortOrder: 'asc' | 'desc'
  autoRefresh: AutoRefreshConfig
}

/**
 * Report generation request (SUP-DASH-008)
 */
export interface ReportRequest {
  reportType: 'entity' | 'inspection' | 'compliance' | 'performance'
  entityIds?: string[]
  startDate: Date
  endDate: Date
  includeCharts: boolean
  includeRawData: boolean
  format: 'pdf' | 'excel' | 'csv'
}

/**
 * Notice configuration (SUP-DASH-008)
 */
export interface NoticeConfig {
  entityId: string
  noticeType: 'inspection' | 'deficiency' | 'compliance' | 'general'
  subject: string
  message: string
  dueDate?: Date
  requiresResponse: boolean
  attachments?: File[]
}

/**
 * Application review (SUP-DASH-008)
 */
export interface ApplicationReview {
  id: string
  entityId: string
  entityName: string
  applicationType: 'new_license' | 'renewal' | 'amendment' | 'transfer'
  submittedDate: Date
  reviewDueDate: Date
  status: 'pending' | 'under_review' | 'approved' | 'rejected'
  reviewerId: string
  documents: ApplicationDocument[]
  reviewNotes?: string
  decision?: string
  decisionDate?: Date
}

/**
 * Application document
 */
export interface ApplicationDocument {
  id: string
  name: string
  type: string
  uploadDate: Date
  fileSize: number
  url: string
  verified: boolean
}

/**
 * Chart data for compliance status (SUP-DASH-006)
 */
export interface ComplianceChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor: string[]
    borderColor?: string[]
  }[]
}

/**
 * Chart data for risk distribution (SUP-DASH-007)
 */
export interface RiskChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor: string
    borderColor: string
  }[]
}

/**
 * Pagination configuration
 */
export interface PaginationConfig {
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

/**
 * Time range selector
 */
export interface TimeRange {
  label: string
  value: 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom'
  startDate: Date
  endDate: Date
}

/**
 * Export configuration
 */
export interface ExportConfig {
  filename: string
  format: 'csv' | 'excel' | 'pdf' | 'json'
  includeFilters: boolean
  includeMetadata: boolean
  dateRange?: TimeRange
}
