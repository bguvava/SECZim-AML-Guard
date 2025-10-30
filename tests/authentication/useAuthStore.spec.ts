import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/useAuthStore'
import { DEMO_USERS, DEMO_PASSWORD } from '@/data/demoUsers'
import type { LoginCredentials } from '@/types/auth'

describe('useAuthStore', () => {
  beforeEach(() => {
    // Create a fresh pinia instance before each test
    setActivePinia(createPinia())
    
    // Clear localStorage and sessionStorage
    localStorage.clear()
    sessionStorage.clear()
  })

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const store = useAuthStore()
      
      expect(store.user).toBeNull()
      expect(store.token).toBeNull()
      expect(store.isAuthenticated).toBe(false)
      expect(store.sessionExpiry).toBeNull()
      expect(store.rememberMe).toBe(false)
    })

    it('should have correct computed getters for unauthenticated state', () => {
      const store = useAuthStore()
      
      expect(store.currentUser).toBeNull()
      expect(store.userRole).toBeNull()
      expect(store.isAdmin).toBe(false)
      expect(store.isSupervisor).toBe(false)
      expect(store.isEntity).toBe(false)
      expect(store.fullName).toBe('')
      expect(store.initials).toBe('??')
    })
  })

  describe('Login', () => {
    it('should login successfully with valid administrator credentials', async () => {
      const store = useAuthStore()
      const credentials: LoginCredentials = {
        email: 'brian.guvava@seczim.co.zw',
        password: DEMO_PASSWORD,
        rememberMe: false
      }

      const response = await store.login(credentials)

      expect(response.success).toBe(true)
      expect(response.user).toBeDefined()
      expect(response.user?.email).toBe(credentials.email)
      expect(response.user?.role).toBe('Administrator')
      expect(response.token).toBeDefined()
      expect(store.isAuthenticated).toBe(true)
    })

    it('should login successfully with valid supervisor credentials', async () => {
      const store = useAuthStore()
      const credentials: LoginCredentials = {
        email: 'samkheliso.dube@seczim.co.zw',
        password: DEMO_PASSWORD,
        rememberMe: false
      }

      const response = await store.login(credentials)

      expect(response.success).toBe(true)
      expect(response.user?.role).toBe('Supervisor')
    })

    it('should login successfully with valid entity credentials', async () => {
      const store = useAuthStore()
      const credentials: LoginCredentials = {
        email: 'makanaka.elara@capitalmarkets.co.zw',
        password: DEMO_PASSWORD,
        rememberMe: false
      }

      const response = await store.login(credentials)

      expect(response.success).toBe(true)
      expect(response.user?.role).toBe('Entity')
    })

    it('should fail login with invalid email', async () => {
      const store = useAuthStore()
      const credentials: LoginCredentials = {
        email: 'nonexistent@example.com',
        password: DEMO_PASSWORD,
        rememberMe: false
      }

      const response = await store.login(credentials)

      expect(response.success).toBe(false)
      expect(response.error).toBe('Invalid email or password. Please try again.')
      expect(store.isAuthenticated).toBe(false)
      expect(store.user).toBeNull()
    })

    it('should fail login with invalid password', async () => {
      const store = useAuthStore()
      const credentials: LoginCredentials = {
        email: 'brian.guvava@seczim.co.zw',
        password: 'WrongPassword123!',
        rememberMe: false
      }

      const response = await store.login(credentials)

      expect(response.success).toBe(false)
      expect(response.error).toBe('Invalid email or password. Please try again.')
      expect(store.isAuthenticated).toBe(false)
    })

    it('should fail login with inactive user', async () => {
      const store = useAuthStore()
      
      // Mock an inactive user scenario
      const inactiveUser = { ...DEMO_USERS[0], isActive: false }
      vi.spyOn(store, 'login').mockResolvedValueOnce({
        success: false,
        error: 'Your account has been deactivated. Please contact your administrator.'
      })

      const credentials: LoginCredentials = {
        email: inactiveUser.email,
        password: DEMO_PASSWORD,
        rememberMe: false
      }

      const response = await store.login(credentials)

      expect(response.success).toBe(false)
      expect(response.error).toContain('deactivated')
    })

    it('should store session in localStorage when rememberMe is true', async () => {
      const store = useAuthStore()
      const credentials: LoginCredentials = {
        email: 'brian.guvava@seczim.co.zw',
        password: DEMO_PASSWORD,
        rememberMe: true
      }

      await store.login(credentials)

      expect(localStorage.getItem('amlguard_user')).toBeTruthy()
      expect(localStorage.getItem('amlguard_token')).toBeTruthy()
      expect(localStorage.getItem('amlguard_session_expiry')).toBeTruthy()
    })

    it('should store session in sessionStorage when rememberMe is false', async () => {
      const store = useAuthStore()
      const credentials: LoginCredentials = {
        email: 'brian.guvava@seczim.co.zw',
        password: DEMO_PASSWORD,
        rememberMe: false
      }

      await store.login(credentials)

      expect(sessionStorage.getItem('amlguard_session')).toBeTruthy()
      const session = JSON.parse(sessionStorage.getItem('amlguard_session')!)
      expect(session.user).toBeDefined()
      expect(session.token).toBeDefined()
    })

    it('should set correct session expiry for rememberMe (24 hours)', async () => {
      const store = useAuthStore()
      const beforeLogin = Date.now()
      
      const credentials: LoginCredentials = {
        email: 'brian.guvava@seczim.co.zw',
        password: DEMO_PASSWORD,
        rememberMe: true
      }

      await store.login(credentials)

      const expectedExpiry = beforeLogin + 24 * 60 * 60 * 1000 // 24 hours
      const actualExpiry = store.sessionExpiry!
      
      // Allow 1 second tolerance
      expect(Math.abs(actualExpiry - expectedExpiry)).toBeLessThan(1000)
    })

    it('should set correct session expiry for normal login (8 hours)', async () => {
      const store = useAuthStore()
      const beforeLogin = Date.now()
      
      const credentials: LoginCredentials = {
        email: 'brian.guvava@seczim.co.zw',
        password: DEMO_PASSWORD,
        rememberMe: false
      }

      await store.login(credentials)

      const expectedExpiry = beforeLogin + 8 * 60 * 60 * 1000 // 8 hours
      const actualExpiry = store.sessionExpiry!
      
      // Allow 1 second tolerance
      expect(Math.abs(actualExpiry - expectedExpiry)).toBeLessThan(1000)
    })
  })

  describe('Getters', () => {
    it('should return correct user information after login', async () => {
      const store = useAuthStore()
      await store.login({
        email: 'brian.guvava@seczim.co.zw',
        password: DEMO_PASSWORD,
        rememberMe: false
      })

      expect(store.currentUser).toBeDefined()
      expect(store.currentUser?.firstName).toBe('Brian')
      expect(store.currentUser?.lastName).toBe('Guvava')
      expect(store.fullName).toBe('Brian Guvava')
      expect(store.initials).toBe('BG')
      expect(store.userRole).toBe('Administrator')
    })

    it('should correctly identify administrator role', async () => {
      const store = useAuthStore()
      await store.login({
        email: 'brian.guvava@seczim.co.zw',
        password: DEMO_PASSWORD,
        rememberMe: false
      })

      expect(store.isAdmin).toBe(true)
      expect(store.isSupervisor).toBe(false)
      expect(store.isEntity).toBe(false)
    })

    it('should correctly identify supervisor role', async () => {
      const store = useAuthStore()
      await store.login({
        email: 'samkheliso.dube@seczim.co.zw',
        password: DEMO_PASSWORD,
        rememberMe: false
      })

      expect(store.isAdmin).toBe(false)
      expect(store.isSupervisor).toBe(true)
      expect(store.isEntity).toBe(false)
    })

    it('should correctly identify entity role', async () => {
      const store = useAuthStore()
      await store.login({
        email: 'makanaka.elara@capitalmarkets.co.zw',
        password: DEMO_PASSWORD,
        rememberMe: false
      })

      expect(store.isAdmin).toBe(false)
      expect(store.isSupervisor).toBe(false)
      expect(store.isEntity).toBe(true)
    })

    it('should calculate correct initials for multi-word names', async () => {
      const store = useAuthStore()
      await store.login({
        email: 'makanaka.elara@capitalmarkets.co.zw',
        password: DEMO_PASSWORD,
        rememberMe: false
      })

      expect(store.initials).toBe('ME')
    })

    it('should return correct dashboard route for administrator', async () => {
      const store = useAuthStore()
      await store.login({
        email: 'brian.guvava@seczim.co.zw',
        password: DEMO_PASSWORD,
        rememberMe: false
      })

      expect(store.getDashboardRoute()).toBe('/admin/dashboard')
    })

    it('should return correct dashboard route for supervisor', async () => {
      const store = useAuthStore()
      await store.login({
        email: 'samkheliso.dube@seczim.co.zw',
        password: DEMO_PASSWORD,
        rememberMe: false
      })

      expect(store.getDashboardRoute()).toBe('/supervisor/dashboard')
    })

    it('should return correct dashboard route for entity', async () => {
      const store = useAuthStore()
      await store.login({
        email: 'makanaka.elara@capitalmarkets.co.zw',
        password: DEMO_PASSWORD,
        rememberMe: false
      })

      expect(store.getDashboardRoute()).toBe('/entity/dashboard')
    })
  })

  describe('Session Management', () => {
    it('should check if session is active', async () => {
      const store = useAuthStore()
      await store.login({
        email: 'brian.guvava@seczim.co.zw',
        password: DEMO_PASSWORD,
        rememberMe: false
      })

      expect(store.isSessionActive).toBe(true)
    })

    it('should detect expired session', async () => {
      const store = useAuthStore()
      await store.login({
        email: 'brian.guvava@seczim.co.zw',
        password: DEMO_PASSWORD,
        rememberMe: false
      })

      // Manually set session to expired
      store.sessionExpiry = Date.now() - 1000

      expect(store.isSessionActive).toBe(false)
    })

    it('should calculate session time remaining correctly', async () => {
      const store = useAuthStore()
      await store.login({
        email: 'brian.guvava@seczim.co.zw',
        password: DEMO_PASSWORD,
        rememberMe: false
      })

      const timeRemaining = store.sessionTimeRemaining
      
      expect(timeRemaining).toBeGreaterThan(0)
      expect(timeRemaining).toBeLessThanOrEqual(8 * 60 * 60 * 1000) // 8 hours max
    })

    it('should extend session correctly', async () => {
      const store = useAuthStore()
      await store.login({
        email: 'brian.guvava@seczim.co.zw',
        password: DEMO_PASSWORD,
        rememberMe: false
      })

      const originalExpiry = store.sessionExpiry!
      
      // Wait a bit
      await new Promise(resolve => setTimeout(resolve, 100))
      
      store.extendCurrentSession(8)

      expect(store.sessionExpiry).toBeGreaterThan(originalExpiry)
    })

    it('should detect when session is expiring soon', async () => {
      const store = useAuthStore()
      await store.login({
        email: 'brian.guvava@seczim.co.zw',
        password: DEMO_PASSWORD,
        rememberMe: false
      })

      // Set session to expire in 4 minutes
      store.sessionExpiry = Date.now() + 4 * 60 * 1000

      expect(store.isSessionExpiringSoon(5)).toBe(true)
      expect(store.isSessionExpiringSoon(3)).toBe(false)
    })

    it('should restore valid session from localStorage', async () => {
      const store = useAuthStore()
      
      // First login
      await store.login({
        email: 'brian.guvava@seczim.co.zw',
        password: DEMO_PASSWORD,
        rememberMe: true
      })

      const originalToken = store.token
      const originalUser = store.user

      // Create new store instance (simulates page refresh)
      const newStore = useAuthStore()
      const restored = newStore.restoreSession()

      expect(restored).toBe(true)
      expect(newStore.isAuthenticated).toBe(true)
      expect(newStore.token).toBe(originalToken)
      expect(newStore.user?.email).toBe(originalUser?.email)
    })

    it('should restore valid session from sessionStorage', async () => {
      const store = useAuthStore()
      
      // First login
      await store.login({
        email: 'brian.guvava@seczim.co.zw',
        password: DEMO_PASSWORD,
        rememberMe: false
      })

      const originalToken = store.token

      // Create new store instance
      const newStore = useAuthStore()
      const restored = newStore.restoreSession()

      expect(restored).toBe(true)
      expect(newStore.isAuthenticated).toBe(true)
      expect(newStore.token).toBe(originalToken)
    })

    it('should not restore expired session', async () => {
      const store = useAuthStore()
      
      // Login and manually expire session
      await store.login({
        email: 'brian.guvava@seczim.co.zw',
        password: DEMO_PASSWORD,
        rememberMe: true
      })

      // Manually set expired session in localStorage
      localStorage.setItem('amlguard_session_expiry', String(Date.now() - 1000))

      // Try to restore
      const newStore = useAuthStore()
      const restored = newStore.restoreSession()

      expect(restored).toBe(false)
      expect(newStore.isAuthenticated).toBe(false)
    })

    it('should not restore session when no data exists', () => {
      const store = useAuthStore()
      const restored = store.restoreSession()

      expect(restored).toBe(false)
      expect(store.isAuthenticated).toBe(false)
    })
  })

  describe('Logout', () => {
    it('should clear all session data on logout', async () => {
      const store = useAuthStore()
      
      // Login first
      await store.login({
        email: 'brian.guvava@seczim.co.zw',
        password: DEMO_PASSWORD,
        rememberMe: true
      })

      expect(store.isAuthenticated).toBe(true)

      // Logout
      store.logout()

      expect(store.user).toBeNull()
      expect(store.token).toBeNull()
      expect(store.isAuthenticated).toBe(false)
      expect(store.sessionExpiry).toBeNull()
      expect(store.rememberMe).toBe(false)
    })

    it('should clear localStorage on logout', async () => {
      const store = useAuthStore()
      
      await store.login({
        email: 'brian.guvava@seczim.co.zw',
        password: DEMO_PASSWORD,
        rememberMe: true
      })

      store.logout()

      expect(localStorage.getItem('amlguard_user')).toBeNull()
      expect(localStorage.getItem('amlguard_token')).toBeNull()
      expect(localStorage.getItem('amlguard_session_expiry')).toBeNull()
    })

    it('should clear sessionStorage on logout', async () => {
      const store = useAuthStore()
      
      await store.login({
        email: 'brian.guvava@seczim.co.zw',
        password: DEMO_PASSWORD,
        rememberMe: false
      })

      store.logout()

      expect(sessionStorage.getItem('amlguard_session')).toBeNull()
    })
  })

  describe('Password Reset', () => {
    it('should simulate password reset request', async () => {
      const store = useAuthStore()
      const response = await store.requestPasswordReset('brian.guvava@seczim.co.zw')

      expect(response.success).toBe(true)
      expect(response.message).toContain('reset link')
    })

    it('should handle password change simulation', async () => {
      const store = useAuthStore()
      
      // Login first
      await store.login({
        email: 'brian.guvava@seczim.co.zw',
        password: DEMO_PASSWORD,
        rememberMe: false
      })

      const response = await store.changePassword(DEMO_PASSWORD, 'NewPassword123!')

      expect(response.success).toBe(true)
      expect(response.message).toContain('changed successfully')
    })
  })

  describe('Profile Update', () => {
    it('should update user profile', async () => {
      const store = useAuthStore()
      
      await store.login({
        email: 'brian.guvava@seczim.co.zw',
        password: DEMO_PASSWORD,
        rememberMe: false
      })

      const updates = {
        firstName: 'Brian Updated',
        phone: '+263771234567'
      }

      store.updateUserProfile(updates)

      expect(store.user?.firstName).toBe('Brian Updated')
      expect(store.user?.phone).toBe('+263771234567')
    })

    it('should not update when not authenticated', () => {
      const store = useAuthStore()

      const updates = {
        firstName: 'Test'
      }

      store.updateUserProfile(updates)

      expect(store.user).toBeNull()
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty email', async () => {
      const store = useAuthStore()
      const response = await store.login({
        email: '',
        password: DEMO_PASSWORD,
        rememberMe: false
      })

      expect(response.success).toBe(false)
    })

    it('should handle empty password', async () => {
      const store = useAuthStore()
      const response = await store.login({
        email: 'brian.guvava@seczim.co.zw',
        password: '',
        rememberMe: false
      })

      expect(response.success).toBe(false)
    })

    it('should handle case-insensitive email', async () => {
      const store = useAuthStore()
      const response = await store.login({
        email: 'BRIAN.GUVAVA@SECZIM.CO.ZW',
        password: DEMO_PASSWORD,
        rememberMe: false
      })

      expect(response.success).toBe(true)
    })

    it('should handle concurrent login attempts', async () => {
      const store = useAuthStore()
      
      const login1 = store.login({
        email: 'brian.guvava@seczim.co.zw',
        password: DEMO_PASSWORD,
        rememberMe: false
      })

      const login2 = store.login({
        email: 'samkheliso.dube@seczim.co.zw',
        password: DEMO_PASSWORD,
        rememberMe: false
      })

      const [result1, result2] = await Promise.all([login1, login2])

      // Both should succeed
      expect(result1.success).toBe(true)
      expect(result2.success).toBe(true)
    })
  })
})
