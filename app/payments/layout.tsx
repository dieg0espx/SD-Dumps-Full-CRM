import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Payment History | SD Dumping Solutions',
  description: 'View your SD Dumping Solutions payment history.',
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
