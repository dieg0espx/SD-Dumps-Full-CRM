"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Truck, MapPin, AlertCircle, ChevronRight, ChevronLeft, CreditCard, Wallet, Building } from "lucide-react"
import { format, differenceInDays, eachDayOfInterval, isValid } from "date-fns"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { StripeElements } from "@/components/stripe-elements"

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}
import type { User } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"

interface ContainerType {
  id: string
  name: string
  size: string
  description: string
  price_per_day: number
  available_quantity: number
  is_hidden?: boolean
}

interface BookingFormProps {
  user: User
}

interface Profile {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  company: string | null
  street_address: string | null
  city: string | null
  state: string | null
  zip_code: string | null
  country: string | null
  role: string | null
  is_admin: boolean | null
}

interface Booking {
  id: string
  start_date: string
  end_date: string
  container_type_id: string
  status: string
}

export function BookingForm({ user }: BookingFormProps) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [containerTypes, setContainerTypes] = useState<ContainerType[]>([])
  const [existingBookings, setExistingBookings] = useState<Booking[]>([])
  const [selectedContainer, setSelectedContainer] = useState<string>("")
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [serviceType, setServiceType] = useState<string>("pickup")
  const [pickupTime, setPickupTime] = useState<string>("09:00")
  const [streetAddress, setStreetAddress] = useState<string>("")
  const [city, setCity] = useState<string>("")
  const [state, setState] = useState<string>("")
  const [zipCode, setZipCode] = useState<string>("")
  const [deliveryStreetAddress, setDeliveryStreetAddress] = useState<string>("")
  const [deliveryCity, setDeliveryCity] = useState<string>("")
  const [deliveryState, setDeliveryState] = useState<string>("")
  const [deliveryZipCode, setDeliveryZipCode] = useState<string>("")
  const [useProfileAddress, setUseProfileAddress] = useState<boolean>(false)
  const [extraTonnage, setExtraTonnage] = useState<number>(0)
  const [applianceCount, setApplianceCount] = useState<number>(0)
  const [notes, setNotes] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loadingData, setLoadingData] = useState(true)
  const [currentStep, setCurrentStep] = useState<number>(1)

  // Payment form state
  const [paymentMethod, setPaymentMethod] = useState("stripe")

  // Success state
  const [isSuccess, setIsSuccess] = useState(false)
  const [successData, setSuccessData] = useState<any>(null)
  const [isMobile, setIsMobile] = useState(false)

  const router = useRouter()
  const supabase = createClient()

  const totalSteps = isSuccess ? 7 : 6

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Handle profile address checkbox
  useEffect(() => {
    if (useProfileAddress && profile && serviceType === "delivery") {
      setDeliveryStreetAddress(profile.street_address || "")
      setDeliveryCity(profile.city || "")
      setDeliveryState(profile.state || "")
      setDeliveryZipCode(profile.zip_code || "")
    }
  }, [useProfileAddress, profile, serviceType])

  // Populate billing address with profile address when profile loads
  useEffect(() => {
    if (profile) {
      setStreetAddress(profile.street_address || "")
      setCity(profile.city || "")
      setState(profile.state || "")
      setZipCode(profile.zip_code || "")
    }
  }, [profile])

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log("[v0] Loading container types...")

        // Load container types - explicitly filter out hidden ones
        const { data: containers, error: containerError } = await supabase
          .from("container_types")
          .select("*")
          .eq("is_hidden", false)
          .order("price_per_day")

        if (containerError) {
          console.error("[v0] Container error:", containerError)
          throw containerError
        }

        console.log("[v0] Loaded containers:", containers)
        setContainerTypes(containers || [])

        // Load existing bookings for availability checking
        const { data: bookings, error: bookingError } = await supabase
          .from("bookings")
          .select("id, start_date, end_date, container_type_id, status")
          .in("status", ["confirmed", "pending"])

        if (bookingError) {
          console.error("[v0] Booking error:", bookingError)
          throw bookingError
        }

        console.log("[v0] Loaded bookings:", bookings)
        setExistingBookings(bookings || [])

        // Load user profile
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("id, email, full_name, phone, company, street_address, city, state, zip_code, country, role, is_admin")
          .eq("id", user.id)
          .single()

        if (profileError) {
          console.error("[v0] Profile error:", profileError)
        } else {
          console.log("[v0] Loaded profile:", profile)
          setProfile(profile)
        }
      } catch (error) {
        console.error("[v0] Error loading data:", error)
        setError("Failed to load container types. Please refresh the page.")
      } finally {
        setLoadingData(false)
      }
    }

    loadData()
  }, [supabase])

  const isDateUnavailable = (date: Date) => {
    if (!selectedContainer) return false

    const selectedType = containerTypes.find((ct) => ct.id === selectedContainer)
    if (!selectedType) return false

    // Count how many containers are booked on this date
    const bookedCount = existingBookings.filter((booking) => {
      if (booking.container_type_id !== selectedContainer) return false

      const bookingStart = new Date(booking.start_date)
      const bookingEnd = new Date(booking.end_date)

      return date >= bookingStart && date <= bookingEnd
    }).length

    // Date is unavailable if all containers are booked
    return bookedCount >= selectedType.available_quantity
  }

  const getDateAvailability = (date: Date) => {
    if (!selectedContainer) return { available: 0, total: 0 }

    const selectedType = containerTypes.find((ct) => ct.id === selectedContainer)
    if (!selectedType) return { available: 0, total: 0 }

    const bookedCount = existingBookings.filter((booking) => {
      if (booking.container_type_id !== selectedContainer) return false

      const bookingStart = new Date(booking.start_date)
      const bookingEnd = new Date(booking.end_date)

      return date >= bookingStart && date <= bookingEnd
    }).length

    return {
      available: Math.max(0, selectedType.available_quantity - bookedCount),
      total: selectedType.available_quantity,
    }
  }

  const isDateRangeAvailable = (startDate: Date, endDate: Date) => {
    if (!selectedContainer) return false

    const selectedType = containerTypes.find((ct) => ct.id === selectedContainer)
    if (!selectedType) return false

    const daysInRange = eachDayOfInterval({ start: startDate, end: endDate })

    return daysInRange.every((date) => {
      const bookedCount = existingBookings.filter((booking) => {
        if (booking.container_type_id !== selectedContainer) return false

        const bookingStart = new Date(booking.start_date)
        const bookingEnd = new Date(booking.end_date)

        return date >= bookingStart && date <= bookingEnd
      }).length

      return bookedCount < selectedType.available_quantity
    })
  }

  const totalDays =
    startDate && endDate && isValid(startDate) && isValid(endDate)
      ? Math.max(1, differenceInDays(endDate, startDate) + 1)
      : 1

  const selectedContainerType = containerTypes.find((ct) => ct.id === selectedContainer)
  const baseAmount = selectedContainerType?.price_per_day || 0
  const baseTotalAmount = baseAmount * totalDays
  const extraTonnageAmount = (extraTonnage || 0) * 125
  const applianceAmount = (applianceCount || 0) * 30
  const totalAmount = baseTotalAmount + extraTonnageAmount + applianceAmount

  console.log("[v0] Price calculation:", {
    totalDays,
    baseAmount,
    baseTotalAmount,
    extraTonnageAmount,
    applianceAmount,
    totalAmount,
    startDate: startDate?.toISOString(),
    endDate: endDate?.toISOString(),
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Remove the automatic step check that was causing auto-redirect
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

  const handlePaymentSubmit = async () => {
    setIsLoading(true)
    setError(null)

    // Validate all required fields
    if (!selectedContainer || !startDate || !endDate) {
      setError("Please fill in all required fields")
      setIsLoading(false)
      return
    }

    if (!isDateRangeAvailable(startDate, endDate)) {
      setError("Selected date range is not available. Please choose different dates.")
      setIsLoading(false)
      return
    }

    if (serviceType === "delivery") {
      if (!useProfileAddress && (!deliveryStreetAddress.trim() || !deliveryCity.trim() || !deliveryState.trim() || !deliveryZipCode.trim())) {
        setError("Please fill in all delivery address fields")
        setIsLoading(false)
        return
      }
    }

    // Validate payment fields (skip for Stripe as it's handled by StripeElements)
    if (paymentMethod === "credit_card") {
      if (!cardName.trim() || !cardNumber.trim() || !expiryDate.trim() || !cvv.trim()) {
        setError("Please fill in all credit card fields")
        setIsLoading(false)
        return
      }
      
      // Basic card number validation
      const cleanCardNumber = cardNumber.replace(/\s/g, "")
      if (cleanCardNumber.length < 13 || cleanCardNumber.length > 19) {
        setError("Please enter a valid card number")
        setIsLoading(false)
        return
      }
      
      // Basic CVV validation
      if (cvv.length < 3 || cvv.length > 4) {
        setError("Please enter a valid CVV")
        setIsLoading(false)
        return
      }
    }

    try {
      const deliveryAddress =
        serviceType === "delivery"
          ? useProfileAddress && profile
            ? `${profile.street_address}, ${profile.city}, ${profile.state} ${profile.zip_code}`
            : `${deliveryStreetAddress}, ${deliveryCity}, ${deliveryState} ${deliveryZipCode}`
          : null

      // Update user profile with phone if available
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser()
      if (currentUser?.user_metadata?.phone) {
        await supabase.from("profiles").update({ phone: currentUser.user_metadata.phone }).eq("id", user.id)
      }

      // Create the booking
      const { data: booking, error: bookingError } = await supabase
        .from("bookings")
        .insert({
          user_id: user.id,
          container_type_id: selectedContainer,
          start_date: format(startDate, "yyyy-MM-dd"),
          end_date: format(endDate, "yyyy-MM-dd"),
          pickup_time: pickupTime,
          delivery_address: deliveryAddress,
          customer_address: `${streetAddress}, ${city}, ${state} ${zipCode}`,
          service_type: serviceType,
          total_amount: totalAmount,
          notes: notes.trim() || null,
          status: "pending",
          payment_status: "pending",
        })
        .select()
        .single()

      if (bookingError) {
        console.error("[v0] Booking creation error:", bookingError)
        throw new Error(`Failed to create booking: ${bookingError.message}`)
      }

      console.log("[v0] Booking created successfully:", booking)

      // Skip payment processing for Stripe as it's handled by StripeElements
      if (paymentMethod !== "stripe") {
        // Simulate payment processing for non-Stripe methods
        const paymentResult = await simulatePayment()

        // Create payment record
        const { error: paymentError } = await supabase.from("payments").insert({
          booking_id: booking.id,
          amount: totalAmount,
          payment_method: paymentMethod,
          transaction_id: paymentResult.transaction_id,
          status: paymentResult.status,
        })

        if (paymentError) {
          console.error("[v0] Payment creation error:", paymentError)
          throw new Error(`Failed to create payment record: ${paymentError.message}`)
        }

        console.log("[v0] Payment record created successfully")

        // Update booking status
        const { error: updateError } = await supabase
          .from("bookings")
          .update({
            payment_status: "paid",
            status: "confirmed",
            updated_at: new Date().toISOString(),
          })
          .eq("id", booking.id)

        if (updateError) {
          console.error("[v0] Booking update error:", updateError)
          throw new Error(`Failed to update booking status: ${updateError.message}`)
        }

        console.log("[v0] Booking status updated successfully")
      }

      // Set success state with booking data
      setSuccessData({
        booking: booking,
        payment: paymentMethod !== "stripe" ? {
          transaction_id: paymentResult.transaction_id,
          payment_method: paymentMethod,
          amount: totalAmount,
          created_at: new Date().toISOString()
        } : {
          transaction_id: "stripe_processing",
          payment_method: paymentMethod,
          amount: totalAmount,
          created_at: new Date().toISOString()
        }
      })
      setIsSuccess(true)
      setCurrentStep(7)
    } catch (error: unknown) {
      console.error("[v0] Payment error:", error)
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("Payment failed. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }


  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return selectedContainer !== ""
      case 2:
        return startDate && endDate && isDateRangeAvailable(startDate, endDate)
      case 3:
        return (
          serviceType &&
          pickupTime &&
          (serviceType === "pickup" || (
            useProfileAddress || (deliveryStreetAddress && deliveryCity && deliveryState && deliveryZipCode)
          ))
        )
      case 4:
        return true
      case 5:
        return true
      default:
        return true
    }
  }

  if (loadingData) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading container options...</p>
        </div>
      </div>
    )
  }


  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 sm:mb-8">
        {!isSuccess && (
          <div className="relative">
            <div className="flex items-center justify-center overflow-x-auto pb-2">
                            <div className="flex items-center justify-center w-[90%] max-w-md">
                {Array.from({ length: totalSteps }, (_, i) => (
                  <div key={i} className="flex items-center">
                    <div className="relative flex items-center justify-center -mx-1 sm:-mx-2">
                      <div
                        className={cn(
                          "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold border-2 transition-all duration-200 z-10 bg-white",
                          i + 1 <= currentStep
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-400 border-gray-300",
                        )}
                      >
                        {i + 1}
                      </div>
                    </div>
                    {i < totalSteps - 1 && (
                      <div className="h-0.5 w-8 sm:w-12">
                        <div
                          className={cn(
                            "h-full transition-all duration-200",
                            i + 1 < currentStep ? "bg-blue-600" : "bg-gray-300",
                          )}
                        />
                      </div>
                    )}
                  </div>
                ))}
                </div>
              </div>
          </div>
        )}
        <div className="mt-4 sm:mt-6 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            {currentStep === 1 && "Select Container"}
            {currentStep === 2 && "Choose Dates"}
            {currentStep === 3 && "Service & Address"}
            {currentStep === 4 && "Additional Services"}
            {currentStep === 5 && "Review & Book"}
            {currentStep === 6 && "Payment"}
            {currentStep === 7 && "Booking Confirmed!"}
          </h2>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            {currentStep === 1 && "Choose the perfect container size for your project"}
            {currentStep === 2 && "Select your rental dates"}
            {currentStep === 3 && "Configure service options and addresses"}
            {currentStep === 4 && "Add optional services"}
            {currentStep === 5 && "Review and confirm your booking"}
            {currentStep === 6 && "Complete your payment securely"}
            {currentStep === 7 && "Your booking has been successfully confirmed"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {currentStep === 1 && (
          <Card className="border-0">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl">Select Container Type</CardTitle>
              <CardDescription className="text-lg">
                Choose the container size that best fits your project
              </CardDescription>
            </CardHeader>
            <CardContent>
              {containerTypes.length === 0 ? (
                <div className="text-center p-8">
                  <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-2 text-lg">No container types available</p>
                  <p className="text-gray-400">Please contact support or try refreshing the page.</p>
                </div>
              ) : (
                <RadioGroup value={selectedContainer} onValueChange={setSelectedContainer}>
                  <div className="grid gap-4 sm:gap-6">
                    {containerTypes.map((container) => (
                      <div key={container.id} className="relative">
                        <RadioGroupItem value={container.id} id={container.id} className="sr-only" />
                        <Label
                          htmlFor={container.id}
                          className={cn(
                            "block cursor-pointer rounded-xl border-2 p-4 sm:p-6 transition-all duration-200",
                            selectedContainer === container.id
                              ? "border-blue-600 bg-blue-50"
                              : "border-gray-200 bg-white hover:border-gray-300",
                          )}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-center space-x-3 sm:space-x-4">
                              <div
                                className={cn(
                                  "w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0",
                                  selectedContainer === container.id
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-100 text-gray-600",
                                )}
                              >
                                <Truck className="w-5 h-5 sm:w-6 sm:h-6" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-lg sm:text-xl font-bold text-gray-900">{container.size}</div>
                                <div className="text-gray-600 mt-1 text-sm sm:text-base">{container.description}</div>
                                <div className="flex flex-col sm:flex-row sm:items-center mt-2 gap-2 sm:gap-4">
                                  <div className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                    Available: {container.available_quantity} units
                                  </div>
                                  <div className="text-xs sm:text-sm text-green-600 bg-green-100 px-2 py-1 rounded">
                                    Includes 2 tons
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="text-center sm:text-right">
                              <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                                {formatCurrency(container.price_per_day)}
                              </div>
                              <div className="text-xs sm:text-sm text-gray-500">per rental</div>
                            </div>
                          </div>
                          {selectedContainer === container.id && (
                            <div className="absolute top-2 right-2 sm:top-4 sm:right-4">
                              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-600 rounded-full flex items-center justify-center">
                                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                            </div>
                          )}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              )}
            </CardContent>
          </Card>
        )}

        {currentStep === 2 && (
          <Card className="border-0">
            <CardHeader className="text-center pb-4 sm:pb-6">
              <CardTitle className="text-xl sm:text-2xl">Select Rental Period</CardTitle>
              <CardDescription className="text-base sm:text-lg">
                Choose your start and end dates for the container rental
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-6">
              <div className="bg-blue-50 rounded-xl p-3 sm:p-6 border border-blue-200">
                <div className="flex items-center justify-center mb-2 sm:mb-4">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <CalendarIcon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>
                <div className="text-center mb-2 sm:mb-4">
                  <Label className="text-sm sm:text-lg font-semibold text-gray-900">Select Date Range</Label>
                </div>
                {currentStep === 2 && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full h-12 sm:h-14 justify-center text-left font-medium text-sm sm:text-base lg:text-lg border-2 hover:border-blue-300 transition-colors px-3 sm:px-4",
                          (!startDate || !endDate) && "text-muted-foreground",
                          startDate && endDate && "border-blue-600 bg-blue-50 text-blue-900",
                        )}
                      >
                        <CalendarIcon className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                        <span className="truncate">
                          {startDate && endDate
                            ? `${format(startDate, "MMM dd")} - ${format(endDate, "MMM dd, yyyy")}`
                            : "Click to select your rental dates"}
                        </span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 max-w-[calc(100vw-2rem)] sm:max-w-none z-50" align="center" side="bottom">
                      <Calendar
                        mode="range"
                        selected={{ from: startDate, to: endDate }}
                        onSelect={(range) => {
                          setStartDate(range?.from)
                          setEndDate(range?.to)
                        }}
                        disabled={(date) => date < new Date() || isDateUnavailable(date)}
                        initialFocus
                        numberOfMonths={isMobile ? 1 : 2}
                        modifiers={{
                          unavailable: (date) => isDateUnavailable(date),
                          limited: (date) => {
                            if (!selectedContainer) return false
                            const availability = getDateAvailability(date)
                            return availability.available > 0 && availability.available < availability.total
                          },
                        }}
                        modifiersStyles={{
                          unavailable: { backgroundColor: "#fee2e2", color: "#dc2626" },
                          limited: { backgroundColor: "#fef3c7", color: "#d97706" },
                        }}
                        className="rounded-md border"
                      />
                    </PopoverContent>
                  </Popover>
                )}
                {currentStep !== 2 && (
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full h-12 sm:h-14 justify-center text-left font-medium text-sm sm:text-base lg:text-lg border-2 px-3 sm:px-4",
                      startDate && endDate ? "border-blue-600 bg-blue-50 text-blue-900" : "border-gray-300 text-gray-500"
                    )}
                    disabled
                  >
                    <CalendarIcon className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                    <span className="truncate">
                      {startDate && endDate
                        ? `${format(startDate, "MMM dd")} - ${format(endDate, "MMM dd, yyyy")}`
                        : "No dates selected"}
                    </span>
                  </Button>
                )}
              </div>

              {selectedContainer && (
                <div className="bg-gray-50 p-3 sm:p-6 rounded-xl border">
                  <h4 className="font-semibold mb-2 sm:mb-4 text-gray-900 flex items-center text-sm sm:text-base">
                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600 flex-shrink-0" />
                    Availability Legend
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
                    <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-white rounded-lg border">
                      <div className="w-4 h-4 sm:w-6 sm:h-6 bg-white border-2 border-gray-300 rounded flex-shrink-0"></div>
                      <span className="font-medium text-gray-700 text-xs sm:text-sm lg:text-base">Available</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="w-4 h-4 sm:w-6 sm:h-6 bg-yellow-200 rounded flex-shrink-0"></div>
                      <span className="font-medium text-yellow-800 text-xs sm:text-sm lg:text-base">Limited</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-red-50 rounded-lg border border-red-200">
                      <div className="w-4 h-4 sm:w-6 sm:h-6 bg-red-200 rounded flex-shrink-0"></div>
                      <span className="font-medium text-red-800 text-xs sm:text-sm lg:text-base">Fully Booked</span>
                    </div>
                  </div>
                </div>
              )}

              {totalDays > 1 && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 sm:p-6 text-center">
                  <div className="text-lg sm:text-2xl font-bold text-green-800 mb-1">
                    {totalDays} Day{totalDays > 1 ? "s" : ""}
                  </div>
                  <div className="text-green-600 text-sm sm:text-base">Selected rental period</div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <Card className="border-0">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl">Service Options</CardTitle>
                <CardDescription className="text-lg">Choose how you'd like to handle your container</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={serviceType} onValueChange={setServiceType}>
                  <div className="grid gap-4">
                    <div className="relative">
                      <RadioGroupItem value="pickup" id="pickup" className="sr-only" />
                      <Label
                        htmlFor="pickup"
                        className={cn(
                          "block cursor-pointer rounded-xl border-2 p-6 transition-all duration-200",
                          serviceType === "pickup"
                            ? "border-blue-600 bg-blue-50"
                            : "border-gray-200 bg-white hover:border-gray-300",
                        )}
                      >
                        <div className="flex items-center space-x-4">
                          <div
                            className={cn(
                              "w-12 h-12 rounded-full flex items-center justify-center",
                              serviceType === "pickup" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600",
                            )}
                          >
                            <Truck className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <div className="text-xl font-bold text-gray-900">Pickup Service</div>
                            <div className="text-gray-600 mt-1">You pick up and return the container yourself</div>
                            <div className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded mt-2 inline-block">
                              Most economical option
                            </div>
                          </div>
                        </div>
                      </Label>
                    </div>

                    <div className="relative">
                      <RadioGroupItem value="delivery" id="delivery" className="sr-only" />
                      <Label
                        htmlFor="delivery"
                        className={cn(
                          "block cursor-pointer rounded-xl border-2 p-6 transition-all duration-200",
                          serviceType === "delivery"
                            ? "border-blue-600 bg-blue-50"
                            : "border-gray-200 bg-white hover:border-gray-300",
                        )}
                      >
                        <div className="flex items-center space-x-4">
                          <div
                            className={cn(
                              "w-12 h-12 rounded-full flex items-center justify-center",
                              serviceType === "delivery" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600",
                            )}
                          >
                            <MapPin className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <div className="text-xl font-bold text-gray-900">Delivery Service</div>
                            <div className="text-gray-600 mt-1">We deliver and pick up the container for you</div>
                            <div className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded mt-2 inline-block">
                              Most convenient option
                            </div>
                          </div>
                        </div>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>

                <div className="mt-6 bg-gray-50 rounded-xl p-6 border">
                  <Label htmlFor="pickupTime" className="text-lg font-semibold text-gray-900 mb-3 block">
                    Preferred Time
                  </Label>
                  <Input
                    id="pickupTime"
                    type="time"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="h-12 text-lg border-2 focus:border-blue-600"
                  />
                  <p className="text-sm text-gray-500 mt-2">We'll do our best to accommodate your preferred time</p>
                </div>
              </CardContent>
            </Card>



            {serviceType === "delivery" && (
              <Card className="border border-gray-200 border-l-4 border-l-blue-600">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Truck className="w-5 h-5 mr-2 text-blue-600" />
                    Delivery Address
                  </CardTitle>
                  <CardDescription className="text-sm">Where should we deliver the container?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {profile && profile.street_address && (
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="useProfileAddress"
                          checked={useProfileAddress}
                          onChange={(e) => setUseProfileAddress(e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <Label htmlFor="useProfileAddress" className="text-sm font-medium text-gray-900 cursor-pointer">
                          Use my profile address
                        </Label>
                      </div>
                      {useProfileAddress && (
                        <div className="mt-3 text-sm text-gray-600">
                          <p>{profile.street_address}</p>
                          <p>{profile.city}, {profile.state} {profile.zip_code}</p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {!useProfileAddress && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="deliveryStreetAddress" className="text-base font-medium">
                          Street Address *
                        </Label>
                        <Input
                          id="deliveryStreetAddress"
                          placeholder="123 Main Street"
                          value={deliveryStreetAddress}
                          onChange={(e) => setDeliveryStreetAddress(e.target.value)}
                          className="h-12 text-base border-2 focus:border-blue-600"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="deliveryCity" className="text-base font-medium">
                            City *
                          </Label>
                          <Input
                            id="deliveryCity"
                            placeholder="City"
                            value={deliveryCity}
                            onChange={(e) => setDeliveryCity(e.target.value)}
                            className="h-12 text-base border-2 focus:border-blue-600"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="deliveryState" className="text-base font-medium">
                            State *
                          </Label>
                          <Input
                            id="deliveryState"
                            placeholder="State"
                            value={deliveryState}
                            onChange={(e) => setDeliveryState(e.target.value)}
                            className="h-12 text-base border-2 focus:border-blue-600"
                            required
                          />
                        </div>
                        <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                          <Label htmlFor="deliveryZipCode" className="text-base font-medium">
                            ZIP Code *
                          </Label>
                          <Input
                            id="deliveryZipCode"
                            placeholder="12345"
                            value={deliveryZipCode}
                            onChange={(e) => setDeliveryZipCode(e.target.value)}
                            className="h-12 text-base border-2 focus:border-blue-600"
                            required
                          />
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {currentStep === 4 && (
          <Card className="border border-gray-200">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl">Additional Services</CardTitle>
              <CardDescription className="text-base">Enhance your rental with optional services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid gap-6">
                <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <Label htmlFor="extraTonnage" className="text-lg font-semibold text-gray-900 block mb-2">
                        Extra Tonnage
                      </Label>
                      <p className="text-gray-600 mb-4">Beyond included 2 tons - {formatCurrency(125)} per ton</p>
                      <div className="flex items-center space-x-4">
                        <Input
                          id="extraTonnage"
                          type="number"
                          min="0"
                          max="10"
                          value={extraTonnage}
                          onChange={(e) => setExtraTonnage(Number(e.target.value))}
                          className="w-24 h-12 text-center text-lg border-2 focus:border-orange-600"
                        />
                        <span className="text-gray-600">tons</span>
                        {extraTonnage > 0 && (
                          <div className="text-lg font-semibold text-orange-600">
                            +{formatCurrency(extraTonnage * 125)}
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-2">Each container includes 2 tons of debris</p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <Label htmlFor="applianceCount" className="text-lg font-semibold text-gray-900 block mb-2">
                        Appliance Disposal
                      </Label>
                      <p className="text-gray-600 mb-4">{formatCurrency(30)} per appliance</p>
                      <div className="flex items-center space-x-4">
                        <Input
                          id="applianceCount"
                          type="number"
                          min="0"
                          max="20"
                          value={applianceCount}
                          onChange={(e) => setApplianceCount(Number(e.target.value))}
                          className="w-24 h-12 text-center text-lg border-2 focus:border-green-600"
                        />
                        <span className="text-gray-600">appliances</span>
                        {applianceCount > 0 && (
                          <div className="text-lg font-semibold text-green-600">
                            +{formatCurrency(applianceCount * 30)}
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-2">Refrigerators, washers, dryers, etc.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 border">
                <Label htmlFor="notes" className="text-lg font-semibold text-gray-900 block mb-3">
                  Additional Notes
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Enter any special instructions, access requirements, or other notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[120px] text-base border-2 focus:border-blue-600 resize-none"
                />
                <p className="text-sm text-gray-500 mt-2">Help us serve you better with any special requirements</p>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 5 && selectedContainer && totalDays > 0 && (
          <Card className="border border-gray-200">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl">Order Summary</CardTitle>
              <CardDescription className="text-base">Review your booking details before proceeding</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                  <div className="bg-blue-50 rounded-xl p-4 sm:p-6 border border-blue-200">
                    <h4 className="text-lg sm:text-xl font-bold text-blue-900 mb-4 flex items-center">
                      <Truck className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                      Container Details
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm sm:text-base">Container:</span>
                        <span className="font-semibold text-gray-900 text-sm sm:text-base">
                          {containerTypes.find((ct) => ct.id === selectedContainer)?.size}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm sm:text-base">Rental Period:</span>
                        <span className="font-semibold text-gray-900 text-sm sm:text-base">
                          {totalDays} day{totalDays > 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm sm:text-base">Service:</span>
                        <span className="font-semibold text-gray-900 text-sm sm:text-base capitalize">{serviceType}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm sm:text-base">Preferred Time:</span>
                        <span className="font-semibold text-gray-900 text-sm sm:text-base">{pickupTime}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm sm:text-base">Dates:</span>
                        <span className="font-semibold text-gray-900 text-sm sm:text-base">
                          {startDate && endDate && `${format(startDate, "MMM dd")} - ${format(endDate, "MMM dd")}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-xl p-4 sm:p-6 border border-green-200">
                    <h4 className="text-lg sm:text-xl font-bold text-green-900 mb-4 flex items-center">
                      <MapPin className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                      Address Information
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <span className="text-sm font-semibold text-green-800 block mb-1">Billing Address:</span>
                        <div className="text-gray-700 text-sm sm:text-base">
                          {streetAddress}
                          <br />
                          {city}, {state} {zipCode}
                        </div>
                      </div>
                      {serviceType === "delivery" && (
                        <div>
                          <span className="text-sm font-semibold text-green-800 block mb-1">Delivery Address:</span>
                          <div className="text-gray-700 text-sm sm:text-base">
                            {deliveryStreetAddress}
                            <br />
                            {deliveryCity}, {deliveryState} {deliveryZipCode}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                  <h4 className="text-xl font-bold text-gray-900 mb-6 text-center">Pricing Breakdown</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-lg text-gray-700">
                        Base Price ({totalDays} day{totalDays > 1 ? "s" : ""}):
                      </span>
                      <span className="text-lg font-semibold text-gray-900">{formatCurrency(baseTotalAmount)}</span>
                    </div>
                    {extraTonnage > 0 && (
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="text-gray-700">Extra Tonnage ({extraTonnage} tons):</span>
                        <span className="font-semibold text-gray-900">{formatCurrency(extraTonnageAmount)}</span>
                      </div>
                    )}
                    {applianceCount > 0 && (
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="text-gray-700">Appliance Disposal ({applianceCount} items):</span>
                        <span className="font-semibold text-gray-900">{formatCurrency(applianceAmount)}</span>
                      </div>
                    )}
                    <div className="">
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold">Total Amount:</span>
                        <span className="text-2xl font-bold">{formatCurrency(totalAmount)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 6 && (
          <div className="space-y-6">
            {/* Order Summary */}
            <Card className="border-0">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl">Payment Information</CardTitle>
                <CardDescription className="text-lg">Complete your booking with secure payment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Order Summary */}
                  <Card className="border border-gray-200">
                    <CardHeader>
                      <CardTitle>Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Container:</span>
                          <span>
                            {containerTypes.find((ct) => ct.id === selectedContainer)?.size}
                          </span>
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
                          <span className="capitalize">{serviceType}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-semibold text-lg">
                          <span>Total:</span>
                          <span>{formatCurrency(totalAmount)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Payment Form */}
                  <Card className="border border-gray-200">
                    <CardHeader>
                      <CardTitle>Payment Method</CardTitle>
                      <CardDescription>Choose your payment method and enter details</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
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

                        {/* Stripe Elements */}
                        {paymentMethod === "stripe" && (
                          <StripeElements
                            amount={totalAmount}
                            bookingId="temp"
                            bookingData={{
                              container_type_id: selectedContainer,
                              start_date: startDate?.toISOString(),
                              end_date: endDate?.toISOString(),
                              service_type: serviceType,
                              customer_address: useProfileAddress ? `${profile?.address || ''}` : `${streetAddress}, ${city}, ${state} ${zipCode}`,
                              delivery_address: serviceType === 'delivery' ? `${deliveryStreetAddress}, ${deliveryCity}, ${deliveryState} ${deliveryZipCode}` : null,
                              total_amount: totalAmount,
                              pickup_time: pickupTime,
                              notes: notes,
                              phone: profile?.phone,
                            }}
                            onSuccess={(bookingData) => {
                              setIsSuccess(true)
                              setCurrentStep(7)
                              setSuccessData({
                                booking: bookingData,
                                payment: {
                                  transaction_id: "stripe_processing",
                                  payment_method: "stripe",
                                  amount: totalAmount,
                                  created_at: new Date().toISOString()
                                }
                              })
                            }}
                            onError={(error) => setError(error)}
                          />
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

                        <div className="text-xs text-gray-500 text-center">
                          <p>No real payment will be processed.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {currentStep === 7 && isSuccess && successData && (
          <div className="space-y-6 relative z-10">
            <Card className="border-0">
              <CardHeader className="text-center pb-6">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <CardTitle className="text-2xl text-green-600">Payment Successful!</CardTitle>
                <CardDescription className="text-lg">Your container rental has been confirmed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Booking Confirmation */}
                  <Card className="border border-gray-200">
                    <CardHeader>
                      <CardTitle>Booking Confirmation</CardTitle>
                      <CardDescription>Booking #{successData.booking.id.slice(0, 8)}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <CalendarIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="font-medium">Rental Period</p>
                            <p className="text-sm text-gray-600">
                              {format(new Date(successData.booking.start_date), "EEEE, MMMM dd, yyyy")} -{" "}
                              {format(new Date(successData.booking.end_date), "EEEE, MMMM dd, yyyy")}
                            </p>
                            {successData.booking.pickup_time && (
                              <p className="text-sm text-gray-600">Preferred time: {successData.booking.pickup_time}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Truck className="h-5 w-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="font-medium">Container & Service</p>
                            <p className="text-sm text-gray-600">
                              {containerTypes.find((ct) => ct.id === successData.booking.container_type_id)?.size}
                            </p>
                            <p className="text-sm text-gray-600 capitalize">{successData.booking.service_type} service</p>
                          </div>
                        </div>

                        {successData.booking.delivery_address && (
                          <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                            <div>
                              <p className="font-medium">Delivery Address</p>
                              <p className="text-sm text-gray-600">{successData.booking.delivery_address}</p>
                            </div>
                          </div>
                        )}

                        {successData.booking.notes && (
                          <div>
                            <p className="font-medium">Special Instructions</p>
                            <p className="text-sm text-gray-600">{successData.booking.notes}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Payment Details */}
                  <Card className="border border-gray-200">
                    <CardHeader>
                      <CardTitle>Payment Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Amount Paid:</span>
                          <span className="font-semibold">{formatCurrency(successData.payment.amount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Payment Method:</span>
                          <span className="capitalize">{successData.payment.payment_method.replace("_", " ")}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Transaction ID:</span>
                          <span className="font-mono text-sm">{successData.payment.transaction_id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Payment Date:</span>
                          <span>{format(new Date(successData.payment.created_at), "PPP")}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Next Steps */}
                  <Card className="border border-gray-200">
                    <CardHeader>
                      <CardTitle>What's Next?</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 text-sm text-gray-600">
                        <p>✅ Your booking has been confirmed and payment processed</p>
                        <p>📧 You'll receive a confirmation email with all the details</p>
                        <p>📞 Our team will contact you 24 hours before your scheduled date</p>
                        {successData.booking.service_type === "delivery" ? (
                          <p>🚚 We'll deliver the container to your specified address</p>
                        ) : (
                          <p>🏢 Please visit our location to pick up your container</p>
                        )}
                        <p>📱 You can track your booking status in your account</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {error && <div className="text-red-600 text-sm">{error}</div>}

        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center bg-transparent order-2 sm:order-1"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {currentStep < totalSteps ? (
            <Button type="button" onClick={nextStep} disabled={!canProceedToNextStep()} className="flex items-center order-1 sm:order-2">
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : currentStep === 6 ? (
            // Only show submit button for non-Stripe payment methods
            paymentMethod !== "stripe" && (
              <Button
                type="button"
                size="lg"
                disabled={
                  isLoading || !selectedContainer || !startDate || !endDate || !isDateRangeAvailable(startDate, endDate)
                }
                className="flex items-center order-1 sm:order-2"
                onClick={handlePaymentSubmit}
              >
                {isLoading ? "Processing Payment..." : `Pay ${formatCurrency(totalAmount)}`}
              </Button>
            )
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 order-1 sm:order-2 w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsSuccess(false)
                  setSuccessData(null)
                  setCurrentStep(1)
                  // Reset form
                  setSelectedContainer("")
                  setStartDate(undefined)
                  setEndDate(undefined)
                  setServiceType("pickup")
                  setPickupTime("09:00")
                  setStreetAddress("")
                  setCity("")
                  setState("")
                  setZipCode("")
                  setDeliveryStreetAddress("")
                  setDeliveryCity("")
                  setDeliveryState("")
                  setDeliveryZipCode("")
                  setUseProfileAddress(false)
                  setExtraTonnage(0)
                  setApplianceCount(0)
                  setNotes("")
                  setPaymentMethod("credit_card")
                  setCardNumber("")
                  setExpiryDate("")
                  setCvv("")
                  setCardName("")
                }}
                className="flex items-center"
              >
                Book Another Container
              </Button>
              <Button
                type="button"
                onClick={() => {
                  // This will trigger a page refresh to show the updated bookings list
                  window.location.reload()
                }}
                className="flex items-center"
              >
                View My Bookings
              </Button>
            </div>
          )}
        </div>
      </form>
    </div>
  )
}
