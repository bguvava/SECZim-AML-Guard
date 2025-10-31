# Supervision Module Service

Node.js/Express service powering the Supervision & Monitoring module.

## Setup (Neon PostgreSQL)

1. Copy .env

```
cp .env.example .env
```

2. Install deps

```
pnpm install
```

3. Set your Neon connection string in `.env`:

```
DATABASE_URL=postgresql://<user>:<password>@<host>.neon.tech/<db>?sslmode=require
# Optional explicit switch (handled automatically for neon.tech URLs)
# PGSSL=true
```

4. Run migrations (script)

```
pnpm run migrate
```

5. (Optional) Seed demo data

```
pnpm run seed
```

6. Start dev

```
pnpm run dev
```

Swagger UI: http://localhost:4001/api/docs

### Notes

- Local Postgres via docker-compose has been deprecated in favor of Neon.
- SSL is enabled automatically for Neon URLs; you can force it by setting `PGSSL=true`.

## Endpoints

- Auth protected (Bearer JWT)
- /api/institutions CRUD
- /api/risk-profiles
- /api/surveillance
- /api/inspections
- /api/risk-assessment
- /api/dashboard/analytics
- /api/dashboard/trends
 - /api/docs (Swagger UI)
 - /api/openapi.json (OpenAPI spec)

