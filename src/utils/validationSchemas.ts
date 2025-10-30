/**
 * Form Validation Schemas
 * Zod schemas for form validation
 */

import { z } from 'zod'

/**
 * Login form schema
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .toLowerCase(),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters long'),
  rememberMe: z.boolean().default(false),
})

export type LoginFormData = z.infer<typeof loginSchema>

/**
 * Password reset request schema
 */
export const passwordResetRequestSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .toLowerCase(),
})

export type PasswordResetRequestData = z.infer<typeof passwordResetRequestSchema>

/**
 * Password reset schema
 */
export const passwordResetSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type PasswordResetData = z.infer<typeof passwordResetSchema>

/**
 * Change password schema
 */
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  })

export type ChangePasswordData = z.infer<typeof changePasswordSchema>

/**
 * Profile update schema
 */
export const profileUpdateSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters'),
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^\+?[\d\s-]{10,}$/.test(val), {
      message: 'Please enter a valid phone number',
    }),
  organization: z.string().optional(),
})

export type ProfileUpdateData = z.infer<typeof profileUpdateSchema>

/**
 * Entity Registration Schema - Step 1: Basic Information
 */
export const entityBasicInfoSchema = z.object({
  name: z
    .string()
    .min(1, 'Entity name is required')
    .min(3, 'Entity name must be at least 3 characters')
    .max(200, 'Entity name must not exceed 200 characters'),
  type: z.enum(['Stockbroker', 'Investment Manager', 'Custodian', 'Market Operator', 'Investment Advisor', 'Portfolio Manager'], {
    errorMap: () => ({ message: 'Please select an entity type' }),
  }),
  registrationNumber: z
    .string()
    .min(1, 'Registration number is required')
    .regex(/^REG\/[A-Z]{2}\/\d{6}$/, 'Invalid registration number format (e.g., REG/ST/123456)'),
  registrationDate: z.string().min(1, 'Registration date is required'),
  taxNumber: z
    .string()
    .min(1, 'Tax number is required')
    .regex(/^\d{8}$/, 'Tax number must be 8 digits'),
  businessType: z.enum(['Private Limited', 'Public Limited', 'Partnership', 'Sole Proprietor'], {
    errorMap: () => ({ message: 'Please select a business type' }),
  }),
})

export type EntityBasicInfoData = z.infer<typeof entityBasicInfoSchema>

/**
 * Entity Registration Schema - Step 2: Contact Details
 */
export const entityContactSchema = z.object({
  primaryContactName: z.string().min(1, 'Primary contact name is required').min(3, 'Name must be at least 3 characters'),
  primaryContactPosition: z.string().min(1, 'Position is required'),
  primaryContactEmail: z.string().min(1, 'Email is required').email('Invalid email address'),
  primaryContactPhone: z.string().min(1, 'Phone is required').regex(/^\+263\s\d{2}\s\d{6}$/, 'Invalid phone format (+263 XX XXXXXX)'),
  complianceOfficerName: z.string().min(1, 'Compliance officer name is required').min(3, 'Name must be at least 3 characters'),
  complianceOfficerEmail: z.string().min(1, 'Email is required').email('Invalid email address'),
  complianceOfficerPhone: z.string().min(1, 'Phone is required').regex(/^\+263\s\d{2}\s\d{6}$/, 'Invalid phone format (+263 XX XXXXXX)'),
})

export type EntityContactData = z.infer<typeof entityContactSchema>

/**
 * Entity Registration Schema - Step 3: Address Information
 */
export const entityAddressSchema = z.object({
  physicalAddressStreet: z.string().min(1, 'Street address is required'),
  physicalAddressCity: z.string().min(1, 'City is required'),
  physicalAddressProvince: z.string().min(1, 'Province is required'),
  physicalAddressPostalCode: z.string().min(1, 'Postal code is required'),
  mailingAddressSame: z.boolean().default(true),
  mailingAddressStreet: z.string().optional(),
  mailingAddressCity: z.string().optional(),
  mailingAddressProvince: z.string().optional(),
  mailingAddressPostalCode: z.string().optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
})

export type EntityAddressData = z.infer<typeof entityAddressSchema>

/**
 * Entity Registration Schema - Step 4: Business Information
 */
export const entityBusinessInfoSchema = z.object({
  numberOfEmployees: z
    .number({ errorMap: () => ({ message: 'Number of employees is required' }) })
    .int('Must be a whole number')
    .positive('Must be a positive number')
    .min(1, 'Must have at least 1 employee'),
  annualRevenue: z
    .number()
    .positive('Must be a positive number')
    .optional()
    .or(z.literal(0)),
  servicesOffered: z.array(z.string()).min(1, 'Please select at least one service'),
  parentCompany: z.string().optional(),
})

export type EntityBusinessInfoData = z.infer<typeof entityBusinessInfoSchema>

/**
 * Entity Registration Schema - Step 5: License Information
 */
export const entityLicenseSchema = z.object({
  licenseNumber: z
    .string()
    .min(1, 'License number is required')
    .regex(/^ZSE\/[A-Z]{2}\/\d{4}\/\d{4}$/, 'Invalid license number format (e.g., ZSE/ST/1234/2024)'),
  licenseIssueDate: z.string().min(1, 'Issue date is required'),
  licenseExpiryDate: z.string().min(1, 'Expiry date is required'),
  licenseConditions: z.array(z.string()).min(1, 'Please add at least one license condition'),
})
  .refine(data => new Date(data.licenseExpiryDate) > new Date(data.licenseIssueDate), {
    message: 'Expiry date must be after issue date',
    path: ['licenseExpiryDate'],
  })

export type EntityLicenseData = z.infer<typeof entityLicenseSchema>

/**
 * Entity Update Schema
 */
export const entityUpdateSchema = z.object({
  name: z.string().min(3, 'Entity name must be at least 3 characters').optional(),
  type: z.enum(['Stockbroker', 'Investment Manager', 'Custodian', 'Market Operator', 'Investment Advisor', 'Portfolio Manager']).optional(),
  primaryContactName: z.string().min(3, 'Name must be at least 3 characters').optional(),
  primaryContactEmail: z.string().email('Invalid email address').optional(),
  primaryContactPhone: z.string().regex(/^\+263\s\d{2}\s\d{6}$/, 'Invalid phone format').optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  numberOfEmployees: z.number().int().positive().optional(),
})

export type EntityUpdateData = z.infer<typeof entityUpdateSchema>

/**
 * License Action Schema (Suspend/Revoke)
 */
export const licenseActionSchema = z.object({
  action: z.enum(['suspend', 'revoke'], {
    errorMap: () => ({ message: 'Please select an action' }),
  }),
  reason: z.string().min(1, 'Reason is required').min(10, 'Reason must be at least 10 characters'),
  effectiveDate: z.string().min(1, 'Effective date is required'),
  authorizedBy: z.string().min(1, 'Authorization is required'),
  notes: z.string().optional(),
})

export type LicenseActionData = z.infer<typeof licenseActionSchema>

/**
 * Entity Note Schema
 */
export const entityNoteSchema = z.object({
  content: z.string().min(1, 'Note content is required').min(10, 'Note must be at least 10 characters'),
  category: z.enum(['General', 'Compliance', 'Risk', 'Inspection', 'Internal']),
  isConfidential: z.boolean().default(false),
})

export type EntityNoteData = z.infer<typeof entityNoteSchema>

// ============================================================================
// SECURITY MANAGEMENT SCHEMAS
// ============================================================================

/**
 * IP Address validation patterns
 */
const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
const cidrRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\/([0-9]|[1-2][0-9]|3[0-2])$/

/**
 * Add IP to Whitelist Schema
 */
export const addIPToWhitelistSchema = z.object({
  ipAddress: z
    .string()
    .min(1, 'IP address is required')
    .refine(
      (val) => ipv4Regex.test(val) || cidrRegex.test(val),
      'Invalid IP address or CIDR notation (e.g., 192.168.1.1 or 192.168.1.0/24)'
    ),
  description: z
    .string()
    .min(3, 'Description must be at least 3 characters')
    .max(200, 'Description must be less than 200 characters'),
  expiryDate: z
    .string()
    .optional()
    .refine(
      (val) => !val || new Date(val) > new Date(),
      'Expiry date must be in the future'
    ),
})

export type AddIPToWhitelistData = z.infer<typeof addIPToWhitelistSchema>

/**
 * Block IP Schema
 */
export const blockIPSchema = z.object({
  ipAddress: z
    .string()
    .min(1, 'IP address is required')
    .refine(
      (val) => ipv4Regex.test(val),
      'Invalid IP address format'
    )
    .refine(
      (val) => val !== '127.0.0.1' && !val.startsWith('192.168.'),
      'Cannot block localhost or local network addresses'
    ),
  reason: z
    .string()
    .min(10, 'Reason must be at least 10 characters')
    .max(500, 'Reason must be less than 500 characters'),
})

export type BlockIPData = z.infer<typeof blockIPSchema>

/**
 * Auto-Block Settings Schema
 */
export const autoBlockSettingsSchema = z.object({
  threshold: z
    .number()
    .int('Must be a whole number')
    .min(3, 'Threshold must be at least 3 attempts')
    .max(20, 'Threshold must be at most 20 attempts'),
  timeWindow: z
    .number()
    .int('Must be a whole number')
    .min(1, 'Time window must be at least 1 minute')
    .max(60, 'Time window must be at most 60 minutes'),
})

export type AutoBlockSettingsData = z.infer<typeof autoBlockSettingsSchema>

/**
 * Add Firewall Rule Schema
 */
export const addFirewallRuleSchema = z.object({
  priority: z
    .number()
    .int('Priority must be a whole number')
    .min(1, 'Priority must be at least 1')
    .max(100, 'Priority must be at most 100'),
  name: z
    .string()
    .min(3, 'Rule name must be at least 3 characters')
    .max(100, 'Rule name must be less than 100 characters'),
  protocol: z.enum(['TCP', 'UDP', 'ICMP', 'All'], {
    errorMap: () => ({ message: 'Please select a protocol' }),
  }),
  sourceIPs: z
    .array(z.string())
    .min(1, 'At least one source IP is required')
    .refine(
      (ips) => ips.every((ip) => ipv4Regex.test(ip) || cidrRegex.test(ip)),
      'All source IPs must be valid IP addresses or CIDR notation'
    ),
  destinationIPs: z
    .array(z.string())
    .min(1, 'At least one destination IP is required')
    .refine(
      (ips) => ips.every((ip) => ipv4Regex.test(ip) || cidrRegex.test(ip)),
      'All destination IPs must be valid IP addresses or CIDR notation'
    ),
  sourcePorts: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true
        const ports = val.split(',').map(p => p.trim())
        return ports.every(port => {
          // Check if it's a single port or range
          if (port.includes('-')) {
            const [start, end] = port.split('-').map(p => parseInt(p.trim()))
            return start >= 1 && start <= 65535 && end >= 1 && end <= 65535 && start <= end
          }
          const portNum = parseInt(port)
          return portNum >= 1 && portNum <= 65535
        })
      },
      'Invalid port format. Use comma-separated ports or ranges (e.g., 80, 443, 8080-8090)'
    ),
  destinationPorts: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true
        const ports = val.split(',').map(p => p.trim())
        return ports.every(port => {
          if (port.includes('-')) {
            const [start, end] = port.split('-').map(p => parseInt(p.trim()))
            return start >= 1 && start <= 65535 && end >= 1 && end <= 65535 && start <= end
          }
          const portNum = parseInt(port)
          return portNum >= 1 && portNum <= 65535
        })
      },
      'Invalid port format. Use comma-separated ports or ranges (e.g., 80, 443, 8080-8090)'
    ),
  action: z.enum(['Allow', 'Deny'], {
    errorMap: () => ({ message: 'Please select an action' }),
  }),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
})

export type AddFirewallRuleData = z.infer<typeof addFirewallRuleSchema>

/**
 * Vulnerability Scan Options Schema
 */
export const vulnerabilityScanSchema = z.object({
  scanType: z.enum(['Quick', 'Full', 'Custom'], {
    errorMap: () => ({ message: 'Please select a scan type' }),
  }),
  targetComponents: z.array(z.string()).optional(),
})

export type VulnerabilityScanOptionsData = z.infer<typeof vulnerabilityScanSchema>

/**
 * Two-Factor Settings Schema
 */
export const twoFactorSettingsSchema = z.object({
  enforcement: z.enum(['None', 'Admins Only', 'Supervisors Only', 'All Users'], {
    errorMap: () => ({ message: 'Please select an enforcement level' }),
  }),
  allowRememberDevice: z.boolean().default(true),
  trustPeriod: z
    .number()
    .int('Must be a whole number')
    .min(1, 'Trust period must be at least 1 day')
    .max(90, 'Trust period must be at most 90 days'),
})

export type TwoFactorSettingsData = z.infer<typeof twoFactorSettingsSchema>

/**
 * Session Management Settings Schema
 */
export const sessionManagementSchema = z.object({
  maxConcurrentSessions: z
    .number()
    .int('Must be a whole number')
    .min(1, 'Must allow at least 1 concurrent session')
    .max(10, 'Maximum 10 concurrent sessions allowed'),
  sessionTimeout: z
    .number()
    .int('Must be a whole number')
    .min(15, 'Session timeout must be at least 15 minutes')
    .max(1440, 'Session timeout must be at most 24 hours (1440 minutes)'),
  requireReauthentication: z.boolean().default(true),
})

export type SessionManagementData = z.infer<typeof sessionManagementSchema>

/**
 * Security Report Options Schema
 */
export const securityReportSchema = z.object({
  reportType: z.enum(['Daily', 'Weekly', 'Monthly', 'Custom'], {
    errorMap: () => ({ message: 'Please select a report type' }),
  }),
  dateRange: z
    .object({
      start: z.string().min(1, 'Start date is required'),
      end: z.string().min(1, 'End date is required'),
    })
    .refine(
      (data) => new Date(data.end) >= new Date(data.start),
      {
        message: 'End date must be after or equal to start date',
        path: ['end'],
      }
    ),
  includeSections: z.object({
    securityEvents: z.boolean().default(true),
    failedLogins: z.boolean().default(true),
    ipManagement: z.boolean().default(true),
    vulnerabilities: z.boolean().default(true),
    compliance: z.boolean().default(true),
    firewallRules: z.boolean().default(true),
    recommendations: z.boolean().default(true),
  }),
})

export type SecurityReportOptionsData = z.infer<typeof securityReportSchema>
