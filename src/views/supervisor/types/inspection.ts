export type InspectionStatus = 'Scheduled' | 'Ongoing' | 'Completed' | 'Overdue'

export interface Inspection {
  id: string
  institutionId: string
  institutionName: string
  type: 'Onsite' | 'Offsite' | 'Thematic'
  date: string // ISO
  status: InspectionStatus
  leadInspector: string
}

export type FindingSeverity = 'High' | 'Medium' | 'Low'
export type FindingStatus = 'Open' | 'InProgress' | 'Closed'

export interface InspectionFindingView {
  id: string
  institutionName: string
  category: 'Governance' | 'RiskManagement' | 'Compliance' | 'Operations' | 'Technology' | 'Reporting' | 'Other'
  severity: FindingSeverity
  status: FindingStatus
  dueDate?: string
}
