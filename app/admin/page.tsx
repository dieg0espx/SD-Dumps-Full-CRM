import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminLayout } from "@/components/admin-layout"
import { AdminStats } from "@/components/admin-stats"

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
  const [{ count: totalBookings }, { count: pendingBookings }, { count: totalUsers }, { data: bookings }] =
    await Promise.all([
      supabase.from("bookings").select("*", { count: "exact", head: true }),
      supabase.from("bookings").select("*", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("bookings").select("*").order("created_at", { ascending: false }).limit(5),
    ])

  console.log("[v0] Admin dashboard - Total bookings:", totalBookings)
  console.log("[v0] Admin dashboard - Pending bookings:", pendingBookings)
  console.log("[v0] Admin dashboard - Total users:", totalUsers)
  console.log("[v0] Admin dashboard - Recent bookings:", bookings?.length || 0)

  let recentBookings = []
  if (bookings && bookings.length > 0) {
    const userIds = [...new Set(bookings.map((b) => b.user_id))]
    const containerTypeIds = [...new Set(bookings.map((b) => b.container_type_id))]

    const [{ data: profiles }, { data: containerTypes }] = await Promise.all([
      supabase.from("profiles").select("id, full_name, email").in("id", userIds),
      supabase.from("container_types").select("id, name, size").in("id", containerTypeIds),
    ])

    recentBookings = bookings.map((booking) => ({
      ...booking,
      profiles: profiles?.find((p) => p.id === booking.user_id) || null,
      container_types: containerTypes?.find((ct) => ct.id === booking.container_type_id) || null,
    }))
  }

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
        recentBookings={recentBookings || []}
      />
    </AdminLayout>
  )
}
