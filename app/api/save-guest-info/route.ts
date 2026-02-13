import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"

// Use service role client to bypass RLS (guests aren't authenticated)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { bookingId, customerName, customerEmail, customerPhone, customerAddress } = await request.json()

    if (!bookingId) {
      return NextResponse.json({ error: "Missing booking ID" }, { status: 400 })
    }

    const { error } = await supabase
      .from("phone_booking_guests")
      .insert({
        booking_id: bookingId,
        customer_name: customerName || "Guest",
        customer_email: customerEmail || "",
        customer_phone: customerPhone || "",
        customer_address: customerAddress || "",
      })

    if (error) {
      console.error("❌ [Save Guest Info] Failed to save guest info:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log("✅ [Save Guest Info] Guest info saved for booking:", bookingId)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("❌ [Save Guest Info] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
