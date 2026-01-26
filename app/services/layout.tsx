import type { Metadata } from 'next'

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

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
