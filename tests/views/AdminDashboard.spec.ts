import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import AdminDashboard from '@/views/admin/Dashboard.vue'
import StatCard from '@/components/dashboard/StatCard.vue'
import ActivityFeed from '@/components/dashboard/ActivityFeed.vue'
import QuickActions from '@/components/dashboard/QuickActions.vue'
import AlertsWidget from '@/components/dashboard/AlertsWidget.vue'
import ChartCard from '@/components/dashboard/ChartCard.vue'

describe('AdminDashboard', () => {
  let router: ReturnType<typeof createRouter>

  beforeEach(() => {
    setActivePinia(createPinia())
    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', name: 'home', component: { template: '<div>Home</div>' } },
        { path: '/admin/dashboard', name: 'admin-dashboard', component: { template: '<div>Dashboard</div>' } },
      ],
    })
  })

  const mountComponent = (options = {}) => {
    return mount(AdminDashboard, {
      global: {
        plugins: [createPinia(), router],
        stubs: {
          AdminLayout: {
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
    it('renders 6 StatCard components', async () => {
      const wrapper = mountComponent()
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      const statCards = wrapper.findAllComponents(StatCard)
      expect(statCards.length).toBe(6)
    })

    it('displays Total Entities stat', async () => {
      const wrapper = mountComponent()
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      expect(wrapper.text()).toContain('Total Entities')
      expect(wrapper.text()).toContain('247')
    })

    it('displays Total Transactions stat', async () => {
      const wrapper = mountComponent()
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      expect(wrapper.text()).toContain('Total Transactions')
      expect(wrapper.text()).toContain('1,834')
    })

    it('displays Pending Reviews stat', async () => {
      const wrapper = mountComponent()
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      expect(wrapper.text()).toContain('Pending Reviews')
      expect(wrapper.text()).toContain('42')
    })

    it('displays Active Alerts stat', async () => {
      const wrapper = mountComponent()
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      expect(wrapper.text()).toContain('Active Alerts')
      expect(wrapper.text()).toContain('18')
    })

    it('displays Compliance Rate stat', async () => {
      const wrapper = mountComponent()
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      expect(wrapper.text()).toContain('Compliance Rate')
      expect(wrapper.text()).toContain('94.2%')
    })

    it('displays System Uptime stat', async () => {
      const wrapper = mountComponent()
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      expect(wrapper.text()).toContain('System Uptime')
      expect(wrapper.text()).toContain('99.8%')
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
      expect(quickActions.props('actions').length).toBeGreaterThan(0)
    })

    it('displays Register Entity action', async () => {
      const wrapper = mountComponent()
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      expect(wrapper.text()).toContain('Register Entity')
    })

    it('displays Review Reports action with badge', async () => {
      const wrapper = mountComponent()
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      expect(wrapper.text()).toContain('Review Reports')
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
  })

  describe('Charts Section', () => {
    it('renders two ChartCard components', async () => {
      const wrapper = mountComponent()
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      const chartCards = wrapper.findAllComponents(ChartCard)
      expect(chartCards.length).toBe(2)
    })

    it('displays Transaction Volume chart', async () => {
      const wrapper = mountComponent()
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      expect(wrapper.text()).toContain('Transaction Volume')
      expect(wrapper.text()).toContain('Last 30 days')
    })

    it('displays Risk Distribution chart', async () => {
      const wrapper = mountComponent()
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      expect(wrapper.text()).toContain('Risk Distribution')
      expect(wrapper.text()).toContain('Current status')
    })
  })

  describe('System Status Section', () => {
    it('displays system status footer', async () => {
      const wrapper = mountComponent()
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      expect(wrapper.text()).toContain('System Status')
    })

    it('displays system uptime', async () => {
      const wrapper = mountComponent()
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      expect(wrapper.text()).toContain('99.8%')
    })

    it('displays active users count', async () => {
      const wrapper = mountComponent()
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      expect(wrapper.text()).toContain('156')
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
      
      expect(wrapper.vm.dashboardData.stats.length).toBe(6)
      expect(wrapper.vm.dashboardData.quickActions.length).toBe(2)
      expect(wrapper.vm.dashboardData.recentActivity.length).toBe(2)
      expect(wrapper.vm.dashboardData.alerts.length).toBe(2)
      expect(wrapper.vm.dashboardData.charts.length).toBe(2)
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
      
      // Should briefly show loading state
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

  describe('Responsive Layout', () => {
    it('uses responsive grid for stat cards', async () => {
      const wrapper = mountComponent()
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      const html = wrapper.html()
      expect(html).toContain('grid')
      expect(html).toMatch(/md:grid-cols-[23]/)
    })

    it('uses responsive layout for activity and alerts', async () => {
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
})
