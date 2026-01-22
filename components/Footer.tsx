import React from 'react'
import Image from 'next/image'
import { Clock, Check, Phone, ArrowUp } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <Image
                src="https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto/sddumps/logo"
                alt="SD Dumping Solutions - San Diego Dumpster Rental"
                width={40}
                height={40}
                className="mr-3"
              />
              <span className="text-xl font-bold">SD Dumping Solutions</span>
            </div>
            <p className="text-gray-400 mb-4">
              #1 Dumpster Rental San Diego
            </p>
            <p className="text-gray-400 mb-6">
              Affordable dumpster rental San Diego with same day delivery. Roll off dumpster rental, residential dumpster rental San Diego, commercial dumpster rental, and junk removal services. Call (760) 270-0312 for cheap dumpster rental San Diego!
            </p>
            <div className="flex space-x-4">
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-xs">f</span>
              </div>
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-xs">in</span>
              </div>
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-xs">ig</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="grid grid-cols-2 md:grid-cols-1 gap-6 md:gap-0">
            <div>
              <h3 className="font-semibold mb-4">Dumpster Rental Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/services" className="hover:text-white transition-colors">Residential Dumpster Rental</a></li>
                <li><a href="/services" className="hover:text-white transition-colors">Commercial Dumpster Rental</a></li>
                <li><a href="/services" className="hover:text-white transition-colors">Construction Dumpster Rental</a></li>
                <li><a href="/services" className="hover:text-white transition-colors">Roll Off Dumpster Rental</a></li>
                <li><a href="/services" className="hover:text-white transition-colors">Junk Removal Services</a></li>
              </ul>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/about" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="/service-areas" className="hover:text-white transition-colors">Service Areas</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
            <h3 className="font-semibold mb-4 mt-6">Top Cities</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/service-areas/san-diego" className="hover:text-white transition-colors">San Diego</a></li>
              <li><a href="/service-areas/chula-vista" className="hover:text-white transition-colors">Chula Vista</a></li>
              <li><a href="/service-areas/oceanside" className="hover:text-white transition-colors">Oceanside</a></li>
              <li><a href="/service-areas/escondido" className="hover:text-white transition-colors">Escondido</a></li>
              <li><a href="/service-areas/carlsbad" className="hover:text-white transition-colors">Carlsbad</a></li>
            </ul>
          </div>
        </div>

        {/* Contact Info & Features */}
        <div className="grid md:grid-cols-2 gap-8 mt-12 pt-8 border-t border-gray-800">
          <div>
            <h3 className="font-semibold mb-4">Contact San Diego Dumpster Rental</h3>
            <div className="space-y-2 text-gray-400">
              <div>Phone: <a href="tel:7602700312" className="hover:text-white">(760) 270-0312</a></div>
              <div>Email: sandiegodumpingsolutions@gmail.com</div>
              <div>Hours: Mon-Fri: 7AM-6PM, Sat: 8AM-4PM</div>
              <div className="text-main font-semibold">Same Day Dumpster Rental San Diego Available!</div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Why Choose Our Dumpster Rental</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-medium">Same Day Dumpster Rental San Diego</div>
                  <div className="text-sm text-gray-400">Order before 2 PM for same day delivery.</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-medium">Affordable Dumpster Rental San Diego</div>
                  <div className="text-sm text-gray-400">Cheap pricing with no hidden fees.</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-medium">24/7 Customer Support</div>
                  <div className="text-sm text-gray-400">Call (760) 270-0312 anytime.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm">
            © 2025 SD Dumping Solutions - Dumpster Rental San Diego. All rights reserved.
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</a>
          </div>
        </div>
      </div>


    </footer>
  )
}
