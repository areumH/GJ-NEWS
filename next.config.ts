import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: '/naver-api/:path*',
        destination: 'https://openapi.naver.com/:path*',
      },
      {
        source: '/google-api/:path*',
        destination: 'https://language.googleapis.com/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
