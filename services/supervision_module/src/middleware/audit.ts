import type { Request, Response, NextFunction } from 'express'
import { pool } from '../db/index.js'

export async function audit(req: Request, _res: Response, next: NextFunction) {
  // Non-blocking audit log
  const userId = req.user?.id ?? null
  const path = req.path
  const method = req.method
  const now = new Date()
  pool
    .query('INSERT INTO audit_logs(user_id, path, method, created_at) VALUES($1,$2,$3,$4)', [userId, path, method, now])
    .catch(() => {})
  next()
}
