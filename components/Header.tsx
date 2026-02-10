"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Phone, Menu, X, User, ChevronRight, Sparkles, Home, Info, Wrench, MapPin, Mail, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { cities } from '@/lib/cities'

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [serviceAreasDropdownOpen, setServiceAreasDropdownOpen] = useState(false)
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

    // Scroll listener
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)

    return () => {
      subscription.unsubscribe()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const handleCallUs = () => {
    window.location.href = 'tel:+17602700312'
  }

  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/about', label: 'About', icon: Info },
    { href: '/services', label: 'Services', icon: Wrench },
    { href: '/service-areas', label: 'Service Areas', icon: MapPin },
    { href: '/contact', label: 'Contact', icon: Mail },
  ]

  return (
    <>
      {/* Top bar */}
      <div className={`fixed top-0 left-0 w-full bg-main text-white z-50 transition-all duration-300 ${isScrolled ? 'h-0 opacity-0 overflow-hidden' : 'h-8'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" />
            <span className="hidden sm:inline">Same Day Delivery Available!</span>
            <span className="sm:hidden">Same Day Delivery!</span>
          </div>
          <a href="tel:+17602700312" className="flex items-center gap-1.5 hover:underline">
            <Phone className="w-3 h-3" />
            <span>(760) 270-0312</span>
          </a>
        </div>
      </div>

      {/* Main header */}
      <header className={`fixed left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'top-0 bg-white shadow-lg'
          : 'top-8 bg-white/80 backdrop-blur-md'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`relative flex items-center justify-between transition-all duration-300 ${isScrolled ? 'h-14' : 'h-14'}`}>
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
              <div className="relative">
                <div className="absolute -inset-1 bg-main/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                <Image
                  src="https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto/sddumps/logo"
                  alt="SD Dumping Solutions Logo"
                  width={40}
                  height={40}
                  className="relative w-9 h-9 sm:w-10 sm:h-10"
                />
              </div>
              <div>
                <div className="font-bold text-gray-900 text-sm sm:text-base leading-tight">SD Dumping</div>
                <div className="text-[9px] sm:text-[10px] text-main font-semibold -mt-0.5">Solutions</div>
              </div>
            </Link>

            {/* Desktop Navigation - Centered */}
            <nav className="hidden lg:flex items-center absolute left-1/2 -translate-x-1/2">
              <div className="flex items-center bg-gray-100/80 rounded-full p-1">
                {navLinks.map((link) => {
                  const isServiceAreas = link.href === '/service-areas'
                  return (
                    <div
                      key={link.href}
                      className="relative"
                      {...(isServiceAreas && {
                        onMouseEnter: () => setServiceAreasDropdownOpen(true),
                        onMouseLeave: () => setServiceAreasDropdownOpen(false)
                      })}
                    >
                      <Link
                        href={link.href}
                        className="relative px-3.5 py-1.5 text-gray-600 hover:text-gray-900 transition-colors font-medium text-sm rounded-full hover:bg-white hover:shadow-sm flex items-center gap-1"
                      >
                        {link.label}
                        {isServiceAreas && (
                          <ChevronRight className={`w-3.5 h-3.5 transition-transform ${serviceAreasDropdownOpen ? 'rotate-90' : 'rotate-0'}`} />
                        )}
                      </Link>

                      {/* Dropdown Menu */}
                      {isServiceAreas && (
                        <div className={`absolute top-full left-0 mt-2 w-[500px] bg-white rounded-2xl shadow-2xl border border-gray-100 transition-all duration-200 ${
                          serviceAreasDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2 pointer-events-none'
                        }`}>
                          <div className="p-4">
                            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-100">
                              <MapPin className="w-4 h-4 text-main" />
                              <h3 className="font-semibold text-gray-900 text-sm">Service Areas</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-2 max-h-[400px] overflow-y-auto">
                              {cities.map((city) => (
                                <Link
                                  key={city.slug}
                                  href={`/service-areas/${city.slug}`}
                                  className="group flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-main hover:bg-main/5 rounded-lg transition-all text-sm"
                                  onClick={() => setServiceAreasDropdownOpen(false)}
                                >
                                  <div className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-main transition-colors" />
                                  <span className="font-medium">{city.name}</span>
                                </Link>
                              ))}
                            </div>
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <Link
                                href="/service-areas"
                                className="flex items-center justify-center gap-1 text-main hover:text-main/80 font-semibold text-sm transition-colors"
                                onClick={() => setServiceAreasDropdownOpen(false)}
                              >
                                <span>View All Service Areas</span>
                                <ArrowRight className="w-4 h-4" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </nav>

            {/* Desktop CTA Buttons */}
            <div className="hidden lg:flex items-center gap-2">
              <button
                onClick={handleCallUs}
                className="flex items-center gap-1.5 text-gray-600 hover:text-main transition-colors font-medium text-sm px-2 py-1.5"
              >
                <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <span className="hidden xl:inline">(760) 270-0312</span>
              </button>

              {isLoggedIn ? (
                <Link href="/booking">
                  <button className="group flex items-center gap-1.5 bg-main text-white pl-4 pr-3 py-2 rounded-full font-semibold text-sm shadow-lg shadow-main/25 hover:shadow-xl hover:shadow-main/30 hover:bg-main/90 transition-all duration-200">
                    <User className="w-3.5 h-3.5" />
                    <span>My Account</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </Link>
              ) : (
                <>
                  <Link href="/auth/login">
                    <button className="flex items-center gap-1.5 text-gray-700 hover:text-main transition-colors font-medium text-sm px-4 py-2">
                      Login
                    </button>
                  </Link>
                  <Link href="/booking">
                    <button className="group flex items-center gap-1.5 bg-main text-white pl-4 pr-3 py-2 rounded-full font-semibold text-sm shadow-lg shadow-main/25 hover:shadow-xl hover:shadow-main/30 hover:bg-main/90 transition-all duration-200">
                      <span>Get Quote</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center gap-3">
              <Link href="/booking" className="flex items-center gap-1.5 bg-main text-white px-4 py-2 rounded-full font-semibold text-xs shadow-lg shadow-main/25">
                <span>Quote</span>
              </Link>
              <button
                onClick={toggleMobileMenu}
                className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200 transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
        onClick={closeMobileMenu}
      />

      {/* Mobile Menu Slide-out */}
      <div className={`lg:hidden fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white z-50 shadow-2xl transition-transform duration-300 ease-out ${
        isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Mobile Menu Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <Image
              src="https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto/sddumps/logo"
              alt="SD Dumping Solutions"
              width={36}
              height={36}
              className="w-9 h-9"
            />
            <div>
              <div className="font-bold text-gray-900 text-sm">SD Dumping</div>
              <div className="text-[9px] text-main font-semibold">Solutions</div>
            </div>
          </div>
          <button
            onClick={closeMobileMenu}
            className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Menu Content */}
        <div className="flex flex-col h-[calc(100%-73px)] overflow-y-auto">
          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navLinks.map((link, index) => {
              const IconComponent = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className="flex items-center gap-4 px-4 py-4 text-gray-700 hover:text-main hover:bg-main/5 rounded-xl transition-all font-medium group"
                  style={{
                    animation: isMobileMenuOpen ? `slideInRight 0.3s ease-out ${index * 0.05}s both` : 'none'
                  }}
                >
                  <div className="w-10 h-10 rounded-xl bg-gray-100 group-hover:bg-main/10 flex items-center justify-center transition-colors">
                    <IconComponent className="w-5 h-5 text-gray-500 group-hover:text-main transition-colors" />
                  </div>
                  <span className="flex-1 text-base">{link.label}</span>
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-main group-hover:translate-x-1 transition-all" />
                </Link>
              )
            })}
          </nav>

          {/* Divider */}
          <div className="mx-4 border-t border-gray-100" />

          {/* CTA Section */}
          <div className="p-4 space-y-3 mt-auto">
            {/* Primary CTA */}
            <Link href="/booking" onClick={closeMobileMenu} className="block">
              <button className="w-full flex items-center justify-center gap-2 bg-main text-white px-6 py-4 rounded-xl shadow-lg shadow-main/25 font-semibold text-base hover:bg-main/90 transition-colors">
                <span>Get Free Quote</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>

            {/* Secondary Actions */}
            <div className="grid grid-cols-2 gap-3">
              {isLoggedIn ? (
                <Link href="/booking" onClick={closeMobileMenu} className="col-span-2">
                  <button className="w-full flex items-center justify-center gap-2 border-2 border-gray-200 bg-white px-4 py-3.5 rounded-xl font-semibold text-gray-700 hover:border-main hover:text-main transition-colors">
                    <User className="w-5 h-5" />
                    <span>My Account</span>
                  </button>
                </Link>
              ) : (
                <Link href="/auth/login" onClick={closeMobileMenu} className="col-span-2">
                  <button className="w-full flex items-center justify-center gap-2 border-2 border-gray-200 bg-white px-4 py-3.5 rounded-xl font-semibold text-gray-700 hover:border-main hover:text-main transition-colors">
                    <User className="w-5 h-5" />
                    <span>Login / Sign Up</span>
                  </button>
                </Link>
              )}
            </div>

            {/* Call Button */}
            <a href="tel:+17602700312" className="block">
              <button className="w-full flex items-center justify-center gap-3 bg-green-500 text-white px-6 py-4 rounded-xl font-semibold text-base hover:bg-green-600 transition-colors">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Phone className="w-4 h-4" />
                </div>
                <span>Call (760) 270-0312</span>
              </button>
            </a>

            {/* Hours info */}
            <p className="text-center text-xs text-gray-400 pt-2">
              Mon-Fri: 7AM-6PM • Sat: 8AM-4PM
            </p>
          </div>
        </div>
      </div>

      {/* Spacer for fixed header */}
      <div className={`transition-all duration-300 ${isScrolled ? 'h-14' : 'h-[88px]'}`} />

      {/* Animation keyframes */}
      <style jsx global>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  )
}
