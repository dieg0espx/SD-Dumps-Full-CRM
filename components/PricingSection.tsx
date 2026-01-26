'use client'

import React from 'react'
import { Check, Sparkles, Tag } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function PricingSection() {
  const router = useRouter()
  return (
    <section className="py-20 sm:py-28 lg:py-32 bg-gray-50/80 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-main/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section header */}
        <div className="text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 bg-main/10 rounded-full px-4 py-1.5 mb-6 animate-fade-in-down">
            <Tag className="w-4 h-4 text-main" />
            <span className="text-main text-sm font-semibold">Transparent Pricing</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 tracking-tight animate-slide-up">
            Affordable Dumpster Rental <span className="text-main">San Diego</span> Pricing
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed animate-slide-up delay-100">
            Wondering about the cost of dumpster rental? We offer cheap dumpster rental San Diego with transparent, upfront pricing. No hidden fees. Price includes 3 days (72 hours) and delivery. Same day dumpster rental San Diego available!
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* 17 Yard Dumpster */}
          <div className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 animate-fade-in-up delay-200">
            <div className="text-center mb-6">
              <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 tracking-tight">$595</div>
              <div className="text-base sm:text-lg font-semibold text-gray-800">17 Yard Roll Off Dumpster</div>
              <div className="text-sm text-gray-500 mt-3 leading-relaxed">Perfect for residential dumpster rental San Diego. Ideal for home cleanouts, small renovations, and yard waste.</div>
              <div className="text-xs text-gray-400 mt-2 font-medium">Includes 3 days & 2 tons. Extra days: $25/day.</div>
            </div>
            <div className="space-y-3 mb-6 sm:mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 rounded-full bg-main/10 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-main" />
                </div>
                <span className="text-sm text-gray-600">17 cubic yard capacity</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 rounded-full bg-main/10 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-main" />
                </div>
                <span className="text-sm text-gray-600">3 days (72 hours) included</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 rounded-full bg-main/10 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-main" />
                </div>
                <span className="text-sm text-gray-600">2 tons included in base price</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 rounded-full bg-main/10 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-main" />
                </div>
                <span className="text-sm text-gray-600">Residential & small projects</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 rounded-full bg-main/10 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-main" />
                </div>
                <span className="text-sm text-gray-600">Same day delivery San Diego</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 rounded-full bg-main/10 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-main" />
                </div>
                <span className="text-sm text-gray-600">Free delivery and pick-up</span>
              </div>
            </div>
            <button
              onClick={() => router.push('/booking')}
              className="w-full border border-gray-200 bg-white text-gray-700 py-3 sm:py-3.5 rounded-xl font-semibold text-sm shadow-professional-xs hover:shadow-professional-sm hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
            >
              Book Now
            </button>
          </div>

          {/* 21 Yard Dumpster - Featured */}
          <div className="relative bg-main rounded-3xl p-6 sm:p-8 shadow-2xl hover:shadow-glow-lg hover:-translate-y-2 transition-all duration-300 animate-slide-up delay-200 lg:scale-105 lg:-my-4">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full blur-2xl -translate-x-1/2 translate-y-1/2" />
            </div>

            {/* Most Popular Badge */}
            <div className="absolute -top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="bg-white text-main px-6 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Most Popular
              </div>
            </div>

            <div className="relative text-center mb-6 mt-4">
              <div className="text-4xl sm:text-5xl font-bold text-white mb-2 tracking-tight">$695</div>
              <div className="text-lg sm:text-xl font-semibold text-white/90">21 Yard Roll Off Dumpster</div>
              <div className="text-sm text-white/70 mt-3 leading-relaxed">Best for construction dumpster rental San Diego. Perfect for remodels, roofing, and commercial projects.</div>
              <div className="inline-block text-xs bg-white/20 text-white px-4 py-2 rounded-full mt-4 font-semibold backdrop-blur-sm">Includes 3 days & 2 tons. Best value!</div>
            </div>

            <div className="relative space-y-3 mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-white/90">21 cubic yard capacity</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-white/90">3 days (72 hours) included</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-white/90">2 tons included in base price</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-white/90">Construction & renovation debris</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-white/90">Same day dumpster rental San Diego</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-white/90">Free delivery and pick-up</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-white/90">Priority support 24/7</span>
              </div>
            </div>
            <button
              onClick={() => router.push('/booking')}
              className="relative w-full bg-white text-main py-4 rounded-xl font-bold text-base shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all duration-200 hover:-translate-y-0.5"
            >
              Book Now
            </button>
          </div>

          {/* Concrete & Dirt */}
          <div className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 animate-fade-in-up delay-600">
            <div className="text-center mb-6">
              <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 tracking-tight">Call Us</div>
              <div className="text-base sm:text-lg font-semibold text-gray-800">Concrete & Heavy Debris</div>
              <div className="text-sm text-gray-500 mt-3 leading-relaxed">Dump trailer rental and specialized containers for concrete, dirt, and heavy materials.</div>
              <div className="inline-block text-xs bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full mt-3 font-medium border border-amber-200/50">Call (760) 270-0312 for custom quote</div>
            </div>
            <div className="space-y-3 mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 rounded-full bg-main/10 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-main" />
                </div>
                <span className="text-sm text-gray-600">Dump trailer rental available</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 rounded-full bg-main/10 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-main" />
                </div>
                <span className="text-sm text-gray-600">Concrete & asphalt disposal</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 rounded-full bg-main/10 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-main" />
                </div>
                <span className="text-sm text-gray-600">Dirt, rock, and soil removal</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 rounded-full bg-main/10 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-main" />
                </div>
                <span className="text-sm text-gray-600">Heavy construction debris</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 rounded-full bg-main/10 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-main" />
                </div>
                <span className="text-sm text-gray-600">Custom pricing by weight</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 rounded-full bg-main/10 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-main" />
                </div>
                <span className="text-sm text-gray-600">Same day service available</span>
              </div>
            </div>
            <button
              onClick={() => router.push('/contact')}
              className="w-full border border-gray-200 bg-white text-gray-700 py-3.5 rounded-xl font-semibold text-sm shadow-professional-xs hover:shadow-professional-sm hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
            >
              Call (760) 270-0312
            </button>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12 sm:mt-16 animate-slide-up delay-400">
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-card border border-gray-100 max-w-3xl mx-auto">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Need a Custom Quote?</h3>
            <p className="text-gray-600 mb-6">
              Looking for a 10 yard dumpster rental or small dumpster rental near me? We offer flexible sizing options. Contact us for the best cost of dumpster rental in San Diego!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/contact')}
                className="bg-main text-white px-8 py-3.5 rounded-xl font-semibold shadow-glow hover:shadow-glow-lg hover:-translate-y-1 transition-all duration-300"
              >
                Get Custom Quote
              </button>
              <a href="tel:+17602700312">
                <button className="border border-gray-200 bg-white text-gray-700 px-8 py-3.5 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 w-full sm:w-auto">
                  Call (760) 270-0312
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
