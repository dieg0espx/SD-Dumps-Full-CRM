"use client"

import { useState } from "react"
import { BookingForm } from "@/components/booking-form"

export default function GuestBookingClient({ containerTypes }: { containerTypes?: any[] }) {
  // Pass a minimal user object for guest mode; BookingForm uses NEXT_PUBLIC_GUEST_USER_ID
  return (
    <BookingForm user={{ id: "guest" } as any} guestMode initialContainerTypes={containerTypes} />
  )
}


