import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Chat Support | SD Dumps',
  description: 'Chat with SD Dumps support team.',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
