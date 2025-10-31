<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { Search, Filter, Download, Plus, RefreshCw, Trash2, Archive, Mail } from 'lucide-vue-next'
import { useSupervisionStore } from '../stores/supervisionStore'
import EntityListTable from '@/components/entity/EntityListTable.vue'
import EntityRegistrationForm from '@/components/entity/EntityRegistrationForm.vue'
import EntityEditForm from '@/components/entity/EntityEditForm.vue'
import EntityStatsCards from '@/components/entity/EntityStatsCards.vue'
import type { EntityListItem, EntityStatistics, EntityType, EntityStatus, RiskLevel as EntityRiskLevel } from '@/types/entity'

const store = useSupervisionStore()

// Search and Filter State
const searchQuery = ref('')
const selectedFilters = ref({
  type: [] as EntityType[],
  status: [] as EntityStatus[],
  riskLevel: [] as EntityRiskLevel[],
  complianceScore: { min: 0, max: 100 },
})
const showFilters = ref(false)
const sortBy = ref<'name' | 'riskLevel' | 'complianceScore' | 'expiryDate'>('name')
const sortOrder = ref<'asc' | 'desc'>('asc')

// Selection and Bulk Actions
const selectedInstitutions = ref<Set<string>>(new Set())
const showBulkActions = computed(() => selectedInstitutions.value.size > 0)

onMounted(() => {
  store.fetchInstitutions()
})

const mapCategoryToEntityType = (category: string): EntityType => {
  const known: EntityType[] = ['Stockbroker', 'Investment Manager', 'Custodian', 'Market Operator', 'Investment Advisor', 'Portfolio Manager']
  return (known.find(t => t === category) || 'Market Operator') as EntityType
}

const daysBetween = (a: Date, b: Date) => Math.ceil((a.getTime() - b.getTime()) / 86400000)

const allEntities = computed<EntityListItem[]>(() => {
  return store.institutions.items.map((i) => {
    const expiry = new Date(i.createdAt)
    expiry.setFullYear(expiry.getFullYear() + 1)
    const status = i.status as EntityStatus
    const riskLevel = (i.riskLevel as unknown as EntityRiskLevel) ?? 'Unrated'
    const complianceScore = Math.max(0, Math.min(100, (i.riskScore ?? 70)))
    return {
      id: i.id,
      name: i.name,
      licenseNumber: i.licenseNumber,
      type: mapCategoryToEntityType(i.category),
      status,
      riskLevel,
      complianceScore,
      expiryDate: expiry.toISOString(),
      daysUntilExpiry: daysBetween(expiry, new Date()),
      lastUpdated: i.updatedAt,
    }
  })
})

const entitiesForList = computed<EntityListItem[]>(() => {
  let filtered = [...allEntities.value]

  // Apply search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (e) =>
        e.name.toLowerCase().includes(query) ||
        e.licenseNumber.toLowerCase().includes(query) ||
        e.type.toLowerCase().includes(query)
    )
  }

  // Apply filters
  if (selectedFilters.value.type.length > 0) {
    filtered = filtered.filter((e) => selectedFilters.value.type.includes(e.type))
  }
  if (selectedFilters.value.status.length > 0) {
    filtered = filtered.filter((e) => selectedFilters.value.status.includes(e.status))
  }
  if (selectedFilters.value.riskLevel.length > 0) {
    filtered = filtered.filter((e) => selectedFilters.value.riskLevel.includes(e.riskLevel))
  }
  if (selectedFilters.value.complianceScore.min > 0 || selectedFilters.value.complianceScore.max < 100) {
    filtered = filtered.filter(
      (e) =>
        e.complianceScore >= selectedFilters.value.complianceScore.min &&
        e.complianceScore <= selectedFilters.value.complianceScore.max
    )
  }

  // Apply sorting
  filtered.sort((a, b) => {
    let comparison = 0
    if (sortBy.value === 'name') {
      comparison = a.name.localeCompare(b.name)
    } else if (sortBy.value === 'riskLevel') {
      const riskOrder = { High: 3, Medium: 2, Low: 1, Unrated: 0 }
      comparison = riskOrder[a.riskLevel] - riskOrder[b.riskLevel]
    } else if (sortBy.value === 'complianceScore') {
      comparison = a.complianceScore - b.complianceScore
    } else if (sortBy.value === 'expiryDate') {
      comparison = a.daysUntilExpiry - b.daysUntilExpiry
    }
    return sortOrder.value === 'asc' ? comparison : -comparison
  })

  return filtered
})

const stats = computed<EntityStatistics>(() => {
  const total = store.institutions.total
  const activeLicenses = store.institutions.items.filter(i => i.status === 'Active').length
  const byTypeInit: Record<EntityType, number> = {
    Stockbroker: 0,
    'Investment Manager': 0,
    Custodian: 0,
    'Market Operator': 0,
    'Investment Advisor': 0,
    'Portfolio Manager': 0,
  }
  const byRiskInit: Record<EntityRiskLevel, number> = { High: 0, Medium: 0, Low: 0, Unrated: 0 }
  let complianceSum = 0

  for (const i of store.institutions.items) {
    const t = mapCategoryToEntityType(i.category)
    byTypeInit[t]++
    const rl = (i.riskLevel as unknown as EntityRiskLevel) ?? 'Unrated'
    byRiskInit[rl] = (byRiskInit[rl] || 0) + 1
    complianceSum += Math.max(0, Math.min(100, i.riskScore ?? 70))
  }

  const expiringSoon = entitiesForList.value.filter(e => e.daysUntilExpiry <= 90 && e.daysUntilExpiry > 0).length
  const suspended = store.institutions.items.filter(i => i.status === 'Suspended').length
  const avgCompliance = total > 0 ? Math.round(complianceSum / total) : 0

  return {
    totalEntities: total,
    activeLicenses,
    expiringSoon,
    suspended,
    byType: byTypeInit,
    byRiskLevel: byRiskInit,
    averageComplianceScore: avgCompliance,
  }
})

const showRegister = ref(false)
const showEdit = ref(false)
const selectedEntityId = ref<string | null>(null)

const handleView = (id: string) => {
  selectedEntityId.value = id
  showEdit.value = true
}

const handleRegister = () => {
  showRegister.value = true
}

const handleSearch = (query: string) => {
  searchQuery.value = query
}

const clearFilters = () => {
  selectedFilters.value = {
    type: [],
    status: [],
    riskLevel: [],
    complianceScore: { min: 0, max: 100 },
  }
}

const toggleSelection = (id: string) => {
  if (selectedInstitutions.value.has(id)) {
    selectedInstitutions.value.delete(id)
  } else {
    selectedInstitutions.value.add(id)
  }
}

const selectAll = () => {
  if (selectedInstitutions.value.size === entitiesForList.value.length) {
    selectedInstitutions.value.clear()
  } else {
    entitiesForList.value.forEach((e) => selectedInstitutions.value.add(e.id))
  }
}

const bulkExport = () => {
  console.log('Exporting:', Array.from(selectedInstitutions.value))
  // TODO: Implement export functionality
}

const bulkArchive = () => {
  console.log('Archiving:', Array.from(selectedInstitutions.value))
  // TODO: Implement archive functionality
}

const bulkNotify = () => {
  console.log('Notifying:', Array.from(selectedInstitutions.value))
  // TODO: Implement notification functionality
}

const bulkDelete = () => {
  if (confirm(`Delete ${selectedInstitutions.value.size} selected institutions?`)) {
    console.log('Deleting:', Array.from(selectedInstitutions.value))
    // TODO: Implement delete functionality
  }
}

const refreshData = async () => {
  await store.fetchInstitutions()
  selectedInstitutions.value.clear()
}
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Institution Registry</h1>
        <p class="mt-1 text-sm text-gray-500">
          Manage and monitor registered financial institutions
        </p>
      </div>
      <button
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        @click="handleRegister"
      >
        <Plus class="w-4 h-4" />
        Register Institution
      </button>
    </div>

    <!-- Stats -->
    <EntityStatsCards :statistics="stats" />

    <!-- Search and Filter Bar -->
    <div class="bg-white p-4 rounded-lg shadow space-y-4">
      <div class="flex flex-col lg:flex-row gap-4">
        <!-- Search -->
        <div class="flex-1 relative">
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by name, license number, or type..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Sort -->
        <select
          v-model="sortBy"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="name">Sort by Name</option>
          <option value="riskLevel">Sort by Risk</option>
          <option value="complianceScore">Sort by Compliance</option>
          <option value="expiryDate">Sort by Expiry</option>
        </select>

        <button
          class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          @click="sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'"
        >
          {{ sortOrder === 'asc' ? '↑' : '↓' }}
        </button>

        <button
          class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          :class="{ 'bg-blue-50 border-blue-500 text-blue-600': showFilters }"
          @click="showFilters = !showFilters"
        >
          <Filter class="w-4 h-4" />
          Filters
        </button>

        <button
          class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          @click="refreshData"
        >
          <RefreshCw class="w-4 h-4" />
        </button>
      </div>

      <!-- Advanced Filters (Collapsible) -->
      <div v-if="showFilters" class="pt-4 border-t space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Type Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Institution Type</label>
            <div class="space-y-2">
              <label v-for="type in ['Stockbroker', 'Investment Manager', 'Custodian', 'Market Operator']" :key="type" class="flex items-center">
                <input
                  type="checkbox"
                  :value="type"
                  v-model="selectedFilters.type"
                  class="mr-2 rounded border-gray-300"
                />
                <span class="text-sm">{{ type }}</span>
              </label>
            </div>
          </div>

          <!-- Status Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <div class="space-y-2">
              <label v-for="status in ['Active', 'Pending', 'Suspended', 'Revoked']" :key="status" class="flex items-center">
                <input
                  type="checkbox"
                  :value="status"
                  v-model="selectedFilters.status"
                  class="mr-2 rounded border-gray-300"
                />
                <span class="text-sm">{{ status }}</span>
              </label>
            </div>
          </div>

          <!-- Risk Level Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Risk Level</label>
            <div class="space-y-2">
              <label v-for="risk in ['High', 'Medium', 'Low', 'Unrated']" :key="risk" class="flex items-center">
                <input
                  type="checkbox"
                  :value="risk"
                  v-model="selectedFilters.riskLevel"
                  class="mr-2 rounded border-gray-300"
                />
                <span class="text-sm">{{ risk }}</span>
              </label>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-2">
          <button
            class="px-4 py-2 text-gray-600 hover:text-gray-800"
            @click="clearFilters"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>

    <!-- Bulk Actions Bar -->
    <div
      v-if="showBulkActions"
      class="bg-blue-50 border border-blue-200 p-4 rounded-lg flex items-center justify-between"
    >
      <div class="flex items-center gap-4">
        <span class="text-sm font-medium text-blue-900">
          {{ selectedInstitutions.size }} institution(s) selected
        </span>
        <button
          class="text-sm text-blue-600 hover:text-blue-800 underline"
          @click="selectAll"
        >
          {{ selectedInstitutions.size === entitiesForList.length ? 'Deselect All' : 'Select All' }}
        </button>
      </div>
      <div class="flex items-center gap-2">
        <button
          class="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-2"
          @click="bulkExport"
        >
          <Download class="w-4 h-4" />
          <span class="text-sm">Export</span>
        </button>
        <button
          class="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-2"
          @click="bulkNotify"
        >
          <Mail class="w-4 h-4" />
          <span class="text-sm">Notify</span>
        </button>
        <button
          class="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-2"
          @click="bulkArchive"
        >
          <Archive class="w-4 h-4" />
          <span class="text-sm">Archive</span>
        </button>
        <button
          class="px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-2"
          @click="bulkDelete"
        >
          <Trash2 class="w-4 h-4" />
          <span class="text-sm">Delete</span>
        </button>
      </div>
    </div>

    <!-- Results Summary -->
    <div class="text-sm text-gray-600">
      Showing {{ entitiesForList.length }} of {{ allEntities.length }} institutions
    </div>

    <!-- Institution Table -->
    <div class="bg-white rounded-lg shadow">
      <EntityListTable
        :entities="entitiesForList"
        :selected="selectedInstitutions"
        @view="handleView"
        @register="handleRegister"
        @toggle-selection="toggleSelection"
        @select-all="selectAll"
      />
    </div>

    <!-- Modals -->
    <EntityRegistrationForm :show="showRegister" @cancel="showRegister = false" @success="refreshData" />
    <EntityEditForm :show="showEdit" :entity="null" @cancel="showEdit = false" @success="refreshData" />
  </div>
</template>
