# Validation Patterns

Validation schemas and patterns used throughout the Profile module.

## Overview

The Profile module uses **VeeValidate 4** with **Zod** schemas for type-safe, declarative validation.

### Key Libraries

- **VeeValidate 4**: Form validation framework
- **Zod**: TypeScript-first schema validation
- **@vee-validate/zod**: Bridge between VeeValidate and Zod

## Profile Form Validation

### Schema Definition

```typescript
import { z } from 'zod'

export const profileFormSchema = z.object({
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'First name can only contain letters, spaces, hyphens, and apostrophes'),
  
  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Last name can only contain letters, spaces, hyphens, and apostrophes'),
  
  email: z
    .string()
    .email('Invalid email address')
    .toLowerCase()
    .trim(),
  
  phoneNumber: z
    .string()
    .regex(/^[\d\s()+\-]+$/, 'Invalid phone number format')
    .optional()
    .or(z.literal('')),
  
  dateOfBirth: z
    .string()
    .optional()
    .refine((date) => {
      if (!date) return true
      const age = calculateAge(date)
      return age >= 18 && age <= 120
    }, 'Must be between 18 and 120 years old'),
  
  address: z.object({
    street: z.string().max(100).optional(),
    street2: z.string().max(100).optional(),
    city: z.string().max(50).optional(),
    state: z.string().max(50).optional(),
    postalCode: z.string().max(20).optional(),
    country: z.string().max(50).optional()
  }).optional()
})

type ProfileFormData = z.infer<typeof profileFormSchema>
```

### Usage in Component

```vue
<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { profileFormSchema } from '@/schemas/profile'

const { handleSubmit, errors, values } = useForm({
  validationSchema: toTypedSchema(profileFormSchema)
})

const onSubmit = handleSubmit((values) => {
  console.log('Valid data:', values)
})
</script>
```

## Password Validation

### Password Change Schema

```typescript
export const passwordChangeSchema = z.object({
  currentPassword: z
    .string()
    .min(1, 'Current password is required'),
  
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
  
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password')
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
}).refine((data) => data.newPassword !== data.currentPassword, {
  message: 'New password must be different from current password',
  path: ['newPassword']
})
```

### Password Strength Calculation

```typescript
interface PasswordRequirements {
  minLength: boolean
  hasUppercase: boolean
  hasLowercase: boolean
  hasNumber: boolean
  hasSpecial: boolean
}

function calculatePasswordStrength(password: string): PasswordStrength {
  const requirements: PasswordRequirements = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  }
  
  const metCount = Object.values(requirements).filter(Boolean).length
  
  // Score: 0-4
  let score: 0 | 1 | 2 | 3 | 4 = 0
  if (metCount === 0 || metCount === 1) score = 0 // Very Weak
  else if (metCount === 2) score = 1 // Weak
  else if (metCount === 3 || metCount === 4) score = 2 // Fair
  else if (metCount === 5 && password.length < 12) score = 3 // Strong
  else if (metCount === 5 && password.length >= 12) score = 4 // Very Strong
  
  const labels: Record<number, string> = {
    0: 'Very Weak',
    1: 'Weak',
    2: 'Fair',
    3: 'Strong',
    4: 'Very Strong'
  }
  
  const colors: Record<number, string> = {
    0: 'red',
    1: 'orange',
    2: 'yellow',
    3: 'blue',
    4: 'green'
  }
  
  return {
    score,
    label: labels[score],
    color: colors[score],
    percentage: (score / 4) * 100,
    requirements,
    suggestions: generateSuggestions(requirements)
  }
}

function generateSuggestions(requirements: PasswordRequirements): string[] {
  const suggestions: string[] = []
  
  if (!requirements.minLength) suggestions.push('Use at least 8 characters')
  if (!requirements.hasUppercase) suggestions.push('Add uppercase letters (A-Z)')
  if (!requirements.hasLowercase) suggestions.push('Add lowercase letters (a-z)')
  if (!requirements.hasNumber) suggestions.push('Add numbers (0-9)')
  if (!requirements.hasSpecial) suggestions.push('Add special characters (!@#$%)')
  
  return suggestions
}
```

## Email Validation

### Schema

```typescript
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Invalid email address')
  .toLowerCase()
  .trim()
  .refine((email) => {
    // Additional custom validation
    const domain = email.split('@')[1]
    return domain && domain.includes('.')
  }, 'Invalid email domain')
```

### Common Email Patterns

```typescript
// Corporate email only
const corporateEmailSchema = z
  .string()
  .email()
  .refine((email) => {
    const domain = email.split('@')[1]
    return !['gmail.com', 'yahoo.com', 'hotmail.com'].includes(domain)
  }, 'Please use a corporate email address')

// Specific domain
const domainEmailSchema = z
  .string()
  .email()
  .refine((email) => {
    return email.endsWith('@secZim.co.zw')
  }, 'Email must be from secZim.co.zw domain')
```

## Phone Validation

### Schema

```typescript
export const phoneSchema = z
  .string()
  .regex(
    /^[\d\s()+\-]+$/,
    'Phone number can only contain digits, spaces, parentheses, plus sign, and hyphens'
  )
  .optional()
  .or(z.literal(''))
```

### International Phone Format

```typescript
// E.164 format validation
const e164PhoneSchema = z
  .string()
  .regex(/^\+[1-9]\d{1,14}$/, 'Invalid international phone number format')

// Example: +12025551234
```

## Date Validation

### Date of Birth

```typescript
export const dateOfBirthSchema = z
  .string()
  .optional()
  .refine((date) => {
    if (!date) return true
    
    const birthDate = new Date(date)
    const today = new Date()
    
    // Check valid date
    if (isNaN(birthDate.getTime())) return false
    
    // Check not future
    if (birthDate > today) return false
    
    // Check age range
    const age = calculateAge(date)
    return age >= 18 && age <= 120
  }, 'Must be between 18 and 120 years old')

function calculateAge(dateString: string): number {
  const birthDate = new Date(dateString)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  
  return age
}
```

## File Validation

### Avatar Upload

```typescript
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif']

function validateAvatarFile(file: File): ValidationResult {
  const errors: string[] = []
  
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    errors.push('File size must be less than 5MB')
  }
  
  // Check file type
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    errors.push('File must be JPEG, PNG, or GIF')
  }
  
  // Check dimensions (optional)
  const img = new Image()
  img.src = URL.createObjectURL(file)
  img.onload = () => {
    if (img.width < 200 || img.height < 200) {
      errors.push('Image must be at least 200x200 pixels')
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}
```

## Custom Validators

### Unique Email Validator

```typescript
const uniqueEmailValidator = z
  .string()
  .email()
  .refine(async (email) => {
    // Check if email already exists
    const response = await fetch(`/api/check-email?email=${email}`)
    const data = await response.json()
    return !data.exists
  }, 'Email is already registered')
```

### Strong Password Validator

```typescript
const strongPasswordValidator = z
  .string()
  .superRefine((password, ctx) => {
    const strength = calculatePasswordStrength(password)
    
    if (strength.score < 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Password is ${strength.label}. ${strength.suggestions.join(', ')}`
      })
    }
  })
```

## Form-Level Validation

### Unsaved Changes Warning

```typescript
function isDirty(original: any, current: any): boolean {
  return JSON.stringify(original) !== JSON.stringify(current)
}

// Usage in component
const originalData = ref({ ...profile.value })
const currentData = ref({ ...profile.value })

const hasUnsavedChanges = computed(() => {
  return isDirty(originalData.value, currentData.value)
})

// Warn on navigation
onBeforeRouteLeave((to, from, next) => {
  if (hasUnsavedChanges.value) {
    const confirm = window.confirm('You have unsaved changes. Are you sure you want to leave?')
    next(confirm)
  } else {
    next()
  }
})
```

## Error Display Patterns

### Field Errors

```vue
<template>
  <div class="form-field">
    <label for="email">Email</label>
    <input
      id="email"
      v-model="email"
      type="email"
      :class="{ 'error': errors.email }"
    />
    <span v-if="errors.email" class="error-message">
      {{ errors.email }}
    </span>
  </div>
</template>
```

### Form-Level Errors

```vue
<template>
  <div v-if="formError" class="alert alert-error">
    {{ formError }}
  </div>
</template>
```

## Best Practices

1. **Validate Early**: Show errors as user types (debounced)
2. **Clear Messages**: Use specific, actionable error messages
3. **Preserve Values**: Keep valid values when validation fails
4. **Loading States**: Disable submit during async validation
5. **Accessibility**: Associate errors with inputs (aria-describedby)
6. **Type Safety**: Use Zod to ensure type consistency
7. **Reusable Schemas**: Create base schemas for common fields

---

**Next:** See [STATE_MANAGEMENT.md](./STATE_MANAGEMENT.md) for composable usage.
