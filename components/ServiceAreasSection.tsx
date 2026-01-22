import React from 'react'
import Link from 'next/link'
import { MapPin, ArrowRight } from 'lucide-react'
import { cities } from '@/lib/cities'

export default function ServiceAreasSection() {
  // Featured cities to highlight
  const featuredCities = cities.slice(0, 8)
  const remainingCount = cities.length - 8

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-2 text-main mb-3 sm:mb-4">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wide">Service Areas</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Proudly Serving San Diego County
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg">
            Based in Valley Center, we provide professional dumpster rental services to all major cities throughout San Diego County. Same-day delivery available in most areas.
          </p>
        </div>

        {/* Cities Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {featuredCities.map((city) => (
            <Link
              key={city.slug}
              href={`/service-areas/${city.slug}`}
              className="group bg-white border border-gray-200 rounded-xl p-3 sm:p-5 hover:shadow-lg hover:border-main transition-all"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-main/10 rounded-full flex items-center justify-center group-hover:bg-main transition-colors flex-shrink-0">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-main group-hover:text-white transition-colors" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 group-hover:text-main transition-colors text-sm sm:text-base truncate">
                    {city.name}
                  </h3>
                  <p className="text-xs text-gray-500 hidden sm:block">{city.population} residents</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center">
          <Link
            href="/service-areas"
            className="inline-flex items-center gap-2 bg-main text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-main/90 transition-colors font-semibold text-sm sm:text-base"
          >
            View All {cities.length} Service Areas
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
          {remainingCount > 0 && (
            <p className="text-gray-500 text-xs sm:text-sm mt-2 sm:mt-3">
              Plus {remainingCount} more cities including El Cajon, Vista, Santee, and more
            </p>
          )}
        </div>

        {/* Features */}
        <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Free Delivery</h3>
            <p className="text-gray-600 text-xs sm:text-sm">Within 20 miles of Valley Center</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Same-Day Delivery</h3>
            <p className="text-gray-600 text-xs sm:text-sm">Book before 10am for same-day service</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Local Experts</h3>
            <p className="text-gray-600 text-xs sm:text-sm">We know San Diego County inside and out</p>
          </div>
        </div>
      </div>
    </section>
  )
}
