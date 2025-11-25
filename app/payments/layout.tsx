import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Payment History | SD Dumps',
  description: 'View your SD Dumps payment history.',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

export default function PaymentsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
