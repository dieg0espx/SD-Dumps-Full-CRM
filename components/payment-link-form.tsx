"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  CalendarIcon,
  MapPin,
  Truck,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Info,
  Clock,
} from "lucide-react"
import { format } from "date-fns"
import { StripePaymentLinkForm } from "@/components/stripe-payment-link-form"
import { SignaturePad } from "@/components/signature-pad"
import { uploadSignatureToCloudinary } from "@/lib/cloudinary"
import { extractBase64FromDataUrl } from "@/lib/signature-utils"

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

interface PaymentLinkFormProps {
  paymentLink: any
}

export function PaymentLinkForm({ paymentLink }: PaymentLinkFormProps) {
  const [currentStep, setCurrentStep] = useState<"review" | "payment" | "signature" | "success">("review")
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null)
  const [paymentMethodId, setPaymentMethodId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const booking = paymentLink.bookings as any
  const containerType = booking.container_types

  const expiresAt = new Date(paymentLink.expires_at)
  const daysUntilExpiry = Math.ceil((expiresAt.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [currentStep])

  const handleSignatureComplete = (dataUrl: string) => {
    setSignatureDataUrl(dataUrl)
  }

  const handleSignatureClear = () => {
    setSignatureDataUrl(null)
  }

  const handlePaymentSuccess = (pmId: string) => {
    setPaymentMethodId(pmId)
    setCurrentStep("signature")
  }

  const handleSubmit = async () => {
    if (!signatureDataUrl || !paymentMethodId) {
      setError("Please complete all steps")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Upload signature to Cloudinary
      const base64Data = extractBase64FromDataUrl(signatureDataUrl)
      const booking = paymentLink.bookings as any
      const signatureUrl = await uploadSignatureToCloudinary(base64Data, booking.id)

      // Complete the booking
      const response = await fetch("/api/payment-link/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: paymentLink.token,
          paymentMethodId,
          signatureUrl,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to complete booking")
      }

      setCurrentStep("success")
    } catch (err) {
      console.error("Error completing booking:", err)
      setError(err instanceof Error ? err.message : "Failed to complete booking")
    } finally {
      setLoading(false)
    }
  }

  // Success screen
  if (currentStep === "success") {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <CardTitle className="text-3xl">Booking Confirmed!</CardTitle>
            <CardDescription className="text-base">
              Your payment information has been saved successfully
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert className="bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-900">Important Notice</AlertTitle>
              <AlertDescription className="text-blue-800">
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li>Your card has been saved but <strong>NOT charged yet</strong></li>
                  <li>You'll be charged when your rental period begins</li>
                  <li>You'll receive a receipt via email when charged</li>
                  <li>Our team will contact you 24 hours before your scheduled date</li>
                </ul>
              </AlertDescription>
            </Alert>

            <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg">Booking Summary</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-600">Booking ID</p>
                  <p className="font-medium">#{booking.id.slice(0, 8)}</p>
                </div>
                <div>
                  <p className="text-gray-600">Container</p>
                  <p className="font-medium">{containerType.name}</p>
                </div>
                <div>
                  <p className="text-gray-600">Start Date</p>
                  <p className="font-medium">{format(new Date(booking.start_date), "PPP")}</p>
                </div>
                <div>
                  <p className="text-gray-600">End Date</p>
                  <p className="font-medium">{format(new Date(booking.end_date), "PPP")}</p>
                </div>
                <div>
                  <p className="text-gray-600">Total Amount</p>
                  <p className="font-medium text-green-600">{formatCurrency(booking.total_amount)}</p>
                </div>
              </div>
            </div>

            <p className="text-center text-gray-600">
              A confirmation email has been sent to <strong>{paymentLink.customer_email}</strong>
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Signature step
  if (currentStep === "signature") {
    const booking = paymentLink.bookings as any
    const containerType = booking.container_types

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Rental Agreement */}
        <Card>
          <CardHeader className="border-b border-gray-200 bg-gray-50">
            <CardTitle className="text-2xl">Container Rental Agreement</CardTitle>
            <CardDescription className="text-base">
              Please read the following terms and conditions carefully before signing
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="prose max-w-none space-y-4 text-sm text-gray-700">
              {/* Rental Details Section */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-lg text-blue-900 mb-3">Rental Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Container Type:</span>
                    <span className="ml-2 text-gray-900">{containerType.size}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Rental Period:</span>
                    <span className="ml-2 text-gray-900">
                      {format(new Date(booking.start_date), "MMM dd")} - {format(new Date(booking.end_date), "MMM dd, yyyy")}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Service Type:</span>
                    <span className="ml-2 text-gray-900 capitalize">{booking.service_type}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Total Amount:</span>
                    <span className="ml-2 text-gray-900 font-semibold">{formatCurrency(booking.total_amount)}</span>
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="space-y-3 mt-4">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">Terms of Lease</h3>

                <div className="space-y-3">
                  <p className="text-gray-700 leading-relaxed">
                    San Diego Dumping Solutions will provide dumpster disposal service using our roll-off containers.
                    Service will be provided on the day requested when using our online ordering software.
                    Additional days on your rental period will be $25 Per Day, starting on the 4th day until the roll-off is picked up.
                  </p>

                  <div>
                    <h4 className="font-semibold text-gray-900">Additional Charges:</h4>
                    <p className="text-gray-700 leading-relaxed">
                      All customers are responsible for the total weight of the contents of their dumpster(s).
                      All customers are responsible for scheduling the removal of their dumpster(s).
                      All customers are responsible for ensuring their dumpster(s) are not overloaded.
                      Customers shall inspect the dumpster upon delivery for any existing damage.
                      Upon removal of the dumpster, San Diego Dumping Solutions shall be entitled to charge the customer
                      for the repair or replacement costs attributable to any damage to the dumpster while in the customer's possession.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900">Weight Allowance:</h4>
                    <p className="text-gray-700 leading-relaxed">
                      Exceeding stated weight allowance will result in an additional charge of $125 per ton
                    </p>
                    <ul className="list-disc list-inside text-gray-700 ml-4 mt-2">
                      <li>17 yard - 4,000 lbs included ($125 per additional 2,000 pounds)</li>
                      <li>21 yard - 4,000 lbs included ($125 per additional 2,000 pounds)</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900">Additional Service Charges:</h4>
                    <ul className="list-disc list-inside text-gray-700 ml-4">
                      <li>Mattresses and box springs will be $25 additional, each</li>
                      <li>Appliances will be $25 additional, each</li>
                      <li>Electronics will be $25 additional, each</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900">Prohibited Waste:</h4>
                    <p className="text-gray-700 leading-relaxed">
                      Non-Hazardous Solid Waste Only. Customer agrees not to put any waste that is liquid, radioactive,
                      volatile, corrosive, highly flammable, explosive, biomedical, toxic, and/or any hazardous wastes or
                      substances into roll-off containers.
                    </p>
                  </div>
                </div>
              </div>

              {/* Agreement Statement */}
              <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-300 mt-6">
                <p className="font-semibold text-gray-900">
                  By signing below, I acknowledge that I have read and agree to all terms listed in this contract.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Digital Signature */}
        <Card>
          <CardHeader>
            <CardTitle>Digital Signature</CardTitle>
            <CardDescription>
              Please sign below to confirm your agreement
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <SignaturePad
              onSignatureComplete={handleSignatureComplete}
              onClear={handleSignatureClear}
              disabled={loading}
            />

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setCurrentStep("payment")}
                disabled={loading}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!signatureDataUrl || loading}
                className="flex-1"
              >
                {loading ? "Processing..." : "Complete Booking"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Payment step
  if (currentStep === "payment") {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Step 2: Save Payment Method</CardTitle>
            <CardDescription>
              Enter your card details to securely save for later charging
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-6 bg-yellow-50 border-yellow-200">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertTitle className="text-yellow-900">Your Card Will NOT Be Charged Yet</AlertTitle>
              <AlertDescription className="text-yellow-800">
                We're only saving your card information. You'll be charged when your rental begins.
              </AlertDescription>
            </Alert>

            <StripePaymentLinkForm
              onSuccess={handlePaymentSuccess}
            />

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              variant="outline"
              onClick={() => setCurrentStep("review")}
              className="w-full mt-4"
            >
              Back to Review
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Review step (default)
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Complete Your Booking</CardTitle>
          <CardDescription className="text-base">
            Review your booking details and save your payment information
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Expiry Warning */}
      {daysUntilExpiry <= 2 && (
        <Alert variant="destructive">
          <Clock className="h-4 w-4" />
          <AlertTitle>Link Expiring Soon!</AlertTitle>
          <AlertDescription>
            This link expires in {daysUntilExpiry} day{daysUntilExpiry !== 1 ? "s" : ""} on{" "}
            {format(expiresAt, "PPP")}. Please complete your booking soon.
          </AlertDescription>
        </Alert>
      )}

      {/* Customer Info */}
      <Card>
        <CardHeader>
          <CardTitle>Your Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label className="text-gray-600">Name</Label>
            <p className="font-medium">{paymentLink.customer_name}</p>
          </div>
          <div>
            <Label className="text-gray-600">Email</Label>
            <p className="font-medium">{paymentLink.customer_email}</p>
          </div>
          <div>
            <Label className="text-gray-600">Phone</Label>
            <p className="font-medium">{paymentLink.customer_phone}</p>
          </div>
        </CardContent>
      </Card>

      {/* Container Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Container Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label className="text-gray-600">Container Type</Label>
            <p className="font-medium text-lg">{containerType.name}</p>
            <p className="text-sm text-gray-600">{containerType.size}</p>
          </div>
          <div>
            <Label className="text-gray-600">Description</Label>
            <p className="text-sm text-gray-700">{containerType.description}</p>
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-600">Service Type</Label>
              <p className="font-medium capitalize">{booking.service_type}</p>
            </div>
            <div>
              <Label className="text-gray-600">Pickup/Delivery Time</Label>
              <p className="font-medium">{booking.pickup_time}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rental Period */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Rental Period
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-600">Start Date</Label>
              <p className="font-medium">{format(new Date(booking.start_date), "PPP")}</p>
            </div>
            <div>
              <Label className="text-gray-600">End Date</Label>
              <p className="font-medium">{format(new Date(booking.end_date), "PPP")}</p>
            </div>
          </div>
          <div>
            <Label className="text-gray-600">Duration</Label>
            <p className="font-medium">
              {Math.ceil(
                (new Date(booking.end_date).getTime() - new Date(booking.start_date).getTime()) /
                  (1000 * 60 * 60 * 24)
              )}{" "}
              days
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Addresses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Address Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label className="text-gray-600">Billing Address</Label>
            <p className="font-medium">{booking.customer_address}</p>
          </div>
          {booking.delivery_address && (
            <div>
              <Label className="text-gray-600">Delivery Address</Label>
              <p className="font-medium">{booking.delivery_address}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Options */}
      {(booking.extra_tonnage || booking.appliance_count || booking.notes) && (
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {booking.extra_tonnage && (
              <div>
                <Label className="text-gray-600">Extra Tonnage</Label>
                <p className="font-medium">{booking.extra_tonnage} tons</p>
              </div>
            )}
            {booking.appliance_count && (
              <div>
                <Label className="text-gray-600">Number of Appliances</Label>
                <p className="font-medium">{booking.appliance_count}</p>
              </div>
            )}
            {booking.notes && (
              <div>
                <Label className="text-gray-600">Special Notes</Label>
                <p className="text-sm text-gray-700">{booking.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Total */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center text-2xl font-bold">
            <span>Total Amount:</span>
            <span className="text-green-600">{formatCurrency(booking.total_amount)}</span>
          </div>
          <Alert className="mt-4 bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              Your card will be saved securely but <strong>NOT charged until your rental begins</strong>.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Continue Button */}
      <Button onClick={() => setCurrentStep("payment")} size="lg" className="w-full">
        Continue to Payment
      </Button>

      {/* Footer Info */}
      <p className="text-center text-sm text-gray-500">
        By continuing, you agree to our terms and conditions. Link expires on{" "}
        {format(expiresAt, "PPP")}
      </p>
    </div>
  )
}
