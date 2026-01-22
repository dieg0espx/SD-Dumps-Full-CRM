"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Phone, Menu, X, User } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    // Check if user is logged in
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setIsLoggedIn(!!user)
    }

    checkUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session?.user)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const handleCallUs = () => {
    // You can replace this phone number with your actual business phone
    window.location.href = 'tel:+17602700312'
  }

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-sm border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <Image
              src="https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto/sddumps/logo"
              alt="SD Dumping Solutions Logo"
              width={40}
              height={40}
              className="w-8 h-8 sm:w-10 sm:h-10"
            />
            <span className="ml-2 sm:ml-3 text-sm sm:text-xl font-bold text-gray-900 hidden sm:inline">SD Dumping Solutions</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-main transition-colors">Home</Link>
            <Link href="/about" className="text-gray-700 hover:text-main transition-colors">About</Link>
            <Link href="/services" className="text-gray-700 hover:text-main transition-colors">Services</Link>
            <Link href="/service-areas" className="text-gray-700 hover:text-main transition-colors">Service Areas</Link>
            <Link href="/contact" className="text-gray-700 hover:text-main transition-colors">Contact</Link>
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <Link href="/booking">
                <button className="flex items-center space-x-2 bg-main text-white px-6 py-2 rounded-lg hover:bg-main/90 transition-colors">
                  <User className="w-4 h-4" />
                  <span>My Account</span>
                </button>
              </Link>
            ) : (
              <Link href="/auth/login">
                <button className="bg-main text-white px-6 py-2 rounded-lg hover:bg-main/90 transition-colors">
                  Login
                </button>
              </Link>
            )}
            <button 
              onClick={handleCallUs}
              className="flex items-center space-x-2 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>Call Us</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md text-gray-700 hover:text-main hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 pt-4 pb-4 space-y-2">
              <Link
                href="/"
                onClick={closeMobileMenu}
                className="block text-center px-3 py-3 text-gray-700 hover:text-main hover:bg-gray-50 rounded-md transition-colors font-medium"
              >
                Home
              </Link>
              <Link
                href="/about"
                onClick={closeMobileMenu}
                className="block text-center px-3 py-3 text-gray-700 hover:text-main hover:bg-gray-50 rounded-md transition-colors font-medium"
              >
                About
              </Link>
              <Link
                href="/services"
                onClick={closeMobileMenu}
                className="block text-center px-3 py-3 text-gray-700 hover:text-main hover:bg-gray-50 rounded-md transition-colors font-medium"
              >
                Services
              </Link>
              <Link
                href="/service-areas"
                onClick={closeMobileMenu}
                className="block text-center px-3 py-3 text-gray-700 hover:text-main hover:bg-gray-50 rounded-md transition-colors font-medium"
              >
                Service Areas
              </Link>
              <Link
                href="/contact"
                onClick={closeMobileMenu}
                className="block text-center px-3 py-3 text-gray-700 hover:text-main hover:bg-gray-50 rounded-md transition-colors font-medium"
              >
                Contact
              </Link>
            </div>
            <div className="px-4 py-4 border-t border-gray-200 space-y-3">
              {isLoggedIn ? (
                <Link href="/booking" onClick={closeMobileMenu}>
                  <button className="w-full flex items-center justify-center space-x-2 bg-main text-white px-4 py-3 rounded-lg hover:bg-main/90 transition-colors font-medium">
                    <User className="w-4 h-4" />
                    <span>My Account</span>
                  </button>
                </Link>
              ) : (
                <Link href="/auth/login" onClick={closeMobileMenu}>
                  <button className="w-full bg-main text-white px-4 py-3 rounded-lg hover:bg-main/90 transition-colors font-medium">
                    Login
                  </button>
                </Link>
              )}
              <button 
                onClick={handleCallUs}
                className="w-full flex items-center justify-center space-x-2 border border-gray-300 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                <Phone className="w-4 h-4" />
                <span>Call Us</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
