"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Package, Users, Clock } from "lucide-react"
import { format } from "date-fns"
import { BookingDetailsSidebar } from "./booking-details-sidebar"

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

interface AdminStatsProps {
  totalBookings: number
  pendingBookings: number
  totalUsers: number
  recentBookings: any[]
}

export function AdminStats({ totalBookings, pendingBookings, totalUsers, recentBookings }: AdminStatsProps) {
  const [selectedBooking, setSelectedBooking] = useState<any>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

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

  const handleBookingClick = (booking: any) => {
    setSelectedBooking(booking)
    setIsSidebarOpen(true)
  }

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false)
    setSelectedBooking(null)
  }

  return (
    <>
      <div className="space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalBookings}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Bookings</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingBookings}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Containers</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">22</div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>Latest booking requests and updates</CardDescription>
          </CardHeader>
          <CardContent>
            {recentBookings.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No recent bookings</p>
            ) : (
              <div className="space-y-4">
                {recentBookings.map((booking: any) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleBookingClick(booking)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-medium">
                            {booking.profiles?.full_name || booking.profiles?.email || "Unknown User"}
                          </p>
                          <p className="text-sm text-gray-600">
                            {booking.container_types?.name} - {booking.container_types?.size}
                          </p>
                          <p className="text-xs text-gray-500">
                            {format(new Date(booking.start_date), "MMM dd")} -{" "}
                            {format(new Date(booking.end_date), "MMM dd, yyyy")}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(booking.total_amount)}</p>
                        <p className="text-xs text-gray-500 capitalize">{booking.service_type}</p>
                      </div>
                      <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <BookingDetailsSidebar booking={selectedBooking} isOpen={isSidebarOpen} onClose={handleCloseSidebar} />
    </>
  )
}
