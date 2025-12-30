import { Suspense } from 'react'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { locales } from '@/i18n/config'
import { Localization } from '@/interfaces/root'
import { Layout } from '@/components/layout'
import { Section } from '@/components/section'
import { Button } from '@/components/ui/button'
import { FiltersAttractionProducts } from '@/components/filters-attraction-products'
import {
  DestinationsPerDepartment,
  DestinationsPerDepartmentSkeleton,
} from '@/components/destinations-per-department'
import { Link } from '@/i18n/routing'

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
      <div className='relative flex h-100 items-center justify-center bg-black'>
        <div className='bg-gradient-shadow absolute inset-0 z-1' />
        <img
          className='absolute size-full object-cover object-center'
          src='/tour-inca-trail-4-days.jpg'
          loading='lazy'
        />
        <Section>
          <div className='relative z-2 flex flex-col items-center gap-6 text-center'>
            <strong className='text-4xl leading-10 font-black text-white'>
              {t('hero.title')}
            </strong>
            <span className='text-xl leading-6 font-medium text-white'>
              {t('hero.subtitle')}
            </span>
            <Link
              href='/filters-attraction-products'
              className='not-disabled:bg-observatory not-disabled:hover:bg-blue-green not-disabled:active:bg-strong-dark-green rounded-full px-6 py-3.5 text-base leading-5 font-bold text-white transition-colors duration-100'
            >
              {t('hero.explore-tours-label')}
            </Link>
          </div>
        </Section>
      </div>
      <Section>
        <FiltersAttractionProducts />
      </Section>
      <Section>
        <Suspense fallback={<DestinationsPerDepartmentSkeleton />}>
          <DestinationsPerDepartment />
        </Suspense>
      </Section>
    </Layout>
  )
}
