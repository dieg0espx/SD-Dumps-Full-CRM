export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://sddumps.com/#organization",
    "name": "SD Dumps",
    "alternateName": "San Diego Dumping Solutions",
    "description": "Professional container rental services for construction, renovation, and waste management in San Diego County.",
    "url": "https://sddumps.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://sddumps.com/logo.png",
      "width": 512,
      "height": 512
    },
    "image": "https://sddumps.com/miniature.png",
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
    "name": "SD Dumps",
    "description": "Professional container rental services for construction, renovation, and waste management in San Diego.",
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
      "url": "https://sddumps.com/miniature.png"
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
    "serviceType": "Dumpster Rental",
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
      "name": "Container Rental Services",
      "itemListElement": [
        {
          "@type": "OfferCatalog",
          "name": "Container Sizes",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Product",
                "name": "10 Yard Dumpster",
                "description": "Ideal for small projects and cleanouts"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Product",
                "name": "20 Yard Dumpster",
                "description": "Perfect for medium-sized renovations"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Product",
                "name": "30 Yard Dumpster",
                "description": "Great for large construction projects"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Product",
                "name": "40 Yard Dumpster",
                "description": "Maximum capacity for major demolition"
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
      question: "How quickly can you deliver a dumpster?",
      answer: "We offer same-day delivery for most areas. Contact us early in the day for the best availability."
    },
    {
      question: "What size dumpster do I need for my project?",
      answer: "Our team can help you choose the right size based on your project type and scope. We offer containers from 10 to 40 yards."
    },
    {
      question: "Do you handle permits for street placement?",
      answer: "Yes, we can assist with permit applications for placing dumpsters on public property or streets."
    },
    {
      question: "What materials can I put in the dumpster?",
      answer: "We accept most construction debris, household items, and general waste. Hazardous materials and certain items may have restrictions."
    },
    {
      question: "How long can I keep the dumpster?",
      answer: "We offer flexible rental periods to suit your project needs. Standard rentals are typically 7-14 days, but we can accommodate longer periods."
    },
    {
      question: "What areas do you serve?",
      answer: "We proudly serve San Diego County and surrounding communities."
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
    "name": "Contact SD Dumps",
    "description": "Contact SD Dumps for professional waste management services. Get free quotes, schedule pickups, or get support.",
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
    "name": "About SD Dumps",
    "description": "Learn about SD Dumps, a trusted waste management company with over 10 years of experience providing professional dumpster rental services in San Diego.",
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
