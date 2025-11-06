"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Truck, MapPin, AlertCircle, ChevronRight, ChevronLeft, CreditCard, Wallet, Smartphone } from "lucide-react"
import { format, differenceInDays, eachDayOfInterval, isValid } from "date-fns"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { StripeElements } from "@/components/stripe-elements"
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
import { SignaturePad } from "@/components/signature-pad"
import { extractBase64FromDataUrl, getSignatureInfo } from "@/lib/signature-utils"
import { uploadSignatureToCloudinary, getCloudinaryConfig } from "@/lib/cloudinary"

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

type GuestInfo = { fullName?: string; email?: string; phone?: string }

interface ExtendedBookingFormProps extends BookingFormProps {
  guestMode?: boolean
  guestInfo?: GuestInfo
  initialContainerTypes?: any[]
}

export function BookingForm({ user, guestMode = false, guestInfo, initialContainerTypes }: ExtendedBookingFormProps) {
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
  const topRef = useRef<HTMLDivElement | null>(null)
  const [guestFullName, setGuestFullName] = useState("")
  const [guestEmail, setGuestEmail] = useState("")
  const [guestPhone, setGuestPhone] = useState("")
  const isGuestUserConfigured = !!process.env.NEXT_PUBLIC_GUEST_USER_ID
  const [currentStep, setCurrentStep] = useState<number>(1)

  // Payment form state
  const [paymentMethod, setPaymentMethod] = useState("stripe")

  // Success state
  const [isSuccess, setIsSuccess] = useState(false)
  const [successData, setSuccessData] = useState<any>(null)
  const [isMobile, setIsMobile] = useState(false)

  // Signature state
  const [signatureImgUrl, setSignatureImgUrl] = useState<string>("")

  const router = useRouter()
  const supabase = createClient()


  const totalSteps = isSuccess ? 8 : 7

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
        // Load container types unless provided by parent
        if (initialContainerTypes && initialContainerTypes.length > 0) {
          setContainerTypes(initialContainerTypes)
        } else {
          const { data: containers, error: containerError } = await supabase
            .from("container_types")
            .select("*")
            .eq("is_hidden", false)
            .order("price_per_day")

          if (containerError) {
            console.error("Container error:", containerError)
            throw containerError
          }

          setContainerTypes(containers || [])
        }

        // Load existing bookings for availability checking
        const { data: bookings, error: bookingError } = await supabase
          .from("bookings")
          .select("id, start_date, end_date, container_type_id, status")
          .in("status", ["confirmed", "pending"])

        if (bookingError) {
          console.error("Booking error:", bookingError)
          throw bookingError
        }

        setExistingBookings(bookings || [])

        // Load user profile (skip in guest mode)
        if (!guestMode) {
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("id, email, full_name, phone, company, street_address, city, state, zip_code, country, role, is_admin")
            .eq("id", user.id)
            .single()

          if (profileError) {
            console.error("Profile error:", profileError)
          } else {
            setProfile(profile)
          }
        } else {
          setProfile(null)
        }
      } catch (error) {
        console.error("Error loading data:", error)
        setError("Failed to load container types. Please refresh the page.")
      } finally {
        setLoadingData(false)
      }
    }

    loadData()
  }, [supabase, guestMode, user?.id, initialContainerTypes])

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
  const applianceAmount = (applianceCount || 0) * 25
  const totalAmount = baseTotalAmount + extraTonnageAmount + applianceAmount

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

  const handleSignatureComplete = async (dataUrl: string) => {
    try {
      if (!dataUrl.startsWith('data:image/png;base64,')) {
        throw new Error('Signature must be in PNG format')
      }
      
      const base64Data = extractBase64FromDataUrl(dataUrl)
      
      const cloudinaryConfig = getCloudinaryConfig()
      if (!cloudinaryConfig.isConfigured) {
        setError('Cloudinary not configured. Please contact support.')
        return
      }
      
      const tempBookingId = `temp_${Date.now()}_${user.id.slice(0, 8)}`
      const cloudinaryUrl = await uploadSignatureToCloudinary(base64Data, tempBookingId)
      setSignatureImgUrl(cloudinaryUrl)
      
      setTimeout(() => {
        setCurrentStep(7)
      }, 1000)
      
    } catch (error) {
      console.error('❌ Signature upload error:', error)
      setError(error instanceof Error ? error.message : 'Failed to upload signature')
    }
  }

  const handleSignatureClear = () => {
    setSignatureImgUrl("")
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

    // Payment validation is handled by Stripe component

    try {
      const deliveryAddress =
        serviceType === "delivery"
          ? useProfileAddress && profile
            ? `${profile.street_address}, ${profile.city}, ${profile.state} ${profile.zip_code}`
            : `${deliveryStreetAddress}, ${deliveryCity}, ${deliveryState} ${deliveryZipCode}`
          : null

      // Update user profile with phone if available
      if (!guestMode) {
        const { data: { user: currentUser } } = await supabase.auth.getUser()
        if (currentUser?.user_metadata?.phone) {
          await supabase.from("profiles").update({ phone: currentUser.user_metadata.phone }).eq("id", user.id)
        }
      }

      // Create the booking with signature URL
      const insertData = {
        user_id: guestMode ? (process.env.NEXT_PUBLIC_GUEST_USER_ID as string) : user.id,
        container_type_id: selectedContainer,
        start_date: format(startDate, "yyyy-MM-dd"),
        end_date: format(endDate, "yyyy-MM-dd"),
        pickup_time: pickupTime,
        delivery_address: deliveryAddress,
        customer_address: `${streetAddress}, ${city}, ${state} ${zipCode}`,
        service_type: serviceType,
        total_amount: totalAmount,
        notes: (() => {
          const base = notes.trim() || ""
          if (guestMode) {
            const extra = [`Guest Name: ${guestFullName || ""}`, `Guest Email: ${guestEmail || ""}`, `Guest Phone: ${guestPhone || ""}`].filter(Boolean).join(" | ")
            return [base, extra].filter(Boolean).join("\n") || null
          }
          return base || null
        })(),
        status: "pending",
        payment_status: "pending",
        signature_img_url: signatureImgUrl || null,
      }
      const { data: booking, error: bookingError } = await supabase
        .from("bookings")
        .insert(insertData)
        .select()
        .single()

      if (bookingError) {
        console.error("Booking creation error:", bookingError)
        console.error("Full error details:", {
          message: bookingError.message,
          details: bookingError.details,
          hint: bookingError.hint,
          code: bookingError.code
        })
        throw new Error(`Failed to create booking: ${bookingError.message}`)
      }


      // Skip payment processing for Stripe as it's handled by its component
      let paymentResult = null
      if (paymentMethod !== "stripe") {
        // Simulate payment processing for other methods (like bank_transfer)
        paymentResult = await simulatePayment()

        // Create payment record
        const { error: paymentError } = await supabase.from("payments").insert({
          booking_id: booking.id,
          amount: totalAmount,
          payment_method: paymentMethod,
          transaction_id: paymentResult.transaction_id,
          status: paymentResult.status,
        })

        if (paymentError) {
          console.error("Payment creation error:", paymentError)
          throw new Error(`Failed to create payment record: ${paymentError.message}`)
        }

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
          console.error("Booking update error:", updateError)
          throw new Error(`Failed to update booking status: ${updateError.message}`)
        }
      }

      // Set success state with booking data
      setSuccessData({
        booking: booking,
        payment: paymentMethod === "stripe" ? {
          transaction_id: "stripe_processing",
          payment_method: paymentMethod,
          amount: totalAmount,
          created_at: new Date().toISOString()
        } : paymentResult ? {
          transaction_id: paymentResult.transaction_id,
          payment_method: paymentMethod,
          amount: totalAmount,
          created_at: new Date().toISOString()
        } : {
          transaction_id: "pending",
          payment_method: paymentMethod,
          amount: totalAmount,
          created_at: new Date().toISOString()
        }
      })
      setIsSuccess(true)
      setCurrentStep(8)
    } catch (error: unknown) {
      console.error("Payment error:", error)
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("Payment failed. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handlePaymentSuccess = async (method: string, transactionId: string) => {
    setIsLoading(true)
    setError(null)

    try {
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

      // Create the booking with signature URL
      const insertData = {
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
        status: "confirmed",
        payment_status: "paid",
        signature_img_url: signatureImgUrl || null,
      }
      const { data: booking, error: bookingError } = await supabase
        .from("bookings")
        .insert(insertData)
        .select()
        .single()

      if (bookingError) {
        console.error("Booking creation error:", bookingError)
        console.error("Full error details:", {
          message: bookingError.message,
          details: bookingError.details,
          hint: bookingError.hint,
          code: bookingError.code
        })
        throw new Error(`Failed to create booking: ${bookingError.message}`)
      }


      // Create payment record
      const { error: paymentError } = await supabase.from("payments").insert({
        booking_id: booking.id,
        amount: totalAmount,
        payment_method: method,
        transaction_id: transactionId,
        status: "completed",
      })

      if (paymentError) {
        console.error("Payment creation error:", paymentError)
        throw new Error(`Failed to create payment record: ${paymentError.message}`)
      }

      // Send booking confirmation emails
      try {
        console.log('📧 Attempting to send booking confirmation emails...')
        const emailResponse = await fetch('/api/send-booking-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            bookingId: booking.id,
            customerName: profile?.full_name || user.email?.split('@')[0] || 'Customer',
            customerEmail: user.email,
            containerType: selectedContainerType?.size || 'Container',
            startDate: format(startDate, "MMMM dd, yyyy"),
            endDate: format(endDate, "MMMM dd, yyyy"),
            serviceType: serviceType,
            totalAmount: totalAmount,
            deliveryAddress: deliveryAddress,
            pickupTime: pickupTime,
            notes: notes.trim() || undefined,
          }),
        })
        
        if (!emailResponse.ok) {
          const errorData = await emailResponse.json()
          console.warn('⚠️ Email notification failed:', errorData)
          console.log('Note: Booking was successful, but email notification could not be sent.')
          if (!errorData.emailConfigured) {
            console.log('Email is not configured. Set SMTP environment variables to enable email notifications.')
          }
          // Continue to show success page despite email failure
        } else {
          const emailResult = await emailResponse.json()
          if (emailResult.skipped) {
            console.log('ℹ️ Email notification skipped:', emailResult.message)
          } else {
            console.log('✅ Booking confirmation emails sent successfully:', emailResult)
          }
        }
      } catch (emailError) {
        console.warn('⚠️ Email notification failed (non-critical):', emailError)
        console.log('Note: Your booking was successful, but we could not send the confirmation email.')
        // Don't throw error - email failure shouldn't stop the booking process
      }

      // Set success state with booking data (always execute, regardless of email status)
      setSuccessData({
        booking: booking,
        payment: {
          transaction_id: transactionId,
          payment_method: method,
          amount: totalAmount,
          created_at: new Date().toISOString()
        }
      })
      setIsSuccess(true)
      setCurrentStep(8)
    } catch (error: unknown) {
      console.error("Payment success error:", error)
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("Failed to process payment. Please contact support.")
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
      case 6:
        return signatureImgUrl !== ""
      case 7:
        if (guestMode) {
          const hasName = guestFullName.trim().length > 1
          const hasEmail = /.+@.+\..+/.test(guestEmail)
          const hasPhone = guestPhone.trim().length >= 7
          return paymentMethod !== "" && hasName && hasEmail && hasPhone && isGuestUserConfigured
        }
        return paymentMethod !== ""
      default:
        return true
    }
  }

  // Scroll to top when step changes
  useEffect(() => {
    if (typeof window === "undefined") return
    // Prefer scrolling the component into view; fallback to window scroll
    if (topRef && topRef.current) {
      try {
        topRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
        return
      } catch (_) {}
    }
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [currentStep])

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
    <div className="w-full mx-auto px-1 sm:px-6 lg:px-8">
      <div ref={topRef} />
      <div className="mb-4 sm:mb-6 lg:mb-8">
        {!isSuccess && (
          <div className="relative">
            <div className="flex items-center justify-center overflow-x-auto lg:overflow-visible pb-3 px-6 md:px-10">
              <div className="flex items-center justify-center min-w-max pl-8 pr-8 md:pl-12 md:pr-12">
                <div className="w-4 md:w-6 flex-shrink-0" />
                {Array.from({ length: totalSteps }, (_, i) => (
                  <div key={i} className="flex items-center">
                    <div className="relative flex items-center justify-center">
                      <div
                        className={cn(
                          "w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center text-xs sm:text-sm lg:text-base font-semibold border-2 transition-all duration-200 z-10 bg-white",
                          i + 1 <= currentStep
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-400 border-gray-300",
                        )}
                      >
                        {i + 1}
                      </div>
                    </div>
                    {i < totalSteps - 1 && (
                      <div className="h-0.5 w-4 sm:w-6 md:w-8 lg:w-12 xl:w-16">
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
                <div className="w-4 md:w-6 flex-shrink-0" />
              </div>
            </div>
          </div>
        )}
        <div className="mt-3 sm:mt-4 lg:mt-6 text-center px-2">
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
            {currentStep === 1 && "Select Container"}
            {currentStep === 2 && "Choose Dates"}
            {currentStep === 3 && "Service & Address"}
            {currentStep === 4 && "Additional Services"}
            {currentStep === 5 && "Review & Book"}
            {currentStep === 6 && "Rental Agreement"}
            {currentStep === 7 && "Payment"}
            {currentStep === 8 && "Booking Confirmed!"}
          </h2>
          <p className="text-gray-600 mt-1 text-xs sm:text-sm md:text-base lg:text-lg max-w-3xl mx-auto">
            {currentStep === 1 && "Choose the perfect container size for your project"}
            {currentStep === 2 && "Select your rental dates"}
            {currentStep === 3 && "Configure service options and addresses"}
            {currentStep === 4 && "Add optional services"}
            {currentStep === 5 && "Review and confirm your booking"}
            {currentStep === 6 && "Review the rental agreement and sign below"}
            {currentStep === 7 && "Complete your payment securely"}
            {currentStep === 8 && "Your booking has been successfully confirmed"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {currentStep === 1 && (
          <>
            {guestMode && (
              <div className="mb-4 sm:mb-6 rounded-xl border-2 border-blue-200 bg-blue-50 p-4 sm:p-5 text-center">
                <h3 className="text-base sm:text-lg font-semibold text-blue-900">Book as Guest</h3>
                <p className="text-sm sm:text-base text-blue-800 mt-1">No account required. Share your details and we’ll follow up to confirm.</p>
              </div>
            )}
            <Card className="border-0 shadow-lg">
            <CardContent className="px-2 sm:px-6">
              {containerTypes.length === 0 ? (
                <div className="text-center p-4 sm:p-6 lg:p-8">
                  <AlertCircle className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-2 text-base sm:text-lg">No container types available</p>
                  <p className="text-gray-400 text-sm sm:text-base">Please contact support or try refreshing the page.</p>
                </div>
              ) : (
                <RadioGroup value={selectedContainer} onValueChange={setSelectedContainer}>
                  <div className="grid gap-3 sm:gap-4 lg:gap-6">
                    {containerTypes.map((container) => (
                      <div key={container.id} className="relative">
                        <RadioGroupItem value={container.id} id={container.id} className="sr-only" />
                        <Label
                          htmlFor={container.id}
                          className={cn(
                            "block cursor-pointer rounded-xl border-2 p-3 sm:p-4 lg:p-6 transition-all duration-200",
                            selectedContainer === container.id
                              ? "border-blue-600 bg-blue-50 shadow-md"
                              : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm",
                          )}
                        >
                          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
                            <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                              <div
                                className={cn(
                                  "w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center flex-shrink-0",
                                  selectedContainer === container.id
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-100 text-gray-600",
                                )}
                              >
                                <Truck className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 break-words">{container.size}</div>
                                <div className="text-gray-600 mt-1 text-xs sm:text-sm lg:text-base break-words">{container.description}</div>
                                <div className="flex flex-col sm:flex-row sm:items-center mt-2 gap-1 sm:gap-2 md:gap-3">
                                  <div className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded inline-block">
                                    Available: {container.available_quantity} units
                                  </div>
                                  <div className="text-xs sm:text-sm text-green-600 bg-green-100 px-2 py-1 rounded inline-block">
                                    Includes 2 tons
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="text-left sm:text-center lg:text-right lg:flex-shrink-0">
                              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                                {formatCurrency(container.price_per_day)}
                              </div>
                              <div className="text-xs sm:text-sm lg:text-base text-gray-500">per rental</div>
                            </div>
                          </div>
                          {selectedContainer === container.id && (
                            <div className="absolute top-2 right-2 sm:top-3 sm:right-3 lg:top-4 lg:right-4">
                              <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-blue-600 rounded-full flex items-center justify-center">
                                <svg className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
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
          </>
        )}

        {currentStep === 2 && (
          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center pb-4 sm:pb-6 px-2 sm:px-6">
              <CardTitle className="text-xl sm:text-2xl lg:text-3xl">Select Rental Period</CardTitle>
              <CardDescription className="text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">
                Choose your start and end dates for the container rental
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6 px-2 sm:px-6">
              <div className="bg-blue-50 rounded-xl p-4 sm:p-6 lg:p-8 border border-blue-200">
                <div className="flex items-center justify-center mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-blue-600 rounded-full flex items-center justify-center">
                    <CalendarIcon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" />
                  </div>
                </div>
                <div className="text-center mb-3 sm:mb-4">
                  <Label className="text-sm sm:text-lg lg:text-xl font-semibold text-gray-900">Select Date Range</Label>
                </div>
                {currentStep === 2 && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full h-12 sm:h-14 lg:h-16 justify-center text-left font-medium text-sm sm:text-base lg:text-lg border-2 hover:border-blue-300 transition-colors px-2 sm:px-4",
                          (!startDate || !endDate) && "text-muted-foreground",
                          startDate && endDate && "border-blue-600 bg-blue-50 text-blue-900",
                        )}
                      >
                        <CalendarIcon className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 flex-shrink-0" />
                        <span className="truncate text-xs sm:text-sm sm:text-base lg:text-lg">
                          {startDate && endDate
                            ? `${format(startDate, "MMM dd")} - ${format(endDate, "MMM dd, yyyy")}`
                            : "Click to select your rental dates"}
                        </span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 max-w-[calc(100vw-1rem)] sm:max-w-none z-50" align="center" side="bottom">
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
                        className="rounded-md border shadow-lg"
                      />
                    </PopoverContent>
                  </Popover>
                )}
                {currentStep !== 2 && (
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full h-12 sm:h-14 lg:h-16 justify-center text-left font-medium text-sm sm:text-base lg:text-lg border-2 px-2 sm:px-4",
                      startDate && endDate ? "border-blue-600 bg-blue-50 text-blue-900" : "border-gray-300 text-gray-500"
                    )}
                    disabled
                  >
                    <CalendarIcon className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 flex-shrink-0" />
                    <span className="truncate text-xs sm:text-sm sm:text-base lg:text-lg">
                      {startDate && endDate
                        ? `${format(startDate, "MMM dd")} - ${format(endDate, "MMM dd, yyyy")}`
                        : "No dates selected"}
                    </span>
                  </Button>
                )}
              </div>

              {selectedContainer && (
                <div className="bg-gray-50 p-4 sm:p-6 rounded-xl border">
                  <h4 className="font-semibold mb-3 sm:mb-4 text-gray-900 flex items-center text-sm sm:text-base lg:text-lg">
                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600 flex-shrink-0" />
                    Availability Legend
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
                    <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-white rounded-lg border">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 sm:w-5 sm:h-5 bg-white border-2 border-gray-300 rounded flex-shrink-0"></div>
                      <span className="font-medium text-gray-700 text-xs sm:text-sm lg:text-base">Available</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 sm:w-5 sm:h-5 bg-yellow-200 rounded flex-shrink-0"></div>
                      <span className="font-medium text-yellow-800 text-xs sm:text-sm lg:text-base">Limited</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-red-50 rounded-lg border border-red-200">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 sm:w-5 sm:h-5 bg-red-200 rounded flex-shrink-0"></div>
                      <span className="font-medium text-red-800 text-xs sm:text-sm lg:text-base">Fully Booked</span>
                    </div>
                  </div>
                </div>
              )}

              {totalDays > 1 && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 sm:p-6 lg:p-8 text-center">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-800 mb-1 sm:mb-2">
                    {totalDays} Day{totalDays > 1 ? "s" : ""}
                  </div>
                  <div className="text-green-600 text-sm sm:text-base lg:text-lg">Selected rental period</div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {currentStep === 3 && (
          <div className="space-y-4 sm:space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center pb-4 sm:pb-6 px-2 sm:px-6">
                <CardTitle className="text-xl sm:text-2xl lg:text-3xl">Service Options</CardTitle>
                <CardDescription className="text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">Choose how you'd like to handle your container</CardDescription>
              </CardHeader>
              <CardContent className="px-2 sm:px-6">
                <RadioGroup value={serviceType} onValueChange={setServiceType}>
                  <div className="grid gap-3 sm:gap-4 lg:gap-6">
                    <div className="relative">
                      <RadioGroupItem value="pickup" id="pickup" className="sr-only" />
                      <Label
                        htmlFor="pickup"
                        className={cn(
                          "block cursor-pointer rounded-xl border-2 p-4 sm:p-6 transition-all duration-200",
                          serviceType === "pickup"
                            ? "border-blue-600 bg-blue-50 shadow-md"
                            : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm",
                        )}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-6 lg:space-x-8">
                          <div
                            className={cn(
                              "w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0",
                              serviceType === "pickup" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600",
                            )}
                          >
                            <Truck className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
                          </div>
                          <div className="flex-1 text-center sm:text-left ml-5">
                            <div className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">Pickup Service</div>
                            <div className="text-gray-600 mt-1 text-sm sm:text-base">You pick up and return the container yourself</div>
                            <div className="text-xs sm:text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded mt-2 inline-block">
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
                          "block cursor-pointer rounded-xl border-2 p-4 sm:p-6 transition-all duration-200",
                          serviceType === "delivery"
                            ? "border-blue-600 bg-blue-50 shadow-md"
                            : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm",
                        )}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-6 lg:space-x-8">
                          <div
                            className={cn(
                              "w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0",
                              serviceType === "delivery" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600",
                            )}
                          >
                            <MapPin className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
                          </div>
                          <div className="flex-1 text-center sm:text-left ml-5">
                            <div className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">Delivery Service</div>
                            <div className="text-gray-600 mt-1 text-sm sm:text-base">We deliver and pick up the container for you</div>
                            <div className="text-xs sm:text-sm text-green-600 bg-green-100 px-2 py-1 rounded mt-2 inline-block">
                              Most convenient option
                            </div>
                          </div>
                        </div>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>

                <div className="mt-4 sm:mt-6 bg-gray-50 rounded-xl p-4 sm:p-6 border">
                  <Label htmlFor="pickupTime" className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-3 block">
                    Preferred Time
                  </Label>
                  <Input
                    id="pickupTime"
                    type="time"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="h-10 sm:h-12 lg:h-14 text-sm sm:text-base lg:text-lg border-2 focus:border-blue-600"
                  />
                  <p className="text-xs sm:text-sm text-gray-500 mt-2">We'll do our best to accommodate your preferred time</p>
                </div>
              </CardContent>
            </Card>



            {serviceType === "delivery" && (
              <Card className="border border-gray-200 border-l-4 border-l-blue-600 shadow-lg">
                <CardHeader className="px-2 sm:px-6">
                  <CardTitle className="text-base sm:text-lg lg:text-xl flex items-center">
                    <Truck className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
                    Delivery Address
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm lg:text-base">Where should we deliver the container?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6 px-2 sm:px-6">
                  {profile && profile.street_address && (
                    <div className="bg-blue-50 rounded-lg p-3 sm:p-4 border border-blue-200">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="useProfileAddress"
                          checked={useProfileAddress}
                          onChange={(e) => setUseProfileAddress(e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <Label htmlFor="useProfileAddress" className="text-xs sm:text-sm font-medium text-gray-900 cursor-pointer">
                          Use my profile address
                        </Label>
                      </div>
                      {useProfileAddress && (
                        <div className="mt-3 text-xs sm:text-sm text-gray-600">
                          <p>{profile.street_address}</p>
                          <p>{profile.city}, {profile.state} {profile.zip_code}</p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {!useProfileAddress && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="deliveryStreetAddress" className="text-sm sm:text-base lg:text-lg font-medium">
                          Street Address *
                        </Label>
                        <Input
                          id="deliveryStreetAddress"
                          placeholder="123 Main Street"
                          value={deliveryStreetAddress}
                          onChange={(e) => setDeliveryStreetAddress(e.target.value)}
                          className="h-10 sm:h-12 lg:h-14 text-sm sm:text-base border-2 focus:border-blue-600"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="deliveryCity" className="text-sm sm:text-base lg:text-lg font-medium">
                            City *
                          </Label>
                          <Input
                            id="deliveryCity"
                            placeholder="City"
                            value={deliveryCity}
                            onChange={(e) => setDeliveryCity(e.target.value)}
                            className="h-10 sm:h-12 lg:h-14 text-sm sm:text-base border-2 focus:border-blue-600"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="deliveryState" className="text-sm sm:text-base lg:text-lg font-medium">
                            State *
                          </Label>
                          <Input
                            id="deliveryState"
                            placeholder="State"
                            value={deliveryState}
                            onChange={(e) => setDeliveryState(e.target.value)}
                            className="h-10 sm:h-12 lg:h-14 text-sm sm:text-base border-2 focus:border-blue-600"
                            required
                          />
                        </div>
                        <div className="space-y-2 sm:col-span-2 xl:col-span-1">
                          <Label htmlFor="deliveryZipCode" className="text-sm sm:text-base lg:text-lg font-medium">
                            ZIP Code *
                          </Label>
                          <Input
                            id="deliveryZipCode"
                            placeholder="12345"
                            value={deliveryZipCode}
                            onChange={(e) => setDeliveryZipCode(e.target.value)}
                            className="h-10 sm:h-12 lg:h-14 text-sm sm:text-base border-2 focus:border-blue-600"
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
          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center pb-4 sm:pb-6 px-2 sm:px-6">
              <CardTitle className="text-xl sm:text-2xl lg:text-3xl">Additional Services</CardTitle>
              <CardDescription className="text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">Enhance your rental with optional services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 sm:space-y-8 px-2 sm:px-6">
              <div className="grid gap-4 sm:gap-6 lg:gap-8">
                <div className="bg-orange-50 rounded-xl p-4 sm:p-6 lg:p-8 border border-orange-200">
                  <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                        />
                      </svg>
                    </div>
                    <div className="flex-1 text-center sm:text-left ml-5">
                      <Label htmlFor="extraTonnage" className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 block mb-2">
                        Extra Tonnage
                      </Label>
                      <p className="text-gray-600 mb-4 text-sm sm:text-base">Beyond included 2 tons - {formatCurrency(125)} per ton</p>
                      <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start space-y-2 sm:space-y-0 sm:space-x-4">
                        <Input
                          id="extraTonnage"
                          type="number"
                          min="0"
                          max="10"
                          value={extraTonnage}
                          onChange={(e) => setExtraTonnage(Number(e.target.value))}
                          className="w-20 sm:w-24 h-10 sm:h-12 text-center text-sm sm:text-base lg:text-lg border-2 focus:border-orange-600"
                        />
                        <span className="text-gray-600 text-sm sm:text-base">tons</span>
                        {extraTonnage > 0 && (
                          <div className="text-base sm:text-lg lg:text-xl font-semibold text-orange-600">
                            +{formatCurrency(extraTonnage * 125)}
                          </div>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500 mt-2">Each container includes 2 tons of debris</p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-xl p-4 sm:p-6 lg:p-8 border border-green-200">
                  <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </div>
                    <div className="flex-1 text-center sm:text-left ml-5">
                      <Label htmlFor="applianceCount" className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 block mb-2">
                        Appliance Disposal
                      </Label>
                      <p className="text-gray-600 mb-4 text-sm sm:text-base">{formatCurrency(25)} per appliance</p>
                      <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start space-y-2 sm:space-y-0 sm:space-x-4">
                        <Input
                          id="applianceCount"
                          type="number"
                          min="0"
                          max="20"
                          value={applianceCount}
                          onChange={(e) => setApplianceCount(Number(e.target.value))}
                          className="w-20 sm:w-24 h-10 sm:h-12 text-center text-sm sm:text-base lg:text-lg border-2 focus:border-green-600"
                        />
                        <span className="text-gray-600 text-sm sm:text-base">appliances</span>
                        {applianceCount > 0 && (
                          <div className="text-base sm:text-lg lg:text-xl font-semibold text-green-600">
                            +{formatCurrency(applianceCount * 25)}
                          </div>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500 mt-2">Refrigerators, washers, dryers, etc.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 sm:p-6 lg:p-8 border">
                <Label htmlFor="notes" className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 block mb-3">
                  Additional Notes
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Enter any special instructions, access requirements, or other notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[100px] sm:min-h-[120px] lg:min-h-[140px] text-sm sm:text-base border-2 focus:border-blue-600 resize-none"
                />
                <p className="text-xs sm:text-sm text-gray-500 mt-2">Help us serve you better with any special requirements</p>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 5 && selectedContainer && totalDays > 0 && (
          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center pb-4 sm:pb-6 px-2 sm:px-6">
              <CardTitle className="text-xl sm:text-2xl lg:text-3xl">Order Summary</CardTitle>
              <CardDescription className="text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">Review your booking details before proceeding</CardDescription>
            </CardHeader>
            <CardContent className="px-2 sm:px-6">
              <div className="space-y-6 sm:space-y-8">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                  <div className="bg-blue-50 rounded-xl p-4 sm:p-6 lg:p-8 border border-blue-200">
                    <h4 className="text-base sm:text-lg lg:text-xl font-bold text-blue-900 mb-3 sm:mb-4 flex items-center">
                      <Truck className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 mr-2" />
                      Container Details
                    </h4>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
                        <span className="text-gray-600 text-xs sm:text-sm lg:text-base">Container:</span>
                        <span className="font-semibold text-gray-900 text-xs sm:text-sm lg:text-base break-words">
                          {containerTypes.find((ct) => ct.id === selectedContainer)?.size}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
                        <span className="text-gray-600 text-xs sm:text-sm lg:text-base">Rental Period:</span>
                        <span className="font-semibold text-gray-900 text-xs sm:text-sm lg:text-base">
                          {totalDays} day{totalDays > 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
                        <span className="text-gray-600 text-xs sm:text-sm lg:text-base">Service:</span>
                        <span className="font-semibold text-gray-900 text-xs sm:text-sm lg:text-base capitalize">{serviceType}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
                        <span className="text-gray-600 text-xs sm:text-sm lg:text-base">Preferred Time:</span>
                        <span className="font-semibold text-gray-900 text-xs sm:text-sm lg:text-base">{pickupTime}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
                        <span className="text-gray-600 text-xs sm:text-sm lg:text-base">Dates:</span>
                        <span className="font-semibold text-gray-900 text-xs sm:text-sm lg:text-base">
                          {startDate && endDate && `${format(startDate, "MMM dd")} - ${format(endDate, "MMM dd")}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-xl p-4 sm:p-6 lg:p-8 border border-green-200">
                    <h4 className="text-base sm:text-lg lg:text-xl font-bold text-green-900 mb-3 sm:mb-4 flex items-center">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 mr-2" />
                      Address Information
                    </h4>
                    <div className="space-y-3 sm:space-y-4">
                      <div>
                        <span className="text-xs sm:text-sm font-semibold text-green-800 block mb-1">Billing Address:</span>
                        <div className="text-gray-700 text-xs sm:text-sm lg:text-base break-words">
                          {streetAddress}
                          <br />
                          {city}, {state} {zipCode}
                        </div>
                      </div>
                      {serviceType === "delivery" && (
                        <div>
                          <span className="text-xs sm:text-sm font-semibold text-green-800 block mb-1">Delivery Address:</span>
                          <div className="text-gray-700 text-xs sm:text-sm lg:text-base break-words">
                            {deliveryStreetAddress}
                            <br />
                            {deliveryCity}, {deliveryState} {deliveryZipCode}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 sm:p-6 lg:p-8 border-2 border-gray-200">
                  <h4 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">Pricing Breakdown</h4>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-200 gap-1 sm:gap-2">
                      <span className="text-sm sm:text-base lg:text-lg text-gray-700">
                        Base Price ({totalDays} day{totalDays > 1 ? "s" : ""}):
                      </span>
                      <span className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900">{formatCurrency(baseTotalAmount)}</span>
                    </div>
                    {extraTonnage > 0 && (
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-200 gap-1 sm:gap-2">
                        <span className="text-sm sm:text-base lg:text-lg text-gray-700">Extra Tonnage ({extraTonnage} tons):</span>
                        <span className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900">{formatCurrency(extraTonnageAmount)}</span>
                      </div>
                    )}
                    {applianceCount > 0 && (
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-200 gap-1 sm:gap-2">
                        <span className="text-sm sm:text-base lg:text-lg text-gray-700">Appliance Disposal ({applianceCount} items):</span>
                        <span className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900">{formatCurrency(applianceAmount)}</span>
                      </div>
                    )}
                    <div className="pt-2">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
                        <span className="text-lg sm:text-xl lg:text-2xl font-bold">Total Amount:</span>
                        <span className="text-xl sm:text-2xl lg:text-3xl font-bold">{formatCurrency(totalAmount)}</span>
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
            {/* Rental Contract */}
            <Card className="border-0">
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
                        <span className="ml-2 text-gray-900">
                          {containerTypes.find((ct) => ct.id === selectedContainer)?.size}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Rental Period:</span>
                        <span className="ml-2 text-gray-900">
                          {startDate && endDate ? `${format(startDate, "MMM dd")} - ${format(endDate, "MMM dd, yyyy")}` : "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Service Type:</span>
                        <span className="ml-2 text-gray-900 capitalize">{serviceType}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Total Amount:</span>
                        <span className="ml-2 text-gray-900 font-semibold">{formatCurrency(totalAmount)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">Terms of Lease</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-gray-700 leading-relaxed">
                          San Diego Dumping Solutions will provide dumpster disposal service using our roll-off containers. 
                          Service will be provided on the day requested when using our online ordering software. 
                          Additional days on your rental period will be $25 Per Day, starting on the 4th day until the roll-off is picked up.
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900">Additional Charges:</h4>
                        <p className="text-gray-700 leading-relaxed">
                          All customers are responsible for the total weight of the contents of their dumpster(s). 
                          All customers are responsible for scheduling the removal of their dumpster(s). 
                          All customers are responsible for ensuring their dumpster(s) are not overloaded. 
                          Customers shall inspect the dumpster upon delivery for any existing damage. 
                          Upon removal of the dumpster, San Diego Dumping Solutions shall be entitled to charge the customer 
                          for the repair or replacement costs attributable to any damage to the dumpster while in the customer's possession. 
                          The customer shall be liable for any repair or replacement costs. Upon removal, the customer authorizes 
                          San Diego Dumping Solutions to collect any additional disposal and repair or replacement costs attributable to the customer.
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900">Weight Allowance:</h4>
                        <p className="text-gray-700 leading-relaxed">
                          Exceeding stated weight allowance will result in an additional charge of $125 per ton
                        </p>
                        <ul className="list-disc list-inside text-gray-700 ml-4 mt-2">
                          <li>17 yard - 4,000 lbs included ($125 per additional 2,000 pounds) - In no event will customer load debris weighing 12,000 lbs or more</li>
                          <li>21 yard - 4,000 lbs included ($125 per additional 2,000 pounds) - In no event will customer load debris weighing 12,000 lbs or more</li>
                        </ul>
                        <p className="text-gray-700 leading-relaxed mt-2">
                          Any weight above the max tonnage allowed will result in refusal of service and off-loading shall be required. 
                          A dry run charge can range from $150 to up $200 per occurrence. Blocking or impeding retrieval of a roll-off 
                          on the agreed collection date will result in a dry run charge.
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900">Additional Service Charges:</h4>
                        <ul className="list-disc list-inside text-gray-700 ml-4">
                          <li>Cleaning due to loading of restricted or hazardous materials may be billed at a 3rd party rate plus a reasonable markup.</li>
                          <li>Mattresses and box springs will be $25 additional, each.</li>
                          <li>Appliances will be $25 additional, each.</li>
                          <li>Electronics will be $25 additional, each.</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900">Waste Material:</h4>
                        <p className="text-gray-700 leading-relaxed">
                          Non-Hazardous Solid Waste Only. Customer agrees not to put any waste that is liquid, or any waste that is, 
                          or contains, radioactive, volatile, corrosive, highly flammable, explosive, biomedical, biohazardous, infectious, 
                          toxic, and/or any hazardous wastes or substances ("Prohibited Waste") into roll-off containers. Prohibited Waste 
                          includes, but is not limited to, tires, paint, batteries, paint cans, ashes, oil, vehicle parts, sewage sludge, etc.
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900">Inspection/Rejection of Prohibited Waste:</h4>
                        <p className="text-gray-700 leading-relaxed">
                          Title to and liability for Prohibited Waste shall remain with Customer at all times. 
                          San Diego Dumping Solutions shall have the right to inspect, analyze, and/or test any waste delivered by customer.
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900">Acknowledgement:</h4>
                        <p className="text-gray-700 leading-relaxed">
                          Customer acknowledges that San Diego Dumping Solutions shall not be liable for any damage to driving surfaces 
                          resulting from San Diego Dumping Solutions trucks serving containers on the agreed upon areas and the surroundings. 
                          Customer acknowledges that they are not allowed to move around any roll-offs with their personal equipment or a third party's equipment.
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900">Payment Terms:</h4>
                        <p className="text-gray-700 leading-relaxed">
                          Prepayment at the time of reservation is required by debit card or credit card, San Diego Dumping Solutions 
                          will keep that card on file until the account is at a zero balance.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Agreement Statement */}
                  <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-300 mt-6">
                    <p className="font-semibold text-gray-900">
                      By signing, I am acknowledging that I have read and agree to terms listed in the entirety of the contract.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Digital Signature */}
            <Card className="border-0">
              <CardContent className="px-0 sm:px-6">
                <SignaturePad
                  onSignatureComplete={handleSignatureComplete}
                  onClear={handleSignatureClear}
                  disabled={isLoading}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {currentStep === 7 && (
          <div className="space-y-4 sm:space-y-6">
            {/* Order Summary */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center pb-4 sm:pb-6 px-2 sm:px-6">
                <CardTitle className="text-xl sm:text-2xl lg:text-3xl">Payment Information</CardTitle>
                <CardDescription className="text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">Complete your booking with secure payment</CardDescription>
              </CardHeader>
              <CardContent className="px-2 sm:px-6">
                <div className="space-y-4 sm:space-y-6">
                  {/* Order Summary */}
                  <Card className="border border-gray-200">
                    <CardHeader className="px-2 sm:px-6">
                      <CardTitle>Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="px-2 sm:px-6">
                      <div className="space-y-2 sm:space-y-3">
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
                    <CardHeader className="px-2 sm:px-6">
                      <CardTitle>Payment Method</CardTitle>
                      <CardDescription>Choose your payment method and enter details</CardDescription>
                    </CardHeader>
                    <CardContent className="px-2 sm:px-6">
                {guestMode && (
                  <div className="mb-6 bg-white border-2 border-gray-200 rounded-xl p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Your Contact</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input
                          placeholder="John Doe"
                          className="mt-1 w-full rounded-md border-2 border-gray-300 bg-white focus:border-blue-500 focus:ring-blue-500 h-11 px-3"
                          value={guestFullName}
                          onChange={(e) => setGuestFullName(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                          type="email"
                          placeholder="you@example.com"
                          className="mt-1 w-full rounded-md border-2 border-gray-300 bg-white focus:border-blue-500 focus:ring-blue-500 h-11 px-3"
                          value={guestEmail}
                          onChange={(e) => setGuestEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <input
                          placeholder="(555) 123-4567"
                          className="mt-1 w-full rounded-md border-2 border-gray-300 bg-white focus:border-blue-500 focus:ring-blue-500 h-11 px-3"
                          value={guestPhone}
                          onChange={(e) => setGuestPhone(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}
                      <div className="space-y-4 sm:space-y-6">
                        {/* Payment Method Toggle */}
                        <div className="space-y-2 sm:space-y-3">
                          <Label>Payment Method</Label>
                          <div className="flex bg-gray-100 rounded-lg p-1">
                            <button
                              type="button"
                              onClick={() => setPaymentMethod("stripe")}
                              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md transition-all ${
                                paymentMethod === "stripe"
                                  ? "bg-white shadow-sm text-gray-900"
                                  : "text-gray-600 hover:text-gray-900"
                              }`}
                            >
                              <CreditCard className="h-4 w-4" />
                              <span>Credit/Debit Card</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setPaymentMethod("paypal")}
                              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md transition-all ${
                                paymentMethod === "paypal"
                                  ? "bg-white shadow-sm text-gray-900"
                                  : "text-gray-600 hover:text-gray-900"
                              }`}
                            >
                              <Smartphone className="h-4 w-4" />
                              <span>PayPal</span>
                            </button>
                          </div>
                        </div>

                        {/* Stripe Payment */}
                        {paymentMethod === "stripe" && (
                          <StripeElements
                            amount={totalAmount}
                            bookingId="temp"
                            bookingData={{
                              container_type_id: selectedContainer,
                              start_date: startDate?.toISOString(),
                              end_date: endDate?.toISOString(),
                              service_type: serviceType,
                              customer_address: useProfileAddress ? `${profile?.street_address || ''}, ${profile?.city || ''}, ${profile?.state || ''} ${profile?.zip_code || ''}` : `${streetAddress}, ${city}, ${state} ${zipCode}`,
                              delivery_address: serviceType === 'delivery' ? `${deliveryStreetAddress}, ${deliveryCity}, ${deliveryState} ${deliveryZipCode}` : null,
                              total_amount: totalAmount,
                              pickup_time: pickupTime,
                              notes: notes,
                              phone: guestMode ? guestPhone : profile?.phone,
                              guest_full_name: guestMode ? guestFullName : undefined,
                              guest_email: guestMode ? guestEmail : undefined,
                              signature_img_url: signatureImgUrl,
                            }}
                            allowGuest={guestMode}
                            onSuccess={async (bookingData) => {
                              // Send booking confirmation emails
                              try {
                                console.log('📧 Attempting to send booking confirmation emails (Stripe)...')
                                const emailResponse = await fetch('/api/send-booking-email', {
                                  method: 'POST',
                                  headers: {
                                    'Content-Type': 'application/json',
                                  },
                                  body: JSON.stringify({
                                    bookingId: bookingData.id,
                                    customerName: guestMode ? (guestFullName || 'Guest') : (profile?.full_name || user.email?.split('@')[0] || 'Customer'),
                                    customerEmail: guestMode ? guestEmail : user.email,
                                    containerType: bookingData.container_types?.size || containerTypes.find(c => c.id === selectedContainer)?.size || 'Container',
                                    startDate: format(startDate!, "MMMM dd, yyyy"),
                                    endDate: format(endDate!, "MMMM dd, yyyy"),
                                    serviceType: serviceType,
                                    totalAmount: totalAmount,
                                    deliveryAddress: serviceType === 'delivery' ? `${deliveryStreetAddress}, ${deliveryCity}, ${deliveryState} ${deliveryZipCode}` : null,
                                    pickupTime: pickupTime,
                                    notes: notes.trim() || undefined,
                                  }),
                                })
                                
                                if (!emailResponse.ok) {
                                  const errorData = await emailResponse.json()
                                  console.warn('⚠️ Email notification failed:', errorData)
                                  console.log('Note: Booking was successful, but email notification could not be sent.')
                                  if (!errorData.emailConfigured) {
                                    console.log('Email is not configured. Set SMTP environment variables to enable email notifications.')
                                  }
                                  // Continue to show success page despite email failure
                                } else {
                                  const emailResult = await emailResponse.json()
                                  if (emailResult.skipped) {
                                    console.log('ℹ️ Email notification skipped:', emailResult.message)
                                  } else {
                                    console.log('✅ Booking confirmation emails sent successfully:', emailResult)
                                  }
                                }
                              } catch (emailError) {
                                console.warn('⚠️ Email notification failed (non-critical):', emailError)
                                console.log('Note: Your booking was successful, but we could not send the confirmation email.')
                                // Don't throw error - email failure shouldn't stop the booking process
                              }

                              // Show success page (always execute, regardless of email status)
                              setIsSuccess(true)
                              setCurrentStep(8)
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

                        {/* PayPal Section */}
                        {paymentMethod === "paypal" && (
                          <div className="space-y-3 sm:space-y-4">
                            <PayPalScriptProvider 
                              options={{ 
                                clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test",
                                currency: "USD",
                                intent: "capture"
                              }}
                            >
                              <PayPalButtons
                                createOrder={(data, actions) => {
                                  return actions.order.create({
                                    intent: "CAPTURE",
                                    purchase_units: [
                                      {
                                        amount: {
                                          value: totalAmount.toString(),
                                          currency_code: "USD"
                                        },
                                        description: `Dumpster rental - ${containerTypes.find(c => c.id === selectedContainer)?.name || 'Container'} (${differenceInDays(endDate!, startDate!) + 1} days)`
                                      }
                                    ]
                                  })
                                }}
                                onApprove={(data, actions) => {
                                  return actions.order!.capture().then((details) => {
                                    setIsSuccess(true)
                                    setError(null)
                                    handlePaymentSuccess('paypal', details.id || 'paypal_transaction')
                                  })
                                }}
                                onError={(err) => {
                                  console.error('PayPal error:', err)
                                  setError('Payment failed. Please try again.')
                                }}
                                onCancel={() => {
                                  setError('Payment was cancelled.')
                                }}
                                style={{
                                  layout: 'vertical',
                                  color: 'blue',
                                  shape: 'rect',
                                  label: 'paypal'
                                }}
                              />
                            </PayPalScriptProvider>
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

        {currentStep === 8 && isSuccess && successData && (
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
                  {/* Email Confirmation Notice */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <svg className="h-5 w-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <p className="font-medium text-blue-900">Confirmation emails sent!</p>
                        <p className="text-sm text-blue-700 mt-1">
                          A confirmation email has been sent to <strong>{user.email}</strong> with your booking details. 
                          Our team has also been notified and will contact you 24 hours before your scheduled service.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Booking Confirmation */}
                  <Card className="border border-gray-200">
                    <CardHeader>
                      <CardTitle>Booking Confirmation</CardTitle>
                      <CardDescription>Booking #{successData.booking.id.slice(0, 8)}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 sm:space-y-4">
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

                  {/* Payment Information */}
                  <Card className="border border-blue-100 bg-blue-50">
                    <CardHeader>
                      <CardTitle className="text-blue-900">Payment Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-blue-800">Booking Amount:</span>
                          <span className="font-semibold text-blue-900">{formatCurrency(successData.payment.amount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-800">Payment Method:</span>
                          <span className="text-blue-900">Card Saved (Stripe)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-800">Status:</span>
                          <span className="font-medium text-yellow-700">Awaiting Final Charge</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-800">Booking Date:</span>
                          <span className="text-blue-900">{format(new Date(successData.payment.created_at), "PPP")}</span>
                        </div>
                        <div className="mt-4 p-3 bg-blue-100 rounded-lg border border-blue-200">
                          <p className="text-xs text-blue-800">
                            <strong>Note:</strong> Your card has been securely saved but not charged yet. The final amount will be charged once the total is confirmed by our team.
                          </p>
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
                        <p>• Your booking request has been received and your card is securely saved</p>
                        <p>• Our team will review and charge the final amount once confirmed</p>
                        <p>• You'll receive a confirmation email with all the details</p>
                        <p>• Our team will contact you to confirm your booking details</p>
                        {successData.booking.service_type === "delivery" ? (
                          <p>• We'll deliver the container to your specified address on the scheduled date</p>
                        ) : (
                          <p>• You can pick up your container at our location on the scheduled date</p>
                        )}
                        <p>• You can track your booking status in your account</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {error && <div className="text-red-600 text-sm">{error}</div>}

        <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 px-2 sm:px-0">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center justify-center bg-transparent order-2 sm:order-1 h-10 sm:h-12 lg:h-14 text-sm sm:text-base lg:text-lg px-2 sm:px-6 lg:px-8"
          >
            <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
            Previous
          </Button>

          {currentStep < totalSteps ? (
            <Button 
              type="button" 
              onClick={nextStep} 
              disabled={!canProceedToNextStep()} 
              className="flex items-center justify-center order-1 sm:order-2 h-10 sm:h-12 lg:h-14 text-sm sm:text-base lg:text-lg px-2 sm:px-6 lg:px-8"
            >
              Next
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
            </Button>
          ) : currentStep === 6 ? (
            <Button 
              type="button" 
              onClick={nextStep} 
              disabled={!canProceedToNextStep()} 
              className="flex items-center justify-center order-1 sm:order-2 h-10 sm:h-12 lg:h-14 text-sm sm:text-base lg:text-lg px-2 sm:px-6 lg:px-8"
            >
              <span className="hidden sm:inline">Continue to Payment</span>
              <span className="sm:hidden">Payment</span>
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
            </Button>
          ) : currentStep === 7 ? (
            // No submit button needed for Stripe as it handles its own submission
            null
          ) : (
            !guestMode && (
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:gap-4 order-1 sm:order-2 w-full sm:w-auto">
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
                    setPaymentMethod("stripe")
                    setSignatureImgUrl("")
                  }}
                  className="flex items-center justify-center h-10 sm:h-12 lg:h-14 text-sm sm:text-base lg:text-lg px-2 sm:px-6 lg:px-8"
                >
                  <span className="hidden sm:inline">Book Another Container</span>
                  <span className="sm:hidden">Book Another</span>
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    // refresh to show updated bookings list for logged-in users
                    window.location.reload()
                  }}
                  className="flex items-center justify-center h-10 sm:h-12 lg:h-14 text-sm sm:text-base lg:text-lg px-2 sm:px-6 lg:px-8"
                >
                  <span className="hidden sm:inline">View My Bookings</span>
                  <span className="sm:hidden">My Bookings</span>
                </Button>
              </div>
            )
          )}
        </div>
      </form>
    </div>
  )
}
