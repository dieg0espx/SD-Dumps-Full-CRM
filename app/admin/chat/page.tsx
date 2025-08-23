import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminLayout } from "@/components/admin-layout"
import { AdminChatManager } from "@/components/admin-chat-manager"

export default async function AdminChatPage() {
  const supabase = await createServerClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Check if user is admin
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile || profile.role !== "admin") {
    redirect("/booking")
  }

  return (
    <AdminLayout user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chat Management</h1>
          <p className="text-gray-600">Manage customer conversations and support requests</p>
        </div>
        <AdminChatManager user={user} />
      </div>
    </AdminLayout>
  )
}
