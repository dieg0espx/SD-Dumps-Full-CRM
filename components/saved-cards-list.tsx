"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { CreditCard, Trash2, Plus } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface PaymentMethod {
  id: string
  brand?: string
  last4?: string
  exp_month?: number
  exp_year?: number
  isDefault?: boolean
}

interface SavedCardsListProps {
  onSelectCard?: (paymentMethodId: string) => void
  onAddNewCard?: () => void
  selectedCardId?: string
  showAddButton?: boolean
}

export function SavedCardsList({
  onSelectCard,
  onAddNewCard,
  selectedCardId,
  showAddButton = true,
}: SavedCardsListProps) {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCard, setSelectedCard] = useState<string>(selectedCardId || '')
  const [deleteCardId, setDeleteCardId] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchPaymentMethods = async (retryCount = 0) => {
    try {
      console.log('🔵 Fetching payment methods... (attempt', retryCount + 1, ')')
      setIsLoading(true)
      
      // Add cache-busting and no-cache headers
      const response = await fetch(`/api/payment-methods?t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      })
      const data = await response.json()

      console.log('📦 Payment methods response:', data)

      if (response.ok) {
        const methods = data.paymentMethods || []
        console.log(`✅ Found ${methods.length} saved card(s)`)
        setPaymentMethods(methods)
        
        // Auto-select the first card if none selected
        if (methods.length > 0 && !selectedCard) {
          const defaultCard = methods[0].id
          console.log('✅ Auto-selecting first card:', defaultCard)
          setSelectedCard(defaultCard)
          if (onSelectCard) {
            onSelectCard(defaultCard)
          }
        } else if (methods.length === 0) {
          console.log('⚠️ No saved cards found')
        }
      } else {
        console.error('❌ API error:', data.error)
        throw new Error(data.error || 'Failed to load payment methods')
      }
    } catch (error) {
      console.error('❌ Error fetching payment methods:', error)
      toast({
        title: 'Error',
        description: 'Failed to load saved cards',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPaymentMethods()
  }, [])

  useEffect(() => {
    if (selectedCardId) {
      setSelectedCard(selectedCardId)
    }
  }, [selectedCardId])

  const handleCardSelect = (cardId: string) => {
    setSelectedCard(cardId)
    if (onSelectCard) {
      onSelectCard(cardId)
    }
  }

  const handleDeleteCard = async () => {
    if (!deleteCardId) return

    try {
      const response = await fetch('/api/payment-methods', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentMethodId: deleteCardId }),
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Card removed successfully',
        })
        
        // Remove the card from the list
        setPaymentMethods(prev => prev.filter(pm => pm.id !== deleteCardId))
        
        // If deleted card was selected, select the first remaining card
        if (selectedCard === deleteCardId && paymentMethods.length > 1) {
          const newSelectedCard = paymentMethods.find(pm => pm.id !== deleteCardId)?.id
          if (newSelectedCard) {
            handleCardSelect(newSelectedCard)
          }
        }
      } else {
        throw new Error('Failed to delete card')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove card',
        variant: 'destructive',
      })
    } finally {
      setDeleteCardId(null)
    }
  }

  const getCardBrandIcon = (brand?: string) => {
    // You can add more card brand icons here
    return <CreditCard className="h-5 w-5" />
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-gray-500">
            Loading saved cards...
          </div>
        </CardContent>
      </Card>
    )
  }

  if (paymentMethods.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Saved Cards</CardTitle>
          <CardDescription>
            Save a card for faster checkout
          </CardDescription>
        </CardHeader>
        {showAddButton && onAddNewCard && (
          <CardContent>
            <Button onClick={onAddNewCard} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Add New Card
            </Button>
          </CardContent>
        )}
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Saved Payment Methods</CardTitle>
          <CardDescription>
            Select a card to use for this booking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedCard} onValueChange={handleCardSelect}>
            <div className="space-y-3">
              {paymentMethods.map((pm) => (
                <div
                  key={pm.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <RadioGroupItem value={pm.id} id={pm.id} />
                    <Label
                      htmlFor={pm.id}
                      className="flex items-center space-x-3 flex-1 cursor-pointer"
                    >
                      {getCardBrandIcon(pm.brand)}
                      <div className="flex-1">
                        <div className="font-medium capitalize">
                          {pm.brand || 'Card'} •••• {pm.last4}
                        </div>
                        <div className="text-sm text-gray-500">
                          Expires {pm.exp_month}/{pm.exp_year}
                        </div>
                      </div>
                      {pm.isDefault && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          Default
                        </span>
                      )}
                    </Label>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      setDeleteCardId(pm.id)
                    }}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </RadioGroup>

          {showAddButton && onAddNewCard && (
            <Button
              variant="outline"
              onClick={onAddNewCard}
              className="w-full mt-4"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Card
            </Button>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteCardId} onOpenChange={() => setDeleteCardId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Card?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this card? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCard} className="bg-red-600 hover:bg-red-700">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

