import { NextRequest, NextResponse } from 'next/server'
import { sendBookingEmails } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    console.log('📨 Booking email API called')
    const data = await request.json()
    console.log('📋 Email data received:', {
      bookingId: data.bookingId,
      customerEmail: data.customerEmail,
      customerName: data.customerName,
      hasAllFields: !!(data.bookingId && data.customerEmail && data.customerName)
    })

    // Validate required fields
    if (!data.bookingId || !data.customerEmail || !data.customerName) {
      console.error('❌ Missing required fields:', {
        hasBookingId: !!data.bookingId,
        hasCustomerEmail: !!data.customerEmail,
        hasCustomerName: !!data.customerName
      })
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Send emails
    console.log('📧 Calling sendBookingEmails function...')
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

    console.log('✅ Booking emails sent successfully!')
    return NextResponse.json({ 
      success: true,
      message: 'Booking confirmation emails sent successfully',
      sentTo: {
        customer: data.customerEmail,
        admin: process.env.CONTACT_EMAIL
      }
    })
  } catch (error) {
    console.error('❌ Error in send-booking-email API:', error)
    return NextResponse.json(
      { 
        error: 'Failed to send emails',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

