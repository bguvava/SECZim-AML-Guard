<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Entity Registry</h1>
        <p class="text-gray-600 mt-2">Manage and monitor all registered entities under SEC Zimbabwe oversight</p>
      </div>

      <!-- Statistics Cards -->
      <EntityStatsCards :statistics="statistics" class="mb-8" />

      <!-- Entity List Table -->
      <EntityListTable
        :entities="entityListItems"
        @view="handleViewEntity"
        @register="handleRegisterEntity"
        @filter="handleFilter"
      />

      <!-- Registration Form Modal -->
      <EntityRegistrationForm
        :show="showRegistrationForm"
        @submit="handleSubmitRegistration"
        @cancel="closeRegistrationForm"
      />

      <!-- Edit Form Modal -->
      <EntityEditForm
        :show="showEditForm"
        :entity="entityToEdit"
        @submit="handleSubmitEdit"
        @cancel="closeEditForm"
      />

      <!-- Profile Modal -->
      <EntityProfileModal
        :show="showProfileModal"
        :entity="selectedEntity"
        @close="closeEntityProfile"
        @edit="handleEditEntity"
        @suspend="handleSuspendLicense"
        @revoke="handleRevokeLicense"
        @export="handleExportEntity"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import EntityStatsCards from '@/components/entity/EntityStatsCards.vue'
import EntityListTable from '@/components/entity/EntityListTable.vue'
import EntityRegistrationForm from '@/components/entity/EntityRegistrationForm.vue'
import EntityEditForm from '@/components/entity/EntityEditForm.vue'
import EntityProfileModal from '@/components/entity/EntityProfileModal.vue'
import { useEntityRegistry } from '@/composables/useEntityRegistry'
import type { Entity, EntityRegistrationData, EntityUpdateData, EntityFilters } from '@/types/entity'

const {
  entityListItems,
  statistics,
  selectedEntity,
  showProfileModal,
  showRegistrationForm,
  loadEntities,
  registerEntity,
  updateEntity,
  openEntityProfile,
  closeEntityProfile,
  openRegistrationForm,
  closeRegistrationForm,
  setFilters,
  performLicenseAction,
} = useEntityRegistry()

const showEditForm = ref(false)
const entityToEdit = ref<Entity | null>(null)

onMounted(async () => {
  await loadEntities()
})

const handleViewEntity = (id: string) => {
  openEntityProfile(id)
}

const handleRegisterEntity = () => {
  openRegistrationForm()
}

const handleSubmitRegistration = async (data: EntityRegistrationData) => {
  await registerEntity(data)
  closeRegistrationForm()
}

const handleFilter = (filters: EntityFilters) => {
  setFilters(filters)
}

const handleEditEntity = (id: string) => {
  const entity = entityListItems.value.find(e => e.id === id)
  if (entity) {
    // Find full entity from selected entity or load it
    entityToEdit.value = selectedEntity.value
    showEditForm.value = true
  }
}

const handleSubmitEdit = async (id: string, data: EntityUpdateData) => {
  await updateEntity(id, data)
  closeEditForm()
  // Refresh profile if open
  if (showProfileModal.value && selectedEntity.value?.id === id) {
    await loadEntities()
    openEntityProfile(id)
  }
}

const closeEditForm = () => {
  showEditForm.value = false
  setTimeout(() => {
    entityToEdit.value = null
  }, 300)
}

const handleSuspendLicense = async (id: string) => {
  if (confirm('Are you sure you want to suspend this license?')) {
    await performLicenseAction(id, {
      action: 'suspend',
      reason: 'Manual suspension by administrator',
      effectiveDate: new Date().toISOString(),
      authorizedBy: 'Current User', // Replace with actual user from auth store
    })
    // Refresh entity profile
    await loadEntities()
    openEntityProfile(id)
  }
}

const handleRevokeLicense = async (id: string) => {
  if (confirm('Are you sure you want to revoke this license? This action cannot be undone.')) {
    await performLicenseAction(id, {
      action: 'revoke',
      reason: 'Manual revocation by administrator',
      effectiveDate: new Date().toISOString(),
      authorizedBy: 'Current User', // Replace with actual user from auth store
    })
    // Refresh entity profile
    await loadEntities()
    openEntityProfile(id)
  }
}

const handleExportEntity = (id: string) => {
  const entity = entityListItems.value.find(e => e.id === id)
  if (entity) {
    // Create a simple text export for now
    const exportData = {
      id: entity.id,
      name: entity.name,
      licenseNumber: entity.licenseNumber,
      type: entity.type,
      status: entity.status,
      riskLevel: entity.riskLevel,
      complianceScore: entity.complianceScore,
      expiryDate: entity.expiryDate,
      exportDate: new Date().toISOString(),
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `entity-${entity.id}-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }
}
</script>
