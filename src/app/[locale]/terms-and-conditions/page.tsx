import { Metadata } from 'next'
import { getLocale, getTranslations } from 'next-intl/server'
import { locales } from '@/i18n/config'
import { Localization } from '@/shared/interfaces'
import { getHomeLocale } from '@/services/home'
import { Layout } from '@/components/layout'
import { Section } from '@/components/section'
import { MenuNavigation } from '@/components/menu-navigation'
import { ParseHtml } from '@/components/parse-html'

const localizations = locales.map((locale): Localization => {
  return {
    locale,
    slug: '/terms-and-conditions',
  }
})

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('TermsAndConditions')

  return {
    metadataBase: new URL(process.env.APP_URL!),
    title: t('metadata.title'),
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      },
    },
    openGraph: {
      title: t('metadata.title'),
      images: [`/posters/banner.jpg`],
    },
  }
}

export default async function TermsAndConditions() {
  const locale = await getLocale()
  const t = await getTranslations('TermsAndConditions')
  const home = await getHomeLocale(locale)

  return (
    <Layout localizations={localizations}>
      <Section>
        <div className='grid grid-cols-1 items-start gap-6 py-10 md:grid-cols-[30%_1fr]'>
          <div className='border-faded-white flex flex-col gap-4 rounded-2xl border bg-white p-4 md:sticky md:top-4'>
            <span className='text-lg leading-6 font-medium'>
              {t('navigation-title')}
            </span>
            <MenuNavigation navigation={home.navigationTerms} />
          </div>
          <div className='border-faded-white flex flex-col gap-4 rounded-2xl border bg-white p-4'>
            <span className='text-2xl leading-8 font-bold'>{t('title')}</span>
            <ParseHtml content={home.termsAndConditions} />
          </div>
        </div>
      </Section>
    </Layout>
  )
}
