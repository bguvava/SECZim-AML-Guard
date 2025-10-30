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
