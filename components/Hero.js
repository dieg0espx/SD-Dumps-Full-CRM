import Image from "next/image";
import { cn } from "../lib/utils";
import { ArrowRight, DollarSign } from "lucide-react";

export default function Hero() {
  const handleGetStarted = () => {
    // Scroll to contact section
    const contactSection = document.querySelector('#contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSeePricing = () => {
    // Scroll to pricing section
    const pricingSection = document.querySelector('#pricing');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[85vh] sm:min-h-[90vh] bg-gradient-to-b from-background to-muted/30 overflow-hidden">
      <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
        <div className="text-center max-w-4xl mx-auto space-y-6 sm:space-y-8">
          <div className="space-y-3 sm:space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-tight">
              Professional Dumpster
              <span className="text-brand block">Rental Service</span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
              Fast, reliable, and affordable dumpster rentals for your home renovation, 
              construction project, or cleanup needs.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-4 sm:pt-6 px-4 sm:px-0">
            <button 
              onClick={handleGetStarted}
              className={cn(
                "inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3 text-sm sm:text-sm font-medium",
                "bg-primary text-primary-foreground hover:bg-primary/90",
                "rounded-md transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                "shadow-sm touch-target w-full sm:w-auto"
              )}
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </button>
            <button 
              onClick={handleSeePricing}
              className={cn(
                "inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3 text-sm sm:text-sm font-medium",
                "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
                "rounded-md transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                "touch-target w-full sm:w-auto"
              )}
            >
              See Pricing
            </button>
          </div>
        </div>
        
        {/* Dumpster Image */}
        <div className="flex justify-center mt-12 sm:mt-16 lg:mt-20">
          <div className="relative max-w-5xl w-full px-4 sm:px-0">
            <Image
              src="/dumpster.png"
              alt="Professional Dumpster Container"
              width={800}
              height={500}
              className="object-contain w-full h-auto max-h-[300px] sm:max-h-[400px] lg:max-h-none"
            />
          </div>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-48 sm:w-72 h-48 sm:h-72 bg-brand/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>
    </section>
  );
}
