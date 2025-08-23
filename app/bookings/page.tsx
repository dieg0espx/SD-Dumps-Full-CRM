import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AuthHeader } from "@/components/auth-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export default async function BookingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch user's bookings with container type information
  const { data: bookings } = await supabase
    .from("bookings")
    .select(`
      *,
      container_types (
        name,
        size,
        description
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthHeader user={user} />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
            <p className="text-gray-600">View and manage your container rental bookings</p>
          </div>

          {!bookings || bookings.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500 mb-4">You haven't made any bookings yet.</p>
                <a
                  href="/booking"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  Make Your First Booking
                </a>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {bookings.map((booking: any) => (
                <Card key={booking.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          {booking.container_types.name} - {booking.container_types.size}
                        </CardTitle>
                        <CardDescription>Booking #{booking.id.slice(0, 8)}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                        <Badge className={getPaymentStatusColor(booking.payment_status)}>
                          {booking.payment_status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Rental Details</h4>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Start Date:</span>{" "}
                            {format(new Date(booking.start_date), "PPP")}
                          </div>
                          <div>
                            <span className="font-medium">End Date:</span> {format(new Date(booking.end_date), "PPP")}
                          </div>
                          <div>
                            <span className="font-medium">Service:</span>{" "}
                            <span className="capitalize">{booking.service_type}</span>
                          </div>
                          {booking.pickup_time && (
                            <div>
                              <span className="font-medium">Time:</span> {booking.pickup_time}
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Payment</h4>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Total Amount:</span> {formatCurrency(booking.total_amount)}
                          </div>
                          <div>
                            <span className="font-medium">Booked:</span> {format(new Date(booking.created_at), "PPP")}
                          </div>
                        </div>
                      </div>
                    </div>
                    {booking.delivery_address && (
                      <div className="mt-4">
                        <h4 className="font-medium text-gray-900 mb-2">Delivery Address</h4>
                        <p className="text-sm text-gray-600">{booking.delivery_address}</p>
                      </div>
                    )}
                    {booking.notes && (
                      <div className="mt-4">
                        <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
                        <p className="text-sm text-gray-600">{booking.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
