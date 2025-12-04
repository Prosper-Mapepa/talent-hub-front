import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: '**', // Allow images from any HTTPS domain (for Railway backend)
      },
    ],
  },
  output: 'standalone', // Optimize for production deployment
  eslint: {
    ignoreDuringBuilds: true, // Temporarily ignore ESLint errors during build
  },
  typescript: {
    ignoreBuildErrors: false, // Keep TypeScript errors
  },
  /* config options here */
};

export default nextConfig;
