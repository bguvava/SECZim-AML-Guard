/**
 * Security Management Type Definitions
 * Comprehensive types for the Security Management module
 */

// ============================================================================
// ENUMS
// ============================================================================

export enum SecurityEventType {
  FailedLogin = 'Failed Login',
  UnusualActivity = 'Unusual Activity',
  BulkDownload = 'Bulk Download',
  PermissionEscalation = 'Permission Escalation',
  SuspiciousAccess = 'Suspicious Access',
  UnauthorizedAttempt = 'Unauthorized Attempt',
}

export enum Severity {
  Critical = 'Critical',
  High = 'High',
  Medium = 'Medium',
  Low = 'Low',
  Info = 'Info',
}

export enum FirewallAction {
  Allow = 'Allow',
  Deny = 'Deny',
}

export enum ComplianceStatus {
  Compliant = 'Compliant',
  NonCompliant = 'Non-Compliant',
  PartiallyCompliant = 'Partially Compliant',
}

export enum Protocol {
  TCP = 'TCP',
  UDP = 'UDP',
  ICMP = 'ICMP',
  All = 'All',
}

export enum IPListType {
  Whitelist = 'Whitelist',
  Blacklist = 'Blacklist',
}

export enum DeviceType {
  Desktop = 'Desktop',
  Mobile = 'Mobile',
  Tablet = 'Tablet',
  Unknown = 'Unknown',
}

// ============================================================================
// FAILED LOGIN ATTEMPTS
// ============================================================================

export interface FailedLoginAttempt {
  id: string
  timestamp: Date
  username: string
  ipAddress: string
  location: string
  reason: string
  userAgent: string
  blocked: boolean
}

// ============================================================================
// IP MANAGEMENT
// ============================================================================

export interface WhitelistedIP {
  id: string
  ipAddress: string
  description: string
  addedBy: string
  addedDate: Date
  expiryDate?: Date
  isActive: boolean
}

export interface BlacklistedIP {
  id: string
  ipAddress: string
  reason: string
  blockedDate: Date
  blockedBy: string
  isAutomatic: boolean
  isActive: boolean
}

export interface AutoBlockSettings {
  threshold: number // Number of failed attempts
  timeWindow: number // Time window in minutes
}

export interface IPManagementData {
  whitelistedIPs: WhitelistedIP[]
  blacklistedIPs: BlacklistedIP[]
  autoBlockSettings: AutoBlockSettings
}

// ============================================================================
// SSL CERTIFICATES
// ============================================================================

export interface SSLCertificate {
  id: string
  domain: string
  issuer: string
  validFrom: Date
  expiresOn: Date
  daysRemaining: number
  status: 'valid' | 'warning' | 'critical' | 'expired'
  serialNumber: string
  fingerprint: string
}

// ============================================================================
// VULNERABILITIES
// ============================================================================

export interface Vulnerability {
  id: string
  severity: Severity
  title: string
  description: string
  affectedComponent: string
  cveId?: string
  recommendation: string
  discoveredDate: Date
  status: 'open' | 'in-progress' | 'resolved'
}

export interface VulnerabilityScan {
  id: string
  scanDate: Date
  scanType: 'Quick' | 'Full' | 'Custom'
  duration: number // in seconds
  vulnerabilitiesFound: number
  status: 'completed' | 'in-progress' | 'failed'
  vulnerabilities: Vulnerability[]
}

export interface VulnerabilitySummary {
  total: number
  critical: number
  high: number
  medium: number
  low: number
  info: number
}

// ============================================================================
// AUDIT LOGS
// ============================================================================

export interface PermissionChange {
  id: string
  timestamp: Date
  adminUser: string
  affectedUser: string
  beforePermission: string
  afterPermission: string
  reason?: string
  ipAddress: string
}

export interface DataAccessLog {
  id: string
  timestamp: Date
  user: string
  userId: string
  dataType: string
  action: 'view' | 'export' | 'edit' | 'delete' | 'create'
  ipAddress: string
  userAgent: string
  success: boolean
}

export interface SecurityAlert {
  id: string
  type: SecurityEventType
  severity: Severity
  title: string
  description: string
  timestamp: Date
  affectedUser?: string
  ipAddress?: string
  resolved: boolean
  resolvedBy?: string
  resolvedAt?: Date
}

// ============================================================================
// SESSION MANAGEMENT
// ============================================================================

export interface ActiveSession {
  id: string
  sessionId: string
  user: string
  userId: string
  ipAddress: string
  location: string
  device: DeviceType
  deviceInfo: string
  loginTime: Date
  lastActivity: Date
  isCurrentSession: boolean
}

export interface SessionSettings {
  maxConcurrentSessions: number
  sessionTimeout: number // in minutes
  requireReauthentication: boolean
}

// ============================================================================
// TWO-FACTOR AUTHENTICATION
// ============================================================================

export enum TwoFactorEnforcement {
  None = 'None',
  AdminsOnly = 'Admins Only',
  SupervisorsOnly = 'Supervisors Only',
  AllUsers = 'All Users',
}

export interface TwoFactorSettings {
  enforcement: TwoFactorEnforcement
  allowRememberDevice: boolean
  trustPeriod: number // in days
}

// ============================================================================
// COMPLIANCE
// ============================================================================

export interface PasswordPolicyCompliance {
  minLength: number
  requireUppercase: boolean
  requireLowercase: boolean
  requireNumbers: boolean
  requireSpecialChars: boolean
  expiryDays: number
  historyCount: number
  compliant: boolean
}

export interface EncryptionCompliance {
  dataAtRest: boolean
  dataInTransit: boolean
  algorithm: string
  keyLength: number
  compliant: boolean
}

export interface BackupCompliance {
  enabled: boolean
  frequency: string
  lastBackup?: Date
  retentionDays: number
  offsite: boolean
  compliant: boolean
}

export interface LoggingCompliance {
  enabled: boolean
  retentionDays: number
  includesSecurityEvents: boolean
  includesDataAccess: boolean
  includesSystemChanges: boolean
  compliant: boolean
}

export interface SecurityPolicyCompliance {
  passwordPolicy: PasswordPolicyCompliance
  twoFactorAuth: {
    enabled: boolean
    enforcement: TwoFactorEnforcement
    compliant: boolean
  }
  encryption: EncryptionCompliance
  backups: BackupCompliance
  logging: LoggingCompliance
  overallScore: number // 0-100
}

// ============================================================================
// FIREWALL RULES
// ============================================================================

export interface PortRange {
  start: number
  end: number
}

export interface FirewallRule {
  id: string
  priority: number
  name: string
  protocol: Protocol
  sourceIPs: string[]
  destinationIPs: string[]
  sourcePorts: (number | PortRange)[]
  destinationPorts: (number | PortRange)[]
  action: FirewallAction
  enabled: boolean
  createdBy: string
  createdAt: Date
  description?: string
}

// ============================================================================
// SECURITY STATISTICS
// ============================================================================

export interface SecurityStatistics {
  failedLogins24h: number
  blockedIPs: number
  activeThreats: number
  certificateStatus: {
    total: number
    valid: number
    warning: number
    critical: number
    expired: number
  }
  lastScanDate?: Date
  vulnerabilitySummary: VulnerabilitySummary
  activeSessions: number
  complianceScore: number
}

// ============================================================================
// SECURITY REPORT
// ============================================================================

export enum ReportType {
  Daily = 'Daily',
  Weekly = 'Weekly',
  Monthly = 'Monthly',
  Custom = 'Custom',
}

export interface SecurityReportOptions {
  reportType: ReportType
  dateRange: {
    start: Date
    end: Date
  }
  includeSections: {
    securityEvents: boolean
    failedLogins: boolean
    ipManagement: boolean
    vulnerabilities: boolean
    compliance: boolean
    firewallRules: boolean
    recommendations: boolean
  }
}

// ============================================================================
// FORM DATA TYPES
// ============================================================================

export interface AddIPToWhitelistData {
  ipAddress: string
  description: string
  expiryDate?: Date
}

export interface BlockIPData {
  ipAddress: string
  reason: string
}

export interface AddFirewallRuleData {
  priority: number
  name: string
  protocol: Protocol
  sourceIPs: string[]
  destinationIPs: string[]
  sourcePorts: string // comma-separated or ranges
  destinationPorts: string // comma-separated or ranges
  action: FirewallAction
  description?: string
}

export interface VulnerabilityScanOptions {
  scanType: 'Quick' | 'Full' | 'Custom'
  targetComponents?: string[]
}

// ============================================================================
// FILTER & SEARCH TYPES
// ============================================================================

export interface SecurityFilters {
  searchTerm: string
  severities: Severity[]
  dateRange?: {
    start: Date
    end: Date
  }
  statuses: string[]
}

// ============================================================================
// HELPER TYPES
// ============================================================================

export interface SecurityEvent {
  id: string
  type: SecurityEventType
  severity: Severity
  description: string
  timestamp: Date
  user?: string
  ipAddress?: string
  details: Record<string, unknown>
}

export interface SecurityMetrics {
  totalSecurityEvents: number
  criticalEvents: number
  resolvedThreats: number
  averageResponseTime: number // in minutes
  mostCommonThreat: SecurityEventType
}
