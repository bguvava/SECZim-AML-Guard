/**
 * Entity Registry Composable
 * State management and business logic for Entity Registry
 */

import { ref, computed, type Ref } from 'vue'
import type {
  Entity,
  EntityListItem,
  EntityFilters,
  EntityStatistics,
  EntityRegistrationData,
  EntityUpdateData,
  LicenseActionData,
  EntityNote,
} from '@/types/entity'
import {
  mockEntities,
} from '@/data/entityMockData'
import { useToast } from 'vue-toastification'

export function useEntityRegistry() {
  const toast = useToast()

  // State
  const entities: Ref<Entity[]> = ref([...mockEntities])
  const loading = ref(false)
  const selectedEntity: Ref<Entity | null> = ref(null)
  const showProfileModal = ref(false)
  const showRegistrationForm = ref(false)

  // Filters
  const filters: Ref<EntityFilters> = ref({
    search: '',
    types: [],
    statuses: [],
    riskLevels: [],
    expiringWithinDays: undefined,
    hasViolations: undefined,
  })

  /**
   * Get entity list items
   */
  const entityListItems = computed<EntityListItem[]>(() => {
    let filtered = entities.value

    // Apply search filter
    if (filters.value.search) {
      const query = filters.value.search.toLowerCase()
      filtered = filtered.filter(entity =>
        entity.name.toLowerCase().includes(query) ||
        entity.license.licenseNumber.toLowerCase().includes(query) ||
        entity.businessInfo.registrationNumber.toLowerCase().includes(query) ||
        entity.contactInfo.primaryContact.name.toLowerCase().includes(query)
      )
    }

    // Apply type filter
    if (filters.value.types.length > 0) {
      filtered = filtered.filter(entity => filters.value.types.includes(entity.type))
    }

    // Apply status filter
    if (filters.value.statuses.length > 0) {
      filtered = filtered.filter(entity => filters.value.statuses.includes(entity.status))
    }

    // Apply risk level filter
    if (filters.value.riskLevels.length > 0) {
      filtered = filtered.filter(entity => {
        const riskLevel = entity.riskRating?.level || 'Unrated'
        return filters.value.riskLevels.includes(riskLevel)
      })
    }

    // Apply expiring soon filter
    if (filters.value.expiringWithinDays !== undefined) {
      filtered = filtered.filter(entity => {
        const days = daysUntilExpiry(entity.license.expiryDate)
        return days > 0 && days <= filters.value.expiringWithinDays!
      })
    }

    // Convert to list items
    return filtered.map(entity => ({
      id: entity.id,
      name: entity.name,
      licenseNumber: entity.license.licenseNumber,
      type: entity.type,
      status: entity.status,
      riskLevel: entity.riskRating?.level || 'Unrated',
      complianceScore: entity.complianceScore?.overallScore || 0,
      expiryDate: entity.license.expiryDate,
      daysUntilExpiry: daysUntilExpiry(entity.license.expiryDate),
      lastUpdated: entity.updatedAt,
    }))
  })

  /**
   * Get entity statistics
   */
  const statistics = computed<EntityStatistics>(() => {
    const stats: EntityStatistics = {
      totalEntities: entities.value.length,
      activeLicenses: entities.value.filter(e => e.status === 'Active').length,
      expiringSoon: entities.value.filter(e => {
        const days = daysUntilExpiry(e.license.expiryDate)
        return days > 0 && days <= 90 && e.status === 'Active'
      }).length,
      suspended: entities.value.filter(e => e.status === 'Suspended').length,
      byType: {
        Stockbroker: 0,
        'Investment Manager': 0,
        Custodian: 0,
        'Market Operator': 0,
        'Investment Advisor': 0,
        'Portfolio Manager': 0,
      },
      byRiskLevel: {
        High: 0,
        Medium: 0,
        Low: 0,
        Unrated: 0,
      },
      averageComplianceScore: 0,
    }

    let totalComplianceScore = 0
    let entitiesWithScore = 0

    entities.value.forEach(entity => {
      stats.byType[entity.type]++
      if (entity.riskRating) {
        stats.byRiskLevel[entity.riskRating.level]++
      } else {
        stats.byRiskLevel.Unrated++
      }

      if (entity.complianceScore) {
        totalComplianceScore += entity.complianceScore.overallScore
        entitiesWithScore++
      }
    })

    stats.averageComplianceScore = entitiesWithScore > 0 ? Math.round(totalComplianceScore / entitiesWithScore) : 0

    return stats
  })

  /**
   * Calculate days until expiry
   */
  const daysUntilExpiry = (expiryDate: string): number => {
    const today = new Date()
    const expiry = new Date(expiryDate)
    const diffTime = expiry.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  /**
   * Load entities
   */
  const loadEntities = async () => {
    loading.value = true
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      entities.value = [...mockEntities]
    } catch (error) {
      toast.error('Failed to load entities')
      console.error('Error loading entities:', error)
    } finally {
      loading.value = false
    }
  }

  /**
   * Get entity by ID
   */
  const getEntityById = (id: string): Entity | undefined => {
    return entities.value.find(e => e.id === id)
  }

  /**
   * Open entity profile
   */
  const openEntityProfile = (entityId: string) => {
    const entity = getEntityById(entityId)
    if (entity) {
      selectedEntity.value = entity
      showProfileModal.value = true
    } else {
      toast.error('Entity not found')
    }
  }

  /**
   * Close entity profile
   */
  const closeEntityProfile = () => {
    showProfileModal.value = false
    setTimeout(() => {
      selectedEntity.value = null
    }, 300)
  }

  /**
   * Register new entity
   */
  const registerEntity = async (data: EntityRegistrationData): Promise<boolean> => {
    loading.value = true
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      const newId = `ENT-${entities.value.length + 1}`
      const now = new Date().toISOString().split('T')[0]

      const newEntity: Entity = {
        id: newId,
        name: data.name,
        type: data.type,
        status: 'Pending',
        contactInfo: {
          primaryContact: {
            name: data.primaryContactName,
            position: data.primaryContactPosition,
            email: data.primaryContactEmail,
            phone: data.primaryContactPhone,
          },
          complianceOfficer: {
            name: data.complianceOfficerName,
            email: data.complianceOfficerEmail,
            phone: data.complianceOfficerPhone,
          },
          physicalAddress: {
            street: data.physicalAddressStreet,
            city: data.physicalAddressCity,
            province: data.physicalAddressProvince,
            postalCode: data.physicalAddressPostalCode,
            country: 'Zimbabwe',
          },
          website: data.website,
        },
        businessInfo: {
          registrationNumber: data.registrationNumber,
          registrationDate: data.registrationDate,
          taxNumber: data.taxNumber,
          businessType: data.businessType as any,
          numberOfEmployees: data.numberOfEmployees,
          annualRevenue: data.annualRevenue,
          servicesOffered: data.servicesOffered,
          parentCompany: data.parentCompany,
        },
        license: {
          id: `LIC-${newId}`,
          licenseNumber: data.licenseNumber,
          entityId: newId,
          type: data.type,
          issueDate: data.licenseIssueDate,
          expiryDate: data.licenseExpiryDate,
          status: 'Pending',
          conditions: data.licenseConditions,
          renewalCount: 0,
        },
        documents: [],
        notes: [],
        history: [
          {
            id: `HIST-${newId}-1`,
            entityId: newId,
            type: 'Registration',
            title: 'Entity Registered',
            description: 'Entity registration submitted for approval',
            date: now,
            performedBy: 'Brian Guvava',
          },
        ],
        createdAt: now,
        createdBy: 'Brian Guvava',
        updatedAt: now,
        updatedBy: 'Brian Guvava',
      }

      entities.value.unshift(newEntity)
      toast.success('Entity registered successfully')
      showRegistrationForm.value = false
      return true
    } catch (error) {
      toast.error('Failed to register entity')
      console.error('Error registering entity:', error)
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Update entity
   */
  const updateEntity = async (entityId: string, data: EntityUpdateData): Promise<boolean> => {
    loading.value = true
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))

      const index = entities.value.findIndex(e => e.id === entityId)
      if (index === -1) {
        throw new Error('Entity not found')
      }

      const entity = entities.value[index]
      const now = new Date().toISOString().split('T')[0]

      // Update entity fields
      if (data.name) entity.name = data.name
      if (data.type) entity.type = data.type
      
      if (data.contactInfo) {
        if (data.contactInfo.primaryContact) {
          Object.assign(entity.contactInfo.primaryContact, data.contactInfo.primaryContact)
        }
        if (data.contactInfo.complianceOfficer) {
          Object.assign(entity.contactInfo.complianceOfficer, data.contactInfo.complianceOfficer)
        }
      }
      
      if (data.businessInfo) {
        Object.assign(entity.businessInfo, data.businessInfo)
      }

      entity.updatedAt = now
      entity.updatedBy = 'Brian Guvava'

      // Add history event
      entity.history.unshift({
        id: `HIST-${entityId}-${entity.history.length + 1}`,
        entityId,
        type: 'Profile Updated',
        title: 'Entity Profile Updated',
        description: 'Entity information updated',
        date: now,
        performedBy: 'Brian Guvava',
      })

      // Update selected entity if it's open
      if (selectedEntity.value?.id === entityId) {
        selectedEntity.value = { ...entity }
      }

      toast.success('Entity updated successfully')
      return true
    } catch (error) {
      toast.error('Failed to update entity')
      console.error('Error updating entity:', error)
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Suspend or revoke license
   */
  const performLicenseAction = async (entityId: string, data: LicenseActionData): Promise<boolean> => {
    loading.value = true
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))

      const index = entities.value.findIndex(e => e.id === entityId)
      if (index === -1) {
        throw new Error('Entity not found')
      }

      const entity = entities.value[index]

      if (data.action === 'suspend') {
        entity.status = 'Suspended'
        entity.license.status = 'Suspended'
        entity.license.suspensionReason = data.reason
        entity.license.suspensionDate = data.effectiveDate

        entity.history.unshift({
          id: `HIST-${entityId}-${entity.history.length + 1}`,
          entityId,
          type: 'License Suspended',
          title: 'License Suspended',
          description: data.reason,
          date: data.effectiveDate,
          performedBy: data.authorizedBy,
        })

        toast.success('License suspended successfully')
      } else if (data.action === 'revoke') {
        entity.status = 'Revoked'
        entity.license.status = 'Revoked'
        entity.license.revocationReason = data.reason
        entity.license.revocationDate = data.effectiveDate
        entity.license.authorizedBy = data.authorizedBy

        entity.history.unshift({
          id: `HIST-${entityId}-${entity.history.length + 1}`,
          entityId,
          type: 'License Revoked',
          title: 'License Revoked',
          description: data.reason,
          date: data.effectiveDate,
          performedBy: data.authorizedBy,
        })

        toast.success('License revoked successfully')
      }

      entity.updatedAt = new Date().toISOString().split('T')[0]
      entity.updatedBy = data.authorizedBy

      // Update selected entity if it's open
      if (selectedEntity.value?.id === entityId) {
        selectedEntity.value = { ...entity }
      }

      return true
    } catch (error) {
      toast.error(`Failed to ${data.action} license`)
      console.error(`Error ${data.action}ing license:`, error)
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Add note to entity
   */
  const addNote = async (entityId: string, note: Omit<EntityNote, 'id' | 'entityId' | 'createdAt' | 'createdBy'>): Promise<boolean> => {
    loading.value = true
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300))

      const index = entities.value.findIndex(e => e.id === entityId)
      if (index === -1) {
        throw new Error('Entity not found')
      }

      const entity = entities.value[index]
      const now = new Date().toISOString()

      const newNote: EntityNote = {
        id: `NOTE-${entityId}-${entity.notes.length + 1}`,
        entityId,
        ...note,
        createdAt: now,
        createdBy: 'Brian Guvava',
      }

      entity.notes.unshift(newNote)

      // Update selected entity if it's open
      if (selectedEntity.value?.id === entityId) {
        selectedEntity.value = { ...entity }
      }

      toast.success('Note added successfully')
      return true
    } catch (error) {
      toast.error('Failed to add note')
      console.error('Error adding note:', error)
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Set filters
   */
  const setFilters = (newFilters: Partial<EntityFilters>) => {
    filters.value = { ...filters.value, ...newFilters }
  }

  /**
   * Reset filters
   */
  const resetFilters = () => {
    filters.value = {
      search: '',
      types: [],
      statuses: [],
      riskLevels: [],
      expiringWithinDays: undefined,
      hasViolations: undefined,
    }
  }

  /**
   * Open registration form
   */
  const openRegistrationForm = () => {
    showRegistrationForm.value = true
  }

  /**
   * Close registration form
   */
  const closeRegistrationForm = () => {
    showRegistrationForm.value = false
  }

  return {
    // State
    entities,
    loading,
    selectedEntity,
    showProfileModal,
    showRegistrationForm,
    filters,

    // Computed
    entityListItems,
    statistics,

    // Methods
    loadEntities,
    getEntityById,
    openEntityProfile,
    closeEntityProfile,
    registerEntity,
    updateEntity,
    performLicenseAction,
    addNote,
    setFilters,
    resetFilters,
    openRegistrationForm,
    closeRegistrationForm,
  }
}
