/**
 * useProfile Composable
 * State management and API interactions for user profile management
 */

import { ref, computed } from 'vue'
import type {
  UserProfile,
  ProfileFormData,
  PasswordChangeData,
  NotificationPreferences,
  Session,
  TwoFactorAuth,
  ActivityLogEntry,
  ActivityLogFilters,
  TwoFactorSetupResponse
} from '@/types/profile'

/**
 * Profile composable state
 */
const profile = ref<UserProfile | null>(null)
const sessions = ref<Session[]>([])
const twoFactorAuth = ref<TwoFactorAuth>({
  enabled: false,
  method: null,
  verified: false,
  backupCodesGenerated: false,
  backupCodesRemaining: 0
})
const notificationPreferences = ref<NotificationPreferences>({
  email: {
    enabled: true,
    transactionAlerts: true,
    complianceUpdates: true,
    securityAlerts: true,
    systemNotifications: false,
    weeklyDigest: true,
    monthlyReport: true
  },
  sms: {
    enabled: true,
    criticalAlerts: true,
    twoFactorAuth: true,
    loginAlerts: false
  },
  push: {
    enabled: false,
    transactionAlerts: false,
    taskReminders: false,
    mentions: false
  },
  inApp: {
    enabled: true,
    sound: true,
    desktop: false
  }
})
const activities = ref<ActivityLogEntry[]>([])
const activityTotal = ref(0)
const activityPage = ref(1)
const activityLimit = ref(10)

// Loading states
const profileLoading = ref(false)
const sessionsLoading = ref(false)
const twoFactorLoading = ref(false)
const notificationsLoading = ref(false)
const activitiesLoading = ref(false)

// Error states
const profileError = ref<string | null>(null)
const sessionsError = ref<string | null>(null)
const twoFactorError = ref<string | null>(null)
const notificationsError = ref<string | null>(null)
const activitiesError = ref<string | null>(null)

/**
 * Main Profile Operations
 */

/**
 * Fetch user profile
 */
export const fetchProfile = async (): Promise<void> => {
  profileLoading.value = true
  profileError.value = null

  try {
    // TODO: Replace with actual API call
    // const response = await api.get('/api/profile')
    // profile.value = response.data

    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    profile.value = {
      id: 'user-123',
      email: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe',
      fullName: 'John Doe',
      phoneNumber: '+1 (555) 123-4567',
      avatar: undefined,
      role: 'admin',
      dateOfBirth: '1985-06-15',
      address: {
        street: '123 Main Street',
        street2: 'Apt 4B',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'United States'
      },
      emailVerified: true,
      phoneVerified: true,
      twoFactorEnabled: false,
      verified: true,
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2025-10-25T14:20:00Z',
      lastLogin: '2025-10-30T08:15:00Z',
      metadata: {
        lastLoginIp: '192.168.1.100',
        lastLoginLocation: 'New York, NY, US'
      }
    }
  } catch (error) {
    profileError.value = error instanceof Error ? error.message : 'Failed to fetch profile'
    console.error('Error fetching profile:', error)
    throw error
  } finally {
    profileLoading.value = false
  }
}

/**
 * Update user profile
 */
export const updateProfile = async (data: ProfileFormData): Promise<void> => {
  profileLoading.value = true
  profileError.value = null

  try {
    // TODO: Replace with actual API call
    // const response = await api.put('/api/profile', data)
    // profile.value = response.data

    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    if (profile.value) {
      Object.assign(profile.value, data)
      profile.value.updatedAt = new Date().toISOString()
    }
  } catch (error) {
    profileError.value = error instanceof Error ? error.message : 'Failed to update profile'
    console.error('Error updating profile:', error)
    throw error
  } finally {
    profileLoading.value = false
  }
}

/**
 * Upload avatar
 */
export const uploadAvatar = async (file: File): Promise<void> => {
  profileLoading.value = true
  profileError.value = null

  try {
    // TODO: Replace with actual API call
    // const formData = new FormData()
    // formData.append('avatar', file)
    // const response = await api.post('/api/profile/avatar', formData)
    // profile.value.avatar = response.data.url

    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const reader = new FileReader()
    reader.onload = (e) => {
      if (profile.value) {
        profile.value.avatar = e.target?.result as string
      }
    }
    reader.readAsDataURL(file)
  } catch (error) {
    profileError.value = error instanceof Error ? error.message : 'Failed to upload avatar'
    console.error('Error uploading avatar:', error)
    throw error
  } finally {
    profileLoading.value = false
  }
}

/**
 * Remove avatar
 */
export const removeAvatar = async (): Promise<void> => {
  profileLoading.value = true
  profileError.value = null

  try {
    // TODO: Replace with actual API call
    // await api.delete('/api/profile/avatar')

    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 500))
    
    if (profile.value) {
      profile.value.avatar = undefined
    }
  } catch (error) {
    profileError.value = error instanceof Error ? error.message : 'Failed to remove avatar'
    console.error('Error removing avatar:', error)
    throw error
  } finally {
    profileLoading.value = false
  }
}

/**
 * Password Management
 */

/**
 * Change password
 */
export const changePassword = async (data: PasswordChangeData): Promise<void> => {
  profileLoading.value = true
  profileError.value = null

  try {
    // TODO: Replace with actual API call
    // await api.post('/api/profile/password', data)

    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Password changed successfully
    console.log('Password changed:', data)
  } catch (error) {
    profileError.value = error instanceof Error ? error.message : 'Failed to change password'
    console.error('Error changing password:', error)
    throw error
  } finally {
    profileLoading.value = false
  }
}

/**
 * Notification Preferences
 */

/**
 * Fetch notification preferences
 */
export const fetchNotificationPreferences = async (): Promise<void> => {
  notificationsLoading.value = true
  notificationsError.value = null

  try {
    // TODO: Replace with actual API call
    // const response = await api.get('/api/profile/notifications')
    // notificationPreferences.value = response.data

    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Already initialized with defaults
  } catch (error) {
    notificationsError.value = error instanceof Error ? error.message : 'Failed to fetch notification preferences'
    console.error('Error fetching notification preferences:', error)
    throw error
  } finally {
    notificationsLoading.value = false
  }
}

/**
 * Update notification preferences
 */
export const updateNotificationPreferences = async (preferences: NotificationPreferences): Promise<void> => {
  notificationsLoading.value = true
  notificationsError.value = null

  try {
    // TODO: Replace with actual API call
    // await api.put('/api/profile/notifications', preferences)

    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    notificationPreferences.value = { ...preferences }
  } catch (error) {
    notificationsError.value = error instanceof Error ? error.message : 'Failed to update notification preferences'
    console.error('Error updating notification preferences:', error)
    throw error
  } finally {
    notificationsLoading.value = false
  }
}

/**
 * Session Management
 */

/**
 * Fetch active sessions
 */
export const fetchSessions = async (): Promise<void> => {
  sessionsLoading.value = true
  sessionsError.value = null

  try {
    // TODO: Replace with actual API call
    // const response = await api.get('/api/profile/sessions')
    // sessions.value = response.data

    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 500))
    
    sessions.value = [
      {
        id: 'session-1',
        deviceName: 'Chrome on Windows',
        deviceType: 'desktop',
        browser: 'Chrome',
        browserVersion: '119.0',
        os: 'Windows 11',
        ipAddress: '192.168.1.100',
        location: {
          city: 'New York',
          region: 'NY',
          country: 'US'
        },
        lastActivity: new Date().toISOString(),
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        isCurrent: true
      },
      {
        id: 'session-2',
        deviceName: 'Safari on iPhone',
        deviceType: 'mobile',
        browser: 'Safari',
        browserVersion: '17.0',
        os: 'iOS 17',
        ipAddress: '192.168.1.105',
        location: {
          city: 'New York',
          region: 'NY',
          country: 'US'
        },
        lastActivity: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        isCurrent: false
      },
      {
        id: 'session-3',
        deviceName: 'Firefox on Mac',
        deviceType: 'desktop',
        browser: 'Firefox',
        browserVersion: '120.0',
        os: 'macOS 14',
        ipAddress: '10.0.0.50',
        location: {
          city: 'Brooklyn',
          region: 'NY',
          country: 'US'
        },
        lastActivity: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        isCurrent: false
      }
    ]
  } catch (error) {
    sessionsError.value = error instanceof Error ? error.message : 'Failed to fetch sessions'
    console.error('Error fetching sessions:', error)
    throw error
  } finally {
    sessionsLoading.value = false
  }
}

/**
 * Revoke a specific session
 */
export const revokeSession = async (sessionId: string): Promise<void> => {
  sessionsLoading.value = true
  sessionsError.value = null

  try {
    // TODO: Replace with actual API call
    // await api.delete(`/api/profile/sessions/${sessionId}`)

    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    sessions.value = sessions.value.filter(s => s.id !== sessionId)
  } catch (error) {
    sessionsError.value = error instanceof Error ? error.message : 'Failed to revoke session'
    console.error('Error revoking session:', error)
    throw error
  } finally {
    sessionsLoading.value = false
  }
}

/**
 * Revoke all other sessions
 */
export const revokeAllSessions = async (): Promise<void> => {
  sessionsLoading.value = true
  sessionsError.value = null

  try {
    // TODO: Replace with actual API call
    // await api.delete('/api/profile/sessions/all')

    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    sessions.value = sessions.value.filter(s => s.isCurrent)
  } catch (error) {
    sessionsError.value = error instanceof Error ? error.message : 'Failed to revoke all sessions'
    console.error('Error revoking all sessions:', error)
    throw error
  } finally {
    sessionsLoading.value = false
  }
}

/**
 * Two-Factor Authentication
 */

/**
 * Fetch 2FA status
 */
export const fetchTwoFactorAuth = async (): Promise<void> => {
  twoFactorLoading.value = true
  twoFactorError.value = null

  try {
    // TODO: Replace with actual API call
    // const response = await api.get('/api/profile/2fa')
    // twoFactorAuth.value = response.data

    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Already initialized with defaults
  } catch (error) {
    twoFactorError.value = error instanceof Error ? error.message : 'Failed to fetch 2FA status'
    console.error('Error fetching 2FA status:', error)
    throw error
  } finally {
    twoFactorLoading.value = false
  }
}

/**
 * Enable two-factor authentication
 */
export const enableTwoFactor = async (method: 'totp' | 'sms' | 'email'): Promise<TwoFactorSetupResponse> => {
  twoFactorLoading.value = true
  twoFactorError.value = null

  try {
    // TODO: Replace with actual API call
    // const response = await api.post('/api/profile/2fa/enable', { method })
    // return response.data

    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return {
      success: true,
      secret: 'JBSWY3DPEHPK3PXP',
      qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      backupCodes: [
        '1234-5678-90AB',
        'CDEF-1234-5678',
        '90AB-CDEF-1234',
        '5678-90AB-CDEF',
        '1234-CDEF-5678',
        '90AB-1234-CDEF',
        '5678-CDEF-90AB',
        'CDEF-5678-1234',
        '90AB-5678-CDEF',
        '1234-90AB-5678'
      ],
      method
    }
  } catch (error) {
    twoFactorError.value = error instanceof Error ? error.message : 'Failed to enable 2FA'
    console.error('Error enabling 2FA:', error)
    throw error
  } finally {
    twoFactorLoading.value = false
  }
}

/**
 * Verify two-factor authentication code
 */
export const verifyTwoFactor = async (_code: string, _secret: string): Promise<void> => {
  twoFactorLoading.value = true
  twoFactorError.value = null

  try {
    // TODO: Replace with actual API call
    // await api.post('/api/profile/2fa/verify', { code, secret })

    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    twoFactorAuth.value.enabled = true
    twoFactorAuth.value.method = 'totp'
    twoFactorAuth.value.verified = true
    twoFactorAuth.value.backupCodesGenerated = true
    twoFactorAuth.value.backupCodesRemaining = 10
    twoFactorAuth.value.lastUsed = new Date().toISOString()
    
    if (profile.value) {
      profile.value.twoFactorEnabled = true
    }
  } catch (error) {
    twoFactorError.value = error instanceof Error ? error.message : 'Failed to verify 2FA code'
    console.error('Error verifying 2FA code:', error)
    throw error
  } finally {
    twoFactorLoading.value = false
  }
}

/**
 * Disable two-factor authentication
 */
export const disableTwoFactor = async (_password: string): Promise<void> => {
  twoFactorLoading.value = true
  twoFactorError.value = null

  try {
    // TODO: Replace with actual API call
    // await api.post('/api/profile/2fa/disable', { password })

    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    twoFactorAuth.value.enabled = false
    twoFactorAuth.value.method = null
    twoFactorAuth.value.verified = false
    twoFactorAuth.value.backupCodesGenerated = false
    twoFactorAuth.value.backupCodesRemaining = 0
    
    if (profile.value) {
      profile.value.twoFactorEnabled = false
    }
  } catch (error) {
    twoFactorError.value = error instanceof Error ? error.message : 'Failed to disable 2FA'
    console.error('Error disabling 2FA:', error)
    throw error
  } finally {
    twoFactorLoading.value = false
  }
}

/**
 * Regenerate backup codes
 */
export const regenerateBackupCodes = async (): Promise<string[]> => {
  twoFactorLoading.value = true
  twoFactorError.value = null

  try {
    // TODO: Replace with actual API call
    // const response = await api.post('/api/profile/2fa/backup-codes')
    // return response.data.backupCodes

    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newBackupCodes = [
      'ABCD-EFGH-IJKL',
      'MNOP-QRST-UVWX',
      'YZ12-3456-7890',
      'ABCD-1234-EFGH',
      '5678-IJKL-90MN',
      'OPQR-STUV-WXYZ',
      '1234-5678-ABCD',
      'EFGH-IJKL-MNOP',
      'QRST-UVWX-YZ12',
      '3456-7890-ABCD'
    ]
    
    twoFactorAuth.value.backupCodesRemaining = 10
    
    return newBackupCodes
  } catch (error) {
    twoFactorError.value = error instanceof Error ? error.message : 'Failed to regenerate backup codes'
    console.error('Error regenerating backup codes:', error)
    throw error
  } finally {
    twoFactorLoading.value = false
  }
}

/**
 * Activity Log
 */

/**
 * Fetch activity log
 */
export const fetchActivityLog = async (
  page = 1,
  limit = 10,
  _filters?: ActivityLogFilters
): Promise<void> => {
  activitiesLoading.value = true
  activitiesError.value = null

  try {
    // TODO: Replace with actual API call
    // const response = await api.get('/api/profile/activity', { params: { page, limit, ...filters } })
    // activities.value = response.data.activities
    // activityTotal.value = response.data.total

    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 500))
    
    activityPage.value = page
    activityLimit.value = limit
    activityTotal.value = 150
    
    // Generate mock activities based on page
    const mockActivities: ActivityLogEntry[] = []
    const startIndex = (page - 1) * limit
    
    for (let i = 0; i < limit; i++) {
      const index = startIndex + i
      if (index >= activityTotal.value) break
      
      mockActivities.push({
        id: `activity-${index + 1}`,
        userId: 'user-123',
        action: ['login', 'logout', 'profile_updated', 'password_changed'][index % 4] as any,
        category: ['authentication', 'security', 'profile', 'settings'][index % 4] as any,
        description: `Activity ${index + 1} description`,
        timestamp: new Date(Date.now() - index * 60 * 60 * 1000).toISOString(),
        ipAddress: '192.168.1.100',
        location: { city: 'New York', country: 'US' },
        status: ['success', 'failure', 'pending'][index % 3] as any,
        metadata: {}
      })
    }
    
    activities.value = mockActivities
  } catch (error) {
    activitiesError.value = error instanceof Error ? error.message : 'Failed to fetch activity log'
    console.error('Error fetching activity log:', error)
    throw error
  } finally {
    activitiesLoading.value = false
  }
}

/**
 * Export activity log
 */
export const exportActivityLog = async (format: 'csv' | 'json' | 'pdf'): Promise<void> => {
  activitiesLoading.value = true
  activitiesError.value = null

  try {
    // TODO: Replace with actual API call
    // const response = await api.get(`/api/profile/activity/export?format=${format}`)
    // const blob = new Blob([response.data], { type: mimeType })
    // const url = window.URL.createObjectURL(blob)
    // const a = document.createElement('a')
    // a.href = url
    // a.download = `activity-log.${format}`
    // a.click()

    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log(`Exporting activity log as ${format}`)
    alert(`Activity log exported as ${format.toUpperCase()}!`)
  } catch (error) {
    activitiesError.value = error instanceof Error ? error.message : 'Failed to export activity log'
    console.error('Error exporting activity log:', error)
    throw error
  } finally {
    activitiesLoading.value = false
  }
}

/**
 * Composable hook
 */
export function useProfile() {
  // Computed properties
  const isProfileLoaded = computed(() => profile.value !== null)
  const sessionCount = computed(() => sessions.value.length)
  const currentSession = computed(() => sessions.value.find(s => s.isCurrent))
  const otherSessions = computed(() => sessions.value.filter(s => !s.isCurrent))
  const activityTotalPages = computed(() => Math.ceil(activityTotal.value / activityLimit.value))
  const activityHasNext = computed(() => activityPage.value < activityTotalPages.value)
  const activityHasPrev = computed(() => activityPage.value > 1)

  return {
    // State
    profile,
    sessions,
    twoFactorAuth,
    notificationPreferences,
    activities,
    activityTotal,
    activityPage,
    activityLimit,
    
    // Loading states
    profileLoading,
    sessionsLoading,
    twoFactorLoading,
    notificationsLoading,
    activitiesLoading,
    
    // Error states
    profileError,
    sessionsError,
    twoFactorError,
    notificationsError,
    activitiesError,
    
    // Computed
    isProfileLoaded,
    sessionCount,
    currentSession,
    otherSessions,
    activityTotalPages,
    activityHasNext,
    activityHasPrev,
    
    // Profile methods
    fetchProfile,
    updateProfile,
    uploadAvatar,
    removeAvatar,
    changePassword,
    
    // Notification methods
    fetchNotificationPreferences,
    updateNotificationPreferences,
    
    // Session methods
    fetchSessions,
    revokeSession,
    revokeAllSessions,
    
    // 2FA methods
    fetchTwoFactorAuth,
    enableTwoFactor,
    verifyTwoFactor,
    disableTwoFactor,
    regenerateBackupCodes,
    
    // Activity methods
    fetchActivityLog,
    exportActivityLog
  }
}
