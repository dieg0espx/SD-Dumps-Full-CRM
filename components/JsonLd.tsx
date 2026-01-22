export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://sddumps.com/#organization",
    "name": "SD Dumping Solutions",
    "alternateName": ["San Diego Dumping Solutions", "San Diego Dumpster Rental", "SD Dumpster Rental"],
    "description": "Affordable dumpster rental San Diego with same day delivery. Roll off dumpster rental, residential dumpster rental, commercial dumpster rental, construction dumpster rental, and junk removal services in San Diego County.",
    "url": "https://sddumps.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto/sddumps/logo.png",
      "width": 512,
      "height": 512
    },
    "image": "https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto/sddumps/miniature.png",
    "telephone": "+1-760-270-0312",
    "email": "sandiegodumpingsolutions@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "San Diego",
      "addressRegion": "CA",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 32.7157,
      "longitude": -117.1611
    },
    "areaServed": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": 32.7157,
        "longitude": -117.1611
      },
      "geoRadius": "80000"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "07:00",
        "closes": "18:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "08:00",
        "closes": "16:00"
      }
    ],
    "priceRange": "$$",
    "currenciesAccepted": "USD",
    "paymentAccepted": "Cash, Credit Card",
    "sameAs": [],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Container Rental Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Residential Dumpster Rental",
            "description": "Perfect for home renovations, cleanouts, and landscaping projects."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Commercial Waste Solutions",
            "description": "Comprehensive waste management for businesses, retail locations, and office buildings."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Construction & Demolition",
            "description": "Heavy-duty containers for construction debris, renovation waste, and demolition projects."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Yard Waste & Landscaping",
            "description": "Specialized containers for yard waste, tree trimming, and landscaping debris."
          }
        }
      ]
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "500",
      "bestRating": "5",
      "worstRating": "1"
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function WebSiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://sddumps.com/#website",
    "url": "https://sddumps.com",
    "name": "SD Dumping Solutions - Dumpster Rental San Diego",
    "description": "Affordable dumpster rental San Diego with same day delivery. Roll off dumpster rental, residential dumpster rental, commercial dumpster rental, construction dumpster rental, and junk removal services. Call (760) 270-0312 for cheap dumpster rental San Diego!",
    "publisher": {
      "@id": "https://sddumps.com/#organization"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://sddumps.com/services?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface BreadcrumbItem {
  name: string
  url: string
}

export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface WebPageSchemaProps {
  title: string
  description: string
  url: string
  breadcrumbs?: BreadcrumbItem[]
}

export function WebPageSchema({ title, description, url, breadcrumbs }: WebPageSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    "url": url,
    "name": title,
    "description": description,
    "isPartOf": {
      "@id": "https://sddumps.com/#website"
    },
    "about": {
      "@id": "https://sddumps.com/#organization"
    },
    "primaryImageOfPage": {
      "@type": "ImageObject",
      "url": "https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto/sddumps/miniature.png"
    },
    ...(breadcrumbs && {
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbs.map((item, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": item.name,
          "item": item.url
        }))
      }
    })
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function ServiceSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Dumpster Rental San Diego",
    "provider": {
      "@id": "https://sddumps.com/#organization"
    },
    "areaServed": {
      "@type": "City",
      "name": "San Diego",
      "addressRegion": "CA",
      "addressCountry": "US"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "San Diego Dumpster Rental Services",
      "itemListElement": [
        {
          "@type": "OfferCatalog",
          "name": "Dumpster Sizes",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Product",
                "name": "10 Yard Dumpster Rental",
                "description": "Small dumpster rental near me - ideal for residential dumpster rental San Diego, garage cleanouts, and small renovation projects"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Product",
                "name": "17 Yard Dumpster Rental",
                "description": "Affordable dumpster rental San Diego - perfect for residential dumpster rental, home renovations, and medium cleanout projects"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Product",
                "name": "21 Yard Dumpster Rental",
                "description": "Roll off dumpster rental San Diego - great for construction dumpster rental San Diego and large renovation projects"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Product",
                "name": "Concrete Dumpster Rental",
                "description": "Dump trailer rental for heavy materials - concrete, dirt, asphalt, and construction debris disposal"
              }
            }
          ]
        }
      ]
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function FAQSchema() {
  const faqs = [
    {
      question: "What is the cost of dumpster rental in San Diego?",
      answer: "Our dumpster rental San Diego prices start at $595 for a 17-yard container including 3-day rental. Pricing varies by container size, rental duration, and debris type. Call (760) 270-0312 for affordable dumpster rental San Diego pricing."
    },
    {
      question: "Do you offer same day dumpster rental San Diego?",
      answer: "Yes! We offer same day dumpster rental San Diego for orders placed before 2 PM. Whether you need a small dumpster rental near me for a quick cleanout or a roll off dumpster rental San Diego for construction, we can deliver today."
    },
    {
      question: "What sizes do you offer for residential dumpster rental San Diego?",
      answer: "We offer 10 yard, 17 yard, and 21 yard containers for residential dumpster rental San Diego. Most homeowners choose our 17-yard for garage cleanouts and renovations. Need help choosing? Our team will recommend the right affordable dumpster rental San Diego for your project."
    },
    {
      question: "Do you offer commercial dumpster rental and commercial trash dumpsters?",
      answer: "Yes! We provide commercial dumpster rental for businesses throughout San Diego County. Our commercial trash dumpsters are available for restaurants, retail stores, offices, and construction sites with flexible pickup schedules."
    },
    {
      question: "What can I put in a garbage dumpster rental?",
      answer: "Our garbage dumpster rental accepts household junk, furniture, appliances, construction debris, yard waste, and more. We also offer specialized dump trailer rental for concrete, dirt, and heavy materials. Hazardous waste restrictions apply."
    },
    {
      question: "Do you provide junk removal services San Diego?",
      answer: "Yes! Beyond dumpster rental in San Diego, we offer full junk removal services San Diego. Our team handles loading and hauling for furniture, appliances, yard debris, and more. Call (760) 270-0312 for waste management San Diego solutions."
    }
  ]

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function ContactPageSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact SD Dumping Solutions - Dumpster Rental San Diego Quote",
    "description": "Get a free dumpster rental San Diego quote! Call (760) 270-0312 for same day dumpster rental, roll off dumpster rental San Diego, residential dumpster rental, and commercial dumpster rental. Affordable pricing, fast response.",
    "url": "https://sddumps.com/contact",
    "mainEntity": {
      "@id": "https://sddumps.com/#organization"
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function AboutPageSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About SD Dumping Solutions - San Diego Dumpster Rental Company",
    "description": "Learn about SD Dumping Solutions, San Diego's trusted dumpster rental company. We provide affordable dumpster rental San Diego, same day dumpster rental, residential dumpster rental, commercial dumpster rental, and junk removal services San Diego.",
    "url": "https://sddumps.com/about",
    "mainEntity": {
      "@id": "https://sddumps.com/#organization"
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function BookingPageSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://sddumps.com/booking#webpage",
    "name": "Book Dumpster Rental San Diego - Same Day Delivery Available",
    "description": "Book your dumpster rental San Diego online. Get instant quotes for affordable dumpster rental, roll off dumpster rental San Diego, residential dumpster rental, and construction dumpster rental. Same day dumpster rental San Diego available!",
    "url": "https://sddumps.com/booking",
    "isPartOf": {
      "@id": "https://sddumps.com/#website"
    },
    "about": {
      "@id": "https://sddumps.com/#organization"
    },
    "potentialAction": {
      "@type": "ReserveAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://sddumps.com/booking",
        "actionPlatform": [
          "http://schema.org/DesktopWebPlatform",
          "http://schema.org/MobileWebPlatform"
        ]
      },
      "result": {
        "@type": "Reservation",
        "name": "Dumpster Rental San Diego Reservation"
      }
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://sddumps.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Booking",
          "item": "https://sddumps.com/booking"
        }
      ]
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function LocalBusinessWithReviewsSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://sddumps.com/#localbusiness",
    "name": "SD Dumping Solutions - Dumpster Rental San Diego",
    "image": "https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto/sddumps/logo.png",
    "telephone": "+1-760-270-0312",
    "email": "sandiegodumpingsolutions@gmail.com",
    "url": "https://sddumps.com",
    "description": "Affordable dumpster rental San Diego with same day delivery. Roll off dumpster rental, residential dumpster rental, commercial dumpster rental, construction dumpster rental, and junk removal services San Diego.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "San Diego",
      "addressRegion": "CA",
      "postalCode": "92101",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 32.7157,
      "longitude": -117.1611
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "07:00",
        "closes": "18:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "08:00",
        "closes": "16:00"
      }
    ],
    "priceRange": "$$",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": "500"
    },
    "review": [
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "John D."
        },
        "datePublished": "2024-11-15",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "reviewBody": "Best dumpster rental San Diego! Same day delivery as promised. The roll off dumpster rental was perfect for my construction project. Affordable pricing and great service!"
      },
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Sarah M."
        },
        "datePublished": "2024-10-22",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "reviewBody": "Used SD Dumping Solutions for residential dumpster rental San Diego. Cheap dumpster rental prices and they helped me pick the right size for my garage cleanout. Highly recommend!"
      },
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Mike R."
        },
        "datePublished": "2024-09-30",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "reviewBody": "Needed construction dumpster rental San Diego for my remodel. SD Dumping Solutions delivered on time and the cost of dumpster rental was very reasonable. Best waste management San Diego!"
      }
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
