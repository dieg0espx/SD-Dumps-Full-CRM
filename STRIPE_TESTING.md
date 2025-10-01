# Stripe Payment Testing Guide

## Test Card Numbers

Use these test card numbers to test Stripe payments:

### Successful Payment
```
Card Number: 4242 4242 4242 4242
Expiry: Any future date (e.g., 12/34)
CVC: Any 3 digits (e.g., 123)
ZIP: Any 5 digits (e.g., 12345)
```

### Other Test Cards

**Requires Authentication (3D Secure)**
```
Card Number: 4000 0027 6000 3184
```

**Declined Payment**
```
Card Number: 4000 0000 0000 0002
```

**Insufficient Funds**
```
Card Number: 4000 0000 0000 9995
```

**Expired Card**
```
Card Number: 4000 0000 0000 0069
```

## Environment Variables Required

Make sure these are set in your `.env.local`:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

## Common Issues

### TypeError: Cannot read properties of null (reading 'id')

**Possible Causes:**
1. **Invalid Stripe Keys** - Make sure you're using test keys (start with `pk_test_` and `sk_test_`)
2. **Card Declined** - The test card was declined by Stripe
3. **Network Issues** - Connection to Stripe API failed
4. **Authentication Required** - Card requires 3D Secure but wasn't completed

**How to Debug:**
1. Open browser console and look for these logs:
   - "Payment confirmation result" - shows if paymentIntent was returned
   - "✅ Payment confirmed" - shows payment details
   - "❌ Stripe payment error" - shows error details

2. Check the console logs for:
   ```
   hasIntent: true/false
   intentStatus: 'succeeded'/'requires_action'/etc
   intentId: should have a value starting with 'pi_'
   ```

3. If `hasIntent: false` or `intentId: null`:
   - Check your Stripe API keys
   - Verify the test card number is correct
   - Check browser network tab for API errors

## Testing Workflow

1. **Navigate to booking page** - `/booking`
2. **Fill out booking form** - Select container, dates, etc.
3. **Proceed to payment step** - Step 7
4. **Select Credit/Debit Card (Stripe)**
5. **Enter test card**: 4242 4242 4242 4242
6. **Enter expiry**: Any future date
7. **Enter CVC**: Any 3 digits
8. **Click "Pay Securely with Stripe"**
9. **Check console logs** for debugging info
10. **Should redirect to success page**
11. **Check emails** - Both client and admin should receive confirmation

## Expected Console Logs (Success)

```
Payment confirmation result: {
  hasError: false,
  hasIntent: true,
  intentStatus: 'succeeded',
  intentId: 'pi_xxxxxxxxxxxxx',
  intentAmount: 30000  // Amount in cents
}

✅ Payment confirmed: {
  id: 'pi_xxxxxxxxxxxxx',
  status: 'succeeded',
  amount: 30000
}

✅ Booking confirmation emails sent
```

## Expected Console Logs (Failure)

```
Payment confirmation result: {
  hasError: true,
  hasIntent: false,
  intentStatus: undefined,
  intentId: undefined
}

❌ Stripe payment error: {
  type: 'card_error',
  message: 'Your card was declined.'
}
```

## Verifying in Stripe Dashboard

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/payments)
2. You should see the test payment listed
3. Click on it to see full details
4. Verify the amount and metadata

## Troubleshooting

### Payment Intent is Null

If you see `hasIntent: false` in console:

1. **Check Stripe Keys**:
   ```bash
   # In your terminal
   echo $NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
   echo $STRIPE_SECRET_KEY
   ```

2. **Restart Dev Server**:
   ```bash
   npm run dev
   ```

3. **Clear Browser Cache** and reload

4. **Check Network Tab**:
   - Look for `/api/create-payment-intent` call
   - Should return `{ clientSecret: 'pi_...' }`
   - Check for any errors in response

### Payment Requires Authentication

If card requires 3D Secure:
- A modal should appear for authentication
- Test by using card: 4000 0027 6000 3184
- Complete the authentication challenge

### Email Not Received

Check console for:
- `✅ Booking confirmation emails sent` - Email API called successfully
- `⚠️ Email sending failed` - Email API failed (but booking still succeeds)

Check server logs for SMTP errors if emails aren't arriving.

## Production Setup

When moving to production:

1. Replace test keys with live keys:
   ```env
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   STRIPE_SECRET_KEY=sk_live_...
   ```

2. Test with real cards (small amounts)

3. Enable Stripe Radar for fraud protection

4. Set up webhooks for payment status updates

5. Monitor Stripe Dashboard for live payments

## Support

For Stripe-specific issues:
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Support](https://support.stripe.com/)
- [Test Cards Reference](https://stripe.com/docs/testing#cards)

