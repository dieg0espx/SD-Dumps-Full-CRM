import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
})

/**
 * GET: List payment methods for any customer (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Verify admin authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!profile?.is_admin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    // Get customer user ID from query params
    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get('userId')

    if (!customerId) {
      return NextResponse.json(
        { error: 'userId parameter required' },
        { status: 400 }
      )
    }

    // Get customer's Stripe customer ID
    const { data: customerProfile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', customerId)
      .single()

    if (!customerProfile?.stripe_customer_id) {
      return NextResponse.json({ paymentMethods: [] })
    }

    // List all payment methods for the customer
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerProfile.stripe_customer_id,
      type: 'card',
    })

    return NextResponse.json({
      paymentMethods: paymentMethods.data.map(pm => ({
        id: pm.id,
        brand: pm.card?.brand,
        last4: pm.card?.last4,
        exp_month: pm.card?.exp_month,
        exp_year: pm.card?.exp_year,
        isDefault: pm.id === paymentMethods.data[0]?.id,
      })),
    })
  } catch (error) {
    console.error('Error fetching customer payment methods:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

