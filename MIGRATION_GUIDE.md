# Migration Guide - Automatic vs Manual

## ✅ Automatic Migrations (Production/Vercel)

**Good news:** Migrations run automatically on Vercel deployments!

Your `vercel.json` is configured with:
```json
{
  "buildCommand": "prisma generate && prisma migrate deploy && next build"
}
```

This means:
- ✅ Every time you push to GitHub and Vercel deploys
- ✅ Migrations run automatically (`prisma migrate deploy`)
- ✅ No manual work needed for production!

## 📝 Local Development Migrations

For local development, you have two options:

### Option 1: Manual SQL (Easiest for Testing)
Just run the SQL directly in Neon Dashboard → SQL Editor
- Copy SQL from `MIGRATION_SQL.sql` or migration files
- Paste and run in Neon Dashboard
- ✅ Done!

### Option 2: Prisma Migrate (For Creating New Migrations)
```bash
# Create a new migration
npx prisma migrate dev --name migration_name

# This will:
# - Apply the migration to your local database
# - Update Prisma Client
# - Create the migration file for Vercel
```

## 🔄 Workflow

### When you create a new migration:

1. **Update `prisma/schema.prisma`** (e.g., add a field, change a type)

2. **Create migration locally:**
   ```bash
   npx prisma migrate dev --name add_new_field
   ```
   This:
   - ✅ Applies to your local database
   - ✅ Creates migration file in `prisma/migrations/`
   - ✅ Updates Prisma Client

3. **Commit and push:**
   ```bash
   git add prisma/
   git commit -m "Add migration: add_new_field"
   git push
   ```

4. **Vercel automatically runs it:**
   - Vercel sees the new migration file
   - Runs `prisma migrate deploy` during build
   - Applies migration to production database
   - ✅ No manual work!

## 🚨 Current Migration Status

You have a pending migration: `20251101160000_remove_useragent_unique_constraint`

**For local testing:**
- Option A: Run SQL manually in Neon Dashboard (quickest) ✅
- Option B: Will auto-run on next Vercel deployment ✅

**For production:**
- ✅ Will run automatically on next Vercel deployment
- No action needed!

## ⚠️ Important Notes

1. **`prisma migrate dev`** - For local development (creates + applies migrations)
2. **`prisma migrate deploy`** - For production (only applies existing migrations)
3. Always commit migration files to Git so Vercel can run them

## 🎯 Summary

- **Production (Vercel)**: Fully automatic ✅ - Just push to GitHub!
- **Local Development**: 
  - Option A: Run SQL manually in Neon Dashboard (easiest)
  - Option B: Use `prisma migrate dev` (when creating new migrations)
- **Current migration**: Will auto-deploy on next Vercel build

**You only need to manually migrate locally for testing.** Production handles it automatically!

