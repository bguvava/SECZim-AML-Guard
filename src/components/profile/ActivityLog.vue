<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { FileText, Search, Filter, Download, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import type { ActivityLogEntry, ActivityLogFilters, ActivityCategory, ActivityAction } from '@/types/profile'

const props = defineProps<{
  activities: ActivityLogEntry[]
  total: number
  page: number
  limit: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
  loading?: boolean
}>()

const emit = defineEmits<{
  loadPage: [page: number]
  filter: [filters: ActivityLogFilters]
  export: [format: 'csv' | 'json' | 'pdf']
}>()

// Filter state
const showFilters = ref(false)
const searchQuery = ref('')
const selectedCategories = ref<ActivityCategory[]>([])
const selectedActions = ref<ActivityAction[]>([])
const selectedStatus = ref<('success' | 'failure' | 'pending')[]>([])
const startDate = ref('')
const endDate = ref('')

const categories: ActivityCategory[] = ['authentication', 'security', 'profile', 'settings', 'data', 'system']

const statusOptions = ['success', 'failure', 'pending'] as const

const hasActiveFilters = computed(() => {
  return searchQuery.value ||
    selectedCategories.value.length > 0 ||
    selectedActions.value.length > 0 ||
    selectedStatus.value.length > 0 ||
    startDate.value ||
    endDate.value
})

const statusColors = {
  success: 'bg-green-100 text-green-800',
  failure: 'bg-red-100 text-red-800',
  pending: 'bg-yellow-100 text-yellow-800',
}

const categoryColors = {
  authentication: 'bg-blue-100 text-blue-800',
  security: 'bg-red-100 text-red-800',
  profile: 'bg-purple-100 text-purple-800',
  settings: 'bg-gray-100 text-gray-800',
  data: 'bg-green-100 text-green-800',
  system: 'bg-yellow-100 text-yellow-800',
}

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp)
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

function formatAction(action: ActivityAction): string {
  return action.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

function applyFilters() {
  const filters: ActivityLogFilters = {}

  if (searchQuery.value) filters.searchQuery = searchQuery.value
  if (selectedCategories.value.length > 0) filters.category = selectedCategories.value
  if (selectedActions.value.length > 0) filters.action = selectedActions.value
  if (selectedStatus.value.length > 0) filters.status = selectedStatus.value
  if (startDate.value) filters.startDate = new Date(startDate.value).toISOString()
  if (endDate.value) filters.endDate = new Date(endDate.value).toISOString()

  emit('filter', filters)
}

function clearFilters() {
  searchQuery.value = ''
  selectedCategories.value = []
  selectedActions.value = []
  selectedStatus.value = []
  startDate.value = ''
  endDate.value = ''
  emit('filter', {})
}

function handleExport(format: 'csv' | 'json' | 'pdf') {
  emit('export', format)
}

function handlePageChange(newPage: number) {
  if (newPage >= 1 && newPage <= props.totalPages && !props.loading) {
    emit('loadPage', newPage)
  }
}

// Auto-apply filters on change (with debounce for search)
let searchTimeout: ReturnType<typeof setTimeout>
watch(searchQuery, () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    applyFilters()
  }, 500)
})

watch([selectedCategories, selectedActions, selectedStatus, startDate, endDate], () => {
  applyFilters()
}, { deep: true })
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm border p-6">
    <div class="mb-6">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FileText class="w-5 h-5" />
            Activity Log
          </h3>
          <p class="text-sm text-gray-600 mt-1">
            View your account activity history
          </p>
        </div>
        <div class="flex gap-2">
          <button
            type="button"
            :disabled="loading"
            class="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center gap-2"
            @click="showFilters = !showFilters"
          >
            <Filter class="w-4 h-4" />
            Filters
            <span v-if="hasActiveFilters" class="px-1.5 py-0.5 bg-blue-600 text-white text-xs rounded-full">
              {{ [selectedCategories.length, selectedActions.length, selectedStatus.length, startDate ? 1 : 0, endDate ? 1 : 0, searchQuery ? 1 : 0].filter(Boolean).reduce((a, b) => a + b, 0) }}
            </span>
          </button>
          <button
            type="button"
            :disabled="loading"
            class="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
            @click="handleExport('csv')"
          >
            <Download class="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      <!-- Filters Panel -->
      <div v-if="showFilters" class="p-4 bg-gray-50 border rounded-lg space-y-4 mb-4">
        <!-- Search -->
        <div>
          <label for="search" class="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <div class="relative">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              id="search"
              v-model="searchQuery"
              type="text"
              placeholder="Search activity..."
              class="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Category Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <div class="space-y-1 max-h-32 overflow-y-auto border rounded-lg p-2">
              <label
                v-for="category in categories"
                :key="category"
                class="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
              >
                <input
                  v-model="selectedCategories"
                  type="checkbox"
                  :value="category"
                  class="w-4 h-4 text-blue-600 rounded"
                />
                <span class="text-sm capitalize">{{ category }}</span>
              </label>
            </div>
          </div>

          <!-- Status Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <div class="space-y-1 border rounded-lg p-2">
              <label
                v-for="status in statusOptions"
                :key="status"
                class="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
              >
                <input
                  v-model="selectedStatus"
                  type="checkbox"
                  :value="status"
                  class="w-4 h-4 text-blue-600 rounded"
                />
                <span class="text-sm capitalize">{{ status }}</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Date Range -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="startDate" class="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              id="startDate"
              v-model="startDate"
              type="date"
              class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label for="endDate" class="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              id="endDate"
              v-model="endDate"
              type="date"
              class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div class="flex justify-between pt-2">
          <button
            v-if="hasActiveFilters"
            type="button"
            class="text-sm text-red-600 hover:text-red-700 font-medium"
            @click="clearFilters"
          >
            Clear All Filters
          </button>
          <div v-else></div>
        </div>
      </div>
    </div>

    <!-- Activity List -->
    <div v-if="loading" class="space-y-3">
      <div v-for="i in limit" :key="i" class="border rounded-lg p-4 animate-pulse">
        <div class="flex items-start gap-4">
          <div class="w-10 h-10 bg-gray-200 rounded-full"></div>
          <div class="flex-1 space-y-2">
            <div class="h-4 bg-gray-200 rounded w-2/3"></div>
            <div class="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="activities.length === 0" class="text-center py-12">
      <FileText class="w-12 h-12 mx-auto text-gray-300 mb-3" />
      <p class="text-gray-500">No activity found</p>
      <p v-if="hasActiveFilters" class="text-sm text-gray-400 mt-1">
        Try adjusting your filters
      </p>
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="activity in activities"
        :key="activity.id"
        class="border rounded-lg p-4 hover:border-gray-300 transition-colors"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-2">
              <span :class="['px-2 py-0.5 rounded text-xs font-medium', categoryColors[activity.category]]">
                {{ activity.category }}
              </span>
              <span :class="['px-2 py-0.5 rounded text-xs font-medium', statusColors[activity.status]]">
                {{ activity.status }}
              </span>
            </div>
            <h4 class="font-medium text-gray-900 mb-1">
              {{ formatAction(activity.action) }}
            </h4>
            <p class="text-sm text-gray-600 mb-2">
              {{ activity.description }}
            </p>
            <div class="flex items-center gap-4 text-xs text-gray-500">
              <span>{{ formatTimestamp(activity.timestamp) }}</span>
              <span v-if="activity.ipAddress">{{ activity.ipAddress }}</span>
              <span v-if="activity.location">
                {{ activity.location.city }}{{ activity.location.country ? `, ${activity.location.country}` : '' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="activities.length > 0 && totalPages > 1" class="flex items-center justify-between pt-6 mt-6 border-t">
      <div class="text-sm text-gray-600">
        Showing {{ ((page - 1) * limit) + 1 }} to {{ Math.min(page * limit, total) }} of {{ total }} activities
      </div>
      <div class="flex items-center gap-2">
        <button
          type="button"
          :disabled="!hasPrev || loading"
          class="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          @click="handlePageChange(page - 1)"
        >
          <ChevronLeft class="w-4 h-4" />
        </button>
        <span class="text-sm text-gray-600">
          Page {{ page }} of {{ totalPages }}
        </span>
        <button
          type="button"
          :disabled="!hasNext || loading"
          class="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          @click="handlePageChange(page + 1)"
        >
          <ChevronRight class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>
