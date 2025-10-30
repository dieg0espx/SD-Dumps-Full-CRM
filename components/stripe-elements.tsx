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
import { CreditCard, Lock, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

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
  // Note: hidePostalCode is not supported for individual card elements
  // Only use it with the unified CardElement
}

interface StripeElementsProps {
  amount: number
  bookingId: string
  bookingData: any
  onSuccess: (bookingData?: any) => void
  onError: (error: string) => void
  allowGuest?: boolean
}

function PaymentForm({ amount, bookingId, bookingData, onSuccess, onError, allowGuest = false as any }: any) {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const handleSubmit = async () => {
    console.log('🔵 [Stripe] Card setup submission started (NOT charging yet)')

    if (!stripe || !elements) {
      console.error('❌ [Stripe] Stripe or Elements not loaded')
      setError('Payment system not ready. Please wait a moment and try again.')
      return
    }

    // Verify card elements are mounted
    const cardElement = elements.getElement(CardNumberElement)
    if (!cardElement) {
      console.error('❌ [Stripe] Card element not mounted')
      setError('Card information not ready. Please ensure all card fields are filled.')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Get authenticated user
      let userId: string | null = null
      if (!allowGuest) {
        console.log('🔵 [Stripe] Checking user authentication...')
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
          console.error('❌ [Stripe] User not authenticated:', authError)
          throw new Error('User not authenticated')
        }
        userId = user.id
        console.log('✅ [Stripe] User authenticated:', user.id)
      } else {
        userId = process.env.NEXT_PUBLIC_GUEST_USER_ID as string
        if (!userId) {
          console.error('❌ [Stripe] Guest user ID not configured (NEXT_PUBLIC_GUEST_USER_ID)')
          throw new Error('Guest checkout is not configured. Please set NEXT_PUBLIC_GUEST_USER_ID.')
        }
      }

      let finalBookingId = bookingId

      // Create booking if it doesn't exist
      if (bookingId === "temp" || !bookingId) {
        console.log('🔵 [Stripe] Creating new booking...')
        // Update user profile with phone number if provided
        if (!allowGuest && bookingData.phone) {
          await supabase.from("profiles").update({ phone: bookingData.phone }).eq("id", userId as string)
        }

        // Create the booking with pending payment
        const { data: booking, error: bookingError } = await supabase
          .from("bookings")
          .insert({
            user_id: userId,
            container_type_id: bookingData.container_type_id,
            start_date: bookingData.start_date,
            end_date: bookingData.end_date,
            service_type: bookingData.service_type,
            customer_address: bookingData.customer_address,
            delivery_address: bookingData.delivery_address,
            total_amount: bookingData.total_amount,
            pickup_time: bookingData.pickup_time,
            notes: bookingData.notes,
            status: "pending",
            payment_status: "pending", // Card saved but not charged yet (will be updated to "paid" when admin charges)
            signature_img_url: bookingData.signature_img_url || null,
          })
          .select()
          .single()

        if (bookingError) {
          console.error('❌ [Stripe] Booking creation failed:', bookingError)
          throw bookingError
        }
        finalBookingId = booking.id
        console.log('✅ [Stripe] Booking created:', finalBookingId)
      }

      // Create Setup Intent (to save card, not charge)
      console.log('🔵 [Stripe] Creating setup intent to save card...')
      const response = await fetch('/api/setup-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          allowGuest,
          guest: allowGuest ? {
            name: (bookingData.guest_full_name || ''),
            email: (bookingData.guest_email || ''),
            phone: (bookingData.phone || ''),
          } : null,
        }),
      })

      if (!response.ok) {
        console.error('❌ [Stripe] Setup intent API error:', response.status)
        const errorData = await response.json()
        console.error('Error details:', errorData)
        throw new Error(errorData.error || 'Failed to create setup intent')
      }

      const { clientSecret, error: apiError } = await response.json()

      if (apiError) {
        console.error('❌ [Stripe] API returned error:', apiError)
        throw new Error(apiError)
      }

      console.log('✅ [Stripe] Setup intent created, confirming card setup...')

      // Get the card element
      const cardNumberElement = elements.getElement(CardNumberElement)
      
      if (!cardNumberElement) {
        console.error('❌ [Stripe] Card element not found')
        throw new Error('Card information not properly loaded. Please refresh and try again.')
      }

      // Confirm card setup (saves card, doesn't charge)
      const { error: stripeError, setupIntent } = await stripe.confirmCardSetup(
        clientSecret,
        {
          payment_method: {
            card: cardNumberElement,
          },
        }
      )

      if (stripeError) {
        console.error('❌ [Stripe] Card setup failed:', stripeError)
        // Update booking status for failed card setup
        await supabase
          .from('bookings')
          .update({
            payment_status: 'failed',
            updated_at: new Date().toISOString(),
          })
          .eq('id', finalBookingId)

        throw new Error(stripeError.message || 'Card setup failed')
      }

      console.log('✅ [Stripe] Card setup confirmed:', setupIntent.status)
      console.log('📦 [Stripe] Payment Method ID:', setupIntent.payment_method)

      if (setupIntent.status === 'succeeded') {
        console.log('🔵 [Stripe] Saving payment method to booking...')
        // Update booking with payment method (card saved, but NOT charged)
        const { error: updateError } = await supabase
          .from('bookings')
          .update({
            payment_method_id: setupIntent.payment_method as string, // Save for admin to charge later
            payment_status: 'pending', // Waiting for admin to charge
            status: 'pending', // Waiting for admin to charge
            updated_at: new Date().toISOString(),
          })
          .eq('id', finalBookingId)

        if (updateError) {
          console.error('❌ [Stripe] Failed to update booking:', updateError)
          throw new Error('Failed to save payment method')
        }
        console.log('✅ [Stripe] Payment method saved to booking')

        // Fetch the updated booking data
        console.log('🔵 [Stripe] Fetching updated booking data...')
        const { data: updatedBooking, error: fetchError } = await supabase
          .from('bookings')
          .select(`
            *,
            container_types (
              id,
              size,
              price_per_day
            )
          `)
          .eq('id', finalBookingId)
          .single()

        if (fetchError) {
          console.error('❌ [Stripe] Failed to fetch booking:', fetchError)
        } else {
          console.log('✅ [Stripe] Booking data fetched:', updatedBooking)
        }

        console.log('🎉 [Stripe] Card saved successfully! Admin can now charge. Calling onSuccess...')
        onSuccess(updatedBooking)
      }
    } catch (err) {
      console.error('❌ [Stripe] Card setup process failed:', err)
      const errorMessage = err instanceof Error ? err.message : 'Card setup failed'
      console.error('Error message:', errorMessage)
      setError(errorMessage)
      onError(errorMessage)
    } finally {
      console.log('🔵 [Stripe] Card setup process complete, setting loading to false')
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label>Card Information</Label>
        
        <div className="space-y-3">
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
      </div>

      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
          {error}
        </div>
      )}

      <Button
        type="button"
        size="lg"
        className="w-full"
        disabled={!stripe || isLoading}
        onClick={handleSubmit}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving Card...
          </>
        ) : (
          <>
            <Lock className="mr-2 h-4 w-4" />
            Save Card & Complete Booking
          </>
        )}
      </Button>

      <div className="text-xs text-gray-500 text-center space-y-1">
        <p className="font-medium text-blue-600">Your card will NOT be charged yet</p>
        <p>Your card will be securely saved, and the final charge will only be made once the total amount is confirmed.</p>
        <p className="text-xs mt-2">Securely processed with Stripe.</p>
      </div>
    </div>
  )
}

export function StripeElements({ amount, bookingId, bookingData, onSuccess, onError, allowGuest }: StripeElementsProps) {
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
    <Elements stripe={stripePromise}>
      <PaymentForm
        amount={amount}
        bookingId={bookingId}
        bookingData={bookingData}
        onSuccess={onSuccess}
        onError={onError}
        allowGuest={allowGuest}
      />
    </Elements>
  )
}
