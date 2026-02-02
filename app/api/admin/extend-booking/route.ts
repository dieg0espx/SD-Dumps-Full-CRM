import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { sendBookingExtensionEmail } from "@/lib/email"
import { format, differenceInDays } from "date-fns"

// Parse date string (YYYY-MM-DD) to local date to avoid timezone issues
const parseLocalDate = (dateStr: string) => {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day)
}

// Format date to YYYY-MM-DD for database storage
const formatDateLocal = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
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
    const { bookingId, newEndDate } = await request.json()

    if (!bookingId) {
      return NextResponse.json({ error: "Booking ID is required" }, { status: 400 })
    }

    if (!newEndDate) {
      return NextResponse.json({ error: "New end date is required" }, { status: 400 })
    }

    // Get booking details with container type
    const { data: booking, error: fetchError } = await supabase
      .from("bookings")
      .select(`
        *,
        container_types (name, price_per_day)
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

    // Check if booking is cancelled or completed
    if (booking.status === "cancelled") {
      return NextResponse.json({ error: "Cannot extend a cancelled booking" }, { status: 400 })
    }

    if (booking.status === "completed") {
      return NextResponse.json({ error: "Cannot extend a completed booking" }, { status: 400 })
    }

    // Parse dates
    const currentEndDate = parseLocalDate(booking.end_date)
    const newEnd = parseLocalDate(newEndDate)
    const startDate = parseLocalDate(booking.start_date)

    // Validate new end date is after current end date
    if (newEnd <= currentEndDate) {
      return NextResponse.json({
        error: "New end date must be after the current end date"
      }, { status: 400 })
    }

    // Validate new end date is after start date
    if (newEnd <= startDate) {
      return NextResponse.json({
        error: "New end date must be after the start date"
      }, { status: 400 })
    }

    // Calculate additional days
    const additionalDays = differenceInDays(newEnd, currentEndDate)
    const extraDayRate = 25 // $25 per extra day
    const additionalCost = additionalDays * extraDayRate

    // Calculate new total days
    const newTotalDays = differenceInDays(newEnd, startDate) + 1

    // Update pricing breakdown if it exists
    let updatedPricingBreakdown = booking.pricing_breakdown
    if (updatedPricingBreakdown) {
      const includedDays = updatedPricingBreakdown.includedDays || 3
      const newExtraDays = Math.max(0, newTotalDays - includedDays)
      const newExtraDaysAmount = newExtraDays * extraDayRate

      updatedPricingBreakdown = {
        ...updatedPricingBreakdown,
        totalDays: newTotalDays,
        extraDays: newExtraDays,
        extraDaysAmount: newExtraDaysAmount,
        total: updatedPricingBreakdown.basePrice +
               newExtraDaysAmount +
               (updatedPricingBreakdown.extraTonnageAmount || 0) +
               (updatedPricingBreakdown.applianceAmount || 0) +
               (updatedPricingBreakdown.distanceFee || 0) +
               (updatedPricingBreakdown.travelFee || 0) +
               (updatedPricingBreakdown.priceAdjustment || 0)
      }
    }

    // Calculate new total amount
    const newTotalAmount = updatedPricingBreakdown
      ? updatedPricingBreakdown.total
      : booking.total_amount + additionalCost

    // Update booking with new end date and pricing
    const updateData: any = {
      end_date: newEndDate,
      total_amount: newTotalAmount,
      notes: booking.notes
        ? `${booking.notes}\n\n[EXTENDED - End date changed from ${format(currentEndDate, "MMM dd, yyyy")} to ${format(newEnd, "MMM dd, yyyy")} (+${additionalDays} days, +$${additionalCost})]`
        : `[EXTENDED - End date changed from ${format(currentEndDate, "MMM dd, yyyy")} to ${format(newEnd, "MMM dd, yyyy")} (+${additionalDays} days, +$${additionalCost})]`
    }

    if (updatedPricingBreakdown) {
      updateData.pricing_breakdown = updatedPricingBreakdown
    }

    const { error: updateError } = await supabase
      .from("bookings")
      .update(updateData)
      .eq("id", bookingId)

    if (updateError) {
      console.error("Error extending booking:", updateError)
      return NextResponse.json({ error: "Failed to extend booking" }, { status: 500 })
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

    // Send extension email if we have customer email
    let emailSent = false
    if (customerEmail) {
      try {
        await sendBookingExtensionEmail({
          customerName: customerName || "Valued Customer",
          customerEmail,
          bookingId: booking.id,
          containerType: booking.container_types?.name || "Container",
          startDate: format(startDate, "MMMM d, yyyy"),
          previousEndDate: format(currentEndDate, "MMMM d, yyyy"),
          newEndDate: format(newEnd, "MMMM d, yyyy"),
          additionalDays,
          additionalCost,
          newTotalAmount,
        })
        emailSent = true
      } catch (emailError) {
        console.error("Error sending extension email:", emailError)
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({
      success: true,
      message: "Booking extended successfully",
      emailSent,
      additionalDays,
      additionalCost,
      newTotalAmount,
      newEndDate,
    })
  } catch (error) {
    console.error("Error in extend-booking:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
