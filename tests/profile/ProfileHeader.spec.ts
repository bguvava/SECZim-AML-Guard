/**
 * ProfileHeader Component Tests
 * Comprehensive test suite for profile header functionality
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import ProfileHeader from '@/components/profile/ProfileHeader.vue'
import type { UserProfile } from '@/types/profile'

// Mock profile data
const mockProfile: UserProfile = {
  id: 'user-123',
  email: 'john.doe@example.com',
  firstName: 'John',
  lastName: 'Doe',
  fullName: 'John Doe',
  phoneNumber: '+1 (555) 123-4567',
  avatar: 'https://example.com/avatar.jpg',
  role: 'admin',
  dateOfBirth: '1985-06-15',
  emailVerified: true,
  phoneVerified: true,
  twoFactorEnabled: true,
  verified: true,
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2025-10-25T14:20:00Z',
  lastLogin: '2025-10-30T08:15:00Z'
}

describe('ProfileHeader', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Avatar Display', () => {
    it('should render avatar image when avatar URL is provided', () => {
      wrapper = mount(ProfileHeader, {
        props: {
          profile: mockProfile,
          editable: false
        }
      })

      const avatar = wrapper.find('img[alt="Profile avatar"]')
      expect(avatar.exists()).toBe(true)
      expect(avatar.attributes('src')).toBe(mockProfile.avatar)
    })

    it('should render initials fallback when avatar is undefined', () => {
      const profileWithoutAvatar = { ...mockProfile, avatar: undefined }
      wrapper = mount(ProfileHeader, {
        props: {
          profile: profileWithoutAvatar,
          editable: false
        }
      })

      const initialsDiv = wrapper.find('[data-test="avatar-initials"]')
      expect(initialsDiv.exists()).toBe(true)
      expect(initialsDiv.text()).toBe('JD')
    })

    it('should generate correct initials for two names', () => {
      wrapper = mount(ProfileHeader, {
        props: {
          profile: { ...mockProfile, avatar: undefined },
          editable: false
        }
      })

      const initialsDiv = wrapper.find('[data-test="avatar-initials"]')
      expect(initialsDiv.text()).toBe('JD')
    })

    it('should generate correct initials for single name', () => {
      const singleNameProfile = { 
        ...mockProfile, 
        firstName: 'Madonna',
        lastName: '',
        fullName: 'Madonna',
        avatar: undefined 
      }
      wrapper = mount(ProfileHeader, {
        props: {
          profile: singleNameProfile,
          editable: false
        }
      })

      const initialsDiv = wrapper.find('[data-test="avatar-initials"]')
      expect(initialsDiv.text()).toBe('M')
    })

    it('should handle empty name gracefully', () => {
      const emptyNameProfile = { 
        ...mockProfile, 
        firstName: '',
        lastName: '',
        fullName: '',
        avatar: undefined 
      }
      wrapper = mount(ProfileHeader, {
        props: {
          profile: emptyNameProfile,
          editable: false
        }
      })

      const initialsDiv = wrapper.find('[data-test="avatar-initials"]')
      expect(initialsDiv.text()).toBe('?')
    })

    it('should not show upload overlay when not editable', () => {
      wrapper = mount(ProfileHeader, {
        props: {
          profile: mockProfile,
          editable: false
        }
      })

      const overlay = wrapper.find('[data-test="avatar-overlay"]')
      expect(overlay.exists()).toBe(false)
    })

    it('should show upload overlay on hover when editable (desktop)', async () => {
      wrapper = mount(ProfileHeader, {
        props: {
          profile: mockProfile,
          editable: true
        }
      })

      const overlay = wrapper.find('.group-hover\\:opacity-100')
      expect(overlay.exists()).toBe(true)
    })
  })

  describe('Avatar Upload', () => {
    it('should emit uploadAvatar event when file is selected', async () => {
      wrapper = mount(ProfileHeader, {
        props: {
          profile: mockProfile,
          editable: true
        }
      })

      const file = new File(['avatar'], 'avatar.jpg', { type: 'image/jpeg' })
      const input = wrapper.find('input[type="file"]')
      
      await input.setValue([file])

      expect(wrapper.emitted('uploadAvatar')).toBeTruthy()
      expect(wrapper.emitted('uploadAvatar')?.[0]).toEqual([file])
    })

    it('should validate file type (accept only images)', async () => {
      wrapper = mount(ProfileHeader, {
        props: {
          profile: mockProfile,
          editable: true
        }
      })

      const file = new File(['document'], 'document.pdf', { type: 'application/pdf' })
      const input = wrapper.find('input[type="file"]')
      
      // Spy on window.alert
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
      
      await input.setValue([file])

      expect(alertSpy).toHaveBeenCalledWith('Please select an image file (JPEG, PNG, GIF, or WebP)')
      expect(wrapper.emitted('uploadAvatar')).toBeFalsy()
      
      alertSpy.mockRestore()
    })

    it('should validate file size (max 5MB)', async () => {
      wrapper = mount(ProfileHeader, {
        props: {
          profile: mockProfile,
          editable: true
        }
      })

      // Create a mock file larger than 5MB
      const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' })
      Object.defineProperty(largeFile, 'size', { value: 6 * 1024 * 1024 })
      
      const input = wrapper.find('input[type="file"]')
      
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
      
      await input.setValue([largeFile])

      expect(alertSpy).toHaveBeenCalledWith('File size must be less than 5MB')
      expect(wrapper.emitted('uploadAvatar')).toBeFalsy()
      
      alertSpy.mockRestore()
    })

    it('should accept valid image files', async () => {
      wrapper = mount(ProfileHeader, {
        props: {
          profile: mockProfile,
          editable: true
        }
      })

      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      
      for (const type of validTypes) {
        const file = new File(['image'], `avatar.${type.split('/')[1]}`, { type })
        Object.defineProperty(file, 'size', { value: 1024 * 1024 }) // 1MB
        
        const input = wrapper.find('input[type="file"]')
        await input.setValue([file])

        expect(wrapper.emitted('uploadAvatar')).toBeTruthy()
      }
    })

    it('should show mobile upload button when editable', () => {
      wrapper = mount(ProfileHeader, {
        props: {
          profile: mockProfile,
          editable: true
        }
      })

      const mobileButton = wrapper.find('[data-test="mobile-upload-button"]')
      expect(mobileButton.exists()).toBe(true)
      expect(mobileButton.text()).toContain('Change Photo')
    })

    it('should not show mobile upload button when not editable', () => {
      wrapper = mount(ProfileHeader, {
        props: {
          profile: mockProfile,
          editable: false
        }
      })

      const mobileButton = wrapper.find('[data-test="mobile-upload-button"]')
      expect(mobileButton.exists()).toBe(false)
    })
  })

  describe('Avatar Removal', () => {
    it('should emit removeAvatar event when remove button clicked', async () => {
      wrapper = mount(ProfileHeader, {
        props: {
          profile: mockProfile,
          editable: true
        }
      })

      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)
      
      const removeButton = wrapper.find('[data-test="remove-avatar-button"]')
      await removeButton.trigger('click')

      expect(confirmSpy).toHaveBeenCalledWith('Are you sure you want to remove your profile picture?')
      expect(wrapper.emitted('removeAvatar')).toBeTruthy()
      
      confirmSpy.mockRestore()
    })

    it('should not emit removeAvatar when confirm is cancelled', async () => {
      wrapper = mount(ProfileHeader, {
        props: {
          profile: mockProfile,
          editable: true
        }
      })

      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false)
      
      const removeButton = wrapper.find('[data-test="remove-avatar-button"]')
      await removeButton.trigger('click')

      expect(confirmSpy).toHaveBeenCalled()
      expect(wrapper.emitted('removeAvatar')).toBeFalsy()
      
      confirmSpy.mockRestore()
    })

    it('should not show remove button when avatar is undefined', () => {
      const profileWithoutAvatar = { ...mockProfile, avatar: undefined }
      wrapper = mount(ProfileHeader, {
        props: {
          profile: profileWithoutAvatar,
          editable: true
        }
      })

      const removeButton = wrapper.find('[data-test="remove-avatar-button"]')
      expect(removeButton.exists()).toBe(false)
    })

    it('should not show remove button when not editable', () => {
      wrapper = mount(ProfileHeader, {
        props: {
          profile: mockProfile,
          editable: false
        }
      })

      const removeButton = wrapper.find('[data-test="remove-avatar-button"]')
      expect(removeButton.exists()).toBe(false)
    })
  })

  describe('Role Badge', () => {
    it('should display Admin badge with correct color for admin role', () => {
      const adminProfile = { ...mockProfile, role: 'admin' as const }
      wrapper = mount(ProfileHeader, {
        props: {
          profile: adminProfile,
          editable: false
        }
      })

      const badge = wrapper.find('[data-test="role-badge"]')
      expect(badge.exists()).toBe(true)
      expect(badge.text()).toBe('Admin')
      expect(badge.classes()).toContain('bg-purple-100')
      expect(badge.classes()).toContain('text-purple-800')
    })

    it('should display Supervisor badge with correct color for supervisor role', () => {
      const supervisorProfile = { ...mockProfile, role: 'supervisor' as const }
      wrapper = mount(ProfileHeader, {
        props: {
          profile: supervisorProfile,
          editable: false
        }
      })

      const badge = wrapper.find('[data-test="role-badge"]')
      expect(badge.text()).toBe('Supervisor')
      expect(badge.classes()).toContain('bg-blue-100')
      expect(badge.classes()).toContain('text-blue-800')
    })

    it('should display Entity badge with correct color for entity role', () => {
      const entityProfile = { ...mockProfile, role: 'entity' as const }
      wrapper = mount(ProfileHeader, {
        props: {
          profile: entityProfile,
          editable: false
        }
      })

      const badge = wrapper.find('[data-test="role-badge"]')
      expect(badge.text()).toBe('Entity')
      expect(badge.classes()).toContain('bg-green-100')
      expect(badge.classes()).toContain('text-green-800')
    })
  })

  describe('Verification Badges', () => {
    it('should show email verified badge when email is verified', () => {
      wrapper = mount(ProfileHeader, {
        props: {
          profile: { ...mockProfile, emailVerified: true },
          editable: false
        }
      })

      const emailBadge = wrapper.find('[data-test="email-verified-badge"]')
      expect(emailBadge.exists()).toBe(true)
      expect(emailBadge.text()).toContain('Email Verified')
    })

    it('should not show email verified badge when email is not verified', () => {
      wrapper = mount(ProfileHeader, {
        props: {
          profile: { ...mockProfile, emailVerified: false },
          editable: false
        }
      })

      const emailBadge = wrapper.find('[data-test="email-verified-badge"]')
      expect(emailBadge.exists()).toBe(false)
    })

    it('should show phone verified badge when phone is verified', () => {
      wrapper = mount(ProfileHeader, {
        props: {
          profile: { ...mockProfile, phoneVerified: true },
          editable: false
        }
      })

      const phoneBadge = wrapper.find('[data-test="phone-verified-badge"]')
      expect(phoneBadge.exists()).toBe(true)
      expect(phoneBadge.text()).toContain('Phone Verified')
    })

    it('should not show phone verified badge when phone is not verified', () => {
      wrapper = mount(ProfileHeader, {
        props: {
          profile: { ...mockProfile, phoneVerified: false },
          editable: false
        }
      })

      const phoneBadge = wrapper.find('[data-test="phone-verified-badge"]')
      expect(phoneBadge.exists()).toBe(false)
    })

    it('should show 2FA enabled badge when 2FA is enabled', () => {
      wrapper = mount(ProfileHeader, {
        props: {
          profile: { ...mockProfile, twoFactorEnabled: true },
          editable: false
        }
      })

      const twoFaBadge = wrapper.find('[data-test="2fa-enabled-badge"]')
      expect(twoFaBadge.exists()).toBe(true)
      expect(twoFaBadge.text()).toContain('2FA Enabled')
    })

    it('should not show 2FA enabled badge when 2FA is not enabled', () => {
      wrapper = mount(ProfileHeader, {
        props: {
          profile: { ...mockProfile, twoFactorEnabled: false },
          editable: false
        }
      })

      const twoFaBadge = wrapper.find('[data-test="2fa-enabled-badge"]')
      expect(twoFaBadge.exists()).toBe(false)
    })

    it('should show all verification badges when all are verified', () => {
      wrapper = mount(ProfileHeader, {
        props: {
          profile: {
            ...mockProfile,
            emailVerified: true,
            phoneVerified: true,
            twoFactorEnabled: true
          },
          editable: false
        }
      })

      expect(wrapper.find('[data-test="email-verified-badge"]').exists()).toBe(true)
      expect(wrapper.find('[data-test="phone-verified-badge"]').exists()).toBe(true)
      expect(wrapper.find('[data-test="2fa-enabled-badge"]').exists()).toBe(true)
    })
  })

  describe('Last Login Display', () => {
    it('should display "just now" for very recent login (< 1 minute)', () => {
      const recentProfile = {
        ...mockProfile,
        lastLogin: new Date().toISOString()
      }
      wrapper = mount(ProfileHeader, {
        props: {
          profile: recentProfile,
          editable: false
        }
      })

      const lastLogin = wrapper.find('[data-test="last-login"]')
      expect(lastLogin.text()).toContain('just now')
    })

    it('should display minutes for recent login (< 1 hour)', () => {
      const recentProfile = {
        ...mockProfile,
        lastLogin: new Date(Date.now() - 30 * 60 * 1000).toISOString() // 30 minutes ago
      }
      wrapper = mount(ProfileHeader, {
        props: {
          profile: recentProfile,
          editable: false
        }
      })

      const lastLogin = wrapper.find('[data-test="last-login"]')
      expect(lastLogin.text()).toMatch(/30m ago/)
    })

    it('should display hours for login within today (< 24 hours)', () => {
      const recentProfile = {
        ...mockProfile,
        lastLogin: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() // 5 hours ago
      }
      wrapper = mount(ProfileHeader, {
        props: {
          profile: recentProfile,
          editable: false
        }
      })

      const lastLogin = wrapper.find('[data-test="last-login"]')
      expect(lastLogin.text()).toMatch(/5h ago/)
    })

    it('should display days for login within week (< 7 days)', () => {
      const recentProfile = {
        ...mockProfile,
        lastLogin: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
      }
      wrapper = mount(ProfileHeader, {
        props: {
          profile: recentProfile,
          editable: false
        }
      })

      const lastLogin = wrapper.find('[data-test="last-login"]')
      expect(lastLogin.text()).toMatch(/3d ago/)
    })

    it('should display full date for older login (>= 7 days)', () => {
      const oldProfile = {
        ...mockProfile,
        lastLogin: '2025-10-15T08:15:00Z'
      }
      wrapper = mount(ProfileHeader, {
        props: {
          profile: oldProfile,
          editable: false
        }
      })

      const lastLogin = wrapper.find('[data-test="last-login"]')
      expect(lastLogin.text()).toContain('Oct')
      expect(lastLogin.text()).toContain('15')
    })

    it('should handle missing lastLogin gracefully', () => {
      const profileNoLogin = {
        ...mockProfile,
        lastLogin: undefined
      }
      wrapper = mount(ProfileHeader, {
        props: {
          profile: profileNoLogin,
          editable: false
        }
      })

      const lastLogin = wrapper.find('[data-test="last-login"]')
      expect(lastLogin.text()).toBe('Never')
    })
  })

  describe('Loading State', () => {
    it('should disable upload button when loading', () => {
      wrapper = mount(ProfileHeader, {
        props: {
          profile: mockProfile,
          editable: true,
          loading: true
        }
      })

      const mobileButton = wrapper.find('[data-test="mobile-upload-button"]')
      expect(mobileButton.attributes('disabled')).toBeDefined()
    })

    it('should disable remove button when loading', () => {
      wrapper = mount(ProfileHeader, {
        props: {
          profile: mockProfile,
          editable: true,
          loading: true
        }
      })

      const removeButton = wrapper.find('[data-test="remove-avatar-button"]')
      expect(removeButton.attributes('disabled')).toBeDefined()
    })

    it('should show loading text on mobile upload button when loading', () => {
      wrapper = mount(ProfileHeader, {
        props: {
          profile: mockProfile,
          editable: true,
          loading: true
        }
      })

      const mobileButton = wrapper.find('[data-test="mobile-upload-button"]')
      expect(mobileButton.text()).toContain('Uploading...')
    })
  })

  describe('Profile Information Display', () => {
    it('should display full name correctly', () => {
      wrapper = mount(ProfileHeader, {
        props: {
          profile: mockProfile,
          editable: false
        }
      })

      const fullName = wrapper.find('[data-test="full-name"]')
      expect(fullName.text()).toBe('John Doe')
    })

    it('should display email correctly', () => {
      wrapper = mount(ProfileHeader, {
        props: {
          profile: mockProfile,
          editable: false
        }
      })

      const email = wrapper.find('[data-test="email"]')
      expect(email.text()).toBe('john.doe@example.com')
    })

    it('should display phone number when provided', () => {
      wrapper = mount(ProfileHeader, {
        props: {
          profile: mockProfile,
          editable: false
        }
      })

      const phone = wrapper.find('[data-test="phone"]')
      expect(phone.text()).toBe('+1 (555) 123-4567')
    })

    it('should not display phone section when phone is undefined', () => {
      const profileNoPhone = { ...mockProfile, phoneNumber: undefined }
      wrapper = mount(ProfileHeader, {
        props: {
          profile: profileNoPhone,
          editable: false
        }
      })

      const phone = wrapper.find('[data-test="phone"]')
      expect(phone.exists()).toBe(false)
    })
  })

  describe('Props Validation', () => {
    it('should accept all valid props', () => {
      expect(() => {
        mount(ProfileHeader, {
          props: {
            profile: mockProfile,
            loading: true,
            editable: true
          }
        })
      }).not.toThrow()
    })

    it('should have editable default to false', () => {
      wrapper = mount(ProfileHeader, {
        props: {
          profile: mockProfile
        }
      })

      const mobileButton = wrapper.find('[data-test="mobile-upload-button"]')
      expect(mobileButton.exists()).toBe(false)
    })

    it('should have loading default to false', () => {
      wrapper = mount(ProfileHeader, {
        props: {
          profile: mockProfile,
          editable: true
        }
      })

      const mobileButton = wrapper.find('[data-test="mobile-upload-button"]')
      expect(mobileButton.attributes('disabled')).toBeUndefined()
    })
  })
})
