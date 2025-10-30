"use client"

import { createClient } from "@/lib/supabase/client"
import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { BookingForm } from "@/components/booking-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Truck, Clock, MapPin, Users, MessageSquare, User, Plus, LogOut, CreditCard, Menu, X, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { ChatInterface } from "@/components/chat-interface"
import { ProfileForm } from "@/components/profile-form"
import { ClientPaymentHistory } from "@/components/client-payment-history"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"


const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

type NavigationItem = 'new-booking' | 'my-bookings' | 'payments' | 'chat' | 'profile'

export default function BookingDashboard() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [bookings, setBookings] = useState<any[]>([])
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAuthChoice, setShowAuthChoice] = useState(false)
  const [activeTab, setActiveTab] = useState<NavigationItem>('new-booking')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showBookingDialog, setShowBookingDialog] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<any>(null)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        // Show choice screen instead of redirecting
        setShowAuthChoice(true)
        setLoading(false)
        return
      }

      setUser(user)

      // Fetch user profile
      const { data: profile, error: profileError } = await supabase.from("profiles").select("*").eq("id", user.id).single()
      console.log("📊 Profile fetch result:", { profile, profileError })
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

      // Fetch payments for each booking to get fee information
      const bookingsWithFees = await Promise.all(
        (bookings || []).map(async (booking) => {
          const { data: payments, error: paymentsError } = await supabase
            .from("payments")
            .select("*")
            .eq("booking_id", booking.id)
            .order("created_at", { ascending: true })

          // Calculate total payments amount
          const totalPayments = (payments || []).reduce((sum, payment) => sum + (payment.amount || 0), 0)

          // If total payments > booking amount, there are additional fees
          const hasFees = totalPayments > booking.total_amount

          // Calculate fees based on the difference between total payments and booking amount
          let fees: any[] = []
          if (totalPayments > booking.total_amount) {
            const feeAmount = totalPayments - booking.total_amount
            console.log('🔍 [Booking Debug] Payment analysis:', {
              bookingAmount: booking.total_amount,
              totalPayments: totalPayments,
              feeAmount: feeAmount,
              paymentsCount: (payments || []).length,
              payments: payments
            })
            
            // If there are multiple payments, use the additional ones
            if ((payments || []).length > 1) {
              fees = (payments || []).slice(1)
              console.log('🔍 [Booking Debug] Using multiple payments as fees:', fees)
            } else {
              // Check if the single payment has a detailed description that we can parse
              const singlePayment = (payments || [])[0]
              if (singlePayment && singlePayment.notes && singlePayment.notes.includes(':')) {
                // Try to parse individual fees from the description
                console.log('🔍 [Booking Debug] Parsing fees from description:', singlePayment.notes)
                
                // Parse individual fees from the description
                let feesText = ''
                if (singlePayment.notes.includes('Individual fees:')) {
                  feesText = singlePayment.notes.split('Individual fees:')[1]?.trim() || ''
                } else if (singlePayment.notes.includes('Extra fees:')) {
                  feesText = singlePayment.notes.split('Extra fees:')[1]?.trim() || ''
                } else {
                  feesText = singlePayment.notes
                }
                
                if (feesText.includes(',')) {
                  // Multiple fees separated by commas
                  const feeItems = feesText.split(',').map(f => f.trim())
                  
                  fees = feeItems.map((item, index) => {
                    const [description, amountStr] = item.split(':').map(s => s.trim())
                    const amount = amountStr ? parseFloat(amountStr.replace('$', '')) || 0 : feeAmount / feeItems.length
                    
                    return {
                      id: `parsed_fee_${index}`,
                      amount: amount,
                      description: description || `Fee ${index + 1}`,
                      created_at: singlePayment.created_at || new Date().toISOString(),
                      notes: 'Individual fee from combined payment'
                    }
                  })
                } else {
                  // Single fee description
                  const [description, amountStr] = feesText.split(':').map(s => s.trim())
                  const amount = amountStr ? parseFloat(amountStr.replace('$', '')) || feeAmount : feeAmount
                  
                  fees = [{
                    id: 'parsed_fee',
                    amount: amount,
                    description: description || 'Additional fees',
                    created_at: singlePayment.created_at || new Date().toISOString(),
                    notes: 'Individual fee from combined payment'
                  }]
                }
              } else {
                // Single payment that includes fees - create a virtual fee record
                fees = [{
                  id: 'calculated_fee',
                  amount: feeAmount,
                  description: 'Additional fees (legacy)',
                  created_at: (payments || [])[0]?.created_at || new Date().toISOString(),
                  notes: 'This fee was added before the new individual fee system. Individual fee details are not available.'
                }]
              }
            }
          }
          
          return {
            ...booking,
            fees: fees,
            hasFees: hasFees,
            totalPayments: totalPayments
          }
        })
      )


      setBookings(bookingsWithFees || [])

      // Fetch user's payments
      const { data: payments } = await supabase
        .from("payments")
        .select(`
          *,
          bookings (
            *,
            container_types (
              name,
              size
            )
          )
        `)
        .order("created_at", { ascending: false })

      setPayments(payments || [])

      setLoading(false)
    }

    checkAuth()
  }, [router, supabase.auth])

  const handleOpenBookingDialog = (booking: any) => {
    setSelectedBooking(booking)
    setShowBookingDialog(true)
  }

  const handleCloseBookingDialog = () => {
    setShowBookingDialog(false)
    setSelectedBooking(null)
  }

  // Touch handlers for swipe functionality
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isUpSwipe = distance > 50
    const isDownSwipe = distance < -50

    if (isUpSwipe || isDownSwipe) {
      // Close dialog on swipe
      handleCloseBookingDialog()
    }
  }

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

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const NavigationItem = ({ 
    icon: Icon, 
    label, 
    value, 
    onClick, 
    isActive 
  }: { 
    icon: any, 
    label: string, 
    value: NavigationItem, 
    onClick: () => void, 
    isActive: boolean 
  }) => (
    <button 
      onClick={onClick}
      className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
        isActive 
          ? 'bg-blue-50 border border-blue-200 text-blue-700 font-medium' 
          : 'text-gray-700 hover:bg-gray-50'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </button>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'new-booking':
        return (
          <div className="p-4 sm:p-6 lg:p-8">
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="border-b border-gray-200">
                <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900">Create New Booking</CardTitle>
                <CardDescription className="text-gray-600">
                  Fill out the form below to book your container
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <BookingForm user={user} />
              </CardContent>
            </Card>
          </div>
        )

      case 'my-bookings':
        return (
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="mb-6 sm:mb-8">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">My Bookings</h1>
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
              <div className="space-y-4 sm:space-y-6">
                {bookings.map((booking: any) => (
                  <Card 
                    key={booking.id}
                    className="cursor-pointer hover:shadow-md transition-shadow duration-200"
                    onClick={() => handleOpenBookingDialog(booking)}
                  >
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                        <div>
                          <CardTitle className="text-base sm:text-lg">
                            {booking.container_types.name} - {booking.container_types.size}
                          </CardTitle>
                          <CardDescription>Booking #{booking.id.slice(0, 8)}</CardDescription>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                          <Badge className={getPaymentStatusColor(booking.payment_status)}>
                            {booking.payment_status}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
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
                              <span className="font-medium">Booking Amount:</span> {formatCurrency(booking.total_amount)}
                            </div>
                            {booking.fees && booking.fees.length > 0 && (
                              <div>
                                <span className="font-medium">Additional Fees:</span> {formatCurrency(booking.fees.reduce((sum: number, fee: any) => sum + (fee.amount || 0), 0))}
                              </div>
                            )}
                            <div>
                              <span className="font-medium">Total Amount:</span> 
                              <span className="font-semibold text-green-600 ml-1">
                                {formatCurrency((booking.total_amount || 0) + (booking.fees?.reduce((sum: number, fee: any) => sum + (fee.amount || 0), 0) || 0))}
                              </span>
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
        )

      case 'payments':
        return (
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="mb-6 sm:mb-8">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Payment History</h1>
              <p className="text-gray-600">View all your payment transactions</p>
            </div>
            <ClientPaymentHistory payments={payments} />
          </div>
        )

      case 'chat':
        return (
          <div className="p-2 sm:p-4 h-full">
            <ChatInterface user={user} profile={profile} />
          </div>
        )

      case 'profile':
        return (
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="mb-6 sm:mb-8">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Profile</h1>
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
      case 'payments':
        return { title: 'Payment History', description: 'View all your payment transactions' }
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

  if (!user && showAuthChoice) {
    return (
      <div className="min-h-[calc(100vh-70px)] bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-lg w-full bg-white border border-gray-200 rounded-xl shadow-sm p-6 sm:p-8 text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Get Started</h1>
          <p className="text-gray-600 mt-2">Choose how you want to book your dumpster.</p>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => router.push("/auth/login")}
              className="w-full inline-flex items-center justify-center px-4 py-3 rounded-lg bg-black text-white hover:bg-black/80 transition-colors"
            >
              Sign in / Create account
            </button>
            <button
              onClick={() => router.push("/guest-booking")}
              className="w-full inline-flex items-center justify-center px-4 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Continue as guest
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-4">Guests can request a booking without creating an account.</p>
        </div>
      </div>
    )
  }

  const { title, description } = getHeaderTitle()

  return (
    <div className="h-[calc(100vh-70px)] bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <div className="h-full bg-white flex flex-col">
            <div className="p-6 flex-1">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Dashboard</h2>
              
              <nav className="space-y-2">
                <NavigationItem 
                  icon={Plus} 
                  label="New Booking" 
                  value="new-booking" 
                  onClick={() => {
                    setActiveTab('new-booking')
                    setSidebarOpen(false)
                  }} 
                  isActive={activeTab === 'new-booking'} 
                />
                
                <NavigationItem 
                  icon={Calendar} 
                  label="My Bookings" 
                  value="my-bookings" 
                  onClick={() => {
                    setActiveTab('my-bookings')
                    setSidebarOpen(false)
                  }} 
                  isActive={activeTab === 'my-bookings'} 
                />
                
                <NavigationItem 
                  icon={CreditCard} 
                  label="Payments" 
                  value="payments" 
                  onClick={() => {
                    setActiveTab('payments')
                    setSidebarOpen(false)
                  }} 
                  isActive={activeTab === 'payments'} 
                />
                
                <NavigationItem 
                  icon={MessageSquare} 
                  label="Chats" 
                  value="chat" 
                  onClick={() => {
                    setActiveTab('chat')
                    setSidebarOpen(false)
                  }} 
                  isActive={activeTab === 'chat'} 
                />
                
                <NavigationItem 
                  icon={User} 
                  label="My Account" 
                  value="profile" 
                  onClick={() => {
                    setActiveTab('profile')
                    setSidebarOpen(false)
                  }} 
                  isActive={activeTab === 'profile'} 
                />
              </nav>
            </div>
            
            {/* Sign Out Button */}
            <div className="p-6 border-t border-gray-200">
              <button 
                onClick={handleSignOut}
                className="w-full flex items-center space-x-3 p-3 rounded-lg transition-colors text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 flex-1">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Dashboard</h2>
          
          <nav className="space-y-2">
            <NavigationItem 
              icon={Plus} 
              label="New Booking" 
              value="new-booking" 
              onClick={() => setActiveTab('new-booking')} 
              isActive={activeTab === 'new-booking'} 
            />
            
            <NavigationItem 
              icon={Calendar} 
              label="My Bookings" 
              value="my-bookings" 
              onClick={() => setActiveTab('my-bookings')} 
              isActive={activeTab === 'my-bookings'} 
            />
            
            <NavigationItem 
              icon={CreditCard} 
              label="Payments" 
              value="payments" 
              onClick={() => setActiveTab('payments')} 
              isActive={activeTab === 'payments'} 
            />
            
            <NavigationItem 
              icon={MessageSquare} 
              label="Chats" 
              value="chat" 
              onClick={() => setActiveTab('chat')} 
              isActive={activeTab === 'chat'} 
            />
            
            <NavigationItem 
              icon={User} 
              label="My Account" 
              value="profile" 
              onClick={() => setActiveTab('profile')} 
              isActive={activeTab === 'profile'} 
            />
          </nav>
        </div>
        
        {/* Sign Out Button */}
        <div className="p-6 border-t border-gray-200">
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center space-x-3 p-3 rounded-lg transition-colors text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
                <p className="text-sm text-gray-600">{description}</p>
              </div>
            </div>
            <button 
              onClick={handleSignOut}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto">
          {renderContent()}
        </div>
      </div>

      {/* My Bookings Dialog */}
      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent 
          ref={dialogRef}
          className="sm:max-w-4xl max-h-[85vh] overflow-y-auto transition-transform duration-200 ease-out"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-600" />
              My Bookings
            </DialogTitle>
            <DialogDescription>
              Complete booking information and status
            </DialogDescription>
            {/* Scroll indicator for mobile */}
            <div className="sm:hidden flex justify-center mt-2">
              <div className="w-8 h-1 bg-gray-300 rounded-full"></div>
            </div>
            <div className="text-xs text-gray-500 text-center mt-1">
              Scroll to see all details
            </div>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-6 pb-4">
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
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Booking Amount:</span>
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

                  {/* Fees Section */}
                  {selectedBooking.fees && selectedBooking.fees.length > 0 && (
                    <div className="border-t pt-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Additional Fees</h4>
                      <div className="space-y-2">
                        {selectedBooking.fees.map((fee: any, index: number) => (
                          <div key={fee.id || index} className="bg-white rounded-lg p-3 border">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">
                                  {fee.description || fee.notes || `Fee #${index + 1}`}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Added on {fee.created_at ? format(new Date(fee.created_at), "MMM do, yyyy") : "N/A"}
                                </p>
                              </div>
                              <p className="text-sm font-semibold text-orange-600 ml-4">
                                {formatCurrency(fee.amount || 0)}
                              </p>
                            </div>
                            {fee.notes && fee.notes !== fee.description && !fee.notes.includes('Individual fee from combined payment') && (
                              <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                                <span className="font-medium">Admin Notes:</span> {fee.notes}
                              </div>
                            )}
                          </div>
                        ))}
                        <div className="flex justify-between items-center bg-blue-50 rounded-lg p-3 border border-blue-200">
                          <span className="text-sm font-medium text-gray-900">Total Fees:</span>
                          <span className="text-sm font-semibold text-blue-600">
                            {formatCurrency(selectedBooking.fees.reduce((sum: number, fee: any) => sum + (fee.amount || 0), 0))}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Total Amount */}
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center bg-green-50 rounded-lg p-3 border border-green-200">
                      <span className="text-base font-bold text-gray-900">Total Amount:</span>
                      <span className="text-lg font-bold text-green-600">
                        {formatCurrency((selectedBooking.total_amount || 0) + (selectedBooking.fees?.reduce((sum: number, fee: any) => sum + (fee.amount || 0), 0) || 0))}
                      </span>
                    </div>
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
