"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"
import { LogOut, UserIcon, Calendar, Package, Users, CreditCard, Plus } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

interface AdminHeaderProps {
  user: User | null
}

export function AdminHeader({ user }: AdminHeaderProps) {
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
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-900">SD Dumps Admin</h1>
            <p className="text-sm text-gray-600">Container Rental Management</p>
          </div>

          <nav className="hidden md:flex items-center space-x-4">
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link href="/admin/calendar">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Calendar
              </Button>
            </Link>
            <Link href="/admin/inventory">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Inventory
              </Button>
            </Link>
            <Link href="/admin/users">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Users
              </Button>
            </Link>
            <Link href="/admin/payments">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Payments
              </Button>
            </Link>
            <Link href="/admin/bookings/new">
              <Button size="sm" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Booking
              </Button>
            </Link>
          </nav>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <UserIcon className="h-4 w-4" />
                {user.email}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.push("/booking")}>User View</DropdownMenuItem>
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
