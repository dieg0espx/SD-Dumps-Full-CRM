import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminLayout } from "@/components/admin-layout"
import { AdminStats } from "@/components/admin-stats"
import { subMonths, startOfMonth, endOfMonth, format } from "date-fns"

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  console.log("[v0] Admin check - User ID:", user.id)

  // Check if user is admin
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("is_admin, role, email")
    .eq("id", user.id)
    .single()

  console.log("[v0] Admin check - Profile:", profile)
  console.log("[v0] Admin check - Error:", error)

  if (!profile || profile.role !== "admin") {
    console.log("[v0] Admin check - User is not admin, redirecting to booking")
    redirect("/booking")
  }

  console.log("[v0] Admin check - User is admin, loading dashboard")

  // Fetch dashboard stats
  const [
    { count: totalBookings },
    { count: pendingBookings },
    { count: confirmedBookings },
    { count: completedBookings },
    { count: cancelledBookings },
    { count: totalUsers },
    { data: bookings },
    { data: allBookingsForCharts },
    { data: containerTypes },
  ] = await Promise.all([
    supabase.from("bookings").select("*", { count: "exact", head: true }),
    supabase.from("bookings").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("bookings").select("*", { count: "exact", head: true }).eq("status", "confirmed"),
    supabase.from("bookings").select("*", { count: "exact", head: true }).eq("status", "completed"),
    supabase.from("bookings").select("*", { count: "exact", head: true }).eq("status", "cancelled"),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("bookings").select("*").order("created_at", { ascending: false }).limit(5),
    // Fetch all bookings from last 6 months for charts
    supabase
      .from("bookings")
      .select("id, created_at, total_amount, status, container_type_id")
      .gte("created_at", subMonths(new Date(), 6).toISOString())
      .order("created_at", { ascending: true }),
    supabase.from("container_types").select("id, name"),
  ])

  console.log("[v0] Admin dashboard - Total bookings:", totalBookings)
  console.log("[v0] Admin dashboard - Pending bookings:", pendingBookings)
  console.log("[v0] Admin dashboard - Total users:", totalUsers)
  console.log("[v0] Admin dashboard - Recent bookings:", bookings?.length || 0)

  let recentBookings: any[] = []
  if (bookings && bookings.length > 0) {
    const bookingIds = bookings.map((b) => b.id)
    const userIds = [...new Set(bookings.map((b) => b.user_id))]
    const containerTypeIds = [...new Set(bookings.map((b) => b.container_type_id))]

    const [{ data: profiles }, { data: phoneGuests }, { data: containerTypes }] = await Promise.all([
      supabase.from("profiles").select("id, full_name, email, phone").in("id", userIds),
      supabase
        .from("phone_booking_guests")
        .select("booking_id, customer_name, customer_email, customer_phone")
        .in("booking_id", bookingIds),
      supabase.from("container_types").select("id, name, size").in("id", containerTypeIds),
    ])

    recentBookings = bookings.map((booking) => {
      // Check if this is a phone booking (has guest info)
      const guestInfo = phoneGuests?.find((g) => g.booking_id === booking.id)
      const profileInfo = guestInfo
        ? {
            id: booking.user_id,
            full_name: guestInfo.customer_name,
            email: guestInfo.customer_email,
            phone: guestInfo.customer_phone,
          }
        : profiles?.find((p) => p.id === booking.user_id) || null

      return {
        ...booking,
        profiles: profileInfo,
        container_types: containerTypes?.find((ct) => ct.id === booking.container_type_id) || null,
      }
    })
  }

  // Process data for monthly charts (last 6 months)
  const monthlyData: { month: string; bookings: number; revenue: number }[] = []
  for (let i = 5; i >= 0; i--) {
    const monthDate = subMonths(new Date(), i)
    const monthStart = startOfMonth(monthDate)
    const monthEnd = endOfMonth(monthDate)
    const monthName = format(monthDate, "MMM")

    const monthBookings = allBookingsForCharts?.filter((b) => {
      const createdAt = new Date(b.created_at)
      return createdAt >= monthStart && createdAt <= monthEnd && b.status !== "cancelled"
    }) || []

    const monthRevenue = monthBookings.reduce((sum, b) => sum + (b.total_amount || 0), 0)

    monthlyData.push({
      month: monthName,
      bookings: monthBookings.length,
      revenue: monthRevenue,
    })
  }

  // Status breakdown for pie chart
  const statusData = [
    { name: "Pending", value: pendingBookings || 0, color: "#eab308" },
    { name: "Confirmed", value: confirmedBookings || 0, color: "#22c55e" },
    { name: "Completed", value: completedBookings || 0, color: "#3b82f6" },
    { name: "Cancelled", value: cancelledBookings || 0, color: "#ef4444" },
  ].filter((item) => item.value > 0)

  // Container type distribution
  const containerTypeMap = new Map<string, number>()
  allBookingsForCharts?.forEach((b) => {
    if (b.status !== "cancelled") {
      const containerName = containerTypes?.find((ct) => ct.id === b.container_type_id)?.name || "Unknown"
      containerTypeMap.set(containerName, (containerTypeMap.get(containerName) || 0) + 1)
    }
  })
  const containerData = Array.from(containerTypeMap.entries()).map(([name, value]) => ({
    name,
    value,
  }))

  // Calculate total revenue
  const totalRevenue = allBookingsForCharts
    ?.filter((b) => b.status !== "cancelled")
    .reduce((sum, b) => sum + (b.total_amount || 0), 0) || 0

  return (
    <AdminLayout user={user}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Overview of your container rental business</p>
      </div>

      <AdminStats
        totalBookings={totalBookings || 0}
        pendingBookings={pendingBookings || 0}
        totalUsers={totalUsers || 0}
        totalRevenue={totalRevenue}
        recentBookings={recentBookings || []}
        monthlyData={monthlyData}
        statusData={statusData}
        containerData={containerData}
      />
    </AdminLayout>
  )
}
