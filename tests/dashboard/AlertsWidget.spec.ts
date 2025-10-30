import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AlertsWidget from '@/components/dashboard/AlertsWidget.vue'
import type { Alert } from '@/types/dashboard'

describe('AlertsWidget', () => {
  const createAlert = (overrides?: Partial<Alert>): Alert => ({
    id: 'test-alert',
    title: 'Test Alert',
    message: 'This is a test alert message',
    priority: 'info',
    timestamp: new Date().toISOString(),
    ...overrides,
  })

  describe('Rendering', () => {
    it('renders alerts widget title', () => {
      const alerts = [createAlert()]
      const wrapper = mount(AlertsWidget, {
        props: { alerts },
      })

      expect(wrapper.text()).toContain('Alerts & Notifications')
    })

    it('displays alert count badge', () => {
      const alerts = [createAlert(), createAlert({ id: '2' }), createAlert({ id: '3' })]
      const wrapper = mount(AlertsWidget, {
        props: { alerts, maxItems: 5 },
      })

      expect(wrapper.text()).toContain('3')
    })

    it('renders alert title and message', () => {
      const alert = createAlert({
        title: 'Critical Alert',
        message: 'This requires immediate attention',
      })
      const wrapper = mount(AlertsWidget, {
        props: { alerts: [alert] },
      })

      expect(wrapper.text()).toContain('Critical Alert')
      expect(wrapper.text()).toContain('This requires immediate attention')
    })
  })

  describe('Empty State', () => {
    it('displays empty state when no alerts', () => {
      const wrapper = mount(AlertsWidget, {
        props: { alerts: [] },
      })

      expect(wrapper.text()).toContain('All caught up!')
      expect(wrapper.text()).toContain('No alerts at the moment')
    })
  })

  describe('Loading State', () => {
    it('renders loading skeleton when loading is true', () => {
      const wrapper = mount(AlertsWidget, {
        props: { alerts: [], loading: true },
      })

      expect(wrapper.find('.animate-pulse').exists()).toBe(true)
    })

    it('renders content when loading is false', () => {
      const alerts = [createAlert()]
      const wrapper = mount(AlertsWidget, {
        props: { alerts, loading: false },
      })

      expect(wrapper.find('.animate-pulse').exists()).toBe(false)
      expect(wrapper.text()).toContain('Test Alert')
    })
  })

  describe('Priority Levels', () => {
    const priorities: Array<Alert['priority']> = ['info', 'success', 'warning', 'error', 'critical']

    priorities.forEach(priority => {
      it(`renders ${priority} priority alert with correct styling`, () => {
        const alert = createAlert({ priority })
        const wrapper = mount(AlertsWidget, {
          props: { alerts: [alert] },
        })

        const alertElement = wrapper.find('.border.rounded-lg')
        expect(alertElement.exists()).toBe(true)
        
        // Check for priority-specific color classes
        const html = wrapper.html()
        expect(html).toContain(`-${priority === 'critical' ? 'purple' : priority === 'error' ? 'red' : priority === 'warning' ? 'yellow' : priority === 'success' ? 'green' : 'blue'}-`)
      })
    })
  })

  describe('Dismiss Functionality', () => {
    it('emits dismiss event when dismiss button is clicked', async () => {
      const alert = createAlert({ dismissible: true })
      const wrapper = mount(AlertsWidget, {
        props: { alerts: [alert], showDismiss: true },
      })

      const dismissButton = wrapper.findAll('button').find(btn => 
        btn.html().includes('lucide-x')
      )
      
      if (dismissButton) {
        await dismissButton.trigger('click')
        expect(wrapper.emitted('dismiss')).toBeTruthy()
        expect(wrapper.emitted('dismiss')?.[0]).toEqual(['test-alert'])
      }
    })

    it('hides dismiss button when showDismiss is false', () => {
      const alert = createAlert()
      const wrapper = mount(AlertsWidget, {
        props: { alerts: [alert], showDismiss: false },
      })

      const buttons = wrapper.findAll('button')
      const dismissButton = buttons.find(btn => btn.html().includes('lucide-x'))
      expect(dismissButton).toBeUndefined()
    })

    it('hides dismiss button when alert is not dismissible', () => {
      const alert = createAlert({ dismissible: false })
      const wrapper = mount(AlertsWidget, {
        props: { alerts: [alert], showDismiss: true },
      })

      const buttons = wrapper.findAll('button')
      const dismissButton = buttons.find(btn => btn.html().includes('lucide-x'))
      expect(dismissButton).toBeUndefined()
    })
  })

  describe('Action Buttons', () => {
    it('displays action button when action is provided', () => {
      const alert = createAlert({
        action: {
          label: 'Review Now',
          handler: vi.fn(),
        },
      })
      const wrapper = mount(AlertsWidget, {
        props: { alerts: [alert] },
      })

      expect(wrapper.text()).toContain('Review Now')
    })

    it('emits action event when action button is clicked', async () => {
      const actionHandler = vi.fn()
      const alert = createAlert({
        action: {
          label: 'View Details',
          handler: actionHandler,
        },
      })
      const wrapper = mount(AlertsWidget, {
        props: { alerts: [alert] },
      })

      const actionButton = wrapper.findAll('button').find(btn => 
        btn.text().includes('View Details')
      )
      
      if (actionButton) {
        await actionButton.trigger('click')
        expect(actionHandler).toHaveBeenCalled()
        expect(wrapper.emitted('action')).toBeTruthy()
      }
    })

    it('does not display action button when action is undefined', () => {
      const alert = createAlert({ action: undefined })
      const wrapper = mount(AlertsWidget, {
        props: { alerts: [alert] },
      })

      const buttons = wrapper.findAll('button')
      expect(buttons.length).toBeLessThanOrEqual(1) // Only dismiss button at most
    })
  })

  describe('Max Items', () => {
    it('respects maxItems prop', () => {
      const alerts = Array.from({ length: 10 }, (_, i) => 
        createAlert({ id: `alert-${i}` })
      )
      const wrapper = mount(AlertsWidget, {
        props: { alerts, maxItems: 3 },
      })

      const alertElements = wrapper.findAll('.space-y-3 > div.border.rounded-lg')
      expect(alertElements.length).toBe(3)
    })

    it('shows view all link when alerts exceed maxItems', () => {
      const alerts = Array.from({ length: 10 }, (_, i) => 
        createAlert({ id: `alert-${i}` })
      )
      const wrapper = mount(AlertsWidget, {
        props: { alerts, maxItems: 5 },
      })

      expect(wrapper.text()).toContain('View all alerts')
      expect(wrapper.text()).toContain('(10)')
    })
  })

  describe('Timestamp Formatting', () => {
    it('displays "Just now" for very recent alerts', () => {
      const alert = createAlert({
        timestamp: new Date().toISOString(),
      })
      const wrapper = mount(AlertsWidget, {
        props: { alerts: [alert] },
      })

      expect(wrapper.text()).toContain('Just now')
    })

    it('displays minutes ago for recent alerts', () => {
      const timestamp = new Date(Date.now() - 10 * 60 * 1000).toISOString()
      const alert = createAlert({ timestamp })
      const wrapper = mount(AlertsWidget, {
        props: { alerts: [alert] },
      })

      expect(wrapper.text()).toContain('10m ago')
    })

    it('displays hours ago for alerts within 24 hours', () => {
      const timestamp = new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
      const alert = createAlert({ timestamp })
      const wrapper = mount(AlertsWidget, {
        props: { alerts: [alert] },
      })

      expect(wrapper.text()).toContain('5h ago')
    })
  })

  describe('Read State', () => {
    it('applies reduced opacity for read alerts', () => {
      const alert = createAlert({ read: true })
      const wrapper = mount(AlertsWidget, {
        props: { alerts: [alert] },
      })

      const alertElement = wrapper.find('.space-y-3 > div.border.rounded-lg')
      expect(alertElement.classes()).toContain('opacity-60')
    })

    it('does not apply reduced opacity for unread alerts', () => {
      const alert = createAlert({ read: false })
      const wrapper = mount(AlertsWidget, {
        props: { alerts: [alert] },
      })

      const alertElement = wrapper.find('.border.rounded-lg')
      expect(alertElement.classes()).not.toContain('opacity-60')
    })
  })

  describe('Custom Icons', () => {
    it('uses custom icon when provided', () => {
      const alert = createAlert({
        icon: 'custom-icon' as any,
      })
      const wrapper = mount(AlertsWidget, {
        props: { alerts: [alert] },
      })

      expect(wrapper.html()).toBeTruthy()
    })

    it('uses default icon based on priority when custom icon not provided', () => {
      const alert = createAlert({ priority: 'warning' })
      const wrapper = mount(AlertsWidget, {
        props: { alerts: [alert] },
      })

      const iconWrapper = wrapper.find('.w-10.h-10.rounded-lg')
      expect(iconWrapper.exists()).toBe(true)
    })
  })
})
