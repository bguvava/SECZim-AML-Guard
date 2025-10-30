/**
 * SessionManagement Component Tests
 * Comprehensive test suite for active session management
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import SessionManagement from '@/components/profile/SessionManagement.vue'
import type { Session } from '@/types/profile'

const mockSessions: Session[] = [
  {
    id: 'session-1',
    deviceName: 'Chrome on Windows',
    deviceType: 'desktop',
    browser: 'Chrome',
    browserVersion: '119.0',
    os: 'Windows 11',
    ipAddress: '192.168.1.100',
    location: {
      city: 'New York',
      region: 'NY',
      country: 'US'
    },
    lastActivity: new Date().toISOString(),
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    isCurrent: true
  },
  {
    id: 'session-2',
    deviceName: 'Safari on iPhone',
    deviceType: 'mobile',
    browser: 'Safari',
    browserVersion: '17.0',
    os: 'iOS 17',
    ipAddress: '192.168.1.105',
    location: {
      city: 'New York',
      region: 'NY',
      country: 'US'
    },
    lastActivity: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    isCurrent: false
  },
  {
    id: 'session-3',
    deviceName: 'Firefox on Mac',
    deviceType: 'desktop',
    browser: 'Firefox',
    browserVersion: '120.0',
    os: 'macOS 14',
    ipAddress: '10.0.0.50',
    location: {
      city: 'Brooklyn',
      region: 'NY',
      country: 'US'
    },
    lastActivity: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    isCurrent: false
  }
]

describe('SessionManagement', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Component Rendering', () => {
    it('should render all sessions', () => {
      wrapper = mount(SessionManagement, {
        props: {
          sessions: mockSessions,
          loading: false
        }
      })

      const sessionItems = wrapper.findAll('[data-test^="session-"]')
      expect(sessionItems.length).toBe(3)
    })

    it('should render current session indicator', () => {
      wrapper = mount(SessionManagement, {
        props: {
          sessions: mockSessions,
          loading: false
        }
      })

      const currentBadge = wrapper.find('[data-test="current-session-badge"]')
      expect(currentBadge.exists()).toBe(true)
      expect(currentBadge.text()).toContain('Current Session')
    })

    it('should render device names', () => {
      wrapper = mount(SessionManagement, {
        props: {
          sessions: mockSessions,
          loading: false
        }
      })

      expect(wrapper.text()).toContain('Chrome on Windows')
      expect(wrapper.text()).toContain('Safari on iPhone')
      expect(wrapper.text()).toContain('Firefox on Mac')
    })

    it('should render device type icons', () => {
      wrapper = mount(SessionManagement, {
        props: {
          sessions: mockSessions,
          loading: false
        }
      })

      const desktopIcons = wrapper.findAll('[data-test="device-icon-desktop"]')
      const mobileIcons = wrapper.findAll('[data-test="device-icon-mobile"]')
      
      expect(desktopIcons.length).toBe(2)
      expect(mobileIcons.length).toBe(1)
    })

    it('should render IP addresses', () => {
      wrapper = mount(SessionManagement, {
        props: {
          sessions: mockSessions,
          loading: false
        }
      })

      expect(wrapper.text()).toContain('192.168.1.100')
      expect(wrapper.text()).toContain('192.168.1.105')
      expect(wrapper.text()).toContain('10.0.0.50')
    })

    it('should render location information', () => {
      wrapper = mount(SessionManagement, {
        props: {
          sessions: mockSessions,
          loading: false
        }
      })

      expect(wrapper.text()).toContain('New York, NY')
      expect(wrapper.text()).toContain('Brooklyn, NY')
    })
  })

  describe('Last Activity Display', () => {
    it('should display "Active now" for current session', () => {
      wrapper = mount(SessionManagement, {
        props: {
          sessions: mockSessions,
          loading: false
        }
      })

      expect(wrapper.text()).toContain('Active now')
    })

    it('should display relative time for recent activity', () => {
      wrapper = mount(SessionManagement, {
        props: {
          sessions: mockSessions,
          loading: false
        }
      })

      expect(wrapper.text()).toMatch(/30m ago|minutes ago/)
    })

    it('should display days for older activity', () => {
      wrapper = mount(SessionManagement, {
        props: {
          sessions: mockSessions,
          loading: false
        }
      })

      expect(wrapper.text()).toMatch(/5d ago|days ago/)
    })
  })

  describe('Session Details', () => {
    it('should display browser and version', () => {
      wrapper = mount(SessionManagement, {
        props: {
          sessions: mockSessions,
          loading: false
        }
      })

      expect(wrapper.text()).toContain('Chrome 119.0')
      expect(wrapper.text()).toContain('Safari 17.0')
      expect(wrapper.text()).toContain('Firefox 120.0')
    })

    it('should display operating system', () => {
      wrapper = mount(SessionManagement, {
        props: {
          sessions: mockSessions,
          loading: false
        }
      })

      expect(wrapper.text()).toContain('Windows 11')
      expect(wrapper.text()).toContain('iOS 17')
      expect(wrapper.text()).toContain('macOS 14')
    })

    it('should display session creation time', () => {
      wrapper = mount(SessionManagement, {
        props: {
          sessions: mockSessions,
          loading: false
        }
      })

      expect(wrapper.text()).toMatch(/First seen:|Created:/)
    })
  })

  describe('Revoke Single Session', () => {
    it('should emit revoke event for non-current session', async () => {
      wrapper = mount(SessionManagement, {
        props: {
          sessions: mockSessions,
          loading: false
        }
      })

      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)
      
      const revokeButton = wrapper.find('[data-test="revoke-session-2"]')
      await revokeButton.trigger('click')

      expect(wrapper.emitted('revoke')).toBeTruthy()
      expect(wrapper.emitted('revoke')?.[0]).toEqual(['session-2'])
      
      confirmSpy.mockRestore()
    })

    it('should show confirmation dialog before revoking', async () => {
      wrapper = mount(SessionManagement, {
        props: {
          sessions: mockSessions,
          loading: false
        }
      })

      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)
      
      const revokeButton = wrapper.find('[data-test="revoke-session-2"]')
      await revokeButton.trigger('click')

      expect(confirmSpy).toHaveBeenCalledWith('Are you sure you want to revoke this session?')
      
      confirmSpy.mockRestore()
    })

    it('should not revoke when confirmation declined', async () => {
      wrapper = mount(SessionManagement, {
        props: {
          sessions: mockSessions,
          loading: false
        }
      })

      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false)
      
      const revokeButton = wrapper.find('[data-test="revoke-session-2"]')
      await revokeButton.trigger('click')

      expect(wrapper.emitted('revoke')).toBeFalsy()
      
      confirmSpy.mockRestore()
    })

    it('should not show revoke button for current session', () => {
      wrapper = mount(SessionManagement, {
        props: {
          sessions: mockSessions,
          loading: false
        }
      })

      const currentSessionRevoke = wrapper.find('[data-test="revoke-session-1"]')
      expect(currentSessionRevoke.exists()).toBe(false)
    })
  })

  describe('Revoke All Sessions', () => {
    it('should emit revokeAll event', async () => {
      wrapper = mount(SessionManagement, {
        props: {
          sessions: mockSessions,
          loading: false
        }
      })

      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)
      
      const revokeAllButton = wrapper.find('[data-test="revoke-all-button"]')
      await revokeAllButton.trigger('click')

      expect(wrapper.emitted('revokeAll')).toBeTruthy()
      
      confirmSpy.mockRestore()
    })

    it('should show confirmation dialog before revoking all', async () => {
      wrapper = mount(SessionManagement, {
        props: {
          sessions: mockSessions,
          loading: false
        }
      })

      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)
      
      const revokeAllButton = wrapper.find('[data-test="revoke-all-button"]')
      await revokeAllButton.trigger('click')

      expect(confirmSpy).toHaveBeenCalledWith(
        'Are you sure you want to revoke all other sessions? This will sign you out on all other devices.'
      )
      
      confirmSpy.mockRestore()
    })

    it('should not revoke all when confirmation declined', async () => {
      wrapper = mount(SessionManagement, {
        props: {
          sessions: mockSessions,
          loading: false
        }
      })

      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false)
      
      const revokeAllButton = wrapper.find('[data-test="revoke-all-button"]')
      await revokeAllButton.trigger('click')

      expect(wrapper.emitted('revokeAll')).toBeFalsy()
      
      confirmSpy.mockRestore()
    })

    it('should not show revoke all button when only current session exists', () => {
      const singleSession = [mockSessions[0]]
      
      wrapper = mount(SessionManagement, {
        props: {
          sessions: singleSession,
          loading: false
        }
      })

      const revokeAllButton = wrapper.find('[data-test="revoke-all-button"]')
      expect(revokeAllButton.exists()).toBe(false)
    })

    it('should show revoke all button when multiple sessions exist', () => {
      wrapper = mount(SessionManagement, {
        props: {
          sessions: mockSessions,
          loading: false
        }
      })

      const revokeAllButton = wrapper.find('[data-test="revoke-all-button"]')
      expect(revokeAllButton.exists()).toBe(true)
    })

    it('should display correct count in revoke all button', () => {
      wrapper = mount(SessionManagement, {
        props: {
          sessions: mockSessions,
          loading: false
        }
      })

      const revokeAllButton = wrapper.find('[data-test="revoke-all-button"]')
      expect(revokeAllButton.text()).toContain('Revoke All Other Sessions (2)')
    })
  })

  describe('Empty State', () => {
    it('should show empty state when no sessions', () => {
      wrapper = mount(SessionManagement, {
        props: {
          sessions: [],
          loading: false
        }
      })

      const emptyState = wrapper.find('[data-test="empty-state"]')
      expect(emptyState.exists()).toBe(true)
      expect(emptyState.text()).toContain('No active sessions')
    })

    it('should not show sessions list when empty', () => {
      wrapper = mount(SessionManagement, {
        props: {
          sessions: [],
          loading: false
        }
      })

      const sessionItems = wrapper.findAll('[data-test^="session-"]')
      expect(sessionItems.length).toBe(0)
    })
  })

  describe('Loading State', () => {
    it('should disable revoke buttons when loading', () => {
      wrapper = mount(SessionManagement, {
        props: {
          sessions: mockSessions,
          loading: true
        }
      })

      const revokeButton = wrapper.find('[data-test="revoke-session-2"]')
      expect(revokeButton.attributes('disabled')).toBeDefined()
    })

    it('should disable revoke all button when loading', () => {
      wrapper = mount(SessionManagement, {
        props: {
          sessions: mockSessions,
          loading: true
        }
      })

      const revokeAllButton = wrapper.find('[data-test="revoke-all-button"]')
      expect(revokeAllButton.attributes('disabled')).toBeDefined()
    })

    it('should show loading spinner when loading', () => {
      wrapper = mount(SessionManagement, {
        props: {
          sessions: mockSessions,
          loading: true
        }
      })

      const spinner = wrapper.find('[data-test="loading-spinner"]')
      expect(spinner.exists()).toBe(true)
    })
  })

  describe('Session Sorting', () => {
    it('should display current session first', () => {
      wrapper = mount(SessionManagement, {
        props: {
          sessions: mockSessions,
          loading: false
        }
      })

      const firstSession = wrapper.find('[data-test="session-session-1"]')
      const currentBadge = firstSession.find('[data-test="current-session-badge"]')
      expect(currentBadge.exists()).toBe(true)
    })

    it('should sort other sessions by last activity', () => {
      wrapper = mount(SessionManagement, {
        props: {
          sessions: mockSessions,
          loading: false
        }
      })

      const sessionItems = wrapper.findAll('[data-test^="session-session"]')
      expect(sessionItems.length).toBe(3)
      
      // First should be current
      expect(sessionItems[0].attributes('data-test')).toBe('session-session-1')
    })
  })

  describe('Responsive Design', () => {
    it('should render mobile-friendly layout', () => {
      wrapper = mount(SessionManagement, {
        props: {
          sessions: mockSessions,
          loading: false
        }
      })

      const container = wrapper.find('[data-test="sessions-container"]')
      expect(container.exists()).toBe(true)
    })

    it('should stack session details vertically on mobile', () => {
      wrapper = mount(SessionManagement, {
        props: {
          sessions: mockSessions,
          loading: false
        }
      })

      const sessionCard = wrapper.find('[data-test="session-session-1"]')
      expect(sessionCard.classes()).toContain('flex-col')
    })
  })

  describe('Props Validation', () => {
    it('should accept valid props', () => {
      expect(() => {
        mount(SessionManagement, {
          props: {
            sessions: mockSessions,
            loading: true
          }
        })
      }).not.toThrow()
    })

    it('should have loading default to false', () => {
      wrapper = mount(SessionManagement, {
        props: {
          sessions: mockSessions
        }
      })

      const revokeButton = wrapper.find('[data-test="revoke-session-2"]')
      expect(revokeButton.attributes('disabled')).toBeUndefined()
    })
  })
})
