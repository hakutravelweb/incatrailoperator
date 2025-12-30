import { Metadata } from 'next'
import { getLocale, getTranslations } from 'next-intl/server'
import { locales } from '@/i18n/config'
import { Localization } from '@/interfaces/root'
import { getHomeLocale } from '@/services/home'
import { Layout } from '@/components/layout'
import { Section } from '@/components/section'
import { MenuNavigation } from '@/components/menu-navigation'
import { ParseHtml } from '@/components/parse-html'

const localizations = locales.map<Localization>((locale) => {
  return {
    locale,
    slug: '/terms-and-conditions',
  }
})

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('TermsAndConditions')

  return {
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
          <div className='shadow-deep flex flex-col gap-4 rounded-xl p-4 md:sticky md:top-4'>
            <strong className='text-lg leading-6'>
              {t('navigation-title')}
            </strong>
            <MenuNavigation navigation={home.navigationTerms} />
          </div>
          <div className='border-anti-flash-white flex flex-col gap-6 rounded-xl border-2 bg-white p-4'>
            <strong className='text-2xl leading-8'>{t('title')}</strong>
            <ParseHtml content={home.termsAndConditions} />
          </div>
        </div>
      </Section>
    </Layout>
  )
}
