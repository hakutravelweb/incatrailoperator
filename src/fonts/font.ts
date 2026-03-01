import localFont from 'next/font/local'

export const Outfit = localFont({
  src: './Outfit.woff2',
  display: 'swap',
  weight: '100 900',
  style: 'normal',
  fallback: ['arial', 'sans-serif'],
  adjustFontFallback: false,
  preload: true,
})
