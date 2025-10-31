# Clerk Webhook Setup Guide

## Overview
This guide explains how to set up the Clerk webhook to automatically sync users to your database when they sign up or update their profile.

## Step 1: Get Your Webhook Secret

1. Go to your [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your application
3. Go to **Webhooks** in the left sidebar
4. Click **Add Endpoint** (or edit existing endpoint)

## Step 2: Configure the Webhook Endpoint

### For Local Development (Using ngrok or similar):

1. Start your Next.js app: `npm run dev`
2. Install and run ngrok (or similar tunnel tool):
   ```bash
   # Install ngrok (if not installed)
   brew install ngrok  # macOS
   
   # Start tunnel
   ngrok http 3000
   ```
3. Copy the ngrok URL (e.g., `https://abc123.ngrok.io`)

### For Production:

Use your production domain (e.g., `https://yourdomain.com`)

### Configure in Clerk Dashboard:

1. **Endpoint URL**: `https://yourdomain.com/api/webhooks/clerk` (or your ngrok URL + `/api/webhooks/clerk`)
2. **Events to listen to**:
   - ✅ `user.created`
   - ✅ `user.updated`
   - ✅ `user.deleted` (optional)

3. Click **Create** or **Update**

4. **Copy the Signing Secret**:
   - After creating the webhook, Clerk will show a **Signing Secret**
   - It starts with `whsec_`
   - Copy this secret

## Step 3: Add Webhook Secret to Environment Variables

Add the webhook secret to your `.env.local` file:

```env
CLERK_WEBHOOK_SECRET="whsec_..."
```

**Important**: Never commit this secret to Git!

## Step 4: Test the Webhook

### Option 1: Test via Clerk Dashboard

1. Go to the webhook endpoint in Clerk Dashboard
2. Click **Send test event**
3. Check your Next.js server logs to see if the webhook was processed

### Option 2: Test by Creating a User

1. Sign up a new user via your app
2. Check your database to verify the user was created:
   ```bash
   npx prisma studio
   ```
3. Or check your server logs for "User created: {userId}"

## Step 5: Verify User Sync

You can verify users are being synced by:

1. **Database Check**:
   ```bash
   npx prisma studio
   ```
   Navigate to the `users` table and verify new users appear.

2. **API Check**:
   The `getCurrentUser()` function in `lib/auth.ts` will automatically create users if they don't exist (fallback), but ideally the webhook handles this.

## Troubleshooting

### Webhook not receiving events

1. **Check webhook URL**: Make sure the URL is correct and accessible
2. **Check logs**: Look at your Next.js server logs for errors
3. **Verify secret**: Ensure `CLERK_WEBHOOK_SECRET` matches the secret in Clerk Dashboard
4. **Test endpoint**: Visit `https://yourdomain.com/api/webhooks/clerk` - should return "POST only" message

### Users not appearing in database

1. **Check webhook logs** in Clerk Dashboard
2. **Check server logs** for error messages
3. **Verify database connection** - ensure `DATABASE_URL` is correct
4. **Fallback**: Users will be created on first login via `getCurrentUser()` fallback

### Common Errors

- **"Error occured -- no svix headers"**: Webhook not being called by Clerk, check endpoint URL
- **"Error: CLERK_WEBHOOK_SECRET not configured"**: Add `CLERK_WEBHOOK_SECRET` to `.env.local`
- **"Error occured -- verification failed"**: Secret mismatch, verify the secret in Clerk matches `.env.local`

## Next Steps

After setting up the webhook:

1. ✅ Users will automatically sync to database on signup
2. ✅ User profile updates will sync automatically
3. ✅ Ready to implement role management (VENDOR/ADMIN promotion)
4. ✅ Ready to protect routes based on user roles

## Role Management

To promote a user to VENDOR or ADMIN, use the API endpoint:

```bash
PATCH /api/admin/users/{userId}/role
Content-Type: application/json
Authorization: Bearer {admin_token}

{
  "role": "VENDOR"  // or "ADMIN" or "CUSTOMER"
}
```

**Note**: Only admins can update user roles. Protect your admin dashboard accordingly.

