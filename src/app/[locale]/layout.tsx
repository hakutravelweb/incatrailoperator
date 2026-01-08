import '../globals.css'
import { PropsWithChildren } from 'react'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { Toaster } from 'sonner'
import { gtEestiProDisplay } from '@/fonts/font'
import { locales } from '@/i18n/config'

interface Params {
  locale: string
}

interface Props {
  params: Promise<Params>
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
        <NextIntlClientProvider>
          {children}
          <Toaster position='top-right' />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
