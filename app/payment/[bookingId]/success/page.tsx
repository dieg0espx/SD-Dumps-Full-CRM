import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AuthHeader } from "@/components/auth-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Calendar, MapPin, Truck } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

interface PaymentSuccessPageProps {
  params: {
    bookingId: string
  }
}

export default async function PaymentSuccessPage({ params }: PaymentSuccessPageProps) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch booking details with payment info
  const { data: booking } = await supabase
    .from("bookings")
    .select(`
      *,
      container_types (
        name,
        size,
        description
      ),
      payments (
        transaction_id,
        payment_method,
        created_at
      )
    `)
    .eq("id", params.bookingId)
    .eq("user_id", user.id)
    .single()

  if (!booking || booking.payment_status !== "paid") {
    redirect("/bookings")
  }

  const payment = booking.payments?.[0]

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthHeader user={user} />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
            <p className="text-gray-600">Your container rental has been confirmed</p>
          </div>

          <div className="space-y-6">
            {/* Booking Confirmation */}
            <Card>
              <CardHeader>
                <CardTitle>Booking Confirmation</CardTitle>
                <CardDescription>Booking #{booking.id.slice(0, 8)}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium">Rental Period</p>
                      <p className="text-sm text-gray-600">
                        {format(new Date(booking.start_date), "EEEE, MMMM dd, yyyy")} -{" "}
                        {format(new Date(booking.end_date), "EEEE, MMMM dd, yyyy")}
                      </p>
                      {booking.pickup_time && (
                        <p className="text-sm text-gray-600">Preferred time: {booking.pickup_time}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Truck className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium">Container & Service</p>
                      <p className="text-sm text-gray-600">
                        {booking.container_types.name} - {booking.container_types.size}
                      </p>
                      <p className="text-sm text-gray-600 capitalize">{booking.service_type} service</p>
                    </div>
                  </div>

                  {booking.delivery_address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="font-medium">Delivery Address</p>
                        <p className="text-sm text-gray-600">{booking.delivery_address}</p>
                      </div>
                    </div>
                  )}

                  {booking.notes && (
                    <div>
                      <p className="font-medium">Special Instructions</p>
                      <p className="text-sm text-gray-600">{booking.notes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Payment Details */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Amount Paid:</span>
                    <span className="font-semibold">{formatCurrency(booking.total_amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Method:</span>
                    <span className="capitalize">{payment?.payment_method?.replace("_", " ")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transaction ID:</span>
                    <span className="font-mono text-sm">{payment?.transaction_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Date:</span>
                    <span>{payment?.created_at ? format(new Date(payment.created_at), "PPP") : "N/A"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle>What's Next?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-gray-600">
                  <p>✅ Your booking has been confirmed and payment processed</p>
                  <p>📧 You'll receive a confirmation email with all the details</p>
                  <p>📞 Our team will contact you 24 hours before your scheduled date</p>
                  {booking.service_type === "delivery" ? (
                    <p>🚚 We'll deliver the container to your specified address</p>
                  ) : (
                    <p>🏢 Please visit our location to pick up your container</p>
                  )}
                  <p>📱 You can track your booking status in your account</p>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Link href="/bookings" className="flex-1">
                <Button variant="outline" className="w-full bg-transparent">
                  View All Bookings
                </Button>
              </Link>
              <Link href="/booking" className="flex-1">
                <Button className="w-full">Book Another Container</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
