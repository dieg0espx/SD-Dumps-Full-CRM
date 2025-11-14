"use client"

import type React from "react"
import { useState, useEffect } from "react"
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
import {
  CalendarIcon,
  Phone,
  Mail,
  User,
  MapPin,
  Truck,
  CheckCircle2,
  Copy,
  Check,
  AlertCircle,
  Link as LinkIcon
} from "lucide-react"
import { format, eachDayOfInterval, isSameDay, addDays } from "date-fns"
import { useRouter } from "next/navigation"
import { formatPhoneNumber } from "@/lib/phone-utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { DayProps } from "react-day-picker"

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

interface PhoneBookingFormProps {
  containerTypes: any[]
}

export function PhoneBookingForm({ containerTypes }: PhoneBookingFormProps) {
  // Customer Info
  const [customerName, setCustomerName] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")

  // Booking Details
  const [containerType, setContainerType] = useState("")
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [serviceType, setServiceType] = useState("pickup")
  const [pickupTime, setPickupTime] = useState("09:00")

  // Addresses
  const [billingStreet, setBillingStreet] = useState("")
  const [billingCity, setBillingCity] = useState("")
  const [billingState, setBillingState] = useState("")
  const [billingZip, setBillingZip] = useState("")
  const [deliveryStreet, setDeliveryStreet] = useState("")
  const [deliveryCity, setDeliveryCity] = useState("")
  const [deliveryState, setDeliveryState] = useState("")
  const [deliveryZip, setDeliveryZip] = useState("")

  // Additional
  const [extraTonnage, setExtraTonnage] = useState<number>(0)
  const [applianceCount, setApplianceCount] = useState<number>(0)
  const [notes, setNotes] = useState("")

  // UI States
  const [loading, setLoading] = useState(false)
  const [paymentLink, setPaymentLink] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [availability, setAvailability] = useState<{ booked: number; available: number } | null>(null)
  const [checkingAvailability, setCheckingAvailability] = useState(false)
  const [unavailableDates, setUnavailableDates] = useState<Date[]>([])

  const supabase = createClient()
  const router = useRouter()

  const selectedContainer = containerTypes.find((c) => c.id === containerType)

  // Fetch unavailable dates when container type changes
  useEffect(() => {
    if (containerType) {
      fetchUnavailableDates()
    } else {
      setUnavailableDates([])
    }
  }, [containerType])

  const fetchUnavailableDates = async () => {
    if (!containerType) return

    try {
      const container = containerTypes.find((c) => c.id === containerType)
      if (!container) return

      // Fetch all bookings for this container type for next 12 months
      const today = new Date()
      const futureDate = addDays(today, 365)

      const { data: bookings, error } = await supabase
        .from("bookings")
        .select("start_date, end_date")
        .eq("container_type_id", containerType)
        .not("status", "in", '("cancelled")')
        .gte("end_date", today.toISOString().split("T")[0])
        .lte("start_date", futureDate.toISOString().split("T")[0])

      if (error) {
        console.error("Error fetching unavailable dates:", error)
        return
      }

      // Count bookings per date
      const dateBookingCount = new Map<string, number>()

      bookings?.forEach((booking) => {
        const start = new Date(booking.start_date)
        const end = new Date(booking.end_date)
        const days = eachDayOfInterval({ start, end })

        days.forEach((day) => {
          const dateKey = day.toISOString().split("T")[0]
          dateBookingCount.set(dateKey, (dateBookingCount.get(dateKey) || 0) + 1)
        })
      })

      // Find dates where bookings >= available quantity
      const unavailable: Date[] = []
      dateBookingCount.forEach((count, dateKey) => {
        if (count >= container.available_quantity) {
          unavailable.push(new Date(dateKey))
        }
      })

      setUnavailableDates(unavailable)
    } catch (err) {
      console.error("Error fetching unavailable dates:", err)
    }
  }

  // Check availability when dates or container type changes
  useEffect(() => {
    if (containerType && startDate && endDate) {
      checkAvailability()
    } else {
      setAvailability(null)
    }
  }, [containerType, startDate, endDate])

  const checkAvailability = async () => {
    if (!containerType || !startDate || !endDate) return

    setCheckingAvailability(true)
    try {
      // Get container's available quantity
      const container = containerTypes.find((c) => c.id === containerType)
      if (!container) return

      // Fetch overlapping bookings for this container type
      const { data: bookings, error } = await supabase
        .from("bookings")
        .select("id, start_date, end_date")
        .eq("container_type_id", containerType)
        .not("status", "in", '("cancelled")')
        .gte("end_date", startDate.toISOString().split("T")[0])
        .lte("start_date", endDate.toISOString().split("T")[0])

      if (error) {
        console.error("Error checking availability:", error)
        return
      }

      const bookedCount = bookings?.length || 0
      const availableCount = Math.max(0, container.available_quantity - bookedCount)

      setAvailability({
        booked: bookedCount,
        available: availableCount,
      })
    } catch (err) {
      console.error("Error checking availability:", err)
    } finally {
      setCheckingAvailability(false)
    }
  }

  const calculateTotal = () => {
    if (!selectedContainer || !startDate || !endDate) return 0
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    return selectedContainer.price_per_day * Math.max(1, days)
  }

  const handleCopyLink = async () => {
    if (paymentLink) {
      await navigator.clipboard.writeText(paymentLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (!customerName || !customerEmail || !customerPhone) {
      setError("Please fill in all customer information")
      return
    }
    if (!containerType || !startDate || !endDate || !serviceType) {
      setError("Please fill in all booking details")
      return
    }
    if (!billingStreet || !billingCity || !billingState || !billingZip) {
      setError("Please fill in billing address")
      return
    }
    if (serviceType === "delivery" && (!deliveryStreet || !deliveryCity || !deliveryState || !deliveryZip)) {
      setError("Please fill in delivery address")
      return
    }
    if (!pickupTime) {
      setError("Please select a pickup/delivery time")
      return
    }

    // Check availability before submitting
    if (availability && availability.available <= 0) {
      setError("No containers available for the selected dates. Please choose different dates.")
      return
    }

    setLoading(true)

    try {
      const totalAmount = calculateTotal()
      const billingAddress = `${billingStreet}, ${billingCity}, ${billingState} ${billingZip}`
      const deliveryAddress = serviceType === "delivery"
        ? `${deliveryStreet}, ${deliveryCity}, ${deliveryState} ${deliveryZip}`
        : null

      // Call API to create phone booking
      const response = await fetch("/api/admin/create-phone-booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName,
          customerEmail,
          customerPhone,
          containerTypeId: containerType,
          startDate: startDate.toISOString().split("T")[0],
          endDate: endDate.toISOString().split("T")[0],
          serviceType,
          pickupTime,
          customerAddress: billingAddress,
          deliveryAddress,
          totalAmount,
          extraTonnage: extraTonnage > 0 ? extraTonnage : null,
          applianceCount: applianceCount > 0 ? applianceCount : null,
          notes: notes || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create phone booking")
      }

      // Set the payment link
      setPaymentLink(data.paymentLink)
    } catch (err) {
      console.error("Error creating phone booking:", err)
      setError(err instanceof Error ? err.message : "Failed to create phone booking")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAnother = () => {
    // Reset form
    setCustomerName("")
    setCustomerEmail("")
    setCustomerPhone("")
    setContainerType("")
    setStartDate(undefined)
    setEndDate(undefined)
    setServiceType("pickup")
    setPickupTime("09:00")
    setBillingStreet("")
    setBillingCity("")
    setBillingState("")
    setBillingZip("")
    setDeliveryStreet("")
    setDeliveryCity("")
    setDeliveryState("")
    setDeliveryZip("")
    setExtraTonnage(0)
    setApplianceCount(0)
    setNotes("")
    setPaymentLink(null)
    setError(null)
  }

  // Custom day styling for calendar
  const modifiers = {
    unavailable: unavailableDates,
  }

  const modifiersClassNames = {
    unavailable: "bg-red-500 text-white line-through hover:bg-red-600",
  }

  const modifiersStyles = {
    unavailable: {
      backgroundColor: "#ef4444",
      color: "#ffffff",
      textDecoration: "line-through",
    },
  }

  // If payment link is generated, show success screen
  if (paymentLink) {
    return (
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Phone Booking Created!</CardTitle>
          <CardDescription>
            The booking has been created and an email with the payment link has been sent to {customerEmail}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="payment-link">Payment Link</Label>
            <div className="flex gap-2">
              <Input
                id="payment-link"
                value={paymentLink}
                readOnly
                className="font-mono text-sm"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleCopyLink}
                className="shrink-0"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Share this link with the customer via SMS, chat, or any messaging platform
            </p>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Important</AlertTitle>
            <AlertDescription>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>This link expires in 7 days</li>
                <li>Customer will enter their card details and digital signature</li>
                <li>Card will NOT be charged immediately</li>
                <li>You can charge the card later from the Payment Tracker</li>
                <li>If customer doesn't complete within 7 days, booking will be cancelled</li>
              </ul>
            </AlertDescription>
          </Alert>

          <div className="flex gap-3">
            <Button onClick={handleCreateAnother} className="flex-1">
              Create Another Booking
            </Button>
            <Button variant="outline" onClick={() => router.push("/admin/payments")} className="flex-1">
              View Payment Tracker
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Regular booking form
  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6 max-w-3xl mx-auto">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Customer Information
            </CardTitle>
            <CardDescription>Enter the customer's contact details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customerName">Full Name *</Label>
              <Input
                id="customerName"
                placeholder="John Doe"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerEmail">Email Address *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="customerEmail"
                  type="email"
                  placeholder="john@example.com"
                  className="pl-9"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerPhone">Phone Number *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="customerPhone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  className="pl-9"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(formatPhoneNumber(e.target.value))}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Container Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Container</CardTitle>
            <CardDescription>Choose the container type for this booking</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="containerType">Container Type *</Label>
              <Select value={containerType} onValueChange={setContainerType}>
                <SelectTrigger id="containerType">
                  <SelectValue placeholder="Select a container" />
                </SelectTrigger>
                <SelectContent>
                  {containerTypes.map((container) => (
                    <SelectItem key={container.id} value={container.id}>
                      {container.name} - {container.size} ({formatCurrency(container.price_per_day)}/day)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedContainer && (
              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm text-muted-foreground">{selectedContainer.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dates */}
        <Card>
          <CardHeader>
            <CardTitle>Rental Period</CardTitle>
            <CardDescription>Select the start and end dates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                      disabled={(date) => date < new Date()}
                      modifiers={modifiers}
                      modifiersClassNames={modifiersClassNames}
                      modifiersStyles={modifiersStyles}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>End Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      disabled={(date) => date < new Date()}
                      modifiers={modifiers}
                      modifiersClassNames={modifiersClassNames}
                      modifiersStyles={modifiersStyles}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Availability Display */}
            {checkingAvailability && (
              <Alert className="bg-blue-50 border-blue-200">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  Checking availability...
                </AlertDescription>
              </Alert>
            )}

            {availability && !checkingAvailability && (
              <Alert className={availability.available > 0 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}>
                <AlertCircle className={`h-4 w-4 ${availability.available > 0 ? "text-green-600" : "text-red-600"}`} />
                <AlertTitle className={availability.available > 0 ? "text-green-900" : "text-red-900"}>
                  {availability.available > 0 ? "Available" : "Fully Booked"}
                </AlertTitle>
                <AlertDescription className={availability.available > 0 ? "text-green-800" : "text-red-800"}>
                  <div className="space-y-1">
                    <p>
                      <strong>{availability.available}</strong> container{availability.available !== 1 ? "s" : ""} available
                      {selectedContainer && ` out of ${selectedContainer.available_quantity}`}
                    </p>
                    <p className="text-sm">
                      {availability.booked} already booked for this period
                    </p>
                    {availability.available <= 0 && (
                      <p className="text-sm font-medium mt-2">
                        Please select different dates or choose another container type.
                      </p>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Service Type */}
        <Card>
          <CardHeader>
            <CardTitle>Service Type</CardTitle>
            <CardDescription>Select pickup or delivery service</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={serviceType} onValueChange={setServiceType}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pickup" id="pickup" />
                <Label htmlFor="pickup" className="cursor-pointer">
                  Customer Pickup
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="delivery" id="delivery" />
                <Label htmlFor="delivery" className="cursor-pointer">
                  Delivery Service
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Time & Addresses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Time & Address Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pickupTime">
                {serviceType === "pickup" ? "Pickup Time" : "Delivery Time"} *
              </Label>
              <Input
                id="pickupTime"
                type="time"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                required
              />
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-medium">Billing Address *</h4>
              <div className="space-y-2">
                <Input
                  placeholder="Street Address"
                  value={billingStreet}
                  onChange={(e) => setBillingStreet(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="City"
                  value={billingCity}
                  onChange={(e) => setBillingCity(e.target.value)}
                  required
                />
                <Input
                  placeholder="State"
                  value={billingState}
                  onChange={(e) => setBillingState(e.target.value)}
                  required
                />
              </div>
              <Input
                placeholder="ZIP Code"
                value={billingZip}
                onChange={(e) => setBillingZip(e.target.value)}
                required
              />
            </div>

            {serviceType === "delivery" && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h4 className="font-medium">Delivery Address *</h4>
                  <div className="space-y-2">
                    <Input
                      placeholder="Street Address"
                      value={deliveryStreet}
                      onChange={(e) => setDeliveryStreet(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="City"
                      value={deliveryCity}
                      onChange={(e) => setDeliveryCity(e.target.value)}
                      required
                    />
                    <Input
                      placeholder="State"
                      value={deliveryState}
                      onChange={(e) => setDeliveryState(e.target.value)}
                      required
                    />
                  </div>
                  <Input
                    placeholder="ZIP Code"
                    value={deliveryZip}
                    onChange={(e) => setDeliveryZip(e.target.value)}
                    required
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Additional Options */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Options</CardTitle>
            <CardDescription>Optional extras</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="extraTonnage">Extra Tonnage</Label>
              <Input
                id="extraTonnage"
                type="number"
                min="0"
                value={extraTonnage}
                onChange={(e) => setExtraTonnage(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="applianceCount">Number of Appliances</Label>
              <Input
                id="applianceCount"
                type="number"
                min="0"
                value={applianceCount}
                onChange={(e) => setApplianceCount(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Special Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any special instructions..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Summary & Submit */}
        {selectedContainer && startDate && endDate && (
          <Card>
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Container:</span>
                <span className="font-medium">{selectedContainer.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration:</span>
                <span className="font-medium">
                  {Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)))} days
                </span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total Amount:</span>
                <span>{formatCurrency(calculateTotal())}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Customer will NOT be charged until you manually charge from Payment Tracker
              </p>
            </CardContent>
          </Card>
        )}

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={loading || (availability !== null && availability.available <= 0)}
        >
          {loading ? (
            "Creating Booking & Generating Link..."
          ) : availability && availability.available <= 0 ? (
            "No Containers Available"
          ) : (
            <>
              <LinkIcon className="mr-2 h-4 w-4" />
              Generate Payment Link
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
