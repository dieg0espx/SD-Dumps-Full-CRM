import type { Metadata } from 'next'
import { BookingPageSchema, BreadcrumbSchema } from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'Book Dumpster Rental San Diego | Same Day Delivery | Free Quote',
  description: 'Book your dumpster rental San Diego online. Same day delivery available! Get instant quotes for roll off containers, residential & commercial dumpster rental. Call (760) 270-0312.',
  keywords: [
    'dumpster rental san diego',
    'book dumpster rental',
    'same day dumpster rental san diego',
    'roll off dumpster rental san diego',
    'dumpster rental quote',
    'residential dumpster rental san diego',
    'commercial dumpster rental',
    'construction dumpster rental san diego',
    'cheap dumpster rental san diego',
    'affordable dumpster rental san diego'
  ],
  openGraph: {
    title: 'Book Dumpster Rental San Diego | Same Day Delivery Available',
    description: 'Book your dumpster rental San Diego online. Same day delivery! Roll off containers for residential & commercial projects. Call (760) 270-0312.',
    url: 'https://www.sddumpingsolutions.com/booking',
    siteName: 'SD Dumping Solutions',
    images: [
      {
        url: 'https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto/sddumps/miniature.png',
        width: 1200,
        height: 630,
        alt: 'Book Container Rental with SD Dumping Solutions',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Book Container Rental | Get Free Quote & Schedule',
    description: 'Book your container rental online. Get instant quotes, choose your delivery date, and schedule professional waste management services.',
    images: ['https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto/sddumps/miniature.png'],
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

const breadcrumbs = [
  { name: 'Home', url: 'https://www.sddumpingsolutions.com' },
  { name: 'Booking', url: 'https://www.sddumpingsolutions.com/booking' }
]

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <BookingPageSchema />
      <BreadcrumbSchema items={breadcrumbs} />
      {children}
    </>
  )
}
