import type { Metadata } from 'next'
import { ContactPageSchema, BreadcrumbSchema } from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'Contact SD Dumps | Get Free Quote & Support',
  description: 'Contact SD Dumps for professional waste management services. Get free quotes, schedule pickups, or get support. Serving San Diego County with 24/7 availability.',
  keywords: [
    'contact SD Dumps',
    'dumpster rental quote',
    'waste management contact',
    'San Diego dumpster service',
    'container rental support',
    'schedule dumpster pickup',
    'waste disposal inquiry'
  ],
  openGraph: {
    title: 'Contact SD Dumps | Get Free Quote & Support',
    description: 'Contact SD Dumps for professional waste management services. Get free quotes, schedule pickups, or get support. Serving San Diego County.',
    url: 'https://sddumps.com/contact',
    siteName: 'SD Dumps',
    images: [
      {
        url: 'https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto/sddumps/miniature.png',
        width: 1200,
        height: 630,
        alt: 'Contact SD Dumps',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact SD Dumps | Get Free Quote & Support',
    description: 'Contact SD Dumps for professional waste management services. Get free quotes and schedule pickups in San Diego.',
    images: ['https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto/sddumps/miniature.png'],
  },
  alternates: {
    canonical: '/contact',
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

const breadcrumbs = [
  { name: 'Home', url: 'https://sddumps.com' },
  { name: 'Contact', url: 'https://sddumps.com/contact' }
]

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <ContactPageSchema />
      <BreadcrumbSchema items={breadcrumbs} />
      {children}
    </>
  )
}
