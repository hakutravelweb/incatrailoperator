import './globals.css'
import { PropsWithChildren } from 'react'
import { Metadata } from 'next'
import { gtEestiProDisplay } from '@/fonts/font'

export const metadata: Metadata = {
  title:
    'Inca Trail Operator: Travel Tours, Activities, and Things to Do | 2026',
  description:
    'Inca Trail Operator Official Site – Browse and book over 2,000 things to do with Inca Trail Operator. Plus, we offer free cancellation and flexible payment options for stress-free travel.',
}

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang='es'>
      <body
        className={`${gtEestiProDisplay.className} scroll-smooth bg-white text-black antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
