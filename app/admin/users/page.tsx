import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminLayout } from "@/components/admin-layout"
import { UserManager } from "@/components/user-manager"

export default async function AdminUsersPage() {
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

  // Fetch all users with their profiles
  const { data: users } = await supabase.from("profiles").select("*").order("created_at", { ascending: false })

  // Get booking counts for each user
  const { data: bookingCounts } = await supabase.from("bookings").select("user_id")

  // Combine the data
  const usersWithBookings =
    users?.map((user) => ({
      ...user,
      bookingCount: bookingCounts?.filter((booking) => booking.user_id === user.id).length || 0,
    })) || []

  return (
    <AdminLayout user={user}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
        <p className="text-gray-600">Manage user accounts and permissions</p>
      </div>

      <UserManager users={usersWithBookings} />
    </AdminLayout>
  )
}
