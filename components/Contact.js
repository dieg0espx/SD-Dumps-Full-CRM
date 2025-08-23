import Image from "next/image";
import { cn } from "../lib/utils";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Contact() {
  const contactInfo = [
    {
      icon: MapPin,
      title: "Address", 
      details: "San Diego, CA"
    },
    {
      icon: Phone,
      title: "Phone",
      details: "(760) 270-0312"
    },
    {
      icon: Mail,
      title: "Email", 
      details: "sandiegodumpingsolutions@gmail.com"
    }
  ];

  const handleGetQuote = () => {
    // Open email client with pre-filled subject
    window.location.href = "mailto:sandiegodumpingsolutions@gmail.com?subject=Dumpster Rental Quote Request&body=Hi, I'd like to request a quote for dumpster rental. Please contact me with more information.";
  };

  const handleCallUs = () => {
    // Initiate phone call
    window.location.href = "tel:7602700312";
  };

  return (
    <section id="contact" className="py-16 sm:py-20 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 items-center">
          <div className="space-y-6 sm:space-y-8">
            <div className="space-y-3 sm:space-y-4">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
                Get In Touch
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                Ready to get started? Contact us for a free quote or to schedule your dumpster rental today.
              </p>
            </div>
            
            <div className="space-y-4 sm:space-y-6">
              {contactInfo.map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-brand/10">
                      <item.icon className="h-5 w-5 sm:h-6 sm:w-6 text-brand" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-sm sm:text-base text-foreground">{item.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.details}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
              <button 
                onClick={handleGetQuote}
                className={cn(
                  "inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium",
                  "bg-brand text-brand-foreground hover:bg-brand/90",
                  "rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  "touch-target w-full sm:w-auto shadow-sm"
                )}
              >
                Get Quote Now
              </button>
              <button 
                onClick={handleCallUs}
                className={cn(
                  "inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium",
                  "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
                  "rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  "touch-target w-full sm:w-auto"
                )}
              >
                <Phone className="h-4 w-4" />
                Call Us Today
              </button>
            </div>
          </div>

          <div className="relative order-first lg:order-last">
            <div className="relative bg-muted/30 rounded-2xl overflow-hidden border border-border">
              <Image
                src="/placeholder.svg"
                alt="Location Map"
                width={600}
                height={400}
                className="w-full h-[300px] sm:h-[400px] lg:h-[550px] object-cover"
              />
              {/* Overlay for better mobile visibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Additional mobile-friendly contact section */}
        <div className="mt-12 sm:mt-16 lg:hidden">
          <div className="bg-muted/30 rounded-lg p-6 border border-border">
            <h3 className="font-semibold text-foreground mb-4 text-center">Quick Contact</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a 
                href="tel:7602700312"
                className={cn(
                  "flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium",
                  "bg-brand text-brand-foreground hover:bg-brand/90",
                  "rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  "touch-target"
                )}
              >
                <Phone className="h-4 w-4" />
                Call Now
              </a>
              <a 
                href="mailto:sandiegodumpingsolutions@gmail.com"
                className={cn(
                  "flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium",
                  "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
                  "rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  "touch-target"
                )}
              >
                <Mail className="h-4 w-4" />
                Email Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
