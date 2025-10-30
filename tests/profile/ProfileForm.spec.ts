/**
 * ProfileForm Component Tests
 * Comprehensive test suite for profile form validation and submission
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import ProfileForm from '@/components/profile/ProfileForm.vue'
import type { UserProfile } from '@/types/profile'

// Mock profile data
const mockProfile: UserProfile = {
  id: 'user-123',
  email: 'john.doe@example.com',
  firstName: 'John',
  lastName: 'Doe',
  fullName: 'John Doe',
  phoneNumber: '+1 (555) 123-4567',
  dateOfBirth: '1985-06-15',
  address: {
    street: '123 Main Street',
    street2: 'Apt 4B',
    city: 'New York',
    state: 'NY',
    postalCode: '10001',
    country: 'United States'
  },
  role: 'admin',
  emailVerified: true,
  phoneVerified: true,
  twoFactorEnabled: false,
  verified: true,
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2025-10-25T14:20:00Z'
}

describe('ProfileForm', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Form Rendering', () => {
    it('should render all form sections', () => {
      wrapper = mount(ProfileForm, {
        props: {
          profile: mockProfile,
          loading: false
        }
      })

      expect(wrapper.find('[data-test="personal-info-section"]').exists()).toBe(true)
      expect(wrapper.find('[data-test="contact-info-section"]').exists()).toBe(true)
      expect(wrapper.find('[data-test="address-section"]').exists()).toBe(true)
    })

    it('should populate form with profile data', () => {
      wrapper = mount(ProfileForm, {
        props: {
          profile: mockProfile,
          loading: false
        }
      })

      const firstNameInput = wrapper.find('input[name="firstName"]')
      const lastNameInput = wrapper.find('input[name="lastName"]')
      const emailInput = wrapper.find('input[name="email"]')

      expect((firstNameInput.element as HTMLInputElement).value).toBe('John')
      expect((lastNameInput.element as HTMLInputElement).value).toBe('Doe')
      expect((emailInput.element as HTMLInputElement).value).toBe('john.doe@example.com')
    })

    it('should render all required fields', () => {
      wrapper = mount(ProfileForm, {
        props: {
          profile: mockProfile,
          loading: false
        }
      })

      expect(wrapper.find('input[name="firstName"]').exists()).toBe(true)
      expect(wrapper.find('input[name="lastName"]').exists()).toBe(true)
      expect(wrapper.find('input[name="email"]').exists()).toBe(true)
      expect(wrapper.find('input[name="phoneNumber"]').exists()).toBe(true)
      expect(wrapper.find('input[name="dateOfBirth"]').exists()).toBe(true)
    })

    it('should render all address fields', () => {
      wrapper = mount(ProfileForm, {
        props: {
          profile: mockProfile,
          loading: false
        }
      })

      expect(wrapper.find('input[name="address.street"]').exists()).toBe(true)
      expect(wrapper.find('input[name="address.street2"]').exists()).toBe(true)
      expect(wrapper.find('input[name="address.city"]').exists()).toBe(true)
      expect(wrapper.find('input[name="address.state"]').exists()).toBe(true)
      expect(wrapper.find('input[name="address.postalCode"]').exists()).toBe(true)
      expect(wrapper.find('input[name="address.country"]').exists()).toBe(true)
    })
  })

  describe('First Name Validation', () => {
    it('should show error for empty first name', async () => {
      wrapper = mount(ProfileForm, {
        props: {
          profile: mockProfile,
          loading: false
        }
      })

      const input = wrapper.find('input[name="firstName"]')
      await input.setValue('')
      await input.trigger('blur')
      await nextTick()

      const error = wrapper.find('[data-test="firstName-error"]')
      expect(error.exists()).toBe(true)
      expect(error.text()).toContain('First name is required')
    })

    it('should show error for first name too short (< 2 chars)', async () => {
      wrapper = mount(ProfileForm, {
        props: {
          profile: mockProfile,
          loading: false
        }
      })

      const input = wrapper.find('input[name="firstName"]')
      await input.setValue('J')
      await input.trigger('blur')
      await nextTick()

      const error = wrapper.find('[data-test="firstName-error"]')
      expect(error.exists()).toBe(true)
      expect(error.text()).toContain('at least 2 characters')
    })

    it('should show error for first name too long (> 50 chars)', async () => {
      wrapper = mount(ProfileForm, {
        props: {
          profile: mockProfile,
          loading: false
        }
      })

      const input = wrapper.find('input[name="firstName"]')
      await input.setValue('A'.repeat(51))
      await input.trigger('blur')
      await nextTick()

      const error = wrapper.find('[data-test="firstName-error"]')
      expect(error.exists()).toBe(true)
      expect(error.text()).toContain('at most 50 characters')
    })

    it('should show error for first name with numbers', async () => {
      wrapper = mount(ProfileForm, {
        props: {
          profile: mockProfile,
          loading: false
        }
      })

      const input = wrapper.find('input[name="firstName"]')
      await input.setValue('John123')
      await input.trigger('blur')
      await nextTick()

      const error = wrapper.find('[data-test="firstName-error"]')
      expect(error.exists()).toBe(true)
      expect(error.text()).toContain('only contain letters')
    })

    it('should accept first name with spaces', async () => {
      wrapper = mount(ProfileForm, {
        props: {
          profile: mockProfile,
          loading: false
        }
      })

      const input = wrapper.find('input[name="firstName"]')
      await input.setValue('Mary Jane')
      await input.trigger('blur')
      await nextTick()

      const error = wrapper.find('[data-test="firstName-error"]')
      expect(error.exists()).toBe(false)
    })

    it('should accept first name with hyphens', async () => {
      wrapper = mount(ProfileForm, {
        props: {
          profile: mockProfile,
          loading: false
        }
      })

      const input = wrapper.find('input[name="firstName"]')
      await input.setValue('Mary-Jane')
      await input.trigger('blur')
      await nextTick()

      const error = wrapper.find('[data-test="firstName-error"]')
      expect(error.exists()).toBe(false)
    })

    it('should accept first name with apostrophes', async () => {
      wrapper = mount(ProfileForm, {
        props: {
          profile: mockProfile,
          loading: false
        }
      })

      const input = wrapper.find('input[name="firstName"]')
      await input.setValue("O'Brien")
      await input.trigger('blur')
      await nextTick()

      const error = wrapper.find('[data-test="firstName-error"]')
      expect(error.exists()).toBe(false)
    })
  })

  describe('Last Name Validation', () => {
    it('should show error for empty last name', async () => {
      wrapper = mount(ProfileForm, {
        props: {
          profile: mockProfile,
          loading: false
        }
      })

      const input = wrapper.find('input[name="lastName"]')
      await input.setValue('')
      await input.trigger('blur')
      await nextTick()

      const error = wrapper.find('[data-test="lastName-error"]')
      expect(error.exists()).toBe(true)
      expect(error.text()).toContain('Last name is required')
    })

    it('should show error for last name too short (< 2 chars)', async () => {
      wrapper = mount(ProfileForm, {
        props: {
          profile: mockProfile,
          loading: false
        }
      })

      const input = wrapper.find('input[name="lastName"]')
      await input.setValue('D')
      await input.trigger('blur')
      await nextTick()

      const error = wrapper.find('[data-test="lastName-error"]')
      expect(error.exists()).toBe(true)
      expect(error.text()).toContain('at least 2 characters')
    })

    it('should show error for last name too long (> 50 chars)', async () => {
      wrapper = mount(ProfileForm, {
        props: {
          profile: mockProfile,
          loading: false
        }
      })

      const input = wrapper.find('input[name="lastName"]')
      await input.setValue('D'.repeat(51))
      await input.trigger('blur')
      await nextTick()

      const error = wrapper.find('[data-test="lastName-error"]')
      expect(error.exists()).toBe(true)
      expect(error.text()).toContain('at most 50 characters')
    })

    it('should show error for last name with special characters', async () => {
      wrapper = mount(ProfileForm, {
        props: {
          profile: mockProfile,
          loading: false
        }
      })

      const input = wrapper.find('input[name="lastName"]')
      await input.setValue('Doe@123')
      await input.trigger('blur')
      await nextTick()

      const error = wrapper.find('[data-test="lastName-error"]')
      expect(error.exists()).toBe(true)
      expect(error.text()).toContain('only contain letters')
    })

    it('should accept valid last name', async () => {
      wrapper = mount(ProfileForm, {
        props: {
          profile: mockProfile,
          loading: false
        }
      })

      const input = wrapper.find('input[name="lastName"]')
      await input.setValue('Van Der Berg')
      await input.trigger('blur')
      await nextTick()

      const error = wrapper.find('[data-test="lastName-error"]')
      expect(error.exists()).toBe(false)
    })
  })

  describe('Email Validation', () => {
    it('should show error for empty email', async () => {
      wrapper = mount(ProfileForm, {
        props: {
          profile: mockProfile,
          loading: false
        }
      })

      const input = wrapper.find('input[name="email"]')
      await input.setValue('')
      await input.trigger('blur')
      await nextTick()

      const error = wrapper.find('[data-test="email-error"]')
      expect(error.exists()).toBe(true)
      expect(error.text()).toContain('Email is required')
    })

    it('should show error for invalid email format', async () => {
      wrapper = mount(ProfileForm, {
        props: {
          profile: mockProfile,
          loading: false
        }
      })

      const input = wrapper.find('input[name="email"]')
      await input.setValue('invalid-email')
      await input.trigger('blur')
      await nextTick()

      const error = wrapper.find('[data-test="email-error"]')
      expect(error.exists()).toBe(true)
      expect(error.text()).toContain('Invalid email')
    })

    it('should show error for email without domain', async () => {
      wrapper = mount(ProfileForm, {
        props: {
          profile: mockProfile,
          loading: false
        }
      })

      const input = wrapper.find('input[name="email"]')
      await input.setValue('user@')
      await input.trigger('blur')
      await nextTick()

      const error = wrapper.find('[data-test="email-error"]')
      expect(error.exists()).toBe(true)
    })

    it('should accept valid email', async () => {
      wrapper = mount(ProfileForm, {
        props: {
          profile: mockProfile,
          loading: false
        }
      })

      const input = wrapper.find('input[name="email"]')
      await input.setValue('valid.email@example.com')
      await input.trigger('blur')
      await nextTick()

      const error = wrapper.find('[data-test="email-error"]')
      expect(error.exists()).toBe(false)
    })

    it('should convert email to lowercase', async () => {
      wrapper = mount(ProfileForm, {
        props: {
          profile: mockProfile,
          loading: false
        }
      })

      const input = wrapper.find('input[name="email"]')
      await input.setValue('UPPERCASE@EXAMPLE.COM')
      await input.trigger('blur')
      await nextTick()

      expect((input.element as HTMLInputElement).value).toBe('uppercase@example.com')
    })

    it('should show warning when email changes', async () => {
      wrapper = mount(ProfileForm, {
        props: {
          profile: mockProfile,
          loading: false
        }
      })

      const input = wrapper.find('input[name="email"]')
      await input.setValue('newemail@example.com')
      await nextTick()

      const warning = wrapper.find('[data-test="email-change-warning"]')
      expect(warning.exists()).toBe(true)
      expect(warning.text()).toContain('verification')
    })

    it('should not show warning when email unchanged', () => {
      wrapper = mount(ProfileForm, {
        props: {
          profile: mockProfile,
          loading: false
        }
      })

      const warning = wrapper.find('[data-test="email-change-warning"]')
      expect(warning.exists()).toBe(false)
    })
  })

  describe('Phone Number Validation', () => {
    it('should accept empty phone number (optional field)', async () => {
      wrapper = mount(ProfileForm, {
        props: {
          profile: mockProfile,
          loading: false
        }
      })

      const input = wrapper.find('input[name="phoneNumber"]')
      await input.setValue('')
      await input.trigger('blur')
      await nextTick()

      const error = wrapper.find('[data-test="phoneNumber-error"]')
      expect(error.exists()).toBe(false)
    })

    it('should show error for invalid phone format', async () => {
      wrapper = mount(ProfileForm, {
        props: {
          profile: mockProfile,
          loading: false
        }
      })

      const input = wrapper.find('input[name="phoneNumber"]')
      await input.setValue('abc-def-ghij')
      await input.trigger('blur')
      await nextTick()

      const error = wrapper.find('[data-test="phoneNumber-error"]')
      expect(error.exists()).toBe(true)
      expect(error.text()).toContain('Invalid phone number')
    })

    it('should accept phone with country code', async () => {
      wrapper = mount(ProfileForm, {
        props: {
          profile: mockProfile,
          loading: false
        }
      })

      const input = wrapper.find('input[name="phoneNumber"]')
      await input.setValue('+1 (555) 123-4567')
      await input.trigger('blur')
      await nextTick()

      const error = wrapper.find('[data-test="phoneNumber-error"]')
      expect(error.exists()).toBe(false)
    })

    it('should accept phone with spaces and dashes', async () => {
      wrapper = mount(ProfileForm, {
        props: {
          profile: mockProfile,
          loading: false
        }
      })

      const input = wrapper.find('input[name="phoneNumber"]')
      await input.setValue('555-123-4567')
      await input.trigger('blur')
      await nextTick()

      const error = wrapper.find('[data-test="phoneNumber-error"]')
      expect(error.exists()).toBe(false)
    })

    it('should accept phone with parentheses', async () => {
      wrapper = mount(ProfileForm, {
        props: {
          profile: mockProfile,
          loading: false
        }
      })

      const input = wrapper.find('input[name="phoneNumber"]')
      await input.setValue('(555) 123-4567')
      await input.trigger('blur')
      await nextTick()

      const error = wrapper.find('[data-test="phoneNumber-error"]')
      expect(error.exists()).toBe(false)
    })
  })

  describe('Date of Birth Validation', () => {
    it('should accept empty date of birth (optional field)', async () => {
      wrapper = mount(ProfileForm, {
        props: {
          profile: mockProfile,
          loading: false
        }
      })

      const input = wrapper.find('input[name="dateOfBirth"]')
      await input.setValue('')
      await input.trigger('blur')
      await nextTick()

      const error = wrapper.find('[data-test="dateOfBirth-error"]')
      expect(error.exists()).toBe(false)
    })

    it('should show error for age under 18', async () => {
      wrapper = mount(ProfileForm, {
        props: {
          profile: mockProfile,
          loading: false
        }
      })

      const recentDate = new Date()
      recentDate.setFullYear(recentDate.getFullYear() - 10) // 10 years old
      
      const input = wrapper.find('input[name="dateOfBirth"]')
      await input.setValue(recentDate.toISOString().split('T')[0])
      await input.trigger('blur')
      await nextTick()

      const error = wrapper.find('[data-test="dateOfBirth-error"]')
      expect(error.exists()).toBe(true)
      expect(error.text()).toContain('at least 18')
    })

    it('should show error for age over 120', async () => {
      wrapper = mount(ProfileForm, {
        props: {
          profile: mockProfile,
          loading: false
        }
      })

      const oldDate = new Date()
      oldDate.setFullYear(oldDate.getFullYear() - 130) // 130 years old
      
      const input = wrapper.find('input[name="dateOfBirth"]')
      await input.setValue(oldDate.toISOString().split('T')[0])
      await input.trigger('blur')
      await nextTick()

      const error = wrapper.find('[data-test="dateOfBirth-error"]')
      expect(error.exists()).toBe(true)
      expect(error.text()).toContain('at most 120')
    })

    it('should accept valid age (18-120)', async () => {
      wrapper = mount(ProfileForm, {
        props: {
          profile: mockProfile,
          loading: false
        }
      })

      const validDate = new Date()
      validDate.setFullYear(validDate.getFullYear() - 30) // 30 years old
      
      const input = wrapper.find('input[name="dateOfBirth"]')
      await input.setValue(validDate.toISOString().split('T')[0])
      await input.trigger('blur')
      await nextTick()

      const error = wrapper.find('[data-test="dateOfBirth-error"]')
      expect(error.exists()).toBe(false)
    })

    it('should accept exactly 18 years old', async () => {
      wrapper = mount(ProfileForm, {
        props: {
          profile: mockProfile,
          loading: false
        }
      })

      const exactDate = new Date()
      exactDate.setFullYear(exactDate.getFullYear() - 18)
      exactDate.setDate(exactDate.getDate() - 1) // 1 day over 18
      
      const input = wrapper.find('input[name="dateOfBirth"]')
      await input.setValue(exactDate.toISOString().split('T')[0])
      await input.trigger('blur')
      await nextTick()

      const error = wrapper.find('[data-test="dateOfBirth-error"]')
      expect(error.exists()).toBe(false)
    })
  })

  describe('Address Field Validation', () => {
    it('should accept empty address fields (all optional)', async () => {
      wrapper = mount(ProfileForm, {
        props: {
          profile: mockProfile,
          loading: false
        }
      })

      const streetInput = wrapper.find('input[name="address.street"]')
      await streetInput.setValue('')
      await streetInput.trigger('blur')
      await nextTick()

      const error = wrapper.find('[data-test="address.street-error"]')
      expect(error.exists()).toBe(false)
    })

    it('should show error for street exceeding 100 characters', async () => {
      wrapper = mount(ProfileForm, {
        props: {
          profile: mockProfile,
          loading: false
        }
      })

      const input = wrapper.find('input[name="address.street"]')
      await input.setValue('A'.repeat(101))
      await input.trigger('blur')
      await nextTick()

      const error = wrapper.find('[data-test="address.street-error"]')
      expect(error.exists()).toBe(true)
      expect(error.text()).toContain('100 characters')
    })

    it('should show error for city exceeding 50 characters', async () => {
      wrapper = mount(ProfileForm, {
        props: {
          profile: mockProfile,
          loading: false
        }
      })

      const input = wrapper.find('input[name="address.city"]')
      await input.setValue('C'.repeat(51))
      await input.trigger('blur')
      await nextTick()

      const error = wrapper.find('[data-test="address.city-error"]')
      expect(error.exists()).toBe(true)
      expect(error.text()).toContain('50 characters')
    })

    it('should show error for postalCode exceeding 20 characters', async () => {
      wrapper = mount(ProfileForm, {
        props: {
          profile: mockProfile,
          loading: false
        }
      })

      const input = wrapper.find('input[name="address.postalCode"]')
      await input.setValue('P'.repeat(21))
      await input.trigger('blur')
      await nextTick()

      const error = wrapper.find('[data-test="address.postalCode-error"]')
      expect(error.exists()).toBe(true)
      expect(error.text()).toContain('20 characters')
    })

    it('should accept valid address fields', async () => {
      wrapper = mount(ProfileForm, {
        props: {
          profile: mockProfile,
          loading: false
        }
      })

      const streetInput = wrapper.find('input[name="address.street"]')
      const cityInput = wrapper.find('input[name="address.city"]')
      
      await streetInput.setValue('456 Oak Avenue')
      await cityInput.setValue('Los Angeles')
      await streetInput.trigger('blur')
      await cityInput.trigger('blur')
      await nextTick()

      expect(wrapper.find('[data-test="address.street-error"]').exists()).toBe(false)
      expect(wrapper.find('[data-test="address.city-error"]').exists()).toBe(false)
    })
  })

  describe('Form State Management', () => {
    it('should detect form as dirty after changes', async () => {
      wrapper = mount(ProfileForm, {
        props: {
          profile: mockProfile,
          loading: false
        }
      })

      const submitButton = wrapper.find('[data-test="submit-button"]')
      expect(submitButton.attributes('disabled')).toBeDefined()

      const input = wrapper.find('input[name="firstName"]')
      await input.setValue('Jane')
      await nextTick()

      expect(submitButton.attributes('disabled')).toBeUndefined()
    })

    it('should detect form as clean when unchanged', () => {
      wrapper = mount(ProfileForm, {
        props: {
          profile: mockProfile,
          loading: false
        }
      })

      const submitButton = wrapper.find('[data-test="submit-button"]')
      expect(submitButton.attributes('disabled')).toBeDefined()
    })

    it('should validate form is valid when all fields correct', async () => {
      wrapper = mount(ProfileForm, {
        props: {
          profile: mockProfile,
          loading: false
        }
      })

      const firstNameInput = wrapper.find('input[name="firstName"]')
      await firstNameInput.setValue('Jane')
      await nextTick()

      const submitButton = wrapper.find('[data-test="submit-button"]')
      expect(submitButton.attributes('disabled')).toBeUndefined()
    })

    it('should disable submit when form has errors', async () => {
      wrapper = mount(ProfileForm, {
        props: {
          profile: mockProfile,
          loading: false
        }
      })

      const input = wrapper.find('input[name="firstName"]')
      await input.setValue('') // Invalid
      await input.trigger('blur')
      await nextTick()

      const submitButton = wrapper.find('[data-test="submit-button"]')
      expect(submitButton.attributes('disabled')).toBeDefined()
    })
  })

  describe('Form Submission', () => {
    it('should emit submit event with form data', async () => {
      wrapper = mount(ProfileForm, {
        props: {
          profile: mockProfile,
          loading: false
        }
      })

      const input = wrapper.find('input[name="firstName"]')
      await input.setValue('Jane')
      await nextTick()

      const form = wrapper.find('form')
      await form.trigger('submit.prevent')
      await nextTick()

      expect(wrapper.emitted('submit')).toBeTruthy()
      const emittedData = wrapper.emitted('submit')?.[0]?.[0] as any
      expect(emittedData.firstName).toBe('Jane')
    })

    it('should not emit submit when form invalid', async () => {
      wrapper = mount(ProfileForm, {
        props: {
          profile: mockProfile,
          loading: false
        }
      })

      const input = wrapper.find('input[name="firstName"]')
      await input.setValue('') // Invalid
      await nextTick()

      const form = wrapper.find('form')
      await form.trigger('submit.prevent')
      await nextTick()

      expect(wrapper.emitted('submit')).toBeFalsy()
    })

    it('should include all form fields in submission', async () => {
      wrapper = mount(ProfileForm, {
        props: {
          profile: mockProfile,
          loading: false
        }
      })

      const firstNameInput = wrapper.find('input[name="firstName"]')
      await firstNameInput.setValue('Jane')
      await nextTick()

      const form = wrapper.find('form')
      await form.trigger('submit.prevent')
      await nextTick()

      const emittedData = wrapper.emitted('submit')?.[0]?.[0] as any
      expect(emittedData).toHaveProperty('firstName')
      expect(emittedData).toHaveProperty('lastName')
      expect(emittedData).toHaveProperty('email')
      expect(emittedData).toHaveProperty('phoneNumber')
      expect(emittedData).toHaveProperty('dateOfBirth')
      expect(emittedData).toHaveProperty('address')
    })
  })

  describe('Form Cancellation', () => {
    it('should emit cancel event when cancel button clicked', async () => {
      wrapper = mount(ProfileForm, {
        props: {
          profile: mockProfile,
          loading: false
        }
      })

      const cancelButton = wrapper.find('[data-test="cancel-button"]')
      await cancelButton.trigger('click')

      expect(wrapper.emitted('cancel')).toBeTruthy()
    })

    it('should show confirmation when canceling with unsaved changes', async () => {
      wrapper = mount(ProfileForm, {
        props: {
          profile: mockProfile,
          loading: false
        }
      })

      const input = wrapper.find('input[name="firstName"]')
      await input.setValue('Jane')
      await nextTick()

      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)
      
      const cancelButton = wrapper.find('[data-test="cancel-button"]')
      await cancelButton.trigger('click')

      expect(confirmSpy).toHaveBeenCalledWith('You have unsaved changes. Are you sure you want to cancel?')
      expect(wrapper.emitted('cancel')).toBeTruthy()
      
      confirmSpy.mockRestore()
    })

    it('should not cancel when confirmation declined', async () => {
      wrapper = mount(ProfileForm, {
        props: {
          profile: mockProfile,
          loading: false
        }
      })

      const input = wrapper.find('input[name="firstName"]')
      await input.setValue('Jane')
      await nextTick()

      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false)
      
      const cancelButton = wrapper.find('[data-test="cancel-button"]')
      await cancelButton.trigger('click')

      expect(confirmSpy).toHaveBeenCalled()
      expect(wrapper.emitted('cancel')).toBeFalsy()
      
      confirmSpy.mockRestore()
    })

    it('should not show confirmation when no changes made', async () => {
      wrapper = mount(ProfileForm, {
        props: {
          profile: mockProfile,
          loading: false
        }
      })

      const confirmSpy = vi.spyOn(window, 'confirm')
      
      const cancelButton = wrapper.find('[data-test="cancel-button"]')
      await cancelButton.trigger('click')

      expect(confirmSpy).not.toHaveBeenCalled()
      expect(wrapper.emitted('cancel')).toBeTruthy()
      
      confirmSpy.mockRestore()
    })
  })

  describe('Loading State', () => {
    it('should disable all inputs when loading', () => {
      wrapper = mount(ProfileForm, {
        props: {
          profile: mockProfile,
          loading: true
        }
      })

      const firstNameInput = wrapper.find('input[name="firstName"]')
      const lastNameInput = wrapper.find('input[name="lastName"]')
      const emailInput = wrapper.find('input[name="email"]')

      expect(firstNameInput.attributes('disabled')).toBeDefined()
      expect(lastNameInput.attributes('disabled')).toBeDefined()
      expect(emailInput.attributes('disabled')).toBeDefined()
    })

    it('should disable submit button when loading', () => {
      wrapper = mount(ProfileForm, {
        props: {
          profile: mockProfile,
          loading: true
        }
      })

      const submitButton = wrapper.find('[data-test="submit-button"]')
      expect(submitButton.attributes('disabled')).toBeDefined()
    })

    it('should show loading text on submit button', () => {
      wrapper = mount(ProfileForm, {
        props: {
          profile: mockProfile,
          loading: true
        }
      })

      const submitButton = wrapper.find('[data-test="submit-button"]')
      expect(submitButton.text()).toContain('Saving...')
    })

    it('should show normal text when not loading', () => {
      wrapper = mount(ProfileForm, {
        props: {
          profile: mockProfile,
          loading: false
        }
      })

      const submitButton = wrapper.find('[data-test="submit-button"]')
      expect(submitButton.text()).toContain('Save Changes')
    })
  })

  describe('Props Validation', () => {
    it('should accept all valid props', () => {
      expect(() => {
        mount(ProfileForm, {
          props: {
            profile: mockProfile,
            loading: true
          }
        })
      }).not.toThrow()
    })

    it('should have loading default to false', () => {
      wrapper = mount(ProfileForm, {
        props: {
          profile: mockProfile
        }
      })

      const input = wrapper.find('input[name="firstName"]')
      expect(input.attributes('disabled')).toBeUndefined()
    })
  })
})
