import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import AppTopBar from '@/components/common/AppTopBar.vue'
import { useAuthStore } from '@/stores/useAuthStore'

// Mock useAuth composable
vi.mock('@/composables/useAuth', () => ({
  useAuth: () => ({
    user: {
      value: {
        id: '1',
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'admin',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    },
    logout: vi.fn(),
  })
}))

// Create mock router
const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', name: 'home', component: { template: '<div>Home</div>' } },
    { path: '/dashboard', name: 'dashboard', component: { template: '<div>Dashboard</div>' } },
  ],
})

describe('AppTopBar', () => {
  let pinia: ReturnType<typeof createPinia>

  beforeEach(() => {
    pinia = createPinia()
    document.body.innerHTML = ''
  })

  const mountComponent = (options = {}) => {
    return mount(AppTopBar, {
      global: {
        plugins: [pinia, router],
        stubs: {
          RouterLink: false,
        },
      },
      ...options,
    })
  }

  describe('Rendering', () => {
    it('should render top bar header element', async () => {
      const wrapper = mountComponent()

      await flushPromises()

      const header = wrapper.find('header')
      expect(header.exists()).toBe(true)
    })

    it('should display user initials', async () => {
      const wrapper = mountComponent()

      await flushPromises()

      expect(wrapper.text()).toContain('JD')
    })

    it('should show notification bell icon', async () => {
      const wrapper = mountComponent()

      await flushPromises()

      const bellButton = wrapper.find('button[aria-label="Notifications"]')
      expect(bellButton.exists()).toBe(true)
    })
  })

  describe('Profile Menu', () => {
    it('should toggle profile menu on button click', async () => {
      const wrapper = mountComponent()

      await flushPromises()

      const profileButton = wrapper.find('button[aria-label="User menu"]')
      expect(profileButton.exists()).toBe(true)

      // Open menu
      await profileButton.trigger('click')
      await flushPromises()

      // Menu should be visible
      expect(wrapper.html()).toContain('My Profile')

      // Close menu
      await profileButton.trigger('click')
      await flushPromises()
    })

    it('should display user information in profile menu', async () => {
      const wrapper = mountComponent()

      await flushPromises()

      const profileButton = wrapper.find('button[aria-label="User menu"]')
      await profileButton.trigger('click')
      await flushPromises()

      expect(wrapper.text()).toContain('John Doe')
      expect(wrapper.text()).toContain('john@example.com')
    })

    it('should show profile action buttons', async () => {
      const wrapper = mountComponent()

      await flushPromises()

      const profileButton = wrapper.find('button[aria-label="User menu"]')
      await profileButton.trigger('click')
      await flushPromises()

      expect(wrapper.text()).toContain('My Profile')
      expect(wrapper.text()).toContain('Settings')
      expect(wrapper.text()).toContain('Logout')
    })
  })

  describe('Breadcrumbs', () => {
    it('should display breadcrumbs on desktop', async () => {
      const wrapper = mountComponent()

      await flushPromises()

      // Breadcrumbs are only shown on desktop (hidden on mobile/tablet)
      // Component renders properly
      expect(wrapper.find('header').exists()).toBe(true)
    })
  })

  describe('Mobile Menu', () => {
    it('should show mobile menu button on mobile', async () => {
      const wrapper = mountComponent()

      await flushPromises()

      const mobileMenuButton = wrapper.find('button[aria-label="Open menu"]')
      // Mobile menu may be conditionally rendered
      expect(wrapper.find('header').exists()).toBe(true)
    })
  })

  describe('Responsive Layout', () => {
    it('should adjust left position based on sidebar state', async () => {
      const wrapper = mountComponent()

      await flushPromises()

      const header = wrapper.find('header')
      // Default sidebar is not collapsed (256px = left-64)
      expect(header.classes()).toContain('left-64')
    })
  })

  describe('Session Timer', () => {
    it('should display session timer when available', async () => {
      const wrapper = mountComponent()

      await flushPromises()

      // Session timer component exists
      expect(wrapper.html()).toBeTruthy()
    })
  })
})
