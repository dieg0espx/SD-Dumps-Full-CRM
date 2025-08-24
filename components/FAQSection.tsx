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
      question: "What sizes of dumpsters do you offer?",
      answer: "We offer a variety of dumpster sizes including 10-yard, 15-yard, 20-yard, and 30-yard containers to accommodate different project needs. Our team can help you choose the right size based on your specific requirements."
    },
    {
      question: "How long can I keep the dumpster?",
      answer: "Our standard rental period is 7 days, but we offer flexible rental terms. You can extend your rental period for an additional fee. Contact us to discuss your specific timeline needs."
    },
    {
      question: "What materials are prohibited from dumpsters?",
      answer: "Prohibited materials include hazardous waste, chemicals, paint, batteries, electronics, tires, and medical waste. We can provide guidance on proper disposal methods for these items."
    },
    {
      question: "Do you offer same-day delivery?",
      answer: "Yes, we offer same-day delivery for orders placed before 2 PM on weekdays. Weekend deliveries are also available with advance notice. Contact us for availability in your area."
    },
    {
      question: "What areas do you serve?",
      answer: "We serve the greater metropolitan area and surrounding suburbs within a 50-mile radius. Contact us with your specific location to confirm service availability and delivery fees."
    },
    {
      question: "How do I schedule a pickup?",
      answer: "You can schedule a pickup by calling our customer service line or using our online booking system. We'll coordinate with you to find the best time for pickup that works with your schedule."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600">
            Find answers to common questions about our dumpster rental services.
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
