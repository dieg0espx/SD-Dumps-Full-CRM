import React from 'react'
import { Phone, Mail } from 'lucide-react'

export default function ContactSection() {
  return (
    <section className="relative py-16 sm:py-20 lg:py-24 bg-gray-900 -mt-1">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: "url('https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto/sddumps/hero-bg')" }}
      />
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6 animate-fade-in-up">
          Get Your San Diego Dumpster Rental Quote
        </h2>
        <p className="text-base sm:text-lg text-gray-300 mb-8 sm:mb-12 animate-fade-in-up delay-200">
          Ready for affordable dumpster rental San Diego? Whether you need a small dumpster rental near me, roll off dumpster rental San Diego, or commercial trash dumpsters — we've got you covered. Same day dumpster rental San Diego available!
        </p>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
          <div className="flex flex-col items-center animate-fade-in-left delay-300 hover:scale-105 transition-transform duration-300">
            <Phone className="w-6 h-6 sm:w-8 sm:h-8 text-main mb-3 sm:mb-4" />
            <div className="text-white font-semibold text-lg sm:text-xl">(760) 270-0312</div>
            <div className="text-gray-400 text-sm">Call for Same Day Service</div>
          </div>
          <div className="flex flex-col items-center animate-fade-in-right delay-300 hover:scale-105 transition-transform duration-300">
            <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-main mb-3 sm:mb-4" />
            <div className="text-gray-300 text-sm sm:text-base">sandiegodumpingsolutions@gmail.com</div>
            <div className="text-gray-400 text-sm">Email for Free Quote</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center animate-fade-in-up delay-500">
          <button className="bg-main text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg hover:bg-main/90 hover:scale-105 transition-all duration-300 text-sm sm:text-base">
            Get Free Quote Now
          </button>
          <button className="border border-white text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg hover:bg-white/10 hover:scale-105 transition-all duration-300 text-sm sm:text-base">
            Call (760) 270-0312
          </button>
        </div>
      </div>
    </section>
  )
}
