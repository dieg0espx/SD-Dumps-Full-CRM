import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { sendPhoneBookingEmail } from "@/lib/email"
import { format, addDays } from "date-fns"

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
    const {
      customerName,
      customerEmail,
      customerPhone,
      containerTypeId,
      startDate,
      endDate,
      serviceType,
      pickupTime,
      customerAddress,
      deliveryAddress,
      totalAmount,
      extraTonnage,
      applianceCount,
      travelFee,
      notes,
      priceAdjustment,
      adjustmentReason,
    } = await request.json()

    // Validate required fields
    if (
      !customerName ||
      !customerEmail ||
      !customerPhone ||
      !containerTypeId ||
      !startDate ||
      !endDate ||
      !serviceType ||
      !customerAddress
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if customer already exists in profiles
    let userId: string
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", customerEmail)
      .single()

    if (existingProfile) {
      // Use existing user and update their phone if provided
      userId = existingProfile.id

      // Update profile with latest info (name and phone)
      await supabase
        .from("profiles")
        .update({
          full_name: customerName,
          phone: customerPhone,
        })
        .eq("id", userId)
    } else {
      // Use the guest user account for customers without profiles
      // This ensures all bookings have a valid user_id while storing
      // actual customer info in payment_links table
      userId = "89d3eafa-13e8-4a69-8c41-863d9e905553" // Guest User account
    }

    // Create the booking with 'pending' status (awaiting card to be saved)
    // We use payment_method_id being null to indicate it's awaiting card
    let notesWithFlag = notes || ""

    // Add travel fee info to notes if applicable
    if (travelFee && travelFee > 0) {
      const travelFeeText = `[Travel Fee: $${travelFee}]`
      notesWithFlag = notesWithFlag ? `${notesWithFlag}\n\n${travelFeeText}` : travelFeeText
    }

    // Add price adjustment info to notes if applicable
    if (priceAdjustment && priceAdjustment !== 0) {
      const adjustmentType = priceAdjustment < 0 ? "Discount" : "Additional Charge"
      const adjustmentText = `[${adjustmentType}: $${Math.abs(priceAdjustment)}${adjustmentReason ? ` - ${adjustmentReason}` : ""}]`
      notesWithFlag = notesWithFlag ? `${notesWithFlag}\n\n${adjustmentText}` : adjustmentText
    }

    notesWithFlag = notesWithFlag ? `${notesWithFlag}\n\n[PHONE BOOKING - Awaiting card]` : "[PHONE BOOKING - Awaiting card]"

    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert({
        user_id: userId,
        container_type_id: containerTypeId,
        start_date: startDate,
        end_date: endDate,
        service_type: serviceType,
        pickup_time: pickupTime,
        customer_address: customerAddress,
        delivery_address: deliveryAddress || null,
        total_amount: totalAmount,
        travel_fee: travelFee || null,
        price_adjustment: priceAdjustment || null,
        adjustment_reason: priceAdjustment ? (adjustmentReason || null) : null,
        notes: notesWithFlag,
        status: "pending",
        payment_status: "pending",
        payment_method_id: null,
      })
      .select()
      .single()

    if (bookingError) {
      console.error("Error creating booking:", bookingError)
      return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
    }

    // If using guest account, store customer info in phone_booking_guests table
    if (userId === "89d3eafa-13e8-4a69-8c41-863d9e905553") {
      const { error: guestError } = await supabase
        .from("phone_booking_guests")
        .insert({
          booking_id: booking.id,
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          customer_address: customerAddress,
        })

      if (guestError) {
        console.error("Error storing guest info:", guestError)
        // Rollback booking
        await supabase.from("bookings").delete().eq("id", booking.id)
        return NextResponse.json({ error: "Failed to store customer information" }, { status: 500 })
      }
    }

    // Calculate expiration date (7 days from now)
    const expiresAt = addDays(new Date(), 7)

    // Create payment link entry
    const { data: paymentLink, error: linkError } = await supabase
      .from("payment_links")
      .insert({
        booking_id: booking.id,
        customer_email: customerEmail,
        customer_name: customerName,
        customer_phone: customerPhone,
        expires_at: expiresAt.toISOString(),
        status: "pending",
      })
      .select()
      .single()

    if (linkError) {
      console.error("Error creating payment link:", linkError)
      // Rollback booking
      await supabase.from("bookings").delete().eq("id", booking.id)
      return NextResponse.json({ error: "Failed to create payment link" }, { status: 500 })
    }

    // Get container type info for email
    const { data: containerType } = await supabase
      .from("container_types")
      .select("name")
      .eq("id", containerTypeId)
      .single()

    // Generate payment link URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.sddumpingsolutions.com"
    const paymentUrl = `${baseUrl}/payment/${paymentLink.token}`

    // Send email to customer
    try {
      await sendPhoneBookingEmail({
        customerName,
        customerEmail,
        paymentLink: paymentUrl,
        containerType: containerType?.name || "Container",
        startDate: format(parseLocalDate(startDate), "PPP"),
        endDate: format(parseLocalDate(endDate), "PPP"),
        totalAmount,
        expiresAt: format(expiresAt, "PPP"),
      })
    } catch (emailError) {
      console.error("Error sending email:", emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      bookingId: booking.id,
      paymentLink: paymentUrl,
      expiresAt: expiresAt.toISOString(),
    })
  } catch (error) {
    console.error("Error in create-phone-booking:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
