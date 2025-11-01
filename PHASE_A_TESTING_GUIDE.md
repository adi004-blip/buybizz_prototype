# Testing Guide - Phase A: User Account Pages

## ⚠️ IMPORTANT: Database Migration Required

Before testing, you need to apply a database migration to fix a schema issue:

1. **The Problem**: The `UserAgent` table has a unique constraint `@@unique([userId, agentId])` which prevents users from having multiple API keys for the same agent. This breaks the order creation flow when quantity > 1.

2. **The Fix**: We've removed this constraint and added indexes instead.

### Apply Migration:

**Option A: Via Prisma Migrate (Recommended)**
```bash
npx prisma migrate dev --name remove_useragent_unique_constraint
```

**Option B: Manual SQL (if migrate fails)**
Run this SQL in Neon Dashboard → SQL Editor:
```sql
ALTER TABLE "user_agents" DROP CONSTRAINT IF EXISTS "user_agents_user_id_agent_id_key";
CREATE INDEX IF NOT EXISTS "user_agents_user_id_idx" ON "user_agents"("user_id");
CREATE INDEX IF NOT EXISTS "user_agents_user_id_agent_id_idx" ON "user_agents"("user_id", "agent_id");
```

---

## Test Checklist

### 1. Test User Purchases Page (`/account/purchases`)

**Prerequisites:**
- User must be signed in
- User should have at least one completed order

**Steps:**
1. Sign in as a user who has made purchases
2. Navigate to `/account/purchases`
3. Check:
   - ✅ Page loads without errors
   - ✅ Shows all purchased agents
   - ✅ Displays API keys for each agent
   - ✅ Shows stats (total agents, total spent, total API keys)
   - ✅ Copy API key button works
   - ✅ Links to product pages work
   - ✅ Documentation/demo links work (if available)

**Expected Behavior:**
- If user has no purchases: Shows "NO PURCHASES YET" message
- If user has purchases: Shows all agents with their API keys grouped

### 2. Test Downloads Page (`/account/downloads`)

**Steps:**
1. Navigate to `/account/downloads`
2. Check:
   - ✅ Page loads without errors
   - ✅ Shows all API keys
   - ✅ Copy API key button works
   - ✅ Filter by agent query param works (`/account/downloads?agent=AGENT_ID`)
   - ✅ Security notice displays

**Expected Behavior:**
- Shows all API keys from all purchased agents
- If filtered by agent: Shows only keys for that agent
- Each agent can have multiple API keys displayed

### 3. Test API Endpoint (`/api/user/agents`)

**Steps:**
1. Sign in as a user
2. Visit `/api/user/agents` (or use Postman/curl)
3. Check response:
   ```json
   {
     "agents": [...],
     "totalAgents": 2,
     "totalApiKeys": 3
   }
   ```

**Expected Response:**
- Returns array of agents
- Each agent has `apiKeys` array (can have multiple keys)
- Groups multiple purchases of same agent correctly

### 4. Test Edge Cases

**Test Case 1: User with no purchases**
- Navigate to `/account/purchases`
- Should show empty state

**Test Case 2: User with multiple purchases of same agent**
- Purchase same agent multiple times (or with quantity > 1)
- Check that all API keys are shown
- Verify grouping works correctly

**Test Case 3: Unauthenticated user**
- Try to access `/account/purchases` without signing in
- Should redirect to `/sign-in`

### 5. Test Debug Endpoint (`/api/test/user-agents`)

**Steps:**
1. Sign in as a user
2. Visit `/api/test/user-agents`
3. Check response for:
   - Total orders
   - Total UserAgent records
   - Any duplicate user+agent combinations
   - Order details

**Expected:**
- Shows detailed breakdown of user's orders and API keys
- Helps identify any data inconsistencies

---

## Common Issues & Fixes

### Issue 1: "Unique constraint violation" when creating order
**Cause**: Migration not applied  
**Fix**: Apply the migration (see above)

### Issue 2: Empty purchases page when user has orders
**Cause**: UserAgent records not created during order creation  
**Fix**: Check order creation logs, verify order status is COMPLETED

### Issue 3: API returns 401 Unauthorized
**Cause**: User not authenticated  
**Fix**: Sign in first

### Issue 4: API keys not showing
**Cause**: UserAgent records missing or order status not COMPLETED  
**Fix**: Check database for UserAgent records linked to user's orders

---

## Test Data Setup

To create test data:

1. **Create a test agent** (as vendor):
   - Go to `/vendor/products/new`
   - Create an agent with price $99

2. **Purchase agent** (as customer):
   - Go to `/shop`
   - Add agent to cart
   - Go to `/cart`
   - Update quantity to 2 (if testing multiple keys)
   - Go to `/checkout`
   - Complete order (will create order with status PENDING)

3. **Verify UserAgent records**:
   - Check `/api/test/user-agents`
   - Should show UserAgent records created

**Note**: Currently orders are created with status PENDING. You may need to manually update order status to COMPLETED in database for testing, or wait for payment integration.

---

## Success Criteria

✅ All pages load without errors  
✅ API endpoints return correct data  
✅ Multiple API keys per agent are handled correctly  
✅ Copy to clipboard works  
✅ Empty states display correctly  
✅ Authentication redirects work  
✅ No console errors  

