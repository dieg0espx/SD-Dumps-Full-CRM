import React from 'react'
import { Check } from 'lucide-react'

export default function PricingSection() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
            Transparent Pricing
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
            Choose the right dumpster for your project. Base cost charged upon delivery. Extra tonnage charged after actual dump.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* 17 Yard Dumpster */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 sm:p-8 shadow-sm">
            <div className="text-center mb-6">
              <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">$595</div>
              <div className="text-base sm:text-lg text-gray-600">17 Yard Dumpster</div>
              <div className="text-sm text-gray-500 mt-2">Includes 2 tons of waste disposal.</div>
              <div className="text-xs text-gray-400 mt-1">Base cost charged upon delivery. Extra tonnage charged after actual dump.</div>
            </div>
            <div className="space-y-3 mb-6 sm:mb-8">
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-main flex-shrink-0" />
                <span className="text-sm text-gray-600">17 cubic yard capacity</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-main flex-shrink-0" />
                <span className="text-sm text-gray-600">2 tons included in base price</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-main flex-shrink-0" />
                <span className="text-sm text-gray-600">Extra tonnage: $125 per ton</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-main flex-shrink-0" />
                <span className="text-sm text-gray-600">Same-day delivery available</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-main flex-shrink-0" />
                <span className="text-sm text-gray-600">Flexible scheduling</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-main flex-shrink-0" />
                <span className="text-sm text-gray-600">Drop-off and pick-up included</span>
              </div>
            </div>
            <button className="w-full border border-gray-300 text-gray-700 py-2 sm:py-3 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base">
              Choose Plan
            </button>
          </div>

          {/* 21 Yard Dumpster - Featured */}
          <div className="bg-white border-2 border-main rounded-lg p-6 sm:p-8 shadow-lg relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-main text-white px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm">Most Popular</div>
            </div>
            <div className="text-center mb-6">
              <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">$695</div>
              <div className="text-base sm:text-lg text-gray-600">21 Yard Dumpster</div>
              <div className="text-sm text-gray-500 mt-2">Includes 2 tons of waste disposal.</div>
              <div className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded mt-2">Base cost charged upon delivery. Extra tonnage charged after actual dump.</div>
            </div>
            <div className="space-y-3 mb-8">
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-main" />
                <span className="text-sm text-gray-600">21 cubic yard capacity</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-main" />
                <span className="text-sm text-gray-600">2 tons included in base price</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-main" />
                <span className="text-sm text-gray-600">Extra tonnage: $125 per ton</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-main" />
                <span className="text-sm text-gray-600">Same-day delivery available</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-main" />
                <span className="text-sm text-gray-600">Flexible scheduling</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-main" />
                <span className="text-sm text-gray-600">Drop-off and pick-up included</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-main" />
                <span className="text-sm text-gray-600">Priority support</span>
              </div>
            </div>
            <button className="w-full bg-main text-white py-3 rounded-lg hover:bg-main/90 transition-colors">
              Choose Plan
            </button>
          </div>

          {/* Concrete & Dirt */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 sm:p-8 shadow-sm">
            <div className="text-center mb-6">
              <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Call Us</div>
              <div className="text-base sm:text-lg text-gray-600">Concrete & Dirt</div>
              <div className="text-sm text-gray-500 mt-2">Specialized dumpsters for concrete and dirt disposal available.</div>
              <div className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded mt-2">Please call us for a quote on concrete & dirt disposal.</div>
            </div>
            <div className="space-y-3 mb-8">
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-main" />
                <span className="text-sm text-gray-600">Specialized containers</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-main" />
                <span className="text-sm text-gray-600">Concrete disposal</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-main" />
                <span className="text-sm text-gray-600">Dirt and rock removal</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-main" />
                <span className="text-sm text-gray-600">Professional handling</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-main" />
                <span className="text-sm text-gray-600">Custom pricing</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-main" />
                <span className="text-sm text-gray-600">Call for quote</span>
              </div>
            </div>
            <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors">
              Contact Us
            </button>
          </div>
        </div>

        <div className="text-center mt-6 sm:mt-8">
          <p className="text-sm text-gray-500">
            Need a custom solution? Contact us for personalized pricing based on your specific requirements.
          </p>
        </div>
      </div>
    </section>
  )
}
