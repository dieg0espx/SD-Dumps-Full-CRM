import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { sendPhoneBookingEmail } from "@/lib/email"
import { format, addDays } from "date-fns"

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
      notes,
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

    // Check if customer already exists
    let userId: string
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", customerEmail)
      .single()

    if (existingProfile) {
      // Use existing user
      userId = existingProfile.id
    } else {
      // Create a guest user profile (without auth account)
      // We'll create a placeholder profile that can be linked later if they sign up
      const guestId = crypto.randomUUID()

      const { data: newProfile, error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: guestId,
          email: customerEmail,
          full_name: customerName,
          phone: customerPhone,
          role: "guest",
        })
        .select()
        .single()

      if (profileError) {
        console.error("Error creating guest profile:", profileError)
        return NextResponse.json({ error: "Failed to create customer profile" }, { status: 500 })
      }

      userId = guestId
    }

    // Create the booking with 'awaiting_card' status
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
        extra_tonnage: extraTonnage || null,
        appliance_count: applianceCount || null,
        notes: notes || null,
        status: "awaiting_card",
        payment_status: "pending",
        payment_method_id: null,
      })
      .select()
      .single()

    if (bookingError) {
      console.error("Error creating booking:", bookingError)
      return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
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
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const paymentUrl = `${baseUrl}/payment/${paymentLink.token}`

    // Send email to customer
    try {
      await sendPhoneBookingEmail({
        customerName,
        customerEmail,
        paymentLink: paymentUrl,
        containerType: containerType?.name || "Container",
        startDate: format(new Date(startDate), "PPP"),
        endDate: format(new Date(endDate), "PPP"),
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
