'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Check, Truck, Clock, Shield, Award, Phone, Home, Building,
  Wrench, Leaf, Star, ArrowRight, ChevronDown, Sparkles, MessageSquare,
  Package, Ruler, CheckCircle, HelpCircle
} from 'lucide-react'
import { ServiceSchema, BreadcrumbSchema } from '@/components/JsonLd'
import SectionDivider from '@/components/SectionDivider'

export default function Services() {
  const breadcrumbs = [
    { name: 'Home', url: 'https://sddumps.com' },
    { name: 'Services', url: 'https://sddumps.com/services' }
  ]

  const dumpsterSizes = [
    {
      size: '17',
      name: '17 Yard Dumpster',
      dimensions: '16\' x 7.5\' x 4.5\'',
      ideal: 'Home cleanouts, garage clearing, small renovations',
      holds: '~5 pickup truck loads',
      price: '$595',
      popular: false
    },
    {
      size: '21',
      name: '21 Yard Dumpster',
      dimensions: '20\' x 7.5\' x 4.5\'',
      ideal: 'Construction, remodels, roofing, commercial',
      holds: '~7 pickup truck loads',
      price: '$695',
      popular: true
    }
  ]

  const services = [
    {
      icon: Home,
      title: "Residential Dumpster Rental",
      description: "Perfect for homeowners tackling cleanouts, renovations, moving, or yard projects. Our residential dumpsters fit in your driveway and handle everything from old furniture to construction debris.",
      features: ["Driveway-friendly sizes", "Same day delivery available", "3-day rental included", "Flexible pickup scheduling"],
      image: "https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto/v1769107606/IMG_0211_huq8x0.heic"
    },
    {
      icon: Building,
      title: "Commercial Dumpster Rental",
      description: "Keep your business running smoothly with reliable commercial waste solutions. We serve restaurants, retail stores, offices, and industrial facilities throughout San Diego.",
      features: ["Scheduled regular pickups", "Multiple container sizes", "Volume discounts available", "24/7 service support"],
      image: "https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto/v1769107609/IMG_0405_fxcujh.heic"
    },
    {
      icon: Wrench,
      title: "Construction Dumpster Rental",
      description: "Heavy-duty roll-off containers built for job sites. Handle demolition debris, roofing materials, drywall, and more. Trusted by San Diego contractors.",
      features: ["Heavy debris approved", "Job site delivery", "Extended rental options", "Weight-based pricing available"],
      image: "https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto/v1769107608/IMG_0265_dkokq7.heic"
    },
    {
      icon: Leaf,
      title: "Junk Removal Services",
      description: "Don't want to lift a finger? Our full-service junk removal team loads and hauls everything for you. Furniture, appliances, yard waste — we handle it all.",
      features: ["We do all the loading", "Same day service", "Eco-friendly disposal", "Upfront pricing"],
      image: "https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto/v1769107606/IMG_0211_huq8x0.heic"
    }
  ]

  const processSteps = [
    {
      number: "01",
      title: "Get Your Free Quote",
      description: "Call us or book online. Tell us about your project and we'll recommend the perfect dumpster size for your needs."
    },
    {
      number: "02",
      title: "Schedule Delivery",
      description: "Pick a delivery date that works for you. Need it today? Same day delivery available for orders placed before 2 PM."
    },
    {
      number: "03",
      title: "Fill It Up",
      description: "Take your time — standard rental includes 3 full days. Need more time? Flexible daily extensions available."
    },
    {
      number: "04",
      title: "We Haul It Away",
      description: "When you're done, give us a call. We'll pick up and responsibly dispose of everything."
    }
  ]

  const testimonials = [
    {
      name: "Mike Davis",
      role: "General Contractor",
      review: "Best construction dumpster rental in San Diego. Same day delivery and the price was right.",
      rating: 5
    },
    {
      name: "Sarah Martinez",
      role: "Homeowner, La Jolla",
      review: "Made my garage cleanout so easy. The dumpster fit perfectly in my driveway!",
      rating: 5
    }
  ]

  const faqs = [
    {
      question: "What size dumpster do I need?",
      answer: "For small cleanouts or single room renovations, our 17-yard dumpster works great. For larger projects, remodels, or construction, the 21-yard is the most popular choice. Not sure? Call us and we'll help you choose!"
    },
    {
      question: "How long can I keep the dumpster?",
      answer: "Standard rental includes 3 days (72 hours). Need more time? No problem — extend for just $25/day. We're flexible and want to work with your schedule."
    },
    {
      question: "Do you offer same day delivery?",
      answer: "Yes! Same day dumpster delivery is available throughout San Diego County for orders placed before 2 PM. Just give us a call at (760) 270-0312."
    },
    {
      question: "What can I put in the dumpster?",
      answer: "Most household junk, construction debris, furniture, appliances, and yard waste are accepted. Hazardous materials, tires, and certain electronics require special handling. We'll explain everything when you book."
    },
    {
      question: "Do I need a permit?",
      answer: "If the dumpster is placed on your private property (driveway, yard), no permit is needed. For street placement, a city permit may be required. We can help guide you through the process."
    }
  ]

  const [openFaq, setOpenFaq] = React.useState<number | null>(0)

  return (
    <>
      <ServiceSchema />
      <BreadcrumbSchema items={breadcrumbs} />
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative pt-28 sm:pt-32 lg:pt-40 pb-20 sm:pb-28 lg:pb-36 -mt-[88px] overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto/v1769107609/IMG_0405_fxcujh.heic')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/80" />

          {/* Decorative elements */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-main/20 rounded-full blur-3xl animate-pulse-soft" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />

          <div className="relative z-10 container mx-auto px-4">
            <div className="mx-auto max-w-4xl text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6 animate-fade-in-down border border-white/20">
                <Sparkles className="w-4 h-4 text-main" />
                <span className="text-main text-sm font-semibold">San Diego's Trusted Dumpster Rental</span>
              </div>

              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl animate-slide-up">
                Dumpster Rental <span className="text-main">Services</span>
              </h1>

              <p className="mt-6 text-lg leading-8 text-gray-300 max-w-2xl mx-auto animate-slide-up delay-100">
                From small home cleanouts to major construction projects — we have the right dumpster for every job. Same day delivery available throughout San Diego County.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up delay-200">
                <Link href="/booking">
                  <button className="group bg-main text-white px-8 py-4 rounded-2xl font-semibold shadow-glow hover:shadow-glow-lg hover:bg-main/90 transition-all duration-300 flex items-center gap-2 hover:-translate-y-1">
                    Get Free Quote
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                <a href="tel:+17602700312">
                  <button className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white/20 transition-all duration-300 flex items-center gap-2">
                    <Phone className="w-5 h-5" />
                    (760) 270-0312
                  </button>
                </a>
              </div>

              {/* Trust badges */}
              <div className="mt-12 flex flex-wrap items-center justify-center gap-6 animate-fade-in-up delay-300">
                <div className="flex items-center gap-2 text-white/80">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Check className="w-4 h-4 text-green-400" />
                  </div>
                  <span className="text-sm">Same Day Delivery</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Check className="w-4 h-4 text-green-400" />
                  </div>
                  <span className="text-sm">Transparent Pricing</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Check className="w-4 h-4 text-green-400" />
                  </div>
                  <span className="text-sm">Locally Owned</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom wave */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" preserveAspectRatio="none">
              <path d="M0 80L60 70C120 60 240 40 360 35C480 30 600 40 720 45C840 50 960 50 1080 45C1200 40 1320 30 1380 25L1440 20V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z" fill="white"/>
            </svg>
          </div>
        </section>

        {/* Dumpster Sizes Section */}
        <section className="py-20 sm:py-28 lg:py-32 bg-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-main/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-main/10 rounded-full px-4 py-1.5 mb-6 animate-fade-in-down">
                <Ruler className="w-4 h-4 text-main" />
                <span className="text-main text-sm font-semibold">Dumpster Sizes</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
                Choose Your <span className="text-main">Perfect Size</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Not sure which size you need? Our team can help you choose the right container for your project.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {dumpsterSizes.map((dumpster, index) => (
                <div
                  key={dumpster.size}
                  className={`relative rounded-3xl p-8 transition-all duration-300 hover:-translate-y-2 ${
                    dumpster.popular
                      ? 'bg-main text-white shadow-2xl shadow-main/30 hover:shadow-glow-lg'
                      : 'bg-white border border-gray-200 shadow-card hover:shadow-card-hover'
                  }`}
                >
                  {dumpster.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <div className="bg-white text-main px-4 py-1.5 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Most Popular
                      </div>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <div className={`text-6xl font-bold mb-2 ${dumpster.popular ? 'text-white' : 'text-gray-900'}`}>
                      {dumpster.size}
                      <span className="text-2xl font-normal ml-1">yard</span>
                    </div>
                    <div className={`text-lg font-medium ${dumpster.popular ? 'text-white/90' : 'text-gray-700'}`}>
                      {dumpster.name}
                    </div>
                  </div>

                  <div className={`space-y-4 mb-8 ${dumpster.popular ? 'text-white/90' : 'text-gray-600'}`}>
                    <div className="flex items-center gap-3">
                      <Package className={`w-5 h-5 ${dumpster.popular ? 'text-white/70' : 'text-main'}`} />
                      <span className="text-sm">{dumpster.dimensions}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Truck className={`w-5 h-5 ${dumpster.popular ? 'text-white/70' : 'text-main'}`} />
                      <span className="text-sm">{dumpster.holds}</span>
                    </div>
                    <p className={`text-sm ${dumpster.popular ? 'text-white/70' : 'text-gray-500'}`}>
                      Ideal for: {dumpster.ideal}
                    </p>
                  </div>

                  <div className="text-center mb-6">
                    <div className={`text-4xl font-bold ${dumpster.popular ? 'text-white' : 'text-gray-900'}`}>
                      {dumpster.price}
                    </div>
                    <div className={`text-sm ${dumpster.popular ? 'text-white/70' : 'text-gray-500'}`}>
                      Includes 3 days & 2 tons
                    </div>
                  </div>

                  <Link href="/booking">
                    <button className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 ${
                      dumpster.popular
                        ? 'bg-white text-main hover:bg-gray-100 shadow-lg'
                        : 'bg-main text-white hover:bg-main/90 shadow-glow hover:shadow-glow-lg'
                    }`}>
                      Book Now
                    </button>
                  </Link>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <p className="text-gray-500 text-sm">
                Need a custom solution for concrete, dirt, or heavy debris?{' '}
                <a href="tel:+17602700312" className="text-main font-semibold hover:underline">Call us for a quote</a>
              </p>
            </div>
          </div>
        </section>

        {/* Section Divider */}
        <SectionDivider type="tilt" fromColor="white" toColor="#f8fafc" />

        {/* How It Works Section */}
        <section className="py-20 sm:py-28 lg:py-32 bg-gray-50 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-40" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-main/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-main/10 rounded-full px-4 py-1.5 mb-6">
                <Clock className="w-4 h-4 text-main" />
                <span className="text-main text-sm font-semibold">Simple Process</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
                How It <span className="text-main">Works</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Getting a dumpster has never been easier. Four simple steps from quote to cleanup.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {processSteps.map((step, index) => (
                <div
                  key={step.number}
                  className="relative group"
                >
                  {/* Connector line */}
                  {index < processSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-10 left-1/2 w-full h-0.5 bg-gradient-to-r from-main/50 to-main/20" />
                  )}

                  <div className="bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-2 relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-main to-main/80 text-white text-xl font-bold flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      {step.number}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section Divider */}
        <SectionDivider type="tilt" fromColor="#f8fafc" toColor="white" />

        {/* Services Grid Section */}
        <section className="py-20 sm:py-28 lg:py-32 bg-white relative overflow-hidden">
          <div className="absolute top-20 right-10 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-main/10 rounded-full px-4 py-1.5 mb-6">
                <Package className="w-4 h-4 text-main" />
                <span className="text-main text-sm font-semibold">Our Services</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
                Dumpster Rental for <span className="text-main">Every Project</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Whether you're a homeowner, business owner, or contractor — we've got you covered.
              </p>
            </div>

            <div className="space-y-16">
              {services.map((service, index) => (
                <div
                  key={service.title}
                  className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}
                >
                  <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                    <div className="relative">
                      <div className="absolute -inset-4 bg-gradient-to-tr from-main/20 to-purple-400/20 rounded-3xl blur-2xl" />
                      <div className="relative aspect-[3/2] w-full overflow-hidden rounded-2xl shadow-professional-2xl">
                        <Image
                          src={service.image}
                          alt={service.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>

                  <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-main/20 to-main/5 flex items-center justify-center">
                        <service.icon className="w-7 h-7 text-main" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">{service.title}</h3>
                    </div>

                    <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>

                    <ul className="space-y-3 mb-8">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                            <Check className="w-4 h-4 text-green-600" />
                          </div>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Link href="/booking">
                      <button className="group bg-main text-white px-6 py-3 rounded-xl font-semibold shadow-glow hover:shadow-glow-lg hover:bg-main/90 transition-all duration-300 flex items-center gap-2 hover:-translate-y-1">
                        Get Started
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mini Testimonials */}
        <section className="py-16 sm:py-20 bg-slate-900 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-4">
                  <MessageSquare className="w-4 h-4 text-main" />
                  <span className="text-main text-sm font-semibold">Customer Reviews</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  Trusted by San Diego
                </h3>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-white font-semibold">4.9/5</span>
                  <span className="text-slate-400">from 200+ reviews</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                {testimonials.map((testimonial, index) => (
                  <div
                    key={index}
                    className="bg-slate-800 rounded-2xl p-6 border border-slate-700 max-w-xs"
                  >
                    <div className="flex mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-slate-300 text-sm mb-4">"{testimonial.review}"</p>
                    <div>
                      <div className="text-white font-semibold text-sm">{testimonial.name}</div>
                      <div className="text-slate-400 text-xs">{testimonial.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 sm:py-28 lg:py-32 bg-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-main/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-main/10 rounded-full px-4 py-1.5 mb-6">
                <HelpCircle className="w-4 h-4 text-main" />
                <span className="text-main text-sm font-semibold">FAQ</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
                Common <span className="text-main">Questions</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Got questions? We've got answers. If you don't see what you're looking for, give us a call.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-card"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left"
                  >
                    <span className="font-semibold text-gray-900">{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-main transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <div
                    className={`px-6 overflow-hidden transition-all duration-300 ${
                      openFaq === index ? 'pb-5 max-h-48' : 'max-h-0'
                    }`}
                  >
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 sm:py-28 lg:py-32 bg-gradient-to-br from-main to-main/90 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-white rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
          </div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
              Get your free quote today and experience why San Diego trusts us for dumpster rental. Same day delivery available!
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/booking">
                <button className="bg-white text-main px-8 py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all duration-300 hover:-translate-y-1 flex items-center gap-2">
                  Get Free Quote
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              <a href="tel:+17602700312">
                <button className="bg-white/10 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white/20 transition-all duration-300 flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Call (760) 270-0312
                </button>
              </a>
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-white/70">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-white" />
                <span>Same Day Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-white" />
                <span>Transparent Pricing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-white" />
                <span>Free Quotes</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
