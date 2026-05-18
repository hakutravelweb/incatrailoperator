import { MetadataRoute } from 'next'

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  return {
    name: 'Inca Trail Operator',
    short_name: 'Incatrailoperator',
    start_url: '/',
    display: 'standalone',
    theme_color: '#FF5533',
    background_color: '#FF5533',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/icon?small',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/icon?large',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon?huge',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
