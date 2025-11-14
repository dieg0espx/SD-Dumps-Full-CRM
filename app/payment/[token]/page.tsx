import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { PaymentLinkForm } from "@/components/payment-link-form"
import { format } from "date-fns"

export default async function PaymentLinkPage({ params }: { params: { token: string } }) {
  const supabase = await createClient()

  // Fetch payment link with booking details
  const { data: paymentLink, error: linkError } = await supabase
    .from("payment_links")
    .select(`
      *,
      bookings (
        id,
        container_type_id,
        start_date,
        end_date,
        service_type,
        pickup_time,
        customer_address,
        delivery_address,
        total_amount,
        extra_tonnage,
        appliance_count,
        notes,
        status,
        container_types (
          name,
          size,
          description,
          price_per_day
        )
      )
    `)
    .eq("token", params.token)
    .single()

  // Handle errors and invalid states
  if (linkError || !paymentLink) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <span className="text-3xl">❌</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Link</h1>
          <p className="text-gray-600 mb-6">
            This payment link is not valid. It may have been deleted or the URL is incorrect.
          </p>
          <a
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Go to Homepage
          </a>
        </div>
      </div>
    )
  }

  // Check if link is already completed
  if (paymentLink.status === "completed") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <span className="text-3xl">✅</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Already Completed</h1>
          <p className="text-gray-600 mb-6">
            You've already completed this booking. Your payment information has been saved.
          </p>
          <p className="text-sm text-gray-500">
            Completed on {format(new Date(paymentLink.completed_at!), "PPP 'at' p")}
          </p>
        </div>
      </div>
    )
  }

  // Check if link is expired
  const now = new Date()
  const expiresAt = new Date(paymentLink.expires_at)
  if (now > expiresAt || paymentLink.status === "expired") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
            <span className="text-3xl">⏰</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Link Expired</h1>
          <p className="text-gray-600 mb-6">
            This payment link expired on {format(expiresAt, "PPP")}. Please contact us to create a
            new booking.
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Booking ID: #{(paymentLink.bookings as any).id.slice(0, 8)}
          </p>
          <a
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Contact Us
          </a>
        </div>
      </div>
    )
  }

  // Check if booking is cancelled
  if ((paymentLink.bookings as any).status === "cancelled") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <span className="text-3xl">🚫</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Cancelled</h1>
          <p className="text-gray-600 mb-6">
            This booking has been cancelled. Please contact us if you'd like to make a new booking.
          </p>
          <a
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Contact Us
          </a>
        </div>
      </div>
    )
  }

  // Valid link - show payment form
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <PaymentLinkForm paymentLink={paymentLink} />
    </div>
  )
}
