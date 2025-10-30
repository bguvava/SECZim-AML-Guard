/**
 * PasswordChange Component Tests
 * Comprehensive test suite for password change functionality with strength validation
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import PasswordChange from '@/components/profile/PasswordChange.vue'

describe('PasswordChange', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Form Rendering', () => {
    it('should render all password fields', () => {
      wrapper = mount(PasswordChange, {
        props: { loading: false }
      })

      expect(wrapper.find('input[name="currentPassword"]').exists()).toBe(true)
      expect(wrapper.find('input[name="newPassword"]').exists()).toBe(true)
      expect(wrapper.find('input[name="confirmPassword"]').exists()).toBe(true)
    })

    it('should render password strength indicator', () => {
      wrapper = mount(PasswordChange, {
        props: { loading: false }
      })

      expect(wrapper.find('[data-test="strength-indicator"]').exists()).toBe(true)
    })

    it('should render password requirements checklist', () => {
      wrapper = mount(PasswordChange, {
        props: { loading: false }
      })

      expect(wrapper.find('[data-test="requirements-checklist"]').exists()).toBe(true)
    })

    it('should show all 5 password requirements', () => {
      wrapper = mount(PasswordChange, {
        props: { loading: false }
      })

      expect(wrapper.text()).toContain('At least 8 characters')
      expect(wrapper.text()).toContain('At least one uppercase letter')
      expect(wrapper.text()).toContain('At least one lowercase letter')
      expect(wrapper.text()).toContain('At least one number')
      expect(wrapper.text()).toContain('At least one special character')
    })

    it('should render security notice', () => {
      wrapper = mount(PasswordChange, {
        props: { loading: false }
      })

      expect(wrapper.text()).toContain('changing your password will log you out')
    })
  })

  describe('Password Visibility Toggle', () => {
    it('should toggle current password visibility', async () => {
      wrapper = mount(PasswordChange, {
        props: { loading: false }
      })

      const input = wrapper.find('input[name="currentPassword"]')
      expect(input.attributes('type')).toBe('password')

      const toggleButton = wrapper.find('[data-test="toggle-current-password"]')
      await toggleButton.trigger('click')
      await nextTick()

      expect(input.attributes('type')).toBe('text')
    })

    it('should toggle new password visibility', async () => {
      wrapper = mount(PasswordChange, {
        props: { loading: false }
      })

      const input = wrapper.find('input[name="newPassword"]')
      expect(input.attributes('type')).toBe('password')

      const toggleButton = wrapper.find('[data-test="toggle-new-password"]')
      await toggleButton.trigger('click')
      await nextTick()

      expect(input.attributes('type')).toBe('text')
    })

    it('should toggle confirm password visibility', async () => {
      wrapper = mount(PasswordChange, {
        props: { loading: false }
      })

      const input = wrapper.find('input[name="confirmPassword"]')
      expect(input.attributes('type')).toBe('password')

      const toggleButton = wrapper.find('[data-test="toggle-confirm-password"]')
      await toggleButton.trigger('click')
      await nextTick()

      expect(input.attributes('type')).toBe('text')
    })

    it('should toggle visibility back to password', async () => {
      wrapper = mount(PasswordChange, {
        props: { loading: false }
      })

      const input = wrapper.find('input[name="newPassword"]')
      const toggleButton = wrapper.find('[data-test="toggle-new-password"]')

      await toggleButton.trigger('click')
      await nextTick()
      expect(input.attributes('type')).toBe('text')

      await toggleButton.trigger('click')
      await nextTick()
      expect(input.attributes('type')).toBe('password')
    })
  })

  describe('Password Strength Calculation', () => {
    it('should show "Very Weak" for empty password', async () => {
      wrapper = mount(PasswordChange, {
        props: { loading: false }
      })

      const strengthLabel = wrapper.find('[data-test="strength-label"]')
      expect(strengthLabel.text()).toBe('Very Weak')
    })

    it('should show "Very Weak" for password with no requirements met', async () => {
      wrapper = mount(PasswordChange, {
        props: { loading: false }
      })

      const input = wrapper.find('input[name="newPassword"]')
      await input.setValue('abc')
      await nextTick()

      const strengthLabel = wrapper.find('[data-test="strength-label"]')
      expect(strengthLabel.text()).toBe('Very Weak')
    })

    it('should show "Weak" for password with 1-2 requirements', async () => {
      wrapper = mount(PasswordChange, {
        props: { loading: false }
      })

      const input = wrapper.find('input[name="newPassword"]')
      await input.setValue('abcdefgh') // Only lowercase and length
      await nextTick()

      const strengthLabel = wrapper.find('[data-test="strength-label"]')
      expect(strengthLabel.text()).toBe('Weak')
    })

    it('should show "Fair" for password with 3-4 requirements', async () => {
      wrapper = mount(PasswordChange, {
        props: { loading: false }
      })

      const input = wrapper.find('input[name="newPassword"]')
      await input.setValue('Abcdefgh') // Uppercase, lowercase, length
      await nextTick()

      const strengthLabel = wrapper.find('[data-test="strength-label"]')
      expect(strengthLabel.text()).toBe('Fair')
    })

    it('should show "Strong" for password with all requirements < 12 chars', async () => {
      wrapper = mount(PasswordChange, {
        props: { loading: false }
      })

      const input = wrapper.find('input[name="newPassword"]')
      await input.setValue('Abcdef123!') // All requirements, 10 chars
      await nextTick()

      const strengthLabel = wrapper.find('[data-test="strength-label"]')
      expect(strengthLabel.text()).toBe('Strong')
    })

    it('should show "Very Strong" for password with all requirements >= 12 chars', async () => {
      wrapper = mount(PasswordChange, {
        props: { loading: false }
      })

      const input = wrapper.find('input[name="newPassword"]')
      await input.setValue('Abcdef123456!') // All requirements, 13 chars
      await nextTick()

      const strengthLabel = wrapper.find('[data-test="strength-label"]')
      expect(strengthLabel.text()).toBe('Very Strong')
    })
  })

  describe('Password Strength Bar', () => {
    it('should show red bar for Very Weak password', async () => {
      wrapper = mount(PasswordChange, {
        props: { loading: false }
      })

      const input = wrapper.find('input[name="newPassword"]')
      await input.setValue('abc')
      await nextTick()

      const strengthBar = wrapper.find('[data-test="strength-bar"]')
      expect(strengthBar.classes()).toContain('bg-red-500')
    })

    it('should show orange bar for Weak password', async () => {
      wrapper = mount(PasswordChange, {
        props: { loading: false }
      })

      const input = wrapper.find('input[name="newPassword"]')
      await input.setValue('abcdefgh')
      await nextTick()

      const strengthBar = wrapper.find('[data-test="strength-bar"]')
      expect(strengthBar.classes()).toContain('bg-orange-500')
    })

    it('should show yellow bar for Fair password', async () => {
      wrapper = mount(PasswordChange, {
        props: { loading: false }
      })

      const input = wrapper.find('input[name="newPassword"]')
      await input.setValue('Abcdefgh')
      await nextTick()

      const strengthBar = wrapper.find('[data-test="strength-bar"]')
      expect(strengthBar.classes()).toContain('bg-yellow-500')
    })

    it('should show blue bar for Strong password', async () => {
      wrapper = mount(PasswordChange, {
        props: { loading: false }
      })

      const input = wrapper.find('input[name="newPassword"]')
      await input.setValue('Abcdef123!')
      await nextTick()

      const strengthBar = wrapper.find('[data-test="strength-bar"]')
      expect(strengthBar.classes()).toContain('bg-blue-500')
    })

    it('should show green bar for Very Strong password', async () => {
      wrapper = mount(PasswordChange, {
        props: { loading: false }
      })

      const input = wrapper.find('input[name="newPassword"]')
      await input.setValue('Abcdef123456!')
      await nextTick()

      const strengthBar = wrapper.find('[data-test="strength-bar"]')
      expect(strengthBar.classes()).toContain('bg-green-500')
    })

    it('should adjust bar width based on strength score', async () => {
      wrapper = mount(PasswordChange, {
        props: { loading: false }
      })

      const input = wrapper.find('input[name="newPassword"]')
      
      // Very Weak (score 0)
      await input.setValue('abc')
      await nextTick()
      let strengthBar = wrapper.find('[data-test="strength-bar"]')
      expect(strengthBar.attributes('style')).toContain('width: 0%')

      // Weak (score 1)
      await input.setValue('abcdefgh')
      await nextTick()
      strengthBar = wrapper.find('[data-test="strength-bar"]')
      expect(strengthBar.attributes('style')).toContain('width: 25%')

      // Fair (score 2)
      await input.setValue('Abcdefgh')
      await nextTick()
      strengthBar = wrapper.find('[data-test="strength-bar"]')
      expect(strengthBar.attributes('style')).toContain('width: 50%')

      // Strong (score 3)
      await input.setValue('Abcdef123!')
      await nextTick()
      strengthBar = wrapper.find('[data-test="strength-bar"]')
      expect(strengthBar.attributes('style')).toContain('width: 75%')

      // Very Strong (score 4)
      await input.setValue('Abcdef123456!')
      await nextTick()
      strengthBar = wrapper.find('[data-test="strength-bar"]')
      expect(strengthBar.attributes('style')).toContain('width: 100%')
    })
  })

  describe('Password Requirements Checklist', () => {
    it('should show X icon for unmet minimum length requirement', async () => {
      wrapper = mount(PasswordChange, {
        props: { loading: false }
      })

      const input = wrapper.find('input[name="newPassword"]')
      await input.setValue('Abc1!')
      await nextTick()

      const minLengthIcon = wrapper.find('[data-test="requirement-minLength-icon"]')
      expect(minLengthIcon.attributes('data-met')).toBe('false')
    })

    it('should show check icon for met minimum length requirement', async () => {
      wrapper = mount(PasswordChange, {
        props: { loading: false }
      })

      const input = wrapper.find('input[name="newPassword"]')
      await input.setValue('Abcdef123!')
      await nextTick()

      const minLengthIcon = wrapper.find('[data-test="requirement-minLength-icon"]')
      expect(minLengthIcon.attributes('data-met')).toBe('true')
    })

    it('should validate uppercase letter requirement', async () => {
      wrapper = mount(PasswordChange, {
        props: { loading: false }
      })

      const input = wrapper.find('input[name="newPassword"]')
      
      await input.setValue('abcdef123!')
      await nextTick()
      let icon = wrapper.find('[data-test="requirement-uppercase-icon"]')
      expect(icon.attributes('data-met')).toBe('false')

      await input.setValue('Abcdef123!')
      await nextTick()
      icon = wrapper.find('[data-test="requirement-uppercase-icon"]')
      expect(icon.attributes('data-met')).toBe('true')
    })

    it('should validate lowercase letter requirement', async () => {
      wrapper = mount(PasswordChange, {
        props: { loading: false }
      })

      const input = wrapper.find('input[name="newPassword"]')
      
      await input.setValue('ABCDEF123!')
      await nextTick()
      let icon = wrapper.find('[data-test="requirement-lowercase-icon"]')
      expect(icon.attributes('data-met')).toBe('false')

      await input.setValue('Abcdef123!')
      await nextTick()
      icon = wrapper.find('[data-test="requirement-lowercase-icon"]')
      expect(icon.attributes('data-met')).toBe('true')
    })

    it('should validate number requirement', async () => {
      wrapper = mount(PasswordChange, {
        props: { loading: false }
      })

      const input = wrapper.find('input[name="newPassword"]')
      
      await input.setValue('Abcdefgh!')
      await nextTick()
      let icon = wrapper.find('[data-test="requirement-number-icon"]')
      expect(icon.attributes('data-met')).toBe('false')

      await input.setValue('Abcdefgh1!')
      await nextTick()
      icon = wrapper.find('[data-test="requirement-number-icon"]')
      expect(icon.attributes('data-met')).toBe('true')
    })

    it('should validate special character requirement', async () => {
      wrapper = mount(PasswordChange, {
        props: { loading: false }
      })

      const input = wrapper.find('input[name="newPassword"]')
      
      await input.setValue('Abcdefgh123')
      await nextTick()
      let icon = wrapper.find('[data-test="requirement-special-icon"]')
      expect(icon.attributes('data-met')).toBe('false')

      await input.setValue('Abcdefgh123!')
      await nextTick()
      icon = wrapper.find('[data-test="requirement-special-icon"]')
      expect(icon.attributes('data-met')).toBe('true')
    })

    it('should show all requirements as met for valid password', async () => {
      wrapper = mount(PasswordChange, {
        props: { loading: false }
      })

      const input = wrapper.find('input[name="newPassword"]')
      await input.setValue('ValidPass123!')
      await nextTick()

      expect(wrapper.find('[data-test="requirement-minLength-icon"]').attributes('data-met')).toBe('true')
      expect(wrapper.find('[data-test="requirement-uppercase-icon"]').attributes('data-met')).toBe('true')
      expect(wrapper.find('[data-test="requirement-lowercase-icon"]').attributes('data-met')).toBe('true')
      expect(wrapper.find('[data-test="requirement-number-icon"]').attributes('data-met')).toBe('true')
      expect(wrapper.find('[data-test="requirement-special-icon"]').attributes('data-met')).toBe('true')
    })
  })

  describe('Password Suggestions Feedback', () => {
    it('should show suggestions for weak password', async () => {
      wrapper = mount(PasswordChange, {
        props: { loading: false }
      })

      const input = wrapper.find('input[name="newPassword"]')
      await input.setValue('password')
      await nextTick()

      const suggestions = wrapper.find('[data-test="password-suggestions"]')
      expect(suggestions.exists()).toBe(true)
      expect(suggestions.text().length).toBeGreaterThan(0)
    })

    it('should not show suggestions for very strong password', async () => {
      wrapper = mount(PasswordChange, {
        props: { loading: false }
      })

      const input = wrapper.find('input[name="newPassword"]')
      await input.setValue('VeryStrongPass123!')
      await nextTick()

      const suggestions = wrapper.find('[data-test="password-suggestions"]')
      expect(suggestions.text()).toBe('')
    })
  })

  describe('Current Password Validation', () => {
    it('should show error for empty current password', async () => {
      wrapper = mount(PasswordChange, {
        props: { loading: false }
      })

      const input = wrapper.find('input[name="currentPassword"]')
      await input.setValue('')
      await input.trigger('blur')
      await nextTick()

      const error = wrapper.find('[data-test="currentPassword-error"]')
      expect(error.exists()).toBe(true)
      expect(error.text()).toContain('Current password is required')
    })

    it('should accept non-empty current password', async () => {
      wrapper = mount(PasswordChange, {
        props: { loading: false }
      })

      const input = wrapper.find('input[name="currentPassword"]')
      await input.setValue('OldPassword123!')
      await input.trigger('blur')
      await nextTick()

      const error = wrapper.find('[data-test="currentPassword-error"]')
      expect(error.exists()).toBe(false)
    })
  })

  describe('New Password Validation', () => {
    it('should show error for empty new password', async () => {
      wrapper = mount(PasswordChange, {
        props: { loading: false }
      })

      const input = wrapper.find('input[name="newPassword"]')
      await input.setValue('')
      await input.trigger('blur')
      await nextTick()

      const error = wrapper.find('[data-test="newPassword-error"]')
      expect(error.exists()).toBe(true)
      expect(error.text()).toContain('New password is required')
    })

    it('should show error for password without minimum length', async () => {
      wrapper = mount(PasswordChange, {
        props: { loading: false }
      })

      const input = wrapper.find('input[name="newPassword"]')
      await input.setValue('Abc1!')
      await input.trigger('blur')
      await nextTick()

      const error = wrapper.find('[data-test="newPassword-error"]')
      expect(error.exists()).toBe(true)
    })

    it('should show error for password without uppercase', async () => {
      wrapper = mount(PasswordChange, {
        props: { loading: false }
      })

      const input = wrapper.find('input[name="newPassword"]')
      await input.setValue('abcdef123!')
      await input.trigger('blur')
      await nextTick()

      const error = wrapper.find('[data-test="newPassword-error"]')
      expect(error.exists()).toBe(true)
    })

    it('should show error for password without lowercase', async () => {
      wrapper = mount(PasswordChange, {
        props: { loading: false }
      })

      const input = wrapper.find('input[name="newPassword"]')
      await input.setValue('ABCDEF123!')
      await input.trigger('blur')
      await nextTick()

      const error = wrapper.find('[data-test="newPassword-error"]')
      expect(error.exists()).toBe(true)
    })

    it('should show error for password without number', async () => {
      wrapper = mount(PasswordChange, {
        props: { loading: false }
      })

      const input = wrapper.find('input[name="newPassword"]')
      await input.setValue('Abcdefgh!')
      await input.trigger('blur')
      await nextTick()

      const error = wrapper.find('[data-test="newPassword-error"]')
      expect(error.exists()).toBe(true)
    })

    it('should show error for password without special character', async () => {
      wrapper = mount(PasswordChange, {
        props: { loading: false }
      })

      const input = wrapper.find('input[name="newPassword"]')
      await input.setValue('Abcdef123')
      await input.trigger('blur')
      await nextTick()

      const error = wrapper.find('[data-test="newPassword-error"]')
      expect(error.exists()).toBe(true)
    })

    it('should accept password meeting all requirements', async () => {
      wrapper = mount(PasswordChange, {
        props: { loading: false }
      })

      const input = wrapper.find('input[name="newPassword"]')
      await input.setValue('ValidPass123!')
      await input.trigger('blur')
      await nextTick()

      const error = wrapper.find('[data-test="newPassword-error"]')
      expect(error.exists()).toBe(false)
    })
  })

  describe('Confirm Password Validation', () => {
    it('should show error for empty confirm password', async () => {
      wrapper = mount(PasswordChange, {
        props: { loading: false }
      })

      const input = wrapper.find('input[name="confirmPassword"]')
      await input.setValue('')
      await input.trigger('blur')
      await nextTick()

      const error = wrapper.find('[data-test="confirmPassword-error"]')
      expect(error.exists()).toBe(true)
      expect(error.text()).toContain('Please confirm your password')
    })

    it('should show error when passwords do not match', async () => {
      wrapper = mount(PasswordChange, {
        props: { loading: false }
      })

      const newPasswordInput = wrapper.find('input[name="newPassword"]')
      const confirmPasswordInput = wrapper.find('input[name="confirmPassword"]')

      await newPasswordInput.setValue('ValidPass123!')
      await confirmPasswordInput.setValue('DifferentPass123!')
      await confirmPasswordInput.trigger('blur')
      await nextTick()

      const error = wrapper.find('[data-test="confirmPassword-error"]')
      expect(error.exists()).toBe(true)
      expect(error.text()).toContain('Passwords do not match')
    })

    it('should not show error when passwords match', async () => {
      wrapper = mount(PasswordChange, {
        props: { loading: false }
      })

      const newPasswordInput = wrapper.find('input[name="newPassword"]')
      const confirmPasswordInput = wrapper.find('input[name="confirmPassword"]')

      await newPasswordInput.setValue('ValidPass123!')
      await confirmPasswordInput.setValue('ValidPass123!')
      await confirmPasswordInput.trigger('blur')
      await nextTick()

      const error = wrapper.find('[data-test="confirmPassword-error"]')
      expect(error.exists()).toBe(false)
    })
  })

  describe('Password Difference Validation', () => {
    it('should show error when new password equals current password', async () => {
      wrapper = mount(PasswordChange, {
        props: { loading: false }
      })

      const currentPasswordInput = wrapper.find('input[name="currentPassword"]')
      const newPasswordInput = wrapper.find('input[name="newPassword"]')

      await currentPasswordInput.setValue('SamePass123!')
      await newPasswordInput.setValue('SamePass123!')
      await newPasswordInput.trigger('blur')
      await nextTick()

      const error = wrapper.find('[data-test="newPassword-error"]')
      expect(error.exists()).toBe(true)
      expect(error.text()).toContain('must be different')
    })

    it('should accept when new password is different from current', async () => {
      wrapper = mount(PasswordChange, {
        props: { loading: false }
      })

      const currentPasswordInput = wrapper.find('input[name="currentPassword"]')
      const newPasswordInput = wrapper.find('input[name="newPassword"]')

      await currentPasswordInput.setValue('OldPass123!')
      await newPasswordInput.setValue('NewPass123!')
      await newPasswordInput.trigger('blur')
      await nextTick()

      const error = wrapper.find('[data-test="newPassword-error"]')
      expect(error.exists()).toBe(false)
    })
  })

  describe('Form Submission', () => {
    it('should emit submit event with password data', async () => {
      wrapper = mount(PasswordChange, {
        props: { loading: false }
      })

      const currentPasswordInput = wrapper.find('input[name="currentPassword"]')
      const newPasswordInput = wrapper.find('input[name="newPassword"]')
      const confirmPasswordInput = wrapper.find('input[name="confirmPassword"]')

      await currentPasswordInput.setValue('OldPass123!')
      await newPasswordInput.setValue('NewPass123!')
      await confirmPasswordInput.setValue('NewPass123!')
      await nextTick()

      const form = wrapper.find('form')
      await form.trigger('submit.prevent')
      await nextTick()

      expect(wrapper.emitted('submit')).toBeTruthy()
      const emittedData = wrapper.emitted('submit')?.[0]?.[0] as any
      expect(emittedData.currentPassword).toBe('OldPass123!')
      expect(emittedData.newPassword).toBe('NewPass123!')
      expect(emittedData.confirmPassword).toBe('NewPass123!')
    })

    it('should not submit when form is invalid', async () => {
      wrapper = mount(PasswordChange, {
        props: { loading: false }
      })

      const input = wrapper.find('input[name="newPassword"]')
      await input.setValue('weak')
      await nextTick()

      const form = wrapper.find('form')
      await form.trigger('submit.prevent')
      await nextTick()

      expect(wrapper.emitted('submit')).toBeFalsy()
    })

    it('should disable submit button when form is invalid', async () => {
      wrapper = mount(PasswordChange, {
        props: { loading: false }
      })

      const submitButton = wrapper.find('[data-test="submit-button"]')
      expect(submitButton.attributes('disabled')).toBeDefined()
    })

    it('should enable submit button when form is valid', async () => {
      wrapper = mount(PasswordChange, {
        props: { loading: false }
      })

      const currentPasswordInput = wrapper.find('input[name="currentPassword"]')
      const newPasswordInput = wrapper.find('input[name="newPassword"]')
      const confirmPasswordInput = wrapper.find('input[name="confirmPassword"]')

      await currentPasswordInput.setValue('OldPass123!')
      await newPasswordInput.setValue('NewPass123!')
      await confirmPasswordInput.setValue('NewPass123!')
      await nextTick()

      const submitButton = wrapper.find('[data-test="submit-button"]')
      expect(submitButton.attributes('disabled')).toBeUndefined()
    })
  })

  describe('Form Cancellation', () => {
    it('should emit cancel event when cancel button clicked', async () => {
      wrapper = mount(PasswordChange, {
        props: { loading: false }
      })

      const cancelButton = wrapper.find('[data-test="cancel-button"]')
      await cancelButton.trigger('click')

      expect(wrapper.emitted('cancel')).toBeTruthy()
    })

    it('should not require confirmation for cancel (no unsaved state)', async () => {
      wrapper = mount(PasswordChange, {
        props: { loading: false }
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
      wrapper = mount(PasswordChange, {
        props: { loading: true }
      })

      const currentPasswordInput = wrapper.find('input[name="currentPassword"]')
      const newPasswordInput = wrapper.find('input[name="newPassword"]')
      const confirmPasswordInput = wrapper.find('input[name="confirmPassword"]')

      expect(currentPasswordInput.attributes('disabled')).toBeDefined()
      expect(newPasswordInput.attributes('disabled')).toBeDefined()
      expect(confirmPasswordInput.attributes('disabled')).toBeDefined()
    })

    it('should disable submit button when loading', () => {
      wrapper = mount(PasswordChange, {
        props: { loading: true }
      })

      const submitButton = wrapper.find('[data-test="submit-button"]')
      expect(submitButton.attributes('disabled')).toBeDefined()
    })

    it('should show loading text on submit button', () => {
      wrapper = mount(PasswordChange, {
        props: { loading: true }
      })

      const submitButton = wrapper.find('[data-test="submit-button"]')
      expect(submitButton.text()).toContain('Changing...')
    })

    it('should show normal text when not loading', () => {
      wrapper = mount(PasswordChange, {
        props: { loading: false }
      })

      const submitButton = wrapper.find('[data-test="submit-button"]')
      expect(submitButton.text()).toContain('Change Password')
    })
  })

  describe('Props Validation', () => {
    it('should accept valid props', () => {
      expect(() => {
        mount(PasswordChange, {
          props: { loading: true }
        })
      }).not.toThrow()
    })

    it('should have loading default to false', () => {
      wrapper = mount(PasswordChange, {
        props: {}
      })

      const input = wrapper.find('input[name="currentPassword"]')
      expect(input.attributes('disabled')).toBeUndefined()
    })
  })
})
