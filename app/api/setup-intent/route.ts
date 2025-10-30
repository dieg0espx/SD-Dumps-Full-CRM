import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

if (!process.env.STRIPE_SECRET_KEY) {
  console.error('❌ [Setup Intent] Missing STRIPE_SECRET_KEY environment variable')
}

// Use account default API version to avoid type mismatch errors during build
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '')

/**
 * POST: Create a Setup Intent to save a payment method for future use
 * This allows you to collect card details without charging immediately
 */
export async function POST(request: NextRequest) {
  try {
    console.log('🔵 [Setup Intent] Creating Setup Intent...')
    
    // Parse body for optional guest data
    const body = await request.json().catch(() => ({})) as any
    const allowGuest: boolean = !!body?.allowGuest
    const guest = body?.guest as { name?: string; email?: string; phone?: string } | undefined

    // Verify user authentication
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      if (!allowGuest) {
        console.error('❌ [Setup Intent] Auth error:', authError)
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        )
      }
    }

    if (user) console.log('✅ [Setup Intent] User authenticated:', user.id)

    // Get user profile information (only for authenticated users)
    let profile: any = null
    if (user) {
      const { data: p, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      profile = p
      if (profileError) {
        console.error('❌ [Setup Intent] Profile error:', profileError)
      }
      console.log('📦 [Setup Intent] Profile:', { 
        id: profile?.id, 
        stripe_customer_id: profile?.stripe_customer_id 
      })
    }

    // Create or retrieve Stripe customer
    let customerId: string

    if (user) {
      if (profile?.stripe_customer_id) {
        customerId = profile.stripe_customer_id
        console.log('✅ [Setup Intent] Using existing customer:', customerId)
      } else {
        console.log('🔵 [Setup Intent] Creating new Stripe customer...')
        const customer = await stripe.customers.create({
          email: user.email!,
          name: profile?.full_name || user.user_metadata?.full_name || 'Customer',
          phone: profile?.phone || user.user_metadata?.phone,
          metadata: {
            user_id: user.id,
          },
        })
        customerId = customer.id
        console.log('✅ [Setup Intent] Created new customer:', customerId)
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ stripe_customer_id: customer.id })
          .eq('id', user.id)
        if (updateError) {
          console.error('❌ [Setup Intent] Failed to save customer ID to profile:', updateError)
        }
      }
    } else if (allowGuest) {
      // Guest mode: create a temporary Stripe customer using provided guest contact
      console.log('🔵 [Setup Intent] Creating guest Stripe customer...')
      const guestEmail = guest?.email || 'guest@example.com'
      const guestName = guest?.name || 'Guest Customer'
      const guestPhone = guest?.phone
      const customer = await stripe.customers.create({
        email: guestEmail,
        name: guestName,
        phone: guestPhone,
        metadata: {
          guest: 'true',
        },
      })
      customerId = customer.id
      console.log('✅ [Setup Intent] Guest customer created:', customerId)
    } else {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Create Setup Intent for saving the payment method
    console.log('🔵 [Setup Intent] Creating Setup Intent for customer:', customerId)
    const setupIntent = await stripe.setupIntents.create({
      customer: customerId,
      payment_method_types: ['card'],
      usage: 'off_session', // Allows charging without customer present
      metadata: user ? { user_id: user.id } : { guest: 'true' },
    })

    console.log('✅ [Setup Intent] Created Setup Intent:', setupIntent.id)
    console.log('📦 [Setup Intent] Returning client secret')

    return NextResponse.json({
      clientSecret: setupIntent.client_secret,
      customerId: customerId,
    })
  } catch (error: any) {
    console.error('❌ [Setup Intent] Error creating setup intent:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error?.message || String(error),
        type: error?.type,
        code: error?.code
      },
      { status: 500 }
    )
  }
}

