import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Book Container Rental | Get Free Quote & Schedule',
  description: 'Book your container rental online. Get instant quotes, choose your delivery date, and schedule professional waste management services in San Diego. Fast, reliable, and convenient.',
  keywords: [
    'book container rental',
    'dumpster rental booking',
    'online booking',
    'instant quote',
    'schedule delivery',
    'waste management booking',
    'container rental quote',
    'San Diego booking'
  ],
  openGraph: {
    title: 'Book Container Rental | Get Free Quote & Schedule',
    description: 'Book your container rental online. Get instant quotes, choose your delivery date, and schedule professional waste management services in San Diego.',
    url: 'https://sddumps.com/booking',
    siteName: 'SD Dumps',
    images: [
      {
        url: '/miniature.png',
        width: 1200,
        height: 630,
        alt: 'Book Container Rental with SD Dumps',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Book Container Rental | Get Free Quote & Schedule',
    description: 'Book your container rental online. Get instant quotes, choose your delivery date, and schedule professional waste management services.',
    images: ['/miniature.png'],
  },
  alternates: {
    canonical: '/booking',
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

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
