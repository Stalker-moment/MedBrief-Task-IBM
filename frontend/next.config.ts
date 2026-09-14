import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@medibrief/shared'],
  reactStrictMode: true,
};

export default nextConfig;
