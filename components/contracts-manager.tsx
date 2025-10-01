"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, User, Package, MapPin, FileText, ChevronRight } from "lucide-react"
import { format } from "date-fns"
import { ContractDetailsSidebar } from "@/components/contract-details-sidebar"

interface Booking {
  id: string
  start_date: string
  end_date: string
  service_type: string
  total_amount: number
  status: string
  payment_status: string
  signature_img_url: string
  created_at: string
  delivery_address?: string
  customer_address: string
  notes?: string
  profiles: {
    id: string
    full_name: string
    email: string
    phone: string
  }
  container_types: {
    id: string
    name: string
    size: string
  }
}

interface ContractsManagerProps {
  bookings: Booking[]
}

export function ContractsManager({ bookings }: ContractsManagerProps) {
  const [selectedContract, setSelectedContract] = useState<Booking | null>(
    bookings.length > 0 ? bookings[0] : null
  )
  const [isSidebarOpen, setIsSidebarOpen] = useState(bookings.length > 0)

  // Update selected contract and sidebar state when bookings change
  useEffect(() => {
    if (bookings.length > 0) {
      setSelectedContract(bookings[0])
      setIsSidebarOpen(true)
    } else {
      setSelectedContract(null)
      setIsSidebarOpen(false)
    }
  }, [bookings])

  const handleContractClick = (contract: Booking) => {
    setSelectedContract(contract)
    setIsSidebarOpen(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
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

  if (bookings.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Contracts Found</h3>
          <p className="text-gray-500 text-center mb-4">
            There are no bookings with signatures yet. Contracts will appear here once customers sign their bookings.
          </p>
          <div className="text-sm text-gray-400 text-center mb-6">
            <p>To create a contract:</p>
            <p>1. Go to the booking page</p>
            <p>2. Complete a booking with signature</p>
            <p>3. The contract will appear here automatically</p>
          </div>
          
          {/* Temporary test contract for development */}
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800 mb-2">
              <strong>Development Note:</strong> If you want to test the contract display, you can:
            </p>
            <ul className="text-xs text-yellow-700 text-left space-y-1">
              <li>• Create a booking through the booking form</li>
              <li>• Make sure to complete the signature step</li>
              <li>• The contract will then appear here</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex gap-6 max-h-[calc(100vh-150px)]">
      {/* Main Content */}
      <div className={`transition-all duration-300 ease-in-out ${
        isSidebarOpen ? 'w-1/2' : 'w-full'
      }`}>
        <div className="h-full flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-6 p-6">
              <div className="grid gap-4">
            {bookings.map((booking, index) => (
              <Card 
                key={booking.id} 
                className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-200"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Header with site styling */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <FileText className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              Contract #{booking.id.slice(-8)}
                            </h3>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                              ID: {booking.id.slice(0, 8)}...
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Badge 
                            className={`${getStatusColor(booking.status)} border-0 shadow-sm font-semibold px-3 py-1 text-xs uppercase tracking-wide`}
                          >
                            {booking.status}
                          </Badge>
                          <Badge 
                            className={`${getPaymentStatusColor(booking.payment_status)} border-0 shadow-sm font-semibold px-3 py-1 text-xs uppercase tracking-wide`}
                          >
                            {booking.payment_status}
                          </Badge>
                        </div>
                      </div>

                      {/* Details grid with site styling */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                              <User className="h-4 w-4 text-gray-600" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Customer</p>
                              <p className="font-semibold text-gray-900">{booking.profiles.full_name}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                              <Package className="h-4 w-4 text-gray-600" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Service</p>
                              <p className="font-semibold text-gray-900">{booking.container_types.name} ({booking.container_types.size})</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                              <Calendar className="h-4 w-4 text-gray-600" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Duration</p>
                              <p className="font-semibold text-gray-900">
                                {format(new Date(booking.start_date), "MMM dd")} - {format(new Date(booking.end_date), "MMM dd, yyyy")}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                              <MapPin className="h-4 w-4 text-gray-600" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Location</p>
                              <p className="font-semibold text-gray-900 truncate">
                                {booking.service_type === "delivery" ? booking.delivery_address : "Pickup"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Footer with site styling */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full" />
                          <span className="text-sm text-gray-500 font-medium">
                            Created {format(new Date(booking.created_at), "MMM dd, yyyy 'at' h:mm a")}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Total Amount</p>
                          <p className="text-xl font-bold text-gray-900">
                            ${booking.total_amount.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Chevron button */}
                    <button
                      onClick={() => handleContractClick(booking)}
                      className="ml-4 p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 group"
                    >
                      <ChevronRight className="h-5 w-5 text-gray-600 group-hover:text-gray-900 transition-colors" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <ContractDetailsSidebar
        contract={selectedContract}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
    </div>
  )
}
