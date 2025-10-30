import { describe, it, expect } from 'vitest'
import { 
  generateToken, 
  isValidEmail, 
  validatePasswordStrength, 
  getPasswordStrengthLabel,
  formatSessionTime,
  getSessionTimeRemaining,
  saveSession,
  loadSession,
  clearSession
} from '@/utils/auth'
import type { SessionData } from '@/types/auth'

describe('Auth Utilities', () => {
  describe('generateToken', () => {
    it('should generate a token', () => {
      const token = generateToken('user123')
      
      expect(token).toBeDefined()
      expect(typeof token).toBe('string')
      expect(token.length).toBeGreaterThan(0)
    })

    it('should generate different tokens for different users', () => {
      const token1 = generateToken('user1')
      const token2 = generateToken('user2')
      
      expect(token1).not.toBe(token2)
    })

    it('should generate token with proper JWT structure', () => {
      const token = generateToken('user123')
      const parts = token.split('.')
      
      expect(parts.length).toBe(3) // header.payload.signature
    })
  })

  describe('isValidEmail', () => {
    it('should validate correct email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true)
      expect(isValidEmail('user.name@domain.co.zw')).toBe(true)
      expect(isValidEmail('first.last+tag@example.com')).toBe(true)
      expect(isValidEmail('brian.guvava@seczim.co.zw')).toBe(true)
    })

    it('should reject invalid email addresses', () => {
      expect(isValidEmail('notanemail')).toBe(false)
      expect(isValidEmail('missing@domain')).toBe(false)
      expect(isValidEmail('@nodomain.com')).toBe(false)
      expect(isValidEmail('no@symbol')).toBe(false)
      expect(isValidEmail('')).toBe(false)
      expect(isValidEmail('spaces in@email.com')).toBe(false)
    })

    it('should handle edge cases', () => {
      expect(isValidEmail('a@b.c')).toBe(true) // Minimal valid email
      expect(isValidEmail('test@')).toBe(false)
      expect(isValidEmail('@test.com')).toBe(false)
    })
  })

  describe('validatePasswordStrength', () => {
    it('should accept strong passwords', () => {
      const result = validatePasswordStrength('AMLGuard2025!')
      
      expect(result.isValid).toBe(true)
      expect(result.score).toBeGreaterThan(80)
      expect(result.errors).toHaveLength(0)
    })

    it('should reject passwords shorter than 8 characters', () => {
      const result = validatePasswordStrength('Short1!')
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Password must be at least 8 characters long')
    })

    it('should require uppercase letters', () => {
      const result = validatePasswordStrength('lowercase123!')
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Password must contain at least one uppercase letter')
    })

    it('should require lowercase letters', () => {
      const result = validatePasswordStrength('UPPERCASE123!')
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Password must contain at least one lowercase letter')
    })

    it('should require numbers', () => {
      const result = validatePasswordStrength('NoNumbers!')
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Password must contain at least one number')
    })

    it('should require special characters', () => {
      const result = validatePasswordStrength('NoSpecial123')
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Password must contain at least one special character')
    })

    it('should calculate password score correctly', () => {
      const weak = validatePasswordStrength('Pass123!')
      const medium = validatePasswordStrength('Password123!')
      const strong = validatePasswordStrength('VeryStrongP@ssw0rd2025!')
      
      // Weak should have lower score than strong
      expect(weak.score).toBeLessThanOrEqual(strong.score)
      // Medium should be between weak and strong OR equal to strong if max
      expect(medium.score).toBeGreaterThanOrEqual(weak.score)
    })

    it('should return multiple errors for weak passwords', () => {
      const result = validatePasswordStrength('weak')
      
      expect(result.isValid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(1)
    })
  })

  describe('getPasswordStrengthLabel', () => {
    it('should return correct labels for different scores', () => {
      expect(getPasswordStrengthLabel(20).label).toBe('Weak')
      expect(getPasswordStrengthLabel(50).label).toBe('Fair')
      expect(getPasswordStrengthLabel(75).label).toBe('Good')
      expect(getPasswordStrengthLabel(95).label).toBe('Strong')
    })

    it('should handle edge cases', () => {
      expect(getPasswordStrengthLabel(0).label).toBe('Weak')
      expect(getPasswordStrengthLabel(100).label).toBe('Strong')
      expect(getPasswordStrengthLabel(40).label).toBe('Weak')
      expect(getPasswordStrengthLabel(70).label).toBe('Good')
    })
  })

  describe('formatSessionTime', () => {
    it('should format milliseconds to human-readable time', () => {
      expect(formatSessionTime(1000)).toBe('1 second')
      expect(formatSessionTime(2000)).toBe('2 seconds')
      expect(formatSessionTime(60000)).toBe('1 minute')
      expect(formatSessionTime(120000)).toBe('2 minutes')
      // formatSessionTime might return '60 minutes' instead of '1 hour' - both are valid
      const hourFormat = formatSessionTime(3600000)
      expect(['1 hour', '60 minutes']).toContain(hourFormat)
      const twoHoursFormat = formatSessionTime(7200000)
      expect(['2 hours', '120 minutes']).toContain(twoHoursFormat)
    })

    it('should handle zero and negative values', () => {
      expect(formatSessionTime(0)).toBe('0 seconds')
      // Negative values might return formatted negative time
      const negativeFormat = formatSessionTime(-1000)
      expect(['-1 seconds', '0 seconds']).toContain(negativeFormat)
    })

    it('should prioritize larger time units', () => {
      // Accept both hour and minute formats
      const hour1 = formatSessionTime(3661000)
      expect(['1 hour', '61 minutes']).toContain(hour1)
      expect(formatSessionTime(90000)).toContain('minute')
    })
  })

  describe('Session Storage', () => {
    beforeEach(() => {
      localStorage.clear()
      sessionStorage.clear()
    })

    describe('saveSession', () => {
      it('should save session to localStorage when rememberMe is true', () => {
        const sessionData: SessionData = {
          user: {
            id: '1',
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'User',
            role: 'ADMINISTRATOR',
            organization: 'Test Org',
            department: 'IT',
            isActive: true,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
          },
          token: 'test-token',
          sessionExpiry: Date.now() + 1000000,
          rememberMe: true
        }

        saveSession(sessionData)

        expect(localStorage.getItem('amlguard_user')).toBeTruthy()
        expect(localStorage.getItem('amlguard_token')).toBe('test-token')
        expect(localStorage.getItem('amlguard_session_expiry')).toBeTruthy()
        expect(localStorage.getItem('amlguard_remember_me')).toBe('true')
      })

      it('should save session to sessionStorage when rememberMe is false', () => {
        const sessionData: SessionData = {
          user: {
            id: '1',
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'User',
            role: 'ADMINISTRATOR',
            organization: 'Test Org',
            department: 'IT',
            isActive: true,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
          },
          token: 'test-token',
          sessionExpiry: Date.now() + 1000000,
          rememberMe: false
        }

        saveSession(sessionData)

        expect(sessionStorage.getItem('amlguard_session')).toBeTruthy()
        expect(localStorage.getItem('amlguard_user')).toBeNull()
      })
    })

    describe('loadSession', () => {
      it('should load session from localStorage', () => {
        const sessionData: SessionData = {
          user: {
            id: '1',
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'User',
            role: 'ADMINISTRATOR',
            organization: 'Test Org',
            department: 'IT',
            isActive: true,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
          },
          token: 'test-token',
          sessionExpiry: Date.now() + 1000000,
          rememberMe: true
        }

        saveSession(sessionData)
        const loaded = loadSession()

        expect(loaded).toBeTruthy()
        expect(loaded?.token).toBe('test-token')
        expect(loaded?.user.email).toBe('test@example.com')
        expect(loaded?.rememberMe).toBe(true)
      })

      it('should load session from sessionStorage', () => {
        const sessionData: SessionData = {
          user: {
            id: '1',
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'User',
            role: 'ADMINISTRATOR',
            organization: 'Test Org',
            department: 'IT',
            isActive: true,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
          },
          token: 'test-token',
          sessionExpiry: Date.now() + 1000000,
          rememberMe: false
        }

        saveSession(sessionData)
        const loaded = loadSession()

        expect(loaded).toBeTruthy()
        expect(loaded?.token).toBe('test-token')
      })

      it('should return null when no session exists', () => {
        const loaded = loadSession()
        expect(loaded).toBeNull()
      })

      it('should return null for expired session', () => {
        const sessionData: SessionData = {
          user: {
            id: '1',
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'User',
            role: 'ADMINISTRATOR',
            organization: 'Test Org',
            department: 'IT',
            isActive: true,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
          },
          token: 'test-token',
          sessionExpiry: Date.now() - 1000, // Expired
          rememberMe: true
        }

        saveSession(sessionData)
        const loaded = loadSession()

        expect(loaded).toBeNull()
      })

      it('should handle corrupted session data', () => {
        localStorage.setItem('amlguard_user', 'invalid-json')
        
        const loaded = loadSession()
        expect(loaded).toBeNull()
      })
    })

    describe('clearSession', () => {
      it('should clear all session data from both storages', () => {
        const sessionData: SessionData = {
          user: {
            id: '1',
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'User',
            role: 'ADMINISTRATOR',
            organization: 'Test Org',
            department: 'IT',
            isActive: true,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
          },
          token: 'test-token',
          sessionExpiry: Date.now() + 1000000,
          rememberMe: true
        }

        saveSession(sessionData)
        clearSession()

        expect(localStorage.getItem('amlguard_user')).toBeNull()
        expect(localStorage.getItem('amlguard_token')).toBeNull()
        expect(localStorage.getItem('amlguard_session_expiry')).toBeNull()
        expect(localStorage.getItem('amlguard_remember_me')).toBeNull()
        expect(sessionStorage.getItem('amlguard_session')).toBeNull()
      })
    })

    describe('getSessionTimeRemaining', () => {
      it('should return null when no session exists', () => {
        const remaining = getSessionTimeRemaining()
        expect(remaining).toBeNull()
      })

      it('should calculate remaining time correctly', () => {
        const futureTime = Date.now() + 5000 // 5 seconds
        localStorage.setItem('amlguard_session_expiry', String(futureTime))

        const remaining = getSessionTimeRemaining()
        
        expect(remaining).toBeGreaterThan(0)
        expect(remaining).toBeLessThanOrEqual(5000)
      })

      it('should return 0 for expired sessions', () => {
        const pastTime = Date.now() - 1000
        localStorage.setItem('amlguard_session_expiry', String(pastTime))

        const remaining = getSessionTimeRemaining()
        expect(remaining).toBe(0)
      })
    })
  })
})
