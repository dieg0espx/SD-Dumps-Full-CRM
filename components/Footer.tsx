import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Clock, Check, Phone, ArrowUp } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8">
          {/* Company Info */}
          <div className="md:col-span-2 animate-fade-in-up">
            <div className="flex items-center mb-3 sm:mb-4">
              <Image
                src="https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto/sddumps/logo"
                alt="SD Dumping Solutions - San Diego Dumpster Rental"
                width={40}
                height={40}
                className="mr-2 sm:mr-3 w-8 h-8 sm:w-10 sm:h-10"
              />
              <span className="text-lg sm:text-xl font-bold">SD Dumping Solutions</span>
            </div>
            <p className="text-gray-400 mb-3 sm:mb-4 text-sm sm:text-base">
              #1 Dumpster Rental San Diego
            </p>
            <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">
              Affordable dumpster rental San Diego with same day delivery. Roll off dumpster rental, residential dumpster rental San Diego, commercial dumpster rental, and junk removal services. Call (760) 270-0312 for cheap dumpster rental San Diego!
            </p>
            <div className="flex space-x-4">
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-main hover:scale-110 transition-all duration-300 cursor-pointer">
                <span className="text-xs">f</span>
              </div>
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-main hover:scale-110 transition-all duration-300 cursor-pointer">
                <span className="text-xs">in</span>
              </div>
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-main hover:scale-110 transition-all duration-300 cursor-pointer">
                <span className="text-xs">ig</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="grid grid-cols-2 md:grid-cols-1 gap-4 md:gap-0 animate-fade-in-up delay-200">
            <div>
              <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Dumpster Rental Services</h3>
              <ul className="space-y-1.5 sm:space-y-2 text-gray-400 text-sm">
                <li><Link href="/services" className="hover:text-white transition-colors">Residential Dumpster Rental</Link></li>
                <li><Link href="/services" className="hover:text-white transition-colors">Commercial Dumpster Rental</Link></li>
                <li><Link href="/services" className="hover:text-white transition-colors">Construction Dumpster Rental</Link></li>
                <li><Link href="/services" className="hover:text-white transition-colors">Roll Off Dumpster Rental</Link></li>
                <li><Link href="/services" className="hover:text-white transition-colors">Junk Removal Services</Link></li>
              </ul>
            </div>
          </div>

          {/* Company */}
          <div className="animate-fade-in-up delay-400">
            <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Company</h3>
            <ul className="space-y-1.5 sm:space-y-2 text-gray-400 text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/service-areas" className="hover:text-white transition-colors">Service Areas</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
            <h3 className="font-semibold mb-3 sm:mb-4 mt-4 sm:mt-6 text-sm sm:text-base">Top Cities</h3>
            <ul className="space-y-1.5 sm:space-y-2 text-gray-400 text-sm">
              <li><Link href="/service-areas/san-diego" className="hover:text-white transition-colors">San Diego</Link></li>
              <li><Link href="/service-areas/chula-vista" className="hover:text-white transition-colors">Chula Vista</Link></li>
              <li><Link href="/service-areas/oceanside" className="hover:text-white transition-colors">Oceanside</Link></li>
              <li><Link href="/service-areas/escondido" className="hover:text-white transition-colors">Escondido</Link></li>
              <li><Link href="/service-areas/carlsbad" className="hover:text-white transition-colors">Carlsbad</Link></li>
            </ul>
          </div>
        </div>

        {/* Contact Info & Features */}
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-800">
          <div>
            <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Contact San Diego Dumpster Rental</h3>
            <div className="space-y-1.5 sm:space-y-2 text-gray-400 text-sm">
              <div>Phone: <a href="tel:7602700312" className="hover:text-white">(760) 270-0312</a></div>
              <div className="break-all">Email: sandiegodumpingsolutions@gmail.com</div>
              <div>Hours: Mon-Fri: 7AM-6PM, Sat: 8AM-4PM</div>
              <div className="text-main font-semibold">Same Day Dumpster Rental San Diego Available!</div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Why Choose Our Dumpster Rental</h3>
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-700 rounded flex items-center justify-center flex-shrink-0">
                  <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div className="min-w-0">
                  <div className="font-medium text-sm sm:text-base">Same Day Dumpster Rental</div>
                  <div className="text-xs sm:text-sm text-gray-400">Order before 2 PM for same day delivery.</div>
                </div>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-700 rounded flex items-center justify-center flex-shrink-0">
                  <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div className="min-w-0">
                  <div className="font-medium text-sm sm:text-base">Affordable Pricing</div>
                  <div className="text-xs sm:text-sm text-gray-400">Cheap pricing with no hidden fees.</div>
                </div>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-700 rounded flex items-center justify-center flex-shrink-0">
                  <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div className="min-w-0">
                  <div className="font-medium text-sm sm:text-base">24/7 Customer Support</div>
                  <div className="text-xs sm:text-sm text-gray-400">Call (760) 270-0312 anytime.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-xs sm:text-sm text-center md:text-left">
            © 2025 SD Dumping Solutions - Dumpster Rental San Diego. All rights reserved.
          </div>
          <div className="flex space-x-4 sm:space-x-6 mt-3 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">Terms of Service</a>
          </div>
        </div>
      </div>


    </footer>
  )
}
