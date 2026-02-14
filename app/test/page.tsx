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

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

const cardStyle = {
  style: {
    base: {
      fontSize: '16px',
      color: '#1a1a1a',
      '::placeholder': { color: '#a0a0a0' },
    },
    invalid: { color: '#e53e3e' },
  },
}

function TestPaymentForm() {
  const stripe = useStripe()
  const elements = useElements()
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async () => {
    if (!stripe || !elements) return

    setStatus('loading')
    setMessage('')

    try {
      // Create payment intent on server
      const res = await fetch('/api/test-charge', { method: 'POST' })
      const { clientSecret, error: apiError } = await res.json()

      if (apiError) throw new Error(apiError)

      // Confirm payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement)!,
        },
      })

      if (error) throw new Error(error.message)

      if (paymentIntent?.status === 'succeeded') {
        setStatus('success')
        setMessage(`✅ Payment successful! ID: ${paymentIntent.id}`)
      } else {
        setStatus('error')
        setMessage(`Status: ${paymentIntent?.status}`)
      }
    } catch (err: any) {
      setStatus('error')
      setMessage(`❌ ${err.message}`)
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: '80px auto', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Stripe Test Charge</h1>
      <p style={{ color: '#666', marginBottom: 32 }}>This will charge <strong>$1.00 USD</strong> to the card.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={{ fontSize: 14, fontWeight: 500, display: 'block', marginBottom: 6 }}>Card Number</label>
          <div style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: 12 }}>
            <CardNumberElement options={cardStyle} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={{ fontSize: 14, fontWeight: 500, display: 'block', marginBottom: 6 }}>Expiry</label>
            <div style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: 12 }}>
              <CardExpiryElement options={cardStyle} />
            </div>
          </div>
          <div>
            <label style={{ fontSize: 14, fontWeight: 500, display: 'block', marginBottom: 6 }}>CVC</label>
            <div style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: 12 }}>
              <CardCvcElement options={cardStyle} />
            </div>
          </div>
        </div>
      </div>

      {message && (
        <div style={{
          marginTop: 16,
          padding: 12,
          borderRadius: 8,
          backgroundColor: status === 'success' ? '#f0fdf4' : '#fef2f2',
          color: status === 'success' ? '#166534' : '#991b1b',
          fontSize: 14,
        }}>
          {message}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={!stripe || status === 'loading'}
        style={{
          marginTop: 24,
          width: '100%',
          padding: '12px 0',
          backgroundColor: status === 'loading' ? '#9ca3af' : '#000',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          fontSize: 16,
          fontWeight: 600,
          cursor: status === 'loading' ? 'not-allowed' : 'pointer',
        }}
      >
        {status === 'loading' ? 'Processing...' : 'Pay $1.00'}
      </button>
    </div>
  )
}

export default function TestPage() {
  return (
    <Elements stripe={stripePromise}>
      <TestPaymentForm />
    </Elements>
  )
}
