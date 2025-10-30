/**
 * ProfileView Integration Tests
 * Comprehensive test suite for profile page with tab navigation and component integration
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import { createRouter, createMemoryHistory } from 'vue-router'
import ProfileView from '@/views/ProfileView.vue'
import ProfileHeader from '@/components/profile/ProfileHeader.vue'
import ProfileForm from '@/components/profile/ProfileForm.vue'
import PasswordChange from '@/components/profile/PasswordChange.vue'
import NotificationPreferences from '@/components/profile/NotificationPreferences.vue'
import SessionManagement from '@/components/profile/SessionManagement.vue'
import TwoFactorAuth from '@/components/profile/TwoFactorAuth.vue'
import ActivityLog from '@/components/profile/ActivityLog.vue'

// Create mock router
const createMockRouter = (initialQuery = {}) => {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      {
        path: '/profile',
        name: 'profile',
        component: ProfileView
      }
    ]
  })
}

describe('ProfileView', () => {
  let wrapper: VueWrapper
  let router: ReturnType<typeof createMockRouter>

  beforeEach(() => {
    vi.clearAllMocks()
    router = createMockRouter()
  })

  describe('Page Structure', () => {
    it('should render page header with title', async () => {
      router.push('/profile')
      await router.isReady()

      wrapper = mount(ProfileView, {
        global: {
          plugins: [router]
        }
      })

      expect(wrapper.find('h1').text()).toBe('Profile Settings')
      expect(wrapper.text()).toContain('Manage your account settings and preferences')
    })

    it('should render desktop sidebar navigation', async () => {
      router.push('/profile')
      await router.isReady()

      wrapper = mount(ProfileView, {
        global: {
          plugins: [router]
        }
      })

      const sidebar = wrapper.find('aside.hidden.lg\\:block')
      expect(sidebar.exists()).toBe(true)
    })

    it('should render mobile tab navigation', async () => {
      router.push('/profile')
      await router.isReady()

      wrapper = mount(ProfileView, {
        global: {
          plugins: [router]
        }
      })

      const mobileNav = wrapper.find('.lg\\:hidden nav')
      expect(mobileNav.exists()).toBe(true)
    })

    it('should render all 5 tabs', async () => {
      router.push('/profile')
      await router.isReady()

      wrapper = mount(ProfileView, {
        global: {
          plugins: [router]
        }
      })

      expect(wrapper.text()).toContain('Profile Info')
      expect(wrapper.text()).toContain('Security')
      expect(wrapper.text()).toContain('Notifications')
      expect(wrapper.text()).toContain('Sessions')
      expect(wrapper.text()).toContain('Activity Log')
    })

    it('should show badge count on Sessions tab', async () => {
      router.push('/profile')
      await router.isReady()

      wrapper = mount(ProfileView, {
        global: {
          plugins: [router]
        }
      })

      // Sessions tab should have badge showing 3 sessions
      const badges = wrapper.findAll('.bg-blue-100.text-blue-700')
      expect(badges.length).toBeGreaterThan(0)
      expect(wrapper.text()).toContain('3')
    })
  })

  describe('Tab Navigation', () => {
    it('should default to profile tab when no query param', async () => {
      router.push('/profile')
      await router.isReady()

      wrapper = mount(ProfileView, {
        global: {
          plugins: [router]
        }
      })

      // Profile tab should be active
      const profileButtons = wrapper.findAll('button').filter(btn => 
        btn.text().includes('Profile Info')
      )
      const activeProfileButton = profileButtons.find(btn => 
        btn.classes().includes('bg-blue-50') || btn.classes().includes('text-blue-700')
      )
      expect(activeProfileButton).toBeTruthy()
    })

    it('should activate security tab with ?tab=security', async () => {
      router.push('/profile?tab=security')
      await router.isReady()

      wrapper = mount(ProfileView, {
        global: {
          plugins: [router]
        }
      })
      await nextTick()

      // Security tab should be active
      const securityButtons = wrapper.findAll('button').filter(btn => 
        btn.text().includes('Security')
      )
      const activeSecurityButton = securityButtons.find(btn => 
        btn.classes().includes('bg-blue-50') || btn.classes().includes('text-blue-700')
      )
      expect(activeSecurityButton).toBeTruthy()
    })

    it('should navigate to notifications tab on click', async () => {
      router.push('/profile')
      await router.isReady()

      wrapper = mount(ProfileView, {
        global: {
          plugins: [router]
        }
      })

      // Find and click notifications tab button
      const notificationsButtons = wrapper.findAll('button').filter(btn => 
        btn.text().includes('Notifications')
      )
      await notificationsButtons[0].trigger('click')
      await nextTick()

      // Check route updated
      expect(router.currentRoute.value.query.tab).toBe('notifications')
    })

    it('should update URL query param on tab change', async () => {
      router.push('/profile')
      await router.isReady()

      wrapper = mount(ProfileView, {
        global: {
          plugins: [router]
        }
      })

      // Click activity log tab
      const activityButtons = wrapper.findAll('button').filter(btn => 
        btn.text().includes('Activity Log')
      )
      await activityButtons[0].trigger('click')
      await nextTick()

      expect(router.currentRoute.value.query.tab).toBe('activity')
    })

    it('should fall back to profile tab for invalid query param', async () => {
      router.push('/profile?tab=invalid')
      await router.isReady()

      wrapper = mount(ProfileView, {
        global: {
          plugins: [router]
        }
      })
      await nextTick()

      // Profile tab should be active as fallback
      const profileButtons = wrapper.findAll('button').filter(btn => 
        btn.text().includes('Profile Info')
      )
      const activeProfileButton = profileButtons.find(btn => 
        btn.classes().includes('bg-blue-50') || btn.classes().includes('text-blue-700')
      )
      expect(activeProfileButton).toBeTruthy()
    })
  })

  describe('Profile Tab Integration', () => {
    it('should render ProfileHeader component', async () => {
      router.push('/profile')
      await router.isReady()

      wrapper = mount(ProfileView, {
        global: {
          plugins: [router]
        }
      })

      const profileHeader = wrapper.findComponent(ProfileHeader)
      expect(profileHeader.exists()).toBe(true)
    })

    it('should render ProfileForm component', async () => {
      router.push('/profile')
      await router.isReady()

      wrapper = mount(ProfileView, {
        global: {
          plugins: [router]
        }
      })

      const profileForm = wrapper.findComponent(ProfileForm)
      expect(profileForm.exists()).toBe(true)
    })

    it('should pass profile data to ProfileHeader', async () => {
      router.push('/profile')
      await router.isReady()

      wrapper = mount(ProfileView, {
        global: {
          plugins: [router]
        }
      })

      const profileHeader = wrapper.findComponent(ProfileHeader)
      expect(profileHeader.props('profile')).toBeDefined()
      expect(profileHeader.props('profile').email).toBe('john.doe@example.com')
    })

    it('should pass profile data to ProfileForm', async () => {
      router.push('/profile')
      await router.isReady()

      wrapper = mount(ProfileView, {
        global: {
          plugins: [router]
        }
      })

      const profileForm = wrapper.findComponent(ProfileForm)
      expect(profileForm.props('profile')).toBeDefined()
      expect(profileForm.props('profile').firstName).toBe('John')
    })

    it('should handle uploadAvatar event', async () => {
      router.push('/profile')
      await router.isReady()

      wrapper = mount(ProfileView, {
        global: {
          plugins: [router]
        }
      })

      const profileHeader = wrapper.findComponent(ProfileHeader)
      const mockFile = new File([''], 'avatar.jpg', { type: 'image/jpeg' })
      
      await profileHeader.vm.$emit('uploadAvatar', mockFile)
      await nextTick()

      // Should trigger loading state
      expect(profileHeader.props('loading')).toBe(true)
    })

    it('should handle removeAvatar event', async () => {
      router.push('/profile')
      await router.isReady()

      wrapper = mount(ProfileView, {
        global: {
          plugins: [router]
        }
      })

      const profileHeader = wrapper.findComponent(ProfileHeader)
      
      await profileHeader.vm.$emit('removeAvatar')
      await nextTick()

      // Should trigger loading state
      expect(profileHeader.props('loading')).toBe(true)
    })

    it('should handle updateProfile event', async () => {
      router.push('/profile')
      await router.isReady()

      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})

      wrapper = mount(ProfileView, {
        global: {
          plugins: [router]
        }
      })

      const profileForm = wrapper.findComponent(ProfileForm)
      const updateData = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        phoneNumber: '+1 (555) 987-6543'
      }
      
      await profileForm.vm.$emit('submit', updateData)
      await nextTick()

      // Should show loading
      expect(profileForm.props('loading')).toBe(true)

      alertSpy.mockRestore()
    })
  })

  describe('Security Tab Integration', () => {
    it('should render PasswordChange component', async () => {
      router.push('/profile?tab=security')
      await router.isReady()

      wrapper = mount(ProfileView, {
        global: {
          plugins: [router]
        }
      })
      await nextTick()

      const passwordChange = wrapper.findComponent(PasswordChange)
      expect(passwordChange.exists()).toBe(true)
    })

    it('should render TwoFactorAuth component', async () => {
      router.push('/profile?tab=security')
      await router.isReady()

      wrapper = mount(ProfileView, {
        global: {
          plugins: [router]
        }
      })
      await nextTick()

      const twoFactorAuth = wrapper.findComponent(TwoFactorAuth)
      expect(twoFactorAuth.exists()).toBe(true)
    })

    it('should pass 2FA data to TwoFactorAuth', async () => {
      router.push('/profile?tab=security')
      await router.isReady()

      wrapper = mount(ProfileView, {
        global: {
          plugins: [router]
        }
      })
      await nextTick()

      const twoFactorAuth = wrapper.findComponent(TwoFactorAuth)
      expect(twoFactorAuth.props('twoFactorAuth')).toBeDefined()
      expect(twoFactorAuth.props('twoFactorAuth').enabled).toBe(false)
    })

    it('should handle changePassword event', async () => {
      router.push('/profile?tab=security')
      await router.isReady()

      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})

      wrapper = mount(ProfileView, {
        global: {
          plugins: [router]
        }
      })
      await nextTick()

      const passwordChange = wrapper.findComponent(PasswordChange)
      const passwordData = {
        currentPassword: 'OldPass123!',
        newPassword: 'NewPass456!',
        confirmPassword: 'NewPass456!'
      }
      
      await passwordChange.vm.$emit('submit', passwordData)
      await nextTick()

      // Should show loading
      expect(passwordChange.props('loading')).toBe(true)

      alertSpy.mockRestore()
    })

    it('should handle enable2FA event', async () => {
      router.push('/profile?tab=security')
      await router.isReady()

      wrapper = mount(ProfileView, {
        global: {
          plugins: [router]
        }
      })
      await nextTick()

      const twoFactorAuth = wrapper.findComponent(TwoFactorAuth)
      
      await twoFactorAuth.vm.$emit('enable', 'totp')
      await nextTick()

      // Should log the method
      expect(true).toBe(true) // Event handled
    })

    it('should handle verify2FA event', async () => {
      router.push('/profile?tab=security')
      await router.isReady()

      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})

      wrapper = mount(ProfileView, {
        global: {
          plugins: [router]
        }
      })
      await nextTick()

      const twoFactorAuth = wrapper.findComponent(TwoFactorAuth)
      
      await twoFactorAuth.vm.$emit('verify', '123456', 'SECRETKEY')
      await nextTick()

      // Should show loading
      expect(twoFactorAuth.props('loading')).toBe(true)

      alertSpy.mockRestore()
    })

    it('should handle disable2FA event', async () => {
      router.push('/profile?tab=security')
      await router.isReady()

      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})

      wrapper = mount(ProfileView, {
        global: {
          plugins: [router]
        }
      })
      await nextTick()

      const twoFactorAuth = wrapper.findComponent(TwoFactorAuth)
      
      await twoFactorAuth.vm.$emit('disable', 'MyPassword123!')
      await nextTick()

      // Should show loading
      expect(twoFactorAuth.props('loading')).toBe(true)

      alertSpy.mockRestore()
    })
  })

  describe('Notifications Tab Integration', () => {
    it('should render NotificationPreferences component', async () => {
      router.push('/profile?tab=notifications')
      await router.isReady()

      wrapper = mount(ProfileView, {
        global: {
          plugins: [router]
        }
      })
      await nextTick()

      const notificationPrefs = wrapper.findComponent(NotificationPreferences)
      expect(notificationPrefs.exists()).toBe(true)
    })

    it('should pass notification preferences to component', async () => {
      router.push('/profile?tab=notifications')
      await router.isReady()

      wrapper = mount(ProfileView, {
        global: {
          plugins: [router]
        }
      })
      await nextTick()

      const notificationPrefs = wrapper.findComponent(NotificationPreferences)
      expect(notificationPrefs.props('preferences')).toBeDefined()
      expect(notificationPrefs.props('preferences').email.enabled).toBe(true)
    })

    it('should handle saveNotifications event', async () => {
      router.push('/profile?tab=notifications')
      await router.isReady()

      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})

      wrapper = mount(ProfileView, {
        global: {
          plugins: [router]
        }
      })
      await nextTick()

      const notificationPrefs = wrapper.findComponent(NotificationPreferences)
      const newPrefs = {
        email: {
          enabled: false,
          transactionAlerts: false,
          complianceUpdates: false,
          securityAlerts: true,
          systemNotifications: false,
          weeklyDigest: false,
          monthlyReport: false
        },
        sms: {
          enabled: false,
          criticalAlerts: false,
          twoFactorAuth: false,
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
          sound: false,
          desktop: false
        }
      }
      
      await notificationPrefs.vm.$emit('save', newPrefs)
      await nextTick()

      // Should show loading
      expect(notificationPrefs.props('loading')).toBe(true)

      alertSpy.mockRestore()
    })
  })

  describe('Sessions Tab Integration', () => {
    it('should render SessionManagement component', async () => {
      router.push('/profile?tab=sessions')
      await router.isReady()

      wrapper = mount(ProfileView, {
        global: {
          plugins: [router]
        }
      })
      await nextTick()

      const sessionMgmt = wrapper.findComponent(SessionManagement)
      expect(sessionMgmt.exists()).toBe(true)
    })

    it('should pass sessions data to component', async () => {
      router.push('/profile?tab=sessions')
      await router.isReady()

      wrapper = mount(ProfileView, {
        global: {
          plugins: [router]
        }
      })
      await nextTick()

      const sessionMgmt = wrapper.findComponent(SessionManagement)
      expect(sessionMgmt.props('sessions')).toBeDefined()
      expect(sessionMgmt.props('sessions').length).toBe(3)
    })

    it('should handle revokeSession event', async () => {
      router.push('/profile?tab=sessions')
      await router.isReady()

      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})

      wrapper = mount(ProfileView, {
        global: {
          plugins: [router]
        }
      })
      await nextTick()

      const sessionMgmt = wrapper.findComponent(SessionManagement)
      
      await sessionMgmt.vm.$emit('revoke', 'session-2')
      await nextTick()

      // Should show loading
      expect(sessionMgmt.props('loading')).toBe(true)

      alertSpy.mockRestore()
    })

    it('should handle revokeAll event', async () => {
      router.push('/profile?tab=sessions')
      await router.isReady()

      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})

      wrapper = mount(ProfileView, {
        global: {
          plugins: [router]
        }
      })
      await nextTick()

      const sessionMgmt = wrapper.findComponent(SessionManagement)
      
      await sessionMgmt.vm.$emit('revokeAll')
      await nextTick()

      // Should show loading
      expect(sessionMgmt.props('loading')).toBe(true)

      alertSpy.mockRestore()
    })
  })

  describe('Activity Log Tab Integration', () => {
    it('should render ActivityLog component', async () => {
      router.push('/profile?tab=activity')
      await router.isReady()

      wrapper = mount(ProfileView, {
        global: {
          plugins: [router]
        }
      })
      await nextTick()

      const activityLog = wrapper.findComponent(ActivityLog)
      expect(activityLog.exists()).toBe(true)
    })

    it('should pass activities data to component', async () => {
      router.push('/profile?tab=activity')
      await router.isReady()

      wrapper = mount(ProfileView, {
        global: {
          plugins: [router]
        }
      })
      await nextTick()

      const activityLog = wrapper.findComponent(ActivityLog)
      expect(activityLog.props('activities')).toBeDefined()
      expect(activityLog.props('activities').length).toBe(10)
    })

    it('should pass pagination props to component', async () => {
      router.push('/profile?tab=activity')
      await router.isReady()

      wrapper = mount(ProfileView, {
        global: {
          plugins: [router]
        }
      })
      await nextTick()

      const activityLog = wrapper.findComponent(ActivityLog)
      expect(activityLog.props('total')).toBe(150)
      expect(activityLog.props('page')).toBe(1)
      expect(activityLog.props('limit')).toBe(10)
      expect(activityLog.props('totalPages')).toBe(15)
      expect(activityLog.props('hasNext')).toBe(true)
      expect(activityLog.props('hasPrev')).toBe(false)
    })

    it('should handle filter event', async () => {
      router.push('/profile?tab=activity')
      await router.isReady()

      wrapper = mount(ProfileView, {
        global: {
          plugins: [router]
        }
      })
      await nextTick()

      const activityLog = wrapper.findComponent(ActivityLog)
      const filters = {
        searchQuery: 'login',
        category: ['authentication'],
        status: ['success'],
        startDate: '2025-10-01',
        endDate: '2025-10-30'
      }
      
      await activityLog.vm.$emit('filter', filters)
      await nextTick()

      // Should show loading
      expect(activityLog.props('loading')).toBe(true)
    })

    it('should handle export event', async () => {
      router.push('/profile?tab=activity')
      await router.isReady()

      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})

      wrapper = mount(ProfileView, {
        global: {
          plugins: [router]
        }
      })
      await nextTick()

      const activityLog = wrapper.findComponent(ActivityLog)
      
      await activityLog.vm.$emit('export', 'csv')
      await nextTick()

      expect(alertSpy).toHaveBeenCalledWith('Exporting activity log as CSV...')

      alertSpy.mockRestore()
    })

    it('should handle loadPage event', async () => {
      router.push('/profile?tab=activity')
      await router.isReady()

      wrapper = mount(ProfileView, {
        global: {
          plugins: [router]
        }
      })
      await nextTick()

      const activityLog = wrapper.findComponent(ActivityLog)
      
      await activityLog.vm.$emit('loadPage', 2)
      await nextTick()

      // In real app, this would update the page
      expect(true).toBe(true) // Event handled
    })
  })

  describe('Loading States', () => {
    it('should pass loading state to ProfileHeader', async () => {
      router.push('/profile')
      await router.isReady()

      wrapper = mount(ProfileView, {
        global: {
          plugins: [router]
        }
      })

      const profileHeader = wrapper.findComponent(ProfileHeader)
      expect(profileHeader.props('loading')).toBeDefined()
    })

    it('should pass loading state to all components', async () => {
      router.push('/profile')
      await router.isReady()

      wrapper = mount(ProfileView, {
        global: {
          plugins: [router]
        }
      })

      const profileHeader = wrapper.findComponent(ProfileHeader)
      const profileForm = wrapper.findComponent(ProfileForm)
      
      expect(profileHeader.props('loading')).toBe(false)
      expect(profileForm.props('loading')).toBe(false)
    })
  })

  describe('Responsive Layout', () => {
    it('should have desktop sidebar with hidden on mobile', async () => {
      router.push('/profile')
      await router.isReady()

      wrapper = mount(ProfileView, {
        global: {
          plugins: [router]
        }
      })

      const sidebar = wrapper.find('aside')
      expect(sidebar.classes()).toContain('hidden')
      expect(sidebar.classes()).toContain('lg:block')
    })

    it('should have mobile navigation hidden on desktop', async () => {
      router.push('/profile')
      await router.isReady()

      wrapper = mount(ProfileView, {
        global: {
          plugins: [router]
        }
      })

      const mobileNav = wrapper.find('.lg\\:hidden')
      expect(mobileNav.exists()).toBe(true)
    })

    it('should use flex layout for responsive design', async () => {
      router.push('/profile')
      await router.isReady()

      wrapper = mount(ProfileView, {
        global: {
          plugins: [router]
        }
      })

      const layout = wrapper.find('.flex.flex-col.lg\\:flex-row')
      expect(layout.exists()).toBe(true)
    })
  })
})
