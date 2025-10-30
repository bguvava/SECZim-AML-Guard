/**
 * ActivityLog Component Tests
 * Comprehensive test suite for activity log with filtering and pagination
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import ActivityLog from '@/components/profile/ActivityLog.vue'
import type { ActivityLogEntry, ActivityLogFilters } from '@/types/profile'

const mockActivities: ActivityLogEntry[] = [
  {
    id: 'activity-1',
    userId: 'user-123',
    action: 'login',
    category: 'authentication',
    description: 'Successful login from Chrome',
    timestamp: new Date().toISOString(),
    ipAddress: '192.168.1.100',
    location: { city: 'New York', country: 'US' },
    status: 'success'
  },
  {
    id: 'activity-2',
    userId: 'user-123',
    action: 'profile_updated',
    category: 'profile',
    description: 'Updated profile information',
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    ipAddress: '192.168.1.100',
    location: { city: 'New York', country: 'US' },
    status: 'success'
  },
  {
    id: 'activity-3',
    userId: 'user-123',
    action: 'login_failed',
    category: 'authentication',
    description: 'Failed login attempt',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    ipAddress: '203.0.113.42',
    status: 'failure'
  }
]

describe('ActivityLog', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Component Rendering', () => {
    it('should render activity log table', () => {
      wrapper = mount(ActivityLog, {
        props: {
          activities: mockActivities,
          total: 30,
          page: 1,
          limit: 10,
          totalPages: 3,
          hasNext: true,
          hasPrev: false,
          loading: false
        }
      })

      const table = wrapper.find('[data-test="activity-table"]')
      expect(table.exists()).toBe(true)
    })

    it('should render all activities', () => {
      wrapper = mount(ActivityLog, {
        props: {
          activities: mockActivities,
          total: 30,
          page: 1,
          limit: 10,
          totalPages: 3,
          hasNext: true,
          hasPrev: false,
          loading: false
        }
      })

      const rows = wrapper.findAll('[data-test^="activity-row-"]')
      expect(rows.length).toBe(3)
    })

    it('should display action descriptions', () => {
      wrapper = mount(ActivityLog, {
        props: {
          activities: mockActivities,
          total: 30,
          page: 1,
          limit: 10,
          totalPages: 3,
          hasNext: true,
          hasPrev: false,
          loading: false
        }
      })

      expect(wrapper.text()).toContain('Successful login from Chrome')
      expect(wrapper.text()).toContain('Updated profile information')
      expect(wrapper.text()).toContain('Failed login attempt')
    })

    it('should display timestamps', () => {
      wrapper = mount(ActivityLog, {
        props: {
          activities: mockActivities,
          total: 30,
          page: 1,
          limit: 10,
          totalPages: 3,
          hasNext: true,
          hasPrev: false,
          loading: false
        }
      })

      expect(wrapper.text()).toMatch(/just now|seconds ago|minutes ago/)
    })

    it('should display IP addresses', () => {
      wrapper = mount(ActivityLog, {
        props: {
          activities: mockActivities,
          total: 30,
          page: 1,
          limit: 10,
          totalPages: 3,
          hasNext: true,
          hasPrev: false,
          loading: false
        }
      })

      expect(wrapper.text()).toContain('192.168.1.100')
      expect(wrapper.text()).toContain('203.0.113.42')
    })

    it('should display location information', () => {
      wrapper = mount(ActivityLog, {
        props: {
          activities: mockActivities,
          total: 30,
          page: 1,
          limit: 10,
          totalPages: 3,
          hasNext: true,
          hasPrev: false,
          loading: false
        }
      })

      expect(wrapper.text()).toContain('New York, US')
    })
  })

  describe('Status Indicators', () => {
    it('should show success badge for successful activities', () => {
      wrapper = mount(ActivityLog, {
        props: {
          activities: mockActivities,
          total: 30,
          page: 1,
          limit: 10,
          totalPages: 3,
          hasNext: true,
          hasPrev: false,
          loading: false
        }
      })

      const successBadge = wrapper.find('[data-test="status-success"]')
      expect(successBadge.exists()).toBe(true)
      expect(successBadge.classes()).toContain('bg-green-100')
    })

    it('should show failure badge for failed activities', () => {
      wrapper = mount(ActivityLog, {
        props: {
          activities: mockActivities,
          total: 30,
          page: 1,
          limit: 10,
          totalPages: 3,
          hasNext: true,
          hasPrev: false,
          loading: false
        }
      })

      const failureBadge = wrapper.find('[data-test="status-failure"]')
      expect(failureBadge.exists()).toBe(true)
      expect(failureBadge.classes()).toContain('bg-red-100')
    })

    it('should show pending badge for pending activities', () => {
      const pendingActivity: ActivityLogEntry = {
        ...mockActivities[0],
        status: 'pending'
      }

      wrapper = mount(ActivityLog, {
        props: {
          activities: [pendingActivity],
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
          loading: false
        }
      })

      const pendingBadge = wrapper.find('[data-test="status-pending"]')
      expect(pendingBadge.exists()).toBe(true)
      expect(pendingBadge.classes()).toContain('bg-yellow-100')
    })
  })

  describe('Category Icons', () => {
    it('should display authentication icon for auth activities', () => {
      wrapper = mount(ActivityLog, {
        props: {
          activities: mockActivities,
          total: 30,
          page: 1,
          limit: 10,
          totalPages: 3,
          hasNext: true,
          hasPrev: false,
          loading: false
        }
      })

      const authIcon = wrapper.find('[data-test="category-icon-authentication"]')
      expect(authIcon.exists()).toBe(true)
    })

    it('should display profile icon for profile activities', () => {
      wrapper = mount(ActivityLog, {
        props: {
          activities: mockActivities,
          total: 30,
          page: 1,
          limit: 10,
          totalPages: 3,
          hasNext: true,
          hasPrev: false,
          loading: false
        }
      })

      const profileIcon = wrapper.find('[data-test="category-icon-profile"]')
      expect(profileIcon.exists()).toBe(true)
    })
  })

  describe('Search Functionality', () => {
    it('should render search input', () => {
      wrapper = mount(ActivityLog, {
        props: {
          activities: mockActivities,
          total: 30,
          page: 1,
          limit: 10,
          totalPages: 3,
          hasNext: true,
          hasPrev: false,
          loading: false
        }
      })

      const searchInput = wrapper.find('[data-test="search-input"]')
      expect(searchInput.exists()).toBe(true)
    })

    it('should emit filter event on search', async () => {
      wrapper = mount(ActivityLog, {
        props: {
          activities: mockActivities,
          total: 30,
          page: 1,
          limit: 10,
          totalPages: 3,
          hasNext: true,
          hasPrev: false,
          loading: false
        }
      })

      const searchInput = wrapper.find('[data-test="search-input"]')
      await searchInput.setValue('login')
      await nextTick()

      // Wait for debounce
      await new Promise(resolve => setTimeout(resolve, 500))

      expect(wrapper.emitted('filter')).toBeTruthy()
      const filters = wrapper.emitted('filter')?.[0]?.[0] as ActivityLogFilters
      expect(filters.searchQuery).toBe('login')
    })
  })

  describe('Filter Panel', () => {
    it('should toggle filter panel visibility', async () => {
      wrapper = mount(ActivityLog, {
        props: {
          activities: mockActivities,
          total: 30,
          page: 1,
          limit: 10,
          totalPages: 3,
          hasNext: true,
          hasPrev: false,
          loading: false
        }
      })

      const filterButton = wrapper.find('[data-test="toggle-filters-button"]')
      await filterButton.trigger('click')
      await nextTick()

      const filterPanel = wrapper.find('[data-test="filter-panel"]')
      expect(filterPanel.exists()).toBe(true)
    })

    it('should show category filters', async () => {
      wrapper = mount(ActivityLog, {
        props: {
          activities: mockActivities,
          total: 30,
          page: 1,
          limit: 10,
          totalPages: 3,
          hasNext: true,
          hasPrev: false,
          loading: false
        }
      })

      const filterButton = wrapper.find('[data-test="toggle-filters-button"]')
      await filterButton.trigger('click')
      await nextTick()

      expect(wrapper.find('[data-test="filter-category-authentication"]').exists()).toBe(true)
      expect(wrapper.find('[data-test="filter-category-security"]').exists()).toBe(true)
      expect(wrapper.find('[data-test="filter-category-profile"]').exists()).toBe(true)
    })

    it('should show status filters', async () => {
      wrapper = mount(ActivityLog, {
        props: {
          activities: mockActivities,
          total: 30,
          page: 1,
          limit: 10,
          totalPages: 3,
          hasNext: true,
          hasPrev: false,
          loading: false
        }
      })

      const filterButton = wrapper.find('[data-test="toggle-filters-button"]')
      await filterButton.trigger('click')
      await nextTick()

      expect(wrapper.find('[data-test="filter-status-success"]').exists()).toBe(true)
      expect(wrapper.find('[data-test="filter-status-failure"]').exists()).toBe(true)
      expect(wrapper.find('[data-test="filter-status-pending"]').exists()).toBe(true)
    })

    it('should show date range filters', async () => {
      wrapper = mount(ActivityLog, {
        props: {
          activities: mockActivities,
          total: 30,
          page: 1,
          limit: 10,
          totalPages: 3,
          hasNext: true,
          hasPrev: false,
          loading: false
        }
      })

      const filterButton = wrapper.find('[data-test="toggle-filters-button"]')
      await filterButton.trigger('click')
      await nextTick()

      expect(wrapper.find('[data-test="filter-start-date"]').exists()).toBe(true)
      expect(wrapper.find('[data-test="filter-end-date"]').exists()).toBe(true)
    })

    it('should emit filter event with selected categories', async () => {
      wrapper = mount(ActivityLog, {
        props: {
          activities: mockActivities,
          total: 30,
          page: 1,
          limit: 10,
          totalPages: 3,
          hasNext: true,
          hasPrev: false,
          loading: false
        }
      })

      const filterButton = wrapper.find('[data-test="toggle-filters-button"]')
      await filterButton.trigger('click')
      await nextTick()

      const categoryCheckbox = wrapper.find('[data-test="filter-category-authentication"]')
      await categoryCheckbox.setValue(true)
      await nextTick()

      const applyButton = wrapper.find('[data-test="apply-filters-button"]')
      await applyButton.trigger('click')

      expect(wrapper.emitted('filter')).toBeTruthy()
      const filters = wrapper.emitted('filter')?.[0]?.[0] as ActivityLogFilters
      expect(filters.category).toContain('authentication')
    })

    it('should emit filter event with date range', async () => {
      wrapper = mount(ActivityLog, {
        props: {
          activities: mockActivities,
          total: 30,
          page: 1,
          limit: 10,
          totalPages: 3,
          hasNext: true,
          hasPrev: false,
          loading: false
        }
      })

      const filterButton = wrapper.find('[data-test="toggle-filters-button"]')
      await filterButton.trigger('click')
      await nextTick()

      const startDate = wrapper.find('[data-test="filter-start-date"]')
      const endDate = wrapper.find('[data-test="filter-end-date"]')
      
      await startDate.setValue('2025-10-01')
      await endDate.setValue('2025-10-30')
      await nextTick()

      const applyButton = wrapper.find('[data-test="apply-filters-button"]')
      await applyButton.trigger('click')

      expect(wrapper.emitted('filter')).toBeTruthy()
      const filters = wrapper.emitted('filter')?.[0]?.[0] as ActivityLogFilters
      expect(filters.startDate).toBe('2025-10-01')
      expect(filters.endDate).toBe('2025-10-30')
    })

    it('should clear all filters', async () => {
      wrapper = mount(ActivityLog, {
        props: {
          activities: mockActivities,
          total: 30,
          page: 1,
          limit: 10,
          totalPages: 3,
          hasNext: true,
          hasPrev: false,
          loading: false
        }
      })

      const filterButton = wrapper.find('[data-test="toggle-filters-button"]')
      await filterButton.trigger('click')
      await nextTick()

      const clearButton = wrapper.find('[data-test="clear-filters-button"]')
      await clearButton.trigger('click')

      expect(wrapper.emitted('filter')).toBeTruthy()
      const filters = wrapper.emitted('filter')?.[0]?.[0] as ActivityLogFilters
      expect(filters.category).toEqual([])
      expect(filters.status).toEqual([])
      expect(filters.startDate).toBeUndefined()
      expect(filters.endDate).toBeUndefined()
    })
  })

  describe('Pagination', () => {
    it('should render pagination controls', () => {
      wrapper = mount(ActivityLog, {
        props: {
          activities: mockActivities,
          total: 30,
          page: 1,
          limit: 10,
          totalPages: 3,
          hasNext: true,
          hasPrev: false,
          loading: false
        }
      })

      const pagination = wrapper.find('[data-test="pagination"]')
      expect(pagination.exists()).toBe(true)
    })

    it('should display current page and total pages', () => {
      wrapper = mount(ActivityLog, {
        props: {
          activities: mockActivities,
          total: 30,
          page: 2,
          limit: 10,
          totalPages: 3,
          hasNext: true,
          hasPrev: true,
          loading: false
        }
      })

      expect(wrapper.text()).toContain('Page 2 of 3')
    })

    it('should emit loadPage event for next page', async () => {
      wrapper = mount(ActivityLog, {
        props: {
          activities: mockActivities,
          total: 30,
          page: 1,
          limit: 10,
          totalPages: 3,
          hasNext: true,
          hasPrev: false,
          loading: false
        }
      })

      const nextButton = wrapper.find('[data-test="next-page-button"]')
      await nextButton.trigger('click')

      expect(wrapper.emitted('loadPage')).toBeTruthy()
      expect(wrapper.emitted('loadPage')?.[0]).toEqual([2])
    })

    it('should emit loadPage event for previous page', async () => {
      wrapper = mount(ActivityLog, {
        props: {
          activities: mockActivities,
          total: 30,
          page: 2,
          limit: 10,
          totalPages: 3,
          hasNext: true,
          hasPrev: true,
          loading: false
        }
      })

      const prevButton = wrapper.find('[data-test="prev-page-button"]')
      await prevButton.trigger('click')

      expect(wrapper.emitted('loadPage')).toBeTruthy()
      expect(wrapper.emitted('loadPage')?.[0]).toEqual([1])
    })

    it('should disable next button when no next page', () => {
      wrapper = mount(ActivityLog, {
        props: {
          activities: mockActivities,
          total: 30,
          page: 3,
          limit: 10,
          totalPages: 3,
          hasNext: false,
          hasPrev: true,
          loading: false
        }
      })

      const nextButton = wrapper.find('[data-test="next-page-button"]')
      expect(nextButton.attributes('disabled')).toBeDefined()
    })

    it('should disable prev button when no previous page', () => {
      wrapper = mount(ActivityLog, {
        props: {
          activities: mockActivities,
          total: 30,
          page: 1,
          limit: 10,
          totalPages: 3,
          hasNext: true,
          hasPrev: false,
          loading: false
        }
      })

      const prevButton = wrapper.find('[data-test="prev-page-button"]')
      expect(prevButton.attributes('disabled')).toBeDefined()
    })
  })

  describe('Export Functionality', () => {
    it('should render export button', () => {
      wrapper = mount(ActivityLog, {
        props: {
          activities: mockActivities,
          total: 30,
          page: 1,
          limit: 10,
          totalPages: 3,
          hasNext: true,
          hasPrev: false,
          loading: false
        }
      })

      const exportButton = wrapper.find('[data-test="export-button"]')
      expect(exportButton.exists()).toBe(true)
    })

    it('should show export format options on click', async () => {
      wrapper = mount(ActivityLog, {
        props: {
          activities: mockActivities,
          total: 30,
          page: 1,
          limit: 10,
          totalPages: 3,
          hasNext: true,
          hasPrev: false,
          loading: false
        }
      })

      const exportButton = wrapper.find('[data-test="export-button"]')
      await exportButton.trigger('click')
      await nextTick()

      expect(wrapper.find('[data-test="export-csv"]').exists()).toBe(true)
      expect(wrapper.find('[data-test="export-json"]').exists()).toBe(true)
      expect(wrapper.find('[data-test="export-pdf"]').exists()).toBe(true)
    })

    it('should emit export event with CSV format', async () => {
      wrapper = mount(ActivityLog, {
        props: {
          activities: mockActivities,
          total: 30,
          page: 1,
          limit: 10,
          totalPages: 3,
          hasNext: true,
          hasPrev: false,
          loading: false
        }
      })

      const exportButton = wrapper.find('[data-test="export-button"]')
      await exportButton.trigger('click')
      await nextTick()

      const csvButton = wrapper.find('[data-test="export-csv"]')
      await csvButton.trigger('click')

      expect(wrapper.emitted('export')).toBeTruthy()
      expect(wrapper.emitted('export')?.[0]).toEqual(['csv'])
    })

    it('should emit export event with JSON format', async () => {
      wrapper = mount(ActivityLog, {
        props: {
          activities: mockActivities,
          total: 30,
          page: 1,
          limit: 10,
          totalPages: 3,
          hasNext: true,
          hasPrev: false,
          loading: false
        }
      })

      const exportButton = wrapper.find('[data-test="export-button"]')
      await exportButton.trigger('click')
      await nextTick()

      const jsonButton = wrapper.find('[data-test="export-json"]')
      await jsonButton.trigger('click')

      expect(wrapper.emitted('export')?.[0]).toEqual(['json'])
    })

    it('should emit export event with PDF format', async () => {
      wrapper = mount(ActivityLog, {
        props: {
          activities: mockActivities,
          total: 30,
          page: 1,
          limit: 10,
          totalPages: 3,
          hasNext: true,
          hasPrev: false,
          loading: false
        }
      })

      const exportButton = wrapper.find('[data-test="export-button"]')
      await exportButton.trigger('click')
      await nextTick()

      const pdfButton = wrapper.find('[data-test="export-pdf"]')
      await pdfButton.trigger('click')

      expect(wrapper.emitted('export')?.[0]).toEqual(['pdf'])
    })
  })

  describe('Empty State', () => {
    it('should show empty state when no activities', () => {
      wrapper = mount(ActivityLog, {
        props: {
          activities: [],
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
          loading: false
        }
      })

      const emptyState = wrapper.find('[data-test="empty-state"]')
      expect(emptyState.exists()).toBe(true)
      expect(emptyState.text()).toContain('No activity logs found')
    })

    it('should not show table when empty', () => {
      wrapper = mount(ActivityLog, {
        props: {
          activities: [],
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
          loading: false
        }
      })

      const table = wrapper.find('[data-test="activity-table"]')
      expect(table.exists()).toBe(false)
    })
  })

  describe('Loading State', () => {
    it('should show loading spinner when loading', () => {
      wrapper = mount(ActivityLog, {
        props: {
          activities: mockActivities,
          total: 30,
          page: 1,
          limit: 10,
          totalPages: 3,
          hasNext: true,
          hasPrev: false,
          loading: true
        }
      })

      const spinner = wrapper.find('[data-test="loading-spinner"]')
      expect(spinner.exists()).toBe(true)
    })

    it('should disable pagination when loading', () => {
      wrapper = mount(ActivityLog, {
        props: {
          activities: mockActivities,
          total: 30,
          page: 1,
          limit: 10,
          totalPages: 3,
          hasNext: true,
          hasPrev: false,
          loading: true
        }
      })

      const nextButton = wrapper.find('[data-test="next-page-button"]')
      expect(nextButton.attributes('disabled')).toBeDefined()
    })

    it('should disable export button when loading', () => {
      wrapper = mount(ActivityLog, {
        props: {
          activities: mockActivities,
          total: 30,
          page: 1,
          limit: 10,
          totalPages: 3,
          hasNext: true,
          hasPrev: false,
          loading: true
        }
      })

      const exportButton = wrapper.find('[data-test="export-button"]')
      expect(exportButton.attributes('disabled')).toBeDefined()
    })
  })

  describe('Props Validation', () => {
    it('should accept valid props', () => {
      expect(() => {
        mount(ActivityLog, {
          props: {
            activities: mockActivities,
            total: 30,
            page: 1,
            limit: 10,
            totalPages: 3,
            hasNext: true,
            hasPrev: false,
            loading: true
          }
        })
      }).not.toThrow()
    })

    it('should have loading default to false', () => {
      wrapper = mount(ActivityLog, {
        props: {
          activities: mockActivities,
          total: 30,
          page: 1,
          limit: 10,
          totalPages: 3,
          hasNext: true,
          hasPrev: false
        }
      })

      const spinner = wrapper.find('[data-test="loading-spinner"]')
      expect(spinner.exists()).toBe(false)
    })
  })
})
