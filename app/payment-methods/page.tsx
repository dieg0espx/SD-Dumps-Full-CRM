import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PaymentMethodsClient } from './payment-methods-client'

export default async function PaymentMethodsPage() {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Payment Methods</h1>
          <p className="text-gray-600">
            Manage your saved cards for faster checkout
          </p>
        </div>

        <PaymentMethodsClient />
      </div>
    </div>
  )
}

