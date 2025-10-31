export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low'
export type AlertType = 'Watchlist' | 'Anomaly' | 'Threshold' | 'Pattern' | 'Sanction'
export type AlertStatus = 'active' | 'investigating' | 'resolved' | 'dismissed'

export interface Alert {
  id: string
  severity: AlertSeverity
  type: AlertType
  title: string
  description: string
  timestamp: string // ISO
  institution: string
  amount?: number
  customer?: string
  status: AlertStatus
}

export interface TimelineEvent {
  type: 'alert' | 'action' | 'resolved' | 'dismissed'
  title: string
  description: string
  timestamp: string // ISO
}
