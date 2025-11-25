import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Complete Payment | SD Dumps',
  description: 'Complete your SD Dumps booking payment.',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

export default function PaymentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
