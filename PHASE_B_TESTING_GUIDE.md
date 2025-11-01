# Testing Guide - Phase B: Vendor Features

## Prerequisites

1. ✅ App deployed on Vercel
2. ✅ Database connected (Neon)
3. ✅ User account with VENDOR role
4. ✅ At least one product created by the vendor
5. ✅ At least one order placed (can be test order)

---

## Test Checklist

### 1. Test Vendor Orders API (`/api/vendor/orders`)

**Steps:**
1. Sign in as a vendor
2. Visit `/api/vendor/orders` directly (or use browser dev tools)
3. Check response structure:
   ```json
   {
     "orders": [...],
     "summary": {
       "totalOrders": 0,
       "completedOrders": 0,
       "pendingOrders": 0,
       "totalRevenue": "0.00"
     }
   }
   ```

**Expected:**
- ✅ Returns array of orders (empty if no orders)
- ✅ Each order includes:
  - `id`, `customer`, `items`, `vendorRevenue`, `status`, `createdAt`
- ✅ Summary shows totals

**Common Issues:**
- 403 Error: User is not a vendor → Promote user to VENDOR role
- Empty orders: No orders exist yet → Create a test order

---

### 2. Test Vendor Stats API (`/api/vendor/stats`)

**Steps:**
1. Sign in as a vendor
2. Visit `/api/vendor/stats` directly
3. Check response:
   ```json
   {
     "totalAgents": 0,
     "totalSales": 0,
     "totalRevenue": "0.00",
     "monthlyRevenue": "0.00",
     "monthlyGrowth": 0,
     "averageOrderValue": "0.00",
     "topProducts": []
   }
   ```

**Expected:**
- ✅ Returns all statistics
- ✅ Numbers are calculated correctly
- ✅ Empty arrays/zero values if no data

---

### 3. Test Vendor Dashboard - Overview Tab

**Steps:**
1. Sign in as a vendor
2. Navigate to `/vendor`
3. Check Overview tab (default):
   - ✅ Stats cards show correct values
   - ✅ Total Products = number of vendor's products
   - ✅ Total Sales = 0 if no orders
   - ✅ Total Revenue = 0 if no orders
   - ✅ Monthly Growth = 0 if no orders

**Expected:**
- Stats load from API
- Shows real product count
- Shows 0 for sales/revenue if no orders

---

### 4. Test Vendor Dashboard - Orders Tab

**Steps:**
1. Click "ORDERS" tab in vendor dashboard
2. Check:
   - ✅ Loading state appears briefly
   - ✅ Orders list displays (or empty state)
   - ✅ Each order shows:
     - Order ID (shortened)
     - Customer name/email
     - Order items (agent names, quantities)
     - Vendor revenue
     - Order status (COMPLETED/PENDING/FAILED)
     - Order date

**Expected:**
- Orders are fetched from API
- Shows vendor's revenue per order (not full order amount)
- Multiple items per order are displayed correctly
- Empty state if no orders

**Test Scenario:**
1. Create a product as vendor
2. Sign in as different user (customer)
3. Add product to cart
4. Complete checkout (creates order)
5. Sign back in as vendor
6. Check Orders tab → Should see the order

---

### 5. Test Vendor Dashboard - Analytics Tab

**Steps:**
1. Click "ANALYTICS" tab in vendor dashboard
2. Check:
   - ✅ Loading state appears briefly
   - ✅ Stats cards display:
     - Total Sales (units sold)
     - Total Revenue (all time)
     - Monthly Revenue (this month)
     - Monthly Growth (% vs last month)
   - ✅ Top Selling Products section
   - ✅ Performance Metrics section

**Expected:**
- All stats calculated correctly
- Monthly growth shows percentage
- Top products sorted by revenue
- Empty states if no data

---

### 6. Test Edge Cases

**Test Case 1: Vendor with no products**
- New vendor account
- Should show 0 products, 0 sales, 0 revenue

**Test Case 2: Vendor with products but no orders**
- Products exist but no orders
- Should show products count, but 0 sales/revenue

**Test Case 3: Multiple orders**
- Vendor has multiple orders
- Orders tab should show all orders
- Stats should aggregate correctly

**Test Case 4: Orders with multiple items**
- Order contains multiple products
- Should show all items in order details
- Revenue should sum correctly

---

## Creating Test Data

### Step 1: Create a Test Product (as Vendor)

1. Sign in as vendor
2. Go to `/vendor/products/new`
3. Fill out form:
   - Name: "TEST AI AGENT"
   - Price: $99
   - Description: "Test agent for testing"
   - Status: ACTIVE
4. Submit

### Step 2: Create a Test Order (as Customer)

1. Sign in as customer (different account)
2. Go to `/shop`
3. Find and add vendor's product to cart
4. Go to `/cart`
5. Go to `/checkout`
6. Fill out checkout form (name, email)
7. Submit order

**Note:** Order will be created with status PENDING (since payment not integrated yet)

### Step 3: Verify Order Appears (as Vendor)

1. Sign back in as vendor
2. Go to `/vendor` → Orders tab
3. Should see the order!

### Step 4: Manually Update Order Status (Optional)

If you want to test COMPLETED status:

1. Go to Neon Dashboard → SQL Editor
2. Run:
   ```sql
   UPDATE orders 
   SET status = 'COMPLETED' 
   WHERE id = 'order_id_here';
   ```
3. Refresh vendor dashboard → Order should show as COMPLETED

---

## Success Criteria

✅ Orders API returns correct data  
✅ Stats API returns correct calculations  
✅ Overview tab shows real stats  
✅ Orders tab displays orders correctly  
✅ Analytics tab shows all metrics  
✅ Loading states work  
✅ Empty states display correctly  
✅ No console errors  
✅ No API errors  

---

## Common Issues & Fixes

### Issue 1: "Vendor access required" error
**Fix:** User needs VENDOR role. Update in database:
```sql
UPDATE users SET role = 'VENDOR' WHERE id = 'user_id';
```

### Issue 2: Orders not showing
**Fix:** Check:
- Order exists in database
- Order contains vendor's products
- Order status is correct

### Issue 3: Stats showing 0
**Fix:** 
- Need at least one order
- Order must contain vendor's products
- Check order status is COMPLETED (for some calculations)

### Issue 4: Monthly growth calculation wrong
**Fix:** 
- Need orders from current month and last month
- Calculation compares current month vs last month

---

## API Endpoints to Test

1. **GET /api/vendor/orders**
   - Requires: Vendor authentication
   - Returns: Orders with vendor's products

2. **GET /api/vendor/stats**
   - Requires: Vendor authentication
   - Returns: Sales/revenue statistics

---

## Next Steps After Testing

If everything works:
- ✅ Move to Phase C: Admin Features

If issues found:
- Check Vercel function logs
- Check browser console
- Verify database has test data
- Report any errors

