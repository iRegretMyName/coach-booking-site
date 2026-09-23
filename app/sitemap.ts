import type { MetadataRoute } from 'next'

const baseUrl = 'https://coach-booking-site-mocha.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
  return ['', '/about', '/services', '/book', '/Blog', '/resources', '/contact'].map((path) => ({ url: `${baseUrl}${path}`, lastModified: new Date(), changeFrequency: 'weekly', priority: path === '' ? 1 : .7 }))
}
