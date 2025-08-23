import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AuthHeader } from "@/components/auth-header"
import { PaymentForm } from "@/components/payment-form"

interface PaymentPageProps {
  params: {
    bookingId: string
  }
}

export default async function PaymentPage({ params }: PaymentPageProps) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch booking details
  const { data: booking } = await supabase
    .from("bookings")
    .select(`
      *,
      container_types (
        name,
        size,
        description
      )
    `)
    .eq("id", params.bookingId)
    .eq("user_id", user.id)
    .single()

  if (!booking) {
    redirect("/bookings")
  }

  // If already paid, redirect to success
  if (booking.payment_status === "paid") {
    redirect(`/payment/${params.bookingId}/success`)
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
          <PaymentForm booking={booking} />
        </div>
      </div>
    </div>
  )
}
