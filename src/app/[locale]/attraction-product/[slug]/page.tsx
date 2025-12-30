import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { getFullMediaUrl } from '@/lib/utils'
import { Locale } from '@/i18n/config'
import { getAttractionProductBySlug } from '@/services/attraction-product'
import { Layout } from '@/components/layout'
import { Section } from '@/components/section'
import { Rating } from '@/components/attraction-product/rating'
import { Banner } from '@/components/attraction-product/banner'
import { Icons } from '@/icons/icon'
import { InformationItem } from '@/components/attraction-product/information-item'
import { SectionList } from '@/components/attraction-product/section-list'
import { RouteItem } from '@/components/attraction-product/route-item'
import { WaypointItem } from '@/components/attraction-product/waypoint-item'
import { ParseHtml } from '@/components/parse-html'
import { AskedQuestionItem } from '@/components/attraction-product/asked-question-item'
import { Booking } from '@/components/attraction-product/booking'
import { MapVideo } from '@/components/attraction-product/map-video'
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
  const attractionProduct = await getAttractionProductBySlug(locale, slug)

  return {
    title: attractionProduct.title,
    description: attractionProduct.about,
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      },
    },
    openGraph: {
      title: attractionProduct.title,
      description: attractionProduct.about,
      images: [getFullMediaUrl(attractionProduct.photos[0])],
    },
  }
}

export default async function AttractionProduct({ params }: Props) {
  const { locale, slug } = await params
  const t = await getTranslations('AttractionProduct')
  const attractionProduct = await getAttractionProductBySlug(locale, slug)

  return (
    <Layout localizations={attractionProduct.localizations}>
      <div className='flex flex-col gap-6 py-10'>
        <Section>
          <Banner attractionProduct={attractionProduct} />
        </Section>
        <Section>
          <div className='flex flex-col gap-4'>
            <div className='flex flex-col items-start gap-2'>
              <div className='border-chinese-white bg-anti-flash-white rounded-md border-2 px-2 py-1 text-sm leading-4.5 font-bold uppercase'>
                {t(`variant.${attractionProduct.variant}`)}
              </div>
              <strong className='text-2xl leading-7.25 font-extrabold md:text-[28px] md:leading-8.5'>
                {attractionProduct.title}
              </strong>
              <span className='text-dark-charcoal text-base leading-6 font-medium'>
                {attractionProduct.duration.type === 'HOUR'
                  ? t('duration-hours-label', {
                      quantity: attractionProduct.duration.quantity,
                    })
                  : t('duration-days-label', {
                      quantity: attractionProduct.duration.quantity,
                    })}
              </span>
            </div>
            <div className='flex flex-wrap items-center gap-2'>
              <Rating rating={attractionProduct.rating} />
              <span className='text-base leading-5 font-medium'>
                {attractionProduct.rating.toFixed(1)}
              </span>
              <span className='text-dav-ys-grey text-base leading-5'>
                (
                {t('reviews-count', {
                  quantity: attractionProduct.reviewsCount,
                })}
                )
              </span>
              <span className='text-gray-x11 text-base leading-5'>•</span>
              <div className='flex items-center gap-1'>
                <Icons.Location className='text-observatory size-5' />
                <span className='text-dark-charcoal text-base leading-5'>
                  {attractionProduct.destination.title}, {t('country')}
                </span>
              </div>
              <span className='text-gray-x11 text-base leading-5'>•</span>
              <div className='flex items-center gap-1'>
                <Icons.Clock className='text-observatory size-5' />
                <span className='text-dark-charcoal text-base leading-5'>
                  {attractionProduct.duration.type === 'HOUR'
                    ? t('duration-hours', {
                        quantity: attractionProduct.duration.quantity,
                      })
                    : t('duration-days', {
                        quantity: attractionProduct.duration.quantity,
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
                  {attractionProduct.about}
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
                    {attractionProduct.freeCancellation.quantity === 0
                      ? t('general-information.cancellation-policy-not-refound')
                      : t('general-information.refundable', {
                          duration:
                            attractionProduct.duration.type === 'HOUR'
                              ? t('duration-hours', {
                                  quantity: attractionProduct.duration.quantity,
                                })
                              : t('duration-days', {
                                  quantity: attractionProduct.duration.quantity,
                                }),
                        })}
                  </InformationItem>
                  <InformationItem label={t('general-information.duration')}>
                    {attractionProduct.duration.type === 'HOUR'
                      ? t('general-information.duration-hours-message', {
                          quantity: attractionProduct.duration.quantity,
                        })
                      : t('general-information.duration-days-message', {
                          quantity: attractionProduct.duration.quantity,
                        })}
                  </InformationItem>
                  <InformationItem
                    label={t('general-information.guide-languages')}
                  >
                    {attractionProduct.guideLanguages}
                  </InformationItem>
                  <InformationItem
                    label={t('general-information.pickup-service')}
                  >
                    {attractionProduct.pickUpService}
                  </InformationItem>
                  <InformationItem label={t('general-information.start-time')}>
                    {attractionProduct.startTime}
                  </InformationItem>
                  <InformationItem label={t('general-information.finish-time')}>
                    {attractionProduct.finishTime}
                  </InformationItem>
                </div>
              </div>
              <hr className='border-chinese-white border-t' />
              <SectionList
                title={t('highlights')}
                list={attractionProduct.highlights}
              />
              <hr className='border-chinese-white border-t' />
              <div className='flex flex-col gap-4'>
                <strong className='text-xl leading-6'>{t('itinerary')}</strong>
                {attractionProduct.routes.map((route, index) => {
                  return (
                    <div
                      key={route.id}
                      className='relative z-1 flex flex-col gap-4'
                    >
                      <div className='bg-observatory absolute top-4 left-3.5 -z-1 h-[calc(100%-32px)] w-1' />
                      <RouteItem index={index} route={route} />
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
                <ParseHtml content={attractionProduct.detailedDescription} />
              </div>
              <div className='border-l-observatory bg-observatory/10 flex flex-col gap-4 rounded-xl border-l-4 p-6'>
                <strong className='text-lg leading-6'>
                  {t('important-note')}
                </strong>
                <ParseHtml content={attractionProduct.importantNote} />
              </div>
              <hr className='border-chinese-white border-t' />
              <SectionList
                title={t('includes')}
                list={attractionProduct.includes}
              />
              <SectionList
                title={t('not-included')}
                list={attractionProduct.notIncluded}
              />
              <hr className='border-chinese-white border-t' />
              <div className='border-l-yellow-sea bg-yellow-sea/10 flex flex-col gap-4 rounded-xl border-l-4 p-6'>
                <strong className='text-lg leading-6'>
                  {t('important-warning')}
                </strong>
                <ParseHtml content={attractionProduct.importantWarning} />
              </div>
              <SectionList
                title={t('recommendations')}
                list={attractionProduct.recommendations}
              />
              <div className='border-l-observatory bg-blue-green/10 flex flex-col gap-4 rounded-xl border-l-4 p-6'>
                <strong className='text-lg leading-6'>
                  {t('additional-advice')}
                </strong>
                <span className='text-dark-charcoal text-base leading-6'>
                  {attractionProduct.additionalAdvice}
                </span>
              </div>
              <hr className='border-chinese-white border-t' />
              <div className='flex flex-col gap-4'>
                <strong className='text-xl leading-6'>
                  {t('asked-questions')}
                </strong>
                <div className='flex flex-col gap-2'>
                  {attractionProduct.askedQuestions.map((askedQuestion) => {
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
                <MapVideo attractionProduct={attractionProduct} />
              </div>
              <hr className='border-chinese-white border-t' />
              <div className='flex flex-col gap-4'>
                <strong className='text-xl leading-6'>{t('reviews')}</strong>
                <div className='border-anti-flash-white flex justify-start rounded-xl border-2 p-4'>
                  <div className='flex flex-col items-center gap-2'>
                    <strong className='text-lg leading-6'>
                      {attractionProduct.rating.toFixed(1)}
                    </strong>
                    <Rating rating={attractionProduct.rating} />
                    <span className='text-dav-ys-grey text-base leading-5'>
                      {t('reviews-count', {
                        quantity: attractionProduct.reviewsCount,
                      })}
                    </span>
                  </div>
                </div>
                <div className='flex flex-col gap-2'>
                  {attractionProduct.reviews.map((review) => {
                    return <ReviewCard key={review.id} review={review} />
                  })}
                </div>
              </div>
            </div>
            <Booking attractionProduct={attractionProduct} />
          </div>
        </Section>
      </div>
    </Layout>
  )
}
