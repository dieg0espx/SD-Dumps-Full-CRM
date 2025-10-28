# Admin Charge Booking Card Feature

## Overview

This feature allows administrators to charge additional amounts to the credit card that was used for a specific booking. When a customer makes a booking payment through Stripe, their payment method is automatically saved and can be used later by admins to charge extra fees.

## How It Works

### For Customers (Automatic)

1. **During Booking**: When a customer pays for a booking with their credit card:
   - Stripe automatically saves the payment method to their customer account
   - The `payment_method_id` is stored in the `bookings` table
   - No additional action needed from the customer

2. **Transparent Process**: 
   - Customers don't see a "save card" option
   - The card is saved automatically as part of the payment
   - Complies with PCI requirements (Stripe handles all card data)

### For Admins

1. **View Booking Details**:
   - Navigate to Admin > Calendar
   - Click on any booking to view details
   - If a card is on file, you'll see "Card on File" in the payment section

2. **Charge Additional Amount**:
   - In the booking details popup, scroll to "Charge Additional Amount" section
   - Enter the amount to charge (e.g., 150.00 for extra tonnage)
   - Enter a description (e.g., "Extra tonnage fee - 2 tons over limit")
   - Click "Charge $XX.XX" button
   - The charge processes immediately

3. **What Happens**:
   - Customer's card is charged the additional amount
   - Payment is recorded in the payments table
   - Booking's total_amount is updated
   - Customer receives a receipt email from Stripe

## Use Cases

- **Extra Tonnage**: Charge for weight over the included limit
- **Damage Fees**: Charge for damage to the container
- **Extra Days**: Charge for keeping the container longer than booked
- **Additional Services**: Any extra services provided after initial booking
- **Environmental Fees**: Disposal of prohibited items

## Database Schema

### Added Field

```sql
-- bookings table
payment_method_id TEXT NULL  -- Stripe payment method ID for future charges
```

### Migration

Run the following migration to add the field:

```bash
# Execute scripts/add_payment_method_to_bookings.sql in your Supabase SQL editor
```

## API Endpoint

### POST /api/charge-booking-card

**Request Body:**
```json
{
  "bookingId": "uuid-of-booking",
  "amount": 150.00,
  "description": "Extra tonnage fee"
}
```

**Response (Success):**
```json
{
  "success": true,
  "paymentIntent": {
    "id": "pi_xxx",
    "amount": 150.00,
    "status": "succeeded"
  },
  "message": "Additional charge successful"
}
```

**Response (Error):**
```json
{
  "error": "Card declined",
  "details": "Insufficient funds"
}
```

## Security

- ✅ Admin-only access (verified via `is_admin` field)
- ✅ Card data never stored locally (handled by Stripe)
- ✅ PCI compliance maintained
- ✅ All charges logged with admin user ID
- ✅ Audit trail via payments table

## Files Modified

1. **Database**:
   - `scripts/add_payment_method_to_bookings.sql` - Migration script

2. **API Endpoints**:
   - `app/api/create-payment-intent/route.ts` - Added `setup_future_usage: 'off_session'`
   - `app/api/charge-booking-card/route.ts` - New endpoint for admin charges

3. **Components**:
   - `components/stripe-elements.tsx` - Saves payment_method_id to booking
   - `components/booking-details-sidebar.tsx` - Shows charge interface for admins
   - `components/booking-calendar.tsx` - Passes admin props to sidebar
   - `components/profile-form.tsx` - Removed manual "Manage Payment Methods" link

4. **Admin Pages**:
   - `app/admin/calendar/page.tsx` - Added admin flag and refresh callback

## Testing

### Test the Feature

1. **Create a Test Booking**:
   - Log in as a regular user
   - Create a booking and pay with test card: `4242 4242 4242 4242`
   - Complete the booking

2. **Verify Card is Saved**:
   - Log in as admin
   - Go to Admin > Calendar
   - Click on the booking
   - Verify "Card on File" appears in Payment Information

3. **Test Additional Charge**:
   - In the booking details, find "Charge Additional Amount"
   - Enter amount: 50.00
   - Enter description: "Test extra fee"
   - Click "Charge $50.00"
   - Verify success toast appears
   - Check Stripe Dashboard for the charge

### Stripe Test Cards

- **Success**: `4242 4242 4242 4242`
- **Declined**: `4000 0000 0000 0002`
- **Insufficient Funds**: `4000 0000 0000 9995`

Use any future expiry date and any 3-digit CVC.

## Important Notes

1. **Off-Session Payments**: Cards are charged without customer present (off-session)
2. **Authentication**: Some cards may require 3D Secure on subsequent charges
3. **Failed Charges**: If a charge fails, it's recorded in the payments table with status "failed"
4. **Email Receipts**: Stripe automatically sends receipts to customers
5. **Refunds**: Handled through Stripe Dashboard (not implemented in app yet)

## Future Enhancements

- [ ] Add refund functionality
- [ ] Show charge history timeline
- [ ] Email notification to customer when charged
- [ ] Add authorization-only mode (capture later)
- [ ] Bulk charges for multiple bookings
- [ ] Automatic charges based on rules (e.g., auto-charge overdue fees)

