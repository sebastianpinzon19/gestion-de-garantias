let userConfig = undefined
try {
  // try to import ESM first
  userConfig = await import('./v0-user-next.config.mjs')
} catch (e) {
  try {
    // fallback to CJS import
    userConfig = await import("./v0-user-next.config");
  } catch (innerError) {
    // ignore error
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  logging: {
    level: 'verbose'
  },
  output: 'export',
  trailingSlash: true,
  env: {
    DATABASE_URL: process.env.VERCEL_DATABASE_URL || process.env.LOCAL_DATABASE_URL
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
  images: {
    domains: ['localhost'],
    unoptimized: true
  },
  experimental: {
    webpackBuildWorker: true,
    optimizePackageImports: ['@radix-ui/react-icons'],
    serverActions: true,
    optimizeServerReact: true
  },
  postcss: {
    plugins: {
      'tailwindcss': {},
      'autoprefixer': {},
    },
  }
}

if (userConfig) {
  // ESM imports will have a "default" property
  const config = userConfig.default || userConfig

  for (const key in config) {
    if (
      typeof nextConfig[key] === 'object' &&
      !Array.isArray(nextConfig[key])
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...config[key],
      }
    } else {
      nextConfig[key] = config[key]
    }
  }
}

export default nextConfig
