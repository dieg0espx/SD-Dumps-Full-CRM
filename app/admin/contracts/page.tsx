import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminLayout } from "@/components/admin-layout"
import { ContractsManager } from "@/components/contracts-manager"

export default async function AdminContractsPage() {
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

  // Fetch bookings with signatures directly
  const { data: bookings, error: bookingsError } = await supabase
    .from("bookings")
    .select("*")
    .not("signature_img_url", "is", null)
    .neq("signature_img_url", "")
    .order("created_at", { ascending: false })

  // Debug: Log the data
  console.log("Bookings with signatures:", bookings)
  console.log("Bookings error:", bookingsError)

  let enrichedBookings: any[] = []
  if (bookings && bookings.length > 0) {
    const userIds = [...new Set(bookings.map((b) => b.user_id))]
    const containerTypeIds = [...new Set(bookings.map((b) => b.container_type_id))]

    const [{ data: profiles }, { data: containerTypes }] = await Promise.all([
      supabase.from("profiles").select("id, full_name, email, phone").in("id", userIds),
      supabase.from("container_types").select("id, name, size").in("id", containerTypeIds),
    ])

    enrichedBookings = bookings.map((booking) => ({
      ...booking,
      profiles: profiles?.find((p) => p.id === booking.user_id) || null,
      container_types: containerTypes?.find((ct) => ct.id === booking.container_type_id) || null,
    }))
  }

  return (
    <AdminLayout user={user}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Contracts</h1>
        <p className="text-gray-600">View and manage signed contracts</p>
      </div>

      <ContractsManager bookings={enrichedBookings || []} />
    </AdminLayout>
  )
}
