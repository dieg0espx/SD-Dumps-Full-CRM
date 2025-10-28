# Saved Payment Methods - Setup Instructions

## ✅ Code Already Added!

All the code has been implemented. You just need to test it and add the admin UI.

---

## 🚀 What to Do Now

### 1. Make Sure You Have Stripe Keys

Check your `.env.local` or environment variables:

```env
STRIPE_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
```

If you don't have them, get them from: https://dashboard.stripe.com/test/apikeys

---

### 2. Test It (3 steps)

#### Step 1: Save a Card
```
1. Run your app and login
2. Go to: /payment-methods
3. Click "Add New Card"
4. Enter Name: John Doe (or your name)
5. Enter Card: 4242 4242 4242 4242 (test card)
6. Expiry: 12/25, CVC: 123
7. Click "Save Card Securely"
8. ✅ Done!
```

**🔍 If Card Doesn't Save:**

Open browser console (F12) and look for errors:
- 🔵 Blue = Progress messages
- ✅ Green = Success
- ❌ Red = Errors (tell me what you see!)

Common issues:
- Missing Stripe keys → Check .env.local
- "Stripe not loaded" → Refresh page
- API error → Check console for details

#### Step 2: Use It in Booking
```
1. Create a new booking
2. When you reach payment (step 7)
3. You'll see two tabs: "Use Saved Card" | "Pay with New Card"
4. Click "Use Saved Card"
5. Select your card
6. Complete booking
7. ✅ Done!
```

#### Step 3: Charge a Customer Later (API)
```javascript
// In your admin code or API
const response = await fetch('/api/charge-saved-card', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    amount: 150.00,              // Any amount you want
    paymentMethodId: 'pm_xxx',   // Get this from saved cards
    bookingId: 'booking_id',
  }),
})

const result = await response.json()
// ✅ Customer charged!
```

---

## 📁 What Was Added

### New API Routes (Backend)
```
app/api/setup-intent/route.ts        → Saves cards
app/api/charge-saved-card/route.ts   → Charges saved cards
app/api/payment-methods/route.ts     → Lists/deletes cards
```

### New Components (Frontend)
```
components/save-card-form.tsx              → Form to save cards
components/saved-cards-list.tsx            → Shows saved cards
components/payment-with-saved-cards.tsx    → Payment with saved cards
```

### New Page
```
app/payment-methods/page.tsx         → Card management page
```

### Updated Files
```
components/booking-form.tsx          → Now uses saved cards
components/profile-form.tsx          → Added "Manage Cards" link
```

---

## 🎯 How It Works

1. **Customer saves card** → Stripe stores it securely
2. **You decide amount** → Anytime you want
3. **Charge the saved card** → Customer gets charged

---

## 🔧 Admin Dashboard: Charge Customers

### What's Ready
✅ Backend API to charge customers  
✅ Component to add to your admin pages  
✅ Admin endpoint to view any customer's cards  

### How to Add It

**Step 1:** Add the component to your admin booking/payment page

```tsx
import { AdminChargeCustomer } from '@/components/admin-charge-customer'

// In your admin booking details or payments page:
<AdminChargeCustomer 
  bookingId={booking.id}
  customerId={booking.user_id}  // Customer's user ID
  customerEmail={booking.customer_email}
  onSuccess={() => {
    // Refresh data or show success
    console.log('Customer charged!')
  }}
/>
```

**Step 2:** Test it!
1. Go to admin dashboard
2. Click "Load Payment Methods"
3. Select customer's card
4. Enter amount
5. Click "Charge" ✅

---

## 💻 Or Use the API Directly

```typescript
// Example: Charge customer for extra fees
const chargeCustomer = async (bookingId: string, amount: number) => {
  // Get customer's saved cards
  const { paymentMethods } = await fetch('/api/payment-methods')
    .then(r => r.json())
  
  if (paymentMethods.length > 0) {
    // Charge the first card
    const response = await fetch('/api/charge-saved-card', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: amount,
        paymentMethodId: paymentMethods[0].id,
        bookingId: bookingId,
      }),
    })
    
    return await response.json()
  }
}

// Use it:
await chargeCustomer('booking_123', 75.00)
```

---

## 🧪 Test Cards

| Card | Result |
|------|--------|
| 4242 4242 4242 4242 | ✅ Success |
| 4000 0000 0000 0002 | ❌ Declined |

Use any future expiry date and any 3-digit CVC.

---

## 🆘 Troubleshooting

**"Stripe is not configured"**  
→ Add your Stripe keys to `.env.local`

**"Unauthorized"**  
→ Make sure you're logged in

**Card not showing up**  
→ Refresh the page or check browser console for errors

---

## ✅ That's It!

The system is ready. Just:
1. Add Stripe keys (if not already added)
2. Test with the steps above
3. Use it!

**Customer page:** `/payment-methods`  
**Test card:** `4242 4242 4242 4242`

Done! 🎉

