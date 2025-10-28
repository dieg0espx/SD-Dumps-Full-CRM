import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
})

/**
 * GET: List all saved payment methods for the authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    console.log('🔵 [API] GET /api/payment-methods called')
    
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error('❌ [API] Auth error:', authError)
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('✅ [API] User authenticated:', user.id)

    // Get user's Stripe customer ID
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single()

    console.log('📦 [API] Profile data:', profile)

    if (!profile?.stripe_customer_id) {
      console.log('⚠️ [API] No Stripe customer ID found - returning empty array')
      return NextResponse.json({ paymentMethods: [] })
    }

    console.log('🔵 [API] Fetching payment methods from Stripe for customer:', profile.stripe_customer_id)

    // List all payment methods for the customer
    const paymentMethods = await stripe.paymentMethods.list({
      customer: profile.stripe_customer_id,
      type: 'card',
    })

    console.log(`✅ [API] Found ${paymentMethods.data.length} payment method(s) in Stripe`)
    
    if (paymentMethods.data.length > 0) {
      console.log('📦 [API] Payment methods:', paymentMethods.data.map(pm => ({
        id: pm.id,
        last4: pm.card?.last4,
        brand: pm.card?.brand,
        customer: pm.customer,
      })))
    } else {
      // If no payment methods found, let's verify the customer exists in Stripe
      console.log('⚠️ [API] No payment methods found, verifying customer...')
      try {
        const customer = await stripe.customers.retrieve(profile.stripe_customer_id)
        console.log('📦 [API] Customer exists in Stripe:', {
          id: customer.id,
          email: (customer as any).email,
          deleted: (customer as any).deleted,
        })
      } catch (custErr) {
        console.error('❌ [API] Customer not found in Stripe:', custErr)
      }
    }

    const response = {
      paymentMethods: paymentMethods.data.map(pm => ({
        id: pm.id,
        brand: pm.card?.brand,
        last4: pm.card?.last4,
        exp_month: pm.card?.exp_month,
        exp_year: pm.card?.exp_year,
        isDefault: pm.id === paymentMethods.data[0]?.id,
      })),
    }

    console.log('✅ [API] Returning response:', response)
    return NextResponse.json(response)
  } catch (error) {
    console.error('❌ [API] Error fetching payment methods:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE: Remove a saved payment method
 */
export async function DELETE(request: NextRequest) {
  try {
    const { paymentMethodId } = await request.json()

    if (!paymentMethodId) {
      return NextResponse.json(
        { error: 'Payment method ID is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify the payment method belongs to this customer
    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId)
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single()

    if (paymentMethod.customer !== profile?.stripe_customer_id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Detach the payment method
    await stripe.paymentMethods.detach(paymentMethodId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting payment method:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

