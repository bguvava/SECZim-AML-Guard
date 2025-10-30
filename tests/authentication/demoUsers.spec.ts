import { describe, it, expect } from 'vitest'
import { 
  DEMO_USERS, 
  DEMO_PASSWORD, 
  validateCredentials, 
  findUserByEmail, 
  getUsersByRole 
} from '@/data/demoUsers'
import { UserRole } from '@/types/auth'

describe('Demo Users Database', () => {
  describe('DEMO_USERS constant', () => {
    it('should have 6 demo users', () => {
      expect(DEMO_USERS).toHaveLength(6)
    })

    it('should include Brian Guvava as Administrator', () => {
      const brian = DEMO_USERS.find(u => u.email === 'brian.guvava@seczim.co.zw')
      
      expect(brian).toBeDefined()
      expect(brian?.firstName).toBe('Brian')
      expect(brian?.lastName).toBe('Guvava')
      expect(brian?.role).toBe(UserRole.ADMINISTRATOR)
    })

    it('should include Samkheliso Dube as Supervisor', () => {
      const sam = DEMO_USERS.find(u => u.email === 'samkheliso.dube@seczim.co.zw')
      
      expect(sam).toBeDefined()
      expect(sam?.firstName).toBe('Samkheliso')
      expect(sam?.lastName).toBe('Dube')
      expect(sam?.role).toBe(UserRole.SUPERVISOR)
    })

    it('should include Makanaka Elara as Entity', () => {
      const makanaka = DEMO_USERS.find(u => u.email === 'makanaka.elara@capitalmarkets.co.zw')
      
      expect(makanaka).toBeDefined()
      expect(makanaka?.firstName).toBe('Makanaka')
      expect(makanaka?.lastName).toBe('Elara')
      expect(makanaka?.role).toBe(UserRole.ENTITY)
    })

    it('should have at least 2 users per role', () => {
      const admins = DEMO_USERS.filter(u => u.role === UserRole.ADMINISTRATOR)
      const supervisors = DEMO_USERS.filter(u => u.role === UserRole.SUPERVISOR)
      const entities = DEMO_USERS.filter(u => u.role === UserRole.ENTITY)

      expect(admins.length).toBeGreaterThanOrEqual(2)
      expect(supervisors.length).toBeGreaterThanOrEqual(2)
      expect(entities.length).toBeGreaterThanOrEqual(2)
    })

    it('should have all users active by default', () => {
      const allActive = DEMO_USERS.every(u => u.isActive === true)
      expect(allActive).toBe(true)
    })

    it('should have unique email addresses', () => {
      const emails = DEMO_USERS.map(u => u.email)
      const uniqueEmails = new Set(emails)
      
      expect(uniqueEmails.size).toBe(DEMO_USERS.length)
    })

    it('should have unique IDs', () => {
      const ids = DEMO_USERS.map(u => u.id)
      const uniqueIds = new Set(ids)
      
      expect(uniqueIds.size).toBe(DEMO_USERS.length)
    })

    it('should have valid required fields for all users', () => {
      DEMO_USERS.forEach(user => {
        expect(user.id).toBeDefined()
        expect(user.email).toBeDefined()
        expect(user.firstName).toBeDefined()
        expect(user.lastName).toBeDefined()
        expect(user.role).toBeDefined()
        expect(user.organization).toBeDefined()
        expect(user.isActive).toBeDefined()
        expect(user.createdAt).toBeDefined()
        expect(user.lastLogin).toBeDefined()
        expect(user.password).toBe(DEMO_PASSWORD)
      })
    })
  })

  describe('DEMO_PASSWORD constant', () => {
    it('should be defined', () => {
      expect(DEMO_PASSWORD).toBeDefined()
    })

    it('should be AMLGuard2025!', () => {
      expect(DEMO_PASSWORD).toBe('AMLGuard2025!')
    })

    it('should meet password strength requirements', () => {
      expect(DEMO_PASSWORD.length).toBeGreaterThanOrEqual(8)
      expect(DEMO_PASSWORD).toMatch(/[A-Z]/) // Uppercase
      expect(DEMO_PASSWORD).toMatch(/[a-z]/) // Lowercase
      expect(DEMO_PASSWORD).toMatch(/[0-9]/) // Number
      expect(DEMO_PASSWORD).toMatch(/[!@#$%^&*]/) // Special char
    })
  })

  describe('validateCredentials', () => {
    it('should validate correct credentials for administrator', () => {
      const user = validateCredentials('brian.guvava@seczim.co.zw', DEMO_PASSWORD)
      
      expect(user).toBeDefined()
      expect(user?.email).toBe('brian.guvava@seczim.co.zw')
      expect(user?.role).toBe(UserRole.ADMINISTRATOR)
    })

    it('should validate correct credentials for supervisor', () => {
      const user = validateCredentials('samkheliso.dube@seczim.co.zw', DEMO_PASSWORD)
      
      expect(user).toBeDefined()
      expect(user?.email).toBe('samkheliso.dube@seczim.co.zw')
      expect(user?.role).toBe(UserRole.SUPERVISOR)
    })

    it('should validate correct credentials for entity', () => {
      const user = validateCredentials('makanaka.elara@capitalmarkets.co.zw', DEMO_PASSWORD)
      
      expect(user).toBeDefined()
      expect(user?.email).toBe('makanaka.elara@capitalmarkets.co.zw')
      expect(user?.role).toBe(UserRole.ENTITY)
    })

    it('should return null for incorrect email', () => {
      const user = validateCredentials('nonexistent@example.com', DEMO_PASSWORD)
      expect(user).toBeNull()
    })

    it('should return null for incorrect password', () => {
      const user = validateCredentials('brian.guvava@seczim.co.zw', 'WrongPassword!')
      expect(user).toBeNull()
    })

    it('should be case-insensitive for email', () => {
      const user = validateCredentials('BRIAN.GUVAVA@SECZIM.CO.ZW', DEMO_PASSWORD)
      
      expect(user).toBeDefined()
      expect(user?.email).toBe('brian.guvava@seczim.co.zw')
    })

    it('should be case-sensitive for password', () => {
      const user = validateCredentials('brian.guvava@seczim.co.zw', 'amlguard2025!')
      expect(user).toBeNull()
    })

    it('should handle empty email', () => {
      const user = validateCredentials('', DEMO_PASSWORD)
      expect(user).toBeNull()
    })

    it('should handle empty password', () => {
      const user = validateCredentials('brian.guvava@seczim.co.zw', '')
      expect(user).toBeNull()
    })

    it('should not return password in user object', () => {
      const user = validateCredentials('brian.guvava@seczim.co.zw', DEMO_PASSWORD)
      
      expect(user).toBeDefined()
      expect(user).not.toHaveProperty('password')
    })
  })

  describe('findUserByEmail', () => {
    it('should find user by exact email', () => {
      const user = findUserByEmail('brian.guvava@seczim.co.zw')
      
      expect(user).toBeDefined()
      expect(user?.firstName).toBe('Brian')
      expect(user?.lastName).toBe('Guvava')
    })

    it('should be case-insensitive', () => {
      const user = findUserByEmail('BRIAN.GUVAVA@SECZIM.CO.ZW')
      
      expect(user).toBeDefined()
      expect(user?.email).toBe('brian.guvava@seczim.co.zw')
    })

    it('should return null for non-existent email', () => {
      const user = findUserByEmail('nonexistent@example.com')
      expect(user).toBeNull()
    })

    it('should return null for empty email', () => {
      const user = findUserByEmail('')
      expect(user).toBeNull()
    })

    it('should find all 6 users by their emails', () => {
      const emails = [
        'brian.guvava@seczim.co.zw',
        'samkheliso.dube@seczim.co.zw',
        'makanaka.elara@capitalmarkets.co.zw',
        'admin@seczim.co.zw',
        'supervisor@seczim.co.zw',
        'entity@investmentfirm.co.zw'
      ]

      emails.forEach(email => {
        const user = findUserByEmail(email)
        expect(user).toBeDefined()
        expect(user?.email).toBe(email)
      })
    })

    it('should not return password in user object', () => {
      const user = findUserByEmail('brian.guvava@seczim.co.zw')
      
      expect(user).toBeDefined()
      expect(user).not.toHaveProperty('password')
    })
  })

  describe('getUsersByRole', () => {
    it('should return all administrators', () => {
      const admins = getUsersByRole(UserRole.ADMINISTRATOR)
      
      expect(admins.length).toBeGreaterThanOrEqual(2)
      admins.forEach(user => {
        expect(user.role).toBe(UserRole.ADMINISTRATOR)
      })
    })

    it('should return all supervisors', () => {
      const supervisors = getUsersByRole(UserRole.SUPERVISOR)
      
      expect(supervisors.length).toBeGreaterThanOrEqual(2)
      supervisors.forEach(user => {
        expect(user.role).toBe(UserRole.SUPERVISOR)
      })
    })

    it('should return all entities', () => {
      const entities = getUsersByRole(UserRole.ENTITY)
      
      expect(entities.length).toBeGreaterThanOrEqual(2)
      entities.forEach(user => {
        expect(user.role).toBe(UserRole.ENTITY)
      })
    })

    it('should return empty array for invalid role', () => {
      const users = getUsersByRole('INVALID_ROLE' as UserRole)
      expect(users).toEqual([])
    })

    it('should include Brian Guvava in administrators', () => {
      const admins = getUsersByRole(UserRole.ADMINISTRATOR)
      const brian = admins.find(u => u.email === 'brian.guvava@seczim.co.zw')
      
      expect(brian).toBeDefined()
    })

    it('should include Samkheliso Dube in supervisors', () => {
      const supervisors = getUsersByRole(UserRole.SUPERVISOR)
      const sam = supervisors.find(u => u.email === 'samkheliso.dube@seczim.co.zw')
      
      expect(sam).toBeDefined()
    })

    it('should include Makanaka Elara in entities', () => {
      const entities = getUsersByRole(UserRole.ENTITY)
      const makanaka = entities.find(u => u.email === 'makanaka.elara@capitalmarkets.co.zw')
      
      expect(makanaka).toBeDefined()
    })

    it('should not return passwords in user objects', () => {
      const admins = getUsersByRole(UserRole.ADMINISTRATOR)
      
      admins.forEach(user => {
        expect(user).not.toHaveProperty('password')
      })
    })

    it('should return all 6 users when combining all roles', () => {
      const admins = getUsersByRole(UserRole.ADMINISTRATOR)
      const supervisors = getUsersByRole(UserRole.SUPERVISOR)
      const entities = getUsersByRole(UserRole.ENTITY)
      
      const totalUsers = admins.length + supervisors.length + entities.length
      expect(totalUsers).toBe(6)
    })
  })

  describe('Data Integrity', () => {
    it('should have valid date formats for createdAt', () => {
      DEMO_USERS.forEach(user => {
        const date = new Date(user.createdAt)
        expect(date.toString()).not.toBe('Invalid Date')
      })
    })

    it('should have valid date formats for lastLogin', () => {
      DEMO_USERS.forEach(user => {
        const date = new Date(user.lastLogin)
        expect(date.toString()).not.toBe('Invalid Date')
      })
    })

    it('should have SECZim organization for administrators and supervisors', () => {
      const seczimUsers = DEMO_USERS.filter(
        u => u.role === UserRole.ADMINISTRATOR || u.role === UserRole.SUPERVISOR
      )

      seczimUsers.forEach(user => {
        expect(user.organization).toContain('SECZim')
      })
    })

    it('should have different organizations for entity users', () => {
      const entities = getUsersByRole(UserRole.ENTITY)
      const organizations = entities.map(e => e.organization)
      const uniqueOrgs = new Set(organizations)
      
      // Entities should have diverse organizations
      expect(uniqueOrgs.size).toBeGreaterThan(1)
    })

    it('should have phone numbers in valid format if present', () => {
      DEMO_USERS.forEach(user => {
        if (user.phone) {
          // Should start with + and contain only digits and spaces
          expect(user.phone).toMatch(/^\+?[\d\s-]+$/)
        }
      })
    })
  })
})
