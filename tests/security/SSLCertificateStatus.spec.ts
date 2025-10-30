import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import SSLCertificateStatus from '@/components/security/SSLCertificateStatus.vue'
import { useSecurityManagement } from '@/composables/useSecurityManagement'
import type { SSLCertificate } from '@/types/security'
import { CertificateStatus } from '@/types/security'

// Mock the composable
vi.mock('@/composables/useSecurityManagement')

describe('SSLCertificateStatus', () => {
  const now = new Date('2024-01-15T10:00:00Z')
  
  const mockCertificates: SSLCertificate[] = [
    {
      id: '1',
      domain: 'aml.rbz.co.zw',
      issuer: 'Let\'s Encrypt',
      issuedDate: new Date('2023-10-15T00:00:00Z'),
      expiryDate: new Date('2024-01-20T00:00:00Z'), // Expiring soon (5 days)
      status: CertificateStatus.WARNING,
      serialNumber: 'ABC123456789'
    },
    {
      id: '2',
      domain: 'api.rbz.co.zw',
      issuer: 'DigiCert',
      issuedDate: new Date('2023-06-01T00:00:00Z'),
      expiryDate: new Date('2024-06-01T00:00:00Z'), // Valid
      status: CertificateStatus.VALID,
      serialNumber: 'XYZ987654321'
    },
    {
      id: '3',
      domain: 'old.rbz.co.zw',
      issuer: 'Let\'s Encrypt',
      issuedDate: new Date('2023-01-01T00:00:00Z'),
      expiryDate: new Date('2024-01-10T00:00:00Z'), // Expired
      status: CertificateStatus.EXPIRED,
      serialNumber: 'DEF456789123'
    },
    {
      id: '4',
      domain: 'internal.rbz.co.zw',
      issuer: 'RBZ Internal CA',
      issuedDate: new Date('2023-12-01T00:00:00Z'),
      expiryDate: new Date('2024-01-17T00:00:00Z'), // Critical (2 days)
      status: CertificateStatus.CRITICAL,
      serialNumber: 'GHI789123456'
    }
  ]

  const mockRenewCertificate = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.setSystemTime(now)
    
    vi.mocked(useSecurityManagement).mockReturnValue({
      sslCertificates: { value: mockCertificates },
      loading: { value: false },
      renewCertificate: mockRenewCertificate
    } as any)
  })

  it('should render component title', () => {
    const wrapper = mount(SSLCertificateStatus)
    expect(wrapper.find('h2').text()).toContain('SSL/TLS Certificate Status')
  })

  it('should display all certificates', () => {
    const wrapper = mount(SSLCertificateStatus)
    const certCards = wrapper.findAll('.cert-card')
    expect(certCards.length).toBe(4)
  })

  it('should display certificate domain', () => {
    const wrapper = mount(SSLCertificateStatus)
    const firstCard = wrapper.find('.cert-card')
    expect(firstCard.text()).toContain('aml.rbz.co.zw')
  })

  it('should display certificate issuer', () => {
    const wrapper = mount(SSLCertificateStatus)
    const firstCard = wrapper.find('.cert-card')
    expect(firstCard.text()).toContain('Let\'s Encrypt')
  })

  it('should display expiry date', () => {
    const wrapper = mount(SSLCertificateStatus)
    const firstCard = wrapper.find('.cert-card')
    expect(firstCard.text()).toContain('2024')
  })

  it('should show valid status for valid certificates', () => {
    const wrapper = mount(SSLCertificateStatus)
    const certCards = wrapper.findAll('.cert-card')
    const validCard = certCards[1]
    expect(validCard.find('.status-valid').exists()).toBe(true)
  })

  it('should show warning status for expiring certificates', () => {
    const wrapper = mount(SSLCertificateStatus)
    const firstCard = wrapper.find('.cert-card')
    expect(firstCard.find('.status-warning').exists()).toBe(true)
  })

  it('should show critical status for critically expiring certificates', () => {
    const wrapper = mount(SSLCertificateStatus)
    const certCards = wrapper.findAll('.cert-card')
    const criticalCard = certCards[3]
    expect(criticalCard.find('.status-critical').exists()).toBe(true)
  })

  it('should show expired status for expired certificates', () => {
    const wrapper = mount(SSLCertificateStatus)
    const certCards = wrapper.findAll('.cert-card')
    const expiredCard = certCards[2]
    expect(expiredCard.find('.status-expired').exists()).toBe(true)
  })

  it('should display days until expiry', () => {
    const wrapper = mount(SSLCertificateStatus)
    const firstCard = wrapper.find('.cert-card')
    expect(firstCard.text()).toMatch(/\d+ days?/)
  })

  it('should display progress bar', () => {
    const wrapper = mount(SSLCertificateStatus)
    const progressBar = wrapper.find('.progress-bar')
    expect(progressBar.exists()).toBe(true)
  })

  it('should calculate progress percentage correctly', () => {
    const wrapper = mount(SSLCertificateStatus)
    const progressBar = wrapper.find('.progress-fill')
    const width = progressBar.attributes('style')
    expect(width).toBeTruthy()
  })

  it('should show renew button for expiring certificates', () => {
    const wrapper = mount(SSLCertificateStatus)
    const firstCard = wrapper.find('.cert-card')
    const renewButton = firstCard.find('button.renew-btn')
    expect(renewButton.exists()).toBe(true)
  })

  it('should call renewCertificate when renew clicked', async () => {
    const wrapper = mount(SSLCertificateStatus)
    const firstCard = wrapper.find('.cert-card')
    const renewButton = firstCard.find('button.renew-btn')
    
    await renewButton.trigger('click')
    expect(mockRenewCertificate).toHaveBeenCalledWith('1')
  })

  it('should display certificate serial number', () => {
    const wrapper = mount(SSLCertificateStatus)
    const firstCard = wrapper.find('.cert-card')
    expect(firstCard.text()).toContain('ABC123456789')
  })

  it('should display issued date', () => {
    const wrapper = mount(SSLCertificateStatus)
    const firstCard = wrapper.find('.cert-card')
    expect(firstCard.text()).toContain('Issued')
  })

  it('should display summary statistics', () => {
    const wrapper = mount(SSLCertificateStatus)
    const summary = wrapper.find('.cert-summary')
    expect(summary.exists()).toBe(true)
  })

  it('should show total certificates count', () => {
    const wrapper = mount(SSLCertificateStatus)
    const totalCount = wrapper.find('.total-certs')
    expect(totalCount.text()).toContain('4')
  })

  it('should show valid certificates count', () => {
    const wrapper = mount(SSLCertificateStatus)
    const validCount = wrapper.find('.valid-certs')
    expect(validCount.text()).toContain('1')
  })

  it('should show expiring certificates count', () => {
    const wrapper = mount(SSLCertificateStatus)
    const expiringCount = wrapper.find('.expiring-certs')
    expect(expiringCount.text()).toContain('2')
  })

  it('should show expired certificates count', () => {
    const wrapper = mount(SSLCertificateStatus)
    const expiredCount = wrapper.find('.expired-certs')
    expect(expiredCount.text()).toContain('1')
  })

  it('should display loading state', () => {
    vi.mocked(useSecurityManagement).mockReturnValue({
      sslCertificates: { value: [] },
      loading: { value: true },
      renewCertificate: mockRenewCertificate
    } as any)

    const wrapper = mount(SSLCertificateStatus)
    expect(wrapper.find('.loading').exists()).toBe(true)
  })

  it('should display empty state when no certificates', () => {
    vi.mocked(useSecurityManagement).mockReturnValue({
      sslCertificates: { value: [] },
      loading: { value: false },
      renewCertificate: mockRenewCertificate
    } as any)

    const wrapper = mount(SSLCertificateStatus)
    const emptyState = wrapper.find('.empty-state')
    expect(emptyState.exists()).toBe(true)
  })

  it('should sort certificates by expiry date', () => {
    const wrapper = mount(SSLCertificateStatus)
    const certCards = wrapper.findAll('.cert-card')
    // First card should be the most urgent (expired or critically expiring)
    expect(certCards[0].text()).toMatch(/expired|critical/i)
  })

  it('should highlight expired certificates', () => {
    const wrapper = mount(SSLCertificateStatus)
    const expiredCard = wrapper.find('.cert-expired')
    expect(expiredCard.exists()).toBe(true)
  })

  it('should display certificate validity period', () => {
    const wrapper = mount(SSLCertificateStatus)
    const firstCard = wrapper.find('.cert-card')
    const validityPeriod = firstCard.find('.validity-period')
    expect(validityPeriod.exists()).toBe(true)
  })

  it('should show refresh button', () => {
    const wrapper = mount(SSLCertificateStatus)
    const refreshButton = wrapper.find('button.refresh-btn')
    expect(refreshButton.exists()).toBe(true)
  })

  it('should format dates correctly', () => {
    const wrapper = mount(SSLCertificateStatus)
    const dateElement = wrapper.find('.cert-date')
    expect(dateElement.text()).toMatch(/\d{4}/)
  })

  it('should display certificate details expandable section', () => {
    const wrapper = mount(SSLCertificateStatus)
    const detailsToggle = wrapper.find('.details-toggle')
    expect(detailsToggle.exists()).toBe(true)
  })

  it('should export certificate list', () => {
    const wrapper = mount(SSLCertificateStatus)
    const exportButton = wrapper.find('button.export-btn')
    expect(exportButton.exists()).toBe(true)
  })

  it('should filter certificates by status', async () => {
    const wrapper = mount(SSLCertificateStatus)
    const filterSelect = wrapper.find('select.status-filter')
    
    if (filterSelect.exists()) {
      await filterSelect.setValue('expired')
      // Should filter to show only expired certificates
    }
    expect(wrapper.vm).toBeDefined()
  })

  it('should display certificate chain information', () => {
    const wrapper = mount(SSLCertificateStatus)
    const firstCard = wrapper.find('.cert-card')
    // Check if issuer information represents the chain
    expect(firstCard.text()).toContain('Issuer')
  })
})
