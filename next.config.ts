import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i1.sndcdn.com',
      },
    ],
  },
}

export default nextConfig
