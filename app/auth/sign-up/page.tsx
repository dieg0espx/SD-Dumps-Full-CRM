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
import Image from "next/image"
import { ChevronLeft, ChevronRight, Check, X } from "lucide-react"
import { formatPhoneNumber } from "@/lib/phone-utils"

export default function SignUpPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")

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

  // Password validation
  const isPasswordValid = password.length >= 6
  const doPasswordsMatch = password === repeatPassword && repeatPassword.length > 0
  const isPasswordComplete = isPasswordValid && doPasswordsMatch

  const getPasswordBorderClass = (field: 'password' | 'confirm') => {
    if (field === 'password') {
      if (password.length === 0) return 'border-gray-300'
      return isPasswordValid ? 'border-green-500' : 'border-red-500'
    } else {
      if (repeatPassword.length === 0) return 'border-gray-300'
      if (!isPasswordValid) return 'border-red-500'
      return doPasswordsMatch ? 'border-green-500' : 'border-red-500'
    }
  }

  const getPasswordFocusClass = (field: 'password' | 'confirm') => {
    if (field === 'password') {
      if (password.length === 0) return 'focus:ring-main focus:border-transparent'
      return isPasswordValid ? 'focus:ring-green-500 focus:border-transparent' : 'focus:ring-red-500 focus:border-transparent'
    } else {
      if (repeatPassword.length === 0) return 'focus:ring-main focus:border-transparent'
      if (!isPasswordValid) return 'focus:ring-red-500 focus:border-transparent'
      return doPasswordsMatch ? 'focus:ring-green-500 focus:border-transparent' : 'focus:ring-red-500 focus:border-transparent'
    }
  }

  const nextStep = () => {
    if (currentStep === 1) {
      // Validate step 1 fields
      if (!fullName.trim() || !email.trim() || !phone.trim()) {
        setError("Please fill in all required fields")
        return
      }
      if (!email.includes('@')) {
        setError("Please enter a valid email address")
        return
      }
      setError(null)
      setCurrentStep(2)
    }
  }

  const prevStep = () => {
    setCurrentStep(1)
    setError(null)
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (!isPasswordComplete) {
      setError("Please ensure passwords match and are at least 6 characters long")
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
    <div className="min-h-screen bg-white">
      <div className="flex min-h-screen items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-2xl">
          <div className="flex flex-col gap-8">
            {/* Header */}
            <div className="text-center">
              {/* <div className="flex items-center justify-center mb-4">
                <Image
                  src="https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto/sddumps/logo"
                  alt="SD Dumping Solutions Logo"
                  width={48}
                  height={48}
                  className="mr-3"
                />
                <span className="text-2xl font-bold text-gray-900">SD Dumping Solutions</span>
              </div> */}
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
              <p className="text-lg text-gray-600">Sign up to start booking containers for your projects</p>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-4">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  currentStep >= 1 ? 'bg-main border-main text-white' : 'border-gray-300 text-gray-500'
                }`}>
                  <span className="text-sm font-medium">1</span>
                </div>
                <div className={`w-16 h-0.5 ${
                  currentStep >= 2 ? 'bg-main' : 'bg-gray-300'
                }`}></div>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  currentStep >= 2 ? 'bg-main border-main text-white' : 'border-gray-300 text-gray-500'
                }`}>
                  <span className="text-sm font-medium">2</span>
                </div>
              </div>
            </div>

            {/* Signup Form */}
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="pb-6">
                <CardTitle className="text-xl font-semibold text-gray-900">
                  {currentStep === 1 ? "Personal Information" : "Address & Security"}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {currentStep === 1 
                    ? "Tell us about yourself" 
                    : "Complete your account setup"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignUp} className="space-y-6">
                  {/* Step 1: Personal Information */}
                  {currentStep === 1 && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">Full Name *</Label>
                          <Input
                            id="fullName"
                            type="text"
                            placeholder="John Doe"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="john@example.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone *</Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="(555) 123-4567"
                            required
                            value={phone}
                            onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="companyName" className="text-sm font-medium text-gray-700">Company (Optional)</Label>
                          <Input
                            id="companyName"
                            type="text"
                            placeholder="Your Company LLC"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Address & Security */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      {/* Address Section */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">Address</h3>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="address" className="text-sm font-medium text-gray-700">Street Address *</Label>
                            <Input
                              id="address"
                              type="text"
                              placeholder="123 Main Street"
                              required
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="city" className="text-sm font-medium text-gray-700">City *</Label>
                              <Input
                                id="city"
                                type="text"
                                placeholder="San Diego"
                                required
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="state" className="text-sm font-medium text-gray-700">State *</Label>
                              <Select value={state} onValueChange={setState} required>
                                <SelectTrigger className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent">
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
                              <Label htmlFor="zip" className="text-sm font-medium text-gray-700">ZIP Code *</Label>
                              <Input
                                id="zip"
                                type="text"
                                placeholder="92101"
                                required
                                value={zip}
                                onChange={(e) => setZip(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="country" className="text-sm font-medium text-gray-700">Country</Label>
                              <Input
                                id="country"
                                type="text"
                                value="United States"
                                disabled
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Password Section */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">Security</h3>
                        
                        {/* Password Requirements */}
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</p>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              {password.length >= 6 ? (
                                <Check className="w-4 h-4 text-green-500" />
                              ) : (
                                <X className="w-4 h-4 text-red-500" />
                              )}
                              <span className={`text-sm ${password.length >= 6 ? 'text-green-600' : 'text-red-600'}`}>
                                At least 6 characters long
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              {doPasswordsMatch && repeatPassword.length > 0 ? (
                                <Check className="w-4 h-4 text-green-500" />
                              ) : (
                                <X className="w-4 h-4 text-red-500" />
                              )}
                              <span className={`text-sm ${doPasswordsMatch && repeatPassword.length > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                Passwords match
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password *</Label>
                            <Input
                              id="password"
                              type="password"
                              placeholder="Create a strong password"
                              required
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className={`w-full px-4 py-3 border rounded-lg ${getPasswordBorderClass('password')} ${getPasswordFocusClass('password')}`}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="repeat-password" className="text-sm font-medium text-gray-700">Confirm Password *</Label>
                            <Input
                              id="repeat-password"
                              type="password"
                              placeholder="Confirm your password"
                              required
                              value={repeatPassword}
                              onChange={(e) => setRepeatPassword(e.target.value)}
                              className={`w-full px-4 py-3 border rounded-lg ${getPasswordBorderClass('confirm')} ${getPasswordFocusClass('confirm')}`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between items-center pt-4">
                    {currentStep === 1 ? (
                      <div></div> // Empty div for spacing
                    ) : (
                      <button
                        type="button"
                        onClick={prevStep}
                        className="flex items-center space-x-2 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors bg-white text-sm"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Back</span>
                      </button>
                    )}
                    
                    {currentStep === 1 ? (
                      <Button
                        type="button"
                        onClick={nextStep}
                        className="flex items-center space-x-2 bg-main text-white py-3 px-6 rounded-lg hover:bg-main/90 transition-colors font-medium"
                      >
                        <span>Next</span>
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button 
                        type="submit" 
                        className="bg-main text-white py-3 px-6 rounded-lg hover:bg-main/90 transition-colors font-medium" 
                        disabled={isLoading || !isPasswordComplete}
                      >
                        {isLoading ? "Creating Account..." : "Create Account"}
                      </Button>
                    )}
                  </div>
                </form>
                
                <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                  <p className="text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link 
                      href="/auth/login" 
                      className="text-main hover:text-main/80 font-medium transition-colors"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Additional Info */}
            <div className="text-center">
              <p className="text-sm text-gray-500">
                Need help?{" "}
                <Link href="/contact" className="text-main hover:text-main/80 transition-colors">
                  Contact support
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
