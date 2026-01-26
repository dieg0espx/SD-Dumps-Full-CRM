import type { Metadata } from 'next'
import { BreadcrumbSchema } from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'Quick Dumpster Rental San Diego | Book Online Now | No Account Needed',
  description: 'Book dumpster rental San Diego instantly - no account required! Same day delivery for roll off containers, residential dumpster rental, and construction dumpsters. Fast, easy online booking.',
  keywords: [
    'dumpster rental san diego',
    'quick dumpster rental',
    'book dumpster online',
    'same day dumpster rental san diego',
    'roll off dumpster rental san diego',
    'residential dumpster rental san diego',
    'construction dumpster rental san diego',
    'fast dumpster delivery',
    'affordable dumpster rental san diego'
  ],
  openGraph: {
    title: 'Quick Dumpster Rental San Diego | Book Online - No Account Needed',
    description: 'Book dumpster rental San Diego instantly! Same day delivery, no account required. Roll off containers for any project.',
    url: 'https://www.sddumpingsolutions.com/guest-booking',
    siteName: 'SD Dumping Solutions',
    images: [
      {
        url: 'https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto/sddumps/miniature.png',
        width: 1200,
        height: 630,
        alt: 'SD Dumping Solutions Guest Booking',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Guest Booking | Book Without Account | SD Dumping Solutions',
    description: 'Book a container rental without creating an account. Quick and easy guest booking in San Diego.',
    images: ['https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto/sddumps/miniature.png'],
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

const breadcrumbs = [
  { name: 'Home', url: 'https://www.sddumpingsolutions.com' },
  { name: 'Guest Booking', url: 'https://www.sddumpingsolutions.com/guest-booking' }
]

export default function GuestBookingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      {children}
    </>
  )
}
