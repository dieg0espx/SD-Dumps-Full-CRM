import nodemailer from 'nodemailer'

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

// Verify connection
transporter.verify((error) => {
  if (error) {
    console.error('❌ Email transporter error:', error)
  } else {
    console.log('✅ Email server is ready to send messages')
  }
})

interface BookingEmailData {
  bookingId: string
  customerName: string
  customerEmail: string
  containerType: string
  startDate: string
  endDate: string
  serviceType: string
  totalAmount: number
  deliveryAddress?: string
  pickupTime?: string
  notes?: string
}

// Client email template
export function generateClientEmail(data: BookingEmailData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
    .card { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .card h2 { color: #2563eb; margin-top: 0; font-size: 20px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; }
    .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f3f4f6; }
    .detail-row:last-child { border-bottom: none; }
    .label { font-weight: bold; color: #6b7280; }
    .value { color: #111827; }
    .total { background: #eff6ff; padding: 15px; border-radius: 8px; font-size: 18px; font-weight: bold; color: #2563eb; text-align: center; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
    .button { display: inline-block; background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Booking Confirmed!</h1>
      <p style="margin: 10px 0 0 0; font-size: 16px;">Thank you for your order</p>
    </div>
    
    <div class="content">
      <p style="font-size: 16px; margin-top: 0;">Hi <strong>${data.customerName}</strong>,</p>
      <p>Your container rental has been successfully booked! Here are your booking details:</p>
      
      <div class="card">
        <h2>📦 Booking Information</h2>
        <div class="detail-row">
          <span class="label">Booking ID:</span>
          <span class="value">#${data.bookingId.slice(0, 8)}</span>
        </div>
        <div class="detail-row">
          <span class="label">Container Type:</span>
          <span class="value">${data.containerType}</span>
        </div>
        <div class="detail-row">
          <span class="label">Service Type:</span>
          <span class="value" style="text-transform: capitalize;">${data.serviceType}</span>
        </div>
        ${data.pickupTime ? `
        <div class="detail-row">
          <span class="label">Preferred Time:</span>
          <span class="value">${data.pickupTime}</span>
        </div>
        ` : ''}
      </div>
      
      <div class="card">
        <h2>📅 Rental Period</h2>
        <div class="detail-row">
          <span class="label">Start Date:</span>
          <span class="value">${data.startDate}</span>
        </div>
        <div class="detail-row">
          <span class="label">End Date:</span>
          <span class="value">${data.endDate}</span>
        </div>
        ${data.deliveryAddress ? `
        <div class="detail-row">
          <span class="label">Delivery Address:</span>
          <span class="value">${data.deliveryAddress}</span>
        </div>
        ` : ''}
      </div>
      
      ${data.notes ? `
      <div class="card">
        <h2>📝 Additional Notes</h2>
        <p style="margin: 0; color: #4b5563;">${data.notes}</p>
      </div>
      ` : ''}
      
      <div class="total">
        Total Amount: $${data.totalAmount.toFixed(2)}
      </div>
      
      <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 4px; margin: 20px 0;">
        <p style="margin: 0; color: #92400e;"><strong>⏰ What's Next?</strong></p>
        <p style="margin: 10px 0 0 0; color: #92400e;">
          Our team will contact you 24 hours before your scheduled ${data.serviceType === 'delivery' ? 'delivery' : 'pickup'} date to confirm the details.
        </p>
      </div>
      
      <p style="text-align: center; margin: 30px 0 10px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/bookings" class="button">View My Bookings</a>
      </p>
      
      <p style="color: #6b7280; font-size: 14px;">
        If you have any questions or need to make changes to your booking, please don't hesitate to contact us.
      </p>
    </div>
    
    <div class="footer">
      <p><strong>SD Dumps</strong></p>
      <p>Professional Waste Management Services</p>
      <p style="margin: 10px 0;">
        📧 ${process.env.SMTP_FROM} | 📞 Contact Us
      </p>
      <p style="font-size: 12px; color: #9ca3af;">
        This is an automated message. Please do not reply directly to this email.
      </p>
    </div>
  </div>
</body>
</html>
  `
}

// Admin email template
export function generateAdminEmail(data: BookingEmailData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
    .card { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .card h2 { color: #dc2626; margin-top: 0; font-size: 20px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; }
    .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f3f4f6; }
    .detail-row:last-child { border-bottom: none; }
    .label { font-weight: bold; color: #6b7280; }
    .value { color: #111827; }
    .alert { background: #fee2e2; border-left: 4px solid #dc2626; padding: 15px; border-radius: 4px; margin: 20px 0; color: #991b1b; }
    .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
    .button { display: inline-block; background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔔 New Booking Alert</h1>
      <p style="margin: 10px 0 0 0; font-size: 16px;">Action Required</p>
    </div>
    
    <div class="content">
      <div class="alert">
        <p style="margin: 0; font-weight: bold;">⚠️ A new booking has been created and requires your attention.</p>
      </div>
      
      <div class="card">
        <h2>📦 Booking Details</h2>
        <div class="detail-row">
          <span class="label">Booking ID:</span>
          <span class="value">#${data.bookingId.slice(0, 8)}</span>
        </div>
        <div class="detail-row">
          <span class="label">Status:</span>
          <span class="value" style="color: #059669; font-weight: bold;">CONFIRMED</span>
        </div>
        <div class="detail-row">
          <span class="label">Container Type:</span>
          <span class="value">${data.containerType}</span>
        </div>
        <div class="detail-row">
          <span class="label">Service Type:</span>
          <span class="value" style="text-transform: capitalize;">${data.serviceType}</span>
        </div>
        <div class="detail-row">
          <span class="label">Total Amount:</span>
          <span class="value" style="color: #059669; font-weight: bold;">$${data.totalAmount.toFixed(2)}</span>
        </div>
      </div>
      
      <div class="card">
        <h2>👤 Customer Information</h2>
        <div class="detail-row">
          <span class="label">Name:</span>
          <span class="value">${data.customerName}</span>
        </div>
        <div class="detail-row">
          <span class="label">Email:</span>
          <span class="value">${data.customerEmail}</span>
        </div>
      </div>
      
      <div class="card">
        <h2>📅 Schedule</h2>
        <div class="detail-row">
          <span class="label">Start Date:</span>
          <span class="value">${data.startDate}</span>
        </div>
        <div class="detail-row">
          <span class="label">End Date:</span>
          <span class="value">${data.endDate}</span>
        </div>
        ${data.pickupTime ? `
        <div class="detail-row">
          <span class="label">Preferred Time:</span>
          <span class="value">${data.pickupTime}</span>
        </div>
        ` : ''}
        ${data.deliveryAddress ? `
        <div class="detail-row">
          <span class="label">Delivery Address:</span>
          <span class="value">${data.deliveryAddress}</span>
        </div>
        ` : ''}
      </div>
      
      ${data.notes ? `
      <div class="card">
        <h2>📝 Customer Notes</h2>
        <p style="margin: 0; color: #4b5563; background: #f3f4f6; padding: 15px; border-radius: 6px;">${data.notes}</p>
      </div>
      ` : ''}
      
      <p style="text-align: center; margin: 30px 0 10px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin/bookings" class="button">Manage Booking</a>
      </p>
      
      <div style="background: #eff6ff; border-left: 4px solid #2563eb; padding: 15px; border-radius: 4px; margin: 20px 0;">
        <p style="margin: 0; color: #1e40af;"><strong>📋 Action Items:</strong></p>
        <ul style="margin: 10px 0; padding-left: 20px; color: #1e40af;">
          <li>Review booking details in the admin panel</li>
          <li>Confirm container availability</li>
          <li>Contact customer 24 hours before scheduled date</li>
          <li>Prepare ${data.serviceType === 'delivery' ? 'delivery logistics' : 'pickup instructions'}</li>
        </ul>
      </div>
    </div>
    
    <div class="footer">
      <p><strong>SD Dumps Admin Panel</strong></p>
      <p style="font-size: 12px; color: #9ca3af;">
        This is an automated notification from your booking system.
      </p>
    </div>
  </div>
</body>
</html>
  `
}

// Send booking confirmation emails
export async function sendBookingEmails(data: BookingEmailData) {
  try {
    // Send email to client
    await transporter.sendMail({
      from: `"SD Dumps" <${process.env.SMTP_FROM}>`,
      to: data.customerEmail,
      subject: `Booking Confirmed - Order #${data.bookingId.slice(0, 8)}`,
      html: generateClientEmail(data),
    })
    console.log('✅ Client email sent to:', data.customerEmail)

    // Send email to admin
    await transporter.sendMail({
      from: `"SD Dumps Notifications" <${process.env.SMTP_FROM}>`,
      to: process.env.CONTACT_EMAIL,
      subject: `🔔 New Booking Alert - #${data.bookingId.slice(0, 8)}`,
      html: generateAdminEmail(data),
    })
    console.log('✅ Admin email sent to:', process.env.CONTACT_EMAIL)

    return { success: true }
  } catch (error) {
    console.error('❌ Error sending booking emails:', error)
    throw error
  }
}

