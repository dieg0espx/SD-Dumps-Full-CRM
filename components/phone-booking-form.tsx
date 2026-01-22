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
import { cn } from "@/lib/utils"
import { calculateDistanceFee, DISTANCE_CONSTANTS, type DistanceResult } from "@/lib/distance"

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Pricing breakdown interface
interface PricingBreakdown {
  containerType: string
  basePrice: number
  includedDays: number
  totalDays: number
  extraDays: number
  extraDaysAmount: number
  extraTonnage: number
  extraTonnageAmount: number
  applianceCount: number
  applianceAmount: number
  distanceMiles: number | null
  distanceFee: number
  travelFee: number
  priceAdjustment: number
  adjustmentReason: string | null
  total: number
}

// Format date to YYYY-MM-DD in local timezone (avoids UTC conversion issues)
const formatDateLocal = (date: Date) => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

// Parse date string (YYYY-MM-DD) to local date to avoid timezone issues
const parseLocalDate = (dateStr: string) => {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day)
}

interface PhoneBookingFormProps {
  containerTypes: any[]
}

export function PhoneBookingForm({ containerTypes }: PhoneBookingFormProps) {
  // Test data for development
  const isDev = process.env.NODE_ENV === 'development'

  // Customer Info
  const [customerName, setCustomerName] = useState(isDev ? "John Doe" : "")
  const [customerEmail, setCustomerEmail] = useState(isDev ? "diego@comcreate.org" : "")
  const [customerPhone, setCustomerPhone] = useState(isDev ? "(555) 123-4567" : "")

  // Booking Details
  const [containerType, setContainerType] = useState("")
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [serviceType, setServiceType] = useState("delivery")
  const [pickupTime, setPickupTime] = useState("09:00")

  // Addresses
  const [billingStreet, setBillingStreet] = useState(isDev ? "123 Main Street" : "")
  const [billingCity, setBillingCity] = useState(isDev ? "San Diego" : "")
  const [billingState, setBillingState] = useState(isDev ? "CA" : "")
  const [billingZip, setBillingZip] = useState(isDev ? "92101" : "")
  const [deliveryStreet, setDeliveryStreet] = useState(isDev ? "123 Main Street" : "")
  const [deliveryCity, setDeliveryCity] = useState(isDev ? "San Diego" : "")
  const [deliveryState, setDeliveryState] = useState(isDev ? "CA" : "")
  const [deliveryZip, setDeliveryZip] = useState(isDev ? "92101" : "")

  // Additional
  const [extraTonnage, setExtraTonnage] = useState<number>(0)
  const [applianceCount, setApplianceCount] = useState<number>(0)
  const [notes, setNotes] = useState("")

  // Price Adjustment
  const [priceAdjustment, setPriceAdjustment] = useState<number>(0)
  const [adjustmentReason, setAdjustmentReason] = useState("")
  const [travelFee, setTravelFee] = useState<number>(0)

  // UI States
  const [loading, setLoading] = useState(false)
  const [paymentLink, setPaymentLink] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [availability, setAvailability] = useState<{ booked: number; available: number } | null>(null)
  const [checkingAvailability, setCheckingAvailability] = useState(false)
  const [existingBookings, setExistingBookings] = useState<any[]>([])

  // Distance fee state
  const [distanceResult, setDistanceResult] = useState<DistanceResult | null>(null)
  const [isCalculatingDistance, setIsCalculatingDistance] = useState(false)

  const supabase = createClient()
  const router = useRouter()

  const selectedContainer = containerTypes.find((c) => c.id === containerType)

  // Fetch all bookings on component mount (like the client booking form)
  const fetchBookings = async () => {
    const { data: bookings, error } = await supabase
      .from("bookings")
      .select("id, start_date, end_date, container_type_id, status")
      .not("status", "in", '("cancelled")')
      .order("start_date", { ascending: true })

    if (error) {
      console.error("Error fetching bookings:", error)
      return
    }

    setExistingBookings(bookings || [])
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  // Refetch bookings whenever container type changes to ensure calendar has latest data
  useEffect(() => {
    if (containerType) {
      fetchBookings()
    }
  }, [containerType])

  // Helper functions for availability checking
  const isDateUnavailable = (date: Date) => {
    if (!containerType) return false

    const container = containerTypes.find((ct) => ct.id === containerType)
    if (!container) return false

    // Count how many containers are booked on this date
    // Use STRING comparison to avoid timezone issues
    const checkDateStr = formatDateLocal(date)

    const matchingBookings = existingBookings.filter((booking) => {
      if (booking.container_type_id !== containerType) return false

      // Compare date strings directly (YYYY-MM-DD format)
      return checkDateStr >= booking.start_date && checkDateStr <= booking.end_date
    })

    const bookedCount = matchingBookings.length

    // Date is unavailable if all containers are booked
    return bookedCount >= container.available_quantity
  }

  const getDateAvailability = (date: Date) => {
    if (!containerType) return { available: 0, total: 0 }

    const container = containerTypes.find((ct) => ct.id === containerType)
    if (!container) return { available: 0, total: 0 }

    // Normalize date to midnight for accurate comparison
    const checkDate = new Date(date)
    checkDate.setHours(0, 0, 0, 0)

    const bookedCount = existingBookings.filter((booking) => {
      if (booking.container_type_id !== containerType) return false

      const bookingStart = parseLocalDate(booking.start_date)
      const bookingEnd = parseLocalDate(booking.end_date)

      // Normalize checkDate for comparison
      const checkDateNorm = new Date(date)
      checkDateNorm.setHours(0, 0, 0, 0)

      // Check if the date falls within the booking period (inclusive)
      return checkDateNorm >= bookingStart && checkDateNorm <= bookingEnd
    }).length

    return {
      available: Math.max(0, container.available_quantity - bookedCount),
      total: container.available_quantity,
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
        .gte("end_date", formatDateLocal(startDate))
        .lte("start_date", formatDateLocal(endDate))

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
    const totalDays = Math.max(1, days)
    // Base price includes 3 days
    const includedDays = 3
    const baseAmount = selectedContainer.price_per_day
    // Calculate extra days beyond the included 3 days
    const extraDaysCount = Math.max(0, totalDays - includedDays)
    const extraDaysAmount = extraDaysCount * 25
    const extraTonnageAmount = (extraTonnage || 0) * 125
    const applianceAmount = (applianceCount || 0) * 25
    const travelFeeAmount = travelFee || 0
    const adjustment = priceAdjustment || 0
    const distanceFeeAmount = distanceResult?.distanceFee || 0
    return baseAmount + extraDaysAmount + extraTonnageAmount + applianceAmount + travelFeeAmount + adjustment + distanceFeeAmount
  }

  // Calculate distance when delivery zip code changes
  useEffect(() => {
    const zipToUse = serviceType === "delivery" ? deliveryZip : null

    if (!zipToUse || zipToUse.length < 5) {
      setDistanceResult(null)
      return
    }

    const calculateDistance = async () => {
      setIsCalculatingDistance(true)
      try {
        const result = await calculateDistanceFee(zipToUse)
        setDistanceResult(result)
      } catch (error) {
        console.error("Error calculating distance:", error)
        setDistanceResult(null)
      } finally {
        setIsCalculatingDistance(false)
      }
    }

    // Debounce the calculation
    const timeoutId = setTimeout(calculateDistance, 500)
    return () => clearTimeout(timeoutId)
  }, [deliveryZip, serviceType])

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
    if (!deliveryStreet || !deliveryCity || !deliveryState || !deliveryZip) {
      setError("Please fill in delivery address")
      return
    }
    if (!pickupTime) {
      setError("Please select a delivery time")
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

      // Calculate pricing breakdown details
      const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
      const totalDays = Math.max(1, days)
      const includedDays = 3
      const baseAmount = selectedContainer?.price_per_day || 0
      const extraDaysCount = Math.max(0, totalDays - includedDays)
      const extraDaysAmount = extraDaysCount * 25
      const extraTonnageAmount = (extraTonnage || 0) * 125
      const applianceAmount = (applianceCount || 0) * 25
      const distanceFeeAmount = distanceResult?.distanceFee || 0

      // Build pricing breakdown
      const pricingBreakdown: PricingBreakdown = {
        containerType: selectedContainer?.size || 'Container',
        basePrice: baseAmount,
        includedDays: includedDays,
        totalDays: totalDays,
        extraDays: extraDaysCount,
        extraDaysAmount: extraDaysAmount,
        extraTonnage: extraTonnage || 0,
        extraTonnageAmount: extraTonnageAmount,
        applianceCount: applianceCount || 0,
        applianceAmount: applianceAmount,
        distanceMiles: distanceResult?.distanceMiles || null,
        distanceFee: distanceFeeAmount,
        travelFee: travelFee || 0,
        priceAdjustment: priceAdjustment || 0,
        adjustmentReason: priceAdjustment !== 0 ? (adjustmentReason || null) : null,
        total: totalAmount,
      }

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
          startDate: formatDateLocal(startDate),
          endDate: formatDateLocal(endDate),
          serviceType,
          pickupTime,
          customerAddress: billingAddress,
          deliveryAddress,
          totalAmount,
          extraTonnage: extraTonnage > 0 ? extraTonnage : null,
          applianceCount: applianceCount > 0 ? applianceCount : null,
          travelFee: travelFee > 0 ? travelFee : null,
          notes: notes || null,
          priceAdjustment: priceAdjustment !== 0 ? priceAdjustment : null,
          adjustmentReason: priceAdjustment !== 0 ? adjustmentReason : null,
          pricingBreakdown,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create phone booking")
      }

      // Set the payment link
      setPaymentLink(data.paymentLink)

      // Refetch bookings to update calendar colors
      await fetchBookings()
    } catch (err) {
      console.error("Error creating phone booking:", err)
      setError(err instanceof Error ? err.message : "Failed to create phone booking")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAnother = async () => {
    // Refetch bookings to ensure calendar has latest data
    await fetchBookings()

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
    setTravelFee(0)
    setNotes("")
    setPriceAdjustment(0)
    setAdjustmentReason("")
    setPaymentLink(null)
    setError(null)
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
            <div className="space-y-2">
              <Label>Date Range *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate && endDate
                      ? `${format(startDate, "MMM dd")} - ${format(endDate, "MMM dd, yyyy")}`
                      : "Click to select your rental dates"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    key={`calendar-${existingBookings.length}-${containerType}`}
                    mode="range"
                    selected={{ from: startDate, to: endDate }}
                    onSelect={(range) => {
                      // Ensure dates are set to noon local time to avoid timezone edge cases
                      if (range?.from) {
                        const from = new Date(range.from)
                        console.log('Calendar from (raw):', range.from)
                        console.log('Calendar from toString:', range.from.toString())
                        console.log('Calendar from getDate:', range.from.getDate())
                        from.setHours(12, 0, 0, 0)
                        console.log('After setHours:', from.toString(), 'getDate:', from.getDate())
                        console.log('formatDateLocal result:', formatDateLocal(from))
                        setStartDate(from)
                      } else {
                        setStartDate(undefined)
                      }
                      if (range?.to) {
                        const to = new Date(range.to)
                        to.setHours(12, 0, 0, 0)
                        setEndDate(to)
                      } else {
                        setEndDate(undefined)
                      }
                    }}
                    disabled={(date) => {
                      const today = new Date()
                      today.setHours(0, 0, 0, 0)
                      return date < today || isDateUnavailable(date)
                    }}
                    initialFocus
                    numberOfMonths={2}
                    modifiers={{
                      unavailable: (date) => isDateUnavailable(date),
                      limited: (date) => {
                        if (!selectedContainer) return false
                        const availability = getDateAvailability(date)
                        return availability.available > 0 && availability.available < availability.total
                      },
                    }}
                    modifiersClassNames={{
                      unavailable: "bg-red-100 text-red-800",
                      limited: "bg-yellow-100 text-yellow-800",
                    }}
                    modifiersStyles={{
                      unavailable: { backgroundColor: "#fee2e2", color: "#dc2626" },
                      limited: { backgroundColor: "#fef3c7", color: "#d97706" },
                    }}
                    className="rounded-md border shadow-lg"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Availability Legend */}
            {selectedContainer && (
              <div className="rounded-lg bg-muted p-4">
                <p className="text-xs font-medium text-muted-foreground mb-3">Calendar Legend:</p>
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-white border-2 border-gray-300 rounded"></div>
                    <span className="text-xs text-muted-foreground">Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-200 rounded"></div>
                    <span className="text-xs text-muted-foreground">Limited</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-200 rounded"></div>
                    <span className="text-xs text-muted-foreground">Fully Booked</span>
                  </div>
                </div>
              </div>
            )}

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
              <Label htmlFor="pickupTime">Delivery Time *</Label>
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

            <Separator />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Delivery Address *</h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setDeliveryStreet(billingStreet)
                    setDeliveryCity(billingCity)
                    setDeliveryState(billingState)
                    setDeliveryZip(billingZip)
                  }}
                  disabled={!billingStreet && !billingCity && !billingState && !billingZip}
                >
                  Same as Billing
                </Button>
              </div>
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
              {/* Distance Fee Info */}
              {deliveryZip.length >= 5 && (
                <div className="mt-2">
                  {isCalculatingDistance ? (
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      Calculating delivery distance...
                    </div>
                  ) : distanceResult?.error ? (
                    <div className="text-sm text-red-500">
                      Unable to calculate distance.
                    </div>
                  ) : distanceResult && (
                    <div className={`text-sm p-2 rounded ${distanceResult.isWithinFreeRange ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'}`}>
                      {distanceResult.isWithinFreeRange ? (
                        <span>✓ {distanceResult.distanceMiles} mi - within free zone</span>
                      ) : (
                        <span>
                          {distanceResult.distanceMiles} mi - Distance fee: <strong>{formatCurrency(distanceResult.distanceFee)}</strong>
                          ({distanceResult.extraMiles} mi × ${DISTANCE_CONSTANTS.PRICE_PER_MILE}/mi)
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
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
              <Label htmlFor="travelFee">Travel Fee ($)</Label>
              <Input
                id="travelFee"
                type="number"
                min="0"
                placeholder="0"
                value={travelFee || ""}
                onChange={(e) => setTravelFee(Number(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">
                Additional fee for delivery distance
              </p>
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

        {/* Price Adjustment */}
        <Card>
          <CardHeader>
            <CardTitle>Price Adjustment</CardTitle>
            <CardDescription>Apply discounts or add charges (e.g., "-75 loyal customer" or "+50 rush fee")</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priceAdjustment">Amount ($)</Label>
                <Input
                  id="priceAdjustment"
                  type="number"
                  placeholder="-75"
                  value={priceAdjustment || ""}
                  onChange={(e) => setPriceAdjustment(Number(e.target.value))}
                />
                <p className="text-xs text-muted-foreground">
                  Use negative for discounts, positive for extra charges
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="adjustmentReason">Reason</Label>
                <Input
                  id="adjustmentReason"
                  type="text"
                  placeholder="loyal customer"
                  value={adjustmentReason}
                  onChange={(e) => setAdjustmentReason(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Brief description for the adjustment
                </p>
              </div>
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
              <div className="flex justify-between">
                <span className="text-muted-foreground">Base Rental (includes 3 days):</span>
                <span className="font-medium">
                  {formatCurrency(selectedContainer.price_per_day)}
                </span>
              </div>
              {Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))) > 3 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Extra Days ({Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))) - 3} days × $25):</span>
                  <span className="font-medium">
                    {formatCurrency((Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))) - 3) * 25)}
                  </span>
                </div>
              )}
              {extraTonnage > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Extra Tonnage ({extraTonnage} tons):</span>
                  <span className="font-medium">{formatCurrency(extraTonnage * 125)}</span>
                </div>
              )}
              {applianceCount > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Appliance Disposal ({applianceCount} items):</span>
                  <span className="font-medium">{formatCurrency(applianceCount * 25)}</span>
                </div>
              )}
              {travelFee > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Travel Fee:</span>
                  <span className="font-medium">{formatCurrency(travelFee)}</span>
                </div>
              )}
              {distanceResult && distanceResult.distanceFee > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Distance Fee ({distanceResult.extraMiles} mi beyond {DISTANCE_CONSTANTS.FREE_DISTANCE_MILES} mi):
                  </span>
                  <span className="font-medium text-orange-600">{formatCurrency(distanceResult.distanceFee)}</span>
                </div>
              )}
              {priceAdjustment !== 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {priceAdjustment < 0 ? "Discount" : "Additional Charge"}
                    {adjustmentReason && ` (${adjustmentReason})`}:
                  </span>
                  <span className={`font-medium ${priceAdjustment < 0 ? "text-green-600" : "text-red-600"}`}>
                    {priceAdjustment < 0 ? "-" : "+"}{formatCurrency(Math.abs(priceAdjustment))}
                  </span>
                </div>
              )}
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
