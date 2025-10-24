"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/admin-layout"
import { BookingCalendar } from "@/components/booking-calendar"

export default function AdminCalendarPage() {
  const [user, setUser] = useState<any>(null)
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

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
      await fetchBookings()
    }

    checkAuthAndFetchData()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchBookings = async () => {
    setLoading(true)
    
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

    setBookings(enrichedBookings)
    setLoading(false)
  }

  const handleBookingUpdate = async () => {
    // Refresh booking data after charge
    await fetchBookings()
  }

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Loading calendar...</p>
        </div>
      </div>
    )
  }

  return (
    <AdminLayout user={user}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Calendar</h1>
        {/* <p className="text-gray-600">View all bookings in calendar format</p> */}
      </div>

      <BookingCalendar bookings={bookings} isAdmin={true} onBookingUpdate={handleBookingUpdate} />
    </AdminLayout>
  )
}
