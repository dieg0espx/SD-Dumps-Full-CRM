import React from 'react'
import Image from 'next/image'
import { Clock } from 'lucide-react'

export default function WhyChooseUs() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="order-1 animate-fade-in-left">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
              Why San Diego Chooses Our{' '}
              <span className="text-main">Dumpster Rental Service</span>
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
              Looking for affordable dumpster rental in San Diego? We offer the best cost of dumpster rental in the area — transparent pricing, same day dumpster rental San Diego delivery, and waste management San Diego trusts. Whether you need a small dumpster rental near me or a large roll off dumpster rental San Diego, we've got you covered.
            </p>
            <button className="bg-main text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-main/90 hover:scale-105 transition-all duration-300 mb-6 sm:mb-8 text-sm sm:text-base">
              View Pricing
            </button>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 animate-fade-in-up delay-200">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-main mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Same Day Dumpster Rental San Diego</h3>
                  <p className="text-gray-600 text-sm sm:text-base">Need a dumpster today? We offer same day delivery throughout San Diego County for urgent construction and junk removal projects.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 animate-fade-in-up delay-400">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-main rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-white rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Cheap Dumpster Rental San Diego</h3>
                  <p className="text-gray-600 text-sm sm:text-base">Affordable pricing with no hidden fees. Residential dumpster rental San Diego and commercial dumpster rental at competitive rates.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="order-2 flex justify-center animate-fade-in-right delay-300">
            <Image
              src="https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto/v1769107608/IMG_0265_dkokq7.heic"
              alt="Roll off dumpster rental San Diego - Affordable waste management services"
              width={500}
              height={400}
              className="rounded-lg w-full max-w-md lg:max-w-none object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
