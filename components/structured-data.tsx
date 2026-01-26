import Script from 'next/script'

interface StructuredDataProps {
  type: 'organization' | 'service' | 'localBusiness' | 'website'
  data?: any
}

export function StructuredData({ type, data }: StructuredDataProps) {
  const baseData = {
    '@context': 'https://schema.org',
    '@type': type,
  }

  const structuredData = {
    ...baseData,
    ...data,
  }

  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  )
}

export function OrganizationSchema() {
  return (
    <StructuredData
      type="organization"
      data={{
        name: 'SD Dumping Solutions',
        url: 'https://www.sddumpingsolutions.com',
        logo: 'https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto/sddumps/miniature.png',
        description: 'Professional container rental services for construction, renovation, and waste management in San Diego.',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'San Diego',
          addressRegion: 'CA',
          addressCountry: 'US',
        },
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+1-760-270-0312',
          contactType: 'customer service',
          availableLanguage: 'English',
        },
        sameAs: [
          'https://www.facebook.com/sddumps',
          'https://www.linkedin.com/company/sd-dumps',
        ],
      }}
    />
  )
}

export function LocalBusinessSchema() {
  return (
    <StructuredData
      type="localBusiness"
      data={{
        name: 'SD Dumping Solutions',
        description: 'Professional container rental and waste management services in San Diego County.',
        url: 'https://www.sddumpingsolutions.com',
        telephone: '+1-760-270-0312',
        email: 'sandiegodumpingsolutions@gmail.com',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'San Diego',
          addressRegion: 'CA',
          addressCountry: 'US',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 32.7157,
          longitude: -117.1611,
        },
        openingHours: [
          'Mo-Fr 07:00-18:00',
          'Sa 08:00-16:00',
        ],
        priceRange: '$$',
        areaServed: {
          '@type': 'City',
          name: 'San Diego County',
        },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Container Rental Services',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Residential Dumpster Rental',
                description: 'Container rental for home renovations and cleanouts',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Commercial Waste Solutions',
                description: 'Waste management for businesses and construction projects',
              },
            },
          ],
        },
      }}
    />
  )
}

export function ServiceSchema() {
  return (
    <StructuredData
      type="service"
      data={{
        name: 'Container Rental Services',
        description: 'Professional container rental services for construction, renovation, and waste management.',
        provider: {
          '@type': 'Organization',
          name: 'SD Dumping Solutions',
        },
        areaServed: {
          '@type': 'City',
          name: 'San Diego County',
        },
        serviceType: 'Waste Management',
        category: 'Construction Services',
        offers: {
          '@type': 'Offer',
          priceCurrency: 'USD',
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            priceCurrency: 'USD',
          },
        },
      }}
    />
  )
}

export function WebsiteSchema() {
  return (
    <StructuredData
      type="website"
      data={{
        name: 'SD Dumping Solutions',
        url: 'https://www.sddumpingsolutions.com',
        description: 'Professional container rental services for construction, renovation, and waste management in San Diego.',
        publisher: {
          '@type': 'Organization',
          name: 'SD Dumping Solutions',
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://www.sddumpingsolutions.com/search?q={search_term_string}',
          },
          'query-input': 'required name=search_term_string',
        },
      }}
    />
  )
}
