"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus } from "lucide-react"
import { format } from "date-fns"
import { useRouter } from "next/navigation"

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

  const supabase = createClient()
  const router = useRouter()

  const selectedContainer = containerTypes.find((c) => c.id === containerType)
  const selectedUserData = users.find((u) => u.id === selectedUser)

  const calculateTotal = () => {
    if (!selectedContainer || !startDate || !endDate) return 0
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    return selectedContainer.price_per_day * Math.max(1, days)
  }

  const handleSubmit = async (e: React.FormEvent) => {
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
          status: "confirmed",
          notes: notes || null,
        })
        .select()
        .single()

      if (bookingError) throw bookingError

      // Create payment record
      await supabase.from("payments").insert({
        booking_id: booking.id,
        amount: totalAmount,
        status: "completed",
        payment_method: "admin_created",
        transaction_id: `admin_${Date.now()}`,
      })

      router.push("/admin")
    } catch (error) {
      console.error("Error creating booking:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
                    <strong>Phone:</strong> {selectedUserData.phone}
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

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          {loading ? "Creating..." : "Create Booking"}
        </Button>
      </div>
    </form>
  )
}
