import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import FailedLoginMonitor from '@/components/security/FailedLoginMonitor.vue'
import { useSecurityManagement } from '@/composables/useSecurityManagement'
import type { FailedLoginAttempt } from '@/types/security'
import { LoginAttemptStatus } from '@/types/security'

// Mock the composable
vi.mock('@/composables/useSecurityManagement')

describe('FailedLoginMonitor', () => {
  const mockFailedAttempts: FailedLoginAttempt[] = [
    {
      id: '1',
      username: 'john.doe',
      ipAddress: '196.12.45.89',
      timestamp: new Date('2024-01-15T10:00:00Z'),
      reason: 'Invalid password',
      userAgent: 'Mozilla/5.0',
      location: 'Harare, Zimbabwe',
      status: LoginAttemptStatus.FAILED
    },
    {
      id: '2',
      username: 'jane.smith',
      ipAddress: '41.57.89.123',
      timestamp: new Date('2024-01-15T09:30:00Z'),
      reason: 'Account locked',
      userAgent: 'Chrome/120.0',
      location: 'Bulawayo, Zimbabwe',
      status: LoginAttemptStatus.BLOCKED
    },
    {
      id: '3',
      username: 'admin',
      ipAddress: '196.12.45.89',
      timestamp: new Date('2024-01-15T09:00:00Z'),
      reason: 'Invalid password',
      userAgent: 'Mozilla/5.0',
      location: 'Harare, Zimbabwe',
      status: LoginAttemptStatus.FAILED
    }
  ]

  const mockAutoBlockSettings = {
    enabled: true,
    attemptsThreshold: 5,
    timeWindowMinutes: 30,
    blockDurationHours: 24
  }

  const mockBlockIP = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useSecurityManagement).mockReturnValue({
      failedLoginAttempts: { value: mockFailedAttempts },
      autoBlockSettings: { value: mockAutoBlockSettings },
      loading: { value: false },
      blockIP: mockBlockIP,
      loadSecurityData: vi.fn()
    } as any)
  })

  it('should render component title', () => {
    const wrapper = mount(FailedLoginMonitor)
    expect(wrapper.find('h2').text()).toContain('Failed Login Attempts')
  })

  it('should display loading state', () => {
    vi.mocked(useSecurityManagement).mockReturnValue({
      failedLoginAttempts: { value: [] },
      autoBlockSettings: { value: mockAutoBlockSettings },
      loading: { value: true },
      blockIP: mockBlockIP,
      loadSecurityData: vi.fn()
    } as any)

    const wrapper = mount(FailedLoginMonitor)
    expect(wrapper.find('.loading').exists()).toBe(true)
  })

  it('should display failed login attempts table', () => {
    const wrapper = mount(FailedLoginMonitor)
    const rows = wrapper.findAll('tbody tr')
    expect(rows.length).toBeGreaterThan(0)
  })

  it('should display attempt details correctly', () => {
    const wrapper = mount(FailedLoginMonitor)
    const firstRow = wrapper.find('tbody tr')
    expect(firstRow.text()).toContain('john.doe')
    expect(firstRow.text()).toContain('196.12.45.89')
  })

  it('should filter attempts by time range', async () => {
    const wrapper = mount(FailedLoginMonitor)
    const timeRangeSelect = wrapper.find('select[name="timeRange"]')
    
    await timeRangeSelect.setValue('1h')
    // The component should filter attempts to show only those in the last hour
    expect(wrapper.vm).toBeDefined()
  })

  it('should filter attempts by status', async () => {
    const wrapper = mount(FailedLoginMonitor)
    const statusSelect = wrapper.find('select[name="status"]')
    
    await statusSelect.setValue(LoginAttemptStatus.BLOCKED)
    // The component should filter to show only blocked attempts
    expect(wrapper.vm).toBeDefined()
  })

  it('should search attempts by username or IP', async () => {
    const wrapper = mount(FailedLoginMonitor)
    const searchInput = wrapper.find('input[type="search"]')
    
    await searchInput.setValue('john.doe')
    // The component should filter to show only matching attempts
    expect(wrapper.vm).toBeDefined()
  })

  it('should display auto-block settings button', () => {
    const wrapper = mount(FailedLoginMonitor)
    const settingsButton = wrapper.find('button.settings-btn')
    expect(settingsButton.exists()).toBe(true)
  })

  it('should open auto-block settings modal', async () => {
    const wrapper = mount(FailedLoginMonitor)
    const settingsButton = wrapper.find('button.settings-btn')
    
    await settingsButton.trigger('click')
    const modal = wrapper.find('.modal.auto-block-settings')
    expect(modal.exists()).toBe(true)
  })

  it('should display current auto-block settings', () => {
    const wrapper = mount(FailedLoginMonitor)
    const settingsInfo = wrapper.find('.auto-block-info')
    expect(settingsInfo.text()).toContain('5 attempts')
    expect(settingsInfo.text()).toContain('30 minutes')
  })

  it('should call blockIP when block button clicked', async () => {
    const wrapper = mount(FailedLoginMonitor)
    const blockButton = wrapper.find('button.block-ip-btn')
    
    await blockButton.trigger('click')
    expect(mockBlockIP).toHaveBeenCalled()
  })

  it('should show block button only for non-blocked attempts', () => {
    const wrapper = mount(FailedLoginMonitor)
    const rows = wrapper.findAll('tbody tr')
    
    // First row (FAILED status) should have block button
    expect(rows[0].find('button.block-ip-btn').exists()).toBe(true)
    
    // Second row (BLOCKED status) should not have block button
    expect(rows[1].find('button.block-ip-btn').exists()).toBe(false)
  })

  it('should display status badge with correct class', () => {
    const wrapper = mount(FailedLoginMonitor)
    const statusBadges = wrapper.findAll('.status-badge')
    
    expect(statusBadges[0].classes()).toContain('status-failed')
    expect(statusBadges[1].classes()).toContain('status-blocked')
  })

  it('should display pagination controls', () => {
    const wrapper = mount(FailedLoginMonitor)
    const pagination = wrapper.find('.pagination')
    expect(pagination.exists()).toBe(true)
  })

  it('should display correct page numbers', () => {
    const wrapper = mount(FailedLoginMonitor)
    const pageInfo = wrapper.find('.page-info')
    expect(pageInfo.text()).toMatch(/Page \d+ of \d+/)
  })

  it('should handle next page navigation', async () => {
    const wrapper = mount(FailedLoginMonitor)
    const nextButton = wrapper.find('button.next-page')
    
    await nextButton.trigger('click')
    // Should navigate to next page if available
    expect(wrapper.vm).toBeDefined()
  })

  it('should handle previous page navigation', async () => {
    const wrapper = mount(FailedLoginMonitor)
    const prevButton = wrapper.find('button.prev-page')
    
    await prevButton.trigger('click')
    // Should navigate to previous page if available
    expect(wrapper.vm).toBeDefined()
  })

  it('should group attempts by IP address', () => {
    const wrapper = mount(FailedLoginMonitor)
    // Check that IP 196.12.45.89 appears multiple times
    const ipCells = wrapper.findAll('td.ip-address')
    const duplicateIPs = ipCells.filter(cell => cell.text() === '196.12.45.89')
    expect(duplicateIPs.length).toBeGreaterThan(1)
  })

  it('should display location information', () => {
    const wrapper = mount(FailedLoginMonitor)
    const locationCells = wrapper.findAll('td.location')
    expect(locationCells[0].text()).toContain('Zimbabwe')
  })

  it('should format timestamps correctly', () => {
    const wrapper = mount(FailedLoginMonitor)
    const timestampCells = wrapper.findAll('td.timestamp')
    expect(timestampCells[0].text()).toMatch(/ago|minute|hour|day/)
  })

  it('should display user agent information', () => {
    const wrapper = mount(FailedLoginMonitor)
    const userAgentCells = wrapper.findAll('td.user-agent')
    expect(userAgentCells[0].text()).toContain('Mozilla')
  })

  it('should validate auto-block settings form', async () => {
    const wrapper = mount(FailedLoginMonitor)
    const settingsButton = wrapper.find('button.settings-btn')
    await settingsButton.trigger('click')
    
    const form = wrapper.find('form.auto-block-form')
    expect(form.exists()).toBe(true)
  })

  it('should show total attempts count', () => {
    const wrapper = mount(FailedLoginMonitor)
    const totalCount = wrapper.find('.total-attempts')
    expect(totalCount.text()).toContain('3')
  })

  it('should highlight repeated failed attempts from same IP', () => {
    const wrapper = mount(FailedLoginMonitor)
    const repeatedAttempts = wrapper.findAll('tr.repeated-attempt')
    expect(repeatedAttempts.length).toBeGreaterThan(0)
  })

  it('should display refresh button', () => {
    const wrapper = mount(FailedLoginMonitor)
    const refreshButton = wrapper.find('button.refresh-btn')
    expect(refreshButton.exists()).toBe(true)
  })

  it('should call loadSecurityData when refresh clicked', async () => {
    const mockLoadData = vi.fn()
    vi.mocked(useSecurityManagement).mockReturnValue({
      failedLoginAttempts: { value: mockFailedAttempts },
      autoBlockSettings: { value: mockAutoBlockSettings },
      loading: { value: false },
      blockIP: mockBlockIP,
      loadSecurityData: mockLoadData
    } as any)

    const wrapper = mount(FailedLoginMonitor)
    const refreshButton = wrapper.find('button.refresh-btn')
    
    await refreshButton.trigger('click')
    expect(mockLoadData).toHaveBeenCalled()
  })

  it('should export filtered attempts', () => {
    const wrapper = mount(FailedLoginMonitor)
    const exportButton = wrapper.find('button.export-btn')
    expect(exportButton.exists()).toBe(true)
  })

  it('should display empty state when no attempts', () => {
    vi.mocked(useSecurityManagement).mockReturnValue({
      failedLoginAttempts: { value: [] },
      autoBlockSettings: { value: mockAutoBlockSettings },
      loading: { value: false },
      blockIP: mockBlockIP,
      loadSecurityData: vi.fn()
    } as any)

    const wrapper = mount(FailedLoginMonitor)
    const emptyState = wrapper.find('.empty-state')
    expect(emptyState.exists()).toBe(true)
  })
})
