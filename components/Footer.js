import { cn } from "../lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, MapPin, Clock, Truck, Shield, Zap, Facebook, Twitter, Instagram } from "lucide-react";

export default function Footer() {
  const footerSections = [
    {
      title: "Services",
      links: [
        { name: "Residential", href: "/services" },
        { name: "Commercial", href: "/services" },
        { name: "Construction", href: "/services" },
        { name: "Emergency", href: "/contact" }
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Our Team", href: "/about" },
        { name: "Careers", href: "/contact" },
        { name: "Contact", href: "/contact" }
      ]
    }
  ];

  const features = [
    { icon: Truck, text: "Same Day Delivery", description: "Quick and reliable service" },
    { icon: Shield, text: "Licensed & Insured", description: "Professional and protected" },
    { icon: Zap, text: "24/7 Support", description: "Always here to help" }
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" }
  ];

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="SD Dumps Logo"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <div>
                <h3 className="font-semibold text-lg text-foreground">
                  SD Dumps
                </h3>
                <p className="text-sm text-muted-foreground">Professional Waste Solutions</p>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground leading-relaxed">
              Professional dumpster rental services for all your waste management needs. 
              Fast, reliable, and affordable solutions.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className={cn(
                    "inline-flex items-center justify-center w-8 h-8 rounded-md",
                    "text-muted-foreground hover:text-foreground hover:bg-accent",
                    "transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  )}
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section, index) => (
            <div key={index} className="space-y-4">
              <h4 className="font-semibold text-foreground">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={link.href}
                      className={cn(
                        "text-sm text-muted-foreground hover:text-foreground",
                        "transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      )}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Contact Info</h4>
            <div className="space-y-3">
              <a
                href="tel:7602700312"
                className={cn(
                  "flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground",
                  "transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                )}
              >
                <Phone className="h-4 w-4" />
                <span>(760) 270-0312</span>
              </a>
              <a
                href="mailto:sandiegodumpingsolutions@gmail.com"
                className={cn(
                  "flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground",
                  "transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                )}
              >
                <Mail className="h-4 w-4" />
                <span>sandiegodumpingsolutions@gmail.com</span>
              </a>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>San Diego, CA</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Mon-Fri: 7AM-6PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mt-12 pt-8 border-t">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-start gap-4 p-4 rounded-lg",
                  "bg-muted/50 border border-border",
                  "hover:bg-muted transition-colors"
                )}
              >
                <div className="p-2 rounded-md bg-brand text-brand-foreground">
                  <feature.icon className="h-4 w-4" />
                </div>
                <div>
                  <h5 className="font-medium text-foreground text-sm">{feature.text}</h5>
                  <p className="text-xs text-muted-foreground mt-1">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground text-center sm:text-left">
              &copy; 2024 SD Dumps. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link
                href="/privacy"
                className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
