# BuyBizz - AI Agents Marketplace

A Next.js e-commerce marketplace platform for AI agents with lifetime deals. Built with Next.js 16, TypeScript, Prisma, Neon PostgreSQL, Clerk Auth, and Tailwind CSS.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Neon PostgreSQL database account
- Clerk account for authentication

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd prototype-1
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create `.env.local` file:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@host.neon.tech:5432/dbname?sslmode=require"

   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
   CLERK_SECRET_KEY="sk_test_..."

   # Clerk Webhook (after setting up webhook)
   CLERK_WEBHOOK_SECRET="whsec_..."
   ```

4. **Set up database**
   ```bash
   # Generate Prisma Client
   npx prisma generate

   # Run migrations (for local development)
   npx prisma migrate dev

   # Or apply migrations manually via Neon Dashboard SQL Editor
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

6. **Open browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📋 Database Setup

### Step 1: Create Neon Database
1. Go to [neon.tech](https://neon.tech) and create an account
2. Create a new project
3. Copy the connection string

### Step 2: Add Connection String
Add `DATABASE_URL` to `.env.local` (see Quick Start section)

### Step 3: Run Migrations

**For Local Development:**
```bash
npx prisma migrate dev --name migration_name
```

**For Production (Manual via Neon Dashboard):**
1. Go to Neon Dashboard → SQL Editor
2. Copy SQL from `prisma/migrations/[timestamp]_migration_name/migration.sql`
3. Run SQL directly

**Migration Files:**
- `20251031033411_init` - Initial schema
- `20251101150800_add_cart_model` - Cart functionality
- `20251101160000_remove_useragent_unique_constraint` - Multiple API keys support
- `20251101170000_add_vendor_application_model` - Vendor application system

---

## 🔐 Clerk Authentication Setup

### Step 1: Create Clerk Application
1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Create a new application
3. Copy `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`

### Step 2: Configure Webhook
1. Go to Clerk Dashboard → Webhooks → Add Endpoint
2. **Endpoint URL**: `https://your-app.vercel.app/api/webhooks/clerk`
3. **Events to subscribe**:
   - ✅ `user.created`
   - ✅ `user.updated`
   - ✅ `user.deleted`
4. Copy the signing secret (`whsec_...`)
5. Add `CLERK_WEBHOOK_SECRET` to environment variables

---

## 🚢 Vercel Deployment

### Step 1: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Framework will auto-detect as Next.js

### Step 2: Add Environment Variables
In Vercel project settings → Environment Variables, add:
- `DATABASE_URL`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `CLERK_WEBHOOK_SECRET`

**Important**: Add to all environments (Production, Preview, Development)

### Step 3: Configure Build Settings
Vercel automatically detects Prisma. The build command runs:
```bash
prisma generate && next build
```

**Note**: Migrations are NOT run automatically during build (to prevent timeouts). Apply them manually via Neon Dashboard.

### Step 4: Redeploy
After adding environment variables, Vercel will auto-deploy on next push to GitHub.

---

## 🗄️ Database Migrations

### Migration Strategy
**Problem**: `prisma migrate deploy` was timing out during Vercel builds.

**Solution**: Migrations run manually via Neon Dashboard SQL Editor.

### Workflow

1. **Create Migration Locally:**
   ```bash
   npx prisma migrate dev --name migration_name
   ```

2. **Apply to Production** (Choose one):

   **Option A: Neon Dashboard** (Recommended)
   - Go to Neon Dashboard → SQL Editor
   - Copy SQL from `prisma/migrations/[timestamp]_migration_name/migration.sql`
   - Run SQL directly

   **Option B: Vercel CLI**
   ```bash
   vercel env pull .env.local
   npx prisma migrate deploy
   ```

   **Option C: Direct Command**
   ```bash
   DATABASE_URL="your-production-url" npx prisma migrate deploy
   ```

### Why This Approach?
- ✅ Prevents build timeouts
- ✅ Faster deployments
- ✅ More control over when migrations run
- ✅ Can run migrations during low-traffic periods

---

## 📁 Project Structure

```
prototype-1/
├── app/                      # Next.js app directory
│   ├── api/                  # API routes
│   │   ├── admin/           # Admin endpoints
│   │   ├── agents/          # Product endpoints
│   │   ├── cart/            # Cart endpoints
│   │   ├── orders/          # Order endpoints
│   │   ├── user/            # User endpoints
│   │   ├── vendor/          # Vendor endpoints
│   │   └── webhooks/        # Webhook handlers
│   ├── account/             # User account pages
│   ├── admin/               # Admin dashboard
│   ├── vendor/              # Vendor dashboard
│   ├── shop/                # Shop page
│   ├── product/              # Product pages
│   └── components/          # React components
├── lib/                      # Utility functions
│   ├── auth.ts              # Authentication helpers
│   ├── db.ts                # Prisma client
│   └── api-keys.ts          # API key generation
├── prisma/                   # Database schema & migrations
│   ├── schema.prisma        # Prisma schema
│   └── migrations/          # Migration files
└── public/                   # Static assets
```

---

## 🔑 Key Features

### User Features
- ✅ Browse AI agents marketplace
- ✅ Add to cart and checkout
- ✅ View purchases and API keys
- ✅ Account settings

### Vendor Features
- ✅ Vendor application system (admin approval)
- ✅ Product management (create, edit, delete)
- ✅ Order management
- ✅ Analytics dashboard
- ✅ Sales statistics

### Admin Features
- ✅ User management
- ✅ Product management
- ✅ Order management
- ✅ Vendor application approval/rejection
- ✅ Platform statistics

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: Neon PostgreSQL
- **ORM**: Prisma
- **Authentication**: Clerk
- **Styling**: Tailwind CSS v4 + Shadcn UI
- **Design**: Neobrutalism (Gumroad-style)
- **Deployment**: Vercel

---

## 📝 Available Scripts

```bash
# Development
npm run dev              # Start development server

# Production
npm run build           # Build for production
npm start               # Start production server

# Database
npm run migrate:dev     # Create and apply migration locally
npm run migrate:deploy # Apply migrations (production)
npm run migrate:status # Check migration status

# Prisma
npx prisma studio       # Open Prisma Studio (database GUI)
npx prisma generate     # Generate Prisma Client
```

---

## 🔧 Admin Access

### Promoting a User to Admin

**Option 1: Direct SQL (Neon Dashboard)**
```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your-email@example.com';
```

**Option 2: Via Admin API** (requires existing admin)
Visit `/promote-admin` page for instructions.

---

## 🐛 Troubleshooting

### Build Fails - Prisma Errors
- Ensure `DATABASE_URL` is set in Vercel environment variables
- Check that migrations have been applied to production database
- Verify Prisma client is generated: `npx prisma generate`

### Webhook Not Working
- Verify `CLERK_WEBHOOK_SECRET` is set in Vercel
- Check webhook URL in Clerk Dashboard matches your Vercel URL
- Check Vercel function logs: Dashboard → Functions → `/api/webhooks/clerk`

### Database Connection Issues
- Verify `DATABASE_URL` has correct SSL mode (`?sslmode=require`)
- Check Neon dashboard to ensure database is active
- Verify connection string format is correct

### Environment Variables Not Working
- Ensure variables are added to all environments (Production, Preview, Development)
- Redeploy after adding new environment variables
- Check variable names match exactly (case-sensitive)

---

## 🚧 Remaining Tasks

### High Priority (MVP)
- [ ] Payment Integration (Stripe/Razer Pay)
- [ ] Image Upload (Cloudinary/Uploadthing)

### Medium Priority
- [ ] Email Notifications (Resend/SendGrid)
- [ ] Search & Filter Improvements
- [ ] Product Reviews/Ratings

### Low Priority (Post-MVP)
- [ ] Wishlist/Favorites
- [ ] Advanced Analytics
- [ ] Affiliate System

---

## 📚 API Endpoints

### Public Endpoints
- `GET /api/agents` - List all agents
- `GET /api/agents/[id]` - Get single agent
- `GET /api/creators` - List all creators
- `GET /api/creators/[id]` - Get creator profile

### Protected Endpoints (Authentication Required)
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add to cart
- `PUT /api/cart/[id]` - Update cart item
- `DELETE /api/cart/[id]` - Remove cart item
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/[id]` - Get order details
- `GET /api/user/agents` - Get user's purchased agents
- `GET /api/user/role` - Get user role

### Vendor Endpoints (Vendor Role Required)
- `POST /api/agents` - Create agent
- `PUT /api/agents/[id]` - Update agent
- `DELETE /api/agents/[id]` - Delete agent
- `GET /api/vendor/orders` - Get vendor orders
- `GET /api/vendor/stats` - Get vendor statistics
- `POST /api/vendor/register` - Submit vendor application

### Admin Endpoints (Admin Role Required)
- `GET /api/admin/stats` - Platform statistics
- `GET /api/admin/users` - List all users
- `PATCH /api/admin/users/[userId]/role` - Update user role
- `GET /api/admin/products` - List all products
- `GET /api/admin/orders` - List all orders
- `GET /api/admin/vendor-applications` - List vendor applications
- `PATCH /api/admin/vendor-applications` - Approve/reject application

---

## 🎨 Design System

### Neobrutalism (Gumroad-style)
- Softer color tones
- Refined shadows (`rgba(0, 0, 0, 0.1)`)
- Thinner borders (2px-3px)
- Rounded corners (8px base)
- Smooth hover transitions

### Color Palette
- Yellow: `#ffd700`
- Pink: `#ff6b9d`
- Cyan: `#00d4ff`
- Green: `#00c853`
- Blue: `#2196f3`
- Purple: `#9c27b0`

---

## 📄 License

Private project - All rights reserved

---

## 👥 Support

For issues or questions:
1. Check Vercel function logs
2. Check Neon database logs
3. Check Clerk webhook logs
4. Review API responses in browser console

---

## 📖 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Neon Documentation](https://neon.tech/docs)
- [Vercel Documentation](https://vercel.com/docs)

---

**Last Updated**: November 2024
