import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**', // Permite qualquer hostname HTTPS
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
