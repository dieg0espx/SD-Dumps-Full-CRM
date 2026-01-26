import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, Star, Shield, Clock } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#fafafa] -mt-[88px] pt-[88px]">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{
          backgroundImage: "url('https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto/v1769107610/IMG_6035_gbo7ql.heic')"
        }}
      />
      {/* Dark Overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />

      {/* Animated floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-main/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-1/3 right-10 w-72 h-72 bg-main/15 rounded-full blur-3xl animate-blob delay-200" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-1/4 left-1/4 w-56 h-56 bg-purple-500/10 rounded-full blur-3xl animate-blob" style={{ animationDelay: '4s' }} />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8 sm:py-12">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6 animate-fade-in-down">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-white/90 text-sm font-medium">Rated #1 in San Diego</span>
          </div>

          <div className="flex justify-center mb-6 sm:mb-8 animate-fade-in-down delay-100">
            <Image
              src="https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto/sddumps/logo"
              alt="SD Dumping Solutions"
              width={200}
              height={80}
              className="w-32 sm:w-48 lg:w-56 h-auto drop-shadow-2xl"
            />
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 animate-slide-up delay-200 tracking-tight">
            #1 Dumpster Rental<br />
            <span className="text-gradient bg-gradient-to-r from-main to-purple-400 bg-clip-text text-transparent">San Diego, CA</span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-8 sm:mb-10 max-w-3xl mx-auto animate-slide-up delay-300 leading-relaxed">
            Affordable dumpster rental in San Diego with same day delivery. From small dumpster rentals for residential cleanouts to roll off dumpster rentals for construction projects — we've got you covered.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center items-center animate-slide-up delay-400 mb-12">
            <Link href="/booking" className="w-full sm:w-auto max-w-xs group">
              <button className="relative bg-main text-white px-8 sm:px-10 py-4 sm:py-5 rounded-2xl shadow-glow-lg hover:shadow-glow transition-all duration-300 flex items-center justify-center text-base sm:text-lg font-semibold w-full hover:-translate-y-1 overflow-hidden">
                <span className="relative z-10 flex items-center">
                  Get Free Quote
                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-main to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </Link>
            <a href="tel:+17602700312" className="w-full sm:w-auto max-w-xs">
              <button className="bg-white/10 backdrop-blur-sm border border-white/30 text-white px-8 sm:px-10 py-4 sm:py-5 rounded-2xl hover:bg-white/20 transition-all duration-300 text-base sm:text-lg font-semibold w-full hover:-translate-y-1">
                Call (760) 270-0312
              </button>
            </a>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center gap-6 sm:gap-10 animate-fade-in-up delay-500">
            <div className="flex items-center gap-2 text-white/80">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-main" />
              </div>
              <span className="text-sm font-medium">Same Day Delivery</span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-main" />
              </div>
              <span className="text-sm font-medium">Fully Insured</span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <Star className="w-5 h-5 text-main" />
              </div>
              <span className="text-sm font-medium">5-Star Rated</span>
            </div>
          </div>
        </div>
      </div>

    </section>
  )
}
