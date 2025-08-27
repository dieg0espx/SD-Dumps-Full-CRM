import React from 'react'
import { Star } from 'lucide-react'

export default function Testimonials() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
            What our clients are saying
          </h2>
          <p className="text-base sm:text-lg text-gray-600">
            Real feedback from our happy customers.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="bg-white p-6 sm:p-8 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-300 rounded-full mr-3 sm:mr-4 flex-shrink-0"></div>
              <div>
                <div className="font-semibold text-gray-900 text-sm sm:text-base">Mike Davis</div>
                <div className="text-xs sm:text-sm text-gray-600">Renovation Owner</div>
              </div>
            </div>
            <div className="flex mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
              ))}
            </div>
            <p className="text-gray-600 text-sm sm:text-base">
              "Great service and transparent pricing. Highly recommend for any business waste needs!"
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-300 rounded-full mr-3 sm:mr-4 flex-shrink-0"></div>
              <div>
                <div className="font-semibold text-gray-900 text-sm sm:text-base">Emily Chen</div>
                <div className="text-xs sm:text-sm text-gray-600">Landlord</div>
              </div>
            </div>
            <div className="flex mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
              ))}
            </div>
            <p className="text-gray-600 text-sm sm:text-base">
              "The best dumpster rental experience I've ever had! Will use again for my properties."
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-300 rounded-full mr-3 sm:mr-4 flex-shrink-0"></div>
              <div>
                <div className="font-semibold text-gray-900 text-sm sm:text-base">Carlos Rivero</div>
                <div className="text-xs sm:text-sm text-gray-600">Homeowner</div>
              </div>
            </div>
            <div className="flex mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
              ))}
            </div>
            <p className="text-gray-600 text-sm sm:text-base">
              "Quick delivery and pick up. The tonnage packages are perfect for my jobs."
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
