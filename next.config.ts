import path from 'node:path'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    // Pin the project root so a stray lockfile in a parent folder isn't picked up.
    root: path.join(__dirname),
  },
}

export default nextConfig
