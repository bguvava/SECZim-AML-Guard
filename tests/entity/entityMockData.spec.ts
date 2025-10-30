/**
 * Entity Mock Data Tests
 * Validates the integrity and structure of mock entity data
 */

import { describe, it, expect } from 'vitest'
import { mockEntities } from '@/data/entityMockData'
import type { Entity, EntityType, EntityStatus, RiskLevel } from '@/types/entity'

describe('Entity Mock Data', () => {
  describe('Data Integrity', () => {
    it('should have at least 50 entities', () => {
      expect(mockEntities.length).toBeGreaterThanOrEqual(50)
    })

    it('should have unique entity IDs', () => {
      const ids = mockEntities.map(e => e.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(mockEntities.length)
    })

    it('should have unique license numbers', () => {
      const licenseNumbers = mockEntities.map(e => e.license.licenseNumber)
      const uniqueLicenseNumbers = new Set(licenseNumbers)
      expect(uniqueLicenseNumbers.size).toBe(mockEntities.length)
    })

    it('should have unique registration numbers', () => {
      const regNumbers = mockEntities.map(e => e.businessInfo.registrationNumber)
      const uniqueRegNumbers = new Set(regNumbers)
      expect(uniqueRegNumbers.size).toBe(mockEntities.length)
    })
  })

  describe('Entity Structure', () => {
    it('should have all required properties', () => {
      mockEntities.forEach((entity: Entity) => {
        // Basic properties
        expect(entity).toHaveProperty('id')
        expect(entity).toHaveProperty('name')
        expect(entity).toHaveProperty('type')
        expect(entity).toHaveProperty('status')
        
        // Contact Info
        expect(entity).toHaveProperty('contactInfo')
        expect(entity.contactInfo).toHaveProperty('primaryContact')
        expect(entity.contactInfo).toHaveProperty('complianceOfficer')
        expect(entity.contactInfo).toHaveProperty('physicalAddress')
        
        // Business Info
        expect(entity).toHaveProperty('businessInfo')
        expect(entity.businessInfo).toHaveProperty('registrationNumber')
        expect(entity.businessInfo).toHaveProperty('taxNumber')
        
        // License
        expect(entity).toHaveProperty('license')
        expect(entity.license).toHaveProperty('licenseNumber')
        expect(entity.license).toHaveProperty('issueDate')
        expect(entity.license).toHaveProperty('expiryDate')
        
        // Arrays
        expect(entity).toHaveProperty('documents')
        expect(Array.isArray(entity.documents)).toBe(true)
        expect(entity).toHaveProperty('notes')
        expect(Array.isArray(entity.notes)).toBe(true)
        expect(entity).toHaveProperty('history')
        expect(Array.isArray(entity.history)).toBe(true)
        
        // Timestamps
        expect(entity).toHaveProperty('createdAt')
        expect(entity).toHaveProperty('updatedAt')
      })
    })

    it('should have valid entity types', () => {
      const validTypes: EntityType[] = [
        'Stockbroker',
        'Investment Manager',
        'Custodian',
        'Market Operator',
        'Investment Advisor',
        'Portfolio Manager'
      ]

      mockEntities.forEach(entity => {
        expect(validTypes).toContain(entity.type)
      })
    })

    it('should have valid entity statuses', () => {
      const validStatuses: EntityStatus[] = ['Active', 'Pending', 'Suspended', 'Revoked', 'Expired']

      mockEntities.forEach(entity => {
        expect(validStatuses).toContain(entity.status)
      })
    })

    it('should have valid risk levels', () => {
      const validRiskLevels: RiskLevel[] = ['High', 'Medium', 'Low', 'Unrated']

      mockEntities.forEach(entity => {
        if (entity.riskRating) {
          expect(validRiskLevels).toContain(entity.riskRating.level)
        }
      })
    })
  })

  describe('Data Validation', () => {
    it('should have valid email addresses', () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

      mockEntities.forEach(entity => {
        expect(emailRegex.test(entity.contactInfo.primaryContact.email)).toBe(true)
        expect(emailRegex.test(entity.contactInfo.complianceOfficer.email)).toBe(true)
      })
    })

    it('should have valid phone numbers', () => {
      const phoneRegex = /^\+263\s\d{2}\s\d{6}$/

      mockEntities.forEach(entity => {
        expect(phoneRegex.test(entity.contactInfo.primaryContact.phone)).toBe(true)
        expect(phoneRegex.test(entity.contactInfo.complianceOfficer.phone)).toBe(true)
      })
    })

    it('should have valid license numbers', () => {
      const licenseRegex = /^ZSE\/[A-Z]{2}\/\d{4}\/\d{4}$/

      mockEntities.forEach(entity => {
        expect(licenseRegex.test(entity.license.licenseNumber)).toBe(true)
      })
    })

    it('should have valid registration numbers', () => {
      const regRegex = /^REG\/[A-Z]{2}\/\d{6}$/

      mockEntities.forEach(entity => {
        expect(regRegex.test(entity.businessInfo.registrationNumber)).toBe(true)
      })
    })

    it('should have compliance scores between 0 and 100', () => {
      mockEntities.forEach(entity => {
        if (entity.complianceScore) {
          expect(entity.complianceScore.overallScore).toBeGreaterThanOrEqual(0)
          expect(entity.complianceScore.overallScore).toBeLessThanOrEqual(100)
        }
      })
    })

    it('should have risk scores between 0 and 100', () => {
      mockEntities.forEach(entity => {
        if (entity.riskRating) {
          expect(entity.riskRating.score).toBeGreaterThanOrEqual(0)
          expect(entity.riskRating.score).toBeLessThanOrEqual(100)
        }
      })
    })

    it('should have positive number of employees', () => {
      mockEntities.forEach(entity => {
        expect(entity.businessInfo.numberOfEmployees).toBeGreaterThan(0)
      })
    })

    it('should have issue date before expiry date', () => {
      mockEntities.forEach(entity => {
        const issueDate = new Date(entity.license.issueDate)
        const expiryDate = new Date(entity.license.expiryDate)
        expect(issueDate.getTime()).toBeLessThan(expiryDate.getTime())
      })
    })
  })

  describe('Data Distribution', () => {
    it('should have entities of all types', () => {
      const types = new Set(mockEntities.map(e => e.type))
      expect(types.size).toBeGreaterThanOrEqual(5)
    })

    it('should have entities with different statuses', () => {
      const statuses = new Set(mockEntities.map(e => e.status))
      expect(statuses.size).toBeGreaterThanOrEqual(3)
    })

    it('should have entities with different risk levels', () => {
      const riskLevels = new Set(mockEntities.filter(e => e.riskRating).map(e => e.riskRating!.level))
      expect(riskLevels.size).toBeGreaterThanOrEqual(3)
    })

    it('should have documents for most entities', () => {
      const entitiesWithDocs = mockEntities.filter(e => e.documents.length > 0)
      expect(entitiesWithDocs.length).toBeGreaterThan(mockEntities.length * 0.8)
    })

    it('should have notes for many entities', () => {
      const entitiesWithNotes = mockEntities.filter(e => e.notes.length > 0)
      expect(entitiesWithNotes.length).toBeGreaterThan(mockEntities.length * 0.5)
    })

    it('should have history events for all entities', () => {
      mockEntities.forEach(entity => {
        expect(entity.history.length).toBeGreaterThan(0)
      })
    })
  })
})
