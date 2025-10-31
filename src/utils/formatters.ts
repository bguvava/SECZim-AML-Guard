export function formatNumber(n: number, decimals = 0): string {
  return n.toLocaleString(undefined, { maximumFractionDigits: decimals, minimumFractionDigits: decimals })
}

export function formatCurrency(n: number, currency = 'USD', decimals = 2): string {
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency, maximumFractionDigits: decimals, minimumFractionDigits: decimals }).format(n)
  } catch {
    return `$${formatNumber(n, decimals)}`
  }
}

export function formatPercent(n: number, decimals = 0): string {
  return `${n.toFixed(decimals)}%`
}

export function formatDate(iso: string | Date, withTime = false): string {
  const d = typeof iso === 'string' ? new Date(iso) : iso
  const date = d.toLocaleDateString()
  if (!withTime) return date
  const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  return `${date} ${time}`
}

export function relativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return 'Just now'
  if (diffMin < 60) return `${diffMin}m ago`
  if (diffMin < 1440) return `${Math.floor(diffMin / 60)}h ago`
  return d.toLocaleDateString()
}

export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function truncate(s: string, max = 80): string {
  if (s.length <= max) return s
  return s.slice(0, max - 1) + '…'
}

export function bytes(n: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let idx = 0
  let val = n
  while (val >= 1024 && idx < units.length - 1) { val /= 1024; idx++ }
  return `${val.toFixed(idx === 0 ? 0 : 1)} ${units[idx]}`
}

export function yesNo(v: boolean): string { return v ? 'Yes' : 'No' }
