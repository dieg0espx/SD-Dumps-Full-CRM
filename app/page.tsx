import React from 'react'
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