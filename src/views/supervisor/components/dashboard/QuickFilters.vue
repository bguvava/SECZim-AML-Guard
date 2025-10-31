<template>
  <div class="bg-white rounded-lg border border-gray-200 p-4">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-sm font-medium text-gray-700">Quick Filters</h3>
      <button
        v-if="hasActiveFilters"
        @click="clearFilters"
        class="text-xs text-blue-600 hover:text-blue-700 font-medium"
      >
        Clear All
      </button>
    </div>

    <div class="space-y-3">
      <!-- Risk Level Filter -->
      <div>
        <label class="block text-xs font-medium text-gray-600 mb-1">Risk Level</label>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="level in riskLevels"
            :key="level.value"
            @click="toggleFilter('riskLevel', level.value)"
            :class="[
              'px-3 py-1 text-xs rounded-full transition-all',
              isFilterActive('riskLevel', level.value)
                ? `${level.activeClass} font-medium`
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
            ]"
          >
            {{ level.label }}
          </button>
        </div>
      </div>

      <!-- Status Filter -->
      <div>
        <label class="block text-xs font-medium text-gray-600 mb-1">Status</label>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="status in statuses"
            :key="status.value"
            @click="toggleFilter('status', status.value)"
            :class="[
              'px-3 py-1 text-xs rounded-full transition-all',
              isFilterActive('status', status.value)
                ? 'bg-blue-600 text-white font-medium'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
            ]"
          >
            {{ status.label }}
          </button>
        </div>
      </div>

      <!-- Date Range -->
      <div>
        <label class="block text-xs font-medium text-gray-600 mb-1">Date Range</label>
        <select
          v-model="filters.dateRange"
          class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          @change="emitFilters"
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">Last 7 Days</option>
          <option value="month">Last 30 Days</option>
          <option value="quarter">Last Quarter</option>
          <option value="year">Last Year</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Filters {
  riskLevel: string[]
  status: string[]
  dateRange: string
}

const emit = defineEmits<{
  'update:filters': [filters: Filters]
}>()

const filters = ref<Filters>({
  riskLevel: [],
  status: [],
  dateRange: 'all',
})

const riskLevels = [
  { label: 'High', value: 'high', activeClass: 'bg-red-600 text-white' },
  { label: 'Medium', value: 'medium', activeClass: 'bg-yellow-600 text-white' },
  { label: 'Low', value: 'low', activeClass: 'bg-green-600 text-white' },
]

const statuses = [
  { label: 'Active', value: 'active' },
  { label: 'Pending', value: 'pending' },
  { label: 'Under Review', value: 'under-review' },
  { label: 'Suspended', value: 'suspended' },
]

const hasActiveFilters = computed(() => {
  return (
    filters.value.riskLevel.length > 0 ||
    filters.value.status.length > 0 ||
    filters.value.dateRange !== 'all'
  )
})

function toggleFilter(type: keyof Pick<Filters, 'riskLevel' | 'status'>, value: string) {
  const index = filters.value[type].indexOf(value)
  if (index > -1) {
    filters.value[type].splice(index, 1)
  } else {
    filters.value[type].push(value)
  }
  emitFilters()
}

function isFilterActive(type: keyof Pick<Filters, 'riskLevel' | 'status'>, value: string): boolean {
  return filters.value[type].includes(value)
}

function clearFilters() {
  filters.value = {
    riskLevel: [],
    status: [],
    dateRange: 'all',
  }
  emitFilters()
}

function emitFilters() {
  emit('update:filters', filters.value)
}
</script>
