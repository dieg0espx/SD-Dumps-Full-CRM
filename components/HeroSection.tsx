import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
            #1 Dumpster Rental<br />
            <span className="text-main">San Diego, CA</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
            Affordable dumpster rental in San Diego with same day delivery. From small dumpster rentals for residential cleanouts to roll off dumpster rentals for construction projects — we've got you covered. Cheap rates, no hidden fees.
          </p>
                     <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8 sm:mb-12 px-4">
            <Link href="/booking" className="w-full sm:w-auto">
              <button className="bg-black text-white px-6 sm:px-8 py-3 rounded-lg hover:bg-black/80 transition-colors flex items-center justify-center text-sm sm:text-base w-full sm:w-auto">
                Get Free Quote
                <ChevronRight className="w-4 h-4 ml-2" />
              </button>
            </Link>
             <Link href="/contact" className="w-full sm:w-auto">
               <button className="border border-gray-300 text-gray-700 px-6 sm:px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base w-full sm:w-auto">
                 Call (760) 270-0312
               </button>
             </Link>
           </div>
          <div className="flex justify-center px-4">
            <Image
              src="https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto/sddumps/dumpster.png"
              alt="Affordable dumpster rental San Diego - Roll off container for residential and construction projects"
              width={900}
              height={400}
              className="rounded-lg w-full max-w-4xl"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
