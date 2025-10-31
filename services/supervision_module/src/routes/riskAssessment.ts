import { Router, type IRouter, type Request, type Response } from 'express'
import { pool } from '../db/index.js'

const router: IRouter = Router()

router.post('/', async (req: Request, res: Response) => {
  const { institutionId } = req.body as { institutionId: string }
  if (!institutionId) return res.status(400).json({ success: false, error: 'institutionId is required' })

  // Enhanced scoring: recent profiles + surveillance severity + open findings
  const [profiles, surv, openFindings] = await Promise.all([
    pool.query('SELECT overall_risk_score FROM risk_profiles WHERE institution_id = $1 ORDER BY assessed_at DESC LIMIT 3', [institutionId]),
    pool.query("SELECT COUNT(*)::int AS cnt, SUM(CASE WHEN severity = 'High' THEN 3 WHEN severity = 'Medium' THEN 2 ELSE 1 END)::int AS sev FROM surveillance_logs WHERE institution_id = $1 AND occurred_at >= now() - interval '6 months'", [institutionId]),
    pool.query("SELECT COUNT(*)::int AS cnt FROM inspection_findings WHERE institution_id = $1 AND status <> 'Closed'", [institutionId]),
  ])

  const profileAvg = profiles.rows.length ? profiles.rows.reduce((s, r) => s + Number(r.overall_risk_score), 0) / profiles.rows.length : 50
  const sevScore = Number(surv.rows[0]?.sev || 0)
  const openCount = Number(openFindings.rows[0]?.cnt || 0)
  const score = Math.round(Math.min(100, profileAvg + sevScore * 2 + openCount * 3))
  const level = score >= 70 ? 'High' : score >= 40 ? 'Medium' : 'Low'

  res.json({ success: true, data: { institution_id: institutionId, score, level, computed_at: new Date().toISOString() } })
})

export default router
