import 'dotenv/config'
import { Pool } from 'pg'

async function main() {
  const isNeon = (process.env.DATABASE_URL || '').includes('neon.tech')
  const sslOption =
    process.env.PGSSL?.toLowerCase() === 'true' || isNeon
      ? { rejectUnauthorized: false }
      : undefined
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: sslOption })
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    // Insert institutions (capital markets sample)
    const instRes = await client.query(
      `INSERT INTO institutions(name, license_number, category, status, risk_level, risk_score)
       VALUES 
       ($1,$2,$3,$4,$5,$6),
       ($7,$8,$9,$10,$11,$12),
       ($13,$14,$15,$16,$17,$18)
       RETURNING id`,
      [
        'ABC Brokers', 'ZSE/BR/0001', 'Stockbroker', 'Active', 'Medium', 68,
        'XYZ Capital', 'ZSE/IM/0002', 'Investment Manager', 'Active', 'High', 82,
        'SafeCustody Ltd', 'ZSE/CU/0003', 'Custodian', 'Suspended', 'Low', 55,
      ]
    )
    const [id1, id2, id3] = instRes.rows.map(r => r.id)

    // Insert Zimbabwean banks (sample)
    await client.query(
      `INSERT INTO institutions(name, license_number, category, status, risk_level, risk_score)
       VALUES 
       ('CBZ Bank Limited','RBZ/BK/0001','Bank','Active','Medium',68),
       ('Stanbic Bank Zimbabwe Limited','RBZ/BK/0002','Bank','Active','Low',55),
       ('FBC Bank Limited','RBZ/BK/0003','Bank','Active','Medium',62),
       ('NMB Bank Limited','RBZ/BK/0004','Bank','Active','Medium',60),
       ('BancABC Zimbabwe','RBZ/BK/0005','Bank','Active','High',78),
       ('Steward Bank Limited','RBZ/BK/0006','Bank','Active','High',81),
       ('ZB Bank Limited','RBZ/BK/0007','Bank','Active','Medium',64),
       ('First Capital Bank Zimbabwe','RBZ/BK/0008','Bank','Active','Low',52),
       ('Ecobank Zimbabwe','RBZ/BK/0009','Bank','Active','Medium',59),
       ('Nedbank Zimbabwe','RBZ/BK/0010','Bank','Active','Low',50),
       ('People’s Own Savings Bank (POSB)','RBZ/BK/0011','Bank','Active','Medium',58)`
    )

    // Risk profiles
    await client.query(
      `INSERT INTO risk_profiles(institution_id, overall_risk_level, overall_risk_score, assessed_at)
       VALUES ($1,$2,$3, now()), ($4,$5,$6, now()), ($7,$8,$9, now())`,
      [id1, 'Medium', 68, id2, 'High', 82, id3, 'Low', 55]
    )

    // Compliance status
    await client.query(
      `INSERT INTO compliance_status(institution_id, status, compliant, non_compliant, partial)
       VALUES ($1,'OK',10,2,1),($2,'ATTENTION',7,4,2),($3,'SUSPENDED',3,8,1)`,
      [id1, id2, id3]
    )

    // Surveillance logs
    await client.query(
      `INSERT INTO surveillance_logs(institution_id, type, severity, description, occurred_at)
       VALUES 
       ($1,'Monitoring','Medium','Unusual transaction pattern detected', now() - interval '10 days'),
       ($2,'CDD','High','CDD gaps for high-risk clients', now() - interval '5 days'),
       ($3,'Reporting','Low','Late STR submission by 1 day', now() - interval '2 days')`,
      [id1, id2, id3]
    )

    // Inspection findings
    await client.query(
      `INSERT INTO inspection_findings(institution_id, category, severity, description, recommendation, due_date, status)
       VALUES 
       ($1,'Compliance','High','KYC file completeness below threshold','Remediate KYC files', now() + interval '30 days','Open'),
       ($2,'RiskManagement','Medium','Missing scenario analysis documentation','Provide documentation', now() + interval '14 days','InProgress'),
       ($3,'Operations','Low','Backup job missing weekly report','Attach weekly report', now() + interval '21 days','Open')`,
      [id1, id2, id3]
    )

    // Interventions
    await client.query(
      `INSERT INTO interventions(institution_id, type, intensity, date)
       VALUES ($1,'Onsite',4, now() - interval '20 days'), ($2,'Offsite',2, now() - interval '7 days')`,
      [id1, id2]
    )

    await client.query('COMMIT')
    console.log('[seed] inserted demo data')
  } catch (e) {
    await client.query('ROLLBACK')
    console.error('[seed] failed', e)
    process.exitCode = 1
  } finally {
    client.release()
    await pool.end()
  }
}

main()
