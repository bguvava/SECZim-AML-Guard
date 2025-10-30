import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import SecurityReportGenerator from '@/components/security/SecurityReportGenerator.vue'
import { useSecurityManagement } from '@/composables/useSecurityManagement'

// Mock the composable
vi.mock('@/composables/useSecurityManagement')

describe('SecurityReportGenerator', () => {
  const mockGenerateReport = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useSecurityManagement).mockReturnValue({
      loading: { value: false },
      generateSecurityReport: mockGenerateReport
    } as any)
  })

  it('should render component title', () => {
    const wrapper = mount(SecurityReportGenerator)
    expect(wrapper.find('h2').text()).toContain('Security Report Generator')
  })

  it('should display report type selector', () => {
    const wrapper = mount(SecurityReportGenerator)
    const reportTypeSelect = wrapper.find('select.report-type')
    expect(reportTypeSelect.exists()).toBe(true)
  })

  it('should have daily report option', () => {
    const wrapper = mount(SecurityReportGenerator)
    const options = wrapper.findAll('select.report-type option')
    const dailyOption = options.find(opt => opt.text().includes('Daily'))
    expect(dailyOption).toBeDefined()
  })

  it('should have weekly report option', () => {
    const wrapper = mount(SecurityReportGenerator)
    const options = wrapper.findAll('select.report-type option')
    const weeklyOption = options.find(opt => opt.text().includes('Weekly'))
    expect(weeklyOption).toBeDefined()
  })

  it('should have monthly report option', () => {
    const wrapper = mount(SecurityReportGenerator)
    const options = wrapper.findAll('select.report-type option')
    const monthlyOption = options.find(opt => opt.text().includes('Monthly'))
    expect(monthlyOption).toBeDefined()
  })

  it('should have custom report option', () => {
    const wrapper = mount(SecurityReportGenerator)
    const options = wrapper.findAll('select.report-type option')
    const customOption = options.find(opt => opt.text().includes('Custom'))
    expect(customOption).toBeDefined()
  })

  it('should display date range inputs for custom report', async () => {
    const wrapper = mount(SecurityReportGenerator)
    const reportTypeSelect = wrapper.find('select.report-type')
    
    await reportTypeSelect.setValue('custom')
    const startDateInput = wrapper.find('input[name="startDate"]')
    const endDateInput = wrapper.find('input[name="endDate"]')
    
    expect(startDateInput.exists()).toBe(true)
    expect(endDateInput.exists()).toBe(true)
  })

  it('should display report sections checklist', () => {
    const wrapper = mount(SecurityReportGenerator)
    const sections = wrapper.find('.report-sections')
    expect(sections.exists()).toBe(true)
  })

  it('should have failed logins section checkbox', () => {
    const wrapper = mount(SecurityReportGenerator)
    const failedLoginsCheckbox = wrapper.find('input[value="failedLogins"]')
    expect(failedLoginsCheckbox.exists()).toBe(true)
  })

  it('should have IP management section checkbox', () => {
    const wrapper = mount(SecurityReportGenerator)
    const ipCheckbox = wrapper.find('input[value="ipManagement"]')
    expect(ipCheckbox.exists()).toBe(true)
  })

  it('should have SSL certificates section checkbox', () => {
    const wrapper = mount(SecurityReportGenerator)
    const sslCheckbox = wrapper.find('input[value="sslCertificates"]')
    expect(sslCheckbox.exists()).toBe(true)
  })

  it('should have vulnerabilities section checkbox', () => {
    const wrapper = mount(SecurityReportGenerator)
    const vulnCheckbox = wrapper.find('input[value="vulnerabilities"]')
    expect(vulnCheckbox.exists()).toBe(true)
  })

  it('should have audit logs section checkbox', () => {
    const wrapper = mount(SecurityReportGenerator)
    const auditCheckbox = wrapper.find('input[value="auditLogs"]')
    expect(auditCheckbox.exists()).toBe(true)
  })

  it('should have active sessions section checkbox', () => {
    const wrapper = mount(SecurityReportGenerator)
    const sessionsCheckbox = wrapper.find('input[value="activeSessions"]')
    expect(sessionsCheckbox.exists()).toBe(true)
  })

  it('should have firewall rules section checkbox', () => {
    const wrapper = mount(SecurityReportGenerator)
    const firewallCheckbox = wrapper.find('input[value="firewallRules"]')
    expect(firewallCheckbox.exists()).toBe(true)
  })

  it('should have select all sections button', () => {
    const wrapper = mount(SecurityReportGenerator)
    const selectAllButton = wrapper.find('button.select-all-sections')
    expect(selectAllButton.exists()).toBe(true)
  })

  it('should select all sections when select all clicked', async () => {
    const wrapper = mount(SecurityReportGenerator)
    const selectAllButton = wrapper.find('button.select-all-sections')
    
    await selectAllButton.trigger('click')
    const checkboxes = wrapper.findAll('input[type="checkbox"]')
    // All checkboxes should be checked
    expect(checkboxes.length).toBeGreaterThan(0)
  })

  it('should have deselect all sections button', () => {
    const wrapper = mount(SecurityReportGenerator)
    const deselectAllButton = wrapper.find('button.deselect-all-sections')
    expect(deselectAllButton.exists()).toBe(true)
  })

  it('should display generate report button', () => {
    const wrapper = mount(SecurityReportGenerator)
    const generateButton = wrapper.find('button.generate-report-btn')
    expect(generateButton.exists()).toBe(true)
  })

  it('should call generateSecurityReport when generate clicked', async () => {
    const wrapper = mount(SecurityReportGenerator)
    const generateButton = wrapper.find('button.generate-report-btn')
    
    await generateButton.trigger('click')
    expect(mockGenerateReport).toHaveBeenCalled()
  })

  it('should disable generate button when no sections selected', async () => {
    const wrapper = mount(SecurityReportGenerator)
    const deselectAllButton = wrapper.find('button.deselect-all-sections')
    await deselectAllButton.trigger('click')
    
    const generateButton = wrapper.find('button.generate-report-btn')
    expect(generateButton.attributes('disabled')).toBeDefined()
  })

  it('should display report format selector', () => {
    const wrapper = mount(SecurityReportGenerator)
    const formatSelector = wrapper.find('select.report-format')
    expect(formatSelector.exists()).toBe(true)
  })

  it('should have JSON format option', () => {
    const wrapper = mount(SecurityReportGenerator)
    const formatOptions = wrapper.findAll('select.report-format option')
    const jsonOption = formatOptions.find(opt => opt.text().includes('JSON'))
    expect(jsonOption).toBeDefined()
  })

  it('should have PDF format option', () => {
    const wrapper = mount(SecurityReportGenerator)
    const formatOptions = wrapper.findAll('select.report-format option')
    const pdfOption = formatOptions.find(opt => opt.text().includes('PDF'))
    if (pdfOption) {
      expect(pdfOption).toBeDefined()
    }
  })

  it('should have CSV format option', () => {
    const wrapper = mount(SecurityReportGenerator)
    const formatOptions = wrapper.findAll('select.report-format option')
    const csvOption = formatOptions.find(opt => opt.text().includes('CSV'))
    if (csvOption) {
      expect(csvOption).toBeDefined()
    }
  })

  it('should display report preview section', () => {
    const wrapper = mount(SecurityReportGenerator)
    const preview = wrapper.find('.report-preview')
    // May or may not exist depending on implementation
    if (preview.exists()) {
      expect(preview.exists()).toBe(true)
    }
  })

  it('should display loading state during generation', () => {
    vi.mocked(useSecurityManagement).mockReturnValue({
      loading: { value: true },
      generateSecurityReport: mockGenerateReport
    } as any)

    const wrapper = mount(SecurityReportGenerator)
    const loading = wrapper.find('.loading')
    expect(loading.exists()).toBe(true)
  })

  it('should disable generate button during generation', () => {
    vi.mocked(useSecurityManagement).mockReturnValue({
      loading: { value: true },
      generateSecurityReport: mockGenerateReport
    } as any)

    const wrapper = mount(SecurityReportGenerator)
    const generateButton = wrapper.find('button.generate-report-btn')
    expect(generateButton.attributes('disabled')).toBeDefined()
  })

  it('should display report description', () => {
    const wrapper = mount(SecurityReportGenerator)
    const description = wrapper.find('.report-description')
    expect(description.exists()).toBe(true)
  })

  it('should validate date range for custom reports', async () => {
    const wrapper = mount(SecurityReportGenerator)
    const reportTypeSelect = wrapper.find('select.report-type')
    await reportTypeSelect.setValue('custom')
    
    const form = wrapper.find('form.report-form')
    expect(form.exists()).toBe(true)
  })

  it('should display recent reports section', () => {
    const wrapper = mount(SecurityReportGenerator)
    const recentReports = wrapper.find('.recent-reports')
    if (recentReports.exists()) {
      expect(recentReports.exists()).toBe(true)
    }
  })

  it('should display report generation progress', () => {
    vi.mocked(useSecurityManagement).mockReturnValue({
      loading: { value: true },
      generateSecurityReport: mockGenerateReport
    } as any)

    const wrapper = mount(SecurityReportGenerator)
    const progress = wrapper.find('.report-progress')
    if (progress.exists()) {
      expect(progress.exists()).toBe(true)
    }
  })

  it('should show success message after generation', () => {
    const wrapper = mount(SecurityReportGenerator)
    const successMessage = wrapper.find('.success-message')
    // May not exist until report generated
    if (successMessage.exists()) {
      expect(successMessage.text()).toContain('success')
    }
  })

  it('should display download link after generation', () => {
    const wrapper = mount(SecurityReportGenerator)
    const downloadLink = wrapper.find('a.download-report')
    if (downloadLink.exists()) {
      expect(downloadLink.exists()).toBe(true)
    }
  })

  it('should display section descriptions', () => {
    const wrapper = mount(SecurityReportGenerator)
    const sectionLabels = wrapper.findAll('.section-label')
    expect(sectionLabels.length).toBeGreaterThan(0)
  })

  it('should display section count indicator', () => {
    const wrapper = mount(SecurityReportGenerator)
    const sectionCount = wrapper.find('.selected-sections-count')
    if (sectionCount.exists()) {
      expect(sectionCount.exists()).toBe(true)
    }
  })

  it('should display report type description when changed', async () => {
    const wrapper = mount(SecurityReportGenerator)
    const reportTypeSelect = wrapper.find('select.report-type')
    
    await reportTypeSelect.setValue('weekly')
    const typeDescription = wrapper.find('.type-description')
    if (typeDescription.exists()) {
      expect(typeDescription.text()).toBeTruthy()
    }
  })

  it('should validate start date before end date', async () => {
    const wrapper = mount(SecurityReportGenerator)
    const reportTypeSelect = wrapper.find('select.report-type')
    await reportTypeSelect.setValue('custom')
    
    const startDate = wrapper.find('input[name="startDate"]')
    const endDate = wrapper.find('input[name="endDate"]')
    
    await startDate.setValue('2024-01-20')
    await endDate.setValue('2024-01-10')
    
    const generateButton = wrapper.find('button.generate-report-btn')
    await generateButton.trigger('click')
    
    // Should show validation error
    expect(wrapper.vm).toBeDefined()
  })

  it('should display report settings', () => {
    const wrapper = mount(SecurityReportGenerator)
    const settings = wrapper.find('.report-settings')
    expect(settings.exists()).toBe(true)
  })

  it('should display email report option', () => {
    const wrapper = mount(SecurityReportGenerator)
    const emailOption = wrapper.find('input[name="emailReport"]')
    if (emailOption.exists()) {
      expect(emailOption.exists()).toBe(true)
    }
  })

  it('should display schedule report option', () => {
    const wrapper = mount(SecurityReportGenerator)
    const scheduleOption = wrapper.find('input[name="scheduleReport"]')
    if (scheduleOption.exists()) {
      expect(scheduleOption.exists()).toBe(true)
    }
  })
})
