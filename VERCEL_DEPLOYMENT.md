# Vercel Deployment Guide

## Step 1: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (or sign up with GitHub)

2. Click **"Add New Project"**

3. Import your GitHub repository:
   - Select `adi004-blip/buybizz_prototype`
   - Click **Import**

4. Configure the project:
   - **Framework Preset**: Next.js (should auto-detect)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

## Step 2: Add Environment Variables

In the Vercel project settings, add these environment variables:

### Required Environment Variables:

```env
# Database
DATABASE_URL="postgresql://neondb_owner:npg_hOFE0egHJX8o@ep-wild-hill-a4cth4tz-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# Clerk (get from Clerk Dashboard)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# Clerk Webhook (get from Clerk Dashboard after setting up webhook)
CLERK_WEBHOOK_SECRET="whsec_..."
```

### How to Add Environment Variables in Vercel:

1. In your Vercel project dashboard
2. Go to **Settings** → **Environment Variables**
3. Add each variable:
   - **Key**: `DATABASE_URL`
   - **Value**: Your Neon connection string
   - **Environment**: Production, Preview, Development (select all)
   - Click **Save**
4. Repeat for all environment variables

## Step 3: Configure Build Settings for Prisma

Vercel needs to run Prisma migrations and generate the client during build.

1. Go to **Settings** → **Build & Development Settings**
2. Add a **Build Command** override:
   ```bash
   npx prisma generate && npx prisma migrate deploy && npm run build
   ```
   
   Or use the simpler approach (Vercel should auto-detect Prisma):
   ```bash
   npm run build
   ```

3. Add **Install Command** (if needed):
   ```bash
   npm install
   ```

## Step 4: Deploy

1. Click **Deploy** (or push to GitHub and Vercel will auto-deploy)
2. Wait for deployment to complete (~2-3 minutes)
3. Copy your deployment URL (e.g., `https://buybizz-prototype.vercel.app`)

## Step 5: Run Database Migrations

After first deployment, you may need to run migrations:

**Option 1: Via Vercel CLI** (recommended)
```bash
npm i -g vercel
vercel login
vercel link
vercel env pull .env.local  # Pull environment variables
npx prisma migrate deploy
```

**Option 2: Run migrations locally pointing to production DB**
```bash
# Temporarily set DATABASE_URL to production Neon URL
DATABASE_URL="your-production-neon-url" npx prisma migrate deploy
```

**Option 3: Use Neon Dashboard SQL Editor**
- Go to Neon Dashboard → SQL Editor
- Run the migration SQL manually (from `prisma/migrations/20251031033411_init/migration.sql`)

## Step 6: Configure Clerk Webhook

Once your Vercel deployment is live:

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Go to **Webhooks** → **Add Endpoint**
3. **Endpoint URL**: `https://your-app.vercel.app/api/webhooks/clerk`
   - Replace `your-app` with your actual Vercel app name
4. **Events to subscribe**:
   - ✅ `user.created`
   - ✅ `user.updated`
   - ✅ `user.deleted`
5. Click **Create**
6. **Copy the Signing Secret** (starts with `whsec_`)
7. Add it to Vercel environment variables:
   - Go to Vercel → Settings → Environment Variables
   - Add `CLERK_WEBHOOK_SECRET` with the secret value
   - Redeploy the app (or wait for auto-deploy)

## Step 7: Verify Deployment

1. Visit your Vercel URL: `https://your-app.vercel.app`
2. Test user signup (should create user in database via webhook)
3. Check logs in Vercel dashboard for any errors
4. Test webhook by signing up a new user

## Troubleshooting

### Build Fails - Prisma Errors
- Ensure `DATABASE_URL` is set in Vercel environment variables
- Check that migrations have been run on the production database
- Verify Prisma client is generated: add `npx prisma generate` to build command

### Webhook Not Working
- Verify `CLERK_WEBHOOK_SECRET` is set in Vercel
- Check webhook URL in Clerk Dashboard matches your Vercel URL
- Check Vercel function logs: Dashboard → Your Project → Functions → `/api/webhooks/clerk`

### Database Connection Issues
- Verify `DATABASE_URL` has correct SSL mode (`?sslmode=require`)
- Check Neon dashboard to ensure database is active
- Verify connection string format is correct

### Environment Variables Not Working
- Ensure variables are added to all environments (Production, Preview, Development)
- Redeploy after adding new environment variables
- Check variable names match exactly (case-sensitive)

## Next Steps After Deployment

1. ✅ Set up custom domain (optional)
2. ✅ Configure production database backups
3. ✅ Set up monitoring/alerts
4. ✅ Test all functionality in production
5. ✅ Set up CI/CD (already done via GitHub integration)

---

## Quick Checklist

- [ ] Deploy to Vercel
- [ ] Add all environment variables
- [ ] Run database migrations
- [ ] Configure Clerk webhook with Vercel URL
- [ ] Add `CLERK_WEBHOOK_SECRET` to Vercel
- [ ] Test user signup
- [ ] Verify webhook is working

