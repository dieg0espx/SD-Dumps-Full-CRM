import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.sddumpingsolutions.com'

  return {
    rules: [
      // Default rules for all crawlers
      {
        userAgent: '*',
        allow: [
          '/',
          '/about',
          '/services',
          '/contact',
          '/booking',
          '/guest-booking',
          '/service-areas',
          '/service-areas/*',
        ],
        disallow: [
          '/admin/',
          '/admin',
          '/api/',
          '/_next/',
          '/auth/',
          '/auth',
          '/profile/',
          '/profile',
          '/bookings/',
          '/bookings',
          '/payments/',
          '/payments',
          '/payment-methods/',
          '/payment-methods',
          '/payment/',
          '/chat/',
          '/chat',
          '/private/',
          '/dashboard/',
        ],
      },
      // Googlebot specific rules
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/about',
          '/services',
          '/contact',
          '/booking',
          '/guest-booking',
          '/service-areas',
          '/service-areas/*',
        ],
        disallow: [
          '/admin/',
          '/api/',
          '/_next/',
          '/auth/',
          '/profile/',
          '/bookings/',
          '/payments/',
          '/payment-methods/',
          '/payment/',
          '/chat/',
        ],
      },
      // Bingbot specific rules
      {
        userAgent: 'Bingbot',
        allow: [
          '/',
          '/about',
          '/services',
          '/contact',
          '/booking',
          '/guest-booking',
          '/service-areas',
          '/service-areas/*',
        ],
        disallow: [
          '/admin/',
          '/api/',
          '/_next/',
          '/auth/',
          '/profile/',
          '/bookings/',
          '/payments/',
          '/payment-methods/',
          '/payment/',
          '/chat/',
        ],
      },
      // GPTBot (OpenAI) - Allow public pages for AI training
      {
        userAgent: 'GPTBot',
        allow: [
          '/',
          '/about',
          '/services',
          '/contact',
          '/service-areas',
          '/service-areas/*',
          '/llms.txt',
        ],
        disallow: [
          '/admin/',
          '/api/',
          '/auth/',
          '/booking',
          '/guest-booking',
          '/profile/',
          '/bookings/',
          '/payments/',
          '/chat/',
        ],
      },
      // Claude-Web (Anthropic) - Allow public pages
      {
        userAgent: 'Claude-Web',
        allow: [
          '/',
          '/about',
          '/services',
          '/contact',
          '/service-areas',
          '/service-areas/*',
          '/llms.txt',
        ],
        disallow: [
          '/admin/',
          '/api/',
          '/auth/',
          '/booking',
          '/guest-booking',
          '/profile/',
          '/bookings/',
          '/payments/',
          '/chat/',
        ],
      },
      // CCBot (Common Crawl)
      {
        userAgent: 'CCBot',
        allow: [
          '/',
          '/about',
          '/services',
          '/contact',
          '/service-areas',
          '/service-areas/*',
        ],
        disallow: [
          '/admin/',
          '/api/',
          '/auth/',
          '/booking',
          '/guest-booking',
          '/profile/',
          '/bookings/',
          '/payments/',
          '/chat/',
        ],
      },
      // Allow AhrefsBot since you have Ahrefs analytics
      {
        userAgent: 'AhrefsBot',
        allow: ['/'],
        disallow: [
          '/admin/',
          '/api/',
          '/auth/',
          '/profile/',
          '/bookings/',
          '/payments/',
          '/chat/',
        ],
      },
      // Disallow bad bots
      {
        userAgent: 'MJ12bot',
        disallow: ['/'],
      },
      {
        userAgent: 'SemrushBot',
        disallow: ['/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
