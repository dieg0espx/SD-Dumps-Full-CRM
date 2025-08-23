"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { useRouter, usePathname } from "next/navigation"
import type { User } from "@supabase/supabase-js"
import { LogOut, UserIcon, Calendar, Package, Users, CreditCard, Plus, BarChart3, MessageCircle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface AdminLayoutProps {
  user: User | null
  children: React.ReactNode
}

const navigation = [
  { name: "Overview", href: "/admin", icon: BarChart3 },
  { name: "Calendar", href: "/admin/calendar", icon: Calendar },
  { name: "Inventory", href: "/admin/inventory", icon: Package },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Chat", href: "/admin/chat", icon: MessageCircle },
  { name: "Payments", href: "/admin/payments", icon: CreditCard },
]

export function AdminLayout({ user, children }: AdminLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  if (!user) {
    return null
  }

  return (
    <div className="h-screen bg-gray-50 flex">
      <div className="w-64 bg-white shadow-sm border-r flex flex-col">
        {/* Sidebar Header */}
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-gray-900">SD Dumps Admin</h1>
          <p className="text-sm text-gray-600">Container Rental Management</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn("w-full justify-start gap-3", isActive && "bg-blue-50 text-blue-700 hover:bg-blue-100")}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Button>
              </Link>
            )
          })}

          <div className="pt-4 border-t">
            <Link href="/admin/bookings/new">
              <Button className="w-full justify-start gap-3">
                <Plus className="h-4 w-4" />
                New Booking
              </Button>
            </Link>
          </div>
        </nav>

        {/* User Menu */}
        <div className="p-4 border-t">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start gap-3">
                <UserIcon className="h-4 w-4" />
                <span className="truncate">{user.email}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
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

      <div className="flex-1 flex flex-col relative overflow-y-auto">
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  )
}
