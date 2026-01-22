import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-16">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto/v1769107610/IMG_6035_gbo7ql.heic')"
        }}
      />
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8 sm:py-12">
        <div className="text-center">
          <div className="flex justify-center mb-4 sm:mb-8 animate-fade-in-down">
            <Image
              src="https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto/sddumps/logo"
              alt="SD Dumping Solutions"
              width={200}
              height={80}
              className="w-32 sm:w-48 lg:w-56 h-auto"
            />
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-6 animate-fade-in-up delay-200">
            #1 Dumpster Rental<br />
            <span className="text-main">San Diego, CA</span>
          </h1>
          <p className="text-sm sm:text-lg lg:text-xl text-gray-200 mb-6 sm:mb-8 max-w-3xl mx-auto animate-fade-in-up delay-400">
            Affordable dumpster rental in San Diego with same day delivery. From small dumpster rentals for residential cleanouts to roll off dumpster rentals for construction projects — we've got you covered.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center animate-fade-in-up delay-600">
            <Link href="/booking" className="w-full sm:w-auto max-w-xs">
              <button className="bg-main text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:bg-main/90 hover:scale-105 transition-all duration-300 flex items-center justify-center text-base sm:text-lg font-semibold w-full">
                Get Free Quote
                <ChevronRight className="w-5 h-5 ml-2" />
              </button>
            </Link>
            <a href="tel:+17602700312" className="w-full sm:w-auto max-w-xs">
              <button className="bg-white text-gray-900 px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:bg-gray-100 hover:scale-105 transition-all duration-300 text-base sm:text-lg font-semibold w-full">
                Call (760) 270-0312
              </button>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
