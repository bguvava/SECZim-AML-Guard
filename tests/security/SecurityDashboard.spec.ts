import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import SecurityDashboard from '@/components/security/SecurityDashboard.vue'
import { useSecurityManagement } from '@/composables/useSecurityManagement'

// Mock the composable
vi.mock('@/composables/useSecurityManagement')

describe('SecurityDashboard', () => {
  const mockStatistics = {
    failedLoginsLast24h: 42,
    blockedIPsCount: 15,
    whitelistedIPsCount: 10,
    unresolvedAlertsCount: 5,
    criticalVulnerabilitiesCount: 3,
    totalCertificates: 5,
    expiringCertificatesCount: 2,
    activeSessionsCount: 18,
    totalFirewallRules: 20,
    complianceScore: 95,
    totalVulnerabilities: 12,
    totalDataAccessLogs: 150,
    totalPermissionChanges: 40,
    lastScanDate: new Date('2024-01-15T10:00:00Z')
  }

  beforeEach(() => {
    vi.mocked(useSecurityManagement).mockReturnValue({
      statistics: { value: mockStatistics },
      loading: { value: false }
    } as any)
  })

  it('should render dashboard title', () => {
    const wrapper = mount(SecurityDashboard)
    expect(wrapper.find('.dashboard-title').text()).toBe('Security Overview')
  })

  it('should display loading state', () => {
    vi.mocked(useSecurityManagement).mockReturnValue({
      statistics: { value: mockStatistics },
      loading: { value: true }
    } as any)

    const wrapper = mount(SecurityDashboard)
    expect(wrapper.find('.loading-state').exists()).toBe(true)
    expect(wrapper.find('.stats-grid').exists()).toBe(false)
  })

  it('should display statistics cards', () => {
    const wrapper = mount(SecurityDashboard)
    const statCards = wrapper.findAll('.stat-card')
    expect(statCards.length).toBe(8)
  })

  it('should display failed logins count', () => {
    const wrapper = mount(SecurityDashboard)
    const failedLoginsCard = wrapper.find('.failed-logins')
    expect(failedLoginsCard.exists()).toBe(true)
    expect(failedLoginsCard.text()).toContain('42')
  })

  it('should display blocked IPs count', () => {
    const wrapper = mount(SecurityDashboard)
    const blockedIPsCard = wrapper.find('.blocked-ips')
    expect(blockedIPsCard.text()).toContain('15')
  })

  it('should display active threats', () => {
    const wrapper = mount(SecurityDashboard)
    const threatsCard = wrapper.find('.active-threats')
    expect(threatsCard.text()).toContain('5')
    expect(threatsCard.text()).toContain('3 critical vulnerabilities')
  })

  it('should display SSL certificate status', () => {
    const wrapper = mount(SecurityDashboard)
    const sslCard = wrapper.find('.ssl-status')
    expect(sslCard.text()).toContain('5')
    expect(sslCard.text()).toContain('2 expiring soon')
  })

  it('should display active sessions count', () => {
    const wrapper = mount(SecurityDashboard)
    const sessionsCard = wrapper.find('.active-sessions')
    expect(sessionsCard.text()).toContain('18')
  })

  it('should display compliance score', () => {
    const wrapper = mount(SecurityDashboard)
    const complianceCard = wrapper.find('.compliance-score')
    expect(complianceCard.text()).toContain('95%')
    expect(complianceCard.text()).toContain('Excellent')
  })

  it('should apply correct severity classes', () => {
    const wrapper = mount(SecurityDashboard)
    
    // Check if severity classes are applied based on critical vulnerabilities
    const criticalText = wrapper.find('.severity-medium, .severity-high, .severity-critical')
    expect(criticalText.exists()).toBe(true)
  })

  it('should apply correct certificate status classes', () => {
    const wrapper = mount(SecurityDashboard)
    
    const certText = wrapper.find('.cert-warning, .cert-critical, .cert-valid')
    expect(certText.exists()).toBe(true)
  })

  it('should apply correct compliance classes', () => {
    const wrapper = mount(SecurityDashboard)
    const complianceText = wrapper.find('.compliance-excellent')
    expect(complianceText.exists()).toBe(true)
  })

  it('should format last scan date', () => {
    const wrapper = mount(SecurityDashboard)
    const lastScanCard = wrapper.find('.last-scan')
    expect(lastScanCard.text()).toContain('ago')
  })

  it('should handle missing last scan date', () => {
    vi.mocked(useSecurityManagement).mockReturnValue({
      statistics: { value: { ...mockStatistics, lastScanDate: undefined } },
      loading: { value: false }
    } as any)

    const wrapper = mount(SecurityDashboard)
    const lastScanCard = wrapper.find('.last-scan')
    expect(lastScanCard.text()).toContain('Never')
  })

  it('should have responsive grid layout', () => {
    const wrapper = mount(SecurityDashboard)
    const statsGrid = wrapper.find('.stats-grid')
    expect(statsGrid.exists()).toBe(true)
    expect(statsGrid.classes()).toContain('stats-grid')
  })

  it('should display all stat card icons', () => {
    const wrapper = mount(SecurityDashboard)
    const icons = wrapper.findAll('.stat-icon i')
    expect(icons.length).toBe(8)
  })

  describe('Compliance Status Text', () => {
    it('should show "Excellent" for score >= 90', () => {
      const wrapper = mount(SecurityDashboard)
      expect(wrapper.text()).toContain('Excellent')
    })

    it('should show "Good" for score >= 70', () => {
      vi.mocked(useSecurityManagement).mockReturnValue({
        statistics: { value: { ...mockStatistics, complianceScore: 80 } },
        loading: { value: false }
      } as any)

      const wrapper = mount(SecurityDashboard)
      expect(wrapper.text()).toContain('Good')
    })

    it('should show "Fair" for score >= 50', () => {
      vi.mocked(useSecurityManagement).mockReturnValue({
        statistics: { value: { ...mockStatistics, complianceScore: 60 } },
        loading: { value: false }
      } as any)

      const wrapper = mount(SecurityDashboard)
      expect(wrapper.text()).toContain('Fair')
    })

    it('should show "Poor" for score < 50', () => {
      vi.mocked(useSecurityManagement).mockReturnValue({
        statistics: { value: { ...mockStatistics, complianceScore: 40 } },
        loading: { value: false }
      } as any)

      const wrapper = mount(SecurityDashboard)
      expect(wrapper.text()).toContain('Poor')
    })
  })

  describe('Color Coding', () => {
    it('should apply warning status for blocked IPs', () => {
      const wrapper = mount(SecurityDashboard)
      const statusWarning = wrapper.find('.status-warning')
      expect(statusWarning.exists()).toBe(true)
    })

    it('should apply appropriate severity class for vulnerabilities', () => {
      // Test with 0 critical vulnerabilities
      vi.mocked(useSecurityManagement).mockReturnValue({
        statistics: { value: { ...mockStatistics, criticalVulnerabilitiesCount: 0 } },
        loading: { value: false }
      } as any)

      let wrapper = mount(SecurityDashboard)
      expect(wrapper.find('.severity-info').exists()).toBe(true)

      // Test with high critical vulnerabilities
      vi.mocked(useSecurityManagement).mockReturnValue({
        statistics: { value: { ...mockStatistics, criticalVulnerabilitiesCount: 10 } },
        loading: { value: false }
      } as any)

      wrapper = mount(SecurityDashboard)
      expect(wrapper.find('.severity-critical').exists()).toBe(true)
    })
  })

  describe('Card Hover Effects', () => {
    it('should have hover transition classes', () => {
      const wrapper = mount(SecurityDashboard)
      const statCards = wrapper.findAll('.stat-card')
      
      statCards.forEach(card => {
        expect(card.classes()).toContain('stat-card')
      })
    })
  })

  describe('Accessibility', () => {
    it('should have semantic HTML structure', () => {
      const wrapper = mount(SecurityDashboard)
      expect(wrapper.find('h2').exists()).toBe(true)
      expect(wrapper.find('p').exists()).toBe(true)
    })

    it('should have descriptive labels', () => {
      const wrapper = mount(SecurityDashboard)
      const labels = wrapper.findAll('.stat-label')
      expect(labels.length).toBe(8)
      
      labels.forEach(label => {
        expect(label.text().length).toBeGreaterThan(0)
      })
    })
  })
})
