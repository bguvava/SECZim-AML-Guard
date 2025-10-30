import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { useSidebar } from '@/composables/useSidebar'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { createRouter, createMemoryHistory } from 'vue-router'

describe('useSidebar', () => {
  let router: ReturnType<typeof createRouter>

  beforeEach(() => {
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', component: { template: '<div>Home</div>' } },
        { path: '/about', component: { template: '<div>About</div>' } },
      ],
    })
    localStorage.clear()
  })

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const TestComponent = defineComponent({
        setup() {
          const sidebar = useSidebar()
          return { sidebar }
        },
        template: '<div></div>',
      })

      const wrapper = mount(TestComponent, {
        global: {
          plugins: [router],
        },
      })

      const { sidebar } = wrapper.vm as { sidebar: ReturnType<typeof useSidebar> }

      expect(sidebar.isCollapsed.value).toBe(false)
      expect(sidebar.isMobileOpen.value).toBe(false)
      expect(sidebar.activeItemId.value).toBeNull()
    })
  })

  describe('Collapse Functionality', () => {
    it('should toggle collapse state', () => {
      const TestComponent = defineComponent({
        setup() {
          const sidebar = useSidebar()
          return { sidebar }
        },
        template: '<div></div>',
      })

      const wrapper = mount(TestComponent, {
        global: {
          plugins: [router],
        },
      })

      const { sidebar } = wrapper.vm as { sidebar: ReturnType<typeof useSidebar> }

      expect(sidebar.isCollapsed.value).toBe(false)

      sidebar.toggleCollapse()
      expect(sidebar.isCollapsed.value).toBe(true)

      sidebar.toggleCollapse()
      expect(sidebar.isCollapsed.value).toBe(false)
    })

    it('should save collapse state to localStorage', () => {
      const TestComponent = defineComponent({
        setup() {
          const sidebar = useSidebar()
          return { sidebar }
        },
        template: '<div></div>',
      })

      const wrapper = mount(TestComponent, {
        global: {
          plugins: [router],
        },
      })

      const { sidebar } = wrapper.vm as { sidebar: ReturnType<typeof useSidebar> }

      sidebar.toggleCollapse()

      expect(localStorage.getItem('sidebar_collapsed')).toBe('true')
    })

    it('should collapse sidebar', () => {
      const TestComponent = defineComponent({
        setup() {
          const sidebar = useSidebar()
          return { sidebar }
        },
        template: '<div></div>',
      })

      const wrapper = mount(TestComponent, {
        global: {
          plugins: [router],
        },
      })

      const { sidebar } = wrapper.vm as { sidebar: ReturnType<typeof useSidebar> }

      sidebar.collapse()
      expect(sidebar.isCollapsed.value).toBe(true)
      expect(localStorage.getItem('sidebar_collapsed')).toBe('true')
    })

    it('should expand sidebar', () => {
      const TestComponent = defineComponent({
        setup() {
          const sidebar = useSidebar()
          return { sidebar }
        },
        template: '<div></div>',
      })

      const wrapper = mount(TestComponent, {
        global: {
          plugins: [router],
        },
      })

      const { sidebar } = wrapper.vm as { sidebar: ReturnType<typeof useSidebar> }

      sidebar.collapse()
      expect(sidebar.isCollapsed.value).toBe(true)

      sidebar.expand()
      expect(sidebar.isCollapsed.value).toBe(false)
      expect(localStorage.getItem('sidebar_collapsed')).toBe('false')
    })
  })

  describe('Mobile Sidebar', () => {
    it('should toggle mobile sidebar', () => {
      const TestComponent = defineComponent({
        setup() {
          const sidebar = useSidebar()
          return { sidebar }
        },
        template: '<div></div>',
      })

      const wrapper = mount(TestComponent, {
        global: {
          plugins: [router],
        },
      })

      const { sidebar } = wrapper.vm as { sidebar: ReturnType<typeof useSidebar> }

      expect(sidebar.isMobileOpen.value).toBe(false)

      sidebar.toggleMobile()
      expect(sidebar.isMobileOpen.value).toBe(true)

      sidebar.toggleMobile()
      expect(sidebar.isMobileOpen.value).toBe(false)
    })

    it('should open mobile sidebar', () => {
      const TestComponent = defineComponent({
        setup() {
          const sidebar = useSidebar()
          return { sidebar }
        },
        template: '<div></div>',
      })

      const wrapper = mount(TestComponent, {
        global: {
          plugins: [router],
        },
      })

      const { sidebar } = wrapper.vm as { sidebar: ReturnType<typeof useSidebar> }

      sidebar.openMobile()
      expect(sidebar.isMobileOpen.value).toBe(true)
    })

    it('should close mobile sidebar', () => {
      const TestComponent = defineComponent({
        setup() {
          const sidebar = useSidebar()
          return { sidebar }
        },
        template: '<div></div>',
      })

      const wrapper = mount(TestComponent, {
        global: {
          plugins: [router],
        },
      })

      const { sidebar } = wrapper.vm as { sidebar: ReturnType<typeof useSidebar> }

      sidebar.openMobile()
      expect(sidebar.isMobileOpen.value).toBe(true)

      sidebar.closeMobile()
      expect(sidebar.isMobileOpen.value).toBe(false)
    })

    it('should close mobile sidebar on route change', async () => {
      const TestComponent = defineComponent({
        setup() {
          const sidebar = useSidebar()
          return { sidebar }
        },
        template: '<div></div>',
      })

      const wrapper = mount(TestComponent, {
        global: {
          plugins: [router],
        },
      })

      const { sidebar } = wrapper.vm as { sidebar: ReturnType<typeof useSidebar> }

      // Open mobile sidebar
      sidebar.openMobile()
      expect(sidebar.isMobileOpen.value).toBe(true)

      // Navigate to different route
      await router.push('/about')
      await flushPromises()

      // Mobile sidebar should close
      expect(sidebar.isMobileOpen.value).toBe(false)
    })
  })

  describe('Active Item', () => {
    it('should set active item', () => {
      const TestComponent = defineComponent({
        setup() {
          const sidebar = useSidebar()
          return { sidebar }
        },
        template: '<div></div>',
      })

      const wrapper = mount(TestComponent, {
        global: {
          plugins: [router],
        },
      })

      const { sidebar } = wrapper.vm as { sidebar: ReturnType<typeof useSidebar> }

      sidebar.setActiveItem('dashboard')
      expect(sidebar.activeItemId.value).toBe('dashboard')

      sidebar.setActiveItem('users')
      expect(sidebar.activeItemId.value).toBe('users')
    })

    it('should allow null active item', () => {
      const TestComponent = defineComponent({
        setup() {
          const sidebar = useSidebar()
          return { sidebar }
        },
        template: '<div></div>',
      })

      const wrapper = mount(TestComponent, {
        global: {
          plugins: [router],
        },
      })

      const { sidebar } = wrapper.vm as { sidebar: ReturnType<typeof useSidebar> }

      sidebar.setActiveItem('dashboard')
      expect(sidebar.activeItemId.value).toBe('dashboard')

      sidebar.setActiveItem(null)
      expect(sidebar.activeItemId.value).toBeNull()
    })
  })

  describe('State Persistence', () => {
    it('should restore collapsed state from localStorage', () => {
      localStorage.setItem('sidebar_collapsed', 'true')

      const TestComponent = defineComponent({
        setup() {
          const sidebar = useSidebar()
          return { sidebar }
        },
        template: '<div></div>',
      })

      const wrapper = mount(TestComponent, {
        global: {
          plugins: [router],
        },
      })

      const { sidebar } = wrapper.vm as { sidebar: ReturnType<typeof useSidebar> }

      sidebar.restoreState()
      expect(sidebar.isCollapsed.value).toBe(true)
    })

    it('should restore expanded state from localStorage', () => {
      localStorage.setItem('sidebar_collapsed', 'false')

      const TestComponent = defineComponent({
        setup() {
          const sidebar = useSidebar()
          return { sidebar }
        },
        template: '<div></div>',
      })

      const wrapper = mount(TestComponent, {
        global: {
          plugins: [router],
        },
      })

      const { sidebar } = wrapper.vm as { sidebar: ReturnType<typeof useSidebar> }

      sidebar.restoreState()
      expect(sidebar.isCollapsed.value).toBe(false)
    })

    it('should handle missing localStorage value', () => {
      const TestComponent = defineComponent({
        setup() {
          const sidebar = useSidebar()
          return { sidebar }
        },
        template: '<div></div>',
      })

      const wrapper = mount(TestComponent, {
        global: {
          plugins: [router],
        },
      })

      const { sidebar } = wrapper.vm as { sidebar: ReturnType<typeof useSidebar> }

      sidebar.restoreState()
      // Should maintain default state
      expect(sidebar.isCollapsed.value).toBe(false)
    })
  })

  describe('Computed Properties', () => {
    it('should have isCollapsed computed property', () => {
      const TestComponent = defineComponent({
        setup() {
          const sidebar = useSidebar()
          return { sidebar }
        },
        template: '<div></div>',
      })

      const wrapper = mount(TestComponent, {
        global: {
          plugins: [router],
        },
      })

      const { sidebar } = wrapper.vm as { sidebar: ReturnType<typeof useSidebar> }

      expect(sidebar.isCollapsed.value).toBe(false)
      
      sidebar.collapse()
      expect(sidebar.isCollapsed.value).toBe(true)
    })

    it('should have isMobileOpen computed property', () => {
      const TestComponent = defineComponent({
        setup() {
          const sidebar = useSidebar()
          return { sidebar }
        },
        template: '<div></div>',
      })

      const wrapper = mount(TestComponent, {
        global: {
          plugins: [router],
        },
      })

      const { sidebar } = wrapper.vm as { sidebar: ReturnType<typeof useSidebar> }

      expect(sidebar.isMobileOpen.value).toBe(false)
      
      sidebar.openMobile()
      expect(sidebar.isMobileOpen.value).toBe(true)
    })

    it('should have activeItemId computed property', () => {
      const TestComponent = defineComponent({
        setup() {
          const sidebar = useSidebar()
          return { sidebar }
        },
        template: '<div></div>',
      })

      const wrapper = mount(TestComponent, {
        global: {
          plugins: [router],
        },
      })

      const { sidebar } = wrapper.vm as { sidebar: ReturnType<typeof useSidebar> }

      expect(sidebar.activeItemId.value).toBeNull()
      
      sidebar.setActiveItem('test-id')
      expect(sidebar.activeItemId.value).toBe('test-id')
    })
  })
})
