import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AuthHeader } from "@/components/auth-header"
import { ClientPaymentHistory } from "@/components/client-payment-history"

export default async function PaymentsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch user's payments with booking and container type information
  const { data: payments, error: paymentsError } = await supabase
    .from("payments")
    .select(`
      *,
      bookings (
        *,
        container_types (
          name,
          size
        )
      )
    `)
    .order("created_at", { ascending: false })

  if (paymentsError) {
    console.error("Error fetching payments:", paymentsError)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthHeader user={user} />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment History</h1>
            <p className="text-gray-600">View all your payment transactions</p>
          </div>
          <ClientPaymentHistory payments={payments || []} />
        </div>
      </div>
    </div>
  )
}
