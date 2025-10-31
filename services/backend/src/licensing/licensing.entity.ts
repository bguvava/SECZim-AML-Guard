export interface Licensing {
  id?: number;
  entityName: string;
  entityId: string;
  breachType: string;
  severity: string;
  description: string;
  status: string; 
  dateReported?: Date;
  penalty?: number | null;
  recommendation?: string | null;
}
