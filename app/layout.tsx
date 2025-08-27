import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ConditionalLayout } from '@/components/ConditionalLayout'

export const metadata: Metadata = {
  title: {
    default: 'SD Dumps - Professional Container Rental Services',
    template: '%s | SD Dumps'
  },
  description: 'Professional container rental services for construction, renovation, and waste management. Fast delivery, competitive pricing, and reliable service across San Diego.',
  keywords: [
    'container rental',
    'dumpster rental',
    'construction waste',
    'renovation debris',
    'waste management',
    'San Diego',
    'construction containers',
    'roll-off containers',
    'debris removal',
    'construction cleanup'
  ],
  authors: [{ name: 'SD Dumps' }],
  creator: 'SD Dumps',
  publisher: 'SD Dumps',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://sddumps.com'),
  alternates: {
    canonical: '/',
  },
      openGraph: {
      type: 'website',
      locale: 'en_US',
      url: 'https://sddumps.com',
      siteName: 'SD Dumps',
      title: 'SD Dumps - Professional Container Rental Services',
      description: 'Professional container rental services for construction, renovation, and waste management. Fast delivery, competitive pricing, and reliable service across San Diego.',
      images: [
        {
          url: '/miniature.png',
          width: 1200,
          height: 630,
          alt: 'SD Dumps - Professional Container Rental Services',
        },
      ],
    },
      twitter: {
      card: 'summary_large_image',
      title: 'SD Dumps - Professional Container Rental Services',
      description: 'Professional container rental services for construction, renovation, and waste management. Fast delivery, competitive pricing, and reliable service across San Diego.',
      images: ['/miniature.png'],
      creator: '@sddumps',
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
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  category: 'construction services',
  classification: 'business',
  referrer: 'origin-when-cross-origin',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  icons: {
    icon: [
      { url: '/favicon/favicon.ico' },
      { url: '/favicon/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/favicon/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/favicon/favicon.svg', color: '#000000' },
    ],
  },
  manifest: '/site.webmanifest',
  other: {
    'msapplication-TileColor': '#000000',
    'msapplication-config': '/browserconfig.xml',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="application-name" content="SD Dumps" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SD Dumps" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body>
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  )
}
