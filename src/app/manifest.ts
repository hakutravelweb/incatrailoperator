import { MetadataRoute } from 'next'

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  return {
    name: 'InCaTrailOperator',
    short_name: 'IJ',
    start_url: '/',
    display: 'standalone',
    theme_color: '#ff5533',
    background_color: '#FFFFFF',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
