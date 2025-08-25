import React from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Shield, Users, Award, Truck, Check } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'About SD Dumps | Professional Waste Management Company',
  description: 'Learn about SD Dumps, a trusted waste management company with over 10 years of experience providing professional dumpster rental and waste disposal services in San Diego.',
  keywords: [
    'about SD Dumps',
    'waste management company',
    'dumpster rental company',
    'San Diego waste services',
    'professional waste disposal',
    'licensed waste management',
    'environmental responsibility',
    'waste management experience'
  ],
      openGraph: {
      title: 'About SD Dumps | Professional Waste Management Company',
      description: 'Learn about SD Dumps, a trusted waste management company with over 10 years of experience providing professional dumpster rental and waste disposal services in San Diego.',
      url: 'https://sddumps.com/about',
      siteName: 'SD Dumps',
      images: [
        {
          url: '/miniature.png',
          width: 1200,
          height: 630,
          alt: 'SD Dumps Professional Waste Management',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
      twitter: {
      card: 'summary_large_image',
      title: 'About SD Dumps | Professional Waste Management Company',
      description: 'Learn about SD Dumps, a trusted waste management company with over 10 years of experience in San Diego.',
      images: ['/miniature.png'],
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
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="bg-white">
        {/* About Us Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-8 lg:gap-10 items-center">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
                  About Our<br />
                  <span className="text-main">Waste Management Company</span>
                </h1>
                <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
                  For over a decade, we've been providing professional dumpster rental and waste management services to contractors, homeowners, and businesses across the region.
                </p>
                
                <div className="grid grid-cols-2 gap-4 sm:gap-6 ml-0 mr-auto w-fit">
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-400 mb-1 sm:mb-2">10+</div>
                    <div className="text-sm sm:text-base text-gray-600">Years Experience</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-400 mb-1 sm:mb-2">99%</div>
                    <div className="text-sm sm:text-base text-gray-600">Customer Satisfaction</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-400 mb-1 sm:mb-2">5000+</div>
                    <div className="text-sm sm:text-base text-gray-600">Projects Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-400 mb-1 sm:mb-2">24/7</div>
                    <div className="text-sm sm:text-base text-gray-600">Support Available</div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center order-first lg:order-last">
                <Image
                  src="/dumpster.png"
                  alt="Professional dumpster"
                  width={500}
                  height={400}
                  className="rounded-lg w-full max-w-md lg:max-w-none"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="flex justify-center order-first lg:order-last">
                <Image
                  src="/dumpster.png"
                  alt="Professional dumpster"
                  width={500}
                  height={400}
                  className="rounded-lg w-full max-w-md lg:max-w-none"
                />
              </div>
              
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">Our Story</h2>
                <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6">
                  Founded with the mission to provide reliable, professional waste management solutions, our company has grown from a small local operation to a trusted partner for projects of all sizes.
                </p>
                <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
                  We understand that every project is unique, which is why we offer flexible rental periods, various container sizes, and personalized service to meet your specific needs.
                </p>
                
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start sm:items-center">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-main rounded-full flex items-center justify-center mr-3 mt-0.5 sm:mt-0 flex-shrink-0">
                      <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                    <span className="text-sm sm:text-base text-gray-700">Licensed and insured professionals</span>
                  </div>
                  <div className="flex items-start sm:items-center">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-main rounded-full flex items-center justify-center mr-3 mt-0.5 sm:mt-0 flex-shrink-0">
                      <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                    <span className="text-sm sm:text-base text-gray-700">Extensive training in waste management</span>
                  </div>
                  <div className="flex items-start sm:items-center">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-main rounded-full flex items-center justify-center mr-3 mt-0.5 sm:mt-0 flex-shrink-0">
                      <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                    <span className="text-sm sm:text-base text-gray-700">Commitment to environmental responsibility</span>
                  </div>
                  <div className="flex items-start sm:items-center">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-main rounded-full flex items-center justify-center mr-3 mt-0.5 sm:mt-0 flex-shrink-0">
                      <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                    <span className="text-sm sm:text-base text-gray-700">Local expertise and community focus</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Core Values Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
                These principles guide everything we do and ensure we deliver the best possible service to our customers.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-main/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-main" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Reliability</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  We deliver on time, every time. Our commitment to reliability means you can count on us for consistent, dependable service.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-main/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Users className="w-6 h-6 sm:w-8 sm:h-8 text-main" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Customer First</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Your satisfaction is our priority. We work closely with each client to understand their unique needs and exceed expectations.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-main/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Award className="w-6 h-6 sm:w-8 sm:h-8 text-main" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Quality Service</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Professional grade equipment and experienced team members ensure the highest quality waste management solutions.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-main/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Truck className="w-6 h-6 sm:w-8 sm:h-8 text-main" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Efficiency</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Streamlined processes and modern equipment allow us to provide fast, efficient service without compromising quality.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">Ready to Work With Us?</h2>
            <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8">
              Experience the difference that professional, reliable service makes. Contact us today for your next project.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link href="/booking" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto bg-main text-white px-6 sm:px-8 py-3 rounded-lg hover:bg-main/80 transition-colors">
                  Get Free Quote
                </button>
              </Link>
              <Link href="/services" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto border border-gray-300 text-gray-700 px-6 sm:px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                  View Services
                </button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
