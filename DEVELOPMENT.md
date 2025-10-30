# Development Setup Guide

This guide will help you set up your development environment for working on the AMLGuard project.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 20+ LTS - [Download](https://nodejs.org/)
- **pnpm** 8+ - Install globally: `npm install -g pnpm`
- **Git** - [Download](https://git-scm.com/)
- **VS Code** (Recommended) - [Download](https://code.visualstudio.com/)

### Verify Installation

```bash
node --version      # Should be v20.0.0 or higher
pnpm --version      # Should be 8.0.0 or higher
git --version       # Should be 2.0 or higher
```

## Project Setup

### 1. Clone the Repository

```bash
git clone https://github.com/bguvava/SECZim-AML-Guard.git
cd SECZim-AML-Guard
```

### 2. Install Dependencies

```bash
pnpm install
```

This will install all dependencies listed in `package.json` and create `pnpm-lock.yaml`.

### 3. Verify Installation

```bash
pnpm dev
```

The development server should start at `http://localhost:5173` (or similar).

## Project Structure

```
SECZim-AML-Guard/
├── src/
│   ├── components/          # Vue components
│   │   ├── auth/           # Authentication components
│   │   ├── common/         # Shared components
│   │   ├── dashboard/      # Dashboard components
│   │   ├── entity/         # Entity management components
│   │   ├── layout/         # Layout components
│   │   └── profile/        # Profile components
│   ├── views/              # Page-level components
│   │   ├── admin/          # Admin pages
│   │   ├── auth/           # Auth pages
│   │   ├── entity/         # Entity pages
│   │   └── supervisor/     # Supervisor pages
│   ├── stores/             # Pinia state management
│   ├── composables/        # Vue composables (hooks)
│   ├── router/             # Vue Router configuration
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   ├── data/               # Mock data
│   ├── styles/             # Global styles
│   ├── App.vue             # Root component
│   └── main.ts             # Application entry point
├── tests/                  # Unit and integration tests
├── docs/                   # Project documentation
├── public/                 # Static assets
├── vite.config.ts          # Vite configuration
├── vitest.config.ts        # Vitest configuration
├── tsconfig.json           # TypeScript configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── package.json            # Project dependencies
└── README.md               # Project overview
```

## Available Commands

### Development

```bash
# Start development server
pnpm dev

# Start development server with UI
pnpm dev -- --host

# Preview production build
pnpm preview
```

### Building

```bash
# Build for production (with type checking)
pnpm build

# Build without type checking (faster)
pnpm build --force
```

### Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test -- --watch

# Run tests with UI
pnpm test:ui

# Generate coverage report
pnpm test -- --coverage
```

### Code Quality

```bash
# Lint and fix code
pnpm lint

# Format code with Prettier
pnpm format

# Type check only (without build)
vue-tsc --noEmit
```

## Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

See [CONTRIBUTING.md](./CONTRIBUTING.md#branch-naming-convention) for branch naming conventions.

### 2. Make Your Changes

- Edit files in `src/` directory
- The dev server will hot-reload your changes
- Check your changes in the browser

### 3. Write Tests

```bash
# Create test file with .spec.ts extension
# Example: src/components/MyComponent.spec.ts

pnpm test
```

### 4. Lint and Format

```bash
pnpm format
pnpm lint
```

### 5. Commit Your Changes

```bash
git add .
git commit -m "feat(scope): description of your changes"
```

Follow [Conventional Commits](./CONTRIBUTING.md#commit-message-format) format.

### 6. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub with a clear description of your changes.

## Working with Components

### Creating a New Component

```typescript
// src/components/MyComponent.vue
<script setup lang="ts">
interface Props {
  title: string;
  count?: number;
}

const props = withDefaults(defineProps<Props>(), {
  count: 0,
});

const emit = defineEmits<{
  click: [];
}>();
</script>

<template>
  <div class="my-component">
    <h1>{{ title }}</h1>
    <p>Count: {{ count }}</p>
    <button @click="emit('click')">Click me</button>
  </div>
</template>

<style scoped>
.my-component {
  @apply p-4 rounded-lg border border-gray-200;
}
</style>
```

### Testing a Component

```typescript
// src/components/MyComponent.spec.ts
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import MyComponent from './MyComponent.vue';

describe('MyComponent', () => {
  it('renders title prop', () => {
    const wrapper = mount(MyComponent, {
      props: {
        title: 'Test Title',
      },
    });
    expect(wrapper.text()).toContain('Test Title');
  });

  it('emits click event', async () => {
    const wrapper = mount(MyComponent, {
      props: {
        title: 'Test',
      },
    });
    await wrapper.find('button').trigger('click');
    expect(wrapper.emitted('click')).toBeTruthy();
  });
});
```

## Working with State Management (Pinia)

### Creating a Store

```typescript
// src/stores/myStore.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useMyStore = defineStore('my', () => {
  const count = ref(0);
  const doubled = computed(() => count.value * 2);

  function increment() {
    count.value++;
  }

  return { count, doubled, increment };
});
```

### Using a Store in a Component

```vue
<script setup lang="ts">
import { useMyStore } from '@/stores/myStore';

const store = useMyStore();
</script>

<template>
  <div>
    <p>Count: {{ store.count }}</p>
    <p>Doubled: {{ store.doubled }}</p>
    <button @click="store.increment">Increment</button>
  </div>
</template>
```

## Working with API Integration

### Mock Data (Development)

For development, use mock data from `/src/data/`:

```typescript
import { demoUsers } from '@/data/demoUsers';
import { entityMockData } from '@/data/entityMockData';
```

### Adding Real API Calls

When backend is ready, replace mock data with actual API calls using Axios:

```typescript
// src/services/api.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  timeout: 10000,
});

export const authAPI = {
  login: (credentials) => apiClient.post('/auth/login', credentials),
  logout: () => apiClient.post('/auth/logout'),
  refresh: () => apiClient.post('/auth/refresh'),
};

export default apiClient;
```

## IDE Setup

### VS Code Extensions (Recommended)

```
Volar (Vue Language Support)
TypeScript Vue Plugin
Tailwind CSS IntelliSense
ESLint
Prettier - Code formatter
Git Lens
```

### VS Code Settings

Add to `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[vue]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

## Debugging

### Browser DevTools

- Open DevTools: `F12` or Right-click → Inspect
- Use Vue DevTools extension (highly recommended)
- Check Network tab for API calls
- Check Console for errors

### Console Logging

```typescript
console.log('Debug info:', variable);
console.warn('Warning:', message);
console.error('Error:', error);
```

### VS Code Debugger

Add `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "vuejs: chrome",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}/src",
      "sourceMap": true
    }
  ]
}
```

## Common Issues

### Port Already in Use

```bash
# Kill process using port 5173
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5173
kill -9 <PID>
```

### Module Not Found

- Ensure import paths use `@/` alias (configured in `vite.config.ts`)
- Check file names and extensions match exactly
- Clear `node_modules` and reinstall: `rm -rf node_modules && pnpm install`

### Type Errors

```bash
# Run type checker
vue-tsc --noEmit

# Check for TypeScript errors
```

### Hot Reload Not Working

- Clear `.vite` cache
- Restart dev server
- Check file paths are correct

## Performance Tips

- Use `lazy` loading for routes
- Use `v-show` for frequently toggled elements
- Use `computed` properties for complex calculations
- Avoid inline functions in templates
- Use `key` binding in lists

## Security Best Practices

- Never commit `.env` files with real secrets
- Use environment variables for API URLs
- Validate user inputs
- Follow OWASP guidelines
- Keep dependencies updated

## Getting Help

1. Check [CONTRIBUTING.md](./CONTRIBUTING.md)
2. Search GitHub issues for similar problems
3. Ask team members on discussions
4. Refer to Vue/Pinia/Vite documentation

---

Happy coding! 🚀
