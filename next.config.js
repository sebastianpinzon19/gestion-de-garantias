/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  env: {
    DATABASE_URL: process.env.VERCEL_DATABASE_URL || process.env.LOCAL_DATABASE_URL,
    APP_TITLE: 'Sistema de Gestión de Garantías'
  },
  
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    }
    return config
  },
  
  images: {
    domains: ['localhost', 'vercel.app'],
    unoptimized: process.env.NODE_ENV === 'development'
  },
  
  typescript: {
    ignoreBuildErrors: true
  },
  
  eslint: {
    ignoreDuringBuilds: true
  },

  // Configuración de páginas
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  
  // Headers de seguridad
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

  // Configuración de archivos estáticos
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
        destination: '/modules/seller/pages/dashboard',
        permanent: true,
      },
      {
        source: '/admin',
        destination: '/modules/admin/pages/dashboard',
        permanent: true,
      },
      {
        source: '/warranty',
        destination: '/modules/warranty/pages/formulario',
        permanent: true,
      },
    ]
  }
};

module.exports = nextConfig;
