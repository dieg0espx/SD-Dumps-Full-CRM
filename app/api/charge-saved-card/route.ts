import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
})

/**
 * POST: Charge a saved payment method
 * This allows you to charge any amount to a previously saved card
 */
export async function POST(request: NextRequest) {
  try {
    const { amount, paymentMethodId, bookingId, currency = 'usd' } = await request.json()

    // Check if TEST mode is enabled at the start
    const isTestMode = process.env.TEST === 'true'
    if (isTestMode) {
      console.log('⚠️⚠️⚠️ TEST MODE IS ON - Only $1.00 will be charged ⚠️⚠️⚠️')
    }

    if (!amount || !paymentMethodId || !bookingId) {
      return NextResponse.json(
        { error: 'Amount, payment method ID, and booking ID are required' },
        { status: 400 }
      )
    }

    // Verify user authentication
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user profile and verify Stripe customer
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single()

    if (!profile?.stripe_customer_id) {
      return NextResponse.json(
        { error: 'No Stripe customer found' },
        { status: 400 }
      )
    }

    // Verify the payment method belongs to this customer
    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId)
    
    if (paymentMethod.customer !== profile.stripe_customer_id) {
      return NextResponse.json(
        { error: 'Payment method does not belong to this customer' },
        { status: 403 }
      )
    }

    // Verify the booking belongs to the user and get details
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select(`
        *,
        container_types (
          id,
          size,
          name,
          price_per_day
        )
      `)
      .eq('id', bookingId)
      .eq('user_id', user.id)
      .single()

    if (bookingError || !booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Create payment intent with the saved payment method
    const containerTypeName = booking.container_types?.name || booking.container_types?.size || 'Container'
    const rentalPeriod = `${booking.start_date} to ${booking.end_date}`

    // Check if TEST mode is enabled
    const isTestMode = process.env.TEST === 'true'
    const chargeAmount = isTestMode ? 100 : Math.round(amount * 100) // $1 in test mode, full amount otherwise

    const paymentIntent = await stripe.paymentIntents.create({
      amount: chargeAmount, // Convert to cents
      currency: currency,
      customer: profile.stripe_customer_id,
      payment_method: paymentMethodId,
      off_session: true, // Indicates charging without customer present
      confirm: true, // Automatically confirm the payment
      description: `Container Rental - ${containerTypeName}`,
      metadata: {
        bookingId: bookingId.toString(),
        userId: user.id,
        containerType: containerTypeName,
        rentalPeriod: rentalPeriod,
        serviceType: booking.service_type,
      },
      receipt_email: user.email,
    })

    // Update booking status based on payment result
    if (paymentIntent.status === 'succeeded') {
      await supabase
        .from('bookings')
        .update({
          payment_status: 'paid',
          status: 'confirmed',
          updated_at: new Date().toISOString(),
        })
        .eq('id', bookingId)

      // Create payment record
      await supabase.from('payments').insert({
        booking_id: bookingId,
        amount: paymentIntent.amount / 100, // Convert from cents
        payment_method: 'stripe',
        transaction_id: paymentIntent.id,
        status: 'completed',
      })
    } else if (paymentIntent.status === 'requires_action') {
      // Card requires additional authentication (SCA/3D Secure)
      return NextResponse.json({
        requiresAction: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      })
    } else {
      // Payment failed
      await supabase
        .from('bookings')
        .update({
          payment_status: 'failed',
          updated_at: new Date().toISOString(),
        })
        .eq('id', bookingId)

      await supabase.from('payments').insert({
        booking_id: bookingId,
        amount: amount,
        payment_method: 'stripe',
        transaction_id: `failed_${Date.now()}`,
        status: 'failed',
      })

      return NextResponse.json(
        { error: 'Payment failed' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      paymentIntentId: paymentIntent.id,
      status: paymentIntent.status,
    })
  } catch (error: any) {
    console.error('Error charging saved card:', error)
    
    // Handle specific Stripe errors
    if (error.type === 'StripeCardError') {
      return NextResponse.json(
        { error: error.message || 'Card was declined' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

