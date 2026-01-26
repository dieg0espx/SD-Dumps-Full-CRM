import React from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Shield, Users, Award, Truck, Check, Clock, DollarSign, Leaf, Phone, ArrowRight, Star, MapPin, Calendar, Target, Heart } from 'lucide-react'
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

  const stats = [
    { value: '10+', label: 'Years in San Diego', icon: Calendar },
    { value: '5000+', label: 'Dumpsters Delivered', icon: Truck },
    { value: '99%', label: 'Customer Satisfaction', icon: Star },
    { value: '24/7', label: 'Same Day Service', icon: Clock },
  ]

  const values = [
    {
      icon: Clock,
      title: 'Same Day Delivery',
      description: 'Need a dumpster today? Our same day dumpster rental San Diego service means you get your roll off container when you need it.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: DollarSign,
      title: 'Affordable Pricing',
      description: 'The best cost of dumpster rental in San Diego. Cheap dumpster rental San Diego prices with no hidden fees or surprise charges.',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Award,
      title: 'Quality Equipment',
      description: 'Modern roll off dumpsters and commercial trash dumpsters. From 10 yard dumpster rental to large construction containers.',
      color: 'from-amber-500 to-amber-600'
    },
    {
      icon: Leaf,
      title: 'Eco-Friendly',
      description: 'Committed to responsible waste management San Diego. We recycle and dispose of materials properly to protect our environment.',
      color: 'from-emerald-500 to-emerald-600'
    },
  ]

  const timeline = [
    { year: '2014', title: 'Founded in San Diego', description: 'Started with a single truck and a commitment to excellent service.' },
    { year: '2017', title: 'Fleet Expansion', description: 'Grew to 10+ roll off containers to serve more San Diego neighborhoods.' },
    { year: '2020', title: 'Same Day Service', description: 'Launched same day dumpster rental San Diego to meet urgent project needs.' },
    { year: '2024', title: '5000+ Deliveries', description: 'Celebrating thousands of successful projects across San Diego County.' },
  ]

  return (
    <>
      <AboutPageSchema />
      <BreadcrumbSchema items={breadcrumbs} />
      <div className="min-h-screen bg-white">

        {/* Hero Section */}
        <section className="relative min-h-[70vh] flex items-center bg-slate-900 overflow-hidden -mt-[88px] pt-[88px]">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto/v1769107610/IMG_6035_gbo7ql.heic"
              alt="SD Dumping Solutions dumpster rental"
              fill
              className="object-cover opacity-30"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-900/80" />
          </div>

          {/* Decorative elements */}
          <div className="absolute top-20 right-20 w-72 h-72 bg-main/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 animate-fade-in-down">
                <MapPin className="w-4 h-4 text-main" />
                <span className="text-white/90 text-sm font-medium">Proudly Serving San Diego County</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight animate-slide-up">
                San Diego's Trusted
                <span className="block text-main mt-2">Dumpster Rental Company</span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-300 mb-10 leading-relaxed animate-slide-up delay-100 max-w-2xl">
                For over a decade, SD Dumping Solutions has been San Diego's go-to provider for affordable dumpster rental. We serve homeowners, contractors, and businesses with reliable waste management solutions.
              </p>

              <div className="flex flex-wrap gap-4 animate-slide-up delay-200">
                <Link href="/booking">
                  <button className="group bg-main hover:bg-main/90 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 shadow-lg shadow-main/25 flex items-center gap-2">
                    Get Free Quote
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                <a href="tel:7602700312">
                  <button className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 flex items-center gap-2 border border-white/20">
                    <Phone className="w-4 h-4" />
                    (760) 270-0312
                  </button>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="relative -mt-16 z-10 pb-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon
                return (
                  <div
                    key={index}
                    className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-100 text-center group hover:-translate-y-2 transition-all duration-300 animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="w-12 h-12 bg-main/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-main/20 transition-all duration-300">
                      <IconComponent className="w-6 h-6 text-main" />
                    </div>
                    <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-500">{stat.label}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-20 sm:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="order-2 lg:order-1">
                <div className="inline-flex items-center gap-2 bg-main/10 rounded-full px-4 py-1.5 mb-6">
                  <Heart className="w-4 h-4 text-main" />
                  <span className="text-main text-sm font-semibold">Our Story</span>
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
                  Why Choose Our San Diego <span className="text-main">Dumpster Rental</span>
                </h2>

                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  When you search for "dumpster rental San Diego" or "affordable dumpster rental San Diego," you'll find dozens of options. What sets us apart? We built our business on providing cheap dumpster rental San Diego without sacrificing quality or service.
                </p>

                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Whether you need a small dumpster rental near me for a garage cleanout, a 10 yard dumpster rental for landscaping, or roll off dumpster rental San Diego for major construction — we have the right container at the right price.
                </p>

                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    'Lowest cost of dumpster rental',
                    'Same day delivery available',
                    'Licensed & insured',
                    'Local San Diego experts'
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                      <div className="w-6 h-6 bg-main rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span className="text-gray-700 font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="order-1 lg:order-2">
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-main/20 to-blue-500/20 rounded-3xl blur-2xl" />
                  <Image
                    src="https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto/v1769107609/IMG_0405_fxcujh.heic"
                    alt="Affordable dumpster rental San Diego - Construction and residential roll off containers"
                    width={600}
                    height={500}
                    className="relative rounded-2xl shadow-2xl object-cover w-full"
                  />
                  {/* Floating badge */}
                  <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <Check className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">5000+</div>
                      <div className="text-sm text-gray-500">Happy Customers</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-20 sm:py-28 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-main/10 rounded-full px-4 py-1.5 mb-6">
                <Calendar className="w-4 h-4 text-main" />
                <span className="text-main text-sm font-semibold">Our Journey</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
                A Decade of <span className="text-main">Excellence</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                From humble beginnings to San Diego's trusted dumpster rental company.
              </p>
            </div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-main via-main to-main/20 hidden lg:block" />

              <div className="space-y-12 lg:space-y-0">
                {timeline.map((item, index) => (
                  <div key={index} className={`relative lg:flex lg:items-center lg:mb-12 ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                    <div className={`lg:w-1/2 ${index % 2 === 0 ? 'lg:pr-16 lg:text-right' : 'lg:pl-16'}`}>
                      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                        <div className={`text-main font-bold text-lg mb-2 ${index % 2 === 0 ? 'lg:text-right' : ''}`}>{item.year}</div>
                        <h3 className={`text-xl font-bold text-gray-900 mb-2 ${index % 2 === 0 ? 'lg:text-right' : ''}`}>{item.title}</h3>
                        <p className={`text-gray-600 ${index % 2 === 0 ? 'lg:text-right' : ''}`}>{item.description}</p>
                      </div>
                    </div>
                    {/* Center dot */}
                    <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 w-5 h-5 bg-main rounded-full border-4 border-white shadow-lg" />
                    <div className="lg:w-1/2" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 sm:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-main/10 rounded-full px-4 py-1.5 mb-6">
                <Target className="w-4 h-4 text-main" />
                <span className="text-main text-sm font-semibold">Our Values</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
                What Makes Us <span className="text-main">Different</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                From residential dumpster rental San Diego to commercial trash dumpsters, these values guide every delivery and pickup.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => {
                const IconComponent = value.icon
                return (
                  <div
                    key={index}
                    className="group relative bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden"
                  >
                    {/* Gradient overlay on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${value.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${value.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <IconComponent className="w-7 h-7 text-white" />
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12">
              <div className="flex items-center gap-2 text-gray-400">
                <Shield className="w-8 h-8" />
                <span className="font-semibold">Licensed & Insured</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Award className="w-8 h-8" />
                <span className="font-semibold">BBB Accredited</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Leaf className="w-8 h-8" />
                <span className="font-semibold">Eco-Friendly Disposal</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Users className="w-8 h-8" />
                <span className="font-semibold">Family Owned</span>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 sm:py-28 bg-slate-900 relative overflow-hidden">
          {/* Background elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-main/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight">
              Ready for Affordable <span className="text-main">Dumpster Rental</span>?
            </h2>
            <p className="text-lg sm:text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
              Get your free quote for dumpster rental in San Diego. Whether you need residential, construction, or commercial dumpsters — we've got you covered.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/booking">
                <button className="group bg-main hover:bg-main/90 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 shadow-lg shadow-main/25 flex items-center justify-center gap-2">
                  Get Free Quote
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="/services">
                <button className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 border border-white/20">
                  View Our Services
                </button>
              </Link>
            </div>

            {/* Phone number */}
            <div className="mt-10 inline-flex items-center gap-3 text-slate-400">
              <Phone className="w-5 h-5" />
              <span>Or call us directly:</span>
              <a href="tel:7602700312" className="text-white font-semibold hover:text-main transition-colors">
                (760) 270-0312
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
