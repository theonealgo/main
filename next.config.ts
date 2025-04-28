// next.config.ts

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
  experimental: {
    serverActions: {}, // ✅ Must be an object, not `true`
    optimizePackageImports: [
      '@vercel/speed-insights',
      'next-auth',
      'framer-motion',
    ],
  },
};

export default nextConfig;
