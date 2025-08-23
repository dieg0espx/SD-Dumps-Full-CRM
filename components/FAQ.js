import { useState } from 'react';
import { cn } from "../lib/utils";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const faqData = [
  {
    question: "What sizes of dumpsters do you offer?",
    answer: `We offer 17-yard dumpsters (${formatCurrency(595)} including 2 tons) and 21-yard dumpsters (${formatCurrency(695)} including 2 tons). For concrete and dirt disposal, we have specialized containers available - please call us to order these items.`
  },
  {
    question: "How does the pricing work?",
    answer: `We charge the base price upon delivery. If you exceed the included 2 tons, we charge an additional ${formatCurrency(125)} per ton after we dump. For example, if you throw out 3 tons with a 17-yard dumpster, you pay ${formatCurrency(595)} initially, then ${formatCurrency(125)} for the extra ton.`
  },
  {
    question: "What additional charges should I expect?",
    answer: `Additional charges include: ${formatCurrency(125)} per ton for extra tonnage beyond the included 2 tons, ${formatCurrency(30)} per appliance, and ${formatCurrency(30)} per extra day if you need the dumpster longer than the standard rental period.`
  },
  {
    question: "What materials can I dispose of?",
    answer: "We accept construction debris, household junk, furniture, appliances, and general waste. We do NOT accept hazardous waste, chemicals, paint, batteries, electronics, tires, or medical waste. For concrete and dirt, please call us for specialized containers."
  },
  {
    question: "Do you offer same-day delivery?",
    answer: "Yes, we offer same-day delivery for orders placed before 2 PM on weekdays. Weekend deliveries are also available with advance notice. Contact us for availability in your area."
  },
  {
    question: "What areas do you serve?",
    answer: "We serve San Diego County and surrounding areas. Contact us with your specific location to confirm service availability and delivery fees."
  },
  {
    question: "How do I schedule a pickup?",
    answer: "You can schedule a pickup by calling us at (760) 270-0312 or emailing sandiegodumpingsolutions@gmail.com. We'll coordinate with you to find the best time for pickup that works with your schedule."
  },
  {
    question: "What is your process for ordering?",
    answer: "Our process includes: 1) Choose your dumpster size (17 or 21 yard), 2) Tell us what you'll be throwing out (demo, junk, dirt, concrete, etc.), 3) We send you a quote, 4) Process payment and schedule delivery. We charge the base price upon delivery and any additional tonnage after we dump."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 sm:py-20 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12 space-y-4">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            Find answers to common questions about our dumpster rental services.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <div key={index} className="bg-background rounded-lg shadow-sm border border-border overflow-hidden">
                <button 
                  className={cn(
                    "w-full text-left p-4 sm:p-6 flex justify-between items-center",
                    "hover:bg-accent/50 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                    "touch-target"
                  )}
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={openIndex === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span className="font-semibold text-foreground text-sm sm:text-base pr-4 leading-relaxed">
                    {faq.question}
                  </span>
                  <svg 
                    className={cn(
                      "w-5 h-5 text-muted-foreground transition-transform duration-200 flex-shrink-0",
                      openIndex === index && "rotate-180"
                    )} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openIndex === index && (
                  <div 
                    id={`faq-answer-${index}`}
                    className="px-4 sm:px-6 pb-4 sm:pb-6"
                  >
                    <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
