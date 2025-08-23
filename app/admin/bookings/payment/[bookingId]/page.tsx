import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminLayout } from "@/components/admin-layout"
import { AdminPaymentForm } from "@/components/admin-payment-form"

interface AdminPaymentPageProps {
  params: {
    bookingId: string
  }
}

export default async function AdminPaymentPage({ params }: AdminPaymentPageProps) {
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

  // Fetch booking details with container type information
  const { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .select(`
      *,
      container_types (
        name,
        price_per_day
      ),
      profiles (
        full_name,
        email,
        phone
      )
    `)
    .eq("id", params.bookingId)
    .single()

  if (bookingError || !booking) {
    redirect("/admin/bookings")
  }

  return (
    <AdminLayout user={user}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Process Payment</h1>
        <p className="text-gray-600">
          Complete payment for booking by {booking.profiles?.full_name}
        </p>
      </div>

      <AdminPaymentForm booking={booking} />
    </AdminLayout>
  )
}
