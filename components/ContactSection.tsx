import React from 'react'
import { Phone, Mail } from 'lucide-react'

export default function ContactSection() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
          Get Your San Diego Dumpster Rental Quote
        </h2>
        <p className="text-base sm:text-lg text-gray-600 mb-8 sm:mb-12">
          Ready for affordable dumpster rental San Diego? Whether you need a small dumpster rental near me, roll off dumpster rental San Diego, or commercial trash dumpsters — we've got you covered. Same day dumpster rental San Diego available!
        </p>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
          <div className="flex flex-col items-center">
            <Phone className="w-6 h-6 sm:w-8 sm:h-8 text-main mb-3 sm:mb-4" />
            <div className="text-gray-900 font-semibold text-lg sm:text-xl">(760) 270-0312</div>
            <div className="text-gray-500 text-sm">Call for Same Day Service</div>
          </div>
          <div className="flex flex-col items-center">
            <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-main mb-3 sm:mb-4" />
            <div className="text-gray-600 text-sm sm:text-base">sandiegodumpingsolutions@gmail.com</div>
            <div className="text-gray-500 text-sm">Email for Free Quote</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <button className="bg-main text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg hover:bg-main/90 transition-colors text-sm sm:text-base">
            Get Free Quote Now
          </button>
          <button className="border border-gray-300 text-gray-700 px-6 sm:px-8 py-2 sm:py-3 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base">
            Call (760) 270-0312
          </button>
        </div>
      </div>
    </section>
  )
}
