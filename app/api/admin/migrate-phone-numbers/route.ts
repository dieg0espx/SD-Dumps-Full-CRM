import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, is_admin")
      .eq("id", user.id)
      .single()

    if (!profile || (profile.role !== "admin" && !profile.is_admin)) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    // Fetch all payment links with phone numbers
    const { data: paymentLinks, error: linksError } = await supabase
      .from("payment_links")
      .select("customer_email, customer_phone")
      .not("customer_phone", "is", null)

    if (linksError) {
      console.error("Error fetching payment links:", linksError)
      return NextResponse.json({ error: "Failed to fetch payment links" }, { status: 500 })
    }

    let updatedCount = 0
    const errors: string[] = []

    // Update each profile with the phone number from payment_links
    for (const link of paymentLinks || []) {
      if (!link.customer_phone || !link.customer_email) continue

      // Check if profile exists and needs update
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("id, phone")
        .eq("email", link.customer_email)
        .single()

      if (existingProfile && (!existingProfile.phone || existingProfile.phone === "")) {
        // Update profile with phone number
        const { error: updateError } = await supabase
          .from("profiles")
          .update({ phone: link.customer_phone })
          .eq("id", existingProfile.id)

        if (updateError) {
          console.error(`Error updating profile ${existingProfile.id}:`, updateError)
          errors.push(`${link.customer_email}: ${updateError.message}`)
        } else {
          updatedCount++
          console.log(`✅ Updated phone for ${link.customer_email}`)
        }
      }
    }

    return NextResponse.json({
      success: true,
      updatedCount,
      totalChecked: paymentLinks?.length || 0,
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (error) {
    console.error("Error in migrate-phone-numbers:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
