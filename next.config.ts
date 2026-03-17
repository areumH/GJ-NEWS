import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: false,
  cacheComponents: true,
  async rewrites() {
    return [
      {
        source: '/naver-api/:path*',
        destination: 'https://openapi.naver.com/:path*',
      },
    ];
  },
};

export default nextConfig;
