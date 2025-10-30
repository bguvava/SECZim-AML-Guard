import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useLayout } from '@/composables/useLayout'
import { useRouter } from 'vue-router'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'

// Mock vue-router
vi.mock('vue-router', () => ({
  useRoute: vi.fn(() => ({
    path: '/admin/dashboard',
    params: {},
    query: {},
  })),
  useRouter: vi.fn(),
}))

describe('useLayout', () => {
  beforeEach(() => {
    // Reset window size
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1200,
    })
  })

  describe('Initialization', () => {
    it('should initialize with default config', () => {
      const TestComponent = defineComponent({
        setup() {
          const layout = useLayout()
          return { layout }
        },
        template: '<div></div>',
      })

      const wrapper = mount(TestComponent)
      const { layout } = wrapper.vm as { layout: ReturnType<typeof useLayout> }

      expect(layout.config).toBeDefined()
      expect(layout.config.value.showSidebar).toBe(true)
      expect(layout.config.value.showTopBar).toBe(true)
      expect(layout.config.value.showBreadcrumbs).toBe(true)
    })

    it('should detect initial breakpoint', () => {
      const TestComponent = defineComponent({
        setup() {
          const layout = useLayout()
          return { layout }
        },
        template: '<div></div>',
      })

      const wrapper = mount(TestComponent)
      const { layout } = wrapper.vm as { layout: ReturnType<typeof useLayout> }

      expect(layout.currentBreakpoint.value).toBe('desktop')
    })
  })

  describe('Breakpoint Detection', () => {
    it('should detect mobile breakpoint', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 500,
      })

      const TestComponent = defineComponent({
        setup() {
          const layout = useLayout()
          return { layout }
        },
        template: '<div></div>',
      })

      const wrapper = mount(TestComponent)
      const { layout } = wrapper.vm as { layout: ReturnType<typeof useLayout> }

      expect(layout.isMobile.value).toBe(true)
      expect(layout.isTablet.value).toBe(false)
      expect(layout.isDesktop.value).toBe(false)
    })

    it('should detect tablet breakpoint', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 900,
      })

      const TestComponent = defineComponent({
        setup() {
          const layout = useLayout()
          return { layout }
        },
        template: '<div></div>',
      })

      const wrapper = mount(TestComponent)
      const { layout } = wrapper.vm as { layout: ReturnType<typeof useLayout> }

      expect(layout.isMobile.value).toBe(false)
      expect(layout.isTablet.value).toBe(true)
      expect(layout.isDesktop.value).toBe(false)
    })

    it('should detect desktop breakpoint', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1400,
      })

      const TestComponent = defineComponent({
        setup() {
          const layout = useLayout()
          return { layout }
        },
        template: '<div></div>',
      })

      const wrapper = mount(TestComponent)
      const { layout } = wrapper.vm as { layout: ReturnType<typeof useLayout> }

      expect(layout.isMobile.value).toBe(false)
      expect(layout.isTablet.value).toBe(false)
      expect(layout.isDesktop.value).toBe(true)
    })

    it('should compute isMobileOrTablet correctly', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 800,
      })

      const TestComponent = defineComponent({
        setup() {
          const layout = useLayout()
          return { layout }
        },
        template: '<div></div>',
      })

      const wrapper = mount(TestComponent)
      const { layout } = wrapper.vm as { layout: ReturnType<typeof useLayout> }

      expect(layout.isMobileOrTablet.value).toBe(true)
    })
  })

  describe('Configuration Updates', () => {
    it('should update config', () => {
      const TestComponent = defineComponent({
        setup() {
          const layout = useLayout()
          return { layout }
        },
        template: '<div></div>',
      })

      const wrapper = mount(TestComponent)
      const { layout } = wrapper.vm as { layout: ReturnType<typeof useLayout> }

      layout.updateConfig({ showFooter: true, maxContentWidth: 1200 })

      expect(layout.config.value.showFooter).toBe(true)
      expect(layout.config.value.maxContentWidth).toBe(1200)
      // Should preserve other config values
      expect(layout.config.value.showSidebar).toBe(true)
    })
  })

  describe('Breadcrumbs', () => {
    it('should set breadcrumbs', () => {
      const TestComponent = defineComponent({
        setup() {
          const layout = useLayout()
          return { layout }
        },
        template: '<div></div>',
      })

      const wrapper = mount(TestComponent)
      const { layout } = wrapper.vm as { layout: ReturnType<typeof useLayout> }

      const breadcrumbs = [
        { label: 'Home', route: '/' },
        { label: 'Dashboard', route: '/dashboard' },
      ]

      layout.setBreadcrumbs(breadcrumbs)

      expect(layout.breadcrumbs.value).toEqual(breadcrumbs)
    })

    it('should generate breadcrumbs from route', () => {
      const TestComponent = defineComponent({
        setup() {
          const layout = useLayout()
          return { layout }
        },
        template: '<div></div>',
      })

      const wrapper = mount(TestComponent)
      const { layout } = wrapper.vm as { layout: ReturnType<typeof useLayout> }

      const generated = layout.generateBreadcrumbs()

      expect(generated).toBeDefined()
      expect(Array.isArray(generated)).toBe(true)
    })

    it('should capitalize breadcrumb labels', () => {
      vi.mocked(useRouter).mockReturnValue({
        currentRoute: {
          value: {
            path: '/admin/user-management',
          },
        },
      } as any)

      const TestComponent = defineComponent({
        setup() {
          const layout = useLayout()
          return { layout }
        },
        template: '<div></div>',
      })

      const wrapper = mount(TestComponent)
      const { layout } = wrapper.vm as { layout: ReturnType<typeof useLayout> }

      const generated = layout.generateBreadcrumbs()

      expect(generated.some((b) => b.label === 'Admin')).toBe(true)
    })
  })

  describe('Responsive Computed Properties', () => {
    it('should have correct isMobile computed', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 400,
      })

      const TestComponent = defineComponent({
        setup() {
          const layout = useLayout()
          return { layout }
        },
        template: '<div></div>',
      })

      const wrapper = mount(TestComponent)
      const { layout } = wrapper.vm as { layout: ReturnType<typeof useLayout> }

      expect(layout.isMobile.value).toBe(true)
    })

    it('should have correct isDesktop computed', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1500,
      })

      const TestComponent = defineComponent({
        setup() {
          const layout = useLayout()
          return { layout }
        },
        template: '<div></div>',
      })

      const wrapper = mount(TestComponent)
      const { layout } = wrapper.vm as { layout: ReturnType<typeof useLayout> }

      expect(layout.isDesktop.value).toBe(true)
    })
  })
})
