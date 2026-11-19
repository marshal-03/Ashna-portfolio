import path from 'node:path'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Let phones on the home Wi-Fi load the dev server's scripts (e.g. http://192.168.1.15:3000).
  // Without this, `next dev` blocks them and the page shows with no animations. Dev only.
  allowedDevOrigins: ['192.168.1.*'],
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    // Pin the project root so a stray lockfile in a parent folder isn't picked up.
    root: path.join(__dirname),
  },
}

export default nextConfig
