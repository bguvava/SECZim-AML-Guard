export type SortDirection = 'asc' | 'desc'

export function debounce<T extends (...args: any[]) => void>(fn: T, wait = 300) {
  let t: any
  return (...args: Parameters<T>) => {
    clearTimeout(t)
    t = setTimeout(() => fn(...args), wait)
  }
}

export function buildQuery(params: Record<string, any>): string {
  const filtered: Record<string,string> = {}
  Object.entries(params).forEach(([k,v]) => {
    if (v === undefined || v === null || v === '') return
    filtered[k] = Array.isArray(v) ? v.join(',') : String(v)
  })
  return new URLSearchParams(filtered).toString()
}

export function simpleSearch<T>(rows: T[], q: string, pick: (row: T) => string[]): T[] {
  if (!q) return rows
  const needle = q.toLowerCase()
  return rows.filter(r => pick(r).some(f => f && f.toLowerCase().includes(needle)))
}

export function sortBy<T>(rows: T[], key: keyof T, dir: SortDirection = 'asc'): T[] {
  const sorted = [...rows].sort((a: any, b: any) => (a[key] > b[key] ? 1 : a[key] < b[key] ? -1 : 0))
  return dir === 'asc' ? sorted : sorted.reverse()
}

export function paginate<T>(rows: T[], page = 1, pageSize = 10) {
  const start = (page - 1) * pageSize
  return rows.slice(start, start + pageSize)
}
