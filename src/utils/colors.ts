export const palette = {
  red: { 50:'#fef2f2', 100:'#fee2e2', 500:'#ef4444', 600:'#dc2626', 700:'#b91c1c' },
  orange: { 100:'#ffedd5', 500:'#f97316', 600:'#ea580c', 700:'#c2410c' },
  yellow: { 100:'#fef9c3', 500:'#eab308', 600:'#ca8a04' },
  green: { 100:'#dcfce7', 500:'#22c55e', 600:'#16a34a' },
  blue: { 100:'#dbeafe', 500:'#3b82f6', 600:'#2563eb' },
  indigo: { 100:'#e0e7ff', 500:'#6366f1' },
  purple: { 100:'#f3e8ff', 500:'#a855f7' },
  gray: { 100:'#f3f4f6', 500:'#6b7280', 700:'#374151' },
}

export function riskScoreBarClass(score: number): string {
  if (score >= 75) return 'bg-red-500'
  if (score >= 50) return 'bg-orange-500'
  if (score >= 25) return 'bg-yellow-500'
  return 'bg-green-500'
}

export function riskLevelBadgeClass(level: string): string {
  const map: Record<string,string> = {
    Critical: 'bg-red-100 text-red-700',
    High: 'bg-orange-100 text-orange-700',
    Medium: 'bg-yellow-100 text-yellow-700',
    Low: 'bg-green-100 text-green-700',
  }
  return map[level] || 'bg-gray-100 text-gray-700'
}
