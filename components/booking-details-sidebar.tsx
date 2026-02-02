"use client"

import { X, Calendar, Package, User, CreditCard, Clock, DollarSign, Ban, CalendarPlus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { format, addDays, differenceInDays } from "date-fns"
import { formatPhoneNumber } from "@/lib/phone-utils"
import { parseLocalDate } from "@/lib/utils"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Textarea } from "@/components/ui/textarea"

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
  const [isCancelling, setIsCancelling] = useState(false)
  const [cancelReason, setCancelReason] = useState("")
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [showExtendDialog, setShowExtendDialog] = useState(false)
  const [isExtending, setIsExtending] = useState(false)
  const [newEndDate, setNewEndDate] = useState("")
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

  const handleCancelBooking = async () => {
    setIsCancelling(true)

    try {
      const response = await fetch('/api/admin/cancel-booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId: booking.id,
          reason: cancelReason.trim() || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to cancel booking')
      }

      toast({
        title: "Booking Cancelled",
        description: data.emailSent
          ? "The booking has been cancelled and the customer has been notified via email."
          : "The booking has been cancelled.",
      })

      // Reset form and close dialog
      setCancelReason("")
      setShowCancelDialog(false)

      // Refresh booking data
      if (onUpdate) {
        onUpdate()
      }

      // Close the sidebar
      onClose()
    } catch (error) {
      console.error('Cancel booking error:', error)
      toast({
        title: "Cancellation Failed",
        description: error instanceof Error ? error.message : "Failed to cancel booking",
        variant: "destructive",
      })
    } finally {
      setIsCancelling(false)
    }
  }

  const handleExtendBooking = async () => {
    if (!newEndDate) {
      toast({
        title: "Missing Date",
        description: "Please select a new end date",
        variant: "destructive",
      })
      return
    }

    setIsExtending(true)

    try {
      const response = await fetch('/api/admin/extend-booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId: booking.id,
          newEndDate,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to extend booking')
      }

      toast({
        title: "Booking Extended",
        description: data.emailSent
          ? `Extended by ${data.additionalDays} day(s). Additional cost: $${data.additionalCost}. Customer notified via email.`
          : `Extended by ${data.additionalDays} day(s). Additional cost: $${data.additionalCost}.`,
      })

      // Reset form and close dialog
      setNewEndDate("")
      setShowExtendDialog(false)

      // Refresh booking data
      if (onUpdate) {
        onUpdate()
      }
    } catch (error) {
      console.error('Extend booking error:', error)
      toast({
        title: "Extension Failed",
        description: error instanceof Error ? error.message : "Failed to extend booking",
        variant: "destructive",
      })
    } finally {
      setIsExtending(false)
    }
  }

  // Calculate additional days and cost for preview
  const calculateExtensionPreview = () => {
    if (!newEndDate || !booking.end_date) return null

    const currentEnd = parseLocalDate(booking.end_date)
    const newEnd = parseLocalDate(newEndDate)
    const additionalDays = differenceInDays(newEnd, currentEnd)

    if (additionalDays <= 0) return null

    const extraDayRate = 25 // $25 per extra day
    const additionalCost = additionalDays * extraDayRate

    return { additionalDays, additionalCost }
  }

  const extensionPreview = calculateExtensionPreview()

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
                    {format(parseLocalDate(booking.start_date), "MMM dd, yyyy")}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">End Date:</span> {format(parseLocalDate(booking.end_date), "MMM dd, yyyy")}
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

              {/* Pricing Breakdown */}
              {booking.pricing_breakdown && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Pricing Breakdown</span>
                  </div>
                  <div className="pl-6 space-y-1 bg-gray-50 rounded-lg p-3">
                    <p className="text-sm">
                      <span className="font-medium">Base Price ({booking.pricing_breakdown.includedDays} days):</span> {formatCurrency(booking.pricing_breakdown.basePrice)}
                    </p>
                    {booking.pricing_breakdown.extraDays > 0 && (
                      <p className="text-sm">
                        <span className="font-medium">Extra Days ({booking.pricing_breakdown.extraDays} x $25):</span> {formatCurrency(booking.pricing_breakdown.extraDaysAmount)}
                      </p>
                    )}
                    {booking.pricing_breakdown.extraTonnage > 0 && (
                      <p className="text-sm">
                        <span className="font-medium">Extra Tonnage ({booking.pricing_breakdown.extraTonnage} x $125):</span> {formatCurrency(booking.pricing_breakdown.extraTonnageAmount)}
                      </p>
                    )}
                    {booking.pricing_breakdown.applianceCount > 0 && (
                      <p className="text-sm">
                        <span className="font-medium">Appliances ({booking.pricing_breakdown.applianceCount} x $25):</span> {formatCurrency(booking.pricing_breakdown.applianceAmount)}
                      </p>
                    )}
                    {booking.pricing_breakdown.distanceFee > 0 && (
                      <p className="text-sm">
                        <span className="font-medium">Distance Fee{booking.pricing_breakdown.distanceMiles ? ` (${booking.pricing_breakdown.distanceMiles.toFixed(1)} mi)` : ''}:</span> {formatCurrency(booking.pricing_breakdown.distanceFee)}
                      </p>
                    )}
                    {booking.pricing_breakdown.travelFee > 0 && (
                      <p className="text-sm">
                        <span className="font-medium">Travel Fee:</span> {formatCurrency(booking.pricing_breakdown.travelFee)}
                      </p>
                    )}
                    {booking.pricing_breakdown.priceAdjustment !== 0 && (
                      <p className="text-sm">
                        <span className="font-medium">{booking.pricing_breakdown.priceAdjustment < 0 ? 'Discount' : 'Additional Charge'}{booking.pricing_breakdown.adjustmentReason ? ` (${booking.pricing_breakdown.adjustmentReason})` : ''}:</span>{' '}
                        <span className={booking.pricing_breakdown.priceAdjustment < 0 ? 'text-green-600' : 'text-red-600'}>
                          {booking.pricing_breakdown.priceAdjustment < 0 ? '-' : '+'}{formatCurrency(Math.abs(booking.pricing_breakdown.priceAdjustment))}
                        </span>
                      </p>
                    )}
                    <div className="border-t border-gray-200 mt-2 pt-2">
                      <p className="text-sm font-bold">
                        <span className="font-medium">Total:</span> <span className="text-green-600">{formatCurrency(booking.pricing_breakdown.total)}</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}

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

              {/* Admin: Extend Booking */}
              {isAdmin && booking.status !== "cancelled" && booking.status !== "completed" && (
                <div className="space-y-3 border-t pt-4">
                  <AlertDialog open={showExtendDialog} onOpenChange={setShowExtendDialog}>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full border-blue-300 text-blue-700 hover:bg-blue-50"
                        disabled={isExtending}
                      >
                        <CalendarPlus className="h-4 w-4 mr-2" />
                        Extend End Date
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Extend Booking End Date</AlertDialogTitle>
                        <AlertDialogDescription>
                          Extend the rental period by selecting a new end date. The customer will be charged $25 per additional day.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>Current End Date</Label>
                          <p className="text-sm text-gray-600 font-medium">
                            {format(parseLocalDate(booking.end_date), "MMMM d, yyyy")}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-end-date">New End Date *</Label>
                          <Input
                            id="new-end-date"
                            type="date"
                            min={format(addDays(parseLocalDate(booking.end_date), 1), "yyyy-MM-dd")}
                            value={newEndDate}
                            onChange={(e) => setNewEndDate(e.target.value)}
                            disabled={isExtending}
                          />
                        </div>
                        {extensionPreview && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-1">
                            <p className="text-sm text-blue-800">
                              <span className="font-medium">Additional Days:</span> {extensionPreview.additionalDays}
                            </p>
                            <p className="text-sm text-blue-800">
                              <span className="font-medium">Additional Cost:</span> ${extensionPreview.additionalCost.toFixed(2)}
                            </p>
                            <p className="text-sm text-blue-800">
                              <span className="font-medium">New Total:</span> ${(booking.total_amount + extensionPreview.additionalCost).toFixed(2)}
                            </p>
                          </div>
                        )}
                      </div>
                      <AlertDialogFooter>
                        <AlertDialogCancel disabled={isExtending} onClick={() => setNewEndDate("")}>
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleExtendBooking}
                          disabled={isExtending || !newEndDate || !extensionPreview}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          {isExtending ? "Extending..." : "Extend Booking"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}

              {/* Admin: Cancel Booking */}
              {isAdmin && booking.status !== "cancelled" && (
                <div className="space-y-3 pt-4 border-t">
                  <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        className="w-full"
                        disabled={isCancelling}
                      >
                        <Ban className="h-4 w-4 mr-2" />
                        Cancel Booking
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Cancel Booking?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will cancel the booking and notify the customer via email. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <div className="space-y-2 py-4">
                        <Label htmlFor="cancel-reason">Reason (optional)</Label>
                        <Textarea
                          id="cancel-reason"
                          placeholder="Enter a reason for cancellation..."
                          value={cancelReason}
                          onChange={(e) => setCancelReason(e.target.value)}
                          disabled={isCancelling}
                        />
                      </div>
                      <AlertDialogFooter>
                        <AlertDialogCancel disabled={isCancelling}>Keep Booking</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleCancelBooking}
                          disabled={isCancelling}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          {isCancelling ? "Cancelling..." : "Yes, Cancel Booking"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
