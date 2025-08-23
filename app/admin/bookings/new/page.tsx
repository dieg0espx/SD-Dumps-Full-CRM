import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminLayout } from "@/components/admin-layout"
import { AdminBookingForm } from "@/components/admin-booking-form"

export default async function AdminNewBookingPage() {
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

  // Fetch container types and users for the booking form
  const [{ data: containerTypes }, { data: users }] = await Promise.all([
    supabase.from("container_types").select("*").eq("is_hidden", false).order("name"),
    supabase.from("profiles").select("id, full_name, email, phone").order("full_name"),
  ])

  return (
    <AdminLayout user={user}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Booking</h1>
        <p className="text-gray-600">Create a booking on behalf of a customer</p>
      </div>

      <AdminBookingForm 
        containerTypes={containerTypes || []} 
        users={users || []} 
      />
    </AdminLayout>
  )
}
