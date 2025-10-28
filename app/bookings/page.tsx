"use client"

import { createClient } from "@/lib/supabase/client"
import { redirect } from "next/navigation"
import { AuthHeader } from "@/components/auth-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { format } from "date-fns"
import { Calendar, Eye } from "lucide-react"
import { useState, useEffect } from "react"

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function BookingsPage() {
  const [user, setUser] = useState<any>(null)
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showBookingDialog, setShowBookingDialog] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        redirect("/auth/login")
        return
      }

      setUser(user)

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

      setBookings(bookings || [])
      setLoading(false)
    }

    checkAuth()
  }, [])

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

  const handleOpenBookingDialog = (booking: any) => {
    setSelectedBooking(booking)
    setShowBookingDialog(true)
  }

  const handleCloseBookingDialog = () => {
    setShowBookingDialog(false)
    setSelectedBooking(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    )
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
                <Card 
                  key={booking.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow duration-200"
                  onClick={() => handleOpenBookingDialog(booking)}
                >
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
                    
                    {/* Click indicator */}
                    <div className="mt-4 flex justify-end">
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        Click to view details
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* My Bookings Dialog */}
      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-600" />
              My Bookings
            </DialogTitle>
            <DialogDescription>
              Complete booking information and status
            </DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-6">
              {/* Booking Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Booking Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Container Type:</span>
                    <p className="text-gray-900">{selectedBooking.container_types?.name || "N/A"}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Size:</span>
                    <p className="text-gray-900">{selectedBooking.container_types?.size || "N/A"}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Description:</span>
                    <p className="text-gray-900">{selectedBooking.container_types?.description || "N/A"}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Service Type:</span>
                    <p className="text-gray-900">{selectedBooking.service_type || "N/A"}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Start Date:</span>
                    <p className="text-gray-900">
                      {selectedBooking.start_date 
                        ? format(new Date(selectedBooking.start_date), "MMMM do, yyyy")
                        : "N/A"
                      }
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">End Date:</span>
                    <p className="text-gray-900">
                      {selectedBooking.end_date 
                        ? format(new Date(selectedBooking.end_date), "MMMM do, yyyy")
                        : "N/A"
                      }
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Pickup Time:</span>
                    <p className="text-gray-900">{selectedBooking.pickup_time || "N/A"}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Status:</span>
                    <p className="text-gray-900">{selectedBooking.status || "N/A"}</p>
                  </div>
                  <div className="md:col-span-2">
                    <span className="font-medium text-gray-700">Delivery Address:</span>
                    <p className="text-gray-900">{selectedBooking.delivery_address || "N/A"}</p>
                  </div>
                  <div className="md:col-span-2">
                    <span className="font-medium text-gray-700">Notes:</span>
                    <p className="text-gray-900">{selectedBooking.notes || "No notes"}</p>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Payment Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Total Amount:</span>
                    <p className="text-gray-900 font-semibold">{formatCurrency(selectedBooking.total_amount || 0)}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Payment Status:</span>
                    <p className="text-gray-900">{selectedBooking.payment_status || "N/A"}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Booking ID:</span>
                    <p className="text-gray-900 font-mono text-xs">{selectedBooking.id}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Created:</span>
                    <p className="text-gray-900">
                      {selectedBooking.created_at 
                        ? format(new Date(selectedBooking.created_at), "MMMM do, yyyy 'at' h:mm a")
                        : "N/A"
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              onClick={handleCloseBookingDialog}
              className="w-full sm:w-auto"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}