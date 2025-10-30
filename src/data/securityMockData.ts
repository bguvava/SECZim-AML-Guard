/**
 * Security Management Mock Data
 * Realistic Zimbabwe-based security data for testing and development
 */

import {
  type FailedLoginAttempt,
  type WhitelistedIP,
  type BlacklistedIP,
  type SSLCertificate,
  type Vulnerability,
  type PermissionChange,
  type DataAccessLog,
  type SecurityAlert,
  type ActiveSession,
  type FirewallRule,
  type SecurityStatistics,
  type AutoBlockSettings,
  type TwoFactorSettings,
  type SecurityPolicyCompliance,
  Severity,
  SecurityEventType,
  FirewallAction,
  Protocol,
  DeviceType,
  TwoFactorEnforcement,
} from '@/types/security'

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

// Helper function for date generation (currently unused but kept for future use)
// function randomDate(start: Date, end: Date): Date {
//   return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
// }

function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function hoursAgo(hours: number): Date {
  return new Date(Date.now() - hours * 60 * 60 * 1000)
}

function daysAgo(days: number): Date {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000)
}

function daysFromNow(days: number): Date {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000)
}

// ============================================================================
// ZIMBABWE-SPECIFIC DATA
// ============================================================================

const zimbabweLocations = [
  'Harare', 'Bulawayo', 'Mutare', 'Gweru', 'Kwekwe',
  'Kadoma', 'Masvingo', 'Chinhoyi', 'Norton', 'Marondera'
]

const zimbabweIPs = [
  '196.12.194.', '196.27.104.', '196.43.239.', '196.216.245.',
  '41.57.91.', '41.79.229.', '197.156.67.', '105.244.58.'
]

const commonUsernames = [
  'admin', 'supervisor', 'analyst', 'auditor', 'compliance',
  'john.doe', 'jane.smith', 'tafadzwa', 'rumbi', 'takudzwa',
  'root', 'administrator', 'test', 'demo', 'guest'
]

const failureReasons = [
  'Invalid password',
  'Invalid username',
  'Account locked',
  'Suspicious location',
  'Too many attempts',
  'Session expired',
  'IP address blocked',
  'Account suspended',
]

const userAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X)',
  'Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X)',
]

// ============================================================================
// FAILED LOGIN ATTEMPTS (80+ entries)
// ============================================================================

export const mockFailedLoginAttempts: FailedLoginAttempt[] = []

// Generate 80 failed login attempts
for (let i = 1; i <= 80; i++) {
  const ipPrefix = randomElement(zimbabweIPs)
  const ipSuffix = randomInt(1, 254)
  const ipAddress = `${ipPrefix}${ipSuffix}`
  const username = randomElement(commonUsernames)
  const hoursBack = randomInt(1, 168) // Last 7 days
  
  mockFailedLoginAttempts.push({
    id: `FLA-${String(i).padStart(3, '0')}`,
    timestamp: hoursAgo(hoursBack),
    username,
    ipAddress,
    location: randomElement(zimbabweLocations),
    reason: randomElement(failureReasons),
    userAgent: randomElement(userAgents),
    blocked: hoursBack <= 24 && Math.random() > 0.7 // Some recent ones are blocked
  })
}

// Add some suspicious patterns (same IP, multiple attempts)
const suspiciousIP = '196.12.194.100'
for (let i = 0; i < 10; i++) {
  mockFailedLoginAttempts.push({
    id: `FLA-${String(80 + i).padStart(3, '0')}`,
    timestamp: hoursAgo(randomInt(1, 4)),
    username: randomElement(['admin', 'root', 'administrator']),
    ipAddress: suspiciousIP,
    location: 'Harare',
    reason: 'Invalid password',
    userAgent: userAgents[0],
    blocked: i >= 5 // Blocked after 5 attempts
  })
}

// ============================================================================
// WHITELISTED IPs (15 entries)
// ============================================================================

export const mockWhitelistedIPs: WhitelistedIP[] = [
  {
    id: 'WL-001',
    ipAddress: '196.12.194.10',
    description: 'SECZim Head Office - Harare',
    addedBy: 'System Administrator',
    addedDate: daysAgo(180),
    isActive: true
  },
  {
    id: 'WL-002',
    ipAddress: '196.12.194.11',
    description: 'SECZim Head Office - Backup Gateway',
    addedBy: 'System Administrator',
    addedDate: daysAgo(180),
    isActive: true
  },
  {
    id: 'WL-003',
    ipAddress: '196.27.104.50',
    description: 'Reserve Bank of Zimbabwe - RBZ HQ',
    addedBy: 'John Moyo',
    addedDate: daysAgo(90),
    isActive: true
  },
  {
    id: 'WL-004',
    ipAddress: '196.43.239.75',
    description: 'Zimbabwe Stock Exchange - ZSE Trading Floor',
    addedBy: 'Jane Smith',
    addedDate: daysAgo(120),
    isActive: true
  },
  {
    id: 'WL-005',
    ipAddress: '41.57.91.100',
    description: 'Ministry of Finance - Government Network',
    addedBy: 'System Administrator',
    addedDate: daysAgo(150),
    isActive: true
  },
  {
    id: 'WL-006',
    ipAddress: '196.12.194.20',
    description: 'SECZim Bulawayo Office',
    addedBy: 'Admin User',
    addedDate: daysAgo(100),
    isActive: true
  },
  {
    id: 'WL-007',
    ipAddress: '197.156.67.30',
    description: 'External Auditor - PwC Zimbabwe',
    addedBy: 'Compliance Officer',
    addedDate: daysAgo(30),
    expiryDate: daysFromNow(60),
    isActive: true
  },
  {
    id: 'WL-008',
    ipAddress: '105.244.58.45',
    description: 'Stockbroker - ABC Securities',
    addedBy: 'Jane Smith',
    addedDate: daysAgo(45),
    expiryDate: daysFromNow(315),
    isActive: true
  },
  {
    id: 'WL-009',
    ipAddress: '196.216.245.80',
    description: 'Data Center - Primary Location',
    addedBy: 'System Administrator',
    addedDate: daysAgo(200),
    isActive: true
  },
  {
    id: 'WL-010',
    ipAddress: '41.79.229.90',
    description: 'Disaster Recovery Site - Bulawayo',
    addedBy: 'System Administrator',
    addedDate: daysAgo(200),
    isActive: true
  },
  {
    id: 'WL-011',
    ipAddress: '196.12.194.25',
    description: 'Administrator Home Office - VPN',
    addedBy: 'John Moyo',
    addedDate: daysAgo(60),
    expiryDate: daysFromNow(5), // Expiring soon
    isActive: true
  },
  {
    id: 'WL-012',
    ipAddress: '196.27.104.120',
    description: 'Compliance Team - Remote Access',
    addedBy: 'Compliance Officer',
    addedDate: daysAgo(20),
    expiryDate: daysFromNow(70),
    isActive: true
  },
  {
    id: 'WL-013',
    ipAddress: '41.57.91.150',
    description: 'Testing Environment - DevOps Team',
    addedBy: 'Dev Lead',
    addedDate: daysAgo(10),
    expiryDate: daysFromNow(20),
    isActive: true
  },
  {
    id: 'WL-014',
    ipAddress: '196.43.239.200',
    description: 'API Integration - Partner Bank',
    addedBy: 'System Administrator',
    addedDate: daysAgo(75),
    expiryDate: daysFromNow(285),
    isActive: true
  },
  {
    id: 'WL-015',
    ipAddress: '197.156.67.100',
    description: 'Monitoring Service - Nagios Server',
    addedBy: 'System Administrator',
    addedDate: daysAgo(90),
    isActive: true
  },
]

// ============================================================================
// BLACKLISTED IPs (25 entries)
// ============================================================================

export const mockBlacklistedIPs: BlacklistedIP[] = [
  // Auto-blocked (from failed logins)
  {
    id: 'BL-001',
    ipAddress: suspiciousIP,
    reason: 'Auto-blocked: 10 failed login attempts in 2 hours',
    blockedDate: hoursAgo(3),
    blockedBy: 'Auto-Block System',
    isAutomatic: true,
    isActive: true
  },
  {
    id: 'BL-002',
    ipAddress: '103.45.67.89',
    reason: 'Auto-blocked: 8 failed login attempts in 15 minutes',
    blockedDate: hoursAgo(12),
    blockedBy: 'Auto-Block System',
    isAutomatic: true,
    isActive: true
  },
  {
    id: 'BL-003',
    ipAddress: '185.220.101.52',
    reason: 'Auto-blocked: Brute force attack detected',
    blockedDate: daysAgo(1),
    blockedBy: 'Auto-Block System',
    isAutomatic: true,
    isActive: true
  },
  {
    id: 'BL-004',
    ipAddress: '198.98.52.141',
    reason: 'Auto-blocked: Multiple invalid usernames',
    blockedDate: daysAgo(2),
    blockedBy: 'Auto-Block System',
    isAutomatic: true,
    isActive: true
  },
  {
    id: 'BL-005',
    ipAddress: '91.219.237.21',
    reason: 'Auto-blocked: SQL injection attempt detected',
    blockedDate: daysAgo(3),
    blockedBy: 'Auto-Block System',
    isAutomatic: true,
    isActive: true
  },
  // Manually blocked (known threats)
  {
    id: 'BL-006',
    ipAddress: '45.142.120.10',
    reason: 'Known malicious IP - Listed in threat database',
    blockedDate: daysAgo(30),
    blockedBy: 'Security Team',
    isAutomatic: false,
    isActive: true
  },
  {
    id: 'BL-007',
    ipAddress: '178.128.195.40',
    reason: 'Port scanning activity detected',
    blockedDate: daysAgo(15),
    blockedBy: 'John Moyo',
    isAutomatic: false,
    isActive: true
  },
  {
    id: 'BL-008',
    ipAddress: '23.129.64.188',
    reason: 'Malware distribution source',
    blockedDate: daysAgo(45),
    blockedBy: 'Security Team',
    isAutomatic: false,
    isActive: true
  },
  {
    id: 'BL-009',
    ipAddress: '185.220.102.8',
    reason: 'Tor exit node - Anonymized traffic',
    blockedDate: daysAgo(60),
    blockedBy: 'System Administrator',
    isAutomatic: false,
    isActive: true
  },
  {
    id: 'BL-010',
    ipAddress: '194.26.192.110',
    reason: 'Spam activity detected',
    blockedDate: daysAgo(20),
    blockedBy: 'Jane Smith',
    isAutomatic: false,
    isActive: true
  },
  {
    id: 'BL-011',
    ipAddress: '103.253.145.30',
    reason: 'XSS attack attempt',
    blockedDate: daysAgo(10),
    blockedBy: 'Security Team',
    isAutomatic: false,
    isActive: true
  },
  {
    id: 'BL-012',
    ipAddress: '45.61.186.13',
    reason: 'DDoS attack source',
    blockedDate: daysAgo(5),
    blockedBy: 'John Moyo',
    isAutomatic: false,
    isActive: true
  },
  {
    id: 'BL-013',
    ipAddress: '159.203.45.78',
    reason: 'Unauthorized API access attempts',
    blockedDate: daysAgo(25),
    blockedBy: 'Security Team',
    isAutomatic: false,
    isActive: true
  },
  {
    id: 'BL-014',
    ipAddress: '164.90.222.65',
    reason: 'Credential stuffing attack',
    blockedDate: daysAgo(18),
    blockedBy: 'System Administrator',
    isAutomatic: false,
    isActive: true
  },
  {
    id: 'BL-015',
    ipAddress: '104.248.59.38',
    reason: 'Suspicious bot activity',
    blockedDate: daysAgo(12),
    blockedBy: 'Jane Smith',
    isAutomatic: false,
    isActive: true
  },
  {
    id: 'BL-016',
    ipAddress: '167.71.13.196',
    reason: 'Phishing attempt origin',
    blockedDate: daysAgo(7),
    blockedBy: 'Security Team',
    isAutomatic: false,
    isActive: true
  },
  {
    id: 'BL-017',
    ipAddress: '143.198.108.240',
    reason: 'Path traversal attack attempt',
    blockedDate: daysAgo(22),
    blockedBy: 'John Moyo',
    isAutomatic: false,
    isActive: true
  },
  {
    id: 'BL-018',
    ipAddress: '206.189.156.202',
    reason: 'Command injection detected',
    blockedDate: daysAgo(35),
    blockedBy: 'Security Team',
    isAutomatic: false,
    isActive: true
  },
  {
    id: 'BL-019',
    ipAddress: '134.209.24.42',
    reason: 'XML external entity attack',
    blockedDate: daysAgo(28),
    blockedBy: 'System Administrator',
    isAutomatic: false,
    isActive: true
  },
  {
    id: 'BL-020',
    ipAddress: '147.182.255.73',
    reason: 'Cross-site scripting attempt',
    blockedDate: daysAgo(14),
    blockedBy: 'Jane Smith',
    isAutomatic: false,
    isActive: true
  },
  {
    id: 'BL-021',
    ipAddress: '188.166.29.101',
    reason: 'Server-side request forgery',
    blockedDate: daysAgo(40),
    blockedBy: 'Security Team',
    isAutomatic: false,
    isActive: true
  },
  {
    id: 'BL-022',
    ipAddress: '142.93.114.230',
    reason: 'Remote code execution attempt',
    blockedDate: daysAgo(50),
    blockedBy: 'John Moyo',
    isAutomatic: false,
    isActive: true
  },
  {
    id: 'BL-023',
    ipAddress: '68.183.200.63',
    reason: 'Insecure deserialization exploit',
    blockedDate: daysAgo(33),
    blockedBy: 'Security Team',
    isAutomatic: false,
    isActive: true
  },
  {
    id: 'BL-024',
    ipAddress: '157.245.108.191',
    reason: 'Using components with known vulnerabilities',
    blockedDate: daysAgo(19),
    blockedBy: 'System Administrator',
    isAutomatic: false,
    isActive: true
  },
  {
    id: 'BL-025',
    ipAddress: '178.62.78.29',
    reason: 'Insufficient logging and monitoring exploitation',
    blockedDate: daysAgo(8),
    blockedBy: 'Jane Smith',
    isAutomatic: false,
    isActive: true
  },
]

// ============================================================================
// AUTO-BLOCK SETTINGS
// ============================================================================

export const mockAutoBlockSettings: AutoBlockSettings = {
  threshold: 5, // Block after 5 failed attempts
  timeWindow: 15, // Within 15 minutes
}

// ============================================================================
// SSL CERTIFICATES (5 entries)
// ============================================================================

function calculateDaysRemaining(expiryDate: Date): number {
  const now = new Date()
  const diffTime = expiryDate.getTime() - now.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

function getCertificateStatus(daysRemaining: number): 'valid' | 'warning' | 'critical' | 'expired' {
  if (daysRemaining < 0) return 'expired'
  if (daysRemaining <= 7) return 'critical'
  if (daysRemaining <= 30) return 'warning'
  return 'valid'
}

const cert1ExpiryDate = daysFromNow(180)
const cert2ExpiryDate = daysFromNow(15) // Warning
const cert3ExpiryDate = daysFromNow(5) // Critical
const cert4ExpiryDate = daysFromNow(90)
const cert5ExpiryDate = daysFromNow(365)

export const mockSSLCertificates: SSLCertificate[] = [
  {
    id: 'CERT-001',
    domain: 'amlguard.seczimbabwe.co.zw',
    issuer: 'Let\'s Encrypt Authority X3',
    validFrom: daysAgo(185),
    expiresOn: cert1ExpiryDate,
    daysRemaining: calculateDaysRemaining(cert1ExpiryDate),
    status: getCertificateStatus(calculateDaysRemaining(cert1ExpiryDate)),
    serialNumber: '03:F7:E9:2B:91:DC:7A:5E:3A:9C:12:44:E6:77:88:BB',
    fingerprint: 'SHA256:A1:B2:C3:D4:E5:F6:07:08:09:0A:1B:2C:3D:4E:5F:60'
  },
  {
    id: 'CERT-002',
    domain: 'api.amlguard.seczimbabwe.co.zw',
    issuer: 'DigiCert Inc',
    validFrom: daysAgo(350),
    expiresOn: cert2ExpiryDate,
    daysRemaining: calculateDaysRemaining(cert2ExpiryDate),
    status: getCertificateStatus(calculateDaysRemaining(cert2ExpiryDate)),
    serialNumber: '0C:79:A9:44:B0:8C:11:95:20:92:61:5F:E2:6B:1D:83',
    fingerprint: 'SHA256:B2:C3:D4:E5:F6:07:18:29:3A:4B:5C:6D:7E:8F:90:A1'
  },
  {
    id: 'CERT-003',
    domain: 'admin.amlguard.seczimbabwe.co.zw',
    issuer: 'GlobalSign nv-sa',
    validFrom: daysAgo(360),
    expiresOn: cert3ExpiryDate,
    daysRemaining: calculateDaysRemaining(cert3ExpiryDate),
    status: getCertificateStatus(calculateDaysRemaining(cert3ExpiryDate)),
    serialNumber: '12:34:56:78:9A:BC:DE:F0:12:34:56:78:9A:BC:DE:F0',
    fingerprint: 'SHA256:C3:D4:E5:F6:07:18:29:3A:4B:5C:6D:7E:8F:90:A1:B2'
  },
  {
    id: 'CERT-004',
    domain: 'reports.amlguard.seczimbabwe.co.zw',
    issuer: 'Let\'s Encrypt Authority X3',
    validFrom: daysAgo(275),
    expiresOn: cert4ExpiryDate,
    daysRemaining: calculateDaysRemaining(cert4ExpiryDate),
    status: getCertificateStatus(calculateDaysRemaining(cert4ExpiryDate)),
    serialNumber: 'FE:DC:BA:98:76:54:32:10:FE:DC:BA:98:76:54:32:10',
    fingerprint: 'SHA256:D4:E5:F6:07:18:29:3A:4B:5C:6D:7E:8F:90:A1:B2:C3'
  },
  {
    id: 'CERT-005',
    domain: '*.seczimbabwe.co.zw',
    issuer: 'Sectigo RSA Domain Validation Secure Server CA',
    validFrom: daysAgo(0),
    expiresOn: cert5ExpiryDate,
    daysRemaining: calculateDaysRemaining(cert5ExpiryDate),
    status: getCertificateStatus(calculateDaysRemaining(cert5ExpiryDate)),
    serialNumber: '11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF:00',
    fingerprint: 'SHA256:E5:F6:07:18:29:3A:4B:5C:6D:7E:8F:90:A1:B2:C3:D4'
  },
]

// ============================================================================
// VULNERABILITIES (20 entries)
// ============================================================================

export const mockVulnerabilities: Vulnerability[] = [
  // Critical
  {
    id: 'VULN-001',
    severity: Severity.Critical,
    title: 'SQL Injection in Authentication Module',
    description: 'Potential SQL injection vulnerability found in login endpoint allowing database manipulation',
    affectedComponent: 'Authentication Service',
    cveId: 'CVE-2024-1234',
    recommendation: 'Implement parameterized queries and input sanitization',
    discoveredDate: daysAgo(2),
    status: 'open'
  },
  {
    id: 'VULN-002',
    severity: Severity.Critical,
    title: 'Remote Code Execution in File Upload',
    description: 'Unrestricted file upload allows execution of arbitrary code',
    affectedComponent: 'Document Management System',
    cveId: 'CVE-2024-5678',
    recommendation: 'Validate file types, scan uploads, disable execution in upload directory',
    discoveredDate: daysAgo(5),
    status: 'in-progress'
  },
  {
    id: 'VULN-003',
    severity: Severity.Critical,
    title: 'Broken Authentication - Session Fixation',
    description: 'Session IDs not regenerated after login, allowing session fixation attacks',
    affectedComponent: 'Session Manager',
    cveId: 'CVE-2024-9012',
    recommendation: 'Regenerate session ID upon authentication',
    discoveredDate: daysAgo(1),
    status: 'open'
  },
  // High
  {
    id: 'VULN-004',
    severity: Severity.High,
    title: 'Cross-Site Scripting (XSS) in User Profile',
    description: 'Stored XSS vulnerability in user profile fields',
    affectedComponent: 'User Management',
    cveId: 'CVE-2024-3456',
    recommendation: 'Implement output encoding and Content Security Policy',
    discoveredDate: daysAgo(3),
    status: 'open'
  },
  {
    id: 'VULN-005',
    severity: Severity.High,
    title: 'Insecure Direct Object Reference (IDOR)',
    description: 'User IDs exposed in URLs allowing unauthorized data access',
    affectedComponent: 'API Endpoints',
    recommendation: 'Implement proper authorization checks for all resources',
    discoveredDate: daysAgo(4),
    status: 'in-progress'
  },
  {
    id: 'VULN-006',
    severity: Severity.High,
    title: 'Missing Security Headers',
    description: 'Critical security headers (X-Frame-Options, CSP) not configured',
    affectedComponent: 'Web Server Configuration',
    recommendation: 'Configure security headers in web server',
    discoveredDate: daysAgo(7),
    status: 'resolved'
  },
  {
    id: 'VULN-007',
    severity: Severity.High,
    title: 'Weak Password Policy',
    description: 'Password policy allows weak passwords (minimum 6 characters)',
    affectedComponent: 'Authentication Service',
    recommendation: 'Enforce minimum 12 characters with complexity requirements',
    discoveredDate: daysAgo(10),
    status: 'in-progress'
  },
  {
    id: 'VULN-008',
    severity: Severity.High,
    title: 'Sensitive Data Exposure in Logs',
    description: 'Passwords and tokens logged in plaintext',
    affectedComponent: 'Logging Service',
    recommendation: 'Implement log sanitization to remove sensitive data',
    discoveredDate: daysAgo(6),
    status: 'resolved'
  },
  // Medium
  {
    id: 'VULN-009',
    severity: Severity.Medium,
    title: 'CSRF Token Missing on Forms',
    description: 'Some forms do not implement CSRF protection',
    affectedComponent: 'Web Forms',
    recommendation: 'Add CSRF tokens to all state-changing forms',
    discoveredDate: daysAgo(8),
    status: 'in-progress'
  },
  {
    id: 'VULN-010',
    severity: Severity.Medium,
    title: 'Outdated JavaScript Libraries',
    description: 'Using jQuery 2.x with known vulnerabilities',
    affectedComponent: 'Frontend Dependencies',
    cveId: 'CVE-2023-7890',
    recommendation: 'Update to jQuery 3.6+ or remove dependency',
    discoveredDate: daysAgo(12),
    status: 'open'
  },
  {
    id: 'VULN-011',
    severity: Severity.Medium,
    title: 'Insufficient Rate Limiting',
    description: 'API endpoints lack rate limiting, enabling brute force attacks',
    affectedComponent: 'API Gateway',
    recommendation: 'Implement rate limiting on all API endpoints',
    discoveredDate: daysAgo(9),
    status: 'in-progress'
  },
  {
    id: 'VULN-012',
    severity: Severity.Medium,
    title: 'Weak Cipher Suites Enabled',
    description: 'TLS configuration allows weak cipher suites (3DES, RC4)',
    affectedComponent: 'SSL/TLS Configuration',
    recommendation: 'Disable weak ciphers, use only strong cipher suites',
    discoveredDate: daysAgo(15),
    status: 'resolved'
  },
  {
    id: 'VULN-013',
    severity: Severity.Medium,
    title: 'Information Disclosure in Error Messages',
    description: 'Detailed error messages reveal system information',
    affectedComponent: 'Error Handling',
    recommendation: 'Use generic error messages for end users',
    discoveredDate: daysAgo(11),
    status: 'open'
  },
  {
    id: 'VULN-014',
    severity: Severity.Medium,
    title: 'Unvalidated Redirects',
    description: 'Open redirect vulnerability in logout functionality',
    affectedComponent: 'Authentication Service',
    recommendation: 'Validate redirect URLs against whitelist',
    discoveredDate: daysAgo(14),
    status: 'in-progress'
  },
  // Low
  {
    id: 'VULN-015',
    severity: Severity.Low,
    title: 'Missing HttpOnly Flag on Cookies',
    description: 'Session cookies accessible via JavaScript',
    affectedComponent: 'Cookie Configuration',
    recommendation: 'Set HttpOnly flag on all session cookies',
    discoveredDate: daysAgo(20),
    status: 'resolved'
  },
  {
    id: 'VULN-016',
    severity: Severity.Low,
    title: 'Clickjacking Vulnerability',
    description: 'X-Frame-Options not set, allowing clickjacking attacks',
    affectedComponent: 'Web Server Configuration',
    recommendation: 'Set X-Frame-Options header to DENY or SAMEORIGIN',
    discoveredDate: daysAgo(18),
    status: 'resolved'
  },
  {
    id: 'VULN-017',
    severity: Severity.Low,
    title: 'Verbose Server Banner',
    description: 'Web server reveals version information in headers',
    affectedComponent: 'Web Server Configuration',
    recommendation: 'Disable server version disclosure',
    discoveredDate: daysAgo(25),
    status: 'open'
  },
  {
    id: 'VULN-018',
    severity: Severity.Low,
    title: 'Insecure Cookie Attributes',
    description: 'Cookies missing Secure flag when served over HTTPS',
    affectedComponent: 'Cookie Configuration',
    recommendation: 'Set Secure flag on all cookies',
    discoveredDate: daysAgo(22),
    status: 'in-progress'
  },
  {
    id: 'VULN-019',
    severity: Severity.Low,
    title: 'Directory Listing Enabled',
    description: 'Directory listing enabled on web server',
    affectedComponent: 'Web Server Configuration',
    recommendation: 'Disable directory browsing',
    discoveredDate: daysAgo(30),
    status: 'resolved'
  },
  {
    id: 'VULN-020',
    severity: Severity.Low,
    title: 'Autocomplete Enabled on Sensitive Fields',
    description: 'Password fields have autocomplete enabled',
    affectedComponent: 'Web Forms',
    recommendation: 'Set autocomplete=off on sensitive input fields',
    discoveredDate: daysAgo(28),
    status: 'resolved'
  },
]

// ============================================================================
// PERMISSION CHANGES (40 entries)
// ============================================================================

const adminUsers = ['John Moyo', 'Jane Smith', 'System Administrator', 'Compliance Officer']
const affectedUsers = ['User1', 'User2', 'User3', 'Analyst1', 'Supervisor1', 'Auditor1', 'Examiner1']
const permissions = ['View Only', 'Analyst', 'Supervisor', 'Auditor', 'Administrator']

export const mockPermissionChanges: PermissionChange[] = []

for (let i = 1; i <= 40; i++) {
  const beforeIndex = randomInt(0, permissions.length - 2)
  const afterIndex = beforeIndex + (Math.random() > 0.5 ? 1 : -1)
  
  mockPermissionChanges.push({
    id: `PC-${String(i).padStart(3, '0')}`,
    timestamp: daysAgo(randomInt(1, 30)),
    adminUser: randomElement(adminUsers),
    affectedUser: randomElement(affectedUsers),
    beforePermission: permissions[Math.max(0, beforeIndex)],
    afterPermission: permissions[Math.min(permissions.length - 1, Math.max(0, afterIndex))],
    reason: Math.random() > 0.5 ? 'Role change as per management directive' : undefined,
    ipAddress: `${randomElement(zimbabweIPs)}${randomInt(1, 254)}`
  })
}

// ============================================================================
// DATA ACCESS LOGS (150 entries)
// ============================================================================

const dataTypes = ['Entity Data', 'User Profile', 'Financial Report', 'Audit Log', 'System Configuration', 'Compliance Document']
const actions: ('view' | 'export' | 'edit' | 'delete' | 'create')[] = ['view', 'export', 'edit', 'delete', 'create']

export const mockDataAccessLogs: DataAccessLog[] = []

for (let i = 1; i <= 150; i++) {
  mockDataAccessLogs.push({
    id: `DAL-${String(i).padStart(3, '0')}`,
    timestamp: hoursAgo(randomInt(1, 168)),
    user: randomElement([...adminUsers, ...affectedUsers]),
    userId: `USR-${randomInt(100, 999)}`,
    dataType: randomElement(dataTypes),
    action: randomElement(actions),
    ipAddress: `${randomElement(zimbabweIPs)}${randomInt(1, 254)}`,
    userAgent: randomElement(userAgents),
    success: Math.random() > 0.05 // 95% success rate
  })
}

// ============================================================================
// SECURITY ALERTS (10 entries)
// ============================================================================

export const mockSecurityAlerts: SecurityAlert[] = [
  {
    id: 'ALERT-001',
    type: SecurityEventType.BulkDownload,
    severity: Severity.High,
    title: 'Bulk Data Export Detected',
    description: 'User exported 15 reports in 30 minutes',
    timestamp: hoursAgo(2),
    affectedUser: 'Analyst1',
    ipAddress: '196.12.194.150',
    resolved: false
  },
  {
    id: 'ALERT-002',
    type: SecurityEventType.UnusualActivity,
    severity: Severity.Medium,
    title: 'Login from Unusual Location',
    description: 'Administrator login from international IP address',
    timestamp: hoursAgo(5),
    affectedUser: 'John Moyo',
    ipAddress: '185.220.101.52',
    resolved: true,
    resolvedBy: 'John Moyo',
    resolvedAt: hoursAgo(4)
  },
  {
    id: 'ALERT-003',
    type: SecurityEventType.PermissionEscalation,
    severity: Severity.Critical,
    title: 'Unauthorized Permission Escalation Attempt',
    description: 'User attempted to modify their own permissions',
    timestamp: hoursAgo(12),
    affectedUser: 'User2',
    ipAddress: '196.27.104.200',
    resolved: true,
    resolvedBy: 'System Administrator',
    resolvedAt: hoursAgo(11)
  },
  {
    id: 'ALERT-004',
    type: SecurityEventType.SuspiciousAccess,
    severity: Severity.High,
    title: 'Access to Sensitive Data Outside Business Hours',
    description: 'Financial reports accessed at 2:00 AM',
    timestamp: hoursAgo(18),
    affectedUser: 'Supervisor1',
    ipAddress: '41.57.91.200',
    resolved: false
  },
  {
    id: 'ALERT-005',
    type: SecurityEventType.UnauthorizedAttempt,
    severity: Severity.Medium,
    title: 'Multiple Failed Authorization Checks',
    description: 'User attempted to access restricted areas 5 times',
    timestamp: hoursAgo(24),
    affectedUser: 'Analyst1',
    ipAddress: '196.43.239.180',
    resolved: true,
    resolvedBy: 'Jane Smith',
    resolvedAt: hoursAgo(23)
  },
  {
    id: 'ALERT-006',
    type: SecurityEventType.BulkDownload,
    severity: Severity.High,
    title: 'Large Data Export',
    description: 'User exported entire entity database',
    timestamp: daysAgo(1),
    affectedUser: 'Auditor1',
    ipAddress: '197.156.67.150',
    resolved: false
  },
  {
    id: 'ALERT-007',
    type: SecurityEventType.UnusualActivity,
    severity: Severity.Low,
    title: 'Unusual Login Time',
    description: 'User logged in at 11:00 PM on Sunday',
    timestamp: daysAgo(2),
    affectedUser: 'User3',
    ipAddress: '105.244.58.120',
    resolved: true,
    resolvedBy: 'Compliance Officer',
    resolvedAt: daysAgo(1)
  },
  {
    id: 'ALERT-008',
    type: SecurityEventType.SuspiciousAccess,
    severity: Severity.Medium,
    title: 'Rapid Sequential Data Access',
    description: 'User viewed 50 entity profiles in 10 minutes',
    timestamp: daysAgo(3),
    affectedUser: 'Supervisor1',
    ipAddress: '196.216.245.140',
    resolved: false
  },
  {
    id: 'ALERT-009',
    type: SecurityEventType.FailedLogin,
    severity: Severity.Info,
    title: 'Multiple Failed Login Attempts',
    description: '3 failed login attempts with correct username',
    timestamp: daysAgo(4),
    affectedUser: 'Analyst1',
    ipAddress: '41.79.229.100',
    resolved: true,
    resolvedBy: 'System Administrator',
    resolvedAt: daysAgo(4)
  },
  {
    id: 'ALERT-010',
    type: SecurityEventType.UnauthorizedAttempt,
    severity: Severity.High,
    title: 'API Access with Invalid Token',
    description: 'Multiple API requests with expired authentication token',
    timestamp: daysAgo(5),
    ipAddress: '196.12.194.250',
    resolved: false
  },
]

// ============================================================================
// ACTIVE SESSIONS (20 entries)
// ============================================================================

const devices: DeviceType[] = [DeviceType.Desktop, DeviceType.Mobile, DeviceType.Tablet]
const deviceInfos = [
  'Windows 10 - Chrome 118',
  'macOS Sonoma - Safari 17',
  'Ubuntu 22.04 - Firefox 119',
  'iPhone 15 Pro - Safari Mobile',
  'Samsung Galaxy S23 - Chrome Mobile',
  'iPad Air - Safari Mobile',
]

export const mockActiveSessions: ActiveSession[] = []

for (let i = 1; i <= 20; i++) {
  const loginHours = randomInt(1, 8)
  mockActiveSessions.push({
    id: `SESS-${String(i).padStart(3, '0')}`,
    sessionId: `sess_${Math.random().toString(36).substring(2, 15)}`,
    user: randomElement([...adminUsers, ...affectedUsers]),
    userId: `USR-${randomInt(100, 999)}`,
    ipAddress: `${randomElement(zimbabweIPs)}${randomInt(1, 254)}`,
    location: randomElement(zimbabweLocations),
    device: randomElement(devices),
    deviceInfo: randomElement(deviceInfos),
    loginTime: hoursAgo(loginHours),
    lastActivity: hoursAgo(randomInt(0, loginHours)),
    isCurrentSession: i === 1 // First session is current
  })
}

// ============================================================================
// FIREWALL RULES (18 entries)
// ============================================================================

export const mockFirewallRules: FirewallRule[] = [
  {
    id: 'FW-001',
    priority: 1,
    name: 'Allow HTTPS from Anywhere',
    protocol: Protocol.TCP,
    sourceIPs: ['0.0.0.0/0'],
    destinationIPs: ['192.168.1.100'],
    sourcePorts: [],
    destinationPorts: [443],
    action: FirewallAction.Allow,
    enabled: true,
    createdBy: 'System Administrator',
    createdAt: daysAgo(180),
    description: 'Allow incoming HTTPS traffic'
  },
  {
    id: 'FW-002',
    priority: 2,
    name: 'Allow HTTP Redirect',
    protocol: Protocol.TCP,
    sourceIPs: ['0.0.0.0/0'],
    destinationIPs: ['192.168.1.100'],
    sourcePorts: [],
    destinationPorts: [80],
    action: FirewallAction.Allow,
    enabled: true,
    createdBy: 'System Administrator',
    createdAt: daysAgo(180),
    description: 'Allow HTTP for redirect to HTTPS'
  },
  {
    id: 'FW-003',
    priority: 3,
    name: 'Allow SSH from Trusted IPs',
    protocol: Protocol.TCP,
    sourceIPs: ['196.12.194.0/24', '196.27.104.0/24'],
    destinationIPs: ['192.168.1.100'],
    sourcePorts: [],
    destinationPorts: [22],
    action: FirewallAction.Allow,
    enabled: true,
    createdBy: 'System Administrator',
    createdAt: daysAgo(180),
    description: 'SSH access for administrators'
  },
  {
    id: 'FW-004',
    priority: 10,
    name: 'Deny SSH from Everywhere Else',
    protocol: Protocol.TCP,
    sourceIPs: ['0.0.0.0/0'],
    destinationIPs: ['192.168.1.100'],
    sourcePorts: [],
    destinationPorts: [22],
    action: FirewallAction.Deny,
    enabled: true,
    createdBy: 'System Administrator',
    createdAt: daysAgo(180),
    description: 'Block SSH from untrusted sources'
  },
  {
    id: 'FW-005',
    priority: 5,
    name: 'Allow Database from App Server',
    protocol: Protocol.TCP,
    sourceIPs: ['192.168.1.50'],
    destinationIPs: ['192.168.1.200'],
    sourcePorts: [],
    destinationPorts: [5432],
    action: FirewallAction.Allow,
    enabled: true,
    createdBy: 'System Administrator',
    createdAt: daysAgo(150),
    description: 'PostgreSQL access for application'
  },
  {
    id: 'FW-006',
    priority: 15,
    name: 'Block Telnet',
    protocol: Protocol.TCP,
    sourceIPs: ['0.0.0.0/0'],
    destinationIPs: ['0.0.0.0/0'],
    sourcePorts: [],
    destinationPorts: [23],
    action: FirewallAction.Deny,
    enabled: true,
    createdBy: 'Security Team',
    createdAt: daysAgo(180),
    description: 'Block insecure Telnet protocol'
  },
  {
    id: 'FW-007',
    priority: 16,
    name: 'Block FTP',
    protocol: Protocol.TCP,
    sourceIPs: ['0.0.0.0/0'],
    destinationIPs: ['0.0.0.0/0'],
    sourcePorts: [],
    destinationPorts: [20, 21],
    action: FirewallAction.Deny,
    enabled: true,
    createdBy: 'Security Team',
    createdAt: daysAgo(180),
    description: 'Block insecure FTP protocol'
  },
  {
    id: 'FW-008',
    priority: 4,
    name: 'Allow DNS',
    protocol: Protocol.UDP,
    sourceIPs: ['192.168.1.0/24'],
    destinationIPs: ['8.8.8.8', '8.8.4.4'],
    sourcePorts: [],
    destinationPorts: [53],
    action: FirewallAction.Allow,
    enabled: true,
    createdBy: 'System Administrator',
    createdAt: daysAgo(180),
    description: 'Allow DNS queries'
  },
  {
    id: 'FW-009',
    priority: 6,
    name: 'Allow NTP',
    protocol: Protocol.UDP,
    sourceIPs: ['192.168.1.0/24'],
    destinationIPs: ['0.0.0.0/0'],
    sourcePorts: [],
    destinationPorts: [123],
    action: FirewallAction.Allow,
    enabled: true,
    createdBy: 'System Administrator',
    createdAt: daysAgo(180),
    description: 'Allow time synchronization'
  },
  {
    id: 'FW-010',
    priority: 20,
    name: 'Block NetBIOS',
    protocol: Protocol.TCP,
    sourceIPs: ['0.0.0.0/0'],
    destinationIPs: ['0.0.0.0/0'],
    sourcePorts: [],
    destinationPorts: [137, 138, 139],
    action: FirewallAction.Deny,
    enabled: true,
    createdBy: 'Security Team',
    createdAt: daysAgo(180),
    description: 'Block NetBIOS traffic'
  },
  {
    id: 'FW-011',
    priority: 21,
    name: 'Block SMB',
    protocol: Protocol.TCP,
    sourceIPs: ['0.0.0.0/0'],
    destinationIPs: ['0.0.0.0/0'],
    sourcePorts: [],
    destinationPorts: [445],
    action: FirewallAction.Deny,
    enabled: true,
    createdBy: 'Security Team',
    createdAt: daysAgo(180),
    description: 'Block SMB protocol'
  },
  {
    id: 'FW-012',
    priority: 7,
    name: 'Allow Email (SMTP)',
    protocol: Protocol.TCP,
    sourceIPs: ['192.168.1.100'],
    destinationIPs: ['0.0.0.0/0'],
    sourcePorts: [],
    destinationPorts: [587],
    action: FirewallAction.Allow,
    enabled: true,
    createdBy: 'System Administrator',
    createdAt: daysAgo(150),
    description: 'Allow outbound email'
  },
  {
    id: 'FW-013',
    priority: 8,
    name: 'Allow ICMP Ping',
    protocol: Protocol.ICMP,
    sourceIPs: ['196.12.194.0/24'],
    destinationIPs: ['192.168.1.0/24'],
    sourcePorts: [],
    destinationPorts: [],
    action: FirewallAction.Allow,
    enabled: true,
    createdBy: 'System Administrator',
    createdAt: daysAgo(180),
    description: 'Allow ping for monitoring'
  },
  {
    id: 'FW-014',
    priority: 30,
    name: 'Deny ICMP from External',
    protocol: Protocol.ICMP,
    sourceIPs: ['0.0.0.0/0'],
    destinationIPs: ['192.168.1.0/24'],
    sourcePorts: [],
    destinationPorts: [],
    action: FirewallAction.Deny,
    enabled: true,
    createdBy: 'Security Team',
    createdAt: daysAgo(180),
    description: 'Block external ping'
  },
  {
    id: 'FW-015',
    priority: 9,
    name: 'Allow VPN',
    protocol: Protocol.UDP,
    sourceIPs: ['0.0.0.0/0'],
    destinationIPs: ['192.168.1.100'],
    sourcePorts: [],
    destinationPorts: [1194],
    action: FirewallAction.Allow,
    enabled: true,
    createdBy: 'System Administrator',
    createdAt: daysAgo(120),
    description: 'Allow OpenVPN connections'
  },
  {
    id: 'FW-016',
    priority: 11,
    name: 'Allow Monitoring',
    protocol: Protocol.TCP,
    sourceIPs: ['192.168.1.250'],
    destinationIPs: ['192.168.1.0/24'],
    sourcePorts: [],
    destinationPorts: [{ start: 9100, end: 9200 }],
    action: FirewallAction.Allow,
    enabled: true,
    createdBy: 'System Administrator',
    createdAt: daysAgo(100),
    description: 'Allow Prometheus monitoring'
  },
  {
    id: 'FW-017',
    priority: 25,
    name: 'Block Common Attack Ports',
    protocol: Protocol.TCP,
    sourceIPs: ['0.0.0.0/0'],
    destinationIPs: ['0.0.0.0/0'],
    sourcePorts: [],
    destinationPorts: [1433, 3306, 5432, 6379, 27017],
    action: FirewallAction.Deny,
    enabled: true,
    createdBy: 'Security Team',
    createdAt: daysAgo(180),
    description: 'Block database ports from external'
  },
  {
    id: 'FW-018',
    priority: 12,
    name: 'Allow Backup Server',
    protocol: Protocol.TCP,
    sourceIPs: ['192.168.1.100'],
    destinationIPs: ['192.168.2.100'],
    sourcePorts: [],
    destinationPorts: [{ start: 10000, end: 10100 }],
    action: FirewallAction.Allow,
    enabled: true,
    createdBy: 'System Administrator',
    createdAt: daysAgo(90),
    description: 'Allow backup traffic to DR site'
  },
]

// ============================================================================
// TWO-FACTOR SETTINGS
// ============================================================================

export const mockTwoFactorSettings: TwoFactorSettings = {
  enforcement: TwoFactorEnforcement.AdminsOnly,
  allowRememberDevice: true,
  trustPeriod: 30
}

// ============================================================================
// SECURITY POLICY COMPLIANCE
// ============================================================================

export const mockSecurityCompliance: SecurityPolicyCompliance = {
  passwordPolicy: {
    minLength: 12,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    expiryDays: 90,
    historyCount: 5,
    compliant: true
  },
  twoFactorAuth: {
    enabled: true,
    enforcement: TwoFactorEnforcement.AdminsOnly,
    compliant: true
  },
  encryption: {
    dataAtRest: true,
    dataInTransit: true,
    algorithm: 'AES-256-GCM',
    keyLength: 256,
    compliant: true
  },
  backups: {
    enabled: true,
    frequency: 'Daily at 2:00 AM',
    lastBackup: daysAgo(0),
    retentionDays: 30,
    offsite: true,
    compliant: true
  },
  logging: {
    enabled: true,
    retentionDays: 365,
    includesSecurityEvents: true,
    includesDataAccess: true,
    includesSystemChanges: true,
    compliant: true
  },
  overallScore: 100
}

// ============================================================================
// SECURITY STATISTICS
// ============================================================================

export function getSecurityStatistics(): SecurityStatistics {
  const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000)
  
  return {
    failedLogins24h: mockFailedLoginAttempts.filter(
      attempt => attempt.timestamp >= last24Hours
    ).length,
    blockedIPs: mockBlacklistedIPs.filter(ip => ip.isActive).length,
    activeThreats: mockSecurityAlerts.filter(alert => !alert.resolved).length,
    certificateStatus: {
      total: mockSSLCertificates.length,
      valid: mockSSLCertificates.filter(cert => cert.status === 'valid').length,
      warning: mockSSLCertificates.filter(cert => cert.status === 'warning').length,
      critical: mockSSLCertificates.filter(cert => cert.status === 'critical').length,
      expired: mockSSLCertificates.filter(cert => cert.status === 'expired').length
    },
    lastScanDate: daysAgo(1),
    vulnerabilitySummary: {
      total: mockVulnerabilities.length,
      critical: mockVulnerabilities.filter(v => v.severity === Severity.Critical).length,
      high: mockVulnerabilities.filter(v => v.severity === Severity.High).length,
      medium: mockVulnerabilities.filter(v => v.severity === Severity.Medium).length,
      low: mockVulnerabilities.filter(v => v.severity === Severity.Low).length,
      info: mockVulnerabilities.filter(v => v.severity === Severity.Info).length
    },
    activeSessions: mockActiveSessions.length,
    complianceScore: mockSecurityCompliance.overallScore
  }
}

// ============================================================================
// HELPER FUNCTIONS FOR DATA ACCESS
// ============================================================================

export function getFailedLoginAttemptById(id: string): FailedLoginAttempt | undefined {
  return mockFailedLoginAttempts.find(attempt => attempt.id === id)
}

export function getWhitelistedIPById(id: string): WhitelistedIP | undefined {
  return mockWhitelistedIPs.find(ip => ip.id === id)
}

export function getBlacklistedIPById(id: string): BlacklistedIP | undefined {
  return mockBlacklistedIPs.find(ip => ip.id === id)
}

export function getSSLCertificateById(id: string): SSLCertificate | undefined {
  return mockSSLCertificates.find(cert => cert.id === id)
}

export function getVulnerabilityById(id: string): Vulnerability | undefined {
  return mockVulnerabilities.find(vuln => vuln.id === id)
}

export function getFirewallRuleById(id: string): FirewallRule | undefined {
  return mockFirewallRules.find(rule => rule.id === id)
}

export function getActiveSessionById(id: string): ActiveSession | undefined {
  return mockActiveSessions.find(session => session.id === id)
}

export function getSecurityAlertById(id: string): SecurityAlert | undefined {
  return mockSecurityAlerts.find(alert => alert.id === id)
}
