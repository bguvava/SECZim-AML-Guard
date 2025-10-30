/**
 * Entity Registry Mock Data
 * Realistic test data for 50+ entities with comprehensive details
 */

import type {
  Entity,
  EntityType,
  EntityStatus,
  RiskLevel,
  License,
  ComplianceScore,
  RiskRating,
  EntityDocument,
  EntityNote,
  HistoryEvent,
  ContactInfo,
  BusinessInfo,
  EntityStatistics,
  EntityListItem,
} from '@/types/entity'

/**
 * Generate a random date within a range
 */
const randomDate = (start: Date, end: Date): string => {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
  return date.toISOString().split('T')[0]
}

/**
 * Generate days until expiry
 */
const daysUntilExpiry = (expiryDate: string): number => {
  const today = new Date()
  const expiry = new Date(expiryDate)
  const diffTime = expiry.getTime() - today.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

/**
 * Zimbabwe Company Names
 */
const companyNames = [
  'First Securities Zimbabwe',
  'Capital Markets Investment Managers',
  'Harare Stockbrokers Limited',
  'Zimbabwe Asset Management',
  'Bulawayo Investment Partners',
  'Mutual Trust Securities',
  'African Century Securities',
  'Victoria Falls Capital',
  'Great Zimbabwe Investments',
  'Kariba Securities Limited',
  'Chinhoyi Wealth Management',
  'Masvingo Portfolio Managers',
  'Gweru Investment Advisors',
  'Mutare Capital Holdings',
  'ZimGold Securities',
  'Southern Cross Brokers',
  'Zambezi Asset Managers',
  'Limpopo Investment Trust',
  'Matabeleland Securities',
  'Mashonaland Investment Group',
  'Zimbabwe Financial Services',
  'Highfield Capital Partners',
  'Borrowdale Wealth Advisors',
  'Eastlea Securities Limited',
  'Avondale Investment Managers',
  'Belvedere Capital Trust',
  'Mount Pleasant Holdings',
  'Greendale Securities',
  'Marlborough Investment Partners',
  'Northend Capital Managers',
  'Southerton Securities Group',
  'Chitungwiza Financial Services',
  'Norton Investment Holdings',
  'Ruwa Capital Partners',
  'Epworth Securities Limited',
  'Bindura Asset Managers',
  'Kadoma Investment Trust',
  'Kwekwe Securities Group',
  'Redcliff Capital Holdings',
  'Shurugwi Investment Partners',
  'Zvishavane Securities',
  'Chegutu Capital Managers',
  'Chivhu Investment Trust',
  'Gokwe Securities Limited',
  'Hwange Asset Managers',
  'Karoi Investment Holdings',
  'Lupane Capital Partners',
  'Makonde Securities Group',
  'Mhondoro Investment Trust',
  'Mvuma Capital Managers',
  'Nyanga Securities Limited',
  'Rusape Asset Managers',
  'Shamva Investment Holdings',
  'Triangle Capital Partners',
  'Chipinge Securities Group',
]

/**
 * Generate License
 */
const generateLicense = (entityId: string, type: EntityType, status: EntityStatus): License => {
  const issueYear = 2018 + Math.floor(Math.random() * 6)
  const issueDate = `${issueYear}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`
  
  let expiryYear = issueYear + 3
  if (status === 'Expired') {
    expiryYear = 2023
  } else if (status === 'Active' && Math.random() > 0.7) {
    expiryYear = 2025 // Some expiring soon
  }
  
  const expiryDate = `${expiryYear}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`

  const conditions = [
    'Must maintain minimum capital requirements',
    'Must submit quarterly compliance reports',
    'Must maintain professional indemnity insurance',
    'Must have qualified compliance officer',
  ]

  if (Math.random() > 0.5) {
    conditions.push('Must conduct annual AML training for staff')
  }

  const license: License = {
    id: `LIC-${entityId}`,
    licenseNumber: `ZSE/${type.substring(0, 2).toUpperCase()}/${String(1000 + Math.floor(Math.random() * 9000))}/${issueYear}`,
    entityId,
    type,
    issueDate,
    expiryDate,
    status,
    conditions,
    renewalCount: Math.floor(Math.random() * 3),
  }

  if (license.renewalCount > 0) {
    license.lastRenewalDate = randomDate(new Date(issueDate), new Date())
  }

  if (status === 'Suspended') {
    license.suspensionReason = 'Failure to submit quarterly compliance reports'
    license.suspensionDate = randomDate(new Date('2025-01-01'), new Date())
  }

  if (status === 'Revoked') {
    license.revocationReason = 'Serious compliance violations detected during inspection'
    license.revocationDate = randomDate(new Date('2024-06-01'), new Date('2025-01-01'))
    license.authorizedBy = 'Director General - SECZim'
  }

  return license
}

/**
 * Generate Compliance Score
 */
const generateComplianceScore = (entityId: string, riskLevel: RiskLevel): ComplianceScore => {
  let baseScore = 75

  if (riskLevel === 'Low') baseScore = 85 + Math.floor(Math.random() * 15)
  else if (riskLevel === 'Medium') baseScore = 60 + Math.floor(Math.random() * 25)
  else if (riskLevel === 'High') baseScore = 30 + Math.floor(Math.random() * 40)

  const reporting = Math.floor(baseScore * 0.25 + Math.random() * 5)
  const recordKeeping = Math.floor(baseScore * 0.25 + Math.random() * 5)
  const training = Math.floor(baseScore * 0.25 + Math.random() * 5)
  const riskManagement = Math.floor(baseScore * 0.25 + Math.random() * 5)

  const overallScore = Math.min(100, reporting + recordKeeping + training + riskManagement)

  const trends: Array<'improving' | 'stable' | 'declining'> = ['improving', 'stable', 'declining']
  const trend = trends[Math.floor(Math.random() * trends.length)]

  return {
    entityId,
    overallScore,
    breakdown: {
      reporting: Math.min(25, reporting),
      recordKeeping: Math.min(25, recordKeeping),
      training: Math.min(25, training),
      riskManagement: Math.min(25, riskManagement),
    },
    lastAssessmentDate: randomDate(new Date('2025-01-01'), new Date()),
    assessedBy: Math.random() > 0.5 ? 'Brian Guvava' : 'Samkheliso Dube',
    trend,
  }
}

/**
 * Generate Risk Rating
 */
const generateRiskRating = (entityId: string, level: RiskLevel): RiskRating => {
  const scores = {
    Low: 15 + Math.floor(Math.random() * 20),
    Medium: 40 + Math.floor(Math.random() * 25),
    High: 70 + Math.floor(Math.random() * 30),
    Unrated: 0,
  }

  const allFactors = [
    'Transaction volume',
    'Geographic exposure',
    'Customer risk profile',
    'Product complexity',
    'Historical compliance issues',
    'Management quality',
    'Internal controls adequacy',
    'AML/CFT framework',
    'Staff training levels',
    'Technology infrastructure',
  ]

  const numFactors = 3 + Math.floor(Math.random() * 4)
  const factors = allFactors.sort(() => 0.5 - Math.random()).slice(0, numFactors)

  const mitigationMeasures = [
    'Enhanced due diligence procedures',
    'Increased monitoring frequency',
    'Regular compliance training',
    'Quarterly risk assessments',
  ]

  return {
    entityId,
    level,
    score: scores[level],
    factors,
    assessmentDate: randomDate(new Date('2024-09-01'), new Date()),
    assessedBy: Math.random() > 0.5 ? 'Brian Guvava' : 'Samkheliso Dube',
    nextReviewDate: randomDate(new Date(), new Date('2026-12-31')),
    mitigationMeasures: level !== 'Low' ? mitigationMeasures.slice(0, 2 + Math.floor(Math.random() * 2)) : [],
  }
}

/**
 * Generate Contact Info
 */
const generateContactInfo = (companyName: string): ContactInfo => {
  const firstNames = ['John', 'Sarah', 'Michael', 'Emma', 'David', 'Lisa', 'Robert', 'Mary', 'James', 'Jennifer']
  const lastNames = ['Moyo', 'Ncube', 'Sibanda', 'Ndlovu', 'Dube', 'Mpofu', 'Mutasa', 'Chikwanha', 'Guvava', 'Zhou']

  const primaryName = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`
  const complianceName = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`

  const streets = ['Samora Machel Ave', 'Jason Moyo St', 'Second Street', 'Kwame Nkrumah Ave', 'Leopold Takawira St']
  const cities = ['Harare', 'Bulawayo', 'Mutare', 'Gweru', 'Kwekwe']
  const provinces = ['Harare', 'Bulawayo', 'Manicaland', 'Midlands', 'Mashonaland']

  return {
    primaryContact: {
      name: primaryName,
      position: Math.random() > 0.5 ? 'Managing Director' : 'Chief Executive Officer',
      email: `${primaryName.toLowerCase().replace(' ', '.')}@${companyName.toLowerCase().replace(/\s+/g, '')}.co.zw`,
      phone: `+263 ${Math.random() > 0.5 ? '24' : '29'} ${Math.floor(Math.random() * 900000 + 100000)}`,
    },
    complianceOfficer: {
      name: complianceName,
      email: `${complianceName.toLowerCase().replace(' ', '.')}@${companyName.toLowerCase().replace(/\s+/g, '')}.co.zw`,
      phone: `+263 ${Math.random() > 0.5 ? '24' : '29'} ${Math.floor(Math.random() * 900000 + 100000)}`,
    },
    physicalAddress: {
      street: `${Math.floor(Math.random() * 200 + 1)} ${streets[Math.floor(Math.random() * streets.length)]}`,
      city: cities[Math.floor(Math.random() * cities.length)],
      province: provinces[Math.floor(Math.random() * provinces.length)],
      postalCode: `P.O. Box ${Math.floor(Math.random() * 10000 + 1000)}`,
      country: 'Zimbabwe',
    },
    website: `https://www.${companyName.toLowerCase().replace(/\s+/g, '')}.co.zw`,
  }
}

/**
 * Generate Business Info
 */
const generateBusinessInfo = (type: EntityType): BusinessInfo => {
  const services = {
    Stockbroker: ['Securities Trading', 'Investment Advisory', 'Portfolio Management', 'Corporate Finance'],
    'Investment Manager': ['Asset Management', 'Portfolio Management', 'Investment Research', 'Wealth Management'],
    Custodian: ['Securities Custody', 'Settlement Services', 'Asset Servicing', 'Corporate Actions'],
    'Market Operator': ['Exchange Operations', 'Trading Platform', 'Market Surveillance', 'Listings Management'],
    'Investment Advisor': ['Investment Advisory', 'Financial Planning', 'Wealth Management', 'Risk Advisory'],
    'Portfolio Manager': ['Portfolio Management', 'Asset Allocation', 'Performance Reporting', 'Risk Management'],
  }

  return {
    registrationNumber: `REG/${type.substring(0, 2).toUpperCase()}/${Math.floor(Math.random() * 900000 + 100000)}`,
    registrationDate: randomDate(new Date('2010-01-01'), new Date('2022-12-31')),
    taxNumber: `${Math.floor(Math.random() * 90000000 + 10000000)}`,
    businessType: Math.random() > 0.7 ? 'Public Limited' : 'Private Limited',
    numberOfEmployees: 10 + Math.floor(Math.random() * 190),
    annualRevenue: 500000 + Math.floor(Math.random() * 9500000),
    servicesOffered: services[type].slice(0, 2 + Math.floor(Math.random() * 3)),
  }
}

/**
 * Generate Documents
 */
const generateDocuments = (entityId: string): EntityDocument[] => {
  const docs: EntityDocument[] = []
  const docTypes = ['License', 'Certificate', 'Financial Statement', 'Audit Report', 'Compliance Report']

  for (let i = 0; i < 3 + Math.floor(Math.random() * 5); i++) {
    const docType = docTypes[Math.floor(Math.random() * docTypes.length)]
    docs.push({
      id: `DOC-${entityId}-${i + 1}`,
      entityId,
      name: `${docType}_${2023 + Math.floor(Math.random() * 2)}.pdf`,
      type: docType as any,
      fileUrl: `/uploads/entities/${entityId}/${docType.toLowerCase().replace(' ', '_')}_${i + 1}.pdf`,
      fileSize: 1024 * (100 + Math.floor(Math.random() * 900)),
      mimeType: 'application/pdf',
      uploadDate: randomDate(new Date('2024-01-01'), new Date()),
      uploadedBy: Math.random() > 0.5 ? 'Brian Guvava' : 'Samkheliso Dube',
      tags: ['compliance', 'regulatory'],
    })
  }

  return docs
}

/**
 * Generate Notes
 */
const generateNotes = (entityId: string): EntityNote[] => {
  const notes: EntityNote[] = []
  const noteContents = [
    'Entity demonstrates good compliance practices',
    'Recent inspection revealed minor recordkeeping issues',
    'Management has been responsive to regulatory requests',
    'Requires follow-up on AML training completion',
    'Submitted all quarterly reports on time this year',
  ]

  for (let i = 0; i < 2 + Math.floor(Math.random() * 3); i++) {
    notes.push({
      id: `NOTE-${entityId}-${i + 1}`,
      entityId,
      content: noteContents[Math.floor(Math.random() * noteContents.length)],
      createdAt: randomDate(new Date('2024-01-01'), new Date()),
      createdBy: Math.random() > 0.5 ? 'Brian Guvava' : 'Samkheliso Dube',
      category: ['General', 'Compliance', 'Risk', 'Inspection'][Math.floor(Math.random() * 4)] as any,
      isConfidential: Math.random() > 0.7,
    })
  }

  return notes
}

/**
 * Generate History
 */
const generateHistory = (entityId: string, license: License): HistoryEvent[] => {
  const history: HistoryEvent[] = [
    {
      id: `HIST-${entityId}-1`,
      entityId,
      type: 'Registration',
      title: 'Entity Registered',
      description: 'Entity successfully registered with SECZim',
      date: license.issueDate,
      performedBy: 'System',
    },
    {
      id: `HIST-${entityId}-2`,
      entityId,
      type: 'License Issued',
      title: 'License Issued',
      description: `${license.type} license issued`,
      date: license.issueDate,
      performedBy: 'Brian Guvava',
    },
  ]

  if (license.renewalCount > 0 && license.lastRenewalDate) {
    history.push({
      id: `HIST-${entityId}-3`,
      entityId,
      type: 'License Renewed',
      title: 'License Renewed',
      description: 'License renewed for 3 years',
      date: license.lastRenewalDate,
      performedBy: 'Samkheliso Dube',
    })
  }

  // Add some inspections
  for (let i = 0; i < 1 + Math.floor(Math.random() * 2); i++) {
    history.push({
      id: `HIST-${entityId}-INSP-${i + 1}`,
      entityId,
      type: 'Inspection',
      title: 'On-site Inspection',
      description: 'Routine compliance inspection conducted',
      date: randomDate(new Date('2024-01-01'), new Date()),
      performedBy: 'Brian Guvava',
    })
  }

  if (license.status === 'Suspended' && license.suspensionDate) {
    history.push({
      id: `HIST-${entityId}-SUSP`,
      entityId,
      type: 'License Suspended',
      title: 'License Suspended',
      description: license.suspensionReason || 'License suspended',
      date: license.suspensionDate,
      performedBy: 'Director General',
    })
  }

  if (license.status === 'Revoked' && license.revocationDate) {
    history.push({
      id: `HIST-${entityId}-REV`,
      entityId,
      type: 'License Revoked',
      title: 'License Revoked',
      description: license.revocationReason || 'License revoked',
      date: license.revocationDate,
      performedBy: 'Director General',
    })
  }

  return history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

/**
 * Generate Single Entity
 */
const generateEntity = (id: string, name: string, type: EntityType, status: EntityStatus, riskLevel: RiskLevel): Entity => {
  const entityId = `ENT-${id}`
  const license = generateLicense(entityId, type, status)
  const contactInfo = generateContactInfo(name)
  const businessInfo = generateBusinessInfo(type)
  const complianceScore = status !== 'Revoked' ? generateComplianceScore(entityId, riskLevel) : undefined
  const riskRating = status !== 'Revoked' ? generateRiskRating(entityId, riskLevel) : undefined
  const documents = generateDocuments(entityId)
  const notes = generateNotes(entityId)
  const history = generateHistory(entityId, license)

  return {
    id: entityId,
    name,
    type,
    status,
    contactInfo,
    businessInfo,
    license,
    complianceScore,
    riskRating,
    documents,
    notes,
    history,
    createdAt: license.issueDate,
    createdBy: 'Brian Guvava',
    updatedAt: randomDate(new Date('2024-01-01'), new Date()),
    updatedBy: Math.random() > 0.5 ? 'Brian Guvava' : 'Samkheliso Dube',
    lastInspectionDate: randomDate(new Date('2024-01-01'), new Date()),
    nextInspectionDate: randomDate(new Date(), new Date('2026-12-31')),
  }
}

/**
 * Mock Entities Data (55 entities)
 */
export const mockEntities: Entity[] = []

const entityTypes: EntityType[] = ['Stockbroker', 'Investment Manager', 'Custodian', 'Market Operator', 'Investment Advisor', 'Portfolio Manager']
const statuses: EntityStatus[] = ['Active', 'Active', 'Active', 'Active', 'Active', 'Active', 'Active', 'Pending', 'Suspended', 'Expired']
const riskLevels: RiskLevel[] = ['Low', 'Low', 'Low', 'Medium', 'Medium', 'Medium', 'High']

for (let i = 0; i < 55; i++) {
  const type = entityTypes[Math.floor(Math.random() * entityTypes.length)]
  const status = statuses[Math.floor(Math.random() * statuses.length)]
  const riskLevel = riskLevels[Math.floor(Math.random() * riskLevels.length)]
  const name = companyNames[i % companyNames.length]

  mockEntities.push(generateEntity(String(i + 1), name, type, status, riskLevel))
}

/**
 * Get Entity List Items
 */
export const getEntityListItems = (): EntityListItem[] => {
  return mockEntities.map(entity => ({
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
}

/**
 * Get Entity Statistics
 */
export const getEntityStatistics = (): EntityStatistics => {
  const stats: EntityStatistics = {
    totalEntities: mockEntities.length,
    activeLicenses: mockEntities.filter(e => e.status === 'Active').length,
    expiringSoon: mockEntities.filter(e => {
      const days = daysUntilExpiry(e.license.expiryDate)
      return days > 0 && days <= 90 && e.status === 'Active'
    }).length,
    suspended: mockEntities.filter(e => e.status === 'Suspended').length,
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

  mockEntities.forEach(entity => {
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
}

/**
 * Find Entity by ID
 */
export const findEntityById = (id: string): Entity | undefined => {
  return mockEntities.find(e => e.id === id)
}

/**
 * Search Entities
 */
export const searchEntities = (query: string): Entity[] => {
  const lowerQuery = query.toLowerCase()
  return mockEntities.filter(entity =>
    entity.name.toLowerCase().includes(lowerQuery) ||
    entity.license.licenseNumber.toLowerCase().includes(lowerQuery) ||
    entity.businessInfo.registrationNumber.toLowerCase().includes(lowerQuery) ||
    entity.contactInfo.primaryContact.name.toLowerCase().includes(lowerQuery)
  )
}
