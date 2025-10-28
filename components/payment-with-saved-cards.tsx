"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SavedCardsList } from './saved-cards-list'
import { SaveCardForm } from './save-card-form'
import { StripeElements } from './stripe-elements'
import { useToast } from '@/hooks/use-toast'
import { createClient } from '@/lib/supabase/client'

interface PaymentWithSavedCardsProps {
  amount: number
  bookingId: string
  bookingData: any
  onSuccess: (bookingData?: any) => void
  onError: (error: string) => void
}

export function PaymentWithSavedCards({
  amount,
  bookingId,
  bookingData,
  onSuccess,
  onError,
}: PaymentWithSavedCardsProps) {
  const [selectedTab, setSelectedTab] = useState<'saved' | 'new'>('saved')
  const [selectedCardId, setSelectedCardId] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const { toast } = useToast()
  const supabase = createClient()

  const handleChargeExistingCard = async () => {
    if (!selectedCardId) {
      toast({
        title: 'Error',
        description: 'Please select a card',
        variant: 'destructive',
      })
      return
    }

    setIsProcessing(true)

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

      // Charge the saved card
      const response = await fetch('/api/charge-saved-card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          paymentMethodId: selectedCardId,
          bookingId: finalBookingId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Payment failed')
      }

      if (data.requiresAction) {
        // Card requires 3D Secure authentication
        toast({
          title: 'Authentication Required',
          description: 'This card requires additional authentication',
          variant: 'destructive',
        })
        onError('Card requires authentication. Please use the "Pay with New Card" option.')
        return
      }

      if (data.success) {
        // Fetch the updated booking data
        const { data: updatedBooking } = await supabase
          .from('bookings')
          .select(`
            *,
            container_types (
              id,
              size,
              price_per_day
            )
          `)
          .eq('id', finalBookingId)
          .single()

        toast({
          title: 'Success',
          description: 'Payment processed successfully!',
        })
        
        onSuccess(updatedBooking)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment failed'
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      })
      onError(errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCardSaved = () => {
    toast({
      title: 'Success',
      description: 'Card saved successfully! You can now use it for this booking.',
    })
    setSelectedTab('saved')
    // The SavedCardsList will automatically refresh and show the new card
  }

  return (
    <div className="space-y-4">
      <Tabs value={selectedTab} onValueChange={(value) => {
        setSelectedTab(value as 'saved' | 'new')
        // Refresh saved cards list when switching to saved tab
        if (value === 'saved') {
          setRefreshKey(prev => prev + 1)
        }
      }}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="saved">Use Saved Card</TabsTrigger>
          <TabsTrigger value="new">Pay with New Card</TabsTrigger>
        </TabsList>

        <TabsContent value="saved" className="space-y-4">
          <SavedCardsList
            key={refreshKey}
            onSelectCard={setSelectedCardId}
            selectedCardId={selectedCardId}
            showAddButton={false}
          />
          
          {selectedCardId && (
            <Button
              onClick={handleChargeExistingCard}
              disabled={isProcessing}
              className="w-full"
              size="lg"
            >
              {isProcessing ? 'Processing Payment...' : `Pay $${amount.toFixed(2)} with Saved Card`}
            </Button>
          )}
          
          <div className="text-center">
            <Button
              variant="link"
              onClick={() => setSelectedTab('new')}
            >
              Or add a new card
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="new">
          <StripeElements
            amount={amount}
            bookingId={bookingId}
            bookingData={bookingData}
            onSuccess={onSuccess}
            onError={onError}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

