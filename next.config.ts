import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'img.youtube.com' },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/hls/:path*',
        destination: 'https://d1jv9wshenfzip.cloudfront.net/audio/hls/:path*',
      },
    ];
  },
};

export default nextConfig;
