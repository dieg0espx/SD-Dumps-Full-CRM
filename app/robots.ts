import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/api/',
        '/_next/',
        '/private/',
        '/dashboard/',
        '/profile/',
        '/bookings/',
        '/payments/',
        '/chat/',
      ],
    },
    sitemap: 'https://sddumps.com/sitemap.xml',
  }
}
