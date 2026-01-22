"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { format } from "date-fns"
import { DollarSign, FileText, CreditCard, AlertCircle, CheckCircle, Plus, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

interface PaymentTrackerProps {
  payments: any[]
  onRefresh?: () => void
}

interface FeeItem {
  id: string
  amount: number
  description: string
}

export function PaymentTracker({ payments, onRefresh }: PaymentTrackerProps) {
  const [selectedPayment, setSelectedPayment] = useState<any>(null)
  const [selectedBooking, setSelectedBooking] = useState<any>(null)
  const [extraFees, setExtraFees] = useState<FeeItem[]>([])
  const [isCharging, setIsCharging] = useState(false)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [showChargeDialog, setShowChargeDialog] = useState(false)
  const { toast } = useToast()
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "awaiting_card":
        return "bg-blue-100 text-blue-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const totalRevenue = payments.filter((p) => p.status === "completed").reduce((sum, p) => sum + Number(p.amount), 0)

  const pendingAmount = payments.filter((p) => p.status === "pending" || p.is_pending_booking).reduce((sum, p) => sum + Number(p.amount), 0)

  const handleOpenDetailsDialog = (payment: any) => {
    setSelectedPayment(payment)
    setSelectedBooking(payment.bookings)
    setShowDetailsDialog(true)
  }

  const handleCloseDetailsDialog = () => {
    setShowDetailsDialog(false)
    setSelectedPayment(null)
    setSelectedBooking(null)
    setExtraFees([])
    setShowTonsInput(false)
    setExtraTons("")
  }

  const handleOpenChargeDialog = () => {
    setShowDetailsDialog(false)
    setShowChargeDialog(true)
  }

  const handleCloseChargeDialog = () => {
    setShowChargeDialog(false)
    setExtraFees([])
    setShowTonsInput(false)
    setExtraTons("")
    // Return to details dialog
    if (selectedBooking) {
      setShowDetailsDialog(true)
    } else {
      setSelectedPayment(null)
      setSelectedBooking(null)
    }
  }

  const addFee = () => {
    const newFee: FeeItem = {
      id: Date.now().toString(),
      amount: 0,
      description: ""
    }
    setExtraFees([...extraFees, newFee])
  }

  const [showTonsInput, setShowTonsInput] = useState(false)
  const [extraTons, setExtraTons] = useState<string>("")

  const addTonsFee = () => {
    const tons = parseFloat(extraTons)
    if (isNaN(tons) || tons <= 0) {
      return
    }
    const amount = tons * 125
    const newFee: FeeItem = {
      id: Date.now().toString(),
      amount: amount,
      description: `Extra tonnage (${tons} tons @ $125/ton)`
    }
    setExtraFees([...extraFees, newFee])
    setExtraTons("")
    setShowTonsInput(false)
  }

  const removeFee = (id: string) => {
    setExtraFees(extraFees.filter(fee => fee.id !== id))
  }

  const updateFee = (id: string, field: keyof FeeItem, value: string | number) => {
    setExtraFees(extraFees.map(fee => 
      fee.id === id ? { ...fee, [field]: value } : fee
    ))
  }

  const getTotalAmount = () => {
    const bookingAmount = selectedBooking?.total_amount || 0
    const extraAmount = extraFees.reduce((sum, fee) => sum + fee.amount, 0)
    return bookingAmount + extraAmount
  }

  const getTotalFeesAmount = () => {
    return extraFees.reduce((sum, fee) => sum + fee.amount, 0)
  }

  const handleChargeCard = async () => {
    const bookingAmount = selectedBooking?.total_amount || 0
    const isPendingBooking = selectedPayment?.is_pending_booking
    const feesAmount = getTotalFeesAmount()
    
    // For initial charge: charge booking amount + fees
    // For additional charge: charge only the fees
    const chargeAmount = isPendingBooking ? getTotalAmount() : feesAmount

    if (chargeAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: isPendingBooking 
          ? "Total amount must be greater than $0"
          : "Please add fees to charge",
        variant: "destructive",
      })
      return
    }

    // Check if all fees have descriptions
    const incompleteFees = extraFees.filter(fee => fee.amount > 0 && !fee.description.trim())
    if (incompleteFees.length > 0) {
      toast({
        title: "Missing Descriptions",
        description: "Please enter descriptions for all fees with amounts",
        variant: "destructive",
      })
      return
    }

    setIsCharging(true)

    try {
      // Create description based on charge type
      let description = ""
      if (isPendingBooking) {
        // Initial charge: booking + fees
        description = `Booking charge: $${bookingAmount.toFixed(2)}`
        if (extraFees.length > 0) {
          const feesText = extraFees.map(fee => `${fee.description}: $${fee.amount.toFixed(2)}`).join(', ')
          description = `${description} + Extra fees: ${feesText}`
        }
      } else {
        // Additional charge: only fees
        if (extraFees.length > 0) {
          const feesText = extraFees.map(fee => `${fee.description}: $${fee.amount.toFixed(2)}`).join(', ')
          description = `Additional fees: ${feesText}`
        } else {
          throw new Error("No fees to charge")
        }
      }
      
      const response = await fetch('/api/charge-booking-card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId: selectedBooking.id,
          amount: chargeAmount,
          description: description,
          isInitialCharge: isPendingBooking,
          fees: extraFees,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to charge card')
      }

      console.log('✅ [Payment Tracker] Charge successful, response:', data)
      
      toast({
        title: "Charge Successful",
        description: `$${chargeAmount.toFixed(2)} charged successfully!`,
      })

      handleCloseChargeDialog()
      
      // Refresh data to show new payment (wait longer to ensure DB has committed)
      if (onRefresh) {
        console.log('🔄 [Payment Tracker] Refreshing payments data in 2 seconds...')
        setTimeout(() => {
          console.log('🔄 [Payment Tracker] Now fetching updated payments...')
          onRefresh()
        }, 2000)
      } else {
        // Fallback to page reload if no refresh function provided
        console.log('🔄 [Payment Tracker] Reloading page to show new payment...')
        setTimeout(() => {
          window.location.reload()
        }, 1000)
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
    <div className="space-y-4 sm:space-y-6 px-1 sm:px-0">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 px-3 sm:px-6">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-6">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs sm:text-xs text-muted-foreground">From completed payments</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 px-3 sm:px-6">
            <CardTitle className="text-xs sm:text-sm font-medium">Pending Payments</CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-6">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold">{formatCurrency(pendingAmount)}</div>
            <p className="text-xs sm:text-xs text-muted-foreground">Awaiting processing</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1">
          <CardHeader className="pb-2 px-3 sm:px-6">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Transactions</CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-6">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold">{payments.length}</div>
            <p className="text-xs sm:text-xs text-muted-foreground">All payment records</p>
          </CardContent>
        </Card>
      </div>

      {/* Payments List */}
      <Card className="shadow-sm">
        <CardHeader className="px-3 sm:px-6">
          <CardTitle className="text-base sm:text-lg lg:text-xl">Recent Payments</CardTitle>
          <CardDescription className="text-xs sm:text-sm">All payment transactions and their status</CardDescription>
        </CardHeader>
        <CardContent className="px-3 sm:px-6">
          {payments.length === 0 ? (
            <p className="text-gray-500 text-center py-6 sm:py-8 text-sm sm:text-base">No payments found</p>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {payments.map((payment) => (
                <div key={payment.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border rounded-lg hover:bg-gray-50 transition-colors gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col space-y-1 sm:space-y-2">
                      <p className="font-medium text-sm sm:text-base break-words">
                        {payment.bookings?.profiles?.full_name || payment.bookings?.profiles?.email || "Unknown User"}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600 break-words">
                        {payment.bookings?.container_types?.name} - {payment.bookings?.container_types?.size}
                      </p>
                      <p className="text-xs text-gray-500 font-mono break-all">Transaction: {payment.transaction_id}</p>
                      <p className="text-xs text-gray-500">{format(new Date(payment.created_at), "PPP 'at' p")}</p>
                    </div>
                  </div>
                  <div className="flex flex-row sm:flex-row items-start gap-3 sm:gap-4 flex-shrink-0">
                    <div className="text-left sm:text-right">
                      <p className="font-semibold text-sm sm:text-base">{formatCurrency(payment.amount)}</p>
                      <p className="text-xs text-gray-500 capitalize">{payment.payment_method?.replace("_", " ")}</p>
                      {payment.bookings?.payment_method_id && (
                        <p className="text-xs text-green-600 font-medium mt-1">Card on File</p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={`${getStatusColor(payment.status)} text-xs px-2 py-1 whitespace-nowrap`}>{payment.status}</Badge>
                        <Button
                          size="sm"
                          variant="outline"
                        onClick={() => handleOpenDetailsDialog(payment)}
                          className="text-xs h-7 px-2 border-blue-300 text-blue-600 hover:bg-blue-50 whitespace-nowrap"
                        >
                        <FileText className="h-3 w-3 mr-1" />
                        Show Details
                        </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Booking Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Booking & Payment Details</DialogTitle>
            <DialogDescription>
              Complete information for this booking and payment
            </DialogDescription>
          </DialogHeader>

          {selectedPayment && selectedBooking && (
            <div className="space-y-6 py-4">
              {/* Customer Information */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <span className="h-5 w-5 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs">1</span>
                  Customer Information
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-gray-500">Name</Label>
                      <p className="text-sm font-medium">{selectedBooking.profiles?.full_name || "N/A"}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Email</Label>
                      <p className="text-sm font-medium break-all">{selectedBooking.profiles?.email || "N/A"}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Phone</Label>
                      <p className="text-sm font-medium">{selectedBooking.profiles?.phone || "N/A"}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">User ID</Label>
                      <p className="text-sm font-mono text-xs">{selectedBooking.user_id}</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Booking Information */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <span className="h-5 w-5 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs">2</span>
                  Booking Information
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-gray-500">Container Type</Label>
                      <p className="text-sm font-medium">
                        {selectedBooking.container_types?.name || "N/A"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Container Size</Label>
                      <p className="text-sm font-medium">
                        {selectedBooking.container_types?.size || "N/A"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Start Date</Label>
                      <p className="text-sm font-medium">
                        {selectedBooking.start_date ? format(new Date(selectedBooking.start_date), "PPP") : "N/A"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">End Date</Label>
                      <p className="text-sm font-medium">
                        {selectedBooking.end_date ? format(new Date(selectedBooking.end_date), "PPP") : "N/A"}
                      </p>
                    </div>
                    {selectedBooking.pickup_time && (
                      <div className="col-span-2">
                        <Label className="text-xs text-gray-500">Pickup Time</Label>
                        <p className="text-sm font-medium">{selectedBooking.pickup_time}</p>
                      </div>
                    )}
                    <div className="col-span-2">
                      <Label className="text-xs text-gray-500">Service Type</Label>
                      <p className="text-sm font-medium capitalize">{selectedBooking.service_type || "N/A"}</p>
                    </div>
                    {selectedBooking.delivery_address && (
                      <div className="col-span-2">
                        <Label className="text-xs text-gray-500">Delivery Address</Label>
                        <p className="text-sm font-medium">{selectedBooking.delivery_address}</p>
                      </div>
                    )}
                    {selectedBooking.customer_address && (
                      <div className="col-span-2">
                        <Label className="text-xs text-gray-500">Customer Address</Label>
                        <p className="text-sm font-medium">{selectedBooking.customer_address}</p>
                      </div>
                    )}
                    <div>
                      <Label className="text-xs text-gray-500">Total Amount</Label>
                      <p className="text-sm font-semibold text-blue-600">{formatCurrency(selectedBooking.total_amount || 0)}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Status</Label>
                      <Badge className={`${getStatusColor(selectedBooking.status)} text-xs`}>
                        {selectedBooking.status || "N/A"}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Booking Created</Label>
                      <p className="text-sm font-medium">
                        {selectedBooking.created_at ? format(new Date(selectedBooking.created_at), "PPP 'at' p") : "N/A"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Booking ID</Label>
                      <p className="text-sm font-mono text-xs">{selectedBooking.id}</p>
                    </div>
                  </div>
                  {selectedBooking.notes && (
                    <div className="pt-2">
                      <Label className="text-xs text-gray-500">Booking Notes</Label>
                      <p className="text-sm text-gray-700 mt-1">{selectedBooking.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Pricing Breakdown */}
              {selectedBooking.pricing_breakdown && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                      <span className="h-5 w-5 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-xs">$</span>
                      Pricing Breakdown
                    </h3>
                    <div className="bg-green-50 rounded-lg p-4 space-y-2">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs text-gray-500">Base Price ({selectedBooking.pricing_breakdown.includedDays} days)</Label>
                          <p className="text-sm font-medium">{formatCurrency(selectedBooking.pricing_breakdown.basePrice)}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-gray-500">Total Days</Label>
                          <p className="text-sm font-medium">{selectedBooking.pricing_breakdown.totalDays} days</p>
                        </div>
                        {selectedBooking.pricing_breakdown.extraDays > 0 && (
                          <div>
                            <Label className="text-xs text-gray-500">Extra Days ({selectedBooking.pricing_breakdown.extraDays} x $25)</Label>
                            <p className="text-sm font-medium">{formatCurrency(selectedBooking.pricing_breakdown.extraDaysAmount)}</p>
                          </div>
                        )}
                        {selectedBooking.pricing_breakdown.extraTonnage > 0 && (
                          <div>
                            <Label className="text-xs text-gray-500">Extra Tonnage ({selectedBooking.pricing_breakdown.extraTonnage} x $125)</Label>
                            <p className="text-sm font-medium">{formatCurrency(selectedBooking.pricing_breakdown.extraTonnageAmount)}</p>
                          </div>
                        )}
                        {selectedBooking.pricing_breakdown.applianceCount > 0 && (
                          <div>
                            <Label className="text-xs text-gray-500">Appliances ({selectedBooking.pricing_breakdown.applianceCount} x $25)</Label>
                            <p className="text-sm font-medium">{formatCurrency(selectedBooking.pricing_breakdown.applianceAmount)}</p>
                          </div>
                        )}
                        {selectedBooking.pricing_breakdown.distanceFee > 0 && (
                          <div>
                            <Label className="text-xs text-gray-500">Distance Fee{selectedBooking.pricing_breakdown.distanceMiles ? ` (${selectedBooking.pricing_breakdown.distanceMiles.toFixed(1)} mi)` : ''}</Label>
                            <p className="text-sm font-medium">{formatCurrency(selectedBooking.pricing_breakdown.distanceFee)}</p>
                          </div>
                        )}
                        {selectedBooking.pricing_breakdown.travelFee > 0 && (
                          <div>
                            <Label className="text-xs text-gray-500">Travel Fee</Label>
                            <p className="text-sm font-medium">{formatCurrency(selectedBooking.pricing_breakdown.travelFee)}</p>
                          </div>
                        )}
                        {selectedBooking.pricing_breakdown.priceAdjustment !== 0 && (
                          <div className="col-span-2">
                            <Label className="text-xs text-gray-500">
                              {selectedBooking.pricing_breakdown.priceAdjustment < 0 ? 'Discount' : 'Additional Charge'}
                              {selectedBooking.pricing_breakdown.adjustmentReason ? ` (${selectedBooking.pricing_breakdown.adjustmentReason})` : ''}
                            </Label>
                            <p className={`text-sm font-medium ${selectedBooking.pricing_breakdown.priceAdjustment < 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {selectedBooking.pricing_breakdown.priceAdjustment < 0 ? '-' : '+'}{formatCurrency(Math.abs(selectedBooking.pricing_breakdown.priceAdjustment))}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="border-t border-green-200 mt-3 pt-3">
                        <div className="flex justify-between items-center">
                          <Label className="text-sm font-semibold text-gray-700">Total</Label>
                          <p className="text-lg font-bold text-green-600">{formatCurrency(selectedBooking.pricing_breakdown.total)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <Separator />

              {/* Payment Information */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <span className="h-5 w-5 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs">3</span>
                  Payment Information
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-gray-500">Amount</Label>
                      <p className="text-lg font-bold text-green-600">{formatCurrency(selectedPayment.amount)}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Status</Label>
                      <Badge className={`${getStatusColor(selectedPayment.status)} text-xs`}>
                        {selectedPayment.status}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Payment Method</Label>
                      <p className="text-sm font-medium capitalize">
                        {selectedPayment.payment_method?.replace("_", " ") || "N/A"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Payment Date</Label>
                      <p className="text-sm font-medium">
                        {format(new Date(selectedPayment.created_at), "PPP 'at' p")}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <Label className="text-xs text-gray-500">Transaction ID</Label>
                      <p className="text-xs font-mono break-all bg-white rounded px-2 py-1">
                        {selectedPayment.transaction_id}
                      </p>
                    </div>
                    {selectedPayment.notes && (
                      <div className="col-span-2">
                        <Label className="text-xs text-gray-500">Payment Notes</Label>
                        <p className="text-sm text-gray-700 mt-1">{selectedPayment.notes}</p>
                      </div>
                    )}
                    {selectedBooking.payment_method_id && (
                      <div className="col-span-2">
                        {selectedPayment?.is_pending_booking ? (
                          <div className="flex items-center gap-2 text-blue-600 bg-blue-50 rounded-lg p-3">
                            <CreditCard className="h-4 w-4" />
                            <div className="text-xs">
                              <p className="font-semibold">Card Saved - Ready to Charge</p>
                              <p className="text-blue-500 mt-0.5">This booking has not been charged yet. Add fees below if needed and charge the customer.</p>
                            </div>
                          </div>
                        ) : selectedBooking?.status !== "confirmed" && selectedBooking?.payment_status !== "paid" ? (
                          <div className="flex items-center gap-2 text-green-600 bg-green-50 rounded-lg p-2">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-xs font-medium">Card on File - Available for Additional Charges</span>
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Completion Message for Paid Bookings */}
          {selectedBooking?.status === "confirmed" && selectedBooking?.payment_status === "paid" && (
            <div className="pt-4 border-t">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <h3 className="text-sm font-semibold text-green-800">Booking Completed</h3>
                </div>
                <p className="text-sm text-green-700">
                  This booking has been fully paid and completed. No additional charges can be added.
                </p>
              </div>
            </div>
          )}

          {/* Add Fees Section (if booking has payment method and is not completed) */}
          {selectedBooking?.payment_method_id && selectedBooking?.status !== "confirmed" && selectedBooking?.payment_status !== "paid" && (
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-blue-600" />
                {selectedPayment?.is_pending_booking ? "Review & Add Fees (Optional)" : "Add Extra Fees"}
              </h3>
              
              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <Label className="text-sm font-medium">Extra Fees</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addFee}
                      className="h-8 px-3 text-xs"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Fee
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowTonsInput(!showTonsInput)}
                      className="h-8 px-3 text-xs"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Tons
                    </Button>
                  </div>
                </div>

                {/* Add Tons Input */}
                {showTonsInput && (
                  <div className="bg-white rounded-lg border p-3 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Add Extra Tonnage</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setShowTonsInput(false)
                          setExtraTons("")
                        }}
                        className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex gap-3 items-end">
                      <div className="flex-1 space-y-1">
                        <Label htmlFor="extra-tons" className="text-xs">Number of Extra Tons</Label>
                        <Input
                          id="extra-tons"
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="e.g., 1.5"
                          value={extraTons}
                          onChange={(e) => setExtraTons(e.target.value)}
                          className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                        />
                      </div>
                      <div className="text-sm text-gray-600 pb-2">
                        × $125/ton = <span className="font-semibold text-blue-600">${((parseFloat(extraTons) || 0) * 125).toFixed(2)}</span>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        onClick={addTonsFee}
                        disabled={!extraTons || parseFloat(extraTons) <= 0}
                        className="h-9 px-4"
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                )}

                {extraFees.length === 0 && !showTonsInput ? (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    No extra fees added yet. Click "Add Fee" or "Add Tons" to add charges.
                  </div>
                ) : extraFees.length === 0 ? null : (
                  <div className="space-y-3">
                    {extraFees.map((fee, index) => (
                      <div key={fee.id} className="bg-white rounded-lg border p-3 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Fee #{index + 1}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFee(fee.id)}
                            className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label htmlFor={`fee-amount-${fee.id}`} className="text-xs">Amount</Label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
                              <Input
                                id={`fee-amount-${fee.id}`}
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                value={fee.amount || ''}
                                onChange={(e) => updateFee(fee.id, 'amount', parseFloat(e.target.value) || 0)}
                                className="pl-8 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                              />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor={`fee-desc-${fee.id}`} className="text-xs">Description</Label>
                            <Input
                              id={`fee-desc-${fee.id}`}
                              type="text"
                              placeholder="e.g., Extra tonnage"
                              value={fee.description}
                              onChange={(e) => updateFee(fee.id, 'description', e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">Booking Amount:</span>
                      <span className="font-semibold">{formatCurrency(selectedBooking.total_amount || 0)}</span>
                    </div>
                    {extraFees.length > 0 && (
                      <>
                        {extraFees.map((fee, index) => (
                          <div key={fee.id} className="flex justify-between text-sm">
                            <span className="text-gray-600">Fee #{index + 1}: {fee.description || 'Unnamed'}</span>
                            <span className="font-semibold text-gray-600">{formatCurrency(fee.amount)}</span>
                          </div>
                        ))}
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-700">Total Extra Fees:</span>
                          <span className="font-semibold text-gray-700">{formatCurrency(getTotalFeesAmount())}</span>
                        </div>
                      </>
                    )}
                    <Separator />
                    <div className="flex justify-between text-base">
                      <span className="font-bold text-gray-900">Total to Charge:</span>
                      <span className="font-bold text-blue-600">{formatCurrency(getTotalAmount())}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2 pt-4">
            <Button
              variant="outline"
              onClick={handleCloseDetailsDialog}
              className="w-full sm:w-auto"
            >
              Close
            </Button>
            {selectedBooking?.payment_method_id && selectedBooking?.status !== "confirmed" && selectedBooking?.payment_status !== "paid" && (
              <Button
                onClick={handleOpenChargeDialog}
                disabled={extraFees.some(fee => fee.amount > 0 && !fee.description.trim())}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
              >
                <DollarSign className="h-4 w-4 mr-2" />
                {selectedPayment?.is_pending_booking ? "Proceed to Charge" : "Proceed to Charge"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Charge Confirmation Dialog */}
      <Dialog open={showChargeDialog} onOpenChange={setShowChargeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              Confirm Charge
            </DialogTitle>
            <DialogDescription>
              Review the charge details and confirm to process the payment
            </DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-4 py-4">
              <div className="space-y-3 bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Customer:</span>
                  <span className="font-medium text-gray-900">
                  {selectedBooking.profiles?.full_name || selectedBooking.profiles?.email}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Container:</span>
                  <span className="font-medium text-gray-900">
                    {selectedBooking.container_types?.name}
                  </span>
                </div>
              </div>

              <Separator />

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">Booking Amount:</span>
                    <span className="font-semibold">{formatCurrency(selectedBooking.total_amount || 0)}</span>
                  </div>
                  {extraFees.length > 0 && (
                    <>
                      {extraFees.map((fee, index) => (
                        <div key={fee.id} className="flex justify-between text-sm">
                          <span className="text-gray-700">Fee #{index + 1}: {fee.description || 'Unnamed'}</span>
                          <span className="font-semibold text-gray-700">{formatCurrency(fee.amount)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-700">Total Extra Fees:</span>
                        <span className="font-semibold text-gray-700">{formatCurrency(getTotalFeesAmount())}</span>
                      </div>
                    </>
                  )}
                  <Separator />
                  <div className="flex justify-between text-lg">
                    <span className="font-bold text-gray-900">
                      {selectedPayment?.is_pending_booking ? "Total Charge:" : "Additional Charge:"}
                    </span>
                    <span className="font-bold text-blue-600">
                      {formatCurrency(selectedPayment?.is_pending_booking ? getTotalAmount() : getTotalFeesAmount())}
                    </span>
                  </div>
              </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-yellow-800">
                  The customer will be charged {formatCurrency(selectedPayment?.is_pending_booking ? getTotalAmount() : getTotalFeesAmount())} immediately and will receive a receipt via email.
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCloseChargeDialog}
              disabled={isCharging}
            >
              Cancel
            </Button>
            <Button
              onClick={handleChargeCard}
              disabled={isCharging || getTotalAmount() <= 0}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isCharging ? "Processing..." : `Confirm & Charge ${formatCurrency(selectedPayment?.is_pending_booking ? getTotalAmount() : getTotalFeesAmount())}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
