import React from 'react'
import { HelpCircle, DollarSign, Clock, Ruler, Building2, MapPin, Wrench, Phone, MessageCircle } from 'lucide-react'
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
      answer: "Our dumpster rental San Diego prices start at $595 for a 17-yard roll off dumpster, which includes 3 days and 2 tons of disposal. We're known for offering cheap dumpster rental San Diego with no hidden fees. Our 21-yard dumpster is $695 — the best value for construction dumpster rental San Diego projects.",
      icon: DollarSign,
      iconColor: "text-green-500",
      iconBg: "bg-green-50"
    },
    {
      question: "Do you offer same day dumpster rental San Diego?",
      answer: "Yes! We offer same day dumpster rental San Diego for orders placed before 2 PM on weekdays. Need a dumpster delivered today? Call (760) 270-0312 for same day delivery throughout San Diego County.",
      icon: Clock,
      iconColor: "text-blue-500",
      iconBg: "bg-blue-50"
    },
    {
      question: "What sizes are available for small dumpster rental near me?",
      answer: "Looking for a small dumpster rental near me or 2 yard dumpster rental near me? We offer 10 yard dumpster rental for small cleanouts, plus 17-yard and 21-yard roll off dumpster rental San Diego for larger projects. Call us to find the right size for your needs.",
      icon: Ruler,
      iconColor: "text-purple-500",
      iconBg: "bg-purple-50"
    },
    {
      question: "Do you offer commercial dumpster rental and commercial trash dumpsters?",
      answer: "Absolutely! We provide commercial dumpster rental and commercial trash dumpsters for businesses, restaurants, retail stores, and construction sites throughout San Diego. Regular pickup schedules available.",
      icon: Building2,
      iconColor: "text-amber-500",
      iconBg: "bg-amber-50"
    },
    {
      question: "What areas do you serve for dumpster rental in San Diego?",
      answer: "We serve all of San Diego County for dumpster rental San Diego CA, including La Jolla, Chula Vista, El Cajon, Oceanside, Escondido, Carlsbad, and surrounding communities. Our waste management San Diego services cover the entire region.",
      icon: MapPin,
      iconColor: "text-red-500",
      iconBg: "bg-red-50"
    },
    {
      question: "What services do you offer besides garbage dumpster rental?",
      answer: "Beyond garbage dumpster rental and roll off dumpster rental San Diego, we offer junk removal services San Diego, dump trailer rental for heavy materials, residential dumpster rental San Diego for home projects, and full-service waste management San Diego solutions.",
      icon: Wrench,
      iconColor: "text-main",
      iconBg: "bg-main/10"
    }
  ];

  return (
    <section className="py-20 sm:py-28 lg:py-32 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-main/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section header */}
        <div className="text-center mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-main/10 rounded-full px-4 py-1.5 mb-6 animate-fade-in-down">
            <HelpCircle className="w-4 h-4 text-main" />
            <span className="text-main text-sm font-semibold">Got Questions?</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 tracking-tight animate-slide-up">
            Dumpster Rental San Diego <span className="text-main">FAQ</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto animate-slide-up delay-100">
            Common questions about affordable dumpster rental San Diego, pricing, and our services.
          </p>
        </div>

        <Accordion type="single" collapsible className="grid md:grid-cols-2 gap-4 items-start">
          {faqData.map((faq, index) => {
            const IconComponent = faq.icon;
            return (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-gray-200/80 rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 animate-slide-up bg-white overflow-hidden group data-[state=open]:ring-2 data-[state=open]:ring-main/20 data-[state=open]:border-main/30"
                style={{ animationDelay: `${(index + 2) * 100}ms` }}
              >
                <AccordionTrigger className="px-5 py-5 text-left font-semibold text-gray-900 hover:no-underline transition-colors text-sm sm:text-base gap-3">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-10 h-10 rounded-xl ${faq.iconBg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className={`w-5 h-5 ${faq.iconColor}`} />
                    </div>
                    <span className="pr-2 text-sm">{faq.question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-5 text-gray-600 text-sm leading-relaxed">
                  <div className="pl-13 border-l-2 border-gray-100 ml-5 pl-3">
                    {faq.answer}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>

        {/* CTA Section */}
        <div className="mt-12 sm:mt-16 text-center animate-fade-in-up delay-500">
          <div className="bg-gradient-to-r from-main/5 via-main/10 to-main/5 rounded-3xl p-8 sm:p-10 border border-main/10">
            <div className="flex items-center justify-center gap-2 mb-4">
              <MessageCircle className="w-5 h-5 text-main" />
              <span className="text-gray-900 font-semibold">Still have questions?</span>
            </div>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Our team is here to help. Get in touch for personalized assistance with your dumpster rental needs.
            </p>
            <a
              href="tel:7602700312"
              className="inline-flex items-center gap-2 bg-main hover:bg-main/90 text-white font-semibold px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 shadow-lg shadow-main/25"
            >
              <Phone className="w-4 h-4" />
              Call (760) 270-0312
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
