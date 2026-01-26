import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Clock, Check, Phone, ArrowUp } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 sm:gap-10">
          {/* Company Info */}
          <div className="md:col-span-2 animate-fade-in-up">
            <div className="flex items-center mb-4 sm:mb-5">
              <Image
                src="https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto/sddumps/logo"
                alt="SD Dumping Solutions - San Diego Dumpster Rental"
                width={40}
                height={40}
                className="mr-3 w-9 h-9 sm:w-11 sm:h-11"
              />
              <span className="text-lg sm:text-xl font-bold tracking-tight">SD Dumping Solutions</span>
            </div>
            <p className="text-main font-semibold mb-3 text-sm sm:text-base">
              #1 Dumpster Rental San Diego
            </p>
            <p className="text-gray-400 mb-6 text-sm sm:text-base leading-relaxed">
              Affordable dumpster rental San Diego with same day delivery. Roll off dumpster rental, residential dumpster rental San Diego, commercial dumpster rental, and junk removal services. Call (760) 270-0312 for cheap dumpster rental San Diego!
            </p>
            <div className="flex space-x-3">
              <div className="w-9 h-9 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-main transition-all duration-200 cursor-pointer border border-gray-700 hover:border-main">
                <span className="text-xs font-medium">f</span>
              </div>
              <div className="w-9 h-9 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-main transition-all duration-200 cursor-pointer border border-gray-700 hover:border-main">
                <span className="text-xs font-medium">in</span>
              </div>
              <div className="w-9 h-9 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-main transition-all duration-200 cursor-pointer border border-gray-700 hover:border-main">
                <span className="text-xs font-medium">ig</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="grid grid-cols-2 md:grid-cols-1 gap-4 md:gap-0 animate-fade-in-up delay-200">
            <div>
              <h3 className="font-semibold mb-4 sm:mb-5 text-sm sm:text-base text-white">Dumpster Rental Services</h3>
              <ul className="space-y-2.5 sm:space-y-3 text-gray-400 text-sm">
                <li><Link href="/services" className="hover:text-main transition-colors">Residential Dumpster Rental</Link></li>
                <li><Link href="/services" className="hover:text-main transition-colors">Commercial Dumpster Rental</Link></li>
                <li><Link href="/services" className="hover:text-main transition-colors">Construction Dumpster Rental</Link></li>
                <li><Link href="/services" className="hover:text-main transition-colors">Roll Off Dumpster Rental</Link></li>
                <li><Link href="/services" className="hover:text-main transition-colors">Junk Removal Services</Link></li>
              </ul>
            </div>
          </div>

          {/* Company */}
          <div className="animate-fade-in-up delay-400">
            <h3 className="font-semibold mb-4 sm:mb-5 text-sm sm:text-base text-white">Company</h3>
            <ul className="space-y-2.5 sm:space-y-3 text-gray-400 text-sm">
              <li><Link href="/about" className="hover:text-main transition-colors">About Us</Link></li>
              <li><Link href="/service-areas" className="hover:text-main transition-colors">Service Areas</Link></li>
              <li><Link href="/contact" className="hover:text-main transition-colors">Contact</Link></li>
            </ul>
            <h3 className="font-semibold mb-4 sm:mb-5 mt-6 sm:mt-8 text-sm sm:text-base text-white">Top Cities</h3>
            <ul className="space-y-2.5 sm:space-y-3 text-gray-400 text-sm">
              <li><Link href="/service-areas/san-diego" className="hover:text-main transition-colors">San Diego</Link></li>
              <li><Link href="/service-areas/chula-vista" className="hover:text-main transition-colors">Chula Vista</Link></li>
              <li><Link href="/service-areas/oceanside" className="hover:text-main transition-colors">Oceanside</Link></li>
              <li><Link href="/service-areas/escondido" className="hover:text-main transition-colors">Escondido</Link></li>
              <li><Link href="/service-areas/carlsbad" className="hover:text-main transition-colors">Carlsbad</Link></li>
            </ul>
          </div>
        </div>

        {/* Contact Info & Features */}
        <div className="grid md:grid-cols-2 gap-8 sm:gap-10 mt-12 sm:mt-16 pt-8 sm:pt-10 border-t border-gray-800">
          <div>
            <h3 className="font-semibold mb-4 sm:mb-5 text-sm sm:text-base text-white">Contact San Diego Dumpster Rental</h3>
            <div className="space-y-3 text-gray-400 text-sm">
              <div>Phone: <a href="tel:7602700312" className="hover:text-main transition-colors font-medium">(760) 270-0312</a></div>
              <div className="break-all">Email: sandiegodumpingsolutions@gmail.com</div>
              <div>Hours: Mon-Fri: 7AM-6PM, Sat: 8AM-4PM</div>
              <div className="inline-block text-main font-semibold bg-main/10 px-3 py-1.5 rounded-lg mt-2">Same Day Dumpster Rental San Diego Available!</div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-4 sm:mb-5 text-sm sm:text-base text-white">Why Choose Our Dumpster Rental</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-800 rounded-xl flex items-center justify-center flex-shrink-0 border border-gray-700">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-main" />
                </div>
                <div className="min-w-0">
                  <div className="font-medium text-sm sm:text-base">Same Day Dumpster Rental</div>
                  <div className="text-xs sm:text-sm text-gray-500">Order before 2 PM for same day delivery.</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-800 rounded-xl flex items-center justify-center flex-shrink-0 border border-gray-700">
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-main" />
                </div>
                <div className="min-w-0">
                  <div className="font-medium text-sm sm:text-base">Affordable Pricing</div>
                  <div className="text-xs sm:text-sm text-gray-500">Cheap pricing with no hidden fees.</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-800 rounded-xl flex items-center justify-center flex-shrink-0 border border-gray-700">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-main" />
                </div>
                <div className="min-w-0">
                  <div className="font-medium text-sm sm:text-base">24/7 Customer Support</div>
                  <div className="text-xs sm:text-sm text-gray-500">Call (760) 270-0312 anytime.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 sm:mt-16 pt-8 sm:pt-10 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-500 text-xs sm:text-sm text-center md:text-left">
            © 2025 SD Dumping Solutions - Dumpster Rental San Diego. All rights reserved.
          </div>
          <div className="flex space-x-6 sm:space-x-8 mt-4 md:mt-0">
            <a href="#" className="text-gray-500 hover:text-main transition-colors text-xs sm:text-sm">Privacy Policy</a>
            <a href="#" className="text-gray-500 hover:text-main transition-colors text-xs sm:text-sm">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
