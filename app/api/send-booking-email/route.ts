import { NextRequest, NextResponse } from 'next/server'
import { sendBookingEmails } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.bookingId || !data.customerEmail || !data.customerName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Send emails
    await sendBookingEmails({
      bookingId: data.bookingId,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      containerType: data.containerType,
      startDate: data.startDate,
      endDate: data.endDate,
      serviceType: data.serviceType,
      totalAmount: data.totalAmount,
      deliveryAddress: data.deliveryAddress,
      pickupTime: data.pickupTime,
      notes: data.notes,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in send-booking-email API:', error)
    return NextResponse.json(
      { error: 'Failed to send emails' },
      { status: 500 }
    )
  }
}

