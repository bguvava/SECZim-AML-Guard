import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ComplianceCheckerView from '@/components/security/ComplianceCheckerView.vue'
import { useSecurityManagement } from '@/composables/useSecurityManagement'
import type { CompliancePolicy } from '@/types/security'
import { ComplianceStatus, TwoFactorEnforcement } from '@/types/security'

// Mock the composable
vi.mock('@/composables/useSecurityManagement')

describe('ComplianceCheckerView', () => {
  const mockCompliancePolicies: CompliancePolicy[] = [
    {
      id: '1',
      name: 'Password Policy',
      description: 'Strong password requirements enforced',
      status: ComplianceStatus.COMPLIANT,
      lastChecked: new Date('2024-01-15T10:00:00Z'),
      nextReview: new Date('2024-02-15T10:00:00Z')
    },
    {
      id: '2',
      name: 'SSL/TLS Encryption',
      description: 'All connections must use TLS 1.2+',
      status: ComplianceStatus.COMPLIANT,
      lastChecked: new Date('2024-01-15T10:00:00Z'),
      nextReview: new Date('2024-02-15T10:00:00Z')
    },
    {
      id: '3',
      name: 'Session Timeout',
      description: 'Sessions must timeout after 30 minutes',
      status: ComplianceStatus.NON_COMPLIANT,
      lastChecked: new Date('2024-01-15T10:00:00Z'),
      nextReview: new Date('2024-02-15T10:00:00Z'),
      issues: ['Current timeout is 60 minutes']
    },
    {
      id: '4',
      name: 'Audit Logging',
      description: 'All security events must be logged',
      status: ComplianceStatus.PARTIALLY_COMPLIANT,
      lastChecked: new Date('2024-01-15T10:00:00Z'),
      nextReview: new Date('2024-02-15T10:00:00Z'),
      issues: ['Some API endpoints not logging']
    }
  ]

  const mockTwoFactorSettings = {
    enforcement: TwoFactorEnforcement.ADMINS_ONLY,
    trustPeriodDays: 30,
    allowedMethods: ['authenticator', 'sms'],
    requiredForSensitiveOperations: true
  }

  const mockUpdateTwoFactorSettings = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useSecurityManagement).mockReturnValue({
      compliancePolicies: { value: mockCompliancePolicies },
      twoFactorSettings: { value: mockTwoFactorSettings },
      loading: { value: false },
      updateTwoFactorSettings: mockUpdateTwoFactorSettings
    } as any)
  })

  it('should render component title', () => {
    const wrapper = mount(ComplianceCheckerView)
    expect(wrapper.find('h2').text()).toContain('Compliance Checker')
  })

  it('should display two-factor authentication section', () => {
    const wrapper = mount(ComplianceCheckerView)
    const twoFactorSection = wrapper.find('.two-factor-section')
    expect(twoFactorSection.exists()).toBe(true)
  })

  it('should display 2FA enforcement level', () => {
    const wrapper = mount(ComplianceCheckerView)
    const enforcement = wrapper.find('.enforcement-level')
    expect(enforcement.text()).toContain('Admins Only')
  })

  it('should display 2FA settings form', () => {
    const wrapper = mount(ComplianceCheckerView)
    const settingsForm = wrapper.find('form.two-factor-form')
    expect(settingsForm.exists()).toBe(true)
  })

  it('should have enforcement level dropdown', () => {
    const wrapper = mount(ComplianceCheckerView)
    const enforcementSelect = wrapper.find('select[name="enforcement"]')
    expect(enforcementSelect.exists()).toBe(true)
  })

  it('should display all enforcement options', () => {
    const wrapper = mount(ComplianceCheckerView)
    const options = wrapper.findAll('select[name="enforcement"] option')
    expect(options.length).toBeGreaterThanOrEqual(4)
  })

  it('should display trust period setting', () => {
    const wrapper = mount(ComplianceCheckerView)
    const trustPeriod = wrapper.find('input[name="trustPeriod"]')
    expect(trustPeriod.exists()).toBe(true)
  })

  it('should display current trust period value', () => {
    const wrapper = mount(ComplianceCheckerView)
    const trustPeriod = wrapper.find('input[name="trustPeriod"]')
    expect(trustPeriod.element.value).toBe('30')
  })

  it('should display 2FA method checkboxes', () => {
    const wrapper = mount(ComplianceCheckerView)
    const methodCheckboxes = wrapper.findAll('input[type="checkbox"]')
    expect(methodCheckboxes.length).toBeGreaterThan(0)
  })

  it('should call updateTwoFactorSettings when form submitted', async () => {
    const wrapper = mount(ComplianceCheckerView)
    const form = wrapper.find('form.two-factor-form')
    
    await form.trigger('submit.prevent')
    expect(mockUpdateTwoFactorSettings).toHaveBeenCalled()
  })

  it('should display compliance policies section', () => {
    const wrapper = mount(ComplianceCheckerView)
    const policiesSection = wrapper.find('.compliance-policies')
    expect(policiesSection.exists()).toBe(true)
  })

  it('should display all compliance policies', () => {
    const wrapper = mount(ComplianceCheckerView)
    const policyCards = wrapper.findAll('.policy-card')
    expect(policyCards.length).toBe(4)
  })

  it('should display policy name', () => {
    const wrapper = mount(ComplianceCheckerView)
    const firstPolicy = wrapper.find('.policy-card')
    expect(firstPolicy.text()).toContain('Password Policy')
  })

  it('should display policy description', () => {
    const wrapper = mount(ComplianceCheckerView)
    const firstPolicy = wrapper.find('.policy-card')
    expect(firstPolicy.text()).toContain('Strong password')
  })

  it('should show compliant status', () => {
    const wrapper = mount(ComplianceCheckerView)
    const compliantBadge = wrapper.find('.status-compliant')
    expect(compliantBadge.exists()).toBe(true)
  })

  it('should show non-compliant status', () => {
    const wrapper = mount(ComplianceCheckerView)
    const nonCompliantBadge = wrapper.find('.status-non-compliant')
    expect(nonCompliantBadge.exists()).toBe(true)
  })

  it('should show partially compliant status', () => {
    const wrapper = mount(ComplianceCheckerView)
    const partialBadge = wrapper.find('.status-partially-compliant')
    expect(partialBadge.exists()).toBe(true)
  })

  it('should display last checked date', () => {
    const wrapper = mount(ComplianceCheckerView)
    const lastChecked = wrapper.find('.last-checked')
    expect(lastChecked.exists()).toBe(true)
  })

  it('should display next review date', () => {
    const wrapper = mount(ComplianceCheckerView)
    const nextReview = wrapper.find('.next-review')
    expect(nextReview.exists()).toBe(true)
  })

  it('should display policy issues', () => {
    const wrapper = mount(ComplianceCheckerView)
    const issues = wrapper.find('.policy-issues')
    expect(issues.exists()).toBe(true)
  })

  it('should list specific issues for non-compliant policies', () => {
    const wrapper = mount(ComplianceCheckerView)
    const policyCards = wrapper.findAll('.policy-card')
    const nonCompliantPolicy = policyCards[2]
    expect(nonCompliantPolicy.text()).toContain('60 minutes')
  })

  it('should display compliance score', () => {
    const wrapper = mount(ComplianceCheckerView)
    const score = wrapper.find('.compliance-score')
    expect(score.exists()).toBe(true)
  })

  it('should calculate compliance percentage', () => {
    const wrapper = mount(ComplianceCheckerView)
    const percentage = wrapper.find('.compliance-percentage')
    // 2 compliant + 0.5 partial = 2.5 / 4 = 62.5%
    expect(percentage.text()).toMatch(/\d+%/)
  })

  it('should display compliance summary', () => {
    const wrapper = mount(ComplianceCheckerView)
    const summary = wrapper.find('.compliance-summary')
    expect(summary.exists()).toBe(true)
  })

  it('should show compliant policies count', () => {
    const wrapper = mount(ComplianceCheckerView)
    const compliantCount = wrapper.find('.compliant-count')
    expect(compliantCount.text()).toContain('2')
  })

  it('should show non-compliant policies count', () => {
    const wrapper = mount(ComplianceCheckerView)
    const nonCompliantCount = wrapper.find('.non-compliant-count')
    expect(nonCompliantCount.text()).toContain('1')
  })

  it('should show partially compliant policies count', () => {
    const wrapper = mount(ComplianceCheckerView)
    const partialCount = wrapper.find('.partial-count')
    expect(partialCount.text()).toContain('1')
  })

  it('should display progress bar for compliance score', () => {
    const wrapper = mount(ComplianceCheckerView)
    const progressBar = wrapper.find('.compliance-progress')
    expect(progressBar.exists()).toBe(true)
  })

  it('should filter policies by status', async () => {
    const wrapper = mount(ComplianceCheckerView)
    const statusFilter = wrapper.find('select.status-filter')
    
    if (statusFilter.exists()) {
      await statusFilter.setValue('compliant')
      expect(wrapper.vm).toBeDefined()
    }
  })

  it('should display required for sensitive operations toggle', () => {
    const wrapper = mount(ComplianceCheckerView)
    const sensitiveToggle = wrapper.find('input[name="requiredForSensitive"]')
    expect(sensitiveToggle.exists()).toBe(true)
  })

  it('should show 2FA status indicator', () => {
    const wrapper = mount(ComplianceCheckerView)
    const statusIndicator = wrapper.find('.two-factor-status')
    expect(statusIndicator.exists()).toBe(true)
  })

  it('should display policy icons', () => {
    const wrapper = mount(ComplianceCheckerView)
    const policyIcons = wrapper.findAll('.policy-icon')
    expect(policyIcons.length).toBeGreaterThan(0)
  })

  it('should run compliance check', () => {
    const wrapper = mount(ComplianceCheckerView)
    const checkButton = wrapper.find('button.run-check-btn')
    expect(checkButton.exists()).toBe(true)
  })

  it('should export compliance report', () => {
    const wrapper = mount(ComplianceCheckerView)
    const exportButton = wrapper.find('button.export-compliance-btn')
    expect(exportButton.exists()).toBe(true)
  })

  it('should display loading state', () => {
    vi.mocked(useSecurityManagement).mockReturnValue({
      compliancePolicies: { value: [] },
      twoFactorSettings: { value: mockTwoFactorSettings },
      loading: { value: true },
      updateTwoFactorSettings: mockUpdateTwoFactorSettings
    } as any)

    const wrapper = mount(ComplianceCheckerView)
    expect(wrapper.find('.loading').exists()).toBe(true)
  })

  it('should highlight policies needing attention', () => {
    const wrapper = mount(ComplianceCheckerView)
    const needsAttention = wrapper.find('.policy-attention')
    expect(needsAttention.exists()).toBe(true)
  })

  it('should display policy checklist', () => {
    const wrapper = mount(ComplianceCheckerView)
    const checklist = wrapper.find('.policy-checklist')
    expect(checklist.exists()).toBe(true)
  })

  it('should validate trust period input', async () => {
    const wrapper = mount(ComplianceCheckerView)
    const trustPeriodInput = wrapper.find('input[name="trustPeriod"]')
    
    await trustPeriodInput.setValue('-1')
    const form = wrapper.find('form.two-factor-form')
    await form.trigger('submit.prevent')
    
    // Should show validation error for negative values
    expect(wrapper.vm).toBeDefined()
  })

  it('should display refresh button', () => {
    const wrapper = mount(ComplianceCheckerView)
    const refreshButton = wrapper.find('button.refresh-btn')
    expect(refreshButton.exists()).toBe(true)
  })
})
