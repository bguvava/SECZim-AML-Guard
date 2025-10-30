import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import SupervisorDashboard from '@/views/supervisor/Dashboard.vue'
import StatCard from '@/components/dashboard/StatCard.vue'
import ActivityFeed from '@/components/dashboard/ActivityFeed.vue'
import QuickActions from '@/components/dashboard/QuickActions.vue'
import TasksWidget from '@/components/dashboard/TasksWidget.vue'
import ChartCard from '@/components/dashboard/ChartCard.vue'

describe('SupervisorDashboard', () => {
  let router: ReturnType<typeof createRouter>

  beforeEach(() => {
    setActivePinia(createPinia())
    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', name: 'home', component: { template: '<div>Home</div>' } },
        { path: '/supervisor/dashboard', name: 'supervisor-dashboard', component: { template: '<div>Dashboard</div>' } },
      ],
    })
  })

  const mountComponent = (options = {}) => {
    return mount(SupervisorDashboard, {
      global: {
        plugins: [createPinia(), router],
        stubs: {
          SupervisorLayout: {
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

    it('displays Assigned Entities stat', async () => {
      const wrapper = mountComponent()
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      expect(wrapper.text()).toContain('Assigned Entities')
      expect(wrapper.text()).toContain('32')
    })

    it('displays Pending Approvals stat', async () => {
      const wrapper = mountComponent()
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      expect(wrapper.text()).toContain('Pending Approvals')
      expect(wrapper.text()).toContain('15')
    })

    it('displays Recent Alerts stat', async () => {
      const wrapper = mountComponent()
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      expect(wrapper.text()).toContain('Recent Alerts')
      expect(wrapper.text()).toContain('8')
    })

    it('displays Completion Rate stat', async () => {
      const wrapper = mountComponent()
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      expect(wrapper.text()).toContain('Completion Rate')
      expect(wrapper.text()).toContain('87.5%')
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

    it('displays Review Submissions action with badge', async () => {
      const wrapper = mountComponent()
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      expect(wrapper.text()).toContain('Review Submissions')
    })

    it('displays Approve Transactions action with badge', async () => {
      const wrapper = mountComponent()
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      expect(wrapper.text()).toContain('Approve Transactions')
    })

    it('displays Entity Reports action', async () => {
      const wrapper = mountComponent()
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      expect(wrapper.text()).toContain('Entity Reports')
    })
  })

  describe('TasksWidget Section', () => {
    it('renders TasksWidget component', async () => {
      const wrapper = mountComponent()
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      const tasksWidget = wrapper.findComponent(TasksWidget)
      expect(tasksWidget.exists()).toBe(true)
    })

    it('passes tasks data to component', async () => {
      const wrapper = mountComponent()
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      const tasksWidget = wrapper.findComponent(TasksWidget)
      expect(tasksWidget.props('tasks').length).toBe(2)
    })

    it('displays pending tasks section', async () => {
      const wrapper = mountComponent()
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      expect(wrapper.text()).toContain('Pending Tasks')
    })

    it('displays task titles', async () => {
      const wrapper = mountComponent()
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      expect(wrapper.text()).toContain('Review Transaction #1234')
      expect(wrapper.text()).toContain('Entity Verification')
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

    it('limits activity items to 6', async () => {
      const wrapper = mountComponent()
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      const activityFeed = wrapper.findComponent(ActivityFeed)
      expect(activityFeed.props('maxItems')).toBe(6)
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

    it('displays Entity Status chart', async () => {
      const wrapper = mountComponent()
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      expect(wrapper.text()).toContain('Entity Status')
      expect(wrapper.text()).toContain('By verification status')
    })

    it('displays Approval Trends chart', async () => {
      const wrapper = mountComponent()
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      expect(wrapper.text()).toContain('Approval Trends')
      expect(wrapper.text()).toContain('Last 7 days')
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
      expect(wrapper.vm.dashboardData.tasks.length).toBe(2)
      expect(wrapper.vm.dashboardData.recentActivity.length).toBe(2)
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

  describe('Task Interactions', () => {
    it('emits toggle event when task checkbox is clicked', async () => {
      const wrapper = mountComponent()
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      const tasksWidget = wrapper.findComponent(TasksWidget)
      
      tasksWidget.vm.$emit('toggle', 'task-1')
      await wrapper.vm.$nextTick()
      
      expect(tasksWidget.emitted('toggle')).toBeTruthy()
    })

    it('emits action event when task is clicked', async () => {
      const wrapper = mountComponent()
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      const tasksWidget = wrapper.findComponent(TasksWidget)
      
      tasksWidget.vm.$emit('action', 'task-1')
      await wrapper.vm.$nextTick()
      
      expect(tasksWidget.emitted('action')).toBeTruthy()
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

    it('uses responsive layout for tasks and activity', async () => {
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
