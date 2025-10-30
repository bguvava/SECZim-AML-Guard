# Testing Guide

Comprehensive testing strategies for the Profile module.

## Overview

The Profile module has **~310 tests** across 8 test files with complete coverage of all components and integration scenarios.

### Test Stack

- **Vitest**: Test runner
- **@vue/test-utils**: Vue component testing
- **vi.fn()**: Mocking functions
- **vi.spyOn()**: Spying on methods

## Running Tests

```bash
# Run all tests
pnpm test

# Run profile tests only
pnpm test profile

# Run specific test file
pnpm test ProfileHeader.spec.ts

# Watch mode
pnpm test --watch

# Coverage report
pnpm test:coverage
```

## Test File Structure

Each test file follows this pattern:

```typescript
describe('ComponentName', () => {
  let wrapper: VueWrapper
  
  beforeEach(() => {
    vi.clearAllMocks()
  })
  
  describe('Feature Group 1', () => {
    it('should test specific behavior', () => {
      // Arrange
      // Act
      // Assert
    })
  })
  
  describe('Feature Group 2', () => {
    // More tests
  })
})
```

## Component Testing Examples

### ProfileHeader

```typescript
import { mount } from '@vue/test-utils'
import ProfileHeader from '@/components/profile/ProfileHeader.vue'

describe('ProfileHeader', () => {
  it('should display user avatar', () => {
    const wrapper = mount(ProfileHeader, {
      props: {
        profile: {
          avatar: 'https://example.com/avatar.jpg',
          firstName: 'John',
          lastName: 'Doe'
        }
      }
    })
    
    const avatar = wrapper.find('img[data-test="avatar-image"]')
    expect(avatar.exists()).toBe(true)
    expect(avatar.attributes('src')).toBe('https://example.com/avatar.jpg')
  })
  
  it('should emit uploadAvatar event', async () => {
    const wrapper = mount(ProfileHeader, {
      props: {
        profile: mockProfile
      }
    })
    
    const file = new File([''], 'avatar.jpg', { type: 'image/jpeg' })
    const input = wrapper.find('input[type="file"]')
    
    await input.trigger('change', { target: { files: [file] } })
    
    expect(wrapper.emitted('uploadAvatar')).toBeTruthy()
    expect(wrapper.emitted('uploadAvatar')?.[0]).toEqual([file])
  })
})
```

### ProfileForm

```typescript
describe('ProfileForm', () => {
  it('should validate required fields', async () => {
    const wrapper = mount(ProfileForm, {
      props: { profile: mockProfile }
    })
    
    const firstNameInput = wrapper.find('input[name="firstName"]')
    await firstNameInput.setValue('')
    await firstNameInput.trigger('blur')
    
    await nextTick()
    
    expect(wrapper.text()).toContain('First name is required')
  })
  
  it('should emit submit with valid data', async () => {
    const wrapper = mount(ProfileForm, {
      props: { profile: mockProfile }
    })
    
    await wrapper.find('input[name="firstName"]').setValue('John')
    await wrapper.find('input[name="lastName"]').setValue('Doe')
    await wrapper.find('input[name="email"]').setValue('john@example.com')
    
    await wrapper.find('form').trigger('submit')
    
    expect(wrapper.emitted('submit')).toBeTruthy()
    const emittedData = wrapper.emitted('submit')?.[0]?.[0]
    expect(emittedData).toMatchObject({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com'
    })
  })
})
```

### PasswordChange

```typescript
describe('PasswordChange', () => {
  it('should calculate password strength', async () => {
    const wrapper = mount(PasswordChange)
    
    const input = wrapper.find('input[name="newPassword"]')
    
    // Very Weak
    await input.setValue('abc')
    expect(wrapper.text()).toContain('Very Weak')
    
    // Strong
    await input.setValue('MyPassword123!')
    expect(wrapper.text()).toContain('Strong')
  })
  
  it('should show requirements checklist', async () => {
    const wrapper = mount(PasswordChange)
    
    const input = wrapper.find('input[name="newPassword"]')
    await input.setValue('Pass123!')
    await nextTick()
    
    expect(wrapper.find('[data-test="req-minLength"]').classes()).toContain('text-green-600')
    expect(wrapper.find('[data-test="req-hasUppercase"]').classes()).toContain('text-green-600')
    expect(wrapper.find('[data-test="req-hasLowercase"]').classes()).toContain('text-green-600')
    expect(wrapper.find('[data-test="req-hasNumber"]').classes()).toContain('text-green-600')
    expect(wrapper.find('[data-test="req-hasSpecial"]').classes()).toContain('text-green-600')
  })
})
```

## Integration Testing

### ProfileView

```typescript
import { createRouter, createMemoryHistory } from 'vue-router'
import ProfileView from '@/views/ProfileView.vue'

describe('ProfileView Integration', () => {
  let router: Router
  
  beforeEach(() => {
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/profile', component: ProfileView }
      ]
    })
  })
  
  it('should navigate between tabs', async () => {
    await router.push('/profile')
    await router.isReady()
    
    const wrapper = mount(ProfileView, {
      global: { plugins: [router] }
    })
    
    // Click Security tab
    const securityTab = wrapper.find('[data-test="tab-security"]')
    await securityTab.trigger('click')
    await nextTick()
    
    expect(router.currentRoute.value.query.tab).toBe('security')
    expect(wrapper.findComponent(PasswordChange).exists()).toBe(true)
  })
  
  it('should pass data to child components', async () => {
    await router.push('/profile')
    await router.isReady()
    
    const wrapper = mount(ProfileView, {
      global: { plugins: [router] }
    })
    
    const profileHeader = wrapper.findComponent(ProfileHeader)
    expect(profileHeader.props('profile')).toBeDefined()
    expect(profileHeader.props('profile').email).toBe('john.doe@example.com')
  })
})
```

## Mocking Strategies

### Mocking API Calls

```typescript
import { vi } from 'vitest'

const mockFetch = vi.fn()
global.fetch = mockFetch

describe('Profile API', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })
  
  it('should fetch profile data', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ profile: mockProfile })
    })
    
    const { fetchProfile, profile } = useProfile()
    await fetchProfile()
    
    expect(mockFetch).toHaveBeenCalledWith('/api/profile')
    expect(profile.value).toEqual(mockProfile)
  })
})
```

### Mocking Router

```typescript
const mockRouter = {
  push: vi.fn(),
  currentRoute: ref({ query: {} })
}

const wrapper = mount(Component, {
  global: {
    mocks: {
      $router: mockRouter
    }
  }
})
```

### Mocking Clipboard API

```typescript
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn()
  }
})

it('should copy to clipboard', async () => {
  const wrapper = mount(TwoFactorAuth, { props: { twoFactorAuth: mockData } })
  
  await wrapper.find('[data-test="copy-backup-codes"]').trigger('click')
  
  expect(navigator.clipboard.writeText).toHaveBeenCalled()
})
```

## Testing Patterns

### Testing Events

```typescript
it('should emit event with correct payload', async () => {
  const wrapper = mount(Component)
  
  await wrapper.find('button').trigger('click')
  
  expect(wrapper.emitted('eventName')).toBeTruthy()
  expect(wrapper.emitted('eventName')?.[0]).toEqual([expectedPayload])
})
```

### Testing Props

```typescript
it('should accept valid props', () => {
  expect(() => {
    mount(Component, {
      props: {
        profile: mockProfile,
        loading: false
      }
    })
  }).not.toThrow()
})

it('should react to prop changes', async () => {
  const wrapper = mount(Component, {
    props: { loading: false }
  })
  
  await wrapper.setProps({ loading: true })
  
  expect(wrapper.find('[data-test="spinner"]').exists()).toBe(true)
})
```

### Testing Computed Properties

```typescript
it('should compute full name', () => {
  const wrapper = mount(Component, {
    props: {
      profile: {
        firstName: 'John',
        lastName: 'Doe'
      }
    }
  })
  
  expect(wrapper.vm.fullName).toBe('John Doe')
})
```

### Testing Loading States

```typescript
it('should disable inputs when loading', async () => {
  const wrapper = mount(Component, {
    props: { loading: true }
  })
  
  const input = wrapper.find('input')
  expect(input.attributes('disabled')).toBeDefined()
  
  const button = wrapper.find('button[type="submit"]')
  expect(button.attributes('disabled')).toBeDefined()
})
```

## Test Coverage Report

```bash
pnpm test:coverage
```

### Expected Coverage

| Component | Tests | Coverage |
|-----------|-------|----------|
| ProfileHeader | 60 | 100% |
| ProfileForm | 55 | 100% |
| PasswordChange | 60 | 100% |
| NotificationPreferences | 35 | 100% |
| SessionManagement | 30 | 100% |
| TwoFactorAuth | 40 | 100% |
| ActivityLog | 45 | 100% |
| ProfileView | 30 | 100% |
| **Total** | **~310** | **100%** |

## Best Practices

1. **Test User Behavior**: Focus on what users do, not implementation
2. **Use data-test Attributes**: `<button data-test="submit-button">`
3. **Mock External Dependencies**: APIs, router, clipboard, etc.
4. **Test Edge Cases**: Empty states, errors, loading
5. **Keep Tests Isolated**: Each test should be independent
6. **Use Descriptive Names**: "should show error when email is invalid"
7. **Arrange-Act-Assert**: Clear test structure
8. **Avoid Implementation Details**: Test the interface, not internals

## Debugging Tests

```typescript
// Log component HTML
console.log(wrapper.html())

// Log component data
console.log(wrapper.vm.$data)

// Log emitted events
console.log(wrapper.emitted())

// Check if element exists
console.log(wrapper.find('[data-test="element"]').exists())
```

## Running Specific Tests

```bash
# Run only tests matching pattern
pnpm test -t "should validate email"

# Run single file
pnpm test ProfileForm.spec.ts

# Update snapshots
pnpm test -u
```

---

**Next:** See [SECURITY.md](./SECURITY.md) for security best practices.
