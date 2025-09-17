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
import { CreditCard, Wallet, Building, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react"
import { format, differenceInDays, isValid, parseISO } from "date-fns"
import { useRouter } from "next/navigation"
import { formatPhoneNumber } from "@/lib/phone-utils"

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

interface AdminPaymentFormProps {
  booking: any
}

export function AdminPaymentForm({ booking }: AdminPaymentFormProps) {
  const [paymentMethod, setPaymentMethod] = useState("credit_card")
  const [cardNumber, setCardNumber] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [cardName, setCardName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "completed" | "failed">("pending")

  const router = useRouter()
  const supabase = createClient()

  const parseDate = (dateString: string) => {
    if (!dateString) return null
    const date = typeof dateString === "string" ? parseISO(dateString) : new Date(dateString)
    return isValid(date) ? date : null
  }

  const startDate = parseDate(booking.start_date)
  const endDate = parseDate(booking.end_date)
  const totalDays = startDate && endDate ? differenceInDays(endDate, startDate) + 1 : 1

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setPaymentStatus("pending")

    try {
      // Simulate payment processing
      const paymentResult = await simulatePayment()

      // Create payment record
      const { error: paymentError } = await supabase.from("payments").insert({
        booking_id: booking.id,
        amount: booking.total_amount,
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

      setPaymentStatus("completed")

      // Redirect to admin dashboard after successful payment
      setTimeout(() => {
        router.push("/admin")
      }, 2000)
    } catch (error: unknown) {
      console.error("Payment error:", error)
      setPaymentStatus("failed")
      setError(error instanceof Error ? error.message : "Payment failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
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
              <span>Customer:</span>
              <span>{booking.profiles?.full_name}</span>
            </div>
            <div className="flex justify-between">
              <span>Container:</span>
              <span>{booking.container_types?.name}</span>
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
              <span className="capitalize">{booking.service_type}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total:</span>
              <span>{formatCurrency(booking.total_amount || 0)}</span>
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
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Form */}
      {paymentStatus === "pending" && (
        <Card>
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
            <CardDescription>Choose payment method and enter details</CardDescription>
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
                    Payment will be processed through PayPal.
                  </p>
                </div>
              )}

              {paymentMethod === "bank_transfer" && (
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    Bank transfer details will be provided after booking confirmation.
                  </p>
                </div>
              )}

              {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{error}</div>}

              <div className="flex justify-between pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => router.push("/admin/bookings")}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Bookings
                </Button>
                <Button type="submit" size="lg" disabled={isLoading}>
                  {isLoading ? "Processing Payment..." : `Process Payment - ${formatCurrency(booking.total_amount || 0)}`}
                </Button>
              </div>

              <div className="text-xs text-gray-500 text-center">
                <p>No real payment will be processed.</p>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
