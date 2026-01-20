import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Payment Methods | SD Dumping Solutions',
  description: 'Manage your SD Dumping Solutions payment methods.',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

export default function PaymentMethodsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
