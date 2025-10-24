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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { CreditCard, Lock } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

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

interface SaveCardFormInnerProps {
  onSuccess: () => void
  onCancel?: () => void
}

function SaveCardFormInner({ onSuccess, onCancel }: SaveCardFormInnerProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cardholderName, setCardholderName] = useState('')
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      console.error('Stripe not loaded')
      return
    }

    if (!cardholderName.trim()) {
      setError('Please enter cardholder name')
      toast({
        title: 'Missing Information',
        description: 'Please enter the cardholder name',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      console.log('🔵 Step 1: Creating Setup Intent...')
      
      // Create Setup Intent
      const response = await fetch('/api/setup-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Setup Intent API error:', errorText)
        throw new Error('Failed to create setup intent')
      }

      const { clientSecret, error: apiError } = await response.json()

      if (apiError) {
        console.error('❌ API returned error:', apiError)
        throw new Error(apiError)
      }

      console.log('✅ Setup Intent created successfully')
      console.log('🔵 Step 2: Confirming card setup...')

      // Confirm the Setup Intent with the card details
      const { error: stripeError, setupIntent } = await stripe.confirmCardSetup(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardNumberElement)!,
            billing_details: {
              name: cardholderName.trim(),
            },
          },
        }
      )

      if (stripeError) {
        console.error('❌ Stripe error:', stripeError)
        throw new Error(stripeError.message || 'Failed to save card')
      }

      console.log('✅ Card setup confirmed:', setupIntent.status)
      console.log('📦 Payment Method ID:', setupIntent.payment_method)
      console.log('📦 Customer ID:', setupIntent.customer)

      if (setupIntent.status === 'succeeded') {
        console.log('🎉 Card saved successfully!')
        
        // First verify the payment method is attached
        console.log('🔵 Step 3: Verifying payment method attachment...')
        const verifyResponse = await fetch('/api/verify-payment-method', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            paymentMethodId: setupIntent.payment_method 
          }),
        })
        
        if (verifyResponse.ok) {
          const verifyData = await verifyResponse.json()
          console.log('📦 Verification result:', verifyData)
          
          if (!verifyData.attached) {
            console.error('❌ Payment method not attached to customer!')
            console.error('Expected customer:', verifyData.paymentMethod?.expectedCustomer)
            console.error('Actual customer:', verifyData.paymentMethod?.customer)
          } else {
            console.log('✅ Payment method is attached to customer')
          }
        }
        
        console.log('⏳ Waiting for Stripe to process payment method attachment...')
        // Wait for Stripe to fully process the payment method attachment
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Verify the payment method is accessible via list
        console.log('🔵 Verifying payment method appears in list...')
        const listResponse = await fetch(`/api/payment-methods?t=${Date.now()}`, {
          cache: 'no-store',
        })
        
        if (listResponse.ok) {
          const { paymentMethods } = await listResponse.json()
          console.log('✅ List verification: Found', paymentMethods.length, 'payment method(s)')
        }
        
        toast({
          title: 'Success',
          description: 'Card saved successfully!',
        })
        onSuccess()
      }
    } catch (err) {
      console.error('❌ Error saving card:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to save card'
      setError(errorMessage)
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="cardholder-name">Cardholder Name *</Label>
          <Input
            id="cardholder-name"
            type="text"
            placeholder="John Doe"
            value={cardholderName}
            onChange={(e) => setCardholderName(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="card-number">Card Number</Label>
          <div className="p-3 border rounded-lg">
            <CardNumberElement
              id="card-number"
              options={cardElementOptions}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="card-expiry">Expiry Date</Label>
            <div className="p-3 border rounded-lg">
              <CardExpiryElement
                id="card-expiry"
                options={cardElementOptions}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="card-cvc">CVC</Label>
            <div className="p-3 border rounded-lg">
              <CardCvcElement
                id="card-cvc"
                options={cardElementOptions}
              />
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <Button
          type="submit"
          className="flex-1"
          disabled={!stripe || isLoading}
        >
          {isLoading ? (
            'Saving...'
          ) : (
            <>
              <Lock className="mr-2 h-4 w-4" />
              Save Card Securely
            </>
          )}
        </Button>
        
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        )}
      </div>

      <div className="text-xs text-gray-500 text-center">
        <p>Your card details are securely stored by Stripe. We never see your full card number.</p>
      </div>
    </form>
  )
}

interface SaveCardFormProps {
  onSuccess: () => void
  onCancel?: () => void
}

export function SaveCardForm({ onSuccess, onCancel }: SaveCardFormProps) {
  if (!stripePromise) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-red-600">
            <p>Stripe is not configured. Please add your Stripe publishable key to the environment variables.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="mr-2 h-5 w-5" />
          Save Payment Method
        </CardTitle>
        <CardDescription>
          Save your card for faster checkout on future bookings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Elements stripe={stripePromise}>
          <SaveCardFormInner onSuccess={onSuccess} onCancel={onCancel} />
        </Elements>
      </CardContent>
    </Card>
  )
}

