import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Dashboard | SD Dumps',
  description: 'SD Dumps admin dashboard for managing bookings, users, and business operations.',
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
    noimageindex: true,
    googleBot: {
      index: false,
      follow: false,
      noarchive: true,
      nosnippet: true,
      noimageindex: true,
    },
  },
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
