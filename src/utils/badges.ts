export function severityBadgeClass(severity: 'critical'|'high'|'medium'|'low'): string {
  const map = {
    critical: 'bg-red-100 text-red-700',
    high: 'bg-orange-100 text-orange-700',
    medium: 'bg-yellow-100 text-yellow-700',
    low: 'bg-gray-100 text-gray-700',
  } as const
  return map[severity] || map.low
}

export function typeBadgeClass(type: 'Watchlist'|'Anomaly'|'Threshold'|'Pattern'|'Sanction'|string): string {
  const map: Record<string,string> = {
    Watchlist: 'bg-purple-100 text-purple-700',
    Anomaly: 'bg-blue-100 text-blue-700',
    Threshold: 'bg-green-100 text-green-700',
    Pattern: 'bg-indigo-100 text-indigo-700',
    Sanction: 'bg-red-100 text-red-700',
  }
  return map[type] || 'bg-gray-100 text-gray-700'
}

export function timelineBadgeClass(type: 'alert'|'action'|'resolved'|'dismissed'|string): string {
  const map: Record<string,string> = {
    alert: 'bg-red-100 text-red-600',
    action: 'bg-blue-100 text-blue-600',
    resolved: 'bg-green-100 text-green-600',
    dismissed: 'bg-gray-100 text-gray-600',
  }
  return map[type] || 'bg-gray-100 text-gray-600'
}
