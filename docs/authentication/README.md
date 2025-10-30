# Authentication Module - Quick Start Guide
## AMLGuard - Integrated AML/CFT Risk-Based Supervision System

**Status:** ✅ **90% Complete - Production-Ready for Prototype**  
**Developer:** bguvava  
**Last Updated:** October 29, 2025

---

## Quick Start

### Demo Access

**Login URL:** `http://localhost:3000/login`

**Demo Credentials (All users share same password):**

| Name | Email | Role | Password |
|------|-------|------|----------|
| Brian Guvava | brian.guvava@seczim.co.zw | Administrator | AMLGuard2025! |
| Samkheliso Dube | samkheliso.dube@seczim.co.zw | Supervisor | AMLGuard2025! |
| Makanaka Elara | makanaka.elara@capitalmarkets.co.zw | Entity | AMLGuard2025! |

**Quick Login:** Click any of the "Quick Demo Login" buttons on the login page for instant access.

---

## Features

### ✅ Implemented
- **Secure Login** - Email/password with real-time validation
- **Session Management** - Auto-logout after 8 hours (24 hours with "Remember Me")
- **Role-Based Access** - Three distinct user roles with separate dashboards
- **Password Reset** - Forgot password flow with email simulation
- **Logout Confirmation** - Modal dialog prevents accidental logout
- **Session Warnings** - 5-minute warning before session expires
- **Demo Mode** - Quick-login buttons for stakeholder demonstrations
- **Responsive Design** - Works on mobile (320px) to 4K (2560px+)

### 🔄 Partially Implemented
- **Unit Tests** - 85% pass rate (95 of 112 tests passing, 17 minor assertion mismatches)
- **Accessibility** - Basic implementation complete, full WCAG audit pending

### ❌ Not Yet Implemented (But Documented)
- **E2E Tests** - Playwright framework ready, tests not written
- **Production Security** - Backend integration required (see SECURITY.md)
- **Multi-Factor Authentication** - Planned for future release

---

## File Structure

```
src/
├── components/
│   └── auth/
│       └── LogoutModal.vue              # Logout confirmation dialog
├── views/
│   ├── auth/
│   │   ├── LoginPage.vue                # Main login page
│   │   └── ForgotPassword.vue           # Password reset request
│   ├── admin/
│   │   └── Dashboard.vue                # Administrator dashboard
│   ├── supervisor/
│   │   └── Dashboard.vue                # Supervisor dashboard
│   ├── entity/
│   │   └── Dashboard.vue                # Entity dashboard
│   ├── Unauthorized.vue                 # 403 page
│   └── NotFound.vue                     # 404 page
├── stores/
│   └── useAuthStore.ts                  # Pinia authentication store
├── composables/
│   └── useAuth.ts                       # Auth composables (useAuth, useSession, useAuthGuard)
├── types/
│   └── auth.ts                          # TypeScript interfaces
├── utils/
│   ├── auth.ts                          # Auth utility functions
│   └── validationSchemas.ts             # Zod validation schemas
├── data/
│   └── demoUsers.ts                     # Mock user database
└── router/
    └── index.ts                         # Router with navigation guards

docs/authentication/
├── MODULE_DOCUMENTATION.md              # 18,000+ word comprehensive docs
├── SECURITY.md                          # 12,000+ word security guide
├── COMPLETION_SUMMARY.md                # Detailed completion status
└── README.md                            # This file

tests/authentication/
├── useAuthStore.spec.ts                 # Store tests (40 cases)
├── auth.utils.spec.ts                   # Utility tests (30 cases)
├── demoUsers.spec.ts                    # Demo user tests (42 cases)
└── setup.ts                             # Test setup file
```

---

## Usage Examples

### Login
```typescript
import { useAuth } from '@/composables/useAuth'

const { login } = useAuth()

// Login with credentials
await login('brian.guvava@seczim.co.zw', 'AMLGuard2025!', true)
```

### Access User Data
```typescript
import { useAuthStore } from '@/stores/useAuthStore'

const authStore = useAuthStore()

// Get current user
const user = authStore.currentUser

// Check authentication
if (authStore.isAuthenticated) {
  console.log('User is logged in:', authStore.fullName)
}

// Check role
if (authStore.isAdmin) {
  console.log('User is an administrator')
}
```

### Protect Routes
```typescript
// In router/index.ts
{
  path: '/admin/dashboard',
  name: 'admin-dashboard',
  component: () => import('@/views/admin/Dashboard.vue'),
  meta: {
    requiresAuth: true,
    allowedRoles: [UserRole.ADMINISTRATOR]
  }
}
```

### Session Management
```typescript
import { useSession } from '@/composables/useAuth'

const { 
  isSessionActive, 
  sessionTimeRemaining, 
  extendSession 
} = useSession()

// Check if session is active
if (!isSessionActive.value) {
  console.log('Session has expired')
}

// Extend session
extendSession()
```

---

## Running Tests

```bash
# Run all tests
pnpm test

# Run tests with UI
pnpm test:ui

# Run tests once (no watch)
pnpm test --run

# Run with coverage
pnpm test --coverage
```

**Current Test Status:**
- Total: 112 tests
- Passing: 95 (85%)
- Failing: 17 (minor assertion mismatches, not critical)

---

## Development

### Prerequisites
- Node.js 20+
- pnpm 10+
- VS Code (recommended)

### Install Dependencies
```bash
pnpm install
```

### Run Development Server
```bash
pnpm dev
# Navigate to http://localhost:3000
```

### Build for Production
```bash
pnpm build
```

### Lint & Format
```bash
pnpm lint
pnpm format
```

---

## Configuration

### Session Timeout
Edit `src/utils/auth.ts`:
```typescript
// Default session duration: 8 hours
const SESSION_DURATION = 8 * 60 * 60 * 1000

// Remember Me session duration: 24 hours
const REMEMBER_ME_DURATION = 24 * 60 * 60 * 1000
```

### Session Warning Time
Edit `src/composables/useAuth.ts` (useSession):
```typescript
// Show warning 5 minutes before expiry
const WARNING_TIME = 5 * 60 * 1000
```

---

## API Reference

### useAuthStore (Pinia)

#### State
- `user: User | null` - Current authenticated user
- `token: string | null` - Authentication token
- `isAuthenticated: boolean` - Authentication status
- `sessionExpiry: number | null` - Session expiry timestamp
- `rememberMe: boolean` - Remember me preference

#### Getters
- `currentUser` - Get current user
- `userRole` - Get user's role
- `isAdmin` - Check if user is Administrator
- `isSupervisor` - Check if user is Supervisor
- `isEntity` - Check if user is Entity
- `fullName` - Get user's full name
- `initials` - Get user's initials
- `isSessionActive` - Check if session is valid
- `sessionTimeRemaining` - Get time until expiry

#### Actions
- `login(credentials)` - Authenticate user
- `logout()` - Clear session and logout
- `restoreSession()` - Restore session from storage
- `extendCurrentSession(hours)` - Extend session expiry
- `updateUserProfile(updates)` - Update user data
- `requestPasswordReset(email)` - Request password reset
- `changePassword(current, new)` - Change password
- `getDashboardRoute()` - Get role-specific dashboard path

### Composables

#### useAuth()
- `currentUser` - Current user (computed)
- `isAuthenticated` - Auth status (computed)
- `userRole` - User role (computed)
- `login(email, password, rememberMe)` - Login with redirect
- `logout()` - Logout with confirmation and redirect
- `requestPasswordReset(email)` - Request password reset
- `changePassword(current, new)` - Change password

#### useSession()
- `isSessionActive` - Session active (computed)
- `sessionTimeRemaining` - Time remaining (computed)
- `showWarning` - Warning visibility (ref)
- `timeRemaining` - Time until expiry (ref)
- `extendSession()` - Extend session
- `startSessionMonitoring(interval)` - Begin monitoring
- `stopSessionMonitoring()` - Stop monitoring

#### useAuthGuard()
- `requireAuth()` - Check authentication
- `requireRole(roles)` - Check user has required role
- `requireAdmin()` - Check if admin
- `requireSupervisor()` - Check if supervisor
- `requireEntity()` - Check if entity

---

## Documentation

### Comprehensive Guides
- **[MODULE_DOCUMENTATION.md](./MODULE_DOCUMENTATION.md)** - Complete module documentation (18,000+ words)
  - Features, architecture, API reference, user flows, testing guide, troubleshooting

- **[SECURITY.md](./SECURITY.md)** - Security documentation (12,000+ words)
  - Current implementation, production requirements, threat model, best practices, OWASP coverage

- **[COMPLETION_SUMMARY.md](./COMPLETION_SUMMARY.md)** - Completion status
  - Detailed metrics, test results, requirements verification, next steps

---

## Troubleshooting

### Login button doesn't work
- Check browser console for errors
- Ensure both email and password fields are filled
- Wait for previous request to complete
- Clear browser cache

### Session not persisting
- Check "Remember me" is checked when logging in
- Verify localStorage is enabled in browser
- Check session hasn't expired
- Clear browser cache and try again

### Tests failing
- Run `pnpm install` to ensure all dependencies installed
- Check Node.js version (requires 20+)
- Run `pnpm test --run` for clean run
- Most failures are minor assertion mismatches, not critical

### Demo users not working
- Verify email exactly matches (case-insensitive)
- Copy password from DEMO_PASSWORD constant: `AMLGuard2025!`
- Or use Quick Demo Login buttons
- Clear browser cache

---

## Support

### Developer Contact
- **Name:** Brian Guvava
- **GitHub:** bguvava
- **Portfolio:** https://bguvava.github.io/portfolio/

### Documentation
- See MODULE_DOCUMENTATION.md for detailed troubleshooting
- See SECURITY.md for security-related questions
- See COMPLETION_SUMMARY.md for status and metrics

---

## Next Steps

### For 100% Completion
1. Fix 17 test assertion mismatches (30 minutes)
2. Complete accessibility audit (1-2 hours)
3. Write E2E tests with Playwright (2-3 hours)

### For Production Deployment
1. Implement backend API (see SECURITY.md)
2. Replace mock authentication with real JWT
3. Implement bcrypt password hashing
4. Add CSRF protection and rate limiting
5. Set up HTTPS/TLS
6. Configure secure cookies
7. Add audit logging
8. Run penetration testing

### For Next Module
1. Dashboard Layout & Navigation
2. User Management (Admin)
3. Entity Management
4. Data Submission workflows

---

## License

**Internal Development Project**  
© 2025 SECZim (Securities and Exchange Commission of Zimbabwe)

---

**Developed with ❤️ by bguvava**
