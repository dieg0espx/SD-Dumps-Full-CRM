import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminLayout } from "@/components/admin-layout"
import { PhoneBookingForm } from "@/components/phone-booking-form"

export default async function AdminPhoneBookingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("role, is_admin").eq("id", user.id).single()

  if (!profile || (profile.role !== "admin" && !profile.is_admin)) {
    redirect("/booking")
  }

  // Fetch container types for the booking form
  const { data: containerTypes } = await supabase
    .from("container_types")
    .select("*")
    .eq("is_hidden", false)
    .order("name")

  return (
    <AdminLayout user={user}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Phone Booking</h1>
        <p className="text-gray-600">
          Create a booking for customers who call in. They'll receive a payment link to save their card details.
        </p>
      </div>

      <PhoneBookingForm containerTypes={containerTypes || []} />
    </AdminLayout>
  )
}
