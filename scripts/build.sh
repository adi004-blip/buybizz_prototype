#!/bin/sh

# Build script for Vercel that handles migrations gracefully
# Check migration status first, only deploy if there are pending migrations

echo "🔍 Checking migration status..."
npx prisma migrate status

MIGRATION_STATUS=$?

if [ $MIGRATION_STATUS -eq 0 ]; then
  echo "✅ No pending migrations, skipping migrate deploy"
  echo "📦 Generating Prisma Client..."
  npx prisma generate
  echo "🏗️ Building Next.js app..."
  next build
elif [ $MIGRATION_STATUS -eq 1 ]; then
  echo "📝 Pending migrations detected, deploying..."
  npx prisma migrate deploy
  echo "📦 Generating Prisma Client..."
  npx prisma generate
  echo "🏗️ Building Next.js app..."
  next build
else
  echo "⚠️ Error checking migration status, continuing with build..."
  echo "📦 Generating Prisma Client..."
  npx prisma generate
  echo "🏗️ Building Next.js app..."
  next build
fi

