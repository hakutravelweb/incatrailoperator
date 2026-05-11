import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'
const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
  env: {
    STORAGE_API_URL: process.env.STORAGE_API_URL,
    APP_URL: process.env.APP_URL,
  },
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '100000mb',
      allowedOrigins: [process.env.APP_URL!],
    },
    proxyClientMaxBodySize: '100000mb',
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      use: ['@svgr/webpack'],
    })
    return config
  },
}

export default withNextIntl(nextConfig)
