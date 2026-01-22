import React from 'react'

export default function TrustedByThousands() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
          San Diego's Trusted Dumpster Rental Company
        </h2>
        <p className="text-base sm:text-lg text-gray-600 mb-8 sm:mb-12 max-w-3xl mx-auto">
          For over a decade, SD Dumping Solutions has been San Diego's go-to choice for affordable dumpster rental. From residential dumpster rental San Diego to commercial trash dumpsters, thousands of homeowners, contractors, and businesses trust our waste management San Diego services.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-main mb-1 sm:mb-2">10+</div>
            <div className="text-gray-600 text-sm sm:text-base">Years in San Diego</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-main mb-1 sm:mb-2">5000+</div>
            <div className="text-gray-600 text-sm sm:text-base">Dumpsters Delivered</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-main mb-1 sm:mb-2">99%</div>
            <div className="text-gray-600 text-sm sm:text-base">Customer Satisfaction</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-main mb-1 sm:mb-2">24/7</div>
            <div className="text-gray-600 text-sm sm:text-base">Same Day Service</div>
          </div>
        </div>
      </div>
    </section>
  )
}
