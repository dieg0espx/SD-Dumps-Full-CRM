import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
})

export async function POST(request: NextRequest) {
  try {
    const { amount, bookingId, currency = 'usd' } = await request.json()

    if (!amount || !bookingId) {
      return NextResponse.json(
        { error: 'Amount and booking ID are required' },
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

    // Get user profile information
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Profile error:', profileError)
    }

    // Verify the booking belongs to the user and get container type info
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

    // Create or retrieve Stripe customer
    let customerId: string | undefined
    
    if (profile?.stripe_customer_id) {
      customerId = profile.stripe_customer_id
    } else {
      // Create a new Stripe customer
      const customer = await stripe.customers.create({
        email: user.email,
        name: profile?.full_name || user.user_metadata?.full_name || 'Customer',
        phone: profile?.phone || user.user_metadata?.phone,
        metadata: {
          user_id: user.id,
        },
      })
      
      customerId = customer.id
      
      // Save the Stripe customer ID to the profile
      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customer.id })
        .eq('id', user.id)
    }

    // Create payment intent with customer information
    const containerTypeName = booking.container_types?.name || booking.container_types?.size || 'Container'
    const rentalPeriod = `${booking.start_date} to ${booking.end_date}`
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency,
      customer: customerId,
      setup_future_usage: 'off_session', // Save payment method for future admin charges
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

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    })
  } catch (error) {
    console.error('Error creating payment intent:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
