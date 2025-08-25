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
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Professional Container Rental Services | SD Dumps',
  description: 'Get reliable container rental services for construction, renovation, and waste management in San Diego. Fast delivery, competitive pricing, and professional service.',
  keywords: [
    'container rental San Diego',
    'dumpster rental',
    'construction waste removal',
    'renovation debris disposal',
    'roll-off containers',
    'construction cleanup',
    'waste management services',
    'debris removal San Diego'
  ],
      openGraph: {
      title: 'Professional Container Rental Services | SD Dumps',
      description: 'Get reliable container rental services for construction, renovation, and waste management in San Diego. Fast delivery, competitive pricing, and professional service.',
      url: 'https://sddumps.com',
      siteName: 'SD Dumps',
      images: [
        {
          url: '/miniature.png',
          width: 1200,
          height: 630,
          alt: 'SD Dumps Container Rental Services',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
      twitter: {
      card: 'summary_large_image',
      title: 'Professional Container Rental Services | SD Dumps',
      description: 'Get reliable container rental services for construction, renovation, and waste management in San Diego.',
      images: ['/miniature.png'],
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
    <div className="min-h-screen bg-white">
      <HeroSection />
      <WhyChooseUs />
      <WasteSolutions />
      <TrustedByThousands />
      <PricingSection />
      <Testimonials />
      <FAQSection />
      <ContactSection />
    </div>
  )
}