import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import StatCard from '@/components/dashboard/StatCard.vue'
import { Building2 } from 'lucide-vue-next'
import type { StatCard as StatCardType } from '@/types/dashboard'

describe('StatCard', () => {
  const createStatCard = (overrides?: Partial<StatCardType>): StatCardType => ({
    id: 'test-stat',
    label: 'Test Metric',
    value: 1234,
    icon: Building2,
    color: 'blue',
    ...overrides,
  })

  describe('Rendering', () => {
    it('renders stat card with basic data', () => {
      const stat = createStatCard()
      const wrapper = mount(StatCard, {
        props: { stat },
      })

      expect(wrapper.find('.text-3xl').text()).toBe('1,234')
      expect(wrapper.find('.text-sm.font-medium').text()).toBe('Test Metric')
      expect(wrapper.html()).toContain('text-blue-600')
    })

    it('renders string value without formatting', () => {
      const stat = createStatCard({ value: '99.5%' })
      const wrapper = mount(StatCard, {
        props: { stat },
      })

      expect(wrapper.find('.text-3xl').text()).toBe('99.5%')
    })

    it('renders subtitle when provided', () => {
      const stat = createStatCard({ subtitle: 'Last 30 days' })
      const wrapper = mount(StatCard, {
        props: { stat },
      })

      expect(wrapper.text()).toContain('Last 30 days')
    })

    it('renders icon component', () => {
      const stat = createStatCard()
      const wrapper = mount(StatCard, {
        props: { stat },
      })

      expect(wrapper.findComponent(Building2).exists()).toBe(true)
    })
  })

  describe('Trend Indicators', () => {
    it('renders upward trend with percentage', () => {
      const stat = createStatCard({
        trend: {
          direction: 'up',
          percentage: 12,
          type: 'positive',
        },
      })
      const wrapper = mount(StatCard, {
        props: { stat },
      })

      expect(wrapper.text()).toContain('12%')
      expect(wrapper.html()).toContain('text-green-600')
    })

    it('renders downward trend with percentage', () => {
      const stat = createStatCard({
        trend: {
          direction: 'down',
          percentage: 8,
          type: 'positive',
        },
      })
      const wrapper = mount(StatCard, {
        props: { stat },
      })

      expect(wrapper.text()).toContain('8%')
      // Down with positive type should show red (bad)
      expect(wrapper.html()).toContain('text-red-600')
    })

    it('renders negative upward trend in red', () => {
      const stat = createStatCard({
        trend: {
          direction: 'up',
          percentage: 15,
          type: 'negative',
        },
      })
      const wrapper = mount(StatCard, {
        props: { stat },
      })

      expect(wrapper.text()).toContain('15%')
      expect(wrapper.html()).toContain('text-red-600')
    })

    it('renders neutral trend', () => {
      const stat = createStatCard({
        trend: {
          direction: 'neutral',
          percentage: 0,
          type: 'neutral',
        },
      })
      const wrapper = mount(StatCard, {
        props: { stat },
      })

      expect(wrapper.text()).toContain('0%')
      expect(wrapper.html()).toContain('text-gray-600')
    })

    it('does not render trend indicator when trend is undefined', () => {
      const stat = createStatCard()
      const wrapper = mount(StatCard, {
        props: { stat },
      })

      expect(wrapper.find('.rounded-full.text-xs').exists()).toBe(false)
    })
  })

  describe('Color Variants', () => {
    const colors = ['blue', 'green', 'yellow', 'red', 'purple', 'indigo', 'pink', 'gray']

    colors.forEach(color => {
      it(`renders ${color} color variant`, () => {
        const stat = createStatCard({ color })
        const wrapper = mount(StatCard, {
          props: { stat },
        })

        expect(wrapper.html()).toContain(`text-${color}-600`)
        expect(wrapper.html()).toContain(`bg-${color}-100`)
      })
    })

    it('defaults to primary color when no color specified', () => {
      const stat = createStatCard({ color: undefined })
      const wrapper = mount(StatCard, {
        props: { stat },
      })

      expect(wrapper.html()).toContain('text-primary-600')
    })
  })

  describe('Loading State', () => {
    it('renders loading skeleton when loading is true', () => {
      const stat = createStatCard()
      const wrapper = mount(StatCard, {
        props: { stat, loading: true },
      })

      expect(wrapper.find('.animate-pulse').exists()).toBe(true)
      expect(wrapper.find('.bg-gray-200').exists()).toBe(true)
      expect(wrapper.text()).not.toContain('Test Metric')
    })

    it('renders content when loading is false', () => {
      const stat = createStatCard()
      const wrapper = mount(StatCard, {
        props: { stat, loading: false },
      })

      expect(wrapper.find('.animate-pulse').exists()).toBe(false)
      expect(wrapper.text()).toContain('Test Metric')
    })

    it('displays placeholder value when loading', () => {
      const stat = createStatCard()
      const wrapper = mount(StatCard, {
        props: { stat, loading: true },
      })

      const skeletons = wrapper.findAll('.bg-gray-200')
      expect(skeletons.length).toBeGreaterThan(0)
    })
  })

  describe('Hover Effects', () => {
    it('applies hover transition classes', () => {
      const stat = createStatCard()
      const wrapper = mount(StatCard, {
        props: { stat },
      })

      const card = wrapper.find('.bg-white')
      expect(card.classes()).toContain('hover:shadow-md')
      expect(card.classes()).toContain('transition-all')
    })
  })

  describe('Number Formatting', () => {
    it('formats large numbers with commas', () => {
      const stat = createStatCard({ value: 1234567 })
      const wrapper = mount(StatCard, {
        props: { stat },
      })

      expect(wrapper.find('.text-3xl').text()).toBe('1,234,567')
    })

    it('formats small numbers correctly', () => {
      const stat = createStatCard({ value: 42 })
      const wrapper = mount(StatCard, {
        props: { stat },
      })

      expect(wrapper.find('.text-3xl').text()).toBe('42')
    })

    it('handles zero value', () => {
      const stat = createStatCard({ value: 0 })
      const wrapper = mount(StatCard, {
        props: { stat },
      })

      expect(wrapper.find('.text-3xl').text()).toBe('0')
    })
  })

  describe('Accessibility', () => {
    it('has proper semantic structure', () => {
      const stat = createStatCard()
      const wrapper = mount(StatCard, {
        props: { stat },
      })

      expect(wrapper.find('.bg-white.rounded-lg').exists()).toBe(true)
    })

    it('displays all information when not loading', () => {
      const stat = createStatCard({
        subtitle: 'Additional info',
        trend: { direction: 'up', percentage: 10, type: 'positive' },
      })
      const wrapper = mount(StatCard, {
        props: { stat },
      })

      expect(wrapper.text()).toContain('Test Metric')
      expect(wrapper.text()).toContain('Additional info')
      expect(wrapper.text()).toContain('10%')
    })
  })
})
