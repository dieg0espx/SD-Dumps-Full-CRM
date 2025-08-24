import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminLayout } from "@/components/admin-layout"
import { PaymentTracker } from "@/components/payment-tracker"

export default async function AdminPaymentsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (!profile || profile.role !== "admin") {
    redirect("/booking")
  }

  // Fetch payments separately
  const { data: payments, error: paymentsError } = await supabase
    .from("payments")
    .select("*")
    .order("created_at", { ascending: false })

  console.log("[v0] Admin payments - Payments count:", payments?.length || 0)
  console.log("[v0] Admin payments - Error:", paymentsError)

  // Fetch related data separately if payments exist
  let enrichedPayments = []
  if (payments && payments.length > 0) {
    // Get unique booking IDs
    const bookingIds = [...new Set(payments.map((p) => p.booking_id))]

    // Fetch bookings
    const { data: bookings } = await supabase.from("bookings").select("*").in("id", bookingIds)

    if (bookings && bookings.length > 0) {
      // Get unique user IDs and container type IDs from bookings
      const userIds = [...new Set(bookings.map((b) => b.user_id))]
      const containerTypeIds = [...new Set(bookings.map((b) => b.container_type_id))]

      // Fetch profiles and container types
      const { data: profiles } = await supabase.from("profiles").select("id, full_name, email, phone").in("id", userIds)

      const { data: containerTypes } = await supabase
        .from("container_types")
        .select("id, name, size")
        .in("id", containerTypeIds)

      // Combine the data
      enrichedPayments = payments.map((payment) => {
        const booking = bookings.find((b) => b.id === payment.booking_id)
        if (booking) {
          return {
            ...payment,
            bookings: {
              ...booking,
              profiles: profiles?.find((p) => p.id === booking.user_id) || null,
              container_types: containerTypes?.find((ct) => ct.id === booking.container_type_id) || null,
            },
          }
        }
        return { ...payment, bookings: null }
      })
    }
  }

  return (
    <AdminLayout user={user}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Tracking</h1>
        <p className="text-gray-600">Monitor all payments and transactions</p>
      </div>

      <PaymentTracker payments={enrichedPayments} />
    </AdminLayout>
  )
}
