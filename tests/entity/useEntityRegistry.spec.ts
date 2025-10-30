/**
 * useEntityRegistry Composable Tests
 * Tests state management, CRUD operations, and filtering
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useEntityRegistry } from '@/composables/useEntityRegistry'
import type { EntityRegistrationData, LicenseActionData } from '@/types/entity'

describe('useEntityRegistry Composable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Initial State', () => {
    it('should initialize with loading false', () => {
      const { loading } = useEntityRegistry()
      expect(loading.value).toBe(false)
    })

    it('should initialize with no selected entity', () => {
      const { selectedEntity } = useEntityRegistry()
      expect(selectedEntity.value).toBeNull()
    })

    it('should initialize with modals closed', () => {
      const { showProfileModal, showRegistrationForm } = useEntityRegistry()
      expect(showProfileModal.value).toBe(false)
      expect(showRegistrationForm.value).toBe(false)
    })

    it('should initialize with empty filters', () => {
      const { filters } = useEntityRegistry()
      expect(filters.value.search).toBe('')
      expect(filters.value.types).toEqual([])
      expect(filters.value.statuses).toEqual([])
      expect(filters.value.riskLevels).toEqual([])
    })
  })

  describe('Load Entities', () => {
    it('should load entities successfully', async () => {
      const { loadEntities, entityListItems, loading } = useEntityRegistry()

      expect(loading.value).toBe(false)
      const loadPromise = loadEntities()
      expect(loading.value).toBe(true)

      await loadPromise

      expect(loading.value).toBe(false)
      expect(entityListItems.value.length).toBeGreaterThan(0)
    })

    it('should populate statistics after loading', async () => {
      const { loadEntities, statistics } = useEntityRegistry()

      await loadEntities()

      expect(statistics.value.totalEntities).toBeGreaterThan(0)
      expect(statistics.value.activeLicenses).toBeGreaterThanOrEqual(0)
      expect(statistics.value.expiringSoon).toBeGreaterThanOrEqual(0)
      expect(statistics.value.suspended).toBeGreaterThanOrEqual(0)
    })
  })

  describe('Register Entity', () => {
    it('should register a new entity', async () => {
      const { registerEntity, loadEntities, entityListItems } = useEntityRegistry()
      await loadEntities()
      
      const initialCount = entityListItems.value.length

      const newEntityData: EntityRegistrationData = {
        name: 'Test Entity Ltd',
        type: 'Stockbroker',
        registrationNumber: 'REG/TE/000001',
        registrationDate: '2024-01-01',
        taxNumber: 'TAX123456',
        businessType: 'Private Company',
        primaryContactName: 'John Doe',
        primaryContactPosition: 'CEO',
        primaryContactEmail: 'john@test.com',
        primaryContactPhone: '+263 71 123456',
        complianceOfficerName: 'Jane Smith',
        complianceOfficerEmail: 'jane@test.com',
        complianceOfficerPhone: '+263 71 654321',
        physicalAddressStreet: '123 Test Street',
        physicalAddressCity: 'Harare',
        physicalAddressProvince: 'Harare',
        physicalAddressPostalCode: '00263',
        mailingAddressSame: true,
        numberOfEmployees: 50,
        servicesOffered: ['Trading', 'Advisory'],
        licenseNumber: 'ZSE/TE/2024/0001',
        licenseIssueDate: '2024-01-01',
        licenseExpiryDate: '2025-01-01',
        licenseConditions: [],
        documents: [],
      }

      const result = await registerEntity(newEntityData)

      expect(result).toBe(true)
      expect(entityListItems.value.length).toBe(initialCount + 1)
      
      const newEntity = entityListItems.value.find(e => e.name === 'Test Entity Ltd')
      expect(newEntity).toBeDefined()
      expect(newEntity?.type).toBe('Stockbroker')
      expect(newEntity?.status).toBe('Pending')
    })
  })

  describe('Update Entity', () => {
    it('should update an existing entity', async () => {
      const { loadEntities, updateEntity, entityListItems } = useEntityRegistry()
      await loadEntities()

      const entityToUpdate = entityListItems.value[0]
      const originalName = entityToUpdate.name

      const updateData = {
        name: 'Updated Entity Name',
      }

      const result = await updateEntity(entityToUpdate.id, updateData)

      expect(result).toBe(true)
      
      const updatedEntity = entityListItems.value.find(e => e.id === entityToUpdate.id)
      expect(updatedEntity?.name).toBe('Updated Entity Name')
      expect(updatedEntity?.name).not.toBe(originalName)
    })
  })

  describe('License Actions', () => {
    it('should suspend a license', async () => {
      const { loadEntities, performLicenseAction, entityListItems } = useEntityRegistry()
      await loadEntities()

      const activeEntity = entityListItems.value.find(e => e.status === 'Active')
      if (!activeEntity) {
        console.warn('No active entity found for suspend test')
        return
      }

      const actionData: LicenseActionData = {
        action: 'suspend',
        reason: 'Test suspension',
        effectiveDate: new Date().toISOString(),
        authorizedBy: 'Test Admin',
      }

      const result = await performLicenseAction(activeEntity.id, actionData)

      expect(result).toBe(true)
      
      const suspendedEntity = entityListItems.value.find(e => e.id === activeEntity.id)
      expect(suspendedEntity?.status).toBe('Suspended')
    })

    it('should revoke a license', async () => {
      const { loadEntities, performLicenseAction, entityListItems } = useEntityRegistry()
      await loadEntities()

      const activeEntity = entityListItems.value.find(e => e.status === 'Active')
      if (!activeEntity) {
        console.warn('No active entity found for revoke test')
        return
      }

      const actionData: LicenseActionData = {
        action: 'revoke',
        reason: 'Test revocation',
        effectiveDate: new Date().toISOString(),
        authorizedBy: 'Test Admin',
      }

      const result = await performLicenseAction(activeEntity.id, actionData)

      expect(result).toBe(true)
      
      const revokedEntity = entityListItems.value.find(e => e.id === activeEntity.id)
      expect(revokedEntity?.status).toBe('Revoked')
    })
  })

  describe('Filtering', () => {
    it('should filter by search term', async () => {
      const { loadEntities, setFilters, entityListItems } = useEntityRegistry()
      await loadEntities()

      const totalCount = entityListItems.value.length
      const firstEntityName = entityListItems.value[0].name

      setFilters({ search: firstEntityName, types: [], statuses: [], riskLevels: [] })

      expect(entityListItems.value.length).toBeLessThan(totalCount)
      expect(entityListItems.value.some(e => e.name.includes(firstEntityName))).toBe(true)
    })

    it('should filter by entity type', async () => {
      const { loadEntities, setFilters, entityListItems } = useEntityRegistry()
      await loadEntities()

      setFilters({ search: '', types: ['Stockbroker'], statuses: [], riskLevels: [] })

      entityListItems.value.forEach(entity => {
        expect(entity.type).toBe('Stockbroker')
      })
    })

    it('should filter by status', async () => {
      const { loadEntities, setFilters, entityListItems } = useEntityRegistry()
      await loadEntities()

      setFilters({ search: '', types: [], statuses: ['Active'], riskLevels: [] })

      entityListItems.value.forEach(entity => {
        expect(entity.status).toBe('Active')
      })
    })

    it('should filter by risk level', async () => {
      const { loadEntities, setFilters, entityListItems } = useEntityRegistry()
      await loadEntities()

      setFilters({ search: '', types: [], statuses: [], riskLevels: ['High'] })

      entityListItems.value.forEach(entity => {
        expect(entity.riskLevel).toBe('High')
      })
    })

    it('should reset filters', async () => {
      const { loadEntities, setFilters, resetFilters, entityListItems, filters } = useEntityRegistry()
      await loadEntities()

      const totalCount = entityListItems.value.length

      setFilters({ search: 'test', types: ['Stockbroker'], statuses: ['Active'], riskLevels: [] })
      expect(entityListItems.value.length).toBeLessThan(totalCount)

      resetFilters()

      expect(filters.value.search).toBe('')
      expect(filters.value.types).toEqual([])
      expect(filters.value.statuses).toEqual([])
      expect(entityListItems.value.length).toBe(totalCount)
    })
  })

  describe('Modal Controls', () => {
    it('should open entity profile', async () => {
      const { loadEntities, openEntityProfile, showProfileModal, selectedEntity, entityListItems } = useEntityRegistry()
      await loadEntities()

      const entityId = entityListItems.value[0].id

      openEntityProfile(entityId)

      expect(showProfileModal.value).toBe(true)
      expect(selectedEntity.value).not.toBeNull()
      expect(selectedEntity.value?.id).toBe(entityId)
    })

    it('should close entity profile', () => {
      const { openRegistrationForm, closeEntityProfile, showProfileModal, selectedEntity } = useEntityRegistry()

      openRegistrationForm()
      closeEntityProfile()

      expect(showProfileModal.value).toBe(false)
      
      // Wait for timeout to clear selectedEntity
      setTimeout(() => {
        expect(selectedEntity.value).toBeNull()
      }, 400)
    })

    it('should open registration form', () => {
      const { openRegistrationForm, showRegistrationForm } = useEntityRegistry()

      openRegistrationForm()

      expect(showRegistrationForm.value).toBe(true)
    })

    it('should close registration form', () => {
      const { openRegistrationForm, closeRegistrationForm, showRegistrationForm } = useEntityRegistry()

      openRegistrationForm()
      closeRegistrationForm()

      expect(showRegistrationForm.value).toBe(false)
    })
  })

  describe('Statistics Calculations', () => {
    it('should calculate correct statistics', async () => {
      const { loadEntities, statistics, entityListItems } = useEntityRegistry()
      await loadEntities()

      expect(statistics.value.totalEntities).toBe(entityListItems.value.length)
      
      const activeCount = entityListItems.value.filter(e => e.status === 'Active').length
      expect(statistics.value.activeLicenses).toBe(activeCount)

      const suspendedCount = entityListItems.value.filter(e => e.status === 'Suspended').length
      expect(statistics.value.suspended).toBe(suspendedCount)
    })

    it('should calculate entity type distribution', async () => {
      const { loadEntities, statistics } = useEntityRegistry()
      await loadEntities()

      const totalByType = Object.values(statistics.value.byType).reduce((sum, count) => sum + count, 0)
      expect(totalByType).toBe(statistics.value.totalEntities)
    })

    it('should calculate risk level distribution', async () => {
      const { loadEntities, statistics } = useEntityRegistry()
      await loadEntities()

      const totalByRisk = Object.values(statistics.value.byRiskLevel).reduce((sum, count) => sum + count, 0)
      expect(totalByRisk).toBe(statistics.value.totalEntities)
    })

    it('should calculate average compliance score', async () => {
      const { loadEntities, statistics } = useEntityRegistry()
      await loadEntities()

      expect(statistics.value.averageComplianceScore).toBeGreaterThanOrEqual(0)
      expect(statistics.value.averageComplianceScore).toBeLessThanOrEqual(100)
    })
  })
})
