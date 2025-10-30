/**
 * Demo Users Database
 * Mock user data for prototype demonstration
 * Password for all users: AMLGuard2025!
 */

import type { DemoUser } from '@/types/auth'
import { UserRole } from '@/types/auth'

export const DEMO_USERS: DemoUser[] = [
  // Administrator
  {
    id: 'usr_001',
    email: 'brian.guvava@seczim.co.zw',
    password: 'AMLGuard2025!', // Same password for all demo users
    firstName: 'Brian',
    lastName: 'Guvava',
    role: UserRole.ADMINISTRATOR,
    organization: 'SECZim - IT Department',
    phone: '+263 242 752 836',
    avatar: 'https://ui-avatars.com/api/?name=Brian+Guvava&background=1976D2&color=fff',
    isActive: true,
    createdAt: '2024-01-15T08:00:00Z',
    lastLogin: '2025-10-29T10:30:00Z',
  },
  
  // Supervisor
  {
    id: 'usr_002',
    email: 'samkheliso.dube@seczim.co.zw',
    password: 'AMLGuard2025!',
    firstName: 'Samkheliso',
    lastName: 'Dube',
    role: UserRole.SUPERVISOR,
    organization: 'SECZim - AML Unit',
    phone: '+263 242 752 837',
    avatar: 'https://ui-avatars.com/api/?name=Samkheliso+Dube&background=00897B&color=fff',
    isActive: true,
    createdAt: '2024-02-10T08:00:00Z',
    lastLogin: '2025-10-28T14:45:00Z',
  },
  
  // Entity (SMI)
  {
    id: 'usr_003',
    email: 'makanaka.elara@capitalmarkets.co.zw',
    password: 'AMLGuard2025!',
    firstName: 'Makanaka',
    lastName: 'Elara',
    role: UserRole.ENTITY,
    organization: 'Capital Markets Securities Ltd',
    phone: '+263 242 701 234',
    avatar: 'https://ui-avatars.com/api/?name=Makanaka+Elara&background=43A047&color=fff',
    isActive: true,
    createdAt: '2024-03-05T08:00:00Z',
    lastLogin: '2025-10-27T09:15:00Z',
  },

  // Additional Administrator
  {
    id: 'usr_004',
    email: 'admin@seczim.co.zw',
    password: 'AMLGuard2025!',
    firstName: 'System',
    lastName: 'Administrator',
    role: UserRole.ADMINISTRATOR,
    organization: 'SECZim - Management',
    phone: '+263 242 752 835',
    avatar: 'https://ui-avatars.com/api/?name=System+Admin&background=E53935&color=fff',
    isActive: true,
    createdAt: '2024-01-01T08:00:00Z',
    lastLogin: '2025-10-29T07:00:00Z',
  },

  // Additional Supervisor
  {
    id: 'usr_005',
    email: 'supervisor@seczim.co.zw',
    password: 'AMLGuard2025!',
    firstName: 'AML',
    lastName: 'Supervisor',
    role: UserRole.SUPERVISOR,
    organization: 'SECZim - AML Unit',
    phone: '+263 242 752 838',
    avatar: 'https://ui-avatars.com/api/?name=AML+Supervisor&background=FB8C00&color=fff',
    isActive: true,
    createdAt: '2024-01-20T08:00:00Z',
    lastLogin: '2025-10-28T16:30:00Z',
  },

  // Additional Entity
  {
    id: 'usr_006',
    email: 'entity@investmentfirm.co.zw',
    password: 'AMLGuard2025!',
    firstName: 'Compliance',
    lastName: 'Officer',
    role: UserRole.ENTITY,
    organization: 'Premium Investment Managers',
    phone: '+263 242 701 567',
    avatar: 'https://ui-avatars.com/api/?name=Compliance+Officer&background=039BE5&color=fff',
    isActive: true,
    createdAt: '2024-04-12T08:00:00Z',
    lastLogin: '2025-10-26T11:20:00Z',
  },
]

/**
 * Find demo user by email
 * Note: Returns user without password field for security
 */
export function findUserByEmail(email: string): Omit<DemoUser, 'password'> | null {
  const user = DEMO_USERS.find((user) => user.email.toLowerCase() === email.toLowerCase())
  
  if (!user) {
    return null
  }
  
  // Remove password before returning
  const { password, ...userWithoutPassword } = user
  return userWithoutPassword
}

/**
 * Validate demo user credentials
 * Note: Returns user without password field for security
 */
export function validateCredentials(email: string, password: string): Omit<DemoUser, 'password'> | null {
  const fullUser = DEMO_USERS.find((user) => user.email.toLowerCase() === email.toLowerCase())
  
  if (!fullUser) {
    return null
  }
  
  // In prototype, all users have same password: AMLGuard2025!
  if (password !== fullUser.password) {
    return null
  }
  
  // Remove password before returning
  const { password: _, ...userWithoutPassword } = fullUser
  return userWithoutPassword
}

/**
 * Get users by role
 * Note: Returns users without password field for security
 */
export function getUsersByRole(role: UserRole): Omit<DemoUser, 'password'>[] {
  return DEMO_USERS
    .filter((user) => user.role === role)
    .map(({ password, ...userWithoutPassword }) => userWithoutPassword)
}

/**
 * Demo password for all users (for UI display purposes)
 */
export const DEMO_PASSWORD = 'AMLGuard2025!'
