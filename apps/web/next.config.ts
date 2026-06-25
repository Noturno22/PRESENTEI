import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@presentei/shared', '@presentei/api-client'],
};

export default nextConfig;
