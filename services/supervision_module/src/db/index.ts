import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const isNeon = (process.env.DATABASE_URL || '').includes('neon.tech')
const sslOption =
  process.env.PGSSL?.toLowerCase() === 'true' || isNeon
    ? { rejectUnauthorized: false }
    : undefined

export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: sslOption,
})

export async function healthCheck() {
  const res = await pool.query('SELECT 1')
  return res.rows[0]
}
