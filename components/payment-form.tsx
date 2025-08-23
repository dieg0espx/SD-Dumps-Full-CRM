"use client"

import type React from "react"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Wallet, Building } from "lucide-react"
import { format, differenceInDays, isValid, parseISO } from "date-fns"
import { useRouter } from "next/navigation"

interface PaymentFormProps {
  bookingData: any
}

export function PaymentForm({ bookingData }: PaymentFormProps) {
  const [paymentMethod, setPaymentMethod] = useState("credit_card")
  const [cardNumber, setCardNumber] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [cardName, setCardName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const supabase = createClient()

  const parseDate = (dateString: string) => {
    if (!dateString) return null
    const date = typeof dateString === "string" ? parseISO(dateString) : new Date(dateString)
    return isValid(date) ? date : null
  }

  const startDate = parseDate(bookingData.start_date)
  const endDate = parseDate(bookingData.end_date)

  const totalDays = startDate && endDate ? differenceInDays(endDate, startDate) + 1 : 1

  if (!startDate || !endDate) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <p>Invalid booking data. Please go back and try again.</p>
            <Button onClick={() => router.push("/booking")} className="mt-4">
              Back to Booking
            </Button>
          </div>
        </CardContent>
      </Card>
    )
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
      transaction_id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: "completed",
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      console.log("[v0] Creating booking with data:", bookingData)

      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("User not authenticated")

      // Update user profile with phone number if provided
      if (bookingData.phone) {
        await supabase.from("profiles").update({ phone: bookingData.phone }).eq("id", user.id)
      }

      // Create the booking
      const { data: booking, error: bookingError } = await supabase
        .from("bookings")
        .insert({
          user_id: user.id,
          container_type_id: bookingData.container_type_id,
          start_date: bookingData.start_date,
          end_date: bookingData.end_date,
          service_type: bookingData.service_type,
          customer_address: bookingData.customer_address,
          delivery_address: bookingData.delivery_address,
          total_amount: bookingData.total_amount,
          pickup_time: bookingData.pickup_time,
          notes: bookingData.notes,
          status: "pending",
          payment_status: "pending",
        })
        .select()
        .single()

      if (bookingError) throw bookingError

      console.log("[v0] Booking created:", booking)

      // Simulate payment processing
      const paymentResult = await simulatePayment()

      // Create payment record
      const { error: paymentError } = await supabase.from("payments").insert({
        booking_id: booking.id,
        amount: bookingData.total_amount,
        payment_method: paymentMethod,
        transaction_id: paymentResult.transaction_id,
        status: paymentResult.status,
      })

      if (paymentError) throw paymentError

      // Update booking status
      const { error: updateError } = await supabase
        .from("bookings")
        .update({
          payment_status: "paid",
          status: "confirmed",
          updated_at: new Date().toISOString(),
        })
        .eq("id", booking.id)

      if (updateError) throw updateError

      // Clear localStorage
      localStorage.removeItem("pendingBooking")

      // Redirect to success page
      router.push(`/payment/${booking.id}/success`)
    } catch (error: unknown) {
      console.error("[v0] Payment error:", error)
      setError(error instanceof Error ? error.message : "Payment failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return v
    }
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`
    }
    return v
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Container:</span>
              <span>Container - {bookingData.container_type_id}</span>
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
              <span>{totalDays} days</span>
            </div>
            <div className="flex justify-between">
              <span>Service:</span>
              <span className="capitalize">{bookingData.service_type}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total:</span>
              <span>{formatCurrency(bookingData.totalAmount)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Form */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Information</CardTitle>
          <CardDescription>Choose your payment method and enter details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Payment Method Selection */}
            <div className="space-y-3">
              <Label>Payment Method</Label>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <RadioGroupItem value="credit_card" id="credit_card" />
                  <Label htmlFor="credit_card" className="flex items-center cursor-pointer flex-1">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Credit/Debit Card
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <RadioGroupItem value="paypal" id="paypal" />
                  <Label htmlFor="paypal" className="flex items-center cursor-pointer flex-1">
                    <Wallet className="mr-2 h-4 w-4" />
                    PayPal
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

            {/* Credit Card Form */}
            {paymentMethod === "credit_card" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardName">Cardholder Name</Label>
                  <Input
                    id="cardName"
                    placeholder="John Doe"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    maxLength={19}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      placeholder="MM/YY"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                      maxLength={5}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                      maxLength={4}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Alternative Payment Methods */}
            {paymentMethod === "paypal" && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  You will be redirected to PayPal to complete your payment securely.
                </p>
              </div>
            )}

            {paymentMethod === "bank_transfer" && (
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">
                  Bank transfer details will be provided after confirming your booking.
                </p>
              </div>
            )}

            {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{error}</div>}

            <div className="pt-4">
              <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                {isLoading ? "Processing Payment..." : `Pay ${formatCurrency(bookingData.totalAmount)}`}
              </Button>
            </div>

            <div className="text-xs text-gray-500 text-center">
              <p>🔒 This is a simulated payment system for demonstration purposes.</p>
              <p>No real payment will be processed.</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
