import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  transpilePackages: ['@zoomus/websdk'],
  webpack: (config) => {
    // Fallbacks for node modules used by Zoom Web SDK
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
    };
    return config;
  },
  experimental: {
    // Required for Zoom Web SDK compatibility with Next.js
    //esmExternals: false,
  },
};

export default nextConfig;
