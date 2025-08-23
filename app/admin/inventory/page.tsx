import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminLayout } from "@/components/admin-layout"
import { InventoryManager } from "@/components/inventory-manager"

export default async function AdminInventoryPage() {
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

  // Fetch container types
  const { data: containerTypes } = await supabase
    .from("container_types")
    .select("*")
    .eq("is_hidden", false)
    .order("name")

  return (
    <AdminLayout user={user}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Inventory Management</h1>
        <p className="text-gray-600">Manage container types and availability</p>
      </div>

      <InventoryManager containerTypes={containerTypes || []} />
    </AdminLayout>
  )
}
