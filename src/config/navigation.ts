/**
 * Navigation Configuration
 * Defines navigation menu items for each user role
 */

import {
  LayoutDashboard,
  Users,
  Building2,
  FileText,
  AlertTriangle,
  BarChart3,
  Settings,
  Bell,
  Shield,
  ClipboardCheck,
} from 'lucide-vue-next'
import type { NavigationItem } from '@/types/layout'

/**
 * Administrator Navigation
 */
export const adminNavigation: NavigationItem[] = [
  {
    id: 'admin-dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    route: '/admin/dashboard',
  },
  {
    id: 'admin-users',
    label: 'User Management',
    icon: Users,
    route: '/admin/users',
  },
  {
    id: 'admin-entity-registry',
    label: 'Entity Registry',
    icon: Building2,
    route: '/admin/entity-registry',
  },
  {
    id: 'admin-supervisors',
    label: 'Supervisors',
    icon: Shield,
    route: '/admin/supervisors',
  },
  {
    id: 'admin-reports',
    label: 'Reports',
    icon: FileText,
    route: '/admin/reports',
  },
  {
    id: 'admin-risk',
    label: 'Risk Management',
    icon: AlertTriangle,
    route: '/admin/risk',
  },
  {
    id: 'admin-analytics',
    label: 'Analytics',
    icon: BarChart3,
    route: '/admin/analytics',
  },
  {
    id: 'admin-settings',
    label: 'System Settings',
    icon: Settings,
    route: '/admin/settings',
  },
]

/**
 * Supervisor Navigation
 */
export const supervisorNavigation: NavigationItem[] = [
  {
    id: 'supervisor-dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    route: '/supervisor/dashboard',
  },
  {
    id: 'supervisor-entities',
    label: 'My Entities',
    icon: Building2,
    route: '/supervisor/entities',
    badge: '12',
  },
  {
    id: 'supervisor-assessments',
    label: 'Risk Assessments',
    icon: ClipboardCheck,
    route: '/supervisor/assessments',
  },
  {
    id: 'supervisor-reports',
    label: 'Reports',
    icon: FileText,
    route: '/supervisor/reports',
  },
  {
    id: 'supervisor-alerts',
    label: 'Alerts',
    icon: Bell,
    route: '/supervisor/alerts',
    badge: '3',
  },
  {
    id: 'supervisor-analytics',
    label: 'Analytics',
    icon: BarChart3,
    route: '/supervisor/analytics',
  },
]

/**
 * Entity Navigation
 */
export const entityNavigation: NavigationItem[] = [
  {
    id: 'entity-dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    route: '/entity/dashboard',
  },
  {
    id: 'entity-profile',
    label: 'My Profile',
    icon: Building2,
    route: '/entity/profile',
  },
  {
    id: 'entity-reports',
    label: 'Submit Reports',
    icon: FileText,
    route: '/entity/reports',
  },
  {
    id: 'entity-compliance',
    label: 'Compliance Status',
    icon: ClipboardCheck,
    route: '/entity/compliance',
  },
  {
    id: 'entity-notifications',
    label: 'Notifications',
    icon: Bell,
    route: '/entity/notifications',
    badge: '5',
  },
]

/**
 * Get navigation items based on user role
 */
export function getNavigationByRole(role: string): NavigationItem[] {
  switch (role.toLowerCase()) {
    case 'administrator':
      return adminNavigation
    case 'supervisor':
      return supervisorNavigation
    case 'entity':
      return entityNavigation
    default:
      return []
  }
}
