import { MetadataRoute } from 'next'

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  return {
    name: 'IncaTrailOperator',
    short_name: 'ITO',
    start_url: '/',
    display: 'standalone',
    theme_color: '#ff5533',
    background_color: '#ff5533',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
