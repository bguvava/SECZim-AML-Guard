// Types for Supervision & Monitoring module
export type UUID = string;

export type RiskLevel = 'High' | 'Medium' | 'Low';
export type InstitutionStatus = 'Active' | 'Suspended' | 'Revoked' | 'Pending';

export interface InstitutionContact {
  email?: string;
  phone?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  country?: string;
  website?: string;
}

export interface Institution {
  id: UUID;
  name: string;
  licenseNumber: string;
  category: string; // e.g., Broker, Investment Manager, etc.
  status: InstitutionStatus;
  riskLevel: RiskLevel;
  riskScore?: number; // 0-100
  lastAssessmentAt?: string; // ISO date
  contact?: InstitutionContact;
  createdAt: string;
  updatedAt: string;
}

export interface ManagementProfile {
  boardEffectiveness: number; // 0-5
  managementExperience: number; // 0-5
  governanceQuality: number; // 0-5
}

export interface StaffProfile {
  headcount: number;
  trainingCoverage: number; // percentage
  turnoverRate: number; // percentage
}

export interface BusinessModelProfile {
  linesOfBusiness: string[];
  complexity: number; // 0-5
  geographicExposure: number; // 0-5
}

export interface ProductServiceProfile {
  products: string[];
  highRiskProducts: string[];
}

export interface RiskManagementProfile {
  controlsMaturity: number; // 0-5
  independentReview: boolean;
  technologyRisk: number; // 0-5
}

export interface ComplianceProfile {
  sanctionsScreening: boolean;
  cddCoverage: number; // percentage
  reportingTimeliness: number; // percentage
  violationsLast12M: number;
}

export interface RiskProfile {
  id: UUID;
  institutionId: UUID;
  boardAndManagement: ManagementProfile;
  staff: StaffProfile;
  businessModel: BusinessModelProfile;
  productsAndServices: ProductServiceProfile;
  riskManagement: RiskManagementProfile;
  compliance: ComplianceProfile;
  overallRiskLevel: RiskLevel;
  overallRiskScore: number; // 0-100
  assessedAt: string; // ISO date
  createdAt: string;
  updatedAt: string;
}

export interface SurveillanceLog {
  id: UUID;
  institutionId: UUID;
  type: 'CDD' | 'Monitoring' | 'Sanctions' | 'Reporting' | 'Deficiency' | 'Other';
  severity: RiskLevel;
  description: string;
  occurredAt: string; // ISO date
  createdAt: string;
}

export interface InspectionFinding {
  id: UUID;
  institutionId: UUID;
  category: 'Governance' | 'RiskManagement' | 'Compliance' | 'Operations' | 'Technology' | 'Reporting' | 'Other';
  severity: RiskLevel;
  description: string;
  recommendation?: string;
  dueDate?: string; // ISO date
  status: 'Open' | 'InProgress' | 'Closed';
  createdAt: string;
  updatedAt?: string;
}

export interface ComplianceStatus {
  institutionId: UUID;
  compliant: number; // count
  nonCompliant: number; // count
  partial: number; // count
  updatedAt: string;
}

export interface Intervention {
  id: UUID;
  institutionId: UUID;
  type: 'Onsite' | 'Offsite' | 'Thematic' | 'Enforcement' | 'Advisory';
  intensity: number; // 0-5
  date: string; // ISO date
}

export interface RiskScore {
  institutionId: UUID;
  score: number; // 0-100
  level: RiskLevel;
  computedAt: string;
}

export interface TrendPoint {
  period: string; // e.g. '2025-01'
  current: number;
  previous: number;
}
