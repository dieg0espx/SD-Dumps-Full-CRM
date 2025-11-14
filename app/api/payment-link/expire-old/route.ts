import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    // Optional: Add authentication for cron job
    // const authHeader = request.headers.get("authorization")
    // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // }

    const supabase = await createClient()
    const now = new Date().toISOString()

    // Find all pending payment links that have expired
    const { data: expiredLinks, error: fetchError } = await supabase
      .from("payment_links")
      .select("id, booking_id, token")
      .eq("status", "pending")
      .lt("expires_at", now)

    if (fetchError) {
      console.error("Error fetching expired links:", fetchError)
      return NextResponse.json({ error: "Failed to fetch expired links" }, { status: 500 })
    }

    if (!expiredLinks || expiredLinks.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No expired links found",
        expiredCount: 0,
      })
    }

    console.log(`Found ${expiredLinks.length} expired payment links`)

    // Update payment links to expired status
    const { error: linkUpdateError } = await supabase
      .from("payment_links")
      .update({
        status: "expired",
        updated_at: now,
      })
      .eq("status", "pending")
      .lt("expires_at", now)

    if (linkUpdateError) {
      console.error("Error updating payment links:", linkUpdateError)
      return NextResponse.json({ error: "Failed to update payment links" }, { status: 500 })
    }

    // Get booking IDs to cancel
    const bookingIds = expiredLinks.map((link) => link.booking_id)

    // Cancel bookings that have awaiting_card status
    const { error: bookingUpdateError } = await supabase
      .from("bookings")
      .update({
        status: "cancelled",
        payment_status: "failed",
        notes: "Cancelled - Payment link expired without completion",
        updated_at: now,
      })
      .in("id", bookingIds)
      .eq("status", "awaiting_card")

    if (bookingUpdateError) {
      console.error("Error updating bookings:", bookingUpdateError)
      // Don't fail the request if booking update fails
    }

    console.log(`✅ Expired ${expiredLinks.length} payment links and cancelled associated bookings`)

    return NextResponse.json({
      success: true,
      message: `Expired ${expiredLinks.length} payment links`,
      expiredCount: expiredLinks.length,
      expiredLinks: expiredLinks.map((link) => ({
        id: link.id,
        token: link.token,
        bookingId: link.booking_id,
      })),
    })
  } catch (error) {
    console.error("Error expiring payment links:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// Also support GET for easy testing
export async function GET(request: Request) {
  return POST(request)
}
