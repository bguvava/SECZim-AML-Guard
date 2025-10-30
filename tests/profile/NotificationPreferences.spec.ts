/**
 * NotificationPreferences Component Tests
 * Comprehensive test suite for notification preferences management
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import NotificationPreferences from '@/components/profile/NotificationPreferences.vue'
import type { NotificationPreferences as NotificationPrefs } from '@/types/profile'

const mockPreferences: NotificationPrefs = {
  email: {
    enabled: true,
    transactionAlerts: true,
    complianceUpdates: true,
    securityAlerts: true,
    systemNotifications: false,
    weeklyDigest: true,
    monthlyReport: true
  },
  sms: {
    enabled: true,
    criticalAlerts: true,
    twoFactorAuth: true,
    loginAlerts: false
  },
  push: {
    enabled: false,
    transactionAlerts: false,
    taskReminders: false,
    mentions: false
  },
  inApp: {
    enabled: true,
    sound: true,
    desktop: false
  }
}

describe('NotificationPreferences', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Component Rendering', () => {
    it('should render all notification channels', () => {
      wrapper = mount(NotificationPreferences, {
        props: {
          preferences: mockPreferences,
          loading: false
        }
      })

      expect(wrapper.text()).toContain('Email Notifications')
      expect(wrapper.text()).toContain('SMS Notifications')
      expect(wrapper.text()).toContain('Push Notifications')
      expect(wrapper.text()).toContain('In-App Notifications')
    })

    it('should render email notification options', () => {
      wrapper = mount(NotificationPreferences, {
        props: {
          preferences: mockPreferences,
          loading: false
        }
      })

      expect(wrapper.find('[data-test="email-transactionAlerts"]').exists()).toBe(true)
      expect(wrapper.find('[data-test="email-complianceUpdates"]').exists()).toBe(true)
      expect(wrapper.find('[data-test="email-securityAlerts"]').exists()).toBe(true)
      expect(wrapper.find('[data-test="email-systemNotifications"]').exists()).toBe(true)
      expect(wrapper.find('[data-test="email-weeklyDigest"]').exists()).toBe(true)
      expect(wrapper.find('[data-test="email-monthlyReport"]').exists()).toBe(true)
    })

    it('should render sms notification options', () => {
      wrapper = mount(NotificationPreferences, {
        props: {
          preferences: mockPreferences,
          loading: false
        }
      })

      expect(wrapper.find('[data-test="sms-criticalAlerts"]').exists()).toBe(true)
      expect(wrapper.find('[data-test="sms-twoFactorAuth"]').exists()).toBe(true)
      expect(wrapper.find('[data-test="sms-loginAlerts"]').exists()).toBe(true)
    })

    it('should render push notification options', () => {
      wrapper = mount(NotificationPreferences, {
        props: {
          preferences: mockPreferences,
          loading: false
        }
      })

      expect(wrapper.find('[data-test="push-transactionAlerts"]').exists()).toBe(true)
      expect(wrapper.find('[data-test="push-taskReminders"]').exists()).toBe(true)
      expect(wrapper.find('[data-test="push-mentions"]').exists()).toBe(true)
    })

    it('should render in-app notification options', () => {
      wrapper = mount(NotificationPreferences, {
        props: {
          preferences: mockPreferences,
          loading: false
        }
      })

      expect(wrapper.find('[data-test="inApp-sound"]').exists()).toBe(true)
      expect(wrapper.find('[data-test="inApp-desktop"]').exists()).toBe(true)
    })
  })

  describe('Initial State', () => {
    it('should initialize with provided preferences', () => {
      wrapper = mount(NotificationPreferences, {
        props: {
          preferences: mockPreferences,
          loading: false
        }
      })

      const emailSwitch = wrapper.find('[data-test="email-enabled"]')
      expect((emailSwitch.element as HTMLInputElement).checked).toBe(true)
    })

    it('should check email channel master switch', () => {
      wrapper = mount(NotificationPreferences, {
        props: {
          preferences: mockPreferences,
          loading: false
        }
      })

      const masterSwitch = wrapper.find('[data-test="email-enabled"]')
      expect((masterSwitch.element as HTMLInputElement).checked).toBe(true)
    })

    it('should check enabled email options', () => {
      wrapper = mount(NotificationPreferences, {
        props: {
          preferences: mockPreferences,
          loading: false
        }
      })

      expect((wrapper.find('[data-test="email-transactionAlerts"]').element as HTMLInputElement).checked).toBe(true)
      expect((wrapper.find('[data-test="email-complianceUpdates"]').element as HTMLInputElement).checked).toBe(true)
      expect((wrapper.find('[data-test="email-securityAlerts"]').element as HTMLInputElement).checked).toBe(true)
    })

    it('should uncheck disabled email options', () => {
      wrapper = mount(NotificationPreferences, {
        props: {
          preferences: mockPreferences,
          loading: false
        }
      })

      expect((wrapper.find('[data-test="email-systemNotifications"]').element as HTMLInputElement).checked).toBe(false)
    })
  })

  describe('Master Channel Toggle', () => {
    it('should disable all email options when master switch turned off', async () => {
      wrapper = mount(NotificationPreferences, {
        props: {
          preferences: mockPreferences,
          loading: false
        }
      })

      const masterSwitch = wrapper.find('[data-test="email-enabled"]')
      await masterSwitch.setValue(false)
      await nextTick()

      const transactionAlerts = wrapper.find('[data-test="email-transactionAlerts"]')
      expect(transactionAlerts.attributes('disabled')).toBeDefined()
    })

    it('should enable all email options when master switch turned on', async () => {
      const disabledPrefs = {
        ...mockPreferences,
        email: { ...mockPreferences.email, enabled: false }
      }
      
      wrapper = mount(NotificationPreferences, {
        props: {
          preferences: disabledPrefs,
          loading: false
        }
      })

      const masterSwitch = wrapper.find('[data-test="email-enabled"]')
      await masterSwitch.setValue(true)
      await nextTick()

      const transactionAlerts = wrapper.find('[data-test="email-transactionAlerts"]')
      expect(transactionAlerts.attributes('disabled')).toBeUndefined()
    })

    it('should disable all sms options when master switch turned off', async () => {
      wrapper = mount(NotificationPreferences, {
        props: {
          preferences: mockPreferences,
          loading: false
        }
      })

      const masterSwitch = wrapper.find('[data-test="sms-enabled"]')
      await masterSwitch.setValue(false)
      await nextTick()

      const criticalAlerts = wrapper.find('[data-test="sms-criticalAlerts"]')
      expect(criticalAlerts.attributes('disabled')).toBeDefined()
    })

    it('should disable all push options when master switch turned off', async () => {
      wrapper = mount(NotificationPreferences, {
        props: {
          preferences: mockPreferences,
          loading: false
        }
      })

      const masterSwitch = wrapper.find('[data-test="push-enabled"]')
      await masterSwitch.setValue(true)
      await nextTick()
      await masterSwitch.setValue(false)
      await nextTick()

      const transactionAlerts = wrapper.find('[data-test="push-transactionAlerts"]')
      expect(transactionAlerts.attributes('disabled')).toBeDefined()
    })
  })

  describe('Individual Option Toggles', () => {
    it('should toggle individual email option', async () => {
      wrapper = mount(NotificationPreferences, {
        props: {
          preferences: mockPreferences,
          loading: false
        }
      })

      const option = wrapper.find('[data-test="email-transactionAlerts"]')
      const initialValue = (option.element as HTMLInputElement).checked

      await option.setValue(!initialValue)
      await nextTick()

      expect((option.element as HTMLInputElement).checked).toBe(!initialValue)
    })

    it('should toggle individual sms option', async () => {
      wrapper = mount(NotificationPreferences, {
        props: {
          preferences: mockPreferences,
          loading: false
        }
      })

      const option = wrapper.find('[data-test="sms-criticalAlerts"]')
      await option.setValue(false)
      await nextTick()

      expect((option.element as HTMLInputElement).checked).toBe(false)
    })

    it('should toggle individual push option', async () => {
      wrapper = mount(NotificationPreferences, {
        props: {
          preferences: mockPreferences,
          loading: false
        }
      })

      const masterSwitch = wrapper.find('[data-test="push-enabled"]')
      await masterSwitch.setValue(true)
      await nextTick()

      const option = wrapper.find('[data-test="push-taskReminders"]')
      await option.setValue(true)
      await nextTick()

      expect((option.element as HTMLInputElement).checked).toBe(true)
    })

    it('should toggle sound option for in-app', async () => {
      wrapper = mount(NotificationPreferences, {
        props: {
          preferences: mockPreferences,
          loading: false
        }
      })

      const option = wrapper.find('[data-test="inApp-sound"]')
      await option.setValue(false)
      await nextTick()

      expect((option.element as HTMLInputElement).checked).toBe(false)
    })
  })

  describe('Form State Detection', () => {
    it('should detect dirty state after changes', async () => {
      wrapper = mount(NotificationPreferences, {
        props: {
          preferences: mockPreferences,
          loading: false
        }
      })

      const saveButton = wrapper.find('[data-test="save-button"]')
      expect(saveButton.attributes('disabled')).toBeDefined()

      const option = wrapper.find('[data-test="email-transactionAlerts"]')
      await option.setValue(false)
      await nextTick()

      expect(saveButton.attributes('disabled')).toBeUndefined()
    })

    it('should remain clean when no changes made', () => {
      wrapper = mount(NotificationPreferences, {
        props: {
          preferences: mockPreferences,
          loading: false
        }
      })

      const saveButton = wrapper.find('[data-test="save-button"]')
      expect(saveButton.attributes('disabled')).toBeDefined()
    })

    it('should detect changes across multiple channels', async () => {
      wrapper = mount(NotificationPreferences, {
        props: {
          preferences: mockPreferences,
          loading: false
        }
      })

      const emailOption = wrapper.find('[data-test="email-weeklyDigest"]')
      const smsOption = wrapper.find('[data-test="sms-loginAlerts"]')
      
      await emailOption.setValue(false)
      await smsOption.setValue(true)
      await nextTick()

      const saveButton = wrapper.find('[data-test="save-button"]')
      expect(saveButton.attributes('disabled')).toBeUndefined()
    })
  })

  describe('Save Functionality', () => {
    it('should emit save event with updated preferences', async () => {
      wrapper = mount(NotificationPreferences, {
        props: {
          preferences: mockPreferences,
          loading: false
        }
      })

      const option = wrapper.find('[data-test="email-transactionAlerts"]')
      await option.setValue(false)
      await nextTick()

      const saveButton = wrapper.find('[data-test="save-button"]')
      await saveButton.trigger('click')
      await nextTick()

      expect(wrapper.emitted('save')).toBeTruthy()
      const emittedData = wrapper.emitted('save')?.[0]?.[0] as NotificationPrefs
      expect(emittedData.email.transactionAlerts).toBe(false)
    })

    it('should not save when no changes made', async () => {
      wrapper = mount(NotificationPreferences, {
        props: {
          preferences: mockPreferences,
          loading: false
        }
      })

      const saveButton = wrapper.find('[data-test="save-button"]')
      await saveButton.trigger('click')

      expect(wrapper.emitted('save')).toBeFalsy()
    })

    it('should include all preferences in save event', async () => {
      wrapper = mount(NotificationPreferences, {
        props: {
          preferences: mockPreferences,
          loading: false
        }
      })

      const option = wrapper.find('[data-test="email-transactionAlerts"]')
      await option.setValue(false)
      await nextTick()

      const saveButton = wrapper.find('[data-test="save-button"]')
      await saveButton.trigger('click')

      const emittedData = wrapper.emitted('save')?.[0]?.[0] as NotificationPrefs
      expect(emittedData).toHaveProperty('email')
      expect(emittedData).toHaveProperty('sms')
      expect(emittedData).toHaveProperty('push')
      expect(emittedData).toHaveProperty('inApp')
    })
  })

  describe('Cancel Functionality', () => {
    it('should emit cancel event', async () => {
      wrapper = mount(NotificationPreferences, {
        props: {
          preferences: mockPreferences,
          loading: false
        }
      })

      const cancelButton = wrapper.find('[data-test="cancel-button"]')
      await cancelButton.trigger('click')

      expect(wrapper.emitted('cancel')).toBeTruthy()
    })

    it('should revert changes on cancel', async () => {
      wrapper = mount(NotificationPreferences, {
        props: {
          preferences: mockPreferences,
          loading: false
        }
      })

      const option = wrapper.find('[data-test="email-transactionAlerts"]')
      await option.setValue(false)
      await nextTick()

      const cancelButton = wrapper.find('[data-test="cancel-button"]')
      await cancelButton.trigger('click')
      await nextTick()

      expect((option.element as HTMLInputElement).checked).toBe(true)
    })
  })

  describe('Reset to Defaults', () => {
    it('should emit reset event', async () => {
      wrapper = mount(NotificationPreferences, {
        props: {
          preferences: mockPreferences,
          loading: false
        }
      })

      const resetButton = wrapper.find('[data-test="reset-button"]')
      await resetButton.trigger('click')

      expect(wrapper.emitted('reset')).toBeTruthy()
    })

    it('should show confirmation before reset', async () => {
      wrapper = mount(NotificationPreferences, {
        props: {
          preferences: mockPreferences,
          loading: false
        }
      })

      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)

      const resetButton = wrapper.find('[data-test="reset-button"]')
      await resetButton.trigger('click')

      expect(confirmSpy).toHaveBeenCalledWith('Reset all notification preferences to default values?')
      confirmSpy.mockRestore()
    })

    it('should not reset when confirmation declined', async () => {
      wrapper = mount(NotificationPreferences, {
        props: {
          preferences: mockPreferences,
          loading: false
        }
      })

      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false)

      const resetButton = wrapper.find('[data-test="reset-button"]')
      await resetButton.trigger('click')

      expect(wrapper.emitted('reset')).toBeFalsy()
      confirmSpy.mockRestore()
    })
  })

  describe('Loading State', () => {
    it('should disable all switches when loading', () => {
      wrapper = mount(NotificationPreferences, {
        props: {
          preferences: mockPreferences,
          loading: true
        }
      })

      const emailEnabled = wrapper.find('[data-test="email-enabled"]')
      const smsEnabled = wrapper.find('[data-test="sms-enabled"]')
      
      expect(emailEnabled.attributes('disabled')).toBeDefined()
      expect(smsEnabled.attributes('disabled')).toBeDefined()
    })

    it('should disable save button when loading', () => {
      wrapper = mount(NotificationPreferences, {
        props: {
          preferences: mockPreferences,
          loading: true
        }
      })

      const saveButton = wrapper.find('[data-test="save-button"]')
      expect(saveButton.attributes('disabled')).toBeDefined()
    })

    it('should show loading text on save button', () => {
      wrapper = mount(NotificationPreferences, {
        props: {
          preferences: mockPreferences,
          loading: true
        }
      })

      const saveButton = wrapper.find('[data-test="save-button"]')
      expect(saveButton.text()).toContain('Saving...')
    })

    it('should show normal text when not loading', () => {
      wrapper = mount(NotificationPreferences, {
        props: {
          preferences: mockPreferences,
          loading: false
        }
      })

      const saveButton = wrapper.find('[data-test="save-button"]')
      expect(saveButton.text()).toContain('Save Preferences')
    })
  })

  describe('Props Validation', () => {
    it('should accept valid props', () => {
      expect(() => {
        mount(NotificationPreferences, {
          props: {
            preferences: mockPreferences,
            loading: true
          }
        })
      }).not.toThrow()
    })

    it('should have loading default to false', () => {
      wrapper = mount(NotificationPreferences, {
        props: {
          preferences: mockPreferences
        }
      })

      const emailEnabled = wrapper.find('[data-test="email-enabled"]')
      expect(emailEnabled.attributes('disabled')).toBeUndefined()
    })
  })
})
