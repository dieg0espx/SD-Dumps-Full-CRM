import React from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function FAQSection() {
  const faqData = [
    {
      question: "What is the cost of dumpster rental in San Diego?",
      answer: "Our dumpster rental San Diego prices start at $595 for a 17-yard roll off dumpster, which includes 3 days and 2 tons of disposal. We're known for offering cheap dumpster rental San Diego with no hidden fees. Our 21-yard dumpster is $695 — the best value for construction dumpster rental San Diego projects."
    },
    {
      question: "Do you offer same day dumpster rental San Diego?",
      answer: "Yes! We offer same day dumpster rental San Diego for orders placed before 2 PM on weekdays. Need a dumpster delivered today? Call (760) 270-0312 for same day delivery throughout San Diego County."
    },
    {
      question: "What sizes are available for small dumpster rental near me?",
      answer: "Looking for a small dumpster rental near me or 2 yard dumpster rental near me? We offer 10 yard dumpster rental for small cleanouts, plus 17-yard and 21-yard roll off dumpster rental San Diego for larger projects. Call us to find the right size for your needs."
    },
    {
      question: "Do you offer commercial dumpster rental and commercial trash dumpsters?",
      answer: "Absolutely! We provide commercial dumpster rental and commercial trash dumpsters for businesses, restaurants, retail stores, and construction sites throughout San Diego. Regular pickup schedules available."
    },
    {
      question: "What areas do you serve for dumpster rental in San Diego?",
      answer: "We serve all of San Diego County for dumpster rental San Diego CA, including La Jolla, Chula Vista, El Cajon, Oceanside, Escondido, Carlsbad, and surrounding communities. Our waste management San Diego services cover the entire region."
    },
    {
      question: "What services do you offer besides garbage dumpster rental?",
      answer: "Beyond garbage dumpster rental and roll off dumpster rental San Diego, we offer junk removal services San Diego, dump trailer rental for heavy materials, residential dumpster rental San Diego for home projects, and full-service waste management San Diego solutions."
    }
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
            Dumpster Rental San Diego FAQ
          </h2>
          <p className="text-base sm:text-lg text-gray-600">
            Common questions about affordable dumpster rental San Diego, pricing, and our services.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqData.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border border-gray-200 rounded-lg mb-4">
              <AccordionTrigger className="px-6 py-4 text-left font-semibold text-gray-900 hover:bg-gray-50 transition-colors">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-gray-600">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
