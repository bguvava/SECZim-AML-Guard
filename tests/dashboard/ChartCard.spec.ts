import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ChartCard from '@/components/dashboard/ChartCard.vue'

describe('ChartCard', () => {
  describe('Rendering', () => {
    it('renders chart card container', () => {
      const wrapper = mount(ChartCard)

      expect(wrapper.find('.bg-white.rounded-lg').exists()).toBe(true)
    })

    it('renders title when provided', () => {
      const wrapper = mount(ChartCard, {
        props: { title: 'Sales Chart' },
      })

      expect(wrapper.text()).toContain('Sales Chart')
    })

    it('renders subtitle when provided', () => {
      const wrapper = mount(ChartCard, {
        props: { 
          title: 'Revenue',
          subtitle: 'Last 30 days'
        },
      })

      expect(wrapper.text()).toContain('Revenue')
      expect(wrapper.text()).toContain('Last 30 days')
    })

    it('does not render header when no title or subtitle', () => {
      const wrapper = mount(ChartCard)

      const header = wrapper.find('h3')
      expect(header.exists()).toBe(false)
    })
  })

  describe('Loading State', () => {
    it('renders loading skeleton when loading is true', () => {
      const wrapper = mount(ChartCard, {
        props: { loading: true },
      })

      expect(wrapper.find('.animate-pulse').exists()).toBe(true)
      expect(wrapper.find('.bg-gray-200').exists()).toBe(true)
    })

    it('renders content when loading is false', () => {
      const wrapper = mount(ChartCard, {
        props: { loading: false },
        slots: {
          default: '<div class="test-chart">Chart Content</div>',
        },
      })

      expect(wrapper.find('.animate-pulse').exists()).toBe(false)
      expect(wrapper.text()).toContain('Chart Content')
    })
  })

  describe('Empty State', () => {
    it('displays empty state when no slot content provided', () => {
      const wrapper = mount(ChartCard, {
        props: { loading: false },
      })

      expect(wrapper.text()).toContain('No chart data available')
    })

    it('shows chart icon in empty state', () => {
      const wrapper = mount(ChartCard, {
        props: { loading: false },
      })

      const icon = wrapper.find('svg')
      expect(icon.exists()).toBe(true)
    })
  })

  describe('Slot Content', () => {
    it('renders slot content when provided', () => {
      const wrapper = mount(ChartCard, {
        slots: {
          default: '<div class="custom-chart">My Chart</div>',
        },
      })

      expect(wrapper.html()).toContain('custom-chart')
      expect(wrapper.text()).toContain('My Chart')
    })

    it('does not show empty state when slot content exists', () => {
      const wrapper = mount(ChartCard, {
        slots: {
          default: '<div>Chart Data</div>',
        },
      })

      expect(wrapper.text()).not.toContain('No chart data available')
    })
  })

  describe('Height Configuration', () => {
    it('applies default height of 300px', () => {
      const wrapper = mount(ChartCard)

      const chartContainer = wrapper.find('.relative')
      const style = chartContainer.attributes('style')
      expect(style).toContain('height: 300px')
    })

    it('applies custom height when provided', () => {
      const wrapper = mount(ChartCard, {
        props: { height: 400 },
      })

      const chartContainer = wrapper.find('.relative')
      const style = chartContainer.attributes('style')
      expect(style).toContain('height: 400px')
    })

    it('applies height to loading skeleton', () => {
      const wrapper = mount(ChartCard, {
        props: { loading: true, height: 250 },
      })

      const skeleton = wrapper.find('.bg-gray-200.rounded')
      const style = skeleton.attributes('style')
      expect(style).toContain('height: 250px')
    })
  })

  describe('Styling', () => {
    it('has shadow and border', () => {
      const wrapper = mount(ChartCard)

      const card = wrapper.find('.bg-white')
      expect(card.classes()).toContain('shadow-sm')
      expect(card.classes()).toContain('border')
      expect(card.classes()).toContain('border-gray-200')
    })

    it('has padding', () => {
      const wrapper = mount(ChartCard)

      const card = wrapper.find('.bg-white')
      expect(card.classes()).toContain('p-6')
    })

    it('has rounded corners', () => {
      const wrapper = mount(ChartCard)

      const card = wrapper.find('.bg-white')
      expect(card.classes()).toContain('rounded-lg')
    })
  })

  describe('Title Styling', () => {
    it('applies correct title styles', () => {
      const wrapper = mount(ChartCard, {
        props: { title: 'Test Chart' },
      })

      const title = wrapper.find('h3')
      expect(title.classes()).toContain('text-lg')
      expect(title.classes()).toContain('font-semibold')
      expect(title.classes()).toContain('text-gray-900')
    })

    it('applies correct subtitle styles', () => {
      const wrapper = mount(ChartCard, {
        props: { 
          title: 'Test',
          subtitle: 'Subtitle' 
        },
      })

      const subtitle = wrapper.find('.text-sm.text-gray-600')
      expect(subtitle.exists()).toBe(true)
      expect(subtitle.text()).toBe('Subtitle')
    })
  })

  describe('Integration', () => {
    it('works with complex slot content', () => {
      const wrapper = mount(ChartCard, {
        props: {
          title: 'Revenue Chart',
          subtitle: 'Monthly breakdown',
          height: 350,
        },
        slots: {
          default: `
            <div class="chart-wrapper">
              <canvas id="myChart"></canvas>
            </div>
          `,
        },
      })

      expect(wrapper.text()).toContain('Revenue Chart')
      expect(wrapper.text()).toContain('Monthly breakdown')
      expect(wrapper.html()).toContain('chart-wrapper')
      expect(wrapper.html()).toContain('canvas')
    })
  })
})
