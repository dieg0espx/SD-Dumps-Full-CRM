"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CreditCard, DollarSign } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface AdminChargeCustomerProps {
  bookingId: string
  customerId: string  // User ID of the customer
  customerEmail?: string
  onSuccess?: () => void
}

export function AdminChargeCustomer({ bookingId, customerId, customerEmail, onSuccess }: AdminChargeCustomerProps) {
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [paymentMethods, setPaymentMethods] = useState<any[]>([])
  const [selectedCard, setSelectedCard] = useState('')
  const { toast } = useToast()

  const loadPaymentMethods = async () => {
    try {
      // Get payment methods for the specific customer (admin endpoint)
      const response = await fetch(`/api/admin/customer-payment-methods?userId=${customerId}`)
      const data = await response.json()
      
      if (data.paymentMethods && data.paymentMethods.length > 0) {
        setPaymentMethods(data.paymentMethods)
        setSelectedCard(data.paymentMethods[0].id)
      } else {
        toast({
          title: 'No Saved Cards',
          description: 'Customer has no saved payment methods',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error loading payment methods:', error)
      toast({
        title: 'Error',
        description: 'Failed to load payment methods',
        variant: 'destructive',
      })
    }
  }

  const handleCharge = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid amount',
        variant: 'destructive',
      })
      return
    }

    if (!selectedCard) {
      toast({
        title: 'No Card Selected',
        description: 'Please select a payment method',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/charge-saved-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(amount),
          paymentMethodId: selectedCard,
          bookingId: bookingId,
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: 'Success!',
          description: `Successfully charged $${amount}`,
        })
        setAmount('')
        if (onSuccess) onSuccess()
      } else {
        throw new Error(result.error || 'Charge failed')
      }
    } catch (error: any) {
      toast({
        title: 'Charge Failed',
        description: error.message || 'Failed to charge customer',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <DollarSign className="mr-2 h-5 w-5" />
          Charge Customer
        </CardTitle>
        <CardDescription>
          Charge additional fees to customer's saved card
          {customerEmail && ` (${customerEmail})`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {paymentMethods.length === 0 ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Load customer's saved payment methods to charge them.
            </p>
            <Button onClick={loadPaymentMethods} disabled={loading}>
              <CreditCard className="mr-2 h-4 w-4" />
              Load Payment Methods
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <Label>Select Card</Label>
              <div className="space-y-2">
                {paymentMethods.map((pm) => (
                  <div
                    key={pm.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedCard === pm.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedCard(pm.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <CreditCard className="h-4 w-4 text-gray-500" />
                        <span className="font-medium capitalize">
                          {pm.brand || 'Card'} •••• {pm.last4}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        Expires {pm.exp_month}/{pm.exp_year}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount to Charge ($)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="150.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={loading}
              />
            </div>

            <Button
              onClick={handleCharge}
              disabled={loading || !amount}
              className="w-full"
              size="lg"
            >
              {loading ? 'Processing...' : `Charge $${amount || '0.00'}`}
            </Button>
          </>
        )}

        <div className="text-xs text-gray-500">
          <p>⚠️ Note: This will immediately charge the customer's saved card.</p>
        </div>
      </CardContent>
    </Card>
  )
}

