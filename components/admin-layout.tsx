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
import Image from "next/image"
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
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="SD Dumps Logo"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <div>
              <h1 className="text-xl font-bold text-gray-900">SD Dumps</h1>
              <p className="text-sm text-gray-600 mt-1">Container Rental</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.name} href={item.href} className="block">
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3 h-11 px-3 rounded-lg transition-all duration-200",
                    "hover:bg-gray-100 hover:text-gray-900",
                    isActive 
                      ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm" 
                      : "text-gray-700"
                  )}
                >
                  <item.icon className={cn(
                    "h-4 w-4 transition-colors duration-200",
                    isActive ? "text-blue-600" : "text-gray-500"
                  )} />
                  <span className="font-medium">{item.name}</span>
                </Button>
              </Link>
            )
          })}
        </nav>

        {/* User Menu */}
        <div className="p-4 border-t border-gray-200">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-3 h-11 px-3 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-all duration-200"
              >
                <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center">
                  <UserIcon className="h-3 w-3 text-gray-600" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium text-gray-900 truncate max-w-32">
                    {user.email?.split('@')[0] || 'Admin'}
                  </span>
                  <span className="text-xs text-gray-500 truncate max-w-32">
                    {user.email}
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuItem 
                onClick={() => router.push("/booking")}
                className="cursor-pointer hover:bg-gray-50"
              >
                User View
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleSignOut} 
                className="text-red-600 cursor-pointer hover:bg-red-50"
              >
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
