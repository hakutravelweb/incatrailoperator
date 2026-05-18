import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Icons } from '@/icons/icon'
import { getFullMediaUrl } from '@/lib/utils'
import { Locale } from '@/i18n/config'
import { getJourneyBySlug } from '@/services/journey'
import { Layout } from '@/components/layout'
import { Section } from '@/components/section'
import { NewReview } from '@/components/journey/new-review'

interface Params {
  locale: Locale
  slug: string
}

interface Props {
  params: Promise<Params>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const t = await getTranslations('Journey')
  const journey = await getJourneyBySlug(locale, slug)

  return {
    title: t('review.title', {
      title: journey.title,
    }),
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      },
    },
    openGraph: {
      title: t('review.title', {
        title: journey.title,
      }),
      images: [getFullMediaUrl(journey.photos[0])],
    },
  }
}

export default async function Reviews({ params }: Props) {
  const { locale, slug } = await params
  const t = await getTranslations('Journey')
  const journey = await getJourneyBySlug(locale, slug)

  return (
    <Layout localizations={journey.localizations}>
      <div className='flex flex-col gap-6 py-10'>
        <Section>
          <div className='flex flex-col gap-4'>
            <div className='flex flex-col gap-2'>
              <div className='bg-abstract-navy w-fit rounded-md border-2 px-2 py-1 text-sm leading-4.5 font-bold text-white uppercase'>
                {t(`variant.${journey.variant}`)}
              </div>
              <h1 className='text-2xl leading-7.25 font-bold md:text-[28px] md:leading-8.5'>
                {t('review.title', {
                  title: journey.title,
                })}
              </h1>
            </div>
            <div className='flex flex-wrap items-center gap-2'>
              <span className='text-base leading-5'>
                {t('country')}, {journey.destination.title}
              </span>
              <span className='text-nevada text-base leading-5'>•</span>
              <div className='flex items-center gap-1'>
                <Icons.Clock className='size-5' />
                <span className='text-base leading-5'>
                  {journey.duration.type === 'HOUR'
                    ? t('duration-hours', {
                        quantity: journey.duration.quantity,
                      })
                    : t('duration-days', {
                        quantity: journey.duration.quantity,
                      })}
                </span>
              </div>
            </div>
          </div>
        </Section>
        <Section>
          <NewReview journey={journey} />
        </Section>
      </div>
    </Layout>
  )
}
