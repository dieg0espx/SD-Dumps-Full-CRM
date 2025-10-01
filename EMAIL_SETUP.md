# Email Notification Setup

This project uses **Nodemailer** to send automated email notifications when new bookings are created.

## 📧 Email Features

### Automated Emails Sent:
1. **Client Confirmation Email** - Sent to the customer who made the booking
2. **Admin Notification Email** - Sent to the admin contact email

### When Emails Are Sent:
- ✅ When a client completes a booking through the booking form
- ✅ When an admin creates a booking through the admin panel
- ✅ After successful payment confirmation

## 🔧 Configuration

### Environment Variables Required

Add these variables to your `.env.local` file:

```env
# Email Configuration (Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=analytics@comcreate.org
SMTP_PASS=thyqqgesftzajyug
SMTP_FROM=analytics@comcreate.org
CONTACT_EMAIL=diego@comcreate.org

# App URL (for links in emails)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Gmail Setup (if using Gmail)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account → Security
   - Under "2-Step Verification", select "App passwords"
   - Generate a new app password for "Mail"
   - Use this password in `SMTP_PASS`

⚠️ **Important**: Never use your actual Gmail password. Always use an App Password.

## 📄 Email Templates

### Client Email Includes:
- Booking confirmation message
- Booking ID and details
- Container type and rental period
- Service type (pickup/delivery)
- Delivery address (if applicable)
- Total amount paid
- Next steps information
- Link to view bookings

### Admin Email Includes:
- New booking alert
- Customer information
- Booking details and schedule
- Action items checklist
- Link to manage booking in admin panel

## 🚀 How It Works

### 1. **Client Booking Flow**
```
Client submits booking → Payment processed → Booking created in database 
→ Email API called → Emails sent to client and admin
```

### 2. **Admin Booking Flow**
```
Admin creates booking → Payment processed → Booking confirmed 
→ Email API called → Emails sent to client and admin
```

## 📁 Files Involved

### Backend:
- `lib/email.ts` - Email configuration and templates
- `app/api/send-booking-email/route.ts` - API endpoint for sending emails

### Frontend:
- `components/booking-form.tsx` - Client booking form (calls email API)
- `components/admin-booking-form.tsx` - Admin booking form (calls email API)

## 🛠️ Testing

### Test Email Sending:

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Create a test booking**:
   - Go to `/booking` and complete a booking
   - OR go to `/admin/bookings/new` and create a booking as admin

3. **Check console logs**:
   - Look for `✅ Booking confirmation emails sent`
   - Check for any error messages

4. **Check email inboxes**:
   - Client email should receive confirmation
   - Admin email should receive notification

## 🔍 Troubleshooting

### Emails not sending?

1. **Check environment variables**:
   ```bash
   # Verify variables are set
   echo $SMTP_USER
   echo $CONTACT_EMAIL
   ```

2. **Check console logs**:
   - Look for email transporter verification message on server start
   - Check for email sending errors in API logs

3. **Verify SMTP credentials**:
   - Test your Gmail app password
   - Ensure 2FA is enabled
   - Check that SMTP_USER and SMTP_FROM match

4. **Check spam folder**:
   - Emails might be marked as spam initially
   - Add sender to contacts to whitelist

### Common Errors:

**"Invalid login"**:
- Using regular password instead of app password
- 2FA not enabled on Gmail account

**"Connection timeout"**:
- Firewall blocking SMTP port 587
- Check network/VPN settings

**"Authentication failed"**:
- Wrong username or password
- App password not generated correctly

## 🎨 Customizing Email Templates

Edit the templates in `lib/email.ts`:

- `generateClientEmail()` - Client confirmation template
- `generateAdminEmail()` - Admin notification template

Templates use inline HTML/CSS for maximum email client compatibility.

## 🔒 Security Notes

- ✅ Email sending happens server-side only (API route)
- ✅ SMTP credentials never exposed to client
- ✅ Email failures don't prevent booking completion
- ✅ All email operations are try-catch wrapped

## 📊 Monitoring

Check server logs for:
- `✅ Email server is ready to send messages` - On app start
- `✅ Client email sent to: [email]` - When client email sent
- `✅ Admin email sent to: [email]` - When admin email sent  
- `⚠️ Email sending failed (non-critical)` - If email fails

Email failures are logged but don't affect booking creation.

## 🚀 Production Deployment

For production:

1. Update `NEXT_PUBLIC_APP_URL` to your production domain
2. Consider using a professional email service (SendGrid, AWS SES, etc.)
3. Set up email monitoring and alerting
4. Test thoroughly before going live

## 📝 Notes

- Emails are sent asynchronously to avoid blocking the booking process
- Failed email sending won't prevent booking creation
- All emails use responsive HTML templates
- Templates include proper email metadata for better deliverability

