# Phase C Testing Guide - Admin Features & Vendor Application Workflow

## Prerequisites

1. ✅ App deployed on Vercel
2. ✅ Database migrations applied (should happen automatically)
3. ✅ At least one user account with ADMIN role
4. ✅ At least one regular user account (CUSTOMER role)

---

## Test 1: Vendor Registration Flow

### Step 1.1: Submit Vendor Application

1. **Sign in as a regular user** (not admin, not vendor)
2. Navigate to `/vendor/register` or click "SELL YOUR AI AGENT" on home page
3. Fill out the form:
   - **Company Name** (optional): "Test Company"
   - **Description**: "I want to sell AI agents for copywriting and code assistance"
4. Click **"SUBMIT APPLICATION"**
5. **Expected**: 
   - ✅ Success message or redirect to confirmation page
   - ✅ Application created with status "PENDING"

### Step 1.2: Verify Application Status

1. **As the same user**, try to access `/vendor` dashboard
2. **Expected**: 
   - ✅ Should be redirected (not a vendor yet)
   - ✅ Application is pending approval

### Step 1.3: Check Confirmation Page

1. After submitting, you should see `/vendor/register/confirmation`
2. **Expected**:
   - ✅ Shows "APPLICATION SUBMITTED" message
   - ✅ Explains approval process
   - ✅ Links to continue shopping or account settings

---

## Test 2: Admin Dashboard - Vendor Applications

### Step 2.1: View Pending Applications

1. **Sign in as ADMIN user**
2. Navigate to `/admin` dashboard
3. **Expected**:
   - ✅ Yellow alert banner showing pending applications count
   - ✅ "REVIEW NOW" button links to Applications tab

### Step 2.2: Review Applications Tab

1. Click **"APPLICATIONS"** tab (or "REVIEW NOW" button)
2. **Expected**:
   - ✅ List of all vendor applications
   - ✅ Pending applications shown with status badge
   - ✅ Shows user info, company name, description
   - ✅ "APPROVE" and "REJECT" buttons for pending applications

### Step 2.3: Approve Application

1. Find a **PENDING** application
2. Click **"APPROVE"** button
3. **Expected**:
   - ✅ Button shows loading spinner
   - ✅ Application status changes to "APPROVED"
   - ✅ User is promoted to VENDOR role (check database or user API)
   - ✅ Application shows "Reviewed" timestamp

### Step 2.4: Verify Vendor Promotion

1. **Sign out** from admin account
2. **Sign in as the user whose application was approved**
3. Navigate to `/vendor` dashboard
4. **Expected**:
   - ✅ Should now access vendor dashboard successfully
   - ✅ Can create products, view orders, etc.

### Step 2.5: Reject Application (Optional)

1. **Sign in as ADMIN**
2. Navigate to `/admin` → **"APPLICATIONS"** tab
3. Find a **PENDING** application (or create a new test application)
4. Click **"REJECT"** button
5. Enter a rejection reason when prompted: "Test rejection"
6. **Expected**:
   - ✅ Application status changes to "REJECTED"
   - ✅ Rejection reason is saved and displayed
   - ✅ User remains as CUSTOMER (not promoted)

### Step 2.6: Re-apply After Rejection

1. **Sign in as user with rejected application**
2. Navigate to `/vendor/register`
3. Submit a new application
4. **Expected**:
   - ✅ New application created (status reset to PENDING)
   - ✅ Can be reviewed again by admin

---

## Test 3: Admin Dashboard - Overview Tab

### Step 3.1: View Platform Stats

1. **Sign in as ADMIN**
2. Navigate to `/admin` → **"OVERVIEW"** tab (default)
3. **Expected**:
   - ✅ Shows total vendors count
   - ✅ Shows total users count
   - ✅ Shows total products count
   - ✅ Shows total revenue
   - ✅ Shows completed orders count
   - ✅ Shows monthly revenue with growth percentage
   - ✅ Shows pending applications count

### Step 3.2: View Top Vendors

1. Scroll down to **"TOP VENDORS"** section
2. **Expected**:
   - ✅ Shows top 5 vendors by revenue
   - ✅ Shows vendor name, email, products count, revenue

### Step 3.3: View Pending Applications (Overview)

1. Scroll to **"PENDING VENDOR APPLICATIONS"** section
2. **Expected**:
   - ✅ Shows up to 5 most recent pending applications
   - ✅ "VIEW ALL" button links to Applications tab
   - ✅ Can approve/reject directly from overview

---

## Test 4: Admin Dashboard - Products Tab

### Step 4.1: View All Products

1. **Sign in as ADMIN**
2. Navigate to `/admin` → **"PRODUCTS"** tab
3. **Expected**:
   - ✅ Shows loading spinner initially
   - ✅ Lists all products with:
     - Product name
     - Vendor name and email
     - Price
     - Status (ACTIVE/INACTIVE)
     - Order count and cart count

### Step 4.2: Verify Product Data

1. Check product details
2. **Expected**:
   - ✅ Products are ordered by creation date (newest first)
   - ✅ Shows real vendor information
   - ✅ Shows accurate order statistics

---

## Test 5: Admin Dashboard - Orders Tab

### Step 5.1: View All Orders

1. **Sign in as ADMIN**
2. Navigate to `/admin` → **"ORDERS"** tab
3. **Expected**:
   - ✅ Shows loading spinner initially
   - ✅ Lists all orders with:
     - Order ID (truncated)
     - Customer name and email
     - Order amount
     - Order status (PENDING/COMPLETED/FAILED)
     - Order date
     - List of items in the order

### Step 5.2: Verify Order Details

1. Expand an order to see details
2. **Expected**:
   - ✅ Shows all items in the order
   - ✅ Shows item quantities and prices
   - ✅ Shows correct customer information

---

## Test 6: Admin Dashboard - Users Tab

### Step 6.1: View All Users

1. **Sign in as ADMIN**
2. Navigate to `/admin` → **"USERS"** tab
3. **Expected**:
   - ✅ Shows loading spinner initially
   - ✅ Lists all users with:
     - User name and email
     - Role badge (CUSTOMER/VENDOR/ADMIN)
     - Company name (if available)
     - Products count
     - Orders count

### Step 6.2: Verify User Roles

1. Check different users
2. **Expected**:
   - ✅ Shows correct role badges
   - ✅ Vendor users show product counts
   - ✅ All users show order counts

---

## Test 7: Edge Cases & Error Handling

### Test 7.1: Duplicate Application

1. **Sign in as user with PENDING application**
2. Navigate to `/vendor/register`
3. Try to submit another application
4. **Expected**:
   - ✅ Error message: "You already have a pending vendor application"
   - ✅ Cannot submit duplicate application

### Test 7.2: Already Approved User

1. **Sign in as user who is already a VENDOR**
2. Navigate to `/vendor/register`
3. Try to submit an application
4. **Expected**:
   - ✅ Error message: "Your vendor application was already approved" or redirect
   - ✅ Cannot submit application if already vendor

### Test 7.3: Non-Admin Access

1. **Sign in as regular user** (not admin)
2. Try to access `/admin` dashboard
3. **Expected**:
   - ✅ Should be redirected (403 error or redirect to home)
   - ✅ Cannot access admin features

### Test 7.4: Application Validation

1. **Sign in as regular user**
2. Navigate to `/vendor/register`
3. Submit form with **empty description** or **description < 10 characters**
4. **Expected**:
   - ✅ Error message: "Please provide a description of your AI agents (at least 10 characters)"
   - ✅ Form does not submit

---

## Test 8: API Endpoints (Optional)

### Test 8.1: Admin Stats API

```bash
curl https://your-app.vercel.app/api/admin/stats \
  -H "Cookie: your-auth-cookie"
```

**Expected**: Returns platform statistics JSON

### Test 8.2: Vendor Applications API

```bash
curl https://your-app.vercel.app/api/admin/vendor-applications \
  -H "Cookie: your-auth-cookie"
```

**Expected**: Returns list of all vendor applications

### Test 8.3: Approve Application API

```bash
curl -X PATCH https://your-app.vercel.app/api/admin/vendor-applications \
  -H "Content-Type: application/json" \
  -H "Cookie: your-auth-cookie" \
  -d '{"applicationId": "app-id-here", "action": "approve"}'
```

**Expected**: Returns success message

---

## Checklist Summary

- [ ] Vendor can submit application
- [ ] Application shows as PENDING in admin dashboard
- [ ] Admin can view pending applications
- [ ] Admin can approve application
- [ ] User is promoted to VENDOR after approval
- [ ] Approved user can access vendor dashboard
- [ ] Admin can reject application with reason
- [ ] Rejected user can re-apply
- [ ] Admin dashboard shows real platform stats
- [ ] Admin can view all products
- [ ] Admin can view all orders
- [ ] Admin can view all users
- [ ] Non-admin cannot access admin dashboard
- [ ] Duplicate applications are prevented
- [ ] Validation works for application form

---

## Common Issues & Solutions

### Issue: "No pending applications shown"
- **Solution**: Create a test application as a regular user first

### Issue: "Cannot approve application"
- **Solution**: Check that you're signed in as ADMIN user

### Issue: "User not promoted after approval"
- **Solution**: Check Vercel function logs for errors, verify database connection

### Issue: "Stats show 0 for everything"
- **Solution**: Create some test data (products, orders) first

### Issue: "Application tab shows error"
- **Solution**: Check that migration was applied (vendor_applications table exists)

---

## Next Steps After Testing

Once all tests pass:
1. ✅ Phase C is complete
2. Ready to move to Phase D (Public Pages) or payment integration
3. Consider adding email notifications for application status changes

