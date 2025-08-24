import React from 'react'
import Image from 'next/image'
import { Clock } from 'lucide-react'

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Why Choose Our{' '}
              <span className="text-main">Dumpster Rental Service</span>
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              We provide professional waste management solutions with transparent pricing, reliable service, and expert support for projects of any size.
            </p>
            <button className="bg-main text-white px-6 py-3 rounded-lg hover:bg-main/90 transition-colors mb-8">
              Learn More
            </button>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Clock className="w-6 h-6 text-main mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Fast & Reliable</h3>
                  <p className="text-gray-600">Same-day delivery and pickup available for urgent projects.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-main rounded-full flex items-center justify-center mt-1">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Professional Service</h3>
                  <p className="text-gray-600">Experienced team with modern equipment and competitive pricing.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <Image
              src="/dumpster.png"
              alt="Professional dumpster service"
              width={500}
              height={400}
              className="rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
