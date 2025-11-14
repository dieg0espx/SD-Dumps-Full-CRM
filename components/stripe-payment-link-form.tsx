"use client"

import React, { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Lock, Loader2 } from 'lucide-react'

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null

const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
}

interface StripePaymentLinkFormProps {
  onSuccess: (paymentMethodId: string) => void
}

function PaymentLinkForm({ onSuccess }: StripePaymentLinkFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      setError('Payment system not ready. Please wait a moment and try again.')
      return
    }

    const cardElement = elements.getElement(CardNumberElement)
    if (!cardElement) {
      setError('Card information not ready. Please ensure all card fields are filled.')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Create payment method (no setup intent needed, we'll do that server-side)
      const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      })

      if (pmError) {
        throw new Error(pmError.message || 'Failed to save card')
      }

      if (!paymentMethod) {
        throw new Error('Failed to create payment method')
      }

      console.log('✅ Payment method created:', paymentMethod.id)
      onSuccess(paymentMethod.id)
    } catch (err) {
      console.error('❌ Card setup failed:', err)
      const errorMessage = err instanceof Error ? err.message : 'Card setup failed'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="card-number">Card Number</Label>
          <div className="p-3 border rounded-lg bg-white">
            <CardNumberElement
              id="card-number"
              options={cardElementOptions}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="card-expiry">Expiry Date</Label>
            <div className="p-3 border rounded-lg bg-white">
              <CardExpiryElement
                id="card-expiry"
                options={cardElementOptions}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="card-cvc">CVC</Label>
            <div className="p-3 border rounded-lg bg-white">
              <CardCvcElement
                id="card-cvc"
                options={cardElementOptions}
              />
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={!stripe || isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving Card...
          </>
        ) : (
          <>
            <Lock className="mr-2 h-4 w-4" />
            Save My Card
          </>
        )}
      </Button>

      <div className="text-xs text-gray-500 text-center space-y-1">
        <p className="font-medium text-blue-600">✓ Your card will NOT be charged yet</p>
        <p>We're only securely saving your payment method</p>
        <p className="text-xs mt-2">Protected by Stripe - PCI DSS Level 1 Certified</p>
      </div>
    </form>
  )
}

export function StripePaymentLinkForm({ onSuccess }: StripePaymentLinkFormProps) {
  if (!stripePromise) {
    return (
      <div className="text-center text-red-600 p-6 bg-red-50 rounded-lg">
        <p>Payment system is not configured. Please contact support.</p>
      </div>
    )
  }

  return (
    <Elements stripe={stripePromise}>
      <PaymentLinkForm onSuccess={onSuccess} />
    </Elements>
  )
}
