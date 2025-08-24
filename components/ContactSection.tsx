import React from 'react'
import { MapPin, Phone, Mail } from 'lucide-react'

export default function ContactSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-6">
          Get In Touch
        </h2>
        <p className="text-lg text-gray-600 mb-12">
          Ready to get started? Contact us for a free quote or to schedule your dumpster rental today.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="flex flex-col items-center">
            <MapPin className="w-8 h-8 text-main mb-4" />
            <div className="text-gray-600">123 Main Street, City, State 12345</div>
          </div>
          <div className="flex flex-col items-center">
            <Phone className="w-8 h-8 text-main mb-4" />
            <div className="text-gray-600">(760) 270-0312</div>
          </div>
          <div className="flex flex-col items-center">
            <Mail className="w-8 h-8 text-main mb-4" />
            <div className="text-gray-600">sandiegodumpingsolutions@gmail.com</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-main text-white px-8 py-3 rounded-lg hover:bg-main/90 transition-colors">
            Get Quote Now
          </button>
          <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors">
            Call Us Today
          </button>
        </div>
      </div>
    </section>
  )
}
