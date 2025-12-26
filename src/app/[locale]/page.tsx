import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { locales } from '@/i18n/config'
import { Localization } from '@/interfaces/root'
import { Layout } from '@/components/layout'
import { Section } from '@/components/section'

const localizations = locales.map<Localization>((locale) => {
  return {
    locale,
    slug: '/',
  }
})

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Home')

  return {
    title: t('title'),
    description: t('description'),
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      },
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
    },
  }
}

export default async function Home() {
  const t = await getTranslations('Home')

  return (
    <Layout localizations={localizations}>
      <Section>
        <div className='flex items-center justify-center py-10'>
          <span className='text-base leading-4.5'>{t('description')}</span>
        </div>
      </Section>
    </Layout>
  )
}
