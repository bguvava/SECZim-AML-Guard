<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200">
    <!-- Search and Filters Bar -->
    <div class="p-4 border-b border-gray-200">
      <div class="flex flex-col lg:flex-row gap-4">
        <!-- Search Input -->
        <div class="flex-1">
          <div class="relative">
            <Search :size="20" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by name, license number, registration number, or contact..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              @input="handleSearch"
            />
          </div>
        </div>

        <!-- Filter Button -->
        <button
          @click="showFilters = !showFilters"
          class="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          :class="{ 'bg-primary-50 border-primary-500 text-primary-700': hasActiveFilters }"
        >
          <Filter :size="20" />
          <span>Filters</span>
          <span v-if="hasActiveFilters" class="bg-primary-600 text-white text-xs rounded-full px-2 py-0.5">
            {{ activeFilterCount }}
          </span>
        </button>

        <!-- Register Button -->
        <button
          @click="$emit('register')"
          class="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus :size="20" />
          <span>Register New Entity</span>
        </button>
      </div>

      <!-- Filters Panel -->
      <transition name="slide-down">
        <div v-if="showFilters" class="mt-4 p-4 bg-gray-50 rounded-lg space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Entity Type Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Entity Type</label>
              <div class="space-y-2">
                <label v-for="type in entityTypes" :key="type" class="flex items-center">
                  <input
                    v-model="selectedTypes"
                    type="checkbox"
                    :value="type"
                    class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    @change="applyFilters"
                  />
                  <span class="ml-2 text-sm text-gray-700">{{ type }}</span>
                </label>
              </div>
            </div>

            <!-- Status Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">License Status</label>
              <div class="space-y-2">
                <label v-for="status in statuses" :key="status" class="flex items-center">
                  <input
                    v-model="selectedStatuses"
                    type="checkbox"
                    :value="status"
                    class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    @change="applyFilters"
                  />
                  <span class="ml-2 text-sm text-gray-700">{{ status }}</span>
                </label>
              </div>
            </div>

            <!-- Risk Level Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Risk Level</label>
              <div class="space-y-2">
                <label v-for="risk in riskLevels" :key="risk" class="flex items-center">
                  <input
                    v-model="selectedRiskLevels"
                    type="checkbox"
                    :value="risk"
                    class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    @change="applyFilters"
                  />
                  <span class="ml-2 text-sm text-gray-700">{{ risk }}</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Filter Actions -->
          <div class="flex items-center gap-2 justify-end">
            <button
              @click="clearFilters"
              class="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Clear All
            </button>
            <button
              @click="showFilters = false"
              class="px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </transition>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              @click="handleSort(column.key)"
            >
              <div class="flex items-center gap-2">
                <span>{{ column.label }}</span>
                <component
                  :is="getSortIcon(column.key)"
                  v-if="column.sortable"
                  :size="16"
                  class="text-gray-400"
                />
              </div>
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="entity in paginatedEntities"
            :key="entity.id"
            class="hover:bg-gray-50 cursor-pointer transition-colors"
            @click="$emit('view', entity.id)"
          >
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ entity.name }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-600">{{ entity.licenseNumber }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                {{ entity.type }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                class="px-2 py-1 text-xs font-medium rounded-full"
                :class="getStatusClass(entity.status)"
              >
                {{ entity.status }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                class="px-2 py-1 text-xs font-medium rounded-full"
                :class="getRiskClass(entity.riskLevel)"
              >
                {{ entity.riskLevel }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center gap-2">
                <div class="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    class="h-2 rounded-full transition-all"
                    :class="getScoreColor(entity.complianceScore)"
                    :style="{ width: `${entity.complianceScore}%` }"
                  ></div>
                </div>
                <span class="text-sm font-medium text-gray-900">{{ entity.complianceScore }}%</span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-600">
                <div>{{ formatDate(entity.expiryDate) }}</div>
                <div
                  v-if="entity.daysUntilExpiry <= 90 && entity.daysUntilExpiry > 0"
                  class="text-xs text-orange-600 font-medium"
                >
                  {{ entity.daysUntilExpiry }} days left
                </div>
                <div v-else-if="entity.daysUntilExpiry <= 0" class="text-xs text-red-600 font-medium">
                  Expired
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-500">{{ formatDate(entity.lastUpdated) }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button
                @click.stop="$emit('view', entity.id)"
                class="text-primary-600 hover:text-primary-900"
              >
                View
              </button>
            </td>
          </tr>
          <tr v-if="paginatedEntities.length === 0">
            <td colspan="9" class="px-6 py-12 text-center text-gray-500">
              <div class="flex flex-col items-center gap-2">
                <FileX :size="48" class="text-gray-400" />
                <p class="text-lg font-medium">No entities found</p>
                <p class="text-sm">Try adjusting your search or filters</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
      <div class="text-sm text-gray-700">
        Showing {{ startIndex + 1 }} to {{ Math.min(endIndex, filteredEntities.length) }} of {{ filteredEntities.length }} results
      </div>
      <div class="flex items-center gap-2">
        <button
          @click="currentPage--"
          :disabled="currentPage === 1"
          class="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft :size="20" />
        </button>
        <span class="text-sm text-gray-700">
          Page {{ currentPage }} of {{ totalPages }}
        </span>
        <button
          @click="currentPage++"
          :disabled="currentPage === totalPages"
          class="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight :size="20" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Search, Filter, Plus, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, FileX } from 'lucide-vue-next'
import type { EntityListItem, EntityType, EntityStatus, RiskLevel } from '@/types/entity'

interface Props {
  entities: EntityListItem[]
}

interface Emits {
  (e: 'view', id: string): void
  (e: 'register'): void
  (e: 'filter', filters: { search: string; types: EntityType[]; statuses: EntityStatus[]; riskLevels: RiskLevel[] }): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Filter state
const searchQuery = ref('')
const showFilters = ref(false)
const selectedTypes = ref<EntityType[]>([])
const selectedStatuses = ref<EntityStatus[]>([])
const selectedRiskLevels = ref<RiskLevel[]>([])

// Sorting state
const sortKey = ref<string>('name')
const sortOrder = ref<'asc' | 'desc'>('asc')

// Pagination state
const currentPage = ref(1)
const pageSize = 25

// Constants
const entityTypes: EntityType[] = ['Stockbroker', 'Investment Manager', 'Custodian', 'Market Operator', 'Investment Advisor', 'Portfolio Manager']
const statuses: EntityStatus[] = ['Active', 'Pending', 'Suspended', 'Revoked', 'Expired']
const riskLevels: RiskLevel[] = ['High', 'Medium', 'Low', 'Unrated']

const columns = [
  { key: 'name', label: 'Entity Name', sortable: true },
  { key: 'licenseNumber', label: 'License Number', sortable: true },
  { key: 'type', label: 'Type', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'riskLevel', label: 'Risk Level', sortable: true },
  { key: 'complianceScore', label: 'Compliance Score', sortable: true },
  { key: 'expiryDate', label: 'Expiry Date', sortable: true },
  { key: 'lastUpdated', label: 'Last Updated', sortable: true },
]

/**
 * Filtered entities
 */
const filteredEntities = computed(() => {
  return props.entities.filter(entity => {
    // Search filter
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      const matchesSearch =
        entity.name.toLowerCase().includes(query) ||
        entity.licenseNumber.toLowerCase().includes(query)
      if (!matchesSearch) return false
    }

    // Type filter
    if (selectedTypes.value.length > 0 && !selectedTypes.value.includes(entity.type)) {
      return false
    }

    // Status filter
    if (selectedStatuses.value.length > 0 && !selectedStatuses.value.includes(entity.status)) {
      return false
    }

    // Risk level filter
    if (selectedRiskLevels.value.length > 0 && !selectedRiskLevels.value.includes(entity.riskLevel)) {
      return false
    }

    return true
  })
})

/**
 * Sorted entities
 */
const sortedEntities = computed(() => {
  const sorted = [...filteredEntities.value]
  sorted.sort((a, b) => {
    const aVal = a[sortKey.value as keyof EntityListItem]
    const bVal = b[sortKey.value as keyof EntityListItem]

    if (aVal === bVal) return 0

    const comparison = aVal > bVal ? 1 : -1
    return sortOrder.value === 'asc' ? comparison : -comparison
  })
  return sorted
})

/**
 * Paginated entities
 */
const paginatedEntities = computed(() => {
  return sortedEntities.value.slice(startIndex.value, endIndex.value)
})

/**
 * Pagination calculations
 */
const startIndex = computed(() => (currentPage.value - 1) * pageSize)
const endIndex = computed(() => startIndex.value + pageSize)
const totalPages = computed(() => Math.ceil(filteredEntities.value.length / pageSize))

/**
 * Has active filters
 */
const hasActiveFilters = computed(() => {
  return selectedTypes.value.length > 0 || selectedStatuses.value.length > 0 || selectedRiskLevels.value.length > 0
})

/**
 * Active filter count
 */
const activeFilterCount = computed(() => {
  return selectedTypes.value.length + selectedStatuses.value.length + selectedRiskLevels.value.length
})

/**
 * Handle search
 */
const handleSearch = () => {
  currentPage.value = 1
  emitFilters()
}

/**
 * Handle sort
 */
const handleSort = (key: string) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
}

/**
 * Get sort icon
 */
const getSortIcon = (key: string) => {
  if (sortKey.value !== key) return ArrowUpDown
  return sortOrder.value === 'asc' ? ArrowUp : ArrowDown
}

/**
 * Apply filters
 */
const applyFilters = () => {
  currentPage.value = 1
  emitFilters()
}

/**
 * Clear filters
 */
const clearFilters = () => {
  selectedTypes.value = []
  selectedStatuses.value = []
  selectedRiskLevels.value = []
  currentPage.value = 1
  emitFilters()
}

/**
 * Emit filters
 */
const emitFilters = () => {
  emit('filter', {
    search: searchQuery.value,
    types: selectedTypes.value,
    statuses: selectedStatuses.value,
    riskLevels: selectedRiskLevels.value,
  })
}

/**
 * Get status class
 */
const getStatusClass = (status: EntityStatus) => {
  const classes = {
    Active: 'bg-green-100 text-green-800',
    Pending: 'bg-yellow-100 text-yellow-800',
    Suspended: 'bg-orange-100 text-orange-800',
    Revoked: 'bg-red-100 text-red-800',
    Expired: 'bg-gray-100 text-gray-800',
  }
  return classes[status]
}

/**
 * Get risk class
 */
const getRiskClass = (risk: RiskLevel) => {
  const classes = {
    High: 'bg-red-100 text-red-800',
    Medium: 'bg-orange-100 text-orange-800',
    Low: 'bg-green-100 text-green-800',
    Unrated: 'bg-gray-100 text-gray-800',
  }
  return classes[risk]
}

/**
 * Get score color
 */
const getScoreColor = (score: number) => {
  if (score >= 80) return 'bg-green-500'
  if (score >= 60) return 'bg-yellow-500'
  return 'bg-red-500'
}

/**
 * Format date
 */
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// Watch entities changes and reset to page 1
watch(() => props.entities, () => {
  currentPage.value = 1
})
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
  max-height: 500px;
  overflow: hidden;
}

.slide-down-enter-from,
.slide-down-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
