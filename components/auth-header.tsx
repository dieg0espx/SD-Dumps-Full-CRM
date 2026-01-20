"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"
import { LogOut, UserIcon, MessageCircle, CreditCard } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface AuthHeaderProps {
  user: User | null
}

export function AuthHeader({ user }: AuthHeaderProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  if (!user) {
    return null
  }

  return (
    <div className="border-b bg-white">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-900">SD Dumping Solutions</h1>
          <p className="text-sm text-gray-600">Container Rental Service</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => router.push("/payments")}
            className="flex items-center gap-2"
          >
            <CreditCard className="h-4 w-4" />
            Payments
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => router.push("/booking")}
            className="flex items-center gap-2"
          >
            <MessageCircle className="h-4 w-4" />
            Dashboard
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <UserIcon className="h-4 w-4" />
                {user.email}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.push("/booking")}>
                <MessageCircle className="h-4 w-4 mr-2" />
                Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/payments")}>
                <CreditCard className="h-4 w-4 mr-2" />
                Payments
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/profile")}>
                <UserIcon className="h-4 w-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
