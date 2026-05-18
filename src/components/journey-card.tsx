import { useLocale, useTranslations } from 'next-intl'
import { Icons } from '@/icons/icon'
import {
  calculatePercentageDifference,
  formatPrice,
  getFullMediaUrl,
} from '@/lib/utils'
import { Link } from '@/i18n/routing'
import { Journey } from '@/interfaces/journey'

interface Props {
  journey: Journey
}

export function JourneyCard({ journey }: Props) {
  const locale = useLocale()
  const t = useTranslations('JourneyCard')
  const percentage = calculatePercentageDifference(
    journey.retailPrice,
    journey.specialPrice,
  )

  return (
    <Link
      href={`/journey/${journey.slug}`}
      className='border-faded-white rounded-2xl border bg-white'
    >
      <div className='bg-bright-grey relative aspect-video overflow-hidden rounded-t-2xl'>
        <img
          className='size-full object-cover'
          src={getFullMediaUrl(journey.photos[0])}
          alt={journey.title}
          loading='lazy'
        />
        {percentage > 0 && (
          <div className='absolute right-2 bottom-2'>
            <span className='bg-cayenne-red rounded-sm px-2 py-1 text-sm leading-5 font-medium text-white'>
              {t('you-save-percent', {
                percentage,
              })}
            </span>
          </div>
        )}
        <div className='absolute top-2 left-2'>
          <div className='bg-abstract-navy rounded-sm px-2 py-0.75 text-sm leading-5 font-medium text-white'>
            {t(`variant.${journey.variant}`)}
          </div>
        </div>
      </div>
      <div className='flex flex-col gap-2 p-4'>
        <div className='flex items-start gap-2'>
          <span className='text-base leading-5.5 font-medium'>
            {journey.title}
          </span>
          <div className='flex items-end gap-0.5'>
            <span className='text-sm leading-4.5 font-medium'>
              {journey.rating.toFixed(1)}
            </span>
            <Icons.Star className='size-5' />
            <span className='text-nevada pb-0.5 text-xs leading-4 font-medium'>
              {journey.reviewsCount}
            </span>
          </div>
        </div>
        <div className='flex items-center gap-1'>
          <span className='text-nevada text-sm leading-4.5'>
            {journey.duration.type === 'HOUR'
              ? t('duration-hours', {
                  quantity: journey.duration.quantity,
                })
              : t('duration-days', {
                  quantity: journey.duration.quantity,
                })}
          </span>
          <span className='text-nevada text-base leading-5.5'>•</span>
          <span className='text-nevada text-sm leading-4.5'>
            {journey.category.title}
          </span>
        </div>
        <span className='line-clamp-2 text-sm leading-4.5'>
          {journey.about}
        </span>
        {journey.labels.length > 0 && (
          <div className='flex flex-wrap gap-2'>
            {journey.labels.map((label, index) => (
              <div
                key={index}
                className='border-abstract-navy rounded-sm border bg-white px-2 py-1 text-xs leading-4 font-medium'
              >
                {label}
              </div>
            ))}
          </div>
        )}
        {journey.freeCancellation.quantity > 0 && (
          <div className='border-dark-jade flex items-center gap-2 rounded-md border-2 p-2'>
            <Icons.Check className='text-dark-jade size-4' />
            <span className='text-dark-jade flex-1 text-xs leading-4 font-medium'>
              {t('free-cancellation', {
                duration:
                  journey.freeCancellation.type === 'HOUR'
                    ? t('duration-hours', {
                        quantity: journey.freeCancellation.quantity,
                      })
                    : t('duration-days', {
                        quantity: journey.freeCancellation.quantity,
                      }),
              })}
            </span>
          </div>
        )}
        {journey.refundable.quantity === 0 ? (
          <div className='bg-cayenne-red flex items-center gap-2 rounded-md p-2'>
            <Icons.Close className='size-4 text-white' />
            <span className='flex-1 text-xs leading-4 font-medium text-white'>
              {t('not-refundable')}
            </span>
          </div>
        ) : (
          <div className='bg-blue-fire flex items-center gap-2 rounded-md p-2'>
            <Icons.Check className='size-4 text-white' />
            <span className='flex-1 text-xs leading-4 font-medium text-white'>
              {t('refundable', {
                duration:
                  journey.refundable.type === 'HOUR'
                    ? t('duration-hours', {
                        quantity: journey.refundable.quantity,
                      })
                    : t('duration-days', {
                        quantity: journey.refundable.quantity,
                      }),
              })}
            </span>
          </div>
        )}
        <div className='flex w-full items-center justify-between gap-4'>
          {journey.specialPrice > 0 ? (
            <div className='flex flex-col'>
              <span className='text-nevada text-xs leading-4 line-through'>
                {formatPrice(locale, journey.retailPrice)}
              </span>
              <span className='text-cayenne-red text-xl leading-6 font-medium'>
                {formatPrice(locale, journey.specialPrice)}
              </span>
            </div>
          ) : (
            <span className='text-xl leading-6 font-medium'>
              {formatPrice(locale, journey.retailPrice)}
            </span>
          )}
          {journey.specialPrice > 0 && (
            <span className='bg-inferno w-min rounded-md p-2 text-xs leading-4 font-medium text-white'>
              {t('you-save', {
                amount: formatPrice(
                  locale,
                  journey.retailPrice - journey.specialPrice,
                ),
              })}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
