import type { Metadata } from 'next'
import { ContactPageSchema, BreadcrumbSchema } from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'Contact Us | San Diego Dumpster Rental Quote | SD Dumping Solutions',
  description: 'Get a free dumpster rental San Diego quote! Call (760) 270-0312 for same day dumpster rental, roll off containers, residential & commercial dumpster rental. Affordable pricing, fast response.',
  keywords: [
    'dumpster rental san diego',
    'san diego dumpster rental',
    'dumpster rental quote',
    'same day dumpster rental san diego',
    'affordable dumpster rental san diego',
    'roll off dumpster rental san diego',
    'residential dumpster rental san diego',
    'commercial dumpster rental',
    'junk removal services san diego',
    'waste management san diego',
    'cheap dumpster rental san diego',
    'cost of dumpster rental'
  ],
  openGraph: {
    title: 'Contact Us | San Diego Dumpster Rental Quote | SD Dumping Solutions',
    description: 'Get a free dumpster rental San Diego quote! Call (760) 270-0312 for same day delivery. Affordable residential & commercial dumpster rental.',
    url: 'https://sddumps.com/contact',
    siteName: 'SD Dumping Solutions',
    images: [
      {
        url: 'https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto/sddumps/miniature.png',
        width: 1200,
        height: 630,
        alt: 'Contact SD Dumping Solutions - San Diego Dumpster Rental',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us | San Diego Dumpster Rental Quote',
    description: 'Get a free dumpster rental quote! Call (760) 270-0312. Same day delivery in San Diego.',
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
