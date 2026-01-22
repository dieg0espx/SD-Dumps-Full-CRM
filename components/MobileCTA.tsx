'use client'

import React from 'react'
import Link from 'next/link'
import { Phone, Calendar } from 'lucide-react'

export default function MobileCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-gray-200 shadow-lg">
      <div className="flex">
        <a
          href="tel:+17602700312"
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-900 text-white font-semibold text-sm"
        >
          <Phone className="w-4 h-4" />
          Call Now
        </a>
        <Link
          href="/booking"
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-main text-white font-semibold text-sm"
        >
          <Calendar className="w-4 h-4" />
          Book Online
        </Link>
      </div>
    </div>
  )
}
