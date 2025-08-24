"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Image from "next/image"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error

      const { data: profile } = await supabase.from("profiles").select("role").single()

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
      <div className="flex min-h-screen items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <div className="flex flex-col gap-8">
            {/* Header */}
            <div className="text-center">
              {/* <div className="flex items-center justify-center mb-4">
                <Image
                  src="/logo.png"
                  alt="SD Dumps Logo"
                  width={48}
                  height={48}
                  className="mr-3"
                />
                <span className="text-2xl font-bold text-gray-900">SD Dumps</span>
              </div> */}
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
              <p className="text-lg text-gray-600">Sign in to your account to continue</p>
            </div>

            {/* Login Form */}
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="pb-6">
                <CardTitle className="text-xl font-semibold text-gray-900">Sign In</CardTitle>
                <CardDescription className="text-gray-600">
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin}>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                        Password
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                      />
                    </div>
                    {error && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-600">{error}</p>
                      </div>
                    )}
                    <Button 
                      type="submit" 
                      className="w-full bg-main text-white py-3 px-6 rounded-lg hover:bg-main/90 transition-colors font-medium" 
                      disabled={isLoading}
                    >
                      {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                  </div>
                </form>
                
                <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{" "}
                    <Link 
                      href="/auth/sign-up" 
                      className="text-main hover:text-main/80 font-medium transition-colors"
                    >
                      Create account
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
