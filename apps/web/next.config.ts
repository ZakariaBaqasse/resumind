import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname:"api.dicebear.com"
      }
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: "standalone",
}

export default nextConfig
