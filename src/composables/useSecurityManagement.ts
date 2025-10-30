/**
 * Security Management Composable
 * Centralized state management for security operations
 */

import { ref, computed } from 'vue'
import { useToast } from 'vue-toastification'
import type {
  FailedLoginAttempt,
  WhitelistedIP,
  BlacklistedIP,
  SSLCertificate,
  Vulnerability,
  PermissionChange,
  DataAccessLog,
  SecurityAlert,
  ActiveSession,
  FirewallRule,
  SecurityStatistics,
  AutoBlockSettings,
  TwoFactorSettings,
  SecurityPolicyCompliance,
  AddIPToWhitelistData,
  BlockIPData,
  AddFirewallRuleData,
  VulnerabilityScanOptions,
  SecurityReportOptions,
} from '@/types/security'
import {
  mockFailedLoginAttempts,
  mockWhitelistedIPs,
  mockBlacklistedIPs,
  mockSSLCertificates,
  mockVulnerabilities,
  mockPermissionChanges,
  mockDataAccessLogs,
  mockSecurityAlerts,
  mockActiveSessions,
  mockFirewallRules,
  mockAutoBlockSettings,
  mockTwoFactorSettings,
  mockSecurityCompliance,
} from '@/data/securityMockData'
import { Protocol, FirewallAction } from '@/types/security'

const toast = useToast()

// Singleton state
const failedLoginAttempts = ref<FailedLoginAttempt[]>([])
const whitelistedIPs = ref<WhitelistedIP[]>([])
const blacklistedIPs = ref<BlacklistedIP[]>([])
const sslCertificates = ref<SSLCertificate[]>([])
const vulnerabilities = ref<Vulnerability[]>([])
const permissionChanges = ref<PermissionChange[]>([])
const dataAccessLogs = ref<DataAccessLog[]>([])
const securityAlerts = ref<SecurityAlert[]>([])
const activeSessions = ref<ActiveSession[]>([])
const firewallRules = ref<FirewallRule[]>([])
const autoBlockSettings = ref<AutoBlockSettings>({ threshold: 5, timeWindow: 15 })
const twoFactorSettings = ref<TwoFactorSettings>({
  enforcement: 'Admins Only' as any,
  allowRememberDevice: true,
  trustPeriod: 30,
})
const securityCompliance = ref<SecurityPolicyCompliance | null>(null)
const loading = ref(false)
const scanning = ref(false)
const lastScanDate = ref<Date | null>(null)

export function useSecurityManagement() {
  // ============================================================================
  // COMPUTED PROPERTIES
  // ============================================================================

  const statistics = computed<SecurityStatistics>(() => {
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000)
    
    return {
      failedLogins24h: failedLoginAttempts.value.filter(
        attempt => new Date(attempt.timestamp) >= last24Hours
      ).length,
      blockedIPs: blacklistedIPs.value.filter(ip => ip.isActive).length,
      activeThreats: securityAlerts.value.filter(alert => !alert.resolved).length,
      certificateStatus: {
        total: sslCertificates.value.length,
        valid: sslCertificates.value.filter(cert => cert.status === 'valid').length,
        warning: sslCertificates.value.filter(cert => cert.status === 'warning').length,
        critical: sslCertificates.value.filter(cert => cert.status === 'critical').length,
        expired: sslCertificates.value.filter(cert => cert.status === 'expired').length,
      },
      lastScanDate: lastScanDate.value || undefined,
      vulnerabilitySummary: {
        total: vulnerabilities.value.length,
        critical: vulnerabilities.value.filter(v => v.severity === 'Critical').length,
        high: vulnerabilities.value.filter(v => v.severity === 'High').length,
        medium: vulnerabilities.value.filter(v => v.severity === 'Medium').length,
        low: vulnerabilities.value.filter(v => v.severity === 'Low').length,
        info: vulnerabilities.value.filter(v => v.severity === 'Info').length,
      },
      activeSessions: activeSessions.value.length,
      complianceScore: securityCompliance.value?.overallScore || 0,
    }
  })

  const recentFailedLogins = computed(() => {
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000)
    return failedLoginAttempts.value
      .filter(attempt => new Date(attempt.timestamp) >= last24Hours)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  })

  const criticalVulnerabilities = computed(() => {
    return vulnerabilities.value.filter(v => v.severity === 'Critical' && v.status === 'open')
  })

  const expiringCertificates = computed(() => {
    return sslCertificates.value.filter(
      cert => cert.daysRemaining <= 30 && cert.status !== 'expired'
    )
  })

  const sortedFirewallRules = computed(() => {
    return [...firewallRules.value].sort((a, b) => a.priority - b.priority)
  })

  const unresolvedAlerts = computed(() => {
    return securityAlerts.value.filter(alert => !alert.resolved)
  })

  // ============================================================================
  // DATA LOADING
  // ============================================================================

  const loadSecurityData = async () => {
    loading.value = true
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800))
      
      failedLoginAttempts.value = [...mockFailedLoginAttempts]
      whitelistedIPs.value = [...mockWhitelistedIPs]
      blacklistedIPs.value = [...mockBlacklistedIPs]
      sslCertificates.value = [...mockSSLCertificates]
      vulnerabilities.value = [...mockVulnerabilities]
      permissionChanges.value = [...mockPermissionChanges]
      dataAccessLogs.value = [...mockDataAccessLogs]
      securityAlerts.value = [...mockSecurityAlerts]
      activeSessions.value = [...mockActiveSessions]
      firewallRules.value = [...mockFirewallRules]
      autoBlockSettings.value = { ...mockAutoBlockSettings }
      twoFactorSettings.value = { ...mockTwoFactorSettings }
      securityCompliance.value = { ...mockSecurityCompliance }
      lastScanDate.value = new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
      
      toast.success('Security data loaded successfully')
    } catch (error) {
      toast.error('Failed to load security data')
      console.error('Error loading security data:', error)
    } finally {
      loading.value = false
    }
  }

  // ============================================================================
  // IP MANAGEMENT
  // ============================================================================

  const addToWhitelist = async (data: AddIPToWhitelistData) => {
    try {
      // Check if IP already in whitelist
      if (whitelistedIPs.value.some(ip => ip.ipAddress === data.ipAddress)) {
        toast.warning('IP address is already whitelisted')
        return false
      }

      // Check if IP is in blacklist
      if (blacklistedIPs.value.some(ip => ip.ipAddress === data.ipAddress && ip.isActive)) {
        toast.error('IP address is currently blacklisted. Remove from blacklist first.')
        return false
      }

      const newIP: WhitelistedIP = {
        id: `WL-${String(whitelistedIPs.value.length + 1).padStart(3, '0')}`,
        ipAddress: data.ipAddress,
        description: data.description,
        addedBy: 'Current User', // Would come from auth context
        addedDate: new Date(),
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : undefined,
        isActive: true,
      }

      whitelistedIPs.value.push(newIP)
      toast.success(`IP ${data.ipAddress} added to whitelist`)
      return true
    } catch (error) {
      toast.error('Failed to add IP to whitelist')
      console.error('Error adding to whitelist:', error)
      return false
    }
  }

  const removeFromWhitelist = async (id: string) => {
    try {
      const index = whitelistedIPs.value.findIndex(ip => ip.id === id)
      if (index === -1) {
        toast.error('IP not found in whitelist')
        return false
      }

      const removedIP = whitelistedIPs.value[index]
      whitelistedIPs.value.splice(index, 1)
      toast.success(`IP ${removedIP.ipAddress} removed from whitelist`)
      return true
    } catch (error) {
      toast.error('Failed to remove IP from whitelist')
      console.error('Error removing from whitelist:', error)
      return false
    }
  }

  const blockIP = async (data: BlockIPData) => {
    try {
      // Check if IP already blocked
      if (blacklistedIPs.value.some(ip => ip.ipAddress === data.ipAddress && ip.isActive)) {
        toast.warning('IP address is already blocked')
        return false
      }

      // Remove from whitelist if present
      const whitelistIndex = whitelistedIPs.value.findIndex(ip => ip.ipAddress === data.ipAddress)
      if (whitelistIndex !== -1) {
        whitelistedIPs.value.splice(whitelistIndex, 1)
      }

      const newBlock: BlacklistedIP = {
        id: `BL-${String(blacklistedIPs.value.length + 1).padStart(3, '0')}`,
        ipAddress: data.ipAddress,
        reason: data.reason,
        blockedDate: new Date(),
        blockedBy: 'Current User',
        isAutomatic: false,
        isActive: true,
      }

      blacklistedIPs.value.push(newBlock)
      toast.success(`IP ${data.ipAddress} has been blocked`)
      return true
    } catch (error) {
      toast.error('Failed to block IP address')
      console.error('Error blocking IP:', error)
      return false
    }
  }

  const unblockIP = async (id: string) => {
    try {
      const ip = blacklistedIPs.value.find(ip => ip.id === id)
      if (!ip) {
        toast.error('IP not found in blacklist')
        return false
      }

      ip.isActive = false
      toast.success(`IP ${ip.ipAddress} has been unblocked`)
      return true
    } catch (error) {
      toast.error('Failed to unblock IP address')
      console.error('Error unblocking IP:', error)
      return false
    }
  }

  const checkAutoBlock = async (ipAddress: string) => {
    try {
      // Check if IP is whitelisted
      if (whitelistedIPs.value.some(ip => ip.ipAddress === ipAddress && ip.isActive)) {
        return false // Don't auto-block whitelisted IPs
      }

      // Get recent failed attempts for this IP
      const timeWindow = autoBlockSettings.value.timeWindow * 60 * 1000 // Convert to ms
      const windowStart = new Date(Date.now() - timeWindow)
      
      const recentAttempts = failedLoginAttempts.value.filter(
        attempt => attempt.ipAddress === ipAddress && new Date(attempt.timestamp) >= windowStart
      )

      if (recentAttempts.length >= autoBlockSettings.value.threshold) {
        await blockIP({
          ipAddress,
          reason: `Auto-blocked: ${recentAttempts.length} failed login attempts in ${autoBlockSettings.value.timeWindow} minutes`,
        })
        return true
      }

      return false
    } catch (error) {
      console.error('Error checking auto-block:', error)
      return false
    }
  }

  const updateAutoBlockSettings = async (settings: AutoBlockSettings) => {
    try {
      autoBlockSettings.value = { ...settings }
      toast.success('Auto-block settings updated')
      return true
    } catch (error) {
      toast.error('Failed to update auto-block settings')
      console.error('Error updating auto-block settings:', error)
      return false
    }
  }

  // ============================================================================
  // SSL CERTIFICATES
  // ============================================================================

  const calculateCertificateDaysRemaining = (expiryDate: Date): number => {
    const now = new Date()
    const expiry = new Date(expiryDate)
    const diffTime = expiry.getTime() - now.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const renewCertificate = async (domain: string) => {
    try {
      toast.info(`Certificate renewal initiated for ${domain}`)
      // This would trigger actual certificate renewal process
      return true
    } catch (error) {
      toast.error('Failed to initiate certificate renewal')
      console.error('Error renewing certificate:', error)
      return false
    }
  }

  // ============================================================================
  // VULNERABILITY SCANNING
  // ============================================================================

  const runVulnerabilityScan = async (options?: VulnerabilityScanOptions) => {
    scanning.value = true
    try {
      toast.info('Starting vulnerability scan...')
      
      // Simulate scan duration
      const scanDuration = options?.scanType === 'Quick' ? 3000 : options?.scanType === 'Full' ? 8000 : 5000
      await new Promise(resolve => setTimeout(resolve, scanDuration))
      
      // In real app, this would fetch new vulnerabilities from scan
      lastScanDate.value = new Date()
      
      toast.success(`${options?.scanType || 'Quick'} scan completed. Found ${vulnerabilities.value.length} vulnerabilities.`)
      return true
    } catch (error) {
      toast.error('Vulnerability scan failed')
      console.error('Error running scan:', error)
      return false
    } finally {
      scanning.value = false
    }
  }

  // ============================================================================
  // SECURITY ALERTS
  // ============================================================================

  const resolveAlert = async (alertId: string) => {
    try {
      const alert = securityAlerts.value.find(a => a.id === alertId)
      if (!alert) {
        toast.error('Alert not found')
        return false
      }

      alert.resolved = true
      alert.resolvedBy = 'Current User'
      alert.resolvedAt = new Date()
      
      toast.success('Alert marked as resolved')
      return true
    } catch (error) {
      toast.error('Failed to resolve alert')
      console.error('Error resolving alert:', error)
      return false
    }
  }

  // ============================================================================
  // SESSION MANAGEMENT
  // ============================================================================

  const forceLogoutSession = async (sessionId: string) => {
    try {
      const session = activeSessions.value.find(s => s.sessionId === sessionId)
      if (!session) {
        toast.error('Session not found')
        return false
      }

      if (session.isCurrentSession) {
        toast.error('Cannot logout your own session')
        return false
      }

      const index = activeSessions.value.findIndex(s => s.sessionId === sessionId)
      activeSessions.value.splice(index, 1)
      
      toast.success(`Session for ${session.user} has been terminated`)
      return true
    } catch (error) {
      toast.error('Failed to logout session')
      console.error('Error logging out session:', error)
      return false
    }
  }

  const forceLogoutAll = async () => {
    try {
      const count = activeSessions.value.filter(s => !s.isCurrentSession).length
      activeSessions.value = activeSessions.value.filter(s => s.isCurrentSession)
      
      toast.success(`${count} sessions have been terminated`)
      return true
    } catch (error) {
      toast.error('Failed to logout all sessions')
      console.error('Error logging out all sessions:', error)
      return false
    }
  }

  // ============================================================================
  // FIREWALL RULES
  // ============================================================================

  const addFirewallRule = async (data: AddFirewallRuleData) => {
    try {
      // Check if priority already exists
      if (firewallRules.value.some(rule => rule.priority === data.priority && rule.enabled)) {
        toast.error(`Priority ${data.priority} is already in use. Please choose a different priority.`)
        return false
      }

      // Parse ports
      const parsePorts = (portsString: string): (number | { start: number; end: number })[] => {
        if (!portsString) return []
        return portsString.split(',').map(port => {
          const trimmed = port.trim()
          if (trimmed.includes('-')) {
            const [start, end] = trimmed.split('-').map(p => parseInt(p.trim()))
            return { start, end }
          }
          return parseInt(trimmed)
        })
      }

      const newRule: FirewallRule = {
        id: `FW-${String(firewallRules.value.length + 1).padStart(3, '0')}`,
        priority: data.priority,
        name: data.name,
        protocol: data.protocol as Protocol,
        sourceIPs: data.sourceIPs,
        destinationIPs: data.destinationIPs,
        sourcePorts: parsePorts(data.sourcePorts || ''),
        destinationPorts: parsePorts(data.destinationPorts || ''),
        action: data.action as FirewallAction,
        enabled: true,
        createdBy: 'Current User',
        createdAt: new Date(),
        description: data.description,
      }

      firewallRules.value.push(newRule)
      toast.success('Firewall rule added successfully')
      return true
    } catch (error) {
      toast.error('Failed to add firewall rule')
      console.error('Error adding firewall rule:', error)
      return false
    }
  }

  const updateFirewallRule = async (id: string, data: Partial<FirewallRule>) => {
    try {
      const rule = firewallRules.value.find(r => r.id === id)
      if (!rule) {
        toast.error('Firewall rule not found')
        return false
      }

      Object.assign(rule, data)
      toast.success('Firewall rule updated successfully')
      return true
    } catch (error) {
      toast.error('Failed to update firewall rule')
      console.error('Error updating firewall rule:', error)
      return false
    }
  }

  const deleteFirewallRule = async (id: string) => {
    try {
      const index = firewallRules.value.findIndex(r => r.id === id)
      if (index === -1) {
        toast.error('Firewall rule not found')
        return false
      }

      firewallRules.value.splice(index, 1)
      toast.success('Firewall rule deleted successfully')
      return true
    } catch (error) {
      toast.error('Failed to delete firewall rule')
      console.error('Error deleting firewall rule:', error)
      return false
    }
  }

  const toggleFirewallRule = async (id: string) => {
    try {
      const rule = firewallRules.value.find(r => r.id === id)
      if (!rule) {
        toast.error('Firewall rule not found')
        return false
      }

      rule.enabled = !rule.enabled
      toast.success(`Firewall rule ${rule.enabled ? 'enabled' : 'disabled'}`)
      return true
    } catch (error) {
      toast.error('Failed to toggle firewall rule')
      console.error('Error toggling firewall rule:', error)
      return false
    }
  }

  // ============================================================================
  // TWO-FACTOR AUTHENTICATION
  // ============================================================================

  const updateTwoFactorSettings = async (settings: TwoFactorSettings) => {
    try {
      twoFactorSettings.value = { ...settings }
      toast.success('Two-factor authentication settings updated')
      return true
    } catch (error) {
      toast.error('Failed to update 2FA settings')
      console.error('Error updating 2FA settings:', error)
      return false
    }
  }

  // ============================================================================
  // SECURITY REPORTS
  // ============================================================================

  const generateSecurityReport = async (options: SecurityReportOptions) => {
    try {
      toast.info('Generating security report...')
      
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // In real app, this would use jsPDF to create formatted PDF
      const reportData = {
        reportType: options.reportType,
        dateRange: options.dateRange,
        statistics: statistics.value,
        sections: options.includeSections,
        generatedAt: new Date(),
      }
      
      // Create a simple JSON download for now
      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `security-report-${new Date().toISOString().split('T')[0]}.json`
      link.click()
      URL.revokeObjectURL(url)
      
      toast.success('Security report generated successfully')
      return true
    } catch (error) {
      toast.error('Failed to generate security report')
      console.error('Error generating report:', error)
      return false
    }
  }

  // ============================================================================
  // RETURN PUBLIC API
  // ============================================================================

  return {
    // State
    failedLoginAttempts,
    whitelistedIPs,
    blacklistedIPs,
    sslCertificates,
    vulnerabilities,
    permissionChanges,
    dataAccessLogs,
    securityAlerts,
    activeSessions,
    firewallRules,
    autoBlockSettings,
    twoFactorSettings,
    securityCompliance,
    loading,
    scanning,
    lastScanDate,

    // Computed
    statistics,
    recentFailedLogins,
    criticalVulnerabilities,
    expiringCertificates,
    sortedFirewallRules,
    unresolvedAlerts,

    // Methods
    loadSecurityData,
    addToWhitelist,
    removeFromWhitelist,
    blockIP,
    unblockIP,
    checkAutoBlock,
    updateAutoBlockSettings,
    calculateCertificateDaysRemaining,
    renewCertificate,
    runVulnerabilityScan,
    resolveAlert,
    forceLogoutSession,
    forceLogoutAll,
    addFirewallRule,
    updateFirewallRule,
    deleteFirewallRule,
    toggleFirewallRule,
    updateTwoFactorSettings,
    generateSecurityReport,
  }
}
