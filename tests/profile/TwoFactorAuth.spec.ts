/**
 * TwoFactorAuth Component Tests
 * Comprehensive test suite for two-factor authentication setup and management
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import TwoFactorAuth from '@/components/profile/TwoFactorAuth.vue'
import type { TwoFactorAuth as TwoFactorAuthType } from '@/types/profile'

const mockTwoFactorDisabled: TwoFactorAuthType = {
  enabled: false,
  method: null,
  verified: false,
  backupCodesGenerated: false,
  backupCodesRemaining: 0
}

const mockTwoFactorEnabled: TwoFactorAuthType = {
  enabled: true,
  method: 'totp',
  verified: true,
  backupCodesGenerated: true,
  backupCodesRemaining: 8,
  lastUsed: '2025-10-29T10:30:00Z',
  createdAt: '2025-10-01T08:00:00Z'
}

describe('TwoFactorAuth', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Disabled State', () => {
    it('should show setup prompt when 2FA disabled', () => {
      wrapper = mount(TwoFactorAuth, {
        props: {
          twoFactorAuth: mockTwoFactorDisabled,
          loading: false
        }
      })

      expect(wrapper.text()).toContain('Two-factor authentication is not enabled')
    })

    it('should show enable button when disabled', () => {
      wrapper = mount(TwoFactorAuth, {
        props: {
          twoFactorAuth: mockTwoFactorDisabled,
          loading: false
        }
      })

      const enableButton = wrapper.find('[data-test="enable-2fa-button"]')
      expect(enableButton.exists()).toBe(true)
    })

    it('should not show disable button when disabled', () => {
      wrapper = mount(TwoFactorAuth, {
        props: {
          twoFactorAuth: mockTwoFactorDisabled,
          loading: false
        }
      })

      const disableButton = wrapper.find('[data-test="disable-2fa-button"]')
      expect(disableButton.exists()).toBe(false)
    })

    it('should show method selection when setup initiated', async () => {
      wrapper = mount(TwoFactorAuth, {
        props: {
          twoFactorAuth: mockTwoFactorDisabled,
          loading: false
        }
      })

      const enableButton = wrapper.find('[data-test="enable-2fa-button"]')
      await enableButton.trigger('click')
      await nextTick()

      expect(wrapper.find('[data-test="method-totp"]').exists()).toBe(true)
      expect(wrapper.find('[data-test="method-sms"]').exists()).toBe(true)
      expect(wrapper.find('[data-test="method-email"]').exists()).toBe(true)
    })
  })

  describe('Enabled State', () => {
    it('should show enabled status when 2FA enabled', () => {
      wrapper = mount(TwoFactorAuth, {
        props: {
          twoFactorAuth: mockTwoFactorEnabled,
          loading: false
        }
      })

      expect(wrapper.text()).toContain('Two-factor authentication is enabled')
    })

    it('should show enabled badge', () => {
      wrapper = mount(TwoFactorAuth, {
        props: {
          twoFactorAuth: mockTwoFactorEnabled,
          loading: false
        }
      })

      const enabledBadge = wrapper.find('[data-test="2fa-enabled-badge"]')
      expect(enabledBadge.exists()).toBe(true)
      expect(enabledBadge.text()).toContain('Enabled')
    })

    it('should display current method', () => {
      wrapper = mount(TwoFactorAuth, {
        props: {
          twoFactorAuth: mockTwoFactorEnabled,
          loading: false
        }
      })

      expect(wrapper.text()).toContain('Authenticator App')
    })

    it('should show disable button when enabled', () => {
      wrapper = mount(TwoFactorAuth, {
        props: {
          twoFactorAuth: mockTwoFactorEnabled,
          loading: false
        }
      })

      const disableButton = wrapper.find('[data-test="disable-2fa-button"]')
      expect(disableButton.exists()).toBe(true)
    })

    it('should not show enable button when enabled', () => {
      wrapper = mount(TwoFactorAuth, {
        props: {
          twoFactorAuth: mockTwoFactorEnabled,
          loading: false
        }
      })

      const enableButton = wrapper.find('[data-test="enable-2fa-button"]')
      expect(enableButton.exists()).toBe(false)
    })

    it('should display last used timestamp', () => {
      wrapper = mount(TwoFactorAuth, {
        props: {
          twoFactorAuth: mockTwoFactorEnabled,
          loading: false
        }
      })

      expect(wrapper.text()).toMatch(/Last used|Recently/)
    })

    it('should display backup codes remaining', () => {
      wrapper = mount(TwoFactorAuth, {
        props: {
          twoFactorAuth: mockTwoFactorEnabled,
          loading: false
        }
      })

      expect(wrapper.text()).toContain('8 backup codes remaining')
    })
  })

  describe('Method Selection', () => {
    it('should emit enable event with TOTP method', async () => {
      wrapper = mount(TwoFactorAuth, {
        props: {
          twoFactorAuth: mockTwoFactorDisabled,
          loading: false
        }
      })

      const enableButton = wrapper.find('[data-test="enable-2fa-button"]')
      await enableButton.trigger('click')
      await nextTick()

      const totpButton = wrapper.find('[data-test="method-totp"]')
      await totpButton.trigger('click')

      expect(wrapper.emitted('enable')).toBeTruthy()
      expect(wrapper.emitted('enable')?.[0]).toEqual(['totp'])
    })

    it('should emit enable event with SMS method', async () => {
      wrapper = mount(TwoFactorAuth, {
        props: {
          twoFactorAuth: mockTwoFactorDisabled,
          loading: false
        }
      })

      const enableButton = wrapper.find('[data-test="enable-2fa-button"]')
      await enableButton.trigger('click')
      await nextTick()

      const smsButton = wrapper.find('[data-test="method-sms"]')
      await smsButton.trigger('click')

      expect(wrapper.emitted('enable')?.[0]).toEqual(['sms'])
    })

    it('should emit enable event with Email method', async () => {
      wrapper = mount(TwoFactorAuth, {
        props: {
          twoFactorAuth: mockTwoFactorDisabled,
          loading: false
        }
      })

      const enableButton = wrapper.find('[data-test="enable-2fa-button"]')
      await enableButton.trigger('click')
      await nextTick()

      const emailButton = wrapper.find('[data-test="method-email"]')
      await emailButton.trigger('click')

      expect(wrapper.emitted('enable')?.[0]).toEqual(['email'])
    })

    it('should show method descriptions', async () => {
      wrapper = mount(TwoFactorAuth, {
        props: {
          twoFactorAuth: mockTwoFactorDisabled,
          loading: false
        }
      })

      const enableButton = wrapper.find('[data-test="enable-2fa-button"]')
      await enableButton.trigger('click')
      await nextTick()

      expect(wrapper.text()).toContain('Authenticator App')
      expect(wrapper.text()).toContain('SMS')
      expect(wrapper.text()).toContain('Email')
    })
  })

  describe('QR Code Display', () => {
    it('should show QR code in setup mode', async () => {
      wrapper = mount(TwoFactorAuth, {
        props: {
          twoFactorAuth: mockTwoFactorDisabled,
          loading: false,
          setupData: {
            qrCode: 'data:image/png;base64,mockQR',
            secret: 'JBSWY3DPEHPK3PXP',
            backupCodes: ['1234-5678', '90AB-CDEF']
          }
        }
      })

      const qrCode = wrapper.find('[data-test="qr-code"]')
      expect(qrCode.exists()).toBe(true)
      expect(qrCode.attributes('src')).toBe('data:image/png;base64,mockQR')
    })

    it('should display secret key', async () => {
      wrapper = mount(TwoFactorAuth, {
        props: {
          twoFactorAuth: mockTwoFactorDisabled,
          loading: false,
          setupData: {
            qrCode: 'data:image/png;base64,mockQR',
            secret: 'JBSWY3DPEHPK3PXP',
            backupCodes: []
          }
        }
      })

      expect(wrapper.text()).toContain('JBSWY3DPEHPK3PXP')
    })

    it('should have copy button for secret key', async () => {
      wrapper = mount(TwoFactorAuth, {
        props: {
          twoFactorAuth: mockTwoFactorDisabled,
          loading: false,
          setupData: {
            qrCode: 'data:image/png;base64,mockQR',
            secret: 'JBSWY3DPEHPK3PXP',
            backupCodes: []
          }
        }
      })

      const copyButton = wrapper.find('[data-test="copy-secret-button"]')
      expect(copyButton.exists()).toBe(true)
    })

    it('should copy secret to clipboard', async () => {
      const mockClipboard = {
        writeText: vi.fn().mockResolvedValue(undefined)
      }
      Object.defineProperty(navigator, 'clipboard', {
        value: mockClipboard,
        writable: true
      })

      wrapper = mount(TwoFactorAuth, {
        props: {
          twoFactorAuth: mockTwoFactorDisabled,
          loading: false,
          setupData: {
            qrCode: 'data:image/png;base64,mockQR',
            secret: 'JBSWY3DPEHPK3PXP',
            backupCodes: []
          }
        }
      })

      const copyButton = wrapper.find('[data-test="copy-secret-button"]')
      await copyButton.trigger('click')

      expect(mockClipboard.writeText).toHaveBeenCalledWith('JBSWY3DPEHPK3PXP')
    })
  })

  describe('Verification Code Input', () => {
    it('should render verification code input', async () => {
      wrapper = mount(TwoFactorAuth, {
        props: {
          twoFactorAuth: mockTwoFactorDisabled,
          loading: false,
          setupData: {
            qrCode: 'data:image/png;base64,mockQR',
            secret: 'JBSWY3DPEHPK3PXP',
            backupCodes: []
          }
        }
      })

      const codeInput = wrapper.find('[data-test="verification-code-input"]')
      expect(codeInput.exists()).toBe(true)
    })

    it('should accept 6-digit code', async () => {
      wrapper = mount(TwoFactorAuth, {
        props: {
          twoFactorAuth: mockTwoFactorDisabled,
          loading: false,
          setupData: {
            qrCode: 'data:image/png;base64,mockQR',
            secret: 'JBSWY3DPEHPK3PXP',
            backupCodes: []
          }
        }
      })

      const codeInput = wrapper.find('[data-test="verification-code-input"]')
      await codeInput.setValue('123456')
      await nextTick()

      expect((codeInput.element as HTMLInputElement).value).toBe('123456')
    })

    it('should show error for invalid code length', async () => {
      wrapper = mount(TwoFactorAuth, {
        props: {
          twoFactorAuth: mockTwoFactorDisabled,
          loading: false,
          setupData: {
            qrCode: 'data:image/png;base64,mockQR',
            secret: 'JBSWY3DPEHPK3PXP',
            backupCodes: []
          }
        }
      })

      const codeInput = wrapper.find('[data-test="verification-code-input"]')
      await codeInput.setValue('12345')
      await codeInput.trigger('blur')
      await nextTick()

      const error = wrapper.find('[data-test="verification-code-error"]')
      expect(error.exists()).toBe(true)
    })

    it('should emit verify event with valid code', async () => {
      wrapper = mount(TwoFactorAuth, {
        props: {
          twoFactorAuth: mockTwoFactorDisabled,
          loading: false,
          setupData: {
            qrCode: 'data:image/png;base64,mockQR',
            secret: 'JBSWY3DPEHPK3PXP',
            backupCodes: []
          }
        }
      })

      const codeInput = wrapper.find('[data-test="verification-code-input"]')
      await codeInput.setValue('123456')
      await nextTick()

      const verifyButton = wrapper.find('[data-test="verify-button"]')
      await verifyButton.trigger('click')

      expect(wrapper.emitted('verify')).toBeTruthy()
      expect(wrapper.emitted('verify')?.[0]).toEqual(['123456', 'JBSWY3DPEHPK3PXP'])
    })
  })

  describe('Backup Codes', () => {
    it('should display backup codes after setup', async () => {
      wrapper = mount(TwoFactorAuth, {
        props: {
          twoFactorAuth: mockTwoFactorDisabled,
          loading: false,
          setupData: {
            qrCode: 'data:image/png;base64,mockQR',
            secret: 'JBSWY3DPEHPK3PXP',
            backupCodes: ['1234-5678', '90AB-CDEF', 'WXYZ-1234']
          }
        }
      })

      expect(wrapper.text()).toContain('1234-5678')
      expect(wrapper.text()).toContain('90AB-CDEF')
      expect(wrapper.text()).toContain('WXYZ-1234')
    })

    it('should have copy all button for backup codes', async () => {
      wrapper = mount(TwoFactorAuth, {
        props: {
          twoFactorAuth: mockTwoFactorDisabled,
          loading: false,
          setupData: {
            qrCode: 'data:image/png;base64,mockQR',
            secret: 'JBSWY3DPEHPK3PXP',
            backupCodes: ['1234-5678', '90AB-CDEF']
          }
        }
      })

      const copyButton = wrapper.find('[data-test="copy-backup-codes-button"]')
      expect(copyButton.exists()).toBe(true)
    })

    it('should have download button for backup codes', async () => {
      wrapper = mount(TwoFactorAuth, {
        props: {
          twoFactorAuth: mockTwoFactorDisabled,
          loading: false,
          setupData: {
            qrCode: 'data:image/png;base64,mockQR',
            secret: 'JBSWY3DPEHPK3PXP',
            backupCodes: ['1234-5678', '90AB-CDEF']
          }
        }
      })

      const downloadButton = wrapper.find('[data-test="download-backup-codes-button"]')
      expect(downloadButton.exists()).toBe(true)
    })

    it('should show regenerate button when enabled', () => {
      wrapper = mount(TwoFactorAuth, {
        props: {
          twoFactorAuth: mockTwoFactorEnabled,
          loading: false
        }
      })

      const regenerateButton = wrapper.find('[data-test="regenerate-backup-codes-button"]')
      expect(regenerateButton.exists()).toBe(true)
    })

    it('should emit regenerateBackupCodes event', async () => {
      wrapper = mount(TwoFactorAuth, {
        props: {
          twoFactorAuth: mockTwoFactorEnabled,
          loading: false
        }
      })

      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)

      const regenerateButton = wrapper.find('[data-test="regenerate-backup-codes-button"]')
      await regenerateButton.trigger('click')

      expect(wrapper.emitted('regenerateBackupCodes')).toBeTruthy()
      
      confirmSpy.mockRestore()
    })

    it('should show warning about backup codes count', () => {
      const lowBackupCodes = {
        ...mockTwoFactorEnabled,
        backupCodesRemaining: 2
      }

      wrapper = mount(TwoFactorAuth, {
        props: {
          twoFactorAuth: lowBackupCodes,
          loading: false
        }
      })

      const warning = wrapper.find('[data-test="backup-codes-warning"]')
      expect(warning.exists()).toBe(true)
      expect(warning.text()).toContain('only 2 backup codes remaining')
    })
  })

  describe('Disable Functionality', () => {
    it('should show password confirmation dialog', async () => {
      wrapper = mount(TwoFactorAuth, {
        props: {
          twoFactorAuth: mockTwoFactorEnabled,
          loading: false
        }
      })

      const disableButton = wrapper.find('[data-test="disable-2fa-button"]')
      await disableButton.trigger('click')
      await nextTick()

      const passwordInput = wrapper.find('[data-test="disable-password-input"]')
      expect(passwordInput.exists()).toBe(true)
    })

    it('should emit disable event with password', async () => {
      wrapper = mount(TwoFactorAuth, {
        props: {
          twoFactorAuth: mockTwoFactorEnabled,
          loading: false
        }
      })

      const disableButton = wrapper.find('[data-test="disable-2fa-button"]')
      await disableButton.trigger('click')
      await nextTick()

      const passwordInput = wrapper.find('[data-test="disable-password-input"]')
      await passwordInput.setValue('MyPassword123!')
      await nextTick()

      const confirmButton = wrapper.find('[data-test="confirm-disable-button"]')
      await confirmButton.trigger('click')

      expect(wrapper.emitted('disable')).toBeTruthy()
      expect(wrapper.emitted('disable')?.[0]).toEqual(['MyPassword123!'])
    })

    it('should require password for disable', async () => {
      wrapper = mount(TwoFactorAuth, {
        props: {
          twoFactorAuth: mockTwoFactorEnabled,
          loading: false
        }
      })

      const disableButton = wrapper.find('[data-test="disable-2fa-button"]')
      await disableButton.trigger('click')
      await nextTick()

      const confirmButton = wrapper.find('[data-test="confirm-disable-button"]')
      expect(confirmButton.attributes('disabled')).toBeDefined()
    })

    it('should show confirmation warning', async () => {
      wrapper = mount(TwoFactorAuth, {
        props: {
          twoFactorAuth: mockTwoFactorEnabled,
          loading: false
        }
      })

      const disableButton = wrapper.find('[data-test="disable-2fa-button"]')
      await disableButton.trigger('click')
      await nextTick()

      expect(wrapper.text()).toContain('less secure')
    })
  })

  describe('Loading State', () => {
    it('should disable enable button when loading', () => {
      wrapper = mount(TwoFactorAuth, {
        props: {
          twoFactorAuth: mockTwoFactorDisabled,
          loading: true
        }
      })

      const enableButton = wrapper.find('[data-test="enable-2fa-button"]')
      expect(enableButton.attributes('disabled')).toBeDefined()
    })

    it('should disable disable button when loading', () => {
      wrapper = mount(TwoFactorAuth, {
        props: {
          twoFactorAuth: mockTwoFactorEnabled,
          loading: true
        }
      })

      const disableButton = wrapper.find('[data-test="disable-2fa-button"]')
      expect(disableButton.attributes('disabled')).toBeDefined()
    })

    it('should show loading text on verify button', () => {
      wrapper = mount(TwoFactorAuth, {
        props: {
          twoFactorAuth: mockTwoFactorDisabled,
          loading: true,
          setupData: {
            qrCode: 'data:image/png;base64,mockQR',
            secret: 'JBSWY3DPEHPK3PXP',
            backupCodes: []
          }
        }
      })

      const verifyButton = wrapper.find('[data-test="verify-button"]')
      expect(verifyButton.text()).toContain('Verifying...')
    })
  })

  describe('Props Validation', () => {
    it('should accept valid props', () => {
      expect(() => {
        mount(TwoFactorAuth, {
          props: {
            twoFactorAuth: mockTwoFactorEnabled,
            loading: true
          }
        })
      }).not.toThrow()
    })

    it('should have loading default to false', () => {
      wrapper = mount(TwoFactorAuth, {
        props: {
          twoFactorAuth: mockTwoFactorDisabled
        }
      })

      const enableButton = wrapper.find('[data-test="enable-2fa-button"]')
      expect(enableButton.attributes('disabled')).toBeUndefined()
    })
  })
})
