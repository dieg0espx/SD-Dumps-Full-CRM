"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { CalendarIcon, Plus, CreditCard, Wallet, Building, CheckCircle, AlertCircle, ArrowRight } from "lucide-react"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import { formatPhoneNumber } from "@/lib/phone-utils"
import { StripeElements } from "@/components/stripe-elements"

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

interface AdminBookingFormProps {
  containerTypes: any[]
  users: any[]
}

export function AdminBookingForm({ containerTypes, users }: AdminBookingFormProps) {
  const [selectedUser, setSelectedUser] = useState("")
  const [containerType, setContainerType] = useState("")
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [serviceType, setServiceType] = useState("")
  const [customerAddress, setCustomerAddress] = useState("")
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)
  
  // Payment states
  const [paymentMethod, setPaymentMethod] = useState("stripe")
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "completed" | "failed">("pending")
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [currentStep, setCurrentStep] = useState<"booking" | "payment">("booking")
  const [createdBooking, setCreatedBooking] = useState<any>(null)

  const supabase = createClient()
  const router = useRouter()

  const selectedContainer = containerTypes.find((c) => c.id === containerType)
  const selectedUserData = users.find((u) => u.id === selectedUser)

  const calculateTotal = () => {
    if (!selectedContainer || !startDate || !endDate) return 0
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    return selectedContainer.price_per_day * Math.max(1, days)
  }


  const simulatePayment = async () => {
    // Simulate payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Simulate 95% success rate
    const isSuccess = Math.random() > 0.05

    if (!isSuccess) {
      throw new Error("Payment failed. Please try again.")
    }

    return {
      transaction_id: `admin_txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: "completed",
    }
  }

  const processPayment = async () => {
    setPaymentError(null)
    setPaymentStatus("pending")
    
    try {
      const paymentResult = await simulatePayment()
      setPaymentStatus("completed")
      return paymentResult
    } catch (error) {
      setPaymentStatus("failed")
      setPaymentError(error instanceof Error ? error.message : "Payment failed")
      throw error
    }
  }

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUser || !containerType || !startDate || !endDate || !serviceType || !customerAddress) {
      return
    }

    setLoading(true)
    try {
      const totalAmount = calculateTotal()

      const { data: booking, error: bookingError } = await supabase
        .from("bookings")
        .insert({
          user_id: selectedUser,
          container_type_id: containerType,
          start_date: startDate.toISOString().split("T")[0],
          end_date: endDate.toISOString().split("T")[0],
          service_type: serviceType,
          customer_address: customerAddress,
          delivery_address: serviceType === "delivery" ? deliveryAddress : null,
          total_amount: totalAmount,
          status: "pending",
          payment_status: "pending",
          notes: notes || null,
        })
        .select()
        .single()

      if (bookingError) throw bookingError

      setCreatedBooking(booking)
      
      // Move to payment step if payment processing is enabled
      if (showPaymentForm) {
        setCurrentStep("payment")
      } else {
        // Redirect to admin dashboard if no payment processing
        router.push("/admin")
      }
    } catch (error) {
      console.error("Error creating booking:", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!createdBooking) return

    setLoading(true)
    try {
      // Process payment
      const paymentResult = await processPayment()

      // Create payment record
      await supabase.from("payments").insert({
        booking_id: createdBooking.id,
        amount: createdBooking.total_amount,
        status: paymentResult.status,
        payment_method: paymentMethod,
        transaction_id: paymentResult.transaction_id,
      })

      // Update booking status to confirmed
      await supabase
        .from("bookings")
        .update({
          status: "confirmed",
          payment_status: "paid",
          updated_at: new Date().toISOString(),
        })
        .eq("id", createdBooking.id)

      // Send booking confirmation emails
      try {
        await fetch('/api/send-booking-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            bookingId: createdBooking.id,
            customerName: selectedUserData?.full_name || selectedUserData?.email?.split('@')[0] || 'Customer',
            customerEmail: selectedUserData?.email,
            containerType: selectedContainer?.size || 'Container',
            startDate: format(startDate as Date, "MMMM dd, yyyy"),
            endDate: format(endDate as Date, "MMMM dd, yyyy"),
            serviceType: serviceType,
            totalAmount: createdBooking.total_amount,
            deliveryAddress: serviceType === "delivery" ? deliveryAddress : null,
            notes: notes.trim() || undefined,
          }),
        })
        console.log('✅ Booking confirmation emails sent')
      } catch (emailError) {
        console.error('⚠️ Email sending failed (non-critical):', emailError)
        // Don't throw error - email failure shouldn't stop the booking process
      }

      // Redirect to admin dashboard after successful payment
      setTimeout(() => {
        router.push("/admin")
      }, 2000)
    } catch (error) {
      console.error("Payment error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleBackToBooking = () => {
    setCurrentStep("booking")
    setPaymentStatus("pending")
    setPaymentError(null)
  }

  if (currentStep === "payment" && createdBooking) {
    return (
      <div className="space-y-6">
        {/* Progress Indicator */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">✓</div>
            <span className="text-sm font-medium">Booking Created</span>
          </div>
          <div className="w-8 h-1 bg-gray-300"></div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">6</div>
            <span className="text-sm font-medium">Payment Processing</span>
          </div>
        </div>

        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Customer:</span>
                <span>{selectedUserData?.full_name}</span>
              </div>
              <div className="flex justify-between">
                <span>Container:</span>
                <span>{selectedContainer?.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Rental Period:</span>
                <span>
                  {startDate && endDate ? (
                    <>
                      {format(startDate, "MMM dd")} - {format(endDate, "MMM dd, yyyy")}
                    </>
                  ) : (
                    "Invalid dates"
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Duration:</span>
                <span>{Math.ceil((endDate!.getTime() - startDate!.getTime()) / (1000 * 60 * 60 * 24))} days</span>
              </div>
              <div className="flex justify-between">
                <span>Service:</span>
                <span className="capitalize">{serviceType}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total:</span>
                <span>{formatCurrency(calculateTotal())}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Status */}
        {paymentStatus === "completed" && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 text-green-800">
                <CheckCircle className="h-6 w-6" />
                <div>
                  <h3 className="font-semibold">Payment Successful!</h3>
                  <p className="text-sm">Booking has been confirmed and payment processed.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {paymentStatus === "failed" && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 text-red-800">
                <AlertCircle className="h-6 w-6" />
                <div>
                  <h3 className="font-semibold">Payment Failed</h3>
                  <p className="text-sm">{paymentError}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payment Form */}
        {paymentStatus === "pending" && (
          <Card>
            <CardHeader>
              <CardTitle>Step 6: Payment Processing</CardTitle>
              <CardDescription>Complete the payment to confirm the booking</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePaymentSubmit} className="space-y-6">
                {/* Payment Method Selection */}
                <div className="space-y-3">
                  <Label>Payment Method</Label>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-3 p-3 border rounded-lg">
                      <RadioGroupItem value="stripe" id="stripe" />
                      <Label htmlFor="stripe" className="flex items-center cursor-pointer flex-1">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Credit/Debit Card
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-3 border rounded-lg">
                      <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                      <Label htmlFor="bank_transfer" className="flex items-center cursor-pointer flex-1">
                        <Building className="mr-2 h-4 w-4" />
                        Bank Transfer
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Stripe Elements */}
                {paymentMethod === "stripe" && (
                  <StripeElements
                    amount={calculateTotal()}
                    bookingId="temp"
                    bookingData={{
                      container_type_id: containerType,
                      start_date: startDate?.toISOString(),
                      end_date: endDate?.toISOString(),
                      service_type: serviceType,
                      customer_address: customerAddress,
                      delivery_address: serviceType === 'delivery' ? deliveryAddress : null,
                      total_amount: calculateTotal(),
                      pickup_time: "09:00",
                      notes: notes,
                    }}
                    onSuccess={() => {
                      setPaymentStatus("completed")
                      setCurrentStep("payment")
                    }}
                    onError={(error) => setPaymentError(error)}
                  />
                )}



                {paymentMethod === "bank_transfer" && (
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800">
                      Bank transfer details will be provided after booking confirmation.
                    </p>
                  </div>
                )}

                {paymentError && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{paymentError}</div>}

                <div className="flex justify-between pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleBackToBooking}
                    className="flex items-center gap-2"
                  >
                    ← Back to Booking
                  </Button>
                  <Button type="submit" size="lg" disabled={loading}>
                    {loading ? "Processing Payment..." : `Complete Payment - ${formatCurrency(calculateTotal())}`}
                  </Button>
                </div>

              </form>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={handleCreateBooking} className="space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1-5</div>
          <span className="text-sm font-medium">Booking Details</span>
        </div>
        <div className="w-8 h-1 bg-gray-300"></div>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">6</div>
          <span className="text-sm font-medium text-gray-500">Payment</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="user">Select Customer</Label>
              <Select value={selectedUser} onValueChange={setSelectedUser} required>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a customer" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.full_name} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedUserData && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm">
                  <strong>Email:</strong> {selectedUserData.email}
                </p>
                {selectedUserData.phone && (
                  <p className="text-sm">
                    <strong>Phone:</strong> {formatPhoneNumber(selectedUserData.phone)}
                  </p>
                )}
                {selectedUserData.company && (
                  <p className="text-sm">
                    <strong>Company:</strong> {selectedUserData.company}
                  </p>
                )}
              </div>
            )}

            <div>
              <Label htmlFor="customer-address">Customer Address</Label>
              <Textarea
                id="customer-address"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                placeholder="Enter customer's billing address"
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Booking Details */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="container">Container Type</Label>
              <Select value={containerType} onValueChange={setContainerType} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select container type" />
                </SelectTrigger>
                <SelectContent>
                  {containerTypes.map((container) => (
                    <SelectItem key={container.id} value={container.id}>
                      {container.name} - {formatCurrency(container.price_per_day)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Pick start date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : "Pick end date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      disabled={(date) => date < (startDate || new Date())}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div>
              <Label htmlFor="service-type">Service Type</Label>
              <Select value={serviceType} onValueChange={setServiceType} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select service type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pickup">Customer Pickup</SelectItem>
                  <SelectItem value="delivery">Delivery Service</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {serviceType === "delivery" && (
              <div>
                <Label htmlFor="delivery-address">Delivery Address</Label>
                <Textarea
                  id="delivery-address"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Enter delivery address"
                  required
                />
              </div>
            )}

            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special instructions or notes"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Summary */}
      {selectedContainer && startDate && endDate && (
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>{selectedContainer.name}</span>
                <span>{formatCurrency(selectedContainer.price_per_day)}</span>
              </div>
              <div className="flex justify-between">
                <span>Duration</span>
                <span>{Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))} days</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total</span>
                <span>{formatCurrency(calculateTotal())}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Processing Option */}
      {selectedContainer && startDate && endDate && (
        <Card>
          <CardHeader>
            <CardTitle>Step 6: Payment Processing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="process-payment"
                checked={showPaymentForm}
                onChange={(e) => setShowPaymentForm(e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="process-payment">Process payment to confirm booking</Label>
            </div>
            
            {showPaymentForm && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  After creating the booking, you will proceed to step 6 to process payment and confirm the order.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          {loading ? "Creating..." : showPaymentForm ? "Create Booking & Continue to Payment" : "Create Booking"}
        </Button>
      </div>
    </form>
  )
}
