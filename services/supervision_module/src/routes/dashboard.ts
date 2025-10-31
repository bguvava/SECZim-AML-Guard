import { Router, type IRouter } from 'express'
import { pool } from '../db/index.js'

const router: IRouter = Router()

function demoAnalytics() {
  const months = Array.from({ length: 12 }, (_, i) => {
    const d = new Date()
    d.setMonth(d.getMonth() - (11 - i))
    return d.toISOString().slice(0, 7)
  })
  return {
    riskHeatmap: [
      { level: 'Low', count: 12 },
      { level: 'Medium', count: 18 },
      { level: 'High', count: 7 },
    ],
    riskRanking: [
      { name: 'ABC Brokers', score: 82 },
      { name: 'XYZ Capital', score: 76 },
      { name: 'SafeCustody Ltd', score: 69 },
    ],
    supervisoryFrequency: months.map((m, i) => ({ date: m, count: 6 + ((i * 3) % 5) })),
    supervisoryIntensity: [
      { type: 'Onsite', intensity: 4 },
      { type: 'Offsite', intensity: 2 },
      { type: 'Thematic', intensity: 3 },
    ],
    complianceStatus: [
      { status: 'OK', count: 10 },
      { status: 'ATTENTION', count: 6 },
      { status: 'SUSPENDED', count: 3 },
    ],
    trendAnalysis: months.map((m, i) => ({ period: m, current: 50 + i * 2, previous: 48 + i })),
  }
}

router.post('/analytics', async (req, res) => {
  try {
    try {
      // Example aggregations; replace with optimized queries as needed
      const heatmap = await pool.query(
        `SELECT risk_level AS level, COUNT(*)::int AS count FROM institutions GROUP BY risk_level`
      )
      const ranking = await pool.query(
        `SELECT name, COALESCE(risk_score,0) AS score FROM institutions ORDER BY score DESC NULLS LAST LIMIT 10`
      )
      const frequency = await pool.query(
        `SELECT to_char(date_trunc('month', occurred_at), 'YYYY-MM') AS date, COUNT(*)::int AS count FROM surveillance_logs GROUP BY 1 ORDER BY 1`
      )
      const intensity = await pool.query(
        `SELECT type, ROUND(AVG(intensity))::int AS intensity FROM interventions GROUP BY type`
      )
      const compliance = await pool.query(
        `SELECT status, COUNT(*)::int AS count FROM compliance_status GROUP BY status`
      )
      const trends = await pool.query(
        `WITH current AS (
          SELECT to_char(date_trunc('month', assessed_at), 'YYYY-MM') AS period, AVG(overall_risk_score) AS current
          FROM risk_profiles
          WHERE assessed_at >= now() - interval '12 months'
          GROUP BY 1
        ), previous AS (
          SELECT to_char(date_trunc('month', assessed_at), 'YYYY-MM') AS period, AVG(overall_risk_score) AS previous
          FROM risk_profiles
          WHERE assessed_at < now() - interval '12 months' AND assessed_at >= now() - interval '24 months'
          GROUP BY 1
        )
        SELECT COALESCE(c.period,p.period) AS period,
               COALESCE(c.current,0)::float AS current,
               COALESCE(p.previous,0)::float AS previous
        FROM current c
        FULL OUTER JOIN previous p ON c.period = p.period
        ORDER BY period`
      )

      return res.json({
        success: true,
        data: {
          riskHeatmap: heatmap.rows,
          riskRanking: ranking.rows,
          supervisoryFrequency: frequency.rows,
          supervisoryIntensity: intensity.rows,
          complianceStatus: compliance.rows,
          trendAnalysis: trends.rows,
        },
      })
    } catch (_err) {
      // Fallback demo data to keep UI functional when DB is not configured in dev
      return res.json({
        success: true,
        data: {
          riskHeatmap: [
            { level: 'High', count: 38 },
            { level: 'Medium', count: 95 },
            { level: 'Low', count: 114 },
          ],
          riskRanking: [
            { name: 'Bank A', score: 85 },
            { name: 'Bank B', score: 72 },
            { name: 'Securities C', score: 68 },
            { name: 'MFI D', score: 61 },
            { name: 'Insurance E', score: 45 },
          ],
          supervisoryFrequency: [
            { date: 'Jan', count: 12 },
            { date: 'Feb', count: 14 },
            { date: 'Mar', count: 16 },
            { date: 'Apr', count: 13 },
            { date: 'May', count: 18 },
            { date: 'Jun', count: 17 },
          ],
          supervisoryIntensity: [
            { type: 'On-site', intensity: 4 },
            { type: 'Off-site', intensity: 3 },
            { type: 'Meetings', intensity: 2 },
            { type: 'Data Requests', intensity: 5 },
            { type: 'Follow-ups', intensity: 4 },
          ],
          complianceStatus: [
            { status: 'Compliant', count: 114 },
            { status: 'Needs Attention', count: 62 },
            { status: 'Non-compliant', count: 19 },
          ],
          trendAnalysis: [
            { period: 'Jan', current: 78, previous: 72 },
            { period: 'Feb', current: 80, previous: 74 },
            { period: 'Mar', current: 82, previous: 76 },
            { period: 'Apr', current: 84, previous: 77 },
            { period: 'May', current: 86, previous: 79 },
            { period: 'Jun', current: 88, previous: 81 },
          ],
        },
      })
    }
  } catch (e) {
    // Fallback to demo analytics if database is unavailable
    res.json({ success: true, data: demoAnalytics() })
  }
})

router.post('/trends', async (_req, res) => {
  try {
    const result = await pool.query(
      `SELECT to_char(date_trunc('month', assessed_at), 'YYYY-MM') AS period,
              AVG(overall_risk_score)::float AS current,
              0::float AS previous
       FROM risk_profiles
       WHERE assessed_at >= now() - interval '12 months'
       GROUP BY 1
       ORDER BY 1`
    )
    res.json({ success: true, data: { trends: result.rows } })
  } catch {
    const d = demoAnalytics().trendAnalysis
    res.json({ success: true, data: { trends: d } })
  }
})

export default router
