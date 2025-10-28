"use client"

import { X, Calendar, Package, User, CreditCard, Clock, DollarSign } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { format } from "date-fns"
import { formatPhoneNumber } from "@/lib/phone-utils"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

interface BookingDetailsSidebarProps {
  booking: any
  isOpen: boolean
  onClose: () => void
  isAdmin?: boolean
  onUpdate?: () => void
}

export function BookingDetailsSidebar({ booking, isOpen, onClose, isAdmin = false, onUpdate }: BookingDetailsSidebarProps) {
  const [chargeAmount, setChargeAmount] = useState("")
  const [chargeDescription, setChargeDescription] = useState("")
  const [isCharging, setIsCharging] = useState(false)
  const { toast } = useToast()

  if (!isOpen || !booking) return null

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

  const handleChargeCard = async () => {
    if (!chargeAmount || parseFloat(chargeAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to charge",
        variant: "destructive",
      })
      return
    }

    if (!chargeDescription.trim()) {
      toast({
        title: "Missing Description",
        description: "Please enter a description for this charge",
        variant: "destructive",
      })
      return
    }

    setIsCharging(true)

    try {
      const response = await fetch('/api/charge-booking-card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId: booking.id,
          amount: parseFloat(chargeAmount),
          description: chargeDescription.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to charge card')
      }

      toast({
        title: "Charge Successful",
        description: `$${parseFloat(chargeAmount).toFixed(2)} charged successfully`,
      })

      // Reset form
      setChargeAmount("")
      setChargeDescription("")

      // Refresh booking data
      if (onUpdate) {
        onUpdate()
      }
    } catch (error) {
      console.error('Charge card error:', error)
      toast({
        title: "Charge Failed",
        description: error instanceof Error ? error.message : "Failed to charge card",
        variant: "destructive",
      })
    } finally {
      setIsCharging(false)
    }
  }

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
        {/* Popup */}
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Booking Details</h2>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Booking Info */}
            <div className="space-y-6">
              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Status</span>
                <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
              </div>

              {/* Customer Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Customer Information</span>
                </div>
                <div className="pl-6 space-y-1">
                  <p className="text-sm">
                    <span className="font-medium">Name:</span> {booking.profiles?.full_name || "N/A"}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Email:</span> {booking.profiles?.email || "N/A"}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Phone:</span> {booking.profiles?.phone ? formatPhoneNumber(booking.profiles.phone) : "N/A"}
                  </p>
                  {booking.profiles?.company && (
                    <p className="text-sm">
                      <span className="font-medium">Company:</span> {booking.profiles.company}
                    </p>
                  )}
                  {booking.profiles?.address && (
                    <p className="text-sm">
                      <span className="font-medium">Address:</span> {booking.profiles.address}
                    </p>
                  )}
                </div>
              </div>

              {/* Container Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Container Information</span>
                </div>
                <div className="pl-6 space-y-1">
                  <p className="text-sm">
                    <span className="font-medium">Type:</span> {booking.container_types?.name || "N/A"}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Size:</span> {booking.container_types?.size || "N/A"}
                  </p>
                </div>
              </div>

              {/* Service Details */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Service Details</span>
                </div>
                <div className="pl-6 space-y-1">
                  <p className="text-sm">
                    <span className="font-medium">Service Type:</span> {booking.service_type}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Start Date:</span>{" "}
                    {format(new Date(booking.start_date), "MMM dd, yyyy")}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">End Date:</span> {format(new Date(booking.end_date), "MMM dd, yyyy")}
                  </p>
                  {booking.delivery_address && (
                    <p className="text-sm">
                      <span className="font-medium">Delivery Address:</span> {booking.delivery_address}
                    </p>
                  )}
                  {booking.customer_address && (
                    <p className="text-sm">
                      <span className="font-medium">Customer Address:</span> {booking.customer_address}
                    </p>
                  )}
                </div>
              </div>

              {/* Payment Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Payment Information</span>
                </div>
                <div className="pl-6 space-y-1">
                  <p className="text-sm">
                    <span className="font-medium">Total Amount:</span> {formatCurrency(booking.total_amount)}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Payment Status:</span> {booking.payment_status || "Pending"}
                  </p>
                  {booking.payment_method_id && (
                    <p className="text-sm">
                      <span className="font-medium">Payment Method:</span> <span className="text-green-600">Card on File</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Admin: Charge Additional Amount */}
              {isAdmin && booking.payment_method_id && (
                <div className="space-y-3 border-t pt-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-blue-500" />
                    <span className="font-medium text-blue-700">Charge Additional Amount</span>
                  </div>
                  <div className="pl-6 space-y-3">
                    <p className="text-sm text-gray-600">
                      Charge extra fees (damages, extra days, tonnage, etc.) to the customer's saved card.
                    </p>
                    
                    <div className="space-y-2">
                      <Label htmlFor="charge-amount">Amount ($)</Label>
                      <Input
                        id="charge-amount"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={chargeAmount}
                        onChange={(e) => setChargeAmount(e.target.value)}
                        disabled={isCharging}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="charge-description">Description *</Label>
                      <Input
                        id="charge-description"
                        type="text"
                        placeholder="e.g., Extra tonnage fee, Damage charge, etc."
                        value={chargeDescription}
                        onChange={(e) => setChargeDescription(e.target.value)}
                        disabled={isCharging}
                      />
                    </div>
                    
                    <Button
                      onClick={handleChargeCard}
                      disabled={isCharging || !chargeAmount || !chargeDescription}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      {isCharging ? "Processing..." : `Charge $${chargeAmount || "0.00"}`}
                    </Button>
                    
                    <p className="text-xs text-gray-500">
                      The customer will be charged immediately and receive a receipt via email.
                    </p>
                  </div>
                </div>
              )}

              {/* No Payment Method Warning */}
              {isAdmin && !booking.payment_method_id && booking.payment_status === 'paid' && (
                <div className="space-y-3 border-t pt-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-800">
                      ⚠️ No payment method saved for this booking. Additional charges cannot be processed automatically.
                    </p>
                  </div>
                </div>
              )}

              {/* Additional Services */}
              {(booking.extra_tonnage > 0 || booking.appliance_count > 0 || booking.extra_days > 0) && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Additional Services</span>
                  </div>
                  <div className="pl-6 space-y-1">
                    {booking.extra_tonnage > 0 && (
                      <p className="text-sm">
                        <span className="font-medium">Extra Tonnage:</span> {booking.extra_tonnage} tons
                      </p>
                    )}
                    {booking.appliance_count > 0 && (
                      <p className="text-sm">
                        <span className="font-medium">Appliances:</span> {booking.appliance_count}
                      </p>
                    )}
                    {booking.extra_days > 0 && (
                      <p className="text-sm">
                        <span className="font-medium">Extra Days:</span> {booking.extra_days}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div className="space-y-3 pt-4 border-t">
                <p className="text-xs text-gray-500">
                  <span className="font-medium">Created:</span>{" "}
                  {format(new Date(booking.created_at), "MMM dd, yyyy 'at' h:mm a")}
                </p>
                {booking.updated_at && (
                  <p className="text-xs text-gray-500">
                    <span className="font-medium">Updated:</span>{" "}
                    {format(new Date(booking.updated_at), "MMM dd, yyyy 'at' h:mm a")}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
