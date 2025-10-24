import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
})

/**
 * POST: Create a Setup Intent to save a payment method for future use
 * This allows you to collect card details without charging immediately
 */
export async function POST(request: NextRequest) {
  try {
    console.log('🔵 [Setup Intent] Creating Setup Intent...')
    
    // Verify user authentication
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error('❌ [Setup Intent] Auth error:', authError)
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('✅ [Setup Intent] User authenticated:', user.id)

    // Get user profile information
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('❌ [Setup Intent] Profile error:', profileError)
    }

    console.log('📦 [Setup Intent] Profile:', { 
      id: profile?.id, 
      stripe_customer_id: profile?.stripe_customer_id 
    })

    // Create or retrieve Stripe customer
    let customerId: string

    if (profile?.stripe_customer_id) {
      customerId = profile.stripe_customer_id
      console.log('✅ [Setup Intent] Using existing customer:', customerId)
    } else {
      // Create a new Stripe customer
      console.log('🔵 [Setup Intent] Creating new Stripe customer...')
      const customer = await stripe.customers.create({
        email: user.email,
        name: profile?.full_name || user.user_metadata?.full_name || 'Customer',
        phone: profile?.phone || user.user_metadata?.phone,
        metadata: {
          user_id: user.id,
        },
      })

      customerId = customer.id
      console.log('✅ [Setup Intent] Created new customer:', customerId)

      // Save the Stripe customer ID to the profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ stripe_customer_id: customer.id })
        .eq('id', user.id)
      
      if (updateError) {
        console.error('❌ [Setup Intent] Failed to save customer ID to profile:', updateError)
      } else {
        console.log('✅ [Setup Intent] Saved customer ID to profile')
      }
    }

    // Create Setup Intent for saving the payment method
    console.log('🔵 [Setup Intent] Creating Setup Intent for customer:', customerId)
    const setupIntent = await stripe.setupIntents.create({
      customer: customerId,
      payment_method_types: ['card'],
      usage: 'off_session', // Allows charging without customer present
      metadata: {
        user_id: user.id,
      },
    })

    console.log('✅ [Setup Intent] Created Setup Intent:', setupIntent.id)
    console.log('📦 [Setup Intent] Returning client secret')

    return NextResponse.json({
      clientSecret: setupIntent.client_secret,
      customerId: customerId,
    })
  } catch (error) {
    console.error('Error creating setup intent:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

