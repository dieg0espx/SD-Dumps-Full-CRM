import React from 'react'
import { Phone, Mail, MapPin, Clock, MessageSquare } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function Contact() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="pt-16">
        {/* Hero Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
                Get in Touch
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                Have questions about our waste management services? We're here to help. Contact us for quotes, support, or any inquiries.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
              {/* Contact Details */}
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">Contact Information</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-main/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-main" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">Phone</h3>
                      <p className="text-gray-600">(123) 456-7890</p>
                      <p className="text-sm text-gray-500">Available 24/7 for urgent requests</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-main/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-main" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">Email</h3>
                      <p className="text-gray-600">info@sddumps.com</p>
                      <p className="text-sm text-gray-500">We'll respond within 24 hours</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-main/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-main" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">Service Area</h3>
                      <p className="text-gray-600">San Diego County</p>
                      <p className="text-sm text-gray-500">Including surrounding communities</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-main/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-main" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">Business Hours</h3>
                      <div className="text-gray-600">
                        <p>Monday - Friday: 7:00 AM - 6:00 PM</p>
                        <p>Saturday: 8:00 AM - 4:00 PM</p>
                        <p>Sunday: Closed</p>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Emergency service available 24/7</p>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button className="w-full bg-main text-white py-3 px-6 rounded-lg hover:bg-main/90 transition-colors">
                      Get Free Quote
                    </button>
                    <button className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors">
                      Schedule Pickup
                    </button>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-white border border-gray-200 rounded-lg p-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Send us a Message</h2>
                
                <form className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                      placeholder="(123) 456-7890"
                    />
                  </div>

                  <div>
                    <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
                      Service Type
                    </label>
                    <select
                      id="service"
                      name="service"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                    >
                      <option value="">Select a service</option>
                      <option value="residential">Residential Dumpster Rental</option>
                      <option value="commercial">Commercial Waste Solutions</option>
                      <option value="construction">Construction & Demolition</option>
                      <option value="landscaping">Yard Waste & Landscaping</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                      placeholder="Tell us about your project or ask any questions..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-main text-white py-3 px-6 rounded-lg hover:bg-main/90 transition-colors font-medium"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-gray-600">
                Find quick answers to common questions about our services
              </p>
            </div>

            <div className="space-y-6">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  How quickly can you deliver a dumpster?
                </h3>
                <p className="text-gray-600">
                  We offer same-day delivery for most areas. Contact us early in the day for the best availability.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  What size dumpster do I need for my project?
                </h3>
                <p className="text-gray-600">
                  Our team can help you choose the right size based on your project type and scope. We offer containers from 10 to 40 yards.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Do you handle permits for street placement?
                </h3>
                <p className="text-gray-600">
                  Yes, we can assist with permit applications for placing dumpsters on public property or streets.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  What materials can I put in the dumpster?
                </h3>
                <p className="text-gray-600">
                  We accept most construction debris, household items, and general waste. Hazardous materials and certain items may have restrictions.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
      
    </div>
  )
}
