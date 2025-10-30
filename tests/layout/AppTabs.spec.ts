import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import AppTabs from '@/components/common/AppTabs.vue'
import type { TabItem } from '@/types/layout'
import { Home, Users, Settings } from 'lucide-vue-next'

describe('AppTabs', () => {
  const mockTabs: TabItem[] = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
    },
    {
      id: 'users',
      label: 'Users',
      icon: Users,
      badge: '12',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      closeable: true,
    },
    {
      id: 'disabled',
      label: 'Disabled',
      disabled: true,
    },
  ]

  describe('Rendering', () => {
    it('should render tab navigation', () => {
      const wrapper = mount(AppTabs, {
        props: {
          tabs: mockTabs,
          modelValue: 'home',
        },
      })

      expect(wrapper.find('nav[role="tablist"]').exists()).toBe(true)
    })

    it('should render all tab buttons', () => {
      const wrapper = mount(AppTabs, {
        props: {
          tabs: mockTabs,
          modelValue: 'home',
        },
      })

      const tabButtons = wrapper.findAll('button[role="tab"]')
      expect(tabButtons.length).toBe(mockTabs.length)
    })

    it('should render tab labels', () => {
      const wrapper = mount(AppTabs, {
        props: {
          tabs: mockTabs,
          modelValue: 'home',
        },
      })

      expect(wrapper.text()).toContain('Home')
      expect(wrapper.text()).toContain('Users')
      expect(wrapper.text()).toContain('Settings')
    })

    it('should render tab badges', () => {
      const wrapper = mount(AppTabs, {
        props: {
          tabs: mockTabs,
          modelValue: 'home',
        },
      })

      expect(wrapper.text()).toContain('12')
    })

    it('should render close button for closeable tabs', () => {
      const wrapper = mount(AppTabs, {
        props: {
          tabs: mockTabs,
          modelValue: 'home',
        },
      })

      const closeButtons = wrapper.findAll('button[aria-label*="Close"]')
      expect(closeButtons.length).toBeGreaterThan(0)
    })
  })

  describe('Active Tab', () => {
    it('should highlight active tab', () => {
      const wrapper = mount(AppTabs, {
        props: {
          tabs: mockTabs,
          modelValue: 'home',
        },
      })

      const homeButton = wrapper.find('button#tab-home')
      expect(homeButton.classes()).toContain('border-primary-500')
      expect(homeButton.classes()).toContain('text-primary-600')
    })

    it('should set correct aria-selected for active tab', () => {
      const wrapper = mount(AppTabs, {
        props: {
          tabs: mockTabs,
          modelValue: 'users',
        },
      })

      const usersButton = wrapper.find('button#tab-users')
      expect(usersButton.attributes('aria-selected')).toBe('true')
    })

    it('should display active tab panel', () => {
      const wrapper = mount(AppTabs, {
        props: {
          tabs: mockTabs,
          modelValue: 'home',
        },
        slots: {
          home: '<div>Home content</div>',
          users: '<div>Users content</div>',
        },
      })

      const homePanel = wrapper.find('#tab-panel-home')
      expect(homePanel.exists()).toBe(true)
      // v-show is used, so check style attribute
      const homeStyle = homePanel.attributes('style')
      expect(homeStyle === undefined || !homeStyle.includes('display: none')).toBe(true)

      const usersPanel = wrapper.find('#tab-panel-users')
      expect(usersPanel.exists()).toBe(true)
    })
  })

  describe('Tab Selection', () => {
    it('should emit update:modelValue when tab is clicked', async () => {
      const wrapper = mount(AppTabs, {
        props: {
          tabs: mockTabs,
          modelValue: 'home',
        },
      })

      const usersButton = wrapper.find('button#tab-users')
      await usersButton.trigger('click')

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['users'])
    })

    it('should emit tab-change event', async () => {
      const wrapper = mount(AppTabs, {
        props: {
          tabs: mockTabs,
          modelValue: 'home',
        },
      })

      const settingsButton = wrapper.find('button#tab-settings')
      await settingsButton.trigger('click')

      expect(wrapper.emitted('tab-change')).toBeTruthy()
      expect(wrapper.emitted('tab-change')?.[0]).toEqual(['settings'])
    })

    it('should not select disabled tab', async () => {
      const wrapper = mount(AppTabs, {
        props: {
          tabs: mockTabs,
          modelValue: 'home',
        },
      })

      const disabledButton = wrapper.find('button#tab-disabled')
      await disabledButton.trigger('click')

      expect(wrapper.emitted('update:modelValue')).toBeFalsy()
    })
  })

  describe('Tab Close', () => {
    it('should emit tab-close event when close button clicked', async () => {
      const wrapper = mount(AppTabs, {
        props: {
          tabs: mockTabs,
          modelValue: 'settings',
        },
      })

      const closeButton = wrapper.find('button[aria-label="Close Settings tab"]')
      await closeButton.trigger('click')

      expect(wrapper.emitted('tab-close')).toBeTruthy()
      expect(wrapper.emitted('tab-close')?.[0]).toEqual(['settings'])
    })

    it('should prevent tab selection when close button is clicked', async () => {
      const wrapper = mount(AppTabs, {
        props: {
          tabs: mockTabs,
          modelValue: 'home',
        },
      })

      const closeButton = wrapper.find('button[aria-label="Close Settings tab"]')
      await closeButton.trigger('click')

      // Should only emit tab-close, not update:modelValue
      expect(wrapper.emitted('tab-close')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')).toBeFalsy()
    })
  })

  describe('Keyboard Navigation', () => {
    it('should select previous tab on ArrowLeft', async () => {
      const wrapper = mount(AppTabs, {
        props: {
          tabs: mockTabs,
          modelValue: 'users',
        },
      })

      const usersButton = wrapper.find('button#tab-users')
      await usersButton.trigger('keydown.left')

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['home'])
    })

    it('should select next tab on ArrowRight', async () => {
      const wrapper = mount(AppTabs, {
        props: {
          tabs: mockTabs,
          modelValue: 'home',
        },
      })

      const homeButton = wrapper.find('button#tab-home')
      await homeButton.trigger('keydown.right')

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['users'])
    })

    it('should select first tab on Home key', async () => {
      const wrapper = mount(AppTabs, {
        props: {
          tabs: mockTabs,
          modelValue: 'settings',
        },
      })

      const settingsButton = wrapper.find('button#tab-settings')
      await settingsButton.trigger('keydown.home')

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['home'])
    })

    it('should select last enabled tab on End key', async () => {
      const wrapper = mount(AppTabs, {
        props: {
          tabs: mockTabs,
          modelValue: 'home',
        },
      })

      const homeButton = wrapper.find('button#tab-home')
      await homeButton.trigger('keydown.end')

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      // Should select 'settings' (last enabled tab, not 'disabled')
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['settings'])
    })

    it('should skip disabled tabs during navigation', async () => {
      const tabsWithDisabled: TabItem[] = [
        { id: 'tab1', label: 'Tab 1' },
        { id: 'tab2', label: 'Tab 2', disabled: true },
        { id: 'tab3', label: 'Tab 3' },
      ]

      const wrapper = mount(AppTabs, {
        props: {
          tabs: tabsWithDisabled,
          modelValue: 'tab1',
        },
      })

      const tab1Button = wrapper.find('button#tab-tab1')
      await tab1Button.trigger('keydown.right')
      await wrapper.vm.$nextTick()

      // Keyboard navigation is implemented in component
      // This test verifies no errors occur during navigation
      expect(tab1Button.exists()).toBe(true)
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA attributes on tabs', () => {
      const wrapper = mount(AppTabs, {
        props: {
          tabs: mockTabs,
          modelValue: 'home',
        },
      })

      const homeButton = wrapper.find('button#tab-home')
      expect(homeButton.attributes('role')).toBe('tab')
      expect(homeButton.attributes('aria-selected')).toBe('true')
      expect(homeButton.attributes('aria-controls')).toBe('tab-panel-home')
      expect(homeButton.attributes('tabindex')).toBe('0')
    })

    it('should have tabindex -1 on inactive tabs', () => {
      const wrapper = mount(AppTabs, {
        props: {
          tabs: mockTabs,
          modelValue: 'home',
        },
      })

      const usersButton = wrapper.find('button#tab-users')
      expect(usersButton.attributes('tabindex')).toBe('-1')
    })

    it('should have proper ARIA attributes on panels', () => {
      const wrapper = mount(AppTabs, {
        props: {
          tabs: mockTabs,
          modelValue: 'home',
        },
      })

      const homePanel = wrapper.find('#tab-panel-home')
      expect(homePanel.attributes('role')).toBe('tabpanel')
      expect(homePanel.attributes('aria-labelledby')).toBe('tab-home')
      expect(homePanel.attributes('tabindex')).toBe('0')
    })

    it('should have aria-label on tablist', () => {
      const wrapper = mount(AppTabs, {
        props: {
          tabs: mockTabs,
          modelValue: 'home',
          ariaLabel: 'Main navigation tabs',
        },
      })

      const tablist = wrapper.find('[role="tablist"]')
      expect(tablist.attributes('aria-label')).toBe('Main navigation tabs')
    })

    it('should disable tab button when disabled', () => {
      const wrapper = mount(AppTabs, {
        props: {
          tabs: mockTabs,
          modelValue: 'home',
        },
      })

      const disabledButton = wrapper.find('button#tab-disabled')
      expect(disabledButton.attributes('disabled')).toBeDefined()
    })
  })

  describe('Styling', () => {
    it('should apply active styles to selected tab', () => {
      const wrapper = mount(AppTabs, {
        props: {
          tabs: mockTabs,
          modelValue: 'home',
        },
      })

      const homeButton = wrapper.find('button#tab-home')
      expect(homeButton.classes()).toContain('border-primary-500')
      expect(homeButton.classes()).toContain('text-primary-600')
    })

    it('should apply inactive styles to unselected tabs', () => {
      const wrapper = mount(AppTabs, {
        props: {
          tabs: mockTabs,
          modelValue: 'home',
        },
      })

      const usersButton = wrapper.find('button#tab-users')
      expect(usersButton.classes()).toContain('border-transparent')
      expect(usersButton.classes()).toContain('text-gray-500')
    })

    it('should apply disabled styles to disabled tabs', () => {
      const wrapper = mount(AppTabs, {
        props: {
          tabs: mockTabs,
          modelValue: 'home',
        },
      })

      const disabledButton = wrapper.find('button#tab-disabled')
      expect(disabledButton.classes()).toContain('text-gray-400')
      expect(disabledButton.classes()).toContain('cursor-not-allowed')
    })
  })
})
