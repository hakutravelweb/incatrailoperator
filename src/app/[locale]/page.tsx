import { Suspense } from 'react'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { locales } from '@/i18n/config'
import { Localization } from '@/interfaces/root'
import { Layout } from '@/components/layout'
import { Section } from '@/components/section'
import { HomeBanner, HomeBannerSkeleton } from '@/components/home-banner'
import { FiltersAttractionProducts } from '@/components/filters-attraction-products'
import {
  DestinationsPerDepartment,
  DestinationsPerDepartmentSkeleton,
} from '@/components/destinations-per-department'
import { Packages, PackagesSkeleton } from '@/components/packages'

const localizations = locales.map<Localization>((locale) => {
  return {
    locale,
    slug: '/',
  }
})

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Home')

  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
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
      description: t('metadata.description'),
    },
  }
}

export default async function Home() {
  const t = await getTranslations('Home')

  return (
    <Layout localizations={localizations}>
      <Suspense fallback={<HomeBannerSkeleton />}>
        <HomeBanner />
      </Suspense>
      <Section>
        <FiltersAttractionProducts />
      </Section>
      <Section>
        <Suspense fallback={<PackagesSkeleton />}>
          <Packages />
        </Suspense>
      </Section>
      <Section>
        <Suspense fallback={<DestinationsPerDepartmentSkeleton />}>
          <DestinationsPerDepartment />
        </Suspense>
      </Section>
    </Layout>
  )
}
