import { loadStripe } from '@stripe/stripe-js'

// Initialize Stripe with your publishable key
// Only initialize if the key is available
export const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY 
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null

// For server-side operations, you'll need the secret key
export const getStripeSecretKey = () => {
  return process.env.STRIPE_SECRET_KEY
}
