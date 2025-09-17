import { loadStripe } from '@stripe/stripe-js'

// Initialize Stripe with your publishable key
export const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

// For server-side operations, you'll need the secret key
export const getStripeSecretKey = () => {
  return process.env.STRIPE_SECRET_KEY
}
