/**
 * Profile Module Type Definitions
 * Comprehensive TypeScript interfaces for user profile management
 */

/**
 * Core User Profile
 * Complete user profile information including personal details and preferences
 */
export interface UserProfile {
  id: string
  email: string
  firstName: string
  lastName: string
  fullName: string
  phoneNumber?: string
  dateOfBirth?: string // ISO 8601 format
  address?: Address
  role: 'admin' | 'supervisor' | 'entity'
  avatar?: string // URL or base64
  verified: boolean
  emailVerified: boolean
  phoneVerified: boolean
  twoFactorEnabled: boolean
  lastLogin?: string // ISO 8601 format
  createdAt: string // ISO 8601 format
  updatedAt: string // ISO 8601 format
  metadata?: Record<string, unknown>
}

/**
 * Address Information
 * Structured address data
 */
export interface Address {
  street?: string
  street2?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
}

/**
 * Profile Form Data
 * Data structure for profile update form
 */
export interface ProfileFormData {
  firstName: string
  lastName: string
  email: string
  phoneNumber?: string
  dateOfBirth?: string
  address?: Address
}

/**
 * Profile Update Request
 * API request payload for profile updates
 */
export interface ProfileUpdateRequest extends ProfileFormData {
  avatar?: string | File
}

/**
 * Profile Update Response
 * API response after successful profile update
 */
export interface ProfileUpdateResponse {
  success: boolean
  message: string
  profile: UserProfile
}

/**
 * Password Change Data
 * Data structure for password change form
 */
export interface PasswordChangeData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

/**
 * Password Change Request
 * API request payload for password change
 */
export interface PasswordChangeRequest {
  currentPassword: string
  newPassword: string
}

/**
 * Password Change Response
 * API response after password change
 */
export interface PasswordChangeResponse {
  success: boolean
  message: string
  requiresReLogin?: boolean
}

/**
 * Password Strength
 * Password strength indicator
 */
export interface PasswordStrength {
  score: 0 | 1 | 2 | 3 | 4 // 0=very weak, 4=very strong
  label: 'Very Weak' | 'Weak' | 'Fair' | 'Strong' | 'Very Strong'
  color: 'red' | 'orange' | 'yellow' | 'blue' | 'green'
  feedback: string[]
  hasMinLength: boolean
  hasUpperCase: boolean
  hasLowerCase: boolean
  hasNumber: boolean
  hasSpecialChar: boolean
}

/**
 * Notification Preferences
 * User's notification settings
 */
export interface NotificationPreferences {
  email: EmailNotificationSettings
  sms: SmsNotificationSettings
  push: PushNotificationSettings
  inApp: InAppNotificationSettings
}

/**
 * Email Notification Settings
 */
export interface EmailNotificationSettings {
  enabled: boolean
  transactionAlerts: boolean
  complianceUpdates: boolean
  securityAlerts: boolean
  systemNotifications: boolean
  weeklyDigest: boolean
  monthlyReport: boolean
}

/**
 * SMS Notification Settings
 */
export interface SmsNotificationSettings {
  enabled: boolean
  criticalAlerts: boolean
  twoFactorAuth: boolean
  loginAlerts: boolean
}

/**
 * Push Notification Settings
 */
export interface PushNotificationSettings {
  enabled: boolean
  transactionAlerts: boolean
  taskReminders: boolean
  mentions: boolean
}

/**
 * In-App Notification Settings
 */
export interface InAppNotificationSettings {
  enabled: boolean
  sound: boolean
  desktop: boolean
}

/**
 * Notification Preferences Update Request
 */
export interface NotificationPreferencesUpdateRequest {
  preferences: NotificationPreferences
}

/**
 * Notification Preferences Update Response
 */
export interface NotificationPreferencesUpdateResponse {
  success: boolean
  message: string
  preferences: NotificationPreferences
}

/**
 * Active Session
 * User's active login session
 */
export interface Session {
  id: string
  deviceName: string
  deviceType: 'desktop' | 'mobile' | 'tablet' | 'unknown'
  browser?: string
  browserVersion?: string
  os?: string
  ipAddress: string
  location?: {
    city?: string
    region?: string
    country?: string
    countryCode?: string
  }
  lastActivity: string // ISO 8601 format
  createdAt: string // ISO 8601 format
  isCurrent: boolean
  expiresAt?: string // ISO 8601 format
}

/**
 * Session List Response
 * API response for fetching active sessions
 */
export interface SessionListResponse {
  success: boolean
  sessions: Session[]
  currentSessionId: string
}

/**
 * Session Revoke Request
 */
export interface SessionRevokeRequest {
  sessionId: string
}

/**
 * Session Revoke Response
 */
export interface SessionRevokeResponse {
  success: boolean
  message: string
  sessionId: string
}

/**
 * Two-Factor Authentication Status
 * User's 2FA configuration
 */
export interface TwoFactorAuth {
  enabled: boolean
  method: 'totp' | 'sms' | 'email' | null
  verified: boolean
  backupCodesGenerated: boolean
  backupCodesRemaining?: number
  lastUsed?: string // ISO 8601 format
  createdAt?: string // ISO 8601 format
}

/**
 * Two-Factor Setup Request
 * Initiate 2FA setup process
 */
export interface TwoFactorSetupRequest {
  method: 'totp' | 'sms' | 'email'
}

/**
 * Two-Factor Setup Response
 * Response containing QR code and secret
 */
export interface TwoFactorSetupResponse {
  success: boolean
  secret: string
  qrCode: string // Data URL
  backupCodes: string[]
  method: 'totp' | 'sms' | 'email'
}

/**
 * Two-Factor Verify Request
 * Verify 2FA code during setup
 */
export interface TwoFactorVerifyRequest {
  code: string
  secret: string
}

/**
 * Two-Factor Verify Response
 */
export interface TwoFactorVerifyResponse {
  success: boolean
  message: string
  enabled: boolean
}

/**
 * Two-Factor Disable Request
 */
export interface TwoFactorDisableRequest {
  password: string
  code?: string
}

/**
 * Two-Factor Disable Response
 */
export interface TwoFactorDisableResponse {
  success: boolean
  message: string
}

/**
 * Backup Codes Regenerate Response
 */
export interface BackupCodesRegenerateResponse {
  success: boolean
  backupCodes: string[]
}

/**
 * Activity Log Entry
 * User activity history record
 */
export interface ActivityLogEntry {
  id: string
  userId: string
  action: ActivityAction
  category: ActivityCategory
  description: string
  details?: Record<string, unknown>
  ipAddress?: string
  userAgent?: string
  location?: {
    city?: string
    country?: string
  }
  status: 'success' | 'failure' | 'pending'
  timestamp: string // ISO 8601 format
  metadata?: Record<string, unknown>
}

/**
 * Activity Action Types
 */
export type ActivityAction =
  | 'login'
  | 'logout'
  | 'login_failed'
  | 'password_changed'
  | 'password_reset'
  | 'profile_updated'
  | 'email_changed'
  | 'email_verified'
  | 'phone_verified'
  | '2fa_enabled'
  | '2fa_disabled'
  | '2fa_verified'
  | 'session_revoked'
  | 'preferences_updated'
  | 'avatar_updated'
  | 'account_locked'
  | 'account_unlocked'
  | 'api_key_created'
  | 'api_key_revoked'
  | 'export_data'

/**
 * Activity Category
 */
export type ActivityCategory =
  | 'authentication'
  | 'security'
  | 'profile'
  | 'settings'
  | 'data'
  | 'system'

/**
 * Activity Log Filters
 * Filtering options for activity log
 */
export interface ActivityLogFilters {
  category?: ActivityCategory[]
  action?: ActivityAction[]
  status?: ('success' | 'failure' | 'pending')[]
  startDate?: string // ISO 8601 format
  endDate?: string // ISO 8601 format
  searchQuery?: string
  ipAddress?: string
}

/**
 * Activity Log Request
 * API request for fetching activity log
 */
export interface ActivityLogRequest {
  page?: number
  limit?: number
  filters?: ActivityLogFilters
  sortBy?: 'timestamp' | 'action' | 'status'
  sortOrder?: 'asc' | 'desc'
}

/**
 * Activity Log Response
 * Paginated activity log response
 */
export interface ActivityLogResponse {
  success: boolean
  data: ActivityLogEntry[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

/**
 * Activity Export Request
 */
export interface ActivityExportRequest {
  filters?: ActivityLogFilters
  format: 'csv' | 'json' | 'pdf'
}

/**
 * Activity Export Response
 */
export interface ActivityExportResponse {
  success: boolean
  downloadUrl: string
  filename: string
  expiresAt: string // ISO 8601 format
}

/**
 * Avatar Upload Request
 */
export interface AvatarUploadRequest {
  file: File
  crop?: {
    x: number
    y: number
    width: number
    height: number
  }
}

/**
 * Avatar Upload Response
 */
export interface AvatarUploadResponse {
  success: boolean
  message: string
  avatarUrl: string
}

/**
 * Avatar Delete Response
 */
export interface AvatarDeleteResponse {
  success: boolean
  message: string
}

/**
 * Profile Validation Errors
 * Validation error structure for forms
 */
export interface ProfileValidationErrors {
  firstName?: string
  lastName?: string
  email?: string
  phoneNumber?: string
  dateOfBirth?: string
  address?: {
    street?: string
    city?: string
    state?: string
    postalCode?: string
    country?: string
  }
  currentPassword?: string
  newPassword?: string
  confirmPassword?: string
}

/**
 * API Error Response
 * Standard error response structure
 */
export interface ApiErrorResponse {
  success: false
  message: string
  errors?: Record<string, string[]>
  code?: string
}
