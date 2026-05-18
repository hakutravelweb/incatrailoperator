import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
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
          <div className='grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_35%]'>
            <div className='flex flex-col gap-6'>
              <div className='flex flex-col gap-4'>
                <h2 className='text-xl leading-6 font-bold'>{t('about')}</h2>
                <span className='text-base leading-5.5'>{journey.about}</span>
              </div>
              <hr className='border-faded-white border-t' />
              <div className='flex flex-col gap-4'>
                <h2 className='text-xl leading-6 font-bold'>
                  {t('general-information.title')}
                </h2>
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
              <hr className='border-faded-white border-t' />
              <SectionList title={t('highlights')} list={journey.highlights} />
              <hr className='border-faded-white border-t' />
              <div className='flex flex-col gap-4'>
                <h2 className='text-xl leading-6 font-bold'>
                  {t('itinerary')}
                </h2>
                {journey.routes.map((route) => {
                  return (
                    <div key={route.id} className='flex flex-col'>
                      <RouteItem route={route} />
                      <div className='flex flex-col'>
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
              <hr className='border-faded-white border-t' />
              <div className='flex flex-col gap-4'>
                <h2 className='text-xl leading-6 font-bold'>
                  {t('detailed-description')}
                </h2>
                <ParseHtml content={journey.detailedDescription} />
              </div>
              <div className='border-l-dark-jade bg-bright-grey/50 flex flex-col gap-4 rounded-r-2xl border-l-4 p-6'>
                <h2 className='text-xl leading-6 font-bold'>
                  {t('important-note')}
                </h2>
                <ParseHtml content={journey.importantNote} />
              </div>
              <hr className='border-faded-white border-t' />
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
              <hr className='border-faded-white border-t' />
              <div className='border-l-inferno bg-bright-grey/50 flex flex-col gap-4 rounded-r-2xl border-l-4 p-6'>
                <h2 className='text-xl leading-6 font-bold'>
                  {t('important-warning')}
                </h2>
                <ParseHtml content={journey.importantWarning} />
              </div>
              <SectionList
                title={t('recommendations')}
                list={journey.recommendations}
              />
              <div className='border-l-blue-fire bg-bright-grey/50 flex flex-col gap-4 rounded-r-2xl border-l-4 p-6'>
                <h2 className='text-xl leading-6 font-bold'>
                  {t('additional-advice')}
                </h2>
                <span className='text-nevada text-base leading-6'>
                  {journey.additionalAdvice}
                </span>
              </div>
              <hr className='border-faded-white border-t' />
              <div className='flex flex-col gap-4'>
                <h2 className='text-xl leading-6 font-bold'>
                  {t('asked-questions')}
                </h2>
                <div className='divide-faded-white flex flex-col divide-y'>
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
              <hr className='border-faded-white border-t' />
              <div className='flex flex-col gap-4'>
                <h2 className='text-xl leading-6 font-bold'>
                  {t('map-video')}
                </h2>
                <MapVideo journey={journey} />
              </div>
              <hr className='border-faded-white border-t' />
              <div className='flex flex-col items-start gap-4'>
                <h2 className='text-xl leading-6 font-bold'>{t('reviews')}</h2>
                <div className='flex flex-col gap-2 text-center'>
                  <h2 className='text-[28px] leading-8 font-bold lg:text-[36px] lg:leading-11'>
                    {journey.rating.toFixed(1)}
                    <span className='text-nevada text-2xl leading-7.5 font-bold'>
                      /5
                    </span>
                  </h2>
                  <Rating variant='large' rating={journey.rating} />
                  <span className='text-nevada text-base leading-5.5'>
                    {t('reviews-count', {
                      quantity: journey.reviewsCount,
                    })}
                  </span>
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
