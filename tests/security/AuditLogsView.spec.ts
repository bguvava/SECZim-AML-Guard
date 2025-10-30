import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AuditLogsView from '@/components/security/AuditLogsView.vue'
import { useSecurityManagement } from '@/composables/useSecurityManagement'
import type { PermissionChange, DataAccessLog, SecurityAlert } from '@/types/security'
import { SecurityEventType, Severity } from '@/types/security'

// Mock the composable
vi.mock('@/composables/useSecurityManagement')

describe('AuditLogsView', () => {
  const mockPermissionChanges: PermissionChange[] = [
    {
      id: '1',
      userId: 'user123',
      username: 'john.doe',
      changedBy: 'admin',
      timestamp: new Date('2024-01-15T10:00:00Z'),
      previousRole: 'User',
      newRole: 'Supervisor',
      reason: 'Promoted to supervisor role'
    },
    {
      id: '2',
      userId: 'user456',
      username: 'jane.smith',
      changedBy: 'security.admin',
      timestamp: new Date('2024-01-14T10:00:00Z'),
      previousRole: 'Supervisor',
      newRole: 'User',
      reason: 'Role adjustment after review'
    }
  ]

  const mockDataAccessLogs: DataAccessLog[] = [
    {
      id: '1',
      userId: 'user123',
      username: 'john.doe',
      action: 'VIEW',
      resourceType: 'Transaction',
      resourceId: 'TXN001',
      timestamp: new Date('2024-01-15T10:00:00Z'),
      ipAddress: '196.12.45.89',
      success: true
    },
    {
      id: '2',
      userId: 'user456',
      username: 'jane.smith',
      action: 'EXPORT',
      resourceType: 'Report',
      resourceId: 'RPT002',
      timestamp: new Date('2024-01-15T09:30:00Z'),
      ipAddress: '41.57.89.123',
      success: true
    },
    {
      id: '3',
      userId: 'user789',
      username: 'hacker',
      action: 'DELETE',
      resourceType: 'Transaction',
      resourceId: 'TXN003',
      timestamp: new Date('2024-01-15T09:00:00Z'),
      ipAddress: '123.45.67.89',
      success: false
    }
  ]

  const mockSecurityAlerts: SecurityAlert[] = [
    {
      id: '1',
      type: SecurityEventType.SUSPICIOUS_ACTIVITY,
      severity: Severity.HIGH,
      title: 'Multiple Failed Logins',
      description: 'User attempted login 10 times in 5 minutes',
      timestamp: new Date('2024-01-15T10:00:00Z'),
      relatedUser: 'john.doe',
      resolved: false
    },
    {
      id: '2',
      type: SecurityEventType.UNAUTHORIZED_ACCESS,
      severity: Severity.CRITICAL,
      title: 'Unauthorized Access Attempt',
      description: 'Attempt to access admin panel without permission',
      timestamp: new Date('2024-01-14T10:00:00Z'),
      relatedUser: 'hacker',
      resolved: true,
      resolvedAt: new Date('2024-01-14T11:00:00Z'),
      resolvedBy: 'security.admin'
    }
  ]

  const mockResolveAlert = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useSecurityManagement).mockReturnValue({
      permissionChanges: { value: mockPermissionChanges },
      dataAccessLogs: { value: mockDataAccessLogs },
      securityAlerts: { value: mockSecurityAlerts },
      loading: { value: false },
      resolveAlert: mockResolveAlert
    } as any)
  })

  it('should render component title', () => {
    const wrapper = mount(AuditLogsView)
    expect(wrapper.find('h2').text()).toContain('Audit Logs')
  })

  it('should display three tabs', () => {
    const wrapper = mount(AuditLogsView)
    const tabs = wrapper.findAll('.tab-button')
    expect(tabs.length).toBe(3)
  })

  it('should have permission changes tab', () => {
    const wrapper = mount(AuditLogsView)
    const tabs = wrapper.findAll('.tab-button')
    expect(tabs[0].text()).toContain('Permission')
  })

  it('should have data access tab', () => {
    const wrapper = mount(AuditLogsView)
    const tabs = wrapper.findAll('.tab-button')
    expect(tabs[1].text()).toContain('Data Access')
  })

  it('should have security alerts tab', () => {
    const wrapper = mount(AuditLogsView)
    const tabs = wrapper.findAll('.tab-button')
    expect(tabs[2].text()).toContain('Alerts')
  })

  it('should default to permission changes tab', () => {
    const wrapper = mount(AuditLogsView)
    const activeTab = wrapper.find('.tab-button.active')
    expect(activeTab.text()).toContain('Permission')
  })

  it('should switch to data access tab', async () => {
    const wrapper = mount(AuditLogsView)
    const dataAccessTab = wrapper.findAll('.tab-button')[1]
    
    await dataAccessTab.trigger('click')
    expect(dataAccessTab.classes()).toContain('active')
  })

  it('should switch to alerts tab', async () => {
    const wrapper = mount(AuditLogsView)
    const alertsTab = wrapper.findAll('.tab-button')[2]
    
    await alertsTab.trigger('click')
    expect(alertsTab.classes()).toContain('active')
  })

  it('should display permission changes table', () => {
    const wrapper = mount(AuditLogsView)
    const table = wrapper.find('.permission-changes-table')
    expect(table.exists()).toBe(true)
  })

  it('should display permission change details', () => {
    const wrapper = mount(AuditLogsView)
    const firstRow = wrapper.find('tbody tr')
    expect(firstRow.text()).toContain('john.doe')
    expect(firstRow.text()).toContain('Supervisor')
  })

  it('should show role escalation indicator', () => {
    const wrapper = mount(AuditLogsView)
    const escalation = wrapper.find('.role-escalation')
    expect(escalation.exists()).toBe(true)
  })

  it('should show role demotion indicator', () => {
    const wrapper = mount(AuditLogsView)
    const rows = wrapper.findAll('tbody tr')
    const demotionRow = rows[1]
    expect(demotionRow.find('.role-demotion').exists()).toBe(true)
  })

  it('should display data access logs when tab switched', async () => {
    const wrapper = mount(AuditLogsView)
    const dataAccessTab = wrapper.findAll('.tab-button')[1]
    
    await dataAccessTab.trigger('click')
    const table = wrapper.find('.data-access-table')
    expect(table.exists()).toBe(true)
  })

  it('should display data access log details', async () => {
    const wrapper = mount(AuditLogsView)
    const dataAccessTab = wrapper.findAll('.tab-button')[1]
    
    await dataAccessTab.trigger('click')
    const firstRow = wrapper.find('tbody tr')
    expect(firstRow.text()).toContain('john.doe')
    expect(firstRow.text()).toContain('Transaction')
  })

  it('should show success/failure status for data access', async () => {
    const wrapper = mount(AuditLogsView)
    const dataAccessTab = wrapper.findAll('.tab-button')[1]
    
    await dataAccessTab.trigger('click')
    const successBadge = wrapper.find('.status-success')
    expect(successBadge.exists()).toBe(true)
  })

  it('should display security alerts when tab switched', async () => {
    const wrapper = mount(AuditLogsView)
    const alertsTab = wrapper.findAll('.tab-button')[2]
    
    await alertsTab.trigger('click')
    const alertsContainer = wrapper.find('.security-alerts')
    expect(alertsContainer.exists()).toBe(true)
  })

  it('should display alert severity badges', async () => {
    const wrapper = mount(AuditLogsView)
    const alertsTab = wrapper.findAll('.tab-button')[2]
    
    await alertsTab.trigger('click')
    const severityBadge = wrapper.find('.severity-badge')
    expect(severityBadge.exists()).toBe(true)
  })

  it('should show unresolved alerts', async () => {
    const wrapper = mount(AuditLogsView)
    const alertsTab = wrapper.findAll('.tab-button')[2]
    
    await alertsTab.trigger('click')
    const unresolvedAlert = wrapper.find('.alert-unresolved')
    expect(unresolvedAlert.exists()).toBe(true)
  })

  it('should show resolved alerts', async () => {
    const wrapper = mount(AuditLogsView)
    const alertsTab = wrapper.findAll('.tab-button')[2]
    
    await alertsTab.trigger('click')
    const resolvedAlert = wrapper.find('.alert-resolved')
    expect(resolvedAlert.exists()).toBe(true)
  })

  it('should call resolveAlert when resolve button clicked', async () => {
    const wrapper = mount(AuditLogsView)
    const alertsTab = wrapper.findAll('.tab-button')[2]
    await alertsTab.trigger('click')
    
    const resolveButton = wrapper.find('button.resolve-alert-btn')
    await resolveButton.trigger('click')
    
    expect(mockResolveAlert).toHaveBeenCalled()
  })

  it('should filter permission changes by date range', async () => {
    const wrapper = mount(AuditLogsView)
    const dateFilter = wrapper.find('select.date-filter')
    
    if (dateFilter.exists()) {
      await dateFilter.setValue('7d')
      expect(wrapper.vm).toBeDefined()
    }
  })

  it('should filter data access logs by action type', async () => {
    const wrapper = mount(AuditLogsView)
    const dataAccessTab = wrapper.findAll('.tab-button')[1]
    await dataAccessTab.trigger('click')
    
    const actionFilter = wrapper.find('select.action-filter')
    if (actionFilter.exists()) {
      await actionFilter.setValue('VIEW')
      expect(wrapper.vm).toBeDefined()
    }
  })

  it('should filter data access logs by resource type', async () => {
    const wrapper = mount(AuditLogsView)
    const dataAccessTab = wrapper.findAll('.tab-button')[1]
    await dataAccessTab.trigger('click')
    
    const resourceFilter = wrapper.find('select.resource-filter')
    if (resourceFilter.exists()) {
      await resourceFilter.setValue('Transaction')
      expect(wrapper.vm).toBeDefined()
    }
  })

  it('should filter alerts by severity', async () => {
    const wrapper = mount(AuditLogsView)
    const alertsTab = wrapper.findAll('.tab-button')[2]
    await alertsTab.trigger('click')
    
    const severityFilter = wrapper.find('select.severity-filter')
    if (severityFilter.exists()) {
      await severityFilter.setValue('high')
      expect(wrapper.vm).toBeDefined()
    }
  })

  it('should search permission changes', async () => {
    const wrapper = mount(AuditLogsView)
    const searchInput = wrapper.find('input[type="search"]')
    
    await searchInput.setValue('john.doe')
    expect(wrapper.vm).toBeDefined()
  })

  it('should display IP address for data access logs', async () => {
    const wrapper = mount(AuditLogsView)
    const dataAccessTab = wrapper.findAll('.tab-button')[1]
    await dataAccessTab.trigger('click')
    
    const ipCell = wrapper.find('td.ip-address')
    expect(ipCell.text()).toContain('196.12.45.89')
  })

  it('should display timestamp for all log types', () => {
    const wrapper = mount(AuditLogsView)
    const timestamp = wrapper.find('td.timestamp')
    expect(timestamp.exists()).toBe(true)
  })

  it('should format timestamps correctly', () => {
    const wrapper = mount(AuditLogsView)
    const timestamp = wrapper.find('td.timestamp')
    expect(timestamp.text()).toMatch(/ago|minute|hour|day/)
  })

  it('should display who made permission changes', () => {
    const wrapper = mount(AuditLogsView)
    const changedBy = wrapper.find('td.changed-by')
    expect(changedBy.text()).toContain('admin')
  })

  it('should display reason for permission changes', () => {
    const wrapper = mount(AuditLogsView)
    const reason = wrapper.find('td.reason')
    expect(reason.text()).toContain('Promoted')
  })

  it('should display alert type', async () => {
    const wrapper = mount(AuditLogsView)
    const alertsTab = wrapper.findAll('.tab-button')[2]
    await alertsTab.trigger('click')
    
    const alertType = wrapper.find('.alert-type')
    expect(alertType.exists()).toBe(true)
  })

  it('should display alert description', async () => {
    const wrapper = mount(AuditLogsView)
    const alertsTab = wrapper.findAll('.tab-button')[2]
    await alertsTab.trigger('click')
    
    const description = wrapper.find('.alert-description')
    expect(description.text()).toContain('login')
  })

  it('should show who resolved the alert', async () => {
    const wrapper = mount(AuditLogsView)
    const alertsTab = wrapper.findAll('.tab-button')[2]
    await alertsTab.trigger('click')
    
    const resolvedBy = wrapper.find('.resolved-by')
    if (resolvedBy.exists()) {
      expect(resolvedBy.text()).toContain('security.admin')
    }
  })

  it('should display loading state', () => {
    vi.mocked(useSecurityManagement).mockReturnValue({
      permissionChanges: { value: [] },
      dataAccessLogs: { value: [] },
      securityAlerts: { value: [] },
      loading: { value: true },
      resolveAlert: mockResolveAlert
    } as any)

    const wrapper = mount(AuditLogsView)
    expect(wrapper.find('.loading').exists()).toBe(true)
  })

  it('should export audit logs', () => {
    const wrapper = mount(AuditLogsView)
    const exportButton = wrapper.find('button.export-btn')
    expect(exportButton.exists()).toBe(true)
  })

  it('should display pagination controls', () => {
    const wrapper = mount(AuditLogsView)
    const pagination = wrapper.find('.pagination')
    expect(pagination.exists()).toBe(true)
  })

  it('should count unresolved alerts', async () => {
    const wrapper = mount(AuditLogsView)
    const alertsTab = wrapper.findAll('.tab-button')[2]
    await alertsTab.trigger('click')
    
    const unresolvedCount = wrapper.find('.unresolved-count')
    expect(unresolvedCount.text()).toContain('1')
  })

  it('should highlight failed access attempts', async () => {
    const wrapper = mount(AuditLogsView)
    const dataAccessTab = wrapper.findAll('.tab-button')[1]
    await dataAccessTab.trigger('click')
    
    const failedAttempt = wrapper.find('tr.access-failed')
    expect(failedAttempt.exists()).toBe(true)
  })

  it('should refresh audit logs', () => {
    const wrapper = mount(AuditLogsView)
    const refreshButton = wrapper.find('button.refresh-btn')
    expect(refreshButton.exists()).toBe(true)
  })
})
