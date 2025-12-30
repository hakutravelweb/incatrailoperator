import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { locales } from '@/i18n/config'
import { Localization } from '@/interfaces/root'
import { auth } from '@/services/user'
import { Layout } from '@/components/layout'
import { Section } from '@/components/section'
import { Tabs, Tab } from '@/components/ui/tabs'
import { Profile } from '@/components/dashboard/profile'
import { AttractionProducts } from '@/components/dashboard/attraction-products'
import { Categories } from '@/components/dashboard/categories/categories'
import { Destinations } from '@/components/dashboard/destinations/destinations'
import { Articles } from '@/components/dashboard/articles/articles'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Dashboard')

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

export default async function Dashboard() {
  const t = await getTranslations('Dashboard')
  const user = await auth()

  const localizations = locales.map<Localization>((locale) => {
    return {
      locale,
      slug: '/auth/signin',
    }
  })

  return (
    <Layout localizations={localizations}>
      <Section>
        <div className='flex flex-col gap-6 py-10'>
          <Profile user={user} />
          <Tabs>
            <Tab label={t('attraction.title')}>
              <AttractionProducts />
            </Tab>
            <Tab label={t('category.title')}>
              <Categories />
            </Tab>
            <Tab label={t('destination.title')}>
              <Destinations />
            </Tab>
            <Tab label={t('article.title')}>
              <Articles />
            </Tab>
          </Tabs>
        </div>
      </Section>
    </Layout>
  )
}
