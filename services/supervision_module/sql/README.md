# Using a local PostgreSQL (optional)

Neon is the recommended database for this project. If you prefer to use a local PostgreSQL instance for development, you can provision and seed it from VS Code using the PostgreSQL extension.

## Prerequisites
- PostgreSQL server installed locally (default port 5432)
- Superuser credentials (typically user `postgres`)
- Database connection available in the extension (localhost)

## Steps

1. Create the application database
   - Connect to the `postgres` database as the superuser.
   - Open `sql/create_database.sql` and run it.

2. Create the schema in the `amlguard` database
   - Connect to the `amlguard` database.
   - Open `migrations/001_init.sql` and run it. This also enables the `pgcrypto` extension.
     - If `CREATE EXTENSION pgcrypto;` fails due to permissions, reconnect as the `postgres` superuser and re-run.

3. Seed demo data
   - Still connected to `amlguard`, open and run `sql/seed.sql`.

4. Start the backend
   - Ensure `services/supervision_module/.env` has a working `DATABASE_URL` (for Neon, include `?sslmode=require`).
   - Start the backend in dev mode.

Once complete, the `/api/institutions` endpoint should return rows from your database (Neon or local Postgres).
