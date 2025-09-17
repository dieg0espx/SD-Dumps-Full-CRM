import React from 'react'

export default function TrustedByThousands() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
          Trusted by Thousands of Customers
        </h2>
        <p className="text-base sm:text-lg text-gray-600 mb-8 sm:mb-12 max-w-3xl mx-auto">
          With over two decades of experience, we've built a reputation for excellence in waste management and container services.
        </p>
        
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center mb-12 sm:mb-16">
          <div className="bg-gray-200 rounded-lg h-48 sm:h-64 lg:h-80 flex items-center justify-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-300 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-400 rounded"></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-main mb-1 sm:mb-2">25+</div>
              <div className="text-gray-600 text-sm sm:text-base">Years of Experience</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-main mb-1 sm:mb-2">500+</div>
              <div className="text-gray-600 text-sm sm:text-base">Completed Projects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-main mb-1 sm:mb-2">98%</div>
              <div className="text-gray-600 text-sm sm:text-base">Client Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-main mb-1 sm:mb-2">24/7</div>
              <div className="text-gray-600 text-sm sm:text-base">Customer Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
