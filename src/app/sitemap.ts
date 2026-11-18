import type { MetadataRoute } from 'next'
import { siteUrl } from '@/data/site'
import { works } from '@/data/works'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, priority: 1 },
    { url: `${siteUrl}/work`, priority: 0.9 },
    ...works.map((w) => ({ url: `${siteUrl}/work/${w.slug}`, priority: 0.7 })),
  ]
}
