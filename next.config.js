/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  
  env: {
    DATABASE_URL: process.env.VERCEL_DATABASE_URL || process.env.LOCAL_DATABASE_URL
  },
  
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
  
  images: {
    domains: ['localhost'],
    unoptimized: false
  },
  
  experimental: {
    webpackBuildWorker: true,
    serverActions: true
  },
  
  typescript: {
    ignoreBuildErrors: true
  },
  
  eslint: {
    ignoreDuringBuilds: true
  },
  
  postcss: {
    plugins: {
      'tailwindcss': {},
      'autoprefixer': {},
    },
  }
};
