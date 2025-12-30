import { Metadata } from 'next'
import { getLocale, getTranslations } from 'next-intl/server'
import { locales } from '@/i18n/config'
import { Link } from '@/i18n/routing'
import { Localization } from '@/interfaces/root'
import { getDestinations } from '@/services/destination'
import { Layout } from '@/components/layout'
import { Section } from '@/components/section'
import { ArticlesCategory } from '@/components/articles-category'

const localizations = locales.map<Localization>((locale) => {
  return {
    locale,
    slug: '/articles',
  }
})

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Articles')

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

export default async function Articles() {
  const locale = await getLocale()
  const t = await getTranslations('Articles')
  const destinations = await getDestinations(locale)

  return (
    <Layout localizations={localizations}>
      <div className='bg-strong-dark-green py-10'>
        <Section>
          <div className='flex flex-col gap-6 md:flex-row md:items-center md:justify-between'>
            <div className='flex flex-col gap-2'>
              <strong className='text-2xl leading-7.25 font-extrabold text-white md:text-[28px] md:leading-8.5'>
                Inka Jungle
              </strong>
              <span className='text-base leading-6 text-white'>
                {t('title')}
              </span>
            </div>
            <div className='bg-blue-green/50 flex flex-col gap-4 rounded-lg p-4'>
              <div className='flex flex-col gap-2'>
                <span className='text-base leading-6 font-bold text-white'>
                  {t('destinations')}
                </span>
                <div className='flex flex-wrap gap-2'>
                  {destinations.map((destination) => {
                    return (
                      <Link
                        key={destination.id}
                        href={`/destination/${destination.slug}`}
                        target='_blank'
                        className='rounded-full bg-white/20 px-3 py-1 text-sm leading-4.5 font-medium text-white'
                      >
                        {destination.title}
                      </Link>
                    )
                  })}
                </div>
              </div>
              <div className='flex flex-col gap-4 md:flex-row'>
                <Link
                  href='https://www.hakutravel.com/es/machu-picchu-tickets'
                  target='_blank'
                  className='rounded-full bg-white px-4 py-2.5 text-center text-base leading-5 font-bold'
                >
                  {t('tickets-machu-picchu')}
                </Link>
                <Link
                  href='/'
                  target='_blank'
                  className='bg-strong-dark-green rounded-full px-4 py-2.5 text-center text-base leading-5 font-bold text-white'
                >
                  {t('book-attractions')}
                </Link>
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
