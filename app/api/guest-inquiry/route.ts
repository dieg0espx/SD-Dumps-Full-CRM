import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { sendGuestInquiryEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      customerName,
      customerEmail,
      phone,
      containerTypeId,
      startDate,
      endDate,
      serviceType,
      deliveryAddress,
      notes,
    } = body || {}

    if (!customerName || !customerEmail || !containerTypeId || !startDate || !endDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: container } = await supabase
      .from("container_types")
      .select("name, size")
      .eq("id", containerTypeId)
      .single()

    await sendGuestInquiryEmail({
      customerName,
      customerEmail,
      phone: phone || null,
      containerType: container ? `${container.name}${container.size ? ` - ${container.size}` : ""}` : "Unknown",
      startDate,
      endDate,
      serviceType,
      deliveryAddress: deliveryAddress || null,
      notes: notes || null,
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Server error" }, { status: 500 })
  }
}


