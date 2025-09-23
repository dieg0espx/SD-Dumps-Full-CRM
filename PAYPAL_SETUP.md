# PayPal Integration Setup

This project now includes PayPal payment integration using the `@paypal/react-paypal-js` package.

## Environment Variables

Add the following environment variable to your `.env.local` file:

```bash
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id_here
```

## Getting PayPal Client ID

1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/)
2. Sign in with your PayPal account
3. Create a new application or use an existing one
4. Copy the Client ID from your application
5. For testing, use the Sandbox Client ID
6. For production, use the Live Client ID

## Testing

- **Sandbox**: Use sandbox client ID for testing with PayPal's test environment
- **Production**: Use live client ID for real transactions

## Features Implemented

- ✅ PayPal payment buttons integration
- ✅ Payment success/error handling
- ✅ Automatic booking creation on successful payment
- ✅ Payment record creation in database
- ✅ Proper error handling and user feedback

## Usage

The PayPal integration is automatically available in the booking form when users select "PayPal" as their payment method. The integration handles:

- Creating PayPal orders with correct amounts
- Processing payment approvals
- Creating booking and payment records
- Redirecting to success page

## Security Notes

- Never commit your PayPal client ID to version control
- Use environment variables for all sensitive configuration
- Test thoroughly in sandbox before going live
