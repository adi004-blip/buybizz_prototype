# Clerk Webhook Setup - Configuration Summary

## Webhook Secret Received ✅

Your Clerk webhook signing secret:
```
whsec_qjKzeir55RWMKu4RhgH6qGLkdr8GC4Aj
```

## Step 1: Add to Vercel Environment Variables

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add a new variable:
   - **Key**: `CLERK_WEBHOOK_SECRET`
   - **Value**: `whsec_qjKzeir55RWMKu4RhgH6qGLkdr8GC4Aj`
   - **Environment**: Select all (Production, Preview, Development)
   - Click **Save**

4. **Important**: After adding the variable, redeploy your application:
   - Go to **Deployments** tab
   - Click the three dots (⋯) on the latest deployment
   - Click **Redeploy**

## Step 2: Configure Webhook in Clerk Dashboard

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your application
3. Go to **Webhooks** in the left sidebar
4. Click **Add Endpoint** (or edit existing endpoint)

5. **Endpoint URL**: 
   ```
   https://YOUR-VERCEL-APP.vercel.app/api/webhooks/clerk
   ```
   Replace `YOUR-VERCEL-APP` with your actual Vercel app name
   
   Example: `https://buybizz-prototype.vercel.app/api/webhooks/clerk`

6. **Subscribe to Events**:
   - ✅ `user.created`
   - ✅ `user.updated`
   - ✅ `user.deleted` (optional)

7. Click **Create** or **Update**

8. After creating, Clerk will show the **Signing Secret** - this should match:
   ```
   whsec_qjKzeir55RWMKu4RhgH6qGLkdr8GC4Aj
   ```

## Step 3: Test the Webhook

### Test 1: Sign Up a New User
1. Visit your deployed Vercel app
2. Sign up a new user via Clerk authentication
3. Check Vercel function logs:
   - Go to Vercel Dashboard → Your Project → **Functions** tab
   - Look for `/api/webhooks/clerk`
   - Check logs for "User created: {userId}"

### Test 2: Verify Database Sync
1. Sign up a new user
2. Check your Neon database:
   ```bash
   npx prisma studio
   ```
   Or use Neon Dashboard SQL Editor to query:
   ```sql
   SELECT * FROM users ORDER BY created_at DESC LIMIT 5;
   ```

### Test 3: Test Webhook Directly (Optional)
You can test the webhook endpoint from Clerk Dashboard:
1. Go to Clerk Dashboard → Webhooks
2. Click on your webhook endpoint
3. Click **Send test event**
4. Check Vercel logs to see if it was received

## Troubleshooting

### Webhook Not Receiving Events
- ✅ Verify `CLERK_WEBHOOK_SECRET` is set in Vercel (all environments)
- ✅ Verify webhook URL in Clerk matches your Vercel URL exactly
- ✅ Check that you've redeployed after adding the secret
- ✅ Check Vercel function logs for errors

### Users Not Appearing in Database
- ✅ Check Vercel function logs for webhook processing errors
- ✅ Verify database connection string is correct in Vercel
- ✅ Check Neon database is accessible
- ✅ Fallback: Users will be created on first login via `getCurrentUser()` function

### Common Errors

**"Error: CLERK_WEBHOOK_SECRET not configured"**
- Solution: Add the secret to Vercel environment variables and redeploy

**"Error occured -- verification failed"**
- Solution: Secret mismatch - verify the secret in Clerk Dashboard matches Vercel

**"Error occured -- no svix headers"**
- Solution: Webhook URL incorrect or Clerk can't reach it - verify URL

## Environment Variables Checklist

Make sure these are all set in Vercel:

- [x] `DATABASE_URL` - Neon PostgreSQL connection string
- [x] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - From Clerk Dashboard
- [x] `CLERK_SECRET_KEY` - From Clerk Dashboard  
- [x] `CLERK_WEBHOOK_SECRET` - `whsec_qjKzeir55RWMKu4RhgH6qGLkdr8GC4Aj` ✅

## Next Steps

After webhook is configured and tested:

1. ✅ Users will automatically sync to database on signup
2. ✅ User profile updates will sync automatically  
3. ✅ Ready to implement Phase 3: Product/Agent Management APIs
4. ✅ Ready to test vendor/admin role promotions

---

**Status**: Webhook secret received ✅  
**Action Required**: Add to Vercel environment variables and configure webhook endpoint in Clerk Dashboard

