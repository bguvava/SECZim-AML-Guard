import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

export const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })

export async function healthCheck() {
  const res = await pool.query('SELECT 1')
  return res.rows[0]
}
