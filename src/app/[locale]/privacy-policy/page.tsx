import { Metadata } from 'next'
import { getLocale, getTranslations } from 'next-intl/server'
import { formatDate } from '@/lib/utils'
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
    slug: '/privacy-policy',
  }
})

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('PrivacyPolicy')

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

export default async function PrivacyPolicy() {
  const locale = await getLocale()
  const t = await getTranslations('PrivacyPolicy')
  const home = await getHomeLocale(locale)

  return (
    <Layout localizations={localizations}>
      <div className='bg-inferno flex flex-col items-center gap-4 px-10 py-20 text-center'>
        <h1 className='text-2xl leading-8 font-bold text-white'>
          {t('title')}
        </h1>
        <span className='text-base leading-6 text-white'>
          {t('description')}
        </span>
        <div className='rounded-full bg-white px-4 py-2 text-base leading-5 font-medium'>
          {t('effective-from', {
            date: formatDate({
              locale,
              date: new Date(home.createdAt),
              options: {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              },
            }),
          })}
        </div>
      </div>
      <Section>
        <div className='grid grid-cols-1 items-start gap-6 py-10 md:grid-cols-[30%_1fr]'>
          <div className='border-faded-white flex flex-col gap-4 rounded-2xl border bg-white p-4 md:sticky md:top-4'>
            <span className='text-lg leading-6 font-medium'>
              {t('navigation-title')}
            </span>
            <MenuNavigation navigation={home.navigationPrivacy} />
          </div>
          <div className='border-faded-white rounded-2xl border bg-white p-4'>
            <ParseHtml content={home.privacyPolicy} />
          </div>
        </div>
      </Section>
    </Layout>
  )
}
