import path from 'path';
import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  trailingSlash: false, // helps Vercel flush path cache
  output: 'standalone', // ensures full build output gets redeployed
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: 'localhost' },
    ],
  },
  experimental: {
    serverActions: {},
    optimizePackageImports: ['@vercel/speed-insights', 'next-auth', 'framer-motion'],
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
  generateBuildId: async () => {
    // Forces a unique ID so Vercel doesn't reuse previous build artifacts
    return `${Date.now()}`;
  },
};

export default nextConfig;
