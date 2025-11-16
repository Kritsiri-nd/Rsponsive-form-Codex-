import type { NextConfig } from 'next'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
type RemotePattern = {
  protocol: 'http' | 'https'
  hostname: string
  pathname: string
}
let remotePatterns: RemotePattern[] = []

if (supabaseUrl) {
  try {
    const { hostname } = new URL(supabaseUrl)
    remotePatterns = [
      {
        protocol: 'https',
        hostname,
        pathname: '/storage/v1/object/public/**',
      },
    ]
  } catch (error) {
    console.warn('[next.config] Invalid NEXT_PUBLIC_SUPABASE_URL for image remote pattern', error)
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
  },
}

export default nextConfig
