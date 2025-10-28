import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
})

/**
 * POST: Verify a payment method is attached to the customer
 * Useful for debugging
 */
export async function POST(request: NextRequest) {
  try {
    const { paymentMethodId } = await request.json()
    
    console.log('🔵 [Verify] Verifying payment method:', paymentMethodId)
    
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user's Stripe customer ID
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single()

    if (!profile?.stripe_customer_id) {
      return NextResponse.json({ 
        error: 'No Stripe customer ID found',
        attached: false 
      })
    }

    console.log('🔵 [Verify] User customer ID:', profile.stripe_customer_id)

    // Retrieve the payment method
    try {
      const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId)
      
      console.log('📦 [Verify] Payment method details:', {
        id: paymentMethod.id,
        customer: paymentMethod.customer,
        type: paymentMethod.type,
        card: paymentMethod.card ? {
          brand: paymentMethod.card.brand,
          last4: paymentMethod.card.last4,
        } : null,
      })

      const isAttached = paymentMethod.customer === profile.stripe_customer_id
      
      return NextResponse.json({
        attached: isAttached,
        paymentMethod: {
          id: paymentMethod.id,
          customer: paymentMethod.customer,
          expectedCustomer: profile.stripe_customer_id,
          brand: paymentMethod.card?.brand,
          last4: paymentMethod.card?.last4,
        },
      })
    } catch (error: any) {
      console.error('❌ [Verify] Failed to retrieve payment method:', error.message)
      return NextResponse.json({
        error: 'Payment method not found',
        attached: false,
      })
    }
  } catch (error) {
    console.error('❌ [Verify] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

