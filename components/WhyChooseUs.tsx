import React from 'react'
import Image from 'next/image'
import { Clock } from 'lucide-react'

export default function WhyChooseUs() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="order-1">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
              Why Choose Our{' '}
              <span className="text-main">Dumpster Rental Service</span>
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
              We provide professional waste management solutions with transparent pricing, reliable service, and expert support for projects of any size.
            </p>
            <button className="bg-main text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-main/90 transition-colors mb-6 sm:mb-8 text-sm sm:text-base">
              Learn More
            </button>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-main mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Fast & Reliable</h3>
                  <p className="text-gray-600 text-sm sm:text-base">Same-day delivery and pickup available for urgent projects.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-main rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-white rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Professional Service</h3>
                  <p className="text-gray-600 text-sm sm:text-base">Experienced team with modern equipment and competitive pricing.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="order-2 flex justify-center">
            <Image
              src="/dumpster.png"
              alt="Professional dumpster service"
              width={500}
              height={400}
              className="rounded-lg w-full max-w-md lg:max-w-none"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
