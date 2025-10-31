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
  Eye,
  TrendingUp,
  Search,
  FileCheck,
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
    id: 'admin-security',
    label: 'Security Management',
    icon: Shield,
    route: '/admin/security-management',
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
    id: 'supervision-institutions',
    label: 'Institutions',
    icon: Building2,
    route: '/supervision/institutions',
  },
  {
    id: 'supervision-risk-profiling',
    label: 'Risk Profiling',
    icon: AlertTriangle,
    route: '/supervision/risk-profiling',
  },
  {
    id: 'supervision-surveillance',
    label: 'Surveillance',
    icon: Eye,
    route: '/supervision/surveillance',
  },
  {
    id: 'supervision-analytics',
    label: 'Analytics',
    icon: TrendingUp,
    route: '/supervision/analytics',
  },
  {
    id: 'supervision-inspections',
    label: 'Inspections',
    icon: Search,
    route: '/supervision/inspections',
  },
  {
    id: 'supervision-reports',
    label: 'Reports',
    icon: FileCheck,
    route: '/supervision/reports',
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
