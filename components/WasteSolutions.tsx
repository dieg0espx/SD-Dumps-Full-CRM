import React from 'react'
import Image from 'next/image'
import { Check } from 'lucide-react'

export default function WasteSolutions() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="order-2 lg:order-1 flex justify-center">
            <Image
              src="https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto/sddumps/dumpster"
              alt="Waste management solutions"
              width={500}
              height={400}
              className="rounded-lg w-full max-w-md lg:max-w-none"
            />
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
              Professional{' '}
              <span className="text-main">Waste Solutions</span>
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
              We provide comprehensive waste management services for construction, renovation, and cleanup projects with reliable delivery and competitive pricing.
            </p>
            <div className="space-y-4 mb-6 sm:mb-8">
              <div className="flex items-start space-x-3">
                <Check className="w-4 h-4 sm:w-5 sm:h-5 text-main mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Professional Waste Management</h3>
                  <p className="text-gray-600 text-sm sm:text-base">Expert handling of all types of renovation and construction debris with proper disposal methods.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Check className="w-4 h-4 sm:w-5 sm:h-5 text-main mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Flexible Rental Periods</h3>
                  <p className="text-gray-600 text-sm sm:text-base">Choose from daily, weekly, or monthly rental options to fit your project timeline.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Check className="w-4 h-4 sm:w-5 sm:h-5 text-main mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Competitive Pricing</h3>
                  <p className="text-gray-600 text-sm sm:text-base">Transparent pricing with no hidden fees and volume discounts for larger projects.</p>
                </div>
              </div>
            </div>
            <button className="bg-main text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-main/90 transition-colors text-sm sm:text-base">
              Get Free Quote
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
