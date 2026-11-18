// Public address of the site, used for link previews and the sitemap.
// Set NEXT_PUBLIC_SITE_URL for a custom domain; on Vercel the production URL is used otherwise.
const fromEnv =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : undefined)

export const siteUrl = (fromEnv ?? 'http://localhost:3000').replace(/\/$/, '')
