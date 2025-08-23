import Image from "next/image";
import { cn } from "../lib/utils";
import { CheckCircle, ArrowRight } from "lucide-react";

export default function InfoSection() {
  const benefits = [
    {
      title: "Professional Waste Management",
      description: "Expert handling of all types of construction and renovation debris with proper disposal methods."
    },
    {
      title: "Flexible Rental Periods",
      description: "Choose from daily, weekly, or monthly rental options to fit your project timeline."
    },
    {
      title: "Competitive Pricing",
      description: "Transparent pricing with no hidden fees and volume discounts for larger projects."
    }
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 items-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-3xl transform rotate-2" />
            <div className="relative">
              <Image
                src="/dumpster.png"
                alt="Professional Dumpster Container"
                width={500}
                height={400}
                className="object-contain w-full h-auto max-h-[300px] sm:max-h-[400px] lg:max-h-none ml-0 mr-auto"
              />
            </div>
          </div>
          
          <div className="space-y-6 sm:space-y-8">
            <div className="space-y-3 sm:space-y-4">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
                Professional 
                <span className="text-brand block">Waste Solutions</span>
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                We provide comprehensive waste management services for construction, renovation, 
                and cleanup projects with reliable delivery and competitive pricing.
              </p>
            </div>
            
            <div className="space-y-4 sm:space-y-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-brand/10">
                      <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-brand" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-sm sm:text-base text-foreground">{benefit.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              className={cn(
                "inline-flex items-center gap-2 px-6 py-3 text-sm font-medium",
                "bg-brand text-brand-foreground hover:bg-brand/90",
                "rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "touch-target shadow-sm"
              )}
            >
              Get Free Quote
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
