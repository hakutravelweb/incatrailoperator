import { Metadata } from 'next'
import { getLocale, getTranslations } from 'next-intl/server'
import { locales } from '@/i18n/config'
import { redirect } from '@/i18n/routing'
import { Localization } from '@/shared/interfaces'
import { getAuth } from '@/services/user'
import { Layout } from '@/components/layout'
import { Section } from '@/components/section'
import { Tabs, Tab } from '@/components/ui/tabs'
import { Profile } from '@/components/dashboard/profile'
import { Journeys } from '@/components/dashboard/journeys/journeys'
import { Categories } from '@/components/dashboard/categories/categories'
import { Destinations } from '@/components/dashboard/destinations/destinations'
import { Articles } from '@/components/dashboard/articles/articles'
import { Homes } from '@/components/dashboard/homes/homes'

const localizations = locales.map((locale): Localization => {
  return {
    locale,
    slug: '/auth/signin',
  }
})

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
  const locale = await getLocale()
  const t = await getTranslations('Dashboard')
  const user = await getAuth()
  if (!user) {
    return redirect({
      href: '/auth/signin',
      locale,
    })
  }

  return (
    <Layout localizations={localizations}>
      <Section>
        <div className='flex flex-col gap-6 py-10'>
          <Profile user={user} />
          <Tabs>
            <Tab label={t('journey.title')}>
              <Journeys />
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
            <Tab label={t('home.title')}>
              <Homes />
            </Tab>
          </Tabs>
        </div>
      </Section>
    </Layout>
  )
}
