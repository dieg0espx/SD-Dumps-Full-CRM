import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminLayout } from "@/components/admin-layout"
import { BookingCalendar } from "@/components/booking-calendar"

export default async function AdminCalendarPage() {
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

  // Fetch bookings separately
  const { data: bookings, error: bookingsError } = await supabase.from("bookings").select("*").order("start_date")

  console.log("[v0] Admin calendar - Bookings count:", bookings?.length || 0)
  console.log("[v0] Admin calendar - Error:", bookingsError)

  // Fetch related data separately if bookings exist
  let enrichedBookings = []
  if (bookings && bookings.length > 0) {
    // Get unique user IDs and container type IDs
    const userIds = [...new Set(bookings.map((b) => b.user_id))]
    const containerTypeIds = [...new Set(bookings.map((b) => b.container_type_id))]

    // Fetch profiles and container types
    const { data: profiles } = await supabase.from("profiles").select("id, full_name, email, phone").in("id", userIds)

    const { data: containerTypes } = await supabase
      .from("container_types")
      .select("id, name, size")
      .in("id", containerTypeIds)

    // Combine the data
    enrichedBookings = bookings.map((booking) => ({
      ...booking,
      profiles: profiles?.find((p) => p.id === booking.user_id) || null,
      container_types: containerTypes?.find((ct) => ct.id === booking.container_type_id) || null,
    }))
  }

  return (
    <AdminLayout user={user}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Calendar</h1>
        {/* <p className="text-gray-600">View all bookings in calendar format</p> */}
      </div>

      <BookingCalendar bookings={enrichedBookings} />
    </AdminLayout>
  )
}
