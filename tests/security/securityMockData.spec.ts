import { describe, it, expect } from 'vitest'
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
  getSecurityStatistics
} from '@/data/securityMockData'

describe('Security Mock Data', () => {
  describe('Failed Login Attempts', () => {
    it('should have 90 failed login attempts', () => {
      expect(mockFailedLoginAttempts).toHaveLength(90)
    })

    it('should have correct structure', () => {
      const attempt = mockFailedLoginAttempts[0]
      expect(attempt).toHaveProperty('id')
      expect(attempt).toHaveProperty('timestamp')
      expect(attempt).toHaveProperty('username')
      expect(attempt).toHaveProperty('ipAddress')
      expect(attempt).toHaveProperty('location')
      expect(attempt).toHaveProperty('reason')
      expect(attempt).toHaveProperty('blocked')
    })

    it('should have some blocked attempts', () => {
      const blockedAttempts = mockFailedLoginAttempts.filter(a => a.blocked)
      expect(blockedAttempts.length).toBeGreaterThan(0)
    })

    it('should have Zimbabwe IP addresses', () => {
      const zimbabweIPs = mockFailedLoginAttempts.filter(a =>
        a.ipAddress.startsWith('196.') ||
        a.ipAddress.startsWith('41.') ||
        a.ipAddress.startsWith('197.')
      )
      expect(zimbabweIPs.length).toBeGreaterThan(50)
    })

    it('should have attempts from last 7 days', () => {
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      
      const recentAttempts = mockFailedLoginAttempts.filter(a =>
        a.timestamp >= sevenDaysAgo
      )
      expect(recentAttempts).toHaveLength(90)
    })
  })

  describe('Whitelisted IPs', () => {
    it('should have 15 whitelisted IPs', () => {
      expect(mockWhitelistedIPs).toHaveLength(15)
    })

    it('should have correct structure', () => {
      const ip = mockWhitelistedIPs[0]
      expect(ip).toHaveProperty('id')
      expect(ip).toHaveProperty('ipAddress')
      expect(ip).toHaveProperty('description')
      expect(ip).toHaveProperty('addedBy')
      expect(ip).toHaveProperty('addedDate')
      expect(ip).toHaveProperty('isActive')
    })

    it('should have SECZim office IPs', () => {
      const seczimIPs = mockWhitelistedIPs.filter(ip =>
        ip.description.includes('SECZim')
      )
      expect(seczimIPs.length).toBeGreaterThan(0)
    })

    it('should have some IPs with expiry dates', () => {
      const withExpiry = mockWhitelistedIPs.filter(ip => ip.expiryDate)
      expect(withExpiry.length).toBeGreaterThan(0)
    })
  })

  describe('Blacklisted IPs', () => {
    it('should have 25 blacklisted IPs', () => {
      expect(mockBlacklistedIPs).toHaveLength(25)
    })

    it('should have both automatic and manual blocks', () => {
      const automatic = mockBlacklistedIPs.filter(ip => ip.isAutomatic)
      const manual = mockBlacklistedIPs.filter(ip => !ip.isAutomatic)
      
      expect(automatic.length).toBeGreaterThan(0)
      expect(manual.length).toBeGreaterThan(0)
    })

    it('should have blocked reasons', () => {
      mockBlacklistedIPs.forEach(ip => {
        expect(ip.reason).toBeTruthy()
        expect(ip.reason.length).toBeGreaterThan(10)
      })
    })
  })

  describe('SSL Certificates', () => {
    it('should have 5 certificates', () => {
      expect(mockSSLCertificates).toHaveLength(5)
    })

    it('should have correct structure', () => {
      const cert = mockSSLCertificates[0]
      expect(cert).toHaveProperty('id')
      expect(cert).toHaveProperty('domain')
      expect(cert).toHaveProperty('issuer')
      expect(cert).toHaveProperty('validFrom')
      expect(cert).toHaveProperty('expiresOn')
    })

    it('should have certificates with different expiry states', () => {
      const now = new Date()
      const valid = mockSSLCertificates.filter(c => c.expiresOn > now)
      expect(valid.length).toBeGreaterThan(0)
    })

    it('should have wildcard certificate', () => {
      const wildcard = mockSSLCertificates.find(c => c.domain.startsWith('*.'))
      expect(wildcard).toBeDefined()
    })
  })

  describe('Vulnerabilities', () => {
    it('should have 20 vulnerabilities', () => {
      expect(mockVulnerabilities).toHaveLength(20)
    })

    it('should have all severity levels', () => {
      const severities = new Set(mockVulnerabilities.map(v => v.severity))
      expect(severities.has('Critical')).toBe(true)
      expect(severities.has('High')).toBe(true)
      expect(severities.has('Medium')).toBe(true)
      expect(severities.has('Low')).toBe(true)
    })

    it('should have CVE IDs for critical vulnerabilities', () => {
      const critical = mockVulnerabilities.filter(v => v.severity === 'Critical')
      const withCVE = critical.filter(v => v.cveId)
      expect(withCVE.length).toBeGreaterThan(0)
    })

    it('should have recommendations', () => {
      mockVulnerabilities.forEach(vuln => {
        expect(vuln.recommendation).toBeTruthy()
        expect(vuln.recommendation.length).toBeGreaterThan(10)
      })
    })

    it('should have some resolved vulnerabilities', () => {
      const resolved = mockVulnerabilities.filter(v => v.resolved)
      expect(resolved.length).toBeGreaterThan(0)
    })
  })

  describe('Permission Changes', () => {
    it('should have 40 permission changes', () => {
      expect(mockPermissionChanges).toHaveLength(40)
    })

    it('should have both escalations and demotions', () => {
      const roleOrder: Record<string, number> = {
        'User': 1,
        'Supervisor': 2,
        'Admin': 3,
        'Super Admin': 4
      }

      let escalations = 0
      let demotions = 0

      mockPermissionChanges.forEach(change => {
        const before = roleOrder[change.permissionsBefore] || 0
        const after = roleOrder[change.permissionsAfter] || 0
        if (after > before) escalations++
        if (after < before) demotions++
      })

      expect(escalations).toBeGreaterThan(0)
      expect(demotions).toBeGreaterThan(0)
    })
  })

  describe('Data Access Logs', () => {
    it('should have 150 data access logs', () => {
      expect(mockDataAccessLogs).toHaveLength(150)
    })

    it('should have different data types', () => {
      const dataTypes = new Set(mockDataAccessLogs.map(log => log.dataType))
      expect(dataTypes.size).toBeGreaterThan(3)
    })

    it('should have different actions', () => {
      const actions = new Set(mockDataAccessLogs.map(log => log.action))
      expect(actions.has('View')).toBe(true)
      expect(actions.has('Export')).toBe(true)
      expect(actions.has('Modify')).toBe(true)
    })

    it('should track success/failure', () => {
      const successful = mockDataAccessLogs.filter(log => log.success)
      const failed = mockDataAccessLogs.filter(log => !log.success)
      expect(successful.length).toBeGreaterThan(0)
      expect(failed.length).toBeGreaterThan(0)
    })
  })

  describe('Security Alerts', () => {
    it('should have 10 security alerts', () => {
      expect(mockSecurityAlerts).toHaveLength(10)
    })

    it('should have unresolved alerts', () => {
      const unresolved = mockSecurityAlerts.filter(a => !a.resolved)
      expect(unresolved.length).toBeGreaterThan(0)
    })

    it('should have different alert types', () => {
      const types = new Set(mockSecurityAlerts.map(a => a.type))
      expect(types.size).toBeGreaterThan(3)
    })
  })

  describe('Active Sessions', () => {
    it('should have 20 active sessions', () => {
      expect(mockActiveSessions).toHaveLength(20)
    })

    it('should have one current session', () => {
      const currentSessions = mockActiveSessions.filter(s => s.isCurrentSession)
      expect(currentSessions).toHaveLength(1)
    })

    it('should have different device types', () => {
      const devices = new Set(mockActiveSessions.map(s => s.device))
      expect(devices.has('Desktop')).toBe(true)
      expect(devices.has('Mobile')).toBe(true)
    })
  })

  describe('Firewall Rules', () => {
    it('should have 18 firewall rules', () => {
      expect(mockFirewallRules).toHaveLength(18)
    })

    it('should have unique priorities', () => {
      const priorities = mockFirewallRules.map(r => r.priority)
      const uniquePriorities = new Set(priorities)
      expect(uniquePriorities.size).toBe(priorities.length)
    })

    it('should have both allow and deny rules', () => {
      const allow = mockFirewallRules.filter(r => r.action === 'Allow')
      const deny = mockFirewallRules.filter(r => r.action === 'Deny')
      expect(allow.length).toBeGreaterThan(0)
      expect(deny.length).toBeGreaterThan(0)
    })

    it('should have rules for different protocols', () => {
      const protocols = new Set(mockFirewallRules.map(r => r.protocol))
      expect(protocols.size).toBeGreaterThan(1)
    })
  })

  describe('Auto-Block Settings', () => {
    it('should have valid threshold', () => {
      expect(mockAutoBlockSettings.threshold).toBeGreaterThanOrEqual(3)
      expect(mockAutoBlockSettings.threshold).toBeLessThanOrEqual(20)
    })

    it('should have valid time window', () => {
      expect(mockAutoBlockSettings.timeWindow).toBeGreaterThanOrEqual(1)
      expect(mockAutoBlockSettings.timeWindow).toBeLessThanOrEqual(60)
    })
  })

  describe('Two-Factor Settings', () => {
    it('should have valid enforcement level', () => {
      const validLevels = ['None', 'Admins', 'Supervisors', 'All']
      expect(validLevels).toContain(mockTwoFactorSettings.enforcement)
    })

    it('should have valid trust period', () => {
      expect(mockTwoFactorSettings.trustPeriod).toBeGreaterThanOrEqual(1)
      expect(mockTwoFactorSettings.trustPeriod).toBeLessThanOrEqual(90)
    })
  })

  describe('Security Compliance', () => {
    it('should have all policy flags', () => {
      expect(mockSecurityCompliance).toHaveProperty('passwordPolicy')
      expect(mockSecurityCompliance).toHaveProperty('twoFactorEnabled')
      expect(mockSecurityCompliance).toHaveProperty('encryptionEnabled')
      expect(mockSecurityCompliance).toHaveProperty('regularBackups')
      expect(mockSecurityCompliance).toHaveProperty('auditLogging')
    })

    it('should have valid compliance score', () => {
      expect(mockSecurityCompliance.complianceScore).toBeGreaterThanOrEqual(0)
      expect(mockSecurityCompliance.complianceScore).toBeLessThanOrEqual(100)
    })
  })

  describe('getSecurityStatistics', () => {
    it('should return complete statistics object', () => {
      const stats = getSecurityStatistics()
      
      expect(stats).toHaveProperty('failedLoginsLast24h')
      expect(stats).toHaveProperty('blockedIPsCount')
      expect(stats).toHaveProperty('whitelistedIPsCount')
      expect(stats).toHaveProperty('unresolvedAlertsCount')
      expect(stats).toHaveProperty('criticalVulnerabilitiesCount')
      expect(stats).toHaveProperty('totalCertificates')
      expect(stats).toHaveProperty('expiringCertificatesCount')
      expect(stats).toHaveProperty('activeSessionsCount')
      expect(stats).toHaveProperty('totalFirewallRules')
      expect(stats).toHaveProperty('complianceScore')
      expect(stats).toHaveProperty('totalVulnerabilities')
      expect(stats).toHaveProperty('totalDataAccessLogs')
      expect(stats).toHaveProperty('totalPermissionChanges')
    })

    it('should calculate failed logins last 24h correctly', () => {
      const stats = getSecurityStatistics()
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
      const expected = mockFailedLoginAttempts.filter(a =>
        a.timestamp >= twentyFourHoursAgo
      ).length
      
      expect(stats.failedLoginsLast24h).toBe(expected)
    })

    it('should count blocked IPs correctly', () => {
      const stats = getSecurityStatistics()
      const expected = mockBlacklistedIPs.filter(ip => ip.isActive).length
      expect(stats.blockedIPsCount).toBe(expected)
    })

    it('should count unresolved alerts correctly', () => {
      const stats = getSecurityStatistics()
      const expected = mockSecurityAlerts.filter(a => !a.resolved).length
      expect(stats.unresolvedAlertsCount).toBe(expected)
    })
  })
})
