import type { Request, Response } from 'express'
import { pool } from '../db/index.js'
import type { Institution } from '../types/models.js'

// In-memory fallback dataset for development when DATABASE_URL is not provided
const useMemory = !process.env.DATABASE_URL

// Seed: Zimbabwean banks (for dev/demo only)
const memoryInstitutions: Institution[] = [
  {
    id: 'mem-cbz',
    name: 'CBZ Bank Limited',
    license_number: 'RBZ/BK/0001',
    category: 'Bank',
    status: 'Active',
    risk_level: 'Medium',
    risk_score: 68,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 120),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
  },
  {
    id: 'mem-stanbic',
    name: 'Stanbic Bank Zimbabwe Limited',
    license_number: 'RBZ/BK/0002',
    category: 'Bank',
    status: 'Active',
    risk_level: 'Low',
    risk_score: 55,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 200),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
  },
  {
    id: 'mem-fbc',
    name: 'FBC Bank Limited',
    license_number: 'RBZ/BK/0003',
    category: 'Bank',
    status: 'Active',
    risk_level: 'Medium',
    risk_score: 62,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 180),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4),
  },
  {
    id: 'mem-nmb',
    name: 'NMB Bank Limited',
    license_number: 'RBZ/BK/0004',
    category: 'Bank',
    status: 'Active',
    risk_level: 'Medium',
    risk_score: 60,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 150),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
  },
  {
    id: 'mem-bancabc',
    name: 'BancABC Zimbabwe',
    license_number: 'RBZ/BK/0005',
    category: 'Bank',
    status: 'Active',
    risk_level: 'High',
    risk_score: 78,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 220),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
  },
  {
    id: 'mem-steward',
    name: 'Steward Bank Limited',
    license_number: 'RBZ/BK/0006',
    category: 'Bank',
    status: 'Active',
    risk_level: 'High',
    risk_score: 81,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 300),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
  },
  {
    id: 'mem-zb',
    name: 'ZB Bank Limited',
    license_number: 'RBZ/BK/0007',
    category: 'Bank',
    status: 'Active',
    risk_level: 'Medium',
    risk_score: 64,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
  },
  {
    id: 'mem-firstcapital',
    name: 'First Capital Bank Zimbabwe',
    license_number: 'RBZ/BK/0008',
    category: 'Bank',
    status: 'Active',
    risk_level: 'Low',
    risk_score: 52,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8),
  },
  {
    id: 'mem-ecobank',
    name: 'Ecobank Zimbabwe',
    license_number: 'RBZ/BK/0009',
    category: 'Bank',
    status: 'Active',
    risk_level: 'Medium',
    risk_score: 59,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 210),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6),
  },
  {
    id: 'mem-nedbank',
    name: 'Nedbank Zimbabwe',
    license_number: 'RBZ/BK/0010',
    category: 'Bank',
    status: 'Active',
    risk_level: 'Low',
    risk_score: 50,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 400),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9),
  },
  {
    id: 'mem-posb',
    name: 'People’s Own Savings Bank (POSB)',
    license_number: 'RBZ/BK/0011',
    category: 'Bank',
    status: 'Active',
    risk_level: 'Medium',
    risk_score: 58,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12),
  },
]

function memFilterAndPaginate(arr: Institution[], query: any) {
  const { search = '', status, riskLevel, page = '1', pageSize = '10' } = query
  let items = arr
  if (search) {
    const s = String(search).toLowerCase()
    items = items.filter(i =>
      i.name.toLowerCase().includes(s) || i.license_number.toLowerCase().includes(s)
    )
  }
  if (status) items = items.filter(i => i.status === status)
  if (riskLevel) items = items.filter(i => i.risk_level === riskLevel)

  // Sort by updated_at desc
  items = [...items].sort((a, b) => b.updated_at.getTime() - a.updated_at.getTime())

  const p = Number(page)
  const ps = Number(pageSize)
  const offset = (p - 1) * ps
  const paged = items.slice(offset, offset + ps)
  return { items: paged, total: items.length, page: p, pageSize: ps }
}

export async function list(req: Request, res: Response) {
  if (useMemory) {
    const result = memFilterAndPaginate(memoryInstitutions, req.query)
    return res.json({ success: true, data: result })
  }

  const { search = '', status, riskLevel, page = '1', pageSize = '10' } = req.query as any
  const offset = (Number(page) - 1) * Number(pageSize)
  const filters: string[] = []
  const params: any[] = []

  if (search) {
    params.push(`%${search}%`)
    filters.push(`(name ILIKE $${params.length} OR license_number ILIKE $${params.length})`)
  }
  if (status) {
    params.push(status)
    filters.push(`status = $${params.length}`)
  }
  if (riskLevel) {
    params.push(riskLevel)
    filters.push(`risk_level = $${params.length}`)
  }

  const where = filters.length ? `WHERE ${filters.join(' AND ')}` : ''
  const itemsSql = `SELECT * FROM institutions ${where} ORDER BY updated_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
  const countSql = `SELECT COUNT(*)::int AS count FROM institutions ${where}`

  const [itemsResult, countResult] = await Promise.all([
    pool.query(itemsSql, [...params, Number(pageSize), offset]),
    pool.query(countSql, params),
  ])

  res.json({ success: true, data: { items: itemsResult.rows, total: countResult.rows[0].count, page: Number(page), pageSize: Number(pageSize) } })
}

export async function getById(req: Request, res: Response) {
  const id = req.params.id
  if (useMemory) {
    const found = memoryInstitutions.find(i => i.id === id)
    if (!found) return res.status(404).json({ success: false, error: 'Not found' })
    return res.json({ success: true, data: found })
  }
  const result = await pool.query('SELECT * FROM institutions WHERE id = $1', [id])
  if (!result.rows[0]) return res.status(404).json({ success: false, error: 'Not found' })
  return res.json({ success: true, data: result.rows[0] })
}

export async function create(req: Request, res: Response) {
  const { name, licenseNumber, category, status, riskLevel } = req.body
  if (useMemory) {
    const now = new Date()
    const item: Institution = {
      id: `mem-${Math.random().toString(36).slice(2)}`,
      name,
      license_number: licenseNumber,
      category,
      status,
      risk_level: riskLevel,
      risk_score: 60,
      created_at: now,
      updated_at: now,
    }
    memoryInstitutions.push(item)
    return res.status(201).json({ success: true, data: item })
  }
  const result = await pool.query(
    'INSERT INTO institutions (name, license_number, category, status, risk_level, created_at, updated_at) VALUES ($1,$2,$3,$4,$5,now(),now()) RETURNING *',
    [name, licenseNumber, category, status, riskLevel]
  )
  return res.status(201).json({ success: true, data: result.rows[0] })
}

export async function update(req: Request, res: Response) {
  const id = req.params.id
  const { name, licenseNumber, category, status, riskLevel } = req.body
  if (useMemory) {
    const idx = memoryInstitutions.findIndex(i => i.id === id)
    if (idx === -1) return res.status(404).json({ success: false, error: 'Not found' })
    memoryInstitutions[idx] = {
      ...memoryInstitutions[idx],
      name: name ?? memoryInstitutions[idx].name,
      license_number: licenseNumber ?? memoryInstitutions[idx].license_number,
      category: category ?? memoryInstitutions[idx].category,
      status: status ?? memoryInstitutions[idx].status,
      risk_level: riskLevel ?? memoryInstitutions[idx].risk_level,
      updated_at: new Date(),
    }
    return res.json({ success: true, data: memoryInstitutions[idx] })
  }
  const result = await pool.query(
    'UPDATE institutions SET name = COALESCE($1,name), license_number = COALESCE($2,license_number), category = COALESCE($3,category), status = COALESCE($4,status), risk_level = COALESCE($5,risk_level), updated_at = now() WHERE id = $6 RETURNING *',
    [name ?? null, licenseNumber ?? null, category ?? null, status ?? null, riskLevel ?? null, id]
  )
  if (!result.rows[0]) return res.status(404).json({ success: false, error: 'Not found' })
  return res.json({ success: true, data: result.rows[0] })
}

export async function remove(req: Request, res: Response) {
  const id = req.params.id
  if (useMemory) {
    const idx = memoryInstitutions.findIndex(i => i.id === id)
    if (idx === -1) return res.status(404).json({ success: false, error: 'Not found' })
    memoryInstitutions.splice(idx, 1)
    return res.status(204).json({ success: true })
  }
  await pool.query('DELETE FROM institutions WHERE id = $1', [id])
  return res.status(204).json({ success: true })
}
