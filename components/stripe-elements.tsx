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
import { CreditCard, Lock } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

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
  hidePostalCode: false,
}

interface StripeElementsProps {
  amount: number
  bookingId: string
  bookingData: any
  onSuccess: (bookingData?: any) => void
  onError: (error: string) => void
}

function PaymentForm({ amount, bookingId, bookingData, onSuccess, onError }: StripeElementsProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const handleSubmit = async () => {

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Get authenticated user
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        throw new Error('User not authenticated')
      }

      let finalBookingId = bookingId

      // Create booking if it doesn't exist
      if (bookingId === "temp" || !bookingId) {
        // Update user profile with phone number if provided
        if (bookingData.phone) {
          await supabase.from("profiles").update({ phone: bookingData.phone }).eq("id", user.id)
        }

        // Create the booking
        const { data: booking, error: bookingError } = await supabase
          .from("bookings")
          .insert({
            user_id: user.id,
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
            payment_status: "pending",
            signature_img_url: bookingData.signature_img_url || null,
          })
          .select()
          .single()

        if (bookingError) throw bookingError
        finalBookingId = booking.id
      }

      // Create payment intent
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          bookingId: finalBookingId,
        }),
      })

      const { clientSecret, error: apiError } = await response.json()

      if (apiError) {
        throw new Error(apiError)
      }

      // Confirm payment
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardNumberElement)!,
          },
        }
      )

      if (stripeError) {
        // Update booking status for failed payment
        await supabase
          .from('bookings')
          .update({
            payment_status: 'failed',
            updated_at: new Date().toISOString(),
          })
          .eq('id', finalBookingId)

        // Create payment record for failed payment
        await supabase.from('payments').insert({
          booking_id: finalBookingId,
          amount: amount,
          payment_method: 'stripe',
          transaction_id: `failed_${Date.now()}`,
          status: 'failed',
        })

        throw new Error(stripeError.message || 'Payment failed')
      }

      // Check if payment succeeded
      if (!paymentIntent || paymentIntent.status !== 'succeeded') {
        throw new Error('Payment was not successful. Please try again.')
      }

      // Update booking status directly
      await supabase
        .from('bookings')
        .update({
          payment_status: 'paid',
          status: 'confirmed',
          updated_at: new Date().toISOString(),
        })
        .eq('id', finalBookingId)

      // Create payment record
      await supabase.from('payments').insert({
        booking_id: finalBookingId,
        amount: paymentIntent.amount / 100, // Convert from cents
        payment_method: 'stripe',
        transaction_id: paymentIntent.id,
        status: 'completed',
      })

      // Fetch the updated booking data
      const { data: updatedBooking } = await supabase
        .from('bookings')
        .select(`
          *,
          container_types (
            id,
            size,
            price_per_day
          ),
          profiles (
            full_name,
            email
          )
        `)
        .eq('id', finalBookingId)
        .single()

      // Send booking confirmation emails
      try {
        await fetch('/api/send-booking-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            bookingId: updatedBooking.id,
            customerName: updatedBooking.profiles?.full_name || user.email?.split('@')[0] || 'Customer',
            customerEmail: updatedBooking.profiles?.email || user.email,
            containerType: updatedBooking.container_types?.size || 'Container',
            startDate: new Date(updatedBooking.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            endDate: new Date(updatedBooking.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            serviceType: updatedBooking.service_type,
            totalAmount: updatedBooking.total_amount,
            deliveryAddress: updatedBooking.delivery_address,
            pickupTime: updatedBooking.pickup_time,
            notes: updatedBooking.notes || undefined,
          }),
        })
        console.log('✅ Booking confirmation emails sent')
      } catch (emailError) {
        console.error('⚠️ Email sending failed (non-critical):', emailError)
        // Don't throw error - email failure shouldn't stop the booking process
      }

      onSuccess(updatedBooking)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment failed'
      setError(errorMessage)
      onError(errorMessage)
    } finally {
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
          'Processing Payment...'
        ) : (
          <>
            <Lock className="mr-2 h-4 w-4" />
            Pay Securely with Stripe
          </>
        )}
      </Button>

      <div className="text-xs text-gray-500 text-center">
        <p>Powered by Stripe</p>
      </div>
    </div>
  )
}

export function StripeElements({ amount, bookingId, bookingData, onSuccess, onError }: StripeElementsProps) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm
        amount={amount}
        bookingId={bookingId}
        bookingData={bookingData}
        onSuccess={onSuccess}
        onError={onError}
      />
    </Elements>
  )
}
