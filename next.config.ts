import type { NextConfig } from 'next'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
let remotePatterns: NextConfig['images'] extends infer T ? T extends { remotePatterns: infer R } ? R : never : never = []

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
