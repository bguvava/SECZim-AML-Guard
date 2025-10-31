# Backend (NestJS + Prisma)

This service uses Prisma with a PostgreSQL datasource. To use Neon (managed PostgreSQL), set `DATABASE_URL` to your Neon connection string.

## Configure Neon

1. Create a Neon project and database.
2. Copy the **PostgreSQL connection string** and append `?sslmode=require`.
3. Create a `.env` file in `services/backend/` based on `.env.example`.

Example:

```
DATABASE_URL=postgresql://<user>:<password>@<host>.neon.tech/<db>?sslmode=require
```

## Migrations

Apply Prisma migrations to Neon:

- Deploy existing migrations to your Neon DB:
  - Option A: push current schema (developer workflow)
    - `pnpm dlx prisma db push --schema services/backend/prisma/schema.prisma`
  - Option B: run migrations (production-style)
    - `pnpm dlx prisma migrate deploy --schema services/backend/prisma/schema.prisma`

Generate the client (if needed):

```
pnpm dlx prisma generate --schema services/backend/prisma/schema.prisma
```

## Notes

- Neon is PostgreSQL. You do not need to change the Prisma provider (`postgresql`).
- If you were running a local Postgres, you can disable it once `DATABASE_URL` points to Neon.
