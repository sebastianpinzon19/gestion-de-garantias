/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    APP_TITLE: 'Warranty Management System'
  },
  
  webpack: (config, { isServer }) => {
    const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

    config.plugins.push(new NodePolyfillPlugin());
    config.externals = [...config.externals, 'bcrypt'];

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        child_process: false,
        module: false,
      };
    }

    return config;
  },
  
  images: {
    domains: ['localhost'],
    unoptimized: process.env.NODE_ENV === 'development'
  },
  
  typescript: {
    ignoreBuildErrors: true
  },
  
  eslint: {
    ignoreDuringBuilds: true
  },

  // Page configuration
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],
  
  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          }
        ]
      }
    ]
  },

  // Static files configuration
  async rewrites() {
    return [
      {
        source: '/favicon.ico',
        destination: '/public/favicon.ico'
      },
      {
        source: '/icon.png',
        destination: '/public/icon.png'
      },
      {
        source: '/apple-icon.png',
        destination: '/public/apple-icon.png'
      }
    ]
  },

  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/dashboard',
        permanent: true,
      },
      {
        source: '/admin',
        destination: '/admin/dashboard',
        permanent: true,
      },
      {
        source: '/warranty',
        destination: '/warranty-form',
        permanent: true,
      },
    ]
  },

  output: 'standalone',
};

module.exports = nextConfig;
