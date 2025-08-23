"use client"

import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { BookingForm } from "@/components/booking-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Truck, Clock, MapPin, Users, MessageSquare, User, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { ChatInterface } from "@/components/chat-interface"
import { ProfileForm } from "@/components/profile-form"

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

type NavigationItem = 'new-booking' | 'my-bookings' | 'chat' | 'profile'

export default function BookingDashboard() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<NavigationItem>('new-booking')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      setUser(user)

      // Fetch user profile
      const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()
      setProfile(profile)

      // Fetch user's bookings
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
  }, [router, supabase.auth])

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

  const renderContent = () => {
    switch (activeTab) {
      case 'new-booking':
        return (
          <div className="p-8">
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="border-b border-gray-200">
                <CardTitle className="text-xl font-semibold text-gray-900">Create New Booking</CardTitle>
                <CardDescription className="text-gray-600">
                  Fill out the form below to book your container
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <BookingForm user={user} />
              </CardContent>
            </Card>
          </div>
        )

      case 'my-bookings':
        return (
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">My Bookings</h1>
              <p className="text-gray-600">View and manage your container rental bookings</p>
            </div>

            {!bookings || bookings.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-gray-500 mb-4">You haven't made any bookings yet.</p>
                  <button
                    onClick={() => setActiveTab('new-booking')}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Make Your First Booking
                  </button>
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
        )

      case 'chat':
        return (
          <div className="p-4 h-full">
            <ChatInterface user={user} profile={profile} />
          </div>
        )

      case 'profile':
        return (
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile</h1>
              <p className="text-gray-600">Manage your account information</p>
            </div>
            <ProfileForm profile={profile} />
          </div>
        )

      default:
        return null
    }
  }

  const getHeaderTitle = () => {
    switch (activeTab) {
      case 'new-booking':
        return { title: 'New Booking', description: 'Create a new container rental booking' }
      case 'my-bookings':
        return { title: 'My Bookings', description: 'View and manage your container rental bookings' }
      case 'chat':
        return { title: 'Chats', description: 'Communicate with our support team' }
      case 'profile':
        return { title: 'My Account', description: 'Manage your account information' }
      default:
        return { title: 'Dashboard', description: 'Welcome to your dashboard' }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const { title, description } = getHeaderTitle()

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Dashboard</h2>
          
          <nav className="space-y-2">
            <button 
              onClick={() => setActiveTab('new-booking')}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                activeTab === 'new-booking' 
                  ? 'bg-blue-50 border border-blue-200 text-blue-700 font-medium' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Plus className="w-5 h-5" />
              <span>New Booking</span>
            </button>
            
            <button 
              onClick={() => setActiveTab('my-bookings')}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                activeTab === 'my-bookings' 
                  ? 'bg-blue-50 border border-blue-200 text-blue-700 font-medium' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Calendar className="w-5 h-5" />
              <span>My Bookings</span>
            </button>
            
            <button 
              onClick={() => setActiveTab('chat')}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                activeTab === 'chat' 
                  ? 'bg-blue-50 border border-blue-200 text-blue-700 font-medium' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              <span>Chats</span>
            </button>
            
            <button 
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                activeTab === 'profile' 
                  ? 'bg-blue-50 border border-blue-200 text-blue-700 font-medium' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <User className="w-5 h-5" />
              <span>My Account</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Dashboard Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              <p className="text-gray-600 mt-1">{description}</p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>{new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}
