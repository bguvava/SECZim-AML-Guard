/**
 * Authentication Composable
 * Reusable composable for authentication operations
 */

import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import { useToast } from 'vue-toastification'
import { formatSessionTime } from '@/utils/auth'

/**
 * Main auth composable
 */
export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()
  const toast = useToast()

  const currentUser = computed(() => authStore.currentUser)
  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const userRole = computed(() => authStore.userRole)

  /**
   * Login method
   */
  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    const response = await authStore.login({ email, password, rememberMe })

    if (response.success && response.user) {
      toast.success(response.message || 'Login successful!')
      
      // Redirect to role-specific dashboard
      const dashboardRoute = authStore.getDashboardRoute()
      await router.push(dashboardRoute)
    } else {
      toast.error(response.error || 'Login failed')
    }

    return response
  }

  /**
   * Logout method
   */
  const logout = async () => {
    authStore.logout()
    toast.info('You have been logged out successfully')
    await router.push('/login')
  }

  /**
   * Request password reset
   */
  const requestPasswordReset = async (email: string) => {
    const response = await authStore.requestPasswordReset(email)
    
    if (response.success) {
      toast.success(response.message)
    } else {
      toast.error(response.message)
    }

    return response
  }

  /**
   * Change password
   */
  const changePassword = async (currentPassword: string, newPassword: string) => {
    const response = await authStore.changePassword(currentPassword, newPassword)
    
    if (response.success) {
      toast.success(response.message)
    } else {
      toast.error(response.message)
    }

    return response
  }

  return {
    currentUser,
    isAuthenticated,
    userRole,
    login,
    logout,
    requestPasswordReset,
    changePassword,
  }
}

/**
 * Session management composable
 */
export function useSession() {
  const authStore = useAuthStore()
  const toast = useToast()
  const showWarning = ref(false)
  const timeRemaining = ref<number | null>(null)
  let warningShown = false
  let checkInterval: NodeJS.Timeout | null = null

  const isSessionActive = computed(() => authStore.isSessionActive)
  const sessionTimeRemaining = computed(() => authStore.sessionTimeRemaining)

  /**
   * Check session status periodically
   */
  const checkSession = () => {
    const remaining = authStore.sessionTimeRemaining
    timeRemaining.value = remaining

    if (!remaining) return

    // Show warning at 5 minutes
    const fiveMinutes = 5 * 60 * 1000
    if (remaining <= fiveMinutes && remaining > 0 && !warningShown) {
      showWarning.value = true
      warningShown = true
      toast.warning(
        `Your session will expire in ${formatSessionTime(remaining)}. Please save your work.`,
        { timeout: 8000 }
      )
    }

    // Auto-logout when session expires
    if (remaining <= 0) {
      handleSessionExpiry()
    }
  }

  /**
   * Handle session expiry
   */
  const handleSessionExpiry = () => {
    if (checkInterval) {
      clearInterval(checkInterval)
    }
    
    authStore.logout()
    toast.error('Your session has expired. Please log in again.')
  }

  /**
   * Extend session
   */
  const extendSession = () => {
    authStore.extendCurrentSession(8)
    showWarning.value = false
    warningShown = false
    toast.success('Your session has been extended')
  }

  /**
   * Start session monitoring
   */
  const startSessionMonitoring = (intervalMs: number = 30000) => {
    if (!authStore.isAuthenticated) return

    checkSession() // Initial check

    checkInterval = setInterval(checkSession, intervalMs)
  }

  /**
   * Stop session monitoring
   */
  const stopSessionMonitoring = () => {
    if (checkInterval) {
      clearInterval(checkInterval)
      checkInterval = null
    }
  }

  // Auto-start monitoring on mount
  onMounted(() => {
    startSessionMonitoring()
  })

  // Cleanup on unmount
  onUnmounted(() => {
    stopSessionMonitoring()
  })

  return {
    isSessionActive,
    sessionTimeRemaining,
    showWarning,
    timeRemaining,
    extendSession,
    startSessionMonitoring,
    stopSessionMonitoring,
  }
}

/**
 * Auth guard composable
 */
export function useAuthGuard() {
  const authStore = useAuthStore()
  const router = useRouter()

  /**
   * Check if user is authenticated
   */
  const requireAuth = () => {
    if (!authStore.isAuthenticated) {
      router.push({ name: 'login', query: { redirect: router.currentRoute.value.fullPath } })
      return false
    }
    return true
  }

  /**
   * Check if user has required role
   */
  const requireRole = (allowedRoles: string[]) => {
    if (!requireAuth()) return false

    if (!authStore.user || !allowedRoles.includes(authStore.user.role)) {
      router.push('/unauthorized')
      return false
    }

    return true
  }

  /**
   * Check if user is admin
   */
  const requireAdmin = () => {
    return requireRole(['Administrator'])
  }

  /**
   * Check if user is supervisor
   */
  const requireSupervisor = () => {
    return requireRole(['Supervisor'])
  }

  /**
   * Check if user is entity
   */
  const requireEntity = () => {
    return requireRole(['Entity'])
  }

  return {
    requireAuth,
    requireRole,
    requireAdmin,
    requireSupervisor,
    requireEntity,
  }
}
