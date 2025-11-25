import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Guest Booking | Book Without Account | SD Dumps',
  description: 'Book a container rental without creating an account. Quick and easy guest booking for dumpster rentals in San Diego. No registration required.',
  keywords: [
    'guest booking',
    'book without account',
    'quick dumpster rental',
    'no registration booking',
    'San Diego dumpster',
    'fast container rental',
    'easy waste management booking'
  ],
  openGraph: {
    title: 'Guest Booking | Book Without Account | SD Dumps',
    description: 'Book a container rental without creating an account. Quick and easy guest booking for dumpster rentals in San Diego.',
    url: 'https://sddumps.com/guest-booking',
    siteName: 'SD Dumps',
    images: [
      {
        url: '/miniature.png',
        width: 1200,
        height: 630,
        alt: 'SD Dumps Guest Booking',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Guest Booking | Book Without Account | SD Dumps',
    description: 'Book a container rental without creating an account. Quick and easy guest booking in San Diego.',
    images: ['/miniature.png'],
  },
  alternates: {
    canonical: '/guest-booking',
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

export default function GuestBookingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
