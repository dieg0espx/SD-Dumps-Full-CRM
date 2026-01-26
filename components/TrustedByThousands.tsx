'use client'

import React, { useEffect, useState, useRef } from 'react'
import { CheckCircle2 } from 'lucide-react'

function AnimatedCounter({ end, suffix = '', prefix = '', duration = 2000 }: { end: number, suffix?: string, prefix?: string, duration?: number }) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    let startTime: number
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * end))
      if (progress < 1) {
        requestAnimationFrame(step)
      }
    }

    requestAnimationFrame(step)
  }, [isVisible, end, duration])

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>
}

export default function TrustedByThousands() {
  const stats = [
    { value: 5000, suffix: '+', label: 'Dumpsters Delivered' },
    { value: 10, suffix: ' Years', label: 'Serving San Diego' },
    { value: 4.9, suffix: '★', label: 'Average Rating' },
  ]

  const features = [
    'Same-day delivery available',
    'Transparent pricing, no hidden fees',
    'Family-owned & locally operated',
  ]

  return (
    <section className="py-16 sm:py-20 bg-main">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 tracking-tight">
            Trusted by Thousands Across <span className="text-white/80">San Diego</span>
          </h2>
          <p className="text-white/70 text-base sm:text-lg max-w-2xl mx-auto">
            Join thousands of satisfied customers who chose SD Dumping Solutions for reliable, affordable dumpster rental.
          </p>
        </div>

        {/* Stats row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16 lg:gap-24 mb-10">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-1 tracking-tight">
                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-white/70 text-sm sm:text-base font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/20 mb-10" />

        {/* Features row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-white/90">
              <CheckCircle2 className="w-5 h-5 text-white flex-shrink-0" />
              <span className="text-sm sm:text-base">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
