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
                alt="SD Dumping Solutions Logo"
                width={40}
                height={40}
                className="mr-3"
              />
              <span className="text-xl font-bold">SD Dumping Solutions</span>
            </div>
            <p className="text-gray-400 mb-4">
              Professional Waste Solutions
            </p>
            <p className="text-gray-400 mb-6">
              Professional dumpster rental services for all your waste management needs. Fast, reliable, and affordable solutions.
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
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Rental</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Commercial</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Construction</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Emergency</a></li>
              </ul>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Our Team</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        {/* Contact Info & Features */}
        <div className="grid md:grid-cols-2 gap-8 mt-12 pt-8 border-t border-gray-800">
          <div>
            <h3 className="font-semibold mb-4">Contact Info</h3>
            <div className="space-y-2 text-gray-400">
              <div>Phone: (760) 270-0312</div>
              <div>Email: sandiegodumpingsolutions@gmail.com</div>
              <div>Hours: Mon-Fri: 9AM-6PM</div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Features</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-medium">Same-Day Delivery</div>
                  <div className="text-sm text-gray-400">Quick and reliable service.</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-medium">Licensed & Insured</div>
                  <div className="text-sm text-gray-400">Professional and protected.</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-medium">24/7 Support</div>
                  <div className="text-sm text-gray-400">Always here to help.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm">
            © 2024 SD Dumping Solutions. All rights reserved.
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
