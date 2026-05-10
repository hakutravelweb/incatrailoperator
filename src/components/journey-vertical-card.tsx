import { useLocale, useTranslations } from 'next-intl'
import { Icons } from '@/icons/icon'
import { formatPrice, getFullMediaUrl } from '@/lib/utils'
import { Link } from '@/i18n/routing'
import { Journey } from '@/interfaces/journey'

interface Props {
  journey: Journey
}

export function JourneyVerticalCard({ journey }: Props) {
  const locale = useLocale()
  const t = useTranslations('JourneyVerticalCard')

  return (
    <Link
      href={`/journey/${journey.slug}`}
      className='border-anti-flash-white grid grid-cols-1 rounded-xl border-2 bg-white md:grid-cols-[35%_1fr]'
    >
      <div className='bg-anti-flash-white relative overflow-hidden rounded-t-xl max-md:aspect-video md:rounded-t-none md:rounded-l-xl'>
        <img
          className='size-full object-cover'
          src={getFullMediaUrl(journey.photos[0])}
          alt={journey.title}
          loading='lazy'
        />
        <div className='absolute top-2 right-2'>
          <span className='bg-ue-red rounded-md p-2 text-xs leading-4 font-medium text-white'>
            {t('you-save-percent', {
              percentage: Math.round(
                ((journey.retailPrice - journey.specialPrice) /
                  journey.retailPrice) *
                  100,
              ),
            })}
          </span>
        </div>
      </div>
      <div className='flex flex-col items-start gap-2 px-4 py-2'>
        <div className='rounded-sm border border-black px-2 py-1 text-sm leading-4.5 font-medium uppercase'>
          {t(`variant.${journey.variant}`)}
        </div>
        <span className='text-cinnabar text-sm leading-4.5 font-medium'>
          {journey.category.title}
        </span>
        <strong className='text-base leading-5'>{journey.title}</strong>
        <div className='flex items-center gap-1'>
          <Icons.Location className='text-inferno size-4' />
          <span className='text-dark-charcoal text-sm leading-4.5'>
            {journey.destination.title}, {journey.destination.department}
          </span>
        </div>
        <span className='text-dark-charcoal line-clamp-2 text-sm leading-4.5'>
          {journey.about}
        </span>
        <div className='flex items-center gap-1'>
          <Icons.Clock className='text-dav-ys-grey size-4' />
          <span className='text-dav-ys-grey text-sm leading-4.5 font-medium'>
            {journey.duration.type === 'HOUR'
              ? t('duration-hours', {
                  quantity: journey.duration.quantity,
                })
              : t('duration-days', {
                  quantity: journey.duration.quantity,
                })}
          </span>
        </div>
        {journey.labels.length > 0 && (
          <div className='flex flex-wrap gap-2'>
            {journey.labels.map((label, index) => (
              <div
                key={index}
                className='rounded-sm border border-black bg-white px-2 py-1 text-xs leading-4 font-medium'
              >
                {label}
              </div>
            ))}
          </div>
        )}
        {journey.freeCancellation.quantity > 0 && (
          <div className='bg-inferno flex items-center gap-2 rounded-md p-2'>
            <Icons.Check className='size-4 text-white' />
            <span className='flex-1 text-xs leading-4 font-medium text-white'>
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
          <div className='bg-ue-red flex items-center gap-2 rounded-md p-2'>
            <Icons.Close className='size-4 text-white' />
            <span className='flex-1 text-xs leading-4 font-medium text-white'>
              {t('not-refundable')}
            </span>
          </div>
        ) : (
          <div className='bg-outrageous-orange flex items-center gap-2 rounded-md p-2'>
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
          <div className='flex items-center gap-1'>
            <Icons.Star className='text-yellow-sea size-4' />
            <span className='text-dark-charcoal text-sm leading-4.5 font-medium'>
              {journey.rating.toFixed(1)}
            </span>
            <span className='text-dav-ys-grey text-sm leading-4.5 font-medium'>
              ({journey.reviewsCount})
            </span>
          </div>
          {journey.specialPrice > 0 ? (
            <div className='flex flex-col gap-px'>
              <span className='text-dav-ys-grey text-sm leading-4.5 line-through'>
                {formatPrice(locale, journey.retailPrice)}
              </span>
              <span className='text-dark-charcoal text-lg leading-6 font-bold'>
                {formatPrice(locale, journey.specialPrice)}
              </span>
            </div>
          ) : (
            <span className='text-dark-charcoal text-lg leading-6 font-bold'>
              {formatPrice(locale, journey.retailPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
