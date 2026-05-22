import './globals.css'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getTranslations } from 'next-intl/server'
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
              <div className='flex flex-col gap-6 py-20 text-center'>
                <h1 className='text-[28px] leading-8 font-bold lg:text-[36px] lg:leading-11'>
                  {t('title')}
                </h1>
                <div className='flex flex-col items-center gap-4'>
                  <span className='text-nevada text-lg leading-5.5'>
                    {t('description')}
                  </span>
                  <ButtonLink widthFit variant='outline' href='/'>
                    {t('search-activities')}
                  </ButtonLink>
                </div>
              </div>
            </Section>
          </Layout>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
