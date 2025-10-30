/**
 * Layout Types
 * Defines all TypeScript interfaces and types for the Core Application Layout module
 */

import type { Component } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

/**
 * Navigation menu item structure
 */
export interface NavigationItem {
  id: string
  label: string
  icon: Component | string
  route: RouteLocationRaw
  badge?: string | number
  children?: NavigationItem[]
  requiresAuth?: boolean
  roles?: string[]
}

/**
 * Breadcrumb item for navigation trail
 */
export interface BreadcrumbItem {
  label: string
  route?: RouteLocationRaw
  icon?: Component | string
}

/**
 * Sidebar state and configuration
 */
export interface SidebarState {
  isCollapsed: boolean
  isMobileOpen: boolean
  activeItemId: string | null
}

/**
 * Layout configuration options
 */
export interface LayoutConfig {
  showSidebar: boolean
  showTopBar: boolean
  showBreadcrumbs: boolean
  showFooter: boolean
  sidebarWidth: number
  sidebarCollapsedWidth: number
  maxContentWidth?: number
}

/**
 * Modal configuration
 */
export interface ModalConfig {
  id: string
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closeOnBackdrop?: boolean
  closeOnEscape?: boolean
  showCloseButton?: boolean
  persistent?: boolean
}

/**
 * Modal state
 */
export interface ModalState {
  isOpen: boolean
  config: ModalConfig
  data?: Record<string, unknown>
}

/**
 * Tab item for multi-view modules
 */
export interface TabItem {
  id: string
  label: string
  icon?: Component | string
  badge?: string | number
  disabled?: boolean
  closeable?: boolean
}

/**
 * Tab state
 */
export interface TabState {
  activeTabId: string
  tabs: TabItem[]
}

/**
 * Layout breakpoints
 */
export enum Breakpoint {
  MOBILE = 'mobile', // 320px - 767px
  TABLET = 'tablet', // 768px - 1023px
  DESKTOP = 'desktop', // 1024px+
}

/**
 * Responsive breakpoint values
 */
export interface BreakpointValues {
  mobile: number
  tablet: number
  desktop: number
}

/**
 * User profile quick actions
 */
export interface ProfileAction {
  id: string
  label: string
  icon: Component | string
  action: () => void | Promise<void>
  divider?: boolean
}

/**
 * Notification item
 */
export interface NotificationItem {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  timestamp: string
  read: boolean
  action?: () => void
}

/**
 * Global action for top navigation bar
 */
export interface GlobalAction {
  id: string
  label: string
  icon: Component | string
  action: () => void | Promise<void>
  badge?: string | number
  tooltip?: string
}

/**
 * Layout theme configuration
 */
export interface LayoutTheme {
  sidebarBg: string
  sidebarText: string
  sidebarActiveText: string
  sidebarActiveBg: string
  topBarBg: string
  topBarText: string
  contentBg: string
  borderColor: string
  accentColor: string
}

/**
 * Default layout configuration
 */
export const DEFAULT_LAYOUT_CONFIG: LayoutConfig = {
  showSidebar: true,
  showTopBar: true,
  showBreadcrumbs: true,
  showFooter: false,
  sidebarWidth: 256,
  sidebarCollapsedWidth: 80,
  maxContentWidth: 1440,
}

/**
 * Default breakpoint values (in pixels)
 */
export const DEFAULT_BREAKPOINTS: BreakpointValues = {
  mobile: 767,
  tablet: 1023,
  desktop: 1024,
}
