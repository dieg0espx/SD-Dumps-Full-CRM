import { MetadataRoute } from 'next'
import { cities } from '@/lib/cities'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.sddumpingsolutions.com'

  // Use specific dates for better SEO - update these when content changes
  const lastContentUpdate = new Date('2025-01-26')
  const servicesUpdate = new Date('2025-01-26')
  const staticPagesUpdate = new Date('2025-01-26')

  // Core pages
  const corePages: MetadataRoute.Sitemap = [
    // Homepage - Highest priority, frequently updated
    {
      url: baseUrl,
      lastModified: lastContentUpdate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    // Services - Core business page
    {
      url: `${baseUrl}/services`,
      lastModified: servicesUpdate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    // Booking - High conversion page
    {
      url: `${baseUrl}/booking`,
      lastModified: lastContentUpdate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    // Guest Booking - Alternative booking path
    {
      url: `${baseUrl}/guest-booking`,
      lastModified: lastContentUpdate,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    // Service Areas main page - Important for local SEO
    {
      url: `${baseUrl}/service-areas`,
      lastModified: lastContentUpdate,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    // Contact - Important for local SEO
    {
      url: `${baseUrl}/contact`,
      lastModified: staticPagesUpdate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // About - Trust and credibility page
    {
      url: `${baseUrl}/about`,
      lastModified: staticPagesUpdate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  // Generate service area city pages - Critical for local SEO
  const cityPages: MetadataRoute.Sitemap = cities.map((city) => ({
    url: `${baseUrl}/service-areas/${city.slug}`,
    lastModified: lastContentUpdate,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [...corePages, ...cityPages]
}
