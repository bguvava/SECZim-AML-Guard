/**
 * Authentication Store
 * Manages authentication state, login, logout, and session handling
 */

import { defineStore } from 'pinia'
import type { User, LoginCredentials, AuthState, LoginResponse } from '@/types/auth'
import { validateCredentials } from '@/data/demoUsers'
import {
  generateToken,
  saveSession,
  loadSession,
  clearSession,
  extendSession,
  getSessionTimeRemaining,
} from '@/utils/auth'

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    isAuthenticated: false,
    sessionExpiry: null,
    rememberMe: false,
  }),

  getters: {
    /**
     * Get current authenticated user
     */
    currentUser: (state: AuthState): User | null => state.user,

    /**
     * Get user's role
     */
    userRole: (state: AuthState): string | null => state.user?.role || null,

    /**
     * Check if user is administrator
     */
    isAdmin: (state: AuthState): boolean => state.user?.role === 'Administrator',

    /**
     * Check if user is supervisor
     */
    isSupervisor: (state: AuthState): boolean => state.user?.role === 'Supervisor',

    /**
     * Check if user is entity
     */
    isEntity: (state: AuthState): boolean => state.user?.role === 'Entity',

    /**
     * Get user's full name
     */
    fullName: (state: AuthState): string => {
      if (!state.user) return ''
      return `${state.user.firstName} ${state.user.lastName}`
    },

    /**
     * Get user's initials
     */
    initials: (state: AuthState): string => {
      if (!state.user) return ''
      return `${state.user.firstName[0]}${state.user.lastName[0]}`
    },

    /**
     * Check if session is active
     */
    isSessionActive: (state: AuthState): boolean => {
      if (!state.isAuthenticated) return false
      if (!state.sessionExpiry) return true
      return Date.now() < state.sessionExpiry
    },

    /**
     * Get time until session expires (in milliseconds)
     */
    sessionTimeRemaining: (): number | null => {
      return getSessionTimeRemaining()
    },
  },

  actions: {
    /**
     * Login user with credentials
     */
    async login(credentials: LoginCredentials): Promise<LoginResponse> {
      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Validate credentials against demo users
        const user = validateCredentials(credentials.email, credentials.password)

        if (!user) {
          return {
            success: false,
            error: 'Invalid email or password. Please try again.',
          }
        }

        if (!user.isActive) {
          return {
            success: false,
            error: 'Your account has been deactivated. Please contact support.',
          }
        }

        // Generate token
        const token = generateToken(user.id)

        // Set session expiry (24 hours for remember me, 8 hours otherwise)
        const expiryHours = credentials.rememberMe ? 24 : 8
        const sessionExpiry = Date.now() + expiryHours * 60 * 60 * 1000

        // Create user object (password already stripped by findUserByEmail)
        const authenticatedUser: User = {
          ...user,
          lastLogin: new Date().toISOString(),
        }

        // Update state
        this.user = authenticatedUser
        this.token = token
        this.isAuthenticated = true
        this.sessionExpiry = sessionExpiry
        this.rememberMe = credentials.rememberMe

        // Save session
        saveSession({
          user: authenticatedUser,
          token,
          expiry: sessionExpiry,
          rememberMe: credentials.rememberMe,
        })

        return {
          success: true,
          user: authenticatedUser,
          token,
          message: `Welcome back, ${authenticatedUser.firstName}!`,
        }
      } catch (error) {
        console.error('Login error:', error)
        return {
          success: false,
          error: 'An unexpected error occurred. Please try again.',
        }
      }
    },

    /**
     * Logout user
     */
    logout(): void {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      this.sessionExpiry = null
      this.rememberMe = false
      clearSession()
    },

    /**
     * Restore session from storage
     */
    restoreSession(): boolean {
      const session = loadSession()

      if (!session) {
        return false
      }

      this.user = session.user
      this.token = session.token
      this.isAuthenticated = true
      this.sessionExpiry = session.expiry
      this.rememberMe = session.rememberMe

      return true
    },

    /**
     * Extend current session
     */
    extendCurrentSession(hours: number = 8): void {
      if (!this.isAuthenticated) return

      const newExpiry = Date.now() + hours * 60 * 60 * 1000
      this.sessionExpiry = newExpiry
      extendSession(hours)
    },

    /**
     * Check if session is about to expire
     */
    isSessionExpiringSoon(warningMinutes: number = 5): boolean {
      const remaining = this.sessionTimeRemaining
      if (!remaining) return false

      const warningThreshold = warningMinutes * 60 * 1000
      return remaining <= warningThreshold && remaining > 0
    },

    /**
     * Update user profile data
     */
    updateUserProfile(updates: Partial<User>): void {
      if (!this.user) return

      this.user = {
        ...this.user,
        ...updates,
      }

      // Update session storage
      if (this.token && this.sessionExpiry) {
        saveSession({
          user: this.user,
          token: this.token,
          expiry: this.sessionExpiry,
          rememberMe: this.rememberMe,
        })
      }
    },

    /**
     * Simulate password reset request
     */
    async requestPasswordReset(_email: string): Promise<{ success: boolean; message: string }> {
      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        return {
          success: true,
          message:
            'Password reset instructions have been sent to your email. Please check your inbox.',
        }
      } catch (error) {
        console.error('Password reset error:', error)
        return {
          success: false,
          message: 'Failed to send password reset email. Please try again.',
        }
      }
    },

    /**
     * Simulate password change
     */
    async changePassword(
      _currentPassword: string,
      _newPassword: string
    ): Promise<{ success: boolean; message: string }> {
      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 800))

        // In real app, verify current password
        return {
          success: true,
          message: 'Your password has been changed successfully.',
        }
      } catch (error) {
        console.error('Password change error:', error)
        return {
          success: false,
          message: 'Failed to change password. Please try again.',
        }
      }
    },

    /**
     * Get dashboard route based on user role
     */
    getDashboardRoute(): string {
      if (!this.user) return '/'

      switch (this.user.role) {
        case 'Administrator':
          return '/admin/dashboard'
        case 'Supervisor':
          return '/supervisor/dashboard'
        case 'Entity':
          return '/entity/dashboard'
        default:
          return '/'
      }
    },
  },
})
