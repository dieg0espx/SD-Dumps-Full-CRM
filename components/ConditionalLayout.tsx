"use client"

import { usePathname } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MobileCTA from '@/components/MobileCTA'

interface ConditionalLayoutProps {
  children: React.ReactNode
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith('/admin')
  const isBookingRoute = pathname === '/booking'
  const isAuthRoute = pathname?.startsWith('/auth')

  if (isAdminRoute) {
    return <>{children}</>
  }

  return (
    <>
      <Header />
      <main className="pb-14 md:pb-0">
        {children}
      </main>
      {!isBookingRoute && <Footer />}
      {!isBookingRoute && !isAuthRoute && <MobileCTA />}
    </>
  )
}
