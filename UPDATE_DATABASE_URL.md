# Update DATABASE_URL Instructions

## Current Issue
Your `.env` file still has the old localhost connection string. You need to update it with your Neon connection string.

## How to Update

### Option 1: Manual Update (Recommended)

1. Open `.env` file in your project root
2. Find the line starting with `DATABASE_URL=`
3. Replace it with your Neon connection string

**Neon Connection String Format:**
```
DATABASE_URL="postgresql://user:password@ep-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require"
```

**Important:**
- Remove the `+` prefix if it exists
- Make sure it starts with `postgresql://` or `postgres://`
- Keep the quotes around it
- Should end with `?sslmode=require`

### Option 2: Use This Command

Copy your Neon connection string (without quotes), then run:

```bash
# Replace YOUR_NEON_CONNECTION_STRING with your actual Neon connection string
echo 'DATABASE_URL="YOUR_NEON_CONNECTION_STRING"' > temp_env && \
grep -v "^DATABASE_URL" .env >> temp_env && \
mv temp_env .env
```

## After Updating

Once you've updated the DATABASE_URL in `.env`, run:

```bash
npx prisma migrate dev --name init
```

This will create all the database tables.

## Verify Your Neon Connection String

1. Go to your Neon dashboard
2. Click on your project
3. Go to "Connection Details" or "Connection String"
4. Copy the connection string (usually marked as "Connection pooling" or "Direct connection")
5. Use the "Direct connection" for now

