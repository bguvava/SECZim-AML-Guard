# Profile Module Documentation

## Overview

The Profile module provides comprehensive user profile management functionality for the AMLGuard system. It enables users to manage their personal information, security settings, notification preferences, active sessions, and view their activity history.

### Key Features

- **Profile Management**: Update personal information, contact details, and address
- **Avatar Management**: Upload, preview, and remove profile pictures
- **Password Security**: Change password with real-time strength validation
- **Two-Factor Authentication**: Enable/disable 2FA with TOTP, SMS, or Email methods
- **Notification Preferences**: Configure 4 channels with 14 granular sub-options
- **Session Management**: View and revoke active sessions across devices
- **Activity Logging**: View, filter, and export complete activity history

### Module Structure

```
src/
├── types/
│   └── profile.ts                    # TypeScript interfaces (40+ types)
├── components/profile/
│   ├── ProfileHeader.vue             # Avatar & verification badges
│   ├── ProfileForm.vue               # Personal information form
│   ├── PasswordChange.vue            # Password change with strength indicator
│   ├── NotificationPreferences.vue   # 4-channel notification settings
│   ├── SessionManagement.vue         # Active session tracking
│   ├── TwoFactorAuth.vue            # 2FA setup and management
│   └── ActivityLog.vue              # Activity history with filtering
├── views/
│   └── ProfileView.vue              # Main profile page (5 tabs)
├── composables/
│   └── useProfile.ts                # State management & API layer
tests/profile/
├── ProfileHeader.spec.ts            # 60 tests
├── ProfileForm.spec.ts              # 55 tests
├── PasswordChange.spec.ts           # 60 tests
├── NotificationPreferences.spec.ts  # 35 tests
├── SessionManagement.spec.ts        # 30 tests
├── TwoFactorAuth.spec.ts           # 40 tests
└── ActivityLog.spec.ts             # 45 tests
tests/views/
└── ProfileView.spec.ts             # 30 integration tests
```

## Technology Stack

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Framework** | Vue 3 Composition API | Component architecture |
| **Language** | TypeScript | Type safety and autocomplete |
| **Form Validation** | VeeValidate 4 + Zod | Declarative validation |
| **Icons** | lucide-vue-next | Consistent iconography |
| **State Management** | Vue Composition API (refs) | Reactive state |
| **Testing** | Vitest + @vue/test-utils | Unit & integration tests |

## Quick Start

### Installation

The Profile module is part of the main AMLGuard application. All dependencies are included in the project:

```bash
pnpm install
```

### Basic Usage

```vue
<script setup lang="ts">
import ProfileView from '@/views/ProfileView.vue'
</script>

<template>
  <ProfileView />
</template>
```

### Router Integration

Add the profile route to your Vue Router configuration:

```typescript
import { createRouter, createMemoryHistory } from 'vue-router'
import ProfileView from '@/views/ProfileView.vue'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: { requiresAuth: true }
    }
  ]
})
```

### Accessing Profile Tabs

Navigate to specific tabs using query parameters:

```typescript
// Navigate to Security tab
router.push({ path: '/profile', query: { tab: 'security' } })

// Navigate to Activity Log
router.push({ path: '/profile', query: { tab: 'activity' } })
```

**Available tabs:**
- `profile` - Profile Info (default)
- `security` - Security Settings
- `notifications` - Notification Preferences
- `sessions` - Active Sessions
- `activity` - Activity Log

## Architecture

### Component Hierarchy

```
ProfileView (Main Container)
│
├── Tab Navigation (Desktop Sidebar + Mobile Horizontal)
│
├── Profile Tab
│   ├── ProfileHeader (Avatar + Badges)
│   └── ProfileForm (Personal Info)
│
├── Security Tab
│   ├── PasswordChange (Password Settings)
│   └── TwoFactorAuth (2FA Management)
│
├── Notifications Tab
│   └── NotificationPreferences (4 Channels)
│
├── Sessions Tab
│   └── SessionManagement (Device Tracking)
│
└── Activity Tab
    └── ActivityLog (History + Filtering)
```

### Data Flow

1. **ProfileView** acts as the main container and orchestrates data flow
2. **useProfile composable** (optional) provides centralized state management and API calls
3. Components emit events to parent (ProfileView) for processing
4. ProfileView handles API calls and updates component props
5. Loading states managed at ProfileView level and passed down

### Event-Driven Communication

All profile components follow a consistent event-driven pattern:

```typescript
// Component emits event with data
emit('submit', formData)
emit('uploadAvatar', file)
emit('enable', '2fa-method')

// Parent (ProfileView) handles events
<ProfileForm @submit="handleUpdateProfile" />
<ProfileHeader @uploadAvatar="handleUploadAvatar" />
<TwoFactorAuth @enable="handleEnable2FA" />
```

## Core Components

### 1. ProfileHeader
Displays user avatar, role badge, verification status, and last login information.

**Features:**
- Avatar upload with preview (5MB limit, JPEG/PNG/GIF)
- Avatar removal with confirmation
- Role badges (Admin/Supervisor/Entity)
- Verification indicators (Email, Phone, 2FA)
- Last login timestamp

### 2. ProfileForm
Form for editing personal information with comprehensive validation.

**Features:**
- Personal info (first name, last name)
- Contact details (email, phone)
- Address fields (street, city, state, postal code, country)
- Date of birth with age validation (18-120 years)
- Real-time validation with Zod schemas

### 3. PasswordChange
Password change form with real-time strength calculation.

**Features:**
- Current password verification
- New password with strength indicator (0-4 scale)
- 5 requirement checklist (length, uppercase, lowercase, number, special char)
- Password confirmation matching
- Security suggestions

### 4. NotificationPreferences
Granular notification settings across 4 channels.

**Features:**
- Email (6 sub-options)
- SMS (3 sub-options)
- Push (3 sub-options)
- In-App (2 sub-options)
- Dirty state tracking
- Reset to defaults

### 5. SessionManagement
View and manage active sessions across devices.

**Features:**
- Current session highlighting
- Device type icons (Desktop/Mobile/Tablet)
- Location information (City, Region, Country)
- Last activity timestamps
- Revoke individual sessions
- Revoke all other sessions

### 6. TwoFactorAuth
Setup and manage two-factor authentication.

**Features:**
- 3 methods: TOTP (Authenticator App), SMS, Email
- QR code display for TOTP setup
- Manual secret entry option
- Backup codes generation (10 codes)
- Copy/download backup codes
- Disable with password confirmation

### 7. ActivityLog
View and export complete activity history.

**Features:**
- Debounced search (500ms)
- Multi-filter: category, action, status, date range
- Pagination (10/25/50 per page)
- Export formats: CSV, JSON, PDF
- Color-coded status indicators
- Category icons

## Module Statistics

| Metric | Count |
|--------|-------|
| **Components** | 7 profile widgets + 1 view |
| **TypeScript Interfaces** | 40+ types |
| **Lines of Code** | ~4,800 (production) |
| **Test Suites** | 8 files |
| **Total Tests** | ~310 tests |
| **Test Lines** | ~5,250 lines |
| **Test Coverage** | Comprehensive (all scenarios) |
| **Documentation Files** | 7 files |

## Related Documentation

- **[COMPONENTS.md](./COMPONENTS.md)** - Detailed component API reference
- **[TYPES.md](./TYPES.md)** - Complete TypeScript type system
- **[VALIDATION.md](./VALIDATION.md)** - Validation patterns and schemas
- **[STATE_MANAGEMENT.md](./STATE_MANAGEMENT.md)** - useProfile composable guide
- **[TESTING.md](./TESTING.md)** - Testing strategies and examples
- **[SECURITY.md](./SECURITY.md)** - Security best practices

## Development

### Running Tests

```bash
# Run all profile tests
pnpm test profile

# Run specific test file
pnpm test ProfileHeader.spec.ts

# Run with coverage
pnpm test:coverage

# Watch mode
pnpm test --watch
```

### Type Checking

```bash
# Check TypeScript types
pnpm exec vue-tsc --noEmit
```

### Development Server

```bash
# Start dev server
pnpm dev

# Navigate to http://localhost:5173/profile
```

## Best Practices

### 1. Always Use TypeScript Types
```typescript
import type { UserProfile, ProfileFormData } from '@/types/profile'

const profile = ref<UserProfile>({...})
const handleSubmit = (data: ProfileFormData) => {...}
```

### 2. Handle Loading States
```typescript
const loading = ref(false)

const handleUpdate = async (data: ProfileFormData) => {
  loading.value = true
  try {
    await updateProfile(data)
  } finally {
    loading.value = false
  }
}
```

### 3. Validate Before Submission
```typescript
// Use VeeValidate + Zod
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { profileFormSchema } from '@/schemas/profile'

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(profileFormSchema)
})
```

### 4. Show User Feedback
```typescript
import { useToast } from 'vue-toastification'

const toast = useToast()

const handleSuccess = () => {
  toast.success('Profile updated successfully!')
}
```

## Support

For issues, questions, or contributions:
- **GitHub Issues**: [Project Issues](https://github.com/your-repo/issues)
- **Documentation**: [Full Module Docs](./COMPONENTS.md)
- **Developer**: bguvava ([Portfolio](https://bguvava.github.io/portfolio/))

## License

Part of the AMLGuard system developed for SECZim - AML Unit.

---

**Next Steps:**
1. Read [COMPONENTS.md](./COMPONENTS.md) for detailed component APIs
2. Review [TYPES.md](./TYPES.md) for type definitions
3. Check [TESTING.md](./TESTING.md) for testing examples
