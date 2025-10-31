# BuyBizz - Setup Guide

## Phase 1: Database Setup ✅ READY TO START

### Step 1: Create Neon Database

1. Go to [neon.tech](https://neon.tech)
2. Sign up for a free account (or log in)
3. Click "Create a project"
4. Choose a project name (e.g., "buybizz")
5. Select region closest to you
6. Click "Create project"

### Step 2: Get Connection String

1. In your Neon project dashboard
2. Click "Connection Details" or find the connection string
3. Copy the connection string (it looks like: `postgresql://user:password@host.neon.tech:5432/dbname?sslmode=require`)

### Step 3: Add to Environment Variables

1. Create or update `.env.local` in the project root
2. Add the DATABASE_URL:

```env
DATABASE_URL="postgresql://user:password@host.neon.tech:5432/dbname?sslmode=require"
```

**Note:** The `.env` file already exists. You can either:
- Update the existing `.env` file with Neon connection string
- Create `.env.local` (which takes precedence)

### Step 4: Run Prisma Migrations

After adding DATABASE_URL, run:

```bash
# Generate Prisma client
npx prisma generate

# Create database tables
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio to view database
npx prisma studio
```

### Step 5: Verify Database

1. Check Neon dashboard - you should see all tables created
2. Or run `npx prisma studio` to open database viewer

---

## Files Created ✅

- `lib/db.ts` - Prisma client instance
- `lib/auth.ts` - Clerk + Database auth helpers
- `lib/api-keys.ts` - API key generation utilities
- `.env.local.example` - Example environment variables

---

## Schema Updates ✅

Updated Prisma schema:
- ✅ Removed `passwordHash` (using Clerk)
- ✅ Added ADMIN role
- ✅ Added `originalPrice` to Agent
- ✅ Added `shortDescription`, `category`, `tags`, `features` to Agent
- ✅ Added `stripePaymentIntentId` to Order
- ✅ Created `OrderItem` model for multi-item orders
- ✅ Updated User model to use Clerk ID directly

---

## Next Steps After Database Setup

1. ✅ Database connected
2. ⏭️ Phase 2: Clerk Webhook Setup
3. ⏭️ Phase 3: Product APIs
4. ⏭️ Phase 4: Cart & Orders
5. ⏭️ Phase 5: Stripe Payments
6. ⏭️ Phase 6: API Key System
7. ⏭️ Phase 7: Image Upload

---

## Current Status

- ✅ Prisma schema updated
- ✅ Helper files created
- ⏳ Waiting for Neon DATABASE_URL
- ⏳ Ready to run migrations

---

**Once you have the Neon connection string, add it to `.env.local` and we'll run the migrations!**

