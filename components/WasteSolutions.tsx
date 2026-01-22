import React from 'react'
import Image from 'next/image'
import { Check } from 'lucide-react'

export default function WasteSolutions() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="order-2 lg:order-1 flex justify-center animate-fade-in-left delay-300">
            <Image
              src="https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto/v1769107609/IMG_2592_ni693c.heic"
              alt="Construction dumpster rental San Diego - Commercial trash dumpsters and garbage dumpster rental"
              width={500}
              height={400}
              className="rounded-lg w-full max-w-md lg:max-w-none object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="order-1 lg:order-2 animate-fade-in-right">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
              Complete{' '}
              <span className="text-main">Waste Management San Diego</span>
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
              From construction dumpster rental San Diego to residential dumpster rental San Diego — we handle it all. Our junk removal services San Diego include garbage dumpster rental, commercial trash dumpsters, and dump trailer rental for every project size.
            </p>
            <div className="space-y-4 mb-6 sm:mb-8">
              <div className="flex items-start space-x-3 animate-fade-in-up delay-200">
                <Check className="w-4 h-4 sm:w-5 sm:h-5 text-main mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Commercial Dumpster Rental</h3>
                  <p className="text-gray-600 text-sm sm:text-base">Commercial trash dumpsters for businesses, retail, restaurants, and office cleanouts. Regular pickup schedules available.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 animate-fade-in-up delay-400">
                <Check className="w-4 h-4 sm:w-5 sm:h-5 text-main mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Construction Dumpster Rental San Diego</h3>
                  <p className="text-gray-600 text-sm sm:text-base">Heavy-duty roll off dumpster rental San Diego for construction debris, demolition waste, and renovation projects.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 animate-fade-in-up delay-600">
                <Check className="w-4 h-4 sm:w-5 sm:h-5 text-main mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Junk Removal Services San Diego</h3>
                  <p className="text-gray-600 text-sm sm:text-base">Full-service junk removal and garbage dumpster rental. We haul away furniture, appliances, yard waste, and more.</p>
                </div>
              </div>
            </div>
            <button className="bg-main text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-main/90 hover:scale-105 transition-all duration-300 text-sm sm:text-base">
              Get Free Quote
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
