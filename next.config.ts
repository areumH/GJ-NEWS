import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: '/naver-api/:path*',
        destination: 'https://openapi.naver.com/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
