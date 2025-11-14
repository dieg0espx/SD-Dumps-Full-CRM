# Phone Booking Feature Documentation

## Overview

The Phone Booking feature allows admins to create bookings for customers who call in, generating a secure payment link that customers can use to save their card details without being charged immediately.

---

## 🎯 Features

- **Admin-Initiated Booking**: Admins fill out all booking details during a phone call
- **Secure Payment Links**: Generate unique, expiring payment links for customers
- **Card Authorization (No Charge)**: Customers save their card without being charged
- **7-Day Expiration**: Links automatically expire after 7 days
- **Digital Signature**: Customers sign digitally when completing the payment link
- **Email Notifications**: Automatic emails to both customer and admin
- **Payment Tracking**: Phone bookings appear in the payment tracker with special indicators
- **Calendar Integration**: Phone bookings highlighted in amber on the calendar

---

## 📋 Setup Instructions

### Step 1: Run Database Migration

1. Open your Supabase SQL Editor
2. Copy and paste the contents of `PHONE_BOOKING_SETUP.sql`
3. Run the query to create the `payment_links` table and necessary policies

### Step 2: Configure Environment Variables

Ensure these are set in your `.env.local`:

```env
# Stripe (Required)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Email (Required for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com
CONTACT_EMAIL=admin@yourdomain.com

# App URL (Required for payment links)
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### Step 3: Set Up Cron Job (Optional)

To automatically expire old payment links, set up a cron job to call:

```
GET/POST https://yourdomain.com/api/payment-link/expire-old
```

**Recommended Schedule**: Once per day

**Cron Expression**: `0 0 * * *` (runs at midnight daily)

**Platforms**:
- **Vercel**: Use Vercel Cron Jobs (add to `vercel.json`)
- **Railway**: Use Railway Cron
- **Manual**: Call the endpoint from any external cron service

Example `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/payment-link/expire-old",
    "schedule": "0 0 * * *"
  }]
}
```

---

## 🚀 How to Use

### For Admins

#### 1. Navigate to Phone Bookings

- Log in to the admin dashboard
- Click **"Phone Bookings"** in the sidebar (phone icon)

#### 2. Fill Out Booking Form

Complete all sections:

**Customer Information**
- Full Name
- Email Address (where payment link will be sent)
- Phone Number

**Container Selection**
- Choose container type from dropdown
- View pricing and description

**Rental Period**
- Select start date
- Select end date
- System calculates duration and total

**Service Type**
- Pickup or Delivery

**Time & Address**
- Pickup/Delivery time
- Billing address (required)
- Delivery address (if delivery service selected)

**Additional Options** (Optional)
- Extra tonnage
- Number of appliances
- Special notes

#### 3. Generate Payment Link

- Click **"Generate Payment Link"** button
- System creates booking with status: `awaiting_card`
- Generates unique payment link valid for 7 days
- Sends email to customer automatically

#### 4. Share Link with Customer

- **Copy to Clipboard**: Click the copy button next to the link
- **Send via SMS**: Copy and paste the link into your SMS system
- **Email**: Already sent automatically
- **Chat**: Share via your chat platform

---

### For Customers

#### 1. Receive Payment Link

- Check email for "Complete Your Booking" message
- Or receive link via SMS/chat from admin

#### 2. Review Booking Details

- View all booking information
- See total amount
- Review addresses and dates

#### 3. Save Payment Method

- Enter credit/debit card details
- Card is saved but **NOT charged**
- All payment data processed securely by Stripe

#### 4. Sign Digitally

- Sign on the digital signature pad
- Complete the booking

#### 5. Confirmation

- Receive confirmation screen
- Get confirmation email
- Admin is notified that card is saved

---

## 💳 Payment Flow

### Customer Perspective

1. **Receive Link**: Gets email with payment link
2. **Enter Card**: Saves card information (NO CHARGE)
3. **Sign**: Provides digital signature
4. **Done**: Booking confirmed, card on file

### Admin Perspective

1. **Create Booking**: Enter customer details
2. **Generate Link**: System creates unique URL
3. **Wait**: Customer completes card entry
4. **Get Notification**: Email when customer completes
5. **Charge Later**: Use Payment Tracker to charge when ready

---

## 📧 Email Notifications

### Customer Emails

**1. Payment Link Email**
- **Subject**: "Complete Your Booking - Action Required"
- **Content**: Booking summary, payment link, expiration date
- **CTA**: "Complete My Booking" button
- **Timing**: Sent immediately after admin creates booking

**2. Completion Confirmation** (Future Enhancement)
- Sent after customer completes card entry

### Admin Emails

**1. Booking Completed Notification**
- **Subject**: "✅ Phone Booking Completed - #XXXXXXXX"
- **Content**: Customer info, booking details, ready to charge notice
- **CTA**: "Charge Customer Now" button linking to Payment Tracker
- **Timing**: Sent when customer completes card entry

---

## 🔍 Tracking Phone Bookings

### In Payment Tracker

**Status Indicators**:
- **"⏳ AWAITING CARD"**: Customer hasn't completed payment link yet
- **"PENDING"**: Card saved, ready to charge (after completion)

**Status Badge Colors**:
- Blue badge: `awaiting_card` status
- Yellow badge: `pending` status (card saved)
- Green badge: `completed` status (charged)

### In Calendar

**Visual Indicators**:
- **Amber/Orange color**: Phone bookings awaiting card
- **Border highlight**: Thicker border for easy identification
- **Hover tooltip**: "Phone Booking - Awaiting Card"

---

## ⏰ Link Expiration

### Automatic Expiration

- Links expire **7 days** after creation
- Expired links show expiration message to customer
- Bookings are automatically cancelled
- Run `/api/payment-link/expire-old` daily via cron

### Manual Expiration Check

Call the endpoint manually:
```bash
curl -X POST https://yourdomain.com/api/payment-link/expire-old
```

Or visit in browser:
```
https://yourdomain.com/api/payment-link/expire-old
```

### What Happens on Expiration

1. Payment link status changes to `expired`
2. Associated booking status changes to `cancelled`
3. Booking payment_status changes to `failed`
4. Notes added: "Cancelled - Payment link expired without completion"
5. Customer sees expiration message if they visit the link

---

## 🗄️ Database Schema

### `payment_links` Table

```sql
id                UUID PRIMARY KEY
booking_id        UUID (Foreign Key to bookings)
token             UUID UNIQUE (Used in payment URL)
customer_email    TEXT
customer_name     TEXT
customer_phone    TEXT
expires_at        TIMESTAMP (7 days from creation)
completed_at      TIMESTAMP (nullable)
status            TEXT ('pending' | 'completed' | 'expired' | 'cancelled')
created_at        TIMESTAMP
updated_at        TIMESTAMP
```

### Booking Statuses

**New Status**: `awaiting_card`
- Used for phone bookings before customer completes payment link
- Shows in payment tracker and calendar
- Transitions to `pending` when customer saves card

**Status Flow**:
1. `awaiting_card` → Initial creation by admin
2. `pending` → After customer saves card
3. `confirmed` → After admin charges card
4. `completed` → Service delivered

---

## 🔒 Security Features

### Payment Link Security

- **Unique Tokens**: UUIDs prevent guessing
- **Time-Limited**: 7-day expiration
- **One-Time Use**: Cannot be reused after completion
- **Open Access**: Anyone with link can complete (intentional for flexibility)

### Payment Security

- **PCI Compliance**: Stripe handles all card data
- **No Storage**: Card details never touch your server
- **Customer Association**: Cards linked to Stripe customer objects
- **Secure Transmission**: All data encrypted in transit

### Email Security

- **Verification**: Uses customer's provided email
- **No Sensitive Data**: Emails don't contain card info
- **Link Expiration**: Clearly communicated to customer

---

## 🐛 Troubleshooting

### Link Not Working

**Customer sees "Invalid Link"**
- Check if link was copied correctly
- Verify link hasn't expired
- Check if booking was cancelled

**Fix**: Create new booking and generate new link

### Email Not Sending

**Check**:
1. SMTP credentials in `.env.local`
2. SMTP settings allow less secure apps (Gmail)
3. Check spam/junk folders
4. Verify `CONTACT_EMAIL` is set

**Fallback**: Copy link manually and send via SMS/chat

### Card Not Saving

**Common Issues**:
- Stripe publishable key not set
- Customer using expired card
- 3D Secure authentication required

**Check**:
- Console errors in browser
- Stripe dashboard for failed setups
- Network tab for API errors

### Payment Not Showing in Tracker

**Verify**:
1. Customer completed all steps (card + signature)
2. Refresh payment tracker page
3. Check booking status in database
4. Look for `payment_method_id` in bookings table

---

## 📊 Database Queries

### Find All Active Payment Links

```sql
SELECT
  pl.*,
  b.id as booking_id,
  b.status as booking_status
FROM payment_links pl
JOIN bookings b ON pl.booking_id = b.id
WHERE pl.status = 'pending'
AND pl.expires_at > NOW()
ORDER BY pl.created_at DESC;
```

### Find Expired Links

```sql
SELECT * FROM payment_links
WHERE status = 'pending'
AND expires_at < NOW();
```

### Check Booking Status

```sql
SELECT
  b.id,
  b.status,
  b.payment_status,
  b.payment_method_id,
  pl.status as link_status,
  pl.expires_at,
  pl.completed_at
FROM bookings b
LEFT JOIN payment_links pl ON b.id = pl.booking_id
WHERE b.id = 'YOUR_BOOKING_ID';
```

---

## 🔄 Flow Diagrams

### Complete Flow

```
Admin (Phone Call)
        ↓
  Fill Form & Create Booking
        ↓
  Generate Payment Link
        ↓
  [Email Sent Automatically]
        ↓
  Copy Link to Clipboard
        ↓
  [Admin sends via SMS/Chat]
        ↓
Customer Opens Link
        ↓
  Reviews Booking Details
        ↓
  Enters Card Information
        ↓
  Signs Digitally
        ↓
  [Card Saved - NOT Charged]
        ↓
  [Admin Email Notification]
        ↓
Admin Goes to Payment Tracker
        ↓
  Finds Booking with "PENDING" Status
        ↓
  Clicks "Charge Customer"
        ↓
  [Card Charged]
        ↓
  Booking Confirmed
```

---

## 🧪 Testing

### Test the Complete Flow

1. **Create Test Booking**
   - Use Stripe test card: `4242 4242 4242 4242`
   - Any future expiry date
   - Any 3-digit CVC

2. **Generate Link**
   - Copy the generated payment link
   - Open in incognito/private window

3. **Complete Payment Link**
   - Fill in test card details
   - Draw signature
   - Submit

4. **Verify in Admin**
   - Check Payment Tracker
   - Look for booking with "PENDING" status
   - Try charging the card

### Stripe Test Cards

```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
Insufficient funds: 4000 0000 0000 9995
3D Secure: 4000 0025 0000 3155
```

---

## 📝 Best Practices

### For Admins

1. **Verify Customer Info**: Double-check email and phone before generating link
2. **Set Realistic Dates**: Ensure dates give customer time to complete link
3. **Communicate Clearly**: Explain to customer they won't be charged yet
4. **Follow Up**: If customer doesn't complete within 24 hours, call to check
5. **Monitor Expiration**: Check for expiring links and follow up

### For System Maintenance

1. **Run Cron Daily**: Ensure automatic expiration of old links
2. **Monitor Emails**: Check if emails are being delivered
3. **Check Stripe Logs**: Review for any failed card setups
4. **Backup Database**: Regularly backup payment_links table
5. **Review Analytics**: Track completion rates of payment links

---

## 🆘 Support

### Common Questions

**Q: Can the customer change booking details?**
A: No, customer can only save card and sign. Admin must create new booking for changes.

**Q: What if customer loses the link?**
A: Admin can find the link in the database or create a new booking.

**Q: Can we extend the 7-day expiration?**
A: Yes, modify `addDays(new Date(), 7)` to `addDays(new Date(), 14)` in `create-phone-booking/route.ts`

**Q: Can we charge immediately instead of later?**
A: This feature is designed for admin-controlled charging. For immediate charging, use the regular booking flow.

**Q: What happens if Stripe is down?**
A: Customer will see an error. They can try again later with the same link (if not expired).

---

## 🔮 Future Enhancements

Potential improvements:
- SMS integration for automatic link sending
- Ability to resend payment links
- Custom expiration times per booking
- Reminder emails before expiration
- Partial payment support
- Multiple payment methods per booking
- Admin override to manually mark as completed
- Link analytics (views, completion rate)
- WhatsApp integration for link sharing

---

## 📞 Technical Support

For issues or questions:
1. Check this documentation first
2. Review console errors in browser
3. Check Supabase logs
4. Check Stripe dashboard
5. Contact your development team

---

## 📄 Files Modified/Created

### New Files
- `/app/admin/phone-bookings/page.tsx` - Admin page
- `/app/payment/[token]/page.tsx` - Customer payment page
- `/components/phone-booking-form.tsx` - Admin form component
- `/components/payment-link-form.tsx` - Customer form component
- `/components/stripe-payment-link-form.tsx` - Stripe integration for payment links
- `/app/api/admin/create-phone-booking/route.ts` - Create booking API
- `/app/api/payment-link/complete/route.ts` - Complete payment link API
- `/app/api/payment-link/expire-old/route.ts` - Expire links API
- `/PHONE_BOOKING_SETUP.sql` - Database migration
- `/PHONE_BOOKING_FEATURE.md` - This documentation

### Modified Files
- `/lib/email.ts` - Added phone booking email templates
- `/components/admin-layout.tsx` - Added navigation link
- `/app/admin/payments/page.tsx` - Added awaiting_card support
- `/components/payment-tracker.tsx` - Added awaiting_card status color
- `/components/booking-calendar.tsx` - Added amber highlighting

---

**Last Updated**: 2025-01-14
**Version**: 1.0.0
**Feature Status**: ✅ Ready for Production
