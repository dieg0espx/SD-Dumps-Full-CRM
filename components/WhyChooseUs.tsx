import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Clock, DollarSign, Truck, CheckCircle } from 'lucide-react'

export default function WhyChooseUs() {
  const features = [
    {
      icon: Clock,
      title: "Same Day Dumpster Rental San Diego",
      description: "Need a dumpster today? We offer same day delivery throughout San Diego County for urgent construction and junk removal projects."
    },
    {
      icon: DollarSign,
      title: "Cheap Dumpster Rental San Diego",
      description: "Affordable pricing with no hidden fees. Residential dumpster rental San Diego and commercial dumpster rental at competitive rates."
    },
    {
      icon: Truck,
      title: "Fast & Reliable Service",
      description: "Professional delivery and pickup. Our team ensures your dumpster arrives on time, every time."
    }
  ]

  return (
    <section className="py-20 sm:py-28 lg:py-32 bg-gradient-mesh relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-main/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-main/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="order-1 animate-slide-in-left">
            {/* Section label */}
            <div className="inline-flex items-center gap-2 bg-main/10 rounded-full px-4 py-1.5 mb-6">
              <CheckCircle className="w-4 h-4 text-main" />
              <span className="text-main text-sm font-semibold">Why Choose Us</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 tracking-tight leading-tight">
              Why San Diego Chooses Our{' '}
              <span className="text-main relative">
                Dumpster Rental
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                  <path d="M1 5.5C47 2 153 2 199 5.5" stroke="#6666ff" strokeWidth="3" strokeLinecap="round" className="animate-pulse-soft"/>
                </svg>
              </span>
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-8 leading-relaxed">
              Looking for affordable dumpster rental in San Diego? We offer the best cost of dumpster rental in the area — transparent pricing, same day dumpster rental San Diego delivery, and waste management San Diego trusts.
            </p>

            <Link href="/services">
              <button className="group bg-main text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold shadow-glow hover:shadow-glow-lg hover:bg-main/90 transition-all duration-300 mb-10 text-sm sm:text-base hover:-translate-y-1 flex items-center gap-2">
                View Our Services
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </Link>

            <div className="space-y-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`feature-card flex items-start gap-4 p-5 bg-white rounded-2xl shadow-card border border-gray-100 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 animate-slide-up`}
                  style={{ animationDelay: `${(index + 1) * 150}ms` }}
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-main/20 to-main/5 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-main" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-base mb-1">{feature.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="order-2 flex justify-center animate-slide-in-right">
            <div className="relative">
              {/* Decorative elements behind image */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-main/20 to-purple-400/20 rounded-3xl blur-2xl animate-pulse-soft" />
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-main/10 rounded-full animate-bounce-gentle" />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-purple-400/10 rounded-full animate-bounce-gentle" style={{ animationDelay: '1s' }} />

              <Image
                src="https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto/v1769107608/IMG_0265_dkokq7.heic"
                alt="Roll off dumpster rental San Diego - Affordable waste management services"
                width={500}
                height={400}
                className="relative rounded-3xl w-full max-w-md lg:max-w-none object-cover shadow-professional-2xl hover:scale-[1.02] transition-all duration-500"
              />

              {/* Floating badge */}
              <div className="absolute -bottom-4 -right-4 sm:bottom-6 sm:right-6 bg-white rounded-2xl shadow-professional-lg p-4 animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">99%</div>
                    <div className="text-xs text-gray-500">Satisfaction Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" preserveAspectRatio="none">
          <path d="M0 80L60 70C120 60 240 40 360 35C480 30 600 40 720 45C840 50 960 50 1080 45C1200 40 1320 30 1380 25L1440 20V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z" fill="white"/>
        </svg>
      </div>
    </section>
  )
}
