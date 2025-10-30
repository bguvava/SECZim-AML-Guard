import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import QuickActions from '@/components/dashboard/QuickActions.vue'
import { FileText } from 'lucide-vue-next'
import type { QuickAction } from '@/types/dashboard'

describe('QuickActions', () => {
  const createAction = (overrides?: Partial<QuickAction>): QuickAction => ({
    id: 'test-action',
    label: 'Test Action',
    icon: FileText,
    action: vi.fn(),
    ...overrides,
  })

  describe('Rendering', () => {
    it('renders quick actions title', () => {
      const actions = [createAction()]
      const wrapper = mount(QuickActions, {
        props: { actions },
      })

      expect(wrapper.text()).toContain('Quick Actions')
    })

    it('renders all provided actions', () => {
      const actions = [
        createAction({ id: '1', label: 'Action 1' }),
        createAction({ id: '2', label: 'Action 2' }),
        createAction({ id: '3', label: 'Action 3' }),
      ]
      const wrapper = mount(QuickActions, {
        props: { actions },
      })

      expect(wrapper.text()).toContain('Action 1')
      expect(wrapper.text()).toContain('Action 2')
      expect(wrapper.text()).toContain('Action 3')
    })

    it('renders action icons', () => {
      const actions = [createAction()]
      const wrapper = mount(QuickActions, {
        props: { actions },
      })

      expect(wrapper.findComponent(FileText).exists()).toBe(true)
    })

    it('displays action badge when provided', () => {
      const actions = [createAction({ badge: '5' })]
      const wrapper = mount(QuickActions, {
        props: { actions },
      })

      expect(wrapper.text()).toContain('5')
    })

    it('displays numeric badge', () => {
      const actions = [createAction({ badge: 12 })]
      const wrapper = mount(QuickActions, {
        props: { actions },
      })

      expect(wrapper.text()).toContain('12')
    })
  })

  describe('Empty State', () => {
    it('displays empty state when no actions', () => {
      const wrapper = mount(QuickActions, {
        props: { actions: [] },
      })

      expect(wrapper.text()).toContain('No quick actions available')
    })

    it('does not render action buttons when empty', () => {
      const wrapper = mount(QuickActions, {
        props: { actions: [] },
      })

      const buttons = wrapper.findAll('button')
      expect(buttons.length).toBe(0)
    })
  })

  describe('Loading State', () => {
    it('renders loading skeleton when loading is true', () => {
      const actions = [createAction()]
      const wrapper = mount(QuickActions, {
        props: { actions, loading: true },
      })

      expect(wrapper.find('.animate-pulse').exists()).toBe(true)
    })

    it('renders content when loading is false', () => {
      const actions = [createAction()]
      const wrapper = mount(QuickActions, {
        props: { actions, loading: false },
      })

      expect(wrapper.find('.animate-pulse').exists()).toBe(false)
      expect(wrapper.text()).toContain('Test Action')
    })
  })

  describe('Action Handlers', () => {
    it('calls action handler when button is clicked', async () => {
      const actionFn = vi.fn()
      const actions = [createAction({ action: actionFn })]
      const wrapper = mount(QuickActions, {
        props: { actions },
      })

      await wrapper.find('button').trigger('click')
      expect(actionFn).toHaveBeenCalledTimes(1)
    })

    it('does not call action when disabled', async () => {
      const actionFn = vi.fn()
      const actions = [createAction({ action: actionFn, disabled: true })]
      const wrapper = mount(QuickActions, {
        props: { actions },
      })

      const button = wrapper.find('button')
      expect(button.attributes('disabled')).toBeDefined()
    })

    it('handles async actions', async () => {
      const asyncAction = vi.fn().mockResolvedValue(undefined)
      const actions = [createAction({ action: asyncAction })]
      const wrapper = mount(QuickActions, {
        props: { actions },
      })

      await wrapper.find('button').trigger('click')
      expect(asyncAction).toHaveBeenCalled()
    })
  })

  describe('Color Variants', () => {
    const colors = ['blue', 'green', 'yellow', 'red', 'purple', 'indigo', 'gray']

    colors.forEach(color => {
      it(`applies ${color} color classes`, () => {
        const actions = [createAction({ color })]
        const wrapper = mount(QuickActions, {
          props: { actions },
        })

        expect(wrapper.html()).toContain(`bg-${color}-600`)
      })
    })

    it('defaults to primary color', () => {
      const actions = [createAction({ color: undefined })]
      const wrapper = mount(QuickActions, {
        props: { actions },
      })

      expect(wrapper.html()).toContain('bg-primary-600')
    })
  })

  describe('Grid Layout', () => {
    it('uses custom column count', () => {
      const actions = [createAction()]
      const wrapper = mount(QuickActions, {
        props: { actions, columns: 4 },
      })

      expect(wrapper.html()).toContain('grid-cols-4')
    })

    it('defaults to 3 columns', () => {
      const actions = [createAction()]
      const wrapper = mount(QuickActions, {
        props: { actions },
      })

      expect(wrapper.html()).toContain('grid-cols-3')
    })
  })

  describe('Disabled State', () => {
    it('disables button when action is disabled', () => {
      const actions = [createAction({ disabled: true })]
      const wrapper = mount(QuickActions, {
        props: { actions },
      })

      const button = wrapper.find('button')
      expect(button.attributes('disabled')).toBeDefined()
      expect(button.classes()).toContain('disabled:opacity-50')
    })

    it('enables button when action is not disabled', () => {
      const actions = [createAction({ disabled: false })]
      const wrapper = mount(QuickActions, {
        props: { actions },
      })

      const button = wrapper.find('button')
      expect(button.attributes('disabled')).toBeUndefined()
    })
  })

  describe('Tooltip', () => {
    it('sets title attribute for tooltip', () => {
      const actions = [createAction({ tooltip: 'Click to perform action' })]
      const wrapper = mount(QuickActions, {
        props: { actions },
      })

      const button = wrapper.find('button')
      expect(button.attributes('title')).toBe('Click to perform action')
    })

    it('does not set title when tooltip is undefined', () => {
      const actions = [createAction({ tooltip: undefined })]
      const wrapper = mount(QuickActions, {
        props: { actions },
      })

      const button = wrapper.find('button')
      expect(button.attributes('title')).toBeUndefined()
    })
  })

  describe('Accessibility', () => {
    it('buttons are keyboard accessible', () => {
      const actions = [createAction()]
      const wrapper = mount(QuickActions, {
        props: { actions },
      })

      const button = wrapper.find('button')
      expect(button.element.tagName).toBe('BUTTON')
    })

    it('disabled buttons have correct cursor', () => {
      const actions = [createAction({ disabled: true })]
      const wrapper = mount(QuickActions, {
        props: { actions },
      })

      const button = wrapper.find('button')
      expect(button.classes()).toContain('disabled:cursor-not-allowed')
    })
  })
})
