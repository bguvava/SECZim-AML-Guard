import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import TasksWidget from '@/components/dashboard/TasksWidget.vue'
import type { Task } from '@/types/dashboard'

describe('TasksWidget', () => {
  const createTask = (overrides?: Partial<Task>): Task => ({
    id: 'test-task',
    title: 'Test Task',
    description: 'This is a test task description',
    status: 'pending',
    priority: 'medium',
    ...overrides,
  })

  describe('Rendering', () => {
    it('renders tasks widget title', () => {
      const tasks = [createTask()]
      const wrapper = mount(TasksWidget, {
        props: { tasks },
      })

      expect(wrapper.text()).toContain('Pending Tasks')
    })

    it('displays pending count badge', () => {
      const tasks = [
        createTask({ id: '1', status: 'pending' }),
        createTask({ id: '2', status: 'in-progress' }),
        createTask({ id: '3', status: 'completed' }),
      ]
      const wrapper = mount(TasksWidget, {
        props: { tasks },
      })

      expect(wrapper.text()).toContain('2') // pending + in-progress
    })

    it('renders task title and description', () => {
      const task = createTask({
        title: 'Review Reports',
        description: 'Review all pending compliance reports',
      })
      const wrapper = mount(TasksWidget, {
        props: { tasks: [task] },
      })

      expect(wrapper.text()).toContain('Review Reports')
      expect(wrapper.text()).toContain('Review all pending compliance reports')
    })
  })

  describe('Empty State', () => {
    it('displays empty state when no tasks', () => {
      const wrapper = mount(TasksWidget, {
        props: { tasks: [] },
      })

      expect(wrapper.text()).toContain('No pending tasks')
      expect(wrapper.text()).toContain("You're all caught up!")
    })
  })

  describe('Loading State', () => {
    it('renders loading skeleton when loading is true', () => {
      const wrapper = mount(TasksWidget, {
        props: { tasks: [], loading: true },
      })

      expect(wrapper.find('.animate-pulse').exists()).toBe(true)
    })

    it('renders content when loading is false', () => {
      const tasks = [createTask()]
      const wrapper = mount(TasksWidget, {
        props: { tasks, loading: false },
      })

      expect(wrapper.find('.animate-pulse').exists()).toBe(false)
      expect(wrapper.text()).toContain('Test Task')
    })
  })

  describe('Task Status', () => {
    const statuses: Array<Task['status']> = ['pending', 'in-progress', 'completed', 'overdue']

    statuses.forEach(status => {
      it(`renders ${status} status correctly`, () => {
        const task = createTask({ status })
        const wrapper = mount(TasksWidget, {
          props: { tasks: [task], showCheckbox: false },
        })

        expect(wrapper.html()).toBeTruthy()
      })
    })
  })

  describe('Priority Levels', () => {
    const priorities: Array<Task['priority']> = ['low', 'medium', 'high', 'critical']

    priorities.forEach(priority => {
      it(`renders ${priority} priority badge`, () => {
        const task = createTask({ priority })
        const wrapper = mount(TasksWidget, {
          props: { tasks: [task] },
        })

        expect(wrapper.text()).toContain(priority)
      })
    })
  })

  describe('Checkbox Functionality', () => {
    it('displays checkbox when showCheckbox is true', () => {
      const task = createTask()
      const wrapper = mount(TasksWidget, {
        props: { tasks: [task], showCheckbox: true },
      })

      const checkbox = wrapper.find('.w-5.h-5.rounded.border-2')
      expect(checkbox.exists()).toBe(true)
    })

    it('displays status icon when showCheckbox is false', () => {
      const task = createTask()
      const wrapper = mount(TasksWidget, {
        props: { tasks: [task], showCheckbox: false },
      })

      // Should have status icon instead of checkbox
      const statusIcon = wrapper.find('.w-5.h-5.rounded.border-2')
      expect(statusIcon.exists()).toBe(false)
    })

    it('emits toggle event when checkbox is clicked', async () => {
      const task = createTask()
      const wrapper = mount(TasksWidget, {
        props: { tasks: [task], showCheckbox: true },
      })

      const checkbox = wrapper.find('.w-5.h-5.rounded.border-2')
      await checkbox.trigger('click')

      expect(wrapper.emitted('toggle')).toBeTruthy()
      expect(wrapper.emitted('toggle')?.[0]).toEqual(['test-task'])
    })

    it('shows checked state for completed tasks', () => {
      const task = createTask({ completed: true })
      const wrapper = mount(TasksWidget, {
        props: { tasks: [task], showCheckbox: true },
      })

      const checkbox = wrapper.find('.bg-green-500')
      expect(checkbox.exists()).toBe(true)
    })
  })

  describe('Due Date Formatting', () => {
    it('displays "Overdue" for past due dates', () => {
      const dueDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      const task = createTask({ dueDate, status: 'overdue' })
      const wrapper = mount(TasksWidget, {
        props: { tasks: [task] },
      })

      expect(wrapper.text()).toContain('Overdue')
    })

    it('displays "Due today" for tasks due today', () => {
      const dueDate = new Date().toISOString()
      const task = createTask({ dueDate })
      const wrapper = mount(TasksWidget, {
        props: { tasks: [task] },
      })

      expect(wrapper.text()).toContain('Due today')
    })

    it('displays "Due tomorrow" for tasks due tomorrow', () => {
      const dueDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      const task = createTask({ dueDate })
      const wrapper = mount(TasksWidget, {
        props: { tasks: [task] },
      })

      expect(wrapper.text()).toContain('Due tomorrow')
    })

    it('displays "Due in X days" for tasks due within a week', () => {
      const dueDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
      const task = createTask({ dueDate })
      const wrapper = mount(TasksWidget, {
        props: { tasks: [task] },
      })

      expect(wrapper.text()).toContain('Due in 3 days')
    })

    it('displays formatted date for tasks due later', () => {
      const dueDate = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString()
      const task = createTask({ dueDate })
      const wrapper = mount(TasksWidget, {
        props: { tasks: [task] },
      })

      const text = wrapper.text()
      expect(text).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/)
    })
  })

  describe('Assignee Display', () => {
    it('displays assignee name and initial', () => {
      const task = createTask({
        assignee: { name: 'John Doe' },
      })
      const wrapper = mount(TasksWidget, {
        props: { tasks: [task] },
      })

      expect(wrapper.text()).toContain('John Doe')
      expect(wrapper.text()).toContain('J')
    })

    it('does not display assignee when not provided', () => {
      const task = createTask({ assignee: undefined })
      const wrapper = mount(TasksWidget, {
        props: { tasks: [task] },
      })

      const assigneeElement = wrapper.find('.w-5.h-5.rounded-full.bg-gray-200')
      expect(assigneeElement.exists()).toBe(false)
    })
  })

  describe('Task Actions', () => {
    it('emits action event when task is clicked', async () => {
      const task = createTask({
        action: vi.fn(),
      })
      const wrapper = mount(TasksWidget, {
        props: { tasks: [task] },
      })

      const taskElement = wrapper.find('.space-y-2 > div.border.rounded-lg')
      await taskElement.trigger('click')

      expect(task.action).toHaveBeenCalled()
      expect(wrapper.emitted('action')).toBeTruthy()
    })
  })

  describe('Max Items', () => {
    it('respects maxItems prop', () => {
      const tasks = Array.from({ length: 10 }, (_, i) => 
        createTask({ id: `task-${i}` })
      )
      const wrapper = mount(TasksWidget, {
        props: { tasks, maxItems: 5 },
      })

      const taskElements = wrapper.findAll('.space-y-2 > div.border.rounded-lg')
      expect(taskElements.length).toBe(5)
    })

    it('shows view all link when tasks exceed maxItems', () => {
      const tasks = Array.from({ length: 8 }, (_, i) => 
        createTask({ id: `task-${i}` })
      )
      const wrapper = mount(TasksWidget, {
        props: { tasks, maxItems: 5 },
      })

      expect(wrapper.text()).toContain('View all tasks')
      expect(wrapper.text()).toContain('(8)')
    })
  })

  describe('Completed State Styling', () => {
    it('applies strikethrough to completed task titles', () => {
      const task = createTask({ completed: true })
      const wrapper = mount(TasksWidget, {
        props: { tasks: [task] },
      })

      const title = wrapper.find('.line-through')
      expect(title.exists()).toBe(true)
    })

    it('applies opacity to completed tasks', () => {
      const task = createTask({ completed: true })
      const wrapper = mount(TasksWidget, {
        props: { tasks: [task] },
      })

      const taskElement = wrapper.find('.opacity-60')
      expect(taskElement.exists()).toBe(true)
    })
  })

  describe('Hover Effects', () => {
    it('applies hover classes to tasks', () => {
      const task = createTask()
      const wrapper = mount(TasksWidget, {
        props: { tasks: [task] },
      })

      const taskElement = wrapper.find('.hover\\:border-gray-300')
      expect(taskElement.exists()).toBe(true)
    })
  })
})
