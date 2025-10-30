import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import EntityDashboard from '@/views/entity/Dashboard.vue'
import StatCard from '@/components/dashboard/StatCard.vue'
import ActivityFeed from '@/components/dashboard/ActivityFeed.vue'
import QuickActions from '@/components/dashboard/QuickActions.vue'
import AlertsWidget from '@/components/dashboard/AlertsWidget.vue'
import ChartCard from '@/components/dashboard/ChartCard.vue'

describe('EntityDashboard', () => {
  let router: ReturnType<typeof createRouter>

  beforeEach(() => {
    setActivePinia(createPinia())
    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', name: 'home', component: { template: '<div>Home</div>' } },
        { path: '/entity/dashboard', name: 'entity-dashboard', component: { template: '<div>Dashboard</div>' } },
      ],
    })
  })

  const mountComponent = (options = {}) => {
    return mount(EntityDashboard, {
      global: {
        plugins: [createPinia(), router],
        stubs: {
          EntityLayout: {
            template: '<div><slot /></div>',
          },
        },
      },
      ...options,
    })
  }

  describe('Initial Rendering', () => {
    it('renders the dashboard container', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.min-h-screen').exists()).toBe(true)
    })

    it('displays the dashboard title', () => {
      const wrapper = mountComponent()
      expect(wrapper.text()).toContain('Dashboard')
    })

    it('shows greeting message', () => {
      const wrapper = mountComponent()
      const text = wrapper.text()
      expect(
        text.includes('Good morning') || 
        text.includes('Good afternoon') || 
        text.includes('Good evening')
      ).toBe(true)
    })

    it('displays current date and time', () => {
      const wrapper = mountComponent()
      expect(wrapper.text()).toMatch(/\w+ \d{1,2}, \d{4}/)
    })

    it('displays refresh button', () => {
      const wrapper = mountComponent()
      const refreshButton = wrapper.find('button')
      expect(refreshButton.exists()).toBe(true)
    })
  })

  describe('Loading State', () => {
    it('shows loading state initially', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.loading).toBe(true)
    })

    it('hides loading state after data loads', async () => {
      const wrapper = mountComponent()
      await flushPromises()
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.loading).toBe(false)
    })
  })

  describe('StatCards Section', () => {
    it('renders 4 StatCard components', async () => {
      const wrapper = mountComponent()
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      const statCards = wrapper.findAllComponents(StatCard)
      expect(statCards.length).toBe(4)
    })

    it('displays Compliance Score stat', async () => {
      const wrapper = mountComponent()
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      expect(wrapper.text()).toContain('Compliance Score')
      expect(wrapper.text()).toContain('92%')
    })

    it('displays Pending Submissions stat', async () => {
      const wrapper = mountComponent()
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      expect(wrapper.text()).toContain('Pending Submissions')
      expect(wrapper.text()).toContain('3')
    })

    it('displays Total Transactions stat', async () => {
      const wrapper = mountComponent()
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      expect(wrapper.text()).toContain('Total Transactions')
      expect(wrapper.text()).toContain('156')
    })

    it('displays Active Alerts stat', async () => {
      const wrapper = mountComponent()
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      expect(wrapper.text()).toContain('Active Alerts')
      expect(wrapper.text()).toContain('2')
    })
  })

  describe('QuickActions Section', () => {
    it('renders QuickActions component', async () => {
      const wrapper = mountComponent()
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      const quickActions = wrapper.findComponent(QuickActions)
      expect(quickActions.exists()).toBe(true)
    })

    it('passes quick actions data to component', async () => {
      const wrapper = mountComponent()
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      const quickActions = wrapper.findComponent(QuickActions)
      expect(quickActions.props('actions').length).toBe(3)
    })

    it('displays Submit Report action', async () => {
      const wrapper = mountComponent()
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      expect(wrapper.text()).toContain('Submit Report')
    })

    it('displays View Transactions action', async () => {
      const wrapper = mountComponent()
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      expect(wrapper.text()).toContain('View Transactions')
    })

    it('displays Update Profile action', async () => {
      const wrapper = mountComponent()
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      expect(wrapper.text()).toContain('Update Profile')
    })
  })

  describe('AlertsWidget Section', () => {
    it('renders AlertsWidget component', async () => {
      const wrapper = mountComponent()
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      const alertsWidget = wrapper.findComponent(AlertsWidget)
      expect(alertsWidget.exists()).toBe(true)
    })

    it('passes alerts data to component', async () => {
      const wrapper = mountComponent()
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      const alertsWidget = wrapper.findComponent(AlertsWidget)
      expect(alertsWidget.props('alerts').length).toBe(2)
    })

    it('displays alerts section', async () => {
      const wrapper = mountComponent()
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      expect(wrapper.text()).toContain('Alerts')
    })

    it('displays Submission Due Soon alert', async () => {
      const wrapper = mountComponent()
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      expect(wrapper.text()).toContain('Submission Due Soon')
    })

    it('displays Document Verification alert', async () => {
      const wrapper = mountComponent()
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      expect(wrapper.text()).toContain('Document Verification')
    })
  })

  describe('ActivityFeed Section', () => {
    it('renders ActivityFeed component', async () => {
      const wrapper = mountComponent()
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      const activityFeed = wrapper.findComponent(ActivityFeed)
      expect(activityFeed.exists()).toBe(true)
    })

    it('passes activity data to component', async () => {
      const wrapper = mountComponent()
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      const activityFeed = wrapper.findComponent(ActivityFeed)
      expect(activityFeed.props('activities').length).toBe(2)
    })

    it('displays recent activity items', async () => {
      const wrapper = mountComponent()
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      expect(wrapper.text()).toContain('Recent Activity')
    })

    it('limits activity items to 5', async () => {
      const wrapper = mountComponent()
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      const activityFeed = wrapper.findComponent(ActivityFeed)
      expect(activityFeed.props('maxItems')).toBe(5)
    })
  })

  describe('Charts Section', () => {
    it('renders one ChartCard component', async () => {
      const wrapper = mountComponent()
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      const chartCards = wrapper.findAllComponents(ChartCard)
      expect(chartCards.length).toBe(1)
    })

    it('displays Compliance Score Trend chart', async () => {
      const wrapper = mountComponent()
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      expect(wrapper.text()).toContain('Compliance Score Trend')
      expect(wrapper.text()).toContain('Last 6 months')
    })
  })

  describe('Data Loading', () => {
    it('calls loadDashboard on mount', async () => {
      const wrapper = mountComponent()
      await flushPromises()
      
      expect(wrapper.vm.dashboardData).toBeDefined()
    })

    it('sets loading to false after data loads', async () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.loading).toBe(true)
      
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      expect(wrapper.vm.loading).toBe(false)
    })

    it('populates dashboard data correctly', async () => {
      const wrapper = mountComponent()
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      expect(wrapper.vm.dashboardData.stats.length).toBe(4)
      expect(wrapper.vm.dashboardData.quickActions.length).toBe(3)
      expect(wrapper.vm.dashboardData.alerts.length).toBe(2)
      expect(wrapper.vm.dashboardData.recentActivity.length).toBe(2)
      expect(wrapper.vm.dashboardData.charts.length).toBe(1)
    })
  })

  describe('Refresh Functionality', () => {
    it('has refreshDashboard method', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.refreshDashboard).toBe('function')
    })

    it('reloads data when refresh is called', async () => {
      const wrapper = mountComponent()
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      expect(wrapper.vm.loading).toBe(false)
      
      await wrapper.vm.refreshDashboard()
      
      await wrapper.vm.$nextTick()
      
      expect(wrapper.vm.dashboardData).toBeDefined()
    })

    it('refresh button triggers refreshDashboard', async () => {
      const wrapper = mountComponent()
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      const refreshSpy = vi.spyOn(wrapper.vm, 'refreshDashboard')
      
      const refreshButton = wrapper.find('button[class*="hover:bg-gray-100"]')
      await refreshButton.trigger('click')
      
      expect(refreshSpy).toHaveBeenCalled()
    })
  })

  describe('Alert Interactions', () => {
    it('emits dismiss event when alert is dismissed', async () => {
      const wrapper = mountComponent()
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      const alertsWidget = wrapper.findComponent(AlertsWidget)
      
      alertsWidget.vm.$emit('dismiss', 'alert-1')
      await wrapper.vm.$nextTick()
      
      expect(alertsWidget.emitted('dismiss')).toBeTruthy()
    })

    it('emits action event when alert action is clicked', async () => {
      const wrapper = mountComponent()
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      const alertsWidget = wrapper.findComponent(AlertsWidget)
      
      alertsWidget.vm.$emit('action', 'alert-1')
      await wrapper.vm.$nextTick()
      
      expect(alertsWidget.emitted('action')).toBeTruthy()
    })
  })

  describe('Responsive Layout', () => {
    it('uses responsive grid for stat cards', async () => {
      const wrapper = mountComponent()
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      const html = wrapper.html()
      expect(html).toContain('grid')
      expect(html).toContain('grid-cols-1')
    })

    it('uses responsive layout for alerts and activity', async () => {
      const wrapper = mountComponent()
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      const html = wrapper.html()
      expect(html).toContain('lg:grid-cols-2')
    })
  })

  describe('Greeting Computation', () => {
    it('computes correct greeting based on time of day', () => {
      const wrapper = mountComponent()
      const greeting = wrapper.vm.greeting
      
      expect(['Good morning', 'Good afternoon', 'Good evening']).toContain(greeting)
    })
  })

  describe('DateTime Formatting', () => {
    it('formats current datetime correctly', () => {
      const wrapper = mountComponent()
      const dateTime = wrapper.vm.currentDateTime
      
      expect(dateTime).toMatch(/\w+ \d{1,2}, \d{4} at \d{1,2}:\d{2} [AP]M/)
    })
  })

  describe('Entity-Specific Features', () => {
    it('focuses on compliance metrics', async () => {
      const wrapper = mountComponent()
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      expect(wrapper.text()).toContain('Compliance')
    })

    it('displays submission-related information', async () => {
      const wrapper = mountComponent()
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      expect(wrapper.text()).toContain('Submission')
    })

    it('provides quick access to report submission', async () => {
      const wrapper = mountComponent()
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      expect(wrapper.text()).toContain('Submit Report')
    })
  })
})
