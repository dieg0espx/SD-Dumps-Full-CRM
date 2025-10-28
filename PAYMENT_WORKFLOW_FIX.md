# Payment Workflow Fix - Card Save Without Charging

## Issue Fixed
The booking creation was failing with a 400 error because we were trying to use new payment status enum values (`card_saved`, `pending_payment`) that don't exist in the database.

## Solution Applied
Changed the code to use existing `pending` status for bookings that have a card saved but haven't been charged yet. The system now identifies these bookings by checking:
- `payment_status = 'pending'` AND
- `payment_method_id IS NOT NULL`

## Current Workflow

### 1. **Customer Books (NO CHARGE)**
- Customer enters card information
- Card is saved using Stripe Setup Intent (NO charge occurs)
- Booking created with:
  - `status: 'pending'`
  - `payment_status: 'pending'`
  - `payment_method_id: <stripe_pm_id>` (saved for later)
- Customer sees: "✅ Your card will NOT be charged yet"

### 2. **Admin Reviews Bookings**
- Admin goes to Payments page
- Sees pending bookings with:
  - Status: "pending" badge (yellow)
  - Transaction ID: "⏳ Awaiting Charge - Card Saved"
  - "Show Details" button

### 3. **Admin Views Details**
- Click "Show Details" on any booking
- See complete information:
  - Customer info
  - Booking details (dates, address, container)
  - Payment info with blue banner: "⏳ Card Saved - Ready to Charge"
- Click "Charge Customer" button

### 4. **Admin Charges Customer**
- Charge dialog opens showing:
  - **Booking Amount** (automatic from booking)
  - **Extra Fees** (optional input)
  - **Total to Charge** (calculated: booking + extra fees)
  - Description field (required only if adding extra fees)
- Admin can add extra fees if needed
- Click "Charge $XXX.XX" button

### 5. **Payment Processed**
- Card charged for total amount
- Booking updated to:
  - `status: 'confirmed'`
  - `payment_status: 'paid'`
- Payment record created in database
- Customer receives receipt email from Stripe
- Booking disappears from "pending" list
- Appears in "completed" payments with green "completed" badge

### 6. **Additional Charges (Later)**
- If needed later, admin can:
  - Click "Show Details" on completed payment
  - Click "Add Extra Fee"
  - Enter additional fee amount and description
  - Charge additional amount to same card
- New payment record created
- Booking total_amount updated

## Files Modified

### 1. `components/stripe-elements.tsx`
- Changed to use Setup Intent instead of Payment Intent
- Uses `pending` status instead of `card_saved`
- Saves `payment_method_id` for admin to charge later
- Clear UI messaging that no charge occurs

### 2. `app/admin/payments/page.tsx`
- Fetches bookings with `payment_status='pending'` AND `payment_method_id IS NOT NULL`
- Marks these as `is_pending_booking: true`
- Displays with "⏳ Awaiting Charge - Card Saved" transaction ID

### 3. `components/payment-tracker.tsx`
- Shows pending bookings in list
- "Show Details" dialog displays charge-ready status
- Charge dialog calculates total (booking + extra fees)
- Dynamic button: "Charge Customer" vs "Add Extra Fee"

### 4. `app/api/charge-booking-card/route.ts`
- Handles `isInitialCharge` parameter
- For initial charge: updates status to `confirmed` and `paid`
- For additional charge: updates `total_amount`
- Creates payment record with notes

## Database Status Values

### Current (Used Now)
- ✅ `pending` - Booking created, awaiting action
- ✅ `paid` - Payment completed
- ✅ `failed` - Payment failed

### Future Enhancement (Optional)
If you want clearer distinction, you can add these enum values:
- `card_saved` - Card saved but not charged
- `pending_payment` - Awaiting admin charge

See `scripts/add_payment_status_enum.sql` for migration instructions.

## Identifying Pending Bookings

**Bookings waiting for admin to charge:**
```sql
SELECT * FROM bookings 
WHERE payment_status = 'pending' 
AND payment_method_id IS NOT NULL
ORDER BY created_at DESC;
```

**Completed/charged bookings:**
```sql
SELECT * FROM bookings 
WHERE payment_status = 'paid'
ORDER BY created_at DESC;
```

## Benefits of This Approach

1. ✅ **No upfront charging** - Customer card saved but not charged
2. ✅ **Admin control** - Admin decides when to charge
3. ✅ **Flexible fees** - Can add extra fees before charging
4. ✅ **Full audit trail** - All charges tracked separately
5. ✅ **Works immediately** - Uses existing database schema
6. ✅ **Clear status** - Easy to identify pending vs completed
7. ✅ **Additional charges** - Can charge same card multiple times

## Testing the Workflow

### Test 1: New Booking (No Charge)
1. Go to booking page as customer
2. Fill out booking form
3. Enter test card: `4242 4242 4242 4242`
4. Submit booking
5. Verify: Booking created with pending status
6. Verify: No charge in Stripe dashboard
7. Verify: Payment method saved

### Test 2: Admin Charges Booking
1. Login as admin
2. Go to Payments page
3. Find booking with "⏳ Awaiting Charge - Card Saved"
4. Click "Show Details"
5. Click "Charge Customer"
6. Add extra fees if desired
7. Click "Charge" button
8. Verify: Charge appears in Stripe
9. Verify: Booking status updated to confirmed
10. Verify: Payment record created

### Test 3: Additional Charge
1. Find completed payment
2. Click "Show Details"
3. Click "Add Extra Fee"
4. Enter amount and description
5. Charge card
6. Verify: New payment record created
7. Verify: Total amount updated

## Support

If you encounter issues:
1. Check browser console for detailed error logs
2. Check Supabase logs for database errors
3. Check Stripe dashboard for payment status
4. Verify `payment_method_id` is saved on booking
5. Verify admin role/permissions

## Next Steps (Optional)

If you want to add the custom enum values for clearer status:
1. Review `scripts/add_payment_status_enum.sql`
2. Check your database column type
3. Run appropriate migration
4. Update code to use `card_saved` status

