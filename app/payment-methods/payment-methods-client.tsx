"use client"

import { useState } from 'react'
import { SavedCardsList } from '@/components/saved-cards-list'
import { SaveCardForm } from '@/components/save-card-form'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export function PaymentMethodsClient() {
  const [showAddForm, setShowAddForm] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  if (showAddForm) {
    return (
      <div className="space-y-4">
        <Button
          variant="ghost"
          onClick={() => setShowAddForm(false)}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Saved Cards
        </Button>

        <SaveCardForm
          onSuccess={() => {
            setShowAddForm(false)
            setRefreshKey(prev => prev + 1) // Force list to refresh
          }}
          onCancel={() => setShowAddForm(false)}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <SavedCardsList
        key={refreshKey}
        onAddNewCard={() => setShowAddForm(true)}
        showAddButton={true}
      />

      <div className="text-center pt-4">
        <Link href="/profile">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Profile
          </Button>
        </Link>
      </div>
    </div>
  )
}

