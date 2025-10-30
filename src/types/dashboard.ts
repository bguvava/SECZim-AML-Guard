/**
 * Dashboard Types
 * Defines all TypeScript interfaces and types for the Dashboard Home module
 */

import type { Component } from 'vue'

/**
 * Trend direction for metrics
 */
export type TrendDirection = 'up' | 'down' | 'neutral'

/**
 * Trend type for positive/negative interpretation
 */
export type TrendType = 'positive' | 'negative' | 'neutral'

/**
 * Statistics card data structure
 */
export interface StatCard {
  id: string
  label: string
  value: number | string
  icon: Component | string
  trend?: {
    direction: TrendDirection
    percentage: number
    type?: TrendType
  }
  subtitle?: string
  color?: string
  loading?: boolean
}

/**
 * Activity type for timeline
 */
export type ActivityType = 
  | 'login'
  | 'logout' 
  | 'create'
  | 'update'
  | 'delete'
  | 'submit'
  | 'approve'
  | 'reject'
  | 'review'
  | 'alert'
  | 'system'

/**
 * Activity item for recent activities feed
 */
export interface Activity {
  id: string
  type: ActivityType
  title: string
  description: string
  timestamp: string
  user?: {
    name: string
    avatar?: string
  }
  icon?: Component | string
  color?: string
  metadata?: Record<string, unknown>
}

/**
 * Quick action button configuration
 */
export interface QuickAction {
  id: string
  label: string
  icon: Component | string
  action: () => void | Promise<void>
  color?: string
  disabled?: boolean
  tooltip?: string
  badge?: string | number
}

/**
 * Alert priority levels
 */
export type AlertPriority = 'info' | 'success' | 'warning' | 'error' | 'critical'

/**
 * Alert/notification item
 */
export interface Alert {
  id: string
  title: string
  message: string
  priority: AlertPriority
  timestamp: string
  read?: boolean
  dismissible?: boolean
  action?: {
    label: string
    handler: () => void | Promise<void>
  }
  icon?: Component | string
}

/**
 * Task status
 */
export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'overdue'

/**
 * Task item for pending tasks widget
 */
export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: 'low' | 'medium' | 'high' | 'critical'
  dueDate?: string
  assignee?: {
    name: string
    avatar?: string
  }
  completed?: boolean
  action?: () => void | Promise<void>
}

/**
 * Chart data point
 */
export interface ChartDataPoint {
  label: string
  value: number
  color?: string
  metadata?: Record<string, unknown>
}

/**
 * Chart configuration
 */
export interface ChartConfig {
  type: 'line' | 'bar' | 'doughnut' | 'pie' | 'area'
  title?: string
  subtitle?: string
  data: ChartDataPoint[]
  datasets?: {
    label: string
    data: number[]
    backgroundColor?: string | string[]
    borderColor?: string | string[]
    fill?: boolean
  }[]
  labels?: string[]
  options?: Record<string, unknown>
  loading?: boolean
  height?: number
}

/**
 * System status levels
 */
export type SystemStatus = 'operational' | 'degraded' | 'maintenance' | 'outage'

/**
 * System status indicator
 */
export interface SystemStatusInfo {
  status: SystemStatus
  message: string
  lastUpdated: string
  uptime?: number
  services?: {
    name: string
    status: SystemStatus
  }[]
}

/**
 * Dashboard widget configuration
 */
export interface DashboardWidget {
  id: string
  title: string
  type: 'stat' | 'chart' | 'activity' | 'tasks' | 'alerts' | 'custom'
  order: number
  visible: boolean
  collapsible?: boolean
  collapsed?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  data?: unknown
}

/**
 * Dashboard layout configuration
 */
export interface DashboardLayout {
  columns: number
  gap: number
  widgets: DashboardWidget[]
  customizable?: boolean
}

/**
 * Dashboard configuration per role
 */
export interface DashboardConfig {
  role: 'Administrator' | 'Supervisor' | 'Entity'
  title: string
  subtitle: string
  layout: DashboardLayout
  stats: StatCard[]
  quickActions?: QuickAction[]
  showActivityFeed?: boolean
  showAlerts?: boolean
  showTasks?: boolean
  charts?: ChartConfig[]
  refreshInterval?: number
}

/**
 * Dashboard data response
 */
export interface DashboardData {
  stats: StatCard[]
  activities: Activity[]
  alerts: Alert[]
  tasks: Task[]
  charts: ChartConfig[]
  systemStatus: SystemStatusInfo
  lastUpdated: string
}

/**
 * Time range for data filtering
 */
export type TimeRange = '24h' | '7d' | '30d' | '90d' | '1y' | 'all'

/**
 * Dashboard filter options
 */
export interface DashboardFilters {
  timeRange: TimeRange
  entityId?: string
  supervisorId?: string
  status?: string[]
  priority?: string[]
}

/**
 * Default dashboard refresh interval (in milliseconds)
 */
export const DEFAULT_REFRESH_INTERVAL = 30000 // 30 seconds

/**
 * Default time range for dashboard data
 */
export const DEFAULT_TIME_RANGE: TimeRange = '30d'

/**
 * Alert priority color mapping
 */
export const ALERT_PRIORITY_COLORS: Record<AlertPriority, string> = {
  info: 'blue',
  success: 'green',
  warning: 'yellow',
  error: 'red',
  critical: 'purple',
}

/**
 * System status color mapping
 */
export const SYSTEM_STATUS_COLORS: Record<SystemStatus, string> = {
  operational: 'green',
  degraded: 'yellow',
  maintenance: 'blue',
  outage: 'red',
}

/**
 * Task status color mapping
 */
export const TASK_STATUS_COLORS: Record<TaskStatus, string> = {
  pending: 'gray',
  'in-progress': 'blue',
  completed: 'green',
  overdue: 'red',
}
