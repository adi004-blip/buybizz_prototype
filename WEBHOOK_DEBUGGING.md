# Webhook Debugging Guide

## Issue: User Created in Clerk but Not in Database

### Improved Error Logging ✅

I've updated the webhook endpoint to:
1. ✅ Log detailed error messages
2. ✅ Check for DATABASE_URL configuration
3. ✅ Return proper error responses (not silent failures)
4. ✅ Include error codes and metadata

### Next Steps to Debug

1. **Check Vercel Function Logs**:
   - Go to Vercel Dashboard → Your Project → **Functions** tab
   - Click on `/api/webhooks/clerk`
   - Look for logs with `[Webhook]` prefix
   - Check for error messages

2. **Verify Environment Variables in Vercel**:
   - Go to **Settings** → **Environment Variables**
   - Verify `DATABASE_URL` is set correctly
   - Make sure it's set for **all environments** (Production, Preview, Development)
   - The connection string should be:
     ```
     postgresql://neondb_owner:npg_hOFE0egHJX8o@ep-wild-hill-a4cth4tz-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
     ```
   - **Note**: You might need to remove `&channel_binding=require` if it's causing issues

3. **Test Database Connection**:
   - Try connecting to Neon from Vercel using the same connection string
   - Check Neon Dashboard → **Connection Details** → Use the **Connection pooling** URL

4. **Common Issues**:

   **Issue: Connection String Format**
   - ✅ Make sure it starts with `postgresql://` (not `postgres://`)
   - ✅ Check for extra characters or spaces
   - ✅ Verify SSL mode: `?sslmode=require`
   - ⚠️ Try removing `&channel_binding=require` if present

   **Issue: Connection Pooling**
   - Neon provides two connection strings:
     - **Direct connection**: `ep-xxx-xxx.us-east-1.aws.neon.tech`
     - **Connection pooling**: `ep-xxx-xxx-pooler.us-east-1.aws.neon.tech`
   - For serverless (Vercel), use the **pooler** URL (which you already have)

   **Issue: Database Not Migrated**
   - Run migrations on production database:
     ```bash
     DATABASE_URL="your-production-url" npx prisma migrate deploy
     ```

5. **Check Clerk Webhook Logs**:
   - Go to Clerk Dashboard → Webhooks
   - Click on your webhook endpoint
   - Check **Recent Deliveries** tab
   - Look for failed requests (should show error messages now)

6. **Manual Test**:
   - Create a test API route to verify database connection:
     ```typescript
     // app/api/test-db/route.ts
     import { db } from "@/lib/db";
     
     export async function GET() {
       try {
         const count = await db.user.count();
         return Response.json({ success: true, userCount: count });
       } catch (error: any) {
         return Response.json({ 
           success: false, 
           error: error.message,
           code: error.code 
         }, { status: 500 });
       }
     }
     ```
   - Visit `https://your-app.vercel.app/api/test-db`
   - This will test if the database connection works

### Expected Log Output

**Success**:
```
[Webhook] Received webhook request
[Webhook] Attempting to create user: user_xxx, email: test@example.com
[Webhook] User created successfully: user_xxx
```

**Failure** (should now show):
```
[Webhook] Received webhook request
[Webhook] Attempting to create user: user_xxx, email: test@example.com
[Webhook] Error creating user: {
  userId: "user_xxx",
  error: "P2002: Unique constraint failed...",
  code: "P2002",
  meta: { ... }
}
```

### Quick Fixes to Try

1. **Update DATABASE_URL in Vercel**:
   - Remove `&channel_binding=require` from connection string
   - Use pooler URL (you already have this)
   - Make sure it's set for all environments

2. **Redeploy**:
   - After updating environment variables, redeploy
   - Check new function logs

3. **Verify Tables Exist**:
   - Check Neon Dashboard → SQL Editor
   - Run: `SELECT * FROM users LIMIT 1;`
   - If table doesn't exist, run migrations

---

After deploying the updated code, check Vercel function logs and share the error message you see. This will help identify the exact issue.

