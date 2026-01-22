import React from 'react'
import Image from 'next/image'
import { Star } from 'lucide-react'

export default function Testimonials() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16 animate-fade-in-up">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
            San Diego Dumpster Rental Reviews
          </h2>
          <p className="text-base sm:text-lg text-gray-600">
            See why San Diego homeowners and contractors choose us for affordable dumpster rental.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="bg-white p-6 sm:p-8 rounded-lg shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 animate-fade-in-up delay-200">
            <div className="flex items-center mb-4">
              <Image
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="Mike Davis"
                width={48}
                height={48}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mr-3 sm:mr-4 flex-shrink-0 object-cover"
              />
              <div>
                <div className="font-semibold text-gray-900 text-sm sm:text-base">Mike Davis</div>
                <div className="text-xs sm:text-sm text-gray-600">General Contractor, La Jolla</div>
              </div>
            </div>
            <div className="flex mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
              ))}
            </div>
            <p className="text-gray-600 text-sm sm:text-base">
              "Best construction dumpster rental San Diego has to offer! Same day delivery, cheap pricing, and the roll off dumpster was exactly what I needed for my remodel. Will definitely use again."
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-lg shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 animate-fade-in-up delay-400">
            <div className="flex items-center mb-4">
              <Image
                src="https://randomuser.me/api/portraits/women/44.jpg"
                alt="Emily Chen"
                width={48}
                height={48}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mr-3 sm:mr-4 flex-shrink-0 object-cover"
              />
              <div>
                <div className="font-semibold text-gray-900 text-sm sm:text-base">Emily Chen</div>
                <div className="text-xs sm:text-sm text-gray-600">Property Manager, Chula Vista</div>
              </div>
            </div>
            <div className="flex mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
              ))}
            </div>
            <p className="text-gray-600 text-sm sm:text-base">
              "Needed a small dumpster rental near me for a tenant cleanout. SD Dumping Solutions had the most affordable dumpster rental San Diego prices. Their junk removal services are top notch!"
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-lg shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 animate-fade-in-up delay-600">
            <div className="flex items-center mb-4">
              <Image
                src="https://randomuser.me/api/portraits/men/67.jpg"
                alt="Carlos Rivero"
                width={48}
                height={48}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mr-3 sm:mr-4 flex-shrink-0 object-cover"
              />
              <div>
                <div className="font-semibold text-gray-900 text-sm sm:text-base">Carlos Rivero</div>
                <div className="text-xs sm:text-sm text-gray-600">Homeowner, El Cajon</div>
              </div>
            </div>
            <div className="flex mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
              ))}
            </div>
            <p className="text-gray-600 text-sm sm:text-base">
              "Was worried about cost of dumpster rental, but these guys offer the cheapest dumpster rental San Diego. Same day dumpster rental when I needed it. Highly recommend for residential projects!"
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
