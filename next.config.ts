import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: false,
  cacheComponents: true,
  // 미지정 시와 같은 기존 동작(동적 데이터까지 prefetch). true(Instant Navigations)는 별도로 검토
  partialPrefetching: false,
  reactCompiler: true,
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
};

export default nextConfig;
