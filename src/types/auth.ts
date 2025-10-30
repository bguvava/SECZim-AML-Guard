/**
 * Authentication Types
 * Defines all TypeScript interfaces and types for the authentication module
 */

/**
 * User roles in the AMLGuard system
 */
export enum UserRole {
  ADMINISTRATOR = 'Administrator',
  SUPERVISOR = 'Supervisor',
  ENTITY = 'Entity',
}

/**
 * User interface representing an authenticated user
 */
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  organization: string
  phone?: string
  avatar?: string
  isActive: boolean
  createdAt: string
  lastLogin?: string
  mfaEnabled?: boolean
}

/**
 * Login credentials payload
 */
export interface LoginCredentials {
  email: string
  password: string
  rememberMe: boolean
}

/**
 * Auth state stored in Pinia
 */
export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  sessionExpiry: number | null
  rememberMe: boolean
}

/**
 * Session data stored in localStorage/sessionStorage
 */
export interface SessionData {
  user: User
  token: string
  expiry: number
  rememberMe: boolean
}

/**
 * Demo user for prototype with credentials
 */
export interface DemoUser {
  id: string
  email: string
  password: string
  firstName: string
  lastName: string
  role: UserRole
  organization: string
  phone: string
  avatar?: string
  isActive: boolean
  createdAt: string
  lastLogin: string
}

/**
 * Login response
 */
export interface LoginResponse {
  success: boolean
  user?: User
  token?: string
  message?: string
  error?: string
}

/**
 * Password reset request payload
 */
export interface PasswordResetRequest {
  email: string
}

/**
 * Password reset response
 */
export interface PasswordResetResponse {
  success: boolean
  message: string
  error?: string
}

/**
 * Password change payload
 */
export interface PasswordChangePayload {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

/**
 * Session timeout configuration
 */
export interface SessionConfig {
  idleTimeout: number // milliseconds
  warningTime: number // milliseconds before timeout
  checkInterval: number // milliseconds
}

/**
 * MFA verification payload
 */
export interface MFAVerification {
  code: string
  userId: string
}
