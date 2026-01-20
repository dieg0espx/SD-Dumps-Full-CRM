import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In | SD Dumping Solutions Account Access',
  description: 'Sign in to your SD Dumping Solutions account to manage your container rentals, view bookings, and access your payment history. Secure and easy account access.',
  keywords: [
    'sign in',
    'login',
    'account access',
    'SD Dumping Solutions login',
    'container rental account',
    'waste management login',
    'customer portal',
    'booking management'
  ],
  openGraph: {
    title: 'Sign In | SD Dumping Solutions Account Access',
    description: 'Sign in to your SD Dumping Solutions account to manage your container rentals, view bookings, and access your payment history.',
    url: 'https://sddumps.com/auth/login',
    siteName: 'SD Dumping Solutions',
    images: [
      {
        url: 'https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto/sddumps/miniature.png',
        width: 1200,
        height: 630,
        alt: 'SD Dumping Solutions Account Sign In',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sign In | SD Dumping Solutions Account Access',
    description: 'Sign in to your SD Dumping Solutions account to manage your container rentals and bookings.',
    images: ['https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto/sddumps/miniature.png'],
  },
  alternates: {
    canonical: '/auth/login',
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
