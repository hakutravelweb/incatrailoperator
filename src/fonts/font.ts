import localFont from 'next/font/local'

export const GTEesti = localFont({
  src: [
    {
      path: './GT-Eesti-Regular.woff2',
      weight: '400',
    },
    {
      path: './GT-Eesti-Medium.woff2',
      weight: '500',
    },
    {
      path: './GT-Eesti-Bold.woff2',
      weight: '700',
    },
  ],
  display: 'swap',
  style: 'normal',
  fallback: ['sans-serif'],
  preload: true,
})