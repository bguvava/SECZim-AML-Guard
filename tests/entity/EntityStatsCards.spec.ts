/**
 * EntityStatsCards Component Tests
 * Tests statistics display component
 */

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import EntityStatsCards from '@/components/entity/EntityStatsCards.vue'
import type { EntityStatistics } from '@/types/entity'

describe('EntityStatsCards Component', () => {
  const mockStatistics: EntityStatistics = {
    totalEntities: 55,
    activeLicenses: 45,
    expiringSoon: 5,
    suspended: 3,
    byType: {
      'Stockbroker': 15,
      'Investment Manager': 12,
      'Custodian': 10,
      'Market Operator': 8,
      'Investment Advisor': 6,
      'Portfolio Manager': 4,
    },
    byRiskLevel: {
      'High': 8,
      'Medium': 20,
      'Low': 25,
      'Unrated': 2,
    },
    averageComplianceScore: 82.5,
  }

  describe('Rendering', () => {
    it('should render without errors', () => {
      const wrapper = mount(EntityStatsCards, {
        props: { statistics: mockStatistics },
      })

      expect(wrapper.exists()).toBe(true)
    })

    it('should display total entities', () => {
      const wrapper = mount(EntityStatsCards, {
        props: { statistics: mockStatistics },
      })

      expect(wrapper.text()).toContain('55')
      expect(wrapper.text()).toContain('Total Entities')
    })

    it('should display active licenses', () => {
      const wrapper = mount(EntityStatsCards, {
        props: { statistics: mockStatistics },
      })

      expect(wrapper.text()).toContain('45')
      expect(wrapper.text()).toContain('Active Licenses')
    })

    it('should display expiring soon count', () => {
      const wrapper = mount(EntityStatsCards, {
        props: { statistics: mockStatistics },
      })

      expect(wrapper.text()).toContain('5')
      expect(wrapper.text()).toContain('Expiring Soon')
    })

    it('should display suspended count', () => {
      const wrapper = mount(EntityStatsCards, {
        props: { statistics: mockStatistics },
      })

      expect(wrapper.text()).toContain('3')
      expect(wrapper.text()).toContain('Suspended')
    })
  })

  describe('Statistics Calculations', () => {
    it('should calculate active license percentage correctly', () => {
      const wrapper = mount(EntityStatsCards, {
        props: { statistics: mockStatistics },
      })

      const percentage = (45 / 55) * 100
      // Component shows rounded percentage
      expect(wrapper.text()).toContain(`${Math.round(percentage)}%`)
    })

    it('should display average compliance score', () => {
      const wrapper = mount(EntityStatsCards, {
        props: { statistics: mockStatistics },
      })

      expect(wrapper.text()).toContain('82.5')
      expect(wrapper.text()).toContain('Average Compliance')
    })
  })

  describe('Entity Type Distribution', () => {
    it('should display all entity types', () => {
      const wrapper = mount(EntityStatsCards, {
        props: { statistics: mockStatistics },
      })

      const types = Object.keys(mockStatistics.byType)
      types.forEach(type => {
        expect(wrapper.text()).toContain(type)
      })
    })

    it('should display entity counts per type', () => {
      const wrapper = mount(EntityStatsCards, {
        props: { statistics: mockStatistics },
      })

      expect(wrapper.text()).toContain('15')  // Stockbroker
      expect(wrapper.text()).toContain('12')  // Investment Manager
      expect(wrapper.text()).toContain('10')  // Custodian
    })
  })

  describe('Risk Distribution', () => {
    it('should display all risk levels', () => {
      const wrapper = mount(EntityStatsCards, {
        props: { statistics: mockStatistics },
      })

      expect(wrapper.text()).toContain('High')
      expect(wrapper.text()).toContain('Medium')
      expect(wrapper.text()).toContain('Low')
      expect(wrapper.text()).toContain('Unrated')
    })

    it('should display risk counts', () => {
      const wrapper = mount(EntityStatsCards, {
        props: { statistics: mockStatistics },
      })

      expect(wrapper.text()).toContain('8')   // High
      expect(wrapper.text()).toContain('20')  // Medium
      expect(wrapper.text()).toContain('25')  // Low
      expect(wrapper.text()).toContain('2')   // Unrated
    })
  })

  describe('Edge Cases', () => {
    it('should handle zero entities', () => {
      const emptyStats: EntityStatistics = {
        totalEntities: 0,
        activeLicenses: 0,
        expiringSoon: 0,
        suspended: 0,
        byType: {
          'Stockbroker': 0,
          'Investment Manager': 0,
          'Custodian': 0,
          'Market Operator': 0,
          'Investment Advisor': 0,
          'Portfolio Manager': 0,
        },
        byRiskLevel: {
          'High': 0,
          'Medium': 0,
          'Low': 0,
          'Unrated': 0,
        },
        averageComplianceScore: 0,
      }

      const wrapper = mount(EntityStatsCards, {
        props: { statistics: emptyStats },
      })

      expect(wrapper.exists()).toBe(true)
      expect(wrapper.text()).toContain('0')
    })

    it('should handle 100% active licenses', () => {
      const allActiveStats: EntityStatistics = {
        ...mockStatistics,
        totalEntities: 50,
        activeLicenses: 50,
      }

      const wrapper = mount(EntityStatsCards, {
        props: { statistics: allActiveStats },
      })

      expect(wrapper.text()).toContain('100%')
    })

    it('should handle perfect compliance score', () => {
      const perfectStats: EntityStatistics = {
        ...mockStatistics,
        averageComplianceScore: 100,
      }

      const wrapper = mount(EntityStatsCards, {
        props: { statistics: perfectStats },
      })

      expect(wrapper.text()).toContain('100')
    })
  })
})
