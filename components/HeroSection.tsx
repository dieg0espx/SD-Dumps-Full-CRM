import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Professional Dumpster<br />
            <span className="text-main"> Rental Service</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Fast, reliable, and affordable dumpster rentals for your home renovation, construction project, or cleanup needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/booking">
              <button className="bg-black text-white px-8 py-3 rounded-lg hover:bg-black/80 transition-colors flex items-center justify-center">
                Get Started
                <ChevronRight className="w-4 h-4 ml-2" />
              </button>
            </Link>
            <Link href="/contact">
              <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                Contact
              </button>
            </Link>
          </div>
          <div className="flex justify-center">
            <Image
              src="/dumpster.png"
              alt="Professional dumpster"
              width={900}
              height={400}
              className="rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
