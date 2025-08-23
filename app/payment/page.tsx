"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { AuthHeader } from "@/components/auth-header"
import { PaymentForm } from "@/components/payment-form"

export default function PaymentPage() {
  const [user, setUser] = useState<any>(null)
  const [bookingData, setBookingData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      setUser(user)

      // Get booking data from localStorage
      const storedBookingData = localStorage.getItem("pendingBooking")
      if (!storedBookingData) {
        router.push("/booking")
        return
      }

      const parsedBookingData = JSON.parse(storedBookingData)
      setBookingData(parsedBookingData)
      setLoading(false)
    }

    checkAuth()
  }, [router, supabase.auth])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment page...</p>
        </div>
      </div>
    )
  }

  if (!user || !bookingData) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthHeader user={user} />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Payment</h1>
            <p className="text-gray-600">Secure payment for your container rental</p>
          </div>
          <PaymentForm bookingData={bookingData} />
        </div>
      </div>
    </div>
  )
}
