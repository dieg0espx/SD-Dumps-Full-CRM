import Image from "next/image";
import { cn } from "../lib/utils";
import { CheckCircle, Clock, Truck, Shield } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: Clock,
      title: "Fast & Reliable",
      description: "Same-day delivery and pickup available for urgent projects"
    },
    {
      icon: Truck,
      title: "Professional Service",
      description: "Experienced team with modern equipment and competitive pricing"
    }
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 items-center">
          <div className="space-y-6 sm:space-y-8">
            <div className="space-y-3 sm:space-y-4">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
                Why Choose Our 
                <span className="text-brand block">Dumpster Rental Service</span>
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                We provide professional waste management solutions with transparent pricing, 
                reliable service, and expert support for projects of any size.
              </p>
            </div>
            
            <button 
              className={cn(
                "inline-flex items-center gap-2 px-6 py-3 text-sm font-medium",
                "bg-brand text-brand-foreground hover:bg-brand/90",
                "rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "touch-target shadow-sm"
              )}
            >
              Learn More
            </button>
            
            <div className="space-y-4 sm:space-y-6 pt-2 sm:pt-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-brand/10">
                      <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-brand" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-sm sm:text-base text-foreground">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative order-first lg:order-last">
            <div className="absolute inset-0 rounded-3xl transform rotate-3" />
            <div>
              <Image
                src="/dumpster.png"
                alt="Professional Dumpster Container"
                width={500}
                height={400}
                className="object-contain w-full h-auto max-h-[300px] sm:max-h-[400px] lg:max-h-none ml-auto mr-0 hidden md:block"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
