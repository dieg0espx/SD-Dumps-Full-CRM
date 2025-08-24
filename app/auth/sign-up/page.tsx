"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const phoneNumber = value.replace(/\D/g, "")
    
    // Format based on length
    if (phoneNumber.length <= 3) {
      return phoneNumber
    } else if (phoneNumber.length <= 6) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`
    } else {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`
    }
  }
  const [companyName, setCompanyName] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")

  const usStates = [
    { value: "AL", label: "Alabama" },
    { value: "AK", label: "Alaska" },
    { value: "AZ", label: "Arizona" },
    { value: "AR", label: "Arkansas" },
    { value: "CA", label: "California" },
    { value: "CO", label: "Colorado" },
    { value: "CT", label: "Connecticut" },
    { value: "DE", label: "Delaware" },
    { value: "FL", label: "Florida" },
    { value: "GA", label: "Georgia" },
    { value: "HI", label: "Hawaii" },
    { value: "ID", label: "Idaho" },
    { value: "IL", label: "Illinois" },
    { value: "IN", label: "Indiana" },
    { value: "IA", label: "Iowa" },
    { value: "KS", label: "Kansas" },
    { value: "KY", label: "Kentucky" },
    { value: "LA", label: "Louisiana" },
    { value: "ME", label: "Maine" },
    { value: "MD", label: "Maryland" },
    { value: "MA", label: "Massachusetts" },
    { value: "MI", label: "Michigan" },
    { value: "MN", label: "Minnesota" },
    { value: "MS", label: "Mississippi" },
    { value: "MO", label: "Missouri" },
    { value: "MT", label: "Montana" },
    { value: "NE", label: "Nebraska" },
    { value: "NV", label: "Nevada" },
    { value: "NH", label: "New Hampshire" },
    { value: "NJ", label: "New Jersey" },
    { value: "NM", label: "New Mexico" },
    { value: "NY", label: "New York" },
    { value: "NC", label: "North Carolina" },
    { value: "ND", label: "North Dakota" },
    { value: "OH", label: "Ohio" },
    { value: "OK", label: "Oklahoma" },
    { value: "OR", label: "Oregon" },
    { value: "PA", label: "Pennsylvania" },
    { value: "RI", label: "Rhode Island" },
    { value: "SC", label: "South Carolina" },
    { value: "SD", label: "South Dakota" },
    { value: "TN", label: "Tennessee" },
    { value: "TX", label: "Texas" },
    { value: "UT", label: "Utah" },
    { value: "VT", label: "Vermont" },
    { value: "VA", label: "Virginia" },
    { value: "WA", label: "Washington" },
    { value: "WV", label: "West Virginia" },
    { value: "WI", label: "Wisconsin" },
    { value: "WY", label: "Wyoming" },
    { value: "DC", label: "District of Columbia" }
  ]
  const [zip, setZip] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (password !== repeatPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    // Validate required address fields
    if (!address.trim() || !city.trim() || !state || !zip.trim()) {
      setError("Please fill in all address fields")
      setIsLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: undefined, // Remove email confirmation
          data: {
            full_name: fullName,
            phone: phone,
            company: companyName,
            street_address: address,
            city: city,
            state: state,
            zip_code: zip,
            country: "United States",
          },
        },
      })

      if (error) throw error

      if (data.user && !data.user.email_confirmed_at) {
        // For development, we'll sign in immediately
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (signInError) throw signInError
      }

      // The trigger should handle profile creation automatically
      // Let's just verify the profile was created and fetch it
      const { data: profile, error: profileFetchError } = await supabase
        .from("profiles")
        .select("role, full_name, street_address, city, state, zip_code")
        .eq("id", data.user?.id)
        .single()
      
      if (profileFetchError) {
        console.error("Error fetching profile:", profileFetchError)
        // If profile wasn't created by trigger, create it manually
        const { error: manualProfileError } = await supabase
          .from("profiles")
          .upsert({
            id: data.user?.id,
            email: email,
            full_name: fullName,
            phone: phone.replace(/\D/g, ""), // Store only digits
            company: companyName || null,
            street_address: address,
            city: city,
            state: state,
            zip_code: zip,
            country: "United States",
            updated_at: new Date().toISOString(),
          })
        
        if (manualProfileError) {
          console.error("Manual profile creation error:", manualProfileError)
        }
      } else {
        console.log("Profile data after creation:", profile)
      }

      if (profile?.role === "admin") {
        router.push("/admin")
      } else {
        router.push("/booking")
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4 md:p-8 bg-gray-50">
      <div className="w-full max-w-2xl">
        <div className="flex flex-col gap-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">SD Dumps</h1>
            <p className="text-gray-600 text-lg">Container Rental Service</p>
          </div>
          <Card className="shadow-lg border-0">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl font-semibold">Create Account</CardTitle>
              <CardDescription className="text-base">
                Sign up to start booking containers for your projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignUp} className="space-y-6">
                {/* Personal Information Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-sm font-medium">Full Name</Label>
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="John Doe"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(555) 123-4567"
                        required
                        value={phone}
                        onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="companyName" className="text-sm font-medium">Company (Optional)</Label>
                      <Input
                        id="companyName"
                        type="text"
                        placeholder="Your Company LLC"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="h-11"
                      />
                    </div>
                  </div>
                </div>

                {/* Address Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Address</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-sm font-medium">Street Address</Label>
                      <Input
                        id="address"
                        type="text"
                        placeholder="123 Main Street"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="h-11"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city" className="text-sm font-medium">City</Label>
                        <Input
                          id="city"
                          type="text"
                          placeholder="San Diego"
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state" className="text-sm font-medium">State</Label>
                        <Select value={state} onValueChange={setState} required>
                          <SelectTrigger className="h-11 w-full">
                            <SelectValue placeholder="Select a state" />
                          </SelectTrigger>
                          <SelectContent>
                            {usStates.map((stateOption) => (
                              <SelectItem key={stateOption.value} value={stateOption.value}>
                                {stateOption.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="zip" className="text-sm font-medium">ZIP Code</Label>
                        <Input
                          id="zip"
                          type="text"
                          placeholder="92101"
                          required
                          value={zip}
                          onChange={(e) => setZip(e.target.value)}
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country" className="text-sm font-medium">Country</Label>
                        <Input
                          id="country"
                          type="text"
                          value="United States"
                          disabled
                          className="h-11 bg-gray-50"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Password Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Security</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Create a strong password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="repeat-password" className="text-sm font-medium">Confirm Password</Label>
                      <Input
                        id="repeat-password"
                        type="password"
                        placeholder="Confirm your password"
                        required
                        value={repeatPassword}
                        onChange={(e) => setRepeatPassword(e.target.value)}
                        className="h-11"
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full h-12 text-base font-medium" 
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>

                <div className="text-center text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-700 underline">
                    Sign in
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
