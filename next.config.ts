import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'
const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
  env: {
    STORAGE_API_URL: process.env.STORAGE_API_URL,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '1000mb',
    },
    proxyClientMaxBodySize: '1000mb',
  },
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
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
