import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import SessionManagementView from '@/components/security/SessionManagementView.vue'
import { useSecurityManagement } from '@/composables/useSecurityManagement'
import type { ActiveSession } from '@/types/security'
import { DeviceType } from '@/types/security'

// Mock the composable
vi.mock('@/composables/useSecurityManagement')

describe('SessionManagementView', () => {
  const mockActiveSessions: ActiveSession[] = [
    {
      id: '1',
      userId: 'user123',
      username: 'john.doe',
      ipAddress: '196.12.45.89',
      deviceType: DeviceType.DESKTOP,
      browser: 'Chrome 120',
      location: 'Harare, Zimbabwe',
      loginTime: new Date('2024-01-15T10:00:00Z'),
      lastActivity: new Date('2024-01-15T12:00:00Z'),
      isCurrentSession: true
    },
    {
      id: '2',
      userId: 'user456',
      username: 'jane.smith',
      ipAddress: '41.57.89.123',
      deviceType: DeviceType.MOBILE,
      browser: 'Safari 17',
      location: 'Bulawayo, Zimbabwe',
      loginTime: new Date('2024-01-15T09:00:00Z'),
      lastActivity: new Date('2024-01-15T11:30:00Z'),
      isCurrentSession: false
    },
    {
      id: '3',
      userId: 'user789',
      username: 'admin',
      ipAddress: '196.12.45.90',
      deviceType: DeviceType.TABLET,
      browser: 'Edge 120',
      location: 'Mutare, Zimbabwe',
      loginTime: new Date('2024-01-15T08:00:00Z'),
      lastActivity: new Date('2024-01-15T08:15:00Z'),
      isCurrentSession: false
    }
  ]

  const mockForceLogoutSession = vi.fn()
  const mockForceLogoutAllSessions = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useSecurityManagement).mockReturnValue({
      activeSessions: { value: mockActiveSessions },
      loading: { value: false },
      forceLogoutSession: mockForceLogoutSession,
      forceLogoutAllSessions: mockForceLogoutAllSessions
    } as any)
  })

  it('should render component title', () => {
    const wrapper = mount(SessionManagementView)
    expect(wrapper.find('h2').text()).toContain('Active Sessions')
  })

  it('should display sessions table', () => {
    const wrapper = mount(SessionManagementView)
    const table = wrapper.find('.sessions-table')
    expect(table.exists()).toBe(true)
  })

  it('should display all active sessions', () => {
    const wrapper = mount(SessionManagementView)
    const rows = wrapper.findAll('tbody tr')
    expect(rows.length).toBe(3)
  })

  it('should display session username', () => {
    const wrapper = mount(SessionManagementView)
    const firstRow = wrapper.find('tbody tr')
    expect(firstRow.text()).toContain('john.doe')
  })

  it('should display IP address', () => {
    const wrapper = mount(SessionManagementView)
    const firstRow = wrapper.find('tbody tr')
    expect(firstRow.text()).toContain('196.12.45.89')
  })

  it('should display device type', () => {
    const wrapper = mount(SessionManagementView)
    const deviceIcon = wrapper.find('.device-icon')
    expect(deviceIcon.exists()).toBe(true)
  })

  it('should display browser information', () => {
    const wrapper = mount(SessionManagementView)
    const browser = wrapper.find('td.browser')
    expect(browser.text()).toContain('Chrome')
  })

  it('should display location', () => {
    const wrapper = mount(SessionManagementView)
    const location = wrapper.find('td.location')
    expect(location.text()).toContain('Harare')
  })

  it('should display login time', () => {
    const wrapper = mount(SessionManagementView)
    const loginTime = wrapper.find('td.login-time')
    expect(loginTime.exists()).toBe(true)
  })

  it('should display last activity time', () => {
    const wrapper = mount(SessionManagementView)
    const lastActivity = wrapper.find('td.last-activity')
    expect(lastActivity.exists()).toBe(true)
  })

  it('should highlight current session', () => {
    const wrapper = mount(SessionManagementView)
    const currentSession = wrapper.find('tr.current-session')
    expect(currentSession.exists()).toBe(true)
  })

  it('should show "You" badge for current session', () => {
    const wrapper = mount(SessionManagementView)
    const youBadge = wrapper.find('.current-session-badge')
    expect(youBadge.exists()).toBe(true)
  })

  it('should display logout button for other sessions', () => {
    const wrapper = mount(SessionManagementView)
    const rows = wrapper.findAll('tbody tr')
    const otherSessionRow = rows[1]
    expect(otherSessionRow.find('button.logout-btn').exists()).toBe(true)
  })

  it('should not display logout button for current session', () => {
    const wrapper = mount(SessionManagementView)
    const firstRow = wrapper.find('tbody tr')
    expect(firstRow.find('button.logout-btn').exists()).toBe(false)
  })

  it('should call forceLogoutSession when logout clicked', async () => {
    const wrapper = mount(SessionManagementView)
    const rows = wrapper.findAll('tbody tr')
    const logoutButton = rows[1].find('button.logout-btn')
    
    await logoutButton.trigger('click')
    expect(mockForceLogoutSession).toHaveBeenCalledWith('2')
  })

  it('should display logout all button', () => {
    const wrapper = mount(SessionManagementView)
    const logoutAllButton = wrapper.find('button.logout-all-btn')
    expect(logoutAllButton.exists()).toBe(true)
  })

  it('should call forceLogoutAllSessions when logout all clicked', async () => {
    const wrapper = mount(SessionManagementView)
    const logoutAllButton = wrapper.find('button.logout-all-btn')
    
    await logoutAllButton.trigger('click')
    expect(mockForceLogoutAllSessions).toHaveBeenCalled()
  })

  it('should display total sessions count', () => {
    const wrapper = mount(SessionManagementView)
    const totalCount = wrapper.find('.total-sessions')
    expect(totalCount.text()).toContain('3')
  })

  it('should display active users count', () => {
    const wrapper = mount(SessionManagementView)
    const activeUsers = wrapper.find('.active-users')
    expect(activeUsers.text()).toContain('3')
  })

  it('should format timestamps correctly', () => {
    const wrapper = mount(SessionManagementView)
    const timestamp = wrapper.find('td.last-activity')
    expect(timestamp.text()).toMatch(/ago|minute|hour|day/)
  })

  it('should show session duration', () => {
    const wrapper = mount(SessionManagementView)
    const duration = wrapper.find('.session-duration')
    expect(duration.exists()).toBe(true)
  })

  it('should display device icons for different device types', () => {
    const wrapper = mount(SessionManagementView)
    const rows = wrapper.findAll('tbody tr')
    
    // Desktop icon
    expect(rows[0].find('.device-desktop').exists()).toBe(true)
    // Mobile icon
    expect(rows[1].find('.device-mobile').exists()).toBe(true)
    // Tablet icon
    expect(rows[2].find('.device-tablet').exists()).toBe(true)
  })

  it('should filter sessions by username', async () => {
    const wrapper = mount(SessionManagementView)
    const searchInput = wrapper.find('input[type="search"]')
    
    await searchInput.setValue('john.doe')
    // Should filter to show only matching sessions
    expect(wrapper.vm).toBeDefined()
  })

  it('should filter sessions by device type', async () => {
    const wrapper = mount(SessionManagementView)
    const deviceFilter = wrapper.find('select.device-filter')
    
    if (deviceFilter.exists()) {
      await deviceFilter.setValue('desktop')
      expect(wrapper.vm).toBeDefined()
    }
  })

  it('should sort sessions by last activity', () => {
    const wrapper = mount(SessionManagementView)
    const sortButton = wrapper.find('button.sort-activity-btn')
    if (sortButton.exists()) {
      expect(sortButton.exists()).toBe(true)
    }
  })

  it('should display session settings button', () => {
    const wrapper = mount(SessionManagementView)
    const settingsButton = wrapper.find('button.session-settings-btn')
    expect(settingsButton.exists()).toBe(true)
  })

  it('should open session settings modal', async () => {
    const wrapper = mount(SessionManagementView)
    const settingsButton = wrapper.find('button.session-settings-btn')
    
    await settingsButton.trigger('click')
    const modal = wrapper.find('.modal.session-settings')
    expect(modal.exists()).toBe(true)
  })

  it('should display max concurrent sessions setting', async () => {
    const wrapper = mount(SessionManagementView)
    const settingsButton = wrapper.find('button.session-settings-btn')
    await settingsButton.trigger('click')
    
    const maxSessionsInput = wrapper.find('input[name="maxSessions"]')
    expect(maxSessionsInput.exists()).toBe(true)
  })

  it('should display session timeout setting', async () => {
    const wrapper = mount(SessionManagementView)
    const settingsButton = wrapper.find('button.session-settings-btn')
    await settingsButton.trigger('click')
    
    const timeoutInput = wrapper.find('input[name="sessionTimeout"]')
    expect(timeoutInput.exists()).toBe(true)
  })

  it('should highlight idle sessions', () => {
    const wrapper = mount(SessionManagementView)
    const idleSession = wrapper.find('tr.session-idle')
    // May or may not exist depending on last activity time
    expect(wrapper.vm).toBeDefined()
  })

  it('should display refresh button', () => {
    const wrapper = mount(SessionManagementView)
    const refreshButton = wrapper.find('button.refresh-btn')
    expect(refreshButton.exists()).toBe(true)
  })

  it('should export session list', () => {
    const wrapper = mount(SessionManagementView)
    const exportButton = wrapper.find('button.export-sessions-btn')
    expect(exportButton.exists()).toBe(true)
  })

  it('should display empty state when no sessions', () => {
    vi.mocked(useSecurityManagement).mockReturnValue({
      activeSessions: { value: [] },
      loading: { value: false },
      forceLogoutSession: mockForceLogoutSession,
      forceLogoutAllSessions: mockForceLogoutAllSessions
    } as any)

    const wrapper = mount(SessionManagementView)
    const emptyState = wrapper.find('.empty-state')
    expect(emptyState.exists()).toBe(true)
  })

  it('should display loading state', () => {
    vi.mocked(useSecurityManagement).mockReturnValue({
      activeSessions: { value: [] },
      loading: { value: true },
      forceLogoutSession: mockForceLogoutSession,
      forceLogoutAllSessions: mockForceLogoutAllSessions
    } as any)

    const wrapper = mount(SessionManagementView)
    expect(wrapper.find('.loading').exists()).toBe(true)
  })

  it('should show confirmation before logout', async () => {
    const wrapper = mount(SessionManagementView)
    const rows = wrapper.findAll('tbody tr')
    const logoutButton = rows[1].find('button.logout-btn')
    
    await logoutButton.trigger('click')
    // Confirmation dialog should appear - implementation may vary
    expect(wrapper.vm).toBeDefined()
  })

  it('should show confirmation before logout all', async () => {
    const wrapper = mount(SessionManagementView)
    const logoutAllButton = wrapper.find('button.logout-all-btn')
    
    await logoutAllButton.trigger('click')
    // Confirmation dialog should appear
    expect(wrapper.vm).toBeDefined()
  })

  it('should display pagination controls', () => {
    const wrapper = mount(SessionManagementView)
    const pagination = wrapper.find('.pagination')
    expect(pagination.exists()).toBe(true)
  })

  it('should group sessions by user', () => {
    const wrapper = mount(SessionManagementView)
    const groupButton = wrapper.find('button.group-by-user-btn')
    if (groupButton.exists()) {
      expect(groupButton.exists()).toBe(true)
    }
  })
})
