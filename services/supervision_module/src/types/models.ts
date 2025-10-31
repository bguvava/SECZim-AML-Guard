export type UUID = string;
export type RiskLevel = 'High' | 'Medium' | 'Low';
export type InstitutionStatus = 'Active' | 'Suspended' | 'Revoked' | 'Pending';

export interface Institution {
  id: UUID;
  name: string;
  license_number: string;
  category: string;
  status: InstitutionStatus;
  risk_level: RiskLevel;
  risk_score?: number;
  created_at: Date;
  updated_at: Date;
}

export interface RiskProfile {
  id: UUID;
  institution_id: UUID;
  overall_risk_level: RiskLevel;
  overall_risk_score: number;
  assessed_at: Date;
  created_at: Date;
  updated_at: Date;
}

export interface SurveillanceLog {
  id: UUID;
  institution_id: UUID;
  type: 'CDD' | 'Monitoring' | 'Sanctions' | 'Reporting' | 'Deficiency' | 'Other';
  severity: RiskLevel;
  description: string;
  occurred_at: Date;
  created_at: Date;
}

export interface InspectionFinding {
  id: UUID;
  institution_id: UUID;
  category: 'Governance' | 'RiskManagement' | 'Compliance' | 'Operations' | 'Technology' | 'Reporting' | 'Other';
  severity: RiskLevel;
  description: string;
  recommendation?: string;
  due_date?: Date;
  status: 'Open' | 'InProgress' | 'Closed';
  created_at: Date;
  updated_at?: Date;
}

export interface RiskScore {
  institution_id: UUID;
  score: number;
  level: RiskLevel;
  computed_at: Date;
}
