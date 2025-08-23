import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If user is logged in, redirect to booking page
  if (user) {
    redirect("/booking")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">SD Dumps - Container Rental Service</h1>
          <p className="text-xl text-gray-600 mb-8">Reliable dumpster rentals for all your project needs</p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth/login">
              <Button size="lg">Login</Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button variant="outline" size="lg">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle>Easy Booking</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Book your container online in minutes. Choose your size, dates, and delivery options.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Flexible Options</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Pickup or delivery service available. Multiple container sizes to fit your project.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reliable Service</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Professional service with on-time delivery and pickup. Track your booking status online.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
