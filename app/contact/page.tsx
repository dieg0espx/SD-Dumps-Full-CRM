'use client'

import React, { useState } from 'react'
import { Phone, Mail, MapPin, Clock, MessageSquare } from 'lucide-react'

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: '' })

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: data.message || 'Your message has been sent successfully! We\'ll get back to you soon.'
        })
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          service: '',
          message: ''
        })
      } else {
        setSubmitStatus({
          type: 'error',
          message: data.error || 'Failed to send message. Please try again.'
        })
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'An error occurred. Please try again later.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <>
      <div className="min-h-screen bg-white">
      
      <div>
        {/* Hero Section */}
        <section className="relative pt-28 sm:pt-32 lg:pt-36 pb-16 sm:pb-20 lg:pb-24 -mt-[88px]">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto/v1769107609/IMG_2592_ni693c.heic')"
            }}
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/70" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
                Get Your San Diego Dumpster Rental Quote
              </h1>
              <p className="text-lg sm:text-xl text-gray-200 max-w-3xl mx-auto">
                Ready for affordable dumpster rental San Diego? Get a free quote for roll off dumpster rental, residential dumpster rental San Diego, or commercial dumpster rental. Same day dumpster rental San Diego available — call (760) 270-0312!
              </p>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
              {/* Contact Form */}
              <div className="bg-white shadow-xl rounded-2xl p-8 sm:p-10 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
                <div className="mb-8">
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Request Your Free Dumpster Rental Quote</h2>
                  <p className="text-gray-600">Tell us about your project and get a free quote for dumpster rental San Diego. Same day response guaranteed!</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {submitStatus.type && (
                    <div className={`p-4 rounded-xl ${submitStatus.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
                      <p className="text-sm font-medium">{submitStatus.message}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting}
                        className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-main/50 focus:border-main transition-all duration-200 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting}
                        className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-main/50 focus:border-main transition-all duration-200 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                      className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-main/50 focus:border-main transition-all duration-200 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-main/50 focus:border-main transition-all duration-200 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="(760) 270-0312"
                    />
                  </div>

                  <div>
                    <label htmlFor="service" className="block text-sm font-semibold text-gray-700 mb-2">
                      Service Type
                    </label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-main/50 focus:border-main transition-all duration-200 hover:border-gray-400 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">Select a service</option>
                      <option value="Residential Dumpster Rental San Diego">Residential Dumpster Rental San Diego</option>
                      <option value="Commercial Dumpster Rental">Commercial Dumpster Rental</option>
                      <option value="Construction Dumpster Rental San Diego">Construction Dumpster Rental San Diego</option>
                      <option value="Roll Off Dumpster Rental">Roll Off Dumpster Rental</option>
                      <option value="Junk Removal Services San Diego">Junk Removal Services San Diego</option>
                      <option value="Same Day Dumpster Rental">Same Day Dumpster Rental</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      required
                      disabled={isSubmitting}
                      className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-main/50 focus:border-main transition-all duration-200 hover:border-gray-400 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Tell us about your project or ask any questions..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-main text-white py-4 px-6 rounded-xl hover:bg-main/90 active:scale-[0.98] transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-main disabled:active:scale-100"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>

              {/* Contact Details */}
              <div className="lg:sticky lg:top-24">
                <div className="mb-8">
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">San Diego Dumpster Rental Contact</h2>
                  <p className="text-gray-600">Get your dumpster rental San Diego quote today. Same day service available!</p>
                </div>

                <div className="space-y-5">
                  <a
                    href="tel:7602700312"
                    className="group flex items-start space-x-5 p-6 bg-white rounded-2xl border border-gray-200 hover:border-main hover:shadow-lg transition-all duration-300"
                  >
                    <div className="w-14 h-14 bg-gradient-to-br from-main to-main/80 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-main transition-colors">Call for Same Day Dumpster Rental</h3>
                      <p className="text-xl font-semibold text-gray-900 mb-1">(760) 270-0312</p>
                      <p className="text-sm text-gray-500">Same day dumpster rental San Diego available!</p>
                    </div>
                  </a>

                  <a
                    href="mailto:sandiegodumpingsolutions@gmail.com"
                    className="group flex items-start space-x-5 p-6 bg-white rounded-2xl border border-gray-200 hover:border-main hover:shadow-lg transition-all duration-300"
                  >
                    <div className="w-14 h-14 bg-gradient-to-br from-main to-main/80 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-main transition-colors">Email for Quote</h3>
                      <p className="text-base font-semibold text-gray-900 mb-1 break-all">sandiegodumpingsolutions@gmail.com</p>
                      <p className="text-sm text-gray-500">Free quotes within 24 hours</p>
                    </div>
                  </a>

                  <div className="flex items-start space-x-5 p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
                    <div className="w-14 h-14 bg-gradient-to-br from-main to-main/80 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">Dumpster Rental in San Diego</h3>
                      <p className="text-base font-semibold text-gray-900 mb-1">All of San Diego County</p>
                      <p className="text-sm text-gray-500">La Jolla, Chula Vista, El Cajon, Oceanside & more</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-5 p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
                    <div className="w-14 h-14 bg-gradient-to-br from-main to-main/80 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Dumpster Delivery Hours</h3>
                      <div className="space-y-1 text-gray-700">
                        <p className="flex justify-between">
                          <span className="font-medium">Monday - Friday:</span>
                          <span>7:00 AM - 6:00 PM</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="font-medium">Saturday:</span>
                          <span>8:00 AM - 4:00 PM</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="font-medium">Sunday:</span>
                          <span>Closed</span>
                        </p>
                      </div>
                      <p className="text-sm text-main font-semibold mt-3">Same day dumpster rental available before 2 PM!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">San Diego Dumpster Rental FAQ</h2>
              <p className="text-lg text-gray-600">
                Common questions about dumpster rental San Diego pricing, delivery, and services
              </p>
            </div>

            <div className="space-y-6">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Do you offer same day dumpster rental San Diego?
                </h3>
                <p className="text-gray-600">
                  Yes! We offer same day dumpster rental San Diego for orders placed before 2 PM. Call (760) 270-0312 for same day delivery anywhere in San Diego County.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  What is the cost of dumpster rental in San Diego?
                </h3>
                <p className="text-gray-600">
                  Our affordable dumpster rental San Diego starts at $595 for a 17-yard roll off dumpster (includes 3 days and 2 tons). We offer cheap dumpster rental San Diego with transparent pricing — no hidden fees!
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  What sizes do you have for small dumpster rental near me?
                </h3>
                <p className="text-gray-600">
                  Looking for a small dumpster rental near me or 10 yard dumpster rental? We offer multiple sizes from small residential dumpsters to large roll off dumpster rental San Diego for construction projects.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Do you provide commercial dumpster rental and junk removal services?
                </h3>
                <p className="text-gray-600">
                  Yes! We offer commercial dumpster rental, commercial trash dumpsters, and full junk removal services San Diego. Whether you need garbage dumpster rental for your business or dump trailer rental for heavy materials, we've got you covered.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      </div>
    </>
  )
}
