'use client'

import React from 'react'
import { Check } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function PricingSection() {
  const router = useRouter()
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
            Affordable Dumpster Rental San Diego Pricing
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
            Wondering about the cost of dumpster rental? We offer cheap dumpster rental San Diego with transparent, upfront pricing. No hidden fees. Price includes 3 days (72 hours) and delivery. Same day dumpster rental San Diego available!
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* 17 Yard Dumpster */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 sm:p-8 shadow-sm">
            <div className="text-center mb-6">
              <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">$595</div>
              <div className="text-base sm:text-lg text-gray-600">17 Yard Roll Off Dumpster</div>
              <div className="text-sm text-gray-500 mt-2">Perfect for residential dumpster rental San Diego. Ideal for home cleanouts, small renovations, and yard waste.</div>
              <div className="text-xs text-gray-400 mt-1">Includes 3 days & 2 tons. Extra days: $25/day.</div>
            </div>
            <div className="space-y-3 mb-6 sm:mb-8">
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-main flex-shrink-0" />
                <span className="text-sm text-gray-600">17 cubic yard capacity</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-main flex-shrink-0" />
                <span className="text-sm text-gray-600">3 days (72 hours) included</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-main flex-shrink-0" />
                <span className="text-sm text-gray-600">2 tons included in base price</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-main flex-shrink-0" />
                <span className="text-sm text-gray-600">Residential & small projects</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-main flex-shrink-0" />
                <span className="text-sm text-gray-600">Same day delivery San Diego</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-main flex-shrink-0" />
                <span className="text-sm text-gray-600">Free delivery and pick-up</span>
              </div>
            </div>
            <button
              onClick={() => router.push('/booking')}
              className="w-full border border-gray-300 text-gray-700 py-2 sm:py-3 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
            >
              Book Now
            </button>
          </div>

          {/* 21 Yard Dumpster - Featured */}
          <div className="bg-white border-2 border-main rounded-lg p-6 sm:p-8 shadow-lg relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-main text-white px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm">Most Popular</div>
            </div>
            <div className="text-center mb-6">
              <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">$695</div>
              <div className="text-base sm:text-lg text-gray-600">21 Yard Roll Off Dumpster</div>
              <div className="text-sm text-gray-500 mt-2">Best for construction dumpster rental San Diego. Perfect for remodels, roofing, and commercial projects.</div>
              <div className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded mt-2">Includes 3 days & 2 tons. Best value!</div>
            </div>
            <div className="space-y-3 mb-8">
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-main" />
                <span className="text-sm text-gray-600">21 cubic yard capacity</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-main" />
                <span className="text-sm text-gray-600">3 days (72 hours) included</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-main" />
                <span className="text-sm text-gray-600">2 tons included in base price</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-main" />
                <span className="text-sm text-gray-600">Construction & renovation debris</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-main" />
                <span className="text-sm text-gray-600">Same day dumpster rental San Diego</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-main" />
                <span className="text-sm text-gray-600">Free delivery and pick-up</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-main" />
                <span className="text-sm text-gray-600">Priority support 24/7</span>
              </div>
            </div>
            <button
              onClick={() => router.push('/booking')}
              className="w-full bg-main text-white py-3 rounded-lg hover:bg-main/90 transition-colors"
            >
              Book Now
            </button>
          </div>

          {/* Concrete & Dirt */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 sm:p-8 shadow-sm">
            <div className="text-center mb-6">
              <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Call Us</div>
              <div className="text-base sm:text-lg text-gray-600">Concrete & Heavy Debris</div>
              <div className="text-sm text-gray-500 mt-2">Dump trailer rental and specialized containers for concrete, dirt, and heavy materials.</div>
              <div className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded mt-2">Call (760) 270-0312 for custom quote</div>
            </div>
            <div className="space-y-3 mb-8">
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-main" />
                <span className="text-sm text-gray-600">Dump trailer rental available</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-main" />
                <span className="text-sm text-gray-600">Concrete & asphalt disposal</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-main" />
                <span className="text-sm text-gray-600">Dirt, rock, and soil removal</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-main" />
                <span className="text-sm text-gray-600">Heavy construction debris</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-main" />
                <span className="text-sm text-gray-600">Custom pricing by weight</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-main" />
                <span className="text-sm text-gray-600">Same day service available</span>
              </div>
            </div>
            <button
              onClick={() => router.push('/contact')}
              className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Call (760) 270-0312
            </button>
          </div>
        </div>

        <div className="text-center mt-6 sm:mt-8">
          <p className="text-sm text-gray-500">
            Looking for a 10 yard dumpster rental or small dumpster rental near me? We offer flexible sizing options. Need a 2 yard dumpster rental near me for a small project? Contact us for the best cost of dumpster rental in San Diego!
          </p>
        </div>
      </div>
    </section>
  )
}
