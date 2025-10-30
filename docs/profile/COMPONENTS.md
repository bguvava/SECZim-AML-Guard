# Component API Reference

Complete API documentation for all 7 Profile module components.

## Table of Contents

1. [ProfileHeader](#profileheader)
2. [ProfileForm](#profileform)
3. [PasswordChange](#passwordchange)
4. [NotificationPreferences](#notificationpreferences)
5. [SessionManagement](#sessionmanagement)
6. [TwoFactorAuth](#twofactorauth)
7. [ActivityLog](#activitylog)

---

## ProfileHeader

Avatar display with role badges and verification indicators.

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `profile` | `UserProfile` | Yes | - | User profile data |
| `loading` | `boolean` | No | `false` | Loading state for operations |
| `editable` | `boolean` | No | `true` | Enable/disable edit functionality |

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `uploadAvatar` | `File` | Emitted when user selects avatar file |
| `removeAvatar` | - | Emitted when user removes avatar |

### Usage Example

```vue
<script setup lang="ts">
import ProfileHeader from '@/components/profile/ProfileHeader.vue'
import type { UserProfile } from '@/types/profile'

const profile = ref<UserProfile>({...})
const loading = ref(false)

const handleUpload = async (file: File) => {
  loading.value = true
  // Upload logic
  loading.value = false
}

const handleRemove = async () => {
  loading.value = true
  // Remove logic
  loading.value = false
}
</script>

<template>
  <ProfileHeader
    :profile="profile"
    :loading="loading"
    @upload-avatar="handleUpload"
    @remove-avatar="handleRemove"
  />
</template>
```

### Features

- **Avatar Display**: Shows image or initials fallback
- **File Upload**: Max 5MB, accepts JPEG/PNG/GIF
- **Role Badges**: Color-coded (Admin=purple, Supervisor=blue, Entity=green)
- **Verification Badges**: Email, Phone, 2FA indicators
- **Last Login**: Relative time formatting

---

## ProfileForm

Personal information form with comprehensive validation.

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `profile` | `UserProfile` | Yes | - | Current profile data |
| `loading` | `boolean` | No | `false` | Loading state during submission |

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `submit` | `ProfileFormData` | Emitted with validated form data |
| `cancel` | - | Emitted when user cancels editing |

### Usage Example

```vue
<script setup lang="ts">
import ProfileForm from '@/components/profile/ProfileForm.vue'
import type { UserProfile, ProfileFormData } from '@/types/profile'

const profile = ref<UserProfile>({...})
const loading = ref(false)

const handleSubmit = async (data: ProfileFormData) => {
  loading.value = true
  try {
    await updateProfile(data)
    alert('Profile updated!')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <ProfileForm
    :profile="profile"
    :loading="loading"
    @submit="handleSubmit"
    @cancel="console.log('Cancelled')"
  />
</template>
```

### Validation Rules

**First Name / Last Name:**
- Required
- 2-50 characters
- Letters, spaces, hyphens, apostrophes only
- Regex: `/^[a-zA-Z\s'-]+$/`

**Email:**
- Required
- Valid email format
- Auto-converted to lowercase

**Phone:**
- Optional
- Format: `+X (XXX) XXX-XXXX`
- Accepts +, spaces, hyphens, parentheses

**Date of Birth:**
- Optional
- Age must be 18-120 years

**Address Fields:**
- All optional
- Street: max 100 chars
- City/State/Country: max 50 chars
- Postal Code: max 20 chars

---

## PasswordChange

Password change form with real-time strength validation.

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `loading` | `boolean` | No | `false` | Loading state during submission |

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `submit` | `PasswordChangeData` | Emitted with password data |
| `cancel` | - | Emitted when user cancels |

### Usage Example

```vue
<script setup lang="ts">
import PasswordChange from '@/components/profile/PasswordChange.vue'
import type { PasswordChangeData } from '@/types/profile'

const loading = ref(false)

const handleSubmit = async (data: PasswordChangeData) => {
  loading.value = true
  try {
    await changePassword(data)
    alert('Password changed!')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <PasswordChange
    :loading="loading"
    @submit="handleSubmit"
    @cancel="console.log('Cancelled')"
  />
</template>
```

### Password Strength Scale

| Score | Label | Requirements Met | Color |
|-------|-------|------------------|-------|
| 0 | Very Weak | 0-1 | Red |
| 1 | Weak | 2 | Orange |
| 2 | Fair | 3-4 | Yellow |
| 3 | Strong | 5 | Blue |
| 4 | Very Strong | 5 + length ≥ 12 | Green |

### Requirements Checklist

1. **Minimum Length**: 8+ characters
2. **Uppercase**: At least one uppercase letter (A-Z)
3. **Lowercase**: At least one lowercase letter (a-z)
4. **Number**: At least one digit (0-9)
5. **Special Character**: At least one (!@#$%^&*(),.?":{}|<>)

### Validation Rules

- Current password required
- New password must be different from current
- Confirm password must match new password
- All 5 requirements must be met

---

## NotificationPreferences

Granular notification settings across 4 channels.

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `preferences` | `NotificationPreferences` | Yes | - | Current preferences |
| `loading` | `boolean` | No | `false` | Loading state |

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `save` | `NotificationPreferences` | Emitted when user saves changes |
| `cancel` | - | Emitted when user cancels |
| `reset` | - | Emitted when user resets to defaults |

### Usage Example

```vue
<script setup lang="ts">
import NotificationPreferences from '@/components/profile/NotificationPreferences.vue'
import type { NotificationPreferences as NotificationPrefs } from '@/types/profile'

const preferences = ref<NotificationPrefs>({...})
const loading = ref(false)

const handleSave = async (prefs: NotificationPrefs) => {
  loading.value = true
  try {
    await updatePreferences(prefs)
    alert('Preferences saved!')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <NotificationPreferences
    :preferences="preferences"
    :loading="loading"
    @save="handleSave"
    @cancel="console.log('Cancelled')"
    @reset="console.log('Reset to defaults')"
  />
</template>
```

### Channel Structure

**Email Notifications (6 options):**
- Transaction Alerts
- Compliance Updates
- Security Alerts
- System Notifications
- Weekly Digest
- Monthly Report

**SMS Notifications (3 options):**
- Critical Alerts
- Two-Factor Auth Codes
- Login Alerts

**Push Notifications (3 options):**
- Transaction Alerts
- Task Reminders
- Mentions

**In-App Notifications (2 options):**
- Sound
- Desktop Notifications

### Features

- Main toggle for each channel
- Nested sub-options (hidden when channel disabled)
- Dirty state tracking (deep comparison)
- Unsaved changes warning
- Reset to defaults with confirmation

---

## SessionManagement

View and manage active sessions across devices.

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `sessions` | `Session[]` | Yes | - | List of active sessions |
| `loading` | `boolean` | No | `false` | Loading state |

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `revoke` | `string` (sessionId) | Emitted when revoking single session |
| `revokeAll` | - | Emitted when revoking all other sessions |

### Usage Example

```vue
<script setup lang="ts">
import SessionManagement from '@/components/profile/SessionManagement.vue'
import type { Session } from '@/types/profile'

const sessions = ref<Session[]>([...])
const loading = ref(false)

const handleRevoke = async (sessionId: string) => {
  loading.value = true
  try {
    await revokeSession(sessionId)
    sessions.value = sessions.value.filter(s => s.id !== sessionId)
    alert('Session revoked!')
  } finally {
    loading.value = false
  }
}

const handleRevokeAll = async () => {
  loading.value = true
  try {
    await revokeAllSessions()
    sessions.value = sessions.value.filter(s => s.isCurrent)
    alert('All other sessions revoked!')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <SessionManagement
    :sessions="sessions"
    :loading="loading"
    @revoke="handleRevoke"
    @revoke-all="handleRevokeAll"
  />
</template>
```

### Session Data Structure

Each session includes:
- **Device Info**: Name, type, browser, OS
- **Location**: City, region, country
- **Activity**: Last activity timestamp
- **Status**: Current session indicator

### Device Types

- **Desktop**: Monitor icon
- **Mobile**: Smartphone icon
- **Tablet**: Tablet icon

### Features

- Current session highlighting (blue border, green badge)
- Cannot revoke current session
- Relative time formatting ("Active now", "2h ago")
- Location display (City, Region, Country)
- Bulk revoke with confirmation

---

## TwoFactorAuth

Setup and manage two-factor authentication.

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `twoFactorAuth` | `TwoFactorAuth` | Yes | - | Current 2FA settings |
| `loading` | `boolean` | No | `false` | Loading state |

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `enable` | `'totp' \| 'sms' \| 'email'` | Emitted when enabling 2FA |
| `verify` | `{ code: string, secret: string }` | Emitted to verify setup |
| `disable` | `string` (password) | Emitted when disabling 2FA |
| `regenerateBackupCodes` | - | Emitted to regenerate codes |

### Usage Example

```vue
<script setup lang="ts">
import TwoFactorAuth from '@/components/profile/TwoFactorAuth.vue'
import type { TwoFactorAuth as TwoFactorAuthType } from '@/types/profile'

const twoFactorAuth = ref<TwoFactorAuthType>({...})
const loading = ref(false)

const handleEnable = (method: 'totp' | 'sms' | 'email') => {
  console.log('Enable 2FA with:', method)
  // Backend generates QR code and secret
}

const handleVerify = async (code: string, secret: string) => {
  loading.value = true
  try {
    await verify2FA(code, secret)
    twoFactorAuth.value.enabled = true
    alert('2FA enabled!')
  } finally {
    loading.value = false
  }
}

const handleDisable = async (password: string) => {
  loading.value = true
  try {
    await disable2FA(password)
    twoFactorAuth.value.enabled = false
    alert('2FA disabled!')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <TwoFactorAuth
    :two-factor-auth="twoFactorAuth"
    :loading="loading"
    @enable="handleEnable"
    @verify="handleVerify"
    @disable="handleDisable"
    @regenerate-backup-codes="handleRegenerate"
  />
</template>
```

### 2FA Methods

1. **TOTP (Authenticator App)**: Google Authenticator, Authy, etc.
2. **SMS**: Code sent via text message
3. **Email**: Code sent via email

### TOTP Setup Flow

1. User selects TOTP method
2. Backend generates QR code and secret
3. Component displays QR code
4. User scans with authenticator app
5. User enters 6-digit verification code
6. Backend verifies and enables 2FA
7. Display 10 backup codes

### Backup Codes

- 10 single-use codes generated
- Can copy to clipboard
- Can download as .txt file
- Regenerate anytime (requires password)
- Tracks remaining count

### Features

- Method selection (TOTP/SMS/Email)
- QR code display for TOTP
- Manual secret entry option
- 6-digit code verification
- Backup codes management
- Disable with password confirmation

---

## ActivityLog

View, filter, and export activity history.

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `activities` | `ActivityLogEntry[]` | Yes | - | Activity entries |
| `total` | `number` | Yes | - | Total entries count |
| `page` | `number` | Yes | - | Current page |
| `limit` | `number` | Yes | - | Entries per page |
| `totalPages` | `number` | Yes | - | Total pages |
| `hasNext` | `boolean` | Yes | - | Has next page |
| `hasPrev` | `boolean` | Yes | - | Has previous page |
| `loading` | `boolean` | No | `false` | Loading state |

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `filter` | `ActivityLogFilters` | Emitted when filters change |
| `loadPage` | `number` (page) | Emitted for pagination |
| `export` | `'csv' \| 'json' \| 'pdf'` | Emitted for export |

### Usage Example

```vue
<script setup lang="ts">
import ActivityLog from '@/components/profile/ActivityLog.vue'
import type { ActivityLogEntry, ActivityLogFilters } from '@/types/profile'

const activities = ref<ActivityLogEntry[]>([...])
const page = ref(1)
const limit = ref(10)
const total = ref(150)
const loading = ref(false)

const handleFilter = async (filters: ActivityLogFilters) => {
  loading.value = true
  try {
    const data = await fetchActivities({ ...filters, page: 1, limit: limit.value })
    activities.value = data.activities
    total.value = data.total
    page.value = 1
  } finally {
    loading.value = false
  }
}

const handleLoadPage = async (newPage: number) => {
  loading.value = true
  try {
    const data = await fetchActivities({ page: newPage, limit: limit.value })
    activities.value = data.activities
    page.value = newPage
  } finally {
    loading.value = false
  }
}

const handleExport = (format: 'csv' | 'json' | 'pdf') => {
  console.log('Exporting as:', format)
  // Trigger download
}
</script>

<template>
  <ActivityLog
    :activities="activities"
    :total="total"
    :page="page"
    :limit="limit"
    :total-pages="Math.ceil(total / limit)"
    :has-next="page < Math.ceil(total / limit)"
    :has-prev="page > 1"
    :loading="loading"
    @filter="handleFilter"
    @load-page="handleLoadPage"
    @export="handleExport"
  />
</template>
```

### Filter Options

**Categories (6):**
- Authentication
- Security
- Profile
- Settings
- Data
- System

**Actions (20+):**
- login, logout, login_failed
- password_changed, 2fa_enabled, 2fa_disabled
- profile_updated, avatar_updated
- preferences_updated, session_revoked
- export_data, etc.

**Status:**
- Success (green)
- Failure (red)
- Pending (yellow)

**Date Range:**
- Start Date
- End Date

### Features

- Debounced search (500ms)
- Multi-select filters
- Pagination controls
- Export to CSV/JSON/PDF
- Color-coded status badges
- Category icons
- Relative timestamps
- IP address display
- Location information

---

## Common Patterns

### Error Handling

```typescript
const handleSubmit = async (data: any) => {
  loading.value = true
  try {
    await apiCall(data)
    toast.success('Success!')
  } catch (error) {
    toast.error(error.message)
  } finally {
    loading.value = false
  }
}
```

### Loading States

All components accept a `loading` prop that:
- Disables form inputs
- Disables action buttons
- Shows loading spinners
- Prevents multiple submissions

### Responsive Design

All components are fully responsive:
- Mobile: Stack vertically, full-width inputs
- Tablet: 2-column layouts where appropriate
- Desktop: Optimized spacing and layouts

---

**Next:** See [TYPES.md](./TYPES.md) for complete type definitions.
