// next.config.ts
import path from 'path';
import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http',  hostname: 'localhost' },
    ],
  },
  experimental: {
    serverActions: {},
    optimizePackageImports: ['@vercel/speed-insights','next-auth','framer-motion'],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': path.resolve(__dirname),
    };
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/signup',
        destination: '/auth?screen_hint=signup',
      },
    ];
  },
};

export default nextConfig;
