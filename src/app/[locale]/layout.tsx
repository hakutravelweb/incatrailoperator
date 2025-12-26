import '../globals.css'
import { PropsWithChildren } from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { gtEestiProDisplay } from '@/fonts/font'
import { locales } from '@/i18n/config'

interface Params {
  locale: string
}

interface Props {
  params: Promise<Params>
}

export const metadata: Metadata = {
  title:
    'Inca Trail Operator: Travel Tours, Activities, and Things to Do | 2026',
  description:
    'Inca Trail Operator Official Site – Browse and book over 2,000 things to do with Inca Trail Operator. Plus, we offer free cancellation and flexible payment options for stress-free travel.',
}

export default async function RootLayout({
  params,
  children,
}: PropsWithChildren<Props>) {
  const { locale } = await params

  if (!hasLocale(locales, locale)) {
    notFound()
  }

  return (
    <html lang={locale}>
      <body
        className={`${gtEestiProDisplay.className} scroll-smooth bg-white text-black antialiased`}
      >
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  )
}
