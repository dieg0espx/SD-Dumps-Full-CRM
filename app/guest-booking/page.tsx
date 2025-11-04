import GuestBookingClient from "@/components/guest-booking-client"

export default async function GuestBookingPage() {
  return (
    <div className="min-h-[calc(100vh-70px)] bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        <div className="mb-6 sm:mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Book as Guest</h1>
          <p className="text-gray-600 mt-2">No account required. Share your details and we’ll follow up to confirm.</p>
        </div>
        <GuestBookingClient />
        <p className="text-xs text-gray-500 mt-4 text-center">By submitting, you agree to be contacted about your booking request.</p>
      </div>
    </div>
  )
}


