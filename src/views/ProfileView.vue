<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { User, Shield, Bell, Monitor, Activity } from 'lucide-vue-next'
import ProfileHeader from '@/components/profile/ProfileHeader.vue'
import ProfileForm from '@/components/profile/ProfileForm.vue'
import PasswordChange from '@/components/profile/PasswordChange.vue'
import NotificationPreferences from '@/components/profile/NotificationPreferences.vue'
import SessionManagement from '@/components/profile/SessionManagement.vue'
import TwoFactorAuth from '@/components/profile/TwoFactorAuth.vue'
import ActivityLog from '@/components/profile/ActivityLog.vue'
import type {
  UserProfile,
  ProfileFormData,
  PasswordChangeData,
  NotificationPreferences as NotificationPrefs,
  Session,
  TwoFactorAuth as TwoFactorAuthType,
  ActivityLogEntry,
  ActivityLogFilters
} from '@/types/profile'

const route = useRoute()
const router = useRouter()

// Tab configuration
type TabId = 'profile' | 'security' | 'notifications' | 'sessions' | 'activity'

interface Tab {
  id: TabId
  label: string
  icon: any
  badge?: number
}

const tabs: Tab[] = [
  { id: 'profile', label: 'Profile Info', icon: User },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'sessions', label: 'Sessions', icon: Monitor, badge: 3 },
  { id: 'activity', label: 'Activity Log', icon: Activity }
]

const activeTab = computed<TabId>(() => {
  const tab = route.query.tab as TabId
  return tabs.some(t => t.id === tab) ? tab : 'profile'
})

const changeTab = (tabId: TabId) => {
  router.push({ query: { tab: tabId } })
}

// Loading states
const profileFormLoading = ref(false)
const passwordChangeLoading = ref(false)
const notificationLoading = ref(false)
const sessionLoading = ref(false)
const activityLoading = ref(false)

// Mock profile data
const profile = ref<UserProfile>({
  id: 'user-123',
  email: 'john.doe@example.com',
  firstName: 'John',
  lastName: 'Doe',
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
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2025-10-25T14:20:00Z',
  lastLogin: '2025-10-30T08:15:00Z',
  verified: true,
  fullName: 'John Doe',
  metadata: {
    lastLoginIp: '192.168.1.100',
    lastLoginLocation: 'New York, NY, US'
  }
})

// Mock sessions data
const sessions = ref<Session[]>([
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
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
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
    lastActivity: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
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
    lastActivity: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    isCurrent: false
  }
])

// Mock 2FA data
const twoFactorAuth = ref<TwoFactorAuthType>({
  enabled: false,
  method: null,
  verified: false,
  backupCodesGenerated: false,
  backupCodesRemaining: 0,
  lastUsed: undefined
})

// Mock notification preferences
const notificationPreferences = ref<NotificationPrefs>({
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

// Mock activity log data
const activities = ref<ActivityLogEntry[]>([
  {
    id: 'activity-1',
    action: 'login',
    category: 'authentication',
    description: 'Successful login from Chrome on Windows',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    ipAddress: '192.168.1.100',
    location: { city: 'New York', country: 'US' },
    status: 'success',
    userId: 'user-123',
    metadata: { browser: 'Chrome', device: 'Windows' }
  },
  {
    id: 'activity-2',
    action: 'profile_updated',
    category: 'profile',
    description: 'Updated profile information',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    ipAddress: '192.168.1.100',
    location: { city: 'New York', country: 'US' },
    status: 'success',
    userId: 'user-123',
    metadata: { fields: ['phoneNumber', 'address'] }
  },
  {
    id: 'activity-3',
    action: 'password_changed',
    category: 'security',
    description: 'Password changed successfully',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    ipAddress: '192.168.1.100',
    location: { city: 'New York', country: 'US' },
    status: 'success',
    userId: 'user-123',
    metadata: {}
  },
  {
    id: 'activity-4',
    action: 'login_failed',
    category: 'authentication',
    description: 'Failed login attempt - invalid password',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    ipAddress: '203.0.113.42',
    location: undefined,
    status: 'failure',
    userId: 'user-123',
    metadata: { reason: 'invalid_password' }
  },
  {
    id: 'activity-5',
    action: 'preferences_updated',
    category: 'settings',
    description: 'Updated notification preferences',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    ipAddress: '192.168.1.105',
    location: { city: 'New York', country: 'US' },
    status: 'success',
    userId: 'user-123',
    metadata: { changes: ['email.weeklyDigest', 'sms.enabled'] }
  },
  {
    id: 'activity-6',
    action: 'session_revoked',
    category: 'security',
    description: 'Revoked session from Firefox on Mac',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    ipAddress: '192.168.1.100',
    location: { city: 'New York', country: 'US' },
    status: 'success',
    userId: 'user-123',
    metadata: { sessionId: 'session-old-1' }
  },
  {
    id: 'activity-7',
    action: 'email_verified',
    category: 'profile',
    description: 'Email address verified',
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    ipAddress: '192.168.1.100',
    location: { city: 'New York', country: 'US' },
    status: 'success',
    userId: 'user-123',
    metadata: { email: 'john.doe@example.com' }
  },
  {
    id: 'activity-8',
    action: 'avatar_updated',
    category: 'profile',
    description: 'Profile picture updated',
    timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
    ipAddress: '192.168.1.105',
    location: { city: 'New York', country: 'US' },
    status: 'success',
    userId: 'user-123',
    metadata: { fileSize: '2.4 MB', fileType: 'image/jpeg' }
  },
  {
    id: 'activity-9',
    action: 'export_data',
    category: 'data',
    description: 'Exported activity log data',
    timestamp: new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString(),
    ipAddress: '192.168.1.100',
    location: { city: 'New York', country: 'US' },
    status: 'success',
    userId: 'user-123',
    metadata: { format: 'CSV', records: 150 }
  },
  {
    id: 'activity-10',
    action: 'login',
    category: 'authentication',
    description: 'Successful login from Safari on iPhone',
    timestamp: new Date(Date.now() - 120 * 60 * 60 * 1000).toISOString(),
    ipAddress: '192.168.1.105',
    location: { city: 'New York', country: 'US' },
    status: 'success',
    userId: 'user-123',
    metadata: { browser: 'Safari', device: 'iPhone' }
  }
])

const activityPage = ref(1)
const activityLimit = ref(10)
const activityTotal = ref(150)
const activityTotalPages = ref(15)
const activityHasNext = ref(true)
const activityHasPrev = ref(false)

// Event Handlers

// ProfileHeader handlers
const handleUploadAvatar = async (file: File) => {
  console.log('Upload avatar:', file.name)
  profileFormLoading.value = true
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Create preview URL
  const reader = new FileReader()
  reader.onload = (e) => {
    profile.value.avatar = e.target?.result as string
  }
  reader.readAsDataURL(file)
  
  profileFormLoading.value = false
}

const handleRemoveAvatar = async () => {
  console.log('Remove avatar')
  profileFormLoading.value = true
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500))
  
  profile.value.avatar = undefined
  profileFormLoading.value = false
}

// ProfileForm handlers
const handleUpdateProfile = async (data: ProfileFormData) => {
  console.log('Update profile:', data)
  profileFormLoading.value = true
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  // Update profile data
  Object.assign(profile.value, data)
  profile.value.updatedAt = new Date().toISOString()
  
  profileFormLoading.value = false
  alert('Profile updated successfully!')
}

const handleCancelProfileEdit = () => {
  console.log('Cancel profile edit')
}

// PasswordChange handlers
const handleChangePassword = async (_data: PasswordChangeData) => {
  console.log('Change password')
  passwordChangeLoading.value = true
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  passwordChangeLoading.value = false
  alert('Password changed successfully! Please log in again.')
}

const handleCancelPasswordChange = () => {
  console.log('Cancel password change')
}

// NotificationPreferences handlers
const handleSaveNotifications = async (preferences: NotificationPrefs) => {
  console.log('Save notification preferences:', preferences)
  notificationLoading.value = true
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  notificationPreferences.value = { ...preferences }
  
  notificationLoading.value = false
  alert('Notification preferences saved!')
}

const handleCancelNotifications = () => {
  console.log('Cancel notification preferences')
}

const handleResetNotifications = () => {
  console.log('Reset notification preferences to defaults')
}

// SessionManagement handlers
const handleRevokeSession = async (sessionId: string) => {
  console.log('Revoke session:', sessionId)
  sessionLoading.value = true
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Remove session from list
  sessions.value = sessions.value.filter(s => s.id !== sessionId)
  
  // Update badge count
  const sessionTab = tabs.find(t => t.id === 'sessions')
  if (sessionTab) {
    sessionTab.badge = sessions.value.length
  }
  
  sessionLoading.value = false
  alert('Session revoked successfully!')
}

const handleRevokeAllSessions = async () => {
  console.log('Revoke all sessions')
  sessionLoading.value = true
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  // Keep only current session
  sessions.value = sessions.value.filter(s => s.isCurrent)
  
  // Update badge count
  const sessionTab = tabs.find(t => t.id === 'sessions')
  if (sessionTab) {
    sessionTab.badge = sessions.value.length
  }
  
  sessionLoading.value = false
  alert('All other sessions revoked successfully!')
}

// TwoFactorAuth handlers
const handleEnable2FA = (method: 'totp' | 'sms' | 'email') => {
  console.log('Enable 2FA with method:', method)
  // In real app, this would trigger backend to generate QR code and secret
  // For now, we'll simulate the setup data being returned
}

const handleVerify2FA = async (code: string, secret: string) => {
  console.log('Verify 2FA code:', code, 'with secret:', secret)
  passwordChangeLoading.value = true
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  // Enable 2FA
  twoFactorAuth.value.enabled = true
  twoFactorAuth.value.method = 'totp'
  twoFactorAuth.value.verified = true
  twoFactorAuth.value.backupCodesGenerated = true
  twoFactorAuth.value.backupCodesRemaining = 10
  twoFactorAuth.value.lastUsed = new Date().toISOString()
  
  profile.value.twoFactorEnabled = true
  
  passwordChangeLoading.value = false
  alert('Two-factor authentication enabled successfully!')
}

const handleDisable2FA = async (_password: string) => {
  console.log('Disable 2FA with password verification')
  passwordChangeLoading.value = true
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Disable 2FA
  twoFactorAuth.value.enabled = false
  twoFactorAuth.value.method = null
  twoFactorAuth.value.backupCodesRemaining = 0
  
  profile.value.twoFactorEnabled = false
  
  passwordChangeLoading.value = false
  alert('Two-factor authentication disabled.')
}

const handleRegenerateBackupCodes = async () => {
  console.log('Regenerate backup codes')
  passwordChangeLoading.value = true
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  twoFactorAuth.value.backupCodesRemaining = 10
  
  passwordChangeLoading.value = false
  alert('Backup codes regenerated successfully!')
}

// ActivityLog handlers
const handleFilterActivity = (filters: ActivityLogFilters) => {
  console.log('Filter activity log:', filters)
  activityLoading.value = true
  
  // Simulate API call with filters
  setTimeout(() => {
    // In real app, this would fetch filtered data from backend
    activityLoading.value = false
  }, 500)
}

const handleExportActivity = (format: 'csv' | 'json' | 'pdf') => {
  console.log('Export activity log as:', format)
  alert(`Exporting activity log as ${format.toUpperCase()}...`)
  
  // In real app, this would trigger a download
  // For now, just show confirmation
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Page Header -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 class="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p class="mt-1 text-sm text-gray-500">
          Manage your account settings and preferences
        </p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Desktop Sidebar Navigation -->
        <aside class="hidden lg:block w-64 flex-shrink-0">
          <nav class="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="changeTab(tab.id)"
              :class="[
                'w-full flex items-center justify-between px-4 py-3 text-left transition-colors',
                activeTab === tab.id
                  ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                  : 'text-gray-700 hover:bg-gray-50 border-l-4 border-transparent'
              ]"
            >
              <div class="flex items-center gap-3">
                <component :is="tab.icon" :size="20" />
                <span class="font-medium">{{ tab.label }}</span>
              </div>
              <span
                v-if="tab.badge"
                class="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-700"
              >
                {{ tab.badge }}
              </span>
            </button>
          </nav>
        </aside>

        <!-- Mobile Tab Navigation -->
        <div class="lg:hidden">
          <div class="bg-white rounded-lg border border-gray-200 overflow-x-auto">
            <nav class="flex min-w-max">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="changeTab(tab.id)"
                :class="[
                  'flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2',
                  activeTab === tab.id
                    ? 'text-blue-700 border-blue-700'
                    : 'text-gray-500 border-transparent hover:text-gray-700'
                ]"
              >
                <component :is="tab.icon" :size="18" />
                <span>{{ tab.label }}</span>
                <span
                  v-if="tab.badge"
                  class="px-1.5 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-700"
                >
                  {{ tab.badge }}
                </span>
              </button>
            </nav>
          </div>
        </div>

        <!-- Main Content Area -->
        <main class="flex-1 min-w-0">
          <!-- Profile Tab -->
          <div v-show="activeTab === 'profile'" class="space-y-6">
            <div class="bg-white rounded-lg border border-gray-200 p-6">
              <ProfileHeader
                :profile="profile"
                :loading="profileFormLoading"
                :editable="true"
                @upload-avatar="handleUploadAvatar"
                @remove-avatar="handleRemoveAvatar"
              />
            </div>

            <div class="bg-white rounded-lg border border-gray-200 p-6">
              <h2 class="text-xl font-semibold text-gray-900 mb-6">Personal Information</h2>
              <ProfileForm
                :profile="profile"
                :loading="profileFormLoading"
                @submit="handleUpdateProfile"
                @cancel="handleCancelProfileEdit"
              />
            </div>
          </div>

          <!-- Security Tab -->
          <div v-show="activeTab === 'security'" class="space-y-6">
            <div class="bg-white rounded-lg border border-gray-200 p-6">
              <h2 class="text-xl font-semibold text-gray-900 mb-6">Change Password</h2>
              <PasswordChange
                :loading="passwordChangeLoading"
                @submit="handleChangePassword"
                @cancel="handleCancelPasswordChange"
              />
            </div>

            <div class="bg-white rounded-lg border border-gray-200 p-6">
              <h2 class="text-xl font-semibold text-gray-900 mb-6">Two-Factor Authentication</h2>
              <TwoFactorAuth
                :two-factor-auth="twoFactorAuth"
                :loading="passwordChangeLoading"
                @enable="handleEnable2FA"
                @verify="handleVerify2FA"
                @disable="handleDisable2FA"
                @regenerate-backup-codes="handleRegenerateBackupCodes"
              />
            </div>
          </div>

          <!-- Notifications Tab -->
          <div v-show="activeTab === 'notifications'" class="space-y-6">
            <div class="bg-white rounded-lg border border-gray-200 p-6">
              <h2 class="text-xl font-semibold text-gray-900 mb-6">Notification Preferences</h2>
              <p class="text-sm text-gray-600 mb-6">
                Choose how you want to receive notifications about your account activity.
              </p>
              <NotificationPreferences
                :preferences="notificationPreferences"
                :loading="notificationLoading"
                @save="handleSaveNotifications"
                @cancel="handleCancelNotifications"
                @reset="handleResetNotifications"
              />
            </div>
          </div>

          <!-- Sessions Tab -->
          <div v-show="activeTab === 'sessions'" class="space-y-6">
            <div class="bg-white rounded-lg border border-gray-200 p-6">
              <h2 class="text-xl font-semibold text-gray-900 mb-6">Active Sessions</h2>
              <p class="text-sm text-gray-600 mb-6">
                Manage your active sessions across different devices and locations.
              </p>
              <SessionManagement
                :sessions="sessions"
                :loading="sessionLoading"
                @revoke="handleRevokeSession"
                @revoke-all="handleRevokeAllSessions"
              />
            </div>
          </div>

          <!-- Activity Tab -->
          <div v-show="activeTab === 'activity'" class="space-y-6">
            <div class="bg-white rounded-lg border border-gray-200 p-6">
              <h2 class="text-xl font-semibold text-gray-900 mb-6">Activity Log</h2>
              <p class="text-sm text-gray-600 mb-6">
                View and track all activities on your account.
              </p>
              <ActivityLog
                :activities="activities"
                :total="activityTotal"
                :page="activityPage"
                :limit="activityLimit"
                :total-pages="activityTotalPages"
                :has-next="activityHasNext"
                :has-prev="activityHasPrev"
                :loading="activityLoading"
                @filter="handleFilterActivity"
                @export="handleExportActivity"
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>
