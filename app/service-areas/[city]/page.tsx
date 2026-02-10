import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { MapPin, Phone, CheckCircle, ArrowRight, Truck, Clock, Shield, Star, Briefcase, Home as HomeIcon, HardHat } from 'lucide-react'
import { cities, getCityBySlug, getAllCitySlugs, getProjectsByCity } from '@/lib/cities'
import { ServiceAreaSchema, BreadcrumbSchema } from '@/components/JsonLd'

interface CityPageProps {
  params: Promise<{ city: string }>
}

export async function generateStaticParams() {
  return getAllCitySlugs().map((city) => ({
    city,
  }))
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const { city: citySlug } = await params
  const city = getCityBySlug(citySlug)

  if (!city) {
    return {
      title: 'City Not Found | SD Dumping Solutions',
    }
  }

  return {
    title: `Dumpster Rental in ${city.name}, CA | SD Dumping Solutions`,
    description: `Professional dumpster rental services in ${city.name}, California. Same-day delivery, competitive pricing, and reliable service for residential and commercial projects. Call (760) 270-0312.`,
    keywords: [
      `dumpster rental ${city.name}`,
      `${city.name} dumpster service`,
      `roll-off container ${city.name}`,
      `waste removal ${city.name} CA`,
      `construction dumpster ${city.name}`,
      `junk removal ${city.name}`,
    ],
    openGraph: {
      title: `Dumpster Rental in ${city.name}, CA | SD Dumping Solutions`,
      description: `Professional dumpster rental services in ${city.name}, California. Same-day delivery and competitive pricing.`,
      url: `https://www.sddumpingsolutions.com/service-areas/${city.slug}`,
      siteName: 'SD Dumping Solutions',
      images: [
        {
          url: 'https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto/sddumps/miniature.png',
          width: 1200,
          height: 630,
          alt: `SD Dumping Solutions - ${city.name} Dumpster Rental`,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    alternates: {
      canonical: `/service-areas/${city.slug}`,
    },
  }
}

export default async function CityPage({ params }: CityPageProps) {
  const { city: citySlug } = await params
  const city = getCityBySlug(citySlug)

  if (!city) {
    notFound()
  }

  const otherCities = cities.filter(c => c.slug !== city.slug).slice(0, 6)
  const projects = getProjectsByCity(city.slug)

  const getProjectIcon = (type: string) => {
    switch (type) {
      case 'Residential':
        return HomeIcon
      case 'Commercial':
        return Briefcase
      case 'Construction':
        return HardHat
      default:
        return CheckCircle
    }
  }

  const breadcrumbs = [
    { name: 'Home', url: 'https://www.sddumpingsolutions.com' },
    { name: 'Service Areas', url: 'https://www.sddumpingsolutions.com/service-areas' },
    { name: city.name, url: `https://www.sddumpingsolutions.com/service-areas/${city.slug}` }
  ]

  return (
    <>
      <ServiceAreaSchema
        cityName={city.name}
        citySlug={city.slug}
        description={city.description}
        zipCodes={city.zipCodes}
      />
      <BreadcrumbSchema items={breadcrumbs} />
      <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pt-24 pb-16">
        <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto/sddumps/hero-bg')] opacity-10 bg-cover bg-center" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-main mb-4">
            <MapPin className="w-5 h-5" />
            <span className="text-sm font-medium uppercase tracking-wide">Service Area</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Dumpster Rental in<br />
            <span className="text-main">{city.name}, CA</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mb-8">
            {city.description}
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

      {/* Features Bar */}
      <section className="bg-main text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center gap-2">
              <Truck className="w-6 h-6" />
              <span className="text-sm font-medium">Same-Day Delivery</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Clock className="w-6 h-6" />
              <span className="text-sm font-medium">Flexible Rentals</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Shield className="w-6 h-6" />
              <span className="text-sm font-medium">Licensed & Insured</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Star className="w-6 h-6" />
              <span className="text-sm font-medium">5-Star Service</span>
            </div>
          </div>
        </div>
      </section>

      {/* City Highlights */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Why Choose SD Dumping Solutions in {city.name}?
              </h2>
              <ul className="space-y-4">
                {city.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-main flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-lg">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <Image
                src="https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto/v1769107601/IMG_0151_fbcaue.heic"
                alt={`Dumpster delivery in ${city.name}`}
                width={600}
                height={400}
                className="rounded-xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Neighborhoods */}
      {city.neighborhoods && city.neighborhoods.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Neighborhoods We Serve in {city.name}
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {city.neighborhoods.map((neighborhood, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-main hover:text-white transition-colors"
                >
                  {neighborhood}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Projects Section */}
      {projects.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Recent Projects in {city.name}
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                See how we've helped homeowners and businesses in {city.name} with their dumpster rental needs.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => {
                const Icon = getProjectIcon(project.type)
                return (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-main/10 rounded-lg flex items-center justify-center">
                          <Icon className="w-6 h-6 text-main" />
                        </div>
                        <div>
                          <span className="inline-block px-2 py-1 bg-main/10 text-main text-xs font-semibold rounded">
                            {project.type}
                          </span>
                        </div>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {project.title}
                    </h3>
                    {project.neighborhood && (
                      <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{project.neighborhood}</span>
                      </div>
                    )}
                    <p className="text-gray-600 text-sm mb-4">
                      {project.description}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Truck className="w-3.5 h-3.5" />
                        <span>{project.containerSize}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{project.duration}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="text-center mt-8">
              <Link href="/contact">
                <button className="inline-flex items-center gap-2 bg-main text-white px-6 py-3 rounded-lg hover:bg-main/90 transition-colors font-semibold">
                  <span>Start Your Project</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Services Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Our Dumpster Rental Services in {city.name}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">Residential</h3>
              <p className="text-gray-400 mb-4">
                Perfect for home cleanouts, garage cleaning, renovation debris, and yard waste removal.
              </p>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-main" />
                  Home renovations
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-main" />
                  Estate cleanouts
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-main" />
                  Garage & attic cleaning
                </li>
              </ul>
            </div>
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">Commercial</h3>
              <p className="text-gray-400 mb-4">
                Reliable waste solutions for businesses, retail stores, and commercial properties.
              </p>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-main" />
                  Office cleanouts
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-main" />
                  Retail renovations
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-main" />
                  Property management
                </li>
              </ul>
            </div>
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">Construction</h3>
              <p className="text-gray-400 mb-4">
                Heavy-duty containers for construction sites, demolition projects, and contractors.
              </p>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-main" />
                  New construction
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-main" />
                  Demolition debris
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-main" />
                  Roofing projects
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
            Dumpster Rental Pricing in {city.name}
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Transparent pricing with no hidden fees. All rentals include delivery, pickup, and disposal.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-bold text-gray-900 mb-2">17 Yard Container</h3>
              <div className="text-3xl font-bold text-main mb-4">$595</div>
              <p className="text-gray-600 text-sm mb-4">Includes 2 tons & 3 days</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Great for small cleanouts</li>
                <li>Perfect for garage cleanup</li>
                <li>Ideal for small renovations</li>
              </ul>
            </div>
            <div className="bg-main text-white rounded-xl p-6 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full">
                MOST POPULAR
              </div>
              <h3 className="text-lg font-bold mb-2">21 Yard Container</h3>
              <div className="text-3xl font-bold mb-4">$695</div>
              <p className="text-white/80 text-sm mb-4">Includes 2 tons & 3 days</p>
              <ul className="space-y-2 text-sm text-white/90">
                <li>Best value for most projects</li>
                <li>Home renovations</li>
                <li>Construction debris</li>
              </ul>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Concrete & Dirt</h3>
              <div className="text-3xl font-bold text-main mb-4">Custom</div>
              <p className="text-gray-600 text-sm mb-4">Call for pricing</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Heavy material disposal</li>
                <li>Concrete & asphalt</li>
                <li>Dirt & soil removal</li>
              </ul>
            </div>
          </div>
          <div className="text-center mt-8">
            <Link href="/guest-booking">
              <button className="bg-main text-white px-8 py-4 rounded-lg hover:bg-main/90 transition-colors font-semibold text-lg">
                Get Started Today
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ZIP Codes */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            ZIP Codes We Serve in {city.name}
          </h3>
          <div className="flex flex-wrap gap-2">
            {city.zipCodes.map((zip, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-white border border-gray-200 text-gray-600 rounded text-sm"
              >
                {zip}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Other Cities */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Other San Diego Areas We Serve
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {otherCities.map((otherCity) => (
              <Link
                key={otherCity.slug}
                href={`/service-areas/${otherCity.slug}`}
                className="p-4 bg-gray-50 rounded-lg hover:bg-main hover:text-white transition-colors text-center"
              >
                <span className="font-medium">{otherCity.name}</span>
              </Link>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link href="/service-areas" className="text-main hover:underline font-medium">
              View All Service Areas →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-main text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Rent a Dumpster in {city.name}?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Get same-day delivery and reliable service for your next project.
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
    </>
  )
}
