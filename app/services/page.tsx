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
  title: 'Dumpster Rental Services San Diego | Roll Off, Residential & Commercial | SD Dumping Solutions',
  description: 'Full-service dumpster rental San Diego: residential dumpster rental, commercial dumpster rental, construction dumpster rental, junk removal services, and dump trailer rental. Same day delivery. Call (760) 270-0312!',
  keywords: [
    'dumpster rental san diego',
    'san diego dumpster rental',
    'residential dumpster rental san diego',
    'commercial dumpster rental',
    'commercial trash dumpsters',
    'construction dumpster rental san diego',
    'roll off dumpster rental san diego',
    'junk removal services san diego',
    'garbage dumpster rental',
    'dump trailer rental',
    'same day dumpster rental san diego',
    'affordable dumpster rental san diego',
    'waste management san diego',
    '10 yard dumpster rental',
    'small dumpster rental near me'
  ],
  openGraph: {
    title: 'Dumpster Rental Services San Diego | Roll Off, Residential & Commercial',
    description: 'Full-service dumpster rental San Diego: residential, commercial, construction. Same day delivery available. Call (760) 270-0312!',
    url: 'https://sddumps.com/services',
    siteName: 'SD Dumping Solutions',
    images: [
      {
        url: 'https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto/sddumps/miniature.png',
        width: 1200,
        height: 630,
        alt: 'San Diego Dumpster Rental Services - Roll Off Containers',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dumpster Rental Services San Diego | SD Dumping Solutions',
    description: 'Residential, commercial & construction dumpster rental San Diego. Same day delivery. Affordable pricing.',
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
        <section className="relative pt-28 sm:pt-32 lg:pt-36 pb-16 sm:pb-20 lg:pb-24">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto/v1769107609/IMG_0405_fxcujh.heic')" }}
          />
          <div className="absolute inset-0 bg-black/70" />
          <div className="relative z-10 container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-4 bg-main/10 text-main border-main/20">
              Dumpster Rental San Diego
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              San Diego <span className="text-main">Dumpster Rental</span> Services
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Complete dumpster rental San Diego services: residential dumpster rental, commercial dumpster rental, construction dumpster rental, and junk removal services San Diego. Same day dumpster rental available!
            </p>
            <p className="mt-4 text-lg leading-8 text-gray-300">
              From small dumpster rental near me for home cleanouts to large roll off dumpster rental San Diego for major construction — we have the right solution.
            </p>

            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button asChild size="lg" className="bg-main hover:bg-main/90">
                <Link href="/booking">
                  Get Free Quote
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="bg-white border-white text-black hover:bg-gray-100">
                <Link href="/contact">
                  Call (760) 270-0312
                </Link>
              </Button>
            </div>
          </div>
          </div>
        </section>

        {/* Simple Process Section */}
        <section className="container mx-auto px-4 py-24 lg:py-32">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="outline" className="border-main text-main">
                  Easy Dumpster Rental
                </Badge>
                <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  How Our <span className="text-main">San Diego Dumpster Rental</span> Works
                </h2>
                <p className="text-lg text-muted-foreground">
                  Getting affordable dumpster rental San Diego is easy. Our simple 4-step process gets you a roll off dumpster when you need it — including same day dumpster rental San Diego.
                </p>
              </div>

              <div className="space-y-6">
                {[
                  {
                    step: "1",
                    title: "Get Your Free Quote",
                    description: "Call (760) 270-0312 or book online. We'll help you find the right size — from 10 yard dumpster rental to large construction containers."
                  },
                  {
                    step: "2",
                    title: "Same Day Dumpster Delivery",
                    description: "Pick your delivery date. Need it today? Same day dumpster rental San Diego available for orders placed before 2 PM."
                  },
                  {
                    step: "3",
                    title: "Fill Your Dumpster",
                    description: "Load your garbage dumpster rental at your pace. Standard rental is 3 days — extend if needed with flexible daily rates."
                  },
                  {
                    step: "4",
                    title: "We Pick Up & Haul Away",
                    description: "Call when you're done. Our waste management San Diego team handles pickup and responsible disposal."
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
                  src="https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto/v1769107606/IMG_0211_huq8x0.heic"
                  alt="Roll off dumpster rental San Diego - Same day delivery available"
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
                Full Service Waste Management San Diego
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                More Than Just Dumpster Rental
              </h2>
              <p className="mt-6 text-lg text-muted-foreground">
                Beyond roll off dumpster rental San Diego, we offer complete junk removal services San Diego and waste management solutions.
              </p>
            </div>

            <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: Clock,
                  title: "Same Day Dumpster Rental",
                  description: "Need a dumpster today in San Diego? Same day dumpster rental San Diego available for orders before 2 PM. Fast, reliable delivery."
                },
                {
                  icon: Truck,
                  title: "Junk Removal Services",
                  description: "Full junk removal services San Diego — we load and haul furniture, appliances, yard debris, and more. You don't lift a finger."
                },
                {
                  icon: Award,
                  title: "Dump Trailer Rental",
                  description: "Need a dump trailer rental for heavy materials? We offer specialized containers for concrete, dirt, and construction debris."
                },
                {
                  icon: Shield,
                  title: "Permit Assistance",
                  description: "Need your dumpster on the street? We help navigate San Diego permits and regulations for public placement."
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
              Dumpster Rental Services
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Dumpster Rental San Diego for Every Project
            </h2>
            <p className="mt-6 text-lg text-muted-foreground">
              From small dumpster rental near me for garage cleanouts to large construction dumpster rental San Diego — find the right size and service.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
            {[
              {
                icon: Home,
                title: "Residential Dumpster Rental San Diego",
                description: "Affordable dumpster rental San Diego for homeowners. Perfect for cleanouts, garage clearing, moving, and home renovations. Small dumpster rental near me available!",
                features: ["10 yard dumpster rental for small jobs", "2 yard dumpster rental near me available", "Same day dumpster rental San Diego", "Cheap dumpster rental San Diego pricing"]
              },
              {
                icon: Building,
                title: "Commercial Dumpster Rental",
                description: "Commercial trash dumpsters for businesses, restaurants, retail stores, and office buildings. Regular pickup schedules and commercial dumpster rental contracts available.",
                features: ["Commercial trash dumpsters all sizes", "Regular scheduled pickups", "Garbage dumpster rental contracts", "Waste management San Diego for business"]
              },
              {
                icon: Wrench,
                title: "Construction Dumpster Rental San Diego",
                description: "Heavy-duty roll off dumpster rental San Diego for construction sites, remodels, roofing projects, and demolition. The construction dumpster rental contractors trust.",
                features: ["Roll off dumpster rental San Diego", "Heavy debris & construction waste", "Large capacity containers", "Job site delivery & pickup"]
              },
              {
                icon: Leaf,
                title: "Junk Removal Services San Diego",
                description: "Full-service junk removal services San Diego. We load and haul away furniture, appliances, yard waste, and more. Garbage dumpster rental or full-service — you choose!",
                features: ["Junk removal services San Diego", "Yard waste & landscaping debris", "Furniture & appliance removal", "Dump trailer rental for heavy loads"]
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
                Get Your San Diego Dumpster Rental Today
              </h2>
              <p className="mt-6 text-lg text-muted-foreground">
                Ready for affordable dumpster rental San Diego? Whether you need residential dumpster rental San Diego, commercial trash dumpsters, or construction dumpster rental — call (760) 270-0312 or book online. Same day dumpster rental San Diego available!
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                                 <Button asChild size="lg" className="bg-main hover:bg-main/90">
                   <Link href="/booking">
                     Get Free Quote
                   </Link>
                 </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/contact">
                    Call (760) 270-0312
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
