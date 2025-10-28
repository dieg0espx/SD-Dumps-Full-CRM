"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/admin-layout"
import { PaymentTracker } from "@/components/payment-tracker"

export default function AdminPaymentsPage() {
  const [user, setUser] = useState<any>(null)
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  const fetchPayments = async () => {
    console.log('🔵 [Payments Page] Fetching bookings and payments...')
    setLoading(true)
    
    // Fetch all bookings with card saved (pending payment)
    // These are bookings that have payment_method_id but payment_status is still "pending"
    const { data: pendingBookings, error: bookingsError } = await supabase
      .from("bookings")
      .select("*")
      .eq("payment_status", "pending")
      .not("payment_method_id", "is", null)
      .order("created_at", { ascending: false })

    console.log("[v0] Admin payments - Pending bookings (card saved):", pendingBookings?.length || 0)

    // Fetch all completed payments
    const { data: paymentsData, error: paymentsError } = await supabase
      .from("payments")
      .select("*")
      .order("created_at", { ascending: false })

    console.log("[v0] Admin payments - Completed payments count:", paymentsData?.length || 0)

    // Combine pending bookings and completed payments
    let allItems = []

    // Add pending bookings (items that need to be charged)
    if (pendingBookings && pendingBookings.length > 0) {
      const bookingIds = pendingBookings.map(b => b.id)
      const userIds = [...new Set(pendingBookings.map((b) => b.user_id))]
      const containerTypeIds = [...new Set(pendingBookings.map((b) => b.container_type_id))]

      const { data: profiles } = await supabase.from("profiles").select("id, full_name, email, phone").in("id", userIds)
      const { data: containerTypes } = await supabase
        .from("container_types")
        .select("id, name, size")
        .in("id", containerTypeIds)

      // Add pending bookings as items to display
      const pendingItems = pendingBookings.map((booking) => ({
        id: `booking_${booking.id}`,
        booking_id: booking.id,
        amount: booking.total_amount,
        status: 'pending',
        payment_status: 'pending',
        created_at: booking.created_at,
        transaction_id: `PENDING-${booking.id.slice(0, 8).toUpperCase()}`,
        payment_method: 'stripe',
        bookings: {
          ...booking,
          profiles: profiles?.find((p) => p.id === booking.user_id) || null,
          container_types: containerTypes?.find((ct) => ct.id === booking.container_type_id) || null,
        },
        is_pending_booking: true,
      }))

      allItems = [...allItems, ...pendingItems]
    }

    // Add completed payments
    if (paymentsData && paymentsData.length > 0) {
      const bookingIds = [...new Set(paymentsData.map((p) => p.booking_id))]
      const { data: bookings } = await supabase.from("bookings").select("*").in("id", bookingIds)

      if (bookings && bookings.length > 0) {
        const userIds = [...new Set(bookings.map((b) => b.user_id))]
        const containerTypeIds = [...new Set(bookings.map((b) => b.container_type_id))]

        const { data: profiles } = await supabase.from("profiles").select("id, full_name, email, phone").in("id", userIds)
        const { data: containerTypes } = await supabase
          .from("container_types")
          .select("id, name, size")
          .in("id", containerTypeIds)

        const completedPayments = paymentsData.map((payment) => {
          const booking = bookings.find((b) => b.id === payment.booking_id)
          if (booking) {
            return {
              ...payment,
              bookings: {
                ...booking,
                profiles: profiles?.find((p) => p.id === booking.user_id) || null,
                container_types: containerTypes?.find((ct) => ct.id === booking.container_type_id) || null,
              },
              is_pending_booking: false,
            }
          }
          return { ...payment, bookings: null, is_pending_booking: false }
        })

        allItems = [...allItems, ...completedPayments]
      }
    }

    // Sort by created_at
    allItems.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    console.log('✅ [Payments Page] Total items:', allItems.length)
    setPayments(allItems)
    setLoading(false)
  }

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

      if (!profile || profile.role !== "admin") {
        router.push("/booking")
        return
      }

      setUser(user)
      await fetchPayments()
    }

    checkAuthAndFetchData()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Loading payments...</p>
        </div>
      </div>
    )
  }

  return (
    <AdminLayout user={user}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Tracking</h1>
        <p className="text-gray-600">Monitor all payments and transactions</p>
      </div>

      <PaymentTracker payments={payments} onRefresh={fetchPayments} />
    </AdminLayout>
  )
}
