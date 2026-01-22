import React from 'react'
import type { Metadata } from 'next'
import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import WhyChooseUs from '@/components/WhyChooseUs'
import WasteSolutions from '@/components/WasteSolutions'
import TrustedByThousands from '@/components/TrustedByThousands'
import PricingSection from '@/components/PricingSection'
import Testimonials from '@/components/Testimonials'
import FAQSection from '@/components/FAQSection'
import ContactSection from '@/components/ContactSection'
import ServiceAreasSection from '@/components/ServiceAreasSection'
import Footer from '@/components/Footer'
import { FAQSchema, ServiceSchema } from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'Dumpster Rental San Diego | Affordable Roll Off Container Rental | SD Dumping Solutions',
  description: 'Looking for affordable dumpster rental in San Diego? SD Dumping Solutions offers same day dumpster rental, roll off dumpster rental, and junk removal services. Residential & commercial. Call (760) 270-0312 for a free quote!',
  keywords: [
    'dumpster rental san diego',
    'san diego dumpster rental',
    'dumpster rental san diego ca',
    'dumpster rental in san diego',
    'roll off dumpster rental san diego',
    'affordable dumpster rental san diego',
    'cheap dumpster rental san diego',
    'same day dumpster rental san diego',
    'residential dumpster rental san diego',
    'construction dumpster rental san diego',
    'commercial dumpster rental',
    'commercial trash dumpsters',
    '10 yard dumpster rental',
    'small dumpster rental near me',
    '2 yard dumpster rental near me',
    'garbage dumpster rental',
    'dump trailer rental',
    'junk removal services san diego',
    'waste management san diego',
    'cost of dumpster rental'
  ],
  openGraph: {
    title: 'Dumpster Rental San Diego | Affordable Roll Off Container Rental | SD Dumping Solutions',
    description: 'Looking for affordable dumpster rental in San Diego? Same day delivery, competitive pricing, residential & commercial dumpster rental. Call (760) 270-0312!',
    url: 'https://sddumps.com',
    siteName: 'SD Dumping Solutions',
    images: [
      {
        url: 'https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto/sddumps/miniature.png',
        width: 1200,
        height: 630,
        alt: 'San Diego Dumpster Rental - Roll Off Container Services',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dumpster Rental San Diego | Same Day Delivery | SD Dumping Solutions',
    description: 'Affordable dumpster rental in San Diego. Roll off containers, residential & commercial. Same day delivery available. Call (760) 270-0312!',
    images: ['https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto/sddumps/miniature.png'],
  },
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function HomePage() {
  return (
    <>
      <FAQSchema />
      <ServiceSchema />
      <div className="min-h-screen bg-white">
        <HeroSection />
        <WhyChooseUs />
        <WasteSolutions />
        <TrustedByThousands />
        <PricingSection />
        <ServiceAreasSection />
        <Testimonials />
        <FAQSection />
        <ContactSection />
      </div>
    </>
  )
}