import React from 'react'
import Image from 'next/image'
import { Check } from 'lucide-react'

export default function WasteSolutions() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="order-2 lg:order-1 flex justify-center animate-fade-in-left delay-300">
            <div className="relative">
              <Image
                src="https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto/v1769107609/IMG_2592_ni693c.heic"
                alt="Construction dumpster rental San Diego - Commercial trash dumpsters and garbage dumpster rental"
                width={500}
                height={400}
                className="rounded-2xl w-full max-w-md lg:max-w-none object-cover shadow-professional-xl hover:shadow-professional-2xl transition-all duration-500"
              />
            </div>
          </div>
          <div className="order-1 lg:order-2 animate-fade-in-right">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 tracking-tight">
              Complete{' '}
              <span className="text-main">Waste Management San Diego</span>
            </h2>
            <p className="text-base sm:text-lg text-gray-500 mb-8 sm:mb-10 leading-relaxed">
              From construction dumpster rental San Diego to residential dumpster rental San Diego — we handle it all. Our junk removal services San Diego include garbage dumpster rental, commercial trash dumpsters, and dump trailer rental for every project size.
            </p>
            <div className="space-y-5 mb-8 sm:mb-10">
              <div className="flex items-start space-x-4 animate-fade-in-up delay-200 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-main/10 flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5 text-main" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1">Commercial Dumpster Rental</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">Commercial trash dumpsters for businesses, retail, restaurants, and office cleanouts. Regular pickup schedules available.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 animate-fade-in-up delay-400 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-main/10 flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5 text-main" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1">Construction Dumpster Rental San Diego</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">Heavy-duty roll off dumpster rental San Diego for construction debris, demolition waste, and renovation projects.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 animate-fade-in-up delay-600 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-main/10 flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5 text-main" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1">Junk Removal Services San Diego</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">Full-service junk removal and garbage dumpster rental. We haul away furniture, appliances, yard waste, and more.</p>
                </div>
              </div>
            </div>
            <button className="bg-main text-white px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl font-semibold shadow-professional-sm hover:shadow-professional-md hover:bg-main/90 transition-all duration-200 text-sm sm:text-base hover:-translate-y-0.5">
              Get Free Quote
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
