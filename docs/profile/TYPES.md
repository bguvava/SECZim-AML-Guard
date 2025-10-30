# TypeScript Type System

Complete type definitions for the Profile module.

## Core Types

### UserProfile

Main user profile interface with all personal information.

```typescript
interface UserProfile {
  // Identity
  id: string
  email: string
  firstName: string
  lastName: string
  fullName: string
  
  // Contact
  phoneNumber?: string
  avatar?: string
  
  // Role & Permissions
  role: 'admin' | 'supervisor' | 'entity'
  
  // Personal Info
  dateOfBirth?: string
  address?: Address
  
  // Verification Status
  emailVerified: boolean
  phoneVerified: boolean
  twoFactorEnabled: boolean
  verified: boolean
  
  // Timestamps
  createdAt: string
  updatedAt: string
  lastLogin?: string
  
  // Metadata
  metadata?: {
    lastLoginIp?: string
    lastLoginLocation?: string
    [key: string]: any
  }
}
```

### Address

Physical address structure.

```typescript
interface Address {
  street: string
  street2?: string
  city: string
  state?: string
  postalCode: string
  country: string
}
```

## Form Data Types

### ProfileFormData

Data structure for profile updates.

```typescript
interface ProfileFormData {
  firstName: string
  lastName: string
  email: string
  phoneNumber?: string
  dateOfBirth?: string
  address?: Partial<Address>
}
```

### PasswordChangeData

Data for password change requests.

```typescript
interface PasswordChangeData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}
```

## Security Types

### TwoFactorAuth

Two-factor authentication configuration.

```typescript
interface TwoFactorAuth {
  enabled: boolean
  method: '2fa-method' | null
  verified: boolean
  backupCodesGenerated: boolean
  backupCodesRemaining: number
  lastUsed?: string
  setupData?: TwoFactorSetupData
}

type TwoFactorMethod = 'totp' | 'sms' | 'email'

interface TwoFactorSetupData {
  qrCode: string
  secret: string
  backupCodes: string[]
}
```

### PasswordStrength

Password strength calculation result.

```typescript
interface PasswordStrength {
  score: 0 | 1 | 2 | 3 | 4
  label: 'Very Weak' | 'Weak' | 'Fair' | 'Strong' | 'Very Strong'
  color: 'red' | 'orange' | 'yellow' | 'blue' | 'green'
  percentage: number
  requirements: PasswordRequirements
  suggestions: string[]
}

interface PasswordRequirements {
  minLength: boolean      // 8+ characters
  hasUppercase: boolean   // A-Z
  hasLowercase: boolean   // a-z
  hasNumber: boolean      // 0-9
  hasSpecial: boolean     // !@#$%^&*
}
```

## Notification Types

### NotificationPreferences

Complete notification settings across all channels.

```typescript
interface NotificationPreferences {
  email: EmailNotifications
  sms: SmsNotifications
  push: PushNotifications
  inApp: InAppNotifications
}

interface EmailNotifications {
  enabled: boolean
  transactionAlerts: boolean
  complianceUpdates: boolean
  securityAlerts: boolean
  systemNotifications: boolean
  weeklyDigest: boolean
  monthlyReport: boolean
}

interface SmsNotifications {
  enabled: boolean
  criticalAlerts: boolean
  twoFactorAuth: boolean
  loginAlerts: boolean
}

interface PushNotifications {
  enabled: boolean
  transactionAlerts: boolean
  taskReminders: boolean
  mentions: boolean
}

interface InAppNotifications {
  enabled: boolean
  sound: boolean
  desktop: boolean
}
```

## Session Types

### Session

Active session information.

```typescript
interface Session {
  id: string
  deviceName: string
  deviceType: 'desktop' | 'mobile' | 'tablet'
  browser: string
  browserVersion: string
  os: string
  ipAddress: string
  location?: SessionLocation
  lastActivity: string
  createdAt: string
  isCurrent: boolean
}

interface SessionLocation {
  city?: string
  region?: string
  country: string
}
```

## Activity Log Types

### ActivityLogEntry

Single activity log entry.

```typescript
interface ActivityLogEntry {
  id: string
  userId: string
  action: ActivityAction
  category: ActivityCategory
  description: string
  timestamp: string
  ipAddress: string
  location?: ActivityLocation
  status: ActivityStatus
  metadata?: Record<string, any>
}

type ActivityAction =
  | 'login'
  | 'logout'
  | 'login_failed'
  | 'password_changed'
  | 'profile_updated'
  | 'avatar_updated'
  | 'email_verified'
  | 'phone_verified'
  | '2fa_enabled'
  | '2fa_disabled'
  | 'preferences_updated'
  | 'session_revoked'
  | 'export_data'
  // ... 20+ total actions

type ActivityCategory =
  | 'authentication'
  | 'security'
  | 'profile'
  | 'settings'
  | 'data'
  | 'system'

type ActivityStatus = 'success' | 'failure' | 'pending'

interface ActivityLocation {
  city?: string
  region?: string
  country: string
}
```

### ActivityLogFilters

Filter criteria for activity log queries.

```typescript
interface ActivityLogFilters {
  searchQuery?: string
  category?: ActivityCategory[]
  action?: ActivityAction[]
  status?: ActivityStatus[]
  startDate?: string
  endDate?: string
}
```

## API Types

### Request/Response Pairs

```typescript
// Profile Update
interface UpdateProfileRequest {
  data: ProfileFormData
}

interface UpdateProfileResponse {
  success: boolean
  profile: UserProfile
  message: string
}

// Avatar Upload
interface UploadAvatarRequest {
  file: File
}

interface UploadAvatarResponse {
  success: boolean
  avatarUrl: string
  message: string
}

// Password Change
interface ChangePasswordRequest {
  data: PasswordChangeData
}

interface ChangePasswordResponse {
  success: boolean
  message: string
  requiresReauth: boolean
}

// Notifications
interface UpdateNotificationsRequest {
  preferences: NotificationPreferences
}

interface UpdateNotificationsResponse {
  success: boolean
  preferences: NotificationPreferences
  message: string
}

// Sessions
interface RevokeSessionRequest {
  sessionId: string
}

interface RevokeSessionResponse {
  success: boolean
  message: string
}

// 2FA
interface Enable2FARequest {
  method: TwoFactorMethod
}

interface Enable2FAResponse {
  success: boolean
  setupData: TwoFactorSetupData
}

interface Verify2FARequest {
  code: string
  secret: string
}

interface Verify2FAResponse {
  success: boolean
  backupCodes: string[]
  message: string
}

// Activity Log
interface FetchActivityLogRequest {
  page: number
  limit: number
  filters?: ActivityLogFilters
}

interface FetchActivityLogResponse {
  success: boolean
  activities: ActivityLogEntry[]
  total: number
  page: number
  limit: number
  totalPages: number
}

interface ExportActivityLogRequest {
  format: 'csv' | 'json' | 'pdf'
  filters?: ActivityLogFilters
}

interface ExportActivityLogResponse {
  success: boolean
  downloadUrl: string
  message: string
}
```

### Error Types

```typescript
interface ApiError {
  success: false
  message: string
  code: string
  details?: Record<string, string[]>
}

interface ValidationError extends ApiError {
  code: 'VALIDATION_ERROR'
  details: Record<string, string[]>
}

interface AuthError extends ApiError {
  code: 'AUTH_ERROR' | 'UNAUTHORIZED' | 'FORBIDDEN'
}
```

## Utility Types

### Pagination

```typescript
interface PaginationParams {
  page: number
  limit: number
}

interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}
```

### Loading States

```typescript
interface LoadingStates {
  profile: boolean
  password: boolean
  notifications: boolean
  sessions: boolean
  twoFactor: boolean
  activity: boolean
}
```

## Type Guards

Useful type guards for runtime type checking.

```typescript
// Check if profile is complete
function isProfileComplete(profile: UserProfile): boolean {
  return !!(
    profile.firstName &&
    profile.lastName &&
    profile.email &&
    profile.emailVerified
  )
}

// Check if 2FA is enabled
function isTwoFactorEnabled(auth: TwoFactorAuth): boolean {
  return auth.enabled && auth.verified
}

// Check if session is current
function isCurrentSession(session: Session): session is Session & { isCurrent: true } {
  return session.isCurrent === true
}

// Check activity status
function isSuccessfulActivity(entry: ActivityLogEntry): boolean {
  return entry.status === 'success'
}
```

## Enums

```typescript
enum UserRole {
  Admin = 'admin',
  Supervisor = 'supervisor',
  Entity = 'entity'
}

enum DeviceType {
  Desktop = 'desktop',
  Mobile = 'mobile',
  Tablet = 'tablet'
}

enum ActivityStatus {
  Success = 'success',
  Failure = 'failure',
  Pending = 'pending'
}

enum ExportFormat {
  CSV = 'csv',
  JSON = 'json',
  PDF = 'pdf'
}
```

## Type Usage Examples

### Component Props

```typescript
// ProfileHeader.vue
interface ProfileHeaderProps {
  profile: UserProfile
  loading?: boolean
  editable?: boolean
}

// ActivityLog.vue
interface ActivityLogProps {
  activities: ActivityLogEntry[]
  total: number
  page: number
  limit: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
  loading?: boolean
}
```

### Composable Return Types

```typescript
// useProfile.ts
interface UseProfileReturn {
  // State
  profile: Ref<UserProfile | null>
  notifications: Ref<NotificationPreferences | null>
  sessions: Ref<Session[]>
  twoFactorAuth: Ref<TwoFactorAuth | null>
  activities: Ref<ActivityLogEntry[]>
  
  // Loading
  loading: Ref<LoadingStates>
  
  // Actions
  fetchProfile: () => Promise<void>
  updateProfile: (data: ProfileFormData) => Promise<void>
  uploadAvatar: (file: File) => Promise<void>
  removeAvatar: () => Promise<void>
  changePassword: (data: PasswordChangeData) => Promise<void>
  // ... more actions
}
```

---

**Next:** See [VALIDATION.md](./VALIDATION.md) for validation schemas and patterns.
