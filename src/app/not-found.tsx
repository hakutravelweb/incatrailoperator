import './globals.css'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/routing'
import { locales } from '@/i18n/config'
import { gtEestiProDisplay } from '@/fonts/font'
import { Localization } from '@/interfaces/root'
import { Layout } from '@/components/layout'
import { Section } from '@/components/section'

export default async function NotFound() {
  const locale = await getLocale()
  const t = await getTranslations('NotFound')

  const localizations = locales.map<Localization>((locale) => {
    return {
      locale,
      slug: '/',
    }
  })

  return (
    <html lang={locale}>
      <body
        className={`${gtEestiProDisplay.className} scroll-smooth bg-white text-black antialiased`}
      >
        <NextIntlClientProvider>
          <Layout localizations={localizations}>
            <Section>
              <div className='mx-auto flex flex-col gap-8 px-4 py-10 lg:w-2/6 lg:gap-10 lg:py-6'>
                <div className='flex flex-col items-center gap-4'>
                  <h1 className='text-center text-[28px] leading-7.75 font-black lg:text-[44px] lg:leading-12 xl:text-[62px] xl:leading-17'>
                    {t('title')}
                  </h1>
                  <p className='text-dark-charcoal text-xl leading-6 font-medium'>
                    {t('description')}
                  </p>
                </div>
                <div className='flex flex-col gap-4'>
                  <Link
                    href='/'
                    className='bg-lucky-green hover:bg-crispy-mint-green active:bg-st-patricks-green active:text-dark-charcoal rounded-full px-4 py-3.5 text-center text-base leading-5 font-bold transition-colors duration-100'
                  >
                    {t('destinatons')}
                  </Link>
                  <Link
                    href='/'
                    className='hover:bg-dark-charcoal active:bg-dav-ys-grey rounded-full bg-black px-4 py-3.5 text-center text-base leading-5 font-bold text-white transition-colors duration-100 active:text-white/50'
                  >
                    {t('travel')}
                  </Link>
                </div>
              </div>
            </Section>
          </Layout>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
