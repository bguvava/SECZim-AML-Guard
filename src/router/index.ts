import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
  type RouteLocationNormalized,
  type NavigationGuardNext,
} from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'landing',
    component: () => import('@/views/LandingPage.vue'),
    meta: { title: 'AMLGuard - Home', requiresAuth: false },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/auth/LoginPage.vue'),
    meta: { title: 'Login - AMLGuard', requiresAuth: false },
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('@/views/auth/ForgotPassword.vue'),
    meta: { title: 'Forgot Password - AMLGuard', requiresAuth: false },
  },
  {
    path: '/unauthorized',
    name: 'unauthorized',
    component: () => import('@/views/Unauthorized.vue'),
    meta: { title: 'Unauthorized - AMLGuard', requiresAuth: false },
  },
  // Protected routes will be added here as we build modules
  // Admin Dashboard
  {
    path: '/admin/dashboard',
    name: 'admin-dashboard',
    component: () => import('@/views/admin/Dashboard.vue'),
    meta: {
      title: 'Admin Dashboard - AMLGuard',
      requiresAuth: true,
      allowedRoles: ['Administrator'],
    },
  },
  // Admin Entity Registry
  {
    path: '/admin/entity-registry',
    name: 'admin-entity-registry',
    component: () => import('@/views/admin/EntityRegistry.vue'),
    meta: {
      title: 'Entity Registry - AMLGuard',
      requiresAuth: true,
      allowedRoles: ['Administrator'],
    },
  },
  // Admin Security Management
  {
    path: '/admin/security-management',
    name: 'admin-security-management',
    component: () => import('@/views/admin/SecurityManagement.vue'),
    meta: {
      title: 'Security Management - AMLGuard',
      requiresAuth: true,
      allowedRoles: ['Administrator'],
    },
  },
  // Admin Supervisor Monitor
  {
    path: '/admin/supervisor-monitor',
    name: 'admin-supervisor-monitor',
    component: () => import('@/views/admin/supervisor-monitor/SupervisorMonitor.vue'),
    meta: {
      title: 'Supervisor Activity Monitor - AMLGuard',
      requiresAuth: true,
      allowedRoles: ['Administrator'],
    },
  },
  // Admin Supervisor Detail
  {
    path: '/admin/supervisor-monitor/:id',
    name: 'admin-supervisor-detail',
    component: () => import('@/views/admin/supervisor-monitor/SupervisorDetailView.vue'),
    meta: {
      title: 'Supervisor Details - AMLGuard',
      requiresAuth: true,
      allowedRoles: ['Administrator'],
    },
  },
  // Admin Audit Trail
  {
    path: '/admin/audit-trail',
    name: 'admin-audit-trail',
    component: () => import('@/views/admin/audit-trail/AuditTrail.vue'),
    meta: {
      title: 'Audit Trail - AMLGuard',
      requiresAuth: true,
      allowedRoles: ['Administrator', 'Auditor', 'Compliance Officer'],
    },
  },
  // Supervisor Dashboard
  {
    path: '/supervisor/dashboard',
    name: 'supervisor-dashboard',
    component: () => import('@/views/supervisor/SupervisorDashboard.vue'),
    meta: {
      title: 'Supervisor Dashboard - AMLGuard',
      requiresAuth: true,
      allowedRoles: ['Supervisor'],
    },
  },
  // Entity Dashboard
  {
    path: '/entity/dashboard',
    name: 'entity-dashboard',
    component: () => import('@/views/entity/Dashboard.vue'),
    meta: {
      title: 'Entity Dashboard - AMLGuard',
      requiresAuth: true,
      allowedRoles: ['Entity'],
    },
  },
  // 404 Catch-all route
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFound.vue'),
    meta: { title: 'Page Not Found - AMLGuard' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      }
    } else {
      return { top: 0 }
    }
  },
})

// Navigation guards
router.beforeEach((to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
  const authStore = useAuthStore()

  // Set page title
  document.title = (to.meta.title as string) || 'AMLGuard'

  // Attempt to restore session if not authenticated
  if (!authStore.isAuthenticated) {
    authStore.restoreSession()
  }

  // Check if route requires authentication
  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      // Redirect to login with return URL
      next({
        name: 'login',
        query: { redirect: to.fullPath },
      })
      return
    }

    // Check if user has required role
    if (to.meta.allowedRoles) {
      const allowedRoles = to.meta.allowedRoles as string[]
      if (!authStore.user || !allowedRoles.includes(authStore.user.role)) {
        next({ name: 'unauthorized' })
        return
      }
    }
  }

  // Redirect authenticated users away from login/register pages
  if (to.name === 'login' && authStore.isAuthenticated) {
    next({ path: authStore.getDashboardRoute() })
    return
  }

  next()
})

export default router
