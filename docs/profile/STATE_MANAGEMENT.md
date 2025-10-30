# State Management Guide

Using the `useProfile` composable for centralized profile state management.

## Overview

The `useProfile` composable provides a centralized state management layer for all profile-related operations. It handles:

- Profile data fetching and updates
- Avatar management
- Password changes
- Notification preferences
- Session tracking
- Two-factor authentication
- Activity logging

## Basic Usage

```typescript
import { useProfile } from '@/composables/useProfile'

const {
  // State
  profile,
  notifications,
  sessions,
  twoFactorAuth,
  activities,
  
  // Computed
  isProfileLoaded,
  sessionCount,
  
  // Actions
  fetchProfile,
  updateProfile,
  uploadAvatar
} = useProfile()
```

## State Properties

### profile

```typescript
const profile: Ref<UserProfile | null>
```

Current user profile data. `null` when not loaded.

### notifications

```typescript
const notifications: Ref<NotificationPreferences | null>
```

User notification preferences across all channels.

### sessions

```typescript
const sessions: Ref<Session[]>
```

List of active sessions.

### twoFactorAuth

```typescript
const twoFactorAuth: Ref<TwoFactorAuth | null>
```

Two-factor authentication configuration.

### activities

```typescript
const activities: Ref<ActivityLogEntry[]>
```

Recent activity log entries.

### Loading States

```typescript
const loading: Ref<{
  profile: boolean
  password: boolean
  notifications: boolean
  sessions: boolean
  twoFactor: boolean
  activity: boolean
}>
```

Individual loading states for each operation.

## Computed Properties

### isProfileLoaded

```typescript
const isProfileLoaded: ComputedRef<boolean>
```

Returns `true` when profile data has been loaded.

### sessionCount

```typescript
const sessionCount: ComputedRef<number>
```

Total number of active sessions.

### activityTotalPages

```typescript
const activityTotalPages: ComputedRef<number>
```

Total pages for activity log pagination.

### activityHasNext / activityHasPrev

```typescript
const activityHasNext: ComputedRef<boolean>
const activityHasPrev: ComputedRef<boolean>
```

Pagination helpers for activity log.

## Profile Actions

### fetchProfile()

Load user profile data.

```typescript
const fetchProfile: () => Promise<void>

// Usage
await fetchProfile()
console.log(profile.value) // UserProfile data
```

### updateProfile()

Update profile information.

```typescript
const updateProfile: (data: ProfileFormData) => Promise<void>

// Usage
await updateProfile({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phoneNumber: '+1 (555) 123-4567'
})
```

### uploadAvatar()

Upload new profile picture.

```typescript
const uploadAvatar: (file: File) => Promise<void>

// Usage
const handleFileSelect = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    await uploadAvatar(file)
  }
}
```

### removeAvatar()

Remove current profile picture.

```typescript
const removeAvatar: () => Promise<void>

// Usage
await removeAvatar()
```

## Password Actions

### changePassword()

Change user password.

```typescript
const changePassword: (data: PasswordChangeData) => Promise<void>

// Usage
await changePassword({
  currentPassword: 'OldPass123!',
  newPassword: 'NewPass456!',
  confirmPassword: 'NewPass456!'
})
```

## Notification Actions

### fetchNotifications()

Load notification preferences.

```typescript
const fetchNotifications: () => Promise<void>

// Usage
await fetchNotifications()
console.log(notifications.value) // NotificationPreferences
```

### updateNotifications()

Update notification settings.

```typescript
const updateNotifications: (prefs: NotificationPreferences) => Promise<void>

// Usage
await updateNotifications({
  email: {
    enabled: true,
    transactionAlerts: true,
    // ... other options
  },
  sms: { enabled: false, /* ... */ },
  push: { enabled: false, /* ... */ },
  inApp: { enabled: true, /* ... */ }
})
```

## Session Actions

### fetchSessions()

Load active sessions.

```typescript
const fetchSessions: () => Promise<void>

// Usage
await fetchSessions()
console.log(sessions.value) // Session[]
```

### revokeSession()

Revoke a specific session.

```typescript
const revokeSession: (sessionId: string) => Promise<void>

// Usage
await revokeSession('session-123')
```

### revokeAllSessions()

Revoke all sessions except current.

```typescript
const revokeAllSessions: () => Promise<void>

// Usage
if (confirm('Revoke all other sessions?')) {
  await revokeAllSessions()
}
```

## Two-Factor Authentication Actions

### fetchTwoFactorAuth()

Load 2FA configuration.

```typescript
const fetchTwoFactorAuth: () => Promise<void>

// Usage
await fetchTwoFactorAuth()
console.log(twoFactorAuth.value) // TwoFactorAuth
```

### enableTwoFactor()

Initiate 2FA setup.

```typescript
const enableTwoFactor: (method: 'totp' | 'sms' | 'email') => Promise<TwoFactorSetupData>

// Usage
const setupData = await enableTwoFactor('totp')
console.log(setupData.qrCode) // Display QR code
console.log(setupData.secret) // For manual entry
```

### verifyTwoFactor()

Verify 2FA setup with code.

```typescript
const verifyTwoFactor: (code: string, secret: string) => Promise<string[]>

// Usage
const backupCodes = await verifyTwoFactor('123456', setupData.secret)
console.log('Backup codes:', backupCodes) // 10 codes
```

### disableTwoFactor()

Disable 2FA (requires password).

```typescript
const disableTwoFactor: (password: string) => Promise<void>

// Usage
await disableTwoFactor('MyPassword123!')
```

### regenerateBackupCodes()

Generate new backup codes.

```typescript
const regenerateBackupCodes: () => Promise<string[]>

// Usage
const newCodes = await regenerateBackupCodes()
console.log('New backup codes:', newCodes)
```

## Activity Log Actions

### fetchActivityLog()

Load activity history.

```typescript
const fetchActivityLog: (params: {
  page?: number
  limit?: number
  filters?: ActivityLogFilters
}) => Promise<void>

// Usage
await fetchActivityLog({
  page: 1,
  limit: 10,
  filters: {
    category: ['authentication', 'security'],
    status: ['success']
  }
})
```

### exportActivityLog()

Export activity data.

```typescript
const exportActivityLog: (format: 'csv' | 'json' | 'pdf', filters?: ActivityLogFilters) => Promise<string>

// Usage
const downloadUrl = await exportActivityLog('csv', {
  startDate: '2025-10-01',
  endDate: '2025-10-30'
})
// Trigger download
window.open(downloadUrl, '_blank')
```

## Complete Example

```vue
<script setup lang="ts">
import { onMounted } from 'vue'
import { useProfile } from '@/composables/useProfile'
import { useToast } from 'vue-toastification'

const toast = useToast()

const {
  // State
  profile,
  sessions,
  loading,
  
  // Computed
  isProfileLoaded,
  sessionCount,
  
  // Actions
  fetchProfile,
  updateProfile,
  fetchSessions,
  revokeSession
} = useProfile()

// Load data on mount
onMounted(async () => {
  try {
    await Promise.all([
      fetchProfile(),
      fetchSessions()
    ])
  } catch (error) {
    toast.error('Failed to load profile data')
  }
})

// Update profile
const handleUpdateProfile = async (data: ProfileFormData) => {
  try {
    await updateProfile(data)
    toast.success('Profile updated successfully!')
  } catch (error) {
    toast.error(error.message)
  }
}

// Revoke session
const handleRevokeSession = async (sessionId: string) => {
  if (!confirm('Revoke this session?')) return
  
  try {
    await revokeSession(sessionId)
    toast.success('Session revoked!')
  } catch (error) {
    toast.error(error.message)
  }
}
</script>

<template>
  <div v-if="isProfileLoaded">
    <h1>Welcome, {{ profile?.firstName }}!</h1>
    <p>Active sessions: {{ sessionCount }}</p>
    
    <ProfileForm
      :profile="profile"
      :loading="loading.profile"
      @submit="handleUpdateProfile"
    />
    
    <SessionManagement
      :sessions="sessions"
      :loading="loading.sessions"
      @revoke="handleRevokeSession"
    />
  </div>
  
  <div v-else>
    Loading...
  </div>
</template>
```

## Error Handling

All composable actions throw errors that should be caught:

```typescript
try {
  await updateProfile(data)
} catch (error) {
  if (error.code === 'VALIDATION_ERROR') {
    // Handle validation errors
    console.log(error.details)
  } else if (error.code === 'AUTH_ERROR') {
    // Handle authentication errors
    router.push('/login')
  } else {
    // Generic error
    console.error(error.message)
  }
}
```

## Optimistic Updates

For better UX, update UI optimistically:

```typescript
const handleToggleNotification = async (channel: string, enabled: boolean) => {
  // Update UI immediately
  if (notifications.value) {
    notifications.value[channel].enabled = enabled
  }
  
  try {
    // Sync with backend
    await updateNotifications(notifications.value!)
  } catch (error) {
    // Revert on error
    if (notifications.value) {
      notifications.value[channel].enabled = !enabled
    }
    toast.error('Failed to update notification settings')
  }
}
```

## Reactivity Patterns

### Watching Profile Changes

```typescript
import { watch } from 'vue'

watch(profile, (newProfile, oldProfile) => {
  if (newProfile && !oldProfile) {
    console.log('Profile loaded:', newProfile)
  }
})
```

### Computed Derived State

```typescript
import { computed } from 'vue'

const isEmailVerified = computed(() => {
  return profile.value?.emailVerified ?? false
})

const needs2FA = computed(() => {
  return profile.value?.role === 'admin' && !profile.value?.twoFactorEnabled
})
```

## Best Practices

1. **Load Data Early**: Fetch in `onMounted` or route guard
2. **Handle Errors**: Always wrap in try/catch
3. **Show Loading**: Use loading states for UX
4. **Optimistic Updates**: Update UI before API call
5. **Cache Wisely**: Don't re-fetch unnecessarily
6. **Clear on Logout**: Reset state when user logs out

---

**Next:** See [TESTING.md](./TESTING.md) for testing strategies.
