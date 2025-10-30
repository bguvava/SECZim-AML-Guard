/**
 * Authentication Utilities
 * Helper functions for auth operations, token management, session handling
 */

import type { User, SessionData } from '@/types/auth'

const TOKEN_KEY = 'amlguard_token'
const USER_KEY = 'amlguard_user'
const SESSION_KEY = 'amlguard_session'
const REMEMBER_KEY = 'amlguard_remember'

/**
 * Generate mock JWT token for prototype
 */
export function generateToken(userId: string): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const payload = btoa(
    JSON.stringify({
      sub: userId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 86400, // 24 hours
    })
  )
  const signature = btoa(`mock_signature_${userId}`)
  return `${header}.${payload}.${signature}`
}

/**
 * Save session data to storage
 */
export function saveSession(sessionData: SessionData): void {
  const storage = sessionData.rememberMe ? localStorage : sessionStorage
  
  storage.setItem(TOKEN_KEY, sessionData.token)
  storage.setItem(USER_KEY, JSON.stringify(sessionData.user))
  storage.setItem(SESSION_KEY, JSON.stringify({
    expiry: sessionData.expiry,
    rememberMe: sessionData.rememberMe,
  }))
  
  if (sessionData.rememberMe) {
    localStorage.setItem(REMEMBER_KEY, 'true')
  }
}

/**
 * Load session data from storage
 */
export function loadSession(): SessionData | null {
  // Check both localStorage and sessionStorage
  const rememberMe = localStorage.getItem(REMEMBER_KEY) === 'true'
  const storage = rememberMe ? localStorage : sessionStorage
  
  const token = storage.getItem(TOKEN_KEY)
  const userStr = storage.getItem(USER_KEY)
  const sessionStr = storage.getItem(SESSION_KEY)
  
  if (!token || !userStr || !sessionStr) {
    return null
  }
  
  try {
    const user: User = JSON.parse(userStr)
    const sessionInfo = JSON.parse(sessionStr)
    
    // Check if session has expired
    if (sessionInfo.expiry && Date.now() > sessionInfo.expiry) {
      clearSession()
      return null
    }
    
    return {
      user,
      token,
      expiry: sessionInfo.expiry,
      rememberMe: sessionInfo.rememberMe,
    }
  } catch (error) {
    console.error('Failed to parse session data:', error)
    clearSession()
    return null
  }
}

/**
 * Clear session data from storage
 */
export function clearSession(): void {
  // Clear from both storages to be safe
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  localStorage.removeItem(SESSION_KEY)
  localStorage.removeItem(REMEMBER_KEY)
  
  sessionStorage.removeItem(TOKEN_KEY)
  sessionStorage.removeItem(USER_KEY)
  sessionStorage.removeItem(SESSION_KEY)
}

/**
 * Check if session is expired
 */
export function isSessionExpired(): boolean {
  const sessionStr = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY)
  
  if (!sessionStr) {
    return true
  }
  
  try {
    const sessionInfo = JSON.parse(sessionStr)
    return sessionInfo.expiry && Date.now() > sessionInfo.expiry
  } catch {
    return true
  }
}

/**
 * Update session expiry time
 */
export function extendSession(hours: number = 24): void {
  const rememberMe = localStorage.getItem(REMEMBER_KEY) === 'true'
  const storage = rememberMe ? localStorage : sessionStorage
  
  const sessionStr = storage.getItem(SESSION_KEY)
  if (!sessionStr) return
  
  try {
    const sessionInfo = JSON.parse(sessionStr)
    sessionInfo.expiry = Date.now() + hours * 60 * 60 * 1000
    storage.setItem(SESSION_KEY, JSON.stringify(sessionInfo))
  } catch (error) {
    console.error('Failed to extend session:', error)
  }
}

/**
 * Get session time remaining in milliseconds
 */
export function getSessionTimeRemaining(): number | null {
  const sessionStr = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY)
  
  if (!sessionStr) {
    return null
  }
  
  try {
    const sessionInfo = JSON.parse(sessionStr)
    if (!sessionInfo.expiry) return null
    
    const remaining = sessionInfo.expiry - Date.now()
    return remaining > 0 ? remaining : 0
  } catch {
    return null
  }
}

/**
 * Format session time for display (e.g., "5 minutes")
 */
export function formatSessionTime(milliseconds: number): string {
  const minutes = Math.floor(milliseconds / 60000)
  const seconds = Math.floor((milliseconds % 60000) / 1000)
  
  if (minutes > 0) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`
  }
  return `${seconds} second${seconds !== 1 ? 's' : ''}`
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate password strength
 * Requirements: min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean
  score: number // 0-100
  errors: string[]
} {
  const errors: string[] = []
  let score = 0
  
  // Length check
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  } else {
    score += 25
  }
  
  // Uppercase check
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  } else {
    score += 25
  }
  
  // Lowercase check
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  } else {
    score += 25
  }
  
  // Number check
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number')
  } else {
    score += 15
  }
  
  // Special character check
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character')
  } else {
    score += 10
  }
  
  return {
    isValid: errors.length === 0,
    score,
    errors,
  }
}

/**
 * Get password strength label
 */
export function getPasswordStrengthLabel(score: number): {
  label: string
  color: string
} {
  if (score >= 80) return { label: 'Strong', color: 'success' }
  if (score >= 60) return { label: 'Good', color: 'info' }
  if (score >= 40) return { label: 'Fair', color: 'warning' }
  return { label: 'Weak', color: 'danger' }
}

/**
 * Hash password (mock for prototype)
 */
export function hashPassword(password: string): string {
  // In real app, use bcrypt or similar
  // For prototype, just encode
  return btoa(password)
}

/**
 * Compare password with hash (mock for prototype)
 */
export function comparePassword(password: string, hash: string): boolean {
  // In real app, use bcrypt compare
  // For prototype, just decode and compare
  try {
    return atob(hash) === password
  } catch {
    return false
  }
}

/**
 * Generate secure random string
 */
export function generateRandomString(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}
