import { useLocale, useTranslations } from 'next-intl'
import { Icons } from '@/icons/icon'
import { formatPrice, getFullMediaUrl } from '@/lib/utils'
import { Journey } from '@/interfaces/journey'
import { ButtonLink } from './ui/button'

interface Props {
  journey: Journey
}

export function JourneyPackageCard({ journey }: Props) {
  const locale = useLocale()
  const t = useTranslations('JourneyCard')

  return (
    <div className='border-faded-white rounded-2xl border bg-white'>
      <div className='bg-bright-grey relative aspect-video overflow-hidden rounded-t-xl'>
        <img
          className='size-full object-cover'
          src={getFullMediaUrl(journey.photos[0])}
          alt={journey.title}
          loading='lazy'
        />
        <div className='shadow-main-small bg-dark-jade absolute bottom-4 left-2/4 flex -translate-x-2/4 items-center gap-1 rounded-full px-4 py-2 text-white'>
          <Icons.Clock className='size-5' />
          <span className='text-base leading-5 font-medium'>
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
      <div className='flex flex-col gap-4 p-6'>
        <span className='text-lg leading-6 font-bold'>{journey.title}</span>
        <span className='text-sm leading-4.5'>{journey.about}</span>
        <div className='bg-bright-grey grid grid-cols-2 gap-4 rounded-lg p-4'>
          {journey.inclusions.map((include, index) => {
            return (
              <div key={index} className='flex items-center gap-2'>
                <Icons.Check className='text-dark-jade size-5' />
                <span className='flex-1 text-sm leading-4.5'>{include}</span>
              </div>
            )
          })}
        </div>
        <hr className='border-bright-grey border-t' />
        <div className='flex items-center justify-between gap-4'>
          {journey.specialPrice > 0 ? (
            <div className='flex flex-col'>
              <span className='text-nevada text-xs leading-4 line-through'>
                {formatPrice(locale, journey.retailPrice)}
              </span>
              <span className='text-cayenne-red text-lg leading-6 font-bold'>
                {formatPrice(locale, journey.specialPrice)}
              </span>
              <span className='text-nevada text-sm leading-4.5'>
                {t('per-person')}
              </span>
            </div>
          ) : (
            <div className='flex flex-col'>
              <span className='text-lg leading-6 font-bold'>
                {formatPrice(locale, journey.retailPrice)}
              </span>
              <span className='text-nevada text-sm leading-4.5'>
                {t('per-person')}
              </span>
            </div>
          )}
          <ButtonLink href={`/journey/${journey.slug}`}>
            {t('see-itinerary')}
          </ButtonLink>
        </div>
      </div>
    </div>
  )
}
