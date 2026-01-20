import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Bookings | SD Dumping Solutions',
  description: 'View and manage your SD Dumping Solutions container rental bookings.',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

export default function BookingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
