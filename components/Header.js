import Image from "next/image";
import { cn } from "../lib/utils";
import { Phone, Mail, Menu, X, User } from "lucide-react";
import { useState, useEffect } from "react";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) { // md breakpoint
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navigationLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/contact", label: "Contact" }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto h-16 px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 items-center h-full">
          {/* Logo - Left Column */}
          <div className="flex items-center justify-start">
            <Image 
              src="/logo.png" 
              alt="Logo" 
              width={48} 
              height={48} 
              className="rounded-lg"
            />
          </div>
          
          {/* Centered Navigation - Center Column */}
          <div className="hidden md:flex items-center justify-center space-x-1">
            {navigationLinks.map((link) => (
              <a 
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-accent rounded-md transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
          
          {/* Contact Info - Right Column */}
          <div className="flex items-center justify-end w-full">
            <div className="hidden lg:flex items-center space-x-2">
              <a 
                href="tel:7602700312" 
                className={cn(
                  "inline-flex items-center gap-2 px-3 py-2 text-xs font-medium",
                  "bg-brand text-brand-foreground hover:bg-brand/90",
                  "rounded-md transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                )}
              >
                <Phone className="h-3 w-3" />
                <span className="hidden xl:inline">(760) 270-0312</span>
                <span className="xl:hidden">Call</span>
              </a>
              <a 
                href="mailto:sandiegodumpingsolutions@gmail.com" 
                className={cn(
                  "inline-flex items-center gap-2 px-3 py-2 text-xs font-medium",
                  "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
                  "rounded-md transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                )}
              >
                <Mail className="h-3 w-3" />
                <span className="hidden xl:inline">Email Us</span>
                <span className="xl:hidden">Email</span>
              </a>
              <a 
                href="/login" 
                className={cn(
                  "inline-flex items-center gap-2 px-3 py-2 text-xs font-medium",
                  "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
                  "rounded-md transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                )}
              >
                <User className="h-3 w-3" />
                <span className="hidden xl:inline">Login</span>
                <span className="xl:hidden">Login</span>
              </a>
            </div>
            
            {/* Mobile menu button */}
            <button 
              onClick={toggleMobileMenu}
              className={cn(
                "inline-flex items-center justify-center rounded-md p-2 md:hidden ml-auto",
                "text-foreground/60 hover:text-foreground hover:bg-accent",
                "transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                "touch-target min-h-[44px] min-w-[44px]"
              )}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0  z-40 md:hidden"
            onClick={closeMobileMenu}
          />
          
          {/* Mobile Menu Panel */}
          <div className="fixed top-16 left-0 right-0 bottom-0 bg-white border-t z-40 md:hidden">
            <div className="flex flex-col h-full">
              {/* Navigation Links */}
              <div className="flex-1 px-4 py-6 space-y-1 bg-white">
                {navigationLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={closeMobileMenu}
                    className={cn(
                      "block px-4 py-3 text-base font-medium rounded-md",
                      "text-foreground/80 hover:text-foreground hover:bg-accent",
                      "transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                      "touch-target min-h-[44px]"
                    )}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
              
              {/* Mobile Contact Actions */}
              <div className="border-t p-4 space-y-3 bg-white">
                <a 
                  href="tel:7602700312" 
                  onClick={closeMobileMenu}
                  className={cn(
                    "flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-medium",
                    "bg-brand text-brand-foreground hover:bg-brand/90",
                    "rounded-md transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                    "touch-target min-h-[44px]"
                  )}
                >
                  <Phone className="h-4 w-4" />
                  Call (760) 270-0312
                </a>
                <a 
                  href="mailto:sandiegodumpingsolutions@gmail.com" 
                  onClick={closeMobileMenu}
                  className={cn(
                    "flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-medium",
                    "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
                    "rounded-md transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                    "touch-target min-h-[44px]"
                  )}
                >
                  <Mail className="h-4 w-4" />
                  Send Email
                </a>
                <a 
                  href="/login" 
                  onClick={closeMobileMenu}
                  className={cn(
                    "flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-medium",
                    "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
                    "rounded-md transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                    "touch-target min-h-[44px]"
                  )}
                >
                  <User className="h-4 w-4" />
                  Client Login
                </a>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
