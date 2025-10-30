# Dashboard Module Documentation

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Component API Reference](#component-api-reference)
4. [Type System](#type-system)
5. [Dashboard Views](#dashboard-views)
6. [Mock Data Service](#mock-data-service)
7. [Usage Examples](#usage-examples)
8. [Responsive Behavior](#responsive-behavior)
9. [Testing Guide](#testing-guide)
10. [Extending the Module](#extending-the-module)

---

## Overview

The Dashboard Module provides role-specific dashboard implementations for the SECZim AML Guard application. It includes reusable components for displaying KPIs, activities, alerts, tasks, and charts tailored to Administrator, Supervisor, and Entity user roles.

### Key Features

- **Role-Agnostic Components**: Reusable dashboard widgets adaptable to any role
- **Real-time Updates**: Support for data refresh and live updates
- **Responsive Design**: Mobile-first layout with adaptive grid systems
- **Type-Safe**: Comprehensive TypeScript interfaces for all data structures
- **Test Coverage**: 171 component tests with 100% pass rate
- **Accessible**: ARIA labels and keyboard navigation support

---

## Architecture

### Component Hierarchy

```
Dashboard Views (Role-Specific)
├── AdminDashboard
├── SupervisorDashboard
└── EntityDashboard
    ↓
Dashboard Components (Shared)
├── StatCard
├── ActivityFeed
├── QuickActions
├── AlertsWidget
├── TasksWidget
└── ChartCard
    ↓
Mock Data Service
└── generateAdminDashboardData()
    generateSupervisorDashboardData()
    generateEntityDashboardData()
```

### Data Flow

1. **View Layer**: Dashboard views request data based on user role
2. **Service Layer**: Mock data generators provide role-specific data
3. **Component Layer**: Reusable components render data with loading/empty states
4. **User Interaction**: Events bubble up from components to views for handling

---

## Component API Reference

### StatCard

Displays a single KPI metric with optional trend indicator.

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `stat` | `StatCard` | Yes | - | Stat data object |
| `loading` | `boolean` | No | `false` | Shows loading skeleton |

**StatCard Type:**

```typescript
interface StatCard {
  label: string           // Display label
  value: number | string  // Metric value
  icon?: string          // Icon name (optional)
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'indigo' | 'gray' | 'pink'
  subtitle?: string      // Additional context
  trend?: {
    direction: 'up' | 'down' | 'neutral'
    percentage?: number  // Change percentage
    type: 'positive' | 'negative' | 'neutral'  // Semantic meaning
  }
}
```

**Usage:**

```vue
<StatCard
  :stat="{
    label: 'Total Users',
    value: 1234,
    icon: 'Users',
    color: 'blue',
    trend: { direction: 'up', percentage: 12, type: 'positive' }
  }"
  :loading="false"
/>
```

---

### ActivityFeed

Displays a timeline of recent system activities with user avatars and icons.

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `activities` | `Activity[]` | Yes | - | Array of activity items |
| `maxItems` | `number` | No | `5` | Maximum items to display |
| `loading` | `boolean` | No | `false` | Shows loading skeleton |

**Activity Type:**

```typescript
interface Activity {
  id: string
  type: 'login' | 'logout' | 'create' | 'update' | 'delete' | 
        'submit' | 'approve' | 'reject' | 'review' | 'alert' | 'system'
  title: string
  description: string
  timestamp: string  // ISO 8601 format
  user: {
    name: string
    avatar?: string  // URL or empty for initials
  }
  icon?: Component  // Custom icon component
}
```

**Usage:**

```vue
<ActivityFeed
  :activities="recentActivities"
  :max-items="8"
  :loading="isLoading"
/>
```

---

### QuickActions

Grid of action buttons with badges and tooltips.

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `actions` | `QuickAction[]` | Yes | - | Array of action buttons |
| `columns` | `number` | No | `3` | Grid columns (1-6) |
| `loading` | `boolean` | No | `false` | Shows loading skeleton |

**QuickAction Type:**

```typescript
interface QuickAction {
  id: string
  label: string
  icon: string      // Icon name
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'indigo' | 'gray'
  badge?: string    // Badge text (e.g., "5 new")
  tooltip?: string
  disabled?: boolean
  action: () => void | Promise<void>
}
```

**Events:**

- None (actions are called directly via the `action` function)

**Usage:**

```vue
<QuickActions
  :actions="[
    {
      id: 'register',
      label: 'Register Entity',
      icon: 'UserPlus',
      color: 'blue',
      action: () => router.push('/entities/register')
    }
  ]"
  :columns="3"
/>
```

---

### AlertsWidget

Notification panel with priority-coded alerts and dismiss functionality.

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `alerts` | `Alert[]` | Yes | - | Array of alert items |
| `maxItems` | `number` | No | `5` | Maximum items to display |
| `loading` | `boolean` | No | `false` | Shows loading skeleton |
| `showDismiss` | `boolean` | No | `true` | Show dismiss buttons |

**Alert Type:**

```typescript
interface Alert {
  id: string
  title: string
  message: string
  priority: 'info' | 'success' | 'warning' | 'error' | 'critical'
  timestamp: string  // ISO 8601 format
  read?: boolean
  dismissible?: boolean  // Default: true
  icon?: Component      // Custom icon
  action?: {
    label: string
    handler: () => void
  }
}
```

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| `dismiss` | `alertId: string` | Fired when alert is dismissed |
| `action` | `alertId: string` | Fired when action button clicked |

**Usage:**

```vue
<AlertsWidget
  :alerts="systemAlerts"
  :max-items="5"
  :show-dismiss="true"
  @dismiss="handleDismiss"
  @action="handleAction"
/>
```

---

### TasksWidget

Task list with checkboxes, priorities, and due dates.

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `tasks` | `Task[]` | Yes | - | Array of task items |
| `maxItems` | `number` | No | `5` | Maximum items to display |
| `loading` | `boolean` | No | `false` | Shows loading skeleton |
| `showCheckbox` | `boolean` | No | `true` | Show completion checkboxes |

**Task Type:**

```typescript
interface Task {
  id: string
  title: string
  description?: string
  status: 'pending' | 'in-progress' | 'completed' | 'overdue'
  priority: 'low' | 'medium' | 'high' | 'critical'
  dueDate?: string  // ISO 8601 format
  completed?: boolean
  assignee?: {
    id: string
    name: string
    avatar?: string
  }
  action?: () => void
}
```

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| `toggle` | `taskId: string` | Fired when checkbox is clicked |
| `action` | `taskId: string` | Fired when task is clicked |

**Usage:**

```vue
<TasksWidget
  :tasks="pendingTasks"
  :max-items="5"
  :show-checkbox="true"
  @toggle="handleToggle"
  @action="handleTaskClick"
/>
```

---

### ChartCard

Wrapper component for chart visualizations with loading/empty states.

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `title` | `string` | Yes | - | Chart title |
| `subtitle` | `string` | No | - | Chart subtitle |
| `height` | `number` | No | `300` | Chart height in pixels |
| `loading` | `boolean` | No | `false` | Shows loading skeleton |
| `empty` | `boolean` | No | `false` | Shows empty state |
| `emptyMessage` | `string` | No | `'No data available'` | Empty state message |

**Slots:**

- **default**: Chart content (e.g., Chart.js component)

**Usage:**

```vue
<ChartCard
  title="Transaction Volume"
  subtitle="Last 30 days"
  :height="300"
  :loading="isLoading"
>
  <LineChart :data="chartData" />
</ChartCard>
```

---

## Type System

### Core Types Location

All dashboard types are defined in `src/types/dashboard.ts`.

### Complete Type Definitions

```typescript
// Stat Card
export interface StatCard {
  label: string
  value: number | string
  icon?: string
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'indigo' | 'gray' | 'pink'
  subtitle?: string
  trend?: {
    direction: 'up' | 'down' | 'neutral'
    percentage?: number
    type: 'positive' | 'negative' | 'neutral'
  }
}

// Activity
export type ActivityType = 'login' | 'logout' | 'create' | 'update' | 'delete' | 
                           'submit' | 'approve' | 'reject' | 'review' | 'alert' | 'system'

export interface Activity {
  id: string
  type: ActivityType
  title: string
  description: string
  timestamp: string
  user: {
    name: string
    avatar?: string
  }
  icon?: Component
}

// Alert
export type AlertPriority = 'info' | 'success' | 'warning' | 'error' | 'critical'

export interface Alert {
  id: string
  title: string
  message: string
  priority: AlertPriority
  timestamp: string
  read?: boolean
  dismissible?: boolean
  icon?: Component
  action?: {
    label: string
    handler: () => void
  }
}

// Task
export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'overdue'
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical'

export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  dueDate?: string
  completed?: boolean
  assignee?: {
    id: string
    name: string
    avatar?: string
  }
  action?: () => void
}

// Quick Action
export interface QuickAction {
  id: string
  label: string
  icon: string
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'indigo' | 'gray'
  badge?: string
  tooltip?: string
  disabled?: boolean
  action: () => void | Promise<void>
}

// Chart Configuration
export interface ChartConfig {
  id: string
  title: string
  subtitle?: string
  type?: 'line' | 'bar' | 'pie' | 'doughnut'
}

// Dashboard Data Aggregation
export interface DashboardData {
  stats: StatCard[]
  activities?: Activity[]
  alerts?: Alert[]
  tasks?: Task[]
  quickActions?: QuickAction[]
  charts?: ChartConfig[]
  systemStatus?: {
    uptime: string
    lastUpdate: string
    activeUsers: number
  }
}
```

---

## Dashboard Views

### Admin Dashboard

**Path**: `src/views/admin/Dashboard.vue`

**Features**:
- 6 StatCards: Total Entities, Total Transactions, Pending Reviews, Active Alerts, Compliance Rate, System Uptime
- 6 Quick Actions: Register Entity, Review Reports, Manage Users, Risk Assessment, System Settings, Generate Report
- Activity Feed: Last 8 activities
- Alerts Widget: 5 most recent alerts
- 2 Charts: Transaction Trends, Risk Distribution

**Usage**:

```vue
<template>
  <AdminLayout>
    <!-- Dashboard content -->
  </AdminLayout>
</template>
```

---

### Supervisor Dashboard

**Path**: `src/views/supervisor/Dashboard.vue`

**Features**:
- 4 StatCards: Assigned Entities, Pending Approvals, Recent Alerts, Completion Rate
- 3 Quick Actions: Review Submissions, Approve Transactions, Entity Reports
- Tasks Widget: Pending tasks
- Activity Feed: Last 6 activities
- 2 Charts: Entity Status, Approval Trends

---

### Entity Dashboard

**Path**: `src/views/entity/Dashboard.vue`

**Features**:
- 4 StatCards: Compliance Score, Pending Submissions, Total Transactions, Active Alerts
- 3 Quick Actions: Submit Report, View Transactions, Update Profile
- Alerts Widget: Important notifications
- Activity Feed: Last 5 activities
- 1 Chart: Compliance Score Trend

---

## Mock Data Service

**Location**: `src/data/dashboardMockData.ts`

### Available Functions

```typescript
// Generate complete admin dashboard data
export function generateAdminDashboardData(): DashboardData

// Generate complete supervisor dashboard data
export function generateSupervisorDashboardData(): DashboardData

// Generate complete entity dashboard data
export function generateEntityDashboardData(): DashboardData

// Generate quick actions for each role
export function generateAdminQuickActions(): QuickAction[]
export function generateSupervisorQuickActions(): QuickAction[]
export function generateEntityQuickActions(): QuickAction[]
```

### Data Generation Features

- **Realistic Timestamps**: Activities and alerts have varied timestamps
- **User Pools**: Randomized user names and entity names
- **Dynamic Values**: Stats and metrics change on each generation
- **Type Safety**: All generated data matches TypeScript interfaces

### Extending Mock Data

To add new data types:

```typescript
// 1. Define the type in src/types/dashboard.ts
export interface NewWidget {
  id: string
  // ... fields
}

// 2. Add generator in dashboardMockData.ts
function generateNewWidget(): NewWidget {
  return {
    id: `widget-${Date.now()}`,
    // ... data
  }
}

// 3. Include in dashboard data
export function generateAdminDashboardData(): DashboardData {
  return {
    // ... existing data
    newWidgets: [generateNewWidget()],
  }
}
```

---

## Usage Examples

### Basic Dashboard Implementation

```vue
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { generateAdminDashboardData } from '@/data/dashboardMockData'
import type { DashboardData } from '@/types/dashboard'

const loading = ref(true)
const dashboardData = ref<DashboardData | null>(null)

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
})

async function loadDashboard() {
  loading.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    dashboardData.value = generateAdminDashboardData()
  } finally {
    loading.value = false
  }
}

async function refreshDashboard() {
  await loadDashboard()
}

onMounted(() => {
  loadDashboard()
})
</script>

<template>
  <div>
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold">{{ greeting }}!</h1>
        <p class="text-gray-600">{{ new Date().toLocaleDateString() }}</p>
      </div>
      <button @click="refreshDashboard" :disabled="loading">
        Refresh
      </button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <StatCard
        v-for="stat in dashboardData?.stats || []"
        :key="stat.label"
        :stat="stat"
        :loading="loading"
      />
    </div>

    <!-- Quick Actions -->
    <QuickActions
      :actions="dashboardData?.quickActions || []"
      :loading="loading"
    />

    <!-- Two Column Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ActivityFeed
        :activities="dashboardData?.activities || []"
        :loading="loading"
      />
      <AlertsWidget
        :alerts="dashboardData?.alerts || []"
        :loading="loading"
      />
    </div>
  </div>
</template>
```

### Custom Stat Card Colors

```vue
<StatCard
  :stat="{
    label: 'High Risk Entities',
    value: 12,
    icon: 'AlertTriangle',
    color: 'red',  // Uses red color scheme
    trend: { direction: 'down', percentage: 8, type: 'positive' }
  }"
/>
```

### Handling Alert Actions

```vue
<script setup lang="ts">
function handleAlertDismiss(alertId: string) {
  console.log('Dismissed alert:', alertId)
  // API call to mark alert as read
}

function handleAlertAction(alertId: string) {
  console.log('Alert action clicked:', alertId)
  // Navigate or show modal
}
</script>

<template>
  <AlertsWidget
    :alerts="alerts"
    @dismiss="handleAlertDismiss"
    @action="handleAlertAction"
  />
</template>
```

---

## Responsive Behavior

### Breakpoints

The dashboard uses Tailwind CSS breakpoints:

| Breakpoint | Min Width | Columns | Description |
|------------|-----------|---------|-------------|
| `sm` | 640px | 2 | Small tablets |
| `md` | 768px | 2-3 | Tablets |
| `lg` | 1024px | 3-4 | Desktops |
| `xl` | 1280px | 4-6 | Large desktops |

### Grid Layouts

**StatCards**:
- Mobile: 1 column
- Tablet (sm): 2 columns
- Desktop (lg): 3 columns

**Two-Column Sections** (Activity/Alerts, Tasks/Activity):
- Mobile: 1 column (stacked)
- Desktop (lg): 2 columns

**Charts**:
- Mobile: 1 column
- Desktop (lg): 2 columns

### Mobile Optimizations

- Reduced padding on cards (p-4 → p-3)
- Smaller font sizes (text-lg → text-base)
- Compact stat cards (hide trend percentages on xs)
- Collapsible sections (optional implementation)

---

## Testing Guide

### Running Tests

```bash
# Run all dashboard tests
pnpm test tests/dashboard

# Run specific component tests
pnpm test tests/dashboard/StatCard.spec.ts

# Run with coverage
pnpm test --coverage tests/dashboard

# Watch mode for development
pnpm test --watch tests/dashboard
```

### Test Structure

Each component has comprehensive tests covering:

1. **Rendering**: Basic display, props, slots
2. **Loading States**: Skeletons, placeholders
3. **Empty States**: No data scenarios
4. **Interactions**: Clicks, toggles, dismissals
5. **Props Validation**: All prop variations
6. **Events**: Emitted events and payloads
7. **Edge Cases**: Undefined props, null values
8. **Accessibility**: ARIA labels, keyboard navigation

### Example Test

```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import StatCard from '@/components/dashboard/StatCard.vue'

describe('StatCard', () => {
  it('renders stat value', () => {
    const wrapper = mount(StatCard, {
      props: {
        stat: {
          label: 'Users',
          value: 100,
        },
      },
    })
    
    expect(wrapper.text()).toContain('100')
    expect(wrapper.text()).toContain('Users')
  })
  
  it('shows loading skeleton', () => {
    const wrapper = mount(StatCard, {
      props: {
        stat: { label: 'Test', value: 0 },
        loading: true,
      },
    })
    
    expect(wrapper.find('.animate-pulse').exists()).toBe(true)
  })
})
```

### Test Coverage

- **171 Component Tests**: 100% pass rate
- **123 View Tests**: Integration tests for dashboard views
- **Coverage**: 95%+ code coverage across all dashboard components

---

## Extending the Module

### Adding a New Dashboard Component

1. **Create Component File**:

```vue
<!-- src/components/dashboard/MyWidget.vue -->
<script setup lang="ts">
import type { MyData } from '@/types/dashboard'

const props = withDefaults(defineProps<{
  data: MyData[]
  loading?: boolean
}>(), {
  loading: false,
})

const emit = defineEmits<{
  action: [id: string]
}>()
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm border p-6">
    <!-- Widget content -->
  </div>
</template>
```

2. **Define Types** (`src/types/dashboard.ts`):

```typescript
export interface MyData {
  id: string
  // ... fields
}
```

3. **Create Mock Data** (`src/data/dashboardMockData.ts`):

```typescript
export function generateMyData(): MyData[] {
  return [
    { id: '1', /* ... */ },
    { id: '2', /* ... */ },
  ]
}
```

4. **Add to Dashboard View**:

```vue
<MyWidget
  :data="dashboardData?.myData || []"
  :loading="loading"
  @action="handleMyAction"
/>
```

5. **Write Tests** (`tests/dashboard/MyWidget.spec.ts`):

```typescript
describe('MyWidget', () => {
  // ... test cases
})
```

### Creating a Custom Dashboard View

```vue
<!-- src/views/custom/Dashboard.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import CustomLayout from '@/layouts/CustomLayout.vue'
import StatCard from '@/components/dashboard/StatCard.vue'
// ... other imports

const loading = ref(true)
const dashboardData = ref(null)

async function loadDashboard() {
  loading.value = true
  try {
    // Fetch custom data
    dashboardData.value = await fetchCustomData()
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadDashboard()
})
</script>

<template>
  <CustomLayout>
    <!-- Custom dashboard layout -->
  </CustomLayout>
</template>
```

---

## Best Practices

### Performance

- **Lazy Loading**: Use dynamic imports for chart libraries
- **Memoization**: Cache computed values with `computed()`
- **Virtual Scrolling**: For large activity feeds/task lists
- **Debouncing**: For refresh actions and filters

### Accessibility

- **ARIA Labels**: All interactive elements labeled
- **Keyboard Navigation**: Tab order and Enter/Space handlers
- **Screen Reader Support**: Announce dynamic content changes
- **Color Contrast**: WCAG AA compliant color schemes

### Error Handling

```vue
<script setup lang="ts">
const error = ref<string | null>(null)

async function loadDashboard() {
  try {
    loading.value = true
    error.value = null
    dashboardData.value = await fetchData()
  } catch (err) {
    error.value = 'Failed to load dashboard data'
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
    <p class="text-red-800">{{ error }}</p>
    <button @click="loadDashboard" class="mt-2">
      Try Again
    </button>
  </div>
</template>
```

---

## Version History

- **v1.0.0** (October 2025): Initial release with 6 components, 3 dashboard views, 171 tests

---

## Support & Contributing

For questions or issues with the Dashboard module:

1. Check this documentation first
2. Review test files for usage examples
3. Contact the development team

To contribute new dashboard components:

1. Follow the component structure outlined in this document
2. Include comprehensive tests (targeting 95%+ coverage)
3. Update this documentation with API reference
4. Submit pull request with examples

---

**Last Updated**: October 29, 2025  
**Module Version**: 1.0.0  
**Maintainers**: SECZim AML Guard Development Team
