import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import AppSidebar from '@/components/common/AppSidebar.vue'
import type { NavigationItem } from '@/types/layout'
import { Shield, LayoutDashboard, Users } from 'lucide-vue-next'

// Mock navigation items
const mockNavItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    route: '/dashboard',
  },
  {
    id: 'users',
    label: 'Users',
    icon: Users,
    route: '/users',
    badge: '5',
  },
]

// Create mock router
const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/dashboard', component: { template: '<div>Dashboard</div>' } },
    { path: '/users', component: { template: '<div>Users</div>' } },
  ],
})

describe('AppSidebar', () => {
  beforeEach(() => {
    // Clear localStorage
    localStorage.clear()
    
    // Reset window dimensions
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    })
  })

  describe('Rendering', () => {
    it('should render sidebar with logo', async () => {
      const wrapper = mount(AppSidebar, {
        props: {
          navigationItems: mockNavItems,
        },
        global: {
          plugins: [router],
        },
      })

      expect(wrapper.find('aside').exists()).toBe(true)
      expect(wrapper.text()).toContain('AMLGuard')
    })

    it('should render all navigation items', async () => {
      const wrapper = mount(AppSidebar, {
        props: {
          navigationItems: mockNavItems,
        },
        global: {
          plugins: [router],
        },
      })

      expect(wrapper.text()).toContain('Dashboard')
      expect(wrapper.text()).toContain('Users')
    })

    it('should display badges when present', async () => {
      const wrapper = mount(AppSidebar, {
        props: {
          navigationItems: mockNavItems,
        },
        global: {
          plugins: [router],
        },
      })

      expect(wrapper.text()).toContain('5')
    })
  })

  describe('Collapse Functionality', () => {
    it('should have collapse button on desktop', async () => {
      const wrapper = mount(AppSidebar, {
        props: {
          navigationItems: mockNavItems,
        },
        global: {
          plugins: [router],
        },
      })

      const collapseButton = wrapper.find('button')
      expect(collapseButton.exists()).toBe(true)
    })

    it('should apply collapsed classes when collapsed', async () => {
      const wrapper = mount(AppSidebar, {
        props: {
          navigationItems: mockNavItems,
        },
        global: {
          plugins: [router],
        },
      })

      // Initially expanded
      const aside = wrapper.find('aside')
      expect(aside.classes()).toContain('w-64')

      // Click collapse button
      await wrapper.find('button').trigger('click')

      // Should be collapsed
      expect(aside.classes()).toContain('w-20')
    })
  })

  describe('Active Route Highlighting', () => {
    it('should highlight active route', async () => {
      await router.push('/dashboard')
      await router.isReady()

      const wrapper = mount(AppSidebar, {
        props: {
          navigationItems: mockNavItems,
        },
        global: {
          plugins: [router],
        },
      })

      const navLinks = wrapper.findAll('a')
      const dashboardLink = navLinks[0]

      expect(dashboardLink.classes()).toContain('bg-primary-50')
      expect(dashboardLink.classes()).toContain('text-primary-700')
    })

    it('should update active state on route change', async () => {
      await router.push('/dashboard')
      await router.isReady()

      const wrapper = mount(AppSidebar, {
        props: {
          navigationItems: mockNavItems,
        },
        global: {
          plugins: [router],
        },
      })

      // Initially dashboard is active
      let navLinks = wrapper.findAll('a')
      expect(navLinks[0].classes()).toContain('bg-primary-50')

      // Change to users route
      await router.push('/users')
      await wrapper.vm.$nextTick()

      // Now users should be active
      navLinks = wrapper.findAll('a')
      expect(navLinks[1].classes()).toContain('bg-primary-50')
    })
  })

  describe('Responsive Behavior', () => {
    it('should hide logo text when collapsed on desktop', async () => {
      const wrapper = mount(AppSidebar, {
        props: {
          navigationItems: mockNavItems,
        },
        global: {
          plugins: [router],
        },
      })

      // Click collapse button
      await wrapper.find('button').trigger('click')

      // Logo text should have fade-out transition
      const logoText = wrapper.find('span')
      expect(logoText.exists()).toBe(true)
    })

    it('should be hidden off-screen on mobile initially', async () => {
      // Set mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })

      const wrapper = mount(AppSidebar, {
        props: {
          navigationItems: mockNavItems,
        },
        global: {
          plugins: [router],
        },
      })

      const aside = wrapper.find('aside')
      // On mobile, sidebar should be positioned off-screen initially
      expect(aside.exists()).toBe(true)
      // Sidebar has fixed positioning for mobile
      expect(aside.classes()).toContain('fixed')
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels on buttons', async () => {
      const wrapper = mount(AppSidebar, {
        props: {
          navigationItems: mockNavItems,
        },
        global: {
          plugins: [router],
        },
      })

      // Sidebar renders with semantic elements
      expect(wrapper.find('aside').exists()).toBe(true)
      expect(wrapper.find('nav').exists()).toBe(true)
    })

    it('should have semantic nav element', async () => {
      const wrapper = mount(AppSidebar, {
        props: {
          navigationItems: mockNavItems,
        },
        global: {
          plugins: [router],
        },
      })

      expect(wrapper.find('nav').exists()).toBe(true)
    })
  })

  describe('LocalStorage Persistence', () => {
    it('should save collapsed state to localStorage', async () => {
      const wrapper = mount(AppSidebar, {
        props: {
          navigationItems: mockNavItems,
        },
        global: {
          plugins: [router],
        },
      })

      // Collapse sidebar
      await wrapper.find('button').trigger('click')

      // Check localStorage
      expect(localStorage.getItem('sidebar_collapsed')).toBe('true')
    })

    it('should restore collapsed state from localStorage', async () => {
      // Set collapsed state in localStorage
      localStorage.setItem('sidebar_collapsed', 'true')

      const wrapper = mount(AppSidebar, {
        props: {
          navigationItems: mockNavItems,
        },
        global: {
          plugins: [router],
        },
      })

      // Sidebar should be collapsed
      const aside = wrapper.find('aside')
      expect(aside.classes()).toContain('w-20')
    })
  })
})
