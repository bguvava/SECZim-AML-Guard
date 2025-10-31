import { defineStore } from 'pinia'
import {
  LayoutDashboard,
  Building2,
  Eye,
  Search,
  FileCheck,
  AlertTriangle,
  Settings,
  Users,
  FileText,
  TrendingUp,
  ClipboardList,
} from 'lucide-vue-next'
import type { Component } from 'vue'

export interface MenuItem {
  id: string
  label: string
  icon: Component
  route?: string
  children?: MenuItem[]
  badge?: string | number
  badgeVariant?: 'danger' | 'warning' | 'info' | 'success'
}

export const useNavigationStore = defineStore('navigation', {
  state: () => ({
    menuItems: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: LayoutDashboard,
        children: [
          {
            id: 'analytics-dashboard',
            label: 'Analytics Dashboard',
            icon: TrendingUp,
            route: '/supervision/analytics',
          },
          {
            id: 'inspection-overview',
            label: 'Inspection Overview',
            icon: ClipboardList,
            route: '/supervision/inspection-overview',
          },
        ],
      },
      {
        id: 'institution-management',
        label: 'Institution Management',
        icon: Building2,
        children: [
          {
            id: 'institution-registry',
            label: 'Institution Registry',
            icon: Building2,
            route: '/supervision/institutions',
          },
          {
            id: 'risk-profiles',
            label: 'Risk Profiles',
            icon: AlertTriangle,
            route: '/supervision/risk-profiling',
          },
        ],
      },
      {
        id: 'monitoring-surveillance',
        label: 'Monitoring & Surveillance',
        icon: Eye,
        route: '/supervision/surveillance',
      },
      {
        id: 'inspection-reporting',
        label: 'Inspection & Reporting',
        icon: Search,
        children: [
          {
            id: 'inspections',
            label: 'Inspections',
            icon: Search,
            route: '/supervision/inspections',
            badge: 3,
            badgeVariant: 'warning',
          },
          {
            id: 'reporting',
            label: 'Reporting & Export',
            icon: FileCheck,
            route: '/supervision/reports',
          },
        ],
      },
      {
        id: 'settings-admin',
        label: 'Settings & Administration',
        icon: Settings,
        children: [
          {
            id: 'settings',
            label: 'Settings',
            icon: Settings,
            route: '/supervision/settings',
          },
          {
            id: 'user-management',
            label: 'User Management',
            icon: Users,
            route: '/supervision/users',
          },
          {
            id: 'audit-logs',
            label: 'Audit Logs',
            icon: FileText,
            route: '/supervision/audit-logs',
          },
        ],
      },
    ] as MenuItem[],
    expandedMenus: [] as string[],
  }),

  getters: {
    isMenuExpanded: (state) => (menuId: string) => state.expandedMenus.includes(menuId),
  },

  actions: {
    toggleMenu(menuId: string) {
      const index = this.expandedMenus.indexOf(menuId)
      if (index > -1) {
        this.expandedMenus.splice(index, 1)
      } else {
        this.expandedMenus.push(menuId)
      }
    },

    expandMenu(menuId: string) {
      if (!this.expandedMenus.includes(menuId)) {
        this.expandedMenus.push(menuId)
      }
    },

    collapseMenu(menuId: string) {
      const index = this.expandedMenus.indexOf(menuId)
      if (index > -1) {
        this.expandedMenus.splice(index, 1)
      }
    },

    collapseAllMenus() {
      this.expandedMenus = []
    },
  },
})
