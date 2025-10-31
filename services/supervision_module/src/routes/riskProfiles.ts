import { Router, type IRouter } from 'express'
import { pool } from '../db/index.js'

const router: IRouter = Router()

router.get('/', async (req, res) => {
  const { institutionId } = req.query as any
  const result = await pool.query('SELECT * FROM risk_profiles WHERE institution_id = $1 ORDER BY assessed_at DESC', [
    institutionId,
  ])
  res.json({ success: true, data: result.rows })
})

router.post('/', async (req, res) => {
  const {
    institutionId,
    overallRiskLevel,
    overallRiskScore,
  } = req.body
  const result = await pool.query(
    `INSERT INTO risk_profiles(institution_id, overall_risk_level, overall_risk_score, assessed_at, created_at, updated_at)
     VALUES($1,$2,$3,now(),now(),now()) RETURNING *`,
    [institutionId, overallRiskLevel, overallRiskScore]
  )
  res.status(201).json({ success: true, data: result.rows[0] })
})

router.put('/:id', async (req, res) => {
  const id = req.params.id
  const { overallRiskLevel, overallRiskScore } = req.body
  const result = await pool.query(
    `UPDATE risk_profiles SET overall_risk_level = COALESCE($1,overall_risk_level), overall_risk_score = COALESCE($2,overall_risk_score), updated_at = now() WHERE id = $3 RETURNING *`,
    [overallRiskLevel ?? null, overallRiskScore ?? null, id]
  )
  res.json({ success: true, data: result.rows[0] })
})

export default router
