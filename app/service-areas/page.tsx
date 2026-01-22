import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { MapPin, Phone, ArrowRight, CheckCircle } from 'lucide-react'
import { cities } from '@/lib/cities'

export const metadata: Metadata = {
  title: 'Service Areas | Dumpster Rental San Diego County | SD Dumping Solutions',
  description: 'SD Dumping Solutions provides professional dumpster rental services throughout San Diego County. Same-day delivery available in San Diego, Chula Vista, Oceanside, Escondido, Carlsbad, and more.',
  keywords: [
    'dumpster rental San Diego County',
    'San Diego dumpster service',
    'roll-off containers San Diego',
    'waste removal San Diego',
    'dumpster delivery near me',
  ],
  openGraph: {
    title: 'Service Areas | Dumpster Rental San Diego County | SD Dumping Solutions',
    description: 'Professional dumpster rental services throughout San Diego County. Same-day delivery available.',
    url: 'https://sddumps.com/service-areas',
    siteName: 'SD Dumping Solutions',
    images: [
      {
        url: 'https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto/sddumps/miniature.png',
        width: 1200,
        height: 630,
        alt: 'SD Dumping Solutions Service Areas',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: '/service-areas',
  },
}

export default function ServiceAreasPage() {
  // Group cities by size for visual hierarchy
  const majorCities = cities.filter(c =>
    ['san-diego', 'chula-vista', 'oceanside', 'escondido', 'carlsbad'].includes(c.slug)
  )
  const otherCities = cities.filter(c =>
    !['san-diego', 'chula-vista', 'oceanside', 'escondido', 'carlsbad'].includes(c.slug)
  )

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative text-white pt-28 sm:pt-32 lg:pt-36 pb-16 sm:pb-20 lg:pb-24">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto/v1769107608/IMG_0265_dkokq7.heic')"
          }}
        />
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-main mb-4">
            <MapPin className="w-5 h-5" />
            <span className="text-sm font-medium uppercase tracking-wide">Service Areas</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Serving All of<br />
            <span className="text-main">San Diego County</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mb-8">
            From the beaches of Oceanside to the mountains of Ramona, we deliver professional dumpster rental services throughout San Diego County. Same-day delivery available in most areas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/guest-booking">
              <button className="flex items-center justify-center gap-2 bg-main text-white px-8 py-4 rounded-lg hover:bg-main/90 transition-colors font-semibold text-lg">
                Book Now
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
            <a href="tel:+17602700312">
              <button className="flex items-center justify-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg">
                <Phone className="w-5 h-5" />
                (760) 270-0312
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 bg-main text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 flex-shrink-0" />
              <span className="font-medium">Same-Day Delivery</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 flex-shrink-0" />
              <span className="font-medium">No Hidden Fees</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 flex-shrink-0" />
              <span className="font-medium">Licensed & Insured</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 flex-shrink-0" />
              <span className="font-medium">Local Experts</span>
            </div>
          </div>
        </div>
      </section>

      {/* Major Cities */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Major Cities We Serve</h2>
          <p className="text-gray-600 mb-8">
            Click on any city to learn more about our services in that area.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {majorCities.map((city) => (
              <Link
                key={city.slug}
                href={`/service-areas/${city.slug}`}
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-main transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-main transition-colors">
                      {city.name}
                    </h3>
                    <p className="text-sm text-gray-500">Population: {city.population}</p>
                  </div>
                  <div className="w-10 h-10 bg-main/10 rounded-full flex items-center justify-center group-hover:bg-main transition-colors">
                    <MapPin className="w-5 h-5 text-main group-hover:text-white transition-colors" />
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {city.description}
                </p>
                <div className="flex items-center text-main font-medium text-sm">
                  View Details
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* All Cities Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">All Service Areas</h2>
          <p className="text-gray-600 mb-8">
            We provide dumpster rental services to the following cities and surrounding communities.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {cities.map((city) => (
              <Link
                key={city.slug}
                href={`/service-areas/${city.slug}`}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:border-main hover:shadow-md transition-all text-center group"
              >
                <span className="font-medium text-gray-900 group-hover:text-main transition-colors">
                  {city.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Coverage Info */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                San Diego County Coverage
              </h2>
              <p className="text-gray-600 mb-6">
                Based in Valley Center, SD Dumping Solutions provides comprehensive dumpster rental services throughout San Diego County. Our local expertise means we understand the unique needs of each community we serve.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-main flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-gray-900">Free Delivery Within 20 Miles</span>
                    <p className="text-gray-600 text-sm">No delivery fee for locations within 20 miles of Valley Center</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-main flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-gray-900">Extended Coverage Available</span>
                    <p className="text-gray-600 text-sm">We serve areas beyond our free delivery zone at $1.50/mile</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-main flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-gray-900">Same-Day Delivery</span>
                    <p className="text-gray-600 text-sm">Available in most areas when you book before 10am</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="bg-gray-900 text-white rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-4">Not Sure If We Service Your Area?</h3>
              <p className="text-gray-300 mb-6">
                Give us a call and we&apos;ll let you know if we can deliver to your location. We&apos;re always expanding our service area to meet customer needs.
              </p>
              <a href="tel:+17602700312">
                <button className="flex items-center justify-center gap-2 bg-main text-white px-6 py-3 rounded-lg hover:bg-main/90 transition-colors font-semibold w-full">
                  <Phone className="w-5 h-5" />
                  Call (760) 270-0312
                </button>
              </a>
              <p className="text-gray-400 text-sm mt-4 text-center">
                Mon-Fri: 9AM-6PM
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-main text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Rent a Dumpster?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Book online in minutes or give us a call for immediate assistance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/guest-booking">
              <button className="flex items-center justify-center gap-2 bg-white text-main px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg">
                Book Online
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
            <a href="tel:+17602700312">
              <button className="flex items-center justify-center gap-2 border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white/10 transition-colors font-semibold text-lg">
                <Phone className="w-5 h-5" />
                Call (760) 270-0312
              </button>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
