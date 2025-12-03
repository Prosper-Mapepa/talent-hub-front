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
  /* config options here */
};

export default nextConfig;
