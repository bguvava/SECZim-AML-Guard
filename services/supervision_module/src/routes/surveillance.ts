import { Router, type IRouter } from 'express'
import { pool } from '../db/index.js'

const router: IRouter = Router()

router.get('/', async (req, res) => {
  const { institutionId } = req.query as any
  const result = await pool.query('SELECT * FROM surveillance_logs WHERE institution_id = $1 ORDER BY occurred_at DESC', [
    institutionId,
  ])
  res.json({ success: true, data: result.rows })
})

export default router
