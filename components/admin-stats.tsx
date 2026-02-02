"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Package, Users, Clock, DollarSign, TrendingUp } from "lucide-react"
import { format } from "date-fns"
import { BookingDetailsSidebar } from "./booking-details-sidebar"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Legend,
} from "recharts"

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

const COLORS = ["#eab308", "#22c55e", "#3b82f6", "#ef4444", "#8b5cf6", "#ec4899"]

interface AdminStatsProps {
  totalBookings: number
  pendingBookings: number
  totalUsers: number
  totalRevenue: number
  recentBookings: any[]
  monthlyData: { month: string; bookings: number; revenue: number }[]
  statusData: { name: string; value: number; color: string }[]
  containerData: { name: string; value: number }[]
}

export function AdminStats({
  totalBookings,
  pendingBookings,
  totalUsers,
  totalRevenue,
  recentBookings,
  monthlyData,
  statusData,
  containerData,
}: AdminStatsProps) {
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

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.name === "revenue" ? formatCurrency(entry.value) : entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
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
              <p className="text-xs text-muted-foreground mt-1">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Bookings</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{pendingBookings}</div>
              <p className="text-xs text-muted-foreground mt-1">Awaiting confirmation</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenue)}</div>
              <p className="text-xs text-muted-foreground mt-1">Last 6 months</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground mt-1">Registered accounts</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1: Bookings & Revenue Over Time */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Bookings Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                Monthly Bookings
              </CardTitle>
              <CardDescription>Number of bookings over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="bookings" fill="#3b82f6" radius={[4, 4, 0, 0]} name="bookings" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-500" />
                Monthly Revenue
              </CardTitle>
              <CardDescription>Revenue trends over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      formatter={(value: number) => [formatCurrency(value), "Revenue"]}
                      labelStyle={{ fontWeight: "bold" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#22c55e"
                      fill="#22c55e"
                      fillOpacity={0.2}
                      strokeWidth={2}
                      name="revenue"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2: Status & Container Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Booking Status Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Status Distribution</CardTitle>
              <CardDescription>Current status of all bookings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {statusData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number, name: string) => [value, name]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    No booking data available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Container Type Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-purple-500" />
                Container Types
              </CardTitle>
              <CardDescription>Distribution of container types booked</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {containerData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={containerData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {containerData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number, name: string) => [value, name]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    No container data available
                  </div>
                )}
              </div>
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
