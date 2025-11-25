import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Payment Methods | SD Dumps',
  description: 'Manage your SD Dumps payment methods.',
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
