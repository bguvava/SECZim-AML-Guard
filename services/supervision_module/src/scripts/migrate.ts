import 'dotenv/config'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Pool } from 'pg'

async function main() {
  const __dirname = dirname(fileURLToPath(import.meta.url))
  const sqlPath = join(__dirname, '..', '..', 'migrations', '001_init.sql')
  const sql = readFileSync(sqlPath, 'utf-8')

  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  const client = await pool.connect()
  try {
    console.log('[migrate] applying 001_init.sql')
    await client.query('BEGIN')
    await client.query(sql)
    await client.query('COMMIT')
    console.log('[migrate] done')
  } catch (e) {
    await client.query('ROLLBACK')
    console.error('[migrate] failed', e)
    process.exitCode = 1
  } finally {
    client.release()
    await pool.end()
  }
}

main()
