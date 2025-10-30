"use client"

import { useState } from "react"
import { BookingForm } from "@/components/booking-form"

export default function GuestBookingClient({ containerTypes }: { containerTypes?: any[] }) {
  return (
    <BookingForm user={{ id: "guest" }} guestMode initialContainerTypes={containerTypes} />
  )
}


