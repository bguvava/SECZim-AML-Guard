import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useSecurityManagement } from '@/composables/useSecurityManagement'
import type { AddIPToWhitelistData, BlockIPData, AutoBlockSettings, TwoFactorSettings } from '@/types/security'

// Mock toast
vi.mock('vue-toastification', () => ({
  useToast: () => ({
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn()
  })
}))

describe('useSecurityManagement', () => {
  let composable: ReturnType<typeof useSecurityManagement>

  beforeEach(() => {
    composable = useSecurityManagement()
  })

  describe('Initialization', () => {
    it('should initialize with default values', () => {
      expect(composable.loading.value).toBe(false)
      expect(composable.scanning.value).toBe(false)
      expect(composable.lastScanDate.value).toBeNull()
    })

    it('should have reactive state arrays', () => {
      expect(Array.isArray(composable.failedLoginAttempts.value)).toBe(true)
      expect(Array.isArray(composable.whitelistedIPs.value)).toBe(true)
      expect(Array.isArray(composable.blacklistedIPs.value)).toBe(true)
      expect(Array.isArray(composable.sslCertificates.value)).toBe(true)
      expect(Array.isArray(composable.vulnerabilities.value)).toBe(true)
    })
  })

  describe('loadSecurityData', () => {
    it('should load all security data', async () => {
      await composable.loadSecurityData()
      
      expect(composable.failedLoginAttempts.value.length).toBeGreaterThan(0)
      expect(composable.whitelistedIPs.value.length).toBeGreaterThan(0)
      expect(composable.blacklistedIPs.value.length).toBeGreaterThan(0)
      expect(composable.sslCertificates.value.length).toBeGreaterThan(0)
    })

    it('should set loading state during load', async () => {
      const loadPromise = composable.loadSecurityData()
      expect(composable.loading.value).toBe(true)
      await loadPromise
      expect(composable.loading.value).toBe(false)
    })
  })

  describe('Statistics Computed Property', () => {
    beforeEach(async () => {
      await composable.loadSecurityData()
    })

    it('should calculate statistics correctly', () => {
      const stats = composable.statistics.value
      
      expect(stats).toHaveProperty('failedLoginsLast24h')
      expect(stats).toHaveProperty('blockedIPsCount')
      expect(stats).toHaveProperty('whitelistedIPsCount')
      expect(stats).toHaveProperty('complianceScore')
    })

    it('should have numeric values', () => {
      const stats = composable.statistics.value
      
      expect(typeof stats.failedLoginsLast24h).toBe('number')
      expect(typeof stats.blockedIPsCount).toBe('number')
      expect(typeof stats.complianceScore).toBe('number')
    })
  })

  describe('IP Management', () => {
    beforeEach(async () => {
      await composable.loadSecurityData()
    })

    describe('addToWhitelist', () => {
      it('should add IP to whitelist', async () => {
        const initialCount = composable.whitelistedIPs.value.length
        
        const data: AddIPToWhitelistData = {
          ipAddress: '192.168.100.1',
          description: 'Test IP for whitelist'
        }
        
        await composable.addToWhitelist(data)
        
        expect(composable.whitelistedIPs.value.length).toBe(initialCount + 1)
        const added = composable.whitelistedIPs.value.find(ip => ip.ipAddress === data.ipAddress)
        expect(added).toBeDefined()
        expect(added?.description).toBe(data.description)
      })

      it('should prevent adding blacklisted IP to whitelist', async () => {
        const blacklistedIP = composable.blacklistedIPs.value[0]?.ipAddress
        if (!blacklistedIP) return

        const initialCount = composable.whitelistedIPs.value.length
        
        await composable.addToWhitelist({
          ipAddress: blacklistedIP,
          description: 'Should not be added'
        })
        
        expect(composable.whitelistedIPs.value.length).toBe(initialCount)
      })

      it('should handle expiry date', async () => {
        const expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        
        await composable.addToWhitelist({
          ipAddress: '192.168.100.2',
          description: 'Test with expiry',
          expiryDate: expiryDate.toISOString()
        })
        
        const added = composable.whitelistedIPs.value.find(ip => ip.ipAddress === '192.168.100.2')
        expect(added?.expiryDate).toBeDefined()
      })
    })

    describe('removeFromWhitelist', () => {
      it('should remove IP from whitelist', async () => {
        const ipToRemove = composable.whitelistedIPs.value[0]
        if (!ipToRemove) return

        const initialCount = composable.whitelistedIPs.value.length
        
        await composable.removeFromWhitelist(ipToRemove.id)
        
        expect(composable.whitelistedIPs.value.length).toBe(initialCount - 1)
        const removed = composable.whitelistedIPs.value.find(ip => ip.id === ipToRemove.id)
        expect(removed).toBeUndefined()
      })
    })

    describe('blockIP', () => {
      it('should add IP to blacklist', async () => {
        const initialCount = composable.blacklistedIPs.value.length
        
        const data: BlockIPData = {
          ipAddress: '10.0.0.100',
          reason: 'Test block for suspicious activity'
        }
        
        await composable.blockIP(data)
        
        expect(composable.blacklistedIPs.value.length).toBe(initialCount + 1)
        const blocked = composable.blacklistedIPs.value.find(ip => ip.ipAddress === data.ipAddress)
        expect(blocked).toBeDefined()
        expect(blocked?.reason).toBe(data.reason)
        expect(blocked?.isAutomatic).toBe(false)
      })

      it('should remove from whitelist when blocking', async () => {
        // Add to whitelist first
        await composable.addToWhitelist({
          ipAddress: '10.0.0.101',
          description: 'Test IP'
        })
        
        // Then block it
        await composable.blockIP({
          ipAddress: '10.0.0.101',
          reason: 'Test block'
        })
        
        const whitelisted = composable.whitelistedIPs.value.find(ip => ip.ipAddress === '10.0.0.101')
        expect(whitelisted).toBeUndefined()
      })
    })

    describe('unblockIP', () => {
      it('should set IP as inactive', async () => {
        const ipToUnblock = composable.blacklistedIPs.value.find(ip => ip.isActive)
        if (!ipToUnblock) return

        await composable.unblockIP(ipToUnblock.id)
        
        const unblocked = composable.blacklistedIPs.value.find(ip => ip.id === ipToUnblock.id)
        expect(unblocked?.isActive).toBe(false)
      })
    })

    describe('checkAutoBlock', () => {
      it('should auto-block IP after threshold', async () => {
        const testIP = '10.10.10.10'
        const threshold = composable.autoBlockSettings.value.threshold
        
        // Simulate multiple failed attempts
        for (let i = 0; i < threshold; i++) {
          composable.failedLoginAttempts.value.push({
            id: `test-${i}`,
            timestamp: new Date(),
            username: `user${i}`,
            ipAddress: testIP,
            location: 'Test Location',
            reason: 'Invalid credentials',
            blocked: false
          })
        }
        
        await composable.checkAutoBlock(testIP)
        
        const blocked = composable.blacklistedIPs.value.find(ip => ip.ipAddress === testIP)
        expect(blocked).toBeDefined()
        expect(blocked?.isAutomatic).toBe(true)
      })

      it('should not auto-block whitelisted IP', async () => {
        const whitelistedIP = composable.whitelistedIPs.value[0]?.ipAddress
        if (!whitelistedIP) return

        const threshold = composable.autoBlockSettings.value.threshold
        const initialBlockedCount = composable.blacklistedIPs.value.length
        
        // Simulate multiple failed attempts from whitelisted IP
        for (let i = 0; i < threshold + 5; i++) {
          composable.failedLoginAttempts.value.push({
            id: `test-wl-${i}`,
            timestamp: new Date(),
            username: `user${i}`,
            ipAddress: whitelistedIP,
            location: 'Test Location',
            reason: 'Invalid credentials',
            blocked: false
          })
        }
        
        await composable.checkAutoBlock(whitelistedIP)
        
        expect(composable.blacklistedIPs.value.length).toBe(initialBlockedCount)
      })
    })

    describe('updateAutoBlockSettings', () => {
      it('should update auto-block settings', async () => {
        const newSettings: AutoBlockSettings = {
          threshold: 10,
          timeWindow: 30
        }
        
        await composable.updateAutoBlockSettings(newSettings)
        
        expect(composable.autoBlockSettings.value.threshold).toBe(10)
        expect(composable.autoBlockSettings.value.timeWindow).toBe(30)
      })
    })
  })

  describe('Certificate Management', () => {
    beforeEach(async () => {
      await composable.loadSecurityData()
    })

    describe('calculateCertificateDaysRemaining', () => {
      it('should calculate days remaining correctly', () => {
        const futureDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        const days = composable.calculateCertificateDaysRemaining(futureDate)
        
        expect(days).toBeGreaterThanOrEqual(29)
        expect(days).toBeLessThanOrEqual(31)
      })

      it('should return negative for expired certificates', () => {
        const pastDate = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
        const days = composable.calculateCertificateDaysRemaining(pastDate)
        
        expect(days).toBeLessThan(0)
      })
    })

    describe('renewCertificate', () => {
      it('should initiate certificate renewal', async () => {
        const cert = composable.sslCertificates.value[0]
        if (!cert) return

        await composable.renewCertificate(cert.domain)
        // In a real implementation, this would trigger renewal process
      })
    })
  })

  describe('Vulnerability Scanning', () => {
    beforeEach(async () => {
      await composable.loadSecurityData()
    })

    describe('runVulnerabilityScan', () => {
      it('should set scanning state', async () => {
        const scanPromise = composable.runVulnerabilityScan({ scanType: 'Quick' })
        expect(composable.scanning.value).toBe(true)
        await scanPromise
        expect(composable.scanning.value).toBe(false)
      })

      it('should update last scan date', async () => {
        const before = Date.now()
        await composable.runVulnerabilityScan({ scanType: 'Quick' })
        const after = Date.now()
        
        expect(composable.lastScanDate.value).not.toBeNull()
        const scanTime = composable.lastScanDate.value!.getTime()
        expect(scanTime).toBeGreaterThanOrEqual(before)
        expect(scanTime).toBeLessThanOrEqual(after)
      })

      it('should support different scan types', async () => {
        await composable.runVulnerabilityScan({ scanType: 'Full' })
        expect(composable.scanning.value).toBe(false)
        
        await composable.runVulnerabilityScan({ scanType: 'Custom', targetComponents: ['API', 'Database'] })
        expect(composable.scanning.value).toBe(false)
      })
    })
  })

  describe('Alert Management', () => {
    beforeEach(async () => {
      await composable.loadSecurityData()
    })

    describe('resolveAlert', () => {
      it('should mark alert as resolved', async () => {
        const unresolvedAlert = composable.securityAlerts.value.find(a => !a.resolved)
        if (!unresolvedAlert) return

        await composable.resolveAlert(unresolvedAlert.id)
        
        const resolved = composable.securityAlerts.value.find(a => a.id === unresolvedAlert.id)
        expect(resolved?.resolved).toBe(true)
        expect(resolved?.resolvedBy).toBeDefined()
        expect(resolved?.resolvedAt).toBeDefined()
      })
    })
  })

  describe('Session Management', () => {
    beforeEach(async () => {
      await composable.loadSecurityData()
    })

    describe('forceLogoutSession', () => {
      it('should logout specific session', async () => {
        const sessionToLogout = composable.activeSessions.value.find(s => !s.isCurrentSession)
        if (!sessionToLogout) return

        const initialCount = composable.activeSessions.value.length
        
        await composable.forceLogoutSession(sessionToLogout.sessionId)
        
        expect(composable.activeSessions.value.length).toBe(initialCount - 1)
      })

      it('should prevent logging out current session', async () => {
        const currentSession = composable.activeSessions.value.find(s => s.isCurrentSession)
        if (!currentSession) return

        const initialCount = composable.activeSessions.value.length
        
        await composable.forceLogoutSession(currentSession.sessionId)
        
        expect(composable.activeSessions.value.length).toBe(initialCount)
      })
    })

    describe('forceLogoutAll', () => {
      it('should logout all sessions except current', async () => {
        await composable.forceLogoutAll()
        
        expect(composable.activeSessions.value.length).toBe(1)
        expect(composable.activeSessions.value[0].isCurrentSession).toBe(true)
      })
    })
  })

  describe('Firewall Rules', () => {
    beforeEach(async () => {
      await composable.loadSecurityData()
    })

    describe('addFirewallRule', () => {
      it('should add new firewall rule', async () => {
        const initialCount = composable.firewallRules.value.length
        
        await composable.addFirewallRule({
          priority: 99,
          name: 'Test Rule',
          protocol: 'TCP',
          sourceIPs: ['192.168.1.0/24'],
          destinationIPs: ['10.0.0.0/8'],
          ports: '80,443',
          action: 'Allow'
        })
        
        expect(composable.firewallRules.value.length).toBe(initialCount + 1)
      })

      it('should prevent duplicate priorities', async () => {
        const existingPriority = composable.firewallRules.value[0]?.priority
        if (!existingPriority) return

        const initialCount = composable.firewallRules.value.length
        
        await composable.addFirewallRule({
          priority: existingPriority,
          name: 'Duplicate Priority',
          protocol: 'TCP',
          sourceIPs: ['0.0.0.0/0'],
          destinationIPs: ['0.0.0.0/0'],
          ports: '22',
          action: 'Deny'
        })
        
        expect(composable.firewallRules.value.length).toBe(initialCount)
      })

      it('should parse port ranges', async () => {
        await composable.addFirewallRule({
          priority: 98,
          name: 'Port Range Rule',
          protocol: 'TCP',
          sourceIPs: ['0.0.0.0/0'],
          destinationIPs: ['0.0.0.0/0'],
          ports: '8000-9000',
          action: 'Allow'
        })
        
        const added = composable.firewallRules.value.find(r => r.priority === 98)
        expect(added).toBeDefined()
        expect(added?.ports).toBe('8000-9000')
      })
    })

    describe('toggleFirewallRule', () => {
      it('should toggle rule enabled state', async () => {
        const rule = composable.firewallRules.value[0]
        if (!rule) return

        const initialState = rule.enabled
        
        await composable.toggleFirewallRule(rule.id)
        
        const toggled = composable.firewallRules.value.find(r => r.id === rule.id)
        expect(toggled?.enabled).toBe(!initialState)
      })
    })

    describe('deleteFirewallRule', () => {
      it('should delete firewall rule', async () => {
        const ruleToDelete = composable.firewallRules.value[0]
        if (!ruleToDelete) return

        const initialCount = composable.firewallRules.value.length
        
        await composable.deleteFirewallRule(ruleToDelete.id)
        
        expect(composable.firewallRules.value.length).toBe(initialCount - 1)
      })
    })
  })

  describe('Two-Factor Settings', () => {
    beforeEach(async () => {
      await composable.loadSecurityData()
    })

    it('should update 2FA settings', async () => {
      const newSettings: TwoFactorSettings = {
        enforcement: 'All',
        allowRememberDevice: true,
        trustPeriod: 14
      }
      
      await composable.updateTwoFactorSettings(newSettings)
      
      expect(composable.twoFactorSettings.value.enforcement).toBe('All')
      expect(composable.twoFactorSettings.value.trustPeriod).toBe(14)
    })
  })

  describe('Report Generation', () => {
    beforeEach(async () => {
      await composable.loadSecurityData()
    })

    it('should generate security report', async () => {
      await composable.generateSecurityReport({
        reportType: 'Weekly',
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        endDate: new Date(),
        includeFailedLogins: true,
        includeBlockedIPs: true,
        includeVulnerabilities: true,
        includeCertificates: true,
        includeAlerts: true,
        includeAuditLogs: true,
        includeCompliance: true
      })
      
      // Report generation should complete without errors
    })
  })

  describe('Computed Properties', () => {
    beforeEach(async () => {
      await composable.loadSecurityData()
    })

    it('should filter recent failed logins', () => {
      const recentLogins = composable.recentFailedLogins.value
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
      
      recentLogins.forEach(login => {
        expect(login.timestamp.getTime()).toBeGreaterThanOrEqual(twentyFourHoursAgo.getTime())
      })
    })

    it('should filter critical vulnerabilities', () => {
      const critical = composable.criticalVulnerabilities.value
      
      critical.forEach(vuln => {
        expect(vuln.severity).toBe('Critical')
        expect(vuln.resolved).toBe(false)
      })
    })

    it('should filter expiring certificates', () => {
      const expiring = composable.expiringCertificates.value
      const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      
      expiring.forEach(cert => {
        expect(cert.expiresOn.getTime()).toBeLessThanOrEqual(thirtyDaysFromNow.getTime())
      })
    })

    it('should sort firewall rules by priority', () => {
      const sorted = composable.sortedFirewallRules.value
      
      for (let i = 1; i < sorted.length; i++) {
        expect(sorted[i].priority).toBeGreaterThanOrEqual(sorted[i - 1].priority)
      }
    })

    it('should filter unresolved alerts', () => {
      const unresolved = composable.unresolvedAlerts.value
      
      unresolved.forEach(alert => {
        expect(alert.resolved).toBe(false)
      })
    })
  })
})
