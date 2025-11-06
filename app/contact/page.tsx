'use client'

import React, { useState } from 'react'
import { Phone, Mail, MapPin, Clock, MessageSquare } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Head from 'next/head'

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
      <Head>
        <title>Contact SD Dumps | Get Free Quote & Support</title>
        <meta name="description" content="Contact SD Dumps for professional waste management services. Get free quotes, schedule pickups, or get support. Serving San Diego County with 24/7 availability." />
      </Head>
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
        <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50 space-x-[50px]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
              {/* Contact Form */}
              <div className="bg-white shadow-xl rounded-2xl p-8 sm:p-10 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
                <div className="mb-8">
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Send us a Message</h2>
                  <p className="text-gray-600">Fill out the form below and we'll get back to you as soon as possible.</p>
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
                      <option value="Residential Dumpster Rental">Residential Dumpster Rental</option>
                      <option value="Commercial Waste Solutions">Commercial Waste Solutions</option>
                      <option value="Construction & Demolition">Construction & Demolition</option>
                      <option value="Yard Waste & Landscaping">Yard Waste & Landscaping</option>
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
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Contact Information</h2>
                  <p className="text-gray-600">Reach out to us through any of these channels.</p>
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
                      <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-main transition-colors">Phone</h3>
                      <p className="text-xl font-semibold text-gray-900 mb-1">(760) 270-0312</p>
                      <p className="text-sm text-gray-500">Available 24/7 for urgent requests</p>
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
                      <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-main transition-colors">Email</h3>
                      <p className="text-base font-semibold text-gray-900 mb-1 break-all">sandiegodumpingsolutions@gmail.com</p>
                      <p className="text-sm text-gray-500">We'll respond within 24 hours</p>
                    </div>
                  </a>

                  <div className="flex items-start space-x-5 p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
                    <div className="w-14 h-14 bg-gradient-to-br from-main to-main/80 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">Service Area</h3>
                      <p className="text-base font-semibold text-gray-900 mb-1">San Diego County</p>
                      <p className="text-sm text-gray-500">Including surrounding communities</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-5 p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
                    <div className="w-14 h-14 bg-gradient-to-br from-main to-main/80 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Business Hours</h3>
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
                      <p className="text-sm text-main font-semibold mt-3">Emergency service available 24/7</p>
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
    </>
  )
}
