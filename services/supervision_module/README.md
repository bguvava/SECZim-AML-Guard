# Supervision Module Service

Node.js/Express service powering the Supervision & Monitoring module.

## Setup

1. Copy .env

```
cp .env.example .env
```

2. Install deps

```
pnpm install
```

3. Run migrations (script)

```
pnpm run migrate
```

4. (Optional) Seed demo data

```
pnpm run seed
```

5. Start dev

```
pnpm add -D tsx
pnpm run dev
```

Swagger UI: http://localhost:4001/api/docs

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

