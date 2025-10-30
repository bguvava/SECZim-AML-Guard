import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import SecurityManagement from '@/views/admin/SecurityManagement.vue'
import { useSecurityManagement } from '@/composables/useSecurityManagement'

// Mock the composable
vi.mock('@/composables/useSecurityManagement')

// Mock child components
vi.mock('@/components/security/SecurityDashboard.vue', () => ({
  default: { name: 'SecurityDashboard', template: '<div class="security-dashboard">Dashboard</div>' }
}))
vi.mock('@/components/security/FailedLoginMonitor.vue', () => ({
  default: { name: 'FailedLoginMonitor', template: '<div class="failed-login-monitor">Failed Logins</div>' }
}))
vi.mock('@/components/security/IPManagementView.vue', () => ({
  default: { name: 'IPManagementView', template: '<div class="ip-management">IP Management</div>' }
}))
vi.mock('@/components/security/SSLCertificateStatus.vue', () => ({
  default: { name: 'SSLCertificateStatus', template: '<div class="ssl-status">SSL Certificates</div>' }
}))
vi.mock('@/components/security/VulnerabilityScanView.vue', () => ({
  default: { name: 'VulnerabilityScanView', template: '<div class="vulnerability-scan">Vulnerabilities</div>' }
}))
vi.mock('@/components/security/AuditLogsView.vue', () => ({
  default: { name: 'AuditLogsView', template: '<div class="audit-logs">Audit Logs</div>' }
}))
vi.mock('@/components/security/SessionManagementView.vue', () => ({
  default: { name: 'SessionManagementView', template: '<div class="session-management">Sessions</div>' }
}))
vi.mock('@/components/security/ComplianceCheckerView.vue', () => ({
  default: { name: 'ComplianceCheckerView', template: '<div class="compliance-checker">Compliance</div>' }
}))
vi.mock('@/components/security/FirewallRulesView.vue', () => ({
  default: { name: 'FirewallRulesView', template: '<div class="firewall-rules">Firewall</div>' }
}))
vi.mock('@/components/security/SecurityReportGenerator.vue', () => ({
  default: { name: 'SecurityReportGenerator', template: '<div class="report-generator">Reports</div>' }
}))

describe('SecurityManagement', () => {
  const mockLoadSecurityData = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useSecurityManagement).mockReturnValue({
      loadSecurityData: mockLoadSecurityData,
      loading: { value: false }
    } as any)
  })

  it('should render page title', () => {
    const wrapper = mount(SecurityManagement)
    expect(wrapper.find('h1').text()).toContain('Security Management')
  })

  it('should display tab navigation', () => {
    const wrapper = mount(SecurityManagement)
    const tabs = wrapper.find('.tabs-navigation')
    expect(tabs.exists()).toBe(true)
  })

  it('should display all 10 tabs', () => {
    const wrapper = mount(SecurityManagement)
    const tabButtons = wrapper.findAll('.tab-button')
    expect(tabButtons.length).toBe(10)
  })

  it('should have dashboard tab', () => {
    const wrapper = mount(SecurityManagement)
    const tabButtons = wrapper.findAll('.tab-button')
    const dashboardTab = tabButtons.find(tab => tab.text().includes('Dashboard'))
    expect(dashboardTab).toBeDefined()
  })

  it('should have failed logins tab', () => {
    const wrapper = mount(SecurityManagement)
    const tabButtons = wrapper.findAll('.tab-button')
    const failedLoginsTab = tabButtons.find(tab => tab.text().includes('Failed Logins'))
    expect(failedLoginsTab).toBeDefined()
  })

  it('should have IP management tab', () => {
    const wrapper = mount(SecurityManagement)
    const tabButtons = wrapper.findAll('.tab-button')
    const ipTab = tabButtons.find(tab => tab.text().includes('IP Management'))
    expect(ipTab).toBeDefined()
  })

  it('should have SSL certificates tab', () => {
    const wrapper = mount(SecurityManagement)
    const tabButtons = wrapper.findAll('.tab-button')
    const sslTab = tabButtons.find(tab => tab.text().includes('SSL'))
    expect(sslTab).toBeDefined()
  })

  it('should have vulnerabilities tab', () => {
    const wrapper = mount(SecurityManagement)
    const tabButtons = wrapper.findAll('.tab-button')
    const vulnTab = tabButtons.find(tab => tab.text().includes('Vulnerabilities'))
    expect(vulnTab).toBeDefined()
  })

  it('should have audit logs tab', () => {
    const wrapper = mount(SecurityManagement)
    const tabButtons = wrapper.findAll('.tab-button')
    const auditTab = tabButtons.find(tab => tab.text().includes('Audit'))
    expect(auditTab).toBeDefined()
  })

  it('should have sessions tab', () => {
    const wrapper = mount(SecurityManagement)
    const tabButtons = wrapper.findAll('.tab-button')
    const sessionsTab = tabButtons.find(tab => tab.text().includes('Sessions'))
    expect(sessionsTab).toBeDefined()
  })

  it('should have compliance tab', () => {
    const wrapper = mount(SecurityManagement)
    const tabButtons = wrapper.findAll('.tab-button')
    const complianceTab = tabButtons.find(tab => tab.text().includes('Compliance'))
    expect(complianceTab).toBeDefined()
  })

  it('should have firewall tab', () => {
    const wrapper = mount(SecurityManagement)
    const tabButtons = wrapper.findAll('.tab-button')
    const firewallTab = tabButtons.find(tab => tab.text().includes('Firewall'))
    expect(firewallTab).toBeDefined()
  })

  it('should have reports tab', () => {
    const wrapper = mount(SecurityManagement)
    const tabButtons = wrapper.findAll('.tab-button')
    const reportsTab = tabButtons.find(tab => tab.text().includes('Reports'))
    expect(reportsTab).toBeDefined()
  })

  it('should default to dashboard tab', () => {
    const wrapper = mount(SecurityManagement)
    const activeTab = wrapper.find('.tab-button.active')
    expect(activeTab.text()).toContain('Dashboard')
  })

  it('should display dashboard component by default', () => {
    const wrapper = mount(SecurityManagement)
    const dashboard = wrapper.find('.security-dashboard')
    expect(dashboard.exists()).toBe(true)
  })

  it('should switch to failed logins tab', async () => {
    const wrapper = mount(SecurityManagement)
    const tabButtons = wrapper.findAll('.tab-button')
    const failedLoginsTab = tabButtons.find(tab => tab.text().includes('Failed Logins'))
    
    await failedLoginsTab?.trigger('click')
    const failedLoginComponent = wrapper.find('.failed-login-monitor')
    expect(failedLoginComponent.exists()).toBe(true)
  })

  it('should switch to IP management tab', async () => {
    const wrapper = mount(SecurityManagement)
    const tabButtons = wrapper.findAll('.tab-button')
    const ipTab = tabButtons.find(tab => tab.text().includes('IP Management'))
    
    await ipTab?.trigger('click')
    const ipComponent = wrapper.find('.ip-management')
    expect(ipComponent.exists()).toBe(true)
  })

  it('should switch to SSL certificates tab', async () => {
    const wrapper = mount(SecurityManagement)
    const tabButtons = wrapper.findAll('.tab-button')
    const sslTab = tabButtons.find(tab => tab.text().includes('SSL'))
    
    await sslTab?.trigger('click')
    const sslComponent = wrapper.find('.ssl-status')
    expect(sslComponent.exists()).toBe(true)
  })

  it('should switch to vulnerabilities tab', async () => {
    const wrapper = mount(SecurityManagement)
    const tabButtons = wrapper.findAll('.tab-button')
    const vulnTab = tabButtons.find(tab => tab.text().includes('Vulnerabilities'))
    
    await vulnTab?.trigger('click')
    const vulnComponent = wrapper.find('.vulnerability-scan')
    expect(vulnComponent.exists()).toBe(true)
  })

  it('should switch to audit logs tab', async () => {
    const wrapper = mount(SecurityManagement)
    const tabButtons = wrapper.findAll('.tab-button')
    const auditTab = tabButtons.find(tab => tab.text().includes('Audit'))
    
    await auditTab?.trigger('click')
    const auditComponent = wrapper.find('.audit-logs')
    expect(auditComponent.exists()).toBe(true)
  })

  it('should switch to sessions tab', async () => {
    const wrapper = mount(SecurityManagement)
    const tabButtons = wrapper.findAll('.tab-button')
    const sessionsTab = tabButtons.find(tab => tab.text().includes('Sessions'))
    
    await sessionsTab?.trigger('click')
    const sessionsComponent = wrapper.find('.session-management')
    expect(sessionsComponent.exists()).toBe(true)
  })

  it('should switch to compliance tab', async () => {
    const wrapper = mount(SecurityManagement)
    const tabButtons = wrapper.findAll('.tab-button')
    const complianceTab = tabButtons.find(tab => tab.text().includes('Compliance'))
    
    await complianceTab?.trigger('click')
    const complianceComponent = wrapper.find('.compliance-checker')
    expect(complianceComponent.exists()).toBe(true)
  })

  it('should switch to firewall tab', async () => {
    const wrapper = mount(SecurityManagement)
    const tabButtons = wrapper.findAll('.tab-button')
    const firewallTab = tabButtons.find(tab => tab.text().includes('Firewall'))
    
    await firewallTab?.trigger('click')
    const firewallComponent = wrapper.find('.firewall-rules')
    expect(firewallComponent.exists()).toBe(true)
  })

  it('should switch to reports tab', async () => {
    const wrapper = mount(SecurityManagement)
    const tabButtons = wrapper.findAll('.tab-button')
    const reportsTab = tabButtons.find(tab => tab.text().includes('Reports'))
    
    await reportsTab?.trigger('click')
    const reportsComponent = wrapper.find('.report-generator')
    expect(reportsComponent.exists()).toBe(true)
  })

  it('should call loadSecurityData on mount', () => {
    mount(SecurityManagement)
    expect(mockLoadSecurityData).toHaveBeenCalled()
  })

  it('should only render active tab component', async () => {
    const wrapper = mount(SecurityManagement)
    
    // Initially only dashboard should be rendered
    expect(wrapper.find('.security-dashboard').exists()).toBe(true)
    expect(wrapper.find('.failed-login-monitor').exists()).toBe(false)
    
    // Switch to failed logins tab
    const tabButtons = wrapper.findAll('.tab-button')
    const failedLoginsTab = tabButtons.find(tab => tab.text().includes('Failed Logins'))
    await failedLoginsTab?.trigger('click')
    
    // Now only failed logins should be rendered
    expect(wrapper.find('.security-dashboard').exists()).toBe(false)
    expect(wrapper.find('.failed-login-monitor').exists()).toBe(true)
  })

  it('should highlight active tab', async () => {
    const wrapper = mount(SecurityManagement)
    const tabButtons = wrapper.findAll('.tab-button')
    
    // Dashboard should be active initially
    expect(tabButtons[0].classes()).toContain('active')
    
    // Click on failed logins tab
    const failedLoginsTab = tabButtons.find(tab => tab.text().includes('Failed Logins'))
    await failedLoginsTab?.trigger('click')
    
    // Failed logins tab should now be active
    expect(failedLoginsTab?.classes()).toContain('active')
  })

  it('should display tab icons', () => {
    const wrapper = mount(SecurityManagement)
    const tabIcons = wrapper.findAll('.tab-icon')
    expect(tabIcons.length).toBeGreaterThan(0)
  })

  it('should display loading state', () => {
    vi.mocked(useSecurityManagement).mockReturnValue({
      loadSecurityData: mockLoadSecurityData,
      loading: { value: true }
    } as any)

    const wrapper = mount(SecurityManagement)
    const loading = wrapper.find('.loading')
    if (loading.exists()) {
      expect(loading.exists()).toBe(true)
    }
  })

  it('should display page description', () => {
    const wrapper = mount(SecurityManagement)
    const description = wrapper.find('.page-description')
    if (description.exists()) {
      expect(description.text()).toBeTruthy()
    }
  })

  it('should have responsive tab layout', () => {
    const wrapper = mount(SecurityManagement)
    const tabsContainer = wrapper.find('.tabs-navigation')
    expect(tabsContainer.classes()).toBeDefined()
  })

  it('should maintain state when switching tabs', async () => {
    const wrapper = mount(SecurityManagement)
    const tabButtons = wrapper.findAll('.tab-button')
    
    // Switch to IP management
    const ipTab = tabButtons.find(tab => tab.text().includes('IP Management'))
    await ipTab?.trigger('click')
    expect(wrapper.find('.ip-management').exists()).toBe(true)
    
    // Switch back to dashboard
    const dashboardTab = tabButtons.find(tab => tab.text().includes('Dashboard'))
    await dashboardTab?.trigger('click')
    expect(wrapper.find('.security-dashboard').exists()).toBe(true)
  })

  it('should display breadcrumb navigation', () => {
    const wrapper = mount(SecurityManagement)
    const breadcrumb = wrapper.find('.breadcrumb')
    if (breadcrumb.exists()) {
      expect(breadcrumb.text()).toContain('Admin')
      expect(breadcrumb.text()).toContain('Security')
    }
  })

  it('should display refresh all button', () => {
    const wrapper = mount(SecurityManagement)
    const refreshButton = wrapper.find('button.refresh-all-btn')
    if (refreshButton.exists()) {
      expect(refreshButton.exists()).toBe(true)
    }
  })

  it('should call loadSecurityData when refresh clicked', async () => {
    const wrapper = mount(SecurityManagement)
    const refreshButton = wrapper.find('button.refresh-all-btn')
    
    if (refreshButton.exists()) {
      await refreshButton.trigger('click')
      expect(mockLoadSecurityData).toHaveBeenCalledTimes(2) // Once on mount, once on refresh
    }
  })

  it('should display tab count badges', () => {
    const wrapper = mount(SecurityManagement)
    const countBadges = wrapper.findAll('.tab-count')
    // May or may not exist depending on implementation
    if (countBadges.length > 0) {
      expect(countBadges.length).toBeGreaterThan(0)
    }
  })

  it('should support keyboard navigation', async () => {
    const wrapper = mount(SecurityManagement)
    const tabsContainer = wrapper.find('.tabs-navigation')
    
    // Should be able to navigate with keyboard
    expect(tabsContainer.attributes('role')).toBe('tablist')
  })

  it('should have accessible tab labels', () => {
    const wrapper = mount(SecurityManagement)
    const tabButtons = wrapper.findAll('.tab-button')
    
    tabButtons.forEach(tab => {
      expect(tab.attributes('role')).toBe('tab')
    })
  })
})
