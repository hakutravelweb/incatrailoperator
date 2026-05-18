import './globals.css'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/routing'
import { locales } from '@/i18n/config'
import { GTEesti } from '@/fonts/font'
import { Localization } from '@/shared/interfaces'
import { Layout } from '@/components/layout'
import { Section } from '@/components/section'
import { ButtonLink } from '@/components/ui/button'

export default async function NotFound() {
  const locale = await getLocale()
  const t = await getTranslations('NotFound')

  const localizations = locales.map((locale): Localization => {
    return {
      locale,
      slug: '/',
    }
  })

  return (
    <html lang={locale}>
      <body
        className={`${GTEesti.className} text-abstract-navy bg-white antialiased`}
      >
        <NextIntlClientProvider>
          <Layout localizations={localizations}>
            <Section>
              <div className='mx-auto flex flex-col gap-8 px-4 py-10 lg:w-2/6 lg:gap-10 lg:py-6'>
                <div className='flex flex-col items-center gap-4'>
                  <h1 className='text-center text-[28px] leading-7.75 font-bold lg:text-[44px] lg:leading-12 xl:text-[62px] xl:leading-17'>
                    {t('title')}
                  </h1>
                  <p className='text-nevada text-xl leading-6 font-medium'>
                    {t('description')}
                  </p>
                </div>
                <div className='flex flex-col gap-4'>
                  <ButtonLink variant='outline' href='/'>
                    {t('destinatons')}
                  </ButtonLink>
                  <ButtonLink href='/'>{t('travel')}</ButtonLink>
                </div>
              </div>
            </Section>
          </Layout>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
