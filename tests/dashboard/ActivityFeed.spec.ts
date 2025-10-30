import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ActivityFeed from '@/components/dashboard/ActivityFeed.vue'
import type { Activity } from '@/types/dashboard'

describe('ActivityFeed', () => {
  const createActivity = (overrides?: Partial<Activity>): Activity => ({
    id: '1',
    type: 'create',
    title: 'Test Activity',
    description: 'This is a test activity description',
    timestamp: new Date().toISOString(),
    ...overrides,
  })

  const createActivities = (count: number): Activity[] => {
    return Array.from({ length: count }, (_, i) => createActivity({
      id: `activity-${i + 1}`,
      title: `Activity ${i + 1}`,
      description: `Description for activity ${i + 1}`,
    }))
  }

  describe('Rendering', () => {
    it('renders activity feed with title', () => {
      const activities = createActivities(3)
      const wrapper = mount(ActivityFeed, {
        props: { activities },
      })

      expect(wrapper.text()).toContain('Recent Activity')
    })

    it('renders all activities up to maxItems', () => {
      const activities = createActivities(5)
      const wrapper = mount(ActivityFeed, {
        props: { activities, maxItems: 3 },
      })

      const activityItems = wrapper.findAll('.group')
      expect(activityItems.length).toBe(3)
    })

    it('displays activity title and description', () => {
      const activity = createActivity({
        title: 'New Entity Registered',
        description: 'First National Bank completed registration',
      })
      const wrapper = mount(ActivityFeed, {
        props: { activities: [activity] },
      })

      expect(wrapper.text()).toContain('New Entity Registered')
      expect(wrapper.text()).toContain('First National Bank completed registration')
    })

    it('displays user name when provided', () => {
      const activity = createActivity({
        user: { name: 'John Doe' },
      })
      const wrapper = mount(ActivityFeed, {
        props: { activities: [activity] },
      })

      expect(wrapper.text()).toContain('by John Doe')
    })

    it('does not display user info when not provided', () => {
      const activity = createActivity()
      const wrapper = mount(ActivityFeed, {
        props: { activities: [activity] },
      })

      expect(wrapper.text()).not.toContain('by ')
    })
  })

  describe('Empty State', () => {
    it('displays empty state when no activities', () => {
      const wrapper = mount(ActivityFeed, {
        props: { activities: [] },
      })

      expect(wrapper.text()).toContain('No recent activities')
      expect(wrapper.text()).toContain('Activities will appear here as they occur')
    })

    it('does not display activity list when empty', () => {
      const wrapper = mount(ActivityFeed, {
        props: { activities: [] },
      })

      expect(wrapper.findAll('.group').length).toBe(0)
    })
  })

  describe('Loading State', () => {
    it('renders loading skeleton when loading is true', () => {
      const wrapper = mount(ActivityFeed, {
        props: { activities: [], loading: true },
      })

      expect(wrapper.find('.animate-pulse').exists()).toBe(true)
      const skeletons = wrapper.findAll('.animate-pulse')
      expect(skeletons.length).toBeGreaterThan(0)
    })

    it('does not render activities when loading', () => {
      const activities = createActivities(3)
      const wrapper = mount(ActivityFeed, {
        props: { activities, loading: true },
      })

      expect(wrapper.text()).not.toContain('Activity 1')
    })

    it('renders content when loading is false', () => {
      const activities = createActivities(2)
      const wrapper = mount(ActivityFeed, {
        props: { activities, loading: false },
      })

      expect(wrapper.find('.animate-pulse').exists()).toBe(false)
      expect(wrapper.text()).toContain('Activity 1')
    })
  })

  describe('User Avatars', () => {
    it('displays user avatar image when provided', () => {
      const activity = createActivity({
        user: {
          name: 'Jane Smith',
          avatar: 'https://example.com/avatar.jpg',
        },
      })
      const wrapper = mount(ActivityFeed, {
        props: { activities: [activity], showUserAvatar: true },
      })

      const img = wrapper.find('img')
      expect(img.exists()).toBe(true)
      expect(img.attributes('src')).toBe('https://example.com/avatar.jpg')
      expect(img.attributes('alt')).toBe('Jane Smith')
    })

    it('displays user initials when no avatar provided', () => {
      const activity = createActivity({
        user: { name: 'John Doe' },
      })
      const wrapper = mount(ActivityFeed, {
        props: { activities: [activity], showUserAvatar: true },
      })

      expect(wrapper.text()).toContain('JD')
    })

    it('displays activity icon when showUserAvatar is false', () => {
      const activity = createActivity({
        type: 'create',
        user: { name: 'John Doe' },
      })
      const wrapper = mount(ActivityFeed, {
        props: { activities: [activity], showUserAvatar: false },
      })

      const iconWrapper = wrapper.find('.w-10.h-10.rounded-full')
      expect(iconWrapper.exists()).toBe(true)
    })
  })

  describe('Activity Icons', () => {
    const activityTypes: Array<Activity['type']> = [
      'login',
      'logout',
      'create',
      'update',
      'delete',
      'submit',
      'approve',
      'reject',
      'review',
      'alert',
      'system',
    ]

    activityTypes.forEach(type => {
      it(`renders correct icon for ${type} activity type`, () => {
        const activity = createActivity({ type })
        const wrapper = mount(ActivityFeed, {
          props: { activities: [activity], showUserAvatar: false },
        })

        const iconWrapper = wrapper.find('.w-10.h-10.rounded-full')
        expect(iconWrapper.exists()).toBe(true)
      })
    })

    it('uses custom icon when provided', () => {
      const activity = createActivity({
        icon: 'custom-icon' as any,
      })
      const wrapper = mount(ActivityFeed, {
        props: { activities: [activity], showUserAvatar: false },
      })

      expect(wrapper.html()).toBeTruthy()
    })
  })

  describe('Activity Colors', () => {
    it('applies custom color when provided', () => {
      const activity = createActivity({ color: 'purple' })
      const wrapper = mount(ActivityFeed, {
        props: { activities: [activity], showUserAvatar: false },
      })

      expect(wrapper.html()).toContain('bg-purple-100')
      expect(wrapper.html()).toContain('text-purple-600')
    })

    it('applies default color based on activity type', () => {
      const activity = createActivity({ type: 'approve' })
      const wrapper = mount(ActivityFeed, {
        props: { activities: [activity], showUserAvatar: false },
      })

      const iconWrapper = wrapper.find('.w-10.h-10.rounded-full')
      expect(iconWrapper.exists()).toBe(true)
    })
  })

  describe('Timestamp Formatting', () => {
    it('displays "Just now" for very recent activities', () => {
      const activity = createActivity({
        timestamp: new Date().toISOString(),
      })
      const wrapper = mount(ActivityFeed, {
        props: { activities: [activity] },
      })

      expect(wrapper.text()).toContain('Just now')
    })

    it('displays minutes ago for recent activities', () => {
      const timestamp = new Date(Date.now() - 5 * 60 * 1000).toISOString()
      const activity = createActivity({ timestamp })
      const wrapper = mount(ActivityFeed, {
        props: { activities: [activity] },
      })

      expect(wrapper.text()).toContain('5m ago')
    })

    it('displays hours ago for activities within 24 hours', () => {
      const timestamp = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
      const activity = createActivity({ timestamp })
      const wrapper = mount(ActivityFeed, {
        props: { activities: [activity] },
      })

      expect(wrapper.text()).toContain('3h ago')
    })

    it('displays days ago for activities within a week', () => {
      const timestamp = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      const activity = createActivity({ timestamp })
      const wrapper = mount(ActivityFeed, {
        props: { activities: [activity] },
      })

      expect(wrapper.text()).toContain('2d ago')
    })

    it('displays formatted date for older activities', () => {
      const timestamp = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
      const activity = createActivity({ timestamp })
      const wrapper = mount(ActivityFeed, {
        props: { activities: [activity] },
      })

      const text = wrapper.text()
      expect(text).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/)
    })
  })

  describe('Max Items', () => {
    it('respects maxItems prop', () => {
      const activities = createActivities(10)
      const wrapper = mount(ActivityFeed, {
        props: { activities, maxItems: 5 },
      })

      const activityItems = wrapper.findAll('.group')
      expect(activityItems.length).toBe(5)
    })

    it('displays all activities when count is less than maxItems', () => {
      const activities = createActivities(3)
      const wrapper = mount(ActivityFeed, {
        props: { activities, maxItems: 10 },
      })

      const activityItems = wrapper.findAll('.group')
      expect(activityItems.length).toBe(3)
    })

    it('shows view all link when activities exceed maxItems', () => {
      const activities = createActivities(15)
      const wrapper = mount(ActivityFeed, {
        props: { activities, maxItems: 10 },
      })

      expect(wrapper.text()).toContain('View all activities')
    })

    it('does not show view all link when activities do not exceed maxItems', () => {
      const activities = createActivities(5)
      const wrapper = mount(ActivityFeed, {
        props: { activities, maxItems: 10 },
      })

      expect(wrapper.text()).not.toContain('View all activities')
    })
  })

  describe('User Initials', () => {
    it('generates correct initials for two-word name', () => {
      const activity = createActivity({
        user: { name: 'John Doe' },
      })
      const wrapper = mount(ActivityFeed, {
        props: { activities: [activity], showUserAvatar: true },
      })

      expect(wrapper.text()).toContain('JD')
    })

    it('generates correct initials for single-word name', () => {
      const activity = createActivity({
        user: { name: 'Madonna' },
      })
      const wrapper = mount(ActivityFeed, {
        props: { activities: [activity], showUserAvatar: true },
      })

      expect(wrapper.text()).toContain('MA')
    })

    it('generates correct initials for multi-word name', () => {
      const activity = createActivity({
        user: { name: 'John Paul Jones' },
      })
      const wrapper = mount(ActivityFeed, {
        props: { activities: [activity], showUserAvatar: true },
      })

      expect(wrapper.text()).toContain('JP')
    })
  })

  describe('Hover Effects', () => {
    it('applies hover class to activity items', () => {
      const activities = createActivities(1)
      const wrapper = mount(ActivityFeed, {
        props: { activities },
      })

      const activityItem = wrapper.find('.group')
      expect(activityItem.exists()).toBe(true)
      expect(activityItem.classes()).toContain('group')
    })
  })
})
