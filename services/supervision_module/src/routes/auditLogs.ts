import { Router, type IRouter } from 'express'
import { pool } from '../db/index.js'

const router: IRouter = Router()

// GET /api/audit-logs?limit=100
router.get('/', async (req, res) => {
  const limit = Math.min(parseInt(String(req.query.limit ?? '100'), 10) || 100, 500)
  try {
    const { rows } = await pool.query(
      `SELECT id, user_id, path, method, created_at
       FROM audit_logs
       ORDER BY id DESC
       LIMIT $1`,
      [limit]
    )
    res.json({ success: true, data: rows })
  } catch (e) {
    console.error('[audit-logs:list] failed', e)
    res.status(500).json({ success: false, error: 'Failed to fetch audit logs' })
  }
})

// POST /api/audit-logs
// { userId?: string, path: string, method?: string }
router.post('/', async (req, res) => {
  const { userId = null, path, method = 'CUSTOM' } = req.body || {}
  if (!path || typeof path !== 'string') {
    return res.status(400).json({ success: false, error: 'path is required' })
  }
  try {
    const now = new Date()
    const { rows } = await pool.query(
      `INSERT INTO audit_logs(user_id, path, method, created_at)
       VALUES($1, $2, $3, $4)
       RETURNING id, user_id, path, method, created_at`,
      [userId, path, method, now]
    )
    res.status(201).json({ success: true, data: rows[0] })
  } catch (e) {
    console.error('[audit-logs:create] failed', e)
    res.status(500).json({ success: false, error: 'Failed to create audit log' })
  }
})

export default router
