/**
 * Dashboard Mock Data Service
 * Provides realistic mock data for dashboard components
 */

import {
  Building2,
  Users,
  ArrowRightLeft,
  AlertTriangle,
  Shield,
  Activity,
  FileText,
  CheckCircle,
  Clock,
  TrendingUp,
} from 'lucide-vue-next'
import type {
  StatCard,
  Activity as ActivityType,
  Alert,
  Task,
  DashboardData,
  SystemStatusInfo,
  QuickAction,
  ChartConfig,
} from '@/types/dashboard'

/**
 * Generate random number within range
 */
const random = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Generate random date within last N days
 */
const randomDate = (daysAgo: number): string => {
  const date = new Date()
  date.setDate(date.getDate() - random(0, daysAgo))
  date.setHours(random(0, 23), random(0, 59), 0, 0)
  return date.toISOString()
}

/**
 * User names pool
 */
const userNames = [
  'John Doe',
  'Jane Smith',
  'Michael Brown',
  'Sarah Wilson',
  'David Lee',
  'Emily Chen',
  'Robert Taylor',
  'Lisa Anderson',
  'James Martinez',
  'Maria Garcia',
]

/**
 * Entity names pool
 */
const entityNames = [
  'First National Bank',
  'Central Securities',
  'Global Investments Ltd',
  'Capital Trust',
  'Metropolitan Finance',
  'United Asset Management',
  'Premier Banking Group',
  'Sovereign Wealth Fund',
  'Diamond Trust Bank',
  'Standard Finance Corp',
]

/**
 * Generate Administrator dashboard mock data
 */
export const generateAdminDashboardData = (): DashboardData => {
  const stats: StatCard[] = [
    {
      id: 'total-entities',
      label: 'Total Entities',
      value: 247,
      icon: Building2,
      color: 'blue',
      trend: {
        direction: 'up',
        percentage: 12,
        type: 'positive',
      },
      subtitle: '+15 this month',
    },
    {
      id: 'active-transactions',
      label: 'Active Transactions',
      value: '1,834',
      icon: ArrowRightLeft,
      color: 'green',
      trend: {
        direction: 'up',
        percentage: 8,
        type: 'positive',
      },
      subtitle: 'Last 30 days',
    },
    {
      id: 'pending-reviews',
      label: 'Pending Reviews',
      value: 42,
      icon: Clock,
      color: 'yellow',
      trend: {
        direction: 'down',
        percentage: 5,
        type: 'positive',
      },
      subtitle: '12 urgent',
    },
    {
      id: 'risk-alerts',
      label: 'Risk Alerts',
      value: 18,
      icon: AlertTriangle,
      color: 'red',
      trend: {
        direction: 'up',
        percentage: 23,
        type: 'negative',
      },
      subtitle: '8 critical',
    },
    {
      id: 'compliance-rate',
      label: 'Compliance Rate',
      value: '94.2%',
      icon: Shield,
      color: 'green',
      trend: {
        direction: 'up',
        percentage: 2,
        type: 'positive',
      },
      subtitle: 'Target: 95%',
    },
    {
      id: 'system-health',
      label: 'System Health',
      value: '99.8%',
      icon: Activity,
      color: 'green',
      trend: {
        direction: 'neutral',
        percentage: 0,
        type: 'neutral',
      },
      subtitle: 'All systems operational',
    },
  ]

  const activities: ActivityType[] = [
    {
      id: '1',
      type: 'create',
      title: 'New entity registered',
      description: `${entityNames[0]} completed registration process`,
      timestamp: randomDate(1),
      user: { name: userNames[0] },
      color: 'green',
    },
    {
      id: '2',
      type: 'approve',
      title: 'Transaction approved',
      description: 'High-value transaction TXN-2024-5847 approved after review',
      timestamp: randomDate(1),
      user: { name: userNames[1] },
      color: 'green',
    },
    {
      id: '3',
      type: 'alert',
      title: 'Risk alert triggered',
      description: 'Suspicious activity pattern detected for Entity ID: ENT-1245',
      timestamp: randomDate(2),
      user: { name: 'System' },
      color: 'red',
    },
    {
      id: '4',
      type: 'review',
      title: 'Compliance report reviewed',
      description: `Q4 2024 report for ${entityNames[2]} marked as compliant`,
      timestamp: randomDate(2),
      user: { name: userNames[2] },
      color: 'blue',
    },
    {
      id: '5',
      type: 'update',
      title: 'Entity profile updated',
      description: `${entityNames[3]} updated their KYC documentation`,
      timestamp: randomDate(3),
      user: { name: userNames[3] },
      color: 'yellow',
    },
    {
      id: '6',
      type: 'submit',
      title: 'STR report submitted',
      description: 'Suspicious Transaction Report STR-2024-0892 filed',
      timestamp: randomDate(3),
      user: { name: userNames[4] },
      color: 'purple',
    },
    {
      id: '7',
      type: 'login',
      title: 'Supervisor login',
      description: `${userNames[5]} logged in from 192.168.1.45`,
      timestamp: randomDate(4),
      user: { name: userNames[5] },
      color: 'blue',
    },
    {
      id: '8',
      type: 'reject',
      title: 'Document rejected',
      description: 'Incomplete AML policy document returned for revision',
      timestamp: randomDate(5),
      user: { name: userNames[6] },
      color: 'red',
    },
  ]

  const alerts: Alert[] = [
    {
      id: 'alert-1',
      title: 'Critical: High-Risk Transaction Detected',
      message: 'Transaction TXN-2024-9876 exceeds risk threshold and requires immediate review',
      priority: 'critical',
      timestamp: randomDate(0),
      dismissible: false,
      action: {
        label: 'Review Now',
        handler: () => console.log('Reviewing transaction'),
      },
    },
    {
      id: 'alert-2',
      title: 'Compliance Deadline Approaching',
      message: '15 entities have pending quarterly reports due in 3 days',
      priority: 'warning',
      timestamp: randomDate(1),
      action: {
        label: 'View Reports',
        handler: () => console.log('Viewing reports'),
      },
    },
    {
      id: 'alert-3',
      title: 'System Maintenance Scheduled',
      message: 'Platform maintenance scheduled for Saturday, 2:00 AM - 4:00 AM',
      priority: 'info',
      timestamp: randomDate(2),
    },
    {
      id: 'alert-4',
      title: 'New User Registration',
      message: '3 new supervisor accounts pending approval',
      priority: 'info',
      timestamp: randomDate(2),
      action: {
        label: 'Review Users',
        handler: () => console.log('Reviewing users'),
      },
    },
    {
      id: 'alert-5',
      title: 'Multiple Failed Login Attempts',
      message: 'Account ENT-8745 has 5 failed login attempts in the last hour',
      priority: 'warning',
      timestamp: randomDate(3),
    },
  ]

  const tasks: Task[] = [
    {
      id: 'task-1',
      title: 'Review pending entity registrations',
      description: '8 new entities awaiting approval',
      status: 'pending',
      priority: 'high',
      dueDate: new Date(Date.now() + 86400000).toISOString(),
      assignee: { name: userNames[0] },
    },
    {
      id: 'task-2',
      title: 'Process suspicious transaction reports',
      description: '5 STRs require investigation',
      status: 'in-progress',
      priority: 'critical',
      dueDate: new Date(Date.now() + 43200000).toISOString(),
      assignee: { name: userNames[1] },
    },
    {
      id: 'task-3',
      title: 'Update risk assessment framework',
      description: 'Annual review of risk scoring methodology',
      status: 'pending',
      priority: 'medium',
      dueDate: new Date(Date.now() + 604800000).toISOString(),
      assignee: { name: userNames[2] },
    },
  ]

  const charts: ChartConfig[] = [] // Will be populated with actual chart data when implementing charts

  const systemStatus: SystemStatusInfo = {
    status: 'operational',
    message: 'All systems operational',
    lastUpdated: new Date().toISOString(),
    uptime: 99.8,
    services: [
      { name: 'API Gateway', status: 'operational' },
      { name: 'Database', status: 'operational' },
      { name: 'File Storage', status: 'operational' },
      { name: 'Email Service', status: 'operational' },
    ],
  }

  return {
    stats,
    activities,
    alerts,
    tasks,
    charts,
    systemStatus,
    lastUpdated: new Date().toISOString(),
  }
}

/**
 * Generate Supervisor dashboard mock data
 */
export const generateSupervisorDashboardData = (): DashboardData => {
  const stats: StatCard[] = [
    {
      id: 'assigned-entities',
      label: 'Assigned Entities',
      value: 32,
      icon: Building2,
      color: 'blue',
      trend: {
        direction: 'neutral',
        percentage: 0,
        type: 'neutral',
      },
      subtitle: 'Under supervision',
    },
    {
      id: 'pending-approvals',
      label: 'Pending Approvals',
      value: 12,
      icon: Clock,
      color: 'yellow',
      trend: {
        direction: 'down',
        percentage: 15,
        type: 'positive',
      },
      subtitle: '3 urgent',
    },
    {
      id: 'recent-alerts',
      label: 'Recent Alerts',
      value: 7,
      icon: AlertTriangle,
      color: 'red',
      trend: {
        direction: 'up',
        percentage: 12,
        type: 'negative',
      },
      subtitle: 'Last 7 days',
    },
    {
      id: 'completion-rate',
      label: 'Completion Rate',
      value: '87%',
      icon: CheckCircle,
      color: 'green',
      trend: {
        direction: 'up',
        percentage: 5,
        type: 'positive',
      },
      subtitle: 'This month',
    },
  ]

  const activities: ActivityType[] = [
    {
      id: '1',
      type: 'approve',
      title: 'Report approved',
      description: `Compliance report for ${entityNames[0]} approved`,
      timestamp: randomDate(1),
      user: { name: userNames[0] },
    },
    {
      id: '2',
      type: 'review',
      title: 'Transaction reviewed',
      description: 'Large transaction TXN-2024-4532 reviewed and cleared',
      timestamp: randomDate(1),
      user: { name: userNames[0] },
    },
    {
      id: '3',
      type: 'update',
      title: 'Risk assessment updated',
      description: `${entityNames[1]} risk score updated to Medium`,
      timestamp: randomDate(2),
      user: { name: userNames[0] },
    },
  ]

  const alerts: Alert[] = [
    {
      id: 'alert-1',
      title: 'Urgent: Entity Report Overdue',
      message: `${entityNames[2]} quarterly report is 5 days overdue`,
      priority: 'error',
      timestamp: randomDate(0),
      action: {
        label: 'Contact Entity',
        handler: () => console.log('Contacting entity'),
      },
    },
    {
      id: 'alert-2',
      title: 'New Transaction for Review',
      message: 'High-value transaction awaiting your approval',
      priority: 'warning',
      timestamp: randomDate(1),
    },
  ]

  const tasks: Task[] = [
    {
      id: 'task-1',
      title: 'Review quarterly compliance reports',
      description: '5 reports pending review',
      status: 'pending',
      priority: 'high',
      dueDate: new Date(Date.now() + 172800000).toISOString(),
    },
    {
      id: 'task-2',
      title: 'Conduct entity site visit',
      description: `Scheduled visit to ${entityNames[3]}`,
      status: 'pending',
      priority: 'medium',
      dueDate: new Date(Date.now() + 432000000).toISOString(),
    },
  ]

  const systemStatus: SystemStatusInfo = {
    status: 'operational',
    message: 'All systems operational',
    lastUpdated: new Date().toISOString(),
    uptime: 99.8,
  }

  return {
    stats,
    activities,
    alerts,
    tasks,
    charts: [],
    systemStatus,
    lastUpdated: new Date().toISOString(),
  }
}

/**
 * Generate Entity dashboard mock data
 */
export const generateEntityDashboardData = (): DashboardData => {
  const stats: StatCard[] = [
    {
      id: 'compliance-score',
      label: 'Compliance Score',
      value: '92%',
      icon: Shield,
      color: 'green',
      trend: {
        direction: 'up',
        percentage: 3,
        type: 'positive',
      },
      subtitle: 'Above average',
    },
    {
      id: 'pending-submissions',
      label: 'Pending Submissions',
      value: 3,
      icon: FileText,
      color: 'yellow',
      trend: {
        direction: 'neutral',
        percentage: 0,
        type: 'neutral',
      },
      subtitle: '1 due soon',
    },
    {
      id: 'recent-transactions',
      label: 'Recent Transactions',
      value: 156,
      icon: ArrowRightLeft,
      color: 'blue',
      trend: {
        direction: 'up',
        percentage: 18,
        type: 'positive',
      },
      subtitle: 'Last 30 days',
    },
    {
      id: 'active-alerts',
      label: 'Active Alerts',
      value: 2,
      icon: AlertTriangle,
      color: 'red',
      trend: {
        direction: 'down',
        percentage: 50,
        type: 'positive',
      },
      subtitle: 'Resolved: 4',
    },
  ]

  const activities: ActivityType[] = [
    {
      id: '1',
      type: 'submit',
      title: 'Report submitted',
      description: 'Monthly compliance report submitted successfully',
      timestamp: randomDate(1),
      user: { name: userNames[7] },
    },
    {
      id: '2',
      type: 'update',
      title: 'Profile updated',
      description: 'KYC documentation updated',
      timestamp: randomDate(2),
      user: { name: userNames[7] },
    },
  ]

  const alerts: Alert[] = [
    {
      id: 'alert-1',
      title: 'Document Update Required',
      message: 'Your AML policy document needs to be updated by end of month',
      priority: 'warning',
      timestamp: randomDate(1),
      action: {
        label: 'Update Now',
        handler: () => console.log('Updating document'),
      },
    },
    {
      id: 'alert-2',
      title: 'Training Deadline',
      message: 'Annual AML training certification expires in 15 days',
      priority: 'info',
      timestamp: randomDate(2),
    },
  ]

  const tasks: Task[] = [
    {
      id: 'task-1',
      title: 'Submit quarterly report',
      description: 'Q4 2024 compliance report',
      status: 'pending',
      priority: 'high',
      dueDate: new Date(Date.now() + 259200000).toISOString(),
    },
    {
      id: 'task-2',
      title: 'Update customer risk assessments',
      description: 'Review and update high-risk customer profiles',
      status: 'in-progress',
      priority: 'medium',
      dueDate: new Date(Date.now() + 604800000).toISOString(),
    },
  ]

  const systemStatus: SystemStatusInfo = {
    status: 'operational',
    message: 'All systems operational',
    lastUpdated: new Date().toISOString(),
    uptime: 99.8,
  }

  return {
    stats,
    activities,
    alerts,
    tasks,
    charts: [],
    systemStatus,
    lastUpdated: new Date().toISOString(),
  }
}

/**
 * Generate quick actions for Administrator
 */
export const generateAdminQuickActions = (): QuickAction[] => {
  return [
    {
      id: 'add-entity',
      label: 'Register New Entity',
      icon: Building2,
      action: async () => console.log('Add entity'),
      color: 'blue',
    },
    {
      id: 'review-reports',
      label: 'Review Reports',
      icon: FileText,
      action: async () => console.log('Review reports'),
      color: 'green',
      badge: 12,
    },
    {
      id: 'manage-users',
      label: 'Manage Users',
      icon: Users,
      action: async () => console.log('Manage users'),
      color: 'purple',
    },
    {
      id: 'risk-assessment',
      label: 'Risk Assessment',
      icon: AlertTriangle,
      action: async () => console.log('Risk assessment'),
      color: 'yellow',
    },
    {
      id: 'system-settings',
      label: 'System Settings',
      icon: Activity,
      action: async () => console.log('System settings'),
      color: 'gray',
    },
    {
      id: 'generate-report',
      label: 'Generate Report',
      icon: TrendingUp,
      action: async () => console.log('Generate report'),
      color: 'indigo',
    },
  ]
}

/**
 * Generate quick actions for Supervisor
 */
export const generateSupervisorQuickActions = (): QuickAction[] => {
  return [
    {
      id: 'review-submissions',
      label: 'Review Submissions',
      icon: FileText,
      action: async () => console.log('Review submissions'),
      color: 'blue',
      badge: 5,
    },
    {
      id: 'approve-transactions',
      label: 'Approve Transactions',
      icon: CheckCircle,
      action: async () => console.log('Approve transactions'),
      color: 'green',
      badge: 3,
    },
    {
      id: 'entity-reports',
      label: 'Entity Reports',
      icon: Building2,
      action: async () => console.log('Entity reports'),
      color: 'purple',
    },
  ]
}

/**
 * Generate quick actions for Entity
 */
export const generateEntityQuickActions = (): QuickAction[] => {
  return [
    {
      id: 'submit-report',
      label: 'Submit Report',
      icon: FileText,
      action: async () => console.log('Submit report'),
      color: 'blue',
    },
    {
      id: 'view-transactions',
      label: 'View Transactions',
      icon: ArrowRightLeft,
      action: async () => console.log('View transactions'),
      color: 'green',
    },
    {
      id: 'update-profile',
      label: 'Update Profile',
      icon: Users,
      action: async () => console.log('Update profile'),
      color: 'purple',
    },
  ]
}
