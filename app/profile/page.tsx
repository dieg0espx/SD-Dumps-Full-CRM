import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AuthHeader } from "@/components/auth-header"
import { ProfileForm } from "@/components/profile-form"

export default async function ProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch user profile with address fields
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, email, full_name, phone, company, street_address, city, state, zip_code, country, role, is_admin")
    .eq("id", user.id)
    .single()

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthHeader user={user} />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
            <p className="text-gray-600">Manage your account information</p>
          </div>
          <ProfileForm profile={profile} />
        </div>
      </div>
    </div>
  )
}
