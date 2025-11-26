import React from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Check, Truck, Clock, Shield, Users, Award, Phone, Calendar, Home, Building, Wrench, Leaf } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ServiceSchema, BreadcrumbSchema } from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'Waste Management Services | Container Rental Solutions',
  description: 'Professional waste management services including residential dumpster rental, commercial waste solutions, construction debris removal, and yard waste disposal in San Diego.',
  keywords: [
    'waste management services',
    'residential dumpster rental',
    'commercial waste solutions',
    'construction debris removal',
    'yard waste disposal',
    'demolition waste',
    'landscaping debris',
    'San Diego waste management'
  ],
      openGraph: {
      title: 'Waste Management Services | Container Rental Solutions',
      description: 'Professional waste management services including residential dumpster rental, commercial waste solutions, construction debris removal, and yard waste disposal in San Diego.',
      url: 'https://sddumps.com/services',
      siteName: 'SD Dumps',
      images: [
        {
          url: 'https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto/sddumps/miniature.png',
          width: 1200,
          height: 630,
          alt: 'SD Dumps Waste Management Services',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
      twitter: {
      card: 'summary_large_image',
      title: 'Waste Management Services | Container Rental Solutions',
      description: 'Professional waste management services including residential dumpster rental, commercial waste solutions, and construction debris removal.',
      images: ['https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto/sddumps/miniature.png'],
    },
  alternates: {
    canonical: '/services',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function Services() {
  const breadcrumbs = [
    { name: 'Home', url: 'https://sddumps.com' },
    { name: 'Services', url: 'https://sddumps.com/services' }
  ]

  return (
    <>
      <ServiceSchema />
      <BreadcrumbSchema items={breadcrumbs} />
      <div className="min-h-screen bg-background">
        <Header />
      
      <div className="bg-background">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-24 lg:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-4 bg-main/10 text-main border-main/20">
              Professional Waste Management
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Our <span className="text-main">Waste Management</span> Services
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Professional dumpster rental and waste management solutions for every project type and size.
            </p>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">
              From small residential cleanouts to large commercial construction projects.
            </p>
            
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button asChild size="lg" className="bg-main hover:bg-main/90">
                <Link href="/booking">
                  Get Free Quote
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/contact">
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Simple Process Section */}
        <section className="container mx-auto px-4 py-24 lg:py-32">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="outline" className="border-main text-main">
                  Our Process
                </Badge>
                <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  Simple Process, <span className="text-main">Professional Results</span>
                </h2>
                <p className="text-lg text-muted-foreground">
                  Our streamlined process makes it easy to get the waste management solutions you need, when you need them.
                </p>
              </div>
              
              <div className="space-y-6">
                {[
                  {
                    step: "1",
                    title: "Get a Quote",
                    description: "Contact us for a free quote based on your project needs and timeline."
                  },
                  {
                    step: "2", 
                    title: "Schedule Delivery",
                    description: "Choose your delivery date and container size. Same-day delivery available."
                  },
                  {
                    step: "3",
                    title: "Fill & Use", 
                    description: "Use the container for your project duration with flexible rental periods."
                  },
                  {
                    step: "4",
                    title: "Professional Pickup",
                    description: "We handle pickup and proper disposal when you're finished."
                  }
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                                         <div className="flex h-8 w-8 items-center justify-center rounded-full bg-main text-white text-sm font-medium">
                       {item.step}
                     </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold text-foreground">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-center">
              <div className="relative">
                <Image
                  src="https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto/sddumps/dumpster"
                  alt="Professional dumpster services"
                  width={500}
                  height={400}
                  className="rounded-lg object-cover"
                />
                <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-background/20 to-transparent" />
              </div>
            </div>
          </div>
        </section>

        {/* Additional Services Section */}
        <section className="bg-muted/50 py-24 lg:py-32">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <Badge variant="secondary" className="mb-4 bg-main/10 text-main border-main/20">
                Additional Services
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Comprehensive Support Services
              </h2>
              <p className="mt-6 text-lg text-muted-foreground">
                Make your waste management project as smooth as possible with our additional support services.
              </p>
            </div>
            
            <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: Clock,
                  title: "Same-Day Delivery",
                  description: "Need a dumpster today? We offer same-day delivery for urgent projects and last-minute needs."
                },
                {
                  icon: Truck,
                  title: "Professional Pickup",
                  description: "Scheduled pickup service with professional drivers and modern equipment for safe, efficient service."
                },
                {
                  icon: Award,
                  title: "Recycling Programs",
                  description: "Environmentally responsible disposal with recycling options for appropriate materials and waste streams."
                },
                {
                  icon: Shield,
                  title: "Permit Assistance",
                  description: "Help navigating local permits and regulations for dumpster placement on public property or streets."
                }
              ].map((service) => (
                <Card key={service.title} className="text-center">
                  <CardHeader>
                                         <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-main/10">
                       <service.icon className="h-6 w-6 text-main" />
                     </div>
                    <CardTitle className="text-lg">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Service Categories Section */}
        <section className="container mx-auto px-4 py-24 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-4 bg-main/10 text-main border-main/20">
              Service Categories
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Specialized Solutions
            </h2>
            <p className="mt-6 text-lg text-muted-foreground">
              Tailored to different project types and requirements.
            </p>
          </div>
          
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
            {[
              {
                icon: Home,
                title: "Residential Dumpster Rental",
                description: "Perfect for home renovations, cleanouts, and landscaping projects. Available in multiple sizes to fit your needs.",
                features: ["10-40 yard containers", "Flexible rental periods", "Same-day delivery", "Homeowner-friendly pricing"]
              },
              {
                icon: Building,
                title: "Commercial Waste Solutions",
                description: "Comprehensive waste management for businesses, retail locations, and office buildings with scheduled pickups.",
                features: ["Regular pickup schedules", "Multiple container sizes", "Recycling programs", "Commercial pricing"]
              },
              {
                icon: Wrench,
                title: "Construction & Demolition",
                description: "Heavy-duty containers for construction debris, renovation waste, and demolition projects of any size.",
                features: ["Heavy debris handling", "Large capacity containers", "Job site delivery", "Permit assistance"]
              },
              {
                icon: Leaf,
                title: "Yard Waste & Landscaping",
                description: "Specialized containers for yard waste, tree trimming, and landscaping debris with eco-friendly disposal.",
                features: ["Organic waste disposal", "Seasonal availability", "Environmentally responsible", "Compost programs"]
              }
            ].map((service) => (
              <Card key={service.title} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-start gap-4">
                                         <div className="flex h-12 w-12 items-center justify-center rounded-full bg-main/10">
                       <service.icon className="h-6 w-6 text-main" />
                     </div>
                    <div className="space-y-1">
                      <CardTitle>{service.title}</CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                                                 <Check className="h-4 w-4 text-main" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="bg-muted/50 py-24 lg:py-32">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Ready to Get Started?
              </h2>
              <p className="mt-6 text-lg text-muted-foreground">
                Choose the right dumpster for your project and get professional waste management service you can count on.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                                 <Button asChild size="lg" className="bg-main hover:bg-main/90">
                   <Link href="/booking">
                     Get Free Quote
                   </Link>
                 </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/about">
                    Learn More About Us
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
      </div>
    </>
  )
}
