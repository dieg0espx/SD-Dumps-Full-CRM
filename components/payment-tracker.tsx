import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

interface PaymentTrackerProps {
  payments: any[]
}

export function PaymentTracker({ payments }: PaymentTrackerProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const totalRevenue = payments.filter((p) => p.status === "completed").reduce((sum, p) => sum + Number(p.amount), 0)

  const pendingAmount = payments.filter((p) => p.status === "pending").reduce((sum, p) => sum + Number(p.amount), 0)

  return (
    <div className="space-y-4 sm:space-y-6 px-1 sm:px-0">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 px-3 sm:px-6">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-6">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs sm:text-xs text-muted-foreground">From completed payments</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 px-3 sm:px-6">
            <CardTitle className="text-xs sm:text-sm font-medium">Pending Payments</CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-6">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold">{formatCurrency(pendingAmount)}</div>
            <p className="text-xs sm:text-xs text-muted-foreground">Awaiting processing</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1">
          <CardHeader className="pb-2 px-3 sm:px-6">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Transactions</CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-6">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold">{payments.length}</div>
            <p className="text-xs sm:text-xs text-muted-foreground">All payment records</p>
          </CardContent>
        </Card>
      </div>

      {/* Payments List */}
      <Card className="shadow-sm">
        <CardHeader className="px-3 sm:px-6">
          <CardTitle className="text-base sm:text-lg lg:text-xl">Recent Payments</CardTitle>
          <CardDescription className="text-xs sm:text-sm">All payment transactions and their status</CardDescription>
        </CardHeader>
        <CardContent className="px-3 sm:px-6">
          {payments.length === 0 ? (
            <p className="text-gray-500 text-center py-6 sm:py-8 text-sm sm:text-base">No payments found</p>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {payments.map((payment) => (
                <div key={payment.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border rounded-lg hover:bg-gray-50 transition-colors gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col space-y-1 sm:space-y-2">
                      <p className="font-medium text-sm sm:text-base break-words">
                        {payment.bookings?.profiles?.full_name || payment.bookings?.profiles?.email || "Unknown User"}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600 break-words">
                        {payment.bookings?.container_types?.name} - {payment.bookings?.container_types?.size}
                      </p>
                      <p className="text-xs text-gray-500 font-mono break-all">Transaction: {payment.transaction_id}</p>
                      <p className="text-xs text-gray-500">{format(new Date(payment.created_at), "PPP 'at' p")}</p>
                    </div>
                  </div>
                  <div className="flex flex-row sm:flex-col items-center justify-between sm:items-end gap-3 sm:gap-2 flex-shrink-0">
                    <div className="text-left sm:text-right">
                      <p className="font-semibold text-sm sm:text-base">{formatCurrency(payment.amount)}</p>
                      <p className="text-xs text-gray-500 capitalize">{payment.payment_method?.replace("_", " ")}</p>
                    </div>
                    <Badge className={`${getStatusColor(payment.status)} text-xs px-2 py-1`}>{payment.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
