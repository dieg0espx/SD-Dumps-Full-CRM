import React from 'react'
import Image from 'next/image'
import { Star, Quote, MessageSquare } from 'lucide-react'
import SectionDivider from './SectionDivider'

export default function Testimonials() {
  const testimonials = [
    {
      name: "Mike Davis",
      initials: "MD",
      role: "General Contractor, La Jolla",
      review: "Best construction dumpster rental San Diego has to offer! Same day delivery, cheap pricing, and the roll off dumpster was exactly what I needed for my remodel. Will definitely use again.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Emily Chen",
      initials: "EC",
      role: "Property Manager, Chula Vista",
      review: "Needed a small dumpster rental near me for a tenant cleanout. SD Dumping Solutions had the most affordable dumpster rental San Diego prices. Their junk removal services are top notch!",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Carlos Rivero",
      initials: "CR",
      role: "Homeowner, El Cajon",
      review: "Was worried about cost of dumpster rental, but these guys offer the cheapest dumpster rental San Diego. Same day dumpster rental when I needed it. Highly recommend for residential projects!",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    }
  ]

  return (
    <>
      {/* Top divider - white to dark */}
      <SectionDivider type="tilt" fromColor="white" toColor="#0f172a" />

      <section className="py-20 sm:py-28 lg:py-32 bg-slate-900 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section header */}
        <div className="text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-6 animate-fade-in-down">
            <MessageSquare className="w-4 h-4 text-main" />
            <span className="text-main text-sm font-semibold">Customer Reviews</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight animate-slide-up">
            San Diego Dumpster Rental <span className="text-main">Reviews</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto animate-slide-up delay-100">
            See why San Diego homeowners and contractors choose us for affordable dumpster rental.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="testimonial-card group bg-slate-800 p-6 sm:p-8 rounded-2xl border border-slate-700 hover:border-slate-600 hover:-translate-y-1 transition-all duration-300 animate-slide-up relative"
              style={{ animationDelay: `${(index + 2) * 100}ms` }}
            >
              {/* Quote decoration */}
              <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center opacity-50 group-hover:opacity-100 group-hover:bg-main/20 transition-all duration-300">
                <Quote className="w-5 h-5 text-slate-500 group-hover:text-main transition-colors" />
              </div>

              {/* Profile */}
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 rounded-2xl mr-4 flex-shrink-0 overflow-hidden shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={56}
                    height={56}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-semibold text-white text-base">{testimonial.name}</div>
                  <div className="text-sm text-slate-400">{testimonial.role}</div>
                </div>
              </div>

              {/* Stars */}
              <div className="flex mb-4 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400 drop-shadow-sm" />
                ))}
              </div>

              {/* Review */}
              <p className="text-slate-300 leading-relaxed">
                "{testimonial.review}"
              </p>
            </div>
          ))}
        </div>

        {/* Trust badge */}
        <div className="flex justify-center mt-12 animate-fade-in-up delay-500">
          <div className="flex items-center gap-3 bg-slate-800 rounded-full px-6 py-3 border border-slate-700">
            <div className="flex -space-x-2">
              {testimonials.map((testimonial, i) => (
                <div key={i} className="w-8 h-8 rounded-full overflow-hidden border-2 border-slate-700">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="font-semibold text-white">4.9/5</span>
              <span className="text-slate-400 text-sm">from 200+ reviews</span>
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* Bottom divider - dark to white */}
      <SectionDivider type="tilt" fromColor="#0f172a" toColor="white" />
    </>
  )
}
