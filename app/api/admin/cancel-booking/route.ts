import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { sendCancellationEmail } from "@/lib/email"
import { format } from "date-fns"

// Parse date string (YYYY-MM-DD) to local date to avoid timezone issues
const parseLocalDate = (dateStr: string) => {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day)
}

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

    // Parse request body
    const { bookingId, reason } = await request.json()

    if (!bookingId) {
      return NextResponse.json({ error: "Booking ID is required" }, { status: 400 })
    }

    // Get booking details with container type
    const { data: booking, error: fetchError } = await supabase
      .from("bookings")
      .select(`
        *,
        container_types (name)
      `)
      .eq("id", bookingId)
      .single()

    if (fetchError || !booking) {
      console.error("Error fetching booking:", fetchError)
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    // Get profile info separately
    let profileData = null
    if (booking.user_id) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, email")
        .eq("id", booking.user_id)
        .single()
      profileData = profile
    }

    // Check if booking is already cancelled
    if (booking.status === "cancelled") {
      return NextResponse.json({ error: "Booking is already cancelled" }, { status: 400 })
    }

    // Update booking status to cancelled
    const { error: updateError } = await supabase
      .from("bookings")
      .update({
        status: "cancelled",
        notes: booking.notes
          ? `${booking.notes}\n\n[CANCELLED${reason ? ` - ${reason}` : ''}]`
          : `[CANCELLED${reason ? ` - ${reason}` : ''}]`
      })
      .eq("id", bookingId)

    if (updateError) {
      console.error("Error cancelling booking:", updateError)
      return NextResponse.json({ error: "Failed to cancel booking" }, { status: 500 })
    }

    // Get customer email - check phone_booking_guests first, then profiles
    let customerEmail = profileData?.email
    let customerName = profileData?.full_name

    // Check if this is a phone booking with guest info
    const { data: guestInfo } = await supabase
      .from("phone_booking_guests")
      .select("customer_email, customer_name")
      .eq("booking_id", bookingId)
      .single()

    if (guestInfo) {
      customerEmail = guestInfo.customer_email
      customerName = guestInfo.customer_name
    }

    // Send cancellation email if we have customer email
    if (customerEmail) {
      try {
        await sendCancellationEmail({
          customerName: customerName || "Valued Customer",
          customerEmail,
          bookingId: booking.id,
          containerType: booking.container_types?.name || "Container",
          startDate: format(parseLocalDate(booking.start_date), "MMMM d, yyyy"),
          endDate: format(parseLocalDate(booking.end_date), "MMMM d, yyyy"),
          reason,
        })
      } catch (emailError) {
        console.error("Error sending cancellation email:", emailError)
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({
      success: true,
      message: "Booking cancelled successfully",
      emailSent: !!customerEmail,
    })
  } catch (error) {
    console.error("Error in cancel-booking:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
