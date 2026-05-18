import { Metadata } from 'next'
import { getLocale, getTranslations } from 'next-intl/server'
import { locales } from '@/i18n/config'
import { Link } from '@/i18n/routing'
import { Localization } from '@/shared/interfaces'
import { getDestinations } from '@/services/destination'
import { Layout } from '@/components/layout'
import { Section } from '@/components/section'
import { ArticlesCategory } from '@/components/articles-category'
import { ButtonLink } from '@/components/ui/button'

const localizations = locales.map((locale): Localization => {
  return {
    locale,
    slug: '/articles',
  }
})

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Articles')

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

export default async function Articles() {
  const locale = await getLocale()
  const t = await getTranslations('Articles')
  const destinations = await getDestinations(locale)

  return (
    <Layout localizations={localizations}>
      <div className='bg-inferno py-10'>
        <Section>
          <div className='flex flex-col gap-6 md:flex-row md:items-center md:justify-between'>
            <div className='flex flex-col gap-2'>
              <span className='text-2xl leading-7.25 font-bold text-white md:text-[28px] md:leading-8.5'>
                Inca Trail Operator
              </span>
              <span className='text-base leading-6 text-white'>
                {t('title')}
              </span>
            </div>
            <div className='border-faded-white flex flex-col gap-4 rounded-2xl border bg-white p-4'>
              <div className='flex flex-col gap-2'>
                <span className='text-base leading-6 font-bold'>
                  {t('destinations')}
                </span>
                {destinations.length === 0 && (
                  <span className='text-sm leading-4.5'>
                    {t('destinations-empty')}
                  </span>
                )}
                <div className='flex flex-wrap gap-2'>
                  {destinations.map((destination) => {
                    return (
                      <Link
                        key={destination.id}
                        href={`/destination/${destination.slug}`}
                        target='_blank'
                        className='hover:underline-premium'
                      >
                        <span className='text-sm leading-4.5 font-medium'>
                          {destination.title}
                        </span>
                      </Link>
                    )
                  })}
                </div>
              </div>
              <div className='flex flex-col gap-4 md:flex-row'>
                <ButtonLink
                  variant='secondary'
                  widthFit
                  href='https://www.hakutravel.com/es/machu-picchu-tickets'
                >
                  {t('tickets-machu-picchu')}
                </ButtonLink>
                <ButtonLink widthFit href='/'>
                  {t('book-journeys')}
                </ButtonLink>
              </div>
            </div>
          </div>
        </Section>
      </div>
      <div className='py-10'>
        <Section>
          <ArticlesCategory />
        </Section>
      </div>
    </Layout>
  )
}
