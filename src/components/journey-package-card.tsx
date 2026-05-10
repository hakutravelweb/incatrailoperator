import { useLocale, useTranslations } from 'next-intl'
import { Icons } from '@/icons/icon'
import { formatPrice, getFullMediaUrl } from '@/lib/utils'
import { Link } from '@/i18n/routing'
import { Journey } from '@/interfaces/journey'

interface Props {
  journey: Journey
}

export function JourneyPackageCard({ journey }: Props) {
  const locale = useLocale()
  const t = useTranslations('JourneyCard')

  return (
    <div className='border-anti-flash-white shadow-deep rounded-xl border-2 bg-white'>
      <div className='bg-anti-flash-white relative aspect-video overflow-hidden rounded-t-xl'>
        <img
          className='size-full object-cover'
          src={getFullMediaUrl(journey.photos[0])}
          alt={journey.title}
          loading='lazy'
        />
        <div className='absolute bottom-4 left-2/4 z-1 flex -translate-x-2/4 items-center gap-1 rounded-full bg-white px-4 py-2'>
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
        <strong className='text-lg leading-6'>{journey.title}</strong>
        <span className='text-dark-charcoal text-sm leading-4.5'>
          {journey.about}
        </span>
        <div className='bg-anti-flash-white grid grid-cols-2 gap-4 rounded-lg p-4'>
          {journey.inclusions.map((include, index) => {
            return (
              <div key={index} className='flex items-center gap-2'>
                <Icons.Check className='text-inferno size-5' />
                <span className='text-dark-charcoal flex-1 text-sm leading-4.5'>
                  {include}
                </span>
              </div>
            )
          })}
        </div>
        <hr className='border-chinese-white border-t' />
        <div className='flex items-center justify-between gap-4'>
          {journey.specialPrice > 0 ? (
            <div className='flex flex-col gap-px'>
              <span className='text-dav-ys-grey text-sm leading-4.5 line-through'>
                {formatPrice(locale, journey.retailPrice)}
              </span>
              <span className='text-dark-charcoal text-lg leading-6 font-bold'>
                {formatPrice(locale, journey.specialPrice)}
              </span>
              <span className='text-cinnabar text-sm leading-4.5'>
                {t('per-person')}
              </span>
            </div>
          ) : (
            <div className='flex flex-col gap-px'>
              <span className='text-dark-charcoal text-lg leading-6 font-bold'>
                {formatPrice(locale, journey.retailPrice)}
              </span>
              <span className='text-cinnabar text-sm leading-4.5'>
                {t('per-person')}
              </span>
            </div>
          )}
          <Link
            href={`/journey/${journey.slug}`}
            className='hover:bg-outrageous-orange active:bg-cinnabar bg-inferno rounded-full px-4 py-3 text-sm leading-4.5 font-bold text-white transition-colors duration-100 active:text-white/50'
          >
            {t('see-itinerary')}
          </Link>
        </div>
      </div>
    </div>
  )
}
