# Vercel Migration Strategy

## Problem
`prisma migrate deploy` was timing out during Vercel builds due to database lock issues.

## Solution
We've simplified the build process to only run migrations when necessary, and handle them separately.

## Current Build Process

1. **Vercel Build**: Only runs `prisma generate && next build`
   - This ensures Prisma Client is available
   - Skips migrations during build (prevents timeouts)

2. **Manual Migration Strategy**:
   - Run migrations manually when schema changes
   - Use Neon Dashboard SQL Editor for quick migrations
   - Or run `prisma migrate deploy` separately if needed

## Recommended Workflow

### When Schema Changes:

1. **Create Migration Locally**:
   ```bash
   npx prisma migrate dev --name migration_name
   ```

2. **Apply to Production** (Choose one):

   **Option A: Neon Dashboard** (Recommended - Fastest)
   - Go to Neon Dashboard → SQL Editor
   - Copy SQL from `prisma/migrations/[timestamp]_migration_name/migration.sql`
   - Run SQL directly

   **Option B: Vercel CLI** (If you have access)
   ```bash
   vercel env pull .env.local
   npx prisma migrate deploy
   ```

   **Option C: Direct Command** (If DATABASE_URL is set)
   ```bash
   DATABASE_URL="your-production-url" npx prisma migrate deploy
   ```

## Why This Approach?

- ✅ Prevents build timeouts
- ✅ Faster deployments
- ✅ More control over when migrations run
- ✅ Can run migrations during low-traffic periods
- ✅ Avoids database lock conflicts

## Migration Files

All migration files are committed to Git:
- `prisma/migrations/20251031033411_init/`
- `prisma/migrations/20251101150800_add_cart_model/`
- `prisma/migrations/20251101160000_remove_useragent_unique_constraint/`
- `prisma/migrations/20251101170000_add_vendor_application_model/`

These can be applied manually when needed.

