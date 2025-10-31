# Testing Guide - BuyBizz MVP

## Prerequisites

1. ✅ App deployed on Vercel
2. ✅ Database connected (Neon)
3. ✅ Clerk authentication working
4. ✅ Webhook configured

## Step 1: Create a Test User

1. Visit your deployed app: `https://your-app.vercel.app`
2. Click **Sign Up** (via Clerk)
3. Create a test account with your email
4. Complete the signup process

## Step 2: Promote User to VENDOR

You need to promote a user to VENDOR role to access vendor features. Two options:

### Option A: Via Admin API (if you have admin account)

1. Get your user ID from Clerk Dashboard or browser console
2. Call the admin API:
   ```bash
   curl -X PATCH https://your-app.vercel.app/api/admin/users/USER_ID/role \
     -H "Content-Type: application/json" \
     -d '{"role": "VENDOR"}'
   ```

### Option B: Direct Database Update (Easier for testing)

1. Go to Neon Dashboard → SQL Editor
2. Run this query (replace `YOUR_EMAIL` with your test email):
   ```sql
   UPDATE users 
   SET role = 'VENDOR' 
   WHERE email = 'YOUR_EMAIL@example.com';
   ```
3. Or promote by Clerk user ID:
   ```sql
   UPDATE users 
   SET role = 'VENDOR' 
   WHERE id = 'clerk_user_id_here';
   ```

## Step 3: Test Vendor Flow

### 3.1 Access Vendor Dashboard

1. Visit: `https://your-app.vercel.app/vendor`
2. Should see "VENDOR DASHBOARD" (if promoted to VENDOR)
3. If redirected to home, user is not VENDOR yet

### 3.2 Create an AI Agent

1. Click **"ADD PRODUCT"** or visit `/vendor/products/new`
2. Fill out the form:
   - **Name**: AI COPYWRITER PRO
   - **Short Description**: LIFETIME ACCESS TO AI-POWERED COPYWRITING AGENT
   - **Full Description**: PREMIUM AI-POWERED COPYWRITING AGENT WITH ADVANCED FEATURES. WRITE BETTER COPY FASTER.
   - **Category**: WRITING AI
   - **Price**: 97
   - **Original Price**: 297
   - **Features**: Add features like "NATURAL LANGUAGE PROCESSING", "MULTIPLE TONES", "SEO OPTIMIZED"
   - **Demo URL**: https://demo.example.com (optional)
   - **Documentation URL**: https://docs.example.com (optional)
3. Click **"SAVE"**
4. Should redirect to vendor dashboard
5. Product should appear in dashboard

### 3.3 View Products in Shop

1. Visit: `https://your-app.vercel.app/shop`
2. Your agent should appear in the list
3. Try filtering by category
4. Try searching

### 3.4 View Product Details

1. Click on your agent from shop page
2. Should see full product details
3. Should see vendor info

### 3.5 Edit Product

1. Go to vendor dashboard: `/vendor`
2. Click **"EDIT"** on a product
3. Make changes (e.g., update price, description)
4. Click **"SAVE CHANGES"**
5. Changes should be reflected

### 3.6 Delete Product

1. From vendor dashboard, click **"DELETE"** button
2. Confirm deletion
3. Product should disappear from dashboard and shop

## Step 4: Test Public Flow (Customer)

### 4.1 Browse Shop

1. Visit `/shop` (while logged out or as customer)
2. Should see all ACTIVE agents
3. Try category filters
4. Try search

### 4.2 View Product

1. Click on any agent
2. Should see full details
3. Should see vendor info
4. Links should work

## Troubleshooting

### "Access Denied" on `/vendor`
- User is not VENDOR role
- Check user role in database: `SELECT id, email, role FROM users WHERE email = 'your@email.com';`
- Update role: `UPDATE users SET role = 'VENDOR' WHERE email = 'your@email.com';`

### Products Not Showing in Shop
- Check product status: `SELECT id, name, status FROM agents;`
- Status must be `ACTIVE` to show in shop
- Update if needed: `UPDATE agents SET status = 'ACTIVE' WHERE id = 'agent_id';`

### API Errors
- Check Vercel function logs
- Check browser console for errors
- Verify environment variables are set in Vercel

### Database Connection Issues
- Verify `DATABASE_URL` in Vercel environment variables
- Check Neon dashboard for database status
- Test connection: Visit `/api/test-db`

## Quick SQL Queries for Testing

```sql
-- Check all users
SELECT id, email, role, full_name FROM users;

-- Check all agents
SELECT id, name, price, status, vendor_id FROM agents;

-- Promote user to VENDOR
UPDATE users SET role = 'VENDOR' WHERE email = 'your@email.com';

-- Create test agent (if needed)
-- First get a vendor_id from users table
INSERT INTO agents (id, vendor_id, name, description, price, status)
VALUES (
  gen_random_uuid()::text,
  'vendor_user_id_here',
  'TEST AI AGENT',
  'TEST DESCRIPTION',
  99.00,
  'ACTIVE'
);
```

## Next Steps After Testing

Once vendor flow is tested:
1. ✅ Phase 4: Cart & Orders
2. ✅ Phase 5: Stripe Payments
3. ✅ Phase 6: API Key Generation
4. ✅ Phase 7: Image Upload

