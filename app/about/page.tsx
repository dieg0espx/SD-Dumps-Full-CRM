import React from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Shield, Users, Award, Truck, Check } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { AboutPageSchema, BreadcrumbSchema } from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'About SD Dumping Solutions | San Diego Dumpster Rental Company',
  description: 'SD Dumping Solutions is San Diego\'s trusted dumpster rental company. 10+ years providing affordable dumpster rental San Diego, roll off containers, and waste management services. Same day delivery available!',
  keywords: [
    'dumpster rental san diego',
    'san diego dumpster rental',
    'about SD Dumping Solutions',
    'waste management san diego',
    'dumpster rental company san diego',
    'affordable dumpster rental san diego',
    'roll off dumpster rental san diego',
    'residential dumpster rental san diego',
    'commercial dumpster rental',
    'junk removal services san diego'
  ],
  openGraph: {
    title: 'About SD Dumping Solutions | San Diego Dumpster Rental Company',
    description: 'SD Dumping Solutions is San Diego\'s trusted dumpster rental company. 10+ years providing affordable dumpster rental, roll off containers, and waste management services.',
    url: 'https://sddumps.com/about',
    siteName: 'SD Dumping Solutions',
    images: [
      {
        url: 'https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto/sddumps/miniature.png',
        width: 1200,
        height: 630,
        alt: 'SD Dumping Solutions - San Diego Dumpster Rental Company',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About SD Dumping Solutions | San Diego Dumpster Rental Company',
    description: 'San Diego\'s trusted dumpster rental company. 10+ years of affordable dumpster rental and waste management services.',
    images: ['https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto/sddumps/miniature.png'],
  },
  alternates: {
    canonical: '/about',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function About() {
  const breadcrumbs = [
    { name: 'Home', url: 'https://sddumps.com' },
    { name: 'About', url: 'https://sddumps.com/about' }
  ]

  return (
    <>
      <AboutPageSchema />
      <BreadcrumbSchema items={breadcrumbs} />
      <div className="min-h-screen bg-white">
        <Header />
      
      <div className="bg-white">
        {/* About Us Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
                San Diego's Trusted<br />
                <span className="text-main">Dumpster Rental Company</span>
              </h1>
              <p className="text-base sm:text-lg text-gray-600 mb-8 sm:mb-10">
                For over a decade, SD Dumping Solutions has been San Diego's go-to provider for affordable dumpster rental. We offer residential dumpster rental San Diego, commercial dumpster rental, construction dumpster rental San Diego, and comprehensive waste management San Diego services to homeowners, contractors, and businesses.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-main mb-1 sm:mb-2">10+</div>
                  <div className="text-xs sm:text-sm lg:text-base text-gray-600">Years in San Diego</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-main mb-1 sm:mb-2">5000+</div>
                  <div className="text-xs sm:text-sm lg:text-base text-gray-600">Dumpsters Delivered</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-main mb-1 sm:mb-2">99%</div>
                  <div className="text-xs sm:text-sm lg:text-base text-gray-600">Customer Satisfaction</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-main mb-1 sm:mb-2">24/7</div>
                  <div className="text-xs sm:text-sm lg:text-base text-gray-600">Same Day Service</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                             <div className="order-1">
                 <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 text-center lg:text-left">Why Choose Our San Diego Dumpster Rental</h2>
                <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6">
                  When you search for "dumpster rental San Diego" or "affordable dumpster rental San Diego," you'll find dozens of options. What sets us apart? We built our business on providing cheap dumpster rental San Diego without sacrificing quality or service.
                </p>
                <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
                  Whether you need a small dumpster rental near me for a garage cleanout, a 10 yard dumpster rental for landscaping, or roll off dumpster rental San Diego for major construction — we have the right container at the right price. Same day dumpster rental San Diego available when you need it fast.
                </p>

                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start sm:items-center">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-main rounded-full flex items-center justify-center mr-3 mt-0.5 sm:mt-0 flex-shrink-0">
                      <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-4 lg:h-4 text-white" />
                    </div>
                    <span className="text-sm sm:text-base text-gray-700">Lowest cost of dumpster rental in San Diego</span>
                  </div>
                  <div className="flex items-start sm:items-center">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-main rounded-full flex items-center justify-center mr-3 mt-0.5 sm:mt-0 flex-shrink-0">
                      <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-4 lg:h-4 text-white" />
                    </div>
                    <span className="text-sm sm:text-base text-gray-700">Same day dumpster rental San Diego available</span>
                  </div>
                  <div className="flex items-start sm:items-center">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-main rounded-full flex items-center justify-center mr-3 mt-0.5 sm:mt-0 flex-shrink-0">
                      <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-4 lg:h-4 text-white" />
                    </div>
                    <span className="text-sm sm:text-base text-gray-700">Licensed, insured waste management San Diego</span>
                  </div>
                  <div className="flex items-start sm:items-center">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-main rounded-full flex items-center justify-center mr-3 mt-0.5 sm:mt-0 flex-shrink-0">
                      <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-4 lg:h-4 text-white" />
                    </div>
                    <span className="text-sm sm:text-base text-gray-700">Local San Diego company — we know the area</span>
                  </div>
                </div>
              </div>

              <div className="order-2 flex justify-center">
                <Image
                  src="https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto/v1769107609/IMG_0405_fxcujh.heic"
                  alt="Affordable dumpster rental San Diego - Construction and residential roll off containers"
                  width={500}
                  height={400}
                  className="rounded-lg w-full max-w-md lg:max-w-none object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Our Core Values Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">What Makes Our Dumpster Rental San Diego Different</h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
                From residential dumpster rental San Diego to commercial trash dumpsters, these values guide every delivery and pickup.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              <div className="text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-main/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-main" />
                </div>
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Same Day Delivery</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Need a dumpster today? Our same day dumpster rental San Diego service means you get your roll off container when you need it.
                </p>
              </div>

              <div className="text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-main/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-main" />
                </div>
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Affordable Pricing</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  The best cost of dumpster rental in San Diego. Cheap dumpster rental San Diego prices with no hidden fees or surprise charges.
                </p>
              </div>

              <div className="text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-main/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Award className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-main" />
                </div>
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Quality Equipment</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Modern roll off dumpsters and commercial trash dumpsters. From 10 yard dumpster rental to large construction containers.
                </p>
              </div>

              <div className="text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-main/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Truck className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-main" />
                </div>
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Full Service</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Complete waste management San Diego — garbage dumpster rental, junk removal services San Diego, and dump trailer rental.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">Ready for Affordable Dumpster Rental San Diego?</h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8">
              Get your free quote for dumpster rental in San Diego. Whether you need residential dumpster rental San Diego, construction dumpster rental San Diego, or commercial trash dumpsters — call us today at (760) 270-0312!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <Link href="/booking" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto bg-main text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg hover:bg-main/80 transition-colors text-sm sm:text-base">
                  Get Free Quote
                </button>
              </Link>
              <Link href="/services" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto border border-gray-300 text-gray-700 px-6 sm:px-8 py-2 sm:py-3 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base">
                  View Our Services
                </button>
              </Link>
            </div>
          </div>
        </section>
      </div>
      </div>
    </>
  )
}
