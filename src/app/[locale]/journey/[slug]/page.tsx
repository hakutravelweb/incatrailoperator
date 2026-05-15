import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Icons } from '@/icons/icon'
import { getFullMediaUrl } from '@/lib/utils'
import { Locale } from '@/i18n/config'
import { getJourneyBySlug } from '@/services/journey'
import { Layout } from '@/components/layout'
import { Section } from '@/components/section'
import { Rating } from '@/components/journey/rating'
import { Banner } from '@/components/journey/banner'
import { InformationItem } from '@/components/journey/information-item'
import { SectionList } from '@/components/journey/section-list'
import { RouteItem } from '@/components/journey/route-item'
import { WaypointItem } from '@/components/journey/waypoint-item'
import { ParseHtml } from '@/components/parse-html'
import { AskedQuestionItem } from '@/components/journey/asked-question-item'
import { Booking } from '@/components/journey/booking'
import { MapVideo } from '@/components/journey/map-video'
import { ReviewCard } from '@/components/review-card'

interface Params {
  locale: Locale
  slug: string
}

interface Props {
  params: Promise<Params>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const journey = await getJourneyBySlug(locale, slug)

  return {
    title: journey.title,
    description: journey.about,
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      },
    },
    openGraph: {
      title: journey.title,
      description: journey.about,
      images: [getFullMediaUrl(journey.photos[0])],
    },
  }
}

export default async function AttractionProduct({ params }: Props) {
  const { locale, slug } = await params
  const t = await getTranslations('Journey')
  const journey = await getJourneyBySlug(locale, slug)

  return (
    <Layout localizations={journey.localizations}>
      <div className='flex flex-col gap-6 py-10'>
        <Section>
          <Banner journey={journey} />
        </Section>
        <Section>
          <div className='flex flex-col gap-4'>
            <div className='flex flex-col items-start gap-2'>
              <div className='rounded-sm bg-black px-2 py-1 text-xs leading-4 font-medium text-white uppercase'>
                {t(`variant.${journey.variant}`)}
              </div>
              <strong className='text-2xl leading-7.25 md:text-[28px] md:leading-8.5'>
                {journey.title}
              </strong>
              <span className='text-dark-charcoal text-base leading-6 font-medium'>
                {journey.duration.type === 'HOUR'
                  ? t('duration-hours-label', {
                      quantity: journey.duration.quantity,
                    })
                  : t('duration-days-label', {
                      quantity: journey.duration.quantity,
                    })}
              </span>
            </div>
            <div className='flex flex-wrap items-center gap-2'>
              <Rating rating={journey.rating} />
              <span className='text-base leading-5 font-medium'>
                {journey.rating.toFixed(1)}
              </span>
              <span className='text-dav-ys-grey text-base leading-5'>
                (
                {t('reviews-count', {
                  quantity: journey.reviewsCount,
                })}
                )
              </span>
              <span className='text-gray-x11 text-base leading-5'>•</span>
              <div className='flex items-center gap-1'>
                <Icons.Location className='text-inferno size-5' />
                <span className='text-dark-charcoal text-base leading-5'>
                  {t('country')}, {journey.destination.title}
                </span>
              </div>
              <span className='text-gray-x11 text-base leading-5'>•</span>
              <div className='flex items-center gap-1'>
                <Icons.Clock className='text-inferno size-5' />
                <span className='text-dark-charcoal text-base leading-5'>
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
          <div className='grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_35%]'>
            <div className='shadow-deep flex flex-col gap-8 rounded-xl bg-white p-6'>
              <div className='flex flex-col gap-4'>
                <strong className='text-xl leading-6'>{t('about')}</strong>
                <span className='text-dark-charcoal text-base leading-6'>
                  {journey.about}
                </span>
              </div>
              <hr className='border-chinese-white border-t' />
              <div className='flex flex-col gap-4'>
                <strong className='text-xl leading-6'>
                  {t('general-information.title')}
                </strong>
                <div className='flex flex-col gap-4'>
                  <InformationItem
                    label={t('general-information.cancellation-policy')}
                  >
                    {journey.freeCancellation.quantity === 0
                      ? t('general-information.cancellation-policy-not-refound')
                      : t('general-information.refundable', {
                          duration:
                            journey.duration.type === 'HOUR'
                              ? t('duration-hours', {
                                  quantity: journey.duration.quantity,
                                })
                              : t('duration-days', {
                                  quantity: journey.duration.quantity,
                                }),
                        })}
                  </InformationItem>
                  <InformationItem label={t('general-information.duration')}>
                    {journey.duration.type === 'HOUR'
                      ? t('general-information.duration-hours-message', {
                          quantity: journey.duration.quantity,
                        })
                      : t('general-information.duration-days-message', {
                          quantity: journey.duration.quantity,
                        })}
                  </InformationItem>
                  <InformationItem
                    label={t('general-information.guide-languages')}
                  >
                    {journey.guidedLanguages
                      .map((guidedLanguage) =>
                        t(`general-information.language.${guidedLanguage}`),
                      )
                      .join(', ')}
                  </InformationItem>
                  <InformationItem
                    label={t('general-information.pickup-service')}
                  >
                    {journey.pickUpService}
                  </InformationItem>
                  <InformationItem label={t('general-information.start-time')}>
                    {journey.startTime}
                  </InformationItem>
                  <InformationItem label={t('general-information.finish-time')}>
                    {journey.finishTime}
                  </InformationItem>
                </div>
              </div>
              <hr className='border-chinese-white border-t' />
              <SectionList title={t('highlights')} list={journey.highlights} />
              <hr className='border-chinese-white border-t' />
              <div className='flex flex-col gap-4'>
                <strong className='text-xl leading-6'>{t('itinerary')}</strong>
                {journey.routes.map((route, index) => {
                  return (
                    <div
                      key={route.id}
                      className='relative z-1 flex flex-col gap-4'
                    >
                      <div className='bg-inferno absolute top-4 left-3.5 -z-1 h-[calc(100%-32px)] w-1' />
                      <RouteItem step={index + 1} route={route} />
                      <div className='flex flex-col gap-2 pl-1'>
                        {route.waypoints.map((waypoint) => {
                          return (
                            <WaypointItem
                              key={waypoint.id}
                              waypoint={waypoint}
                            />
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
              <hr className='border-chinese-white border-t' />
              <div className='flex flex-col gap-4'>
                <strong className='text-xl leading-6'>
                  {t('detailed-description')}
                </strong>
                <ParseHtml content={journey.detailedDescription} />
              </div>
              <div className='border-l-inferno bg-inferno/10 flex flex-col gap-4 rounded-xl border-l-4 p-6'>
                <strong className='text-lg leading-6'>
                  {t('important-note')}
                </strong>
                <ParseHtml content={journey.importantNote} />
              </div>
              <hr className='border-chinese-white border-t' />
              <SectionList
                variant='includes'
                title={t('includes')}
                list={journey.inclusions}
              />
              <SectionList
                variant='not-included'
                title={t('not-included')}
                list={journey.exclusions}
              />
              <hr className='border-chinese-white border-t' />
              <div className='border-l-yellow-sea bg-yellow-sea/10 flex flex-col gap-4 rounded-xl border-l-4 p-6'>
                <strong className='text-lg leading-6'>
                  {t('important-warning')}
                </strong>
                <ParseHtml content={journey.importantWarning} />
              </div>
              <SectionList
                title={t('recommendations')}
                list={journey.recommendations}
              />
              <div className='border-l-inferno bg-outrageous-orange/10 flex flex-col gap-4 rounded-xl border-l-4 p-6'>
                <strong className='text-lg leading-6'>
                  {t('additional-advice')}
                </strong>
                <span className='text-dark-charcoal text-base leading-6'>
                  {journey.additionalAdvice}
                </span>
              </div>
              <hr className='border-chinese-white border-t' />
              <div className='flex flex-col gap-4'>
                <strong className='text-xl leading-6'>
                  {t('asked-questions')}
                </strong>
                <div className='flex flex-col gap-2'>
                  {journey.askedQuestions.map((askedQuestion) => {
                    return (
                      <AskedQuestionItem
                        key={askedQuestion.id}
                        askedQuestion={askedQuestion}
                      />
                    )
                  })}
                </div>
              </div>
              <hr className='border-chinese-white border-t' />
              <div className='flex flex-col gap-4'>
                <strong className='text-xl leading-6'>{t('map-video')}</strong>
                <MapVideo journey={journey} />
              </div>
              <hr className='border-chinese-white border-t' />
              <div className='flex flex-col gap-4'>
                <strong className='text-xl leading-6'>{t('reviews')}</strong>
                <div className='border-anti-flash-white flex justify-start rounded-xl border-2 p-4'>
                  <div className='flex flex-col items-center gap-2'>
                    <strong className='text-lg leading-6'>
                      {journey.rating.toFixed(1)}
                    </strong>
                    <Rating rating={journey.rating} />
                    <span className='text-dav-ys-grey text-base leading-5'>
                      {t('reviews-count', {
                        quantity: journey.reviewsCount,
                      })}
                    </span>
                  </div>
                </div>
                <div className='flex flex-col gap-2'>
                  {journey.reviews.map((review) => {
                    return <ReviewCard key={review.id} review={review} />
                  })}
                </div>
              </div>
            </div>
            <Booking journey={journey} />
          </div>
        </Section>
      </div>
    </Layout>
  )
}
