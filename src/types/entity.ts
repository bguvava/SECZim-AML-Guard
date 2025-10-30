/**
 * Entity Registry Types and Interfaces
 * Comprehensive type definitions for Entity Management
 */

/**
 * Entity Types - Categories of Securities Market Intermediaries
 */
export type EntityType =
  | 'Stockbroker'
  | 'Investment Manager'
  | 'Custodian'
  | 'Market Operator'
  | 'Investment Advisor'
  | 'Portfolio Manager'

/**
 * Entity Status - License/Registration status
 */
export type EntityStatus = 'Active' | 'Pending' | 'Suspended' | 'Revoked' | 'Expired'

/**
 * Risk Rating Levels
 */
export type RiskLevel = 'High' | 'Medium' | 'Low' | 'Unrated'

/**
 * Document Types
 */
export type DocumentType =
  | 'License'
  | 'Certificate'
  | 'Financial Statement'
  | 'Audit Report'
  | 'Compliance Report'
  | 'Risk Assessment'
  | 'Inspection Report'
  | 'Correspondence'
  | 'Other'

/**
 * History Event Types
 */
export type HistoryEventType =
  | 'Registration'
  | 'License Issued'
  | 'License Renewed'
  | 'License Suspended'
  | 'License Revoked'
  | 'Risk Assessment'
  | 'Inspection'
  | 'Violation'
  | 'Remediation'
  | 'Status Change'
  | 'Profile Updated'

/**
 * License Information
 */
export interface License {
  id: string
  licenseNumber: string
  entityId: string
  type: EntityType
  issueDate: string
  expiryDate: string
  status: EntityStatus
  conditions: string[]
  renewalCount: number
  lastRenewalDate?: string
  suspensionReason?: string
  suspensionDate?: string
  revocationReason?: string
  revocationDate?: string
  authorizedBy?: string
}

/**
 * Compliance Score Breakdown
 */
export interface ComplianceScoreBreakdown {
  reporting: number // 0-25
  recordKeeping: number // 0-25
  training: number // 0-25
  riskManagement: number // 0-25
}

/**
 * Compliance Score
 */
export interface ComplianceScore {
  entityId: string
  overallScore: number // 0-100
  breakdown: ComplianceScoreBreakdown
  lastAssessmentDate: string
  assessedBy: string
  trend: 'improving' | 'stable' | 'declining'
  notes?: string
}

/**
 * Risk Rating
 */
export interface RiskRating {
  entityId: string
  level: RiskLevel
  score: number // 0-100
  factors: string[]
  assessmentDate: string
  assessedBy: string
  nextReviewDate: string
  mitigationMeasures: string[]
}

/**
 * Contact Information
 */
export interface ContactInfo {
  primaryContact: {
    name: string
    position: string
    email: string
    phone: string
  }
  complianceOfficer: {
    name: string
    email: string
    phone: string
  }
  physicalAddress: {
    street: string
    city: string
    province: string
    postalCode: string
    country: string
  }
  mailingAddress?: {
    street: string
    city: string
    province: string
    postalCode: string
    country: string
  }
  website?: string
}

/**
 * Business Information
 */
export interface BusinessInfo {
  registrationNumber: string
  registrationDate: string
  taxNumber: string
  businessType: 'Private Limited' | 'Public Limited' | 'Partnership' | 'Sole Proprietor'
  parentCompany?: string
  numberOfEmployees: number
  annualRevenue?: number
  servicesOffered: string[]
}

/**
 * Entity Document
 */
export interface EntityDocument {
  id: string
  entityId: string
  name: string
  type: DocumentType
  fileUrl: string
  fileSize: number // in bytes
  mimeType: string
  uploadDate: string
  uploadedBy: string
  description?: string
  expiryDate?: string
  tags: string[]
}

/**
 * Entity Note
 */
export interface EntityNote {
  id: string
  entityId: string
  content: string
  createdAt: string
  createdBy: string
  updatedAt?: string
  category: 'General' | 'Compliance' | 'Risk' | 'Inspection' | 'Internal'
  isConfidential: boolean
}

/**
 * History Event
 */
export interface HistoryEvent {
  id: string
  entityId: string
  type: HistoryEventType
  title: string
  description: string
  date: string
  performedBy: string
  relatedDocuments?: string[] // Document IDs
  metadata?: Record<string, unknown>
}

/**
 * Entity (Main Interface)
 */
export interface Entity {
  id: string
  name: string
  type: EntityType
  status: EntityStatus
  contactInfo: ContactInfo
  businessInfo: BusinessInfo
  license: License
  complianceScore?: ComplianceScore
  riskRating?: RiskRating
  documents: EntityDocument[]
  notes: EntityNote[]
  history: HistoryEvent[]
  createdAt: string
  createdBy: string
  updatedAt: string
  updatedBy: string
  lastInspectionDate?: string
  nextInspectionDate?: string
}

/**
 * Entity List Item (for table display)
 */
export interface EntityListItem {
  id: string
  name: string
  licenseNumber: string
  type: EntityType
  status: EntityStatus
  riskLevel: RiskLevel
  complianceScore: number
  expiryDate: string
  daysUntilExpiry: number
  lastUpdated: string
}

/**
 * Entity Filter Options
 */
export interface EntityFilters {
  search: string
  types: EntityType[]
  statuses: EntityStatus[]
  riskLevels: RiskLevel[]
  expiringWithinDays?: number
  hasViolations?: boolean
}

/**
 * Entity Statistics
 */
export interface EntityStatistics {
  totalEntities: number
  activeLicenses: number
  expiringSoon: number // Within 90 days
  suspended: number
  byType: Record<EntityType, number>
  byRiskLevel: Record<RiskLevel, number>
  averageComplianceScore: number
}

/**
 * Entity Registration Form Data
 */
export interface EntityRegistrationData {
  // Step 1: Basic Information
  name: string
  type: EntityType
  registrationNumber: string
  registrationDate: string
  taxNumber: string
  businessType: string

  // Step 2: Contact Details
  primaryContactName: string
  primaryContactPosition: string
  primaryContactEmail: string
  primaryContactPhone: string
  complianceOfficerName: string
  complianceOfficerEmail: string
  complianceOfficerPhone: string

  // Step 3: Address Information
  physicalAddressStreet: string
  physicalAddressCity: string
  physicalAddressProvince: string
  physicalAddressPostalCode: string
  mailingAddressSame: boolean
  mailingAddressStreet?: string
  mailingAddressCity?: string
  mailingAddressProvince?: string
  mailingAddressPostalCode?: string
  website?: string

  // Step 4: Business Information
  numberOfEmployees: number
  annualRevenue?: number
  servicesOffered: string[]
  parentCompany?: string

  // Step 5: License Information
  licenseNumber: string
  licenseIssueDate: string
  licenseExpiryDate: string
  licenseConditions: string[]

  // Step 6: Initial Documents
  documents: File[]
}

/**
 * Entity Update Data
 */
export interface EntityUpdateData {
  name?: string
  type?: EntityType
  contactInfo?: Partial<ContactInfo>
  businessInfo?: Partial<BusinessInfo>
}

/**
 * License Action Data
 */
export interface LicenseActionData {
  action: 'suspend' | 'revoke' | 'renew'
  reason: string
  effectiveDate: string
  authorizedBy: string
  notes?: string
}

/**
 * Entity Export Options
 */
export interface EntityExportOptions {
  format: 'excel' | 'pdf' | 'csv'
  scope: 'single' | 'filtered' | 'all'
  entityIds?: string[]
  includeDocuments?: boolean
  includeHistory?: boolean
  includeNotes?: boolean
}
